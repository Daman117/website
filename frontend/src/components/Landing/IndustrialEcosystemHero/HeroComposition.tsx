/**
 * The hero visual: three inputs feed a stack of floating data layers, a light
 * column ties the stack down into the plant, and one output leaves to the
 * right as plant intelligence.
 *
 * One <svg>, one viewBox, no filters and no animation — it renders in its
 * final state on first paint.
 *
 * ── The plant is projected, not drawn ────────────────────────────────────
 * Every unit in heroData's PLANT table is positioned on the ground in deck
 * coordinates and pushed through ISO below. That is what buys the depth: the
 * plot plan has a front and a back, units occlude each other in the right
 * order (painter's algorithm on u+v), and cylinders, cuboids and drums all
 * agree about which way the ground goes. It also makes containment free —
 * anything inside DECK_R lands inside the podium ellipse at any scale, so
 * there is no per-breakpoint fudging of the skyline.
 */
import React from 'react';
import { DECK_HALF, DECK_R, PLANT } from './heroData';
import type { HeroLayout, HeroNode, PlantUnit } from './heroData';
import { HeroGlyphMark, HubMark } from './HeroIcons';

/* ── The projection ──────────────────────────────────────────────────────
   A flattened axonometric: `u` runs back-right, `v` runs front-left, and the
   vertical squash is deliberately shallower than a true 30° isometric (0.28
   rather than 0.5) so the podium reads as a disc seen from a low angle
   instead of a deep bowl eating the bottom of the canvas.

   A ground circle of radius r projects to an ellipse with semi-axes
   r·KX·√2 and r·KY·√2 — that is where EX and EY come from. */
const KX = 0.866;
const KY = 0.28;
const EX = KX * Math.SQRT2;
const EY = KY * Math.SQRT2;

/** Palette. Violet-dominant, cyan reserved for the data stream itself. */
const C = {
  body: 'url(#pi-unit)',
  /* Steel and blue for the plant and its podium — this is industrial plant,
     not a brand illustration. The single violet in the whole composition is
     the output node: what the system produces is the brand moment. */
  brand: '#5b2eff',
  edge: '#2b4585',
  edgeHi: '#4a78dd',
  deck: '#2b4585',
  rim: '#3b5ba8',
  node: '#3b5ba8',
};

/** Isometric rhombus: the shape of a floating platform seen edge-on. */
const rhombus = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx} ${cy - ry}L${cx + rx} ${cy}L${cx} ${cy + ry}L${cx - rx} ${cy}Z`;

/** Regular pointy-top hexagon, matching the enxco mark's silhouette. */
const hexagon = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join('') + 'Z';

/** The two front faces of an extruded plate, so it reads as a slab with
 *  thickness rather than as a flat diamond. L->B is the front-left edge and
 *  B->R the front-right; both are dropped by `t` and closed. */
const slab = (cx: number, cy: number, rx: number, ry: number, t: number) => {
  const L = `${cx - rx} ${cy}`;
  const B = `${cx} ${cy + ry}`;
  const R = `${cx + rx} ${cy}`;
  return (
    `M${L}L${B}L${cx} ${cy + ry + t}L${cx - rx} ${cy + t}Z` +
    `M${B}L${R}L${cx + rx} ${cy + t}L${cx} ${cy + ry + t}Z`
  );
};

/** A disc with a wall: the top face, plus the extruded front edge below it. */
const discWall = (cx: number, cy: number, rx: number, ry: number, wall: number) =>
  `M${cx - rx} ${cy}L${cx - rx} ${cy + wall}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + wall}L${cx + rx} ${cy}Z`;

/** The near half of a disc's edge — used for the bright leading rim. */
const frontArc = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy}A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`;

/* ── The plant ─────────────────────────────────────────────────────────── */

