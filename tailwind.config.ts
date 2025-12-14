import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        affection: '#10b981', // 호감도 초록
        suspicion: '#f97316', // 의심도 주황
        danger: '#ef4444', // 위험 빨강
      },
      fontFamily: {
        korean: ['Noto Sans KR', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config
