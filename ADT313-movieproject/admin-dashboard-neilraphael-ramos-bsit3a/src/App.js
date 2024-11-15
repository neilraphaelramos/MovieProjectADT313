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
                element: (
                  <h1>Change this for cast & crew CRUD functionality.</h1>
                ),
              },
              {
                path: '/main/movies/form/:movieId/cast-and-crews',
                element: (
                  <h1>
                    Change this for cast & crew CRUD functionality component.
                  </h1>
                ),
              },
              {
                path: '/main/movies/form/:movieId/photos',
                element: (
                  <h1>Change this for photos CRUD functionality component.</h1>
                ),
              },
              {
                path: '/main/movies/form/:movieId/videos',
                element: (
                  <h1>Change this for videos CRUD functionality component.</h1>
                ),
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
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
