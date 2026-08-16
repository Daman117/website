import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Cpu, Gauge, Layers, Zap, Workflow, MonitorPlay, Boxes, MessageSquare, BrainCircuit, Network, Plug, FolderInput } from 'lucide-react';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';
import EnviewHero from './EnviewHero/EnviewHero';
import FlashIcon from '../Capability/FlashIcon';
import FeatureCard from '../Capability/FeatureCard';

interface EnviewPageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#0369A1';
const ACCENT_RGB = '3,105,161';


const howItWorksSteps = [
  { icon: Plug,        color: '#0369A1', title: 'Connect', desc: 'OPC-UA / Modbus TCP / MQTT native connections established instantly via the command line.' },
  { icon: FolderInput, color: '#0E9BC4', title: 'Import',  desc: 'AI-native ingest of P&IDs, files, and drawings — auto-generating tags and topology.' },
  { icon: Layers,      color: '#047857', title: 'Design',  desc: 'Engineering Studio with a visual importer and 331 pre-built industrial symbols.' },
  { icon: Zap,         color: '#F59E0B', title: 'Run',     desc: 'The system switches seamlessly from Edit to Run mode and live data flows.' },
];

const challenges = [
  { title: 'Slow Startup', desc: 'Legacy SCADA systems can take 30–60 seconds to start, delaying operator response during critical events.' },
  { title: 'Single Point of Failure', desc: 'Primary and backup run on the same operating system, so one attack or fault can take both down at once.' },
  { title: 'Slow Project Delivery', desc: 'Every screen is built by hand. A single site can take months of engineering before operators see anything.' },
  { title: 'Higher Operating Cost', desc: 'High licensing fees, server infrastructure, and maintenance make legacy SCADA expensive to operate.' },
];

const nativeApproach = [
  {
    Icon: Cpu,
    title: 'Native Apple Silicon',
    subtitle: 'Built from scratch in Swift',
    desc: 'Zero JVM, zero .NET overhead — a control platform engineered for modern hardware.',
    features: ['Pure Swift codebase', 'No virtual machine', 'Runs on Mac mini / Apple Silicon'],
    color: '#0369A1',
  },
  {
    Icon: Gauge,
    title: 'Unmatched Performance',
    subtitle: '1 Hz scan, sub-100ms latency',
    desc: 'Full process visibility at a 1 Hz scan rate with under 100ms tag latency on under 500MB of memory.',
    features: ['1 Hz scan rate', '<100ms tag latency', '<500MB memory'],
    color: '#0E9BC4',
  },
  {
    Icon: Layers,
    title: 'Decoupled Multi-threading',
    subtitle: 'Data and visuals never collide',
    desc: 'Strict separation of the background data layer and the visual presentation layer keeps the UI alive.',
    features: ['Async data engine', 'Independent render thread', 'No UI thread blocking'],
    color: '#047857',
  },
  {
    Icon: Zap,
    title: 'Instant Startup',
    subtitle: 'Live in under two seconds',
    desc: 'The app launches and streams live plant data in under 2 seconds — no blind waiting during upsets.',
    features: ['<2s cold start', 'Immediate live data', 'Always operator-ready'],
    color: '#F59E0B',
  },
];

const views = [
  {
    Icon: Workflow,
    title: 'P&ID View',
    subtitle: 'Engineering',
    desc: 'ISA-101 compliant background, ISA-5.1 instrument bubbles, and an absolute single source of truth topology.',
    color: '#0369A1',
    img: '/enview-pid-view.webp',
  },
  {
    Icon: MonitorPlay,
    title: 'DCS Mimic View',
    subtitle: 'Operations',
    desc: 'Metallic equipment graphics, live value badges, and stream-colored piping for instant situational awareness.',
    color: '#0E9BC4',
    img: '/enview-mimic-view.webp',
  },
  {
    Icon: Boxes,
    title: '3D Plant View',
    subtitle: 'Management',
    desc: 'RealityKit spatial rendering, orbit-camera navigation, and physical asset location mapping.',
    color: '#047857',
    img: '/enview-plant-view.webp',
  },
];

const safety = [
  { title: 'ISA-18.2 Alarm Management', desc: 'Lifecycle alarm management that prevents operator cognitive overload.' },
  { title: 'Tiered SQL Historian', desc: 'High-performance local data compression with automatic archiving.' },
  { title: 'Threat Detection', desc: 'Active behavioral-baseline monitoring that flags anomalous patterns.' },
  { title: 'Quorum-OS Failover', desc: 'Resilience against ransomware — primary and backup never share the same OS.' },
];

