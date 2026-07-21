import React from 'react';
import { useInView } from 'react-intersection-observer';
import { pipeNodes } from '../../data/platform';
import ScrollAnimation, { LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 7: PLATFORM
// ─────────────────────────────────────────────────────────────────
export const PlatformSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const STEP = 700;
  const CARD_DUR = 550;
  const CONN_DUR = 280;
  // These grow-in transforms are inline-style-driven, not CSS classes, so
  // the @media(prefers-reduced-motion) rules in index.css can't reach them
  // — reduceMotion short-circuits both trees to their settled state instead.
  const reduceMotion = prefersReducedMotion();

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

        <div ref={ref}>
          {/* Desktop — horizontal flow, cards grow from their left edge */}
          <div className="platform-flex u-hide-mobile">
            {pipeNodes.map((node, i) => (
              <React.Fragment key={node.cap}>
                <div
                  className="card pipe-node hover-lift landing-pipe-node-static"
                  style={{
                    '--accent2': node.color,
                    transform: reduceMotion || inView ? 'scaleX(1)' : 'scaleX(0)',
                    opacity: reduceMotion || inView ? 1 : 0,
                    transition: reduceMotion ? 'none' : `transform ${CARD_DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${CARD_DUR}ms ease`,
                    // header (ScrollAnimation, ~700ms) settles first, then cards stagger in
                    transitionDelay: !reduceMotion && inView ? `${120 + i * STEP}ms` : '0ms',
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
                      opacity: reduceMotion || inView ? 1 : 0,
                      transform: reduceMotion || inView ? 'scaleX(1)' : 'scaleX(0)',
                      transition: reduceMotion ? 'none' : `opacity ${CONN_DUR}ms ease, transform ${CONN_DUR}ms ease`,
                      transitionDelay: !reduceMotion && inView ? `${120 + i * STEP + STEP * 0.75}ms` : '0ms',
                    } as React.CSSProperties}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile — same story, rotated: a vertical flow with a vertical
              connector between stacked cards instead of a horizontal one
              that has nowhere to go on a narrow screen. */}
          <div className="platform-flex-vertical u-hide-desktop">
            {pipeNodes.map((node, i) => (
              <React.Fragment key={node.cap}>
                <div
                  className="card pipe-node hover-lift landing-pipe-node-static"
                  style={{
                    '--accent2': node.color,
                    transform: reduceMotion || inView ? 'scaleY(1)' : 'scaleY(0)',
                    opacity: reduceMotion || inView ? 1 : 0,
                    transition: reduceMotion ? 'none' : `transform ${CARD_DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${CARD_DUR}ms ease`,
                    transitionDelay: !reduceMotion && inView ? `${120 + i * STEP}ms` : '0ms',
                  } as React.CSSProperties}
                >
                  <div className="pipe-cap">{node.cap}</div>
                  <div className="label-text pipe-sub">{node.label}</div>
                  <div className="pipe-desc">{node.sub}</div>
                </div>
                {i < pipeNodes.length - 1 && (
                  <div
                    className="pipe-connector-vertical"
                    style={{
                      opacity: reduceMotion || inView ? 1 : 0,
                      transform: reduceMotion || inView ? 'scaleY(1)' : 'scaleY(0)',
                      transition: reduceMotion ? 'none' : `opacity ${CONN_DUR}ms ease, transform ${CONN_DUR}ms ease`,
                      transitionDelay: !reduceMotion && inView ? `${120 + i * STEP + STEP * 0.75}ms` : '0ms',
                    } as React.CSSProperties}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
