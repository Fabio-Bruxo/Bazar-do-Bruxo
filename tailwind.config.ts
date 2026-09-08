import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bazar: {
          charcoal: '#121113',
          'charcoal-light': '#1A181B',
          'charcoal-border': '#28252A',
          wine: '#4A1224',
          'wine-light': '#6B1D38',
          'wine-deep': '#320C18',
          purple: '#2D1B36',
          'purple-light': '#3E244A',
          moss: '#232F24',
          'moss-light': '#2E3E30',
          'moss-accent': '#3F5542',
          wood: '#2B1E16',
          'wood-light': '#3D2C22',
          parchment: '#F5EFEB',
          'parchment-dim': '#EAE2D8',
          'parchment-border': '#D8CEBF',
          gold: '#C5A869',
          'gold-light': '#E5C378',
          'gold-dark': '#9E8047',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'mystic': '0 8px 30px rgba(0, 0, 0, 0.45)',
        'mystic-gold': '0 0 25px rgba(197, 168, 105, 0.25)',
        'mystic-wine': '0 0 25px rgba(107, 29, 56, 0.3)',
      },
      backgroundImage: {
        'parchment-texture': "radial-gradient(ellipse at top, rgba(197, 168, 105, 0.08), transparent 70%), radial-gradient(ellipse at bottom, rgba(74, 18, 36, 0.12), transparent 70%)",
      }
    },
  },
  plugins: [],
};

export default config;
