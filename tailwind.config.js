/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          pink: '#EC4899',   /* Pink-500 */
          purple: '#8B5CF6', /* Purple-500 */
          blue: '#3B82F6',   /* Blue-500 */
          teal: '#8B5CF6',   /* Mapping old teal to purple for backward compat */
          coral: '#EC4899',  /* Mapping old coral to pink for backward compat */
          yellow: '#FBBF24', /* Amber-400 */
        },
        dark: {
          bg: '#0F172A',     /* Slate-900 - deeper blue-black */
          surface: '#1E293B',/* Slate-800 */
        },
        light: {
          bg: '#F8FAFC',     /* Slate-50 */
          surface: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Lato', 'sans-serif'],
        heading: ['Poppins', 'Montserrat', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slight': 'bounce 0.5s infinite alternate',
      }
    }
  },
  plugins: [],
}