import React from 'react';
import StatCell from './shared/StatCell';

// ─────────────────────────────────────────────────────────────────
// ── SECTION 3: STATS
// ─────────────────────────────────────────────────────────────────
const Stats: React.FC = () => (
  <div id="stats">
    <div className="stats-grid">
      <StatCell target={139}  label="P&ID drawings digitized" />
      <StatCell target={5945} label="Equipment & instruments" />
      <StatCell target={99.3} decimals={1} suffix="%" label="Extraction accuracy" />
      <StatCell target={0}    isStatic staticVal="<2s" label="SCADA startup time" />
    </div>
  </div>
);

export default Stats;
