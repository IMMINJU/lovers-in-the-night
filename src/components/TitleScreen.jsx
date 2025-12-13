import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

function TitleScreen() {
  const { setGameState, loadGame } = useGameStore()
  const [showMenu, setShowMenu] = useState(false)

  const handleNewGame = () => {
    setGameState('playing')
  }

  const handleContinue = () => {
    setShowMenu(true)
  }

  const handleLoadSlot = (slotNumber) => {
    const success = loadGame(slotNumber)
    if (success) {
      setShowMenu(false)
    } else {
      alert('세이브 파일이 없습니다.')
    }
  }

  const getSaveInfo = (slotNumber) => {
    const saveData = localStorage.getItem(`save_slot_${slotNumber}`)
    if (saveData) {
      const data = JSON.parse(saveData)
      const date = new Date(data.timestamp)
      return {
        exists: true,
        scene: data.currentScene,
        date: date.toLocaleString('ko-KR'),
        affection: data.affection,
        suspicion: data.suspicion,
      }
    }
    return { exists: false }
  }

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/80 backdrop-blur-sm rounded-lg p-6 sm:p-8 max-w-2xl w-full border border-purple-400"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-6 text-center">
            세이브 파일 선택
          </h2>

          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((slot) => {
              const info = getSaveInfo(slot)
              return (
                <motion.button
                  key={slot}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLoadSlot(slot)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    info.exists
                      ? 'bg-purple-900/50 border-purple-500 hover:bg-purple-800/50'
                      : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-white">슬롯 {slot}</div>
                      {info.exists ? (
                        <>
                          <div className="text-sm text-gray-300 mt-1">
                            {info.scene} | 호감도: {info.affection} | 의심도: {info.suspicion}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{info.date}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 mt-1">빈 슬롯</div>
                      )}
                    </div>
                    <div className="text-2xl">{info.exists ? '📁' : '📂'}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(false)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold"
          >
            뒤로 가기
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-4xl h-full max-h-[90vh] aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
      {/* 타이틀 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/title-screen.jpg)' }}
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 메인 버튼 - 살짝 우하단 배치 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-[15%] left-[55%] -translate-x-1/2 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewGame}
          className="bg-black/60 hover:bg-black/80 backdrop-blur-md border-2 border-yellow-500/80 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 px-16 py-5 rounded-lg font-bold text-2xl shadow-2xl transition-all"
        >
          START
        </motion.button>
      </motion.div>
    </div>
  )
}

export default TitleScreen
