import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios';
import './Cast-Form.css'
import { useParams } from 'react-router-dom';

function CastForm() {
  const [query, setQuery] = useState('Robert Downey Jr.');
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [listcasts, setListCasts] = useState([]);
  const [error, setError] = useState(null); //set Error State
  let { tmdbId } = useParams();

  const handleSearchPerson = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${tmdbId}/credits?language=en-US`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGY0ZjFlMmNhODQ1ZjA3NWY5MmI5ZDRlMGY3ZTEwYiIsIm5iZiI6MTcyOTkyNjY3NC40NzIwOTksInN1YiI6IjY3MTM3ODRmNjUwMjQ4YjlkYjYxZTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RRJNLOg8pmgYoomiCWKtwkw74T3ZtAs7ZScqxo1bzWg',
        },
      })
      setCast(response.data.cast);
      setCrew(response.data.crew);
    } catch (error) {
      console.error('Error fetching cast data:', error);
      setError('Failed to fetch cast data. Please try again.');
    } finally {

    }
  }

  useEffect(() => {
    handleSearchPerson()
  }, [tmdbId]);

  return (
    <div className='cast-box'>
      <div className='Cast-View-Box'>
        <h3>Cast Box</h3>
      </div>
      <div className='Search-Box'>
        <h3>Search Box</h3>
        <input />
      </div>
    </div>
  )
}

export default CastForm