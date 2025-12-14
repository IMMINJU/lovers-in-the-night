import { useState, useEffect } from 'react'

export function useTypingEffect(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    if (!text) {
      setIsComplete(true)
      return
    }

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  const skip = () => {
    setDisplayedText(text)
    setIsComplete(true)
  }

  return { displayedText, isComplete, skip }
}
