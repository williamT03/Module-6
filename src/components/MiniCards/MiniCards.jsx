import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useImageLoader from '../../hooks/useImageLoader'
import useHover from '../../hooks/useHover'
import useAnimeFormatters from '../../hooks/useAnimeFormatters'
import './MiniCards.css'

const MiniCards = ({ anime, onAddToWatchlist, isInWatchlist }) => {
  const navigate = useNavigate()
  
  // Custom hooks for functionality
  const { 
    imageUrl, 
    imageLoaded, 
    imageError, 
    handleImageLoad, 
    handleImageError 
  } = useImageLoader(anime)
  
  const { 
    isHovered, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useHover()
  
  const { 
    formattedScore, 
    formattedYear, 
    formattedType 
  } = useAnimeFormatters(anime)

  // Event handlers
  const handleMoreInfo = useCallback(() => {
    navigate(`/anime/${anime.mal_id}`)
  }, [navigate, anime.mal_id])

  const handleWatchlistClick = useCallback(() => {
    onAddToWatchlist(anime)
  }, [onAddToWatchlist, anime])

  return (
    <div 
      className="mini-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mini-card-content">
        <div className="mini-card-image-container">
          {!imageLoaded && !imageError && (
            <div className="mini-card-loading">
              <div className="mini-loading-spinner"></div>
            </div>
          )}
          {imageError ? (
            <div className="mini-card-placeholder">
              <span>No Image</span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={anime.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="mini-card-image"
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          )}
          
          {/* Hover overlay with buttons */}
          <div className="mini-card-overlay">
            <div className="mini-card-actions">
              <button 
                className={`btn-mini-watchlist ${isInWatchlist ? 'added' : ''} ${isInWatchlist && isHovered ? 'remove-mode' : ''}`}
                onClick={handleWatchlistClick}
                title={isInWatchlist ? (isHovered ? 'Click to remove from watchlist' : 'In watchlist') : 'Add to watchlist'}
              >
                {isInWatchlist ? (isHovered ? '✖' : '✓') : '+'}
              </button>
              <button 
                className="btn-mini-info"
                onClick={handleMoreInfo}
                title="More Info"
              >
                i
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Title display that appears with hover overlay */}
      {isHovered && (
        <div className="mini-card-title-display">
          <h3>{anime.title}</h3>
          <div className="mini-card-meta-info">
            <span className="mini-anime-year">{formattedYear}</span>
            <span className="mini-anime-score">★ {formattedScore}</span>
            <span className="mini-anime-type">{formattedType}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniCards