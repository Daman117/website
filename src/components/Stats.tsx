import React, { useState, useEffect, useRef } from 'react';

interface StatCellProps {
  target: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isStatic?: boolean;
  staticVal?: string;
}

const StatCell: React.FC<StatCellProps> = ({ target, decimals = 0, suffix = '', prefix = '', label, isStatic, staticVal }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((ease * target).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimals, isStatic]);

  const display = isStatic
    ? staticVal
    : `${prefix}${decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()}${suffix}`;

  return (
    <div className="stat-cell" ref={ref}>
      <span className="stat-val mono">{display}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const Stats: React.FC = () => (
  <div id="stats">
    <div className="stats-grid">
      <StatCell target={139} label="P&ID drawings digitized" />
      <StatCell target={5945} label="Equipment & instruments" />
      <StatCell target={99.3} decimals={1} suffix="%" label="Extraction accuracy" />
      <StatCell target={0} isStatic staticVal="<2s" label="SCADA startup time" />
    </div>
  </div>
);

export default Stats;
