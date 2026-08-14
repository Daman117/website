/**
 * The enGRAM hero: a real HTML/SVG composition of the knowledge pipeline.
 *
 * ── Why it does not use CapabilityHero / HeroShell ───────────────────────
 * Both are shared — CapabilityHero by all six product pages, HeroShell by
 * those plus the landing page. They exist to pin a photographic background
 * with the clip-path/fixed technique, which is the one thing this hero must
 * not do. Bending either would push an enGRAM-only concern into components
 * seven pages depend on, so this hero owns its own shell and both are left
 * exactly as they were. The content props mirror CapabilityHero's, so
 * EngramPage passes the same copy it always did.
 *
 * ── Layer order ─────────────────────────────────────────────────────────
 *   terrain → documents → streams → core → network → nodes → copy
 * Streams sit under the core so inbound records read as absorbed rather than
 * stopping at a wall, and under the nodes so links terminate beneath them.
 *
 * ── Coordinate system ───────────────────────────────────────────────────
 * One canvas (engramHeroData.STAGE). Every SVG layer uses it as its viewBox
 * and the copy is positioned as a percentage of the same box, so nothing is
 * measured at runtime.
 *
 * ── Animation ownership ─────────────────────────────────────────────────
 * Two pieces of state, neither per-frame:
 *   · `inView`      one IntersectionObserver. SMIL ignores
 *                   animation-play-state, so each SVG layer that carries
 *                   animateMotion pauses its own timeline on this signal.
 *   · `reduceMotion` read once, matching the PlatformSection pattern. Only
 *                   the SMIL layers need it; the core's CSS breath is
 *                   already handled by the global rule in index.css.
 *   · `hover`       the id of the hovered sheet, node or the core. Changes
 *                   only on pointerenter/leave, mirrored onto the stage as
 *                   `data-active` so CSS can quieten unrelated links with a
 *                   single rule rather than one per id.
 * No rAF loop, no interval, no per-frame state.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { prefersReducedMotion } from '../../../utils/motion';
import HeroDocuments from './HeroDocuments';
import HeroKnowledgeCore from './HeroKnowledgeCore';
import HeroKnowledgeLayer from './HeroKnowledgeLayer';
import HeroNodes from './HeroNodes';
import HeroStreams from './HeroStreams';
import HeroTerrain from './HeroTerrain';
import { CARD_MOVE, CARD_STEP, ENTRANCE_END } from './engramHeroData';
import { compactLayout, desktopLayout } from './engramLayouts';

/* Matches the copy/stage stacking breakpoint in engram-hero.css. Below this
   width the desktop canvas cannot stay legible — its `--u` falls under 0.5 —
   so the compact canvas takes over. */
const COMPACT_QUERY = '(max-width: 1279px)';

export interface EngramHeroProps {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subText: string;
  bodyText: string;
  chips: string[];
  ctaLabel: string;
  onCtaClick: () => void;
}

const EngramHero: React.FC<EngramHeroProps> = ({
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
  // Not triggerOnce: the hero must go quiet again once scrolled past.
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '140px' });
  /* The one place the two coordinate systems are chosen between. A JS mount
     gate rather than two always-rendered trees, because each carries a few
     hundred SVG nodes plus its own SMIL timers — the case
     docs/component-inventory.md reserves useMediaQuery for. */
  const compact = useMediaQuery(COMPACT_QUERY);
  const L = compact ? compactLayout : desktopLayout;

  /* The carousel's clock lives here, not in HeroDocuments, because the
     streams need it too: a ribbon leaves the FRONT SLOT's right edge, so
     while the incoming sheet is still travelling there is nothing for it to
     leave from and it would hang in space. */
  const [shift, setShift] = useState(0);
  const [stepping, setStepping] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let interval = 0;
    let settle = 0;

    const step = () => {
      setShift((s) => s + 1);
      setStepping(true);
      settle = window.setTimeout(() => setStepping(false), CARD_MOVE * 1000);
    };

    /* Held until the entrance has finished. Starting the interval at mount
       meant the first sheet moved while the graph was still arriving, which
       read as two unrelated things happening rather than one system starting.
       The interval begins after the delay, so the opening sheet also gets a
       full slot before it is replaced. */
    const start = window.setTimeout(() => {
      interval = window.setInterval(step, CARD_STEP * 1000);
    }, ENTRANCE_END * 1000);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
      window.clearTimeout(settle);
    };
  }, [reduceMotion]);

  const [hover, setHover] = useState<string | null>(null);
  const onActivate = useCallback((id: string) => setHover(id), []);
  const onDeactivate = useCallback(() => setHover(null), []);

  const flow = { active: inView, reduceMotion, L };
  const touch = { active: hover, onActivate, onDeactivate, L };

  return (
  <section ref={ref} className={`egh egh--${L.variant}${inView ? '' : ' egh-idle'}`}>
    <div className="egh-inner">
      <div
        className="egh-stage"
        style={{ '--canvas-w': L.stage.w, '--canvas-h': L.stage.h } as React.CSSProperties}
        data-active={hover ?? undefined}
        // Belt and braces for pointer capture loss: leaving the stage clears.
        onPointerLeave={onDeactivate}
      >
        <HeroTerrain {...flow} />
        <HeroDocuments {...touch} shift={shift} />
        <HeroStreams {...flow} highlight={hover} stepping={stepping} />
        <HeroKnowledgeCore {...touch} />
        <HeroKnowledgeLayer {...flow} highlight={hover} />
        <HeroNodes {...touch} />

        <div className="egh-copy">
          <span className="egh-badge">{badgeText}</span>
          <h1 className="egh-title">
            {titleLine1}
            <br />
            <span className="egh-accent">{titleLine2}</span>
          </h1>
          <p className="egh-sub">{subText}</p>
          <p className="egh-body">{bodyText}</p>
          <div className="egh-chips" aria-label="enGRAM capabilities">
            {chips.map((c) => (
              <span key={c} className="egh-chip">
                {c}
              </span>
            ))}
          </div>
          <button className="cta-solid button-text btn-primary egh-cta" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  </section>
  );
};

export default EngramHero;
