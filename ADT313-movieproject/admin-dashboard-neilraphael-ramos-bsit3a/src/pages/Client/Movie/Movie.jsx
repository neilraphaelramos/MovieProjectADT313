import React, { useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../../utils/context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Movie.css'
import CastCards from '../../../components/castCards/CastCards';
import VideoCards from '../../../components/videoCards/VideoCards';
import PhotoCards from '../../../components/photoCards/PhotoCards';

function Movie() {
  const { auth, movie, setMovie } = useContext(AuthContext);
  const listCast = movie?.casts || [];
  const listVideo = movie?.videos || [];
  const listPhoto = movie?.photos || [];

  const { movieId } = useParams();
  const navigate = useNavigate();

  const fetchMovie = useCallback(() => {
    if (movieId !== undefined) {
      axios({
        method: "get",
      url: `/movies/${movieId}`,
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      }
      })
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.log(e);
          navigate('/home');
        });
    }
  }, [movieId, auth.accessToken, navigate, setMovie]);

  useEffect(() => {
    fetchMovie();
    return () => { };
  }, [fetchMovie]);
  return (
    <div className='container-movie-card'>
      {movie && (
        <>
          <div className='Movie-Tab-Info'
            style={{
              backgroundImage: `url(${movie.backdropPath !== 'https://image.tmdb.org/t/p/original/undefined'
                ? movie.backdropPath
                : movie.posterPath
                })`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center top',
              backgroundSize: 'cover',
            }}>
            <div className='background-overlay'></div>
            <div className='banner'>
              <img
                className='View-Movie-Poster'
                src={movie.posterPath}
                alt='poster movie'
              />
            </div>
            <div className='info-movie-flex'>
              <h1>{movie.title}</h1>
              <hr></hr>
              <h3 className='overview-h3'>{movie.overview}</h3>
            </div>
          </div>

          {listCast && listCast.length ? (
            <>
              <div className='Slider-Color'>
                <h1 className='Tab-Viewer-h1'>Cast & Crew</h1>
                <div className='Slide-Viewer'>
                  {listCast.map((casts) => (
                    <CastCards
                      key={casts.id}
                      cast={casts}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Cast & Crew</h1>
              <p className="not-found-message">No cast founded or created.</p>
            </div>
          )}

          {listVideo && listVideo.length ? (
            <>
              <div className='Slider-Color'>
                <h1 className='Tab-Viewer-h1'>Videos</h1>
                <div className='Slide-Viewer'>
                  {listVideo.map((video) => (
                    <VideoCards
                      key={video.id}
                      video={video}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Videos</h1>
              <p className="not-found-message">No videos founded or created.</p>
            </div>
          )}

          {listPhoto && listPhoto.length ? (
            <>
              <div className='Slider-Color'>
                <h1 className='Tab-Viewer-h1'>Photos</h1>
                <div className='Slide-Viewer'>
                  {listPhoto.map((photo) => (
                    <PhotoCards
                      key={photo.id}
                      photo={photo}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="Slider-Color">
              <h1 className="Tab-Viewer-h1">Photos</h1>
              <p className="not-found-message">No photos founded or created.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Movie