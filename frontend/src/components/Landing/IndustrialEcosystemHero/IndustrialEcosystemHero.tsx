/**
 * The homepage hero shell: reserved dark space on the left for the copy, the
 * plant-intelligence composition on the right.
 *
 * ── Why it does not use HeroShell ────────────────────────────────────────
 * HeroShell is shared by this page and all six product-page heroes. It exists
 * to pin a photographic background with the clip-path/fixed technique, which
 * is the one thing this hero specifically must not do. Bending it to also
 * host a diagram would put a homepage-only concern into a component seven
 * pages depend on, so this hero owns its own shell and HeroShell is left
 * exactly as it was.
 *
 * ── State ───────────────────────────────────────────────────────────────
 * One boolean: which coordinate system to mount. The composition itself is
 * static — no observer, no timers, no per-frame React state, and no entrance
 * animation, so it is in its final form on the first paint.
 */
import React from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { compactLayout, desktopLayout } from './heroData';
import HeroComposition from './HeroComposition';

/* Matches the copy/stage stacking breakpoint in industrial-hero.css. Below
   this width the desktop canvas cannot stay legible — the stage caps near
   420px, which would render its 17px labels at about 4px. */
const COMPACT_QUERY = '(max-width: 1279px)';

interface IndustrialEcosystemHeroProps {
  id?: string;
  /** Hero copy — rendered into the reserved dark space on the left. */
  children: React.ReactNode;
}

const IndustrialEcosystemHero: React.FC<IndustrialEcosystemHeroProps> = ({ id, children }) => {
  /* A JS mount gate rather than two always-rendered trees behind a media
     query: each tree carries the full plant, so mounting both would double
     the node count for one of them to be display:none. */
  const layout = useMediaQuery(COMPACT_QUERY) ? compactLayout : desktopLayout;

  return (
    <section id={id} className={`ieh ieh--${layout.variant}`}>
      <div className="ieh-inner">
        <div
          className="ieh-stage"
          style={{ '--canvas-w': layout.stage.w, '--canvas-h': layout.stage.h } as React.CSSProperties}
        >
          <HeroComposition layout={layout} />
        </div>
        <div className="ieh-copy">{children}</div>
      </div>
    </section>
  );
};

export default IndustrialEcosystemHero;
