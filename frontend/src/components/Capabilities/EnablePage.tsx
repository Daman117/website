import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Boxes, Gauge, MonitorPlay, PenTool, LayoutGrid, Cpu, FileCheck, Play, FileOutput } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollStagger, LineReveal } from '../ScrollAnimation';
import { prefersReducedMotion } from '../../utils/motion';
import HowItWorksScroll from './HowItWorksScroll';
import NativeApproachScroll from './NativeApproachScroll';
import CapabilityHero from '../Capability/Hero';
import FlashIcon from '../Capability/FlashIcon';
import ComparisonTable from '../Capability/ComparisonTable';

interface EnablePageProps {
  onOpenContact: (source?: string) => void;
}

const ACCENT = '#10B981';

const challenges = [
  { title: 'Experience Is Retiring', desc: 'Senior engineers leave with the plant model held only in their heads.' },
  { title: 'Problems Found Too Late', desc: 'Whether a plant is stable and operable surfaces at dynamic studies or, worse, at commissioning — when changes are expensive.' },
  { title: 'Slow, Uneven Reviews', desc: 'HAZOP, alarm rationalization and control-structure decisions are manual, slow and vary in quality between teams.' },
  { title: 'No Way to Test Changes First', desc: 'A plant change is hard to evaluate before it has already been built.' },
];

const existingSolutions = [
  {
    solution: 'Steady-state simulators',
    limitation: 'Compute a fixed operating point — no transient stability, loop interaction or controllability',
    fix: 'Derives stability and loop interaction directly from the linearized matrix — no separate dynamic model needed',
  },
  {
    solution: 'Dynamic simulators',
    limitation: 'Answer stability only after costly model-building and trial-and-error step tests',
    fix: 'Computes the same verdict analytically at design time, before any step test is run',
  },
  {
    solution: 'RGA / eigenvalues in MATLAB',
    limitation: 'Require exporting a linearized model and a prior dynamic build',
    fix: 'Assembles the linearized matrix live from the drawing — no export step, no prior build',
  },
  {
    solution: 'Tribal knowledge',
    limitation: 'Informal, unverifiable, and lost when experienced engineers leave',
    fix: 'Encodes the judgment as a shared, computable matrix that outlives any one engineer',
  },
];

const capabilities = [
  {
    Icon: Boxes,
    title: 'The Matrix Model',
    subtitle: 'Your Whole Plant as One Mathematical Object',
    desc: 'enABLE encodes the plant the engineer draws as a single block matrix that captures how every part is coupled to every other part.',
    features: [
      'Each unit operation contributes a matrix block',
      'Stream connections inject off-diagonal coupling',
      'Assembled matrix M with input matrix B = the linearized plant',
      '37 unit-operation builders with real physics — reactors, separations, heat transfer, rotating equipment, vessels and valves',
      'The same matrix drives both analysis and live simulation',
    ],
    color: '#10B981',
  },
  {
    Icon: Gauge,
    title: 'Analytical Verdicts',
    subtitle: 'Eigenvalue-Based Judgment, Computed Live — No Step Tests',
    desc: 'From the matrix, enABLE derives the engineering conclusions that conventionally require dynamic runs.',
    features: [
      'Eigenvalues — stability and response speed; a positive real part is an unstable mode',
      'Relative Gain Array — loop-to-valve pairing and interaction, without plant step tests',
      'Condition number — how ill-conditioned and hard to control the plant is',
      'Eigenvalue sensitivity — ranked recommended changes and change-impact previews',
      'Fiedler value — naturally weakly-coupled control zones',
    ],
    color: '#2563EB',
  },
  {
    Icon: MonitorPlay,
    title: 'Analyze → Live Simulation',
    subtitle: 'From a Fast Verdict to a Full Dynamic Test — One Model',
    desc: 'The same plant runs as a closed-loop dynamic simulation, putting the analysis predictions to the test.',
    features: [
      'Verdict-first: stable / marginal / unstable, with margin and slowest-mode time constant',
      'Bottleneck equipment identified',
      'Closed-loop simulation: controllers, operator-style faceplates, trends, alarms, startup sequence',
      'Inject faults and watch how stability and the controls respond',
      'Operator training and what-ifs against a virtual plant, not a real one',
    ],
    color: '#A78BFA',
  },
];

