import React, { useState, useEffect, useRef } from 'react';
import { CircleCheck, X, ChevronDown, Loader2 } from 'lucide-react';
import { setLenisModalOpen } from '../hooks/useLenis';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ContactModalProps {
  open: boolean;
  source?: string;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'aol.com', 'live.com', 'msn.com', 'protonmail.com', 'mail.com',
  'gmx.com', 'yandex.com', 'zoho.com', 'rediffmail.com', 'me.com',
]);

const PERSONAL_EMAIL_MESSAGE = 'Please use your company email address, not a personal one.';
const EMAIL_FORMAT_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isPersonalEmail = (email: string) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && PERSONAL_EMAIL_DOMAINS.has(domain);
};

const INTEREST_OPTIONS = [
  { value: 'demo', label: 'Request Demo' },
  { value: 'pilot', label: '90-Day Pilot Program' },
  { value: 'enview', label: 'enVIEW — SCADA' },
  { value: 'engram', label: 'enGRAM — Plant Knowledge' },
  { value: 'enstudio', label: 'enSTUDIO — Drawing Intelligence' },
  { value: 'enable', label: 'enABLE — Structural Understanding' },
  { value: 'engenie', label: 'enGENIE — Instrument Engineering' },
  { value: 'entie', label: 'enTIE — Connected Intelligence' },
  { value: 'other', label: 'General Inquiry' },
];

