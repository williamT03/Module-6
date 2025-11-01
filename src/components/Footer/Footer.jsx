import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-content'>
          {/* Logo and Description */}
          <div className='footer-section'>
            <h3 className='footer-logo'>AnimeVault</h3>
            <p className='footer-description'>
              Your ultimate destination for discovering incredible anime series, 
              building the perfect watchlist, and exploring the best shows from Japan and beyond.
            </p>
            <div className='footer-social'>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">TW</a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">DC</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GH</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='footer-section'>
            <h4>Quick Links</h4>
            <ul className='footer-links'>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search?orderBy=popularity&sort=desc">Popular Anime</Link></li>
              <li><Link to="/search?status=airing">Currently Airing</Link></li>
              <li><Link to="/watchlist">My Watchlist</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className='footer-section'>
            <h4>Categories</h4>
            <ul className='footer-links'>
              <li><Link to="/search?genre=1">Action</Link></li>
              <li><Link to="/search?genre=22">Romance</Link></li>
              <li><Link to="/search?genre=4">Comedy</Link></li>
              <li><Link to="/search?genre=8">Drama</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className='footer-section'>
            <h4>Resources</h4>
            <ul className='footer-links'>
              <li><Link to="/search?type=movie">Movies</Link></li>
              <li><a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer">Jikan API</a></li>
              <li><Link to="/search?status=upcoming">Upcoming Anime</Link></li>
              <li><Link to="/search?score=9">Top Rated</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='footer-bottom'>
          <div className='footer-divider'></div>
          <div className='footer-bottom-content'>
            <p>&copy; 2024 AnimeVault. All rights reserved.</p>
            <p>Data provided by <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer">Jikan API</a></p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer