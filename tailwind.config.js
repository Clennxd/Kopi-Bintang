/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FEF8F6',
        'on-background': '#1D1B1A',
        primary: '#251910',
        'primary-container': '#251910',
        'on-primary-container': '#FFF8F0',
        secondary: '#82541A',
        'secondary-container': '#FEC07B',
        'on-secondary-container': '#794C12',
        'surface-container-low': '#F9F2F0',
        'surface-container-high': '#EDE7E5',
        'surface-container-highest': '#E7E1DF',
        'outline-variant': '#D2C4BD'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
