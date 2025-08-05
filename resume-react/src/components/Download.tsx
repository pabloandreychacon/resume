import React from 'react';
import { useThemeContextHook } from '../hooks/useThemeContextHook';

const Download: React.FC = () => {
  const { theme } = useThemeContextHook();

  return (
    <section id="download" className={`download section ${theme}-mode`}>
      <div className="container section-title" data-aos="fade-up">
        <h2>Download</h2>
      </div>

      <div className="container" data-aos="fade-up">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h3>Download My Sales App: <b>Postore</b></h3>
            <p>
              Get the latest version of my Point of Sales App for Windows for free!
              <br />
              This app is designed to help you manage your sales and inventory to be reflected in your cart website.
              <br />
              Click the button below to download.
            </p>
            <div className="language-switch mt-3">
              <a href="#" className="btn btn-outline-primary" onClick={(e) => {
                e.preventDefault();
                // Add your download logic here
                alert('Download functionality will be implemented here');
              }}>
                Download
              </a>
            </div>

            <div className="mt-5">
              <h4>Features</h4>
              <ul>
                <li><i className="bi bi-check-circle"></i> Easy inventory management</li>
                <li><i className="bi bi-check-circle"></i> Sales tracking and reporting</li>
                <li><i className="bi bi-check-circle"></i> Customer management</li>
                <li><i className="bi bi-check-circle"></i> Integration with online cart</li>
                <li><i className="bi bi-check-circle"></i> Secure and reliable</li>
              </ul>
            </div>

            <div className="mt-5">
              <h4>System Requirements</h4>
              <ul>
                <li><i className="bi bi-pc-display"></i> Windows 10 or later</li>
                <li><i className="bi bi-cpu"></i> 2 GHz processor or faster</li>
                <li><i className="bi bi-memory"></i> 4 GB RAM minimum</li>
                <li><i className="bi bi-hdd"></i> 500 MB available disk space</li>
                <li><i className="bi bi-display"></i> 1280 x 720 screen resolution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;