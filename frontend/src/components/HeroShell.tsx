import React from 'react';

/**
 * Full-viewport hero with a pinned (parallax-style) background image.
 *
 * Uses the `clip-path: inset(0)` + `position: fixed` technique instead of
 * `background-attachment: fixed`, which mobile Safari/Chrome ignore or render
 * broken. The fixed layer stays pinned to the viewport while the section
 * scrolls over it, and the clip-path confines its painting to the section —
 * visually identical to the old approach, but it works on iOS.
 */
interface HeroShellProps {
  image: string;
  id?: string;
  /** className for the inner content container (e.g. "section" or "engram-hero engram-container") */
  contentClassName?: string;
  children: React.ReactNode;
  /** Rendered inside the section, after the content container (e.g. the landing Ticker) */
  after?: React.ReactNode;
}

const HeroShell: React.FC<HeroShellProps> = ({ image, id, contentClassName, children, after }) => (
  <section id={id} className="hero-shell">
    <div className="hero-shell-bg" style={{ backgroundImage: `url(${image})` }} />
    {/* dark gradient — lighter at top so the photo shows, darker at bottom for text */}
    <div className="hero-shell-grad" />
    <div className={contentClassName} style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(110px, 16vh, 160px)', paddingBottom: 72 }}>
      {children}
    </div>
    {after}
  </section>
);

export default HeroShell;
