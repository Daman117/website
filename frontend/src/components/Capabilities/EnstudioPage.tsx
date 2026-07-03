import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { PencilRuler, Boxes, MessageSquare, Workflow, BadgeCheck, SlidersHorizontal, Upload, ScanSearch, FileOutput, TriangleAlert } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';
import HeroShell from '../HeroShell';

interface EnstudioPageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#A78BFA';

const heroChips = ['Local AI', 'Air-Gapped', 'ISA-5.1 Symbols', 'Any Drawing Format'];

const challenges = [
  'P&IDs are missing, outdated, or locked in scanned PDFs from decades ago',
  'Configuring a plant by hand takes 40+ engineer-hours per drawing sheet',
  'Tag lists, ranges, and alarm setpoints are re-keyed by hand into every system',
  'Brownfield plants have no clean source-of-truth drawing to start from',
  'Every downstream tool (SCADA, simulation) wants a different file format',
  'A single equipment change means re-importing and re-typing the whole drawing',
];

const existingSolutions = [
  {
    solution: 'Manual Configuration',
    limitation: 'Engineer types every tag, range, and connection by hand — slow and error-prone',
    fix: 'AI reads the drawing directly and auto-populates the model',
  },
  {
    solution: 'Generic OCR Tools',
    limitation: 'Read text but cannot understand equipment, topology, or control loops',
    fix: 'Recognizes ISA symbols and builds real equipment/topology relationships, not just raw text',
  },
  {
    solution: 'Vendor Import Wizards',
    limitation: 'Locked to one DCS format — no path to simulation or other systems',
    fix: 'Schema-driven adapters export to multiple targets (VIDS for enVIEW, YMPL for enableSim) from one model',
  },
  {
    solution: 'CAD-Based Extractors',
    limitation: 'Need clean vector drawings — useless for scanned or brownfield P&IDs',
    fix: 'Handles vector and scanned drawings alike — including reading existing DCS HMI screens for brownfield plants',
  },
];

const inputModes = [
  {
    Icon: PencilRuler,
    title: 'Draw',
    subtitle: 'Author from scratch',
    desc: 'Drag ISA-5.1 symbols onto the canvas, draw connections, and fill parameter forms. Every action writes straight to the internal model.',
    color: '#A78BFA',
    img: '/enstudio-draw.webp',
    features: [
      'ISA-5.1 symbol palette',
      'Direct topology editing',
      'Surgical patching — no full re-import',
      'Diff preview before every change',
    ],
  },
  {
    Icon: Boxes,
    title: 'Import',
    subtitle: 'Upload any drawing',
    desc: 'Drop a P&ID PDF, scanned sheet, equipment CSV, datasheet, or YMPL file. AI reads it and renders equipment and connections on the canvas.',
    color: '#60A5FA',
    img: '/enstudio-import.webp',
    features: [
      'Vector & scanned P&ID PDFs',
      'Multi-page sheets in parallel',
      'Equipment lists & datasheets',
      'Existing YMPL / VIDS files',
    ],
  },
  {
    Icon: MessageSquare,
    title: 'Describe',
    subtitle: 'Plain-language topology',
    desc: 'Type or talk through a process unit. The same parser used by enableSim extracts equipment, instruments, and connections into the model.',
    color: '#34D399',
    img: '/enstudio-describe.webp',
    features: [
      'Natural-language extraction',
      'Conversational model building',
      'Same output as image import',
      'Runs on local AI — never leaves the network',
    ],
  },
];

