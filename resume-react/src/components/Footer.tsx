import React from 'react';
import { useThemeContextHook } from '../hooks/useThemeContextHook';

const Footer: React.FC = () => {
  const { theme } = useThemeContextHook();
  return (
    <footer id="footer" className={`footer position-relative ${theme}-mode`}>
      <div className="container">
        <h3 className="sitename">Andrey Chacon</h3>
        <div className="social-links d-flex justify-content-center">
          <a
            href="https://www.linkedin.com/in/pabloandreychaconluna/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
        <div className="container">
          <div className="copyright">
            <span>Copyright</span>
            <strong className="px-1 sitename">Andrey Chacon</strong>
            <span>All Rights Reserved</span>
          </div>
          <div className="credits"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;