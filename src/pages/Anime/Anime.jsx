import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWatchlist } from '../../contexts/WatchlistContext'
import { useToast } from '../../hooks/useToast'
import useAnimeData from '../../hooks/useAnimeData'
import useAnimeFormatters from '../../hooks/useAnimeFormatters'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Toast from '../../components/Toast/Toast'
import './Anime.css'

const Anime = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toggleWatchlist, isAnimeInWatchlist } = useWatchlist()
  const { toasts, showToast, hideToast } = useToast()
  
  // Use custom hooks for data fetching
  const { 
    data: anime, 
    loading, 
    error, 
    fetchAnimeDetails 
  } = useAnimeData()
  
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch anime details using the custom hook
  useEffect(() => {
    if (id) {
      fetchAnimeDetails(id)
    }
  }, [id, fetchAnimeDetails])

  // Use anime formatters hook
  const {
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
  } = useAnimeFormatters(anime)



  // Memoized handlers
  const handleWatchlistToggle = useCallback(() => {
    if (!anime) return
    const result = toggleWatchlist(anime)
    showToast(result.message, result.type)
  }, [anime, toggleWatchlist, showToast])

  const handleGoBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  // Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const formatDuration = useCallback((duration) => {
    if (!duration) return 'Unknown'
    return duration.replace('per ep', '').trim()
  }, [])

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="anime-detail-page">
          <div className="anime-detail-loading">
            <div className="loading-spinner-large"></div>
            <p>Loading anime details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="anime-detail-page">
          <div className="anime-detail-error">
            <h2>Anime Not Found</h2>
            <p>{error}</p>
            <button onClick={handleGoBack} className="btn-back">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // No anime data
  if (!anime) {
    return (
      <>
        <Navbar />
        <div className="anime-detail-page">
          <div className="anime-detail-error">
            <h2>No Anime Data</h2>
            <p>Unable to load anime information.</p>
            <button onClick={handleGoBack} className="btn-back">
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="anime-detail-page">
        {/* Hero Section */}
        <div className="anime-hero-section">
          <div className="anime-hero-background">
            <img 
              src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
              alt={anime.title}
              className="anime-hero-bg"
            />
            <div className="anime-hero-overlay"></div>
          </div>
          
          <div className="anime-hero-content">
            <button onClick={handleGoBack} className="btn-back-hero">
              ← Back
            </button>
            
            <div className="anime-hero-main">
              <div className="anime-poster">
                <img 
                  src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                  alt={anime.title}
                  className="anime-poster-image"
                />
              </div>
              
              <div className="anime-hero-info">
                <h1 className="anime-title">{anime.title}</h1>
                {anime.title_english && anime.title_english !== anime.title && (
                  <h2 className="anime-title-english">{anime.title_english}</h2>
                )}
                
                <div className="anime-meta-row">
                  <div className="anime-score">
                    <span className="score-icon">★</span>
                    <span className="score-value">{anime.score ? anime.score.toFixed(1) : 'N/A'}</span>
                    <span className="score-count">({anime.scored_by ? anime.scored_by.toLocaleString() : 0} users)</span>
                  </div>
                  
                  <div className="anime-rank">
                    <span className="rank-label">Rank:</span>
                    <span className="rank-value">#{anime.rank || 'N/A'}</span>
                  </div>
                  
                  <div className="anime-popularity">
                    <span className="popularity-label">Popularity:</span>
                    <span className="popularity-value">#{anime.popularity || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="anime-quick-info">
                  <span className="info-badge">{anime.type || 'TV'}</span>
                  <span className="info-badge">{anime.status || 'Unknown'}</span>
                  <span className="info-badge">{anime.episodes ? `${anime.episodes} Episodes` : 'Unknown Episodes'}</span>
                  <span className="info-badge">{anime.year || 'Unknown Year'}</span>
                </div>
                
                <div className="anime-actions">
                  <button 
                    onClick={handleWatchlistToggle}
                    className={`btn-watchlist-main ${isAnimeInWatchlist(anime.mal_id) ? 'added' : ''}`}
                  >
                    {isAnimeInWatchlist(anime.mal_id) ? '✓ In Watchlist' : '+ Add to Watchlist'}
                  </button>
                  
                  <button 
                    onClick={() => window.open(anime.url, '_blank')}
                    className="btn-mal-link"
                  >
                    View on MyAnimeList
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="anime-content-section">
          <div className="anime-content-container">
            <div className="anime-tabs">
              <button 
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`tab-btn ${activeTab === 'characters' ? 'active' : ''}`}
                onClick={() => setActiveTab('characters')}
              >
                Characters
              </button>
            </div>

            <div className="anime-tab-content">
              {activeTab === 'overview' && (
                <div className="tab-panel">
                  <div className="anime-synopsis">
                    <h3>Synopsis</h3>
                    <p>{anime.synopsis || 'No synopsis available.'}</p>
                  </div>
                  
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="anime-genres">
                      <h3>Genres</h3>
                      <div className="genres-list">
                        {anime.genres.map((genre) => (
                          <span key={genre.mal_id} className="genre-tag">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {anime.themes && anime.themes.length > 0 && (
                    <div className="anime-themes">
                      <h3>Themes</h3>
                      <div className="themes-list">
                        {anime.themes.map((theme) => (
                          <span key={theme.mal_id} className="theme-tag">
                            {theme.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="tab-panel">
                  <div className="anime-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{anime.type || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Episodes:</span>
                      <span className="detail-value">{anime.episodes || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{anime.status || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Aired:</span>
                      <span className="detail-value">
                        {formatDate(anime.aired?.from)} to {formatDate(anime.aired?.to)}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{formatDuration(anime.duration)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Rating:</span>
                      <span className="detail-value">{anime.rating || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Source:</span>
                      <span className="detail-value">{anime.source || 'N/A'}</span>
                    </div>
                    
                    {anime.studios && anime.studios.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Studio:</span>
                        <span className="detail-value">
                          {anime.studios.map(studio => studio.name).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {anime.producers && anime.producers.length > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">Producers:</span>
                        <span className="detail-value">
                          {anime.producers.map(producer => producer.name).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'characters' && (
                <div className="tab-panel">
                  <div className="characters-placeholder">
                    <h3>Characters & Voice Actors</h3>
                    <p>Character information would be loaded here in a full implementation.</p>
                    <p>This would require additional API calls to fetch character data.</p>
                  </div>
                </div>
              )}
            </div>
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

export default Anime