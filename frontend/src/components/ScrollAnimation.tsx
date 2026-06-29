import React from 'react';
import { useInView } from 'react-intersection-observer';

// ── direction → CSS class ─────────────────────────────────────────
const directionMap = {
  up:    'sa-hidden-up',
  down:  'sa-hidden-down',
  left:  'sa-hidden-left',
  right: 'sa-hidden-right',
};

// ── Single element reveal (headings, paragraphs, etc.) ───────────
interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  direction?: keyof typeof directionMap;
  threshold?: number;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = '',
  style,
  delay = 0,
  duration = 700,
  direction = 'up',
  threshold = 0.1,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold });

  return (
    <div
      ref={ref}
      className={`sa-base ${directionMap[direction]} ${inView ? 'sa-visible' : ''} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: inView ? `${delay}ms` : '0ms',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Per-card observer — fires only when this card scrolls into view ──
interface StaggerItemProps {
  children: React.ReactNode;
  delay: number;
  duration: number;
  direction: keyof typeof directionMap;
}

const StaggerItem: React.FC<StaggerItemProps> = ({ children, delay, duration, direction }) => {
  // Low threshold: card animates in as soon as it peeks 6% into viewport
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.06 });

  return (
    <div
      ref={ref}
      className={`sa-base ${directionMap[direction]} ${inView ? 'sa-visible' : ''}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: inView ? `${delay}ms` : '0ms',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
};

// ── Stagger grid wrapper — each child gets its OWN observer ──────
interface ScrollStaggerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  baseDelay?: number;
  step?: number;              // small stagger for cards visible at the same time
  direction?: keyof typeof directionMap;
  duration?: number;
}

export const ScrollStagger: React.FC<ScrollStaggerProps> = ({
  children,
  className = '',
  style,
  baseDelay = 0,
  step = 55,                  // gentle stagger when multiple cards enter together
  direction = 'up',
  duration = 750,
}) => (
  <div className={className} style={style}>
    {React.Children.map(children, (child, i) =>
      child ? (
        <StaggerItem
          key={i}
          delay={baseDelay + i * step}
          duration={duration}
          direction={direction}
        >
          {child}
        </StaggerItem>
      ) : null
    )}
  </div>
);

export default ScrollAnimation;
