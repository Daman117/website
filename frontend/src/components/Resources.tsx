import React from 'react';
import { resources } from '../data/v2';
import Icon from './Icon';

interface ResourcesProps {
  onOpenContact: (source?: string) => void;
}

const Resources: React.FC<ResourcesProps> = ({ onOpenContact }) => (
  <section id="resources">
    <div className="section" data-reveal="">
      <span className="eyebrow">Resource center</span>
      <h2 className="display section-title">Resources</h2>
      <p className="section-lead">
        Whitepapers, technical notes, product briefs and deployment guides. Request any resource and we’ll send it over.
      </p>

      <div className="res-grid">
        {resources.map((r) => (
          <button
            key={r.title}
            className="res-card"
            onClick={() => onOpenContact(`Resource: ${r.title}`)}
          >
            <div className="res-icon"><Icon name={r.icon} size={18} strokeWidth={1.8} /></div>
            <span className="res-type">{r.type}</span>
            <h3 className="res-title">{r.title}</h3>
            <p className="res-desc">{r.desc}</p>
            <span className="res-link">Request →</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default Resources;
