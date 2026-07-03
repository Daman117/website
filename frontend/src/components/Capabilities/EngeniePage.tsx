import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Workflow, Search, MessageSquare, Building2, Scale, CircleCheck, ShieldCheck, ClipboardList, BrainCircuit, Sparkles, PackageCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';

interface EngeniePageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#1B6FD8';
const ACCENT_RGB = '27,111,216';

const heroChips = ['Multi-Agent Pipeline', 'Audit-Ready', 'Standards-Compliant', 'Vendor-Aware'];

const modules = [
  {
    Icon: Workflow,
    title: 'Solution Engineering',
    subtitle: 'Requirements → actionable specifications',
    desc: 'Transform greenfield or brownfield project requirements into precise, actionable specifications. The AI analyzes your unique needs and proposes the optimal instruments and accessories.',
    features: [
      'Greenfield & brownfield project analysis',
      'Complete bill of materials generation',
      'Integration compatibility assessment',
      'Technical specification alignment',
    ],
    color: '#1B6FD8',
  },
  {
    Icon: Search,
    title: 'Intelligent Search',
    subtitle: 'Recommendations with reasoning',
    desc: 'Empower buyers and requisitioners with AI-driven specification assistance. Get intelligent recommendations backed by detailed rationale — not just results, but reasoning.',
    features: [
      'Natural language specification input',
      'AI-powered best-match recommendations',
      'Transparent decision rationale',
      'Alternative options comparison',
    ],
    color: '#2563EB',
  },
  {
    Icon: MessageSquare,
    title: 'Quick Chat Assistant',
    subtitle: 'Your 24/7 technical consultant',
    desc: 'Get instant, expert-level answers on instruments, accessories, or general industrial knowledge. Your on-demand technical consultant, available around the clock.',
    features: [
      'Instant technical Q&A',
      'Industrial knowledge base access',
      'Product comparison guidance',
      'Troubleshooting support',
    ],
    color: '#60A5FA',
  },
];

