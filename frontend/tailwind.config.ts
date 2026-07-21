import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

// Tokens intentionally reference the CSS custom properties in
// styles/globals/variables.css so that file stays the single source of
// truth. Tailwind utilities (bg-primary, text-t3, rounded-xl, …) resolve to
// exactly the same values the hand-written CSS already uses — so a migrated
// component is pixel-identical to the old one.
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Default screens are min-width and line up with the plan's tiers:
  //   (unprefixed) = mobile <768 · md: = tablet 768+ · lg: = laptop 1024+ · xl: = desktop 1280+
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        't1': 'var(--t1)',
        't2': 'var(--t2)',
        't3': 'var(--t3)',
        't4': 'var(--t4)',
        't5': 'var(--t5)',
        navy: 'var(--navy)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        teal: 'var(--teal)',
        green: 'var(--green)',
        red: 'var(--red)',
        warn: 'var(--warn)',
        orange: 'var(--orange)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        'card-bg': 'var(--card-bg)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"DM Sans"', 'sans-serif'],
        sans: ['"DM Sans"', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      },
      boxShadow: {
        'elev-1': 'var(--elev-1)',
        'elev-2': 'var(--elev-2)',
        'elev-3': 'var(--elev-3)',
        card: 'var(--card-shadow)',
        'card-hover': 'var(--card-shadow-hover)',
      },
      spacing: {
        gutter: 'var(--gutter)',
      },
      maxWidth: {
        'content-sm': 'var(--content-width-sm)',
        'content-md': 'var(--content-width-md)',
        'content-lg': 'var(--content-width-lg)',
        'content-xl': 'var(--content-width-xl)',
      },
    },
  },
  // Preflight (Tailwind's own reset) is OFF during the migration so it can't
  // fight the existing styles/globals/reset.css and break the live site.
  // Re-enable it once all hand-written CSS is gone.
  corePlugins: {
    preflight: false,
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
