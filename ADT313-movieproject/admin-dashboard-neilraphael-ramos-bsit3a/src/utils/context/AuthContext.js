import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('accessToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  const setAuthData = (data) => {
    setAuth({
      accessToken: data.accessToken,
      user: data.user,
    });

    // Save to localStorage for persistence
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('tab', JSON.stringify('cast'));
  };

  const [movie, setMovie] = useState(null);
  const [lists, setLists] = useState([]);

  const setMovieInfo = (movieInfo) => {
    setMovie(movieInfo);
    console.log(movieInfo);
  };

  const setListDataMovie = (listData) => {
    setLists(listData);
    console.log(listData);
  }

  const clearAuthData = () => {
    setAuth({
      accessToken: null,
      user: null,
    });

    setMovie(null);
    setLists([]);

    // Remove from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tab');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuthData, clearAuthData, movie, setMovieInfo, lists, setListDataMovie }}>
      {children}
    </AuthContext.Provider>
  );
};
