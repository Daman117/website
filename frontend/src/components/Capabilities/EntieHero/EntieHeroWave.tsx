/**
 * The enTIE hero's bottom layer — a flowing line field.
 *
 * ── What actually makes the reference look the way it does ──────────────
 * Not parallel waves. The lines are all the SAME curve, separated by an
 * offset that is MODULATED along x by an envelope:
 *
 *     y(i, x) = centre + base(x) + offset(i) * env(x)
 *
 * Where `env` is near zero the whole stack collapses into a tight bright
 * ribbon — the crest. Where it approaches one, the lines splay far apart into
 * open fan. One shared curve, one envelope, and the density does everything:
 * the crest is bright because fifty-seven lines are nearly on top of each
 * other there, not because anything is drawn brighter.
 *
 * Evenly-spaced offsets — the obvious reading of "several wavy lines" — give
 * tramlines that never converge, which is what the first attempt looked like.
 *
 * ── Seamless repeat ─────────────────────────────────────────────────────
 * `base` and `env` are both periodic in PERIOD, and the field is built one
 * period wider than the frame on both sides, so translating by exactly one
 * period lands on identical geometry. The envelope pinches once per period,
 * so one crest crosses the frame at a time.
 *
 * ── Why the groups share a speed (almost) ───────────────────────────────
 * The crest only exists because every line pinches at the same x. Scrolling
 * the lines at genuinely different speeds pulls that apart into three
 * separate crests within a cycle. So the three groups run within 6% of each
 * other: enough relative drift to shimmer, far less than the crest's own
 * width, so it stays one field.
 *
 * The tilt is a static rotation on the wrapper — a tilt baked into the paths
 * would break horizontal periodicity and with it the seamless repeat.
 *
 * Motion lives in useEntieWaveAnimation, whose contract this keeps (groups
 * are `.entie-wave-lane` with data-period/data-duration, riders are
 * `.entie-wave-particle` with data-path), so that module did not change.
 */
import React from 'react';
import { useEntieWaveAnimation } from './useEntieWaveAnimation';

/** Design box. The field covers the whole hero. */
const W = 1600;
const H = 700;

/** The repeat: of the curve, of the envelope, and of the scroll. */
const PERIOD = 1300;
/** Where the fan's spine sits. Low on purpose: the crest is the densest part
 *  of the field and belongs in the empty band beneath the copy, not behind
 *  the reading column or the composition. */
const CENTRE = 560;

const LINES = 57;
/** Groups the lines are dealt into, round-robin, so each group is spread
 *  through the whole stack rather than owning a slab of it. */
const GROUPS = [
  { dur: 32000, tint: 'v' },
  { dur: 33000, tint: 'm' },
  { dur: 34000, tint: 'b' },
];

/** Spacing between neighbouring lines at full spread. */
const GAP = 12;
/** Amplitude of the shared curve every line follows. */
const BASE_AMP = 34;
/** How tight the crest is. At 0.12 the whole stack squeezes into about an
 *  eighth of its open width. */
const ENV_MIN = 0.12;
/** Sampling step. The curvature is gentle, so straight segments this short
 *  are indistinguishable from a smooth path at hairline weight. */
const STEP = 26;

/** Deterministic scatter — a hash, not a PRNG, so the field is identical on
 *  every render and nothing has to be seeded or stored. */
const rand = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

/** The curve every line follows: two humps per repeat. */
const base = (x: number) => BASE_AMP * Math.sin((4 * Math.PI * x) / PERIOD);

/** The pinch. Zero-ish once per period, one at the midpoints between. */
const env = (x: number) => ENV_MIN + (1 - ENV_MIN) * Math.abs(Math.sin((Math.PI * x) / PERIOD));

/** This line's offset from the spine, before the envelope squeezes it. */
const offsetOf = (i: number) => (i - (LINES - 1) / 2) * GAP;

