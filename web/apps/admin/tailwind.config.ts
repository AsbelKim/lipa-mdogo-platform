import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B5E20', // Watu Deep Green
        secondary: '#FF6F00', // Watu Orange
        'watu-blue': '#003DA5', // Deep Professional Blue
        'watu-light': '#F5F5F5', // Light background
        'watu-success': '#4CAF50', // Success green
      },
    },
  },
  plugins: [],
};

export default config;
