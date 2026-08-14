/**
 * The network terrain behind the composition, and the flow field crossing it.
 *
 * ── The surface ─────────────────────────────────────────────────────────
 * A deterministic height field — receding rows crossed by columns, lifted by
 * a single Gaussian ridge. Static: it is the structure, not the traffic.
 *
 * ── The flow field ──────────────────────────────────────────────────────
 * Real particles that travel through space. Thirteen long curved streamlines
 * sweep across the whole terrain, and ~150 circles ride them via SMIL
 * <animateMotion>, the same mechanism the connection-layer nodes already use.
 *
 * This replaced two earlier attempts that animated `stroke-dashoffset` on the
 * mesh contours. That technique does move dots along a curve, but the curve
 * is already painted underneath them, so the dots read as texture on a line
 * rather than as objects crossing a space — it looked static no matter how
 * bright it got. Particles had to become their own elements on their own
 * trajectories, separate from the drawn mesh.
 *
 * What makes it read as a flock:
 *   · streamlines share one ridge term, so neighbouring lanes bend together
 *     as coordinated waves rather than drifting independently;
 *   · each particle gets a negative `begin`, spreading it to a different
 *     point in the cycle — the field is full on first paint and stays full;
 *   · per-particle duration jitter means lanes bunch and stretch over time
 *     instead of holding rigid spacing;
 *   · streams run past both edges of the visible band and a gradient mask
 *     fades them in and out, so particles emerge, cross, and dissolve with
 *     new ones continuously arriving behind.
 *
 * Each particle needs only ONE animation because the fade is handled by that
 * shared mask rather than a per-particle opacity tween — which halves the
 * timer count.
 *
 * Restrained by construction: the mask dies out well before the central
 * system's left edge, so the field can never compete with it.
 */
import React, { useEffect, useRef } from 'react';

const ROWS = 26;
const COLS = 120;

/* ── The network surface ───────────────────────────────────────────────
   A perspective wave field spanning the WHOLE hero. Rows recede from y~890
   at the viewer to y~70 near the top and widen from a narrow far edge to
   past both side edges, so the entire composition sits on one continuous
   network rather than a patch in the corner.

   The weave is triangulated, not a rectangular grid: rows and columns are
   crossed by two families of DIAGONALS, which is what gives the reference
   its web look instead of graph paper. Each diagonal is drawn as a single
   long polyline stepping one row at a time, so the whole cross-hatch costs
   ~35 paths rather than one per edge.

   It drifts right-to-left. The height field is PERIODIC in screen x with
   period WAVE_P, the mesh carries a period of overhang past both sides, and
   the group slides left by exactly one period — the last frame is identical
   to the first (seamless) while the crests visibly travel throughout. One
   transform animation moves the entire surface. */
const WAVE_P = 780;
const U_MIN = -0.28;
const U_MAX = 1.28;

function meshPoint(u: number, v: number) {
  const rowY = 30 + Math.pow(v, 1.4) * 760;
  const x0 = 600 - v * 980;
  const x1 = 1090 + v * 700;
  const x = x0 + u * (x1 - x0);
  const amp = 8 + Math.pow(v, 1.25) * 72;
  const k = (2 * Math.PI) / WAVE_P;
  // Two harmonics only. A third made the surface scallop into a repeating
  // curtain; the reference is one long rolling swell. The big `v` coefficient
  // rakes the crest into a diagonal ridge across the frame.
  const h = Math.sin(k * x + v * 5.4) * amp + Math.sin(2 * k * x + 1.1 + v * 2.6) * amp * 0.3;
  return { x, y: rowY - h, h: h / (amp * 1.58) };
}

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

const uAt = (c: number) => U_MIN + (c / COLS) * (U_MAX - U_MIN);

const rowPaths: string[] = [];
for (let r = 0; r <= ROWS; r++) {
  const v = r / ROWS;
  const pts = [];
  for (let c = 0; c <= COLS; c++) pts.push(meshPoint(uAt(c), v));
  rowPaths.push(toPath(pts));
}

/* Cross-links, as two families of long SHALLOW diagonals. Stepping 9 columns
   per row keeps them close to the surface's own direction, which is what the
   reference shows; a steep step turns them into vertical zigzags and the
   whole field reads as a spider web. */
const diagPaths: string[] = [];
for (const dir of [1, -1]) {
  for (let o = -COLS * 2; o <= COLS * 2; o += 5) {
    const pts = [];
    for (let r = 0; r <= ROWS; r++) {
      const c = o + dir * r * 9;
      if (c < 0 || c > COLS) continue;
      pts.push(meshPoint(uAt(c), r / ROWS));
    }
    if (pts.length > 3) diagPaths.push(toPath(pts));
  }
}

/* Nodes ride the surface with the group. Brightness follows crest height so
   the bright bands travel with the swell, and a deterministic hash lifts a
   minority to near-white — the scattered hot points in the reference. */
/* Nodes ride the surface with the group. Brightness follows crest height so
   the bright bands travel with the swell, and a deterministic hash lifts a
   minority to near-white — the scattered hot points in the reference. */
const nodes: { x: number; y: number; r: number; o: number; hot: boolean }[] = [];
for (let r = 3; r <= ROWS; r++) {
  const v = r / ROWS;
  for (let c = 0; c <= COLS; c += 3) {
    const p = meshPoint(uAt(c), v);
    const lift = Math.pow((p.h + 1) / 2, 1.5);
    const hash = ((c * 7 + r * 13) % 17) / 17;
    const hot = hash > 0.84 && lift > 0.45;
    nodes.push({
      x: p.x,
      y: p.y,
      r: 0.55 + lift * 1.9 + v * 0.8 + (hot ? 0.55 : 0),
      o: 0.24 + lift * 0.7 + (hot ? 0.2 : 0),
      hot,
    });
  }
}

/* ── The flow field ───────────────────────────────────────────────────
   Streams cross the WHOLE canvas: they begin outside one edge and end
   outside another, so a particle is never seen turning around or circling
   inside a pocket. Authored against the desktop canvas, which is the only
   layout that renders this layer (compactLayout sets mesh: false).

   Each stream is a single long arc rather than a wiggle: a smoothstep
   between entry and exit height, plus one half-sine "bow" across the span.
   Some bow up and some bow down, which is what weaves them into the
   ascending/descending pattern of a large flock instead of parallel lanes.

   Four of the sixteen enter through the TOP edge instead of the left, so a
   fresh wave keeps arriving from a different side as earlier ones leave. */
const CANVAS = { w: 1660, h: 880 };
const X_IN = -160;
const X_OUT = CANVAS.w + 190;

const STREAMS = 20;
const PER_STREAM = 14;
/** How many of them enter from the top edge rather than the left. */
const TOP_ENTRY = 5;

function streamPath(k: number): string {
  const f = k / (STREAMS - 1);
  const fromTop = k % 4 === 2 && k < TOP_ENTRY * 4;

  // Entry/exit heights are spread independently, so streams cross one
  // another rather than running as a parallel comb.
  const y0 = fromTop ? -110 : -70 + f * (CANVAS.h + 150);
  const y1 = -40 + (((k * 6) % 11) / 10) * (CANVAS.h + 90);
  const x0 = fromTop ? -90 + (((k * 5) % 7) / 6) * (CANVAS.w * 0.55) : X_IN;

  const bow = ((((k * 3) % 5) - 2) / 2) * 150;
  const amp = 13 + (k % 4) * 9;
  const freq = 3.1 + (k % 3) * 1.5;
  const phase = k * 0.83;

  const pts = [];
  for (let i = 0; i <= 56; i++) {
    const t = i / 56;
    const e = t * t * (3 - 2 * t); // smoothstep — eases the vertical drift
    const x = x0 + (X_OUT - x0) * (fromTop ? Math.pow(t, 1.35) : t);
    const y =
      y0 + (y1 - y0) * e + Math.sin(Math.PI * t) * bow + Math.sin(t * freq + phase) * amp;
    pts.push({ x, y });
  }
  return toPath(pts);
}

const PARTICLE_TINTS = ['#a78bfa', '#c4b5fd', '#818cf8', '#8b5cf6', '#67e8f9'];

interface Particle {
  path: string;
  r: number;
  fill: string;
  opacity: number;
  dur: number;
  begin: number;
}

const particles: Particle[] = [];
for (let k = 0; k < STREAMS; k++) {
  const path = streamPath(k);
  // Slow: a full crossing is ~1900px, so 34-48s reads as drift, not traffic.
  const baseDur = 34 + ((k * 5) % 8) * 1.8;
  for (let j = 0; j < PER_STREAM; j++) {
    const dur = baseDur * (1 + (((j * 5 + k * 3) % 7) - 3) * 0.04);
    particles.push({
      path,
      r: 0.85 + ((j * 3 + k) % 4) * 0.32,
      fill: PARTICLE_TINTS[(j * 7 + k * 3) % 5 === 4 ? 4 : (j + k) % 4],
      opacity: 0.38 + ((j * 2 + k) % 4) * 0.12,
      dur,
      // Negative begin drops each particle mid-crossing, so every stream is
      // already populated end to end on the first frame.
      begin: -(j / PER_STREAM) * dur,
    });
  }
}

interface HeroBackdropProps {
  mesh: boolean;
  w: number;
  h: number;
  /** False when the hero is off-screen. SMIL ignores animation-play-state, so
   *  the flow field is paused directly, exactly as HeroConnections does. */
  active: boolean;
  /** Reduced motion drops the flow field entirely; the static terrain stays. */
  reduceMotion: boolean;
}

const HeroBackdrop: React.FC<HeroBackdropProps> = ({ mesh, w, h, active, reduceMotion }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (active) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [active]);

  return (
    <svg
      ref={svgRef}
      className="ieh-layer ieh-layer-backdrop"
      viewBox={`0 0 ${w} ${h}`}
      // slice, not meet: the section's aspect ratio no longer matches the
      // canvas, and meet would letterbox — leaving exactly the bare bands
      // this layer exists to fill. slice scales to cover and crops the excess,
      // which the mesh already overhangs for.
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="ieh-depth" cx="60%" cy="46%" r="46%">
          <stop offset="0%" stopColor="#123a7a" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#0d1f4d" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#04060f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ieh-terrain-glow" cx="26%" cy="86%" r="62%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ieh-mesh-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.14" />
          <stop offset="38%" stopColor="#8b5cf6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.78" />
        </linearGradient>
        {/* Two nested masks keep a full-canvas surface subordinate: it thins
            out toward the top (behind the source-card row) and dips across
            the middle-right band where the central system sits, staying
            strongest at the lower left and the outer margins. */}
        <linearGradient id="ieh-mesh-mask-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="20%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.58" />
          <stop offset="90%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="ieh-mesh-mask-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="26%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <mask id="ieh-mesh-mask" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={w} height={h} fill="url(#ieh-mesh-mask-grad)" />
        </mask>
        <mask id="ieh-mesh-mask-vert" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={w} height={h} fill="url(#ieh-mesh-mask-v)" />
        </mask>

        {/* Two nested masks handle every particle's fade, so none of them
            needs its own opacity animation and the timer count stays at one
            per particle.

            Horizontal: fades at both screen edges so streams dissolve on
            their way out instead of clipping. It also dips across the middle
            band, where the central system sits, keeping the field behind the
            focal point quieter than at the margins.

            Vertical: holds the top row down, so particles never crowd the
            source-card labels. */}
        <linearGradient id="ieh-flow-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="6%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="34%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="78%" stopColor="#ffffff" stopOpacity="0.62" />
          <stop offset="95%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ieh-flow-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="16%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <mask id="ieh-flow-mask-h" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={w} height={h} fill="url(#ieh-flow-h)" />
        </mask>
        <mask id="ieh-flow-mask-v" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width={w} height={h} fill="url(#ieh-flow-v)" />
        </mask>
      </defs>

      <rect x="0" y="0" width={w} height={h} fill="url(#ieh-depth)" />
      <rect x="0" y="0" width={w} height={h} fill="url(#ieh-terrain-glow)" />

      {mesh && (
        <>
          {/* Static surface + fixed network nodes */}
          <g mask="url(#ieh-mesh-mask)">
            <g mask="url(#ieh-mesh-mask-vert)">
            <g className="ieh-terrain-drift">
            <g fill="none" stroke="url(#ieh-mesh-fade)" strokeLinecap="round">
              {rowPaths.map((d, i) => (
                <path key={`r${i}`} d={d} strokeWidth="0.5" />
              ))}
              {diagPaths.map((d, i) => (
                <path key={`d${i}`} d={d} strokeWidth="0.45" strokeOpacity="0.5" />
              ))}
            </g>
            <g stroke="none">
              {nodes.map((n, i) => (
                <circle
                  key={i}
                  cx={n.x.toFixed(1)}
                  cy={n.y.toFixed(1)}
                  r={n.r.toFixed(2)}
                  fill={n.hot ? '#ede9fe' : '#c084fc'}
                  opacity={n.o.toFixed(2)}
                />
              ))}
            </g>
            </g>
            </g>
          </g>

          {/* The flow field — particles travelling their own trajectories */}
          {!reduceMotion && (
            <g mask="url(#ieh-flow-mask-h)">
              <g mask="url(#ieh-flow-mask-v)">
              {particles.map((p, i) => (
                <circle key={`p${i}`} r={p.r.toFixed(2)} fill={p.fill} opacity={p.opacity.toFixed(2)}>
                  <animateMotion
                    path={p.path}
                    dur={`${p.dur.toFixed(2)}s`}
                    begin={`${p.begin.toFixed(2)}s`}
                    repeatCount="indefinite"
                    calcMode="linear"
                  />
                </circle>
              ))}
              </g>
            </g>
          )}
        </>
      )}
    </svg>
  );
};

/* Memo: several hundred elements that never depend on hover state. Without
   this, every pointerenter would reconcile the whole terrain. */
export default React.memo(HeroBackdrop);
