import React from 'react';
import {
  Fuel, FlaskConical, Atom, Pill, Zap, Droplets, Factory, Mountain,
  UserCog, Activity, Users, Wrench, Search, FileSearch, Clock, TrendingUp,
  Gauge, Award, Cpu, Server, HardDrive, WifiOff, Database, Lock, ShieldCheck,
  FileText, FileCode, MonitorPlay, Workflow, BookOpen,
  Upload, Network,
  type LucideProps,
} from 'lucide-react';

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  Fuel, FlaskConical, Atom, Pill, Zap, Droplets, Factory, Mountain,
  UserCog, Activity, Users, Wrench, Search, FileSearch, Clock, TrendingUp,
  Gauge, Award, Cpu, Server, HardDrive, WifiOff, Database, Lock, ShieldCheck,
  FileText, FileCode, MonitorPlay, Workflow, BookOpen,
  Upload, Network,
};

const Icon: React.FC<{ name: string } & LucideProps> = ({ name, ...props }) => {
  const Cmp = MAP[name];
  return Cmp ? <Cmp {...props} /> : null;
};

export default Icon;
