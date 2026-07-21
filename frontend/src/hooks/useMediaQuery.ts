import { useState, useEffect } from 'react';

// Mirrors the --bp-* tokens in styles/globals/variables.css.
export const MOBILE_QUERY = '(max-width: 767px)';
export const TABLET_QUERY = '(min-width: 768px) and (max-width: 1023px)';
export const DESKTOP_QUERY = '(min-width: 1280px)';

// Reserved for the rare case where a subtree must not mount on the other
// side of a breakpoint at all (e.g. a scroll-jacked section's useScroll
// subscription) — not for choosing which markup to *show*, which is CSS's
// job via a plain media query on two always-rendered trees.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
