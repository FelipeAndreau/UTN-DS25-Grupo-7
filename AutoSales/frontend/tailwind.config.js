/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'star-movement-bottom': 'star-movement-bottom 6s linear infinite alternate',
        'star-movement-top': 'star-movement-top 6s linear infinite alternate',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '3' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '3' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '3' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '3' },
        },
      },
    },
  },
  plugins: [],
}

