/**
 * The enTIE intelligence core — the centre of the hero composition.
 *
 * A tall chamfered container with a thin purple-to-blue outline, a second
 * outline inset inside it, a few faint vertical signal lines, eight
 * connection nodes on its edges, and a shield-and-check at the middle. It
 * says DATA → PROCESSING → INTELLIGENCE without a word of text: material
 * arrives at the left nodes, passes the signal lines, is vouched for by the
 * shield, and leaves by the right nodes.
 *
 * ── Coordinate system ───────────────────────────────────────────────────
 * One 700×700 viewBox, self-contained, scaled to whatever .eth-visual
 * measures via `meet`. The core sits at the CENTRE of that box on purpose —
 * the empty thirds either side of it are where the input and output nodes
 * land in the next step, off the shared grid in entieHeroData rather than
 * eyeballed against this drawing.
 *
 * ── Structure, for the animation step ───────────────────────────────────
 * Nothing is flattened into one path. Every part named in the brief is its
 * own element with its own class and id:
 *
 *   .entie-core-glow      the halo behind the container
 *   .entie-core-outline   the outer chamfered container
 *   .entie-core-inner     the inset outline
 *   .entie-core-cap       the top and bottom brackets
 *   .entie-core-signal    4 vertical signal lines
 *   .entie-core-spark     5 points riding those lines
 *   .entie-core-node      8 connection points (4 a side), each a ring + core
 *   .entie-core-shield    the ring, the shield and its check
 *
 * Class names are lowercase-kebab to match every other class in this
 * codebase (.enstudio-core, .enstudio-core-ring).
 *
 * No animation, no state, no transitions — the hero layout stays in
 * EntieHero; this file is only the drawing.
 */
import React from 'react';
import {
  CANVAS,
  CORE,
  CORE_EDGE,
  NODE_ROWS,
  SIGNALS,
  SPARKS,
  chamferedBox,
} from './entieHeroData';

const { left: L, right: R, top: T, bottom: B } = CORE_EDGE;

const EntieCore: React.FC = () => (
  <svg
    className="entie-visual"
    viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
    preserveAspectRatio="xMidYMid meet"
    role="presentation"
    focusable="false"
  >
    <defs>
      {/* Purple at the top where material arrives, blue at the bottom where
          it leaves. userSpaceOnUse, not the objectBoundingBox default, so
          every stroke in the core reads off ONE ramp and a short horizontal
          element cannot land on a degenerate bounding box. */}
      <linearGradient id="ethCoreEdge" gradientUnits="userSpaceOnUse" x1="0" y1={T} x2="0" y2={B}>
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="52%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>

      {/* The halo. Held very low in CSS — enough to seat the container in the
          background, not enough to read as a light source. */}
      <radialGradient id="ethCoreGlow">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
        <stop offset="55%" stopColor="#7c3aed" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Behind everything: atmosphere, not an object. */}
    <ellipse
      id="eth-core-glow"
      className="entie-core-glow"
      data-animation="glow"
      cx={CORE.cx}
      cy={CORE.cy}
      rx="150"
      ry="290"
    />

    <g id="eth-core" className="entie-core" data-animation="core">
      {/* The interior, dark and barely there, so the signals read as being
          inside something rather than floating. */}
      <polygon
        className="entie-core-fill"
        points={chamferedBox(CORE.halfW, CORE.halfH, CORE.chamfer)}
      />

      {/* Brackets marking the top and bottom, a little wider than the body. */}
      <path id="eth-core-cap-top" className="entie-core-cap" data-animation="cap" d={`M${L + 4} ${T - 11} H${R - 4}`} />
      <path id="eth-core-cap-bottom" className="entie-core-cap" data-animation="cap" d={`M${L + 4} ${B + 11} H${R - 4}`} />

      <polygon
        id="eth-core-outline"
        className="entie-core-outline"
        data-animation="outline"
        points={chamferedBox(CORE.halfW, CORE.halfH, CORE.chamfer)}
      />
      <polygon
        id="eth-core-inner"
        className="entie-core-inner"
        data-animation="outline"
        points={chamferedBox(CORE.halfW - 10, CORE.halfH - 10, CORE.chamfer - 6)}
      />

      {/* ── Signal lines ─────────────────────────────────────────────────── */}
      <g className="entie-core-signals">
        {SIGNALS.map((s, i) => (
          <line
            key={s.x}
            id={`eth-core-signal-${i}`}
            className="entie-core-signal"
            data-animation="signal"
            data-index={i}
            x1={s.x}
            y1={s.y1}
            x2={s.x}
            y2={s.y2}
          />
        ))}
        {SPARKS.map((p, i) => (
          <circle
            key={`${p.x}-${p.y}`}
            id={`eth-core-spark-${i}`}
            className="entie-core-spark"
            data-animation="spark"
            data-index={i}
            cx={p.x}
            cy={p.y}
            r="2"
          />
        ))}
      </g>

      {/* ── Connection points ───────────────────────────────────────────────
          Ring plus centre, so a later pulse can widen one without touching
          the other. Four rows a side, on the container's edges — this is
          where the connectors attach in the next step. */}
      <g className="entie-core-nodes">
        {(['in', 'out'] as const).map((side) =>
          NODE_ROWS.map((y, i) => {
            const x = side === 'in' ? L : R;
            return (
              <g
                key={`${side}-${y}`}
                id={`eth-core-node-${side}-${i}`}
                className={`entie-core-node entie-core-node--${side}`}
                data-animation="node"
                data-side={side}
                data-index={i}
              >
                <circle className="entie-core-node-ring" cx={x} cy={y} r="9" />
                <circle className="entie-core-node-dot" cx={x} cy={y} r="3.4" />
              </g>
            );
          }),
        )}
      </g>

      {/* ── The intelligence mark ───────────────────────────────────────────
          A shield with a check, ringed. The one symbol in the composition,
          and the reason the core is more than a pipe: what leaves has been
          vouched for. */}
      <g id="eth-core-shield" className="entie-core-shield" data-animation="shield">
        <circle className="entie-core-shield-ring" cx={CORE.cx} cy={CORE.cy} r="42" />
        <path
          className="entie-core-shield-body"
          d={`M${CORE.cx} 329 l-15 5.5 v11 c0 9.5 6.2 17 15 20.5 c8.8-3.5 15-11 15-20.5 v-11 z`}
        />
        <path className="entie-core-shield-check" d={`M${CORE.cx - 7} 349 l5 5 l10 -10.5`} />
      </g>
    </g>
  </svg>
);

export default EntieCore;
