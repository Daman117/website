import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Cpu, Gauge, Layers, Zap, Workflow, MonitorPlay, Boxes, MessageSquare, BrainCircuit, Network, TriangleAlert } from 'lucide-react';
import { ScrollStagger } from '../ScrollAnimation';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import EnviewHowItWorksScroll from './EnviewHowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';

interface EnviewPageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#2563EB';
const ACCENT_RGB = '37,99,235';

const heroChips = ['Native macOS', 'Apple Silicon', 'AI-Ready', 'ISA Compliant'];

const challenges = [
  { title: 'Crippling Startup Times', desc: 'JVM-based platforms take 30–60 seconds to load. Operators wait blindly during critical plant upsets.' },
  { title: 'Monolithic Vulnerability', desc: 'Single-OS Windows dependency creates a common-cause failure. Ransomware takes down primary and backup together.' },
  { title: 'Engineering Bottlenecks', desc: 'Configuration takes months. Legacy systems require 40+ engineer-hours per screen due to manual layout.' },
  { title: 'Exorbitant Infrastructure Costs', desc: '$100K+ in licensing fees per server, where IT infrastructure regularly exceeds the actual software value.' },
];

const nativeApproach = [
  {
    Icon: Cpu,
    title: 'Native Apple Silicon',
    subtitle: 'Built from scratch in Swift',
    desc: 'Zero JVM, zero .NET overhead — a control platform engineered for modern hardware.',
    features: ['Pure Swift codebase', 'No virtual machine', 'Runs on Mac mini / Apple Silicon'],
    color: '#2563EB',
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
    color: '#10B981',
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
    color: '#2563EB',
    img: '/enview-pid-view.png',
  },
  {
    Icon: MonitorPlay,
    title: 'DCS Mimic View',
    subtitle: 'Operations',
    desc: 'Metallic equipment graphics, live value badges, and stream-colored piping for instant situational awareness.',
    color: '#0E9BC4',
    img: '/enview-mimic-view.png',
  },
  {
    Icon: Boxes,
    title: '3D Plant View',
    subtitle: 'Management',
    desc: 'RealityKit spatial rendering, orbit-camera navigation, and physical asset location mapping.',
    color: '#10B981',
    img: '/enview-plant-view.png',
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
    rowRefs.current.forEach((row) => {
      if (!row) return;
      gsap.set(row, { opacity: 0, x: -80, filter: 'blur(6px)' });
    });
  }, []);
  useEffect(() => {
    if (!matrixInView) return;
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      gsap.to(row, {
        opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.2, delay: i * 0.22, ease: 'power4.out',
        clearProps: 'transform,filter',
      });
    });
  }, [matrixInView]);

  const [activeCell, setActiveCell] = useState(-1);
  useEffect(() => {
    if (!matrixInView) return;
    const totalCells = matrix.rows.length * matrix.cols.length;
    setActiveCell(0);
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
            gsap.timeline({ repeat: -1, yoyo: true })
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
        @keyframes iconFlash  { 0%,100% { color:inherit; } 40% { color:#f97316; filter:drop-shadow(0 0 6px #f97316); } }
        @keyframes dotGlow    { 0%,100% { box-shadow:0 0 0 0 rgba(37,99,235,0); } 50% { box-shadow:0 0 0 6px rgba(37,99,235,0.25); } }
        @keyframes cardGlow   { 0%,100% { box-shadow:var(--card-shadow); } 50% { box-shadow:0 0 0 2px rgba(37,99,235,0.35), 0 8px 32px rgba(37,99,235,0.18); } }
        @keyframes rowSlide   { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes colShimmer  { 0%,100% { background:rgba(37,99,235,0.06); } 50% { background:rgba(37,99,235,0.14); } }
        @keyframes cardEntrance { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes iconPulse    { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(37,99,235,0); } 50% { transform:scale(1.12); box-shadow:0 0 0 6px rgba(37,99,235,0.2); } }
        @keyframes lineDrawn    { from { stroke-dashoffset:80; opacity:0; filter:drop-shadow(0 0 0px #2563EB); } to { stroke-dashoffset:0; opacity:1; filter:drop-shadow(0 0 4px #2563EB); } }
        @keyframes bannerFade   { from { opacity:0; transform:scale(0.98); } to { opacity:1; transform:scale(1); } }
      `}</style>

      {/* ── HERO (fixed parallax background) ── */}
      <div style={{
        position: 'relative',
        backgroundImage: 'url(/enview-hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundAttachment: 'fixed',
        minHeight: 'clamp(600px, 95vh, 960px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        {/* dark gradient — lighter at top so image shows, darker at bottom for text */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(4,6,18,0.20) 0%, rgba(4,6,18,0.60) 55%, rgba(4,6,18,0.94) 100%)',
          pointerEvents: 'none',
        }} />

        {/* hero text — pushed to bottom of the image */}
        <section className="engram-hero engram-container" style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(110px, 16vh, 160px)', paddingBottom: 72 }}>
          <div className="engram-hero-badge">
            <span style={{ color: '#93c5fd', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>MODERN SCADA</span>
          </div>
          <h1 className="engram-hero-h1" style={{ color: '#ffffff' }}>
            Modern SCADA for<br />
            <span style={{ color: '#60a5fa' }}>Industrial &amp; Manufacturing</span>
          </h1>
          <p className="engram-hero-sub" style={{ color: 'rgba(255,255,255,0.96)' }}>
            enVIEW is a ground-up, native control platform — built in Swift for Apple Silicon. Instant startup, sub-100ms latency, and three synchronized views from a single data model.
          </p>
          <p className="engram-hero-body" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Legacy SCADA freezes when it matters most — a 20-year-old single-threaded architecture buckling under alarm floods. enVIEW decouples data from rendering so operators never lose visibility, and turns the P&ID into the live operational source of truth.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
            {heroChips.map((c) => (
              <span key={c} className="badge hero-chip-badge" style={{ color: '#93c5fd', background: 'rgba(37,99,235,0.22)', borderColor: 'rgba(96,165,250,0.4)' }}>
                {c}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
              Request a Demo
            </button>
          </div>
        </section>
      </div>


      {/* ── CHALLENGE ── */}
      <section ref={challengeRef} className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <h2 className="engram-section-h2">The Hidden Cost of Legacy SCADA</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32, maxWidth: 760 }}>
          The problem is not the plant. The problem is a 20-year-old software architecture built on single-threaded paradigms — one processing thread shared between data acquisition and UI rendering. When alarm floods hit, the screen freezes at the worst possible moment.
        </p>
        <ScrollStagger className="engram-quad" step={70}>
          {challenges.map((c, i) => (
            <div key={c.title} className="engram-card">
              <div style={{ color: ACCENT, marginBottom: 12, lineHeight: 1, animation: challengeInView ? `iconFlash 2.4s ease-in-out ${i * 0.6}s infinite` : 'none' }}><TriangleAlert size={22} strokeWidth={1.75} /></div>
              <h3 className="engram-card-title" style={{ fontSize: 14, marginBottom: 8 }}>{c.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── NATIVE APPROACH — pinned horizontal scroll story ── */}
      <NativeApproachScroll items={nativeApproach} />

      {/* ── THREE VIEWS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">One Data Model · Three Views</span>
        <h2 className="engram-section-h2">The Unified Visual Paradigm</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 28, maxWidth: 720 }}>
          enVIEW treats the P&amp;ID as the master blueprint. No rebuilding, no version drift — what the engineer designs is exactly what the operator sees.
        </p>
        <ScrollStagger className="engram-caps-grid" step={80}>
          {views.map((v) => (
            <div key={v.title} className="engram-cap-card enview-view-card" style={{ '--cap-color': v.color, ...(v.img ? { '--card-bg': `url(${v.img})` } : {}) } as React.CSSProperties}>
              {/* Background image — zooms on hover via CSS */}
              <div className="enview-view-card-img" />
              {/* Dark gradient overlay */}
              <div className="enview-view-card-overlay" />
              {/* Title — always visible at top */}
              <div className="enview-view-card-header">
                <div style={{ color: v.color }}><v.Icon size={18} strokeWidth={1.75} /></div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{v.title}</h3>
              </div>
              {/* Subtitle + desc — slides up on hover */}
              <div className="enview-view-card-text">
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{v.subtitle}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── HOW IT WORKS — scroll-driven horizontal timeline ── */}
      <EnviewHowItWorksScroll />

      {/* ── SAFETY ── */}
      <section ref={safetyRef} className="engram-section engram-container">
        <span className="eyebrow">Always On</span>
        <h2 className="engram-section-h2">Silent Safety Systems in the Background</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 28, maxWidth: 720 }}>
          By decoupling data ingestion from visual rendering, enVIEW guarantees operators never lose visibility during an alarm flood — the “flood vs. flow” architecture.
        </p>
        <ScrollStagger className="engram-quad" step={70}>
          {safety.map((s) => (
            <div key={s.title} className="engram-card">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, marginBottom: 12, animation: safetyInView ? 'dotGlow 2s ease-in-out infinite' : 'none' }} />
              <h3 className="engram-card-title" style={{ fontSize: 14, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── EVALUATION MATRIX ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <h2 className="engram-section-h2">The Modern SCADA Evaluation Matrix</h2>
        <div ref={matrixRef} className="engram-card" style={{ padding: '10px 18px', overflowX: 'auto' }}>
          <table className="engram-table">
            <thead>
              <tr>
                <th style={{ color: 'var(--t1)' }}>Criteria</th>
                {matrix.cols.map((c, i) => (
                  <th key={c} style={i === 0 ? { color: ACCENT } : { color: 'var(--t2)' }}>{c}</th>
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
                    <td style={{ fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap' }}>{row.c}</td>
                    {row.v.map((val, i) => {
                      const isEnview = i === 0 && isActiveRow;
                      const isCompare = isActiveRow && i === activeCol && activeCol > 0;
                      return (
                        <td
                          key={i}
                          style={{
                            color: isEnview ? ACCENT : i === 0 ? 'var(--t3)' : 'var(--t4)',
                            fontWeight: i === 0 ? 600 : undefined,
                            background: isEnview
                              ? `rgba(${ACCENT_RGB},0.07)`
                              : isCompare
                              ? 'rgba(100,100,120,0.10)'
                              : undefined,
                            borderRadius: (isEnview || isCompare) ? 6 : undefined,
                            transition: 'background 0.35s ease, color 0.35s ease, box-shadow 0.35s ease',
                            boxShadow: isEnview
                              ? `inset 0 0 0 1px rgba(${ACCENT_RGB},0.22)`
                              : isCompare
                              ? 'inset 0 0 0 1px rgba(120,120,140,0.3)'
                              : undefined,
                          }}
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
        <h2 className="engram-section-h2">Industrial Intelligence, Built In</h2>
        <ScrollStagger className="engram-caps-grid" step={80}>
          {aiFeatures.map((f) => (
            <div key={f.title} className="engram-cap-card" style={{ '--cap-color': ACCENT } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: ACCENT }}><f.Icon size={26} strokeWidth={1.75} /></div>
              <h3 className="engram-cap-title" style={{ color: ACCENT, fontSize: 15 }}>{f.title}</h3>
              <p className="engram-cap-desc" style={{ marginBottom: 0 }}>{f.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── TRANSFORM / OUTCOMES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Future</span>
        <h2 className="engram-section-h2">Transforming Industrial Operations</h2>
        <ScrollStagger className="engram-three-col" step={90}>
          {transform.map((t, i) => (
            <div key={t.to} ref={(el) => { transformCardRefs.current[i] = el; }} className="engram-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15 }}>
                <span style={{ position: 'relative', display: 'inline-block', color: 'var(--t4)' }}>
                  {t.from}
                  <span
                    ref={(el) => { strikeRefs.current[i] = el; }}
                    style={{ position: 'absolute', left: 0, right: 0, top: '52%', height: 2, background: 'var(--t4)', willChange: 'transform' }}
                  />
                </span>
                <span ref={(el) => { arrowRefs.current[i] = el; }} style={{ color: ACCENT, display: 'inline-block', willChange: 'transform, opacity' }}>→</span>
                <span ref={(el) => { toRefs.current[i] = el; }} style={{ color: ACCENT, fontWeight: 800, display: 'inline-block', willChange: 'transform, opacity' }}>{t.to}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t4)', lineHeight: 1.7 }}>{t.desc}</p>
            </div>
          ))}
        </ScrollStagger>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 720, marginTop: 28 }}>
          enVIEW is not just a SCADA system. It is the operational intelligence platform that connects your physical plant to your digital future.
        </p>
        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnviewPage;