const matrix = {
  cols: ['enVIEW', 'Ignition', 'Honeywell', 'AVEVA'],
  rows: [
    { c: 'Architecture', v: ['Native Apple Silicon', 'JVM / Windows', 'JVM / Windows', 'JVM / Windows'] },
    { c: 'Views', v: ['Three synchronized views', 'Disconnected modules', 'Disconnected modules', 'Disconnected modules'] },
    { c: 'Headless Ops', v: ['21 CLI commands', 'GUI-only', 'GUI-only', 'GUI-only'] },
    { c: 'AI Integration', v: ['Native operator assistant', 'None', 'None', 'None'] },
    { c: 'Startup Time', v: ['<2 seconds', '30–60+ seconds', '30–60+ seconds', '30–60+ seconds'] },
    { c: 'Entry Pricing', v: ['$5,000 flat', '$30K–$100K+', '$100K+', '$30K–$100K+'] },
  ],
};

const aiFeatures = [
  { Icon: MessageSquare, title: 'Intelligent Operator Assistant', desc: 'Natural-language querying integrated into the HMI — e.g. “Why is reactor TT-101 temperature rising?”' },
  { Icon: BrainCircuit, title: 'Automated Engineering', desc: 'AI Vision reads static P&ID diagrams and automatically generates YAML configurations and screen shapes.' },
  { Icon: Network, title: 'MCP Server Analytics', desc: 'Securely exposes live, rationalized plant data to Desktop AI for predictive maintenance and threat analysis.' },
];

const transform = [
  { from: 'Fragile', to: 'Resilient', desc: 'Moving from ransomware-vulnerable Windows nodes to locked-down macOS hardware.' },
  { from: 'Manual', to: 'Automated', desc: 'Eliminating 40-hour builds in favor of AI-assisted, auto-synchronized P&ID imports.' },
  { from: 'Bloated', to: 'Accessible', desc: 'Replacing $100K+ tag-based licensing with a unified flat-rate platform.' },
];

