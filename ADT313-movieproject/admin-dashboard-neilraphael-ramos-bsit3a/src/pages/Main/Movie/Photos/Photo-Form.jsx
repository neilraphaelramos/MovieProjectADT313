import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../../../utils/context/AuthContext'
import './Photo-Form.css'
import axios from 'axios'
import { useParams } from 'react-router-dom';

function PhotoForm() {
  const { auth } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
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
        setPhotos(response.data.photos);
      })
      .catch((error) => {
        console.error("Error fetching casts:", error.response.data);
      });
  }

  useEffect(() => {
    getAll(movieId)
  }, [movieId]);

  return (
    <div className='photo-box'>
      <div className='Photo-View-Box'>
        <h3>Photo Box</h3>
      </div>
      <div className='Photo-Search-Box'>
        <h3>Search Box</h3>
        <input />
      </div>
    </div>
  )
}

export default PhotoForm