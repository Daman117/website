import React from 'react';
import { caseStudies } from '../../data/v2';
import ScrollAnimation, { ScrollStagger, LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 11: CASE STUDIES
// ─────────────────────────────────────────────────────────────────
const CaseStudySection: React.FC = () => (
  <section id="cases">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Proof in practice</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Case Studies & Use Cases" />
      <LineReveal
        as="p"
        className="section-lead"
        text="Drawn from internal pilots and real engineering scenarios — structured as problem, solution and result."
      />

      <ScrollStagger className="grid-3 case-grid" step={130}>
        {caseStudies.map((c) => (
          <div
            key={c.id}
            className="card case-card hover-lift"
            style={{
              '--accent': c.color,
              '--accent-a14': `${c.color}14`,
              '--accent-a55': `${c.color}55`,
            } as React.CSSProperties}
          >
            <div className="u-flex-column u-gap-10 case-top">
              <span className="case-tag">
                {c.tag}
              </span>
              <h3 className="case-title">{c.title}</h3>
            </div>
            <div className="u-flex-column u-gap-12 case-bottom">
              <div className="case-step">
                <span className="tag-text case-step-label">Problem</span>
                <p className="case-step-text">{c.problem}</p>
              </div>
              <div className="case-step">
                <span className="tag-text case-step-label case-step-label-accent">Solution</span>
                <p className="case-step-text">{c.solution}</p>
              </div>
            </div>
            <div className="case-result">
              <span className="tag-text case-step-label case-step-label-accent">Result</span>
              <p className="case-step-text">{c.result}</p>
            </div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

export default CaseStudySection;