const capabilities = [
  {
    Icon: Workflow,
    title: 'Diagram Intelligence',
    subtitle: 'Read the Language of P&IDs',
    desc: 'AI vision reads equipment symbols, tags, and pipe topology from any engineering drawing — vector or scanned.',
    features: [
      'ISA symbol & tag recognition',
      'Equipment, instrument & connection extraction',
      'Legend-page detection with company convention profiles',
      'Auto-generated Mermaid diagram for instant visual verification',
      '>80% tag accuracy on real P&ID sheets',
    ],
    color: '#A78BFA',
  },
  {
    Icon: BadgeCheck,
    title: 'Confidence-Scored Review',
    subtitle: 'Engineers Stay in Control',
    desc: 'Every extracted element is scored and surfaced for review before it ever reaches a downstream system.',
    features: [
      'High / Medium / Low confidence colour coding',
      'Side-by-side source image vs Mermaid topology',
      'Three-column Accept / Edit / Reject table',
      'Safety-critical (TAHH, PAHH, SIL) require explicit sign-off',
      'Inline [VERIFY] annotations carried into export',
    ],
    color: '#60A5FA',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Schema-Driven Adapters',
    subtitle: 'One Model, Many Targets',
    desc: 'A normalized internal model exports to multiple formats. Field mappings live in YAML schema files — never hardcoded.',
    features: [
      'VIDS YAML for enVIEW (vplant import)',
      'YMPL for enableSim (enable build)',
      'Add a field = edit one schema file, no code change',
      'Add an adapter = one schema + ~10 lines',
      'Extensible to Ignition, DeltaV and custom formats',
    ],
    color: '#34D399',
  },
];

const steps = [
  { icon: Upload,      title: 'Input',   desc: 'Upload a P&ID, import a file, draw on the canvas, or describe the unit in plain language.' },
  { icon: ScanSearch,  title: 'Extract', desc: 'Local AI reads the drawing with the matching skill files and returns structured topology.' },
  { icon: Boxes,       title: 'Model',   desc: 'Equipment, instruments, and connections populate one normalized internal project model.' },
  { icon: BadgeCheck,  title: 'Review',  desc: 'Confidence-scored elements are verified against the source image and Mermaid diagram.' },
  { icon: FileOutput,  title: 'Export',  desc: 'Schema-driven adapters write VIDS for enVIEW and YMPL for enableSim.' },
];

const adapters = [
  {
    label: 'VIDS Adapter',
    target: 'enVIEW',
    color: '#A78BFA',
    desc: 'Converts the internal model into VPlant YAML (VIDS v1.0) for vplant import.',
    points: [
      'Equipment → plant screens, instruments → tag & alarm configs',
      'Operator-facing alarm limits in engineering units',
      'Auto-positioned on import — adjusted once in enVIEW',
      'Must pass vplant validate before export is allowed',
    ],
  },
  {
    label: 'YMPL Adapter',
    target: 'enableSim',
    color: '#34D399',
    desc: 'Converts the internal model into YMPL topology for enable build.',
    points: [
      'Equipment → nodes, connections → edges with port assignment',
      'Perry defaults injected for simulation parameters',
      'Mermaid stored in the meta block, always regenerated',
      'Never writes the physics matrix — that is enable build',
    ],
  },
  {
    label: 'Future Adapters',
    target: 'Extensible',
    color: '#60A5FA',
    desc: 'The adapter pattern supports new targets without touching the core.',
    points: [
      'Ignition tag export (CSV / JSON)',
      'Emerson DeltaV DVSN import format',
      'Custom plant-specific formats',
      'Each adapter only reads the internal model',
    ],
  },
];

const safetyFeatures = [
  'Confidence scoring on every extracted element',
  'Safety-critical instruments locked until explicit sign-off',
  'Diff view before any patch is committed',
  'Automatic revision logging on every change',
  'Surgical patching — no P&ID redraw for a single change',
];

const localFeatures = [
  'Runs entirely on localhost — one command, opens in browser',
  'Drawings never leave the engineer’s network',
  'Local AI models for draw, describe and converse modes',
  'Lightweight Flask tool — runs on macOS, Windows, Linux',
  'Skill plug-ins drop in as folders — no rebuild',
];

const brownfieldFeatures = [
  'Read existing DCS HMI screenshots from any vendor',
  'Tag names lifted exactly as displayed on screen',
  'No paper, no scanning, no OCR archaeology',
  'Documents what is actually built and running',
  'Turns every existing DCS installation into a starting point',
];

const outcomes = [
  '40 engineer-hours → under 2 hours per sheet',
  'Under 30 minutes review time per P&ID',
  'Validated VIDS with no manual edits',
  'Same project feeds enVIEW and enableSim',
  'No re-keying across systems',
  'Brownfield plants documented in minutes',
];

