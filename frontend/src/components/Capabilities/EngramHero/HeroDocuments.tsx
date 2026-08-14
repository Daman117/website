/**
 * The engineering records: flat translucent sheets hanging in space.
 *
 * All five share ONE shear angle (PANEL_SHEAR), which is what makes them
 * read as parallel planes seen from a single viewpoint. Vary it per sheet
 * and they collapse into a fanned-out card deck.
 *
 * The front sheet is a full P&ID — vessels, valves, instrument bubbles and
 * routed process lines — because that is the artefact an engineer recognises
 * instantly. The sheets behind it are a spec table, a trend report, a data
 * index: enough to identify the type at depth, no more.
 *
 * Content is drawn in each panel's LOCAL box (0,0 → w,h) and inherits the
 * parent's skew, so it sits on the plane rather than floating over it.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 * A DEPTH carousel: the stack never moves. The SLOTS are fixed — they are the
 * authored positions — and every three seconds each sheet advances one slot,
 * the front one dropping to the back as the rest step forward.
 *
 * The renderer is built around the SLOT, not the sheet: one group per slot in
 * fixed document order, so the front sheet always paints last and the DOM is
 * never reordered. Reordering was what broke the previous version — a moved
 * node loses its running transition, so the step landed instantly.
 *
 * Each sheet is scaled to fill its slot's box exactly, so a slot looks the
 * same whichever card is in it and the composition is invariant under the
 * rotation. The step itself is a CSS animation between two whole transform
 * lists (--ft, --tt), restarted by remounting the sheet on each tick: an
 * animation needs no previous computed style, so it always runs.
 *
 * The sheet that reaches the front does not travel backwards through the
 * stack — it vanishes and fades in behind it, so nothing streaks across the
 * composition.
 *
 * With reduced motion the interval never starts, so every sheet stays on its
 * authored slot — the approved static composition, exactly.
 *
 * The parallax drift belongs to the slot and sits on the group between them,
 * so it neither competes with the step nor restarts with it.
 *
 * Inside them, a handful of EXISTING marks — P&ID tag blocks, table rows,
 * report lines — brighten in sequence, which reads as information being
 * read out. No scan bars or overlays: nothing new is drawn.
 *
 * ── Orchestration ───────────────────────────────────────────────────────
 * Each sheet carries `--slot`, its turn in the master cycle. Custom
 * properties inherit, so every mark inside a sheet picks that up and only
 * needs its own small `--mark` offset — the sweep is then a property of the
 * sheet, not of each line. Sheets take turns; two never read at once.
 */
import React from 'react';
import { PANEL_SHEAR, docId, slotAt } from './engramHeroData';
import type { EngramLayout } from './engramLayouts';
import type { HeroInteraction } from './engramHeroData';
import type { HeroPanel, PanelKind } from './engramHeroData';

/* ── The P&ID ─────────────────────────────────────────────────────────
   Drawn once, filling its sheet. Deliberately schematic rather than
   accurate: symbols read as ISA-ish at a glance, which is the job here. */
const Pid: React.FC<{ w: number; h: number; c: string }> = ({ w, h, c }) => {
  const x = 26;
  const y = 54;
  const iw = w - 52;
  const ih = h - 84;
  const bub = (bx: number, by: number, r = 13) => (
    <>
      <circle cx={bx} cy={by} r={r} />
      <path d={`M${bx - r} ${by}h${r * 2}`} strokeOpacity="0.55" />
    </>
  );
  return (
    <g fill="none" stroke={c} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.85">
      {/* vertical column, left */}
      <rect x={x + 8} y={y + ih * 0.34} width="30" height={ih * 0.5} rx="15" />
      <path
        d={`M${x + 8} ${y + ih * 0.46}h30M${x + 8} ${y + ih * 0.58}h30M${x + 8} ${y + ih * 0.7}h30`}
        strokeOpacity="0.4"
      />
      {/* horizontal drum, centre */}
      <rect x={x + iw * 0.34} y={y + ih * 0.2} width="44" height="76" rx="22" />
      <path d={`M${x + iw * 0.34} ${y + ih * 0.2 + 38}h44`} strokeOpacity="0.35" />
      {/* reactor, right */}
      <rect x={x + iw * 0.62} y={y + ih * 0.3} width="58" height="52" rx="10" />
      <circle cx={x + iw * 0.62 + 29} cy={y + ih * 0.3 + 26} r="14" strokeOpacity="0.5" />
      {/* instrument bubbles */}
      <g>{bub(x + iw * 0.26, y + 18)}</g>
      <g>{bub(x + iw * 0.55, y + 14)}</g>
      <g>{bub(x + iw * 0.86, y + 30)}</g>
      <g>{bub(x + iw * 0.2, y + ih * 0.86, 11)}</g>
      <g>{bub(x + iw * 0.62, y + ih * 0.9, 11)}</g>
      {/* valves — bowties on the process lines */}
      {[
        [x + iw * 0.2, y + ih * 0.24],
        [x + iw * 0.47, y + ih * 0.62],
        [x + iw * 0.74, y + ih * 0.78],
      ].map(([vx, vy], i) => (
        <g key={i}>
          <path d={`M${vx - 8} ${vy - 6}L${vx} ${vy}L${vx - 8} ${vy + 6}Z`} />
          <path d={`M${vx + 8} ${vy - 6}L${vx} ${vy}L${vx + 8} ${vy + 6}Z`} />
          <path d={`M${vx} ${vy}v-7`} strokeOpacity="0.6" />
        </g>
      ))}
      {/* routed process lines */}
      <path
        d={`M${x} ${y + ih * 0.24}h${iw * 0.2 - 8}M${x + iw * 0.2 + 8} ${y + ih * 0.24}h${iw * 0.14}
            M${x + iw * 0.34 + 22} ${y + ih * 0.2}v-${ih * 0.1}
            M${x + 38} ${y + ih * 0.5}h${iw * 0.28}
            M${x + iw * 0.47} ${y + ih * 0.62}h${iw * 0.15}v-${ih * 0.06}
            M${x + iw * 0.34 + 22} ${y + ih * 0.2 + 76}v${ih * 0.18}h${iw * 0.4}
            M${x + iw * 0.74} ${y + ih * 0.78}h${iw * 0.2}`}
        strokeOpacity="0.62"
      />
      {/* tag labels — abstracted, not readable text. They light in sequence,
          which is the drawing being read tag by tag. */}
      <g>
        {[
          [0.14, 0.14],
          [0.42, 0.1],
          [0.68, 0.5],
          [0.3, 0.7],
          [0.84, 0.66],
          [0.55, 0.86],
        ].map(([fx, fy], i) => (
          <path
            key={i}
            className="egh-scan"
            style={{ '--o': 0.3, '--mark': `${(i * 0.16).toFixed(2)}s` } as React.CSSProperties}
            d={`M${x + iw * fx} ${y + ih * fy}h16`}
            strokeWidth="2.4"
            strokeOpacity="0.3"
          />
        ))}
      </g>
    </g>
  );
};

