import React from 'react';
import { TriangleAlert } from 'lucide-react';

interface FlashIconProps {
  inView: boolean;
  index: number;
  className: string;
}

const FlashIcon: React.FC<FlashIconProps> = ({ inView, index, className }) => (
  <div
    className={inView ? `${className} flash` : className}
    style={{ '--icon-delay': `${index * 0.6}s` } as React.CSSProperties}
  >
    <TriangleAlert size={22} strokeWidth={1.75} />
  </div>
);

export default FlashIcon;
