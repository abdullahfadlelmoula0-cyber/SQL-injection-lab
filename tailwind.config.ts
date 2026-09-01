import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        portal: {
          navy: '#0f1f3d',
          gold: '#c9a227',
        },
      },
    },
  },
  plugins: [],
};
export default config;
