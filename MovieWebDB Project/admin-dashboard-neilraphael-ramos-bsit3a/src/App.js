import * as React from 'react';
//import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './pages/Public/Login/Login';
import Main from './pages/Main/Main';
import Register from './pages/Public/Register/Register';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import CastForm from './pages/Main/Movie/Cast-and-Crew/Cast-Form';
import PhotoForm from './pages/Main/Movie/Photos/Photo-Form';
import VideoForm from './pages/Main/Movie/Videos/Video-Form';
import { AuthProvider } from './utils/context/AuthContext';
import Movies from './pages/Main/Movie/Movie';
import ForgotPassword from './pages/Public/ForgotPassword/ForgotPassword';

//ADT313 Movie Project (MovieWebDB)
//Submitted by: Neil Raphael M. Ramos

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
    path: '/reset-password',
    element: <ForgotPassword />
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/movies',
        element: <Movies />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:id?',
            element: <Form />,
            children: [
              {
                path: '/main/movies/form/:id',
                element: <CastForm />
              },
              {
                path: '/main/movies/form/:id/cast-and-crews/:movieId?',
                element: <CastForm />
              },
              {
                path: '/main/movies/form/:id/photos/:movieId?',
                element: <PhotoForm />
              },
              {
                path: '/main/movies/form/:id/videos/:movieId?',
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
