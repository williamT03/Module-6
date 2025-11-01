import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useImageLoader from '../../hooks/useImageLoader'
import useHover from '../../hooks/useHover'
import useAnimeFormatters from '../../hooks/useAnimeFormatters'
import './AnimeCards.css'

const AnimeCard = ({ anime, onAddToWatchlist, isInWatchlist }) => {
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
    isHovered: isHovering, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useHover()
  
  const { 
    formattedScore, 
    genresText, 
    formattedStatus, 
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
      className="anime-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="anime-card-image">
        {!imageLoaded && !imageError && (
          <div className="anime-card-loading">
            <div className="loading-spinner"></div>
          </div>
        )}
        {imageError ? (
          <div className="anime-card-placeholder">
            <span>No Image</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={anime.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}
      </div>

      <div className="anime-card-content">
        <h3 className="anime-card-title" title={anime.title}>
          {anime.title}
        </h3>
        
        <div className="anime-card-meta">
          <div className="anime-card-score">
            <span className="score-label">Score:</span>
            <span className="score-value">{formattedScore}</span>
          </div>
          <div className="anime-card-status">
            <span className="status-badge">{formattedStatus}</span>
          </div>
        </div>

        <div className="anime-card-genres">
          <span className="genres-text">{genresText}</span>
        </div>

        <div className="anime-card-actions-main">
          <button 
            className={`btn-main-watchlist ${isInWatchlist ? 'added' : ''} ${isInWatchlist && isHovering ? 'remove-mode' : ''}`}
            onClick={handleWatchlistClick}
            title={isInWatchlist ? (isHovering ? 'Click to remove from watchlist' : 'In watchlist') : 'Add to watchlist'}
          >
            {isInWatchlist ? (isHovering ? '✖ Remove' : '✓ Added') : '+ Add'}
          </button>
          
          <button 
            className="btn-main-info"
            onClick={handleMoreInfo}
          >
            More Info
          </button>
        </div>

        <div className="anime-card-footer">
          <div className="anime-card-year">
            {formattedYear}
          </div>
          <div className="anime-card-type">
            {formattedType}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimeCard