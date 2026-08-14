/**
 * The terrain running under the whole composition.
 *
 * One plane, not two: a rolling violet wave that damps out to a fine cyan
 * grid beneath the core. That single surface is what ties the records half
 * and the knowledge half together instead of leaving two separate vignettes.
 *
 * The damping is in the height field itself, so the flattening is geometric
 * rather than a mask trick, and the colour follows it: violet where the
 * surface swells, cyan where it lies flat.
 *
 * The flow field: lanes cross the full width, alternating direction and
 * drifting in depth so they cut diagonally rather than stacking as parallel
 * rails. On desktop a few more peel off and climb to the core's floor,
 * carrying brighter nodes.
 *
 * Every lane rides the real surface, so the flow follows the visible
 * landscape. Lanes start outside both edges and one gradient mask fades them
 * in and out, which costs a single element rather than an opacity tween per
 * dot. Speeds and phases vary per lane, so the field is never simultaneously
 * empty and never pulses as a block.
 *
 * Lane count and dot density come from the layout, which is how the compact
 * variant thins out without a pile of media queries.
 *
 * The surface is drawn well OUTSIDE the canvas (see TERRAIN_BLEED) and the
 * layer is `overflow: visible`, so it fills the section gutters and the strip
 * below the stage. The layer itself still sits exactly on the stage box, so
 * nothing about its register with the core changes — an SVG clips to its
 * viewport, not to its viewBox, and that is the only thing being relaxed.
 * Both masks are widened to match, or they would clip the spill straight back
 * to the canvas.
 */
import React from 'react';
import { TERRAIN_BLEED as B } from './engramHeroData';
import { useSvgPause } from './useSvgPause';
import type { EngramLayout } from './engramLayouts';

const toPath = (pts: { x: number; y: number }[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('');

function buildMesh(L: EngramLayout) {
  const { rows: ROWS, cols: COLS } = L.terrain;
  const pt = L.terrainPoint;

  const rowPaths: string[] = [];
  for (let r = 0; r <= ROWS; r++) {
    const v = r / ROWS;
    const pts = [];
    for (let c = 0; c <= COLS; c++) pts.push(pt(c / COLS, v));
    rowPaths.push(toPath(pts));
  }

  const colPaths: string[] = [];
  for (let c = 0; c <= COLS; c += 3) {
    const u = c / COLS;
    const pts = [];
    for (let r = 0; r <= ROWS; r++) pts.push(pt(u, r / ROWS));
    colPaths.push(toPath(pts));
  }

  const nodes: { x: number; y: number; r: number; o: number; warm: boolean }[] = [];
  for (let r = 4; r <= ROWS; r++) {
    const v = r / ROWS;
    for (let c = 0; c <= COLS; c += 2) {
      const p = pt(c / COLS, v);
      const lift = Math.pow((p.h + 1) / 2, 1.5);
      nodes.push({
        x: p.x,
        y: p.y,
        r: 0.65 + lift * 1.8 + v * 0.8,
        o: 0.16 + lift * 0.72 * Math.max(0.4, p.damp),
        warm: p.damp > 0.3,
      });
    }
  }
  return { rowPaths, colPaths, nodes };
}

/* Each variant's mesh is built once and cached against its layout object,
   rather than rebuilt on every render. */
const MESH = new WeakMap<EngramLayout, ReturnType<typeof buildMesh>>();
const meshFor = (L: EngramLayout) => {
  let m = MESH.get(L);
  if (!m) {
    m = buildMesh(L);
    MESH.set(L, m);
  }
  return m;
};

interface Props {
  active: boolean;
  reduceMotion: boolean;
  L: EngramLayout;
}

const HeroTerrain: React.FC<Props> = ({ active, reduceMotion, L }) => {
  const svgRef = useSvgPause(active);
  const { rowPaths, colPaths, nodes } = meshFor(L);
  const T = L.terrain;

  return (
    <svg
      ref={svgRef}
      className="egh-layer egh-layer-terrain"
      viewBox={`0 0 ${L.stage.w} ${L.stage.h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="egh-terrain-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
          <stop offset="46%" stopColor="#818cf8" stopOpacity="0.5" />
          <stop offset="72%" stopColor="#0ea5e9" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="egh-terrain-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="14%" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="52%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="egh-terrain-mask" maskUnits="userSpaceOnUse">
          <rect x={-B} y={T.topY - 30} width={L.stage.w + B * 2} height={L.stage.h} fill="url(#egh-terrain-fade)" />
        </mask>
        <linearGradient id="egh-tflow-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="9%" stopColor="#fff" stopOpacity="1" />
          <stop offset="88%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="egh-tflow-mask" maskUnits="userSpaceOnUse">
          <rect x={-B} y={T.topY - 30} width={L.stage.w + B * 2} height={L.stage.h} fill="url(#egh-tflow-grad)" />
        </mask>
      </defs>

      <g mask="url(#egh-terrain-mask)">
        <g fill="none" stroke="url(#egh-terrain-line)" strokeLinecap="round">
          {rowPaths.map((d, i) => (
            <path key={`r${i}`} d={d} strokeWidth="0.6" />
          ))}
          {colPaths.map((d, i) => (
            <path key={`c${i}`} d={d} strokeWidth="0.45" strokeOpacity="0.45" />
          ))}
        </g>
        <g stroke="none">
          {nodes.map((n, i) => (
            <circle
              key={i}
              cx={n.x.toFixed(1)}
              cy={n.y.toFixed(1)}
              r={n.r.toFixed(2)}
              fill={n.warm ? '#c084fc' : '#67e8f9'}
              opacity={n.o.toFixed(2)}
            />
          ))}
        </g>
      </g>

      {!reduceMotion && (
        <g mask="url(#egh-tflow-mask)">
          {L.lanes.map((lane, k) =>
            Array.from({ length: L.terrainDots }, (_, j) => (
              <circle
                key={`t${k}-${j}`}
                r={(lane.r + ((k + j) % 3) * 0.35).toFixed(2)}
                fill={lane.tint}
                opacity={(0.4 + ((k * 2 + j) % 3) * 0.14).toFixed(2)}
              >
                <animateMotion
                  dur={`${lane.dur.toFixed(2)}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                  path={lane.d}
                  begin={`${(-(j / L.terrainDots) * lane.dur + lane.phase).toFixed(2)}s`}
                />
              </circle>
            ))
          )}

          {L.convergeLanes.map((lane, k) =>
            Array.from({ length: L.convergeDots }, (_, j) => (
              <circle
                key={`c${k}-${j}`}
                r={(lane.r + (j % 2) * 0.3).toFixed(2)}
                fill={lane.tint}
                opacity={(0.58 + (j % 2) * 0.16).toFixed(2)}
              >
                <animateMotion
                  dur={`${lane.dur.toFixed(2)}s`}
                  repeatCount="indefinite"
                  calcMode="linear"
                  path={lane.d}
                  begin={`${(-(j / L.convergeDots) * lane.dur + lane.phase).toFixed(2)}s`}
                />
              </circle>
            ))
          )}
        </g>
      )}
    </svg>
  );
};

export default HeroTerrain;
