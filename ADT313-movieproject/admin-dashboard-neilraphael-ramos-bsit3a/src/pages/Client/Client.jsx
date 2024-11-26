import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import './Client.css'
function Client() {
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

                <aside>
                    Sidebar
                </aside>

                <footer>
                    <div className="text-rights">
                        <p>
                            &copy; 2024 MovieWebDB - All rights reserved.
                            Data provided by <a className='link-color' href="https://www.themoviedb.org" target="_blank">(TMDb)</a>
                        </p>
                        <p>
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