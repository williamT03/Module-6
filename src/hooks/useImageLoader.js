// Custom hook for image loading states
import { useState, useCallback, useMemo } from 'react'

const useImageLoader = (anime) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Memoized image URL
  const imageUrl = useMemo(() => 
    anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url,
    [anime?.images]
  )

  // Event handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoaded(true)
  }, [])

  // Reset function for new anime
  const resetImageState = useCallback(() => {
    setImageLoaded(false)
    setImageError(false)
  }, [])

  return {
    imageUrl,
    imageLoaded,
    imageError,
    handleImageLoad,
    handleImageError,
    resetImageState,
    isLoading: !imageLoaded && !imageError
  }
}

export default useImageLoader