import React from 'react';
import { principles } from '../data/company';

const Principles: React.FC = () => (
  <section id="principles">
    <div className="section" data-reveal="" style={{ paddingBottom: '8px' }}>
      <span className="eyebrow">What we believe</span>
      <h2 className="display" style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 0 }}>
        Four commitments we don't negotiate
      </h2>
    </div>
    <div className="princ-grid">
      {principles.map((p) => (
        <div key={p.n} className="princ-card">
          <div className="princ-num">{p.n}</div>
          <h3 className="princ-h">{p.h}</h3>
          <p className="princ-p">{p.p}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Principles;
