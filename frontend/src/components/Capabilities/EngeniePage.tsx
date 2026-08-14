import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Workflow, Search, MessageSquare, Building2, Scale, CircleCheck, ShieldCheck, ClipboardList, BrainCircuit, Sparkles, PackageCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';
import CapabilityHero from '../Capability/Hero';
import HeroBackground from './EngenieHero/HeroBackground';
import HeroSystem from './EngenieHero/HeroSystem';
import ComparisonTable from '../Capability/ComparisonTable';

interface EngeniePageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#1B6FD8';
const ACCENT_RGB = '27,111,216';

const heroChips = ['Cited Recommendations', 'Audit-Ready', 'Meets Your Standards', 'Compares Vendors'];

const modules = [
  {
    Icon: Workflow,
    title: 'Solution Engineering',
    subtitle: 'Requirements → a finished specification',
    desc: 'Turn project requirements — new build or upgrade — into a specification you can issue. enGENIE reads the service conditions and proposes the instruments and accessories that suit them.',
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
    subtitle: 'Recommendations with the reasoning shown',
    desc: 'Buyers and requisitioners describe what they need in plain words and get a recommendation with the reasoning written out — not just what to buy, but why.',
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
    subtitle: 'Ask a question, any time',
    desc: 'Ask about an instrument, an accessory or how something is normally done, and get an answer straight away — at 2AM on a night shift as easily as at a desk.',
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
  { Icon: Building2, title: 'Matched to Your Company', desc: 'Recommendations follow your approved suppliers, your engineering standards and what is actually in stock.' },
  { Icon: Scale, title: 'Vendors Compared Side by Side', desc: 'Every option scored on technical fit, compliance and cost, shown next to each other.' },
  { Icon: CircleCheck, title: 'Checked as You Go', desc: 'Missing information is flagged while you work, so a shortlist is ready sooner.' },
  { Icon: ShieldCheck, title: 'Runs Inside Your Network', desc: 'Nothing is sent outside, and the same question always returns the same reasoning.' },
];

const steps = [
  { icon: ClipboardList, title: 'Describe the Job',      desc: 'Write what the project needs in your own words — a new build or an upgrade to an existing unit.' },
  { icon: BrainCircuit,  title: 'enGENIE Checks It',     desc: 'Your requirement is checked against approved suppliers, your purchasing rules and the relevant standards.' },
  { icon: Sparkles,      title: 'You Get a Shortlist',   desc: 'A short list of instruments and accessories, each with the reason it was chosen and the standard it meets.' },
  { icon: PackageCheck,  title: 'Order With Confidence', desc: 'The specification is ready to issue, already matching your standards and purchasing rules.' },
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
    desc: "Specify instruments the way your company already does it — the suppliers you have agreements with, the purchasing rules you follow, and the standards you have to meet.",
    color: '#1B6FD8',
    points: [
      'Specifications written in a fraction of the time',
      'Company standards applied every time',
      'Preferred supplier agreements used automatically',
      'Every recommendation shows its reasoning',
      'Works for new builds and upgrades alike',
    ],
  },
  {
    label: 'For Suppliers',
    tag: 'Manufacturers & distributors',
    desc: "Your products get put forward when they genuinely fit the job. enGENIE matches on the service conditions, so you are shortlisted for work your instruments are actually right for.",
    color: '#2563EB',
    points: [
      'Seen by buyers who are specifying right now',
      'Matched on real service conditions, not keywords',
      'Put forward with the reason you fit',
      'Closer working relationships with regular buyers',
      'See what the market is asking for',
    ],
  },
];

const orgDna = [
  { title: 'Your Suppliers Come First', desc: 'Recommendations respect the supplier agreements and volume commitments you already have in place.', color: '#1B6FD8' },
  { title: 'Your Purchasing Rules Apply', desc: 'Spending limits and purchasing policies are followed without anyone having to remember them.', color: '#2563EB' },
  { title: 'Your Standards Are Checked', desc: 'Every specification is verified against your own engineering and safety standards before it reaches you.', color: '#60A5FA' },
];

const outcomes = [
  'Specifications finished in a fraction of the time',
  'Every recommendation can be explained to an auditor',
  'Company standards met without chasing them',
  'Less money spent, and less risk of the wrong choice',
  'Shortlists and decisions arrive sooner',
  'Purchasing rules followed by default',
];

