// ── Version 2.0 content: demos, workflow, industries, architecture,
//    business impact, trust, security, case studies, resources ──────────

/* §1 — Hero capability keyword chips */
export const heroChips: string[] = [
  'Industrial AI Platform',
  'P&ID Intelligence',
  'SCADA Intelligence',
  'Engineering Knowledge',
  'Local AI',
  'Air-Gapped',
  'On-Premises',
];

/* §2 — "See enX in Action" product demonstrations */
export interface DemoCard {
  id: string;
  product: string;
  color: string;
  title: string;
  kind: 'transform' | 'query' | 'dashboard' | 'decision';
  before?: { label: string; items: string[] };
  after?: { label: string; items: string[] };
  query?: string;
  answer?: { value: string; source: string; revision: string; page: string };
  panels?: { label: string; value: string; tone?: 'ok' | 'warn' | 'crit' }[];
  steps?: { label: string; value: string }[];
  refs?: string[];
}

export const demos: DemoCard[] = [
  {
    id: 'enstudio', product: 'enSTUDIO', color: '#A78BFA', kind: 'transform',
    title: 'A P&ID becomes a structured engineering model',
    before: { label: 'Input — P&ID drawing', items: ['Scanned / vector PDF', 'Symbols & line work', 'Hand annotations'] },
    after: {
      label: 'Output — structured model',
      items: ['331 symbols recognized', '5,945 instrument tags', 'Equipment + nozzles', 'Stream connections', 'LLM-ready YAML / VIDS'],
    },
  },
  {
    id: 'engram', product: 'enGRAM', color: '#FDB022', kind: 'query',
    title: 'Ask in plain English. Get a cited answer.',
    query: 'What is the calibrated range of FT-3045?',
    answer: { value: '0–500 kg/h (4–20 mA)', source: 'Datasheet INST-DS-3045', revision: 'Rev. C', page: 'p. 2, §3.1' },
  },
  {
    id: 'enview', product: 'enVIEW', color: '#2563EB', kind: 'dashboard',
    title: 'Live SCADA — process, alarms and trends',
    panels: [
      { label: 'R-201 Temp', value: '184.2 °C', tone: 'ok' },
      { label: 'FT-3045 Flow', value: '462 kg/h', tone: 'warn' },
      { label: 'PT-201 Press', value: '12.4 barg', tone: 'ok' },
      { label: 'Active alarms', value: '2 unacked', tone: 'crit' },
    ],
  },
  {
    id: 'engenie', product: 'enGENIE', color: '#1B6FD8', kind: 'decision',
    title: 'A specified, cited instrument recommendation',
    steps: [
      { label: 'Recommended', value: 'Coriolis mass flowmeter' },
      { label: 'Fit', value: '94% — service & accuracy match' },
      { label: 'Excluded', value: 'Magnetic — conductivity <5 µS/cm' },
    ],
    refs: ['Lipták §3.7, Table 3.7-2', 'ISA 75.01', 'ASME PTC 19.3'],
  },
  {
    id: 'enable', product: 'enABLE', color: '#10B981', kind: 'decision',
    title: 'Eigenvalue-based stability verdict from one matrix',
    steps: [
      { label: 'Verdict', value: 'Stable — all eigenvalues negative' },
      { label: 'Bottleneck', value: 'HX-301 — slowest mode τ = 4.2 min' },
      { label: 'RGA pairing', value: 'T→TC-101, F→FC-202 (λ₁₁ = 0.87)' },
    ],
    refs: ['dx/dt = M·x + B·u', 'λ = −0.24, −1.18, −3.41'],
  },
  {
    id: 'entie', product: 'enTIE', color: '#06B6D4', kind: 'transform',
    title: 'Disconnected plant systems become one intelligence layer',
    before: { label: 'Siloed sources', items: ['DCS live tags', 'CMMS work orders', 'ERP inventory', 'enGRAM knowledge base'] },
    after: { label: 'Connected output', items: ['Unified plant model', 'Cross-system queries', 'Automated workflows', 'Single source of truth'] },
  },
];

/* §3 — "How Industrial Intelligence Is Built" workflow */
export interface WorkStep {
  icon: string;
  title: string;
  actor: string;
  color: string;
  inLabel: string;
  inputs: string[];
  outLabel: string;
  outputs: string[];
}

