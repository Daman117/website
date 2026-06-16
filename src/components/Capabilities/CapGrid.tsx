import React from 'react';
import { CAPS } from '../../data/caps';
import CapCard from './CapCard';

const CapGrid: React.FC = () => (
  <section id="capabilities">
    <div className="cap-head" data-reveal="">
      <div>
        <span className="eyebrow">Capabilities</span>
        <h2 className="display">Every capability.<br/><span>One platform.</span></h2>
      </div>
    </div>
    <div className="cap-grid">
      {CAPS.map((cap) => (
        <CapCard key={cap.id} cap={cap} />
      ))}
    </div>
  </section>
);

export default CapGrid;
