import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScriptStore } from '../store/scriptStore'
import { useGameStore } from '../store/gameStore'

function InferencePhase({ dialogue }) {
  const { question, clues, options, correctAnswer, timeLimit } = dialogue
  const { nextDialogue } = useScriptStore()
  const { checkConsistency, recordTrackedChoice } = useGameStore()

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit || 30)
  const [showResult, setShowResult] = useState(false)
  const [lieWarning, setLieWarning] = useState(null)

  // 타이머
  useEffect(() => {
    if (timeLeft <= 0 || showResult) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResult])

  const handleTimeout = () => {
    setIsCorrect(false)
    setShowResult(true)
    setTimeout(() => {
      nextDialogue()
    }, 3000)
  }

  const handleAnswerSelect = (optionId) => {
    if (showResult) return

    setSelectedAnswer(optionId)

    // 선택한 옵션 찾기
    const selectedOption = options.find(opt => opt.id === optionId)

    // 일관성 체크 (checkConsistency 필드가 있는 경우)
    if (selectedOption && selectedOption.checkConsistency) {
      const { category, value } = selectedOption.checkConsistency
      const result = checkConsistency(dialogue.id, category, value)

      if (result.isLie) {
        setLieWarning(`⚠️ 모순 발견! 의심도 +${result.penalty}`)
      } else {
        // 일치하면 기록
        recordTrackedChoice(category, value)
      }
    }

    const correct = optionId === correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    setTimeout(() => {
      nextDialogue()
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-lg p-4 sm:p-6 mb-4 border-2 border-purple-400 shadow-2xl"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-purple-400">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl">🔍</div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">추리 페이즈</h2>
            <p className="text-xs sm:text-sm text-purple-200">상황을 분석하고 최선의 선택을 하세요</p>
          </div>
        </div>

        {/* 타이머 */}
        <div className={`text-center ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
          <div className={`text-2xl sm:text-3xl font-bold ${
            timeLeft <= 5 ? 'text-red-400' : 'text-yellow-300'
          }`}>
            {timeLeft}
          </div>
          <div className="text-xs text-purple-200">초</div>
        </div>
      </div>

      {/* 질문 */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 bg-purple-800/50 rounded-lg p-4"
      >
        <h3 className="text-base sm:text-lg font-bold mb-2">❓ {question}</h3>
      </motion.div>

      {/* 단서들 */}
      {clues && clues.length > 0 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h3 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>단서</span>
          </h3>
          <div className="space-y-2">
            {clues.map((clue, index) => (
              <motion.div
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-indigo-800/50 rounded p-2 sm:p-3 text-xs sm:text-sm"
              >
                <span className="text-yellow-300 font-bold">[{index + 1}]</span> {clue}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 선택지 */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-2 sm:space-y-3"
      >
        <h3 className="text-sm sm:text-base font-bold mb-2">🎯 선택지</h3>
        {options && options.map((option, index) => {
          const isSelected = selectedAnswer === option.id
          const isThisCorrect = option.id === correctAnswer

          let bgColor = 'bg-indigo-700/50 hover:bg-indigo-600/50'
          let borderColor = 'border-indigo-500'

          if (showResult && isSelected) {
            bgColor = isCorrect ? 'bg-green-600' : 'bg-red-600'
            borderColor = isCorrect ? 'border-green-400' : 'border-red-400'
          } else if (showResult && isThisCorrect) {
            bgColor = 'bg-green-600'
            borderColor = 'border-green-400'
          }

          return (
            <motion.button
              key={option.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={!showResult ? { scale: 1.02, x: 5 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              onClick={() => handleAnswerSelect(option.id)}
              disabled={showResult}
              className={`w-full ${bgColor} border-2 ${borderColor} text-white text-left p-3 sm:p-4 rounded-lg transition-all min-h-[60px] sm:min-h-[auto] ${
                showResult ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl flex-shrink-0">{option.emoji || '▸'}</span>
                <span className="flex-1 text-sm sm:text-base">{option.text}</span>
                {showResult && isThisCorrect && (
                  <span className="text-xl sm:text-2xl">✅</span>
                )}
                {showResult && isSelected && !isCorrect && (
                  <span className="text-xl sm:text-2xl">❌</span>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* 결과 메시지 */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 p-3 sm:p-4 rounded-lg border-2 ${
              isCorrect
                ? 'bg-green-900/50 border-green-400 text-green-100'
                : 'bg-red-900/50 border-red-400 text-red-100'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2">
                {isCorrect ? '🎉' : '😅'}
              </div>
              <div className="text-sm sm:text-base font-bold">
                {isCorrect ? '정답입니다!' : timeLeft === 0 ? '시간 초과!' : '틀렸습니다!'}
              </div>
              {lieWarning && (
                <div className="mt-2 text-xs sm:text-sm text-red-300 font-bold">
                  {lieWarning}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default InferencePhase
