import React from 'react';
import type { DemoCard } from '../../../data/v2';
import ColList from './ColList';

const DemoBody: React.FC<{ d: DemoCard }> = ({ d }) => {
  if (d.kind === 'transform' && d.before && d.after) {
    return (
      <div className="demo-ba">
        <ColList label={d.before.label} items={d.before.items} />
        <div className="demo-arrow" aria-hidden="true">→</div>
        <ColList label={d.after.label} items={d.after.items} color={d.color} />
      </div>
    );
  }
  if (d.kind === 'query' && d.query && d.answer) {
    return (
      <div className="u-flex-column u-gap-12 demo-query" style={{ '--d-color': d.color } as React.CSSProperties}>
        <div className="demo-q">
          <span className="demo-q-icon">?</span>
          {d.query}
        </div>
        <div className="demo-a">
          <div className="demo-a-value">{d.answer.value}</div>
          <div className="u-flex u-flex-wrap u-gap-8 demo-a-cite">
            <span>{d.answer.source}</span>
            <span>{d.answer.revision}</span>
            <span>{d.answer.page}</span>
          </div>
        </div>
      </div>
    );
  }
  if (d.kind === 'dashboard' && d.panels) {
    return (
      <div className="demo-dash">
        {d.panels.map((p) => (
          <div key={p.label} className={`demo-tile demo-tone-${p.tone || 'ok'}`}>
            <div className="demo-tile-label">{p.label}</div>
            <div className="demo-tile-value">{p.value}</div>
          </div>
        ))}
      </div>
    );
  }
  if (d.kind === 'decision' && d.steps) {
    return (
      <div className="u-flex-column u-gap-8 demo-decision">
        {d.steps.map((s) => (
          <div key={s.label} className="demo-dec-row">
            <span className="demo-dec-label">{s.label}</span>
            <span className="label-text demo-dec-value">{s.value}</span>
          </div>
        ))}
        <div className="demo-refs">
          {d.refs?.map((r) => <span key={r} className="demo-ref">{r}</span>)}
        </div>
      </div>
    );
  }
  return null;
};

export default DemoBody;
