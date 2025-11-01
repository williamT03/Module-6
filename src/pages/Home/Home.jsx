import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWatchlist } from '../../contexts/WatchlistContext'
import useAnimeData from '../../hooks/useAnimeData'
import useSlideshow from '../../hooks/useSlideshow'
import useAutoScroll from '../../hooks/useAutoScroll'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import MiniCards from '../../components/MiniCards/MiniCards'
import Footer from '../../components/Footer/Footer'

const Home = () => {
  // Custom hooks for data fetching
  const {
    data: seasonalAnime,
    loading,
    fetchSeasonalAnime
  } = useAnimeData()
  
  const {
    data: popularAnime,
    loading: cardsLoading,
    fetchPopularAnime
  } = useAnimeData()

  // State management
  const [bannerAnime, setBannerAnime] = useState([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  
  // Refs and hooks
  const synopsisRef = useRef(null);
  const navigate = useNavigate();
  const { isAnimeInWatchlist, toggleWatchlist } = useWatchlist();

  // Hero slideshow hook
  const {
    currentSlide,
    goToSlide,
    currentItem: currentAnime
  } = useSlideshow(seasonalAnime, {
    autoplay: true,
    interval: 8000,
    loop: true
  })

  // Banner slideshow hook
  const {
    currentSlide: currentBannerSlide,
    goToSlide: goToBannerSlide,
    currentItem: currentBannerAnime
  } = useSlideshow(bannerAnime, {
    autoplay: true,
    interval: 5000,
    loop: true
  })

  // Auto-scroll hook for mini cards
  const {
    containerRef: scrollContainerRef,
    handleMouseMove: handleContainerMouseMove,
    handleMouseEnter: handleContainerMouseEnter,
    handleMouseLeave: handleContainerMouseLeave,
    setIsPaused
  } = useAutoScroll({
    speed: 1,
    direction: 1,
    pauseOnHover: false, // We'll handle this manually
    enableDirectionalControl: true,
    leftThreshold: 0.3,
    rightThreshold: 0.7,
    speedMultiplier: 2
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchSeasonalAnime()
    fetchPopularAnime()
  }, [fetchSeasonalAnime, fetchPopularAnime])

  // Set banner anime from seasonal data
  useEffect(() => {
    if (seasonalAnime.length > 0) {
      setBannerAnime(seasonalAnime.slice(0, 3));
      setBannerLoading(false);
    } else if (loading) {
      setBannerLoading(true);
    }
  }, [seasonalAnime, loading]);

  // Auto-scroll synopsis text
  useEffect(() => {
    if (!synopsisRef.current || !currentAnime?.synopsis) return;

    const element = synopsisRef.current;
    const shouldScroll = element.scrollHeight > element.clientHeight;
    if (!shouldScroll) return;

    let scrollInterval;
    let scrollDirection = 1;
    let currentScrollTop = 0;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        const maxScroll = element.scrollHeight - element.clientHeight;
        
        if (scrollDirection === 1) {
          currentScrollTop += 1;
          if (currentScrollTop >= maxScroll) {
            setTimeout(() => { scrollDirection = -1; }, 2000);
          }
        } else {
          currentScrollTop -= 1;
          if (currentScrollTop <= 0) {
            setTimeout(() => { scrollDirection = 1; }, 2000);
          }
        }
        element.scrollTop = currentScrollTop;
      }, 50); 
    };

    const timeout = setTimeout(startScrolling, 3000);
    return () => {
      clearTimeout(timeout);
      clearInterval(scrollInterval);
    };
  }, [currentAnime, currentSlide]);



  // Card hover handlers
  const handleCardMouseEnter = () => {
    setIsPaused(true);
  };

  const handleCardMouseLeave = () => {
    setIsPaused(false);
  };

  // Navigate to anime detail page
  const openMoreInfo = (anime) => {
    navigate(`/anime/${anime.mal_id}`);
  };

  return (
    <>
        <Navbar />
        <div className='home'> 
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-slideshow">
            {loading ? (
              <div className="hero-loading">Loading amazing anime adventures...</div>
            ) : (
              seasonalAnime.map((anime, index) => (
                <div
                  key={anime.mal_id}
                  className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    backgroundImage: `url(${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url})`
                  }}
                >
                  <div className="hero-overlay"></div>
                </div>
              ))
            )}
          </div>

          <div className="hero-content">
            {currentAnime && !loading && (
              <div className="current-anime-info">
                <h1>{currentAnime.title}</h1>
                <p 
                  ref={synopsisRef}
                  className="anime-synopsis"
                >
                  {currentAnime.synopsis || 'Welcome to AnimeVault! Your ultimate destination for discovering incredible anime series, building your perfect watchlist, and exploring the most popular shows from Japan and beyond!'}
                </p>
                
                <div className="hero-indicators">
                  {seasonalAnime.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>

                <div className="hero-actions">
                  <button 
                    className="btn-watchlist"
                    onClick={() => toggleWatchlist(currentAnime)}
                  >
                    {isAnimeInWatchlist(currentAnime.mal_id) 
                      ? 'Added to Watchlist!' 
                      : 'Add to My Watchlist'
                    }
                  </button>
                  
                  <button 
                    className="btn-more-info"
                    onClick={() => openMoreInfo(currentAnime)}
                  >
                    Explore Details
                  </button>
                </div>
              </div>
            )}
          </div>
           
        </div>

        {/* Banner Section */}
        <div className="hero-banner">
          {bannerLoading ? (
            <div className="banner-loading">
              <h2>Loading Seasonal Spotlight...</h2>
              <p>Discovering the newest anime releases for you!</p>
            </div>
          ) : bannerAnime.length > 0 && currentBannerAnime ? (
            <div className="banner-slideshow">
              <div className="banner-content">
                <div className="banner-poster">
                  <img 
                    src={currentBannerAnime.images?.jpg?.large_image_url || currentBannerAnime.images?.jpg?.image_url || "https://via.placeholder.com/300x400/4ecdc4/ffffff?text=Anime"} 
                    alt={currentBannerAnime.title || 'Anime'}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x400/4ecdc4/ffffff?text=Anime";
                    }}
                  />
                </div>
                <div className="banner-info">
                  <h2>Seasonal Anime Spotlight</h2>
                  <h3>{currentBannerAnime.title || 'Featured Anime'}</h3>
                  <div className="banner-synopsis">
                    <p>
                      {currentBannerAnime.synopsis || 'An exciting anime series that will captivate viewers with its unique story and stunning animation.'}
                    </p>
                  </div>
                  <div className="banner-meta">
                    <span className="rating">Rating: {currentBannerAnime.score || 'N/A'}</span>
                    <span className="year">Year: {currentBannerAnime.year || currentBannerAnime.aired?.prop?.from?.year || 'TBA'}</span>
                    <span className="episodes">Episodes: {currentBannerAnime.episodes || '?'}</span>
                  </div>
                  <button 
                    className="banner-btn"
                    onClick={() => toggleWatchlist(currentBannerAnime)}
                  >
                    {isAnimeInWatchlist(currentBannerAnime.mal_id) 
                      ? 'Added to Watchlist' 
                      : 'Add to Watchlist'
                    }
                  </button>
                </div>
              </div>
              
              {bannerAnime.length > 1 && (
                <div className="banner-indicators">
                  {bannerAnime.map((_, index) => (
                    <button
                      key={index}
                      className={`banner-indicator ${index === currentBannerSlide ? 'active' : ''}`}
                      onClick={() => goToBannerSlide(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="banner-fallback">
              <h2>Seasonal Anime Spotlight</h2>
              <p>Discover the newest anime releases and find your next favorite series!</p>
            </div>
          )}
        </div>

        {/* Showcase Section */}
        <div className="showcase-section">
          <div className="section-header">
            <h2> Trending Anime Universe </h2>
            <p>Explore the most-watched anime series! From legendary classics to viral sensations - these are the shows everyone's talking about! Hover over any card to see details and add to your watchlist!</p>
          </div>
          
          {cardsLoading ? (
            <div className="anime-cards-loading">
              <div className="loading-spinner"></div>
              <span>Loading trending anime collection...</span>
            </div>
          ) : (
            <div className="mini-cards-horizontal-container">
              <div className="edge-gradient-left"></div>
              <div className="edge-gradient-right"></div>
              <div 
                className="mini-cards-scroll"
                ref={scrollContainerRef}
                onMouseMove={handleContainerMouseMove}
                onMouseEnter={handleContainerMouseEnter}
                onMouseLeave={handleContainerMouseLeave}
              >
                {popularAnime.map((anime) => (
                  <div
                    key={`first-${anime.mal_id}`}
                    className="mini-card-wrapper"
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <MiniCards
                      anime={anime}
                      onAddToWatchlist={() => toggleWatchlist(anime)}
                      isInWatchlist={isAnimeInWatchlist(anime.mal_id)}
                    />
                  </div>
                ))}
                
                {popularAnime.map((anime) => (
                  <div
                    key={`second-${anime.mal_id}`}
                    className="mini-card-wrapper"
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <MiniCards
                      anime={anime}
                      onAddToWatchlist={() => toggleWatchlist(anime)}
                      isInWatchlist={isAnimeInWatchlist(anime.mal_id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </div>
    <Footer />
    </>
  )
}

export default Home