export const workSteps: WorkStep[] = [
  {
    icon: 'Upload', title: 'Upload plant information', actor: 'You', color: '#1F5FE0',
    inLabel: 'Inputs', inputs: ['P&IDs', 'Datasheets', 'Procedures', 'Loop drawings', 'Engineering docs'],
    outLabel: 'Ingested', outputs: ['Inside your network', 'No cloud upload'],
  },
  {
    icon: 'FileCode', title: 'enSTUDIO structures information', actor: 'enSTUDIO', color: '#A78BFA',
    inLabel: 'Reads', inputs: ['Drawings', 'Documents'],
    outLabel: 'Produces', outputs: ['Tags', 'Equipment', 'Relationships', 'Metadata'],
  },
  {
    icon: 'Network', title: 'enGRAM & enGENIE build knowledge', actor: 'enGRAM · enGENIE', color: '#FDB022',
    inLabel: 'From', inputs: ['Structured model', 'Standards'],
    outLabel: 'Produces', outputs: ['Searchable intelligence', 'Engineering reasoning', 'Cited decisions'],
  },
  {
    icon: 'MonitorPlay', title: 'enVIEW & enABLE operationalize it', actor: 'enVIEW · enABLE', color: '#10B981',
    inLabel: 'From', inputs: ['Knowledge base', 'Live tags'],
    outLabel: 'Produces', outputs: ['Live operations', 'Plant understanding', 'System behavior analysis'],
  },
];

/* §4 — "Built for Industrial Operations" */
export interface Industry {
  id: string;
  name: string;
  icon: string; // lucide icon name
  img: string; // public/ image path
  desc: string;
  caps: string[];
}

export const industries: Industry[] = [
  { id: 'oilgas', name: 'Oil & Gas', icon: 'Fuel', img: '/Oli & Gas.png', desc: 'Upstream, midstream and downstream asset intelligence from legacy P&IDs to live SCADA.', caps: ['enSTUDIO', 'enVIEW', 'enGRAM'] },
  { id: 'chemical', name: 'Chemical Processing', icon: 'FlaskConical', img: '/Chemical Processing.png', desc: 'Reaction units, control loops and HAZOP support grounded in your own documents.', caps: ['enGRAM', 'enABLE', 'enGENIE'] },
  { id: 'petro', name: 'Petrochemical', icon: 'Atom', img: '/Petrochemical.png', desc: 'Large tag counts and complex topology structured and made searchable fast.', caps: ['enSTUDIO', 'enGRAM', 'enVIEW'] },
  { id: 'pharma', name: 'Pharmaceutical', icon: 'Pill', img: '/Pharmaceutical.png', desc: 'Procedure-grade traceability with every answer cited to a controlled document.', caps: ['enGRAM', 'enGENIE'] },
  { id: 'power', name: 'Power Generation', icon: 'Zap', img: '/Power Generation.png', desc: 'Real-time process visibility and alarm management built for plant operations.', caps: ['enVIEW', 'enABLE'] },
  { id: 'water', name: 'Water Treatment', icon: 'Droplets', img: '/Water Treatment.png', desc: 'Local-first SCADA and instrument engineering for distributed assets.', caps: ['enVIEW', 'enGENIE'] },
  { id: 'mfg', name: 'Manufacturing', icon: 'Factory', img: '/Manufacturing.png', desc: 'Connect existing DCS, MES and ERP without ripping out what already works.', caps: ['enTIE', 'enVIEW'] },
  { id: 'mining', name: 'Mining & Metals', icon: 'Mountain', img: '/Mining & Metals.png', desc: 'Air-gapped deployment for remote sites with no reliable cloud connectivity.', caps: ['enSTUDIO', 'enGRAM', 'enVIEW'] },
];

/* §5 — "One Platform. Multiple Sources." architecture */
export const archSources: string[] = ['P&IDs', 'SCADA', 'Historian', 'ERP', 'MES', 'Procedures', 'Datasheets', 'Loop Drawings'];
export const archCaps: { name: string; color: string }[] = [
  { name: 'enSTUDIO', color: '#A78BFA' },
  { name: 'enGRAM', color: '#FDB022' },
  { name: 'enGENIE', color: '#1B6FD8' },
  { name: 'enVIEW', color: '#2563EB' },
  { name: 'enABLE', color: '#10B981' },
  { name: 'enTIE', color: '#60A5FA' },
];
export const archUsers: { name: string; icon: string }[] = [
  { name: 'Engineers', icon: 'UserCog' },
  { name: 'Operators', icon: 'Activity' },
  { name: 'Managers', icon: 'Users' },
  { name: 'Maintenance', icon: 'Wrench' },
];

/* §7 — "Business Impact" */
export interface Impact {
  stat: string;
  label: string;
  detail: string;
  icon: string;
}

