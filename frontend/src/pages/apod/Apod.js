import React, { useState } from 'react';
import Accordion from '../../components/Accordion/Accordion';
import './Apod.css';
import { useEffect } from 'react';
import { getAiSummary, getApod } from '../../services/nasaService/nasaService';
import { getFavorites, setFavorites } from '../../services/userService/userService';
import content from '../../content/content.json';

const Apod = () => {
  const [apodData, setApodData] = useState(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [apodError, setApodError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favorites, setFavoritesState] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const randomFact = content.funFacts.apod[Math.floor(Math.random() * content.funFacts.apod.length)];

  useEffect(() => {
    async function fetchApodAndFavorites() {
      setApodLoading(true);
      setApodError('');
      try {
        const data = await getApod();
        setApodData(data);
        // Fetch favorites from backend
        const favData = await getFavorites('apod');
        const favs = Array.isArray(favData.favorites) ? favData.favorites : [];
        setFavoritesState(favs);
        setFavorited(favs.includes(data.date));
      } catch (err) {
        setApodError('Unable to load Astronomy Picture of the Day. Please try again later.');
      }
      setApodLoading(false);
    }
    fetchApodAndFavorites();
  }, []);

  const handleFavorite = async () => {
    if (!apodData?.date) return;
    const favArr = Array.isArray(favorites) ? favorites : [];
    let newFavorites = [];
    if (favorited) {
      newFavorites = favArr.filter(date => date !== apodData.date);
    } else {
      newFavorites = [...favArr, apodData.date];
    }
    setFavoritesState(newFavorites);
    setFavorited(!favorited);
    await setFavorites('apod', newFavorites);
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Page link copied to clipboard!');
  };

  const handleSummarize = async () => {
    // Always keep accordion open on retry
    if (!showSummary) {
      setShowSummary(true);
    }
    setSummary('');
    setError('');
    setLoading(true);
    setLoading(true);
    setError('');
    setSummary('');
    try {
      if (!apodData || !apodData.explanation) {
        setError('No explanation available to summarize.');
        setLoading(false);
        return;
      }
      const res = await getAiSummary({ text: apodData.explanation, provider: 'huggingface' });
      let data = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError('Sorry, we could not understand the AI response.');
        setLoading(false);
        return;
      }
      if (res.status === 404) {
        setError('The AI summary service is not available. Please check your backend setup.');
      } else if (res.ok && data.summary) {
        setSummary(data.summary);
      } else if (data && data.error) {
        setError('Sorry, we could not generate a summary for this explanation.');
      } else {
        setError('Unexpected error: Unable to get a summary.');
      }
    } catch (err) {
      setError('Our AI summary service is currently unavailable. Please try again later.');
    }
    setLoading(false);
  };

  if (apodLoading) {
    return <div className="apod-page"><p>Loading Astronomy Picture of the Day...</p></div>;
  }
  if (apodError) {
    return <div className="apod-page"><p style={{ color: 'crimson' }}>{apodError}</p></div>;
  }
  if (!apodData) {
    return <div className="apod-page"><p>No APOD data available.</p></div>;
  }
  return (
    <div className="apod-page">
      <div className="apod-hero">
        <h2>{apodData.title}</h2>
        <div className="apod-meta">
          <span>{new Date(apodData.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          {apodData.copyright && <span> | © {apodData.copyright}</span>}
        </div>
      </div>
      <div className="apod-image-section">
        <img
          src={apodData.url}
          alt={apodData.title}
          className="apod-main-image"
          onClick={() => setShowModal(true)}
          style={{ cursor: 'zoom-in' }}
        />
        <div className="apod-actions">
          <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer" className="apod-hd-link">View HD</a>
          <button className="apod-action-btn" onClick={handleShare}>Share</button>
          <button className="apod-action-btn" onClick={handleFavorite}>{favorited ? '★ Favorited' : '☆ Favorite'}</button>
          <button
            className="apod-action-btn"
            onClick={() => {
              if (showSummary) {
                setShowSummary(false);
              } else {
                handleSummarize();
              }
            }}
            disabled={loading}
          >
            {showSummary ? 'Hide AI Summary' : (loading ? 'Summarizing...' : 'Summarize for me')}
          </button>
        </div>
        {showModal && (
          <div className="apod-modal" onClick={() => setShowModal(false)}>
            <img src={apodData.hdurl} alt={apodData.title} className="apod-modal-img" />
          </div>
        )}
      </div>
      <Accordion title="Explanation" defaultOpen={true}>
        <p>{apodData.explanation}</p>
      </Accordion>
      {showSummary && (
        <Accordion title="AI Summary" defaultOpen={true}>
          {loading && <p><em>Generating summary...</em></p>}
          {error && (
            <div style={{ color: 'crimson', margin: '1rem 0' }}>
              <em>{error}</em>
              <br />
              <button className="apod-action-btn" onClick={handleSummarize} style={{ marginTop: '0.5rem' }}>
                Retry
              </button>
            </div>
          )}
          {!loading && !error && !summary && (
            <p style={{ color: '#888' }}><em>No summary available for this explanation.</em></p>
          )}
          {summary && <p>{summary}</p>}
        </Accordion>
      )}
      <div className="apod-fun-fact">
        <em>{randomFact}</em>
      </div>
    </div>
  );
};

export default Apod;
