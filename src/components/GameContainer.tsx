import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScriptStore } from '../store/scriptStore'
import { useGameStore } from '../store/gameStore'
import DialogueBox from './DialogueBox'
import ChoiceButtons from './ChoiceButtons'
import GaugeChangePopup from './GaugeChangePopup'
import CharacterPortrait from './CharacterPortrait'
import SplitScreenDialogue from './SplitScreenDialogue'
import DebugPanel from './DebugPanel'

function GameContainer() {
  const { currentDialogue, showingChoices, nextDialogue } = useScriptStore()
  const { currentBackground, currentScene, skipMode, debugMode, toggleDebugMode, toggleSkipMode } = useGameStore()
  const [sceneTransitioning, setSceneTransitioning] = useState(false)
  const [prevScene, setPrevScene] = useState(currentScene)

  const handleClick = () => {
    // 선택지 표시 중일 때는 클릭 무시
    if (showingChoices) return

    // 대화가 있으면 다음으로
    if (currentDialogue) {
      nextDialogue()
    }
  }

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+D: 디버그 모드 토글
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        toggleDebugMode()
      }
      // Ctrl+S: 스킵 모드 토글
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        toggleSkipMode()
      }
      // Space/Enter: 스킵 모드 시 빠른 진행
      if (skipMode && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        if (!showingChoices && currentDialogue) {
          nextDialogue()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [skipMode, showingChoices, currentDialogue, nextDialogue, toggleDebugMode, toggleSkipMode])

  // 스킵 모드 자동 진행
  useEffect(() => {
    if (!skipMode || showingChoices || !currentDialogue) return

    const timer = setTimeout(() => {
      nextDialogue()
    }, 100) // 0.1초마다 자동 진행

    return () => clearTimeout(timer)
  }, [skipMode, showingChoices, currentDialogue, nextDialogue])

  // 씬 전환 감지
  useEffect(() => {
    if (currentScene !== prevScene) {
      setSceneTransitioning(true)
      setTimeout(() => {
        setPrevScene(currentScene)
        setSceneTransitioning(false)
      }, 500)
    }
  }, [currentScene, prevScene])


  return (
    <div
      className="relative w-screen h-screen flex flex-col overflow-hidden cursor-pointer bg-gray-900"
      onClick={handleClick}
    >
      {/* 씬 전환 페이드 오버레이 */}
      <AnimatePresence>
        {sceneTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      {/* 배경 */}
      {currentBackground ? (
        currentBackground.startsWith('linear-gradient') || currentBackground.startsWith('radial-gradient') ? (
          <div
            className="absolute inset-0"
            style={{ background: currentBackground }}
          >
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentBackground})`,
            }}
          >
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-90"></div>
      )}

      {/* split_screen 타입은 전체 화면으로 */}
      {currentDialogue && 'type' in currentDialogue && currentDialogue.type === 'split_screen' ? (
        <SplitScreenDialogue dialogue={currentDialogue as any} />
      ) : (
        <>
          {/* 캐릭터 초상화 */}
          {currentDialogue && 'type' in currentDialogue && currentDialogue.type === 'dialogue' && 'character' in currentDialogue && currentDialogue.character && (
            <CharacterPortrait
              character={(currentDialogue as any).character}
              expression={(currentDialogue as any).expression}
            />
          )}

          {/* 메인 컨텐츠 */}
          <div className="relative flex-1 flex flex-col justify-end p-4 md:p-6 z-10">
            {/* 대화창 & 선택지 컨테이너 - max-5xl로 중앙 정렬 */}
            <div className="w-full max-w-5xl mx-auto">
              {/* 대화창 */}
              <DialogueBox />

              {/* 선택지 */}
              <ChoiceButtons />
            </div>
          </div>
        </>
      )}

      {/* 게이지 변화 팝업 */}
      <GaugeChangePopup />

      {/* 디버그 패널 */}
      <DebugPanel />

      {/* 우상단 디버그/스킵 버튼 - 개발 모드에서만 표시 */}
      {/* <div className="absolute top-4 right-4 z-[9998] flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleDebugMode()
          }}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
            debugMode
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white'
          }`}
          title="디버그 모드 (Ctrl+D)"
        >
          🐛
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleSkipMode()
          }}
          className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
            skipMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-black/50 hover:bg-black/70 text-gray-300 hover:text-white'
          }`}
          title="스킵 모드 (Ctrl+S)"
        >
          ⏩
        </button>
      </div> */}
    </div>
  )
}

export default GameContainer
