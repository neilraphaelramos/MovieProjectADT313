import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './utils/context/AuthContext';
import Register from './pages/Public/Register/Register';
import Login from './pages/Public/Login/Login';
import Home from './pages/Client/Home/Home';
import Client from './pages/Client/Client';
import Movie from './pages/Client/Movie/Movie';
import ForgotPassword from './pages/Public/ForgotPassword/ForgotPassword'

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
    path: '/home',
    element: <Client />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/home/movie/:movieId?',
        element: <Movie />
      }
    ]
  },
]);

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
