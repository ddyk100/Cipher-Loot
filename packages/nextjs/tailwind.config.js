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
        vault: {
          bg: '#020617',
          panel: '#0f172a',
          accent: '#f4d35e',
          danger: '#f87171',
          success: '#34d399',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['var(--font-space)', 'Space Grotesk', 'ui-sans-serif', 'system-ui'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        vault: '0 25px 70px rgba(2, 6, 23, 0.75)',
      },
      backgroundImage: {
        'vault-radial': 'radial-gradient(circle at 10% 10%, rgba(59,7,100,0.35), transparent 40%)',
      },
      animation: {
        blink: 'blink 1.4s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
