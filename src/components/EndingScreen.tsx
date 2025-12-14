import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import type { EndingType } from '../types'

interface EndingData {
  title: string
  emoji: string
  color: string
  description: string
  image: string
  content: string[]
  grade: string
}

function EndingScreen() {
  const { affection, suspicion, reverseSuspicion, resetGame, calculateEnding } = useGameStore()

  const endingType = calculateEnding()

  const endings: Record<EndingType, EndingData> = {
    ending_a: {
      title: 'A엔딩: 역관광',
      emoji: '🎉',
      color: 'from-green-600 to-emerald-600',
      description: '여자의 완벽한 승리',
      image: '/images/endings/ending-a.png',
      content: [
        '치밀한 전략과 진심 어린 설득으로',
        '민준을 사이비 종교에서 구해냈다.',
        '',
        '민준: "처음엔 포섭하려 했는데... 내가 당했네"',
        '여자: (담배 피우며) "처음엔 장난이었는데 진짜 꼬셨네"',
        '',
        '엑셀 파일은 삭제되었고,',
        '노션에는 "프로젝트 성공 ✅"이 체크되었다.',
      ],
      grade: 'S',
    },
    ending_b: {
      title: 'B엔딩: 프로의 벽',
      emoji: '😔',
      color: 'from-gray-600 to-slate-600',
      description: '여자의 패배',
      image: '/images/endings/ending-b.png',
      content: [
        '결국 여자는 종교에 가입했다.',
        '',
        '민준: (만족스럽게) "좋은 선택이에요"',
        '여자: (신도복 입고) "감사합니다..."',
        '',
        '엑셀에 새 행이 추가되었다.',
        '"다음 타겟: 박OO"',
        '',
        '민준의 독백: "이번 분기 목표 달성. 다음은..."',
      ],
      grade: 'C',
    },
    ending_c: {
      title: 'C엔딩: 병맛 로맨스',
      emoji: '😂',
      color: 'from-purple-600 to-pink-600',
      description: '서로 정체를 안 채로 관계 지속',
      image: '/images/endings/ending-c.png',
      content: [
        '서로의 정체를 밝혔다.',
        '잠깐의 어색한 침묵...',
        '',
        '그리고 동시에 웃음이 터졌다.',
        '',
        '"우리 진짜 병신같다"',
        '',
        '카페에서 데이트 중인 두 사람.',
        '여자는 노션으로 민준 분석 중,',
        '민준은 엑셀로 여자 데이터 정리 중.',
        '',
        '서로 쳐다보며 웃는다: "뭐 해?"',
        '',
        '그리고 이 병신같은 관계는 계속되었다...',
      ],
      grade: 'A',
    },
    ending_d: {
      title: 'D엔딩: 들통',
      emoji: '💔',
      color: 'from-red-600 to-rose-600',
      description: '게임 오버',
      image: '/images/endings/ending-d.png',
      content: [
        '민준: "...혹시 나한테 의도적으로 접근한 거죠?"',
        '여자: "...아니, 그게..."',
        '민준: "관계 정리하는 게 좋을 것 같네요"',
        '',
        '차단.',
        '',
        '여자는 혼자 카페에 앉아있다.',
        '읽씹당한 카톡.',
        '노션 프로젝트 제목: "실패"',
        '',
        '(담배 피우며) "...망했네"',
      ],
      grade: 'F',
    },
  }

  const ending = endings[endingType]

  return (
    <div className={`relative w-screen h-screen bg-gradient-to-br ${ending.color} flex flex-col items-center justify-center p-4 overflow-y-auto scroll-smooth`}>
      {/* 엔딩 CG 배경 */}
      {ending.image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${ending.image})` }}
        />
      )}

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 엔딩 타이틀 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="text-8xl sm:text-9xl mb-4">{ending.emoji}</div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-2">{ending.title}</h1>
        <p className="text-xl sm:text-2xl text-white/80 italic">{ending.description}</p>
      </motion.div>

      {/* 엔딩 내용 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="bg-black/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 max-w-2xl w-full mb-8 relative z-10"
      >
        {ending.content.map((line, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.2 }}
            className={`text-white text-center ${line === '' ? 'h-4' : 'text-sm sm:text-base leading-relaxed mb-2'}`}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* 최종 게이지 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="bg-black/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 max-w-md w-full mb-8 relative z-10"
      >
        <h3 className="text-white text-lg font-bold mb-4 text-center">최종 스탯</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-white text-sm mb-1">
              <span>💚 호감도</span>
              <span>{affection}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${affection}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-white text-sm mb-1">
              <span>⚠️ 의심도</span>
              <span>{suspicion}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${suspicion}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-white text-sm mb-1">
              <span>🔍 역의심도</span>
              <span>{reverseSuspicion}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${reverseSuspicion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-white text-sm mb-2">평가</div>
          <div className="text-5xl font-bold text-yellow-300">{ending.grade}</div>
        </div>
      </motion.div>

      {/* 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="flex gap-4 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-bold"
        >
          타이틀로
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-bold"
        >
          처음부터
        </motion.button>
      </motion.div>

      {/* 크레딧 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="absolute bottom-4 text-white/50 text-sm text-center"
      >
        <p>🤖 Generated with Claude Code</p>
      </motion.div>
    </div>
  )
}

export default EndingScreen
