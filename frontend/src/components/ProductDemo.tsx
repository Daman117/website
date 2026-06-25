import React, { useRef } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { demos, type DemoCard } from '../data/v2';

/* ── Sub-renderers (unchanged logic) ──────────────────────────── */
const ColList: React.FC<{ label: string; items: string[]; color?: string }> = ({ label, items, color }) => (
  <div className="demo-col">
    <div className="demo-col-label">{label}</div>
    <ul className="demo-col-list">
      {items.map((it) => (
        <li key={it}><span style={color ? { color } : undefined}>—</span>{it}</li>
      ))}
    </ul>
  </div>
);

const DemoBody: React.FC<{ d: DemoCard }> = ({ d }) => {
  if (d.kind === 'transform' && d.before && d.after) {
    return (
      <div className="demo-ba">
        <ColList label={d.before.label} items={d.before.items} />
        <div className="demo-arrow" aria-hidden="true">→</div>
        <ColList label={d.after.label} items={d.after.items} color={d.color} />
      </div>
    );
  }
  if (d.kind === 'query' && d.query && d.answer) {
    return (
      <div className="demo-query">
        <div className="demo-q"><span className="demo-q-icon" style={{ color: d.color }}>?</span>{d.query}</div>
        <div className="demo-a">
          <div className="demo-a-value" style={{ color: d.color }}>{d.answer.value}</div>
          <div className="demo-a-cite">
            <span>{d.answer.source}</span><span>{d.answer.revision}</span><span>{d.answer.page}</span>
          </div>
        </div>
      </div>
    );
  }
  if (d.kind === 'dashboard' && d.panels) {
    return (
      <div className="demo-dash">
        {d.panels.map((p) => (
          <div key={p.label} className={`demo-tile demo-tone-${p.tone || 'ok'}`}>
            <div className="demo-tile-label">{p.label}</div>
            <div className="demo-tile-value">{p.value}</div>
          </div>
        ))}
      </div>
    );
  }
  if (d.kind === 'decision' && d.steps) {
    return (
      <div className="demo-decision">
        {d.steps.map((s) => (
          <div key={s.label} className="demo-dec-row">
            <span className="demo-dec-label">{s.label}</span>
            <span className="demo-dec-value">{s.value}</span>
          </div>
        ))}
        <div className="demo-refs">
          {d.refs?.map((r) => <span key={r} className="demo-ref">{r}</span>)}
        </div>
      </div>
    );
  }
  return null;
};

/* ── Sticky scroll walkthrough ───────────────────────────────── */
const N = demos.length; // 4

const ProductDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  /* Track scroll progress through the sticky container */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* Map 0–1 progress to active demo index 0–(N-1) */
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, N - 0.001]);

  const [activeIndex, setActiveIndex] = React.useState(0);
  React.useEffect(() => {
    return rawIndex.on('change', (v) => setActiveIndex(Math.floor(v)));
  }, [rawIndex]);

  const active = demos[activeIndex];

  return (
    /* Outer: tall container that drives scroll progress */
    <div
      ref={containerRef}
      id="demo"
      style={{ height: `${N * 100}vh`, position: 'relative' }}
    >
      {/* Inner: sticky viewport-height panel */}
      <div className="demo-sticky">

        {/* Left — heading + progress list */}
        <div className="demo-sticky-left">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Product output, not slideware
          </motion.span>
          <motion.h2
            className="display demo-sticky-h2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
          >
            See enX<br />in Action
          </motion.h2>

          {/* Step list */}
          <div className="demo-step-list">
            {demos.map((d, i) => (
              <button
                key={d.id}
                className={`demo-step-item${i === activeIndex ? ' active' : ''}`}
                style={{ '--step-color': d.color } as React.CSSProperties}
                onClick={() => {
                  if (!containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  const top = window.scrollY + rect.top + (i / N) * containerRef.current.offsetHeight;
                  window.scrollTo({ top, behavior: 'smooth' });
                }}
                aria-label={`Jump to ${d.product}`}
              >
                <span className="demo-step-dot" style={{ background: i === activeIndex ? d.color : undefined }} />
                <span className="demo-step-product" style={{ color: i === activeIndex ? d.color : undefined }}>
                  {d.product}
                </span>
                <span className="demo-step-title">{d.title}</span>
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="demo-progress-track">
            <motion.div
              className="demo-progress-fill"
              style={{
                scaleX: useTransform(scrollYProgress, [0, 1], [0, 1]),
                background: active.color,
              }}
            />
          </div>
        </div>

        {/* Right — animated active card */}
        <div className="demo-sticky-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="demo-card demo-card-featured"
              style={{ '--accent': active.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="demo-card-head">
                <span className="demo-card-dot" style={{ background: active.color }} />
                <span className="demo-card-product" style={{ color: active.color }}>{active.product}</span>
                <span className="demo-card-title">{active.title}</span>
              </div>
              <DemoBody d={active} />

              {/* Step counter */}
              <div className="demo-card-counter" style={{ color: active.color }}>
                {activeIndex + 1} / {N}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating dots */}
          <div className="demo-dots">
            {demos.map((d, i) => (
              <span
                key={d.id}
                className={`demo-dot${i === activeIndex ? ' active' : ''}`}
                style={{ background: i === activeIndex ? d.color : undefined }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDemo;
