import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  img?: string;
  titleClassName: string;
  subtitleClassName: string;
  descClassName: string;
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  Icon, title, subtitle, desc, color, img, titleClassName, subtitleClassName, descClassName, children,
}) => (
  <div
    className="card engram-cap-card enview-view-card"
    style={{ '--cap-color': color, ...(img ? { '--card-bg': `url(${img})` } : {}) } as React.CSSProperties}
  >
    {/* Background image — zooms on hover via CSS */}
    <div className="enview-view-card-img" />
    {/* Dark gradient overlay */}
    <div className="enview-view-card-overlay" />
    {/* Title — always visible at top */}
    <div className="enview-view-card-header">
      <div className="enview-view-card-icon"><Icon size={18} strokeWidth={1.75} /></div>
      <h3 className={titleClassName}>{title}</h3>
    </div>
    {/* Subtitle + desc — slides up on hover */}
    <div className="enview-view-card-text">
      <p className={subtitleClassName}>{subtitle}</p>
      <p className={descClassName}>{desc}</p>
    </div>
    {children}
  </div>
);

export default FeatureCard;
