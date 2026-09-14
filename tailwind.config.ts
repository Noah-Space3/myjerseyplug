import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0c0f0d',
          soft: '#1c211d',
          muted: '#6b726d',
        },
        paper: {
          DEFAULT: '#ffffff',
          warm: '#fbfbf9',
          2: '#f5f6f3',
          3: '#eceeea',
        },
        line: '#e4e7e2',
        accent: {
          DEFAULT: '#18b35a',
          dark: '#0e8a44',
          ink: '#06351c',
          soft: '#e7f7ee',
        },
        warn: '#b4690e',
        danger: '#c2362f',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2.6rem, 6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['clamp(2rem, 4.5vw, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '700' }],
        h2: ['clamp(1.6rem, 3vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '650' }],
        h3: ['1.25rem', { lineHeight: '1.25', fontWeight: '650' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        label: ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.08em', fontWeight: '600' }],
        price: ['1.125rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '22px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(12,15,13,0.04), 0 8px 24px -12px rgba(12,15,13,0.12)',
        soft: '0 1px 2px rgba(12,15,13,0.05)',
        lift: '0 12px 40px -16px rgba(12,15,13,0.25)',
      },
      maxWidth: {
        shell: '1280px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
