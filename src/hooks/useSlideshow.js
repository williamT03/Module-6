// Custom hook for slideshow functionality
import { useState, useEffect, useCallback, useRef } from 'react'

const useSlideshow = (items = [], options = {}) => {
  const {
    autoplay = true,
    interval = 5000,
    loop = true,
    pauseOnHover = true
  } = options

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  const itemCount = items.length

  // Navigate to specific slide
  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < itemCount) {
      setCurrentSlide(index)
    }
  }, [itemCount])

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => {
      if (loop) {
        return (prev + 1) % itemCount
      }
      return prev < itemCount - 1 ? prev + 1 : prev
    })
  }, [itemCount, loop])

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => {
      if (loop) {
        return prev === 0 ? itemCount - 1 : prev - 1
      }
      return prev > 0 ? prev - 1 : prev
    })
  }, [itemCount, loop])

  // Pause/resume slideshow
  const pause = useCallback(() => setIsPaused(true), [])
  const resume = useCallback(() => setIsPaused(false), [])

  // Auto-advance slideshow
  useEffect(() => {
    if (!autoplay || isPaused || itemCount === 0) return

    intervalRef.current = setInterval(nextSlide, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoplay, isPaused, itemCount, interval, nextSlide])

  // Handle hover pause
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      pause()
    }
  }, [pauseOnHover, pause])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      resume()
    }
  }, [pauseOnHover, resume])

  // Reset slide when items change
  useEffect(() => {
    if (currentSlide >= itemCount && itemCount > 0) {
      setCurrentSlide(0)
    }
  }, [itemCount, currentSlide])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    currentSlide,
    isPaused,
    goToSlide,
    nextSlide,
    prevSlide,
    pause,
    resume,
    handleMouseEnter,
    handleMouseLeave,
    isFirst: currentSlide === 0,
    isLast: currentSlide === itemCount - 1,
    hasItems: itemCount > 0,
    currentItem: items[currentSlide] || null
  }
}

export default useSlideshow