/**
 * The homepage hero: an industrial ecosystem diagram built from real DOM and
 * SVG rather than a rendered picture.
 *
 * ── Why it does not use HeroShell ────────────────────────────────────────
 * HeroShell is shared by this page and all six product-page heroes. It exists
 * to pin a photographic background with the clip-path/fixed technique, which
 * is the one thing this hero specifically must not do. Bending it to also
 * host a diagram would put a homepage-only concern into a component seven
 * pages depend on, so this hero owns its own shell and HeroShell is left
 * exactly as it was.
 *
 * ── Layer order ─────────────────────────────────────────────────────────
 *   backdrop → central system → connections → cards → copy
 * Connections sit above the central system so the nodes that anchor onto the
 * cylinder rim and platform edge stay visible, and below the cards so lines
 * terminate cleanly under a card border.
 *
 * ── State ownership ─────────────────────────────────────────────────────
 * Three pieces, none of them per-frame:
 *
 *   · `inView`   — one IntersectionObserver. Toggles `.ieh-idle`
 *                  (`animation-play-state: paused`) and pauses SMIL, which
 *                  `animation-play-state` cannot reach.
 *   · `active`   — the hovered/focused card id. Changes ONLY on
 *                  pointerenter / pointerleave / focus / blur. Threaded to
 *                  the cards (for their own state) and to HeroConnections
 *                  (to mark the matching line), and mirrored onto the stage
 *                  as `data-active` so CSS can quieten everything else with
 *                  a single rule instead of one per id.
 *   · `reduceMotion` — read once, matching the existing PlatformSection
 *                  pattern. Only the travelling nodes need it.
 *
 * No rAF loop, no interval, no per-frame state. Sequencing lives entirely in
 * CSS `animation-delay` against heroData's TIMING.
 */
import React, { useCallback, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { prefersReducedMotion } from '../../../utils/motion';
import { CORE_ID, compactLayout, desktopLayout, du } from './heroData';
import type { HeroLayout } from './heroData';
import HeroBackdrop from './HeroBackdrop';
import HeroCentralSystem from './HeroCentralSystem';
import HeroConnections from './HeroConnections';
import HeroProductCards from './HeroProductCards';
import HeroSourceCards from './HeroSourceCards';
import HeroSystemCards from './HeroSystemCards';

/* Matches the copy/stage stacking breakpoint in industrial-hero.css. Below
   this width the desktop canvas cannot stay legible (its `--u` falls under
   0.6, i.e. 16px labels at ~9px), so the compact canvas takes over. */
const COMPACT_QUERY = '(max-width: 1279px)';

interface IndustrialEcosystemHeroProps {
  id?: string;
  /** Hero copy — rendered into the reserved dark space on the left. */
  children: React.ReactNode;
  /** Rendered after the stage, still inside the section (the landing Ticker). */
  after?: React.ReactNode;
}

/* Hit area for the central system. The SVG layers are pointer-events:none
   (they must never swallow clicks), so the core needs an explicit target.
   Derived from the active layout's own geometry and bounded to the cylinder
   + platform, so it cannot overlap a card in either composition. */
function coreHit(l: HeroLayout) {
  const top = l.cylinder.topY - l.cylinder.ry;
  return {
    left: l.cylinder.cx - l.cylinder.rx,
    top,
    width: l.cylinder.rx * 2,
    height: l.platform.lower.cy + l.platform.lower.wall + l.platform.lower.ry - top,
  };
}

const IndustrialEcosystemHero: React.FC<IndustrialEcosystemHeroProps> = ({ id, children, after }) => {
  const reduceMotion = prefersReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  // Stable identities so the card lists don't re-render on unrelated updates.
  const onActivate = useCallback((next: string) => setActive(next), []);
  const onDeactivate = useCallback(() => setActive(null), []);

  // Not triggerOnce: the hero must go quiet again when scrolled past, and
  // this page is long. A small margin keeps it running slightly beyond the
  // fold so it never visibly stalls at the boundary.
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '120px' });

  /* The one place the two coordinate systems are chosen between. A JS mount
     gate (not two always-rendered trees behind a media query) because each
     tree carries ~250 SVG nodes plus its own SMIL timers — exactly the case
     docs/component-inventory.md reserves useMediaQuery for. Breakpoint is
     1280px to match the copy/stage stacking rule below. */
  const compact = useMediaQuery(COMPACT_QUERY);
  const layout = compact ? compactLayout : desktopLayout;
  const hit = coreHit(layout);

  const interaction = { active, onActivate, onDeactivate, layout };

  return (
    <section id={id} ref={ref} className={`ieh ieh--${layout.variant}${inView ? '' : ' ieh-idle'}`}>
      <div className="ieh-inner">
        <div
          className="ieh-stage"
          style={{ '--canvas-w': layout.stage.w, '--canvas-h': layout.stage.h } as React.CSSProperties}
          data-active={active ?? undefined}
          // Belt-and-braces for pointer capture loss (drag out of the window,
          // context menu, touch cancel): leaving the stage always clears.
          onPointerLeave={onDeactivate}
        >
          <HeroBackdrop mesh={layout.mesh} />
          <HeroCentralSystem layout={layout} />
          <HeroConnections active={inView} layout={layout} highlight={active} reduceMotion={reduceMotion} />
          <HeroSourceCards {...interaction} />
          <HeroProductCards {...interaction} />
          <HeroSystemCards {...interaction} />
          <div
            className="ieh-core-hit"
            aria-hidden="true"
            style={{
              left: du(hit.left),
              top: du(hit.top),
              width: du(hit.width),
              height: du(hit.height),
            }}
            onPointerEnter={(e) => {
              if (e.pointerType !== 'touch') onActivate(CORE_ID);
            }}
            onPointerLeave={onDeactivate}
          />
        </div>
        <div className="ieh-copy">{children}</div>
      </div>
      {after}
    </section>
  );
};

export default IndustrialEcosystemHero;