const EnstudioPage: React.FC<EnstudioPageProps> = ({ onOpenContact }) => {
  const { ref: challengeRef, inView: challengeInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: matrixRef, inView: matrixInView } = useInView({ triggerOnce: true, threshold: 0.15 });

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

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': '167,139,250' } as React.CSSProperties}>
      <style>{`
        @keyframes iconFlash { 0%,100% { color:inherit; } 40% { color:#f97316; filter:drop-shadow(0 0 6px #f97316); } }
      `}</style>

      {/* ── HERO (pinned parallax background — iOS-safe, see HeroShell) ── */}
      <HeroShell image="/enstudio-hero.webp" contentClassName="engram-hero engram-container">
          <div className="engram-hero-badge">
            <span style={{ color: '#c4b5fd', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>DRAWING INTELLIGENCE</span>
          </div>
          <h1 className="engram-hero-h1" style={{ color: '#ffffff' }}>
            <span className="hero-line-mask">
              <span className="hero-line-inner" style={{ animationDelay: '150ms' }}>Turn Engineering Drawings Into</span>
            </span>
            <span className="hero-line-mask">
              <span className="hero-line-inner" style={{ animationDelay: '500ms', color: ACCENT }}>Plant Configuration</span>
            </span>
          </h1>
          <p className="engram-hero-sub hero-fade-up" style={{ color: 'rgba(255,255,255,0.96)', animationDelay: '900ms' }}>
            enSTUDIO is the intelligent middle layer between your drawings and your systems. Upload it, draw it, or describe it — it becomes structured, validated, downstream-ready configuration.
          </p>
          <p className="engram-hero-body hero-fade-up" style={{ color: 'rgba(255,255,255,0.82)', animationDelay: '1100ms' }}>
            Engineering drawings sit in scanned PDFs, legacy CAD files, and decades-old archives. enSTUDIO reads them with local AI, builds one normalized project model, and exports VIDS for enVIEW and YMPL for enableSim — without re-keying a single tag.
          </p>
          <div className="hero-fade-up" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28, animationDelay: '1300ms' }}>
            {heroChips.map((c) => (
              <span key={c} className="badge hero-chip-badge" style={{ color: '#c4b5fd', background: 'rgba(167,139,250,0.22)', borderColor: 'rgba(196,181,253,0.4)' }}>
                {c}
              </span>
            ))}
          </div>
          <div className="hero-fade-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animationDelay: '1500ms' }}>
            <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
              Request a Demo
            </button>
          </div>
      </HeroShell>

      {/* ── CHALLENGE ── */}
      <section ref={challengeRef} className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <LineReveal as="h2" className="engram-section-h2" text="Configuration Is the Bottleneck" />
        <LineReveal
          as="p"
          style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32 }}
          text="Standing up a plant configuration means reading drawings and re-typing them into every system — by hand, again and again."
        />
        <ScrollStagger className="engram-three-col" step={70}>
          {challenges.map((c, i) => (
            <div key={i} className="engram-card">
              <div style={{ color: ACCENT, marginBottom: 12, lineHeight: 1, animation: challengeInView ? `iconFlash 2.4s ease-in-out ${i * 0.6}s 3` : 'none' }}><TriangleAlert size={22} strokeWidth={1.75} /></div>
              <span style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.7 }}>{c}</span>
            </div>
          ))}
        </ScrollStagger>
        <p style={{ fontSize: 12, color: 'var(--t5)', marginTop: 20, fontStyle: 'italic' }}>
          The target: 40 engineer-hours per sheet reduced to under two.
        </p>
      </section>

      {/* ── CAPABILITIES ── */}
      <NativeApproachScroll
        items={capabilities}
        eyebrow="Key Capabilities"
        title="From Drawing to Validated Configuration"
      />

      {/* ── INPUT MODES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Three Ways In</span>
        <LineReveal as="h2" className="engram-section-h2" text="Meet Engineers Where They Are" />
        <ScrollStagger className="engram-caps-grid" step={80}>
          {inputModes.map((m) => (
            <div key={m.title} className="engram-cap-card enview-view-card" style={{ '--cap-color': m.color, '--card-bg': `url(${m.img})` } as React.CSSProperties}>
              {/* Background image — zooms on hover via CSS */}
              <div className="enview-view-card-img" />
              {/* Dark gradient overlay */}
              <div className="enview-view-card-overlay" />
              {/* Title — always visible at top */}
              <div className="enview-view-card-header">
                <div style={{ color: m.color }}><m.Icon size={18} strokeWidth={1.75} /></div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{m.title}</h3>
              </div>
              {/* Subtitle + desc — slides up on hover */}
              <div className="enview-view-card-text">
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{m.subtitle}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorksScroll
        eyebrow="How It Works"
        title="From Raw Drawing to Downstream-Ready"
        steps={steps}
        accent={ACCENT}
        accentRgb="167,139,250"
        video="/enstudio-demo.mp4"
        videoPoster="/enstudio-demo-poster.webp"
      />

      {/* ── SAFETY + LOCAL + BROWNFIELD ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Trust & Control</span>
        <LineReveal as="h2" className="engram-section-h2" text="Built to Run Inside Your Perimeter" />
        <LineReveal
          as="p"
          style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32 }}
          text="Human oversight, local-only deployment, and brownfield readiness — the three things engineers check before they trust a system."
        />
        <ScrollStagger className="engram-three-col" step={90}>

          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block' }}>Human-in-the-Loop</span>
            <h3 className="engram-card-title">Nothing Ships Unreviewed</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              Every extraction is verified before it reaches a live system.
            </p>
            {safetyFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#60A5FA', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          <div className="engram-card" style={{ borderColor: 'rgba(167,139,250,0.25)' }}>
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block', color: ACCENT }}>Local & Lightweight</span>
            <h3 className="engram-card-title">Your Drawings Stay With You</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              A simple local tool — no cloud, no heavy install.
            </p>
            {localFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>

          <div className="engram-card">
            <span className="eyebrow" style={{ marginBottom: 8, display: 'block', color: '#34D399' }}>Brownfield Ready</span>
            <h3 className="engram-card-title">Document What Is Actually Running</h3>
            <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>
              No P&ID? Read the DCS screen that is already live.
            </p>
            {brownfieldFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', marginTop: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>
        </ScrollStagger>
      </section>

      {/* ── THE DIFFERENCE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <LineReveal as="h2" className="engram-section-h2" text="Why Existing Tools Fall Short" />
        <LineReveal
          as="p"
          style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32 }}
          text="Every existing approach solves one piece of the problem — typing, OCR, one vendor's format, or clean vector drawings only. enSTUDIO is the only one that handles the whole chain."
        />
        <div ref={matrixRef} className="engram-card" style={{ padding: '10px 18px', overflowX: 'auto' }}>
          <table className="engram-table">
            <thead>
              <tr>
                <th>Approach</th>
                <th>Limitation</th>
                <th style={{ color: ACCENT }}>enSTUDIO</th>
              </tr>
            </thead>
            <tbody>
              {existingSolutions.map((row, i) => (
                <tr key={i} ref={(el) => { rowRefs.current[i] = el; }}>
                  <td style={{ fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{row.solution}</td>
                  <td style={{ color: 'var(--t4)' }}>{row.limitation}</td>
                  <td style={{ color: 'var(--t3)' }}>{row.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 13, color: ACCENT, marginTop: 16, fontWeight: 500 }}>
          enSTUDIO reads the drawing, understands the topology, and exports to every target.
        </p>
      </section>

      {/* ── OUTPUT ADAPTERS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Output Adapters</span>
        <LineReveal as="h2" className="engram-section-h2" text="One Model, Every Target System" />
        <ScrollStagger className="engram-three-col" step={90}>
          {adapters.map((a) => (
            <div key={a.label} className="engram-card" style={{ borderColor: `${a.color}40` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: a.color }}>{a.target}</span>
              </div>
              <h3 className="engram-card-title" style={{ marginBottom: 8 }}>{a.label}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.6 }}>{a.desc}</p>
              {a.points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, marginTop: 8, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <LineReveal as="h2" className="engram-section-h2" text="Drawings Become Living Configuration" />
        <LineReveal
          as="p"
          style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}
          text="enSTUDIO collapses the configuration bottleneck. The same project model feeds operator displays and physics simulation, stays in sync through surgical patches, and turns static drawings into a single source of truth for the entire plant lifecycle."
        />
        <ScrollStagger className="engram-outcomes-grid" step={50}>
          {outcomes.map((o, i) => (
            <div key={i} className="engram-outcome-pill">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
              <span>{o}</span>
            </div>
          ))}
        </ScrollStagger>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnstudioPage;
