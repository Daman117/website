import React, { useState, useEffect, useRef } from 'react';
import { CircleCheck, X, ChevronDown } from 'lucide-react';
import { setLenisModalOpen } from '../hooks/useLenis';

interface ContactModalProps {
  open: boolean;
  source?: string;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => {
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
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        className="cm-input cm-select-trigger"
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span style={{ color: selected ? 'var(--t1)' : 'var(--t4)' }}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} style={{ color: 'var(--t4)', marginRight: '2px', flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!interest) { setInterestError(true); return; }
    setLoading(true);
    setError(false);
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

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflowY: 'auto',
        background: 'rgba(3,7,18,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Full-width centering wrapper — block element so it naturally fills width */}
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div style={{
          margin: 'auto',
          background: 'linear-gradient(165deg,#FCFDFF 0%,#E9EFF7 100%)',
          border: '1px solid rgba(15,23,42,0.07)',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(11,37,69,0.30), 0 12px 36px rgba(11,37,69,0.14)',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '18px', right: '18px',
              background: 'rgba(15,23,42,0.04)', border: '1px solid var(--border)',
              borderRadius: '50%', color: 'var(--t3)', cursor: 'pointer',
              width: '34px', height: '34px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', lineHeight: '1', transition: 'all .2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(15,23,42,0.09)'; e.currentTarget.style.color = 'var(--t1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(15,23,42,0.04)'; e.currentTarget.style.color = 'var(--t3)'; }}
            aria-label="Close"
          >
            <X size={17} strokeWidth={2} />
          </button>

          <div style={{ padding: '40px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px', color: 'var(--primary)' }}>
                  <CircleCheck size={52} strokeWidth={1.6} />
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '22px', color: 'var(--t1)', marginBottom: '8px', fontWeight: 700 }}>Message Sent!</h4>
                <p style={{ fontSize: '14px', color: 'var(--t3)' }}>We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '30px', fontWeight: 700, color: 'var(--t1)', marginBottom: '10px', letterSpacing: '-1px' }}>
                  Get in Touch
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--t3)', marginBottom: '32px', lineHeight: '1.6' }}>
                  Request a demo, pilot program, or speak with our team about your plant intelligence needs.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Honeypot — invisible to humans, bots fill it and get dropped server-side */}
                  <input type="text" name="website" className="cm-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <div className="cm-field">
                    <label className="cm-label">Name *</label>
                    <input type="text" name="name" required className="cm-input" placeholder="Your name" />
                  </div>

                  <div className="cm-field">
                    <label className="cm-label">Email *</label>
                    <input type="email" name="email" required className="cm-input" placeholder="your@company.com" />
                  </div>

                  <div className="cm-field">
                    <label className="cm-label">Company *</label>
                    <input type="text" name="company" required className="cm-input" placeholder="Your company name" />
                  </div>

                  <div className="cm-field">
                    <label className="cm-label">Interest *</label>
                    <input type="hidden" name="interest" value={interest} />
                    <CustomSelect
                      value={interest}
                      placeholder="Select one..."
                      onChange={(v) => { setInterest(v); setInterestError(false); }}
                    />
                    {interestError && (
                      <p style={{ fontSize: '12px', color: 'var(--red)', marginTop: '6px' }}>Please select an option.</p>
                    )}
                  </div>

                  <div className="cm-field" style={{ marginBottom: '24px' }}>
                    <label className="cm-label">Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="cm-input"
                      style={{ resize: 'vertical' }}
                      placeholder="Tell us about your plant and what you're looking for..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ width: '100%', padding: '14px 24px', fontSize: '14px' }}
                  >
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>

                  <p style={{ fontSize: '11px', color: 'var(--t5)', marginTop: '14px', textAlign: 'center' }}>
                    We typically respond within 24 hours
                  </p>

                  {error && (
                    <div id="form-error" style={{ display: 'block', fontSize: '12px', color: 'var(--red)', marginTop: '8px', textAlign: 'center' }}>
                      Unable to send — please email us at{' '}
                      <a href="mailto:contact@ensarsolutions.com" style={{ color: 'var(--primary)' }}>contact@ensarsolutions.com</a>
                    </div>
                  )}

                  <p style={{ fontSize: '11px', color: 'var(--t5)', marginTop: '12px', textAlign: 'center' }}>
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
