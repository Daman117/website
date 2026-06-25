import React from 'react';
import { useInView } from 'react-intersection-observer';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;        // ms delay before animation starts
  duration?: number;     // ms
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  stagger?: number;      // if > 0, wraps each child with increasing delay
}

const directionMap = {
  up:    'sa-hidden-up',
  down:  'sa-hidden-down',
  left:  'sa-hidden-left',
  right: 'sa-hidden-right',
};

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

/* Staggered wrapper — each direct child gets an increasing delay */
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  baseDelay?: number;
  step?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  duration?: number;
}

export const ScrollStagger: React.FC<StaggerProps> = ({
  children,
  className = '',
  style,
  baseDelay = 0,
  step = 100,
  direction = 'up',
  threshold = 0.08,
  duration = 700,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold });

  return (
    <div ref={ref} className={`${className} sa-stagger-host`} style={style}>
      {React.Children.map(children, (child, i) =>
        child && React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ className?: string; style?: React.CSSProperties }>, {
              className: [
                (child as React.ReactElement<{ className?: string }>).props.className || '',
                'sa-base',
                directionMap[direction],
                inView ? 'sa-visible' : '',
              ].join(' ').trim(),
              style: {
                ...(child as React.ReactElement<{ style?: React.CSSProperties }>).props.style,
                transitionDuration: `${duration}ms`,
                transitionDelay: inView ? `${baseDelay + i * step}ms` : '0ms',
              },
            })
          : child
      )}
    </div>
  );
};

export default ScrollAnimation;
