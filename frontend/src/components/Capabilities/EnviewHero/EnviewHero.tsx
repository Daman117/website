/**
 * The enVIEW hero — a real HTML/SVG composition, not a photograph.
 *
 * Same architecture as the enGRAM hero, and the same reasons:
 *
 *   · ONE fixed design canvas (STAGE) with `--u` as one canvas pixel, so the
 *     wave, the room and the dashboard share one geometry and scale together
 *     with no measuring and no ResizeObserver;
 *   · layers stacked in the stage box, each with the same viewBox, so they
 *     stay in perfect register;
 *   · the reading copy in normal CSS units, NOT in `--u` — artwork should
 *     scale with the stage, body text should not.
 *
 * Four layers, back to front:
 *
 *   room  — the control room: floor, light strips, glazed wall, consoles
 *   wave  — the digital wave across the left
 *   copy  — the marketing column
 *   dash  — the SCADA screen, the subject of the frame
 *
 * The props mirror the shared CapabilityHero's, so swapping this in on
 * EnviewPage was a one-line change and the page's content stayed where it
 * was.
 *
 * ── Entrance ────────────────────────────────────────────────────────────
 * The reveal is staged in CSS, on WRAPPERS only — the layers, the panel
 * frame, each panel, and the groups inside them. Never on an element that
 * also carries a loop, because two animations on one property simply fight
 * and the later declaration wins. Every entrance keyframe ends on the
 * element's resting style with `both`, so the loops it hands over to start
 * from exactly where it stopped and reduced motion lands on the static
 * composition.
 *
 * `reduceMotion` is read once, matching the PlatformSection pattern, and only
 * gates SMIL — CSS is already covered by the global rule.
 *
 * Off-screen the hero goes quiet: `.evh-idle` pauses every CSS loop, and the
 * wave's SMIL timeline is paused directly, since animation-play-state cannot
 * reach it.
 */
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { prefersReducedMotion } from '../../../utils/motion';
import HeroEnvironment from './HeroEnvironment';
import HeroWave from './HeroWave';
import ScadaDashboard from './ScadaDashboard';
import { STAGE } from './enviewHeroData';

interface EnviewHeroProps {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subText: string;
  ctaLabel: string;
  onCtaClick: () => void;
}

const EnviewHero: React.FC<EnviewHeroProps> = ({
  badgeText,
  titleLine1,
  titleLine2,
  subText,
  ctaLabel,
  onCtaClick,
}) => {
  const reduceMotion = prefersReducedMotion();
  /* Not triggerOnce: the hero has to go quiet again once scrolled past. The
     CSS loops stop via `animation-play-state`; SMIL ignores that and is
     paused directly, inside HeroWave. */
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '160px' });

  return (
  <section ref={ref} className={`evh${inView ? '' : ' evh-idle'}`}>
    <div className="evh-inner">
      <div
        className="evh-stage"
        style={{ '--canvas-w': STAGE.w, '--canvas-h': STAGE.h } as React.CSSProperties}
      >
        <HeroEnvironment />
        <HeroWave reduceMotion={reduceMotion} active={inView} />

        <div className="evh-copy">
          <span className="evh-badge">{badgeText}</span>
          <h1 className="evh-title">
            {titleLine1}
            <br />
            <span className="evh-accent">{titleLine2}</span>
          </h1>
          <p className="evh-sub">{subText}</p>
          <button className="cta-solid button-text btn-primary evh-cta" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        </div>

        <ScadaDashboard reduceMotion={reduceMotion} />
      </div>
    </div>
  </section>
  );
};

export default EnviewHero;
