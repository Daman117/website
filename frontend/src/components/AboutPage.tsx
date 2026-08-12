import React from 'react';
import { facts } from '../data/company';
import { founder, standards, techStack } from '../data/v2';
import Icon from './Icon';
import { LineReveal } from './ScrollAnimation';
import ScrollAnimation from './ScrollAnimation';

const AboutPage: React.FC = () => {

  return (
    <main className="engram-page">

      {/* ── HERO ── dark-themed full-width hero, same visual language as product pages */}
      <div className="about-hero-shell">
        <div className="about-hero-grad" />

        <section className="engram-hero engram-container">
          <div className="engram-hero-badge about-hero-badge-wrap">
            <span className="badge-text about-hero-badge-text">ABOUT ENSAR SOLUTIONS · ENXCO DIVISION</span>
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
            enxco is a division of enSAR Solutions Inc. The industrial intelligence work grew from a real frustration: a practicing I&amp;C engineer who couldn't find the answer he needed fast enough when it mattered.
          </p>
          <p className="engram-hero-body hero-fade-up hero-delay-1100">
            The existing tools required data migration, cloud connectivity, vendor relationships, and IT projects. They produced dashboards nobody used and answers engineers didn't trust. So the software was built from scratch, inside the plant's own network, for the people who actually have to answer the question.
          </p>
        </section>
      </div>

      {/* ── FOUNDER ── */}
      <section className="engram-section engram-container">
        <ScrollAnimation direction="up" delay={0}>
          <span className="eyebrow">Founder</span>
          <LineReveal as="h2" className="engram-section-h2" text="The Engineer Behind enxco" />
        </ScrollAnimation>

        <div className="engram-two-col about-two-col">
          {/* Left — founder card */}
          <ScrollAnimation direction="left" delay={100}>
            <div className="card engram-card about-founder-card">
              <div className="trust-founder-head">
                <div className="trust-avatar" aria-hidden="true">JY</div>
                <div>
                  <h3 className="trust-founder-name">{founder.name}</h3>
                  <p className="trust-founder-role">{founder.role}</p>
                  <p className="trust-founder-bg">{founder.background}</p>
                </div>
              </div>
              {/* One quote only — the hero paragraph above already carries the
                  "how engineers actually think… 2AM" line; repeating it here
                  read as a copy-paste, not as emphasis. */}
              <blockquote className="surface-glass quote about-quote">{founder.bio}</blockquote>
              <p className="attr about-attr">Dr. Jagan Mohan Reddy Yeturu · Founder, enSAR Solutions Inc.</p>
              <div className="trust-facts">
                {founder.facts.map((f) => (
                  <div key={f.k} className="trust-fact">
                    <span className="trust-fact-k">{f.k}</span>
                    <span className="label-text trust-fact-v">{f.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Right — company facts */}
          <ScrollAnimation direction="right" delay={180}>
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
          </ScrollAnimation>
        </div>
      </section>

      {/* ── STANDARDS + TECH ── */}
      <section className="engram-section engram-container">
        <div className="engram-two-col about-two-col">

          {/* Standards */}
          <ScrollAnimation direction="up" delay={0}>
            <div className="card engram-card">
              <span className="eyebrow about-eyebrow">Engineering Standards</span>
              <LineReveal as="h3" className="engram-card-title about-card-title" text="Built on Industrial Standards" />
              <div className="u-flex-column u-gap-8 trust-std-list">
                {standards.map((s) => (
                  <div key={s.code} className="trust-std">
                    <span className="trust-std-code mono">{s.code}</span>
                    <span className="trust-std-desc">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>

          {/* Tech */}
          <ScrollAnimation direction="up" delay={120}>
            <div className="card engram-card">
              <span className="eyebrow about-eyebrow">Technology Stack</span>
              <LineReveal as="h3" className="engram-card-title about-card-title" text="Built for the Security Perimeter" />
              <div className="u-flex u-flex-wrap u-gap-8 trust-tech-row">
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
          </ScrollAnimation>
        </div>
      </section>

    </main>
  );
};

export default AboutPage;
