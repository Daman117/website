/**
 * The engineering figure on the right of the enABLE hero.
 *
 * The product's claim is that a flowsheet becomes a matrix, and the matrix
 * yields judgment. So the figure IS that argument, left to right: a process
 * diagram, the model it reduces to, and the three plots that model produces.
 *
 * ── Five independent groups ─────────────────────────────────────────────
 * `flow`, `model`, `eigen`, `step`, `stab` — each a top-level <g> with a
 * stable class, no shared transforms, and no nesting between them. That is
 * the whole point of the structure: an Anime.js timeline can take any one of
 * them by selector and drive it without touching the others, and the reveal
 * order is a property of the timeline rather than of the markup.
 *
 * Until that timeline exists, the sequence runs on CSS, in the same slow
 * style as the landing and enVIEW heroes: groups fade and rise on a stagger,
 * and the line work DRAWS rather than fading, via `pathLength="1"` with the
 * dash offset run from 1 to 0. `pathLength` is what makes that practical —
 * it normalises every path to the same dash scale, so forty strokes of
 * different lengths draw in step without one of them being measured.
 *
 * ── The flowing process ─────────────────────────────────────────────────
 * Particles travel the plant on SMIL `animateMotion` along the SAME routes
 * the pipes are drawn from, so they turn where the pipe turns instead of
 * cutting across it. One main route carries the product — column overhead,
 * through the control valve, down the receiver, out the bottoms, through the
 * exchanger and away down the drain — with two short branches for the
 * mid-draw and the column bottoms.
 *
 * A negative `begin` drops each particle mid-run, so a pipe is already
 * populated on the first frame and no two arrive together.
 *
 * As a particle passes, the SEGMENT it is in brightens. That is a separate
 * overlay whose phase is derived from how far along the route the segment
 * sits, so the glow tracks the particles rather than being a pulse the whole
 * diagram shares — which is what would make the pipes flash.
 *
 * SMIL is not covered by the global prefers-reduced-motion rule and not by
 * animation-play-state either, so the flow is skipped outright rather than
 * paused. The plant itself never moves: only what is inside it does.
 *
 * ── Colour ──────────────────────────────────────────────────────────────
 * BLUE carries the engineering line work; teal is reserved for SIGNALS — the
 * dashed runs leaving the plant, the eigenvalues. Two roles, two colours, and
 * nothing coloured for decoration.
 *
 * It was violet-magenta, which read as pink beside the page's green accent
 * and fought it. Blue sits in the same cool family as the background field,
 * stays clearly apart from the cyan signals, and leaves green to mean what it
 * means here: the accent, and the input term of the equation.
 */
import React, { useRef } from 'react';
import { useFigureMotion } from './useFigureMotion';

const W = 560;
const H = 580;

/* Every stroke that should draw in rather than fade carries pathLength="1",
   so one keyframe serves all of them. */
const draw = { className: 'eab-draw', pathLength: 1 } as const;

/* ── The flow routes ───────────────────────────────────────────────────
   Traced from the pipe paths above, so a particle turns exactly where the
   pipe turns. MAIN runs the length of the plant; the two branches are the
   mid-draw and the column bottoms. */
const MAIN = 'M38 120V98H160V334H88V386';
const BRANCH_DRAW = 'M62 176H112';
const BRANCH_BOTTOMS = 'M38 320V334H66';

/** One traversal of the main route. Slow on purpose — this is a plant
 *  running, not a progress bar. */
const PERIOD = 15;
const PARTICLES = 3;

/* Segment glow. Each is a stretch of MAIN, with the fraction of the route at
   which its midpoint sits. With PARTICLES evenly spaced, a point at fraction
   f is passed every PERIOD/PARTICLES seconds, at phase (f * PERIOD) into that
   shorter cycle — which is the delay each segment needs to stay in step. The
   cycle length itself lives with the keyframe, in enable-hero.css. */
