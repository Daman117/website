import React from 'react';
import { CAPS } from '../data/caps';

const TickerItems: React.FC = () => (
  <>
    {CAPS.map((c) => (
      <span key={c.id} className="ticker-item">
        <span className="ticker-dot" style={{ background: c.color }}></span>
        <span className="ticker-name">{c.name}</span>
        <span className="ticker-cat">{c.cat}</span>
      </span>
    ))}
  </>
);

const Ticker: React.FC = () => (
  <div className="ticker-wrap">
    <div className="ticker-inner">
      <div className="ticker-half">
        <TickerItems />
      </div>
      <div className="ticker-half">
        <TickerItems />
      </div>
    </div>
  </div>
);

export default Ticker;
