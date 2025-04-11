/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          background: "#D8D1AE",
          darkBrown: "#5A3E00",
          darkBrownHover: "#3D2900",
        },
        fontFamily: {
          sans: ['Inter var', 'sans-serif'],
          gilda: ["Gilda Display", "serif"],
        },
        keyframes: {
          'fade-in': {
            '0%': {
              opacity: '0',
              transform: 'translateY(10px)'
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)'
            }
          }
        },
        animation: {
          'fade-in': 'fade-in 0.3s ease-out forwards'
        }
      },
    },
    plugins: [require('@tailwindcss/typography')],
  };