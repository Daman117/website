/**
 * The enSTUDIO hero — shell only.
 *
 * The photographic background is gone. What is here is the copy column
 * (identical content to the old shared CapabilityHero call) over a flat
 * dark-navy field, and EnstudioHeroVisual — a real SVG composition — in the
 * right two thirds of the stage.
 *
 * Why not CapabilityHero/HeroShell: both exist to pin a photographic
 * background, which is the one thing this hero must not do, and both are
 * shared by the other product pages. Same reasoning as EngramHero/EnviewHero,
 * and the props mirror CapabilityHero's so EnstudioPage passes the same copy.
 *
 * Coordinate system, ready for the SVG layers: one fixed canvas (STAGE),
 * `--u` = one canvas pixel (see enstudio-hero.css). Artwork will scale with
 * the stage; the reading copy is in normal CSS units and does not.
 *
 * No animation yet — deliberately. `ref`/`inView` arrive with it.
 */
import React from 'react';
import EnstudioHeroVisual from './EnstudioHeroVisual';
import EnstudioHeroWave from './EnstudioHeroWave';
import { useEnstudioHeroEntrance } from './useEnstudioHeroEntrance';

/** The stage's aspect ratio. Not the composition's — EnstudioHeroVisual owns
 *  its own square viewBox and centres itself in whatever box it is given. */
const STAGE = { w: 1520, h: 760 } as const;

interface EnstudioHeroProps {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subText: string;
  bodyText: string;
  chips: string[];
  ctaLabel: string;
  onCtaClick: () => void;
}

const EnstudioHero: React.FC<EnstudioHeroProps> = ({
  badgeText,
  titleLine1,
  titleLine2,
  subText,
  bodyText,
  chips,
  ctaLabel,
  onCtaClick,
}) => {
  /* The entrance owns the whole section: the copy here, and the two SVG
     layers below it. The continuous animations stay where they are — see the
     hook for why the two never touch the same property. */
  const ref = useEnstudioHeroEntrance();

  return (
  <section className="esh" ref={ref}>
    {/* Bottom layer. First in the DOM and outside .esh-inner, so it paints
        behind every piece of content without needing to win a z-index race
        with the copy or the composition. */}
    <EnstudioHeroWave />

    <div className="esh-inner">
      <div
        className="esh-stage"
        style={{ '--canvas-w': STAGE.w, '--canvas-h': STAGE.h } as React.CSSProperties}
      >
        <div className="esh-copy">
          <span className="esh-badge">{badgeText}</span>
          <h1 className="esh-title">
            {titleLine1}
            <br />
            <span className="esh-accent">{titleLine2}</span>
          </h1>
          <p className="esh-sub">{subText}</p>
          <p className="esh-body">{bodyText}</p>
          <div className="esh-chips" aria-label="enSTUDIO capabilities">
            {chips.map((c) => (
              <span key={c} className="esh-chip">
                {c}
              </span>
            ))}
          </div>
          <button className="cta-solid button-text btn-primary esh-cta" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        </div>

        {/* The composition. Decorative: the copy beside it says the same thing
            in words, so it is hidden from assistive tech rather than labelled. */}
        <div className="esh-visual" aria-hidden="true">
          <EnstudioHeroVisual />
        </div>
      </div>
    </div>
  </section>
  );
};

export default EnstudioHero;
