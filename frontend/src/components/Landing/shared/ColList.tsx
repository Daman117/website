import React from 'react';

const ColList: React.FC<{ label: string; items: string[]; color?: string }> = ({ label, items, color }) => (
  <div className="demo-col" style={color ? ({ '--d-color': color } as React.CSSProperties) : undefined}>
    <div className="demo-col-label">{label}</div>
    <ul className="stack demo-col-list">
      {items.map((it) => (
        <li key={it}><span className={color ? 'demo-col-dash accent' : 'demo-col-dash'}>—</span>{it}</li>
      ))}
    </ul>
  </div>
);

export default ColList;
