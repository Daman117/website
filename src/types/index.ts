export interface TabData {
  label: string;
  content: string;
}

export interface SpecData {
  l: string;
  v: string;
}

export interface Cap {
  id: string;
  name: string;
  cat: string;
  tag: string;
  color: string;
  status: string;
  statusBg: string;
  statusBorder: string;
  statusText: string;
  zerod?: boolean;
  airgap?: boolean;
  patent?: boolean;
  body: string;
  body2?: string;
  tabs: TabData[];
  specs?: SpecData[];
  right: 'perf' | 'specs';
}

export interface PipeNode {
  cap: string;
  label: string;
  sub: string;
  color: string;
}

export interface Pill {
  dot: string;
  name: string;
  desc: string;
  border: string;
}

export interface Principle {
  n: string;
  h: string;
  p: string;
}

export type Theme = 'light' | 'dark';
