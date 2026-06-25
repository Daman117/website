import React from 'react';
import { motion } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  delay?: number;
  amount?: number;
}

const ease: Easing = [0.16, 1, 0.3, 1];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease },
  },
};

const StaggerGrid: React.FC<StaggerGridProps> = ({
  children,
  className,
  style,
  stagger = 0.09,
  delay = 0,
  amount = 0.1,
}) => {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={container}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <motion.div variants={itemVariants} style={{ display: 'contents' }}>
            {child}
          </motion.div>
        ) : null
      )}
    </motion.div>
  );
};

export default StaggerGrid;
