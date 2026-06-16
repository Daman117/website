import React, { useState, useEffect } from 'react';

interface ContactModalProps {
  open: boolean;
  source?: string;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, source, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState('');

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError(false);
      setLoading(false);
      if (source === 'Request a Pilot') setInterest('pilot');
      else if (source === 'Waitlist') setInterest('enable');
      else setInterest('');
    }
  }, [open, source]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--t1)',
    fontFamily: 'inherit',
    fontSize: '14px',
    transition: 'border-color .2s, box-shadow .2s',
    outline: 'none',
    boxSizing: 'border-box',
  };

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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border2)',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(37,99,235,0.1)',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--t3)', fontSize: '18px', cursor: 'pointer',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', lineHeight: '1', transition: 'all .2s',
            }}
            aria-label="Close"
          >
            &times;
          </button>

          <div style={{ padding: '40px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--primary)' }}>✓</div>
                <h4 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>Message Sent!</h4>
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
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--t2)', marginBottom: '8px', fontWeight: 600, letterSpacing: '.3px' }}>Name *</label>
                    <input type="text" name="name" required style={inputStyle} placeholder="Your name"
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--modal-input-border, rgba(255,255,255,0.08))'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--t2)', marginBottom: '8px', fontWeight: 600, letterSpacing: '.3px' }}>Email *</label>
                    <input type="email" name="email" required style={inputStyle} placeholder="your@company.com"
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--modal-input-border, rgba(255,255,255,0.08))'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--t2)', marginBottom: '8px', fontWeight: 600, letterSpacing: '.3px' }}>Company</label>
                    <input type="text" name="company" style={inputStyle} placeholder="Your company name"
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--modal-input-border, rgba(255,255,255,0.08))'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--t2)', marginBottom: '8px', fontWeight: 600, letterSpacing: '.3px' }}>Interest *</label>
                    <select
                      name="interest"
                      required
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--modal-input-border, rgba(255,255,255,0.08))'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="">Select one...</option>
                      <option value="demo">Request Demo</option>
                      <option value="pilot">90-Day Pilot Program</option>
                      <option value="enview">enVIEW - SCADA</option>
                      <option value="engram">enGRAM - Plant Knowledge</option>
                      <option value="enstudio">enSTUDIO - Drawing Intelligence</option>
                      <option value="enable">enABLE - Structural Understanding</option>
                      <option value="engenie">enGENIE - Instrument Engineering</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--t2)', marginBottom: '8px', fontWeight: 600, letterSpacing: '.3px' }}>Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="Tell us about your plant and what you're looking for..."
                      onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--modal-input-border, rgba(255,255,255,0.08))'; e.target.style.boxShadow = 'none'; }}
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
                    By submitting you agree to our Privacy Policy. We never share your data.
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
