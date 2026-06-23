import React from 'react';
import Ticker from './Ticker';
import { heroChips } from '../data/v2';

interface HeroProps {
  onOpenContact: (source?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  return (
    <section id="hero">
      <div className="hero-grid">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0L0 0 0 48" fill="none" stroke="#2563EB" strokeWidth=".5" opacity=".4"/>
            </pattern>
          </defs>
          <rect width="100%" height="150%" fill="url(#g)"/>
        </svg>
      </div>
      <div className="hero-glow1"></div>
      <div className="hero-glow2"></div>

      <div className="hero-left">
        <span className="eyebrow fu fu1">enSAR Solutions · enX Division</span>
        <h1 className="hero-h1 fu fu2">
          Your plant.<br/>
          <span className="light">Understood.</span>
        </h1>
        <p className="hero-sub fu fu3">
          The local-first industrial intelligence platform that turns drawings, documents, SCADA systems and engineering knowledge into structured, searchable plant intelligence.
        </p>
        <p className="hero-body fu fu4">
          Each capability is complete on its own and more powerful together — and it all runs entirely inside your network.
        </p>
        <div className="hero-chips fu fu4" aria-label="Platform capabilities">
          {heroChips.map((c) => (
            <span key={c} className="hero-chip">{c}</span>
          ))}
        </div>
        <div className="hero-ctas fu fu4">
          <button className="btn-primary" onClick={() => onOpenContact('Explore enX')}>Explore enX →</button>
          <button className="btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
        </div>
      </div>

      <Ticker />
    </section>
  );
};

export default Hero;
