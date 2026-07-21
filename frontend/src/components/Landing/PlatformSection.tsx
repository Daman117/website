import React from 'react';
import { useInView } from 'react-intersection-observer';
import { pipeNodes } from '../../data/platform';
import ScrollAnimation, { LineReveal } from '../ScrollAnimation';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 7: PLATFORM
// ─────────────────────────────────────────────────────────────────
export const PlatformSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const STEP = 700;
  const CARD_DUR = 550;
  const CONN_DUR = 280;

  return (
    <section id="platform">
      <div className="section">
        <ScrollAnimation>
          <span className="eyebrow">Platform</span>
        </ScrollAnimation>
        <LineReveal
          as="h2"
          className="display landing-section-h2 landing-platform-title"
          text="How capabilities connect"
        />

        <div className="platform-flex" ref={ref}>
          {pipeNodes.map((node, i) => (
            <React.Fragment key={node.cap}>
              {/* Card grows from its left edge — looks like it slides out from previous card */}
              <div
                className="card pipe-node hover-lift landing-pipe-node-static"
                style={{
                  '--accent2': node.color,
                  transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                  opacity: inView ? 1 : 0,
                  transition: `transform ${CARD_DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${CARD_DUR}ms ease`,
                  // header (ScrollAnimation, ~700ms) settles first, then cards stagger in
                  transitionDelay: inView ? `${120 + i * STEP}ms` : '0ms',
                } as React.CSSProperties}
              >
                <div className="pipe-cap">{node.cap}</div>
                <div className="label-text pipe-sub">{node.label}</div>
                <div className="pipe-desc">{node.sub}</div>
              </div>
              {/* Connector appears after card i settles, just before card i+1 starts */}
              {i < pipeNodes.length - 1 && (
                <div
                  className="pipe-connector landing-pipe-connector-static"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                    transition: `opacity ${CONN_DUR}ms ease, transform ${CONN_DUR}ms ease`,
                    transitionDelay: inView ? `${120 + i * STEP + STEP * 0.75}ms` : '0ms',
                  } as React.CSSProperties}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
