import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cap } from '../../../types';

const TickerItem: React.FC<{ cap: Cap }> = ({ cap }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="btn-reset ticker-item"
      onClick={() => navigate(`/products/${cap.id}`)}
      style={{ '--cap-color': cap.color } as React.CSSProperties}
    >
      <span className="ticker-dot" />
      <span className="ticker-name">{cap.name}</span>
      <span className="ticker-cat">{cap.cat}</span>
    </button>
  );
};

export default TickerItem;
