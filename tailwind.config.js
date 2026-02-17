/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#2563eb',
        'brand-primary-dark': '#1e40af',
        'brand-primary-light': '#3b82f6',
        'stitch-primary': '#13daec',
        'stitch-bg-light': '#f6f8f8',
        'stitch-bg-dark': '#102022',
        'stitch-accent-dark': '#1a3538',
        'stitch-glass': 'rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}
