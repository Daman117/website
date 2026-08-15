/**
 * The enSTUDIO hero composition — real SVG, no image, no canvas.
 *
 * Sources (left) → processing core (centre) → outputs (right). That is the
 * product in one picture: drawings and records go in, one normalized model is
 * built, downstream formats come out.
 *
 * ── Coordinate system ───────────────────────────────────────────────────
 * One 700×700 viewBox, self-contained: it scales to whatever .esh-visual
 * measures via `meet`, so the composition needs no media query of its own and
 * the hero's `--u` canvas is left alone.
 *
 * ── Animation surface ───────────────────────────────────────────────────
 * Nothing here animates. Everything here is ADDRESSABLE, which is the whole
 * point of this file's shape:
 *
 *   selector                    what it gets you
 *   .enstudio-source-node       5 groups, one per input      data-animation="node"
 *   .enstudio-output-node       5 groups, one per output     data-animation="node"
 *   .enstudio-connector         10 paths, never merged       data-animation="connector"
 *   .enstudio-flow-path         the same 10 — a particle's rail
 *   .enstudio-flow-particle     10 riders, one per rail      data-animation="particle"
 *   .enstudio-connector-dot     12 junctions, each its own   data-animation="dot"
 *   .enstudio-core-ring         outer hexagon                data-animation="ring"
 *   .enstudio-core-inner        inner hexagon                data-animation="ring"
 *   .enstudio-core-vertex       6 points of the outer hex    data-animation="dot"
 *   .enstudio-glow              the core's halo              data-animation="glow"
 *   .enstudio-process-*         schematic parts              data-animation="process"
 *   .enstudio-process-signal    2 riders on the schematic    data-animation="signal"
 *   .enstudio-signal            the dashed instrument leads  data-animation="signal"
 *
 * Pairing: `data-index` matches a node to its connector to its particle, so
 * `[data-animation="particle"][data-index="2"]` and its rail
 * `#esh-in-2` belong together without the animation code re-deriving anything.
 *
 * The flow paths ARE the connectors — one visible stroke per link, used both
 * as the drawn line and as the motion path. Anime.js reads a path element
 * directly, so a second invisible copy of each curve would be ten DOM nodes
 * bought for nothing.
 *
 * ── Where the motion lives ──────────────────────────────────────────────
 * Not here. useEnstudioHeroAnimation owns every tween and finds its targets
 * through the selectors above, so this file can be re-composed without
 * touching the animation and the animation retimed without re-rendering the
 * drawing. Nothing below has a transition, a keyframe or a piece of state.
 */
import React from 'react';
import { useEnstudioHeroAnimation } from './useEnstudioHeroAnimation';

/* ── Geometry ─────────────────────────────────────────────────────────── */

const CORE = { x: 400, y: 330, r: 150 };
/** Flat-top hexagon: the vertices sit left and right, which is where the
 *  connectors have to land. */