const SEGMENTS: { d: string; f: number }[] = [
  { d: 'M38 120V98', f: 0.022 },
  { d: 'M38 98H160', f: 0.165 },
  { d: 'M160 98V334', f: 0.52 },
  { d: 'M160 334H88', f: 0.825 },
  { d: 'M88 334V386', f: 0.948 },
];

/** A short cross, for an eigenvalue. */
const Eig: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g className="eab-eig">
    <path d={`M${x - 3.6} ${y - 3.6}l7.2 7.2M${x + 3.6} ${y - 3.6}l-7.2 7.2`} />
  </g>
);

/** A matrix column: the two brackets and the entries between them. */
const Vector: React.FC<{ x: number; y: number; sym: string; sub: string; last: string }> = ({
  x,
  y,
  sym,
  sub,
  last,
}) => (
  <g>
    <text className="eab-math" x={x} y={y + 38} textAnchor="end">
      {sym}
    </text>
    <text className="eab-math eab-math-op" x={x + 9} y={y + 38} textAnchor="middle">
      =
    </text>
    {/* Brackets as paths, not glyphs: a bracket character cannot be stretched
        to the height of the column it encloses. */}
    <path className="eab-bracket" d={`M${x + 34} ${y}h-8v76h8`} />
    <path className="eab-bracket" d={`M${x + 62} ${y}h8v76h-8`} />
    <text className="eab-math eab-math-sm" x={x + 48} y={y + 18} textAnchor="middle">
      {sub}
      <tspan className="eab-math-idx" dy="3">
        1
      </tspan>
    </text>
    <text className="eab-math eab-math-sm" x={x + 48} y={y + 38} textAnchor="middle">
      {sub}
      <tspan className="eab-math-idx" dy="3">
        2
      </tspan>
    </text>
    <text className="eab-math eab-math-sm" x={x + 48} y={y + 56} textAnchor="middle">
      ⋮
    </text>
    <text className="eab-math eab-math-sm" x={x + 48} y={y + 72} textAnchor="middle">
      {sub}
      <tspan className="eab-math-idx" dy="3">
        {last}
      </tspan>
    </text>
  </g>
);

interface Props {
  /** SMIL is outside the global reduced-motion rule, so the flow is skipped
   *  rather than paused. */
  reduceMotion: boolean;
}

