import React from 'react';
import Ticker from './Ticker';

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
          enX is a family of industrial intelligence capabilities — built for the plant floor, not the boardroom. Local. Open. Connected.
        </p>
        <p className="hero-body fu fu4">
          From live process visibility to document intelligence, engineering configuration, and structural plant understanding — each capability is complete on its own and more powerful together.
        </p>
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
