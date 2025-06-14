/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(248, 28, 229, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(248, 28, 229, 0.6)',
          },
        },
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(248, 28, 229, 0.5)',
        'neon-pink-strong': '0 0 30px rgba(248, 28, 229, 0.8)',
      },
    },
  },
  plugins: [],
};