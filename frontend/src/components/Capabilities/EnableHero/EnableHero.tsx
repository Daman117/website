/**
 * The enABLE hero.
 *
 * Copy over a drawn background: a wave entering from the left and a
 * perspective grid across the lower portion, both in HeroBackdrop. No
 * photograph — the background is structure, not an image behind glass.
 *
 * The right half carries the engineering figure — the plant, the model it
 * reduces to, and the plots that model produces. Five independent groups, so
 * an Anime.js timeline can drive them separately later; see HeroFigure.
 *
 * The pipeline rail that used to live here (ingest / analyze / insight /
 * action, with a card under each) has been taken out of the render. Its
 * pieces — StageIcons, the stage and panel data, and their styles — are still
 * in this folder and are one import away from coming back; they are left
 * rather than deleted because none of it has been committed yet.
 *
 * Props mirror the shared CapabilityHero's, so the page's hero call kept its
 * shape when the photographic version was swapped out. The words are
 * unchanged; only what stands behind them is.
 */
import React from 'react';
import { Activity, ArrowRight, Laptop, Lock, Play } from 'lucide-react';
import { prefersReducedMotion } from '../../../utils/motion';
import HeroBackdrop from './HeroBackdrop';

/* A glyph per capability. Keyed by the chip's own text, so the page keeps
   owning the wording and this file only decides how each one is marked. */
const CHIP_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'Eigenvalue Analysis': Activity,
  'Desktop App': Laptop,
  'Air-Gapped': Lock,
  'Live Simulation': Play,
};
import HeroFigure from './HeroFigure';

interface EnableHeroProps {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subText: string;
  bodyText: string;
  chips: string[];
  ctaLabel: string;
  onCtaClick: () => void;
}

const EnableHero: React.FC<EnableHeroProps> = ({
  badgeText,
  titleLine1,
  titleLine2,
  subText,
  bodyText,
  chips,
  ctaLabel,
  onCtaClick,
}) => {
  const reduceMotion = prefersReducedMotion();

  return (
  <section className="eab">
    {/* Drawn, not approximated with gradients: the reference's background has
        structure — a ribbon with countable strands, a grid that recedes to a
        vanishing point — and a radial gradient can only ever be a smudge in
        roughly the right place. */}
    <HeroBackdrop reduceMotion={reduceMotion} />

    <div className="eab-inner">
      <div className="eab-copy">
        <span className="eab-badge">{badgeText}</span>
        <h1 className="eab-title">
          {titleLine1}
          <br />
          <span className="eab-accent">{titleLine2}</span>
        </h1>
        <p className="eab-sub">{subText}</p>
        <p className="eab-body">{bodyText}</p>
        <div className="eab-chips" aria-label="enABLE capabilities">
          {chips.map((c) => {
            const Icon = CHIP_ICON[c];
            return (
              <span key={c} className="eab-chip">
                {Icon && <Icon className="eab-chip-icon" />}
                {c}
              </span>
            );
          })}
        </div>
        <button className="cta-solid button-text btn-primary eab-cta" onClick={onCtaClick}>
          {ctaLabel}
          <ArrowRight className="eab-cta-arrow" />
        </button>
      </div>

      <div className="eab-figure">
        <HeroFigure reduceMotion={reduceMotion} />
      </div>
    </div>
  </section>
  );
};

export default EnableHero;
