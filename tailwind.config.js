/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          dark: '#0B0F17',
          card: '#121824',
          cardBorder: '#1E293B',
          accent: '#3B82F6',
          accentHover: '#2563EB',
          emerald: '#10B981',
          rose: '#F43F5E',
          amber: '#F59E0B',
          cyan: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-red': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
      }
    },
  },
  plugins: [],
}
