import React, { useLayoutEffect, useRef } from 'react';
import { Workflow, ShieldCheck, Cpu, PlugZap, Boxes, FileCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';
import EntieHero from './EntieHero/EntieHero';
import FlashIcon from '../Capability/FlashIcon';
import ComparisonTable from '../Capability/ComparisonTable';

interface EntiePageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#60A5FA';

const challenges = [
  { title: 'Systems That Do Not Talk', desc: 'Your DCS, historian, MES and ERP each hold part of the picture, and none of them can see the others.' },
  { title: 'A Connector for Every Pair', desc: 'Joining systems one pair at a time means more custom connectors every year, and every one of them can break.' },
  { title: 'No Safe Way in for AI Tools', desc: 'Reaching live plant data means building a one-off export first, so most teams never get started.' },
  { title: 'Every Option Means Ripping It Out', desc: 'If connecting things looks like replacing them, the project gets postponed — usually forever.' },
];

const existingSolutions = [
  {
    solution: 'Custom connector for each pair',
    limitation: 'One connector for every pair of systems — cost and things that can break grow with each system added',
    fix: 'One adapter per system, reused by every enxco product — the count stops growing',
  },
  {
    solution: 'General-purpose middleware',
    limitation: 'Built for office software, not DCS and historian protocols — needs heavy rework for plant-floor systems',
    fix: 'Adapters built for DCS, historian, MES and ERP from the start',
  },
  {
    solution: 'Manual exports and spreadsheets',
    limitation: 'Out of date by the time anyone reads it, with no record of where it came from',
    fix: 'A live read-only connection, with a log of every request per adapter',
  },
  {
    solution: 'Replacing SCADA or the historian',
    limitation: 'Expensive, risky, and production stops while you switch over',
    fix: 'Runs alongside your existing DCS and SCADA — nothing gets switched off',
  },
];

const capabilities = [
  {
    Icon: Boxes,
    title: 'Open Adapters',
    subtitle: 'Connects Without Replacing Anything',
    desc: 'Each system you already run — DCS, historian, MES, ERP — gets its own adapter. enTIE sits alongside your installed base, not underneath it.',
    features: [
      'Open protocol adapters — no proprietary formats',
      'One adapter per system, not one per system pair',
      'enTIE never becomes a new system of record',
      'Runs alongside legacy DCS/SCADA during the transition',
      'No lock-in on either side',
    ],
    color: '#60A5FA',
  },
  {
    Icon: ShieldCheck,
    title: 'Safe · Secure · Grows With You',
    subtitle: 'Built to Plant-Floor Rules',
    desc: 'The three things that decide whether a connection is allowed near a running plant, applied to how enTIE reaches your systems.',
    features: [
      'Safe — enTIE only reads. It shows your data, it never writes back over your systems',
      'Secure — every connection is encrypted, and every adapter keeps a log you can audit',
      'Grows with you — add one adapter at a time, from a single line up to several plants',
      'Designed to plant-floor rules from the start, not added afterwards',
    ],
    color: '#2563EB',
  },
  {
    Icon: Cpu,
    title: 'AI-Ready via MCP',
    subtitle: 'The Same Data, Now Queryable by AI',
    desc: "enTIE exposes connected plant data through an MCP server, so the intelligence built in enxco doesn't stay trapped in enxco.",
    features: [
      'MCP server for Claude Desktop and other AI tools',
      'No separate export pipeline to keep in sync',
      'Read-only exposure protects systems of record',
      'Same adapters power enxco and AI tooling',
    ],
    color: '#A78BFA',
  },
];

const steps = [
  { icon: PlugZap, title: 'Pick a System', desc: 'Start with the system that hurts most — historian is the common starting point.' },
  { icon: Workflow, title: 'Turn On the Adapter', desc: 'An open protocol adapter connects read-only, alongside the DCS/SCADA already running.' },
  { icon: ShieldCheck, title: 'Encrypt & Audit', desc: 'Data moves encrypted in transit; every connection is logged per adapter.' },
  { icon: Boxes, title: 'Expose to enxco', desc: 'Connected data becomes available to enVIEW, enGENIE, enABLE and the rest of enxco.' },
  { icon: Cpu, title: 'Expose to AI Tools', desc: 'The same data reaches Claude Desktop and other AI tools through the MCP server.' },
  { icon: FileCheck, title: 'Add the Next Adapter', desc: "MES and ERP connect the same way, whenever you're ready — no forced timeline." },
];

const standardsFeatures = [
  'Open protocol adapters — no proprietary formats',
  'Designed with defense-in-depth principles from the first adapter',
  'Alignment with the protocols your DCS and historian vendors already expect',
  'Auditable connection log per adapter',
];

const statusFeatures = [
  'Roadmap — enTIE is not yet generally available',
  'Architecture above reflects current design intent, not a shipped guarantee',
  'No proprietary lock-in, a principle honoured from the first adapter shipped',
  "Tell us which system — DCS, historian, MES or ERP — you'd connect first",
];

const securityFeatures = [
  'Read-scoped adapters — enTIE exposes data, it never overwrites systems of record',
  'Encrypted data in transit on every connection',
  'No new system of record introduced',
  'Your DCS, historian, MES and ERP stay the authority they already are',
];

const outcomes = [
  'No more point-to-point integration sprawl',
  'AI tools query live plant data via MCP',
  'Adopt one system at a time',
  'No proprietary lock-in on either side',
  "Intelligence built in enxco doesn't stay trapped in enxco",
  'Lower total cost of ownership than a forklift integration project',
];

const heroChips = ['Open Protocols', 'MCP Server', 'Zero Lock-in', 'Roadmap'];

const EntiePage: React.FC<EntiePageProps> = ({ onOpenContact }) => {
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
  React.useEffect(() => {
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
    <main className="engram-page" style={{ '--accent': ACCENT } as React.CSSProperties}>
      {/* ── HERO — own shell (EntieHero/), no photographic background. The
             right side is held empty for the composition. Content props
             mirror the old shared CapabilityHero call. ── */}
      <EntieHero
        badgeText="CONNECTED INTELLIGENCE"
        titleLine1="One Connected Layer for"
        titleLine2="Every System You Run"
        subText="enTIE connects enxco capabilities to the plant systems you already run — DCS, historian, MES, ERP — and exposes the same data to Claude Desktop and other AI tools via an MCP server."
        bodyText="Built as an integration layer, not a migration project: open protocol adapters sit alongside your installed base, so adoption is incremental, standards-aligned, and reversible at every step."
        chips={heroChips}
        ctaLabel="Join the Waitlist"
        onCtaClick={() => onOpenContact('Waitlist')}
      />

      {/* ── CHALLENGE ── */}
      <section ref={challengeRef} className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <LineReveal as="h2" className="engram-section-h2" text="Plant Intelligence Stays Trapped Where It's Built" />
        <LineReveal
          as="p"
          className="enable-section-lead"
          text="The systems that hold your plant's data — DCS, historian, MES, ERP — rarely talk to each other, and every new integration looks like a project big enough to avoid starting."
        />
        <ScrollStagger className="engram-quad enable-five-col engram-challenge-grid" step={70}>
          {challenges.map((c, i) => (
            <div key={c.title} className="card engram-card">
              <FlashIcon inView={challengeInView} index={i} className="enable-challenge-icon" />
              <h3 className="engram-card-title engram-card-h3">{c.title}</h3>
              <p className="supporting-text-loose enable-card-text">{c.desc}</p>
            </div>
          ))}
        </ScrollStagger>
        <p className="note-text enable-challenge-note">
          Most plants end up with a patchwork of one-off connectors instead of one way in — because the alternative looks like tearing everything out.
        </p>
      </section>

      {/* ── CAPABILITIES ── */}
      <NativeApproachScroll
        items={capabilities}
        eyebrow="Key Capabilities"
        title="One Layer, Every Connected System"
      />

      {/* ── HOW IT WORKS ── */}
      <HowItWorksScroll
        eyebrow="How It Works"
        title="One Adapter at a Time"
        steps={steps}
        accent={ACCENT}
        accentRgb="96,165,250"
      />

      {/* ── STANDARDS + STATUS + SECURITY ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Trust &amp; Control</span>
        <LineReveal as="h2" className="engram-section-h2" text="Built to Earn Plant-Floor Trust" />
        <LineReveal
          as="p"
          className="enable-section-lead"
          text="What enTIE connects to, how honestly it describes its own status, and what it will never do to your systems of record — the three things engineers check before they wire anything in."
        />
        <ScrollStagger className="grid-3 engram-three-col" step={90}>

          <div className="card engram-card">
            <span className="eyebrow enable-trust-eyebrow">Standards</span>
            <h3 className="engram-card-title">Built to Plant-Floor Standards</h3>
            <p className="supporting-text enable-trust-desc">
              Connectivity principles borrowed from industrial framework design, not improvised.
            </p>
            {standardsFeatures.map((f, i) => (
              <div key={i} className="enable-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enable-trust-bullet enable-trust-bullet-accent" />
                <span className="supporting-text enable-trust-text">{f}</span>
              </div>
            ))}
          </div>

          <div className="card engram-card">
            <span className="eyebrow enable-trust-eyebrow">Honest Status</span>
            <h3 className="engram-card-title">Where enTIE Stands Today</h3>
            <p className="supporting-text enable-trust-desc">
              enTIE is labeled by what it is today, not what it will eventually be.
            </p>
            {statusFeatures.map((f, i) => (
              <div key={i} className="enable-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enable-trust-bullet enable-trust-bullet-blue" />
                <span className="supporting-text enable-trust-text">{f}</span>
              </div>
            ))}
          </div>

          <div className="card engram-card entie-trust-card">
            <span className="eyebrow enable-trust-eyebrow-accent">Security</span>
            <h3 className="engram-card-title">Runs Alongside Your Perimeter</h3>
            <p className="supporting-text enable-trust-desc">
              No new authority inside your security boundary.
            </p>
            {securityFeatures.map((f, i) => (
              <div key={i} className="enable-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enable-trust-bullet enable-trust-bullet-accent" />
                <span className="supporting-text enable-trust-text">{f}</span>
              </div>
            ))}
          </div>
        </ScrollStagger>
      </section>

      {/* ── THE DIFFERENCE ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">The Difference</span>
        <LineReveal as="h2" className="engram-section-h2" text="Why Conventional Integration Falls Short" />
        <LineReveal
          as="p"
          className="enable-section-lead"
          text="Connecting plant systems isn't a new problem — but delivering it as reusable, standards-aligned adapters instead of one-off projects is uncommon."
        />
        <ComparisonTable
          ref={matrixRef}
          wrapClassName="enable-comparison-card"
          headers={['Approach', 'Limitation', 'enTIE']}
          accentHeaderClassName="enable-table-th-accent"
          rows={existingSolutions.map((row): [string, string, string] => [row.solution, row.limitation, row.fix])}
          cellClassNames={['enable-table-phase', 'enable-table-limitation', 'enable-table-fix']}
          getRowRef={(i) => (el) => { rowRefs.current[i] = el; }}
        />
        <p className="label-text enable-table-summary">
          enTIE uses one adapter per system instead of a custom connector for every pair — and never becomes another system you have to maintain.
        </p>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <LineReveal as="h2" className="engram-section-h2" text="From Siloed Systems to One Connected Plant" />
        <LineReveal
          as="p"
          className="content-narrow lead-text enable-outcomes-lead"
          text="Instead of DCS, historian, MES and ERP staying islands that only a custom integration project can bridge, enTIE makes them one connected layer — open enough that no side is locked in, and honest enough to say plainly what's shipped today and what's still ahead."
        />
        <ScrollStagger className="u-flex u-flex-wrap u-gap-10 engram-outcomes-grid" step={50}>
          {outcomes.map((o, i) => (
            <div key={i} className="card label-text engram-outcome-pill">
              <div className="enable-outcome-bullet" />
              <span>{o}</span>
            </div>
          ))}
        </ScrollStagger>
        <div className="enable-cta-wrap u-flex u-justify-end">
          <button className="cta-solid button-text btn-primary" onClick={() => onOpenContact('Waitlist')}>
            Join the Waitlist →
          </button>
        </div>
      </section>

    </main>
  );
};

export default EntiePage;