const Plant: React.FC<{ cx: number; plant: HeroLayout['plant']; detail: boolean }> = ({
  cx,
  plant,
  detail,
}) => {
  const { cy, scale: s } = plant;
  const sw = detail ? 1 : 0.75;
  /** Deck coordinates → screen. */
  const px = (u: number, v: number) => cx + (u - v) * KX * s;
  const py = (u: number, v: number) => cy + (u + v) * KY * s;
  /** Painter's order: farther back (smaller u+v) is drawn first. */
  const depth = (p: PlantUnit) =>
    (p.u2 === undefined ? p.u : (p.u + p.u2) / 2) +
    (p.v2 === undefined ? p.v : (p.v + p.v2) / 2);
  const units = [...PLANT].sort((a, b) => depth(a) - depth(b));

  /* Atmospheric perspective. Occlusion alone gives order but not distance —
     everything at one line weight reads as a flat diagram however correct the
     sort is. Back of the plot goes lighter and hazier, front stays crisp, and
     the eye reads the gap as depth. `near` is 0 at the back row, 1 at the
     front. */
  const uv = units.map(depth);
  const uvMin = Math.min(...uv);
  const uvSpan = Math.max(...uv) - uvMin || 1;
  const nearOf = (p: PlantUnit) => (depth(p) - uvMin) / uvSpan;

  /* Shared cylinder silhouette: front arc along the base, up the right side,
     back arc across the top, down the left. One path, so a tapered stack and a
     parallel-sided column differ only in the cap radius. */
  const barrel = (x: number, yb: number, yt: number, rb: number, rt: number) => {
    const n = (v: number) => v.toFixed(1);
    return (
      `M${n(x - rb)} ${n(yb)}A${n(rb)} ${n((rb * EY) / EX)} 0 0 0 ${n(x + rb)} ${n(yb)}` +
      `L${n(x + rt)} ${n(yt)}A${n(rt)} ${n((rt * EY) / EX)} 0 0 1 ${n(x - rt)} ${n(yt)}Z`
    );
  };

  const unit = (p: PlantUnit, i: number) => {
    const x = px(p.u, p.v);
    const y = py(p.u, p.v);
    const r = p.r * s;
    const h = p.h * s;
    const rx = r * EX;
    const ry = r * EY;
    const top = y - h;
    const f = (v: number) => v.toFixed(1);
    const near = nearOf(p);
    const line = {
      fill: 'none',
      stroke: C.edge,
      strokeOpacity: 0.5 + near * 0.42,
      strokeWidth: sw * (0.85 + near * 0.3),
    };
    const hair = { fill: 'none', stroke: C.edgeHi, strokeOpacity: 0.24 + near * 0.26, strokeWidth: sw * 0.75 };
    /* Seats the unit on the deck. Without it every vessel floats a little. */
    const shadow =
      p.kind === 'rack' ? null : (
        <ellipse
          cx={x}
          cy={y}
          rx={(p.b !== undefined ? p.r * s * EX * 0.95 : rx * 1.1)}
          ry={(p.b !== undefined ? p.r * s * EY * 0.95 : ry * 1.1)}
          fill="#1e1b4b"
          fillOpacity={0.05 + near * 0.05}
        />
      );

    /* Pipe rack: two tiers of pipes carried on trestle bents. The PIPES are
       what make it a rack — a bare gantry could be anything. */
    if (p.kind === 'rack') {
      const eu = p.u2 ?? p.u;
      const ev = p.v2 ?? p.v;
      const x2 = px(eu, ev);
      const y2 = py(eu, ev);
      const cross = p.v2 !== undefined;
      const bents = cross ? 3 : 6;
      const tiers = cross ? [0, 6 * s, 12 * s] : [0, 5 * s, 10 * s, 16 * s, 21 * s];
      return (
        <g key={i} {...line} strokeOpacity={cross ? 0.34 : 0.5} strokeWidth={sw * 0.8} strokeLinecap="round">
          {tiers.map((d) => (
            <path key={d} d={`M${f(x)} ${f(y - h + d)}L${f(x2)} ${f(y2 - h + d)}`} />
          ))}
          {Array.from({ length: bents }, (_, k) => {
            const t = k / (bents - 1);
            const bx = x + (x2 - x) * t;
            const by = y + (y2 - y) * t;
            return (
              <g key={k}>
                <path d={`M${f(bx)} ${f(by - h - 2 * s)}V${f(by)}`} />
                <path d={`M${f(bx - 6 * s)} ${f(by - h)}h${f(12 * s)}`} strokeOpacity="0.35" />
              </g>
            );
          })}
        </g>
      );
    }

    /* Atmospheric storage tank: wide, short, cone roof, shell courses. The
       tank farm is the most recognisable thing on an oil site, and a wide flat
       tank is the one shape a skyline of cylinders never has. */
    if (p.kind === 'tank') {
      const apex = top - rx * 0.42;
      return (
        <g key={i}>
          {shadow}
          <path d={barrel(x, y, top, rx, rx)} {...line} fill={C.body} />
          <ellipse cx={x} cy={top} rx={rx} ry={ry} {...line} fill="#f6f3fe" strokeOpacity={0.5} />
          <path
            d={`M${f(x - rx)} ${f(top)}L${f(x)} ${f(apex)}L${f(x + rx)} ${f(top)}`}
            {...line}
            strokeOpacity={0.6}
            strokeLinejoin="round"
          />
          <g {...hair}>
            {[0.4, 0.72].map((k) => (
              <path
                key={k}
                d={`M${f(x - rx)} ${f(y - h * k)}A${f(rx)} ${f(ry)} 0 0 0 ${f(x + rx)} ${f(y - h * k)}`}
              />
            ))}
          </g>
        </g>
      );
    }

    /* Boxes share one cuboid; a heater adds its stacks and a cooler its fans. */
    if (p.kind === 'heater' || p.kind === 'cooler' || p.kind === 'box') {
      const a = p.r * s;
      const bd = (p.b ?? p.r) * s;
      const cor = (cu: number, cv: number) =>
        [px(p.u + cu, p.v + cv), py(p.u + cu, p.v + cv)] as const;
      const [ax, ay] = cor(-a, -bd);
      const [bx, by] = cor(a, -bd);
      const [cxx, cyy] = cor(a, bd);
      const [dx, dy] = cor(-a, bd);
      return (
        <g key={i} stroke={C.edge} strokeOpacity="0.72" strokeWidth={sw} strokeLinejoin="round">
          {shadow}
          <path d={`M${f(dx)} ${f(dy - h)}L${f(cxx)} ${f(cyy - h)}L${f(cxx)} ${f(cyy)}L${f(dx)} ${f(dy)}Z`} fill="#f2edfd" />
          <path d={`M${f(cxx)} ${f(cyy - h)}L${f(bx)} ${f(by - h)}L${f(bx)} ${f(by)}L${f(cxx)} ${f(cyy)}Z`} fill="#d6dff3" />
          <path d={`M${f(ax)} ${f(ay - h)}L${f(bx)} ${f(by - h)}L${f(cxx)} ${f(cyy - h)}L${f(dx)} ${f(dy - h)}Z`} fill="#fbf9ff" stroke={C.edgeHi} strokeOpacity="0.55" />
          {p.kind === 'heater' &&
            [-0.42, 0.3].map((k) => {
              const [sx, sy] = cor(a * k, bd * k * 0.4);
              const sr = a * 0.17;
              return <path key={k} d={barrel(sx, sy - h, sy - h - a * 1.5, sr, sr * 0.82)} {...line} fill="#f4f1fd" />;
            })}
          {p.kind === 'box' && (
            <g stroke={C.edgeHi} strokeOpacity="0.4" strokeWidth={sw * 0.7} fill="none">
              <path d={`M${f((ax + dx) / 2)} ${f((ay + dy) / 2 - h)}L${f((bx + cxx) / 2)} ${f((by + cyy) / 2 - h)}`} />
              <path d={`M${f(dx + (cxx - dx) * 0.34)} ${f(dy + (cyy - dy) * 0.34)}v${f(-h * 0.55)}h${f((cxx - dx) * 0.22)}v${f(h * 0.55)}`} />
            </g>
          )}
          {p.kind === 'cooler' &&
            [-0.45, 0.1, 0.62].map((k) => {
              const [sx, sy] = cor(a * k, 0);
              return (
                <ellipse
                  key={k}
                  cx={sx}
                  cy={sy - h}
                  rx={a * 0.3}
                  ry={(a * 0.3 * EY) / EX}
                  fill="none"
                  stroke={C.edgeHi}
                  strokeOpacity="0.55"
                  strokeWidth={sw * 0.8}
                />
              );
            })}
        </g>
      );
    }

    /* Flare stack: the tallest thing on any refinery, and the only one that
       tapers the whole way up to a tip. */
    if (p.kind === 'flare') {
      const tipR = rx * 0.55;
      return (
        <g key={i}>
          {shadow}
          <path d={barrel(x, y, top, rx, tipR)} {...line} fill={C.body} />
          <path d={`M${f(x - tipR * 1.7)} ${f(top)}h${f(tipR * 3.4)}`} {...line} strokeOpacity={0.6} />
          <path d={`M${f(x)} ${f(top)}V${f(top - 9 * s)}`} {...line} />
          <circle cx={x} cy={top - 11 * s} r={2.6 * s} fill={C.edgeHi} fillOpacity="0.8" stroke="none" />
          <g {...hair} strokeOpacity={0.26}>
            {[-1, 1].map((k) => (
              <path key={k} d={`M${f(x + k * tipR)} ${f(top + h * 0.12)}L${f(x + k * rx * 5)} ${f(y)}`} />
            ))}
          </g>
        </g>
      );
    }

    /* LPG sphere on its leg cage. */
    if (p.kind === 'sphere') {
      const R = rx;
      const scy = y - R * 1.15;
      return (
        <g key={i}>
          {shadow}
          <circle cx={x} cy={scy} r={R} {...line} fill={C.body} />
          <ellipse cx={x} cy={scy} rx={R} ry={(R * EY) / EX} {...hair} />
          <g {...line} strokeOpacity={0.5} strokeWidth={sw * 0.8}>
            {[-0.8, -0.32, 0.32, 0.8].map((k) => (
              <path
                key={k}
                d={`M${f(x + R * k)} ${f(scy + R * Math.sqrt(Math.max(0, 1 - k * k)) * 0.85)}L${f(x + R * k * 1.12)} ${f(y)}`}
              />
            ))}
            <path
              d={`M${f(x - R * 0.95)} ${f(y - R * 0.42)}A${f(R * 0.95)} ${f((R * 0.95 * EY) / EX)} 0 0 0 ${f(x + R * 0.95)} ${f(y - R * 0.42)}`}
              strokeOpacity="0.3"
            />
          </g>
        </g>
      );
    }

    /* Horizontal drum on two saddles. */
    if (p.kind === 'drum') {
      const len = p.r * s * Math.hypot(KX, KY);
      const rr = p.r * s * 0.4;
      const ang = (Math.atan2(KY, KX) * 180) / Math.PI;
      return (
        <g key={i}>
          {shadow}
          <g transform={`rotate(${ang.toFixed(2)} ${f(x)} ${f(y - rr)})`}>
          <rect x={x - len} y={y - rr * 2.6} width={len * 2} height={rr * 2} rx={rr} {...line} fill={C.body} />
          <ellipse cx={x - len + rr} cy={y - rr * 1.6} rx={rr * 0.5} ry={rr * 0.85} {...hair} />
          {[-0.55, 0.55].map((k) => (
            <path
              key={k}
              d={`M${f(x + len * k - rr * 0.7)} ${f(y)}L${f(x + len * k - rr * 0.4)} ${f(y - rr * 0.7)}h${f(rr * 0.8)}L${f(x + len * k + rr * 0.7)} ${f(y)}Z`}
              {...line}
              fill="#efeafd"
              strokeOpacity={0.5}
            />
          ))}
          </g>
        </g>
      );
    }

    /* Open braced framework: legs, rungs, and an X in each visible bay. */
    if (p.kind === 'lattice') {
      const a = p.r * s;
      const bd = (p.b ?? p.r) * s;
      const leg = (cu: number, cv: number) =>
        [px(p.u + cu, p.v + cv), py(p.u + cu, p.v + cv)] as const;
      const legs = [leg(-a, -bd), leg(a, -bd), leg(a, bd), leg(-a, bd)];
      const bays = Math.max(3, Math.round(h / (26 * s)));
      const frontEdges: [number, number][] = [[3, 2], [2, 1]];
      return (
        <g key={i} {...line} strokeOpacity={0.6} strokeWidth={sw * 0.85} strokeLinecap="round">
          {shadow}
          {legs.map(([lx, ly], k) => (
            <path key={k} d={`M${f(lx)} ${f(ly)}V${f(ly - h)}`} />
          ))}
          {Array.from({ length: bays + 1 }, (_, k) => (
            <path
              key={`r${k}`}
              strokeOpacity="0.4"
              d={legs.map(([lx, ly], j) => `${j ? 'L' : 'M'}${f(lx)} ${f(ly - (k / bays) * h)}`).join('') + 'Z'}
            />
          ))}
          {frontEdges.map(([j0, j1]) =>
            Array.from({ length: bays }, (_, k) => {
              const t0 = (k / bays) * h;
              const t1 = ((k + 1) / bays) * h;
              const [x0, y0] = legs[j0];
              const [x1, y1] = legs[j1];
              return (
                <path
                  key={`x${j0}-${k}`}
                  strokeOpacity="0.28"
                  d={`M${f(x0)} ${f(y0 - t0)}L${f(x1)} ${f(y1 - t1)}M${f(x1)} ${f(y1 - t0)}L${f(x0)} ${f(y0 - t1)}`}
                />
              );
            })
          )}
        </g>
      );
    }

    /* Distillation column: skirt at grade, domed head, and — the detail that
       actually says refinery — ring platforms up the shell with a caged ladder
       running between them. */
    const skirt = h * 0.07;
    const plats = detail ? [0.34, 0.62, 0.88] : [0.6];
    /* A platform ring wraps the column, so its far half is BEHIND the shell
       and its near half in front. Drawing the whole ellipse over the shell was
       what made solid columns look transparent. */
    const pr = rx * 1.24;
    const pry = ry * 1.24;
    const arc = (cy2: number, back: boolean) =>
      `M${f(x - pr)} ${f(cy2)}A${f(pr)} ${f(pry)} 0 0 ${back ? 1 : 0} ${f(x + pr)} ${f(cy2)}`;
    const platY = (k: number) => y - skirt - (h - skirt) * k;
    return (
      <g key={i}>
        {shadow}
        <g {...hair} strokeOpacity={0.26}>
          {plats.map((k) => (
            <path key={k} d={arc(platY(k), true)} />
          ))}
        </g>
        <path {...line} d={barrel(x, y - skirt, top, rx, rx)} fill={C.body} />
        <path {...line} strokeOpacity={0.5} d={barrel(x, y, y - skirt, rx * 1.06, rx)} fill="#efeafd" />
        <ellipse cx={x} cy={top} rx={rx} ry={ry} {...line} strokeOpacity={0.55} fill="#f6f3fe" />
        <path {...line} strokeOpacity={0.6} d={`M${f(x - rx)} ${f(top)}A${f(rx)} ${f(rx * 0.5)} 0 0 1 ${f(x + rx)} ${f(top)}`} />
        <g {...hair} strokeOpacity={0.5}>
          {plats.map((k) => (
            <path key={k} d={arc(platY(k), false)} />
          ))}
          <path
            d={`M${f(x + rx * 1.1)} ${f(y - skirt)}V${f(top)}`}
            strokeOpacity="0.3"
            strokeDasharray={`${f(3 * s)} ${f(3 * s)}`}
          />
        </g>
      </g>
    );
  };

  /* ── The podium ───────────────────────────────────────────────────────
     Deck, a wider disc under it, and two light rings on the floor. All four
     radii come from the same deck-unit system as the plot plan, so the whole
     assembly stays in proportion at any scale. */
  const disc = (R: number, dy: number) => ({
    cy: cy + dy * s,
    rx: R * s * EX,
    ry: R * s * EY,
  });
  /* Tighter than the first pass. The rings used to reach half again past the
     deck, which made the plant look small standing in the middle of them; the
     reference keeps them close, so the podium reads as a plinth rather than
     as a stage the plant is lost on. */
  const deckWall = 15;
  const baseWall = 19;
  const deck = disc(DECK_R, 0);
  const base = disc(DECK_R * 1.1, 28);
  /* Both floor rings lie on the GROUND PLANE — the level where the podium's
     lower disc meets the floor — so they are genuinely concentric with each
     other and with that disc's front rim. Previously each ring sat on its own
     plane (three different cy values), which is why the bottom arcs read as
     misaligned: two near-coincident curves at different radii. */
  const groundY = 28 + baseWall;
  const ring1 = disc(DECK_R * 1.22, groundY);
  const ring2 = disc(DECK_R * 1.36, groundY);

  return (
    <g>
      {/* Floor rings, outermost first. */}
      <ellipse cx={cx} cy={ring2.cy} rx={ring2.rx} ry={ring2.ry} fill="none" stroke={C.edge} strokeOpacity="0.35" strokeWidth={sw * 1.2} />
      <ellipse cx={cx} cy={ring1.cy} rx={ring1.rx} ry={ring1.ry} fill="none" stroke={C.rim} strokeOpacity="0.5" strokeWidth={sw * 1.4} />

      {/* Lower disc. */}
      <path d={discWall(cx, base.cy, base.rx, base.ry, baseWall * s)} fill="url(#pi-wall)" />
      <ellipse cx={cx} cy={base.cy} rx={base.rx} ry={base.ry} fill="#e8ecf0" stroke={C.edge} strokeOpacity="0.45" strokeWidth={sw} />
      <path d={frontArc(cx, base.cy + baseWall * s, base.rx, base.ry)} fill="none" stroke={C.rim} strokeOpacity="0.75" strokeWidth={sw * 2} />

      {/* Deck. */}
      <path d={discWall(cx, deck.cy, deck.rx, deck.ry, deckWall * s)} fill="url(#pi-wall)" />
      <ellipse cx={cx} cy={deck.cy} rx={deck.rx} ry={deck.ry} fill="#f8f6fc" stroke={C.deck} strokeOpacity="0.5" strokeWidth={sw} />
      {detail && (
        <g fill="none" stroke={C.deck} strokeOpacity="0.14" strokeWidth="0.8">
          {[0.72, 0.44].map((k) => (
            <ellipse key={k} cx={cx} cy={deck.cy} rx={deck.rx * k} ry={deck.ry * k} />
          ))}
          {Array.from({ length: 12 }, (_, k) => {
            const a = (k / 12) * Math.PI * 2;
            return (
              <path
                key={k}
                d={`M${cx} ${deck.cy}L${(cx + deck.rx * Math.cos(a)).toFixed(1)} ${(deck.cy + deck.ry * Math.sin(a)).toFixed(1)}`}
              />
            );
          })}
        </g>
      )}
      <path d={frontArc(cx, deck.cy + deckWall * s, deck.rx, deck.ry)} fill="none" stroke={C.deck} strokeOpacity="0.65" strokeWidth={sw * 1.6} />

      {/* The square process deck laid over the round podium, with its own
          grid. The plot plan is authored against THIS, which is why the units
          line up into rows and columns instead of scattering — and why the
          podium keeps a visible rim all the way round. */}
      {(() => {
        const D = DECK_HALF * s;
        const c = (du: number, dv: number) =>
          `${(cx + (du - dv) * KX).toFixed(1)} ${(cy + (du + dv) * KY).toFixed(1)}`;
        const n = 8;
        return (
          <g>
            <path
              d={`M${c(-D, -D)}L${c(D, -D)}L${c(D, D)}L${c(-D, D)}Z`}
              fill="#ece7fb"
              fillOpacity="0.9"
              stroke={C.deck}
              strokeOpacity="0.55"
              strokeWidth={sw}
              strokeLinejoin="round"
            />
            {detail && (
              <g fill="none" stroke={C.deck} strokeOpacity="0.3" strokeWidth="0.75">
                {Array.from({ length: n - 1 }, (_, k) => {
                  const t = -D + ((k + 1) * 2 * D) / n;
                  return (
                    <React.Fragment key={k}>
                      <path d={`M${c(t, -D)}L${c(t, D)}`} />
                      <path d={`M${c(-D, t)}L${c(D, t)}`} />
                    </React.Fragment>
                  );
                })}
              </g>
            )}
          </g>
        );
      })()}

      {units.map(unit)}
    </g>
  );
};

