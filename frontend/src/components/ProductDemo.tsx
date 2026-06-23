import React from 'react';
import { demos, type DemoCard } from '../data/v2';

const ColList: React.FC<{ label: string; items: string[]; color?: string }> = ({ label, items, color }) => (
  <div className="demo-col">
    <div className="demo-col-label">{label}</div>
    <ul className="demo-col-list">
      {items.map((it) => (
        <li key={it}><span style={color ? { color } : undefined}>—</span>{it}</li>
      ))}
    </ul>
  </div>
);

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
      <div className="demo-query">
        <div className="demo-q"><span className="demo-q-icon" style={{ color: d.color }}>?</span>{d.query}</div>
        <div className="demo-a">
          <div className="demo-a-value" style={{ color: d.color }}>{d.answer.value}</div>
          <div className="demo-a-cite">
            <span>{d.answer.source}</span><span>{d.answer.revision}</span><span>{d.answer.page}</span>
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
      <div className="demo-decision">
        {d.steps.map((s) => (
          <div key={s.label} className="demo-dec-row">
            <span className="demo-dec-label">{s.label}</span>
            <span className="demo-dec-value">{s.value}</span>
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

const ProductDemo: React.FC = () => (
  <section id="demo">
    <div className="section" data-reveal="">
      <span className="eyebrow">Product output, not slideware</span>
      <h2 className="display section-title">See enX in Action</h2>
      <p className="section-lead">
        Every capability is shown by what it produces — a structured model, a cited answer, a live screen, a defensible decision.
      </p>
      <div className="demo-grid">
        {demos.map((d) => (
          <div key={d.id} className="demo-card" style={{ '--accent': d.color } as React.CSSProperties}>
            <div className="demo-card-head">
              <span className="demo-card-dot" style={{ background: d.color }} />
              <span className="demo-card-product" style={{ color: d.color }}>{d.product}</span>
              <span className="demo-card-title">{d.title}</span>
            </div>
            <DemoBody d={d} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductDemo;
