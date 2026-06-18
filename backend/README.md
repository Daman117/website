# enX Contact Backend (FastAPI + SMTP)

Receives contact-form submissions from the website and emails them to the team.

## Endpoints

| Method | Path           | Purpose                                  |
| ------ | -------------- | ---------------------------------------- |
| GET    | `/health`      | Health check + whether SMTP is configured |
| POST   | `/api/contact` | Submit the contact form (JSON)            |

`POST /api/contact` body:

```json
{
  "name": "Jane Doe",
  "email": "jane@plant.com",
  "company": "Acme Refining",
  "interest": "demo",
  "message": "We'd like a demo of enVIEW."
}
```

## Run locally

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env          # then edit .env with your SMTP details
uvicorn main:app --reload --port 8000
```

The API is now at `http://localhost:8000`. Interactive docs: `http://localhost:8000/docs`.

## SMTP setup (Gmail example)

1. Enable 2-Step Verification on the Google account.
2. Create an **App Password**: <https://myaccount.google.com/apppasswords>.
3. Put it in `.env` as `SMTP_PASSWORD` (use the account address for `SMTP_USER`/`SMTP_FROM`).
4. Set `CONTACT_TO` to wherever enquiries should land.

Other providers: set `SMTP_HOST`/`SMTP_PORT` accordingly (587 = STARTTLS, 465 = SSL).

## Connecting the frontend

The website reads the API base URL from `VITE_API_URL` (defaults to
`http://localhost:8000`). For production, create a `.env` in the `frontend/` folder:

```
VITE_API_URL=https://api.yourdomain.com
```

and add your deployed website origin to `CORS_ORIGINS` in the backend `.env`.
