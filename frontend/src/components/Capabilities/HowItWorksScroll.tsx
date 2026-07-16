import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LineReveal } from '../ScrollAnimation';
import DemoVideoPlayer from './DemoVideoPlayer';

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
}

// ── Connector SVG line — same drawn-arrow animation as enVIEW's version ──────
const Connector: React.FC<{ index: number; inView: boolean; accent: string }> = ({ index, inView, accent }) => {
  const delay = index * STEP_DELAY + CARD_DUR + 0.1;

  return (
    <div style={{ flex: '0 0 50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="50" height="10" viewBox="0 0 50 10" style={{ overflow: 'visible', width: '100%' }}>
        <motion.path
          d="M 0,5 L 50,5"
          stroke={accent}
          strokeWidth={2}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ pathLength: { duration: 0.5, delay, ease: 'easeInOut' }, opacity: { duration: 0.1, delay } }}
        />
        <motion.path
          d="M 42,1 L 50,5 L 42,9"
          stroke={accent}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25, delay: delay + 0.45 }}
        />
      </svg>
    </div>
  );
};

// ── Individual card ──────────────────────────────────────────────────────────
const Card: React.FC<{ step: HowItWorksStep; index: number; inView: boolean; accent: string; accentRgb: string }> = ({
  step, index, inView, accent, accentRgb,
}) => {
  const delay = index * STEP_DELAY;
  const color = step.color || accent;

  return (
    <motion.div
      className="engram-card"
      initial={{ opacity: 0, x: -60, scale: 0.93 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -60, scale: 0.93 }}
      transition={{ duration: CARD_DUR, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: '1 1 150px',
        minWidth: 0,
        alignSelf: 'stretch',
        height: 'auto',
        willChange: 'transform, opacity',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.45, delay: delay + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: `rgba(${accentRgb},0.07)`,
          border: `1.5px solid rgba(${accentRgb},0.18)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <step.icon size={22} color={color} strokeWidth={1.75} />
      </motion.div>

      <h4 className="engram-card-title" style={{ marginBottom: 8 }}>
        {step.title}
      </h4>
      <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.65, margin: 0 }}>
        {step.desc}
      </p>
    </motion.div>
  );
};

// ── Click-to-play demo video — same pattern as enVIEW's How It Works ─────────
const PromoVideo: React.FC<{ src: string; poster?: string; inView: boolean; delay: number; accent: string; accentRgb: string }> = ({
  src, poster, inView, delay, accent, accentRgb,
}) => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      className={`engram-card${playing ? ' engram-card-video-playing' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginTop: 48, padding: 0, overflow: 'hidden', position: 'relative' }}
    >
      {playing ? (
        <DemoVideoPlayer src={src} poster={poster} accent={accent} accentRgb={accentRgb} />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label="Play demo video"
          style={{ all: 'unset', display: 'block', position: 'relative', width: '100%', cursor: 'pointer' }}
        >
          {poster ? (
            <img src={poster} alt="Demo video preview" loading="lazy" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', borderRadius: 16 }} />
          ) : (
            <video src={src} muted preload="metadata" style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', borderRadius: 16 }} />
          )}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(4,6,18,0.30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.25s ease',
            }}
          >
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 28px rgba(${accentRgb},0.4)`,
            }}>
              <Play size={26} color={accent} fill={accent} style={{ marginLeft: 3 }} />
            </div>
          </div>
        </button>
      )}
    </motion.div>
  );
};

// ── Main section — same scroll-into-view, staggered card + drawn-connector
// animation used by enVIEW's "How It Works", generalized for any product page ──
const HowItWorksScroll: React.FC<HowItWorksScrollProps> = ({ eyebrow, title, steps, accent, accentRgb, impact, video, videoPoster }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section className="engram-section engram-container">
      <span className="eyebrow">{eyebrow}</span>
      <LineReveal as="h2" className="engram-section-h2" text={title} />

      {/* Steps — one line, same as enVIEW. Cards prefer 150px but can shrink
          (flex-shrink via the flex shorthand) so the whole row always fits
          within the page instead of overflowing into a scrollbar. */}
      <div
        ref={sectionRef}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          marginTop: 8,
        }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <Card step={step} index={i} inView={inView} accent={accent} accentRgb={accentRgb} />
            {i < steps.length - 1 && <Connector index={i} inView={inView} accent={accent} />}
          </React.Fragment>
        ))}
      </div>

      {/* Demo video — appears after all cards, before Impact */}
      {video && (
        <PromoVideo
          src={video}
          poster={videoPoster}
          inView={inView}
          delay={(steps.length - 1) * STEP_DELAY + CARD_DUR + 0.25}
          accent={accent}
          accentRgb={accentRgb}
        />
      )}

      {/* Impact banner — appears after all cards */}
      {impact && (
        <motion.div
          className="engram-card"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.55, delay: (steps.length - 1) * STEP_DELAY + CARD_DUR + (video ? 0.65 : 0.25), ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 20,
            textAlign: 'center',
            borderColor: `rgba(${accentRgb},0.35)`,
            padding: '18px 24px',
            background: `linear-gradient(135deg, rgba(${accentRgb},0.08) 0%, rgba(${accentRgb},0.04) 100%)`,
            boxShadow: `0 0 0 1px rgba(${accentRgb},0.18), 0 4px 24px rgba(${accentRgb},0.1)`,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>{impact.label}</div>
          <div style={{ fontSize: 13, color: 'var(--t4)' }}>
            Reduce from <strong style={{ color: 'var(--t1)' }}>{impact.before}</strong> to <strong style={{ color: accent }}>{impact.after}</strong>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default HowItWorksScroll;