const steps = [
  { icon: PenTool, title: 'Draw or Import', desc: 'Draw the plant as a flowsheet, or import an existing model — YMPL, stream table, HYSYS or DWSIM.' },
  { icon: LayoutGrid, title: 'Assemble M', desc: 'Unit blocks and stream coupling assemble into matrix M (with input matrix B), recomputed live on every build.' },
  { icon: Cpu, title: 'Compute', desc: 'Eigenvalues, RGA, condition number, eigenvalue sensitivity and the Fiedler value — derived analytically.' },
  { icon: FileCheck, title: 'Read the Verdict', desc: 'A plain-language conclusion leads: stable / marginal / unstable, with the bottleneck and ranked changes.' },
  { icon: Play, title: 'Simulate', desc: 'Run the same plant closed-loop to confirm the predictions under realistic, time-varying conditions.' },
  { icon: FileOutput, title: 'Review & Export', desc: 'HAZOP pre-fill, validation report, control narrative and alarm bounds for a qualified team to complete.' },
];

const validationFeatures = [
  'Eigenvalues match the analytic answer to within 1e-10 (two-tank)',
  'Stability verdict: 100% agreement (5 of 5 cases)',
  'RGA loop pairing: 100% on the applicable case',
  'Recommended-change direction: 100% (28 of 28 perturbations)',
  'Change-impact (10% change): worst-case error under 3%',
  '86 test files · roughly 1,990 test functions',
];

const honestyFeatures = [
  'Computed / exact — eigenvalues, RGA, condition number',
  'Predicted — confirm in Simulate — recommended changes, change-impact, range sweep',
  'Draft — requires engineer review — SIMC tuning, control narrative, alarm bounds',
  'Pre-fill, not a substitute — the HAZOP report aids a qualified team',
  'Import basis disclosed — each parameter tagged data-derived or handbook-default',
];

const securityFeatures = [
  "Desktop application — runs on the engineer's own machine",
  'No cloud dependency',
  'Air-gap compatible',
  'Your plant models stay yours, in an open and comparable matrix form',
  'No vendor lock-in',
];

const outcomes = [
  'Judgment earlier in design',
  'Less blank-sheet hazard & control work',
  'Change evaluated before it is made',
  'Plant knowledge retained',
  'Operability issues caught before commissioning',
  'Decision support, not a replacement for review',
];

const heroChips = ['Eigenvalue Analysis', 'Desktop App', 'Air-Gapped', 'Live Simulation'];

const EnablePage: React.FC<EnablePageProps> = ({ onOpenContact }) => {
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
    <main className="engram-page" style={{ '--accent': ACCENT } as React.CSSProperties}>
      {/* ── HERO (pinned parallax background — iOS-safe, see HeroShell) ── */}
      <CapabilityHero
        image="/enable-hero.webp"
        badgeText="PROCESS INTELLIGENCE FOR DESIGN & CONTROL"
        titleLine1="Turn Your Plant Into a"
        titleLine2="Matrix"
        subText="enABLE is a desktop engineering application for process and control engineers. Draw your plant as a flowsheet and it becomes a block-matrix model — dx/dt = M·x + B·u — that yields eigenvalue-based engineering judgment at design time."
        bodyText="From that one matrix, enABLE computes stability, controllability, loop pairing, recommended changes, alarm bounds and a HAZOP pre-fill — then runs the same plant as a live closed-loop dynamic simulation."
        chips={heroChips}
        ctaLabel="Join the Waitlist"
        onCtaClick={() => onOpenContact('Waitlist')}
        classes={{
          content: 'enable-hero-content',
          badge: 'badge-text enable-hero-badge-text',
          title: 'enable-hero-h1-text',
          accent: 'enable-hero-h1-accent',
          subtitle: 'enable-hero-sub-text',
          body: 'enable-hero-body-text',
          chips: 'enable-hero-chips',
          chip: 'enable-hero-chip',
        }}
      />

      {/* ── CHALLENGE ── */}
      <section ref={challengeRef} className="engram-section engram-container">
        <span className="eyebrow">The Challenge</span>
        <LineReveal as="h2" className="engram-section-h2" text="Design Judgment Arrives Too Late" />
        <LineReveal
          as="p"
          className="enable-section-lead"
          text="Whether a plant will be stable, controllable and operable is often only discovered late — when changes are expensive — and the experience needed to judge it is walking out the door."
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
          The knowledge cliff is real: a generation of experienced engineers is retiring with their plant models held only in their heads.
        </p>
      </section>

      {/* ── CAPABILITIES ── */}
      <NativeApproachScroll
        items={capabilities}
        eyebrow="Key Capabilities"
        title="From a Matrix to a Running Plant"
      />

      {/* ── HOW IT WORKS ── */}
      <HowItWorksScroll
        eyebrow="How It Works"
        title="One Model, Two Depths"
        steps={steps}
        accent={ACCENT}
        accentRgb="16,185,129"
        video="/enable-demo.mp4"
      />

      {/* ── VALIDATION + HONESTY + SECURITY ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Trust & Control</span>
        <LineReveal as="h2" className="engram-section-h2" text="Built to Earn Engineering Trust" />
        <LineReveal
          as="p"
          className="enable-section-lead"
          text="Every output is validated, labeled by how much to trust it, and computed entirely inside your own perimeter — the three things engineers check before they rely on a verdict."
        />
        <ScrollStagger className="grid-3 engram-three-col" step={90}>

          {/* Validation */}
          <div className="card engram-card">
            <span className="eyebrow enable-trust-eyebrow">Validation</span>
            <h3 className="engram-card-title">Correctness Enforced by Tests</h3>
            <p className="supporting-text enable-trust-desc">
              These are assertions in the test suite, not marketing numbers.
            </p>
            {validationFeatures.map((f, i) => (
              <div key={i} className="enable-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enable-trust-bullet enable-trust-bullet-accent" />
                <span className="supporting-text enable-trust-text">{f}</span>
              </div>
            ))}
            <p className="note-text enable-trust-note">
              Results hold on the benchmark set — not a claim of accuracy on every plant.
            </p>
          </div>

          {/* Honesty model */}
          <div className="card engram-card">
            <span className="eyebrow enable-trust-eyebrow">The Honesty Model</span>
            <h3 className="engram-card-title">Every Output Is Labeled</h3>
            <p className="supporting-text enable-trust-desc">
              enABLE deliberately labels how much to trust each result.
            </p>
            {honestyFeatures.map((f, i) => (
              <div key={i} className="enable-trust-list-item u-flex u-gap-8 u-items-start">
                <div className="enable-trust-bullet enable-trust-bullet-blue" />
                <span className="supporting-text enable-trust-text">{f}</span>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="card engram-card enable-trust-card">
            <span className="eyebrow enable-trust-eyebrow-accent">Industrial Security</span>
            <h3 className="engram-card-title">Runs Inside Your Perimeter</h3>
            <p className="supporting-text enable-trust-desc">
              No vendor inside your security boundary.
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
        <LineReveal as="h2" className="engram-section-h2" text="Why Conventional Tools Fall Short" />
        <LineReveal
          as="p"
          className="enable-section-lead"
          text="The control-theory techniques are decades old and uncontroversial — but delivering them as automatic, live, design-time outputs from a single matrix is uncommon."
        />
        <ComparisonTable
          ref={matrixRef}
          wrapClassName="enable-comparison-card"
          headers={['Approach', 'Limitation', 'enABLE']}
          accentHeaderClassName="enable-table-th-accent"
          rows={existingSolutions.map((row): [string, string, string] => [row.solution, row.limitation, row.fix])}
          cellClassNames={['enable-table-phase', 'enable-table-limitation', 'enable-table-fix']}
          getRowRef={(i) => (el) => { rowRefs.current[i] = el; }}
        />
        <p className="label-text enable-table-summary">
          enABLE computes eigenvalue stability, RGA pairing, condition number and zoning automatically, at design time, from one block matrix.
        </p>
      </section>

      {/* ── VISION ── */}
      <section className="engram-section engram-container">
        <span className="eyebrow">Outcomes</span>
        <LineReveal as="h2" className="engram-section-h2" text="From Tribal Knowledge to a Shared Engineering Language" />
        <LineReveal
          as="p"
          className="content-narrow lead-text enable-outcomes-lead"
          text="Instead of plant wisdom living as informal stories, it can live as structure in the matrix that a junior engineer, a senior engineer, and a piece of software can all read. The matrix becomes the common ground for design review, for safety analysis, and for passing knowledge from one generation of engineers to the next."
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

export default EnablePage;
