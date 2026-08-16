/**
 * The enGENIE hero's right-hand visual: a transmitter inside a hexagonal
 * framework, with six capability nodes wired to it.
 *
 * Drawn, not photographed. The instrument is line art — a housing, a display,
 * two side covers, a manifold and its process connection — because the point
 * is the SYSTEM around it, and a rendered product shot would out-shout every
 * line connected to it.
 *
 * ── Six nodes, not twelve ───────────────────────────────────────────────
 * Search, validation, intelligence, engineering, reliability, performance.
 * Each is a stage of what enGENIE actually does, so the ring is an argument
 * rather than a decoration. More nodes would turn a claim into a dashboard.
 *
 * ── Geometry ────────────────────────────────────────────────────────────
 * Everything is placed in ONE polar-ish layout around the core and drawn from
 * two primitives, `hex` and `link`. Links are trimmed at both radii rather
 * than drawn centre-to-centre, so a line stops at the hex edge instead of
 * running under the icon — and it stays correct if a node is moved, because
 * the trim is computed rather than hand-tuned.
 *
 * The nodes are deliberately NOT on one circle. An even ring reads as a
 * clock face; varied radii read as a system that grew.
 *
 * ── Motion ──────────────────────────────────────────────────────────────
 * The system: the core breathes, the node outlines pulse in turn, a highlight
 * travels the central hexagon, and particles ride the links using the links'
 * own paths.
 *
 * The INSTRUMENT has its own set, so it reads as a device that is running
 * rather than a drawing that is lit: the outer frame breathes, the outline
 * pulses in brightness, a glow travels the gauge rim while a scan sweeps its
 * face, the readout flickers the way a real display does, and an energy pulse
 * rises through the body from the process connection to the housing.
 *
 * All of it on `opacity`, `stroke-opacity` and dash offsets, with one slow
 * rotation for the scan. Nothing bounces, shakes or jumps, and the number
 * itself never changes — a readout that ticked would be a claim about live
 * data that is not true, and an unreadable one at that.
 *
 * Anime drives all of it and every instance is reverted on unmount. SMIL is
 * not used here, so the whole layer is covered by one reduced-motion check.
 */
import React, { useEffect, useRef } from 'react';
import { animate, svg } from 'animejs';
import type { JSAnimation } from 'animejs';

/** The system's clock.
 *
 *  The EVENT layer — node sweeps and connector pulses — is derived from this
 *  rather than from twelve hand-picked numbers. Twelve events fall inside one
 *  beat: six node sweeps a sixth apart, six connector pulses interleaved
 *  half a step between them. So something lights up about every 1.6s, always
 *  one thing at a time, and the pattern repeats exactly.
 *
 *  The AMBIENT layer — breathing glows, outline pulses, the gauge scan — is
 *  deliberately NOT on this clock. Tied to it, the whole visual would inhale
 *  together and read as one pulsing object; left on their own long periods
 *  they drift against the events, which is what makes the system feel alive
 *  rather than metronomic. */
const BEAT = 19500;
const STEP = BEAT / 6;

const W = 720;
const H = 780;
const C = { x: 358, y: 372 };
/** The framework around the instrument, and the node hexes. */
const R_CORE = 152;
const R_NODE = 50;