const EnviewPage: React.FC<EnviewPageProps> = ({ onOpenContact }) => {
  const { ref: challengeRef,  inView: challengeInView  } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: safetyRef,     inView: safetyInView     } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: aiRef } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: matrixRef,     inView: matrixInView     } = useInView({ triggerOnce: true, threshold: 0.15 });

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    rowRefs.current.forEach((row) => {
      if (!row) return;
      gsap.set(row, { opacity: 0, x: -80, filter: 'blur(6px)' });
    });
  }, []);
  useEffect(() => {
    if (!matrixInView || prefersReducedMotion()) return;
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      gsap.to(row, {
        opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.2, delay: i * 0.22, ease: 'power4.out',
        clearProps: 'transform,filter',
      });
    });
  }, [matrixInView]);

  const [activeCell, setActiveCell] = useState(-1);
  // Light the first cell as soon as the matrix scrolls into view —
  // render-phase adjustment instead of setState inside the effect
  if (matrixInView && activeCell === -1) setActiveCell(0);
  useEffect(() => {
    if (!matrixInView) return;
    const totalCells = matrix.rows.length * matrix.cols.length;
    let cell = 0;
    const id = setInterval(() => {
      cell = (cell + 1) % totalCells;
      setActiveCell(cell);
    }, 1000);
    return () => clearInterval(id);
  }, [matrixInView]);

  const transformCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const strikeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const toRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      transform.forEach((_, i) => {
        const card = transformCardRefs.current[i];
        if (!card) return;

        gsap.set(strikeRefs.current[i], { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(arrowRefs.current[i], { opacity: 0, scale: 0.5 });
        gsap.set(toRefs.current[i], { opacity: 0, x: -10 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          delay: i * 0.15,
        });

        tl.to({}, { duration: 0.45 }) // let the plain "from" word be read first
          .to(strikeRefs.current[i], { scaleX: 1, duration: 0.35, ease: 'power2.out' })
          .to(arrowRefs.current[i], { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '+=0.05')
          .to(toRefs.current[i], { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, '-=0.1')
          .call(() => {
            gsap.timeline({ repeat: 5, yoyo: true })
              .to(arrowRefs.current[i], { scale: 1.15, duration: 0.75, ease: 'sine.inOut' });
          });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>
      <style>{`
        @keyframes flowPulse  { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
        @keyframes dotGlow    { 0%,100% { box-shadow:0 0 0 0 rgba(37,99,235,0); } 50% { box-shadow:0 0 0 6px rgba(37,99,235,0.25); } }
        @keyframes cardGlow   { 0%,100% { box-shadow:var(--card-shadow); } 50% { box-shadow:0 0 0 2px rgba(37,99,235,0.35), 0 8px 32px rgba(37,99,235,0.18); } }
        @keyframes rowSlide   { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes colShimmer  { 0%,100% { background:rgba(37,99,235,0.06); } 50% { background:rgba(37,99,235,0.14); } }
        @keyframes cardEntrance { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes iconPulse    { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(37,99,235,0); } 50% { transform:scale(1.12); box-shadow:0 0 0 6px rgba(37,99,235,0.2); } }
        @keyframes lineDrawn    { from { stroke-dashoffset:80; opacity:0; } to { stroke-dashoffset:0; opacity:1; } }
        @keyframes bannerFade   { from { opacity:0; transform:scale(0.98); } to { opacity:1; transform:scale(1); } }
      `}</style>

      {/* ── HERO — real HTML/SVG composition (EnviewHero/), not the shared
             photographic CapabilityHero. Content props mirror the old call. ── */}
      <EnviewHero
        badgeText="REAL-TIME SCADA"
        titleLine1="Modern SCADA for"
        titleLine2="Industrial & Manufacturing"
        subText="enVIEW is a SCADA platform written in Swift for Apple silicon. It starts in under two seconds and keeps dashboards, alarms, trends and P&ID graphics on one live data model."
        ctaLabel="Request a Demo"
        onCtaClick={() => onOpenContact('Request a Demo')}
      />

      {/* ── CHALLENGE ── */}
      <section ref={challengeRef} className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <LineReveal as="h2" className="engram-section-h2" text="The Hidden Cost of Legacy SCADA" />
        <LineReveal
          as="p"
          className="enview-section-lead-max"
          text="The problem is not the plant. It is software designed twenty years ago, where reading the plant and drawing the screen compete for the same resource. When alarms flood in, the screen freezes at the worst possible moment."
        />
        <ScrollStagger className="engram-quad engram-challenge-grid" step={70}>
          {challenges.map((c, i) => (
            <div key={c.title} className="card engram-card">
              <FlashIcon inView={challengeInView} index={i} className="enview-challenge-icon" />
              <h3 className="engram-card-title enview-card-h3">{c.title}</h3>
              <p className="supporting-text-loose enview-card-desc">{c.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── NATIVE APPROACH — pinned horizontal scroll story ── */}
      <NativeApproachScroll items={nativeApproach} />

      {/* ── THREE VIEWS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">One Data Model · Three Views</span>
        <LineReveal as="h2" className="engram-section-h2" text="The Unified Visual Paradigm" />
        <LineReveal
          as="p"
          className="content-medium enview-section-lead"
          text="enVIEW treats the P&ID as the master blueprint. No rebuilding, no version drift — what the engineer designs is exactly what the operator sees."
        />
        <ScrollStagger className="engram-caps-grid" step={80}>
          {views.map((v) => (
            <FeatureCard
              key={v.title}
              Icon={v.Icon}
              title={v.title}
              subtitle={v.subtitle}
              desc={v.desc}
              color={v.color}
              img={v.img}
              titleClassName="card-heading enview-view-title"
              subtitleClassName="card-subtitle enview-view-subtitle"
              descClassName="supporting-text-loose enview-view-desc"
            />
          ))}
        </ScrollStagger>
      </section>

      {/* ── HOW IT WORKS — scroll-driven horizontal timeline ── */}
      <HowItWorksScroll
        eyebrow="How It Works"
        title="From Controller to Operations in Minutes"
        steps={howItWorksSteps}
        accent={ACCENT}
        accentRgb={ACCENT_RGB}
        impact={{ label: 'Impact', before: '40 engineer-hours', after: 'under 2 hours' }}
        video="/enview-promo.mp4"
        videoPoster="/enview-promo-poster.webp"
        rowClassName="enview-steps-row"
        connWrapClassName="enview-conn-wrap"
        connWidth={80}
        videoAriaLabel="Play enVIEW promo video"
      />

      {/* ── SAFETY ── */}
      <section ref={safetyRef} className="engram-section engram-container">
        <span className="eyebrow">Always On</span>
        <LineReveal as="h2" className="engram-section-h2" text="Silent Safety Systems in the Background" />
        <LineReveal
          as="p"
          className="content-medium enview-section-lead"
          text="By decoupling data ingestion from visual rendering, enVIEW guarantees operators never lose visibility during an alarm flood — the “flood vs. flow” architecture."
        />
        <ScrollStagger className="engram-quad" step={70}>
          {safety.map((s) => (
            <div key={s.title} className="card engram-card">
              <div className={safetyInView ? 'enview-safety-dot pulse' : 'enview-safety-dot'} />
              <h3 className="engram-card-title enview-card-h3">{s.title}</h3>
              <p className="supporting-text-loose enview-card-desc">{s.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── EVALUATION MATRIX ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <LineReveal as="h2" className="engram-section-h2" text="The Modern SCADA Evaluation Matrix" />
        <div ref={matrixRef} className="card engram-card enview-comparison-card">
          <table className="engram-table">
            <thead>
              <tr>
                <th className="tag-text enview-table-th-first">Criteria</th>
                {matrix.cols.map((c, i) => (
                  <th key={c} className={`tag-text ${i === 0 ? 'enview-table-th-accent' : 'enview-table-th-default'}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row, idx) => {
                const activeRow = activeCell === -1 ? -1 : Math.floor(activeCell / matrix.cols.length);
                const activeCol = activeCell === -1 ? -1 : activeCell % matrix.cols.length;
                const isActiveRow = idx === activeRow;
                return (
                  <tr key={row.c} ref={(el) => { rowRefs.current[idx] = el; }}>
                    <td className="enview-table-phase">{row.c}</td>
                    {row.v.map((val, i) => {
                      const isEnview = i === 0 && isActiveRow;
                      const isCompare = isActiveRow && i === activeCol && activeCol > 0;
                      return (
                        <td
                          key={i}
                          className={[
                            'enview-table-td',
                            i === 0 && 'first',
                            isEnview && 'enview-active',
                            isCompare && 'compare-active',
                          ].filter(Boolean).join(' ')}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── AI-NATIVE ── */}
      <section ref={aiRef} className="engram-section engram-container">
        <span className="eyebrow">AI-Native</span>
        <LineReveal as="h2" className="engram-section-h2" text="Industrial Intelligence, Built In" />
        <ScrollStagger className="engram-caps-grid" step={80}>
          {aiFeatures.map((f) => (
            <div key={f.title} className="card engram-cap-card" style={{ '--cap-color': ACCENT } as React.CSSProperties}>
              <div className="enview-ai-icon"><f.Icon size={26} strokeWidth={1.75} /></div>
              <h3 className="engram-cap-title enview-ai-title">{f.title}</h3>
              <p className="body-text engram-cap-desc enview-ai-desc">{f.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── TRANSFORM / OUTCOMES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Future</span>
        <LineReveal as="h2" className="engram-section-h2" text="Transforming Industrial Operations" />
        <ScrollStagger className="grid-3 engram-three-col" step={90}>
          {transform.map((t, i) => (
            <div key={t.to} ref={(el) => { transformCardRefs.current[i] = el; }} className="card engram-card">
              <div className="u-flex u-items-center u-gap-8 enview-transform-header">
                <span className="enview-transform-from">
                  {t.from}
                  <span
                    ref={(el) => { strikeRefs.current[i] = el; }}
                    className="enview-transform-strike"
                  />
                </span>
                <span ref={(el) => { arrowRefs.current[i] = el; }} className="enview-transform-arrow">→</span>
                <span ref={(el) => { toRefs.current[i] = el; }} className="enview-transform-to">{t.to}</span>
              </div>
              <p className="body-text enview-transform-desc">{t.desc}</p>
            </div>
          ))}
        </ScrollStagger>
        <LineReveal
          as="p"
          className="content-medium lead-text enview-outcomes-lead"
          text="enVIEW is not just a SCADA system. It is the operational intelligence platform that connects your physical plant to your digital future."
        />
        <div className="enview-cta-wrap u-flex u-justify-end">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnviewPage;
