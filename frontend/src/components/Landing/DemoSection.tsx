import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useTransform, motion, AnimatePresence } from 'framer-motion';
import { demos } from '../../data/v2';
import ScrollAnimation, { ScrollStagger, RevealLines } from '../ScrollAnimation';
import DemoBody from './shared/DemoBody';
import { useMediaQuery, MOBILE_QUERY } from '../../hooks/useMediaQuery';
import { getLenis } from '../../hooks/useLenis';

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

// Compute scroll progress [0..1] for the demo container.
// Works whether window or an element is the scroll container.
function getProgress(el: HTMLElement): number {
  const containerH = el.offsetHeight;
  const viewH = window.innerHeight;
  const scrollTop = window.scrollY;
  const elOffsetTop = el.getBoundingClientRect().top + scrollTop;
  const scrolled = scrollTop - elOffsetTop;
  const total = containerH - viewH;
  return total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
}

// Desktop — sticky scroll-jack. Only mounted ≥768px.
const DemoDesktop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollYProgress = useMotionValue(0);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      if (!containerRef.current) return;
      const progress = getProgress(containerRef.current);
      scrollYProgress.set(progress);
      setActiveIndex(Math.min(N - 1, Math.floor(progress * N)));
    };

    // Attach to native scroll as the primary listener —
    // works regardless of overflow-x mode or Lenis config.
    window.addEventListener('scroll', update, { passive: true });

    // Also attach to Lenis so we stay in sync on its raf ticks.
    // Poll briefly in case Lenis initialises slightly after this component.
    let lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', update);
    } else {
      const t = setTimeout(() => {
        lenis = getLenis();
        if (lenis) lenis.on('scroll', update);
      }, 300);
      return () => {
        clearTimeout(t);
        window.removeEventListener('scroll', update);
        lenis?.off('scroll', update);
      };
    }

    update(); // initialise on mount

    return () => {
      window.removeEventListener('scroll', update);
      lenis?.off('scroll', update);
    };
  }, [scrollYProgress]);

  const handleStepSelect = React.useCallback((i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollTop = window.scrollY;
    const elOffsetTop = el.getBoundingClientRect().top + scrollTop;
    const total = el.offsetHeight - window.innerHeight;
    const target = elOffsetTop + (i / N) * total;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  const active = demos[activeIndex];

  return (
    <div ref={containerRef} id="demo" className="landing-demo-section" style={{ '--demo-h': `${N * 100}vh` } as React.CSSProperties}>
      <div className="demo-sticky">
        {/* Left — heading + progress list */}
        <div className="demo-sticky-left">
          <span className="eyebrow">Product output, not slideware</span>
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
                scaleX,
                '--accent': active.color,
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Right — animated card */}
        <div className="demo-sticky-right">
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
        </div>
      </div>
    </div>
  );
};

// Mobile — vertical timeline, one card per demo, plain scroll.
const DemoMobile: React.FC = () => (
  <div id="demo" className="landing-demo-section demo-timeline-section">
    <ScrollAnimation>
      <span className="eyebrow">Product output, not slideware</span>
    </ScrollAnimation>
    <RevealLines as="h2" className="display demo-sticky-h2" lines={['See enxplant', 'in Action']} />

    <ScrollStagger className="demo-timeline" step={90}>
      {demos.map((d) => (
        <div
          key={d.id}
          className="card demo-card demo-timeline-card"
          style={{ '--accent': d.color } as React.CSSProperties}
        >
          <div className="demo-card-head">
            <span className="demo-card-product">{d.product}</span>
            <span className="demo-card-title">{d.title}</span>
          </div>
          <DemoBody d={d} />
        </div>
      ))}
    </ScrollStagger>
  </div>
);

const DemoSection: React.FC = () => {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  return isMobile ? <DemoMobile /> : <DemoDesktop />;
};

export default DemoSection;
