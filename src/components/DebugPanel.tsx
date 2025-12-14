import { useGameStore } from '../store/gameStore'

type StatType = 'affection' | 'suspicion' | 'reverseSuspicion'

function DebugPanel() {
  const {
    debugMode,
    affection,
    suspicion,
    reverseSuspicion,
    currentScene,
    choiceHistory,
    trackedChoices,
    lieDetections,
    toggleDebugMode,
    updateGauges,
  } = useGameStore()

  if (!debugMode) return null

  const handleStatChange = (stat: StatType, amount: number) => {
    if (stat === 'affection') {
      updateGauges(amount, 0, 0)
    } else if (stat === 'suspicion') {
      updateGauges(0, amount, 0)
    } else if (stat === 'reverseSuspicion') {
      updateGauges(0, 0, amount)
    }
  }

  return (
    <div className="fixed top-16 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg border border-green-500 text-xs font-mono max-w-sm max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-500">
        <h3 className="text-green-400 font-bold">🐛 DEBUG MODE</h3>
        <button
          onClick={toggleDebugMode}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>

      {/* 현재 씬 */}
      <div className="mb-3 pb-2 border-b border-gray-700">
        <div className="text-yellow-400 mb-1">Current Scene:</div>
        <div className="text-white">{currentScene}</div>
      </div>

      {/* 스탯 */}
      <div className="mb-3 pb-2 border-b border-gray-700">
        <div className="text-yellow-400 mb-2">Stats:</div>

        {/* Affection */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-pink-400">Affection:</span>
            <span className="text-white font-bold">{affection}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleStatChange('affection', -10)}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
            >
              -10
            </button>
            <button
              onClick={() => handleStatChange('affection', -5)}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
            >
              -5
            </button>
            <button
              onClick={() => handleStatChange('affection', +5)}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
            >
              +5
            </button>
            <button
              onClick={() => handleStatChange('affection', +10)}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
            >
              +10
            </button>
          </div>
        </div>

        {/* Suspicion */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-red-400">Suspicion:</span>
            <span className="text-white font-bold">{suspicion}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleStatChange('suspicion', -10)}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
            >
              -10
            </button>
            <button
              onClick={() => handleStatChange('suspicion', -5)}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
            >
              -5
            </button>
            <button
              onClick={() => handleStatChange('suspicion', +5)}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
            >
              +5
            </button>
            <button
              onClick={() => handleStatChange('suspicion', +10)}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
            >
              +10
            </button>
          </div>
        </div>

        {/* Reverse Suspicion */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-orange-400">Reverse Suspicion:</span>
            <span className="text-white font-bold">{reverseSuspicion}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleStatChange('reverseSuspicion', -10)}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
            >
              -10
            </button>
            <button
              onClick={() => handleStatChange('reverseSuspicion', -5)}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs"
            >
              -5
            </button>
            <button
              onClick={() => handleStatChange('reverseSuspicion', +5)}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
            >
              +5
            </button>
            <button
              onClick={() => handleStatChange('reverseSuspicion', +10)}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs"
            >
              +10
            </button>
          </div>
        </div>
      </div>

      {/* 선택 기록 */}
      <div className="mb-3 pb-2 border-b border-gray-700">
        <div className="text-yellow-400 mb-1">
          Choice History ({choiceHistory.length}):
        </div>
        <div className="max-h-32 overflow-y-auto text-[10px] text-gray-300">
          {choiceHistory.length === 0 ? (
            <div className="text-gray-500">No choices yet</div>
          ) : (
            choiceHistory.slice(-5).map((choice, i) => (
              <div key={i} className="mb-1">
                {choice.sceneId}: {choice.choiceId}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 거짓말 추적 */}
      <div className="mb-3 pb-2 border-b border-gray-700">
        <div className="text-yellow-400 mb-1">Tracked Choices:</div>
        <div className="max-h-32 overflow-y-auto text-[10px] text-gray-300">
          {Object.keys(trackedChoices).length === 0 ? (
            <div className="text-gray-500">None</div>
          ) : (
            Object.entries(trackedChoices).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="text-blue-400">{key}:</span> {value}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 거짓말 탐지 */}
      <div>
        <div className="text-yellow-400 mb-1">
          Lie Detections ({lieDetections.length}):
        </div>
        <div className="max-h-32 overflow-y-auto text-[10px] text-gray-300">
          {lieDetections.length === 0 ? (
            <div className="text-gray-500">None</div>
          ) : (
            lieDetections.map((lie, i) => (
              <div key={i} className="mb-1 text-red-400">
                {lie.sceneId}: {lie.category} (+{lie.penalty})
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DebugPanel
