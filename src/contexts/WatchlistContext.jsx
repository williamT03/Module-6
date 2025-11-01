import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WatchlistContext = createContext()

export const useWatchlist = () => {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([])

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('animeWatchlist')
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist))
      }
    } catch (error) {
      console.error('Error loading watchlist from localStorage:', error)
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('animeWatchlist', JSON.stringify(watchlist))
    } catch (error) {
      console.error('Error saving watchlist to localStorage:', error)
    }
  }, [watchlist])

  // Memoized functions
  const isAnimeInWatchlist = useCallback((animeId) => {
    return watchlist.some(anime => anime.mal_id === animeId)
  }, [watchlist])

  const addToWatchlist = useCallback((anime) => {
    if (!isAnimeInWatchlist(anime.mal_id)) {
      setWatchlist(prev => [...prev, anime])
      return true
    }
    return false
  }, [isAnimeInWatchlist])

  const removeFromWatchlist = useCallback((animeId) => {
    setWatchlist(prev => prev.filter(anime => anime.mal_id !== animeId))
    return true
  }, [])

  const toggleWatchlist = useCallback((anime) => {
    if (isAnimeInWatchlist(anime.mal_id)) {
      removeFromWatchlist(anime.mal_id)
      return { 
        action: 'removed', 
        inWatchlist: false, 
        message: `"${anime.title}" removed from watchlist`,
        type: 'remove'
      }
    } else {
      addToWatchlist(anime)
      return { 
        action: 'added', 
        inWatchlist: true, 
        message: `"${anime.title}" added to watchlist`,
        type: 'success'
      }
    }
  }, [isAnimeInWatchlist, addToWatchlist, removeFromWatchlist])

  const clearWatchlist = useCallback(() => {
    setWatchlist([])
  }, [])

  const getWatchlistCount = useCallback(() => {
    return watchlist.length
  }, [watchlist.length])

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isAnimeInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    getWatchlistCount
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}

export default WatchlistContext