/** A pointy-top hexagon — vertical sides, points top and bottom. */
function hex(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join('L')}Z`;
}

/** A connector that stops at both hex edges rather than at their centres, so
 *  it never runs under an icon. */
function link(a: { x: number; y: number }, b: { x: number; y: number }, ra: number, rb: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return (
    `M${(a.x + ux * ra).toFixed(1)} ${(a.y + uy * ra).toFixed(1)}` +
    `L${(b.x - ux * rb).toFixed(1)} ${(b.y - uy * rb).toFixed(1)}`
  );
}

type NodeId = 'search' | 'validate' | 'ai' | 'engineer' | 'reliable' | 'performance';

/** Placed off one circle on purpose: an even ring reads as a clock face. */
const NODES: { id: NodeId; x: number; y: number; d: number }[] = [
  { id: 'search', x: 300, y: 96, d: 0 },
  { id: 'validate', x: 530, y: 152, d: -1.4 },
  { id: 'ai', x: 622, y: 348, d: -2.8 },
  { id: 'performance', x: 588, y: 566, d: -4.2 },
  { id: 'reliable', x: 372, y: 660, d: -5.6 },
  { id: 'engineer', x: 108, y: 306, d: -7 },
];

/* ── Node glyphs ──────────────────────────────────────────────────────
   Drawn on a 40x40 box centred on the node, `fill="none"`, stroking with
   currentColor so a node's tint is set once on its group. */
const GLYPH: Record<NodeId, React.ReactNode> = {
  search: (
    <>
      <circle cx="17" cy="17" r="11" />
      <path d="M25 25l8 8" />
      <path d="M13 17h8M17 13v8" strokeOpacity="0.55" />
    </>
  ),
  validate: (
    <>
      <path d="M9 8h16a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" />
      <path d="M13 5h8v6h-8Z" />
      <path d="M12 18h7M12 24h5" strokeOpacity="0.6" />
      <circle cx="27" cy="26" r="8" />
      <path d="M23.5 26l2.5 2.5 4.5-5" />
    </>
  ),
  ai: (
    <>
      <path d="M20 8v26" strokeOpacity="0.5" />
      <path d="M20 10a6 6 0 0 0-11 3 5 5 0 0 0-3 8 5 5 0 0 0 4 8 6 6 0 0 0 10 3" />
      <path d="M20 10a6 6 0 0 1 11 3 5 5 0 0 1 3 8 5 5 0 0 1-4 8 6 6 0 0 1-10 3" />
      <path d="M13 17h4M23 17h4M15 25h5M20 25h5" strokeOpacity="0.5" />
    </>
  ),
  engineer: (
    <>
      {/* Eight teeth around the rim, then the body ring and the bore. The
          teeth are one rect rotated rather than eight authored shapes, so
          they are identical and evenly spaced by construction. */}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M17.7 2.6h4.6v7.2h-4.6Z" transform={`rotate(${i * 45} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="11.4" />
      <circle cx="20" cy="20" r="5.2" />
    </>
  ),
  reliable: (
    <>
      <path d="M20 5l13 5v11c0 8-5.5 13-13 15-7.5-2-13-7-13-15V10Z" />
      <path d="M14 20l4.5 4.5L27 16" />
    </>
  ),
  performance: (
    <>
      <path d="M6 34h28" strokeOpacity="0.6" />
      <path d="M11 34V24M18 34V17M25 34V21M32 34V12" />
      <path d="M9 15l7-6 6 4 9-8" strokeOpacity="0.7" />
      <path d="M25 5h6v6" strokeOpacity="0.7" />
    </>
  ),
};

interface Props {
  reduceMotion: boolean;
  /** False when the hero is off-screen. Around a hundred instances run across
   *  this hero; leaving them ticking behind the fold is work nobody sees. */
  active: boolean;
}

