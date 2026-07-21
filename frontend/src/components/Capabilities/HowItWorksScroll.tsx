import React, { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LineReveal } from '../ScrollAnimation';
import DemoVideoPlayer from './DemoVideoPlayer';
import { useMediaQuery } from '../../hooks/useMediaQuery';

// Matches .how-steps-row's own row→column switch (see how.css) — not the
// generic MOBILE_QUERY (767px) — so the card entrance direction changes at
// the exact same width the layout itself goes vertical.
const STACKED_QUERY = '(max-width: 1023px)';

const CARD_DUR   = 0.55;
const STEP_DELAY = 0.9; // seconds between each card — same pacing as enVIEW's version

export interface HowItWorksStep {
  icon: LucideIcon;
  title: string;
  desc: string;
  color?: string;
}

interface HowItWorksScrollProps {
  eyebrow: string;
  title: string;
  steps: HowItWorksStep[];
  accent: string;
  accentRgb: string;
  impact?: { label: string; before: string; after: string };
  video?: string;
  /** Static preview image shown before play — avoids fetching video data for the thumbnail */
  videoPoster?: string;
  /** Layout overrides — enVIEW uses a fixed-width grid instead of the default flex row */
  rowClassName?: string;
  connWrapClassName?: string;
  connWidth?: number;
  videoAriaLabel?: string;
}

// ── Connector SVG line — same drawn-arrow animation as enVIEW's version ──────
const Connector: React.FC<{ index: number; inView: boolean; accent: string; wrapClassName: string; width: number; reduceMotion: boolean }> = ({
  index, inView, accent, wrapClassName, width, reduceMotion,
}) => {
  const delay = reduceMotion ? 0 : index * STEP_DELAY + CARD_DUR + 0.1;

  return (
    <div className={`u-flex-center ${wrapClassName}`}>
      <svg width={width} height="10" viewBox={`0 0 ${width} 10`} className="how-conn-svg">
        <motion.path
          d={`M 0,5 L ${width},5`}
          stroke={accent}
          strokeWidth={2}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { pathLength: { duration: 0.5, delay, ease: 'easeInOut' }, opacity: { duration: 0.1, delay } }}
        />
        <motion.path
          d={`M ${width - 8},1 L ${width},5 L ${width - 8},9`}
          stroke={accent}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25, delay: delay + 0.45 }}
        />
      </svg>
    </div>
  );
};

// ── Mobile vertical connector — same drawn-line + arrowhead animation as the
// desktop Connector, timed to the same per-step delay, just pointing down
// instead of across. Rendered alongside Connector; CSS (u-hide-mobile /
// u-hide-desktop) decides which one is actually shown. ──────────────────────
const VerticalConnector: React.FC<{ index: number; inView: boolean; accent: string; reduceMotion: boolean }> = ({
  index, inView, accent, reduceMotion,
}) => {
  const delay = reduceMotion ? 0 : index * STEP_DELAY + CARD_DUR + 0.1;

  return (
    <div className="u-flex-center how-conn-wrap-vertical">
      <svg width="10" height="28" viewBox="0 0 10 28" className="how-conn-svg-vertical">
        <motion.path
          d="M 5,0 L 5,28"
          stroke={accent}
          strokeWidth={2}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { pathLength: { duration: 0.5, delay, ease: 'easeInOut' }, opacity: { duration: 0.1, delay } }}
        />
        <motion.path
          d="M 1,20 L 5,28 L 9,20"
          stroke={accent}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25, delay: delay + 0.45 }}
        />
      </svg>
    </div>
  );
};

// ── Individual card ──────────────────────────────────────────────────────────
const Card: React.FC<{ step: HowItWorksStep; index: number; inView: boolean; accent: string; reduceMotion: boolean }> = ({
  step, index, inView, accent, reduceMotion,
}) => {
  const delay = reduceMotion ? 0 : index * STEP_DELAY;
  const color = step.color || accent;
  // Stacked layout reads top-to-bottom, so each card should enter from
  // above and settle down into place — not slide in from the side, which
  // read as a leftover desktop motion once the row became a column.
  const stacked = useMediaQuery(STACKED_QUERY);
  const hiddenOffset = stacked ? { y: -40, x: 0 } : { x: -60, y: 0 };

  return (
    <motion.div
      className="card engram-card how-card"
      initial={{ opacity: 0, ...hiddenOffset, scale: 0.93 }}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...hiddenOffset, scale: 0.93 }}
      transition={reduceMotion ? { duration: 0 } : { duration: CARD_DUR, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon */}
      <motion.div
        className="how-icon-wrap"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.45, delay: delay + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <step.icon size={22} color={color} strokeWidth={1.75} />
      </motion.div>

      <h4 className="engram-card-title how-card-title">
        {step.title}
      </h4>
      <p className="supporting-text-loose how-desc">
        {step.desc}
      </p>
    </motion.div>
  );
};