const flatHex = (cx: number, cy: number, r: number) => {
  const h = r * 0.8660254;
  return [
    [cx + r, cy], [cx + r / 2, cy + h], [cx - r / 2, cy + h],
    [cx - r, cy], [cx - r / 2, cy - h], [cx + r / 2, cy - h],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
};
/** Pointy-top hexagon, for the output nodes — reads as a chip rather than as
 *  a small copy of the core. */
const pointyHex = (cx: number, cy: number, r: number) => {
  const w = r * 0.8660254;
  return [
    [cx, cy - r], [cx + w, cy - r / 2], [cx + w, cy + r / 2],
    [cx, cy + r], [cx - w, cy + r / 2], [cx - w, cy - r / 2],
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
};

const SRC_X = 86;      // centre of the source column
const SRC_HALF = 24;   // half the source tile
const OUT_X = 636;     // centre of the output column
const OUT_R = 30;      // output hexagon radius

/* Icons are 24×24 stroked outlines, placed by their centre. Kept as plain `d`
   strings rather than components: they carry no behaviour, and one array is
   easier to re-order than five one-line components. */
const SOURCES = [
  { y: 130, d: 'M7 3h7l4 4v14H7z M14 3v4h4' },
  { y: 230, d: 'M7 3h7l4 4v14H7z M14 3v4h4 M9.5 12h5 M9.5 15.5h5' },
  { y: 330, d: 'M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z' },
  { y: 430, d: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6' },
  { y: 530, d: 'M7 18.5h10a4 4 0 0 0 .6-8A6 6 0 0 0 6 10 4.2 4.2 0 0 0 7 18.5z' },
];

const OUTPUTS = [
  { y: 120, d: 'M3 4.5h18v11H3z M9 19.5h6 M12 15.5v4' },
  { y: 225, d: 'M3.5 4h17v16h-17z M3.5 9h17 M3.5 14.5h17 M9.5 9v11' },
  { y: 330, d: 'M4 12h4c2 0 3-1 3-3V7.5 M11 15v1.5c0 2 1 3 3 3h4 M11 5.5h2.5 M18 5.5h2 M18 19.5h2 M13.5 5.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M13.5 19.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0' },
  { y: 435, d: 'M4.5 16.5a8 8 0 1 1 15 0 M12 12.5l4-3.5' },
  { y: 540, d: 'M7.5 16h9a4 4 0 0 0 .5-8 6 6 0 0 0-11.2.9 4 4 0 0 0 1.2 7.1 M12 10.5v7.5 M9.2 15.2 12 18l2.8-2.8' },
];

/* Where the connectors start and end — also where the junction dots sit, so a
   dot is always exactly on its line rather than near it, and where a particle
   rests before its first run. */
const IN_START = SRC_X + SRC_HALF + 8;
const OUT_END = OUT_X - OUT_R * 0.8660254 - 8;

/** Source tile edge → the core's left vertex. The first control point sits
 *  well out from the node and the second close to the core: the lines run
 *  parallel for most of their length and only converge at the end, which is
 *  what keeps five of them legible instead of a rope. */
const inPath = (y: number) =>
  `M${IN_START} ${y} C 178 ${y}, 214 ${CORE.y}, ${CORE.x - CORE.r} ${CORE.y}`;

/** The core's right vertex → an output hexagon's left edge. Mirror of the
 *  above: tight leaving the core, flat arriving at the node. */
const outPath = (y: number) =>
  `M${CORE.x + CORE.r} ${CORE.y} C 586 ${CORE.y}, 566 ${y}, ${OUT_END} ${y}`;

const Icon: React.FC<{ x: number; y: number; d: string; className: string }> = ({ x, y, d, className }) => (
  <path className={className} d={d} transform={`translate(${x - 12} ${y - 12})`} />
);

const EnstudioHeroVisual: React.FC = () => {
  /* The only line of this file that knows motion exists. Everything the hook
     drives it finds by selector, so this render stays static and no frame of
     the animation passes through React. */
  const ref = useEnstudioHeroAnimation();

  return (
  <svg
    ref={ref}
    className="enstudio-visual"
    viewBox="0 0 700 700"
    preserveAspectRatio="xMidYMid meet"
    role="presentation"
    focusable="false"
  >
    <defs>
      {/* Purple where the drawings enter, blue where configuration leaves.
          Two stops on a stroke — not a fill wash, so the SVG keeps reading as
          line work rather than as a rendered picture.

          userSpaceOnUse, not the objectBoundingBox default, for a reason that
          is easy to lose: the middle connector on each side is perfectly
          horizontal, so its bounding box has zero height — and SVG does not
          paint an element whose gradient resolves against a degenerate box.
          Both middle links simply vanished. Anchoring the ramp to the canvas
          fixes that, and has the side benefit that all five links on a side
          share one ramp instead of each stretching its own. */}
      <linearGradient id="eshFlowIn" gradientUnits="userSpaceOnUse" x1={IN_START} y1="0" x2={CORE.x - CORE.r} y2="0">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="eshFlowOut" gradientUnits="userSpaceOnUse" x1={CORE.x + CORE.r} y1="0" x2={OUT_END} y2="0">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id="eshCoreEdge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="55%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      {/* The core's halo. One radial, held very low in CSS — enough to seat
          the hexagon in the background, not enough to read as a light source.
          A separate element rather than a filter so it can be scaled and
          faded on its own clock later. */}
      <radialGradient id="eshCoreGlow">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
        <stop offset="55%" stopColor="#7c3aed" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Behind everything, including the connectors: the halo is atmosphere,
        not an object. */}
    <circle
      id="esh-glow"
      className="enstudio-glow"
      data-animation="glow"
      cx={CORE.x}
      cy={CORE.y}
      r="230"
    />

    {/* ── Connectors ─────────────────────────────────────────────────────
        One path per link, never merged: each is both the drawn line
        (stroke-dashoffset) and the rail its particle rides. */}
    <g className="enstudio-connectors" fill="none">
      {SOURCES.map((s, i) => (
        <path
          key={s.y}
          id={`esh-in-${i}`}
          className="enstudio-connector enstudio-connector--in enstudio-flow-path"
          data-animation="connector"
          data-flow="in"
          data-index={i}
          d={inPath(s.y)}
        />
      ))}
      {OUTPUTS.map((o, i) => (
        <path
          key={o.y}
          id={`esh-out-line-${i}`}
          className="enstudio-connector enstudio-connector--out enstudio-flow-path"
          data-animation="connector"
          data-flow="out"
          data-index={i}
          d={outPath(o.y)}
        />
      ))}
    </g>

    {/* Riders. At the origin with zero opacity, which is exactly where a
        motion path wants them: Anime.js positions each one by TRANSLATING it
        to a point on its rail, so any built-in cx/cy would be added to that
        point and throw the packet off its line. Until the animation runs they
        are invisible, so the composition is unchanged without it. */}
    <g className="enstudio-flow-particles">
      {SOURCES.map((s, i) => (
        <circle
          key={s.y}
          id={`esh-particle-in-${i}`}
          className="enstudio-flow-particle enstudio-flow-particle--in"
          data-animation="particle"
          data-flow="in"
          data-index={i}
          data-path={`#esh-in-${i}`}
          cx="0"
          cy="0"
          r="2.6"
        />
      ))}
      {OUTPUTS.map((o, i) => (
        <circle
          key={o.y}
          id={`esh-particle-out-${i}`}
          className="enstudio-flow-particle enstudio-flow-particle--out"
          data-animation="particle"
          data-flow="out"
          data-index={i}
          data-path={`#esh-out-line-${i}`}
          cx="0"
          cy="0"
          r="2.6"
        />
      ))}
    </g>

    {/* Junctions: the two ends of every line, and the core vertices where all
        of them converge. Each one is a path endpoint, so it lands on the
        stroke exactly. */}
    <g className="enstudio-connector-dots">
      {SOURCES.map((s, i) => (
        <circle
          key={s.y}
          id={`esh-dot-in-${i}`}
          className="enstudio-connector-dot"
          data-animation="dot"
          data-flow="in"
          data-index={i}
          cx={IN_START}
          cy={s.y}
          r="3"
        />
      ))}
      {OUTPUTS.map((o, i) => (
        <circle
          key={o.y}
          id={`esh-dot-out-${i}`}
          className="enstudio-connector-dot enstudio-connector-dot--out"
          data-animation="dot"
          data-flow="out"
          data-index={i}
          cx={OUT_END}
          cy={o.y}
          r="3"
        />
      ))}
      <circle
        id="esh-dot-core-in"
        className="enstudio-connector-dot enstudio-connector-dot--hub"
        data-animation="dot"
        data-hub="in"
        cx={CORE.x - CORE.r}
        cy={CORE.y}
        r="5"
      />
      <circle
        id="esh-dot-core-out"
        className="enstudio-connector-dot enstudio-connector-dot--hub"
        data-animation="dot"
        data-hub="out"
        cx={CORE.x + CORE.r}
        cy={CORE.y}
        r="5"
      />
    </g>

    {/* ── Sources ────────────────────────────────────────────────────────
        One group per node, never one group for all five: a stagger needs
        five targets. */}
    <g className="enstudio-sources">
      {SOURCES.map((s, i) => (
        <g
          key={s.y}
          id={`esh-src-${i}`}
          className="enstudio-source-node"
          data-animation="node"
          data-flow="in"
          data-index={i}
        >
          <rect
            className="enstudio-node-shape"
            x={SRC_X - SRC_HALF}
            y={s.y - SRC_HALF}
            width={SRC_HALF * 2}
            height={SRC_HALF * 2}
            rx="12"
          />
          <Icon className="enstudio-node-icon" x={SRC_X} y={s.y} d={s.d} />
        </g>
      ))}
    </g>

    {/* ── Outputs ────────────────────────────────────────────────────────── */}
    <g className="enstudio-outputs">
      {OUTPUTS.map((o, i) => (
        <g
          key={o.y}
          id={`esh-out-${i}`}
          className="enstudio-output-node"
          data-animation="node"
          data-flow="out"
          data-index={i}
        >
          <polygon className="enstudio-node-shape" points={pointyHex(OUT_X, o.y, OUT_R)} />
          <Icon className="enstudio-node-icon" x={OUT_X} y={o.y} d={o.d} />
        </g>
      ))}
    </g>

    {/* ── The core ───────────────────────────────────────────────────────
        Five independent pieces: outer ring, inner ring, vertex points, the
        schematic, and the halo above. Each carries its own transform-box in
        CSS, so a scale on one never drags another. */}
    <g id="esh-core" className="enstudio-core" data-animation="core">
      <polygon
        id="esh-core-ring"
        className="enstudio-core-ring"
        data-animation="ring"
        data-ring="outer"
        points={flatHex(CORE.x, CORE.y, CORE.r)}
      />
      <polygon
        id="esh-core-inner"
        className="enstudio-core-inner"
        data-animation="ring"
        data-ring="inner"
        points={flatHex(CORE.x, CORE.y, CORE.r - 24)}
      />

      {/* Vertex marks — the six points of the outer hexagon, brightest where
          the connectors land. */}
      <g className="enstudio-core-vertices">
        {flatHex(CORE.x, CORE.y, CORE.r).split(' ').map((p, i) => {
          const [x, y] = p.split(',');
          return (
            <circle
              key={p}
              id={`esh-vertex-${i}`}
              className="enstudio-core-vertex"
              data-animation="dot"
              data-index={i}
              cx={x}
              cy={y}
              r="4"
            />
          );
        })}
      </g>

      {/* ── The schematic inside ─────────────────────────────────────────
          A vessel, two valves, a pump and an instrument loop. Deliberately
          sparse: enough P&ID to be recognised by an engineer, not a diagram
          anyone is meant to read at hero size.

          Process lines and symbols are separately classed because they will
          not animate alike — a line draws, a symbol lights. */}
      <g id="esh-process" className="enstudio-process" data-animation="process" fill="none">
        {/* instrument bubble + its signal leads */}
        <circle id="esh-proc-instrument" className="enstudio-process-symbol" data-animation="symbol" cx="348" cy="258" r="9" />
        <path id="esh-proc-signal-1" className="enstudio-process-line enstudio-signal" data-animation="signal" d="M348 267 V 288" />
        <path id="esh-proc-signal-2" className="enstudio-process-line enstudio-signal" data-animation="signal" d="M359 255 H 378" />

        {/* vessel */}
        <rect id="esh-proc-vessel" className="enstudio-process-symbol" data-animation="symbol" x="330" y="288" width="40" height="70" rx="19" />

        {/* vessel → valve → header */}
        <path id="esh-proc-line-1" className="enstudio-process-line" data-animation="process-line" d="M370 305 H 402" />
        <path id="esh-proc-valve-1" className="enstudio-process-symbol" data-animation="symbol" d="M402 297 v16 l20 -16 v16 z" />
        <path id="esh-proc-line-2" className="enstudio-process-line" data-animation="process-line" d="M422 305 H 470" />

        {/* riser to the gauge, and the drop to the control valve */}
        <path id="esh-proc-line-3" className="enstudio-process-line" data-animation="process-line" d="M470 305 V 285" />
        <circle id="esh-proc-gauge" className="enstudio-process-symbol" data-animation="symbol" cx="470" cy="271" r="14" />
        <path id="esh-proc-gauge-needle" className="enstudio-process-line" data-animation="process-line" d="M464 271 a6 6 0 1 1 4 5.6" />
        <path id="esh-proc-line-4" className="enstudio-process-line" data-animation="process-line" d="M470 305 V 330" />
        <path id="esh-proc-valve-2" className="enstudio-process-symbol" data-animation="symbol" d="M462 330 h16 l-16 20 h16 z" />
        <path id="esh-proc-line-5" className="enstudio-process-line" data-animation="process-line" d="M470 350 V 380 H 420" />

        {/* pump */}
        <circle id="esh-proc-pump" className="enstudio-process-symbol" data-animation="symbol" cx="406" cy="380" r="14" />
        <path id="esh-proc-pump-base" className="enstudio-process-symbol" data-animation="symbol" d="M406 366 V 380 M394 392 h24" />
        <path id="esh-proc-line-6" className="enstudio-process-line" data-animation="process-line" d="M392 380 H 352 V 358" />

        {/* Two riders for the internal signal sweep — the same origin-and-
            translate arrangement as the flow packets, on two runs of the
            schematic. Smaller and dimmer than a data packet: this is the core
            working, not information arriving. */}
        <circle
          id="esh-proc-signal-a"
          className="enstudio-process-signal"
          data-animation="signal"
          data-path="#esh-proc-line-2"
          cx="0"
          cy="0"
          r="1.9"
        />
        <circle
          id="esh-proc-signal-b"
          className="enstudio-process-signal"
          data-animation="signal"
          data-path="#esh-proc-line-5"
          cx="0"
          cy="0"
          r="1.9"
        />
      </g>
    </g>
  </svg>
  );
};

export default EnstudioHeroVisual;
