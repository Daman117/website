import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { PencilRuler, Boxes, MessageSquare, Workflow, BadgeCheck, SlidersHorizontal, Upload, ScanSearch, FileOutput } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';
import EnstudioHero from './EnstudioHero/EnstudioHero';
import FlashIcon from '../Capability/FlashIcon';
import FeatureCard from '../Capability/FeatureCard';
import ComparisonTable from '../Capability/ComparisonTable';

interface EnstudioPageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#4338CA';


const challenges = [
  { title: 'Drawings You Cannot Use', desc: 'P&IDs are missing, outdated, or locked inside scanned PDFs from decades ago.' },
  { title: 'Slow Manual Setup', desc: 'Configuring a plant by hand takes 40+ engineer-hours for every drawing sheet.' },
  { title: 'The Same Data Typed Again', desc: 'Tag lists, ranges and alarm setpoints are re-keyed by hand into every system that needs them.' },
  { title: 'No Reliable Starting Point', desc: 'Brownfield plants have no clean source-of-truth drawing to build from.' },
  { title: 'Every Tool Wants Its Own Format', desc: 'SCADA, simulation and downstream tools each expect a different file, so the work is repeated for each.' },
  { title: 'One Change Means Redoing It All', desc: 'A single equipment change means re-importing and re-typing the whole drawing.' },
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
    color: '#4338CA',
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
    color: '#0E7490',
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
    color: '#4338CA',
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
    color: '#0E7490',
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
    color: '#4338CA',
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
    color: '#0E7490',
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
  "Drawings never leave the engineer's network",
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
    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.to(row, {
          opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.2, delay: i * 0.22, ease: 'power4.out',
          clearProps: 'transform,filter',
        });
      });
    });
    return () => ctx.revert();
  }, [matrixInView]);

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': '67,56,202' } as React.CSSProperties}>

      {/* ── HERO — own shell (EnstudioHero/), no photographic background. The
             right side is held empty for the composition. Content props
             mirror the old shared CapabilityHero call. ── */}
      <EnstudioHero
        badgeText="DRAWING INTELLIGENCE"
        titleLine1="Turn Engineering Drawings Into"
        titleLine2="Plant Configuration"
        subText="Upload a P&ID, draw it, or describe it in plain language. enSTUDIO builds one structured project model and exports it to enVIEW and enableSim without re-keying tags."
        ctaLabel="Request a Demo"
        onCtaClick={() => onOpenContact('Request a Demo')}
      />

      {/* ── CHALLENGE ── */}
      <section ref={challengeRef} className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <LineReveal as="h2" className="engram-section-h2" text="Configuration Is the Bottleneck" />
        <LineReveal
          as="p"
          className="enstudio-section-lead"
          text="Standing up a plant configuration means reading drawings and re-typing them into every system — by hand, again and again."
        />
        <ScrollStagger className="grid-3 engram-three-col engram-challenge-grid" step={70}>
          {challenges.map((c, i) => (
            <div key={c.title} className="card engram-card">
              <FlashIcon inView={challengeInView} index={i} className="enstudio-challenge-icon" />
              <h3 className="engram-card-title engram-card-h3">{c.title}</h3>
              <p className="supporting-text-loose enstudio-card-text">{c.desc}</p>
            </div>
          ))}
        </ScrollStagger>
        <p className="note-text enstudio-card-note">
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
            <FeatureCard
              key={m.title}
              Icon={m.Icon}
              title={m.title}
              subtitle={m.subtitle}
              desc={m.desc}
              color={m.color}
              img={m.img}
              titleClassName="card-heading enstudio-card-h3"
              subtitleClassName="card-subtitle enstudio-card-subtitle"
              descClassName="supporting-text-loose enstudio-card-desc"
            />
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
          className="enstudio-section-lead"
          text="Human oversight, local-only deployment, and brownfield readiness — the three things engineers check before they trust a system."
        />
        <ScrollStagger className="grid-3 engram-three-col" step={90}>

          <div className="card engram-card">
            <span className="eyebrow enstudio-trust-eyebrow">Human-in-the-Loop</span>
            <h3 className="engram-card-title">Nothing Ships Unreviewed</h3>
            <p className="supporting-text enstudio-trust-desc">
              Every extraction is verified before it reaches a live system.
            </p>
            {safetyFeatures.map((f, i) => (
              <div key={i} className="enstudio-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enstudio-trust-bullet enstudio-trust-bullet-blue" />
                <span className="supporting-text enstudio-trust-text">{f}</span>
              </div>
            ))}
          </div>

          <div className="card engram-card enstudio-trust-card">
            <span className="eyebrow enstudio-trust-eyebrow enstudio-trust-eyebrow-accent">Local & Lightweight</span>
            <h3 className="engram-card-title">Your Drawings Stay With You</h3>
            <p className="supporting-text enstudio-trust-desc">
              A simple local tool — no cloud, no heavy install.
            </p>
            {localFeatures.map((f, i) => (
              <div key={i} className="enstudio-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enstudio-trust-bullet enstudio-trust-bullet-accent" />
                <span className="supporting-text enstudio-trust-text">{f}</span>
              </div>
            ))}
          </div>

          <div className="card engram-card">
            <span className="eyebrow enstudio-trust-eyebrow enstudio-trust-eyebrow-green">Brownfield Ready</span>
            <h3 className="engram-card-title">Document What Is Actually Running</h3>
            <p className="supporting-text enstudio-trust-desc">
              No P&ID? Read the DCS screen that is already live.
            </p>
            {brownfieldFeatures.map((f, i) => (
              <div key={i} className="enstudio-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enstudio-trust-bullet enstudio-trust-bullet-green" />
                <span className="supporting-text enstudio-trust-text">{f}</span>
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
          className="enstudio-section-lead"
          text="Every existing approach solves one piece of the problem — typing, OCR, one vendor's format, or clean vector drawings only. enSTUDIO is the only one that handles the whole chain."
        />
        <ComparisonTable
          ref={matrixRef}
          wrapClassName="enstudio-comparison-card"
          headers={['Approach', 'Limitation', 'enSTUDIO']}
          accentHeaderClassName="enstudio-table-th-accent"
          rows={existingSolutions.map((row): [string, string, string] => [row.solution, row.limitation, row.fix])}
          cellClassNames={['enstudio-table-phase', 'enstudio-table-limitation', 'enstudio-table-fix']}
          getRowRef={(i) => (el) => { rowRefs.current[i] = el; }}
        />
        <p className="label-text enstudio-table-summary">
          enSTUDIO reads the drawing, understands the topology, and exports to every target.
        </p>
      </section>

      {/* ── OUTPUT ADAPTERS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Output Adapters</span>
        <LineReveal as="h2" className="engram-section-h2" text="One Model, Every Target System" />
        <ScrollStagger className="grid-3 engram-three-col" step={90}>
          {adapters.map((a) => (
            <div
              key={a.label}
              className="card engram-card enstudio-adapter-card"
              style={{ '--adapter-color': a.color, '--adapter-color-a40': `${a.color}40` } as React.CSSProperties}
            >
              <div className="u-flex u-items-center u-gap-8 enstudio-adapter-row">
                <div className="enstudio-adapter-bullet" />
                <span className="enstudio-adapter-tag">{a.target}</span>
              </div>
              <h3 className="engram-card-title enstudio-adapter-title">{a.label}</h3>
              <p className="supporting-text enstudio-adapter-desc">{a.desc}</p>
              {a.points.map((p, i) => (
                <div key={i} className="u-flex u-items-start u-gap-8 enstudio-trust-list-item">
                  <div className="enstudio-adapter-point-bullet" />
                  <span className="supporting-text enstudio-adapter-point-text">{p}</span>
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
          className="content-narrow lead-text enstudio-outcomes-lead"
          text="enSTUDIO collapses the configuration bottleneck. The same project model feeds operator displays and physics simulation, stays in sync through surgical patches, and turns static drawings into a single source of truth for the entire plant lifecycle."
        />
        <ScrollStagger className="u-flex u-flex-wrap u-gap-10 engram-outcomes-grid" step={50}>
          {outcomes.map((o, i) => (
            <div key={i} className="card label-text engram-outcome-pill">
              <div className="enstudio-outcome-bullet" />
              <span>{o}</span>
            </div>
          ))}
        </ScrollStagger>
        <div className="enstudio-cta-wrap u-flex u-justify-end">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EnstudioPage;
