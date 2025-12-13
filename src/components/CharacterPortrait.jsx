import { motion } from 'framer-motion'

const characterMap = {
  '지우': 'jiwoo',
  '서준': 'seojun',
  '리더': 'leader',
  '멤버1': 'members',
  '멤버2': 'members',
}

function CharacterPortrait({ character, expression }) {
  if (!character) return null

  const charId = characterMap[character]
  if (!charId) return null

  const imagePath = charId === 'leader' || charId === 'members'
    ? `/images/characters/${charId}.png`
    : `/images/characters/${charId}-${expression || 'normal'}.png`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute left-1/2 bottom-0 -translate-x-1/2 pointer-events-none z-5 max-h-full"
    >
      <img
        src={imagePath}
        alt={character}
        className="h-auto max-h-full object-contain drop-shadow-2xl"
      />
    </motion.div>
  )
}

export default CharacterPortrait