// ── Click-to-play demo video — same pattern as enVIEW's How It Works ─────────
const PromoVideo: React.FC<{ src: string; poster?: string; inView: boolean; delay: number; accent: string; accentRgb: string; ariaLabel: string; reduceMotion: boolean }> = ({
  src, poster, inView, delay, accent, accentRgb, ariaLabel, reduceMotion,
}) => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      className={`card engram-card how-video-wrap${playing ? ' engram-card-video-playing' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {playing ? (
          <DemoVideoPlayer src={src} poster={poster} accent={accent} accentRgb={accentRgb} />
        ) : (
          <button className="how-video-btn" onClick={() => setPlaying(true)} aria-label={ariaLabel}>
            {poster ? (
              <img src={poster} alt="Demo video preview" loading="lazy" decoding="async" className="how-video-media" />
            ) : (
              <video src={src} muted preload="metadata" className="how-video-media" />
            )}
            <div className="u-flex-center how-video-overlay">
              <div className="how-video-play">
                <Play size={26} color={accent} fill={accent} className="how-video-icon" />
              </div>
            </div>
          </button>
        )}
    </motion.div>
  );
};

// ── Main section — same scroll-into-view, staggered card + drawn-connector
// animation used by enVIEW's "How It Works", generalized for any product page ──
const HowItWorksScroll: React.FC<HowItWorksScrollProps> = ({
  eyebrow, title, steps, accent, accentRgb, impact, video, videoPoster,
  rowClassName = 'how-steps-row', connWrapClassName = 'how-conn-wrap', connWidth = 50,
  videoAriaLabel = 'Play demo video',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section className="engram-section engram-container" style={{ '--accent': accent, '--accent-rgb': accentRgb } as React.CSSProperties}>
      <span className="eyebrow">{eyebrow}</span>
      <LineReveal as="h2" className="engram-section-h2" text={title} />

      {/* Steps — one line, same as enVIEW. Cards prefer 150px but can shrink
          (flex-shrink via the flex shorthand) so the whole row always fits
          within the page instead of overflowing into a scrollbar. */}
      <div ref={sectionRef} className={rowClassName}>
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <Card step={step} index={i} inView={inView} accent={accent} reduceMotion={reduceMotion} />
            {i < steps.length - 1 && (
              <>
                {/* Breakpoint matches .how-steps-row's own row→column switch
                    (≤1023px) — not the generic u-hide-mobile/desktop (767px)
                    utility, so the connector orientation never mismatches
                    the card layout at tablet widths. */}
                <div className="how-conn-desktop-only">
                  <Connector index={i} inView={inView} accent={accent} wrapClassName={connWrapClassName} width={connWidth} reduceMotion={reduceMotion} />
                </div>
                <div className="how-conn-mobile-only">
                  <VerticalConnector index={i} inView={inView} accent={accent} reduceMotion={reduceMotion} />
                </div>
              </>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Demo video — appears after all cards, before Impact */}
      {video && (
        <PromoVideo
          src={video}
          poster={videoPoster}
          inView={inView}
          delay={reduceMotion ? 0 : (steps.length - 1) * STEP_DELAY + CARD_DUR + 0.25}
          accent={accent}
          accentRgb={accentRgb}
          ariaLabel={videoAriaLabel}
          reduceMotion={reduceMotion}
        />
      )}

      {/* Impact banner — appears after all cards */}
      {impact && (
        <motion.div
          className="card engram-card how-impact-card"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay: (steps.length - 1) * STEP_DELAY + CARD_DUR + (video ? 0.65 : 0.25), ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="how-impact-label">{impact.label}</div>
          <div className="how-impact-text">
            Reduce from <strong className="how-impact-strong">{impact.before}</strong> to <strong className="how-impact-accent">{impact.after}</strong>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default HowItWorksScroll;
