import type { Config } from 'tailwindcss';


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        highlight: {
          '0%, 50%': {
            filter: 'drop-shadow(0 0px 10px rgb(0 80 190 / 0.05))',
          },
          '25%, 75%': {
            filter: 'drop-shadow(0px 0px 15px #269EEF)',
          },
        },
        background: {
          '0%': {
            backgroundColor: "yellow"
          },
          '100%': {
            backgroundColor: "blue"
          }
        }
      },
      animation: {
        highlight: 'highlight 1200ms ease-in-out',
        background: 'background 1200ms ease-in-out'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
