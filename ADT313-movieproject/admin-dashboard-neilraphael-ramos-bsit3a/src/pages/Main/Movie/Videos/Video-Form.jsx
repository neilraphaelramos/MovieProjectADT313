import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { AuthContext } from '../../../../utils/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faL } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import './Video-Form.css'

function VideoForm() {
  const { auth } = useContext(AuthContext);
  const [videoId, setVideoId] = useState(undefined);
  const [videos, setVideos] = useState([]);
  const [videokey, setVideoKey] = useState({})
  const [selectedvideo, setSelectedVideo] = useState({});
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
        setVideos(response.data.videos);
      })
      .catch((error) => {
        console.error("Error fetching Videos:", error.response.data);
      });
  }

  const getYouTubeVideoID = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)([\w-]+))/i;
    const match = url.match(regex);
    console.log("URL:", url);  // Log the input URL
    console.log("Match:", match);  // Log the match result
    if (match && match[1]) {
      setVideoKey(match[1]);
    }
    return match && match[1] ? match[1] : null;
  };
  
  const handlesave = async () => {

    /*const validateFields = () => {
      const isUrlValid = validateField(urlRef, "URL");
      const isDescriptionValid = validateField(descriptionRef, "Description");

      return isUrlValid && isDescriptionValid;
    };*/

    /*if (!validateFields()) {
      return; // This is for stop if any valid is null
    } else {*/
      try {
        const dataphoto = {
          userId: auth.user.userId,
          movieId: movieId,
          url: selectedvideo.url,
          videoKey: videokey,
          name: selectedvideo.name,
        }
        await axios({
          method: 'POST',
          url: '/admin/photos',
          data: dataphoto,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          }
        });
        alert('Added Success');
        setSelectedVideo([])
        getAll(movieId);
      } catch (error) {
        console.log("Error Saving Photo", error.response?.data || error.message);
      }
    //}
  }

  useEffect(() => {
    getAll(movieId)
  }, [movieId]);
  

  return (
    <div className='video-box'>
      <div className='Video-View-Box'>
        {videos !== undefined && videos.length > 0 ? (
          <div className='card-display-videos'>
            {videos.map((items) => (
              <div key={items.id} className='card-video'>
                <div className='buttons-group'>
                  <button
                    type='button'
                    className='delete-button'
                  //onClick={() => handledelete(image.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  <button
                    type='button'
                    className='edit-button'
                  //onClick={() => photofetch(image.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>
                <iframe
                  className='video-style'
                  width="100%"
                  src={`https://www.youtube.com/embed/${items.videoKey}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className='container-video'>
                  <p>{items.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='no-videos'>
            <h3>Photos not Found</h3>
          </div>
        )}
      </div>
      <div className='Video-Search-Box'>
        <div className='parent-container'>
          <div className='video-detail-box'>
            <div className='video-container-center'>
              <div className='video-frame-container'>
                <iframe
                  className='video-frame'
                  src={selectedvideo.url
                    ? selectedvideo.url
                    : `https://www.youtube.com/embed/${videokey}`
                  }
                  frameborder="0"
                >
                </iframe>
              </div>
            </div>
          </div>
          <div className='video-info-text'>
            <div className='input-group'>
              <label className='label-video'>
                Video Url:
              </label>
              <input
                className='video-url'
                value={selectedvideo.url || ''}
                onChange={(e) => getYouTubeVideoID(e.target.value)}
              />
            </div>
            <div className='input-group'>
              <label className='label-video'>
                Name Video:
              </label>
              <input
                className='video-name'
              value={selectedvideo.name || ''}
              onChange={(e) => setSelectedVideo({ ...selectedvideo, name: e.target.value })}
              />
            </div>
          </div>
          <div className='save-edit-back-btn'>
            {!videoId ? (
              <>
                <button className='edit-save-btn'
                  type='button'
                //onClick={handlesave}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button className='edit-save-btn'
                  type='button'
                //onClick={() => photoUpdate(photoid)}
                >
                  Update
                </button>
              </>
            )}

            <button className='clear-btn'
              type='button'
            //onClick={handleclear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoForm