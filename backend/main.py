"""
enX contact-form backend.

A small FastAPI service that receives contact-form submissions from the
website and emails them to the team via SMTP.

Run:
    cd backend
    python -m venv .venv && .venv\\Scripts\\activate   (Windows)
    pip install -r requirements.txt
    cp .env.example .env   # then fill in your SMTP credentials
    uvicorn main:app --reload --port 8000
"""

import os
import smtplib
import ssl
from collections import defaultdict, deque
from email.message import EmailMessage
from email.utils import formataddr
from time import monotonic

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

load_dotenv()

# ── Config (from environment / .env) ───────────────────────────────────────
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
# Where the enquiry emails are delivered:
CONTACT_TO = os.getenv("CONTACT_TO", "contact@ensarsolutions.com")
# Comma-separated list of allowed browser origins (the website URLs):
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:4173",
    ).split(",")
    if o.strip()
]

INTEREST_LABELS = {
    "demo": "Request Demo",
    "pilot": "90-Day Pilot Program",
    "enview": "enVIEW — SCADA",
    "engram": "enGRAM — Plant Knowledge",
    "enstudio": "enSTUDIO — Drawing Intelligence",
    "enable": "enABLE — Structural Understanding",
    "engenie": "enGENIE — Instrument Engineering",
    "entie": "enTIE — Connected Intelligence",
    "other": "General Inquiry",
}

app = FastAPI(title="enX Contact API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


# ── Simple in-memory rate limit (per client IP, sliding window) ─────────────
RATE_LIMIT = int(os.getenv("RATE_LIMIT", "5"))          # submissions…
RATE_WINDOW = float(os.getenv("RATE_WINDOW", "3600"))   # …per this many seconds
_recent_submissions: dict[str, deque] = defaultdict(deque)


def _rate_limited(ip: str) -> bool:
    now = monotonic()
    q = _recent_submissions[ip]
    while q and now - q[0] > RATE_WINDOW:
        q.popleft()
    if len(q) >= RATE_LIMIT:
        return True
    q.append(now)
    return False


# ── Request model ───────────────────────────────────────────────────────────
class ContactForm(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    company: str = Field(min_length=1, max_length=200)
    interest: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=1, max_length=5000)
    # Honeypot — hidden field on the website form; humans never fill it
    website: str = Field(default="", max_length=200)


@app.get("/health")
def health():
    return {"status": "ok", "smtp_configured": bool(SMTP_USER and SMTP_PASSWORD)}


@app.post("/api/contact")
def submit_contact(form: ContactForm, request: Request):
    # Honeypot filled → almost certainly a bot. Pretend success, send nothing.
    if form.website.strip():
        return {"ok": True, "message": "Your message has been sent."}

    client_ip = request.client.host if request.client else "unknown"
    if _rate_limited(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too many submissions — please try again later.",
        )

    if not SMTP_USER or not SMTP_PASSWORD:
        raise HTTPException(status_code=500, detail="Email service is not configured.")

    interest_label = INTEREST_LABELS.get(form.interest, form.interest)

    msg = EmailMessage()
    msg["Subject"] = f"enX enquiry — {interest_label} — {form.name}"
    msg["From"] = formataddr(("enX Website", SMTP_FROM))
    msg["To"] = CONTACT_TO
    msg["Reply-To"] = form.email
    msg.set_content(
        "New contact form submission from the enX website:\n\n"
        f"Name:     {form.name}\n"
        f"Email:    {form.email}\n"
        f"Company:  {form.company}\n"
        f"Interest: {interest_label}\n\n"
        "Message:\n"
        f"{form.message}\n"
    )

    try:
        context = ssl.create_default_context()
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
    except Exception as exc:  # noqa: BLE001 - surface a clean error to the client
        raise HTTPException(status_code=502, detail=f"Failed to send email: {exc}")

    return {"ok": True, "message": "Your message has been sent."}
