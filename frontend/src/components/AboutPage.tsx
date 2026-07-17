import React from 'react';
import { useNavigate } from 'react-router-dom';
import { facts } from '../data/company';
import { founder, standards, techStack } from '../data/v2';
import Icon from './Icon';
import { LineReveal } from './ScrollAnimation';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="engram-page">

      {/* ── BACK ── */}
      <div className="about-page-header">
        <button className="product-back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>

      {/* ── HERO ── */}
      <section className="engram-hero engram-container">
        <div className="engram-hero-badge">
          <span className="about-hero-badge-text">ABOUT ENSAR SOLUTIONS · ENXPLANT DIVISION</span>
        </div>
        <h1 className="engram-hero-h1">
          <span className="hero-line-mask">
            <span className="hero-line-inner hero-delay-150">Built because it</span>
          </span>
          <span className="hero-line-mask">
            <span className="hero-line-inner about-hero-h1-accent hero-delay-500">needed to exist.</span>
          </span>
        </h1>
        <p className="engram-hero-sub hero-fade-up hero-delay-900">
          enxplant is a division of enSAR Solutions Inc. The industrial intelligence work grew from a real frustration: a practicing I&C engineer who couldn't find the answer he needed fast enough when it mattered.
        </p>
        <p className="engram-hero-body hero-fade-up hero-delay-1100">
          The existing tools required data migration, cloud connectivity, vendor relationships, and IT projects. They produced dashboards nobody used and answers engineers didn't trust. So the software was built from scratch — grounded in how plant engineers actually think, how engineering documents are actually structured, and what an engineer needs when something goes wrong at 2AM.
        </p>
      </section>

      {/* ── FOUNDER ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Founder</span>
        <LineReveal as="h2" className="engram-section-h2" text="The Engineer Behind enxplant" />

        <div className="engram-two-col about-two-col">
          {/* Left — founder card */}
          <div className="engram-card about-founder-card">
            <div className="trust-founder-head">
              <div className="trust-avatar" aria-hidden="true">JY</div>
              <div>
                <h3 className="trust-founder-name">{founder.name}</h3>
                <p className="trust-founder-role">{founder.role}</p>
                <p className="trust-founder-bg">{founder.background}</p>
              </div>
            </div>
            <blockquote className="trust-quote">{founder.bio}</blockquote>
            <blockquote className="quote about-quote">
              "Grounded in how plant engineers actually think, how engineering documents are actually structured, and what an engineer needs when something goes wrong at 2AM."
            </blockquote>
            <p className="attr about-attr">Dr. Jagan Mohan Reddy Yeturu · Founder, enSAR Solutions Inc.</p>
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
          <div className="about-facts-wrapper">
            {facts.map((f) => (
              <div key={f.k} className="fact-row">
                <span className="fact-key">{f.k}</span>
                <span className="fact-val">{f.v}</span>
              </div>
            ))}
            <div className="about-fact-box">
              <p className="about-fact-box-title eyebrow">
                enSAR Solutions also serves
              </p>
              <p className="about-fact-box-desc text-muted">
                Digital transformation · Cloud native solutions · Software engineering · Cybersecurity · Business applications
              </p>
              <a
                href="https://ensarsolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="about-fact-box-link text-body-sm"
              >
                ensarsolutions.com ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── STANDARDS + TECH ── */}
      <section className="engram-section engram-container">
        <div className="engram-two-col about-two-col">

          {/* Standards */}
          <div className="engram-card">
            <span className="eyebrow about-eyebrow">Engineering Standards</span>
            <LineReveal as="h3" className="engram-card-title about-card-title" text="Built on Industrial Standards" />
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
            <span className="eyebrow about-eyebrow">Technology Stack</span>
            <LineReveal as="h3" className="engram-card-title about-card-title" text="Built for the Security Perimeter" />
            <div className="trust-tech-row">
              {techStack.map((t) => (
                <span key={t.name} className="trust-tech">
                  <Icon name={t.icon} size={15} strokeWidth={1.8} />{t.name}
                </span>
              ))}
            </div>
            <div className="about-tech-box">
              <p className="about-tech-box-desc card-desc">
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
