// Custom hook for anime data fetching with loading states and error handling
import { useState, useEffect, useCallback } from 'react'

const useAnimeData = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generic fetch function
  const fetchAnime = useCallback(async (url, options = {}) => {
    const { 
      delay = 0, 
      onSuccess,
      onError,
      transform = (data) => data?.data || [] 
    } = options

    try {
      setLoading(true)
      setError(null)
      
      // Add delay if specified (useful for UX)
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const transformedData = transform(result)
      
      setData(transformedData)
      
      // Call success callback if provided
      if (onSuccess) onSuccess(transformedData)
      
      return transformedData
    } catch (err) {
      console.error('Error fetching anime data:', err)
      setError(err.message)
      
      // Call error callback if provided
      if (onError) onError(err)
      
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Specific fetch functions for common endpoints
  const fetchSeasonalAnime = useCallback((limit = 10) => {
    return fetchAnime(`https://api.jikan.moe/v4/seasons/now?limit=${limit}`)
  }, [fetchAnime])

  const fetchPopularAnime = useCallback((limit = 20) => {
    return fetchAnime(
      `https://api.jikan.moe/v4/top/anime?type=tv&filter=bypopularity&limit=${limit}`,
      { delay: 1000 } // Add delay for better UX
    )
  }, [fetchAnime])

  const fetchAnimeDetails = useCallback((id) => {
    return fetchAnime(
      `https://api.jikan.moe/v4/anime/${id}/full`,
      { transform: (data) => data?.data }
    )
  }, [fetchAnime])

  const fetchSearchResults = useCallback((query, filters = {}) => {
    const params = new URLSearchParams({
      q: query,
      ...filters
    })
    return fetchAnime(`https://api.jikan.moe/v4/anime?${params.toString()}`)
  }, [fetchAnime])

  // Clear data function
  const clearData = useCallback(() => {
    setData([])
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    fetchAnime,
    fetchSeasonalAnime,
    fetchPopularAnime,
    fetchAnimeDetails,
    fetchSearchResults,
    clearData,
    hasData: data.length > 0,
    isEmpty: !loading && data.length === 0
  }
}

export default useAnimeData