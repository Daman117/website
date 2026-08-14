/**
 * The five existing plant systems enxco connects out to.
 *
 * A row of five in both layouts — they are short labels and stay legible
 * even on the compact canvas, so no regrouping is needed.
 *
 * Like the source cards: hover emphasis only, not focusable. There is no
 * "/dcs" page to send anyone to, and the relationship they highlight is
 * already visible in the resting composition.
 */
import React from 'react';
import { du, phaseOf } from './heroData';
import type { HeroInteraction, HeroLayout } from './heroData';
import { SystemIcon } from './HeroIcons';

const HeroSystemCards: React.FC<HeroInteraction & { layout: HeroLayout }> = ({
  layout,
  active,
  onActivate,
  onDeactivate,
}) => (
  <div className="ieh-cards">
    {layout.systems.map((s, i) => (
      <div
        key={s.id}
        className={`ieh-system${active === s.id ? ' is-active' : ''}`}
        style={
          {
            left: du(s.cx - layout.systemCard.w / 2),
            top: du(s.y),
            width: du(layout.systemCard.w),
            height: du(layout.systemCard.h),
            '--enter': `${2.9 + i * 0.08}s`,
            '--phase': `${phaseOf.system(i)}s`,
          } as React.CSSProperties
        }
        onPointerEnter={(e) => {
          if (e.pointerType !== 'touch') onActivate(s.id);
        }}
        onPointerLeave={onDeactivate}
      >
        <SystemIcon glyph={s.id} className="ieh-system-icon" />
        <span className="ieh-system-label">{s.label}</span>
      </div>
    ))}
  </div>
);

export default HeroSystemCards;
