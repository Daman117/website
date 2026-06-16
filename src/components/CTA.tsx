import React from 'react';

interface CTAProps {
  onOpenContact: (source?: string) => void;
}

const CTA: React.FC<CTAProps> = ({ onOpenContact }) => (
  <section id="cta">
    <div className="cta-glow"></div>
    <div className="cta-panel" data-reveal="">
      <span className="eyebrow">Start here</span>
      <h2 className="cta-h">Your plant.<br/>Your documents.<br/>90 days.</h2>
      <p className="cta-p">No vendor inside your network. No data leaving your plant. At 90 days you'll know exactly what changed.</p>
      <div className="cta-btns">
        <button className="btn-primary" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot →</button>
        <button className="btn-outline" onClick={() => window.open('enx-overview.pdf', '_blank')}>Download One-Page Overview</button>
      </div>
    </div>
  </section>
);

export default CTA;
