import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useThemeContextHook } from '../hooks/useThemeContextHook';

const Navigation: React.FC = () => {
  const { theme } = useThemeContextHook();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <nav className={`navbar navbar-expand-sm ${theme}-mode`}>
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link
                    className={`navbar-brand ${isActive('/') ? 'active' : ''}`}
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`navbar-brand ${isActive('/download') ? 'active' : ''}`}
                    to="/download"
                  >
                    Download
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

      </div>
    </>

  );
};

export default Navigation;