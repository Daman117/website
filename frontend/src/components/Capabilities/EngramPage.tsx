import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Workflow, FileText, Network, Upload, ScanSearch, MessageCircle, Sparkles, ShieldCheck, Check, X, LayoutGrid, MonitorPlay, Image as ImageIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';
import CapabilityHero from '../Capability/Hero';
import FlashIcon from '../Capability/FlashIcon';
import FeatureCard from '../Capability/FeatureCard';

interface EngramPageProps {
  onOpenContact: (source?: string) => void;
}

const heroChips = ['Local AI', 'Air-Gapped', 'Cited Answers', 'Any Document Format'];

const challenges = [
  { title: 'Thousands of isolated files', desc: 'Datasheets, maintenance records, and logs scattered across network drives.' },
  { title: 'Static, unreadable diagrams', desc: 'P&IDs and PFDs trapped as disconnected PDFs and scanned images.' },
  { title: 'Evaporating tribal knowledge', desc: 'Critical context walks out the door when senior engineers retire.' },
  { title: 'Endless search cycles', desc: 'New engineers spend years learning the paperwork rather than the process.' },
];

const comparisonMatrix = {
  cols: ['enGRAM', 'SharePoint / DMS', 'Generic Cloud AI'],
  rows: [
    { c: 'Understands Instrument Tags', v: [true, false, false] },
    { c: 'Reads P&ID Symbology', v: [true, false, false] },
    { c: 'Air-Gapped Security', v: [true, false, false] },
    { c: 'Verifiable Engineering Citations', v: [true, false, false] },
  ],
};

const capabilities = [
  {
    Icon: Workflow,
    title: 'Diagram Intelligence',
    subtitle: 'Understand the Language of Industrial Drawings',
    desc: 'enGRAM converts static engineering drawings into interactive, searchable plant knowledge.',
    features: [
      'P&ID Digitization – Convert scanned and legacy drawings into intelligent digital assets',
      'Advanced Symbol Recognition – Automatically detects and classifies 800+ ISA-standard symbols across 51 categories',
      'Contextual OCR Extraction – Capture tags, annotations, and engineering metadata precisely where they matter',
      'Connectivity Mapping – Understand relationships between instruments, equipment, and processes',
      'Rapid Processing – Analyzes complex, high-density engineering sheets in 15–30 seconds',
    ],
    color: '#FDB022',
  },
  {
    Icon: FileText,
    title: 'Document Intelligence',
    subtitle: 'Every Answer Is Grounded and Traceable',
    desc: 'enGRAM extracts engineering knowledge from documents and links it directly to plant assets.',
    features: [
      'Multi-format ingestion for PDF, Word, Excel, text, and engineering documents',
      'Automatic tag extraction and normalization',
      'Equipment-centric knowledge organization',
      'Natural language search and querying',
      'Citation-based answers for engineering confidence',
      'Knowledge Library – Textbooks, manuals, and vendor standards indexed alongside plant documents',
    ],
    color: '#10B981',
  },
  {
    Icon: Network,
    title: 'Plant Knowledge Graph',
    subtitle: 'Connect Information Across Your Entire Plant',
    desc: 'enGRAM structures extracted information into an interconnected engineering knowledge base — the instrument tag is the unified source of truth, not the folder. Ask about FT-1001 and enGRAM connects every datasheet, drawing, manual, and log that touches it, automatically.',
    features: [
      'Link documents, drawings, equipment, and tags',
      'Eliminate information silos',
      'Build a searchable digital representation of plant knowledge',
      'Provide context-aware answers across systems and assets',
    ],
    color: '#A78BFA',
  },
];

const diagramViews = [
  {
    Icon: LayoutGrid,
    title: 'Diagram Editor',
    subtitle: 'The Review & Correction View',
    desc: 'A triage-first correction workspace — confidence-ranked detections you accept, edit, or reject. Edits stage until Save All, then write a full audit trail and auto-rebuild the PFD Canvas and Operator views.',
    color: '#FDB022',
    img: '/engram-static-svg.webp',
  },
  {
    Icon: MonitorPlay,
    title: 'Operator Graphics',
    subtitle: 'The Operator View',
    desc: 'An HMI-style live process screen, rebuilt purely from connectivity semantics — never the original drawing geometry. Click any tag for a live faceplate.',
    color: '#60A5FA',
    img: '/engram-operator-graphics.webp',
  },
  {
    Icon: ImageIcon,
    title: 'Digitized P&ID',
    subtitle: 'The Engineering View',
    desc: 'A full interactive PFD editor rendered from the digitized P&ID — auto-placed equipment, routed process streams, and DXF, SVG, and PDF export.',
    color: '#34D399',
    img: '/engram-pfd-canvas.webp',
  },
];

