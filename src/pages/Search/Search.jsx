import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWatchlist } from '../../contexts/WatchlistContext'
import { useToast } from '../../hooks/useToast'
import './Search.css'
import AnimeCard from '../../components/AnimeCard/AnimeCard'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Toast from '../../components/Toast/Toast'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const { addToWatchlist, isAnimeInWatchlist, toggleWatchlist } = useWatchlist()
  const { toasts, showToast, hideToast } = useToast()

  // Handle watchlist toggle with toast notification
  const handleWatchlistToggle = (anime) => {
    const result = toggleWatchlist(anime)
    showToast(result.message, result.type)
  }

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    genre: searchParams.get('genre') || '',
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    rating: searchParams.get('rating') || '',
    score: searchParams.get('score') || '',
    orderBy: searchParams.get('orderBy') || 'popularity',
    sortDirection: searchParams.get('sort') || 'desc'
  })

  // Predefined filter options with proper genre IDs
  const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' },
    { id: 4, name: 'Comedy' },
    { id: 8, name: 'Drama' },
    { id: 10, name: 'Fantasy' },
    { id: 14, name: 'Horror' },
    { id: 7, name: 'Mystery' },
    { id: 22, name: 'Romance' },
    { id: 24, name: 'Sci-Fi' },
    { id: 36, name: 'Slice of Life' },
    { id: 30, name: 'Sports' },
    { id: 37, name: 'Supernatural' },
    { id: 41, name: 'Thriller' },
    { id: 27, name: 'Shounen' },
    { id: 25, name: 'Shoujo' },
    { id: 28, name: 'Seinen' },
    { id: 26, name: 'Josei' },
    { id: 35, name: 'Harem' },
    { id: 9, name: 'Ecchi' },
    { id: 39, name: 'Detective' }
  ]

  const animeTypes = [
    { value: '', label: 'All Types' },
    { value: 'tv', label: 'TV Series' },
    { value: 'movie', label: 'Movie' },
    { value: 'ova', label: 'OVA' },
    { value: 'special', label: 'Special' },
    { value: 'ona', label: 'ONA' },
    { value: 'music', label: 'Music Video' }
  ]

  const statusOptions = [
    { value: 'airing', label: 'Currently Airing' },
    { value: 'complete', label: 'Completed' },
    { value: 'upcoming', label: 'Upcoming' }
  ]

  const ratingOptions = [
    { value: 'g', label: 'G - All Ages' },
    { value: 'pg', label: 'PG - Children' },
    { value: 'pg13', label: 'PG-13 - Teens 13+' },
    { value: 'r17', label: 'R - 17+ Violence & Profanity' },
    { value: 'r', label: 'R+ - Mild Nudity' }
  ]

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'score', label: 'Score' },
    { value: 'scored_by', label: 'Most Scored' },
    { value: 'rank', label: 'Rank' },
    { value: 'title', label: 'Title' },
    { value: 'start_date', label: 'Release Date' },
    { value: 'end_date', label: 'End Date' }
  ]

  // Search function
  const searchAnime = async (page = 1, resetResults = true) => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      if (filters.query.trim()) {
        params.append('q', filters.query.trim())
      }
      if (filters.genre) {
        params.append('genres', filters.genre)
      }
      if (filters.type) {
        params.append('type', filters.type)
      }
      if (filters.status) {
        params.append('status', filters.status)
      }
      if (filters.rating) {
        params.append('rating', filters.rating)
      }
      if (filters.score) {
        params.append('min_score', filters.score)
      }
      if (filters.orderBy) {
        params.append('order_by', filters.orderBy)
        params.append('sort', filters.sortDirection)
      }

      const response = await fetch(`https://api.jikan.moe/v4/anime?${params}`)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      
      if (resetResults) {
        setSearchResults(data.data || [])
      } else {
        setSearchResults(prev => [...prev, ...(data.data || [])])
      }
      
      setHasNextPage(data.pagination?.has_next_page || false)
      setCurrentPage(page)
      
    } catch (error) {
      console.error('Error searching anime:', error)
      if (resetResults) {
        setSearchResults([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    }
    setFilters(newFilters)
    setCurrentPage(1)
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val !== '') {
        if (key === 'sortDirection') {
          newSearchParams.set('sort', val)
        } else {
          newSearchParams.set(key === 'query' ? 'q' : key, val)
        }
      }
    })
    setSearchParams(newSearchParams)
  }

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    searchAnime(1, true)
  }

  // Load more results
  const loadMore = () => {
    if (!loading && hasNextPage) {
      searchAnime(currentPage + 1, false)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      query: '',
      genre: '',
      type: '',
      status: '',
      rating: '',
      score: '',
      orderBy: 'popularity',
      sortDirection: 'desc'
    }
    setFilters(clearedFilters)
    setSearchResults([])
    setCurrentPage(1)
    // Also clear URL parameters
    setSearchParams({})
  }

  // Auto-search when filters change (with debounce for query, immediate for others)
  useEffect(() => {
    if (filters.query) {
      // Debounce text search
      const timeoutId = setTimeout(() => {
        searchAnime(1, true)
      }, 500)
      return () => clearTimeout(timeoutId)
    } else {
      // Immediate search for dropdown filters or initial load
      searchAnime(1, true)
    }
  }, [filters])

  // Initial load on component mount
  useEffect(() => {
    // Load popular anime by default on first mount
    if (searchResults.length === 0) {
      searchAnime(1, true)
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="search-page">
        <div className="search-container">
          <div className="search-header">
            <h1>Discover Anime</h1>
            <p>Search and filter through thousands of anime series and movies</p>
          </div>

          {/* Search and Filters Section */}
          <div className="search-filters-section">
            <form onSubmit={handleSearch} className="search-form-main">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search anime by title..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="search-input-main"
                />
                <button type="submit" className="search-btn-main">
                  Search
                </button>
              </div>
            </form>

            <div className="filters-grid">
              {/* Genre Filter */}
              <div className="filter-group">
                <label>Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="filter-group">
                <label>Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="filter-select"
                >
                  {animeTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <label>Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any Rating</option>
                  {ratingOptions.map(rating => (
                    <option key={rating.value} value={rating.value}>{rating.label}</option>
                  ))}
                </select>
              </div>

              {/* Minimum Score Filter */}
              <div className="filter-group">
                <label>Minimum Score</label>
                <select
                  value={filters.score}
                  onChange={(e) => handleFilterChange('score', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any Score</option>
                  <option value="9">9.0+</option>
                  <option value="8">8.0+</option>
                  <option value="7">7.0+</option>
                  <option value="6">6.0+</option>
                  <option value="5">5.0+</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="filter-group">
                <label>Sort By</label>
                <select
                  value={filters.orderBy}
                  onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map(sort => (
                    <option key={sort.value} value={sort.value}>{sort.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
              <div className="sort-direction">
                <label>
                  <input
                    type="radio"
                    name="sortDirection"
                    value="desc"
                    checked={filters.sortDirection === 'desc'}
                    onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                  />
                  Descending
                </label>
                <label>
                  <input
                    type="radio"
                    name="sortDirection"
                    value="asc"
                    checked={filters.sortDirection === 'asc'}
                    onChange={(e) => handleFilterChange('sortDirection', e.target.value)}
                  />
                  Ascending
                </label>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="search-results-section">
            <div className="results-header">
              <h2>Search Results</h2>
              <span className="results-count">
                {searchResults.length} anime found
              </span>
            </div>

            {loading && searchResults.length === 0 ? (
              <div className="search-loading">
                <div className="loading-spinner-large"></div>
                <p>Searching anime...</p>
              </div>
            ) : (
              <>
                <div className="anime-grid">
                  {searchResults.map((anime) => (
                    <AnimeCard
                      key={anime.mal_id}
                      anime={anime}
                      onAddToWatchlist={() => handleWatchlistToggle(anime)}
                      isInWatchlist={isAnimeInWatchlist(anime.mal_id)}
                    />
                  ))}
                </div>

                {searchResults.length === 0 && !loading && (
                  <div className="no-results">
                    <h3>No anime found</h3>
                    <p>Try adjusting your search criteria or clearing filters</p>
                  </div>
                )}

                {hasNextPage && (
                  <div className="load-more-section">
                    <button 
                      onClick={loadMore} 
                      disabled={loading}
                      className="load-more-btn"
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  )
}

export default Search
