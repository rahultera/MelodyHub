import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpotifyArtistList.css';

// Top Spotify Artist IDs
const TOP_ARTIST_IDS = [
  "5FlDRCUWkwAXFZ6ynO0U2P",
  "1Xyo4u8uXC1ZmMpatF05PJ",
  "6eUKZXaKkcviH0Ku9w2n3V",
  "3TVXtAsR1Inumwj472S9r4",
  "66CXWjxzNUsdJxJ2JdwvnR",
  "1uNFoZAHBGtllmzznpCI3s",
];

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://melodyhub-icod.onrender.com'
  : '';

const SpotifyArtistList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTopArtists();
  }, []);

  const fetchTopArtists = async () => {
    try {
      const response = await axios.get(`https://melodyhub-icod.onrender.com/api/spotify/artists?ids=${TOP_ARTIST_IDS.join(',')}`);
      setTopArtists(response.data);
    } catch (err) {
      console.error('Failed to load top artists:', err);
    }
  };

  const fetchArtists = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://melodyhub-icod.onrender.com/api/spotify/search?query=${query}`);
      setArtists(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load artists.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArtists(searchQuery);
  };

  return (
    <div className="artist-container">
      <h2 className="artist-title">🎤 Search for Spotify Artists</h2>

      <form
        onSubmit={handleSearch}
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter artist name..."
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            width: '220px',
            border: '1px solid #1DB954',
            fontSize: '0.9rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: '#1DB954',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            width: 'auto',
            minWidth: 'auto',
          }}
        >
          🔍 Search
        </button>
      </form>

      {loading && <p className="artist-message">Loading artists...</p>}
      {error && <p className="artist-message" style={{ color: 'red' }}>{error}</p>}

      <div className="artist-grid">
        {(artists.length > 0 ? artists : topArtists).map((artist) => (
          <div key={artist.id} className="artist-card">
            {artist.images[0] && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
              />
            )}
            <h3 className="artist-name">{artist.name}</h3>
            <p className="artist-genres">
              {artist.genres.length > 0 ? artist.genres.join(', ') : 'Unknown genres'}
            </p>
            <p className="artist-popularity">🔥 {artist.popularity}</p>
            <a
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="artist-link"
            >
              View on Spotify →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotifyArtistList;
