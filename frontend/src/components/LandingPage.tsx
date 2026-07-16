/**
 * LandingPage.tsx — entire home page in one file
 *
 * Sections (top → bottom):
 *   Hero · ProductDemo · Stats · HowItWorks · CapGrid · Industries ·
 *   Platform · Architecture · BusinessImpact · Security ·
 *   CaseStudies · Resources · Principles · CTA
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import {
  heroChips,
  workSteps,
  demos, type DemoCard,
  industries,
  archSources, archCaps, archUsers,
  impacts,
  securityPrinciples,
  caseStudies,
  resources,
} from '../data/v2';
import { CAPS } from '../data/caps';
import { principles } from '../data/company';
import { pipeNodes } from '../data/platform';
import Icon from './Icon';
import HeroShell from './HeroShell';
import ScrollAnimation, { ScrollStagger, LineReveal, RevealLines } from './ScrollAnimation';
import type { Cap } from '../types';

interface LandingPageProps {
  onOpenContact: (source?: string) => void;
}

// ─────────────────────────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────────────────────────
const TickerItems: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      {CAPS.map((c) => (
        <button
          key={c.id}
          type="button"
          className="ticker-item"
          onClick={() => navigate(`/products/${c.id}`)}
        >
          <span className="ticker-dot" style={{ background: c.color }} />
          <span className="ticker-name">{c.name}</span>
          <span className="ticker-cat">{c.cat}</span>
        </button>
      ))}
    </>
  );
};

const Ticker: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div className={`ticker-wrap${visible ? ' ticker-wrap-visible' : ''}`}>
    <div className="ticker-track">
      <div className="ticker-inner">
        <div className="ticker-half"><TickerItems /></div>
        <div className="ticker-half"><TickerItems /></div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// STAT CELL
// ─────────────────────────────────────────────────────────────────
interface StatCellProps {
  target: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  isStatic?: boolean;
  staticVal?: string;
}

const StatCell: React.FC<StatCellProps> = ({
  target, decimals = 0, suffix = '', prefix = '',
  label, isStatic, staticVal,
}) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setValue(parseFloat((ease * target).toFixed(decimals)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, decimals, isStatic]);

  const display = isStatic
    ? staticVal
    : `${prefix}${decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()}${suffix}`;

  return (
    <div className="stat-cell" ref={ref}>
      <span className="stat-val mono">{display}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// DEMO SUB-RENDERERS
// ─────────────────────────────────────────────────────────────────
const ColList: React.FC<{ label: string; items: string[]; color?: string }> = ({ label, items, color }) => (
  <div className="demo-col">
    <div className="demo-col-label">{label}</div>
    <ul className="demo-col-list">
      {items.map((it) => (
        <li key={it}><span style={color ? { color } : undefined}>—</span>{it}</li>
      ))}
    </ul>
  </div>
);

const DemoBody: React.FC<{ d: DemoCard }> = ({ d }) => {
  if (d.kind === 'transform' && d.before && d.after) {
    return (
      <div className="demo-ba">
        <ColList label={d.before.label} items={d.before.items} />
        <div className="demo-arrow" aria-hidden="true">→</div>
        <ColList label={d.after.label} items={d.after.items} color={d.color} />
      </div>
    );
  }
  if (d.kind === 'query' && d.query && d.answer) {
    return (
      <div className="demo-query">
        <div className="demo-q">
          <span className="demo-q-icon" style={{ color: d.color }}>?</span>
          {d.query}
        </div>
        <div className="demo-a">
          <div className="demo-a-value" style={{ color: d.color }}>{d.answer.value}</div>
          <div className="demo-a-cite">
            <span>{d.answer.source}</span>
            <span>{d.answer.revision}</span>
            <span>{d.answer.page}</span>
          </div>
        </div>
      </div>
    );
  }
  if (d.kind === 'dashboard' && d.panels) {
    return (
      <div className="demo-dash">
        {d.panels.map((p) => (
          <div key={p.label} className={`demo-tile demo-tone-${p.tone || 'ok'}`}>
            <div className="demo-tile-label">{p.label}</div>
            <div className="demo-tile-value">{p.value}</div>
          </div>
        ))}
      </div>
    );
  }
  if (d.kind === 'decision' && d.steps) {
    return (
      <div className="demo-decision">
        {d.steps.map((s) => (
          <div key={s.label} className="demo-dec-row">
            <span className="demo-dec-label">{s.label}</span>
            <span className="demo-dec-value">{s.value}</span>
          </div>
        ))}
        <div className="demo-refs">
          {d.refs?.map((r) => <span key={r} className="demo-ref">{r}</span>)}
        </div>
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────
// CAP CARD
// ─────────────────────────────────────────────────────────────────
const CapCard: React.FC<{ cap: Cap }> = ({ cap }) => {
  const navigate = useNavigate();
  const go = () => navigate(`/products/${cap.id}`);
  return (
    <div
      className="cap-card"
      style={{ '--accent': cap.color } as React.CSSProperties}
      onClick={go}
      role="link"
      tabIndex={0}
      aria-label={`${cap.name} — view details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      }}
    >
      <div className="cap-card-top">
        <div className="cap-card-name-row">
          <span className="cap-card-name">{cap.name}</span>
        </div>
        <span
          className="badge"
          style={{ color: cap.color, background: `${cap.color}18`, borderColor: `${cap.color}55` }}
        >
          {cap.status}
        </span>
      </div>
      <div className="cap-card-cat">{cap.cat}</div>
      <div className="cap-card-tag">{cap.tag}</div>
      <button
        className="cap-card-btn"
        onClick={(e) => { e.stopPropagation(); go(); }}
        style={{ background: `linear-gradient(135deg,${cap.color} 0%,var(--navy) 130%)` }}
      >
        View Details →
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// ── SECTION 1: HERO
//    Same treatment as the enVIEW capability-page hero: a bounded,
//    scoped background-attachment:fixed photo, a bottom-anchored dark
//    gradient for legibility, and a single-column text block pinned
//    to the bottom of the image.
// ─────────────────────────────────────────────────────────────────
// Fires once per session (module state survives SPA nav, resets on refresh):
// the ticker slides in once the intro text has finished revealing. Scroll is
// never locked — users who scroll early simply cut the show short.
let heroIntroPlayed = false;
const HERO_INTRO_MS = 1800;

const Hero: React.FC<{ onOpenContact: (src?: string) => void }> = ({ onOpenContact }) => {
  const [introDone, setIntroDone] = useState(heroIntroPlayed);

  useEffect(() => {
    if (heroIntroPlayed) return;
    const t = setTimeout(() => {
      // Only mark "played" once the timer actually completes — setting this
      // at the start instead makes React StrictMode's dev-only double-invoke
      // (mount -> cleanup -> mount) skip the real timer on the second mount.
      heroIntroPlayed = true;
      setIntroDone(true);
    }, HERO_INTRO_MS);
    return () => clearTimeout(t);
  }, []);

  return (
  <HeroShell id="hero" image="/bg-image.webp" contentClassName="section" after={<Ticker visible={introDone} />}>
      <h1 className="engram-hero-h1" style={{ color: '#ffffff' }}>
        <span className="hero-line-mask">
          <span className="hero-line-inner" style={{ animationDelay: '150ms' }}>Your plant.</span>
        </span>
        <span className="hero-line-mask">
          <span className="hero-line-inner" style={{ animationDelay: '500ms', color: '#60a5fa' }}>Understood.</span>
        </span>
      </h1>
      <p className="engram-hero-sub hero-fade-up" style={{ color: 'rgba(255,255,255,0.96)', animationDelay: '900ms' }}>
        The local-first industrial intelligence platform that turns drawings, documents, SCADA
        systems and engineering knowledge into structured, searchable plant intelligence.
      </p>
      <p className="engram-hero-body hero-fade-up" style={{ color: 'rgba(255,255,255,0.82)', animationDelay: '1100ms' }}>
        Each capability is complete on its own and more powerful together — and it all runs
        entirely inside your network.
      </p>
      <div className="hero-fade-up" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 640, marginBottom: 28, animationDelay: '1300ms' }} aria-label="Platform capabilities">
        {heroChips.map((c) => (
          <span key={c} className="badge hero-chip-badge" style={{ color: '#93c5fd', background: 'rgba(37,99,235,0.22)', borderColor: 'rgba(96,165,250,0.4)' }}>
            {c}
          </span>
        ))}
      </div>
      <div className="hero-fade-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animationDelay: '1500ms' }}>
        <button className="btn-primary" onClick={() => onOpenContact('Explore enxplant')}>Explore enxplant →</button>
        <button className="btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
      </div>
  </HeroShell>
  );
};

// ─────────────────────────────────────────────────────────────────
// ── SECTION 2: PRODUCT DEMO
// ─────────────────────────────────────────────────────────────────
const N = demos.length;

const ProductDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, N - 0.001]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => rawIndex.on('change', (v) => setActiveIndex(Math.floor(v))), [rawIndex]);

  const active = demos[activeIndex];

  return (
    <div ref={containerRef} id="demo" style={{ height: `${N * 100}vh`, position: 'relative' }}>
      <div className="demo-sticky">
        {/* Left — heading + progress list */}
        <div className="demo-sticky-left">
          <ScrollAnimation>
            <span className="eyebrow">Product output, not slideware</span>
          </ScrollAnimation>
          <RevealLines as="h2" className="display demo-sticky-h2" lines={['See enxplant', 'in Action']} />

          <ScrollStagger className="demo-step-list" step={70}>
            {demos.map((d, i) => (
              <button
                key={d.id}
                className={`demo-step-item${i === activeIndex ? ' active' : ''}`}
                style={{ '--step-color': d.color } as React.CSSProperties}
                onClick={() => {
                  if (!containerRef.current) return;
                  const rect = containerRef.current.getBoundingClientRect();
                  const top = window.scrollY + rect.top + (i / N) * containerRef.current.offsetHeight;
                  window.scrollTo({ top, behavior: 'smooth' });
                }}
              >
                <span className="demo-step-product" style={{ color: i === activeIndex ? d.color : undefined }}>
                  {d.product}
                </span>
                <span className="demo-step-title">{d.title}</span>
              </button>
            ))}
          </ScrollStagger>

          <div className="demo-progress-track">
            <motion.div
              className="demo-progress-fill"
              style={{ scaleX: useTransform(scrollYProgress, [0, 1], [0, 1]), background: active.color }}
            />
          </div>
        </div>

        {/* Right — animated card. Delayed so it appears after the left column has settled. */}
        <ScrollAnimation delay={300} className="demo-sticky-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="demo-card demo-card-featured"
              style={{ '--accent': active.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="demo-card-head">
                <span className="demo-card-product" style={{ color: active.color }}>{active.product}</span>
                <span className="demo-card-title">{active.title}</span>
              </div>
              <DemoBody d={active} />
              <div className="demo-card-counter" style={{ color: active.color }}>
                {activeIndex + 1} / {N}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="demo-dots">
            {demos.map((d, i) => (
              <span
                key={d.id}
                className={`demo-dot${i === activeIndex ? ' active' : ''}`}
                style={{ background: i === activeIndex ? d.color : undefined }}
              />
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// ── SECTION 3: STATS
// ─────────────────────────────────────────────────────────────────
const Stats: React.FC = () => (
  <div id="stats">
    <div className="stats-grid">
      <StatCell target={139}  label="P&ID drawings digitized" />
      <StatCell target={5945} label="Equipment & instruments" />
      <StatCell target={99.3} decimals={1} suffix="%" label="Extraction accuracy" />
      <StatCell target={0}    isStatic staticVal="<2s" label="SCADA startup time" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 4: HOW IT WORKS
// ─────────────────────────────────────────────────────────────────
const HowItWorks: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const STEP = 1000;

  return (
    <section id="how">
      <div className="section">
        <ScrollAnimation>
          <span className="eyebrow">The workflow</span>
        </ScrollAnimation>
        <LineReveal as="h2" className="display section-title" text="How Industrial Intelligence Is Built" />
        <LineReveal
          as="p"
          className="section-lead"
          text="Four steps from the documents you already have to live, defensible plant intelligence — all inside your network."
        />

        <div className="how-grid" ref={ref}>
          {workSteps.map((s, i) => (
            <div
              key={s.icon}
              className="how-step hover-lift"
              style={{
                '--accent': s.color,
                opacity: inView ? 1 : 0.15,
                filter: inView ? 'none' : 'grayscale(0.8)',
                transition: `opacity 700ms ease, filter 700ms ease`,
                // header (ScrollAnimation, ~700ms) settles first, then steps stagger in
                transitionDelay: inView ? `${120 + i * STEP}ms` : '0ms',
              } as React.CSSProperties}>
              <div className="how-step-top">
                <span className="how-num">
                  <Icon name={s.icon} size={22} strokeWidth={1.75} />
                </span>
                <span className="how-connector" aria-hidden="true" />
              </div>
              <span className="how-actor" style={{ color: s.color }}>{s.actor}</span>
              <h3 className="how-title">{s.title}</h3>
              <div className="how-io">
                <div className="how-io-label">{s.inLabel}</div>
                <div className="how-tags">
                  {s.inputs.map((t) => <span key={t} className="how-tag">{t}</span>)}
                </div>
              </div>
              <div className="how-io">
                <div className="how-io-label" style={{ color: s.color }}>{s.outLabel}</div>
                <div className="how-tags">
                  {s.outputs.map((t) => (
                    <span key={t} className="how-tag how-tag-out" style={{ borderColor: `${s.color}55`, color: s.color }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// ── SECTION 5: CAPABILITIES (CAP GRID)
// ─────────────────────────────────────────────────────────────────
const CapGrid: React.FC = () => (
  <section id="capabilities">
    <div className="cap-head">
      <div>
        <ScrollAnimation>
          <span className="eyebrow">Products</span>
        </ScrollAnimation>
        <RevealLines
          as="h2"
          className="display"
          lines={[{ text: 'Every capability.', className: 'cap-head-bold' }, { text: 'One platform.', className: 'cap-head-light' }]}
        />
      </div>
    </div>
    <ScrollStagger className="cap-grid" step={80}>
      {CAPS.map((cap) => <CapCard key={cap.id} cap={cap} />)}
    </ScrollStagger>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 6: INDUSTRIES
// ─────────────────────────────────────────────────────────────────
const Industries: React.FC = () => (
  <section id="industries">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Where it runs</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Built for Industrial Operations" />
      <LineReveal
        as="p"
        className="section-lead"
        text="enxplant works wherever the plant floor lives in drawings, documents and live process data. Find your industry."
      />

      <ScrollStagger className="ind-grid" step={70}>
        {industries.map((ind) => (
          <div key={ind.id} className="ind-card hover-scale-sm">
            <div className="ind-img">
              <img src={ind.img} alt={ind.name} loading="lazy" />
            </div>
            <h3 className="ind-name">{ind.name}</h3>
            <p className="ind-desc">{ind.desc}</p>
            <div className="ind-caps">
              {ind.caps.map((c) => <span key={c} className="ind-cap">{c}</span>)}
            </div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 7: PLATFORM
// ─────────────────────────────────────────────────────────────────
export const Platform: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const STEP = 700;
  const CARD_DUR = 550;
  const CONN_DUR = 280;

  return (
    <section id="platform">
      <div className="section">
        <ScrollAnimation>
          <span className="eyebrow">Platform</span>
        </ScrollAnimation>
        <LineReveal
          as="h2"
          className="display"
          style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: '52px' }}
          text="How capabilities connect"
        />

        <div className="platform-flex" ref={ref}>
          {pipeNodes.map((node, i) => (
            <React.Fragment key={node.cap}>
              {/* Card grows from its left edge — looks like it slides out from previous card */}
              <div
                className="pipe-node hover-lift"
                style={{
                  '--accent2': node.color,
                  background: 'rgba(255,255,255,0.94)',
                  backdropFilter: 'blur(14px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(150%)',
                  transformOrigin: 'left center',
                  transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                  opacity: inView ? 1 : 0,
                  transition: `transform ${CARD_DUR}ms cubic-bezier(0.4,0,0.2,1), opacity ${CARD_DUR}ms ease`,
                  // header (ScrollAnimation, ~700ms) settles first, then cards stagger in
                  transitionDelay: inView ? `${120 + i * STEP}ms` : '0ms',
                } as React.CSSProperties}
              >
                <div className="pipe-cap" style={{ color: node.color }}>{node.cap}</div>
                <div className="pipe-sub">{node.label}</div>
                <div className="pipe-desc">{node.sub}</div>
              </div>
              {/* Connector appears after card i settles, just before card i+1 starts */}
              {i < pipeNodes.length - 1 && (
                <div
                  className="pipe-connector"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left center',
                    transition: `opacity ${CONN_DUR}ms ease, transform ${CONN_DUR}ms ease`,
                    transitionDelay: inView ? `${120 + i * STEP + STEP * 0.75}ms` : '0ms',
                  } as React.CSSProperties}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────
// ── SECTION 8: ARCHITECTURE
// ─────────────────────────────────────────────────────────────────
export const Architecture: React.FC = () => (
  <section id="architecture">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Platform architecture</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="One Platform. Multiple Sources." />
      <LineReveal
        as="p"
        className="section-lead"
        text="Every plant data source flows into one local platform, becomes connected intelligence, and reaches every team that needs it."
      />

      <ScrollAnimation delay={150} duration={900} threshold={0.06}>
        <div className="arch-diagram">
          <div className="arch-band arch-band-sources">
            <div className="arch-band-label"><span className="arch-band-pill">Plant Data Sources</span></div>
            <div className="arch-source-row">
              {archSources.map((s) => <div key={s} className="arch-source-chip">{s}</div>)}
            </div>
          </div>

          <div className="arch-connector" aria-hidden="true">
            <div className="arch-conn-line" /><div className="arch-conn-arrow" />
          </div>

          <div className="arch-platform-block">
            <div className="arch-platform-inner">
              <div className="arch-platform-logo">
                <span className="arch-platform-en">en</span><span className="arch-platform-x">X</span>
              </div>
              <div className="arch-platform-tagline">Local-first industrial intelligence platform</div>
              <div className="arch-platform-badges">
                <span className="arch-platform-badge">Air-gapped ready</span>
                <span className="arch-platform-badge">On-premises AI</span>
                <span className="arch-platform-badge">No cloud dependency</span>
              </div>
            </div>
          </div>

          <div className="arch-connector" aria-hidden="true">
            <div className="arch-conn-line" /><div className="arch-conn-arrow" />
          </div>

          <div className="arch-band arch-band-caps">
            <div className="arch-band-label"><span className="arch-band-pill">Capabilities</span></div>
            <div className="arch-caps-row">
              {archCaps.map((c) => (
                <div
                  key={c.name}
                  className="arch-cap-chip"
                  style={{ '--accent': c.color, borderBottomColor: c.color } as React.CSSProperties}
                >
                  <span className="arch-cap-dot" style={{ background: c.color }} />
                  <span className="arch-cap-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="arch-connector" aria-hidden="true">
            <div className="arch-conn-line" /><div className="arch-conn-arrow" />
          </div>

          <div className="arch-band arch-band-users">
            <div className="arch-band-label"><span className="arch-band-pill">Users</span></div>
            <div className="arch-users-row">
              {archUsers.map((u) => (
                <div key={u.name} className="arch-user-chip">
                  <Icon name={u.icon} size={15} strokeWidth={1.7} />
                  <span>{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 9: BUSINESS IMPACT
// ─────────────────────────────────────────────────────────────────
const BusinessImpact: React.FC = () => (
  <section id="impact">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Outcomes</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Business Impact" />
      <LineReveal
        as="p"
        className="section-lead"
        text="Industrial buyers purchase outcomes. enxplant shortens the path from a question to a defensible answer — and keeps engineering knowledge in the business."
      />

      <ScrollStagger className="impact-grid" step={80}>
        {impacts.map((m) => (
          <div key={m.label} className="impact-card hover-lift">
            <div className="impact-top">
              <span className="impact-stat">{m.stat}</span>
              <span className="impact-icon"><Icon name={m.icon} size={18} strokeWidth={1.8} /></span>
            </div>
            <h3 className="impact-label">{m.label}</h3>
            <p className="impact-detail">{m.detail}</p>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 10: SECURITY
// ─────────────────────────────────────────────────────────────────
const Security: React.FC = () => (
  <section id="security">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Security &amp; deployment</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Security by Design" />
      <LineReveal
        as="p"
        className="section-lead"
        text="enxplant is built to run where the network never leaves the fence line. No cloud, no external calls, no vendor inside your perimeter."
      />

      <ScrollStagger className="sec-grid" step={90}>
        {securityPrinciples.map((p) => (
          <div key={p.title} className="sec-card hover-lift">
            <img className="sec-img" src={p.img} alt={p.title} loading="lazy" />
            <div className="sec-overlay" />
            <div className="sec-icon"><Icon name={p.icon} size={20} strokeWidth={1.8} /></div>
            <div className="sec-body">
              <h3 className="sec-title">{p.title}</h3>
              <p className="sec-desc">{p.desc}</p>
            </div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 11: CASE STUDIES
// ─────────────────────────────────────────────────────────────────
const CaseStudies: React.FC = () => (
  <section id="cases">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Proof in practice</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Case Studies & Use Cases" />
      <LineReveal
        as="p"
        className="section-lead"
        text="Drawn from internal pilots and real engineering scenarios — structured as problem, solution and result."
      />

      <ScrollStagger className="case-grid" step={130}>
        {caseStudies.map((c) => (
          <div
            key={c.id}
            className="case-card hover-lift"
            style={{ '--accent': c.color } as React.CSSProperties}
          >
            <div className="case-top">
              <span
                className="case-tag"
                style={{ color: c.color, borderColor: `${c.color}55`, background: `${c.color}14` }}
              >
                {c.tag}
              </span>
              <h3 className="case-title">{c.title}</h3>
            </div>
            <div className="case-bottom">
              <div className="case-step">
                <span className="case-step-label">Problem</span>
                <p className="case-step-text">{c.problem}</p>
              </div>
              <div className="case-step">
                <span className="case-step-label" style={{ color: c.color }}>Solution</span>
                <p className="case-step-text">{c.solution}</p>
              </div>
            </div>
            <div className="case-result">
              <span className="case-step-label" style={{ color: c.color }}>Result</span>
              <p className="case-step-text">{c.result}</p>
            </div>
          </div>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 12: RESOURCES
// ─────────────────────────────────────────────────────────────────
const Resources: React.FC<{ onOpenContact: (src?: string) => void }> = ({ onOpenContact }) => (
  <section id="resources">
    <div className="section">
      <ScrollAnimation>
        <span className="eyebrow">Resource center</span>
      </ScrollAnimation>
      <LineReveal as="h2" className="display section-title" text="Resources" />
      <LineReveal
        as="p"
        className="section-lead"
        text="Whitepapers, technical notes, product briefs and deployment guides. Request any resource and we'll send it over."
      />

      <ScrollStagger className="res-grid" step={80}>
        {resources.map((r) => (
          <button
            key={r.title}
            className="res-card hover-lift"
            onClick={() => onOpenContact(`Resource: ${r.title}`)}
          >
            <div className="res-img-wrap">
              <img className="res-img" src={r.img} alt={r.title} loading="lazy" />
              <span className="res-type">{r.type}</span>
            </div>
            <div className="res-body">
              <div className="res-icon"><Icon name={r.icon} size={16} strokeWidth={1.8} /></div>
              <h3 className="res-title">{r.title}</h3>
              <p className="res-desc">{r.desc}</p>
              <span className="res-link">Request →</span>
            </div>
          </button>
        ))}
      </ScrollStagger>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 13: PRINCIPLES
// ─────────────────────────────────────────────────────────────────
export const Principles: React.FC = () => (
  <section id="principles">
    <div className="section" style={{ paddingBottom: '8px' }}>
      <ScrollAnimation>
        <span className="eyebrow">What we believe</span>
      </ScrollAnimation>
      <LineReveal
        as="h2"
        className="display"
        style={{ fontSize: 'clamp(32px,3.5vw,44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 0 }}
        text="Four commitments we don't negotiate"
      />
    </div>
    <ScrollStagger className="princ-grid" step={110}>
      {principles.map((p) => (
        <div key={p.n} className="princ-card hover-lift">
          <div className="princ-num">{p.n}</div>
          <h3 className="princ-h">{p.h}</h3>
          <p className="princ-p">{p.p}</p>
        </div>
      ))}
    </ScrollStagger>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── SECTION 14: CTA
// ─────────────────────────────────────────────────────────────────
const CTA: React.FC<{ onOpenContact: (src?: string) => void }> = ({ onOpenContact }) => (
  <section id="cta">
    <div className="cta-glow" />
    <ScrollAnimation threshold={0.2}>
      <div className="cta-panel">
        <span className="eyebrow">Start here</span>
        <RevealLines as="h2" className="cta-h" lines={['Your plant.', 'Your documents.', '90 days.']} />
        <LineReveal
          as="p"
          className="cta-p"
          text="No vendor inside your network. No data leaving your plant. At 90 days you'll know exactly what changed."
        />
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => onOpenContact('Book a Demo')}>Book a Demo →</button>
          <button className="btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
        </div>
        <div className="cta-paths">
          <button className="cta-path" onClick={() => onOpenContact('Talk to Engineering Team')}>Talk to Engineering Team</button>
          <span className="cta-path-sep" aria-hidden="true">·</span>
          <button className="cta-path" onClick={() => onOpenContact('Technical Overview')}>Request Technical Overview</button>
          <span className="cta-path-sep" aria-hidden="true">·</span>
          <button className="cta-path" onClick={() => onOpenContact('Waitlist')}>Join Waitlist</button>
        </div>
      </div>
    </ScrollAnimation>
  </section>
);

// ─────────────────────────────────────────────────────────────────
// ── MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
const LandingPage: React.FC<LandingPageProps> = ({ onOpenContact }) => (
  <main>
    <Hero onOpenContact={onOpenContact} />
    {/* Opaque from here down — the hero's photo is pinned to the viewport
        (position: fixed), so everything below needs a solid background to
        cover it as it scrolls up, instead of letting it bleed through. */}
    <div className="lp-body">
      <ProductDemo />
      <Stats />
      <HowItWorks />
      <CapGrid />
      <Industries />
      <BusinessImpact />
      <Security />
      <CaseStudies />
      <Resources onOpenContact={onOpenContact} />
      <Principles />
      <CTA onOpenContact={onOpenContact} />
    </div>
  </main>
);

export default LandingPage;
