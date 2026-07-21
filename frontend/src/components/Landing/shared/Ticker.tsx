import React from 'react';
import { CAPS } from '../../../data/caps';
import TickerItem from './TickerItem';

const TickerItems: React.FC = () => (
  <>
    {CAPS.map((c) => <TickerItem key={c.id} cap={c} />)}
  </>
);

const Ticker: React.FC<{ visible: boolean }> = ({ visible }) => (
  <div className={`ticker-wrap${visible ? ' ticker-wrap-visible' : ''}`}>
    <div className="ticker-track">
      <div className="ticker-inner">
        <div className="ticker-half"><TickerItems /></div>
        <div className="ticker-half"><TickerItems /></div>
      </div>
    </div>
  </div>
);

export default Ticker;
