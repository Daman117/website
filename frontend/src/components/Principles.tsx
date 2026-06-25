import React from 'react';
import { principles } from '../data/company';
import ScrollAnimation, { ScrollStagger } from './ScrollAnimation';

const Principles: React.FC = () => (
  <section id="principles">
    <div className="section" style={{ paddingBottom: '8px' }}>
      <ScrollAnimation>
        <span className="eyebrow">What we believe</span>
        <h2 className="display" style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 0 }}>
          Four commitments we don't negotiate
        </h2>
      </ScrollAnimation>
    </div>
    <ScrollStagger className="princ-grid" step={110}>
      {principles.map((p) => (
        <div key={p.n} className="princ-card hover-lift">
          <div className="princ-num">{p.n}</div>
          <h3 className="princ-h">{p.h}</h3>
          <p className="princ-p">{p.p}</p>
        </div>
      ))}
    </ScrollStagger>
  </section>
);

export default Principles;
