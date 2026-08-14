/**
 * The Plant Overview tile: FOUR isometric process views, one at a time.
 *
 * A real overview screen cycles areas — an operator does not stare at one
 * unit for a shift. So the tile carries four genuinely different scenes, each
 * held for four seconds and crossfaded to the next: a process train, a tank
 * farm, a utilities skid, and a reactor and flare section. Same viewpoint,
 * same palette, same primitives — different plant.
 *
 * Isometric rather than plan or elevation, because that is what a modern
 * overview screen uses to show a whole area at a glance, and because it reads
 * instantly as a plant rather than as an abstract diagram.
 *
 * ── The projection ──────────────────────────────────────────────────────
 * Everything is placed in PLAN coordinates — a grid across the skid — and
 * projected once by `iso`. Placing in plan and projecting late is what keeps
 * a scene in register: move a tower one grid square and its base, its skid
 * and the pipe reaching it all follow. It is also what lets four scenes share
 * one set of primitives without any of them drifting off the common ground
 * plane.
 *
 * ── The cycle ───────────────────────────────────────────────────────────
 * All four scenes are rendered and stacked; CSS fades them. Only the visible
 * one costs anything to composite, and no JS runs. `--rest` marks the first
 * scene as the one that survives reduced motion, where the animation collapses
 * and every scene would otherwise land on its base opacity of 0.
 *
 * The glowing runs between units are process lines. They are the only fully
 * saturated thing in the tile, so the eye reads flow first, which is the
 * point of the screen.
 */
import React from 'react';

/* ── The projection ────────────────────────────────────────────────────
   A 2:1 isometric. `z` is height above the skid. */
const KX = 15.5;
const KY = 8.2;
const ORIGIN = { x: 148, y: 96 };

const iso = (gx: number, gy: number, z = 0) => ({
  x: ORIGIN.x + (gx - gy) * KX,
  y: ORIGIN.y + (gx + gy) * KY - z,
});

const pt = (p: { x: number; y: number }) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

/* ══ PRIMITIVES ══════════════════════════════════════════════════════════ */

/** A diamond footprint from (gx,gy) spanning w x d grid squares. */
const Slab: React.FC<{ gx: number; gy: number; w: number; d: number; lit?: boolean }> = ({
  gx,
  gy,
  w,
  d,
  lit,
}) => {
  const a = iso(gx, gy);
  const b = iso(gx + w, gy);
  const c = iso(gx + w, gy + d);
  const e = iso(gx, gy + d);
  return (
    <g>
      <path
        d={`M${pt(a)}L${pt(b)}L${pt(c)}L${pt(e)}Z`}
        fill={lit ? '#13224a' : '#0d1834'}
        stroke="#2563eb"
        strokeOpacity={lit ? 0.5 : 0.3}
        strokeWidth="0.7"
      />
      {/* Skid edge, so it has thickness */}
      <path
        d={`M${pt(e)}L${pt(c)}L${pt({ x: c.x, y: c.y + 4 })}L${pt({ x: e.x, y: e.y + 4 })}Z`}
        fill="#070d1f"
      />
    </g>
  );
};