const CONTENT: Record<PanelKind, (p: HeroPanel) => React.ReactNode> = {
  pid: (p) => <Pid w={p.w} h={p.h} c={p.accent} />,
  table: (p) => {
    const x = 20;
    const y = 50;
    const iw = p.w - 40;
    return (
      <g stroke={p.accent} strokeWidth="0.9" strokeOpacity="0.75" fill="none">
        <rect x={x} y={y} width={iw} height="13" rx="2" fill={p.accent} fillOpacity="0.16" stroke="none" />
        {Array.from({ length: 9 }, (_, r) => (
          <g key={r}>
            <path d={`M${x} ${y + 26 + r * 19}h${iw * 0.4}`} />
            <path
              className="egh-scan"
              style={{ '--o': r % 2 ? 0.35 : 0.6, '--mark': `${(r * 0.13).toFixed(2)}s` } as React.CSSProperties}
              d={`M${x + iw * 0.52} ${y + 26 + r * 19}h${iw * 0.48}`}
              strokeOpacity={r % 2 ? 0.35 : 0.6}
            />
          </g>
        ))}
        <path d={`M${x + iw * 0.46} ${y + 20}v${8 * 19 + 12}`} strokeOpacity="0.2" />
      </g>
    );
  },
  chart: (p) => {
    const x = 20;
    const y = 56;
    const iw = p.w - 40;
    return (
      <g fill="none" strokeLinecap="round">
        <g stroke={p.accent} strokeWidth="0.7" strokeOpacity="0.22">
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${x} ${y + i * 22}h${iw}`} />
          ))}
        </g>
        <path
          d={`M${x} ${y + 74}L${x + iw * 0.18} ${y + 42}L${x + iw * 0.36} ${y + 56}L${x + iw * 0.56} ${
            y + 20
          }L${x + iw * 0.76} ${y + 36}L${x + iw} ${y + 10}`}
          stroke={p.accent}
          strokeWidth="1.5"
        />
        <g stroke={p.accent} strokeWidth="5" strokeOpacity="0.45">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((f, i) => (
            <path key={f} d={`M${x + iw * f} ${y + 168}v-${22 + i * 11}`} />
          ))}
        </g>
        <path d={`M${x} ${y + 168}h${iw}`} stroke={p.accent} strokeWidth="0.8" strokeOpacity="0.4" />
      </g>
    );
  },
  report: (p) => {
    const x = 20;
    const y = 50;
    const iw = p.w - 40;
    return (
      <g stroke={p.accent} strokeWidth="0.9" strokeOpacity="0.6" fill="none" strokeLinecap="round">
        <path d={`M${x} ${y}h${iw * 0.5}`} strokeWidth="1.8" strokeOpacity="0.85" />
        {Array.from({ length: 6 }, (_, i) => (
          <path
            key={i}
            className="egh-scan"
            style={{ '--o': 0.32, '--mark': `${(i * 0.15).toFixed(2)}s` } as React.CSSProperties}
            d={`M${x} ${y + 22 + i * 15}h${iw * (i === 5 ? 0.6 : 1)}`}
            strokeOpacity="0.32"
          />
        ))}
        <rect x={x} y={y + 122} width={iw * 0.44} height="46" rx="3" strokeOpacity="0.5" />
        <path d={`M${x + 10} ${y + 158}l${iw * 0.08} -20 ${iw * 0.09} 12 ${iw * 0.1} -22`} strokeOpacity="0.8" />
        <path d={`M${x + iw * 0.52} ${y + 132}h${iw * 0.48}M${x + iw * 0.52} ${y + 148}h${iw * 0.36}`} strokeOpacity="0.3" />
      </g>
    );
  },
  index: (p) => {
    const x = 20;
    const y = 46;
    const iw = p.w - 40;
    return (
      <g stroke={p.accent} strokeWidth="0.9" strokeOpacity="0.55" fill="none">
        {Array.from({ length: 7 }, (_, r) => (
          <g key={r}>
            <path d={`M${x} ${y + r * 20}h${iw * 0.22}`} strokeOpacity="0.75" />
            <path d={`M${x + iw * 0.3} ${y + r * 20}h${iw * 0.3}`} strokeOpacity="0.3" />
            <path d={`M${x + iw * 0.68} ${y + r * 20}h${iw * 0.32}`} strokeOpacity="0.45" />
          </g>
        ))}
      </g>
    );
  },
};

const HeroDocuments: React.FC<
  HeroInteraction & { L: EngramLayout; shift: number }
> = ({ L, active, onActivate, onDeactivate, shift }) => {
  const n = L.panels.length;

  /* One group PER SLOT, in fixed document order, so the front sheet always
     paints last. Sorting cards by slot would reorder the DOM every step, and
     a moved node loses its running transition — which is what made the step
     land instantly. The card is what rotates through them. */
  const box = (card: HeroPanel, slot: HeroPanel) =>
    `translate(${slot.x}px, ${slot.y}px) skewY(${PANEL_SHEAR}deg) scale(${(
      slot.w / card.w
    ).toFixed(4)}, ${(slot.h / card.h).toFixed(4)})`;

  return (
  <svg
    className="egh-layer egh-layer-docs"
    viewBox={`0 0 ${L.stage.w} ${L.stage.h}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="egh-sheet" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor="#13315f" stopOpacity="0.86" />
        <stop offset="100%" stopColor="#08132c" stopOpacity="0.92" />
      </linearGradient>
    </defs>

    {L.panels.map((t, j) => {
      const p = L.panels[(((j - shift) % n) + n) % n];
      const back = j === 0;
      return (
      <g
        key={j}
        className={`egh-panel${active === docId(p.id) ? ' is-active' : ''}`}
        onPointerEnter={(e) => {
          // Touch fires enter on tap and may never fire leave, which would
          // strand a sheet highlighted. Pointer devices only.
          if (e.pointerType !== 'touch') onActivate(docId(p.id));
        }}
        onPointerLeave={onDeactivate}
        style={
          {
            // Depth belongs to the slot, not to the sheet in it. A monotone
            // ladder, unlike each panel's own `depth`, which is not ordered.
            opacity: (0.58 + (0.42 * j) / Math.max(1, n - 1)).toFixed(2),
            '--amp': t.float,
            '--d': `${t.phase}s`,
          } as React.CSSProperties
        }
      >
        <g className="egh-panel-float">
        {/* Remounted on every step, which is what restarts the animation —
            a transition cannot be relied on here, and an animation needs no
            previous computed style. The card arriving at the BACK does not
            travel: the front sheet vanishes and reappears behind the stack,
            so nothing streaks backwards through the composition. */}
        <g
          key={shift}
          className={`egh-panel-step${
            shift === 0 ? '' : back ? ' is-entering' : ' is-stepping'
          }`}
          style={
            {
              '--tt': box(p, t),
              '--ft': box(p, L.panels[(j - 1 + n) % n]),
              '--slot': `${slotAt(p.slot)}s`,
            } as React.CSSProperties
          }
        >

        <rect
          className="egh-sheet"
          x="0"
          y="0"
          width={p.w}
          height={p.h}
          rx="3"
          fill="url(#egh-sheet)"
          stroke={p.accent}
          strokeOpacity="0.8"
          strokeWidth="1.2"
        />
        {/* header rule + title block, as on a real drawing sheet */}
        <path d={`M0 34h${p.w}`} stroke={p.accent} strokeOpacity="0.45" strokeWidth="1" />
        <path d={`M20 20h58`} stroke={p.accent} strokeOpacity="0.8" strokeWidth="3" />
        <path d={`M${p.w - 96} 20h76`} stroke={p.accent} strokeOpacity="0.35" strokeWidth="2.4" />
        {CONTENT[p.id](p)}
        {/* revision block, bottom right */}
        <path
          d={`M${p.w - 92} ${p.h - 22}h72`}
          stroke={p.accent}
          strokeOpacity="0.3"
          strokeWidth="2.2"
        />
        </g>
        </g>
      </g>
      );
    })}
  </svg>
  );
};

export default HeroDocuments;
