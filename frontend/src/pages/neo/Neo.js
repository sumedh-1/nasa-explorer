import React, { useEffect, useState } from 'react';
import './Neo.css';
import { getNeoFeed } from '../../services/nasaService/nasaService';
import { getFavorites, setFavorites } from '../../services/userService/userService';
import content from '../../content/content.json';

function formatNumber(num) {
  return num ? num.toLocaleString() : '-';
}

const Neo = () => {
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalNeo, setModalNeo] = useState(null);
  const [favorites, setFavoritesState] = useState([]);
  const randomFact = content.funFacts.neo[Math.floor(Math.random() * content.funFacts.neo.length)];

  useEffect(() => {
    async function fetchNeosAndFavorites() {
      setLoading(true);
      setError('');
      try {
        const data = await getNeoFeed();
        // Flatten NEOs from NASA feed structure
        let allNeos = [];
        if (data.near_earth_objects) {
          Object.values(data.near_earth_objects).forEach(arr => {
            allNeos.push(...arr);
          });
        }
        setNeos(allNeos);
        // Fetch NEO favorites from backend
        const favData = await getFavorites('neo');
        setFavoritesState(Array.isArray(favData.favorites) ? favData.favorites : []);
      } catch (err) {
        setError('Unable to load Near Earth Object data. Please try again later.');
      }
      setLoading(false);
    }
    fetchNeosAndFavorites();
  }, []);

  if (loading) return <div className="neo-page"><p>Loading Near Earth Objects...</p></div>;
  if (error) return <div className="neo-page"><p style={{ color: 'crimson' }}>{error}</p></div>;
  if (!neos.length) return <div className="neo-page"><p>No NEOs found for today.</p></div>;

  const toggleFavorite = async (id) => {
    const favArr = Array.isArray(favorites) ? favorites : [];
    let newFavorites = favArr.includes(id)
      ? favArr.filter(fav => fav !== id)
      : [...favArr, id];
    setFavoritesState(newFavorites);
    await setFavorites('neo', newFavorites);
  };


  return (
    <div className="neo-page">
      <div className="neo-header">
        <h2>Near Earth Objects (Today)</h2>
      </div>
      <table className="neo-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Diameter (m)</th>
            <th>Closest Approach</th>
            <th>Velocity (km/h)</th>
            <th>Hazardous?</th>
            <th>★</th>
          </tr>
        </thead>
        <tbody>
          {neos.map(neo => {
            const approach = neo.close_approach_data?.[0] || {};
            const hazardous = neo.is_potentially_hazardous_asteroid;
            return (
              <tr
                key={neo.id}
                className={hazardous ? 'hazardous' : ''}
                onClick={() => setModalNeo(neo)}
                style={{ cursor: 'pointer' }}
              >
                <td className="neo-name">
                  <a href={neo.nasa_jpl_url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{neo.name}</a>
                </td>
                <td>
                  {formatNumber(Math.round(neo.estimated_diameter.meters.estimated_diameter_min))}
                  {' - '}
                  {formatNumber(Math.round(neo.estimated_diameter.meters.estimated_diameter_max))}
                </td>
                <td>
                  {approach.close_approach_date_full || approach.close_approach_date}<br/>
                  <span style={{ fontSize: '0.95em', color: '#888' }}>
                    {formatNumber(Math.round(approach.miss_distance?.kilometers))} km
                    {approach.miss_distance ? ` / ${formatNumber(Math.round(approach.miss_distance.lunar))} LD` : ''}
                  </span>
                </td>
                <td>
                  {approach.relative_velocity ? formatNumber(Math.round(approach.relative_velocity.kilometers_per_hour)) : '-'}
                </td>
                <td style={{ color: hazardous ? '#ff3300' : 'inherit', fontWeight: hazardous ? 700 : 400 }}>
                  {hazardous ? <span className="neo-hazard">⚠️ Yes</span> : 'No'}
                </td>
                <td onClick={e => { e.stopPropagation(); toggleFavorite(neo.id); }} style={{ textAlign: 'center', fontSize: '1.2em', cursor: 'pointer' }}>
                  {favorites.includes(neo.id) ? '★' : '☆'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {modalNeo && (
        <div className="neo-modal" onClick={() => setModalNeo(null)}>
          <div className="neo-modal-content" onClick={e => e.stopPropagation()}>
            <h3>{modalNeo.name}</h3>
            <p><strong>NASA JPL Link:</strong> <a href={modalNeo.nasa_jpl_url} target="_blank" rel="noopener noreferrer">View Details</a></p>
            <p><strong>Estimated Diameter:</strong> {formatNumber(Math.round(modalNeo.estimated_diameter.meters.estimated_diameter_min))} - {formatNumber(Math.round(modalNeo.estimated_diameter.meters.estimated_diameter_max))} meters</p>
            <p><strong>Closest Approach:</strong> {modalNeo.close_approach_data?.[0]?.close_approach_date_full || modalNeo.close_approach_data?.[0]?.close_approach_date}</p>
            <p><strong>Miss Distance:</strong> {modalNeo.close_approach_data?.[0]?.miss_distance?.kilometers} km / {modalNeo.close_approach_data?.[0]?.miss_distance?.lunar} LD</p>
            <p><strong>Relative Velocity:</strong> {modalNeo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour} km/h</p>
            <p><strong>Hazardous:</strong> {modalNeo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</p>
            <p><strong>Absolute Magnitude:</strong> {modalNeo.absolute_magnitude_h}</p>
          </div>
        </div>
      )}
      <div className="neo-fact">
        <em>{randomFact}</em>
      </div>
    </div>
  );
};

export default Neo;
