import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { useScriptStore } from '../store/scriptStore'

function ChoiceButtons() {
  const { updateGauges, recordTrackedChoice } = useGameStore()
  const { showingChoices, currentChoices, selectChoice } = useScriptStore()

  if (!showingChoices || !currentChoices) return null

  const handleChoice = (choice) => {
    // 게이지 업데이트
    updateGauges(
      choice.affection || 0,
      choice.suspicion || 0,
      choice.reverseSuspicion || 0
    )

    // 추적 대상 선택 기록 (track 필드가 있는 경우)
    if (choice.track) {
      recordTrackedChoice(choice.track.category, choice.track.value)
    }

    // 다음 대화로 진행
    selectChoice(choice)
  }

  return (
    <div className="flex flex-col gap-3">
      {currentChoices.choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice(choice)}
          className="bg-gray-800/90 hover:bg-gray-700/90 text-white text-left p-5 sm:p-4 rounded-lg border border-gray-600 hover:border-affection transition-all min-h-[60px] sm:min-h-[auto]"
        >
          <div className="flex items-start">
            <span className="flex-1 text-sm sm:text-base">{choice.text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default ChoiceButtons
