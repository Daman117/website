import type { PipeNode, Pill } from '../types';

export const pipeNodes: PipeNode[] = [
  { cap: 'enSTUDIO', label: 'Drawing Intelligence', sub: 'P&ID → structured data', color: '#4338CA' },
  { cap: 'enGRAM',   label: 'Plant Knowledge',      sub: 'Documents → answers',  color: '#1E40AF' },
  { cap: 'enABLE',   label: 'Process Intelligence', sub: 'Topology → matrix M',  color: '#047857' },
  { cap: 'enVIEW',   label: 'Live SCADA',           sub: 'Tags → live display',  color: '#0369A1' },
  { cap: 'enGENIE',  label: 'Instrument Selection', sub: 'Conditions → spec',    color: '#0F766E' },
  { cap: 'enTIE',    label: 'Connected Intelligence', sub: 'DCS · MES · ERP → enxco', color: '#0E7490' },
];

export const pills: Pill[] = [
  { dot: '#0E7490', name: 'enTIE', desc: 'connects to your existing DCS, MES, ERP', border: 'rgba(96,165,250,0.3)' },
  { dot: '#4338CA', name: 'MCP Server', desc: 'exposes plant data to Claude Desktop & AI tools', border: 'rgba(167,139,250,0.3)' },
];