const steps = [
  { icon: Upload,        title: 'Upload',           desc: 'Connect enGRAM to existing repositories, network drives, and engineering document stores.' },
  { icon: ScanSearch,    title: 'Extract',          desc: 'AI extracts tags, symbols, text, tables, relationships, and engineering metadata.' },
  { icon: Network,       title: 'Build Knowledge',  desc: 'Information is structured into an interconnected plant knowledge graph.' },
  { icon: MessageCircle, title: 'Query',            desc: 'Engineers ask questions in natural language.' },
  { icon: Sparkles,      title: 'Generate Answers', desc: 'enGRAM delivers contextual answers based on verified plant records.' },
  { icon: ShieldCheck,   title: 'Verify',           desc: 'Every response can be traced back to its original source for validation.' },
];

const validationFeatures = [
  'Interactive diagram review tools',
  'AI-assisted correction workflows',
  'Tag verification and discrepancy detection',
  'Revision comparison capabilities',
  'Engineer approval before final publication',
];

const complianceFeatures = [
  'Native alignment with ISA, IEC, and DEXPI industrial standards',
  'Design-to-as-built comparison workflows',
  'Automated compliance verification support',
  'Audit-ready traceability',
  'Full source document references',
];

const securityFeatures = [
  'Fully local deployment',
  'On-premises virtual machine hosting',
  'Air-gapped operation support',
  'No cloud dependency required',
  'Protection of proprietary engineering data',
  'Open deployment architecture without vendor lock-in',
];

const outcomes = [
  'Faster troubleshooting',
  'Reduced engineering search time',
  'Improved knowledge retention',
  'Better operational decision-making',
  'Stronger compliance readiness',
  'Continuous accumulation of plant knowledge',
  'Compounding ROI — smarter every month',
];

