import React from 'react';
import { caseStudies } from '../data/v2';

const CaseStudies: React.FC = () => (
  <section id="cases">
    <div className="section" data-reveal="">
      <span className="eyebrow">Proof in practice</span>
      <h2 className="display section-title">Case Studies &amp; Use Cases</h2>
      <p className="section-lead">
        Drawn from internal pilots and real engineering scenarios — structured as problem, solution and result.
      </p>

      <div className="case-grid">
        {caseStudies.map((c) => (
          <div key={c.id} className="case-card" style={{ '--accent': c.color } as React.CSSProperties}>
            <span className="case-tag" style={{ color: c.color, borderColor: `${c.color}55`, background: `${c.color}14` }}>{c.tag}</span>
            <h3 className="case-title">{c.title}</h3>
            <div className="case-step">
              <span className="case-step-label">Problem</span>
              <p className="case-step-text">{c.problem}</p>
            </div>
            <div className="case-step">
              <span className="case-step-label" style={{ color: c.color }}>Solution</span>
              <p className="case-step-text">{c.solution}</p>
            </div>
            <div className="case-step case-result">
              <span className="case-step-label" style={{ color: c.color }}>Result</span>
              <p className="case-step-text">{c.result}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CaseStudies;