/* ── Nodes ─────────────────────────────────────────────────────────────── */

const NodeLabel: React.FC<{ node: HeroNode; label: HeroLayout['label'] }> = ({ node, label }) => {
  /* A block above the node is anchored by its BOTTOM line, so a one-line
     label sits just above the icon instead of floating a line-height clear
     of it. Below the node, the first line is the anchor. */
  const start = node.labelDy < 0 ? node.labelDy + (2 - node.label.length) * label.line : node.labelDy;
  return (
    <>
      {node.label.map((line, i) => (
        <text
          key={line}
          className="ieh-label"
          x={node.x}
          y={node.y + start + i * label.line}
          textAnchor="middle"
          fontSize={label.size}
        >
          {line}
        </text>
      ))}
    </>
  );
};

const HeroComposition: React.FC<{ layout: HeroLayout }> = ({ layout }) => {
  const { stage, cx, layers, stream, plant, inputs, output, label } = layout;
  const detail = layout.variant === 'desktop';
  const nodes = [...inputs, output];

  /* Streamlines are evenly spaced but fade toward the edges of the column and
     carry a different dash phase each, so the group reads as falling data
     rather than as a comb. */
  const lines = Array.from({ length: stream.count }, (_, i) => {
    const t = (i / (stream.count - 1)) * 2 - 1;
    return { x: cx + t * stream.half, o: 1 - Math.abs(t) * 0.55, d: i * 2.6 };
  });

  return (
    <svg
      className="ieh-svg"
      viewBox={`0 0 ${stage.w} ${stage.h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="enxco connects engineering documents, operational data and live SCADA into layered plant intelligence."
      focusable="false"
    >
      <defs>
        {/* The plate's edge, a step darker than its face so the thickness
            reads without a second stroke. */}
        <linearGradient id="pi-slab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#97b2ee" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#4a78dd" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="pi-layer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2156cb" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6a91e7" stopOpacity="0.06" />
        </linearGradient>
        {/* Opaque on purpose. Translucent equipment let every unit show the
            ones behind it, so the depth sort had no visual effect and the
            plot read as wireframe soup. Solid shells occlude properly; the
            violet lift at the top is the only shading. */}
        <linearGradient id="pi-unit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3eafa" />
          <stop offset="55%" stopColor="#f5f1fe" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="pi-wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f3f5f8" />
          <stop offset="45%" stopColor="#f7f6fc" />
          <stop offset="100%" stopColor="#f3f5f8" />
        </linearGradient>
        {/* userSpaceOnUse, not the default objectBoundingBox: every streamline
            is a vertical path, so its bounding box is zero-wide and an
            objectBoundingBox gradient on it renders nothing at all. */}
        <linearGradient id="pi-stream" gradientUnits="userSpaceOnUse" x1={cx} y1={stream.top} x2={cx} y2={stream.bottom}>
          <stop offset="0%" stopColor="#1b47a7" stopOpacity="0" />
          <stop offset="20%" stopColor="#2156cb" stopOpacity="0.9" />
          <stop offset="72%" stopColor="#077e9b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#088aaa" stopOpacity="0" />
        </linearGradient>
      </defs>


      {/* ── The data stream, descending into the plant ───────────────── */}
      <g className="ieh-anim-stream" stroke="url(#pi-stream)" strokeLinecap="round" strokeWidth={detail ? 1.1 : 0.9}>
        {lines.map((l) => (
          <path
            key={l.x}
            d={`M${l.x.toFixed(1)} ${stream.top}V${stream.bottom}`}
            opacity={l.o.toFixed(2)}
            strokeDasharray={detail ? '2.4 8' : '1.6 6'}
            strokeDashoffset={l.d}
          />
        ))}
        <path d={`M${cx} ${stream.top}V${stream.bottom}`} strokeWidth={detail ? 2.2 : 1.5} opacity="0.65" strokeDasharray="none" />
      </g>

      <g className="ieh-anim-plant">
        <Plant cx={cx} plant={plant} detail={detail} />
      </g>

      {/* ── The floating data layers ─────────────────────────────────── */}
      {layers.map((l, i) => (
        <g
          key={l.cy}
          className="ieh-anim-layer"
          style={{ '--ieh-layer-delay': `${700 + i * 200}ms` } as React.CSSProperties}
        >
          <path
            d={slab(cx, l.cy, l.rx, l.ry, detail ? 7 : 4)}
            fill="url(#pi-slab)"
            stroke={l.stroke}
            strokeOpacity="0.6"
            strokeWidth={detail ? 1 : 0.8}
            strokeLinejoin="round"
          />
          <path d={rhombus(cx, l.cy, l.rx, l.ry)} fill="url(#pi-layer)" stroke={l.stroke} strokeOpacity="0.85" strokeWidth={detail ? 1.3 : 1} strokeLinejoin="round" />
          {/* A grid of points ON the platform. Placed in the rhombus's OWN
              basis — half-diagonals rx and ry — rather than through the deck's
              iso transform, because the plates are drawn flatter than the deck
              and a shared projection would push the dots outside the shape. */}
          {detail && (
            <g fill={l.stroke} fillOpacity="0.32">
              {(() => {
                const n = 9;
                const dots = [];
                for (let a = 0; a < n; a++)
                  for (let b = 0; b < n; b++) {
                    const ta = -1 + (a * 2) / (n - 1);
                    const tb = -1 + (b * 2) / (n - 1);
                    if (Math.abs(ta) + Math.abs(tb) > 1.55) continue;
                    dots.push(
                      <circle
                        key={`${a}-${b}`}
                        cx={(cx + ((ta - tb) / 2) * l.rx).toFixed(1)}
                        cy={(l.cy + ((ta + tb) / 2) * l.ry).toFixed(1)}
                        r="1.1"
                      />
                    );
                  }
                return dots;
              })()}
            </g>
          )}
          <path d={rhombus(cx, l.cy, l.rx * 0.62, l.ry * 0.62)} fill="none" stroke={l.stroke} strokeOpacity="0.22" strokeWidth={detail ? 0.9 : 0.7} strokeLinejoin="round" />
          {/* Only the top platform carries the mark — repeated, it would read
              as a watermark rather than as the system's own face. */}
          {i === 0 && <HubMark x={cx} y={l.cy} r={l.rx * 0.17} tone={l.stroke} opacity={0.95} />}
        </g>
      ))}

      {/* ── Connectors ───────────────────────────────────────────────── */}
      <g className="ieh-anim-connectors" fill="none" stroke={C.node} strokeOpacity="0.5" strokeWidth={detail ? 1.3 : 1} strokeLinecap="round" strokeLinejoin="round">
        {nodes.map((n) => (
          <path key={n.id} d={n.path} />
        ))}
      </g>
      <g className="ieh-anim-connectors" fill="#1b47a7" fillOpacity="0.9">
        {nodes.map((n) => (
          <circle key={n.id} cx={n.dot[0]} cy={n.dot[1]} r={detail ? 3.6 : 2.4} />
        ))}
      </g>

      {/* ── Input nodes ──────────────────────────────────────────────── */}
      <g className="ieh-anim-nodes">
        {inputs.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.r} fill="#edf0f3" fillOpacity="0.9" stroke={C.edge} strokeOpacity="0.72" strokeWidth={detail ? 1.3 : 1} />
            <HeroGlyphMark glyph={n.glyph} x={n.x} y={n.y} size={n.r * 1.05} color="#1b47a8" />
          </g>
        ))}
      </g>

      {/* ── Output node ──────────────────────────────────────────────── */}
      <g className="ieh-anim-nodes">
        <path d={hexagon(output.x, output.y, output.r)} fill="#edf0f3" fillOpacity="0.9" stroke={C.rim} strokeOpacity="0.7" strokeWidth={detail ? 1.4 : 1.1} strokeLinejoin="round" />
        <HeroGlyphMark glyph={output.glyph} x={output.x} y={output.y} size={output.r * 1.05} color="#1e4fbb" />
      </g>

      {/* Labels last: nothing may paint over the reading layer. */}
      <g className="ieh-anim-labels">
        {nodes.map((n) => (
          <NodeLabel key={n.id} node={n} label={label} />
        ))}
      </g>
    </svg>
  );
};

export default HeroComposition;
