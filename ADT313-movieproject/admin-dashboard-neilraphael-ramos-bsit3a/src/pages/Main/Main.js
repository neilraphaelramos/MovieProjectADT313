import { useEffect, useContext } from 'react';
import { AuthContext } from '../../utils/context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilm, faTachometerAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');

  //get user info
  const userInformation = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const { clearAuthData } = useContext(AuthContext);

  const handleResetTab = () => {
    localStorage.setItem('tab', JSON.stringify('cast'));
  }

  const handleLogout = () => {
    clearAuthData()
    navigate('/');
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
  }, []);

  return (
    <div className="Main">
      <div className="custom-container">
        <div className="navigation text-light">
          <div className="admin-info">
            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '50px', color: 'white' }} />
            <span className="user-info">
              <p className="role">{userInformation.role}</p>
              <h1 className="name">{userInformation.firstName}</h1>
            </span>
          </div>
          <hr></hr>
          <ul className="nav">
            <li>
              <a href="/main/dashboard" className="nav-link" title="Dashboard">
                <center>
                  <FontAwesomeIcon icon={faTachometerAlt} style={{ fontSize: '24px', color: 'white' }} />
                </center>
              </a>
            </li>
            <li>
              <a href="/main/movies" className="nav-link" title="Movies" onClick={handleResetTab}>
                <center>
                  <FontAwesomeIcon icon={faFilm} style={{ fontSize: '24px', color: 'white' }} />
                </center>
              </a>
            </li>
            <li>
              <a href="/main/user-lists" className="nav-link" title="Users">
                <center>
                  <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '24px', color: 'white' }} />
                </center>
              </a>
            </li>
            <li className="logout" title="Logout">
              <a onClick={handleLogout} className="nav-link">
                <center>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '24px', color: 'white' }} />
                </center>
              </a>
            </li>
          </ul>
        </div>
        <div className="outlet bg-custom text-light">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
