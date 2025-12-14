import { create } from 'zustand'
import { useGameStore } from './gameStore'
import type { ScriptStore, ChoiceDialogue, BackgroundKey } from '../types'

const bgMap: Record<BackgroundKey, string> = {
  room: '/images/backgrounds/room.png',
  cafe: '/images/backgrounds/cafe.png',
  park: '/images/backgrounds/park.png',
  cult: '/images/backgrounds/cult.png',
  street: '/images/backgrounds/street.png',
}

export const useScriptStore = create<ScriptStore>((set, get) => ({
  // 현재 로드된 스크립트
  currentScript: null,
  currentDialogueIndex: 0,

  // 현재 표시 중인 대화
  currentDialogue: null,

  // 선택지 표시 여부
  showingChoices: false,
  currentChoices: null,

  // 씬 종료 콜백
  onSceneEnd: null,

  // 스크립트 로드
  loadScript: (scriptData) => {
    // 배경 설정 (이미지 or 색상)
    if (scriptData.background) {
      const bg = bgMap[scriptData.background as BackgroundKey] || scriptData.background
      useGameStore.getState().setBackground(bg)
    }

    set({
      currentScript: scriptData,
      currentDialogueIndex: 0,
      currentDialogue: scriptData.dialogues[0] || null,
      showingChoices: false,
      currentChoices: null,
    })
  },

  // 다음 대화로 진행
  nextDialogue: () => {
    const { currentScript, currentDialogueIndex } = get()

    if (!currentScript) return

    const nextIndex = currentDialogueIndex + 1

    if (nextIndex >= currentScript.dialogues.length) {
      // 씬 종료 - 다음 씬으로 전환하거나 엔딩 체크
      set({ currentDialogue: null })

      // 씬 종료 콜백 호출 (App에서 설정)
      const onSceneEnd = get().onSceneEnd
      if (onSceneEnd) onSceneEnd()
      return
    }

    const nextDialogue = currentScript.dialogues[nextIndex]

    if (!nextDialogue) return

    // 배경 변경이 있으면 적용
    if (nextDialogue.background) {
      const bg = bgMap[nextDialogue.background as BackgroundKey] || nextDialogue.background
      useGameStore.getState().setBackground(bg)
    }

    // 선택지인 경우
    if (nextDialogue.type === 'choice') {
      set({
        currentDialogueIndex: nextIndex,
        showingChoices: true,
        currentChoices: nextDialogue as ChoiceDialogue,
        currentDialogue: null,
      })
    } else {
      // 일반 대화
      set({
        currentDialogueIndex: nextIndex,
        currentDialogue: nextDialogue,
        showingChoices: false,
        currentChoices: null,
      })
    }
  },

  // 선택지 선택
  selectChoice: (choice) => {
    const { currentScript } = get()

    // 선택지 숨기기
    set({
      showingChoices: false,
      currentChoices: null,
    })

    // 게이지 변화 팝업을 볼 수 있도록 지연
    setTimeout(() => {
      // nextDialogue가 있으면 해당 대화로 이동
      if (choice.nextDialogue && currentScript) {
        const targetIndex = currentScript.dialogues.findIndex(
          d => d.id === choice.nextDialogue
        )

        if (targetIndex !== -1) {
          set({
            currentDialogueIndex: targetIndex,
            currentDialogue: currentScript.dialogues[targetIndex] || null,
          })
          return
        }
      }

      // 없으면 다음 대화로
      get().nextDialogue()
    }, 800)
  },

  // 씬 종료 콜백 설정
  setOnSceneEnd: (callback) => {
    set({ onSceneEnd: callback })
  },

  // 스크립트 리셋
  resetScript: () => {
    set({
      currentScript: null,
      currentDialogueIndex: 0,
      currentDialogue: null,
      showingChoices: false,
      currentChoices: null,
      onSceneEnd: null,
    })
  },
}))
