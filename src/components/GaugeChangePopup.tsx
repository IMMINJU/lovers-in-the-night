import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

function GaugeChangePopup() {
  const { recentChanges, clearRecentChanges } = useGameStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 모바일 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (recentChanges) {
      // 2초 후 팝업 제거
      const timer = setTimeout(() => {
        clearRecentChanges()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [recentChanges, clearRecentChanges])

  if (!recentChanges) return null

  const { affection, suspicion, reverseSuspicion } = recentChanges

  // 큰 변화 여부 체크
  const isBigChange = Math.abs(affection) >= 10 || Math.abs(suspicion) >= 10 || Math.abs(reverseSuspicion) >= 10

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed z-50 flex gap-3 ${
          isMobile
            ? 'top-4 left-1/2 transform -translate-x-1/2 flex-col'  // 모바일: 상단 중앙, 세로
            : 'left-8 top-1/2 transform -translate-y-1/2 flex-col'  // 웹: 왼쪽 중앙, 세로
        }`}
      >
        {/* 호감도 변화 */}
        {affection !== 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: isBigChange && Math.abs(affection) >= 10 ? 1.2 : 1 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: isBigChange && Math.abs(affection) >= 10 ? [1.2, 1.3, 1.2] : 1
            }}
            transition={{
              scale: { repeat: isBigChange && Math.abs(affection) >= 10 ? 3 : 0, duration: 0.3 }
            }}
            className={`bg-black/90 backdrop-blur-md rounded-lg px-4 py-3 shadow-2xl flex items-center gap-3 ${
              Math.abs(affection) >= 10
                ? 'border-2 border-affection'
                : 'border border-gray-700'
            }`}
          >
            <span className={Math.abs(affection) >= 10 ? "text-4xl" : "text-3xl"}>💚</span>
            <span className={`text-affection font-bold ${Math.abs(affection) >= 10 ? 'text-3xl' : 'text-xl'}`}>
              {affection > 0 ? '+' : ''}{affection}
            </span>
          </motion.div>
        )}

        {/* 의심도 변화 */}
        {suspicion !== 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: isBigChange && Math.abs(suspicion) >= 10 ? 1.2 : 1 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: isBigChange && Math.abs(suspicion) >= 10 ? [1.2, 1.3, 1.2] : 1
            }}
            transition={{
              delay: 0.15,
              scale: { repeat: isBigChange && Math.abs(suspicion) >= 10 ? 3 : 0, duration: 0.3 }
            }}
            className={`bg-black/90 backdrop-blur-md rounded-lg px-4 py-3 shadow-2xl flex items-center gap-3 ${
              Math.abs(suspicion) >= 10
                ? suspicion > 10 ? 'border-2 border-danger' : 'border-2 border-suspicion'
                : 'border border-gray-700'
            }`}
          >
            <span className={Math.abs(suspicion) >= 10 ? "text-4xl" : "text-3xl"}>⚠️</span>
            <span className={`font-bold ${suspicion > 10 ? 'text-danger' : 'text-suspicion'} ${Math.abs(suspicion) >= 10 ? 'text-3xl' : 'text-xl'}`}>
              {suspicion > 0 ? '+' : ''}{suspicion}
            </span>
          </motion.div>
        )}

        {/* 역의심도 변화 (있을 경우) */}
        {reverseSuspicion !== 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: isBigChange && Math.abs(reverseSuspicion) >= 10 ? 1.2 : 1 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: isBigChange && Math.abs(reverseSuspicion) >= 10 ? [1.2, 1.3, 1.2] : 1
            }}
            transition={{
              delay: 0.3,
              scale: { repeat: isBigChange && Math.abs(reverseSuspicion) >= 10 ? 3 : 0, duration: 0.3 }
            }}
            className={`bg-black/90 backdrop-blur-md rounded-lg px-4 py-3 shadow-2xl flex items-center gap-3 ${
              Math.abs(reverseSuspicion) >= 10
                ? 'border-2 border-purple-400'
                : 'border border-gray-700'
            }`}
          >
            <span className={Math.abs(reverseSuspicion) >= 10 ? "text-4xl" : "text-3xl"}>🔍</span>
            <span className={`text-purple-400 font-bold ${Math.abs(reverseSuspicion) >= 10 ? 'text-3xl' : 'text-xl'}`}>
              {reverseSuspicion > 0 ? '+' : ''}{reverseSuspicion}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default GaugeChangePopup
