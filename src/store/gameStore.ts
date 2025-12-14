import { create } from 'zustand'
import type { GameStore, GameState, EndingType, SaveData } from '../types'

export const useGameStore = create<GameStore>((set) => ({
  // 게임 상태
  gameState: 'title',

  // 게이지 (숨겨진 스탯)
  affection: 10,
  suspicion: 0,
  reverseSuspicion: 0,

  // 현재 씬/대화
  currentScene: 'scene1',
  currentDialogueIndex: 0,

  // 선택 기록 (거짓말 추적용)
  choiceHistory: [],

  // 거짓말 추적
  trackedChoices: {},
  lieDetections: [],

  // 게이지 변화 팝업용
  recentChanges: null,

  // 배경 이미지
  currentBackground: null,

  // 디버그 모드
  debugMode: false,
  skipMode: false,

  // 게이지 업데이트
  updateGauges: (affectionChange, suspicionChange, reverseSuspicionChange = 0) =>
    set((state) => {
      const newAffection = Math.max(0, Math.min(100, state.affection + affectionChange))
      const newSuspicion = Math.max(0, Math.min(100, state.suspicion + suspicionChange))
      const newReverseSuspicion = Math.max(0, Math.min(100, state.reverseSuspicion + reverseSuspicionChange))

      return {
        affection: newAffection,
        suspicion: newSuspicion,
        reverseSuspicion: newReverseSuspicion,
        recentChanges: {
          affection: affectionChange,
          suspicion: suspicionChange,
          reverseSuspicion: reverseSuspicionChange,
        }
      }
    }),

  // 팝업 초기화
  clearRecentChanges: () => set({ recentChanges: null }),

  // 선택 기록
  addChoice: (sceneId, choiceId, choiceData) =>
    set((state) => ({
      choiceHistory: [...state.choiceHistory, { sceneId, choiceId, choiceData, timestamp: Date.now() }]
    })),

  // 추적 대상 선택 기록
  recordTrackedChoice: (category, value) =>
    set((state) => ({
      trackedChoices: {
        ...state.trackedChoices,
        [category]: value
      }
    })),

  // 거짓말 체크
  checkConsistency: (sceneId, category, currentValue) => {
    const state = useGameStore.getState()
    const previousValue = state.trackedChoices[category]

    // 이전 선택이 있고, 현재 선택과 다르면 모순
    if (previousValue && previousValue !== currentValue) {
      const lieCount = state.lieDetections.filter(d => d.category === category).length

      // 페널티 계산
      let penalty = 10 // 기본 Tier 1
      if (lieCount >= 2) penalty = 20 // Tier 2
      if (lieCount >= 3) penalty = 50 // Tier 3 (거의 D엔딩)

      // 기록
      set((state) => ({
        lieDetections: [...state.lieDetections, { sceneId, category, penalty }],
        suspicion: Math.min(100, state.suspicion + penalty)
      }))

      return { isLie: true, penalty }
    }

    return { isLie: false, penalty: 0 }
  },

  // 씬 이동
  setScene: (sceneId) => set({ currentScene: sceneId, currentDialogueIndex: 0 }),

  // 대화 진행
  nextDialogue: () => set((state) => ({ currentDialogueIndex: state.currentDialogueIndex + 1 })),

  // 게임 상태 변경
  setGameState: (gameState: GameState) => set({ gameState }),

  // 배경 변경
  setBackground: (background) => set({ currentBackground: background }),

  // 엔딩 계산
  calculateEnding: (): EndingType => {
    const state = useGameStore.getState()
    const { affection, suspicion } = state

    // 우선순위 순서대로 체크

    // 1. D엔딩 - 들통 (의심도 75 이상) - 최우선
    if (suspicion >= 75) return 'ending_d'

    // 2. A엔딩 - 역관광 (호감도 70+, 의심도 60 이하)
    if (affection >= 70 && suspicion <= 60) return 'ending_a'

    // 3. C엔딩 - 병맛 로맨스 (호감도 50+, 의심도 55-70)
    if (affection >= 50 && suspicion >= 55 && suspicion <= 70) return 'ending_c'

    // 4. B엔딩 - 프로의 벽 (나머지 모든 경우)
    return 'ending_b'
  },

  // 세이브
  saveGame: (slotNumber) => {
    const state = useGameStore.getState()
    const saveData: SaveData = {
      affection: state.affection,
      suspicion: state.suspicion,
      reverseSuspicion: state.reverseSuspicion,
      currentScene: state.currentScene,
      choiceHistory: state.choiceHistory,
      trackedChoices: state.trackedChoices,
      lieDetections: state.lieDetections,
      timestamp: Date.now(),
    }
    localStorage.setItem(`save_slot_${slotNumber}`, JSON.stringify(saveData))
  },

  // 로드
  loadGame: (slotNumber) => {
    const saveDataStr = localStorage.getItem(`save_slot_${slotNumber}`)
    if (saveDataStr) {
      const data: SaveData = JSON.parse(saveDataStr)
      set({
        affection: data.affection,
        suspicion: data.suspicion,
        reverseSuspicion: data.reverseSuspicion,
        currentScene: data.currentScene,
        choiceHistory: data.choiceHistory || [],
        trackedChoices: data.trackedChoices || {},
        lieDetections: data.lieDetections || [],
        gameState: 'playing',
      })
      return true
    }
    return false
  },

  // 게임 리셋
  resetGame: () => set({
    gameState: 'title',
    affection: 10,
    suspicion: 0,
    reverseSuspicion: 0,
    currentScene: 'scene1',
    currentDialogueIndex: 0,
    choiceHistory: [],
    trackedChoices: {},
    lieDetections: [],
    recentChanges: null,
    currentBackground: null,
  }),

  // 디버그 모드 토글
  toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),

  // 스킵 모드 토글
  toggleSkipMode: () => set((state) => ({ skipMode: !state.skipMode })),
}))
