import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plug, FolderInput, Layers, Zap, Play } from 'lucide-react';
import { LineReveal } from '../ScrollAnimation';

const ACCENT     = '#2563EB';
const ACCENT_RGB = '37,99,235';
const CARD_DUR   = 0.55;
const STEP_DELAY = 0.9; // seconds between each card

const steps = [
  { Icon: Plug,        color: '#2563EB', title: 'Connect', desc: 'OPC-UA / Modbus TCP / MQTT native connections established instantly via the command line.' },
  { Icon: FolderInput, color: '#0E9BC4', title: 'Import',  desc: 'AI-native ingest of P&IDs, files, and drawings — auto-generating tags and topology.' },
  { Icon: Layers,      color: '#10B981', title: 'Design',  desc: 'Engineering Studio with a visual importer and 331 pre-built industrial symbols.' },
  { Icon: Zap,         color: '#F59E0B', title: 'Run',     desc: 'The system switches seamlessly from Edit to Run mode and live data flows.' },
];

// ── Connector SVG line ───────────────────────────────────────────────────────
const Connector: React.FC<{ index: number; inView: boolean }> = ({ index, inView }) => {
  // Line starts drawing after its left card finishes animating
  const delay = index * STEP_DELAY + CARD_DUR + 0.1;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="80" height="10" viewBox="0 0 80 10" style={{ overflow: 'visible', width: '100%' }}>
        {/* animated draw */}
        <motion.path
          d="M 0,5 L 80,5"
          stroke={ACCENT}
          strokeWidth={2}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ pathLength: { duration: 0.5, delay, ease: 'easeInOut' }, opacity: { duration: 0.1, delay } }}
        />
        {/* arrowhead at end */}
        <motion.path
          d="M 72,1 L 80,5 L 72,9"
          stroke={ACCENT}
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
const Card: React.FC<{ step: typeof steps[0]; index: number; inView: boolean }> = ({ step, index, inView }) => {
  const delay = index * STEP_DELAY;

  return (
    <motion.div
      className="engram-card"
      initial={{ opacity: 0, x: -60, scale: 0.93 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -60, scale: 0.93 }}
      transition={{ duration: CARD_DUR, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        minWidth: 0,
        height: '100%',
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
          background: `rgba(${ACCENT_RGB},0.07)`,
          border: `1.5px solid rgba(${ACCENT_RGB},0.18)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <step.Icon size={22} color={step.color} strokeWidth={1.75} />
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

// ── Click-to-play promo video — appears after the cards, before Impact ───────
const PromoVideo: React.FC<{ inView: boolean; delay: number }> = ({ inView, delay }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      className="engram-card"
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginTop: 48, padding: 0, overflow: 'hidden', position: 'relative' }}
    >
      {playing ? (
        <video
          src="/enview-promo.mp4"
          poster="/enview-promo-poster.webp"
          controls
          autoPlay
          style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', borderRadius: 16 }}
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label="Play enVIEW promo video"
          style={{
            all: 'unset',
            display: 'block',
            position: 'relative',
            width: '100%',
            cursor: 'pointer',
          }}
        >
          <img
            src="/enview-promo-poster.webp"
            alt="enVIEW promo video preview"
            loading="lazy"
            style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block', borderRadius: 16 }}
          />
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
              boxShadow: `0 8px 28px rgba(${ACCENT_RGB},0.4)`,
            }}>
              <Play size={26} color={ACCENT} fill={ACCENT} style={{ marginLeft: 3 }} />
            </div>
          </div>
        </button>
      )}
    </motion.div>
  );
};

// ── Main section ─────────────────────────────────────────────────────────────
const EnviewHowItWorksScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section className="engram-section engram-container">
      <span className="eyebrow">How It Works</span>
      <LineReveal as="h2" className="engram-section-h2" text="From Controller to Operations in Minutes" />

      {/* Timeline row */}
      <div
        ref={sectionRef}
        style={{
          display: 'grid',
          gridTemplateColumns: Array(steps.length).fill('1fr').join(' 80px '),
          alignItems: 'stretch',
          marginTop: 8,
        }}
      >
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <Card step={step} index={i} inView={inView} />
            {i < steps.length - 1 && <Connector index={i} inView={inView} />}
          </React.Fragment>
        ))}
      </div>

      {/* Promo video — appears after all cards, before Impact */}
      <PromoVideo inView={inView} delay={(steps.length - 1) * STEP_DELAY + CARD_DUR + 0.25} />

      {/* Impact banner — appears after the video */}
      <motion.div
        className="engram-card"
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.55, delay: (steps.length - 1) * STEP_DELAY + CARD_DUR + 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginTop: 20,
          textAlign: 'center',
          borderColor: `rgba(${ACCENT_RGB},0.35)`,
          padding: '18px 24px',
          background: `linear-gradient(135deg, rgba(${ACCENT_RGB},0.08) 0%, rgba(${ACCENT_RGB},0.04) 100%)`,
          boxShadow: `0 0 0 1px rgba(${ACCENT_RGB},0.18), 0 4px 24px rgba(${ACCENT_RGB},0.1)`,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Impact</div>
        <div style={{ fontSize: 13, color: 'var(--t4)' }}>
          Reduce from <strong style={{ color: 'var(--t1)' }}>40 engineer-hours</strong> to <strong style={{ color: ACCENT }}>under 2 hours</strong>
        </div>
      </motion.div>
    </section>
  );
};

export default EnviewHowItWorksScroll;
