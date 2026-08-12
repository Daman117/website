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
      {/* Desktop — full staged reveal, both trees always render; a media
          query decides which is visible (no JS branch, no first-paint flash). */}
      <div className="u-hide-mobile">
        <h1 className="engram-hero-h1 landing-hero-h1-text">
          <span className="hero-line-mask">
            <span className="hero-line-inner hero-delay-150">Your plant.</span>
          </span>
          <span className="hero-line-mask">
            <span className="hero-line-inner landing-hero-h1-accent hero-delay-500">Understood.</span>
          </span>
        </h1>
        <p className="engram-hero-sub hero-fade-up landing-hero-sub-text hero-delay-900">
          Everything your plant knows — P&amp;IDs, datasheets, procedures and live SCADA —
          made searchable in one place, running entirely on your own network.
        </p>
        <p className="engram-hero-body hero-fade-up landing-hero-body-text hero-delay-1100">
          Each product works on its own, and works better alongside the others. Nothing
          you upload ever leaves your building.
        </p>
        <div className="hero-fade-up landing-hero-chips u-flex u-flex-wrap u-gap-10 hero-delay-1300" aria-label="Platform capabilities">
          {heroChips.map((c) => (
            <span key={c} className="badge hero-chip-badge landing-hero-chip">
              {c}
            </span>
          ))}
        </div>
        <div className="hero-fade-up landing-hero-actions u-flex u-flex-wrap hero-delay-1500">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Explore enxco')}>Explore enxco →</button>
          <button className="button-text btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
        </div>
      </div>

      {/* Mobile — same content order as desktop, single-stage fade */}
      <div className="u-hide-desktop">
        <h1 className="engram-hero-h1 landing-hero-h1-text">
          <span className="hero-fade-up hero-mobile-line hero-delay-mobile-1">Your plant.</span>{' '}
          <span className="hero-fade-up hero-mobile-line landing-hero-h1-accent hero-delay-mobile-2">Understood.</span>
        </h1>
        <p className="engram-hero-sub hero-fade-up landing-hero-sub-text hero-delay-mobile-2">
          Everything your plant knows — P&amp;IDs, datasheets, procedures and live SCADA —
          made searchable in one place, running entirely on your own network.
        </p>
        <p className="engram-hero-body hero-fade-up landing-hero-body-text hero-delay-mobile-3">
          Each product works on its own, and works better alongside the others. Nothing
          you upload ever leaves your building.
        </p>
        <div className="hero-fade-up landing-hero-chips u-flex u-flex-wrap u-gap-10 hero-delay-mobile-3" aria-label="Platform capabilities">
          {heroChips.map((c) => (
            <span key={c} className="badge hero-chip-badge landing-hero-chip">
              {c}
            </span>
          ))}
        </div>
        <div className="hero-fade-up landing-hero-actions u-flex u-flex-wrap hero-delay-mobile-4">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Explore enxco')}>Explore enxco →</button>
          <button className="button-text btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
        </div>
      </div>

  </HeroShell>
  );
};

export default Hero;
