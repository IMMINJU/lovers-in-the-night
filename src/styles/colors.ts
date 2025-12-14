// 빛의 연인 - 컬러 팔레트
export const colors = {
  // 메인 컬러
  main: {
    black: '#0a0a0a',      // 순수 블랙
    darkGray: '#1c1c1c',   // 다크 그레이
    gold: '#ffd700',       // 골드 (빛)
    purple: '#9d4edd',     // 보라 (영적)
    white: '#ffffff',      // 순백
  },

  // 게이지
  gauge: {
    affection: '#10b981',     // 호감도 - 초록
    suspicion: '#f97316',     // 의심도 - 주황
    danger: '#ef4444',        // 위험 - 빨강
    reverse: '#a855f7',       // 역의심도 - 보라
  },

  // 씬별 분위기
  scene: {
    tension: {
      primary: '#9d4edd',     // 보라
      secondary: '#c026d3',   // 밝은 보라
      accent: '#dc2626',      // 빨강
    },
    daily: {
      primary: '#64748b',     // 회색
      secondary: '#ffd700',   // 금
      accent: '#94a3b8',      // 밝은 회색
    },
    comedy: {
      primary: '#ffd700',     // 금
      secondary: '#fbbf24',   // 노랑
      accent: '#f59e0b',      // 주황
    },
  },

  // UI 요소
  ui: {
    background: '#0a0a0a',
    dialogueBox: 'rgba(28, 28, 28, 0.95)',
    border: '#9d4edd',
    hover: 'rgba(255, 215, 0, 0.1)',
    disabled: '#4a5568',
  },

  // 텍스트
  text: {
    primary: '#ffffff',
    secondary: '#e5e7eb',
    muted: '#9ca3af',
    gold: '#ffd700',
    purple: '#c4b5fd',
  },
} as const
