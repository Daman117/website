/**
 * The enSTUDIO hero's bottom layer — a neural-network field, not a wave.
 *
 * Columns of nodes with thin edges running between them, three layers deep,
 * each layer drifting at its own speed so the field reads as depth rather
 * than as one sheet sliding. Three routes through the net are drawn slightly
 * brighter and carry a travelling signal each.
 *
 * ── Why it repeats cleanly ──────────────────────────────────────────────
 * The node pattern is periodic: column c takes its heights from
 * PATTERN[(c + rot) % 4], so every fourth column is identical. Each layer
 * spans one period past the frame on both sides and scrolls by exactly one
 * period before repeating — landing on geometry indistinguishable from where
 * it started. No crossfade, no reset, nothing to hide.
 *
 * ── Why the edges are one path ──────────────────────────────────────────
 * Roughly a hundred edges per layer, none of which animate individually —
 * only the layer scrolls. They are emitted as subpaths of a single <path>,
 * so a hundred connections cost one element. The nodes stay separate circles
 * because a few of them are picked out brighter, and the three routes are
 * their own paths because a rider needs a single continuous rail to follow
 * (a motion path over a multi-subpath element would jump between subpaths).
 *
 * preserveAspectRatio="none" lets the band span any viewport width; the edges
 * stay hairlines because they carry vector-effect="non-scaling-stroke" rather
 * than being scaled with the box.
 *
 * All motion lives in useEnstudioWaveAnimation — separate from the core's
 * hook, so the two can be retimed independently.
 */
import React from 'react';
import { useEnstudioWaveAnimation } from './useEnstudioWaveAnimation';

/** Design box for the field. Both are nominal — the field is stretched to the
 *  hero's box and the strokes opt out of that scaling. */
const W = 1600;
const H = 700;

const COL_W = 240;
const COLS_PER_PERIOD = 4;
/** The scroll distance that makes the loop invisible. */
const PERIOD = COL_W * COLS_PER_PERIOD;
const COLS = Math.ceil((W + 2 * PERIOD) / COL_W) + 1;

/** Node heights per column, cycling every four columns. Hand-placed rather
 *  than generated: a real topology has uneven layers, and a PRNG here would
 *  buy variety at the cost of never being able to nudge one row. */
const PATTERN = [
  [58, 168, 286, 402, 524, 646],
  [104, 224, 352, 470, 604],
  [42, 146, 264, 388, 512, 630],
  [88, 202, 330, 448, 578, 668],
];

type Col = { x: number; ys: number[] };

/**
 * One depth of the field. `scale` pulls the heights toward the middle and
 * `shift` drops the whole layer, so the three read as near, mid and far;
 * `rot` offsets which pattern column each layer starts on, so they never line
 * up vertically.
 */
const buildLayer = (scale: number, shift: number, rot: number) => {
  const cols: Col[] = [];
  for (let c = 0; c < COLS; c += 1) {
    cols.push({
      x: -PERIOD + c * COL_W,
      ys: PATTERN[(c + rot) % PATTERN.length].map((y) => H / 2 + (y - H / 2) * scale + shift),
    });
  }

  // Every node joins the two nearest in the next column — the cheapest rule
  // that produces the uneven fan-in and fan-out a real network diagram has.
  let edges = '';
  for (let c = 0; c < cols.length - 1; c += 1) {
    const a = cols[c];
    const b = cols[c + 1];
    a.ys.forEach((y) => {
      [...b.ys]
        .sort((p, q) => Math.abs(p - y) - Math.abs(q - y))
        .slice(0, 2)
        .forEach((ny) => {
          edges += `M${a.x} ${y.toFixed(1)}L${b.x} ${ny.toFixed(1)}`;
        });
    });
  }

  return { cols, edges };
};

/** A path along real edges: from one node, always to the nearest node in the
 *  next column. This is the rail a signal rides, so it has to be one
 *  continuous polyline rather than a set of segments. */
const route = (cols: Col[], from: number, idx: number, steps: number) => {
  let y = cols[from].ys[idx % cols[from].ys.length];
  let d = `M${cols[from].x} ${y.toFixed(1)}`;
  for (let c = from; c < Math.min(from + steps, cols.length - 1); c += 1) {
    y = cols[c + 1].ys.reduce((best, cur) => (Math.abs(cur - y) < Math.abs(best - y) ? cur : best));
    d += `L${cols[c + 1].x} ${y.toFixed(1)}`;
  }
  return d;
};

/** Three depths. Durations share no common factor worth speaking of, so the
 *  layers drift apart instead of beating together. */
const LAYERS = [
  { depth: 'far', scale: 0.72, shift: 26, rot: 2, dur: 52000, route: null },
  { depth: 'mid', scale: 0.88, shift: 10, rot: 1, dur: 38000, route: { from: 3, idx: 1, steps: 6 } },
  { depth: 'near', scale: 1, shift: 0, rot: 0, dur: 27000, route: { from: 2, idx: 3, steps: 7 } },
];

/** Every sixth node picked out brighter — the field needs a few points of
 *  emphasis or it reads as texture rather than as a network. */
const isAccent = (c: number, i: number) => (c * 3 + i) % 6 === 0;

/** Matches the phone breakpoint in enstudio-hero.css. Read once per render,
 *  not tracked: a resize past the breakpoint keeps whichever depth was built,
 *  which is a fair trade for holding no state and re-rendering never. */
const COMPACT = '(max-width: 719px)';

const EnstudioHeroWave: React.FC = () => {
  const ref = useEnstudioWaveAnimation();

  /* One layer on a phone instead of three. The far two are the cheapest thing
     to lose — they are the faintest, and two thirds of ~170 nodes and ~200
     edges is the single largest paint saving available in this hero. */
  const layers =
    typeof window !== 'undefined' && window.matchMedia(COMPACT).matches
      ? LAYERS.slice(2)
      : LAYERS;

  return (
    <svg
      ref={ref}
      className="esh-wave"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      {layers.map((layer, li) => {
        const { cols, edges } = buildLayer(layer.scale, layer.shift, layer.rot);

        return (
          <g
            key={layer.depth}
            id={`esh-net-${layer.depth}`}
            className={`enstudio-net-layer enstudio-net-layer--${layer.depth}`}
            data-animation="net"
            data-index={li}
            data-period={PERIOD}
            data-duration={layer.dur}
          >
            <path className="enstudio-net-edge" vectorEffect="non-scaling-stroke" d={edges} />

            {layer.route && (
              <path
                id={`esh-net-route-${li}`}
                className="enstudio-net-route"
                vectorEffect="non-scaling-stroke"
                d={route(cols, layer.route.from, layer.route.idx, layer.route.steps)}
              />
            )}

            {cols.map((col, ci) =>
              col.ys.map((y, i) => (
                <circle
                  key={`${col.x}-${y}`}
                  className={`enstudio-net-node${isAccent(ci, i) ? ' enstudio-net-node--accent' : ''}`}
                  cx={col.x}
                  cy={y}
                  r={isAccent(ci, i) ? 2.4 : 1.7}
                />
              )),
            )}

            {layer.route && (
              <circle
                id={`esh-net-signal-${li}`}
                className="enstudio-net-particle"
                data-animation="particle"
                data-path={`#esh-net-route-${li}`}
                cx="0"
                cy="0"
                r="2.2"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default EnstudioHeroWave;
