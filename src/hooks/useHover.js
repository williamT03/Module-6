// Custom hook for hover interactions and mouse tracking
import { useState, useCallback, useRef, useEffect } from 'react'

const useHover = (options = {}) => {
  const { 
    delay = 0, 
    onEnter, 
    onLeave,
    trackMouse = false 
  } = options

  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef(null)
  const elementRef = useRef(null)

  const handleMouseEnter = useCallback((e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(true)
        if (onEnter) onEnter(e)
      }, delay)
    } else {
      setIsHovered(true)
      if (onEnter) onEnter(e)
    }
  }, [delay, onEnter])

  const handleMouseLeave = useCallback((e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsHovered(false)
    if (onLeave) onLeave(e)
  }, [onLeave])

  const handleMouseMove = useCallback((e) => {
    if (!trackMouse || !elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const relativeY = e.clientY - rect.top
    
    setMousePosition({
      x: relativeX / rect.width, // Normalized (0-1)
      y: relativeY / rect.height, // Normalized (0-1)
      absoluteX: relativeX,
      absoluteY: relativeY,
      rect
    })
  }, [trackMouse])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Bind handlers to element ref
  const bindHover = useCallback((element) => {
    if (element) {
      elementRef.current = element
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
      
      if (trackMouse) {
        element.addEventListener('mousemove', handleMouseMove)
      }

      // Return cleanup function
      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
        
        if (trackMouse) {
          element.removeEventListener('mousemove', handleMouseMove)
        }
      }
    }
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove, trackMouse])

  return {
    isHovered,
    mousePosition,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    bindHover,
    elementRef
  }
}

export default useHover