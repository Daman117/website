import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cap } from '../../types';

interface CapCardProps {
  cap: Cap;
}

const CapCard: React.FC<CapCardProps> = ({ cap }) => {
  const navigate = useNavigate();
  const go = () => navigate(`/products/${cap.id}`);

  return (
    <div
      className="cap-card"
      style={{ '--accent': cap.color } as React.CSSProperties}
      onClick={go}
    >
      <div className="cap-card-top">
        <div className="cap-card-name-row">
          <div className="cap-card-dot" style={{ background: cap.color }}></div>
          <span className="cap-card-name">{cap.name}</span>
        </div>
        <span
          className="badge"
          style={{
            color: cap.color,
            background: `${cap.color}18`,
            borderColor: `${cap.color}55`,
          }}
        >
          {cap.status}
        </span>
      </div>
      <div className="cap-card-cat">{cap.cat}</div>
      <div className="cap-card-tag">{cap.tag}</div>
      <button
        className="cap-card-btn"
        onClick={(e) => { e.stopPropagation(); go(); }}
        style={{ background: `linear-gradient(135deg,${cap.color} 0%,var(--navy) 130%)` }}
      >
        View Details →
      </button>
    </div>
  );
};

export default CapCard;
