import React from 'react';
import { useInView } from 'react-intersection-observer';
import { workSteps } from '../../data/v2';
import Icon from '../Icon';
import ScrollAnimation, { LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 4: HOW IT WORKS
// ─────────────────────────────────────────────────────────────────
const WorkflowSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const STEP = 1000;

  return (
    <section id="how">
      <div className="section">
        <ScrollAnimation>
          <span className="eyebrow">The workflow</span>
        </ScrollAnimation>
        <LineReveal as="h2" className="display section-title" text="How Industrial Intelligence Is Built" />
        <LineReveal
          as="p"
          className="section-lead"
          text="Four steps from the documents you already have to live, defensible plant intelligence — all inside your network."
        />

        <div className="how-grid" ref={ref}>
          {workSteps.map((s, i) => (
            <div
              key={s.icon}
              className="card how-step hover-lift"
              style={{
                '--accent': s.color,
                '--accent-a55': `${s.color}55`,
                opacity: inView ? 1 : 0.15,
                filter: inView ? 'none' : 'grayscale(0.8)',
                transition: `opacity 700ms ease, filter 700ms ease`,
                // header (ScrollAnimation, ~700ms) settles first, then steps stagger in
                transitionDelay: inView ? `${120 + i * STEP}ms` : '0ms',
              } as React.CSSProperties}>
              <div className="how-step-top">
                <span className="how-num">
                  <Icon name={s.icon} size={22} strokeWidth={1.75} />
                </span>
                <span className="how-connector" aria-hidden="true" />
              </div>
              <span className="how-actor">{s.actor}</span>
              <h3 className="how-title">{s.title}</h3>

              {/* Desktop — always visible, no <details>. A closed <details>'s
                  content is skipped from paint by the browser even when CSS
                  forces its display back — not overridable, so desktop gets
                  its own plain tree instead of trying to force one open. */}
              <div className="u-hide-mobile">
                <div className="stack how-io">
                  <div className="how-io-label">{s.inLabel}</div>
                  <div className="cluster how-tags">
                    {s.inputs.map((t) => <span key={t} className="how-tag">{t}</span>)}
                  </div>
                </div>
                <div className="stack how-io">
                  <div className="how-io-label how-io-label-accent">{s.outLabel}</div>
                  <div className="cluster how-tags">
                    {s.outputs.map((t) => (
                      <span key={t} className="how-tag how-tag-out">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile — real collapsible <details>, first step open */}
              <details className="accordion-row how-io-details u-hide-desktop" open={i === 0}>
                <summary className="how-io-summary">Inputs &amp; outputs</summary>
                <div className="stack how-io">
                  <div className="how-io-label">{s.inLabel}</div>
                  <div className="cluster how-tags">
                    {s.inputs.map((t) => <span key={t} className="how-tag">{t}</span>)}
                  </div>
                </div>
                <div className="stack how-io">
                  <div className="how-io-label how-io-label-accent">{s.outLabel}</div>
                  <div className="cluster how-tags">
                    {s.outputs.map((t) => (
                      <span key={t} className="how-tag how-tag-out">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