const HeroFigure: React.FC<Props> = ({ reduceMotion }) => {
  const ref = useRef<SVGSVGElement>(null);
  /* The Anime.js layer: equation, vectors, eigenvalues, step curve, region
     and the connection lines. The pipe flow above stays on SMIL — it has to
     follow real path geometry, which animateMotion does natively. */
  useFigureMotion(ref, reduceMotion);

  return (
  <svg
    ref={ref}
    className="eab-fig"
    viewBox={`0 0 ${W} ${H}`}
    fill="none"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* Hatching for the stability region. A pattern rather than a fill, so
          the region reads as bounded-and-shaded the way a textbook plots it,
          without adding a gradient. */}
      <pattern id="eab-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0V7" stroke="#6366f1" strokeOpacity="0.46" strokeWidth="0.8" />
      </pattern>
    </defs>

    {/* ══ 1. PROCESS DIAGRAM ════════════════════════════════════════════
        The anchor. Thin line-art: a column, a vessel, a control valve, an
        exchanger and the runs between them — the smallest set of shapes that
        still reads as a plant rather than as a flowchart. */}
    <g className="eab-fig-g eab-fig-flow" style={{ '--i': 0 } as React.CSSProperties}>
      <g className="eab-plant">
        {/* tall column */}
        <path {...draw} d="M16 142a22 22 0 0 1 44 0v156a22 22 0 0 1-44 0Z" />
        <g className="eab-plant-dim">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} {...draw} d={`M16 ${162 + i * 16}h13`} />
          ))}
        </g>

        {/* overhead line into the control valve */}
        <path {...draw} d="M38 120V98h122v22" />

        {/* control valve — the bowtie every P&ID uses, with its actuator */}
        <g className="eab-valve">
          <path {...draw} d="M160 132l-13 -9v18ZM160 132l13 -9v18Z" />
          <path {...draw} d="M160 132v-14M151 116h18" />
        </g>

        {/* down into the receiver */}
        <path {...draw} d="M160 141v50" />

        {/* receiver vessel */}
        <path {...draw} d="M130 218a30 22 0 0 1 60 0v58a30 26 0 0 1-60 0Z" />
        <path {...draw} className="eab-plant-dim" d="M130 218a30 22 0 0 0 60 0" />
        <path {...draw} d="M144 302v12M176 302v12" />

        {/* column mid-draw into the receiver */}
        <path {...draw} d="M62 176h52" />
        <path {...draw} d="M114 176l-8-4v8Z" />

        {/* bottoms to the exchanger, and on to the drain */}
        <path {...draw} d="M38 320v14H66" />
        <path {...draw} d="M110 334h50v-30" />
        <path {...draw} d="M88 358v12" />
        <path {...draw} d="M78 370h20l-10 16Z" />

        {/* shell-and-tube exchanger */}
        <g className="eab-exch">
          <circle className="eab-draw" pathLength={1} cx="88" cy="334" r="22" />
          <path {...draw} d="M74 322l28 24M102 322l-28 24" />
        </g>
      </g>

      {/* ── The flowing process ──────────────────────────────────────
          The segment under a particle brightens as it passes. Phase comes
          from the segment's position along the route, so the glow follows the
          particles instead of the whole diagram pulsing together. */}
      {!reduceMotion && (
        <>
          <g className="eab-pipe-glow">
            {SEGMENTS.map((seg) => (
              <path
                key={seg.d}
                d={seg.d}
                style={
                  { '--d': `${(-seg.f * PERIOD).toFixed(2)}s` } as React.CSSProperties
                }
              />
            ))}
          </g>

          <g className="eab-flow-dots">
            {Array.from({ length: PARTICLES }, (_, i) => (
              <circle key={`m${i}`} r={i % 2 ? 1.7 : 2.1}>
                <animateMotion
                  dur={`${PERIOD}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                  path={MAIN}
                  begin={`${(-(i / PARTICLES) * PERIOD).toFixed(2)}s`}
                />
              </circle>
            ))}

            {/* Branches: the mid-draw and the column bottoms, each carrying a
                single particle so they read as live without competing with
                the main run. */}
            <circle r="1.6">
              <animateMotion
                dur="4.2s"
                repeatCount="indefinite"
                calcMode="linear"
                path={BRANCH_DRAW}
                begin="-1.4s"
              />
            </circle>
            <circle r="1.6">
              <animateMotion
                dur="3.6s"
                repeatCount="indefinite"
                calcMode="linear"
                path={BRANCH_BOTTOMS}
                begin="-2.6s"
              />
            </circle>
          </g>
        </>
      )}

      {/* Signals leaving the plant for the model. Teal, dashed, and low:
          these are measurements, not process lines, and they should not read
          with the same weight as pipe. */}
      <g className="eab-signal">
        <path d="M192 232C234 228 238 196 262 190" />
        <path d="M192 244C236 242 244 220 264 214" />
        <path d="M192 256C240 258 248 282 262 292" />
        <path d="M192 268C242 274 252 316 264 330" />
        <path d="M192 280C238 292 250 360 258 400" />
        <path d="M120 358C168 388 214 404 258 424" />
        {[
          [232, 226],
          [246, 288],
          [206, 382],
          [166, 372],
          [252, 250],
          [138, 400],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} className="eab-signal-dot" cx={cx} cy={cy} r="1.9" />
        ))}
      </g>
    </g>

    {/* ══ 2. MATHEMATICAL MODEL ═════════════════════════════════════════
        The whole product in one line, so it sits highest and largest. */}
    <g className="eab-fig-g eab-fig-model" style={{ '--i': 1 } as React.CSSProperties}>
      <text className="eab-math eab-math-lg" x="352" y="72" textAnchor="middle">
        <tspan className="eab-math-state">ẋ</tspan>
        <tspan className="eab-math-op"> = </tspan>
        <tspan className="eab-math-m">M</tspan>
        <tspan className="eab-math-state">x</tspan>
        <tspan className="eab-math-op"> + </tspan>
        <tspan className="eab-math-b">B</tspan>
        <tspan className="eab-math-b">u</tspan>
      </text>

      <Vector x={270} y={112} sym="x" sub="x" last="n" />
      <Vector x={392} y={112} sym="u" sub="u" last="m" />
    </g>

    {/* ══ 3. EIGENVALUE PLOT ════════════════════════════════════════════
        The unit circle and a handful of poles. Few points on purpose: the
        figure is making a point about stability, not plotting a real system. */}
    <g className="eab-fig-g eab-fig-eigen" style={{ '--i': 2 } as React.CSSProperties}>
      <text className="eab-label" x="258" y="236">
        Im(λ)
      </text>
      <text className="eab-label" x="352" y="292">
        Re(λ)
      </text>

      <circle className="eab-axis eab-axis-dash eab-draw" pathLength={1} cx="296" cy="290" r="46" />
      <path className="eab-axis eab-axis-dash eab-draw" pathLength={1} d="M242 290h108M296 244v92" />

      <g className="eab-eigs">
        <Eig x={272} y={266} />
        <Eig x={318} y={268} />
        <Eig x={268} y={314} />
        <Eig x={320} y={312} />
      </g>
    </g>

    {/* ══ 4. STEP RESPONSE ══════════════════════════════════════════════
        One curve, with the overshoot and settle that make a closed loop
        recognisable. A flat exponential would say nothing. */}
    <g className="eab-fig-g eab-fig-step" style={{ '--i': 3 } as React.CSSProperties}>
      <text className="eab-label" x="450" y="232" textAnchor="middle">
        Step Response
      </text>

      <path className="eab-axis eab-draw" pathLength={1} d="M386 248v88h142" />
      <g className="eab-tick">
        <text x="380" y="252" textAnchor="end">1</text>
        <text x="380" y="296" textAnchor="end">0.5</text>
        <text x="380" y="340" textAnchor="end">0</text>
        <text x="386" y="350" textAnchor="middle">0</text>
        <text x="421" y="350" textAnchor="middle">5</text>
        <text x="457" y="350" textAnchor="middle">10</text>
        <text x="492" y="350" textAnchor="middle">15</text>
        <text x="528" y="350" textAnchor="middle">20</text>
      </g>

      {/* setpoint */}
      <path className="eab-axis eab-axis-dash eab-draw" pathLength={1} d="M386 270h142" />

      <path
        className="eab-curve eab-curve-step"
        pathLength={1}
        d="M386 336C398 336 404 258 420 252C434 247 440 282 452 280C463 278 466 266 478 268C496 271 510 270 528 270"
      />
    </g>

    {/* ══ 5. STABILITY REGION ═══════════════════════════════════════════
        The boundary and what falls inside it — the judgment the whole figure
        has been building toward, so it comes last. */}
    <g className="eab-fig-g eab-fig-stab" style={{ '--i': 4 } as React.CSSProperties}>
      <text className="eab-label" x="292" y="392">
        Im(λ)
      </text>
      <text className="eab-label" x="352" y="412">
        Stability Region
      </text>
      <text className="eab-label" x="452" y="512">
        Re(λ)
      </text>

      <path className="eab-region" d="M312 414C388 418 438 456 452 496H312Z" fill="url(#eab-hatch)" stroke="none" />
      <path className="eab-curve eab-draw" pathLength={1} d="M312 414C388 418 438 456 452 496" />

      <path className="eab-axis eab-draw" pathLength={1} d="M312 400v96h158" />
      <path className="eab-axis eab-draw" pathLength={1} d="M312 400l-4 7h8ZM470 496l-7-4v8Z" />
    </g>
  </svg>
  );
};

export default HeroFigure;
