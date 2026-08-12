import type { Principle } from '../types';

export const facts = [
  { k: 'Founded', v: '2022' },
  { k: 'Headquarters', v: 'Toronto, Canada' },
  { k: 'Focus', v: 'Industrial intelligence' },
  { k: 'Deployment', v: 'Local-first, air-gapped ready' },
  { k: 'AI approach', v: 'On-premises LLM only' },
  { k: 'Data policy', v: 'Your data never leaves your network' },
];

export const principles: Principle[] = [
  {
    n: '01',
    h: 'Local first. Always.',
    p: 'Every capability runs inside your network. No cloud dependency, no data egress, no vendor inside your security perimeter. Air-gap ready where required.',
  },
  {
    n: '02',
    h: 'Cite everything.',
    p: 'Every answer, every selection, every exclusion is traced to a specific source — document, revision, page, standard, clause. Not summaries. Citations.',
  },
  {
    n: '03',
    h: 'Open, not locked.',
    p: 'Standard protocols. Standard formats. Documented outputs. Your data stays yours — in formats you can read without our software. No proprietary lock-in.',
  },
  {
    n: '04',
    h: 'Built by engineers.',
    p: 'enxco was designed by a practicing I&C engineer, grounded in the real-world constraints of plant work — not in technology demos or market research.',
  },
];
