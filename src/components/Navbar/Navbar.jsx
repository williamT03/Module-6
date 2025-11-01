import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useWatchlist } from '../../contexts/WatchlistContext'
import './Navbar.css'

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const { getWatchlistCount } = useWatchlist()
  const navigate = useNavigate()

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate('/search')
    }
  }, [searchTerm, navigate])

  const handleSearchInputChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <nav>
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="logo-link">
              <h2>AnimeVault</h2>
            </Link>
            <ul className="nav-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search?type=tv&orderBy=popularity">Popular</Link></li>
              <li><Link to="/search?status=airing">Seasonal</Link></li>
              <li><Link to="/watchlist">Watchlist ({getWatchlistCount()})</Link></li>
            </ul>
          </div>
          
          <div className="nav-right">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              <button type="submit" className="search-btn">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar