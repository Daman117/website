/**
 * The lower-left network terrain and ambient depth behind the composition.
 *
 * The reference has a violet point-cloud wave receding into the dark on the
 * left. It is drawn here as a deterministic height field — 15 receding rows
 * crossed by 11 columns, lifted by a single Gaussian ridge — rather than a
 * scatter of random particles, so the surface reads as one coherent mesh and
 * renders identically on every load.
 *
 * Deliberately restrained: no starfield, no bloom. Depth comes from two soft
 * radial gradients, which cost one paint each instead of hundreds of nodes.
 */
import React from 'react';
import { STAGE } from './heroData';

const ROWS = 15;
const COLS = 30;

/** Height field: u runs across the surface, v runs from far (0) to near (1).
 *  Kept low and left: the hero copy occupies most of the left column's
 *  height, so the terrain sits under it and fades out before mid-canvas
 *  rather than running through the chips and buttons. */
function meshPoint(u: number, v: number) {
  const rowY = 596 + Math.pow(v, 1.5) * 320;
  const x0 = 286 - v * 356;
  const x1 = 706 - v * 122;
  const x = x0 + u * (x1 - x0);
  const ridge = Math.exp(-Math.pow((u - 0.36) / 0.17, 2)) * (24 + v * 62);
  const ripple = Math.sin(u * 9.2 + v * 2.8) * (2.5 + v * 6.5);
  return { x, y: rowY - ridge - ripple };
}

/** How close this column is to the crest — drives dot size and brightness. */
const crest = (u: number) => Math.exp(-Math.pow((u - 0.36) / 0.17, 2));

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

const rowPaths: string[] = [];
for (let r = 0; r <= ROWS; r++) {
  const v = r / ROWS;
  const pts = [];
  for (let c = 0; c <= COLS; c++) pts.push(meshPoint(c / COLS, v));
  rowPaths.push(toPath(pts));
}

const colPaths: string[] = [];
for (let c = 0; c <= COLS; c += 3) {
  const u = c / COLS;
  const pts = [];
  for (let r = 0; r <= ROWS; r++) pts.push(meshPoint(u, r / ROWS));
  colPaths.push(toPath(pts));
}

const nodes: { x: number; y: number; r: number; o: number }[] = [];
for (let r = 4; r <= ROWS; r++) {
  const v = r / ROWS;
  for (let c = 0; c <= COLS; c += 2) {
    const u = c / COLS;
    const s = crest(u);
    const p = meshPoint(u, v);
    nodes.push({ x: p.x, y: p.y, r: 0.9 + s * 1.6 + v * 0.7, o: 0.14 + s * 0.62 });
  }
}

const HeroBackdrop: React.FC<{ mesh: boolean }> = ({ mesh }) => (
  <svg
    className="ieh-layer ieh-layer-backdrop"
    viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* Cool depth behind the central system */}
      <radialGradient id="ieh-depth" cx="60%" cy="46%" r="46%">
        <stop offset="0%" stopColor="#123a7a" stopOpacity="0.34" />
        <stop offset="55%" stopColor="#0d1f4d" stopOpacity="0.14" />
        <stop offset="100%" stopColor="#04060f" stopOpacity="0" />
      </radialGradient>
      {/* Violet wash under the terrain */}
      <radialGradient id="ieh-terrain-glow" cx="22%" cy="82%" r="42%">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
      </radialGradient>
      {/* Rows fade out as they recede, so the mesh has no hard far edge */}
      <linearGradient id="ieh-mesh-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.05" />
        <stop offset="42%" stopColor="#8b5cf6" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
      </linearGradient>
      {/* Horizontal fade so the terrain dies out well before the central
          system, instead of stopping at a visible edge */}
      <linearGradient id="ieh-mesh-mask-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="48%" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <mask id="ieh-mesh-mask" maskUnits="userSpaceOnUse">
        <rect x="0" y="380" width="820" height={STAGE.h - 380} fill="url(#ieh-mesh-mask-grad)" />
      </mask>
    </defs>

    <rect x="0" y="0" width={STAGE.w} height={STAGE.h} fill="url(#ieh-depth)" />
    <rect x="0" y="380" width={900} height={STAGE.h - 380} fill="url(#ieh-terrain-glow)" />

    {mesh && (
    <g mask="url(#ieh-mesh-mask)">
      <g fill="none" stroke="url(#ieh-mesh-fade)" strokeWidth="0.9" strokeLinecap="round">
        {rowPaths.map((d, i) => (
          <path key={`r${i}`} d={d} />
        ))}
        {colPaths.map((d, i) => (
          <path key={`c${i}`} d={d} strokeOpacity="0.5" />
        ))}
      </g>

      <g fill="#c084fc" stroke="none">
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x.toFixed(1)} cy={n.y.toFixed(1)} r={n.r.toFixed(2)} opacity={n.o.toFixed(2)} />
        ))}
      </g>
    </g>
    )}
  </svg>
);

/* Memo: ~200 static nodes that never depend on hover state. Without this,
   every pointerenter would reconcile the whole terrain. */
export default React.memo(HeroBackdrop);
