// Custom hook for anime formatting utilities
import { useMemo } from 'react'

const useAnimeFormatters = (anime) => {
  // Format score with fallback
  const formattedScore = useMemo(() => 
    anime?.score ? anime.score.toFixed(1) : 'N/A',
    [anime?.score]
  )

  // Format genres text
  const genresText = useMemo(() => {
    if (!anime?.genres || anime.genres.length === 0) return 'No genres listed'
    return anime.genres.slice(0, 3).map(genre => genre.name).join(', ')
  }, [anime?.genres])

  // Format year
  const formattedYear = useMemo(() => 
    anime?.year || anime?.aired?.prop?.from?.year || 'N/A',
    [anime?.year, anime?.aired]
  )

  // Format episode count
  const formattedEpisodes = useMemo(() => {
    const episodes = anime?.episodes
    if (!episodes) return 'Unknown'
    return episodes === 1 ? '1 Episode' : `${episodes} Episodes`
  }, [anime?.episodes])

  // Format status
  const formattedStatus = useMemo(() => 
    anime?.status || 'Unknown',
    [anime?.status]
  )

  // Format type
  const formattedType = useMemo(() => 
    anime?.type || 'Unknown',
    [anime?.type]
  )

  // Format duration
  const formattedDuration = useMemo(() => {
    const duration = anime?.duration
    if (!duration) return 'Unknown'
    
    // Convert duration string to more readable format
    const minutes = duration.match(/(\d+) min/)
    if (minutes) {
      const mins = parseInt(minutes[1])
      if (mins >= 60) {
        const hours = Math.floor(mins / 60)
        const remainingMins = mins % 60
        return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
      }
      return `${mins} min`
    }
    
    return duration
  }, [anime?.duration])

  // Format rating (age rating)
  const formattedRating = useMemo(() => 
    anime?.rating?.replace(/\s*-.*/, '') || 'Not Rated',
    [anime?.rating]
  )

  // Format synopsis with length limit
  const formattedSynopsis = useMemo(() => {
    const synopsis = anime?.synopsis
    if (!synopsis) return 'No synopsis available'
    
    // Return full text - truncation can be handled at component level
    return synopsis.replace(/\[Written by.*\]/g, '').trim()
  }, [anime?.synopsis])

  // Format source
  const formattedSource = useMemo(() => 
    anime?.source || 'Unknown',
    [anime?.source]
  )

  // Check if anime is currently airing
  const isAiring = useMemo(() => 
    anime?.status === 'Currently Airing' || anime?.airing === true,
    [anime?.status, anime?.airing]
  )

  // Get display title (prefer English if available)
  const displayTitle = useMemo(() => {
    if (anime?.title_english && anime.title_english !== anime?.title) {
      return anime.title_english
    }
    return anime?.title || 'Unknown Title'
  }, [anime?.title, anime?.title_english])

  // Get alternative titles
  const alternativeTitles = useMemo(() => {
    const titles = []
    if (anime?.title_japanese && anime.title_japanese !== anime?.title) {
      titles.push({ type: 'Japanese', title: anime.title_japanese })
    }
    if (anime?.title_english && anime.title_english !== anime?.title) {
      titles.push({ type: 'English', title: anime.title_english })
    }
    return titles
  }, [anime?.title, anime?.title_japanese, anime?.title_english])

  return {
    formattedScore,
    genresText,
    formattedYear,
    formattedEpisodes,
    formattedStatus,
    formattedType,
    formattedDuration,
    formattedRating,
    formattedSynopsis,
    formattedSource,
    isAiring,
    displayTitle,
    alternativeTitles
  }
}

export default useAnimeFormatters