import React from 'react';
import { principles } from '../../data/company';
import ScrollAnimation, { ScrollStagger, LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 13: PRINCIPLES
// ─────────────────────────────────────────────────────────────────
export const Principles: React.FC = () => (
  <section id="principles">
    <div className="section landing-principles-section">
      <ScrollAnimation>
        <span className="eyebrow">What we believe</span>
      </ScrollAnimation>
      <LineReveal
        as="h2"
        className="display landing-section-h2 landing-principles-title"
        text="Four commitments we don't negotiate"
      />
    </div>
    <ScrollStagger className="princ-grid" step={110}>
      {principles.map((p) => (
        <div key={p.n} className="card princ-card hover-lift">
          <div className="princ-num">{p.n}</div>
          <h3 className="princ-h">{p.h}</h3>
          <p className="princ-p">{p.p}</p>
        </div>
      ))}
    </ScrollStagger>
  </section>
);

export default Principles;
