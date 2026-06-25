import React from 'react';
import ScrollAnimation from './ScrollAnimation';

interface CTAProps {
  onOpenContact: (source?: string) => void;
}

const CTA: React.FC<CTAProps> = ({ onOpenContact }) => (
  <section id="cta">
    <div className="cta-glow" />
    <ScrollAnimation threshold={0.2}>
      <div className="cta-panel">
        <span className="eyebrow">Start here</span>
        <h2 className="cta-h">Your plant.<br />Your documents.<br />90 days.</h2>
        <p className="cta-p">No vendor inside your network. No data leaving your plant. At 90 days you'll know exactly what changed.</p>
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => onOpenContact('Book a Demo')}>Book a Demo →</button>
          <button className="btn-outline" onClick={() => onOpenContact('Request a Pilot')}>Request a Pilot</button>
        </div>
        <div className="cta-paths">
          <button className="cta-path" onClick={() => onOpenContact('Talk to Engineering Team')}>Talk to Engineering Team</button>
          <span className="cta-path-sep" aria-hidden="true">·</span>
          <button className="cta-path" onClick={() => window.open('enx-overview.pdf', '_blank')}>Download Technical Overview</button>
          <span className="cta-path-sep" aria-hidden="true">·</span>
          <button className="cta-path" onClick={() => onOpenContact('Waitlist')}>Join Waitlist</button>
        </div>
      </div>
    </ScrollAnimation>
  </section>
);

export default CTA;
