/**
 * The ribbon bundle carrying extracted knowledge from the front sheet into
 * the core.
 *
 * Seven ribbons leave the P&ID's right edge at staggered heights and
 * converge on the top disc, so the bundle narrows as it arrives — that
 * convergence is what makes it read as ingestion rather than decoration.
 *
 * Each ribbon gets its OWN gradient rather than one shared gradient using
 * currentColor: inside defs, a stop's currentColor resolves against the
 * gradient's own context, not the path referencing it, so a shared version
 * paints with no colour at all.
 *
 * Light travels the ribbons continuously: each carries a few dots on
 * animateMotion, offset by a negative `begin` so a ribbon is already
 * populated on the first frame and dots keep arriving with no gap. Ribbons
 * are staggered against each other too, so the bundle never pulses in unison.
 *
 * The fade at both ends is done by ONE gradient mask rather than an opacity
 * tween per dot — half the timers for the same result.
 *
 * The bundle belongs to whatever sheet is SETTLED in the front slot. The
 * ribbons leave that slot's right edge, so during a carousel step there is
 * nothing there to leave from. Rather than blinking out, they RETRACT into
 * the slot as the outgoing sheet goes and then grow back out of the arriving
 * one — a dash the length of the whole path, with the offset transitioned
 * from 1 to 0. `pathLength="1"` normalises every ribbon to the same dash
 * scale, so seven curves of different lengths draw in step with no measuring.
 *
 * ── Orchestration ───────────────────────────────────────────────────────
 * The dots run continuously — the bundle is the medium, always carrying
 * something. What is orchestrated is the SURGE: each ribbon is assigned to a
 * document's slot and brightens shortly after that sheet is read, so the
 * bundle pulses in waves down the stack rather than as one block.
 */
import React from 'react';
import { CORE_ACTIVE, SLOTS, TIMING, ribbonDocId, slotAt } from './engramHeroData';
import type { EngramLayout } from './engramLayouts';
import { useSvgPause } from './useSvgPause';

interface Props {
  active: boolean;
  reduceMotion: boolean;
  /** Hovered element id, so a sheet can light its own streams. */
  highlight: string | null;
  /** True while a sheet is moving between slots. */
  stepping: boolean;
  L: EngramLayout;
}

const HeroStreams: React.FC<Props> = ({ active, reduceMotion, highlight, stepping, L }) => {
  const svgRef = useSvgPause(active);
  const lit = (i: number) =>
    highlight === ribbonDocId(i) || highlight === CORE_ACTIVE ? ' is-active' : '';

  const xs = L.ribbons.flatMap((r) => [r.from.x, r.to.x]);
  const ys = L.ribbons.flatMap((r) => [r.from.y, r.to.y]);
  const flowX0 = Math.min(...xs);
  const flowX1 = Math.max(...xs);
  const flowY0 = Math.min(...ys) - 40;
  const flowY1 = Math.max(...ys) + 40;

  return (
  <svg
    ref={svgRef}
    className={`egh-layer egh-layer-streams${stepping ? ' is-detached' : ''}`}
    viewBox={`0 0 ${L.stage.w} ${L.stage.h}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {L.ribbons.map((r, i) => (
        <linearGradient key={i} id={`egh-ribbon-${i}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={r.color} stopOpacity="0.12" />
          <stop offset="32%" stopColor={r.color} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.95" />
        </linearGradient>
      ))}
      {/* Dots emerge just clear of the sheet and dissolve into the core */}
      <linearGradient id="egh-flow-mask-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity="0" />
        <stop offset="16%" stopColor="#fff" stopOpacity="1" />
        <stop offset="78%" stopColor="#fff" stopOpacity="1" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0.25" />
      </linearGradient>
      {/* Derived from the bundle's own extents rather than literals, so the
          fade stays on the ribbons wherever the sheet stack is placed. */}
      <mask id="egh-flow-mask" maskUnits="userSpaceOnUse">
        <rect
          x={flowX0}
          y={flowY0}
          width={flowX1 - flowX0}
          height={flowY1 - flowY0}
          fill="url(#egh-flow-mask-grad)"
        />
      </mask>
    </defs>

    {/* Soft under-glow, so the bundle reads as light rather than wire */}
    <g fill="none" strokeLinecap="round">
      {L.ribbons.map((r, i) => (
        <path
          key={`g${i}`}
          className="egh-ribbon-glow"
          d={L.ribbonPath(r)}
          pathLength="1"
          stroke={r.color}
          strokeOpacity="0.13"
          strokeWidth={r.w * 4}
        />
      ))}
    </g>

    <g fill="none" strokeLinecap="round">
      {L.ribbons.map((r, i) => (
        <path
          key={i}
          className={`egh-ribbon${lit(i)}`}
          style={{ '--slot': `${slotAt(i % SLOTS)}s` } as React.CSSProperties}
          d={L.ribbonPath(r)}
          pathLength="1"
          stroke={`url(#egh-ribbon-${i})`}
          strokeWidth={r.w}
        />
      ))}
    </g>

    {/* Light riding the ribbons */}
    {!reduceMotion && (
      <g mask="url(#egh-flow-mask)" className="egh-ribbon-dots">
        {L.ribbons.map((r, i) =>
          Array.from({ length: L.ribbonDots }, (_, j) => {
            const dur = TIMING.ribbon * (1 + (i % 3) * 0.14);
            return (
              <circle key={`${i}-${j}`} r={1.1 + ((i + j) % 3) * 0.5} fill="#e0f2fe" opacity="0.9">
                <animateMotion
                  dur={`${dur.toFixed(2)}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                  path={L.ribbonPath(r)}
                  // Negative begin drops each dot mid-run, so the ribbon is
                  // full on the first frame and the seven never sync up.
                  begin={`${(-(j / L.ribbonDots) * dur - i * 0.42).toFixed(2)}s`}
                />
              </circle>
            );
          })
        )}
      </g>
    )}
  </svg>
  );
};

export default HeroStreams;
