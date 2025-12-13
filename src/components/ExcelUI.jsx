import { motion } from 'framer-motion'

function ExcelUI({ dialogue }) {
  // scene2 형식: content.filename, content.row
  // scene6~8 형식: character, data (2d array), note
  const isScene2Format = dialogue.content?.row
  const isDataArrayFormat = dialogue.data

  let displayTitle, displayHeaders, displayRows, displayNote

  if (isScene2Format) {
    // scene2 형식
    displayTitle = dialogue.content.filename || '포섭 대상 관리'
    const row = dialogue.content.row
    displayHeaders = Object.keys(row)
    displayRows = [Object.values(row)]
    displayNote = null
  } else if (isDataArrayFormat) {
    // scene6~8 형식 (data는 2차원 배열)
    displayTitle = dialogue.character ? `${dialogue.character}의 기록` : '분석 보고서'
    displayHeaders = dialogue.data[0] // 첫 행이 헤더
    displayRows = dialogue.data.slice(1) // 나머지가 데이터
    displayNote = dialogue.note
  } else {
    // 기존 형식
    displayTitle = dialogue.title || '포섭 대상 분석 보고서'
    displayHeaders = dialogue.headers
    displayRows = dialogue.rows
    displayNote = dialogue.summary
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white text-black rounded-lg p-4 sm:p-6 mb-4 border border-gray-300 shadow-lg overflow-x-auto"
    >
      {/* Excel 헤더 */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className="text-2xl sm:text-3xl">📊</div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{displayTitle}</h2>
          <p className="text-xs sm:text-sm text-gray-500">Excel Worksheet</p>
        </div>
      </div>

      {/* Excel 테이블 */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <div className="border border-gray-300 rounded overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="bg-green-600 text-white font-bold" style={{ display: 'grid', gridTemplateColumns: `repeat(${displayHeaders?.length || 4}, 1fr)` }}>
            {displayHeaders && displayHeaders.map((header, index) => (
              <div
                key={index}
                className="px-2 sm:px-4 py-2 border-r border-green-700 last:border-r-0 text-xs sm:text-sm text-center"
              >
                {header}
              </div>
            ))}
          </div>

          {/* 테이블 행 */}
          {displayRows && displayRows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + rowIndex * 0.1 }}
              className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              style={{ display: 'grid', gridTemplateColumns: `repeat(${displayHeaders?.length || 4}, 1fr)` }}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="px-2 sm:px-4 py-2 border-r border-b border-gray-300 last:border-r-0 text-xs sm:text-sm text-center"
                >
                  {cell}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 요약/메모 */}
      {displayNote && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3"
        >
          <h3 className="text-sm sm:text-base font-bold mb-1 flex items-center gap-2">
            <span>💡</span>
            <span>메모</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-700">{displayNote}</p>
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

export default ExcelUI
