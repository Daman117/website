# Component Inventory — Desktop/Mobile Split

Reference for the responsive rollout (see the plan artifact). One row per
component family; behavior per tier so two sections never solve the same
reflow problem two different ways. Mechanism column says whether the
mobile/desktop difference is CSS-only, or one of the three deliberate JSX
forks (Hero, Demo, ComparisonTable).

| Component | Desktop | Tablet | Mobile | Mechanism |
|---|---|---|---|---|
| **Hero** | Staged 5-delay text reveal, 2 paragraphs, full chip row, side-by-side content over fixed photo | Same as desktop, tighter clamp | Reordered stack: headline → CTA → compact stat row → 1-line summary; single ~600ms fade | JSX fork (`HeroDesktop`/`HeroMobile`, both mounted, CSS `display` toggle) |
| **Navbar** | Inline links + hover mega-dropdown for Products | Same as desktop | Full-screen overlay drawer (`MobileNav`), 2-col product tile grid | Already split — separate components (`Nav.tsx` / `MobileNav.tsx`) |
| **Demo (product walkthrough)** | Sticky scroll-jack: `useScroll` over an N×100vh container, 2-column | Same as desktop | Vertical timeline, one card per demo, `useInView` fade-up, no scroll tracking | JSX fork with a **JS mount gate** (`useMediaQuery`) — the one exception; desktop's `useScroll` subscription must not exist on mobile |
| **Cards (Impact / Security / Case Studies)** | 3-column grid | 2-column | Single column stack | CSS only (shared grid→1-col breakpoint rule) |
| **Cards (Capability Grid / Industries)** | Multi-column grid | 2-column | Horizontal snap carousel (`.carousel-row`) | CSS only |
| **Buttons** | `.btn-primary` / `.btn-outline`, existing tokens | Same | Same, min 44×44px hit area enforced | CSS only (touch-target padding) |
| **Carousel** | N/A (desktop uses grids) | N/A | `.carousel-row` primitive — flex row, scroll-snap, ~85% card width | New shared primitive (Foundation) |
| **Accordion** | Content always expanded (forced via `.accordion-row--force-open`) | Same as desktop | Native `<details>`/`<summary>`, one section open by default | New shared primitive (Foundation); used by Workflow (#5) and Footer (#14) |
| **Footer** | 4-column link grid | 2-column | Brand block open, 3 link columns collapse into accordion rows | CSS + accordion primitive |
| **Tables (ComparisonTable)** | `<table>`, 3 columns | Same as desktop | Card list, one card per row, field labels from `headers` prop | JSX fork (both markups render, CSS `display` toggle — no JS gate, cheap to double-render) |
| **Modal (ContactModal)** | Centered dialog | Same | Full-screen sheet | Not yet audited — confirm during Phase 4 whether current modal CSS already handles this |
| **CTA** | Centered glass panel, page-bottom only | Same as desktop | Panel unchanged + persistent sticky bottom bar (mounted once in `App.tsx`, appears once hero scrolls out) | CSS only for the panel; new component (`StickyMobileCTA`) for the bar, `display:none` ≥768px |

**Legend — mechanism defaults to CSS.** A JSX fork is only used where mobile
content genuinely reorders or the DOM structure changes (Hero, Demo,
ComparisonTable). A JS mount gate (`useMediaQuery`) is reserved for Demo
alone, where the desktop tree carries real runtime cost (a scroll
subscription) that must not exist on mobile — everywhere else, both trees
render and a media query decides which is visible.
