import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScriptStore } from '../store/scriptStore'
import { useGameStore } from '../store/gameStore'
import DialogueBox from './DialogueBox'
import ChoiceButtons from './ChoiceButtons'
import GaugeChangePopup from './GaugeChangePopup'
import InGameMenu from './InGameMenu'
import CharacterPortrait from './CharacterPortrait'
import SplitScreenDialogue from './SplitScreenDialogue'

function GameContainer() {
  const { currentDialogue, showingChoices, nextDialogue } = useScriptStore()
  const { currentBackground, currentScene } = useGameStore()
  const [showMenu, setShowMenu] = useState(false)
  const [sceneTransitioning, setSceneTransitioning] = useState(false)
  const [prevScene, setPrevScene] = useState(currentScene)

  const handleClick = () => {
    // 메뉴 열려있으면 클릭 무시
    if (showMenu) return

    // 선택지 표시 중일 때는 클릭 무시
    if (showingChoices) return

    // 대화가 있으면 다음으로
    if (currentDialogue) {
      nextDialogue()
    }
  }

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

  // ESC 키로 메뉴 토글
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowMenu((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      className="relative w-full max-w-5xl h-full aspect-video max-h-[90vh] flex flex-col bg-gray-900 rounded-lg overflow-hidden shadow-2xl cursor-pointer"
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
      {currentDialogue?.type === 'split_screen' ? (
        <SplitScreenDialogue dialogue={currentDialogue} />
      ) : (
        <>
          {/* 캐릭터 초상화 */}
          {currentDialogue?.type === 'dialogue' && currentDialogue?.character && (
            <CharacterPortrait
              character={currentDialogue.character}
              expression={currentDialogue.expression}
            />
          )}

          {/* 메인 컨텐츠 */}
          <div className="relative flex-1 flex flex-col justify-end p-6 z-10">
            {/* 대화창 */}
            <DialogueBox />

            {/* 선택지 */}
            <ChoiceButtons />
          </div>
        </>
      )}

      {/* 게이지 변화 팝업 */}
      <GaugeChangePopup />

      {/* 메뉴 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(true)
        }}
        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg z-20 text-sm"
      >
        ☰ 메뉴
      </button>

      {/* 인게임 메뉴 */}
      <InGameMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
    </div>
  )
}

export default GameContainer
