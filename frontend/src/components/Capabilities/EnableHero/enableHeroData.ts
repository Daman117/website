/**
 * The enABLE hero's content: four stages and the panel under each.
 *
 * The hero is a PIPELINE, not a composition — ingest, analyse, insight,
 * action, read left to right — so unlike the enGRAM and enVIEW heroes there
 * is no fixed design canvas and no `--u`. A pipeline is a grid of four equal
 * columns, and CSS grid already does that better than absolute placement
 * would, at every width.
 *
 * Colour carries the STAGE, and each stage's panel inherits it: blue records
 * coming in, magenta while the model is being built, green once there is a
 * verdict, amber where a decision gets made. Every accent in the section is
 * one of these four, and each is set once here as `--c` on the column so the
 * icon, the rule, the panel border and its rows all pick it up without any of
 * them naming a colour.
 */

export type StageId = 'ingest' | 'analyze' | 'insight' | 'action';

export interface Stage {
  id: StageId;
  title: string;
  /** The stage accent, inherited by everything in the column. */
  c: string;
  /** Panel caption. */
  panel: string;
}

export const stages: Stage[] = [
  {
    id: 'ingest',
    title: 'Ingest',
    c: '#077e9b',
    panel: 'Sources',
  },
  {
    id: 'analyze',
    title: 'Analyze',
    c: '#4e7ce2',
    panel: 'Digital Model',
  },
  {
    id: 'insight',
    title: 'Insight',
    c: '#05a271',
    panel: 'Insights',
  },
  {
    id: 'action',
    title: 'Action',
    c: '#b45309',
    panel: 'Outcomes',
  },
];

/** SOURCES — what actually arrives from a plant, named the way an engineer
 *  would name it. Generic "documents" would say nothing. */
export const sources = ['P&ID', 'Datasheets', 'Specs', 'Hist Data'] as const;

export type SourceKind = (typeof sources)[number];

/** INSIGHTS — a verdict per row. The value is the point, so it sits right and
 *  carries the weight; the label recedes. */
export const insights = [
  { id: 'performance', label: 'Performance', value: '92%' },
  { id: 'reliability', label: 'Reliability', value: 'High' },
  { id: 'risks', label: 'Risks', value: 'Low' },
] as const;

/** OUTCOMES — what the engineer does next, as verbs. */
export const outcomes = [
  { id: 'simulate', label: 'Simulate Scenarios' },
  { id: 'validate', label: 'Validate Design' },
  { id: 'optimize', label: 'Optimize Performance' },
  { id: 'report', label: 'Generate Reports' },
] as const;

export type InsightId = (typeof insights)[number]['id'];
export type OutcomeId = (typeof outcomes)[number]['id'];
