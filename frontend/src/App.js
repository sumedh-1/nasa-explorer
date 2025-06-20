import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Apod from './pages/apod/Apod';
import MarsRover from './pages/marsRover/MarsRover';
import Neo from './pages/neo/Neo';
import Footer from './components/Footer/Footer';

import { getUserPreferences, setUserPreferences } from './services/userService/userService';

function App() {
  const [theme, setTheme] = useState('light'); // default until fetched

  // Fetch theme preference from backend on mount
  useEffect(() => {
    async function fetchTheme() {
      try {
        const data = await getUserPreferences();
        if (data.preferences && data.preferences.theme) {
          setTheme(data.preferences.theme);
          document.documentElement.setAttribute('data-theme', data.preferences.theme);
          return;
        }
      } catch {}
      document.documentElement.setAttribute('data-theme', 'light');
    }
    fetchTheme();
  }, []);

  // Always update DOM when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Only POST to backend when toggling theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setUserPreferences({ theme: newTheme });
  };



  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-logo">🚀 NASA Explorer</div>
          <div className="navbar-right">
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/apod">APOD</Link></li>
              <li><Link to="/mars">Mars Rover</Link></li>
              <li><Link to="/neo">NEO</Link></li>
            </ul>
            <div className="navbar-separator" />
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light/dark theme">
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </nav>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apod" element={<Apod />} />
            <Route path="/mars" element={<MarsRover />} />
            <Route path="/neo" element={<Neo />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
