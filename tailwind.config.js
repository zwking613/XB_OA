/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue,jsx,tsx}",
  ],
  theme: {
    extend: {
        backgroundImage: {
          'login-bg': "url('/src/assets/nbg.png')",
        }
    },
  },
  plugins: [],
}