const aiFeatures = [
  { Icon: Building2, title: 'Company-Personalized Matching', desc: 'Recommendations aligned to your approved strategy, engineering standards, and inventory availability.' },
  { Icon: Scale, title: 'Intelligent Vendor Analysis', desc: 'Side-by-side comparison and scoring across technical fit, compliance, and commercial factors.' },
  { Icon: CircleCheck, title: 'Real-time Validation', desc: 'Instant requirement checks, missing-field prompts, and fast shortlisting.' },
  { Icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Enterprise-grade security with consistent, explainable outputs you can trust.' },
];

const steps = [
  { icon: ClipboardList, title: 'Define Requirements',   desc: 'Input project specs naturally — greenfield construction or brownfield upgrades. The AI understands context.' },
  { icon: BrainCircuit,  title: 'AI Analysis',           desc: 'enGENIE cross-references your needs against supplier strategies, category frameworks, and standards.' },
  { icon: Sparkles,      title: 'Smart Recommendations', desc: 'Receive curated instrument and accessory recommendations with rationale and compliance verification.' },
  { icon: PackageCheck,  title: 'Procure with Confidence', desc: 'Move forward with specs aligned to your strategic sourcing objectives and technical standards.' },
];

const differentiators = [
  { phase: 'BOM Identification', llm: 'Hallucinates or misses physically mandatory accessories', engenie: 'Tiered Inference Rules — physical necessity, context-triggered, and excluded items' },
  { phase: 'Taxonomy Standardization', llm: 'Colloquial naming makes exact product matching impossible', engenie: 'Taxonomy RAG maps your terminology to canonical database schemas' },
  { phase: 'Standards Compliance', llm: 'Relies on outdated training data; cannot guarantee compliance', engenie: 'Standards RAG injects your IEC / ISA / API standards dynamically' },
  { phase: 'Large BOM Extraction', llm: 'Truncates output or fails on projects with 10+ items', engenie: 'Parallel chunking & merging engine on high-reasoning models' },
  { phase: 'Datasheet Matching', llm: 'Limited context; hallucinates suitability or misses spec gaps', engenie: 'Datasheet pipeline evaluates raw PDFs parameter-by-parameter' },
  { phase: 'Vendor Ranking', llm: 'Subjective, qualitative, inconsistent ranking', engenie: 'Mathematical penalty scoring enforces deterministic ranking' },
];

const audiences = [
  {
    label: 'For Enterprises',
    tag: 'Procurement teams & buyers',
    desc: "Transform your procurement operations with AI that understands your organizational DNA — from supplier strategies to category frameworks and compliance requirements.",
    color: '#1B6FD8',
    points: [
      'Reduce specification time by up to 85%',
      'Ensure compliance with organizational standards',
      'Leverage preferred supplier agreements automatically',
      'Get AI-powered recommendations with transparent rationale',
      'Streamline greenfield & brownfield project specifications',
    ],
  },
  {
    label: 'For Suppliers',
    tag: 'Manufacturers & distributors',
    desc: "Get your products in front of the right buyers at the right time. enGENIE's AI ensures your instruments and accessories are recommended when they best match customer requirements.",
    color: '#2563EB',
    points: [
      'Increase product visibility to qualified buyers',
      'Get matched to projects based on technical specifications',
      'Benefit from AI-powered product recommendations',
      'Strengthen strategic partnerships with enterprise buyers',
      'Access detailed market insights and demand patterns',
    ],
  },
];

const orgDna = [
  { title: 'Supplier Strategy Integration', desc: 'Recommendations align with your preferred supplier agreements, volume commitments, and strategic partnerships.', color: '#1B6FD8' },
  { title: 'Category Framework Compliance', desc: 'Automatic adherence to category strategies, spending policies, and procurement guidelines.', color: '#2563EB' },
  { title: 'Organizational Standards Built-In', desc: 'Technical specifications automatically verified against your engineering standards and safety requirements.', color: '#60A5FA' },
];

const outcomes = [
  'Reduce specification time by up to 85%',
  'Audit-ready, explainable recommendations',
  'Compliance with organizational standards',
  'Lower procurement cost and risk',
  'Faster shortlisting and decisions',
  'Strategic sourcing alignment built in',
];

const EngeniePage: React.FC<EngeniePageProps> = ({ onOpenContact }) => {
  const { ref: matrixRef, inView: matrixInView } = useInView({ triggerOnce: true, threshold: 0.15 });

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

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>

      {/* ── HERO (fixed parallax background) ── */}
      <div style={{
        position: 'relative',
        backgroundImage: 'url(/engenie-hero.png)',
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
            <span style={{ color: '#93c5fd', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>AI-POWERED PROCUREMENT INTELLIGENCE</span>
          </div>
          <h1 className="engram-hero-h1" style={{ color: '#ffffff' }}>
            <span className="hero-line-mask">
              <span className="hero-line-inner" style={{ animationDelay: '150ms' }}>Industrial Procurement</span>
            </span>
            <span className="hero-line-mask">
              <span className="hero-line-inner" style={{ animationDelay: '500ms', color: '#2563EB' }}>With Intelligent AI</span>
            </span>
          </h1>
          <p className="engram-hero-sub hero-fade-up" style={{ color: 'rgba(255,255,255,0.96)', animationDelay: '900ms' }}>
            enGENIE revolutionizes how enterprises source and suppliers sell industrial instruments and accessories — AI that understands requirements, organizational standards, and supplier strategies.
          </p>
          <p className="engram-hero-body hero-fade-up" style={{ color: 'rgba(255,255,255,0.82)', animationDelay: '1100ms' }}>
            General-purpose LLMs guess. enGENIE runs a structured, multi-agent pipeline over your catalogs, datasheets, and standards to deliver precise, compliant, audit-ready procurement recommendations — every accessory accounted for, every choice explained.
          </p>
          <div className="hero-fade-up" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28, animationDelay: '1300ms' }}>
            {heroChips.map((c) => (
              <span key={c} className="badge hero-chip-badge" style={{ color: '#93c5fd', background: 'rgba(27,111,216,0.22)', borderColor: 'rgba(96,165,250,0.4)' }}>
                {c}
              </span>
            ))}
          </div>
          <div className="hero-fade-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animationDelay: '1500ms' }}>
            <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
              Request a Demo
            </button>
          </div>
        </section>
      </div>


      {/* ── AI FEATURES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">AI-Driven Features</span>
        <LineReveal as="h2" className="engram-section-h2" text="Precision at Every Step" />
        <ScrollStagger className="engram-quad" step={70}>
          {aiFeatures.map((f) => (
            <div key={f.title} className="engram-card">
              <div style={{ color: ACCENT, marginBottom: 12, lineHeight: 1 }}><f.Icon size={22} strokeWidth={1.75} /></div>
              <h3 className="engram-card-title" style={{ fontSize: 14, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── FOR ENTERPRISES / FOR SUPPLIERS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Built For You</span>
        <LineReveal as="h2" className="engram-section-h2" text="Powering Success for Enterprises & Suppliers" />
        <LineReveal
          as="p"
          style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32, maxWidth: 720 }}
          text="enGENIE creates value across the entire procurement ecosystem — streamlining selection for buyers while accelerating sales for suppliers."
        />
        <ScrollStagger className="engram-two-col" step={120}>
          {audiences.map((a) => (
            <div key={a.label} className="engram-card" style={{ borderColor: `${a.color}40` }}>
              <span className="eyebrow" style={{ marginBottom: 8, display: 'block', color: a.color }}>{a.label}</span>
              <h3 className="engram-card-title" style={{ marginBottom: 4 }}>{a.tag}</h3>
              <p style={{ fontSize: 13, color: 'var(--t4)', marginBottom: 16, lineHeight: 1.7 }}>{a.desc}</p>
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

      {/* ── MODULES ── */}
      <NativeApproachScroll
        items={modules}
        eyebrow="Powerful Capabilities"
        title="Three Intelligent Modules, One Platform"
      />

      {/* ── HOW IT WORKS ── */}
      <HowItWorksScroll
        eyebrow="How It Works"
        title="Intelligence Built Into Every Step"
        steps={steps}
        accent={ACCENT}
        accentRgb={ACCENT_RGB}
      />

      {/* ── ORGANIZATIONAL DNA ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Strategic Intelligence</span>
        <LineReveal as="h2" className="engram-section-h2" text="Built for Enterprise Procurement Excellence" />
        <LineReveal
          as="p"
          style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 32, maxWidth: 720 }}
          text="enGENIE doesn't just search — it thinks. Every recommendation considers your complete procurement ecosystem, ensuring alignment with strategic objectives and operational requirements."
        />
        <ScrollStagger className="engram-three-col" step={90}>
          {orgDna.map((o) => (
            <div key={o.title} className="engram-card" style={{ borderColor: `${o.color}40` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: o.color, flexShrink: 0 }} />
                <h3 className="engram-card-title" style={{ margin: 0 }}>{o.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t4)', lineHeight: 1.7 }}>{o.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── WHY ENGENIE (vs LLMs) ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <LineReveal as="h2" className="engram-section-h2" text="Why a General LLM Isn't Enough" />
        <LineReveal
          as="p"
          style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 24, maxWidth: 720 }}
          text="ChatGPT, Gemini, and Claude reason well in the open, but fall short on complex industrial procurement. enGENIE structures the workflow into auditable, deterministic agent steps."
        />
        <div ref={matrixRef} className="engram-card" style={{ padding: '10px 18px' }}>
          <table className="engram-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>General-Purpose LLM</th>
                <th style={{ color: ACCENT }}>enGENIE</th>
              </tr>
            </thead>
            <tbody>
              {differentiators.map((d, i) => (
                <tr key={i} ref={(el) => { rowRefs.current[i] = el; }}>
                  <td style={{ fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{d.phase}</td>
                  <td style={{ color: 'var(--t4)' }}>{d.llm}</td>
                  <td style={{ color: 'var(--t3)' }}>{d.engenie}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <LineReveal as="h2" className="engram-section-h2" text="Procure With Confidence" />
        <LineReveal
          as="p"
          style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}
          text="enGENIE standardizes selection, reduces specification time, and turns procurement into a fast, compliant, explainable workflow — for both the enterprises that source and the suppliers that sell."
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

export default EngeniePage;
