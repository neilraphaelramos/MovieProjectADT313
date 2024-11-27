import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../../../utils/context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import MovieCards from '../../../components/movieCards/MovieCards';

function Home() {
  const {auth, lists, setLists, setMovie} = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);

  const getMovies = () => {
    //get the movies from the api or database
    axios
      .get('/movies')
      .then((response) => {
        setLists(response.data);
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);
        console.log("Data Fetch")
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (lists.length) {
        console.log('change movie');
        const random = Math.floor(Math.random() * lists.length);
        setFeaturedMovie(lists[random]);
      }
    }, 5000);
    return;
  }, [featuredMovie]);

  return (
    <div className='main-container'>
      <h1 className='page-title'>Movies</h1>
      {featuredMovie && lists.length ? (
        <div className='featured-list-container'>
          <div
            className='featured-backdrop'
            style={{
              background: `url(${
                featuredMovie.backdropPath !==
                'https://image.tmdb.org/t/p/original/undefined'
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              }) no-repeat center top`,
            }}
          >
            <span className='featured-movie-title'>{featuredMovie.title}</span>
          </div>
        </div>
      ) : (
        <div className='featured-list-container-loader'></div>
      )}
      <div className='list-container'>
        {lists.map((movie) => (
          <>
            <MovieCards
              movie={movie}
              onClick={() => {
                navigate(`/home/movie/${movie.id}`);
                setMovie(movie);
              }}
            />
          </>
        ))}
      </div>
    </div>
  )
}

export default Home