/** Custom dropdown styled to match the app (native <select> option lists can't be themed) */
const CustomSelect: React.FC<{
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}> = ({ id, value, onChange, placeholder, ariaInvalid, ariaDescribedBy }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = INTEREST_OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="cm-select-wrap">
      <button
        id={id}
        type="button"
        className="cm-input cm-select-trigger cm-select-trigger-flex"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
      >
        <span className={selected ? 'cm-select-value active' : 'cm-select-value'}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} className={open ? 'cm-select-icon open' : 'cm-select-icon'} />
      </button>
      {open && (
        <div className="cm-select-menu" role="listbox">
          {INTEREST_OPTIONS.map((o) => (
            <button
              type="button"
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`cm-select-opt${o.value === value ? ' active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ContactModal: React.FC<ContactModalProps> = ({ open, source, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState('');
  const [interestError, setInterestError] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const emailValidationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  // Reset the form each time the modal opens — render-phase adjustment
  // instead of an effect (react.dev: "You might not need an Effect")
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSubmitted(false);
      setError(false);
      setLoading(false);
      setInterestError(false);
      setEmailError('');
      setEmailValidating(false);
      setEmailValid(false);
      if (emailValidationTimer.current) clearTimeout(emailValidationTimer.current);
      if (source === 'Request a Pilot') setInterest('pilot');
      else if (source === 'Waitlist') setInterest('enable');
      else setInterest('');
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      setLenisModalOpen(true);
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      setLenisModalOpen(false);
      document.body.style.overflow = '';
    }
    return () => {
      setLenisModalOpen(false);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Server-side check (MX record + domain existence) — debounced 800ms after typing stops
  const checkEmailOnServer = async (value: string) => {
    setEmailValidating(true);
    try {
      const res = await fetch(`${API_URL}/api/validate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      });
      const body = await res.json();
      if (body.valid) {
        setEmailError('');
        setEmailValid(true);
      } else {
        setEmailError(body.error || PERSONAL_EMAIL_MESSAGE);
        setEmailValid(false);
      }
    } catch {
      // Validation service unreachable — don't block the user, final check still runs on submit
      setEmailValid(true);
    } finally {
      setEmailValidating(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmailValid(false);
    if (emailValidationTimer.current) clearTimeout(emailValidationTimer.current);

    // Instant local checks: format + known personal domains
    if (!value.trim()) { setEmailError(''); return; }
    if (!EMAIL_FORMAT_RE.test(value)) { setEmailError('Please enter a valid email format.'); return; }
    if (isPersonalEmail(value)) { setEmailError(PERSONAL_EMAIL_MESSAGE); return; }

    setEmailError('');
    emailValidationTimer.current = setTimeout(() => checkEmailOnServer(value), 800);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!interest) { setInterestError(true); return; }
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      company: String(data.get('company') || ''),
      interest: String(data.get('interest') || ''),
      message: String(data.get('message') || ''),
      // Honeypot — hidden from humans; bots that fill it are silently dropped
      website: String(data.get('website') || ''),
    };

    if (emailValidating) return; // wait for the in-flight debounced check
    if (emailError || isPersonalEmail(payload.email)) {
      setEmailError(emailError || PERSONAL_EMAIL_MESSAGE);
      return;
    }
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      } else if (res.status === 422) {
        const body = await res.json().catch(() => null);
        const rawMsg = body?.detail?.[0]?.msg as string | undefined;
        setEmailError(rawMsg?.replace(/^Value error,\s*/, '') || PERSONAL_EMAIL_MESSAGE);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    /* Overlay — handles backdrop + click-outside. No flex here so overflow-y scroll works */
    <div
      id="contact-modal"
      className="contact-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Full-width centering wrapper — block element so it naturally fills width */}
      <div
        className="contact-modal-wrapper"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          ref={dialogRef}
          className="contact-modal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <button
            onClick={onClose}
            className="contact-modal-close"
            aria-label="Close"
          >
            <X size={17} strokeWidth={2} />
          </button>

          <div className="contact-modal-body">
            {submitted ? (
              <div className="contact-modal-success">
                <div className="contact-modal-success-icon">
                  <CircleCheck size={52} strokeWidth={1.6} />
                </div>
                <h4 className="contact-modal-success-title">Thank You!</h4>
                <p className="contact-modal-success-text">Check your inbox for a confirmation email. We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 id="contact-modal-title" className="contact-modal-title">
                  Get in Touch
                </h3>
                <p className="contact-modal-desc">
                  Request a demo, pilot program, or speak with our team about your plant intelligence needs.
                </p>

                <form onSubmit={handleSubmit} aria-describedby={error ? 'form-error' : undefined}>
                  {/* Honeypot — invisible to humans, bots fill it and get dropped server-side */}
                  <input type="text" name="website" className="cm-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <div className="cm-field">
                    <label className="cm-label" htmlFor="cm-name">Name *</label>
                    <input id="cm-name" type="text" name="name" required className="cm-input" placeholder="Your name" />
                  </div>

                  <div className="cm-field">
                    <label className="cm-label" htmlFor="cm-email">Work Email *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="cm-email"
                        type="email"
                        name="email"
                        required
                        className="cm-input"
                        placeholder="your@company.com"
                        style={{ paddingRight: 36 }}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? 'cm-email-error' : undefined}
                        onChange={(e) => handleEmailChange(e.target.value)}
                      />
                      {emailValidating && (
                        <Loader2
                          size={16}
                          className="cm-spin"
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                        />
                      )}
                      {!emailValidating && emailValid && (
                        <CircleCheck
                          size={16}
                          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#10B981' }}
                        />
                      )}
                    </div>
                    {emailError && (
                      <p id="cm-email-error" className="contact-modal-error-msg">{emailError}</p>
                    )}
                  </div>

                  <div className="cm-field">
                    <label className="cm-label" htmlFor="cm-company">Company *</label>
                    <input id="cm-company" type="text" name="company" required className="cm-input" placeholder="Your company name" />
                  </div>

                  <div className="cm-field">
                    <label className="cm-label" htmlFor="cm-interest">Interest *</label>
                    <input type="hidden" name="interest" value={interest} />
                    <CustomSelect
                      id="cm-interest"
                      value={interest}
                      placeholder="Select one..."
                      onChange={(v) => { setInterest(v); setInterestError(false); }}
                      ariaInvalid={interestError}
                      ariaDescribedBy={interestError ? 'cm-interest-error' : undefined}
                    />
                    {interestError && (
                      <p id="cm-interest-error" className="contact-modal-error-msg">Please select an option.</p>
                    )}
                  </div>

                  <div className="cm-field contact-field-last">
                    <label className="cm-label" htmlFor="cm-message">Message *</label>
                    <textarea
                      id="cm-message"
                      name="message"
                      required
                      rows={4}
                      className="cm-input contact-textarea"
                      placeholder="Tell us about your plant and what you're looking for..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="cta-solid button-text btn-primary contact-submit"
                    disabled={loading}
                  >
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>

                  <p className="contact-footer-note">
                    We typically respond within 24 hours
                  </p>

                  {error && (
                    <div id="form-error" className="contact-error-box">
                      Unable to send — please email us at{' '}
                      <a href="mailto:contact@ensarsolutions.com" className="contact-email-link">contact@ensarsolutions.com</a>
                    </div>
                  )}

                  <p className="contact-privacy-note">
                    Your details are only used to respond to your inquiry. We never share your data.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
