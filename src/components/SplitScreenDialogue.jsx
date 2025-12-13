import { motion } from 'framer-motion'

const characterMap = {
  '지우': 'jiwoo',
  '서준': 'seojun',
}

function SplitScreenDialogue({ dialogue }) {
  const { left, right } = dialogue

  // 캐릭터 이미지 경로
  const getCharacterImage = (character, expression) => {
    const charId = characterMap[character]
    if (!charId) return null
    return `/images/characters/${charId}-${expression || 'normal'}.png`
  }

  return (
    <div className="absolute inset-0 z-30 pointer-events-auto bg-black/20" onClick={() => {}}>
      {/* 캐릭터 이미지 - 중앙 하단 */}
      {left.character && left.expression && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute left-1/2 bottom-0 -translate-x-1/2"
        >
          <img
            src={getCharacterImage(left.character, left.expression)}
            alt={left.character}
            className="h-auto max-h-[90vh] md:max-h-full object-contain drop-shadow-2xl"
            style={{ mixBlendMode: 'multiply' }}
          />
        </motion.div>
      )}

      {/* 속마음 - 상단 (작게 떠있는 느낌) */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 max-w-2xl px-4"
      >
        <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-purple-400/50">
          <div className="text-purple-200 text-sm italic text-center leading-relaxed">
            {right.text}
          </div>
        </div>
      </motion.div>

      {/* 겉모습 대사 - 하단 (영화 자막처럼) */}
      {left.text && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-3xl px-4"
        >
          <div className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-lg border border-yellow-500/80">
            <div className="text-white text-base text-center leading-relaxed">{left.text}</div>
          </div>
        </motion.div>
      )}

      {/* 계속하기 표시 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-sm bg-black/50 px-4 py-2 rounded-lg"
        >
          ▼ 클릭하여 계속
        </motion.div>
      </div>
    </div>
  )
}

export default SplitScreenDialogue
