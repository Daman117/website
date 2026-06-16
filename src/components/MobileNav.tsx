import React from 'react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  onOpenContact: (source?: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ open, onClose, onOpenContact }) => {
  const handleLink = () => {
    onClose();
  };

  return (
    <div id="mobile-overlay" className={open ? 'open' : ''} role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button className="mobile-nav-close" onClick={onClose} aria-label="Close menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <a href="#capabilities" className="mobile-nav-link" onClick={handleLink}>Capabilities</a>
      <a href="#platform" className="mobile-nav-link" onClick={handleLink}>Platform</a>
      <a href="#principles" className="mobile-nav-link" onClick={handleLink}>Principles</a>
      <a href="#company" className="mobile-nav-link" onClick={handleLink}>About Us</a>
      <button className="btn-primary mobile-cta" onClick={() => { onClose(); onOpenContact(); }}>
        Request Demo
      </button>
    </div>
  );
};

export default MobileNav;