export const impacts: Impact[] = [
  { stat: '90%', label: 'Faster document retrieval', detail: 'Answers in seconds, not hours of searching drawing registers.', icon: 'Search' },
  { stat: '99.3%', label: 'Extraction accuracy', detail: 'Page-level accuracy across 139+ digitized drawings.', icon: 'FileSearch' },
  { stat: '<2 min', label: 'Per-drawing turnaround', detail: 'A full P&ID structured in under two minutes.', icon: 'Clock' },
  { stat: '↓', label: 'Reduced engineering rework', detail: 'Decisions are cited and defensible the first time.', icon: 'TrendingUp' },
  { stat: '↑', label: 'Faster commissioning prep', detail: 'A structured plant model ready before you walk on site.', icon: 'Gauge' },
  { stat: '0', label: 'Knowledge walks out the door', detail: 'Senior expertise captured in the system, not in someone’s head.', icon: 'Award' },
];

/* §6 — "Built by Engineers" trust */
export const founder = {
  name: 'Dr. Jagan Mohan Reddy Yeturu',
  role: 'Founder, enSAR Solutions Inc.',
  background: 'Practicing Instrumentation & Control engineer',
  bio: 'enX was designed by a practicing I&C engineer — grounded in how plant engineers actually think, how engineering documents are actually structured, and what an engineer needs when something goes wrong at 2AM. Not technology demos. Not market research. Real plant work.',
  facts: [
    { k: 'Discipline', v: 'Instrumentation & Control' },
    { k: 'Focus', v: 'Industrial intelligence' },
    { k: 'Company', v: 'enSAR Solutions Inc.' },
    { k: 'Founded', v: '2022 · Toronto, Canada' },
  ],
};

export const standards: { code: string; desc: string }[] = [
  { code: 'ISA-5.1', desc: 'Instrumentation symbols & identification' },
  { code: 'ISA-18.2', desc: 'Alarm management lifecycle' },
  { code: 'ISA-101', desc: 'Human-machine interface design' },
  { code: 'ISA 75.01', desc: 'Control valve sizing' },
  { code: 'ASME PTC 19.3', desc: 'Thermowell design' },
  { code: 'Lipták', desc: 'Instrument Engineers’ Handbook' },
];

export const techStack: { name: string; icon: string }[] = [
  { name: 'Local AI', icon: 'Cpu' },
  { name: 'Ollama', icon: 'Server' },
  { name: 'Apple Silicon', icon: 'HardDrive' },
  { name: 'Air-Gapped', icon: 'WifiOff' },
  { name: 'On-Premises', icon: 'Database' },
];

/* §11 — "Security by Design" */
export const securityPrinciples: { title: string; desc: string; icon: string; img: string }[] = [
  { title: 'Air-gapped deployment', desc: 'Runs with no internet connection at all. Built for sites where the network never leaves the fence line.', icon: 'WifiOff', img: '/Air-gapped deployment.png' },
  { title: 'Local LLMs only', desc: 'Every model runs inside your network via Ollama. No prompts, documents or tags ever sent to a third party.', icon: 'Cpu', img: '/Local LLMs only.png' },
  { title: 'No external API dependency', desc: 'No cloud service to call, expire, rate-limit or breach. Your plant keeps working regardless of the outside world.', icon: 'Server', img: '/No external API dependency.png' },
  { title: 'No cloud requirement', desc: 'There is no enX cloud. Nothing to opt out of, because nothing leaves the building by default.', icon: 'Lock', img: '/No cloud requirement.png' },
  { title: 'Full customer ownership', desc: 'Your data stays yours, in open formats you can read without our software. No lock-in on either side.', icon: 'ShieldCheck', img: '/Full customer ownership.png' },
  { title: 'On-premises operation', desc: 'Deploys to a single VM or Mac inside your perimeter. No vendor inside your security boundary.', icon: 'HardDrive', img: '/On-premises operation.png' },
];

/* §10 — Case studies / use-case scenarios */
export interface CaseStudy {
  id: string;
  tag: string;
  color: string;
  title: string;
  problem: string;
  solution: string;
  result: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'legacy', tag: 'Internal pilot · Brownfield', color: '#A78BFA',
    title: 'Digitizing 30 years of P&IDs',
    problem: 'A brownfield plant held its engineering truth in 139 scanned P&IDs from the 1980s onward — unsearchable, partly hand-annotated, with the original engineers retired.',
    solution: 'enSTUDIO structured every drawing into tags, equipment and connections; enGRAM indexed the result for plain-English search.',
    result: '5,945 tags recovered at 99.3% accuracy in days, not the months a manual re-draw would have taken.',
  },
  {
    id: 'incident', tag: 'Use case · Operations', color: '#FDB022',
    title: 'Answering at 2AM during an upset',
    problem: 'During a process upset an operator needed the isolation procedure and calibrated range for a transmitter — buried across loop drawings and datasheets nobody could find fast.',
    solution: 'enGRAM returned the exact value with the source document, revision and page, grounded entirely in the plant’s own controlled documents.',
    result: 'A query that previously meant a 30-minute drawing hunt now resolves in seconds, with a citation an auditor will accept.',
  },
  {
    id: 'spec', tag: 'Scenario · Engineering', color: '#1B6FD8',
    title: 'Specifying a flowmeter, defensibly',
    problem: 'Selecting a flowmeter for a low-conductivity, high-temperature service meant cross-checking multiple standards by hand — slow and easy to get wrong.',
    solution: 'enGENIE eliminated unsuitable technologies with a cited reason for each exclusion and ranked the survivors against the service conditions.',
    result: 'A specified, cited, HAZOP-defensible recommendation with the Excel and Markdown spec generated on the spot.',
  },
];

