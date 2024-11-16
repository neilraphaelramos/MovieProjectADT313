import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import './Form.css'


const Form = () => {
    const [query, setQuery] = useState('');
    const [searchedMovieList, setSearchedMovieList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(undefined);
    const [movie, setMovie] = useState(undefined);
    const [notfound, setNotFound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pagebtn, setPageBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // Error state for displaying error messages
    const navigate = useNavigate();
    let { movieId } = useParams();

    const handleSearch = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null); // Reset error state before the search
        try {
            const response = await axios({
                method: 'get',
                url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGY0ZjFlMmNhODQ1ZjA3NWY5MmI5ZDRlMGY3ZTEwYiIsIm5iZiI6MTcyOTkyNjY3NC40NzIwOTksInN1YiI6IjY3MTM3ODRmNjUwMjQ4YjlkYjYxZTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RRJNLOg8pmgYoomiCWKtwkw74T3ZtAs7ZScqxo1bzWg',
                },
            });

            if (response.data.results.length === 0) {
                console.log("Not Found");
                setNotFound(true);
                setSearchedMovieList([]);
                setTotalPages(0);
                setPageBtn(false);
            } else {
                setSearchedMovieList(response.data.results);
                setTotalPages(response.data.total_pages);
                setNotFound(false);
                setPageBtn(true);
            }
        } catch (err) {
            setError('Error fetching movies. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [query]);

    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
    };

    const handleSave = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!selectedMovie) {
            alert('Please search and select a movie.');
            return;
        }

        const data = {
            tmdbId: selectedMovie.id,
            title: selectedMovie.title,
            overview: selectedMovie.overview,
            popularity: selectedMovie.popularity,
            releaseDate: selectedMovie.release_date,
            voteAverage: selectedMovie.vote_average,
            backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
            posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
            isFeatured: 0,
        };

        try {
            if (movieId) {
                // Update existing movie
                await axios({
                    method: 'PATCH',
                    url: `/movies/${movieId}`,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                alert('Update Success');
            } else {
                // Create new movie
                await axios({
                    method: 'post',
                    url: '/movies',
                    data: data,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                alert('Save Success');
            }
            navigate('/main/movies');
        } catch (err) {
            setError('Error saving movie. Please try again later.');
            console.error(err);
        }
    };

    useEffect(() => {
        if (movieId) {
            const fetchMovie = async () => {
                try {
                    const response = await axios.get(`/movies/${movieId}`);
                    setMovie(response.data);
                    setSelectedMovie({
                        id: response.data.tmdbId,
                        title: response.data.title,
                        overview: response.data.overview,
                        popularity: response.data.popularity,
                        poster_path: response.data.posterPath,
                        release_date: response.data.releaseDate,
                        vote_average: response.data.voteAverage,
                    });
                } catch (err) {
                    setError('Error fetching movie details. Please try again later.');
                    console.error(err);
                }
            };

            fetchMovie();
        }
    }, [movieId]);

    return (
        <div className="form-box">
            <div className='title-text'>{movieId ? 'Edit ' : 'Adding '} Movie</div>

            {error && <p className="text-center text-danger">{error}</p>} {/* Display error messages */}

            {movieId === undefined && (
                <>
                    <div className="search-container mt-3">
                        <div>
                            <label>Search Movie: {" "}</label>
                            <div className="search-with-btn">
                                <input
                                    type="text"
                                    className="search-bar"
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        setNotFound(false);
                                        setSearchedMovieList([]);
                                        setSelectedMovie(undefined);
                                        setCurrentPage(1);
                                        setPageBtn(false);
                                    }}
                                    placeholder='Enter Movie Title'
                                />
                                <button
                                    type="button"
                                    className="btn-search btn-primary"
                                    onClick={() => handleSearch(1)}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="searched-movie">
                            {notfound ? (
                                <p className="text-warning">
                                    Movie not found
                                </p>
                            ) : isLoading ? (
                                <p className="text-searching">Searching...</p>
                            ) : (
                                searchedMovieList.map((movie) => (
                                    <p 
                                        key={movie.id}
                                        className="list-movie"
                                        onClick={() => handleSelectMovie(movie)}
                                    >
                                        {movie.original_title}
                                    </p>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 0 && !notfound && pagebtn && (
                        <div className="page-form">
                            <button
                                className="btn btn-secondary me-2"
                                onClick={() => {
                                    if (currentPage > 1) {
                                        handleSearch(currentPage - 1);
                                        setCurrentPage(currentPage - 1);
                                    }
                                }}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                className="btn btn-secondary ms-2"
                                onClick={() => {
                                    if (currentPage < totalPages) {
                                        handleSearch(currentPage + 1);
                                        setCurrentPage(currentPage + 1);
                                    }
                                }}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                    <hr />
                </>
            )}

            <div className="movie-box">
                <div className="image-box">
                    <img
                        className="img-fluid"
                        src={selectedMovie?.poster_path
                            ? `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`
                            : require('./../../../../utils/images/cinematography-symbols-black-background.jpg')}
                        alt={selectedMovie?.title || 'Fallback Cinematography Symbol'}
                        style={{ maxHeight: "500px", maxWidth: "318px" }}
                    />
                </div>

                <div>
                    <form className="movie-details-box">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedMovie ? selectedMovie.title : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, title: e.target.value })}
                            disabled={movieId === undefined}
                        />

                        <label>Overview</label>
                        <textarea
                            className="form-control"
                            rows={5}
                            value={selectedMovie ? selectedMovie.overview : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, overview: e.target.value })}
                            disabled={movieId === undefined}
                        />

                        <label>Popularity</label>
                        <input
                            type="number"
                            className="form-control"
                            value={selectedMovie ? selectedMovie.popularity : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, popularity: e.target.value })}
                            step={0.1}
                            disabled={movieId === undefined}
                        />

                        <label>Release Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={selectedMovie ? selectedMovie.release_date : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, release_date: e.target.value })}
                            disabled={movieId === undefined}
                        />

                        <label>Vote Average</label>
                        <input
                            type="number"
                            className="form-control"
                            value={selectedMovie ? selectedMovie.vote_average : ''}
                            onChange={(e) => setSelectedMovie({ ...selectedMovie, vote_average: e.target.value })}
                            step={0.1}
                            disabled={movieId === undefined}
                        />
                        <div className='button-box'>
                            <button
                                type="button"
                                className="btn btn-save"
                                onClick={handleSave}
                                disabled={!selectedMovie}
                            >
                                {movieId ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {movieId !== undefined && selectedMovie && (
                <div>
                    <hr />
                    <nav>
                        <ul className='tabs'>
                            <li
                                onClick={() => {
                                    navigate(`/main/movies/form/${movieId}/cast-and-crews`);
                                }}
                            >
                                Cast & Crews
                            </li>
                            <li
                                onClick={() => {
                                    navigate(`/main/movies/form/${movieId}/videos`);
                                }}
                            >
                                Videos
                            </li>
                            <li
                                onClick={() => {
                                    navigate(`/main/movies/form/${movieId}/photos`);
                                }}
                            >
                                Photos
                            </li>
                        </ul>
                    </nav>
                    <Outlet />
                </div>
            )}
        </div>
    );
};

export default Form;
