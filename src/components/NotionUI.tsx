import { motion } from 'framer-motion'

interface NotionDialogue {
  tasks?: string[]
  warnings?: string[]
  nextSteps?: string[]
}

interface NotionUIProps {
  dialogue: NotionDialogue
}

function NotionUI({ dialogue }: NotionUIProps) {
  const { tasks, warnings, nextSteps } = dialogue

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white text-black rounded-lg p-4 sm:p-6 mb-4 border border-gray-300 shadow-lg"
    >
      {/* Notion 헤더 */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className="text-2xl sm:text-3xl">📋</div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">작전 프로젝트: 서준 포섭</h2>
          <p className="text-xs sm:text-sm text-gray-500">Last edited: just now</p>
        </div>
      </div>

      {/* 완료된 작업 */}
      {tasks && tasks.length > 0 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h3 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
            <span>✅</span>
            <span>완료된 작업</span>
          </h3>
          <div className="bg-gray-50 rounded p-3 space-y-2">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                <input type="checkbox" checked readOnly className="mt-0.5" />
                <span className="line-through text-gray-500">{task}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 경고사항 */}
      {warnings && warnings.length > 0 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h3 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <span>주의사항</span>
          </h3>
          <div className="bg-orange-50 border-l-4 border-orange-400 rounded p-3 space-y-1">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-orange-900">
                <span>•</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 다음 스텝 */}
      {nextSteps && nextSteps.length > 0 && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>다음 목표</span>
          </h3>
          <div className="bg-blue-50 rounded p-3 space-y-2">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                <input type="checkbox" readOnly className="mt-0.5" />
                <span className="font-medium text-blue-900">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 계속하기 표시 */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-xs sm:text-sm"
        >
          ▼ 클릭하여 계속
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NotionUI
