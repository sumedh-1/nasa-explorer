import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './MarsRover.css';
import { getMarsPhotos } from '../../services/nasaService/nasaService';
import { getFavorites, setFavorites } from '../../services/userService/userService';
import content from '../../content/content.json';

const MarsRover = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalImg, setModalImg] = useState(null);
  const [favorites, setFavoritesState] = useState({});
  const [roverFilter, setRoverFilter] = useState(null);
  const [cameraFilter, setCameraFilter] = useState(null);
  const [solFilter, setSolFilter] = useState('');
  const randomFact = content.funFacts.mars[Math.floor(Math.random() * content.funFacts.mars.length)];

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      setError('');
      try {
        const data = await getMarsPhotos();
        setPhotos(data.photos || []);
      } catch (err) {
        setError('Unable to load Mars Rover photos. Please try again later.');
      }
      setLoading(false);
    }
    fetchPhotos();
  }, []);

  // Filter on frontend
  const filteredPhotos = photos.filter(photo => {
    if (roverFilter && photo.rover?.name !== roverFilter.value) return false;
    if (cameraFilter && photo.camera?.name !== cameraFilter.value) return false;
    if (solFilter && String(photo.sol) !== String(solFilter)) return false;
    return true;
  });

  // Fetch Mars favorites from backend on mount
  useEffect(() => {
    async function fetchMarsFavorites() {
      try {
        const favData = await getFavorites('mars');
        setFavoritesState(
          Array.isArray(favData.favorites)
            ? Object.fromEntries(favData.favorites.map(id => [id, true]))
            : {}
        );
      } catch {}
    }
    fetchMarsFavorites();
  }, []);

  // Get all unique rovers/cameras from photo data
  const rovers = Array.from(new Set(photos.map(p => p.rover?.name).filter(Boolean)));
  const roverOptions = rovers.map(r => ({ value: r, label: r }));
  const cameras = Array.from(new Set(photos.map(p => p.camera?.name).filter(Boolean)));
  const cameraOptions = cameras.map(c => ({ value: c, label: c }));

  const toggleFavorite = async (id) => {
    let newFavorites = { ...favorites };
    if (newFavorites[id]) {
      delete newFavorites[id];
    } else {
      newFavorites[id] = true;
    }
    setFavoritesState(newFavorites);
    // Save to backend
    await setFavorites('mars', Object.keys(newFavorites));
  };

  if (loading) return <div className="mars-page"><p>Loading Mars Rover photos...</p></div>;
  if (error) return <div className="mars-page"><p style={{ color: 'crimson' }}>{error}</p></div>;
  if (!photos.length) return <div className="mars-page"><p>No Mars Rover photos available.</p></div>;

  return (
    <div className="mars-page">
      <div className="mars-header">
        <h2>Mars Rover Photos</h2>
        <div className="mars-controls">
          <div style={{ minWidth: 170, marginRight: 8 }}>
            <Select
              className="mars-select"
              options={[{ value: '', label: 'All Rovers' }, ...roverOptions]}
              value={roverFilter || { value: '', label: 'All Rovers' }}
              onChange={setRoverFilter}
              placeholder="All Rovers"
              isClearable
              aria-label="Filter by rover"
              styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <div style={{ minWidth: 170, marginRight: 8 }}>
            <Select
              className="mars-select"
              options={[{ value: '', label: 'All Cameras' }, ...cameraOptions]}
              value={cameraFilter || { value: '', label: 'All Cameras' }}
              onChange={setCameraFilter}
              placeholder="All Cameras"
              isClearable
              aria-label="Filter by camera"
              styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <div className="mars-sol-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="mars-sol-input"
              type="number"
              min="0"
              placeholder="e.g. 1000 (Martian day)"
              aria-label="Filter by Sol (Martian day)"
              value={solFilter}
              onChange={e => setSolFilter(e.target.value)}
              style={{ width: 170 }}
            />
            <span
              className="mars-sol-tooltip"
              style={{ marginLeft: 6, color: 'var(--color-link-hover)', cursor: 'pointer', fontSize: '1.2em' }}
              title="Sol = Martian day of the rover mission. Enter a number like 1000 to see photos from that day."
            >
              ⓘ
            </span>
          </div>
        </div>
      </div>
      <div className="mars-grid">
        {filteredPhotos.map(photo => (
          <div className="mars-card" key={photo.id}>
            <img
              src={photo.img_src}
              alt={`Mars by ${photo.rover?.name || 'Rover'}`}
              onClick={() => setModalImg(photo.img_src)}
            />
            <div className="mars-meta">
              <span><strong>Rover:</strong> {photo.rover?.name}</span>
              <span><strong>Camera:</strong> {photo.camera?.full_name || photo.camera?.name}</span>
              <span><strong>Earth Date:</strong> {photo.earth_date}</span>
              <span><strong>Sol:</strong> {photo.sol}</span>
              <button
                className="mars-favorite-btn"
                onClick={() => toggleFavorite(photo.id)}
                style={{ background: favorites[photo.id] ? 'var(--color-link-hover)' : undefined, color: favorites[photo.id] ? '#fff' : undefined }}
              >
                {favorites[photo.id] ? '★ Favorited' : '☆ Favorite'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {modalImg && (
        <div className="mars-modal" onClick={() => setModalImg(null)}>
          <img src={modalImg} alt="Mars large" className="mars-modal-img" />
        </div>
      )}
      <div className="mars-fun-fact">
        <em>{randomFact}</em>
      </div>
    </div>
  );
};

export default MarsRover;
