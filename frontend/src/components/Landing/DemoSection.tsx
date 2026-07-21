import React, { useState, useEffect, useRef } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { demos } from '../../data/v2';
import ScrollAnimation, { ScrollStagger, RevealLines } from '../ScrollAnimation';
import DemoBody from './shared/DemoBody';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 2: PRODUCT DEMO
// ─────────────────────────────────────────────────────────────────
const N = demos.length;

const DemoStepItem = React.memo(function DemoStepItem({
  index, product, title, color, active, onSelect,
}: { index: number; product: string; title: string; color: string; active: boolean; onSelect: (i: number) => void }) {
  return (
    <button
      className={`demo-step-item${active ? ' active' : ''}`}
      style={{ '--step-color': color } as React.CSSProperties}
      onClick={() => onSelect(index)}
    >
      <span className="card-heading-sm demo-step-product">{product}</span>
      <span className="demo-step-title">{title}</span>
    </button>
  );
});

const DemoDot = React.memo(function DemoDot({ color, active }: { color: string; active: boolean }) {
  return (
    <span
      className={`demo-dot${active ? ' active' : ''}`}
      style={{ '--dot-color': color } as React.CSSProperties}
    />
  );
});

const DemoSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, N - 0.001]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => rawIndex.on('change', (v) => setActiveIndex(Math.floor(v))), [rawIndex]);

  const handleStepSelect = React.useCallback((i: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const top = window.scrollY + rect.top + (i / N) * containerRef.current.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const active = demos[activeIndex];

  return (
    <div ref={containerRef} id="demo" className="landing-demo-section" style={{ '--demo-h': `${N * 100}vh` } as React.CSSProperties}>
      <div className="demo-sticky">
        {/* Left — heading + progress list */}
        <div className="demo-sticky-left">
          <ScrollAnimation>
            <span className="eyebrow">Product output, not slideware</span>
          </ScrollAnimation>
          <RevealLines as="h2" className="display demo-sticky-h2" lines={['See enxplant', 'in Action']} />

          <ScrollStagger className="demo-step-list" step={70}>
            {demos.map((d, i) => (
              <DemoStepItem
                key={d.id}
                index={i}
                product={d.product}
                title={d.title}
                color={d.color}
                active={i === activeIndex}
                onSelect={handleStepSelect}
              />
            ))}
          </ScrollStagger>

          <div className="demo-progress-track">
            <motion.div
              className="demo-progress-fill"
              style={{
                scaleX: useTransform(scrollYProgress, [0, 1], [0, 1]),
                '--accent': active.color,
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Right — animated card. Delayed so it appears after the left column has settled. */}
        <ScrollAnimation delay={300} className="demo-sticky-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="card demo-card demo-card-featured"
              style={{ '--accent': active.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="demo-card-head">
                <span className="demo-card-product">{active.product}</span>
                <span className="demo-card-title">{active.title}</span>
              </div>
              <DemoBody d={active} />
              <div className="demo-card-counter">
                {activeIndex + 1} / {N}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="demo-dots">
            {demos.map((d, i) => (
              <DemoDot key={d.id} color={d.color} active={i === activeIndex} />
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default DemoSection;
