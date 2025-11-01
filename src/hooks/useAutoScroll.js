// Custom hook for smooth auto-scrolling functionality
import { useEffect, useRef, useCallback, useState } from 'react'

const useAutoScroll = (options = {}) => {
  const {
    speed = 1,
    direction = 1, // 1 for right/down, -1 for left/up
    pauseOnHover = true,
    enableDirectionalControl = false,
    leftThreshold = 0.3,
    rightThreshold = 0.7,
    speedMultiplier = 2
  } = options

  const containerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, isHovering: false })

  // Mouse position tracking for directional control
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !enableDirectionalControl) return
    
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const containerWidth = rect.width
    const normalizedX = Math.max(0, Math.min(1, relativeX / containerWidth))
    
    setMousePosition({
      x: normalizedX,
      isHovering: true
    })
  }, [enableDirectionalControl])

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
    if (enableDirectionalControl) {
      setMousePosition(prev => ({ ...prev, isHovering: true }))
    }
  }, [pauseOnHover, enableDirectionalControl])

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false)
    setMousePosition({ x: 0, isHovering: false })
  }, [])

  // Auto-scroll logic
  const scroll = useCallback(() => {
    if (!containerRef.current || isPaused) return

    const container = containerRef.current
    let scrollDirection = direction
    let scrollSpeed = speed

    // Apply directional control if enabled
    if (enableDirectionalControl && mousePosition.isHovering) {
      if (mousePosition.x < leftThreshold) {
        scrollDirection = -1
        scrollSpeed = speed * speedMultiplier
      } else if (mousePosition.x > rightThreshold) {
        scrollDirection = 1
        scrollSpeed = speed * speedMultiplier
      }
    }

    // Perform scroll
    container.scrollLeft += scrollDirection * scrollSpeed

    // Handle infinite loop (assuming duplicate content)
    const scrollWidth = container.scrollWidth / 2 // Assuming content is duplicated
    if (container.scrollLeft >= scrollWidth) {
      container.scrollLeft = 0
    } else if (container.scrollLeft < 0) {
      container.scrollLeft = scrollWidth - 1
    }

    animationFrameRef.current = requestAnimationFrame(scroll)
  }, [isPaused, direction, speed, enableDirectionalControl, mousePosition, leftThreshold, rightThreshold, speedMultiplier])

  // Start/stop scrolling
  const startScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    animationFrameRef.current = requestAnimationFrame(scroll)
  }, [scroll])

  const stopScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  // Effect to manage scrolling
  useEffect(() => {
    if (containerRef.current && !isPaused) {
      const timeout = setTimeout(startScroll, 1000) // Delay start
      return () => {
        clearTimeout(timeout)
        stopScroll()
      }
    }
    
    return stopScroll
  }, [isPaused, startScroll, stopScroll])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    containerRef,
    isPaused,
    mousePosition,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    startScroll,
    stopScroll,
    setIsPaused
  }
}

export default useAutoScroll