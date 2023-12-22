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
        rainbowBackGroundColor: {
          '0%': {
            backgroundColor: 'red',
          },
          '10%': {
            backgroundColor: 'orange',
          },
          '20%': {
            backgroundColor: 'yellow',
          },
          '30%': {
            backgroundColor: 'green',
          },
          '40%': {
            backgroundColor: 'blue',
          },
          '50%': {
            backgroundColor: 'indigo',
          },
          '60%': {
            backgroundColor: 'violet',
          },
          '70%': {
            backgroundColor: 'black',
          },
        },
        width: {
          '0%': {
            width: '0px',
          },
          '100%': {
            width: '100%',
          },
        },
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
            backgroundColor: 'yellow',
          },
          '100%': {
            backgroundColor: 'blue',
          },
        },
      },
      animation: {
        highlight: 'highlight 1200ms ease-in-out',
        rainbowBackGroundColor: 'rainbowBackGroundColor 1000ms',
        background: 'background 1200ms ease-in-out',
        width: 'width 1200ms',
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
