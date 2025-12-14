// 게임 상태 타입
export type GameState = 'title' | 'playing' | 'ending'

// 엔딩 타입
export type EndingType = 'ending_a' | 'ending_b' | 'ending_c' | 'ending_d'

// 배경 타입
export type BackgroundKey = 'room' | 'cafe' | 'park' | 'cult' | 'street'

// 게이지 변화
export interface GaugeChange {
  affection: number
  suspicion: number
  reverseSuspicion: number
}

// 선택 기록
export interface ChoiceRecord {
  sceneId: string
  choiceId: string
  choiceData: Record<string, any>
  timestamp: number
}

// 거짓말 감지 기록
export interface LieDetection {
  sceneId: string
  category: string
  penalty: number
}

// 세이브 데이터
export interface SaveData {
  affection: number
  suspicion: number
  reverseSuspicion: number
  currentScene: string
  choiceHistory: ChoiceRecord[]
  trackedChoices: Record<string, string>
  lieDetections: LieDetection[]
  timestamp: number
}

// 게임 스토어 타입
export interface GameStore {
  gameState: GameState
  affection: number
  suspicion: number
  reverseSuspicion: number
  currentScene: string
  currentDialogueIndex: number
  choiceHistory: ChoiceRecord[]
  trackedChoices: Record<string, string>
  lieDetections: LieDetection[]
  recentChanges: GaugeChange | null
  currentBackground: string | null
  debugMode: boolean
  skipMode: boolean

  updateGauges: (affectionChange: number, suspicionChange: number, reverseSuspicionChange?: number) => void
  clearRecentChanges: () => void
  addChoice: (sceneId: string, choiceId: string, choiceData: Record<string, any>) => void
  recordTrackedChoice: (category: string, value: string) => void
  checkConsistency: (sceneId: string, category: string, currentValue: string) => { isLie: boolean; penalty: number }
  setScene: (sceneId: string) => void
  nextDialogue: () => void
  setGameState: (state: GameState) => void
  setBackground: (background: string | null) => void
  calculateEnding: () => EndingType
  saveGame: (slotNumber: number) => void
  loadGame: (slotNumber: number) => boolean
  resetGame: () => void
  toggleDebugMode: () => void
  toggleSkipMode: () => void
}

// 대화 타입
export interface BaseDialogue {
  id: string
  type: 'dialogue' | 'split' | 'choice' | 'inference' | 'system' | 'ui_notion' | 'ui_excel' | 'split_screen' | string
  background?: BackgroundKey | string
  [key: string]: any // 유연성을 위한 인덱스 시그니처
}

export interface NormalDialogue extends BaseDialogue {
  type: 'dialogue'
  speaker?: string
  character?: string
  text: string
  portrait?: string
  expression?: string
  isNarration?: boolean
}

export interface SplitDialogue extends BaseDialogue {
  type: 'split'
  left: {
    speaker: string
    text: string
    portrait?: string
  }
  right: {
    speaker: string
    text: string
    portrait?: string
  }
}

export interface Choice {
  id: string
  text: string
  affection?: number
  suspicion?: number
  reverseSuspicion?: number
  nextDialogue?: string
  track?: {
    category: string
    value: string
  }
  checkConsistency?: {
    category: string
    value: string
  }
}

export interface ChoiceDialogue extends BaseDialogue {
  type: 'choice'
  prompt?: string
  choices: Choice[]
}

export interface InferencePhaseData extends BaseDialogue {
  type: 'inference'
  title: string
  description: string
  targetVariable: string
  clues: Array<{
    id: string
    title: string
    description: string
    discovered?: boolean
  }>
  options: Array<{
    id: string
    label: string
    value: string
    isCorrect: boolean
  }>
  correctReward: {
    affection?: number
    suspicion?: number
  }
  incorrectPenalty: {
    affection?: number
    suspicion?: number
  }
  nextDialogue: string
}

export type Dialogue = NormalDialogue | SplitDialogue | ChoiceDialogue | InferencePhaseData | BaseDialogue

// 스크립트 데이터
export interface ScriptData {
  id?: string
  sceneId?: string
  title: string
  background?: BackgroundKey | string | null
  bgm?: string
  dialogues: Dialogue[]
  nextScene?: string
}

// 스크립트 스토어 타입
export interface ScriptStore {
  currentScript: ScriptData | null
  currentDialogueIndex: number
  currentDialogue: Dialogue | null
  showingChoices: boolean
  currentChoices: ChoiceDialogue | null
  onSceneEnd: (() => void) | null

  loadScript: (scriptData: ScriptData) => void
  nextDialogue: () => void
  selectChoice: (choice: Choice) => void
  setOnSceneEnd: (callback: () => void) => void
  resetScript: () => void
}

// 엔딩 정보
export interface EndingInfo {
  id: EndingType
  title: string
  description: string
  image?: string
}
