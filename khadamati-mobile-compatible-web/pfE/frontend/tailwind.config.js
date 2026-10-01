/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Entraide Nationale — vert institutionnel
        primary: {
          50:  '#e6f2ec',
          100: '#c0dece',
          200: '#96c8ad',
          300: '#6cb28c',
          400: '#4da174',
          500: '#2e905c',
          600: '#006233', // vert principal EN
          700: '#005229',
          800: '#00421f',
          900: '#003215',
        },
        // Rouge Maroc
        danger: {
          50:  '#fdecea',
          100: '#f9c5c0',
          200: '#f49d96',
          300: '#ef756c',
          400: '#e94d42',
          500: '#C1272D', // rouge principal
          600: '#a01f24',
          700: '#80181b',
          800: '#601012',
          900: '#400809',
        },
        // Neutres
        surface: '#f5f6f8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-in-out',
        'slide-up':  'slideUp 0.3s ease-out',
        'slide-in':  'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideIn: { '0%': { transform: 'translateX(-12px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
      },
      boxShadow: {
        'card':  '0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,.10)',
        'green': '0 4px 14px 0 rgba(0,98,51,.25)',
        'red':   '0 4px 14px 0 rgba(193,39,45,.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
