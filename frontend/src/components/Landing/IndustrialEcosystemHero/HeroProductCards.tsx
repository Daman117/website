/**
 * The six enxco products.
 *
 * Desktop: stacked down the right edge.
 * Compact: full-width rows hanging off the vertical trunk.
 * Positions come from `layout`; all six are present in both.
 *
 * These are the only genuinely actionable cards in the hero, so they are the
 * only ones that become real links — `/products/{id}`, the routes already
 * declared in App.tsx and already used by the Nav dropdown. heroProducts ids
 * match those route ids exactly, so no lookup table is needed.
 *
 * Being anchors also gives keyboard users the interaction for free: focus
 * fires the same highlight hover does, and :focus-visible supplies the ring.
 *
 * `pointerType !== 'touch'` guard: on touch, entering also fires on tap and
 * leaving may never fire, which would strand a card in its active state.
 * Touch users get the navigation, which is the real affordance.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { du, phaseOf } from './heroData';
import type { HeroInteraction, HeroLayout } from './heroData';
import { ProductIcon } from './HeroIcons';

const HeroProductCards: React.FC<HeroInteraction & { layout: HeroLayout }> = ({
  layout,
  active,
  onActivate,
  onDeactivate,
}) => (
  <div className="ieh-cards">
    {layout.products.map((p, i) => (
      <Link
        key={p.id}
        to={`/products/${p.id}`}
        className={`ieh-product${active === p.id ? ' is-active' : ''}`}
        style={
          {
            left: du(layout.productCard.x),
            top: du(p.y),
            width: du(layout.productCard.w),
            height: du(layout.productCard.h),
            '--accent-rgb': p.accentRgb,
            '--enter': `${2.2 + i * 0.1}s`,
            '--phase': `${phaseOf.product(i)}s`,
          } as React.CSSProperties
        }
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') onActivate(p.id);
        }}
        onPointerLeave={onDeactivate}
        onFocus={() => onActivate(p.id)}
        onBlur={onDeactivate}
      >
        <span className="ieh-product-icon">
          <ProductIcon glyph={p.id} />
        </span>
        <span className="ieh-product-text">
          <span className="ieh-product-name">{p.name}</span>
          <span className="ieh-product-desc">
            {p.lines[0]}
            <br />
            {p.lines[1]}
          </span>
        </span>
      </Link>
    ))}
  </div>
);

export default HeroProductCards;
