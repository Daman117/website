import React from 'react';
import Ticker from './Ticker';
import { heroChips } from '../data/v2';

interface HeroProps {
  onOpenContact: (source?: string) => void;
}

const floatingBadges = [
  {
    cls: 'animate-float',
    icon: '✓',
    iconColor: '#10B981',
    title: '139 P&IDs structured',
    sub: 'enSTUDIO · <2 min per drawing',
  },
  {
    cls: 'animate-float-d2',
    icon: '?',
    iconColor: '#FDB022',
    title: '"What is the range of FT-3045?"',
    sub: 'enGRAM · Cited from Rev.4 p.12',
  },
  {
    cls: 'animate-float-d4',
    icon: '⬛',
    iconColor: '#2563EB',
    title: 'Air-gapped · No cloud',
    sub: 'All capabilities · On-premises only',
  },
];

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
      <div className="hero-glow1" />
      <div className="hero-glow2" />

      <div className="hero-layout">
        {/* ── Left ── */}
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

        {/* ── Right — floating badge cards ── */}
        <div className="hero-badges-panel" aria-hidden="true">
          {floatingBadges.map((b, i) => (
            <div
              key={i}
              className={`hero-badge-card ${b.cls} animate-item stagger-${i + 1}`}
            >
              <span className="hero-badge-icon" style={{ color: b.iconColor }}>{b.icon}</span>
              <div>
                <div className="hero-badge-title">{b.title}</div>
                <div className="hero-badge-sub">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Ticker />
    </section>
  );
};

export default Hero;
