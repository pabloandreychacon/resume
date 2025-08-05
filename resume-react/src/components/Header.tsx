import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeContextHook } from '../hooks/useThemeContextHook';

const Header: React.FC = () => {
  const { theme } = useThemeContextHook();
  const location = useLocation();

  const toggleHeader = () => {
    const header = document.querySelector('#header');
    const headerToggleBtn = document.querySelector('.header-toggle');

    if (header && headerToggleBtn) {
      header.classList.toggle('header-show');
      headerToggleBtn.classList.toggle('bi-list');
      headerToggleBtn.classList.toggle('bi-x');
    }
  };

  // Helper function to determine if a link is active
  const isActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      id="header"
      className={`header d-flex flex-column justify-content-center ${theme}-mode`}
      style={{ background: 'transparent' }}
    >
      <i className="header-toggle d-xl-none bi bi-list" onClick={toggleHeader}></i>

      <nav id="navmenu" className="navmenu">
        <ul>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              <i className="bi bi-house navicon"></i><span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              <i className="bi bi-person navicon"></i><span>About</span>
            </Link>
          </li>
          <li>
            <Link to="/stats" className={isActive('/stats') ? 'active' : ''}>
              <i className="bi bi-file-earmark-text navicon"></i>
              <span>Stats</span>
            </Link>
          </li>
          <li>
            <Link to="/skills" className={isActive('/skills') ? 'active' : ''}>
              <i className="bi bi-images navicon"></i><span>Skills</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
              <i className="bi bi-envelope navicon"></i><span>Contact</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;