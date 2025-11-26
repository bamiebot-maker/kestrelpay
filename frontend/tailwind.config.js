/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-water': '#013B2B',
        'aqua-emerald': '#03A66A',
        'neon-mint': '#00FFBF',
        'dark-abyss': '#001610',
        'glass-frost': 'rgba(255, 255, 255, 0.12)'
      },
      animation: {
        'liquid-flow': 'liquidFlow 15s ease infinite',
        'ripple': 'rippleEffect 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'floating': 'floating 3s ease-in-out infinite'
      },
      backdropBlur: {
        'glass': '20px'
      }
    },
  },
  plugins: [],
}
