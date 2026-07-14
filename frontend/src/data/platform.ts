import type { PipeNode, Pill } from '../types';

export const pipeNodes: PipeNode[] = [
  { cap: 'enSTUDIO', label: 'Drawing Intelligence', sub: 'P&ID → structured data', color: '#A78BFA' },
  { cap: 'enGRAM',   label: 'Plant Knowledge',      sub: 'Documents → answers',  color: '#FDB022' },
  { cap: 'enABLE',   label: 'Structural Model',     sub: 'Topology → matrix M',  color: '#10B981' },
  { cap: 'enVIEW',   label: 'Live SCADA',           sub: 'Tags → live display',  color: '#2563EB' },
  { cap: 'enGENIE',  label: 'Engineering Vault',    sub: 'Conditions → spec',    color: '#1B6FD8' },
  { cap: 'enTIE',    label: 'Connected Intelligence', sub: 'DCS · MES · ERP → enxnod', color: '#60A5FA' },
];

export const pills: Pill[] = [
  { dot: '#60A5FA', name: 'enTIE', desc: 'connects to your existing DCS, MES, ERP', border: 'rgba(96,165,250,0.3)' },
  { dot: '#A78BFA', name: 'MCP Server', desc: 'exposes plant data to Claude Desktop & AI tools', border: 'rgba(167,139,250,0.3)' },
];
