/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'custom': 'repeat(2, 28rem)',
        'steps': '1fr 8rem 1fr',
      }
    },
  },
  plugins: [require("daisyui")],
}

