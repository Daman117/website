"""
enxplant contact-form backend.

A small FastAPI service that receives contact-form submissions from the
website and emails them to the team via SMTP.

Run:
    cd backend
    python -m venv .venv && .venv\\Scripts\\activate   (Windows)
    pip install -r requirements.txt
    cp .env.example .env   # then fill in your SMTP credentials
    uvicorn main:app --reload --port 8000
"""

import html
import os
import re
import smtplib
import ssl
from collections import defaultdict, deque
from email.message import EmailMessage
from email.utils import formataddr
from time import monotonic

import dns.resolver
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, field_validator

load_dotenv()

_mx_resolver = dns.resolver.Resolver()
_mx_resolver.timeout = 3
_mx_resolver.lifetime = 3

# ── Config (from environment / .env) ───────────────────────────────────────
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
# Where the enquiry emails are delivered:
CONTACT_TO = os.getenv("CONTACT_TO", "")
# Logo embedded directly in HTML emails (as an inline attachment, not a linked URL —
# works even before the site is deployed, and clients don't need to fetch anything):
LOGO_PATH = os.path.join(
    os.path.dirname(__file__), "..", "frontend", "public", "logo-mark.png"
)
LOGO_CID = "enxplant-logo"
# Comma-separated list of allowed browser origins (the website URLs):
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:4173",
    ).split(",")
    if o.strip()
]

PERSONAL_EMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
    "aol.com", "live.com", "msn.com", "protonmail.com", "mail.com",
    "gmx.com", "yandex.com", "zoho.com", "rediffmail.com", "me.com",
}

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

app = FastAPI(title="enxplant Contact API", version="1.0.0")

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


def _attach_logo(msg: EmailMessage) -> None:
    if not os.path.isfile(LOGO_PATH):
        return
    with open(LOGO_PATH, "rb") as f:
        html_part = msg.get_payload()[-1]
        html_part.add_related(f.read(), maintype="image", subtype="png", cid=f"<{LOGO_CID}>")


EMAIL_FORMAT_RE = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")


def _company_email_error(email: str) -> str | None:
    """Returns an error message if the email fails validation, else None."""
    email = email.strip()
    if not EMAIL_FORMAT_RE.match(email):
        return "Please enter a valid email format."
    domain = email.rsplit("@", 1)[-1].lower()
    if domain in PERSONAL_EMAIL_DOMAINS:
        return "Please use your company email address, not a personal one."
    try:
        has_mx = bool(_mx_resolver.resolve(domain, "MX"))
    except Exception:
        has_mx = False
    if not has_mx:
        return "That email domain doesn't appear to exist."
    return None


