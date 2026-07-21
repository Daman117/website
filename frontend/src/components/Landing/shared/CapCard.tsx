import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cap } from '../../../types';

const CapCard: React.FC<{ cap: Cap }> = ({ cap }) => {
  const navigate = useNavigate();
  const go = () => navigate(`/products/${cap.id}`);
  return (
    <div
      className="card cap-card"
      style={{
        '--accent': cap.color,
        '--accent-a18': `${cap.color}18`,
        '--accent-a55': `${cap.color}55`,
      } as React.CSSProperties}
      onClick={go}
      role="link"
      tabIndex={0}
      aria-label={`${cap.name} — view details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      }}
    >
      <div className="cap-card-top">
        <div className="u-flex u-items-center u-gap-8 cap-card-name-row">
          <span className="cap-card-name">{cap.name}</span>
        </div>
        <span className="badge cap-card-status-badge">
          {cap.status}
        </span>
      </div>
      <div className="cap-card-cat">{cap.cat}</div>
      <div className="cap-card-tag">{cap.tag}</div>
      <button
        className="cap-card-btn"
        onClick={(e) => { e.stopPropagation(); go(); }}
      >
        View Details →
      </button>
    </div>
  );
};

export default CapCard;
