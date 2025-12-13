import { useEffect, useCallback, useState } from 'react'
import GameContainer from './components/GameContainer'
import TitleScreen from './components/TitleScreen'
import EndingScreen from './components/EndingScreen'
import { useGameStore } from './store/gameStore'
import { useScriptStore } from './store/scriptStore'
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
const sceneMap = {
  scene1: scene1Data,
  scene2: scene2Data,
  scene3: scene3Data,
  scene4: scene4Data,
  scene5: scene5Data,
  scene6: scene6Data,
  scene7: scene7Data,
  scene8: scene8Data,
  scene9_a: scene9AData,
  scene9_b: scene9BData,
  scene9_c: scene9CData,
  scene10_a: scene10AData,
  scene10_b: scene10BData,
  scene10_c: scene10CData,
  scene11_a: scene11AData,
  scene11_b: scene11BData,
  scene11_c: scene11CData,
}

function App() {
  const { gameState, currentScene, setScene, setGameState, calculateEnding, suspicion, affection } = useGameStore()
  const { loadScript, setOnSceneEnd } = useScriptStore()
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // 이미지 프리로드
  useEffect(() => {
    const imagesToPreload = [
      // 배경
      '/images/backgrounds/room.png',
      '/images/backgrounds/cafe.png',
      '/images/backgrounds/park.png',
      '/images/backgrounds/cult.png',
      '/images/backgrounds/street.png',
      // 지우 표정
      '/images/characters/jiwoo-smile.png',
      '/images/characters/jiwoo-normal.png',
      '/images/characters/jiwoo-curious.png',
      '/images/characters/jiwoo-serious.png',
      '/images/characters/jiwoo-surprised.png',
      '/images/characters/jiwoo-shy.png',
      '/images/characters/jiwoo-worried.png',
      // 서준 표정
      '/images/characters/seojun-smile.png',
      '/images/characters/seojun-normal.png',
      '/images/characters/seojun-serious.png',
      '/images/characters/seojun-cold.png',
      '/images/characters/seojun-confused.png',
      // 기타
      '/images/characters/leader.png',
      '/images/characters/members.png',
      // 엔딩
      '/images/endings/ending-a.png',
      '/images/endings/ending-b.png',
      '/images/endings/ending-c.png',
      '/images/endings/ending-d.png',
      // 타이틀
      '/images/title-screen.jpg',
    ]

    let loadedCount = 0
    const totalImages = imagesToPreload.length

    imagesToPreload.forEach((src) => {
      const img = new Image()
      img.onload = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === totalImages) {
          setImagesLoaded(true)
        }
      }
      img.src = src
    })
  }, [])

  // 씬 전환 핸들러
  const handleSceneTransition = useCallback(() => {
    // 의심도 70 이상이면 즉시 D엔딩
    if (suspicion >= 70) {
      setGameState('ending')
      return
    }

    // 씬8 분기점 (첫 번째 분기)
    if (currentScene === 'scene8') {
      if (affection >= 50 && suspicion <= 20) {
        setScene('scene9_a') // A루트
        loadScript(sceneMap['scene9_a'])
      } else if (affection < 50 || suspicion > 35) {
        setScene('scene9_b') // B루트
        loadScript(sceneMap['scene9_b'])
      } else {
        setScene('scene9_c') // C루트
        loadScript(sceneMap['scene9_c'])
      }
      return
    }

    // 씬별 다음 씬 정의
    const nextSceneMap = {
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
      loadScript(sceneMap[nextScene])
    } else {
      // 더 이상 씬이 없으면 엔딩
      setGameState('ending')
    }
  }, [currentScene, suspicion, affection, setScene, setGameState, loadScript])

  // 씬 종료 콜백 등록
  useEffect(() => {
    setOnSceneEnd(handleSceneTransition)
  }, [setOnSceneEnd, handleSceneTransition])

  // 게임 시작시 현재 씬 로드
  useEffect(() => {
    if (gameState === 'playing' && currentScene && sceneMap[currentScene]) {
      loadScript(sceneMap[currentScene])
    }
  }, [gameState, currentScene, loadScript])

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center" style={{ height: '100dvh' }}>
      {!imagesLoaded ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-purple-300 text-sm">이미지 로딩 중...</p>
        </div>
      ) : (
        <>
          {gameState === 'title' && <TitleScreen />}
          {gameState === 'playing' && <GameContainer />}
          {gameState === 'ending' && <EndingScreen />}
        </>
      )}
    </div>
  )
}

export default App
