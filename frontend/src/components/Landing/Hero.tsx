import React from 'react';
import IndustrialEcosystemHero from './IndustrialEcosystemHero/IndustrialEcosystemHero';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 1: HERO
//    The photographic HeroShell treatment has been replaced here by
//    IndustrialEcosystemHero — a real HTML/SVG composition of the plant,
//    its data sources, the six products and the systems enxco connects
//    out to. HeroShell itself is untouched and still serves the six
//    product-page heroes; only the homepage moved.
//
//    CONTENT PASS: the hero now carries one supporting sentence. The second
//    paragraph and the six capability pills were removed — the composition to
//    the right already names every product and every data source, so the pills
//    were restating it in words. Composition, delays and CTAs are untouched.
// ─────────────────────────────────────────────────────────────────
const Hero: React.FC<{ onOpenContact: (src?: string) => void }> = ({ onOpenContact }) => {
  return (
    <IndustrialEcosystemHero id="hero">
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
          enxco connects your engineering documents, operational data and live SCADA
          into one searchable layer of plant intelligence.
        </p>
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
          enxco connects your engineering documents, operational data and live SCADA
          into one searchable layer of plant intelligence.
        </p>
        <div className="hero-fade-up landing-hero-actions u-flex u-flex-wrap hero-delay-mobile-4">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Explore enxco')}>Explore enxco →</button>
          <button className="button-text btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
        </div>
      </div>
    </IndustrialEcosystemHero>
  );
};

export default Hero;