# ── Request model ───────────────────────────────────────────────────────────
class ContactForm(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    company: str = Field(min_length=1, max_length=200)
    interest: str = Field(min_length=1, max_length=80)
    message: str = Field(min_length=1, max_length=5000)
    # Honeypot — hidden field on the website form; humans never fill it
    website: str = Field(default="", max_length=200)

    @field_validator("email")
    @classmethod
    def _validate_company_email(cls, v: str) -> str:
        error = _company_email_error(v)
        if error:
            raise ValueError(error)
        return v


class EmailCheck(BaseModel):
    email: str = Field(min_length=1, max_length=320)


@app.get("/health")
def health():
    return {"status": "ok", "smtp_configured": bool(SMTP_USER and SMTP_PASSWORD)}


@app.post("/api/validate-email")
def validate_email(payload: EmailCheck):
    error = _company_email_error(payload.email)
    if error:
        return {"valid": False, "error": error}
    return {"valid": True}


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

    if not SMTP_USER or not SMTP_PASSWORD or not CONTACT_TO:
        raise HTTPException(status_code=500, detail="Email service is not configured.")

    interest_label = INTEREST_LABELS.get(form.interest, form.interest)

    msg = EmailMessage()
    msg["Subject"] = f"enxplant enquiry — {interest_label}"
    msg["From"] = formataddr(("enxplant Website", SMTP_FROM))
    msg["To"] = CONTACT_TO
    msg["Reply-To"] = form.email
    msg.set_content(
        "New contact form submission from the enxplant website:\n\n"
        f"Name:     {form.name}\n"
        f"Email:    {form.email}\n"
        f"Company:  {form.company}\n"
        f"Interest: {interest_label}\n\n"
        "Message:\n"
        f"{form.message}\n"
    )
    msg.add_alternative(
        _enquiry_html(form.name, form.email, form.company, interest_label, form.message),
        subtype="html",
    )
    _attach_logo(msg)

    ack = EmailMessage()
    ack["Subject"] = "Thanks for reaching out to enxplant"
    ack["From"] = formataddr(("enxplant", SMTP_FROM))
    ack["To"] = form.email
    ack.set_content(
        f"Hi {form.name},\n\n"
        "Thanks for contacting enxplant! We've received your message and our team "
        "will get back to you within 24 hours.\n\n"
        "For your records, here's what you sent us:\n\n"
        f"Interest: {interest_label}\n"
        f"Message:\n{form.message}\n\n"
        "Best regards,\nThe enxplant Team"
    )
    ack.add_alternative(_thank_you_html(form.name, interest_label, form.message), subtype="html")
    _attach_logo(ack)

    try:
        context = ssl.create_default_context()
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
                server.send_message(ack)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
                server.send_message(ack)
    except Exception as exc:  # noqa: BLE001 - surface a clean error to the client
        raise HTTPException(status_code=502, detail=f"Failed to send email: {exc}")

    return {"ok": True, "message": "Your message has been sent."}


def _thank_you_html(name: str, interest_label: str, message: str) -> str:
    name = html.escape(name)
    interest_label = html.escape(interest_label)
    message = html.escape(message)
    return f"""\
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr>
          <td style="background-color:#1F5FE0;padding:28px 40px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
              <td style="padding-right:14px;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" style="width:48px;height:48px;background:#ffffff;border-radius:50%;">
                  <tr><td align="center" valign="middle" style="width:48px;height:48px;">
                    <img src="cid:{LOGO_CID}" alt="enxplant" width="30" height="30" style="display:block;">
                  </td></tr>
                </table>
              </td>
              <td style="vertical-align:middle;">
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Thanks for reaching out</h1>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 16px;font-size:16px;color:#475569;line-height:24px;">Hi {name},</p>
            <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:24px;">
              Thanks for contacting <strong style="color:#1a1c21;">enxplant</strong>. We've received your message
              and our team will get back to you <strong>within 24 hours</strong>.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
              <tr><td style="padding:20px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Interest</p>
                <p style="margin:0 0 16px;font-size:15px;color:#1a1c21;">{interest_label}</p>
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Your message</p>
                <p style="margin:0;font-size:15px;color:#475569;white-space:pre-wrap;">{message}</p>
              </td></tr>
            </table>
            <p style="margin:24px 0 0;font-size:15px;color:#475569;line-height:22px;">
              Best regards,<br><strong style="color:#1a1c21;">The enxplant Team</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;background:#fcfcfd;border-top:1px solid #f1f5f9;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated confirmation — no need to reply.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


def _enquiry_html(name: str, email: str, company: str, interest_label: str, message: str) -> str:
    name = html.escape(name)
    email = html.escape(email)
    company = html.escape(company)
    interest_label = html.escape(interest_label)
    message = html.escape(message)
    return f"""\
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7fa;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr>
          <td style="background-color:#1F5FE0;padding:28px 40px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
              <td style="padding-right:14px;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" style="width:48px;height:48px;background:#ffffff;border-radius:50%;">
                  <tr><td align="center" valign="middle" style="width:48px;height:48px;">
                    <img src="cid:{LOGO_CID}" alt="enxplant" width="30" height="30" style="display:block;">
                  </td></tr>
                </table>
              </td>
              <td style="vertical-align:middle;">
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">New Contact Form Submission</h1>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;font-size:16px;color:#475569;line-height:24px;">
              You have a new enquiry from the <strong style="color:#1a1c21;">enxplant</strong> website.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
              <tr><td style="padding:20px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Name</p>
                <p style="margin:0 0 16px;font-size:15px;color:#1a1c21;">{name}</p>
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Email</p>
                <p style="margin:0 0 16px;font-size:15px;"><a href="mailto:{email}" style="color:#1F5FE0;text-decoration:none;">{email}</a></p>
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Company</p>
                <p style="margin:0 0 16px;font-size:15px;color:#1a1c21;">{company}</p>
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Interest</p>
                <p style="margin:0 0 16px;font-size:15px;color:#1a1c21;">{interest_label}</p>
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#94a3b8;">Message</p>
                <p style="margin:0;font-size:15px;color:#475569;white-space:pre-wrap;">{message}</p>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;background:#fcfcfd;border-top:1px solid #f1f5f9;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Reply directly to this email to respond to {name}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""
