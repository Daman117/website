import React from 'react';
import { securityPrinciples } from '../../data/v2';
import Icon from '../Icon';
import ScrollAnimation, { ScrollStagger, LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 10: SECURITY
// ─────────────────────────────────────────────────────────────────
const Security: React.FC = () => (
  <section id="security">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Security &amp; deployment</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Security by Design" />
      <LineReveal
        as="p"
        className="section-lead"
        text="enxplant is built to run where the network never leaves the fence line. No cloud, no external calls, no vendor inside your perimeter."
      />

      <ScrollStagger className="grid-3-compact sec-grid" step={90}>
        {securityPrinciples.map((p) => (
          <div key={p.title} className="sec-card hover-lift">
            <img className="sec-img" src={p.img} alt={p.title} loading="lazy" decoding="async" />
            <div className="sec-overlay" />
            <div className="sec-icon"><Icon name={p.icon} size={20} strokeWidth={1.8} /></div>
            <div className="sec-body">
              <h3 className="sec-title">{p.title}</h3>
              <p className="body-text-compact sec-desc">{p.desc}</p>
            </div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default Security;
