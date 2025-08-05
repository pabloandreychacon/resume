import React from 'react';

import { useThemeContextHook } from '../hooks/useThemeContextHook';

const About: React.FC = () => {
  // Use the theme from context
  // This allows the component to adapt to the current theme
  const { theme } = useThemeContextHook();

  return (
    <section id="about" className={`about section ${theme}-mode`}>
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>About</h2>
        <p>
          As a Web Developer, I design, maintain, support, and develop web
          applications and APIs. I have over 4 years of experience in front
          end web development, using tools like .Net APIs, React, Svelte, SQL
          Server, HTML5, CSS3, JavaScript, JSON, Sass, Bootstrap, and GitHub.
          I am passionate about creating user-friendly and efficient web
          solutions that meet the needs of diverse users. I also have a strong
          background in software engineering, with an Engineer's Degree from
          Universidad Hispanoamericana (CR) and a Computer Engineer degree
          from Universidad Metropolitana Castro Carazo. I am always eager to
          learn new technologies and improve my skills to deliver high-quality
          results.
        </p>
      </div>
      {/* End Section Title */}

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4 justify-content-center">
          <div className="col-lg-4">
            <img src="/src/assets/img/profile-img.jpg" className="img-fluid" alt="Profile" />
          </div>
          <div className="col-lg-8 content">
            <h2>Web Developer.</h2>
            <p className="fst-italic py-3">
              Design, maintenance, support, and development for web
              applications and APIs.
            </p>
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Birthday:</strong> <span>6 Aug</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Phone:</strong> <span>+(506) 86906111</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>City:</strong> <span>Heredia, Costa Rica</span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Degree:</strong> <span>Bachelor</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Email:</strong>
                    <span>pabloandreychaconluna@hotmail.com</span>
                  </li>
                  <li>
                    <i className="bi bi-chevron-right"></i>
                    <strong>Freelance/Developer:</strong>
                    <span>Available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;