import { motion } from 'framer-motion'

const characterMap: Record<string, string> = {
  '지우': 'jiwoo',
  '서준': 'seojun',
  '리더': 'leader',
  '멤버1': 'members',
  '멤버2': 'members',
}

interface CharacterPortraitProps {
  character?: string
  expression?: string
}

function CharacterPortrait({ character, expression }: CharacterPortraitProps) {
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
      className="absolute left-0 right-0 mx-auto bottom-0 pointer-events-none z-5 w-fit max-h-[95vh] md:max-h-[80vh] max-w-[80%] md:max-w-[50%]"
    >
      <img
        src={imagePath}
        alt={character}
        className="h-auto max-h-full max-w-full object-contain drop-shadow-2xl"
      />
    </motion.div>
  )
}

export default CharacterPortrait
