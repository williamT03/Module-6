import React from 'react'
import { useWatchlist } from '../../contexts/WatchlistContext'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import AnimeCard from '../../components/AnimeCard/AnimeCard'
import './Watchlist.css'

const Watchlist = () => {
  const { watchlist, toggleWatchlist, isAnimeInWatchlist, clearWatchlist } = useWatchlist()

  return (
    <>
      <Navbar />
      <div className="watchlist-page">
        <div className="watchlist-container">
          <div className="watchlist-header">
            <h1>My Watchlist</h1>
            <p>Keep track of anime you want to watch ({watchlist.length} anime)</p>
            {watchlist.length > 0 && (
              <button onClick={clearWatchlist} className="clear-watchlist-btn">
                Clear All
              </button>
            )}
          </div>

          {watchlist.length === 0 ? (
            <div className="empty-watchlist">
              <h2>Your watchlist is empty</h2>
              <p>Add some anime from the search page to get started!</p>
            </div>
          ) : (
            <div className="watchlist-grid">
              {watchlist.map((anime) => (
                <AnimeCard
                  key={anime.mal_id}
                  anime={anime}
                  onAddToWatchlist={() => toggleWatchlist(anime)}
                  isInWatchlist={isAnimeInWatchlist(anime.mal_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Watchlist