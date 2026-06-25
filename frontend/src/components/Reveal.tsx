import React from 'react';
import { motion } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  amount?: number;
}

const ease: Easing = [0.16, 1, 0.3, 1];
const DIST = 36;

function buildVariants(direction: Direction, duration: number, delay: number): Variants {
  const hidden: Record<string, number> = { opacity: 0 };
  if (direction === 'up')    { hidden['y'] = DIST; }
  if (direction === 'down')  { hidden['y'] = -DIST; }
  if (direction === 'left')  { hidden['x'] = DIST; }
  if (direction === 'right') { hidden['x'] = -DIST; }

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease },
    },
  };
}

const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  className,
  style,
  amount = 0.15,
}) => (
  <motion.div
    className={className}
    style={style}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount }}
    variants={buildVariants(direction, duration, delay)}
  >
    {children}
  </motion.div>
);

export default Reveal;
