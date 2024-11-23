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
  const [videoURL, setVideoURL] = useState('');
  const [videos, setVideos] = useState([]);
  const [videokey, setVideoKey] = useState({})
  const [selectedvideo, setSelectedVideo] = useState({});
  const userId = auth.user.id
  const urlRef = useRef();
  const nameRef = useRef();
  const siteRef = useRef();
  const videoTypeRef = useRef();
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
    if (!url || typeof url !== 'string') {
      console.log("Invalid URL:", url);
      setVideoKey(''); // Reset video key if the URL is invalid
      return null;
    }

    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)([\w-]+))/i;
    const match = url.match(regex);
    console.log("URL:", url);
    console.log("Match:", match);

    if (match && match[1]) {
      setVideoKey(match[1]);
      return match[1];
    } else {
      setVideoKey(''); // Reset video key if no match is found
      return null;
    }
  };

  const validateField = (fieldRef, fieldName) => {
    if (!fieldRef.current.value.trim()) {
      fieldRef.current.style.border = '2px solid red';
      setTimeout(() => {
        fieldRef.current.style.border = '1px solid #ccc';
      }, 2000);
      console.log(`${fieldName} cannot be empty.`)
      return false;
    }
    return true;
  }


  const handlesave = async () => {

    const validateFields = () => {
      const isUrlValid = validateField(urlRef, "YouTube Link");

      if (isUrlValid) {
        const videoKey = getYouTubeVideoID(urlRef.current.value);
        if (!videoKey) {
          urlRef.current.style.border = '2px solid red';
          setTimeout(() => {
            urlRef.current.style.border = '1px solid #ccc';
          }, 2000);
          console.log("Invalid YouTube link. Please enter a valid URL.");
          alert("Invalid YouTube link. Please enter a valid URL.")
          return false;
        }
      }

      const isNameValid = validateField(nameRef, "Title Name");
      const isSiteValid = validateField(siteRef, "Site Type");
      const isVideoTypeValid = validateField(videoTypeRef, "Video Type");

      return isUrlValid && isNameValid && isSiteValid && isVideoTypeValid;
    };


    if (!validateFields()) {
      return; // This is for stop if any valid is null
    } else {
      try {
        const dataphoto = {
          userId: userId,
          movieId: movieId,
          url: `https://www.youtube.com/embed/${videokey}`,
          videoKey: videokey,
          name: selectedvideo.name,
          site: selectedvideo.site,
          videoType: selectedvideo.videotype,
          official: 0,
        }
        await axios({
          method: 'POST',
          url: '/admin/videos',
          data: dataphoto,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          }
        });
        alert('Added Success');
        getAll(movieId);
        setSelectedVideo([]);
        setVideoURL('')
        setVideoKey('')
        getYouTubeVideoID(null);
      } catch (error) {
        console.log("Error Saving Video", error.response?.data || error.message);
        alert(`Incorrect Link or Error: ${error.message}`)
      }
    }
  };

  useEffect(() => {
    getAll(movieId)
  }, [movieId]);

  const handledelete = async (id) => {
    const isConfirm = window.confirm("Are you sure you want to delete this photo?");

    if (isConfirm) {
      try {
        const response = await axios({
          method: 'delete',
          url: `/videos/${id}`, // Assuming you are calling the endpoint correctly
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        alert("Delete successful!");
        console.log(response);
        getAll(movieId); // Reload data after deletion
      } catch (err) {
        console.error("Error deleting video:", err.message);
        alert("An error occurred while deleting the video.");
      }
    }
  };

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
                    onClick={() => handledelete(items.id)}
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
            <h3>Videos not Found</h3>
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
                type='url'
                className='video-url'
                value={videoURL}
                onChange={(e) => {
                  const value = e.target.value;
                  setVideoURL(value || '');
                  getYouTubeVideoID(value);
                }}
                ref={urlRef}
              />
            </div>
            <div className='input-group'>
              <label className='label-video'>
                Name Video:
              </label>
              <input
                type='text'
                className='video-name'
                maxLength={100}
                value={selectedvideo.name || ''}
                onChange={(e) => setSelectedVideo({ ...selectedvideo, name: e.target.value })}
                ref={nameRef}
              />
            </div>
            <div className='input-group'>
              <label className='label-video'>
                Site:
              </label>
              <input
                type='text'
                className='site-name'
                value={selectedvideo.site || ''}
                maxLength={20}
                onChange={(e) => setSelectedVideo({ ...selectedvideo, site: e.target.value })}
                ref={siteRef}
              />
            </div>
            <div className='input-group'>
              <label className='label-video'>
                Video Type:
              </label>
              <input
                type='text'
                className='video-type-name'
                maxLength={20}
                value={selectedvideo.videotype || ''}
                onChange={(e) => setSelectedVideo({ ...selectedvideo, videotype: e.target.value })}
                ref={videoTypeRef}
              />
            </div>
          </div>
          <div className='save-edit-back-btn'>
            {!videoId ? (
              <>
                <button className='edit-save-btn'
                  type='button'
                  onClick={handlesave}
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