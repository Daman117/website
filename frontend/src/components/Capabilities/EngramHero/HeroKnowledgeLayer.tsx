/**
 * The knowledge graph on the right: the brain hub and every link.
 *
 * This layer draws the hub and the connections only. The capability nodes
 * that terminate them live in HeroNodes, so each link passes *under* its
 * node rather than crossing the icon.
 *
 * Links are spoke + chord: every node connects to the hub, and neighbours
 * connect to each other, which is what makes it read as a mesh rather than
 * a wheel.
 *
 * ── Traffic ─────────────────────────────────────────────────────────────
 * One dot per spoke, and they do NOT all move at once. Every dot shares the
 * MASTER clock and travels only during a short slice of it, placed just
 * after the core responds in its slot — so newly processed knowledge is seen
 * propagating outward, two nodes per slot, rather than the graph spinning
 * continuously.
 *
 * keyPoints/keyTimes over the full master period (rather than a short dur
 * with repeatCount) is what holds a dot invisible at the far end between
 * turns, and what keeps it locked to the same clock the sheets and core run
 * on instead of free-running.
 */
import React from 'react';
import { CORE_ACTIVE, MASTER, SLOTS, TIMING, linkPath, slotAt } from './engramHeroData';
import type { EngramLayout } from './engramLayouts';
import { HubBrain } from './HeroIcons';
import { useSvgPause } from './useSvgPause';

interface Props {
  active: boolean;
  reduceMotion: boolean;
  /** Hovered element id, so a node can light its own links. */
  highlight: string | null;
  L: EngramLayout;
}

const HeroKnowledgeLayer: React.FC<Props> = ({ active, reduceMotion, highlight, L }) => {
  const HUB = L.hub;
  const nodeById = (id: string) => L.nodes.find((n) => n.id === id)!;
  const svgRef = useSvgPause(active);
  const f = (n: number) => n.toFixed(4);
  const onCore = highlight === CORE_ACTIVE;
  const litNode = highlight?.startsWith('node:') ? highlight.slice(5) : null;

  return (
  <svg
    ref={svgRef}
    className="egh-layer egh-layer-net"
    viewBox={`0 0 ${L.stage.w} ${L.stage.h}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient id="egh-hub-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.34" />
        <stop offset="60%" stopColor="#6366f1" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="egh-hub-face" cx="42%" cy="34%" r="72%">
        <stop offset="0%" stopColor="#1b2450" />
        <stop offset="100%" stopColor="#070b1c" />
      </radialGradient>
    </defs>

    {/* Ambient depth behind the graph */}
    <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r * 4.4} fill="url(#egh-hub-halo)" />

    <g className="egh-in-links">
    {/* Chords first, so spokes stay legible on top of them. Only every third
        one brightens, and slowly — most of the mesh stays still so the
        structure remains readable. */}
    <g fill="none" stroke="#818cf8" strokeWidth="0.8">
      {L.chords.map(([a, b], i) => (
        <path
          key={i}
          className={`egh-chord${i % 3 === 0 ? ' egh-chord-live' : ''}${
            litNode === a || litNode === b ? ' is-active' : ''
          }`}
          style={{ '--o': 0.2, '--d': `${(i * -2.7).toFixed(1)}s` } as React.CSSProperties}
          d={linkPath(nodeById(a), nodeById(b))}
          strokeOpacity="0.2"
        />
      ))}
    </g>

    {/* Spokes, each in its node's own colour */}
    <g fill="none" strokeWidth="1.1" strokeLinecap="round">
      {L.nodes.map((n) => (
        <path
          key={n.id}
          className={`egh-spoke${litNode === n.id || onCore ? ' is-active' : ''}`}
          d={linkPath({ x: HUB.cx, y: HUB.cy, r: HUB.r }, n)}
          stroke={n.color}
          strokeOpacity="0.42"
        />
      ))}
    </g>

    {/* Junction dots along the spokes */}
    <g>
      {L.junctions.map((j, i) => (
        <circle
          key={i}
          className="egh-junction"
          style={{ '--d': `${(i * -1.6).toFixed(1)}s` } as React.CSSProperties}
          cx={j.x.toFixed(1)}
          cy={j.y.toFixed(1)}
          r={j.r}
          fill={j.color}
          fillOpacity="0.85"
        />
      ))}
    </g>

    {/* Traffic along the spokes, firing in sequence */}
    {!reduceMotion &&
      L.nodes.map((n, i) => {
        // Fires 4.1s into its slot — after that document has been read, its
        // data has crossed, and the core has answered.
        const t0 = (slotAt(i % SLOTS) + 4.1 + Math.floor(i / SLOTS) * 0.55) / MASTER;
        const t1 = t0 + TIMING.netTravel / MASTER;
        const fade = 0.2 / MASTER;
        // Half the spokes carry knowledge outward, half report back inward.
        const outward = i % 2 === 0;
        const d = outward
          ? linkPath({ x: HUB.cx, y: HUB.cy, r: HUB.r }, n)
          : linkPath(n, { x: HUB.cx, y: HUB.cy, r: HUB.r });
        return (
          <circle key={n.id} r="2.9" fill={n.color} opacity="0">
            <animateMotion
              dur={`${MASTER}s`}
              repeatCount="indefinite"
              calcMode="linear"
              path={d}
              keyPoints="0;0;1;1"
              keyTimes={`0;${f(t0)};${f(t1)};1`}
            />
            <animate
              attributeName="opacity"
              dur={`${MASTER}s`}
              repeatCount="indefinite"
              calcMode="linear"
              values="0;0;1;1;0;0"
              keyTimes={`0;${f(t0)};${f(t0 + fade)};${f(t1 - fade)};${f(t1)};1`}
            />
          </circle>
        );
      })}

    </g>

    <g className="egh-in-hub">
    {/* The hub */}
    <circle className="egh-hub-breath" cx={HUB.cx} cy={HUB.cy} r={HUB.r + 13} fill="#818cf8" fillOpacity="0.08" />
    <circle
      cx={HUB.cx}
      cy={HUB.cy}
      r={HUB.r}
      fill="url(#egh-hub-face)"
      stroke="#a78bfa"
      strokeOpacity="0.85"
      strokeWidth="1.8"
    />
    <circle cx={HUB.cx} cy={HUB.cy} r={HUB.r - 9} fill="none" stroke="#c4b5fd" strokeOpacity="0.22" strokeWidth="0.8" />
    <g transform={`translate(${HUB.cx} ${HUB.cy}) scale(1.6)`} style={{ color: '#ddd6fe' }}>
      <HubBrain />
    </g>
    </g>
  </svg>
  );
};

export default HeroKnowledgeLayer;
