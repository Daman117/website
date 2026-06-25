import React from 'react';
import { useNavigate } from 'react-router-dom';
import { facts } from '../data/company';
import { founder, standards, techStack } from '../data/v2';
import Icon from './Icon';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="engram-page">

      {/* ── BACK ── */}
      <div style={{ paddingTop: 100, paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
        <button className="product-back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="engram-hero engram-container">
        <div className="engram-hero-badge">
          <span style={{ color: 'var(--primary)', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>ABOUT ENSAR SOLUTIONS · ENX DIVISION</span>
        </div>
        <h1 className="engram-hero-h1">
          Built because it<br />
          <span style={{ color: 'var(--primary)' }}>needed to exist.</span>
        </h1>
        <p className="engram-hero-sub">
          enX is a division of enSAR Solutions Inc. The industrial intelligence work grew from a real frustration: a practicing I&C engineer who couldn't find the answer he needed fast enough when it mattered.
        </p>
        <p className="engram-hero-body">
          The existing tools required data migration, cloud connectivity, vendor relationships, and IT projects. They produced dashboards nobody used and answers engineers didn't trust. So the software was built from scratch — grounded in how plant engineers actually think, how engineering documents are actually structured, and what an engineer needs when something goes wrong at 2AM.
        </p>
      </section>

      {/* ── FOUNDER ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Founder</span>
        <h2 className="engram-section-h2">The Engineer Behind enX</h2>

        <div className="engram-two-col" style={{ alignItems: 'start' }}>
          {/* Left — founder card */}
          <div className="engram-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="trust-founder-head">
              <div className="trust-avatar" aria-hidden="true">JY</div>
              <div>
                <h3 className="trust-founder-name">{founder.name}</h3>
                <p className="trust-founder-role">{founder.role}</p>
                <p className="trust-founder-bg">{founder.background}</p>
              </div>
            </div>
            <blockquote className="trust-quote">{founder.bio}</blockquote>
            <blockquote className="quote" style={{ fontSize: 14, marginTop: 0 }}>
              "Grounded in how plant engineers actually think, how engineering documents are actually structured, and what an engineer needs when something goes wrong at 2AM."
            </blockquote>
            <p className="attr" style={{ marginTop: 0 }}>Dr. Jagan Mohan Reddy Yeturu · Founder, enSAR Solutions Inc.</p>
            <div className="trust-facts">
              {founder.facts.map((f) => (
                <div key={f.k} className="trust-fact">
                  <span className="trust-fact-k">{f.k}</span>
                  <span className="trust-fact-v">{f.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — company facts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {facts.map((f) => (
              <div key={f.k} className="fact-row">
                <span className="fact-key">{f.k}</span>
                <span className="fact-val">{f.v}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: '18px 20px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <p style={{ fontSize: 10, color: 'var(--t5)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10 }}>
                enSAR Solutions also serves
              </p>
              <p style={{ fontSize: 13, color: 'var(--t4)', lineHeight: 1.8 }}>
                Digital transformation · Cloud native solutions · Software engineering · Cybersecurity · Business applications
              </p>
              <a
                href="https://ensarsolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 10, fontSize: 12, color: 'var(--primary)', display: 'inline-block' }}
              >
                ensarsolutions.com ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STANDARDS + TECH ── */}
      <section className="engram-section engram-container">
        <div className="engram-two-col" style={{ alignItems: 'start' }}>

          {/* Standards */}
          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 14, display: 'block' }}>Engineering Standards</span>
            <h3 className="engram-card-title" style={{ marginBottom: 18 }}>Built on Industrial Standards</h3>
            <div className="trust-std-list">
              {standards.map((s) => (
                <div key={s.code} className="trust-std">
                  <span className="trust-std-code mono">{s.code}</span>
                  <span className="trust-std-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 14, display: 'block' }}>Technology Stack</span>
            <h3 className="engram-card-title" style={{ marginBottom: 18 }}>Built for the Security Perimeter</h3>
            <div className="trust-tech-row">
              {techStack.map((t) => (
                <span key={t.name} className="trust-tech">
                  <Icon name={t.icon} size={15} strokeWidth={1.8} />{t.name}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: '16px 18px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.7 }}>
                Every capability runs inside your network. No cloud dependency, no data egress, no vendor inside your security perimeter. Air-gap ready where required.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
