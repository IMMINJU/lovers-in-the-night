import { useEffect, useCallback } from 'react'
import GameContainer from './components/GameContainer'
import TitleScreen from './components/TitleScreen'
import EndingScreen from './components/EndingScreen'
import { useGameStore } from './store/gameStore'
import { useScriptStore } from './store/scriptStore'
import type { ScriptData } from './types'
import scene1Data from './data/scene1.json'
import scene2Data from './data/scene2.json'
import scene3Data from './data/scene3.json'
import scene4Data from './data/scene4.json'
import scene5Data from './data/scene5.json'
import scene6Data from './data/scene6.json'
import scene7Data from './data/scene7.json'
import scene8Data from './data/scene8.json'
import scene9AData from './data/scene9_a.json'
import scene9BData from './data/scene9_b.json'
import scene9CData from './data/scene9_c.json'
import scene10AData from './data/scene10_a.json'
import scene10BData from './data/scene10_b.json'
import scene10CData from './data/scene10_c.json'
import scene11AData from './data/scene11_a.json'
import scene11BData from './data/scene11_b.json'
import scene11CData from './data/scene11_c.json'

// 씬 데이터 맵
const sceneMap: Record<string, ScriptData> = {
  scene1: scene1Data as ScriptData,
  scene2: scene2Data as ScriptData,
  scene3: scene3Data as ScriptData,
  scene4: scene4Data as ScriptData,
  scene5: scene5Data as ScriptData,
  scene6: scene6Data as ScriptData,
  scene7: scene7Data as ScriptData,
  scene8: scene8Data as ScriptData,
  scene9_a: scene9AData as ScriptData,
  scene9_b: scene9BData as ScriptData,
  scene9_c: scene9CData as ScriptData,
  scene10_a: scene10AData as ScriptData,
  scene10_b: scene10BData as ScriptData,
  scene10_c: scene10CData as ScriptData,
  scene11_a: scene11AData as ScriptData,
  scene11_b: scene11BData as ScriptData,
  scene11_c: scene11CData as ScriptData,
}

function App() {
  const { gameState, currentScene, setScene, setGameState, suspicion } = useGameStore()
  const { loadScript, setOnSceneEnd } = useScriptStore()

  // 씬 전환 핸들러
  const handleSceneTransition = useCallback(() => {
    // 의심도 75 이상이면 즉시 D엔딩 (들통) - 실수로 실패하지 않도록 높게 설정
    if (suspicion >= 75) {
      setGameState('ending')
      return
    }

    // 씬8 분기점 (첫 번째 분기)
    // 의심도가 핵심 분기 기준 (호감도는 최소 67이므로 항상 충족)
    if (currentScene === 'scene8') {
      if (suspicion <= 58) {
        setScene('scene9_a') // A루트 - 낮은 의심도 (27-58) → A엔딩 가능
        loadScript(sceneMap['scene9_a']!)
      } else if (suspicion >= 68) {
        setScene('scene9_b') // B루트 - 높은 의심도 (68-74) → B엔딩
        loadScript(sceneMap['scene9_b']!)
      } else {
        setScene('scene9_c') // C루트 - 중간 의심도 (59-67) → C엔딩 최적
        loadScript(sceneMap['scene9_c']!)
      }
      return
    }

    // 씬별 다음 씬 정의
    const nextSceneMap: Record<string, string> = {
      scene1: 'scene2',
      scene2: 'scene3',
      scene3: 'scene4',
      scene4: 'scene5',
      scene5: 'scene6',
      scene6: 'scene7',
      scene7: 'scene8',
      // scene8은 위에서 분기 처리
      scene9_a: 'scene10_a',
      scene9_b: 'scene10_b',
      scene9_c: 'scene10_c',
      scene10_a: 'scene11_a',
      scene10_b: 'scene11_b',
      scene10_c: 'scene11_c',
      // scene11_a/b/c는 엔딩으로
    }

    const nextScene = nextSceneMap[currentScene]

    if (nextScene && sceneMap[nextScene]) {
      // 다음 씬으로 이동
      setScene(nextScene)
      loadScript(sceneMap[nextScene]!)
    } else {
      // 더 이상 씬이 없으면 엔딩
      setGameState('ending')
    }
  }, [currentScene, suspicion, setScene, setGameState, loadScript])

  // 씬 종료 콜백 등록
  useEffect(() => {
    setOnSceneEnd(handleSceneTransition)
  }, [setOnSceneEnd, handleSceneTransition])

  // 게임 시작시 현재 씬 로드
  useEffect(() => {
    if (gameState === 'playing' && currentScene && sceneMap[currentScene]) {
      loadScript(sceneMap[currentScene]!)
    }
  }, [gameState, currentScene, loadScript])

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center" style={{ height: '100dvh' }}>
      {gameState === 'title' && <TitleScreen />}
      {gameState === 'playing' && <GameContainer />}
      {gameState === 'ending' && <EndingScreen />}
    </div>
  )
}

export default App
