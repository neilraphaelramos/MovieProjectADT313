import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../../../../utils/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faL } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Cast-Form.css';
import { useParams } from 'react-router-dom';

function CastForm() {
  const { auth } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [cast, setCast] = useState([]);
  const [castid, setCastId] = useState(undefined);
  const [selectedcast, setSelectedCast] = useState({})
  const [error, setError] = useState(null);
  const [notfound, setNotFound] = useState(false);
  const nameRef = useRef()
  const characterNameRef = useRef()
  const urlRef = useRef()
  let { movieId } = useParams();

  function getAll(movieId) {
    axios({
      method: 'get',
      url: `/movies/${movieId}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        setCast(response.data.casts);
      })
      .catch((error) => {
        console.error("Error fetching casts:", error.response.data);
      });
  }

  useEffect(() => {
    getAll(movieId)
  }, [movieId]);

  const handleSearchPerson = useCallback(async (page = 1) => {
    try {
      const response = await axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=${page}`,
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGY0ZjFlMmNhODQ1ZjA3NWY5MmI5ZDRlMGY3ZTEwYiIsIm5iZiI6MTcyOTkyNjY3NC40NzIwOTksInN1YiI6IjY3MTM3ODRmNjUwMjQ4YjlkYjYxZTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RRJNLOg8pmgYoomiCWKtwkw74T3ZtAs7ZScqxo1bzWg'
        },
      });

      if (response.data.results.lenght === 0) {
        console.log("Not Found");
        setNotFound(true);
        setSelectedCast([])
      } else {
        setSelectedCast(response.data.results[0]);
        console.log(response.data.results);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  }, [query])

  const handlesave = async () => {
    try {
      const datacast = {
        userId: auth.user.userId,
        movieId: movieId,
        name: selectedcast.name,
        url: `https://image.tmdb.org/t/p/original/${selectedcast.profile_path}`,
        characterName: selectedcast.characterName,
      }
      await axios({
        method: 'POST',
        url: '/admin/casts',
        data: datacast,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        }
      });
      alert('Added Success');
      setSelectedCast({});
      getAll(movieId)
    } catch (error) {
      console.log(error);
    }
  }

  const castupdate = async (id) => {
    axios({
      method: 'get',
      url: `/admin/casts/${id}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        setCast(response.data.casts);
      })
      .catch((error) => {
        console.error("Error fetching casts:", error.response.data);
      });
  }


  const handledelete = (id) => {
    const isConfirm = window.confirm("Are you Sure to Delete Cast?");
    
    if (isConfirm) {
      axios({
        method: 'delete',
        url: `/admin/casts/${id}`,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
        .then(() => {
          console.log("Database Updated");
          getAll(movieId);
          alert("Delete Success");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className='cast-box'>
      <div className='Cast-View-Box'>
        <div className='card-display-cast'>
          {cast.map((actor) => (
            <div key={actor.id} className="card">
              <div className='buttons-group'>
                <button
                  type='button'
                  className='delete-button'
                  onClick={() => handledelete(actor.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button
                  type='button'
                  className='edit-button'
                  onClick={() => castupdate(actor.id)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
              <img src={actor.url} alt={actor.name} style={{ width: '100%' }} className='image-casts' />
              <div className="container">
                <h4><b>{actor.name}</b></h4>
                <p>{actor.characterName}</p>
                <div className="button-group">
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='Search-Box'>
        {castid === undefined && (
          <>
            <div className='search-box-btn'>
              <input
                className='input-search-person'
                type='text'
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedCast({})
                }}
                placeholder='search cast name'
              />
              <button
                className='button-search'
                type='button'
                onClick={() => handleSearchPerson(1)}
              >
                Search
              </button>
              <button
                className='save-button'
                type='button'
                onClick={handlesave}
                disabled={!selectedcast}
              >
                Save
              </button>
            </div>
          </>
        )}
        <div className='cast-detail-box'>
          <div className='image-container-center'>
            <div className='image-container'>
              <img
                src={selectedcast?.profile_path
                  ? `https://image.tmdb.org/t/p/original/${selectedcast.profile_path}`
                  : require('./../../../../utils/images/—Pngtree—portrait watercolor blue sky abstract_1789044.png')}
                className='img-cast'
              />
            </div>
          </div>

          <div className='info-text'>
            <div className='input-group'>
              <label>
                Cast Name:
              </label>
              <input className='cast-name'
                value={selectedcast.name || ''}
                onChange={
                  (e) => setSelectedCast({ ...selectedcast, name: e.target.value })}
                disabled={castid === undefined}
              />
            </div>
            <div className='input-group'>
              <label>
                Character Name:
              </label>
              <input className='character-name'
                value={selectedcast.characterName || ''}
                onChange={(e) => setSelectedCast({ ...selectedcast, characterName: e.target.value })}
              />
            </div>
            <div className='input-group'>
              <label>
                Url:
              </label>
              <input className='url-text-photo'
                value={selectedcast.profile_path || ''}
                onChange={(e) => setSelectedCast({ ...selectedcast, name: e.target.value })}
                disabled={castid === undefined}
              />
            </div>
          </div>
          {castid !== undefined && (
            <>
              <div className='edit-back-btn'>
                <button className='edit-btn'>
                  Update
                </button>
                <button className='back-btn'>
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CastForm;
