/**
 * The enTIE hero — shell only.
 *
 * The photographic background (/entie.png) is gone. What is here is the copy
 * column — identical content to the old shared CapabilityHero call — over a
 * flat dark-navy field, and `.eth-visual`, holding the right two thirds of
 * the stage for the composition. That composition is currently the core
 * alone; the input and output columns land in it next.
 *
 * Why not CapabilityHero/HeroShell: both exist to pin a photographic
 * background, which is the one thing this hero must no longer do, and both
 * are shared by four other product pages. Same reasoning, and the same
 * shape, as EnstudioHero.
 *
 * Coordinate system, ready for the SVG layers: one fixed canvas (STAGE),
 * `--u` = one canvas pixel (see entie-hero.css). Artwork will scale with the
 * stage; the reading copy is in normal CSS units and does not.
 *
 * No animation yet — deliberately.
 */
import React from 'react';
import EntieConnectors from './EntieConnectors';
import EntieCore from './EntieCore';
import EntieHeroWave from './EntieHeroWave';
import EntieOutputs from './EntieOutputs';
import EntieSources from './EntieSources';
import { useEntieFlowAnimation } from './useEntieFlowAnimation';
import { useEntieHeroEntrance } from './useEntieHeroEntrance';

/** The stage's aspect ratio. A future composition owns its own viewBox and
 *  centres itself in whatever box it is given. */
const STAGE = { w: 1520, h: 760 } as const;

interface EntieHeroProps {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subText: string;
  ctaLabel: string;
  onCtaClick: () => void;
}

const EntieHero: React.FC<EntieHeroProps> = ({
  badgeText,
  titleLine1,
  titleLine2,
  subText,
  ctaLabel,
  onCtaClick,
}) => {
  const flowRef = useEntieFlowAnimation();
  /* The entrance owns the whole section: the copy here, and every SVG layer
     below it. See the hook for why it and the continuous animations never
     touch the same property. */
  const entranceRef = useEntieHeroEntrance();

  return (
  <section className="eth" ref={entranceRef}>
    {/* Bottom layer. First in the DOM and outside .eth-inner, so it paints
        behind every piece of content without needing to win a z-index race
        with the copy or the composition. */}
    <EntieHeroWave />

    <div className="eth-inner">
      <div
        className="eth-stage"
        style={{ '--canvas-w': STAGE.w, '--canvas-h': STAGE.h } as React.CSSProperties}
      >
        <div className="eth-copy">
          <span className="eth-badge">{badgeText}</span>
          <h1 className="eth-title">
            {titleLine1}
            <br />
            <span className="eth-accent">{titleLine2}</span>
          </h1>
          <p className="eth-sub">{subText}</p>
          <button className="cta-solid button-text btn-primary eth-cta" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        </div>

        {/* The composition: sources in, core, outputs out, with the lanes
            beneath them. Each is its own SVG layer sharing one viewBox,
            stacked in register by CSS, connectors first so the tiles and the
            core paint over their ends.

            The ref is the flow animation's scope — it has to reach across
            layers, since the packets live in the connector layer and the
            connection points they light up live in the core.

            Decorative — the copy beside it says the same thing in words, so
            it is hidden from assistive tech rather than labelled. */}
        <div className="eth-visual" ref={flowRef} aria-hidden="true">
          <EntieConnectors />
          <EntieSources />
          <EntieOutputs />
          <EntieCore />
        </div>
      </div>
    </div>
  </section>
  );
};

export default EntieHero;
