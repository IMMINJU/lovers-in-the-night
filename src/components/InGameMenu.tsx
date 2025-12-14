import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

interface InGameMenuProps {
  isOpen: boolean
  onClose: () => void
}

function InGameMenu({ isOpen, onClose }: InGameMenuProps) {
  const { saveGame, resetGame, toggleDebugMode, toggleSkipMode, debugMode, skipMode } = useGameStore()
  const [saveMessage, setSaveMessage] = useState('')

  const handleSave = (slotNumber: number) => {
    saveGame(slotNumber)
    setSaveMessage(`슬롯 ${slotNumber}에 저장되었습니다.`)
    setTimeout(() => setSaveMessage(''), 2000)
  }

  const handleQuit = () => {
    if (confirm('타이틀로 돌아가시겠습니까? (저장하지 않은 진행상황은 사라집니다)')) {
      resetGame()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 sm:p-8 max-w-md w-full border border-purple-500/30"
        >
          <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">메뉴</h2>

          {/* 저장 성공 메시지 */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4 text-center text-sm"
            >
              {saveMessage}
            </motion.div>
          )}

          {/* 세이브 슬롯 */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-bold mb-3">저장하기</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleSave(slot)}
                  className="w-full bg-purple-800/50 hover:bg-purple-700/50 text-white py-3 rounded-lg border border-purple-500/30 transition-all"
                >
                  슬롯 {slot}
                </button>
              ))}
            </div>
          </div>

          {/* 디버그 옵션 */}
          <div className="mb-6">
            <h3 className="text-white text-lg font-bold mb-3">디버그 옵션</h3>
            <div className="space-y-2">
              <button
                onClick={toggleDebugMode}
                className={`w-full py-3 rounded-lg border transition-all ${
                  debugMode
                    ? 'bg-green-600 hover:bg-green-500 border-green-400 text-white'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-500/30 text-gray-300'
                }`}
              >
                🐛 디버그 모드 {debugMode ? 'ON' : 'OFF'} (Ctrl+D)
              </button>

              <button
                onClick={toggleSkipMode}
                className={`w-full py-3 rounded-lg border transition-all ${
                  skipMode
                    ? 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-500/30 text-gray-300'
                }`}
              >
                ⏩ 스킵 모드 {skipMode ? 'ON' : 'OFF'} (Ctrl+S)
              </button>
            </div>
          </div>

          {/* 메뉴 버튼들 */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition-all"
            >
              게임으로 돌아가기
            </button>

            <button
              onClick={handleQuit}
              className="w-full bg-red-800 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-all"
            >
              타이틀로
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InGameMenu
