/**
 * The enTIE connector layer — the lanes between the tiles and the core.
 *
 * Eight lanes: four carrying material in from the sources, four carrying
 * results out to the outputs. Every lane is three elements, never merged:
 *
 *   .entie-connector        the base line, always visible
 *   .entie-connector-pulse  a short bright dash that travels the line
 *   .entie-flow-particle    the packet itself
 *
 * ── Why a separate pulse path ───────────────────────────────────────────
 * The brief asks for a signal travelling THROUGH the line, with the base
 * still visible and no whole-line flash. That is a short dash moving along a
 * second copy of the same curve: the base keeps its own steady stroke
 * underneath while the highlight passes over it. Turning the base itself
 * into dashes would have broken the line whenever nothing was flowing.
 *
 * The dash itself is owned by Anime's drawable at animation time, expressed
 * in path fractions, so the same segment length works on all eight lanes
 * regardless of their real lengths and nothing here has to declare one.
 *
 * ── Why this is its own SVG ─────────────────────────────────────────────
 * Same reason as the sources and outputs: a layer on the shared viewBox,
 * stacked in register by CSS, drawn first so the tiles and the core paint
 * over its ends. None of the existing components were touched.
 *
 * No animation here — useEntieFlowAnimation drives all of it by selector.
 */
import React from 'react';
import {
  CANVAS,
  NODE_ROWS,
  OUTPUT_KEYS,
  SOURCE_KEYS,
  outputConnector,
  sourceConnector,
} from './entieHeroData';

/** The eight lanes, in flow order: everything in, then everything out. */
const LANES = [
  ...SOURCE_KEYS.map((key, i) => ({
    dir: 'source' as const,
    key,
    index: i,
    d: sourceConnector(NODE_ROWS[i]),
  })),
  ...OUTPUT_KEYS.map((key, i) => ({
    dir: 'output' as const,
    key,
    index: i,
    d: outputConnector(NODE_ROWS[i]),
  })),
];

const EntieConnectors: React.FC = () => (
  <svg
    className="entie-visual entie-layer-connectors"
    viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
    preserveAspectRatio="xMidYMid meet"
    role="presentation"
    focusable="false"
  >
    {/* Base lines. Drawn as their own group so the whole bus can be dimmed
        or revealed in one target later without touching the highlights. */}
    <g className="entie-connectors" fill="none">
      {LANES.map((lane) => (
        <path
          key={`base-${lane.dir}-${lane.key}`}
          id={`eth-conn-${lane.dir}-${lane.key}`}
          className={`entie-connector entie-${lane.dir}-connector entie-flow-path`}
          data-animation="connector"
          data-flow={`${lane.dir}-${lane.key}`}
          data-dir={lane.dir}
          data-index={lane.index}
          d={lane.d}
        />
      ))}
    </g>

    {/* Travelling highlights. Same curve, parked transparent until the
        animation reveals a sliding segment of it. */}
    <g className="entie-connector-pulses" fill="none">
      {LANES.map((lane) => (
        <path
          key={`pulse-${lane.dir}-${lane.key}`}
          id={`eth-pulse-${lane.dir}-${lane.key}`}
          className="entie-connector-pulse"
          data-animation="pulse"
          data-flow={`${lane.dir}-${lane.key}`}
          data-dir={lane.dir}
          data-index={lane.index}
          d={lane.d}
        />
      ))}
    </g>

    {/* The packets. At the origin with zero opacity, which is where a motion
        path wants them: Anime.js positions each by TRANSLATING it onto its
        lane, so any built-in cx/cy would be added to that point and throw the
        packet off the line. */}
    <g className="entie-flow-particles">
      {LANES.map((lane) => (
        <circle
          key={`dot-${lane.dir}-${lane.key}`}
          id={`eth-particle-${lane.dir}-${lane.key}`}
          className={`entie-flow-particle entie-flow-particle--${lane.dir}`}
          data-animation="particle"
          data-flow={`${lane.dir}-${lane.key}`}
          data-dir={lane.dir}
          data-index={lane.index}
          data-path={`#eth-conn-${lane.dir}-${lane.key}`}
          cx="0"
          cy="0"
          r="2.6"
        />
      ))}
    </g>
  </svg>
);

export default EntieConnectors;
