import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './contexts/WatchlistContext'
import Home from './pages/Home/Home'
import Search from './pages/Search/Search'
import Anime from './pages/Anime/Anime'
import Watchlist from './pages/Watchlist/Watchlist'
import './App.css'

const App = () => {
  return (
    <WatchlistProvider>
      <Router basename="/Module-6">
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/anime/:id" element={<Anime />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </div>
      </Router>
    </WatchlistProvider>
  )
}

export default App