/* §9 — Resource center */
export interface Resource {
  type: string;
  title: string;
  desc: string;
  icon: string;
  img: string;
}

export const resources: Resource[] = [
  { type: 'Whitepaper', title: 'Local-First Industrial Intelligence', desc: 'Why plant AI belongs inside your network — and the architecture that makes it possible.', icon: 'FileText', img: '/local first industrial.png' },
  { type: 'Technical Note', title: 'P&ID Extraction Methodology', desc: 'How enSTUDIO reaches 99.3% page accuracy across legacy and vector drawings.', icon: 'FileCode', img: '/P&ID extraction.png' },
  { type: 'Product Brief', title: 'enVIEW SCADA Overview', desc: 'Three synchronized views, ISA-18.2 alarms and a 5-year historian with no database server.', icon: 'MonitorPlay', img: '/enview scada overview.png' },
  { type: 'Architecture Guide', title: 'One Platform, Multiple Sources', desc: 'How enSTUDIO, enGRAM, enGENIE, enVIEW, enABLE and enTIE connect end to end.', icon: 'Workflow', img: '/One Platform,multiple sources.png' },
  { type: 'Deployment Guide', title: 'Air-Gapped Installation', desc: 'Standing up enX on a single on-premises VM with local LLMs and zero cloud calls.', icon: 'Server', img: '/air.png' },
  { type: 'Product Brief', title: 'enGENIE Engineering Vault', desc: 'Cited instrument selection grounded in Lipták, ISA, ISO and ASME.', icon: 'BookOpen', img: '/engenie walt.png' },
];

/* §12 — generic product-page enhancements (Inputs → Processing → Outputs,
   use cases by role, expected outcomes). Keyed by capability id, with a
   safe fallback for any product that lacks a bespoke page. */
export interface ProductExtra {
  flow: { inputs: string[]; processing: string[]; outputs: string[] };
  useCases: { role: string; text: string }[];
  outcomes: string[];
}

export const productExtras: Record<string, ProductExtra> = {
  enable: {
    flow: {
      inputs: ['Flowsheet (draw)', 'YMPL native', 'Stream table .xlsx / .csv', 'Aspen HYSYS (COM)', 'DWSIM'],
      processing: ['Assemble block matrix M', 'Eigenvalues · RGA · condition number', 'Fiedler zoning · eigenvalue sensitivity'],
      outputs: ['Stability & controllability verdict', 'Ranked changes + HAZOP pre-fill', 'Live closed-loop simulation'],
    },
    useCases: [
      { role: 'Engineering', text: 'Screen operability at design time — stability, response speed, loop pairing and bottlenecks, straight from the model.' },
      { role: 'Operations', text: 'Run the same model closed-loop for startup, upsets and operator what-ifs against a virtual plant.' },
      { role: 'Safety / HAZOP', text: 'Start HAZOP from eigenvalue-perturbation rows — a qualified team reviews rather than originates.' },
      { role: 'Management', text: 'Preview a change’s predicted stability impact before it is built (Management of Change).' },
    ],
    outcomes: [
      'Operability issues caught at design time, not at commissioning',
      'Engineers review informed drafts instead of blank sheets',
      'Plant coupling retained as a durable, comparable matrix',
      'Every result labelled computed, predicted or draft — no false certainty',
    ],
  },
  entie: {
    flow: {
      inputs: ['DCS', 'Historian', 'MES', 'ERP'],
      processing: ['Open protocol adapters', 'MCP server exposure', 'Bi-directional mapping'],
      outputs: ['enX ↔ existing systems', 'Plant data to Claude Desktop & AI tools', 'No proprietary lock-in'],
    },
    useCases: [
      { role: 'Engineering', text: 'Reuse enX intelligence inside the systems you already run.' },
      { role: 'Operations', text: 'Surface enX answers without leaving the control room HMI.' },
      { role: 'Maintenance', text: 'Connect work-order and asset data from MES/ERP into enX context.' },
      { role: 'Management', text: 'Adopt incrementally across a mixed installed base — no rip-and-replace.' },
    ],
    outcomes: ['Intelligence built in enX does not stay trapped in enX', 'AI tools query live plant data via MCP', 'No lock-in on either side'],
  },
};
