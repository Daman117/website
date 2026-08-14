/**
 * The plant-data sources feeding the core.
 *
 * Desktop: a row of six across the top, label above each card.
 * Compact: a 3x2 grid, label moved inside the card to save vertical space.
 * Both come from `layout` — this component holds no coordinates of its own.
 *
 * Deliberately NOT focusable and NOT buttons. There is no page for "P&IDs"
 * to navigate to, so making these tabbable would add six stops to the tab
 * order that do nothing when activated. Their hover highlight only emphasises
 * a connection line that is already drawn and already visible, so no
 * information is hover-only and nothing is withheld from keyboard users.
 */
import React from 'react';
import { du, phaseOf } from './heroData';
import type { HeroInteraction, HeroLayout } from './heroData';
import { SourceIcon } from './HeroIcons';

const HeroSourceCards: React.FC<HeroInteraction & { layout: HeroLayout }> = ({
  layout,
  active,
  onActivate,
  onDeactivate,
}) => (
  <div className="ieh-cards">
    {layout.sources.map((s, i) => (
      <div
        key={s.id}
        className={`ieh-source${active === s.id ? ' is-active' : ''}`}
        style={
          {
            left: du(s.cx - layout.sourceCard.w / 2),
            top: du(s.y),
            width: du(layout.sourceCard.w),
            height: du(layout.sourceCard.h),
            // `--enter` staggers the one-shot entrance; `--phase` places this
            // card in the shared loop. Static values, set once — never
            // touched again, so no re-render drives the animation.
            '--enter': `${0.9 + i * 0.09}s`,
            '--phase': `${phaseOf.source(i)}s`,
          } as React.CSSProperties
        }
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') onActivate(s.id);
        }}
        onPointerLeave={onDeactivate}
      >
        <SourceIcon glyph={s.glyph} className="ieh-source-icon" />
        <span className="ieh-source-label">{s.label}</span>
      </div>
    ))}
  </div>
);

export default HeroSourceCards;
