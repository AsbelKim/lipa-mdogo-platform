import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A39E', // Watu Teal
        secondary: '#FF6B35', // Watu Orange
        'watu-light': '#A8D8D8', // Light Teal background
        'watu-dark': '#1F1F1F', // Dark Text
        'watu-bg': '#F0F8F7', // Very light teal background
        'watu-border': '#16A39E', // Teal borders
      },
    },
  },
  plugins: [],
};

export default config;