/** A vertical column: body, dome, and the shell rings up its side. */
const Tower: React.FC<{
  gx: number;
  gy: number;
  h: number;
  r?: number;
  accent?: string;
  /** Illumination phase, so no two units breathe in step. */
  d?: number;
}> = ({ gx, gy, h, r = 0.34, accent = '#38bdf8', d = 0 }) => {
  const base = iso(gx, gy);
  const w = r * KX * 2;
  const x = base.x - w / 2;
  const top = base.y - h;
  return (
    <g className="evh-unit" style={{ '--d': `${d}s` } as React.CSSProperties}>
      <path
        d={`M${x.toFixed(1)} ${base.y.toFixed(1)}V${(top + 5).toFixed(1)}h${w.toFixed(
          1
        )}V${base.y.toFixed(1)}Z`}
        fill="#101d3f"
        stroke={accent}
        strokeOpacity="0.55"
        strokeWidth="0.6"
      />
      {/* lit edge — one light source, from the left */}
      <path
        d={`M${(x + 1).toFixed(1)} ${base.y.toFixed(1)}V${(top + 6).toFixed(1)}`}
        stroke="#bae6fd"
        strokeOpacity="0.4"
        strokeWidth="0.7"
        fill="none"
      />
      <path
        d={`M${x.toFixed(1)} ${(top + 5).toFixed(1)}a${(w / 2).toFixed(1)} 5 0 0 1 ${w.toFixed(
          1
        )} 0Z`}
        fill="#16264f"
        stroke={accent}
        strokeOpacity="0.6"
        strokeWidth="0.6"
      />
      <g stroke={accent} strokeOpacity="0.22" strokeWidth="0.5">
        {Array.from({ length: Math.max(1, Math.round(h / 11)) }, (_, i) => {
          const y = base.y - 7 - i * 11;
          return y > top + 6 ? (
            <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)}h${w.toFixed(1)}`} />
          ) : null;
        })}
      </g>
      <circle
        className="evh-tip"
        cx={base.x.toFixed(1)}
        cy={(top + 3).toFixed(1)}
        r="1.1"
        fill={accent}
        opacity="0.9"
      />
    </g>
  );
};

/** A horizontal vessel sitting on the skid. */
const Drum: React.FC<{ gx: number; gy: number; len: number; rad?: number }> = ({
  gx,
  gy,
  len,
  rad = 9,
}) => {
  const a = iso(gx, gy, rad);
  const b = iso(gx + len, gy, rad);
  return (
    <g>
      <path
        d={`M${pt(a)}L${pt(b)}`}
        stroke="#16264f"
        strokeWidth={rad * 2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${pt({ x: a.x + 2, y: a.y - rad + 2 })}L${pt({ x: b.x - 2, y: b.y - rad + 2 })}`}
        stroke="#7dd3fc"
        strokeOpacity="0.3"
        strokeWidth="0.8"
        fill="none"
      />
      <ellipse
        cx={a.x.toFixed(1)}
        cy={a.y.toFixed(1)}
        rx="2.6"
        ry={rad}
        fill="#0f1c3d"
        stroke="#2563eb"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
    </g>
  );
};

/** A storage tank: a wide, squat cylinder with a domed roof and a level band.
 *  `fill` is 0..1 — the level, which is what makes a tank farm readable. */
const Tank: React.FC<{ gx: number; gy: number; rad?: number; h?: number; fill?: number; d?: number }> = ({
  gx,
  gy,
  rad = 0.62,
  h = 30,
  fill = 0.6,
  d = 0,
}) => {
  const base = iso(gx, gy);
  const w = rad * KX * 2;
  const x = base.x - w / 2;
  const ry = rad * KY * 2;
  const top = base.y - h;
  const lvl = base.y - h * fill;
  return (
    <g className="evh-unit" style={{ '--d': `${d}s` } as React.CSSProperties}>
      {/* shell */}
      <path
        d={`M${x.toFixed(1)} ${base.y.toFixed(1)}V${top.toFixed(1)}h${w.toFixed(1)}V${base.y.toFixed(1)}`}
        fill="#0e1a3a"
        stroke="#2563eb"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      {/* product level: the one bright band, so the tank reads as measured */}
      <path
        d={`M${x.toFixed(1)} ${lvl.toFixed(1)}h${w.toFixed(1)}`}
        stroke="#22d3ee"
        strokeOpacity="0.75"
        strokeWidth="1.1"
        fill="none"
      />
      <path
        d={`M${x.toFixed(1)} ${lvl.toFixed(1)}V${base.y.toFixed(1)}h${w.toFixed(1)}V${lvl.toFixed(1)}Z`}
        fill="#0e7490"
        fillOpacity="0.16"
        stroke="none"
      />
      {/* roof */}
      <ellipse
        cx={base.x.toFixed(1)}
        cy={top.toFixed(1)}
        rx={(w / 2).toFixed(1)}
        ry={ry.toFixed(1)}
        fill="#16264f"
        stroke="#60a5fa"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      {/* wind girder */}
      <path
        d={`M${x.toFixed(1)} ${(top + h * 0.42).toFixed(1)}h${w.toFixed(1)}`}
        stroke="#60a5fa"
        strokeOpacity="0.18"
        strokeWidth="0.5"
        fill="none"
      />
    </g>
  );
};

/** An air cooler bay — the finned rectangles on top of every utilities rack. */
const Cooler: React.FC<{ gx: number; gy: number; w?: number; d?: number; z?: number; ph?: number }> = ({
  gx,
  gy,
  w = 2.2,
  d = 1.4,
  z = 16,
  ph = 0,
}) => {
  const a = iso(gx, gy, z);
  const b = iso(gx + w, gy, z);
  const c = iso(gx + w, gy + d, z);
  const e = iso(gx, gy + d, z);
  return (
    <g className="evh-unit" style={{ '--d': `${ph}s` } as React.CSSProperties}>
      {/* legs */}
      <g stroke="#1e3a8a" strokeOpacity="0.6" strokeWidth="0.7">
        <path d={`M${pt(e)}v${z}`} />
        <path d={`M${pt(c)}v${z}`} />
      </g>
      <path
        d={`M${pt(a)}L${pt(b)}L${pt(c)}L${pt(e)}Z`}
        fill="#101d3f"
        stroke="#38bdf8"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      {/* fin tubes */}
      <g stroke="#7dd3fc" strokeOpacity="0.22" strokeWidth="0.4">
        {[0.2, 0.4, 0.6, 0.8].map((f) => {
          const p0 = iso(gx + w * f, gy, z);
          const p1 = iso(gx + w * f, gy + d, z);
          return <path key={f} d={`M${pt(p0)}L${pt(p1)}`} />;
        })}
      </g>
      {/* fan rings */}
      <g fill="none" stroke="#22d3ee" strokeOpacity="0.45" strokeWidth="0.5">
        <ellipse cx={iso(gx + w * 0.3, gy + d / 2, z).x} cy={iso(gx + w * 0.3, gy + d / 2, z).y} rx="7" ry="3.6" />
        <ellipse cx={iso(gx + w * 0.72, gy + d / 2, z).x} cy={iso(gx + w * 0.72, gy + d / 2, z).y} rx="7" ry="3.6" />
      </g>
    </g>
  );
};

/** A spherical pressure vessel on its leg cage. */
const Sphere: React.FC<{ gx: number; gy: number; r?: number; d?: number }> = ({
  gx,
  gy,
  r = 15,
  d = 0,
}) => {
  const base = iso(gx, gy);
  const cy = base.y - r - 8;
  return (
    <g className="evh-unit" style={{ '--d': `${d}s` } as React.CSSProperties}>
      <g stroke="#1e3a8a" strokeOpacity="0.65" strokeWidth="0.7">
        {[-0.8, -0.3, 0.3, 0.8].map((f) => (
          <path key={f} d={`M${(base.x + f * r).toFixed(1)} ${(cy + r * 0.7).toFixed(1)}L${(base.x + f * r * 1.15).toFixed(1)} ${base.y.toFixed(1)}`} />
        ))}
      </g>
      <circle cx={base.x.toFixed(1)} cy={cy.toFixed(1)} r={r} fill="#101d3f" stroke="#60a5fa" strokeOpacity="0.55" strokeWidth="0.7" />
      {/* meridian + equator, so it reads as a sphere and not a disc */}
      <g fill="none" stroke="#7dd3fc" strokeOpacity="0.24" strokeWidth="0.5">
        <ellipse cx={base.x.toFixed(1)} cy={cy.toFixed(1)} rx={r} ry={(r * 0.34).toFixed(1)} />
        <ellipse cx={base.x.toFixed(1)} cy={cy.toFixed(1)} rx={(r * 0.42).toFixed(1)} ry={r} />
      </g>
      <path d={`M${(base.x - r * 0.62).toFixed(1)} ${(cy - r * 0.55).toFixed(1)}a${(r * 0.7).toFixed(1)} ${(r * 0.7).toFixed(1)} 0 0 1 ${(r * 0.5).toFixed(1)} -${(r * 0.3).toFixed(1)}`} fill="none" stroke="#bae6fd" strokeOpacity="0.35" strokeWidth="0.7" />
    </g>
  );
};

/** A flare stack with a lit tip. */
const Flare: React.FC<{ gx: number; gy: number; h?: number; d?: number }> = ({ gx, gy, h = 96, d = 0 }) => {
  const base = iso(gx, gy);
  const top = base.y - h;
  return (
    <g className="evh-unit" style={{ '--d': `${d}s` } as React.CSSProperties}>
      {/* derrick */}
      <g stroke="#1e3a8a" strokeOpacity="0.7" strokeWidth="0.6" fill="none">
        <path d={`M${(base.x - 5).toFixed(1)} ${base.y.toFixed(1)}L${(base.x - 1.6).toFixed(1)} ${top.toFixed(1)}`} />
        <path d={`M${(base.x + 5).toFixed(1)} ${base.y.toFixed(1)}L${(base.x + 1.6).toFixed(1)} ${top.toFixed(1)}`} />
        {Array.from({ length: 7 }, (_, i) => {
          const f = (i + 1) / 8;
          const y = base.y - h * f;
          const half = 5 - 3.4 * f;
          return <path key={i} d={`M${(base.x - half).toFixed(1)} ${y.toFixed(1)}h${(half * 2).toFixed(1)}`} strokeOpacity="0.3" />;
        })}
      </g>
      <path d={`M${base.x.toFixed(1)} ${base.y.toFixed(1)}V${top.toFixed(1)}`} stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="0.9" fill="none" />
      {/* pilot flame */}
      <path
        className="evh-tip"
        d={`M${base.x.toFixed(1)} ${(top - 9).toFixed(1)}c-3.4 3.6-4.6 6.4-4.6 8.2 0 2.6 2.1 4.3 4.6 4.3s4.6-1.7 4.6-4.3c0-1.8-1.2-4.6-4.6-8.2Z`}
        fill="#fbbf24"
        fillOpacity="0.85"
      />
    </g>
  );
};

/** A process run between two grid points, drawn on the skid. */
const Line: React.FC<{
  from: [number, number];
  to: [number, number];
  color: string;
  z?: number;
  /** Marching-dash phase, so no two runs pulse in step. */
  d?: number;
  flow?: boolean;
}> = ({ from, to, color, z = 2, d = 0, flow }) => {
  const a = iso(from[0], from[1], z);
  const b = iso(to[0], to[1], z);
  // Right-angled route, as pipe racks actually run.
  const mid = iso(to[0], from[1], z);
  const route = `M${pt(a)}L${pt(mid)}L${pt(b)}`;
  return (
    <>
      <path
        d={route}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeOpacity="0.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Product moving through the line. A marching dash rather than
          particles: at this size a dot is a pixel, and the dash is the
          convention every operator already reads as flow. */}
      {flow && (
        <path
          className="evh-flow"
          style={{ '--d': `${d}s` } as React.CSSProperties}
          d={route}
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </>
  );
};

/** Healthy measurements reporting in. Placed on equipment, never scattered. */
const Tags: React.FC<{ at: [number, number, number][] }> = ({ at }) => (
  <g fill="#10b981">
    {at.map(([gx, gy, z], i) => {
      const p = iso(gx, gy, z);
      return (
        <circle
          key={i}
          className="evh-tag"
          style={{ '--d': `${(-i * 0.9).toFixed(1)}s` } as React.CSSProperties}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r="1.6"
          opacity="0.95"
        />
      );
    })}
  </g>
);

/* ══ SCENES ══════════════════════════════════════════════════════════════ */

/** 1. The process train — columns, a drum, and the runs between them. */
const SceneTrain: React.FC = () => (
  <g>
    <Slab gx={-1} gy={-1} w={4} d={4} />
    <Slab gx={3.4} gy={-1.6} w={3.4} d={3.4} lit />
    <Slab gx={-1.2} gy={3.4} w={3.6} d={3.4} />
    <Slab gx={2.8} gy={2.4} w={4.4} d={4} lit />

    <g filter="url(#evh-pipe-glow)" opacity="0.75">
      <Line from={[0.4, 0.6]} to={[4.6, 0.2]} color="#22d3ee" />
      <Line from={[4.6, 0.2]} to={[5, 4]} color="#a855f7" />
      <Line from={[0.4, 4.6]} to={[5, 4.6]} color="#22d3ee" />
    </g>
    <g>
      <Line from={[0.4, 0.6]} to={[4.6, 0.2]} color="#67e8f9" flow d={0} />
      <Line from={[4.6, 0.2]} to={[5, 4]} color="#c084fc" flow d={-2.1} />
      <Line from={[0.4, 4.6]} to={[5, 4.6]} color="#67e8f9" flow d={-4.4} />
      <Line from={[0.6, 1]} to={[0.6, 4.4]} color="#a78bfa" flow d={-6.2} />
    </g>

    <Tower gx={3.6} gy={-0.6} h={76} r={0.3} accent="#38bdf8" d={-1.4} />
    <Tower gx={4.5} gy={0.1} h={92} r={0.36} accent="#7dd3fc" d={-5.8} />
    <Tower gx={5.4} gy={-0.2} h={68} r={0.28} accent="#38bdf8" d={-9.2} />
    <Drum gx={-0.5} gy={0.2} len={2} rad={8} />
    <Tower gx={3.4} gy={3.2} h={40} r={0.26} accent="#22d3ee" d={-3.1} />
    <Tower gx={4.3} gy={3.9} h={32} r={0.24} accent="#22d3ee" d={-7.5} />

    <Tags at={[[3.6, -0.6, 80], [4.5, 0.1, 96], [5.4, -0.2, 72], [3.4, 3.2, 44], [0.4, 0.2, 20]]} />
  </g>
);

/** 2. The tank farm — storage, with levels and a common header. */
const SceneTankFarm: React.FC = () => (
  <g>
    <Slab gx={-1.4} gy={-1.4} w={7} d={7} />

    <g filter="url(#evh-pipe-glow)" opacity="0.7">
      <Line from={[-0.9, 4.4]} to={[5.2, 4.4]} color="#22d3ee" />
    </g>
    <g>
      <Line from={[-0.9, 4.4]} to={[5.2, 4.4]} color="#67e8f9" flow d={0} />
      <Line from={[0, 4.4]} to={[0, 0.4]} color="#67e8f9" flow d={-1.6} />
      <Line from={[2, 4.4]} to={[2, 0.4]} color="#a78bfa" flow d={-3.4} />
      <Line from={[4, 4.4]} to={[4, 0.4]} color="#67e8f9" flow d={-5.1} />
    </g>

    {/* Back to front — painting order IS depth order in isometric */}
    <Tank gx={4.1} gy={-0.5} rad={0.62} h={34} fill={0.44} d={-6.4} />
    <Tank gx={2.1} gy={0.1} rad={0.7} h={40} fill={0.72} d={-2.2} />
    <Tank gx={0.1} gy={0.7} rad={0.66} h={36} fill={0.55} d={-9.1} />
    <Tank gx={3.2} gy={2.6} rad={0.54} h={28} fill={0.3} d={-4.8} />
    <Drum gx={-0.4} gy={3.2} len={1.8} rad={7} />

    <Tags at={[[2.1, 0.1, 44], [0.1, 0.7, 40], [4.1, -0.5, 38], [3.2, 2.6, 32]]} />
  </g>
);

/** 3. Utilities — air coolers over a rack, with compressor drums beneath. */
const SceneUtilities: React.FC = () => (
  <g>
    <Slab gx={-1.2} gy={-1.2} w={6.6} d={6.6} lit />

    <g filter="url(#evh-pipe-glow)" opacity="0.7">
      <Line from={[-0.6, 0.4]} to={[4.8, 0.4]} color="#a855f7" z={6} />
      <Line from={[-0.6, 3.6]} to={[4.8, 3.6]} color="#22d3ee" z={6} />
    </g>
    <g>
      <Line from={[-0.6, 0.4]} to={[4.8, 0.4]} color="#c084fc" z={6} flow d={0} />
      <Line from={[-0.6, 3.6]} to={[4.8, 3.6]} color="#67e8f9" z={6} flow d={-2.7} />
      <Line from={[4.8, 0.4]} to={[4.8, 3.6]} color="#a78bfa" z={6} flow d={-5.3} />
    </g>

    <Cooler gx={-0.4} gy={-0.6} w={2.4} d={1.5} z={34} ph={-1.1} />
    <Cooler gx={2.6} gy={-0.6} w={2.4} d={1.5} z={34} ph={-5.6} />
    <Cooler gx={1.1} gy={2.2} w={2.4} d={1.5} z={26} ph={-8.4} />

    <Drum gx={-0.6} gy={1.4} len={2.4} rad={9} />
    <Drum gx={2.8} gy={2.0} len={2} rad={7} />
    <Tower gx={4.6} gy={0.6} h={44} r={0.22} accent="#22d3ee" d={-3.9} />

    <Tags at={[[0.8, 0.1, 40], [3.8, 0.1, 40], [2.3, 2.9, 32], [4.6, 0.6, 48]]} />
  </g>
);

/** 4. Reactor and flare — pressure storage, a reactor, and the stack. */
const SceneReactor: React.FC = () => (
  <g>
    <Slab gx={-1.3} gy={-1} w={4.2} d={5} />
    <Slab gx={3.2} gy={-1.4} w={3.6} d={4.4} lit />

    <g filter="url(#evh-pipe-glow)" opacity="0.72">
      <Line from={[0.2, 1.2]} to={[4.4, 0.6]} color="#a855f7" />
      <Line from={[4.4, 0.6]} to={[4.4, 3.4]} color="#22d3ee" />
    </g>
    <g>
      <Line from={[0.2, 1.2]} to={[4.4, 0.6]} color="#c084fc" flow d={0} />
      <Line from={[4.4, 0.6]} to={[4.4, 3.4]} color="#67e8f9" flow d={-3.2} />
      <Line from={[0.2, 3.6]} to={[3.6, 3.6]} color="#a78bfa" flow d={-6.1} />
    </g>

    <Flare gx={5.2} gy={-0.8} h={104} d={-2.6} />
    <Tower gx={3.9} gy={0.4} h={58} r={0.3} accent="#7dd3fc" d={-7.2} />
    <Sphere gx={0.4} gy={0.2} r={15} d={-1.3} />
    <Sphere gx={1.8} gy={2.4} r={11} d={-5.9} />
    <Drum gx={2.8} gy={3.4} len={1.6} rad={7} />

    <Tags at={[[0.4, 0.2, 44], [1.8, 2.4, 34], [3.9, 0.4, 62], [2.8, 3.4, 18]]} />
  </g>
);

const SCENES = [SceneTrain, SceneTankFarm, SceneUtilities, SceneReactor];

const PlantSchematic: React.FC = () => (
  <svg
    className="evh-plant-svg"
    viewBox="0 0 296 190"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient id="evh-plant-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
      </radialGradient>
      <filter id="evh-pipe-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>

    {/* The ground haze belongs to the tile, not to any one scene, so it does
        not fade in and out with them. */}
    <ellipse cx="148" cy="132" rx="140" ry="52" fill="url(#evh-plant-glow)" />

    {SCENES.map((Scene, i) => (
      <g
        key={i}
        className="evh-scene"
        style={
          {
            '--i': i,
            '--n': SCENES.length,
            // The scene that survives reduced motion, where the cycle
            // collapses and every scene would land on its base opacity of 0.
            '--rest': i === 0 ? 1 : 0,
          } as React.CSSProperties
        }
      >
        <Scene />
      </g>
    ))}
  </svg>
);

export default PlantSchematic;
