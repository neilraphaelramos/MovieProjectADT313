import React, { useEffect, useContext, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faFilm, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../utils/context/AuthContext';
import './Client.css'
function Client() {
    const { auth } = useContext(AuthContext);
    const { clearAuthData } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const sidebar = document.querySelector('aside');
        const button = document.querySelector('.button');

        header.classList.add('header-visible');
        footer.classList.add('footer-visible');

        const toggleSidebar = () => {
            if (sidebar.style.transform === "translateX(0%)") {
                sidebar.style.transform = "translateX(100%)";
                document.querySelector('.box').style.gridTemplateColumns = "auto 0";
            } else {
                sidebar.style.transform = "translateX(0%)";
                document.querySelector('.box').style.gridTemplateColumns = "auto 200px";
            }
        };

        button.addEventListener('click', toggleSidebar);
        return () => {
            button.removeEventListener('click', toggleSidebar);
        };
    }, []);

    const handleLogout = useCallback(() => {
        clearAuthData();
        navigate('/');
    }, [navigate, clearAuthData]);

    return (
        <>
            <main className="box">
                <header>
                    <h1 className="title-text">Welcome to MovieWebDB</h1>
                    <a className="button" id="toggleButton">
                        <div className="button-container">
                            <div className="divnav"></div>
                            <div className="divnav"></div>
                            <div className="divnav"></div>
                        </div>
                    </a>
                </header>

                <article className="main-content">
                    <Outlet />
                </article>

                <aside className='sidebar'>
                    <div className='container-user-info'>
                        <div className='User-Info'>
                            <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '90px', color: 'white' }} />
                            <span className="user-info-data">
                                <h1 className="name-user">{auth.user.firstName}</h1>
                                <p className="role-user">Role as: <strong>{auth.user.role}</strong></p>
                            </span>
                        </div>
                    </div>
                    <hr></hr>
                    <ul className='nav'>
                        <div className="Movies-user">
                            <div style={{ fontSize: '24px', color: 'white' }}>
                                <center>
                                    <FontAwesomeIcon icon={faFilm} style={{ fontSize: '24px', color: 'white' }} />
                                    <strong className='spacing-text'>Movies</strong>
                                </center>
                            </div>
                        </div>
                        <div className="logout-user">
                            <div onClick={handleLogout} style={{ fontSize: '24px', color: 'white' }}>
                                <center>
                                    <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '24px', color: 'white' }} />
                                    <strong className='spacing-text'>Logout</strong>
                                </center>
                            </div>
                        </div>
                    </ul>
                </aside>

                <footer>
                    <div className="text-rights">
                        <p className='size-font'>
                            &copy; 2024 MovieWebDB - All rights reserved.
                            Data provided by <a className='link-color' href="https://www.themoviedb.org" target="_blank">(TMDb)</a>
                        </p>
                        <p className='size-font'>
                            Developed and Created by Neil Raphael M. Ramos from BSIT - 3A
                        </p>
                    </div>
                    <div className="icons">
                    </div>
                </footer>
            </main>
        </>
    )
}

export default Client