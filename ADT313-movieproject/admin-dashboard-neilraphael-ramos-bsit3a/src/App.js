import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './pages/Public/Login/Login';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Register from './pages/Public/Register/Register';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import CastForm from './pages/Main/Movie/Cast-and-Crew/Cast-Form';
import PhotoForm from './pages/Main/Movie/Photos/Photo-Form';
import VideoForm from './pages/Main/Movie/Videos/Video-Form';
import { AuthProvider } from './utils/context/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: 'adminmode/login',
    element: <Login />,
  },
  {
    path: 'adminmode/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/dashboard',
        element: <Dashboard />
      },
      {
        path: '/main/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?',
            element: <Form />,
            children: [
              {
                path: '/main/movies/form/:movieId',
                element: <CastForm />
              },
              {
                path: '/main/movies/form/:movieId/cast-and-crews',
                element: <CastForm />
              },
              {
                path: '/main/movies/form/:movieId/photos',
                element: <PhotoForm />
              },
              {
                path: '/main/movies/form/:movieId/videos',
                element: <VideoForm />
              },
            ]
          },
        ]
      },
      // {
      //   path: '/main/dashboard',
      //   element: <Dashboard />,
      // },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <div className='App'>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