const EngramPage: React.FC<EngramPageProps> = ({ onOpenContact }) => {
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
    <main className="engram-page">

      {/* ── HERO (pinned parallax background — iOS-safe, see HeroShell) ── */}
      <CapabilityHero
        image="/engram-hero.webp"
        badgeText="PLANT KNOWLEDGE"
        titleLine1="Turn Engineering Records Into"
        titleLine2="Plant Knowledge"
        subText="enGRAM transforms static engineering documents, drawings, and records into a living, searchable knowledge system built specifically for industrial plants."
        bodyText="Engineering information is often trapped inside PDFs, scanned drawings, spreadsheets, manuals, and disconnected repositories. enGRAM extracts, connects, and structures that information into a plant-wide intelligence layer that engineers can query, validate, and trust."
        chips={heroChips}
        ctaLabel="Request a Demo"
        onCtaClick={() => onOpenContact('Request a Pilot')}
        classes={{
          badge: 'badge-text engram-hero-badge-text',
          title: 'engram-hero-h1-text',
          accent: 'engram-hero-h1-accent',
          subtitle: 'engram-hero-sub-text',
          body: 'engram-hero-body-text',
          chips: 'engram-hero-chips',
          chip: 'engram-hero-chip',
        }}
      />

      {/* ── CHALLENGE ── */}
      <section ref={challengeRef} className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <LineReveal as="h2" className="engram-section-h2" text="The Hidden Cost of Industrial Knowledge" />
        <LineReveal
          as="p"
          className="engram-section-lead"
          text="Industrial facilities generate enormous amounts of engineering data, but critical knowledge remains difficult to access."
        />

        <ScrollStagger className="engram-quad engram-challenge-grid" step={400} duration={600}>
          {challenges.map((c, i) => (
            <div key={i} className="card engram-card">
              <FlashIcon inView={challengeInView} index={i} className="engram-challenge-icon" />
              <h3 className="engram-card-title engram-card-h3">{c.title}</h3>
              <p className="supporting-text-loose engram-card-p card-desc">{c.desc}</p>
            </div>
          ))}
        </ScrollStagger>
        <p className="note-text engram-card-note card-note">
          Engineers spend valuable time locating information instead of solving operational problems.
        </p>
      </section>

      {/* ── CAPABILITIES ── */}
      <NativeApproachScroll
        items={capabilities}
        eyebrow="Key Capabilities"
        title="Three Layers of Plant Intelligence"
      />

      {/* ── DIAGRAM VIEWS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">One Diagram · Three Views</span>
        <LineReveal as="h2" className="engram-section-h2" text="From Scanned Drawing to Three Live Views" />
        <LineReveal
          as="p"
          className="content-medium engram-section-lead-max"
          text="A scanned P&ID doesn't stay a picture. enGRAM detects every symbol, tag, and line, then digitizes the drawing into a structured scene — rendered as three synchronized views of the same diagram, not three separate files."
        />
        <ScrollStagger className="engram-caps-grid" step={80}>
          {diagramViews.map((v) => (
            <FeatureCard
              key={v.title}
              Icon={v.Icon}
              title={v.title}
              subtitle={v.subtitle}
              desc={v.desc}
              color={v.color}
              img={v.img}
              titleClassName="card-heading engram-diagram-title diagram-title"
              subtitleClassName="card-subtitle engram-diagram-subtitle diagram-subtitle"
              descClassName="supporting-text-loose engram-diagram-desc diagram-desc"
            />
          ))}
        </ScrollStagger>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorksScroll
        eyebrow="How It Works"
        title="From Raw Files to Actionable Intelligence"
        steps={steps}
        accent="#FDB022"
        accentRgb="253,176,34"
        video="/engram-demo.mp4"
        videoPoster="/engram-demo-poster.webp"
      />

      {/* ── VALIDATION + COMPLIANCE + SECURITY ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Trust & Control</span>
        <LineReveal as="h2" className="engram-section-h2" text="Built to Earn Engineering Trust" />
        <LineReveal
          as="p"
          className="engram-section-lead"
          text="Human oversight, regulatory alignment, and airtight security — the three things engineers check before they trust a system."
        />
        <ScrollStagger className="grid-3 engram-three-col" step={90}>

          {/* Human in the Loop */}
          <div className="card engram-card">
            <span className="eyebrow engram-trust-eyebrow">Human-in-the-Loop</span>
            <h3 className="engram-card-title">Engineers Stay in Control</h3>
            <p className="supporting-text engram-trust-desc trust-desc">
              enGRAM is designed to augment engineering teams — not replace them.
            </p>
            {validationFeatures.map((f, i) => (
              <div key={i} className="engram-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="engram-trust-bullet engram-trust-bullet-green" />
                <span className="supporting-text engram-trust-text trust-text">{f}</span>
              </div>
            ))}
            <p className="note-text engram-trust-note trust-note">
              Every critical decision remains under human oversight.
            </p>
          </div>

          {/* Compliance */}
          <div className="card engram-card">
            <span className="eyebrow engram-trust-eyebrow">Compliance</span>
            <h3 className="engram-card-title">Built for Regulated Environments</h3>
            <p className="supporting-text engram-trust-desc trust-desc">
              enGRAM supports engineering governance, standards compliance, and operational assurance.
            </p>
            {complianceFeatures.map((f, i) => (
              <div key={i} className="engram-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="engram-trust-bullet engram-trust-bullet-blue" />
                <span className="supporting-text engram-trust-text trust-text">{f}</span>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="card engram-card engram-trust-card-yellow">
            <span className="eyebrow engram-trust-eyebrow engram-trust-eyebrow-yellow">Industrial Security</span>
            <h3 className="engram-card-title">Your Data Never Leaves Your Plant</h3>
            <p className="supporting-text engram-trust-desc trust-desc">
              Security is a core design principle of enGRAM.
            </p>
            {securityFeatures.map((f, i) => (
              <div key={i} className="engram-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="engram-trust-bullet engram-trust-bullet-yellow" />
                <span className="supporting-text engram-trust-text trust-text">{f}</span>
              </div>
            ))}
          </div>
        </ScrollStagger>
      </section>

      {/* ── THE DIFFERENCE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <LineReveal as="h2" className="engram-section-h2" text="Why Existing Solutions Fall Short" />
        <LineReveal
          as="p"
          className="engram-section-lead"
          text="Traditional document repositories and generic AI tools are not designed for industrial engineering environments."
        />

        <div ref={matrixRef} className="card engram-card engram-comparison-card">
          <table className="engram-table engram-comparison-table">
            <colgroup>
              <col className="engram-table-col-first" />
              {comparisonMatrix.cols.map((c) => (
                <col key={c} className="engram-table-col" style={{ '--col-w': `${66 / comparisonMatrix.cols.length}%` } as React.CSSProperties} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="tag-text"></th>
                {comparisonMatrix.cols.map((c, i) => (
                  <th key={c} className={`tag-text engram-table-th ${i === 0 ? 'engram-highlight' : ''}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonMatrix.rows.map((row, idx) => (
                <tr key={row.c} ref={(el) => { rowRefs.current[idx] = el; }}>
                  <td className="engram-table-phase">{row.c}</td>
                  {row.v.map((ok, i) => (
                    <td key={i} className="engram-table-cell-center">
                      {ok
                        ? <Check size={16} color="#10B981" strokeWidth={2.5} className="u-inline-block" />
                        : <X size={16} color="var(--t5)" strokeWidth={2} className="u-inline-block" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="label-text engram-table-summary table-summary">
          enGRAM was built specifically for industrial engineering data, diagrams, and workflows.
        </p>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Vision</span>
        <LineReveal as="h2" className="engram-section-h2" text="From Engineering Records to Plant Memory" />
        <LineReveal
          as="p"
          className="content-narrow lead-text engram-outcomes-lead"
          text="enGRAM transforms engineering information from static documentation into a continuously evolving intelligence system. As more information is added, the system becomes increasingly valuable — creating a long-term institutional memory for the entire facility."
        />
        <ScrollStagger className="u-flex u-flex-wrap u-gap-10 engram-outcomes-grid" step={50}>
          {outcomes.map((o, i) => (
            <div key={i} className="card label-text engram-outcome-pill">
              <div className="engram-outcome-bullet" />
              <span>{o}</span>
            </div>
          ))}
        </ScrollStagger>
        <div className="engram-cta-wrap u-flex u-justify-end">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Request a Pilot')}>
            Request a Pilot →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EngramPage;
