import React, { useState, useEffect } from 'react';
import { heroChips } from '../../data/v2';
import HeroShell from '../HeroShell';
import Ticker from './shared/Ticker';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 1: HERO
//    Same treatment as the enVIEW capability-page hero: a bounded,
//    scoped background-attachment:fixed photo, a bottom-anchored dark
//    gradient for legibility, and a single-column text block pinned
//    to the bottom of the image.
// ─────────────────────────────────────────────────────────────────
// Fires once per session (module state survives SPA nav, resets on refresh):
// the ticker slides in once the intro text has finished revealing. Scroll is
// never locked — users who scroll early simply cut the show short.
let heroIntroPlayed = false;
const HERO_INTRO_MS = 1800;

const Hero: React.FC<{ onOpenContact: (src?: string) => void }> = ({ onOpenContact }) => {
  const [introDone, setIntroDone] = useState(heroIntroPlayed);

  useEffect(() => {
    if (heroIntroPlayed) return;
    const t = setTimeout(() => {
      // Only mark "played" once the timer actually completes — setting this
      // at the start instead makes React StrictMode's dev-only double-invoke
      // (mount -> cleanup -> mount) skip the real timer on the second mount.
      heroIntroPlayed = true;
      setIntroDone(true);
    }, HERO_INTRO_MS);
    return () => clearTimeout(t);
  }, []);

  return (
  <HeroShell id="hero" image="/bg-image.webp" contentClassName="section" after={<Ticker visible={introDone} />}>
      <h1 className="engram-hero-h1 landing-hero-h1-text">
        <span className="hero-line-mask">
          <span className="hero-line-inner hero-delay-150">Your plant.</span>
        </span>
        <span className="hero-line-mask">
          <span className="hero-line-inner landing-hero-h1-accent hero-delay-500">Understood.</span>
        </span>
      </h1>
      <p className="engram-hero-sub hero-fade-up landing-hero-sub-text hero-delay-900">
        The local-first industrial intelligence platform that turns drawings, documents, SCADA
        systems and engineering knowledge into structured, searchable plant intelligence.
      </p>
      <p className="engram-hero-body hero-fade-up landing-hero-body-text hero-delay-1100">
        Each capability is complete on its own and more powerful together — and it all runs
        entirely inside your network.
      </p>
      <div className="hero-fade-up landing-hero-chips u-flex u-flex-wrap u-gap-10 hero-delay-1300" aria-label="Platform capabilities">
        {heroChips.map((c) => (
          <span key={c} className="badge hero-chip-badge landing-hero-chip">
            {c}
          </span>
        ))}
      </div>
      <div className="hero-fade-up landing-hero-actions u-flex u-flex-wrap hero-delay-1500">
        <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Explore enxplant')}>Explore enxplant →</button>
        <button className="button-text btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
      </div>
  </HeroShell>
  );
};

export default Hero;
