import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow, Search, MessageSquare, Building2, Scale, CircleCheck, ShieldCheck } from 'lucide-react';

interface EngeniePageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#1B6FD8';
const ACCENT_RGB = '27,111,216';

const stats = [
  { value: '85%', label: 'Faster Specification Time' },
  { value: '99.2%', label: 'Specification Accuracy' },
  { value: '40%', label: 'Cost Savings' },
  { value: '50+', label: 'Instruments Cataloged' },
];

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
    color: '#0E9BC4',
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
    color: '#10B981',
  },
];

const aiFeatures = [
  { Icon: Building2, title: 'Company-Personalized Matching', desc: 'Recommendations aligned to your approved strategy, engineering standards, and inventory availability.' },
  { Icon: Scale, title: 'Intelligent Vendor Analysis', desc: 'Side-by-side comparison and scoring across technical fit, compliance, and commercial factors.' },
  { Icon: CircleCheck, title: 'Real-time Validation', desc: 'Instant requirement checks, missing-field prompts, and fast shortlisting.' },
  { Icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Enterprise-grade security with consistent, explainable outputs you can trust.' },
];

const steps = [
  { n: '1', title: 'Define Requirements', desc: 'Input project specs naturally — greenfield construction or brownfield upgrades. The AI understands context.' },
  { n: '2', title: 'AI Analysis', desc: 'enGENIE cross-references your needs against supplier strategies, category frameworks, and standards.' },
  { n: '3', title: 'Smart Recommendations', desc: 'Receive curated instrument and accessory recommendations with rationale and compliance verification.' },
  { n: '4', title: 'Procure with Confidence', desc: 'Move forward with specs aligned to your strategic sourcing objectives and technical standards.' },
];

const differentiators = [
  { phase: 'BOM Identification', llm: 'Hallucinates or misses physically mandatory accessories', engenie: 'Tiered Inference Rules — physical necessity, context-triggered, and excluded items' },
  { phase: 'Taxonomy Standardization', llm: 'Colloquial naming makes exact product matching impossible', engenie: 'Taxonomy RAG maps your terminology to canonical database schemas' },
  { phase: 'Standards Compliance', llm: 'Relies on outdated training data; cannot guarantee compliance', engenie: 'Standards RAG injects your IEC / ISA / API standards dynamically' },
  { phase: 'Large BOM Extraction', llm: 'Truncates output or fails on projects with 10+ items', engenie: 'Parallel chunking & merging engine on high-reasoning models' },
  { phase: 'Datasheet Matching', llm: 'Limited context; hallucinates suitability or misses spec gaps', engenie: 'Datasheet pipeline evaluates raw PDFs parameter-by-parameter' },
  { phase: 'Vendor Ranking', llm: 'Subjective, qualitative, inconsistent ranking', engenie: 'Mathematical penalty scoring enforces deterministic ranking' },
];

const orgDna = [
  { title: 'Supplier Strategy Integration', desc: 'Recommendations align with your preferred supplier agreements, volume commitments, and strategic partnerships.', color: '#1B6FD8' },
  { title: 'Category Framework Compliance', desc: 'Automatic adherence to category strategies, spending policies, and procurement guidelines.', color: '#0E9BC4' },
  { title: 'Organizational Standards Built-In', desc: 'Technical specifications automatically verified against your engineering standards and safety requirements.', color: '#10B981' },
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
  const navigate = useNavigate();

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>

      {/* ── BACK + PRODUCT NAME ── */}
      <div style={{ paddingTop: 100, paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
        <button className="product-back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div style={{ marginTop: -20, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            fontFamily: "'Space Grotesk','DM Sans',sans-serif",
            fontSize: 'clamp(28px,4vw,48px)',
            fontWeight: 700,
            letterSpacing: '-1.5px',
            color: 'var(--t1)',
            lineHeight: 1,
          }}>
            en<span style={{ color: ACCENT }}>GENIE</span>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="engram-hero engram-container">
        <div className="engram-hero-badge">
          <span style={{ color: ACCENT, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>AI-POWERED PROCUREMENT INTELLIGENCE</span>
        </div>
        <h1 className="engram-hero-h1">
          Industrial Procurement<br />
          <span style={{ color: ACCENT }}>With Intelligent AI</span>
        </h1>
        <p className="engram-hero-sub">
          enGENIE revolutionizes how enterprises source and suppliers sell industrial instruments and accessories — AI that understands requirements, organizational standards, and supplier strategies.
        </p>
        <p className="engram-hero-body">
          General-purpose LLMs guess. enGENIE runs a structured, multi-agent pipeline over your catalogs, datasheets, and standards to deliver precise, compliant, audit-ready procurement recommendations — every accessory accounted for, every choice explained.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo
          </button>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="engram-section engram-container">
        <div className="engram-stats">
          {stats.map((s) => (
            <div key={s.label} className="engram-stat">
              <div className="engram-stat-val">{s.value}</div>
              <div className="engram-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Overview</span>
        <h2 className="engram-section-h2">Procurement Intelligence, Built for Engineers</h2>
        <div className="engram-overview-grid">
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            enGENIE creates value across the entire procurement ecosystem — streamlining selection for buyers while accelerating sales for suppliers. It cross-references every requirement against supplier strategies, category frameworks, and organizational standards before it ever recommends a product.
          </p>
          <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85 }}>
            Three intelligent modules combine advanced AI with deep industrial knowledge: Solution Engineering for full project specs, Intelligent Search for guided selection, and a Quick Chat Assistant for instant technical answers — one platform for the complete instrument selection workflow.
          </p>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Powerful Capabilities</span>
        <h2 className="engram-section-h2">Three Intelligent Modules, One Platform</h2>
        <div className="engram-caps-grid">
          {modules.map((m) => (
            <div key={m.title} className="engram-cap-card" style={{ '--cap-color': m.color } as React.CSSProperties}>
              <div className="engram-cap-icon" style={{ color: m.color }}><m.Icon size={26} strokeWidth={1.75} /></div>
              <h3 className="engram-cap-title" style={{ color: m.color }}>{m.title}</h3>
              <p className="engram-cap-sub">{m.subtitle}</p>
              <p className="engram-cap-desc">{m.desc}</p>
              <ul className="engram-cap-list">
                {m.features.map((f, i) => (
                  <li key={i}>
                    <span style={{ color: m.color, marginRight: 6 }}>—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">AI-Driven Features</span>
        <h2 className="engram-section-h2">Precision at Every Step</h2>
        <div className="engram-quad">
          {aiFeatures.map((f) => (
            <div key={f.title} className="engram-card">
              <div style={{ color: ACCENT, marginBottom: 12, lineHeight: 1 }}><f.Icon size={22} strokeWidth={1.75} /></div>
              <h3 className="engram-card-title" style={{ fontSize: 14, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Seamless Process</span>
        <h2 className="engram-section-h2">Intelligence Built Into Every Step</h2>
        <div className="engram-flow-row">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="engram-flow-card">
                <div className="engram-flow-num">{s.n}</div>
                <h4 className="engram-flow-title">{s.title}</h4>
                <p className="engram-flow-desc">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="engram-flow-connector" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── WHY ENGENIE (vs LLMs) ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <h2 className="engram-section-h2">Why a General LLM Isn’t Enough</h2>
        <p style={{ fontSize: 14, color: 'var(--t4)', marginBottom: 24, maxWidth: 720 }}>
          ChatGPT, Gemini, and Claude reason well in the open, but fall short on complex industrial procurement. enGENIE structures the workflow into auditable, deterministic agent steps.
        </p>
        <div className="engram-card" style={{ padding: '10px 18px' }}>
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
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>{d.phase}</td>
                  <td style={{ color: 'var(--t4)' }}>{d.llm}</td>
                  <td style={{ color: 'var(--t3)' }}>{d.engenie}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── ORGANIZATIONAL DNA ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Built For You</span>
        <h2 className="engram-section-h2">Your Organizational DNA, Built In</h2>
        <div className="engram-three-col">
          {orgDna.map((o) => (
            <div key={o.title} className="engram-card" style={{ borderColor: `${o.color}40` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: o.color, flexShrink: 0 }} />
                <h3 className="engram-card-title" style={{ margin: 0 }}>{o.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t4)', lineHeight: 1.7 }}>{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <h2 className="engram-section-h2">Procure With Confidence</h2>
        <p style={{ fontSize: 15, color: 'var(--t3)', lineHeight: 1.85, maxWidth: 680, marginBottom: 32 }}>
          enGENIE standardizes selection, reduces specification time, and turns procurement into a fast, compliant, explainable workflow — for both the enterprises that source and the suppliers that sell.
        </p>
        <div className="engram-outcomes-grid">
          {outcomes.map((o, i) => (
            <div key={i} className="engram-outcome-pill">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
              <span>{o}</span>
            </div>
          ))}
        </div>
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
