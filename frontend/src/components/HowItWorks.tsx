import React from 'react';
import { workSteps } from '../data/v2';

const HowItWorks: React.FC = () => (
  <section id="how">
    <div className="section" data-reveal="">
      <span className="eyebrow">The workflow</span>
      <h2 className="display section-title">How Industrial Intelligence Is Built</h2>
      <p className="section-lead">
        Four steps from the documents you already have to live, defensible plant intelligence — all inside your network.
      </p>

      <div className="how-grid">
        {workSteps.map((s, i) => (
          <div key={s.n} className="how-step" style={{ '--accent': s.color } as React.CSSProperties}>
            <div className="how-step-top">
              <span className="how-num">{s.n}</span>
              {i < workSteps.length - 1 && <span className="how-connector" aria-hidden="true" />}
            </div>
            <span className="how-actor" style={{ color: s.color }}>{s.actor}</span>
            <h3 className="how-title">{s.title}</h3>
            <div className="how-io">
              <div className="how-io-label">{s.inLabel}</div>
              <div className="how-tags">
                {s.inputs.map((t) => <span key={t} className="how-tag">{t}</span>)}
              </div>
            </div>
            <div className="how-io">
              <div className="how-io-label" style={{ color: s.color }}>{s.outLabel}</div>
              <div className="how-tags">
                {s.outputs.map((t) => (
                  <span key={t} className="how-tag how-tag-out" style={{ borderColor: `${s.color}55`, color: s.color }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
