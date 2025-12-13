import { motion } from 'framer-motion'
import { useScriptStore } from '../store/scriptStore'
import { useTypingEffect } from '../hooks/useTypingEffect'
import NotionUI from './NotionUI'
import ExcelUI from './ExcelUI'
import InferencePhase from './InferencePhase'

function DialogueBox() {
  const { currentDialogue, nextDialogue } = useScriptStore()
  const { displayedText, isComplete, skip } = useTypingEffect(currentDialogue?.text, 30)

  if (!currentDialogue) return null

  // system 타입은 자동으로 넘기기
  const isSystemMessage = currentDialogue.type === 'system'

  if (isSystemMessage) {
    // system 메시지는 표시하지 않고 자동으로 다음으로
    setTimeout(() => {
      nextDialogue()
    }, 100)
    return null
  }

  // ui_notion 타입 별도 처리
  if (currentDialogue.type === 'ui_notion') {
    return <NotionUI dialogue={currentDialogue} />
  }

  // ui_excel 타입 별도 처리
  if (currentDialogue.type === 'ui_excel') {
    return <ExcelUI dialogue={currentDialogue} />
  }

  // inference 타입 별도 처리
  if (currentDialogue.type === 'inference') {
    return <InferencePhase dialogue={currentDialogue} />
  }

  // 대사 타입별 렌더링
  const renderDialogue = () => {
    switch (currentDialogue.type) {
      case 'dialogue':
        return (
          <>
            {/* 캐릭터 이름 */}
            {!currentDialogue.isNarration && (
              <div className="text-affection font-bold text-base sm:text-lg mb-2">
                {currentDialogue.character}
              </div>
            )}

            {/* 대사 */}
            <div className="text-white text-sm sm:text-base leading-relaxed">
              {displayedText}
            </div>
          </>
        )

      case 'inner_monologue':
        return (
          <>
            <div className="text-purple-400 font-bold text-base sm:text-lg mb-2 flex items-center gap-2">
              <span>💭</span>
              <span>{currentDialogue.character} (속마음)</span>
            </div>
            <div className="text-purple-200 text-sm sm:text-base leading-relaxed italic">
              {displayedText}
            </div>
          </>
        )

      case 'narration':
        return (
          <div className="text-gray-400 text-center text-sm sm:text-base italic">
            {displayedText}
          </div>
        )

      default:
        return (
          <div className="text-white text-base leading-relaxed">
            {displayedText}
          </div>
        )
    }
  }

  const handleClick = () => {
    if (!isComplete) {
      skip()
    }
  }

  return (
    <motion.div
      key={currentDialogue.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-sm rounded-lg p-4 md:p-6 mb-4 border border-gray-700 cursor-pointer min-h-[120px] md:min-h-[160px] flex flex-col justify-between"
      onClick={handleClick}
    >
      <div>
        {renderDialogue()}
      </div>

      {/* 계속하기 표시 */}
      <div className="flex justify-end mt-2 md:mt-4">
        {isComplete && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-gray-400 text-xs sm:text-sm"
          >
            ▼ 클릭하여 계속
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default DialogueBox
