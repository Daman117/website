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
  baseDelay = 280,            // brief beat after the section header starts revealing
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

// ── Line/word-by-word masked reveal — same visual language as the hero
// headline, but scroll-triggered instead of mount-triggered. Splits plain
// text on whitespace and reveals each word from behind a mask, staggered. ──
interface LineRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  wordDelay?: number;
  duration?: number;
  threshold?: number;
  // Flat offset added to every word's delay — use this to hold an element
  // back until an earlier heading/paragraph's own reveal has finished, so
  // sequential blocks read strictly one-after-another instead of all
  // starting together the instant they're all in the viewport at once.
  startDelay?: number;
}

export const LineReveal: React.FC<LineRevealProps> = ({
  text,
  as: Tag = 'span',
  className = '',
  style,
  wordDelay = 45,
  duration = 700,
  threshold = 0.15,
  startDelay = 0,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold });
  const words = text.split(' ');

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span className="lr-mask">
            <span
              className={`lr-inner${inView ? ' lr-in' : ''}`}
              style={{ transitionDuration: `${duration}ms`, transitionDelay: inView ? `${startDelay + i * wordDelay}ms` : '0ms' }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
};

// ── Multi-line variant — for headings authored as several explicit lines
// (rendered with a <br/> between them), each line's words continuing the
// same stagger count as the previous line so the whole heading reads as one
// continuous cascade. A line can carry its own className (e.g. an accent
// color on the last line). ──
type RevealLine = string | { text: string; className?: string; style?: React.CSSProperties };

interface RevealLinesProps {
  lines: RevealLine[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  wordDelay?: number;
  duration?: number;
  threshold?: number;
  startDelay?: number;
}

export const RevealLines: React.FC<RevealLinesProps> = ({
  lines,
  as: Tag = 'h2',
  className = '',
  style,
  wordDelay = 45,
  duration = 700,
  threshold = 0.15,
  startDelay = 0,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold });
  let wordIndex = 0;

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {lines.map((line, li) => {
        const text = typeof line === 'string' ? line : line.text;
        const lineClassName = typeof line === 'string' ? undefined : line.className;
        const lineStyle = typeof line === 'string' ? undefined : line.style;
        const words = text.split(' ');
        const rendered = words.map((word, wi) => {
          const i = wordIndex++;
          return (
            <React.Fragment key={wi}>
              <span className="lr-mask">
                <span
                  className={`lr-inner${inView ? ' lr-in' : ''}`}
                  style={{ transitionDuration: `${duration}ms`, transitionDelay: inView ? `${startDelay + i * wordDelay}ms` : '0ms' }}
                >
                  {word}
                </span>
              </span>
              {wi < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        });
        return (
          <React.Fragment key={li}>
            {(lineClassName || lineStyle) ? <span className={lineClassName} style={lineStyle}>{rendered}</span> : rendered}
            {li < lines.length - 1 && <br />}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};

export default ScrollAnimation;