/** Where line `i` sits at `x`. The one function the paths, the dots and the
 *  riders all read from, so nothing can drift out of register. */
const yAt = (i: number, x: number) => CENTRE + base(x) + offsetOf(i) * env(x);

const linePath = (i: number) => {
  let d = '';
  for (let x = -PERIOD; x <= W + PERIOD; x += STEP) {
    d += `${d ? 'L' : 'M'}${x} ${yAt(i, x).toFixed(1)}`;
  }
  return d;
};

/** Dots sit ON the field, not scattered over it — that is what makes them
 *  read as part of the flow rather than as a starfield behind it. */
const dotsFor = (group: number) =>
  Array.from({ length: 34 }, (_, k) => {
    const n = group * 71 + k;
    // Bias toward the middle of the stack, where the crest is.
    const i = Math.floor((0.5 + (rand(n) - 0.5) * 1.5) * (LINES - 1));
    const x = -PERIOD + rand(n + 11) * (W + 2 * PERIOD);
    return {
      x,
      y: yAt(Math.max(0, Math.min(LINES - 1, i)), x),
      r: 0.9 + rand(n + 23) * 1.1,
      o: 0.3 + rand(n + 31) * 0.55,
    };
  });

/** Matches the phone breakpoint in entie-hero.css. Read once per render, not
 *  tracked: a resize past the breakpoint keeps whichever depth was built. */
const COMPACT = '(max-width: 719px)';

const EntieHeroWave: React.FC = () => {
  const ref = useEntieWaveAnimation();

  /* Every third line on a phone — the fan keeps its shape, at a third of the
     paint. The field is atmosphere; at that width the difference is density,
     not structure. */
  const stride = React.useMemo(
    () => (typeof window !== 'undefined' && window.matchMedia(COMPACT).matches ? 3 : 1),
    [],
  );

  return (
    <svg
      ref={ref}
      className="entie-wave"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      {/* The tilt. Static, on a wrapper, so the groups inside translate along
          the crest and the paths stay horizontally periodic. */}
      <g className="entie-wave-field" transform={`rotate(-8 ${W / 2} ${CENTRE})`}>
        {GROUPS.map((group, g) => (
          <g
            key={group.dur}
            id={`eth-wave-band-${g}`}
            className="entie-wave-lane"
            data-animation="wave"
            data-index={g}
            data-period={PERIOD}
            data-duration={group.dur}
          >
            {Array.from({ length: LINES }, (_, i) => i)
              .filter((i) => i % GROUPS.length === g && i % stride === 0)
              .map((i) => {
                // Brightest through the middle of the stack, where the lines
                // crowd; the outermost fan strands are nearly gone.
                const t = Math.abs(offsetOf(i)) / (((LINES - 1) / 2) * GAP);
                return (
                  <path
                    key={i}
                    id={`eth-wave-path-${i}`}
                    className={`entie-wave-path entie-wave-path--${group.tint}`}
                    vectorEffect="non-scaling-stroke"
                    style={{ opacity: 0.14 + 0.5 * (1 - t) ** 1.3 }}
                    d={linePath(i)}
                  />
                );
              })}

            {dotsFor(g)
              .filter((_, k) => k % stride === 0)
              .map((dot) => (
                <circle
                  key={`${dot.x}-${dot.y}`}
                  className="entie-wave-dot"
                  cx={dot.x.toFixed(1)}
                  cy={dot.y.toFixed(1)}
                  r={dot.r.toFixed(2)}
                  style={{ opacity: dot.o }}
                />
              ))}

            {/* One rider per group, on a line near the spine where the field
                is brightest. */}
            <circle
              id={`eth-wave-particle-${g}`}
              className="entie-wave-particle"
              data-animation="particle"
              data-path={`#eth-wave-path-${27 + g}`}
              cx="0"
              cy="0"
              r="1.9"
            />
          </g>
        ))}
      </g>
    </svg>
  );
};

export default EntieHeroWave;