const HeroSystem: React.FC<Props> = ({ reduceMotion, active }) => {
  const ref = useRef<SVGSVGElement>(null);
  const runsRef = useRef<JSAnimation[]>([]);

  /* Paused rather than reverted: a revert would put every target back to its
     resting style and the system would visibly snap. Pausing holds the frame
     it was on, so scrolling back finds it exactly where it left off. */
  useEffect(() => {
    runsRef.current.forEach((r) => (active ? r.play() : r.pause()));
  }, [active]);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion) return;

    const runs: JSAnimation[] = [];

    /* The core breathes. On a glow layer's opacity rather than on the
       instrument itself, so the line work never changes weight. */
    const glow = root.querySelector<SVGElement>('.egn-sys-glow');
    if (glow) {
      runs.push(
        animate(glow, {
          opacity: [0.45, 0.85, 0.45],
          duration: 7200,
          ease: 'inOutSine',
          loop: true,
        })
      );
    }

    /* The outer frame, breathing. Slower than the core, so the two never
       crest together and the field reads as layered. */
    const frame = root.querySelector<SVGElement>('.egn-sys-frame:not(.is-inner)');
    if (frame) {
      runs.push(
        animate(frame, {
          strokeOpacity: [0.22, 0.46, 0.22],
          duration: 9800,
          ease: 'inOutSine',
          loop: true,
        })
      );
    }

    /* The instrument outline. On the GROUP's stroke-opacity, so housing,
       manifold and flanges brighten as one device rather than part by part. */
    const instr = root.querySelector<SVGElement>('.egn-sys-instr');
    if (instr) {
      runs.push(
        animate(instr, {
          strokeOpacity: [0.78, 1, 0.78],
          duration: 8200,
          ease: 'inOutSine',
          loop: true,
        })
      );
    }

    /* A glow travelling the gauge rim, and a scan turning across its face.
       The scan is the one rotation in the hero — 19s for a turn, slow enough
       to read as a sweep rather than a spinner. */
    const rim = root.querySelector<SVGElement>('.egn-gauge-sweep');
    if (rim) {
      runs.push(
        animate(rim, { strokeDashoffset: [1, 0], duration: 11000, ease: 'linear', loop: true })
      );
    }
    const scan = root.querySelector<SVGElement>('.egn-gauge-scan');
    if (scan) {
      runs.push(animate(scan, { rotate: [0, 360], duration: 19000, ease: 'linear', loop: true }));
    }

    /* The readout. A long steady hold with two short dips — that is what a
       display refreshing looks like; an even sine would read as a pulsing
       lamp. The digits never change. */
    const read = root.querySelector<SVGElement>('.egn-sys-read');
    if (read) {
      runs.push(
        animate(read, {
          opacity: [
            { to: 1, duration: 2600 },
            { to: 0.72, duration: 130 },
            { to: 1, duration: 190 },
            { to: 1, duration: 1500 },
            { to: 0.85, duration: 110 },
            { to: 1, duration: 240 },
          ],
          ease: 'inOutQuad',
          loop: true,
        })
      );
    }

    /* Energy rising through the body. Fades at both ends of its run, so the
       return to the bottom is never seen. */
    const pulse = root.querySelector<SVGElement>('.egn-instr-pulse');
    if (pulse) {
      runs.push(
        animate(pulse, {
          translateY: [0, -232],
          duration: 6400,
          ease: 'inOutSine',
          loop: true,
          loopDelay: 3200,
        })
      );
      runs.push(
        animate(pulse, {
          opacity: [
            { to: 0, duration: 0 },
            { to: 0.9, duration: 1100 },
            { to: 0.9, duration: 3600 },
            { to: 0, duration: 1700 },
            { to: 0, duration: 3200 },
          ],
          ease: 'inOutSine',
          loop: true,
        })
      );
    }

    /* ── The six nodes ────────────────────────────────────────────────
       Each carries its authored phase, and all three of its animations run
       off that one number — so a node is internally coherent while the six
       are never in step. Driven per NODE rather than per selector for exactly
       that reason: three separate staggered queries would let a node's ring,
       icon and sweep drift into unrelated rhythms. */
    root.querySelectorAll<SVGGElement>('.egn-node').forEach((node) => {
      const phase = Number(node.dataset.d) * 1000 || 0;
      const i = Number(node.dataset.i) || 0;

      const ring = node.querySelector<SVGElement>('.egn-node-ring');
      if (ring) {
        runs.push(
          animate(ring, {
            strokeOpacity: [0.5, 0.92, 0.5],
            duration: 6600,
            delay: phase,
            ease: 'inOutSine',
            loop: true,
          })
        );
      }

      /* The icon breathes against the ring, not with it — offset by a third
         of the period, so the node has an internal rhythm rather than one
         brightness applied to two things. */
      const glyph = node.querySelector<SVGElement>('.egn-node-glyph');
      if (glyph) {
        runs.push(
          animate(glyph, {
            opacity: [0.72, 1, 0.72],
            duration: 6600,
            delay: phase - 2200,
            ease: 'inOutSine',
            loop: true,
          })
        );
      }

      /* The occasional sweep. A long loopDelay is what makes it occasional:
         3.6s of travel, then eleven seconds of nothing. Staggered by 2.6s so
         two nodes never sweep at once — the point is that ONE capability
         lights up at a time, not that every ring shimmers. */
      const sweep = node.querySelector<SVGElement>('.egn-node-sweep');
      if (sweep) {
        runs.push(
          animate(sweep, {
            strokeDashoffset: [1, 0],
            duration: 3600,
            delay: i * STEP,
            loopDelay: BEAT - 3600,
            ease: 'inOutSine',
            loop: true,
          })
        );
      }
    });

    /* A highlight travelling the central hexagon: one short dash run around
       the perimeter. pathLength="1" makes the dash independent of the hex's
       real length. */
    const sweep = root.querySelector<SVGPathElement>('.egn-sys-sweep');
    if (sweep) {
      runs.push(
        animate(sweep, {
          strokeDashoffset: [1, 0],
          duration: 14000,
          ease: 'linear',
          loop: true,
        })
      );
    }

    /* Particles ride the connectors' own paths, so a dot follows the
       identical route the line draws rather than an approximation of it.
       Inward traffic rides the reversed twin instead of being run backwards —
       a motion path does not express a reversal cleanly. */
    const out = Array.from(root.querySelectorAll<SVGPathElement>('.egn-sys-link'));
    const back = Array.from(root.querySelectorAll<SVGPathElement>('.egn-sys-link-rev'));

    root.querySelectorAll<SVGCircleElement>('.egn-sys-dot').forEach((dot) => {
      const family = dot.dataset.dir === 'in' ? back : out;
      const route = family[Number(dot.dataset.link) % family.length];
      if (!route) return;

      const { translateX, translateY } = svg.createMotionPath(route);
      const dur = Number(dot.dataset.dur) || 6000;
      const delay = Number(dot.dataset.delay) || 0;

      runs.push(
        animate(dot, { translateX, translateY, duration: dur, delay, ease: 'linear', loop: true })
      );
      /* Zero at both ends, so the wrap is never seen — and it keeps a particle
         from sitting on a node or the instrument, which is where every run
         begins and ends. */
      runs.push(
        animate(dot, {
          opacity: [
            { to: 0, duration: 0 },
            { to: 0.95, duration: dur * 0.24 },
            { to: 0.95, duration: dur * 0.46 },
            { to: 0, duration: dur * 0.3 },
          ],
          delay,
          ease: 'inOutSine',
          loop: true,
        })
      );
    });

    /* And the light pulse down a whole connector — on the same beat as the
       node sweeps but offset half a step, so a connector lights between two
       nodes rather than with one. That interleave is what makes the six nodes
       and six wires read as one system taking turns. */
    root.querySelectorAll<SVGPathElement>('.egn-link-pulse').forEach((el, i) => {
      runs.push(
        animate(el, {
          strokeDashoffset: [1, 0],
          duration: 2600,
          delay: STEP / 2 + i * STEP,
          loopDelay: BEAT - 2600,
          ease: 'inOutQuad',
          loop: true,
        })
      );
    });

    runsRef.current = runs;
    return () => {
      runsRef.current = [];
      runs.forEach((r) => r.revert());
    };
  }, [reduceMotion]);

  return (
    <svg
      ref={ref}
      className="egn-sys"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <defs>
        {/* The face scan: bright at the hub, gone at the rim, so it reads as a
            sweep rather than a spoke. */}
        <linearGradient id="egn-scan-grad" gradientUnits="userSpaceOnUse" x1={C.x} y1={C.y - 62} x2={C.x} y2={C.y - 92}>
          <stop offset="0%" stopColor="#066f89" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#066f89" stopOpacity="0" />
        </linearGradient>

        {/* The rising pulse, and the clip that keeps it inside the body. */}
        <linearGradient id="egn-pulse-grad" gradientUnits="userSpaceOnUse" x1={C.x - 40} y1="0" x2={C.x + 40} y2="0">
          <stop offset="0%" stopColor="#077e9b" stopOpacity="0" />
          <stop offset="50%" stopColor="#066f89" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#077e9b" stopOpacity="0" />
        </linearGradient>
        <clipPath id="egn-instr-clip">
          <rect x={C.x - 120} y={C.y - 120} width="240" height="220" />
        </clipPath>

        <linearGradient id="egn-sys-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2f5fb" />
          <stop offset="52%" stopColor="#f5f7fc" />
          <stop offset="100%" stopColor="#e3e8ed" />
        </linearGradient>
        <linearGradient id="egn-sys-sweep-grad" gradientUnits="userSpaceOnUse" x1={C.x - R_CORE} y1="0" x2={C.x + R_CORE} y2="0">
          <stop offset="0%" stopColor="#077e9b" />
          <stop offset="100%" stopColor="#2156c9" />
        </linearGradient>
      </defs>

      {/* ── Connectors, under everything they join ───────────────────── */}
      <g className="egn-sys-links">
        {NODES.map((n, i) => (
          <path
            key={n.id}
            className="egn-sys-link"
            data-i={i}
            d={link(C, n, R_CORE - 6, R_NODE + 6)}
          />
        ))}

        {/* A light pulse that occasionally runs a connector. Layered over the
            dashed line rather than replacing it, so the connector itself
            stays exactly as drawn. */}
        {NODES.map((n, i) => (
          <path
            key={`p${n.id}`}
            className="egn-link-pulse"
            data-i={i}
            d={link(C, n, R_CORE - 6, R_NODE + 6)}
            pathLength={1}
          />
        ))}
      </g>

      {/* Reversed twins. Painted with nothing — they exist so a particle can
          travel node-to-core without the animation having to be run backwards,
          which a motion path does not express cleanly. Left in the render
          tree rather than hidden with `display: none`, because the geometry
          still has to be measurable. */}
      <g className="egn-sys-tracks">
        {NODES.map((n) => (
          <path key={`r${n.id}`} className="egn-sys-link-rev" d={link(n, C, R_NODE + 6, R_CORE - 6)} />
        ))}
      </g>

      {/* ── The framework ───────────────────────────────────────────────
          Two rings: a wide outer frame and the core hex the instrument sits
          in, so the middle reads as an enclosure rather than a badge. */}
      <g className="egn-in-frame">
        <path className="egn-sys-frame" d={hex(C.x, C.y, R_CORE + 46)} />
        <path className="egn-sys-frame is-inner" d={hex(C.x, C.y, R_CORE)} />
        <path
          className="egn-sys-sweep"
          d={hex(C.x, C.y, R_CORE)}
          pathLength={1}
          stroke="url(#egn-sys-sweep-grad)"
        />
      </g>

      {/* ── The transmitter ─────────────────────────────────────────────
          A differential-pressure transmitter, reduced to what still reads at
          this size: housing, display, two side covers, the manifold and its
          process connection. */}
      <g className="egn-sys-instr">
        {/* side covers */}
        <g>
          <rect x={C.x - 118} y={C.y - 92} width="34" height="40" rx="8" fill="url(#egn-sys-body)" />
          <rect x={C.x + 84} y={C.y - 92} width="34" height="40" rx="8" fill="url(#egn-sys-body)" />
          <path d={`M${C.x - 112} ${C.y - 84}v24M${C.x + 112} ${C.y - 84}v24`} strokeOpacity="0.5" />
        </g>

        {/* housing */}
        <circle cx={C.x} cy={C.y - 62} r="56" fill="url(#egn-sys-body)" />
        <circle cx={C.x} cy={C.y - 62} r="44" strokeOpacity="0.55" />
        <circle className="egn-sys-face" cx={C.x} cy={C.y - 62} r="30" fill="#ebeef2" />
        <text className="egn-sys-read" x={C.x} y={C.y - 56} textAnchor="middle">
          25.00
        </text>
        <path d={`M${C.x - 16} ${C.y - 44}h32`} strokeOpacity="0.35" />

        {/* A glow travelling the gauge rim. Same dash technique as the
            hexagon sweep: one short arc run around the circle. */}
        <circle className="egn-gauge-sweep" cx={C.x} cy={C.y - 62} r="44" pathLength={1} />

        {/* And a scan across the face, turning about the gauge's own centre.
            transform-origin is stated in view-box units because the arm's
            bounding box is not centred on the hub. */}
        <path
          className="egn-gauge-scan"
          style={{ transformOrigin: `${C.x}px ${C.y - 62}px` }}
          d={`M${C.x} ${C.y - 62}V${C.y - 90}`}
          stroke="url(#egn-scan-grad)"
        />
        {/* housing bolts */}
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <circle
              key={a}
              cx={(C.x + 50 * Math.cos(r)).toFixed(1)}
              cy={(C.y - 62 + 50 * Math.sin(r)).toFixed(1)}
              r="2.6"
              strokeOpacity="0.6"
            />
          );
        })}

        {/* neck */}
        <path d={`M${C.x - 20} ${C.y - 6}h40v16h-40Z`} fill="url(#egn-sys-body)" />

        {/* manifold block */}
        <rect x={C.x - 74} y={C.y + 10} width="148" height="46" rx="6" fill="url(#egn-sys-body)" />
        <path d={`M${C.x - 74} ${C.y + 33}h148`} strokeOpacity="0.35" />
        {[-56, -30, 30, 56].map((dx) => (
          <circle key={dx} cx={C.x + dx} cy={C.y + 33} r="6" strokeOpacity="0.65" />
        ))}

        {/* flanges and process connection */}
        <rect x={C.x - 96} y={C.y + 56} width="44" height="34" rx="4" fill="url(#egn-sys-body)" />
        <rect x={C.x + 52} y={C.y + 56} width="44" height="34" rx="4" fill="url(#egn-sys-body)" />
        <path d={`M${C.x - 30} ${C.y + 56}h60v22h-60Z`} fill="url(#egn-sys-body)" />
        <path d={`M${C.x - 12} ${C.y + 78}h24v18h-24Z`} fill="url(#egn-sys-body)" />
        <path d={`M${C.x - 74} ${C.y + 90}h20M${C.x + 54} ${C.y + 90}h20`} strokeOpacity="0.45" />

        {/* Energy rising from the process connection to the housing. Clipped
            to the body, so it reads as travelling THROUGH the instrument
            rather than passing in front of it. */}
        <g clipPath="url(#egn-instr-clip)">
          <rect
            className="egn-instr-pulse"
            x={C.x - 40}
            y={C.y + 96}
            width="80"
            height="3"
            fill="url(#egn-pulse-grad)"
            stroke="none"
            opacity="0"
          />
        </g>
      </g>

      {/* ── Capability nodes ────────────────────────────────────────────── */}
      {NODES.map((n, i) => (
        <g
          key={n.id}
          className="egn-node"
          data-d={n.d}
          data-i={i}
          style={{ '--i': i } as React.CSSProperties}
        >
          <path className="egn-node-fill" d={hex(n.x, n.y, R_NODE)} />
          <path className="egn-node-ring" d={hex(n.x, n.y, R_NODE)} />
          {/* A brighter arc that occasionally runs the perimeter. Separate
              from the ring so the breathing underneath is never interrupted. */}
          <path className="egn-node-sweep" d={hex(n.x, n.y, R_NODE)} pathLength={1} />
          <g className="egn-node-glyph" transform={`translate(${n.x - 20} ${n.y - 20})`}>
            {GLYPH[n.id]}
          </g>
        </g>
      ))}

      {/* ── Data on the wires ───────────────────────────────────────────
          Two per connector, offset, so a link is never empty and never has
          two dots in step. */}
      {!reduceMotion && (
        <g className="egn-sys-dots">
          {NODES.flatMap((n, i) =>
            /* One outward, one inward. Traffic both ways is what reads as a
               system querying and answering rather than a hub broadcasting. */
            (['out', 'in'] as const).map((dir) => (
              <circle
                key={`${n.id}-${dir}`}
                className="egn-sys-dot"
                data-link={i}
                data-dir={dir}
                data-dur={dir === 'out' ? 5600 + i * 640 : 7400 + i * 880}
                data-delay={dir === 'out' ? -i * 1300 : -i * 1900 - 2400}
                cx="0"
                cy="0"
                r={dir === 'out' ? 2.1 : 1.6}
                opacity="0"
              />
            ))
          )}
        </g>
      )}
    </svg>
  );
};

export default HeroSystem;
