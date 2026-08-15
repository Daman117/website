import React from 'react';
import HeroShell from '../HeroShell';

interface CapabilityHeroProps {
  image: string;
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subText: string;
  ctaLabel: string;
  onCtaClick: () => void;
  classes: {
    content?: string;
    badge: string;
    title: string;
    accent: string;
    subtitle: string;
  };
}

const CapabilityHero: React.FC<CapabilityHeroProps> = ({
  image, badgeText, titleLine1, titleLine2, subText, ctaLabel, onCtaClick, classes,
}) => (
  <HeroShell image={image} contentClassName={`engram-hero engram-container ${classes.content || ''}`.trim()}>
    <div className="engram-hero-badge">
      <span className={classes.badge}>{badgeText}</span>
    </div>
    <h1 className={`engram-hero-h1 ${classes.title}`}>
      <span className="hero-line-mask">
        <span className="hero-line-inner hero-delay-150">{titleLine1}</span>
      </span>
      <span className="hero-line-mask">
        <span className={`hero-line-inner ${classes.accent} hero-delay-500`}>{titleLine2}</span>
      </span>
    </h1>
    <p className={`engram-hero-sub hero-fade-up ${classes.subtitle} hero-delay-900`}>
      {subText}
    </p>
    <div className="hero-fade-up u-flex u-gap-12 u-flex-wrap hero-delay-1500">
      <button className="cta-solid button-text btn-primary" onClick={onCtaClick}>
        {ctaLabel}
      </button>
    </div>
  </HeroShell>
);

export default CapabilityHero;
