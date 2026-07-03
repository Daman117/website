import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { setLenisModalOpen } from '../hooks/useLenis';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenContact: (source?: string) => void;
}

const PRODUCTS = [
  { id: 'enview',   name: 'enVIEW' },
  { id: 'engram',   name: 'enGRAM' },
  { id: 'enstudio', name: 'enSTUDIO' },
  { id: 'enable',   name: 'enABLE' },
  { id: 'engenie',  name: 'enGENIE' },
  { id: 'entie',    name: 'enTIE' },
];

const MobileNav: React.FC<MobileNavProps> = ({ open, onClose, onOpenContact }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setLenisModalOpen(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      setLenisModalOpen(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div id="mobile-overlay" className={open ? 'open' : ''} role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button ref={closeRef} className="mobile-nav-close" onClick={onClose} aria-label="Close menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <span className="mobile-nav-heading">Products</span>
      <div className="mobile-nav-products">
        {PRODUCTS.map((p) => (
          <Link key={p.id} to={`/products/${p.id}`} className="mobile-nav-sub" onClick={onClose}>
            {p.name}
          </Link>
        ))}
      </div>

      <Link to="/platform" className="mobile-nav-link" onClick={onClose}>Platform</Link>
      <Link to="/about" className="mobile-nav-link" onClick={onClose}>About Us</Link>

      <button className="btn-primary mobile-cta" onClick={() => { onClose(); onOpenContact('Mobile Nav'); }}>
        Request Demo
      </button>
    </div>
  );
};

export default MobileNav;
