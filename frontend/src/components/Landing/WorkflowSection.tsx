import React from 'react';
import { motion } from 'framer-motion';
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
          text="Four steps, from the documents you already have to answers you can show an auditor — all inside your own network."
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
                {/* Every card carries one, including the last — its gradient
                    falls back to its own color and fades out. */}
                <span className="how-connector" aria-hidden="true">
                    {/* Solid in the card's own accent — no blend into the
                        next card's color, so each line reads as that step's. */}
                    <svg viewBox="0 0 22 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <motion.path
                        d="M0 1H22"
                        stroke="var(--accent)"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: inView ? (120 + i * STEP) / 1000 + 0.2 : 0 }}
                      />
                    </svg>
                </span>
              </div>
              <span className="how-actor">{s.actor}</span>
              <h3 className="how-title">{s.title}</h3>

              {/* Inputs/outputs always visible on every viewport — no mobile
                  accordion, so the full step content shows stacked like the
                  desktop card does. */}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