const EngeniePage: React.FC<EngeniePageProps> = ({ onOpenContact }) => {
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

  const reduceMotion = prefersReducedMotion();
  /* Not triggerOnce: the hero has to go quiet again once scrolled past. */
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0, rootMargin: '180px' });

  return (
    <main className="engram-page" style={{ '--accent': ACCENT, '--accent-rgb': ACCENT_RGB } as React.CSSProperties}>

      {/* ── HERO ──────────────────────────────────────────────────────
             The photographic backdrop is gone; the wrapper scopes that removal
             and the wave layer to THIS page, so HeroShell and CapabilityHero
             stay shared and untouched. `image=""` stops the fetch; the CSS
             hides the layer that would have painted it. ── */}
      <div className="egn-hero" ref={heroRef}>
        <HeroBackground reduceMotion={reduceMotion} active={heroInView} />
        <HeroSystem reduceMotion={reduceMotion} active={heroInView} />
        <CapabilityHero
          image=""
          badgeText="INSTRUMENT SELECTION & SPECIFICATION"
          titleLine1="From Process Conditions to"
          titleLine2="An Issue-Ready Spec"
          subText="enGENIE takes your service conditions and returns the right instrument — with the standard that justifies it, the reason every alternative was excluded, and a specification ready to issue."
          bodyText="Selection runs as a structured, repeatable pipeline over your catalogs, datasheets and standards, so every recommendation is cited, compliant and explainable — and already matches your approved suppliers and purchasing rules by the time it reaches you."
          chips={heroChips}
          ctaLabel="Request a Demo"
          onCtaClick={() => onOpenContact('Request a Demo')}
          classes={{
            badge: 'badge-text engenie-hero-badge-text',
            title: 'engenie-hero-h1-text',
            accent: 'engenie-hero-h1-accent',
            subtitle: 'engenie-hero-sub-text',
            body: 'engenie-hero-body-text',
            chips: 'engenie-hero-chips',
            chip: 'engenie-hero-chip',
          }}
        />
      </div>

      {/* ── AI FEATURES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">AI-Driven Features</span>
        <LineReveal as="h2" className="engram-section-h2" text="Precision at Every Step" />
        <ScrollStagger className="engram-quad" step={70}>
          {aiFeatures.map((f) => (
            <div key={f.title} className="card engram-card">
              <div className="engenie-feature-icon"><f.Icon size={22} strokeWidth={1.75} /></div>
              <h3 className="engram-card-title engenie-card-h3">{f.title}</h3>
              <p className="supporting-text-loose engenie-card-p card-desc">{f.desc}</p>
            </div>
          ))}
        </ScrollStagger>
      </section>

      {/* ── FOR ENTERPRISES / FOR SUPPLIERS ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Built For You</span>
        <LineReveal as="h2" className="engram-section-h2" text="Useful on Both Sides of the Spec" />
        <LineReveal
          as="p"
          className="content-medium engenie-section-lead"
          text="The same matching works in both directions — engineers get the instrument that fits the service, and suppliers get put forward for the work their instruments are actually right for."
        />
        <ScrollStagger className="engram-two-col" step={120}>
          {audiences.map((a) => (
            <div
              key={a.label}
              className="card engram-card engenie-audience-card"
              style={{ '--adapter-color': a.color, '--adapter-color-a40': `${a.color}40` } as React.CSSProperties}
            >
              <span className="eyebrow engenie-audience-eyebrow">{a.label}</span>
              <h3 className="engram-card-title engenie-audience-title">{a.tag}</h3>
              <p className="body-text engenie-audience-desc text-body-13 text-muted">{a.desc}</p>
              {a.points.map((p, i) => (
                <div key={i} className="engenie-audience-list-item u-flex u-gap-8 u-items-start">
                  <div className="engenie-audience-bullet" />
                  <span className="supporting-text engenie-audience-text trust-text">{p}</span>
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
        <LineReveal as="h2" className="engram-section-h2" text="Selection That Follows Your Rules" />
        <LineReveal
          as="p"
          className="content-medium engenie-section-lead"
          text="A recommendation is only useful if you are allowed to buy it. Every one enGENIE returns already respects your supplier agreements, your purchasing limits and your engineering standards."
        />
        <ScrollStagger className="grid-3 engram-three-col" step={90}>
          {orgDna.map((o) => (
            <div
              key={o.title}
              className="card engram-card engenie-dna-card"
              style={{ '--adapter-color': o.color, '--adapter-color-a40': `${o.color}40` } as React.CSSProperties}
            >
              <div className="u-flex u-items-center u-gap-8 engenie-dna-header">
                <div className="engenie-dna-bullet" />
                <h3 className="engram-card-title engenie-dna-title">{o.title}</h3>
              </div>
              <p className="body-text engenie-dna-desc text-body-13 text-muted">{o.desc}</p>
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
          className="content-medium engenie-section-lead-sm"
          text="General-purpose chat assistants reason well in the open, but instrument selection needs the same question to return the same cited answer every time. enGENIE structures the work into auditable, repeatable steps."
        />
        <ComparisonTable
          ref={matrixRef}
          wrapClassName="engenie-comparison-card"
          headers={['Phase', 'General-Purpose LLM', 'enGENIE']}
          accentHeaderClassName="engenie-highlight"
          rows={differentiators.map((d): [string, string, string] => [d.phase, d.llm, d.engenie])}
          cellClassNames={['engenie-table-phase', 'engenie-table-llm', 'engenie-table-engenie']}
          getRowRef={(i) => (el) => { rowRefs.current[i] = el; }}
        />
      </section>

      {/* ── OUTCOMES ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <LineReveal as="h2" className="engram-section-h2" text="Specify With Confidence" />
        <LineReveal
          as="p"
          className="content-narrow lead-text engenie-outcomes-lead"
          text="enGENIE standardizes how instruments are selected and cuts the time it takes to write the spec — turning selection into a fast, compliant, explainable workflow for the engineers who specify and the teams who buy."
        />
        <ScrollStagger className="u-flex u-flex-wrap u-gap-10 engram-outcomes-grid" step={50}>
          {outcomes.map((o, i) => (
            <div key={i} className="card label-text engram-outcome-pill">
              <div className="engenie-outcome-bullet" />
              <span>{o}</span>
            </div>
          ))}
        </ScrollStagger>
        <div className="engenie-cta-wrap u-flex u-justify-end">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Request a Demo')}>
            Request a Demo →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EngeniePage;
