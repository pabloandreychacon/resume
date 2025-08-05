import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Typed from 'typed.js';
import { useThemeContextHook } from '../hooks/useThemeContextHook'
import type { Theme } from '../types';

const Hero: React.FC = () => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const typedInstance = useRef<Typed | null>(null);
  const { theme, setSpecificTheme, resetToSystemTheme, isUsingSystemTheme } = useThemeContextHook();

  useEffect(() => {
    if (typedRef.current) {
      typedInstance.current = new Typed(typedRef.current, {
        strings: ['Developer', 'Freelancer'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
      });
    }

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, []);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'system') {
      resetToSystemTheme();
    } else {
      setSpecificTheme(value as Theme);
    }
  };

  return (
    <section id="hero" className={`hero section ${theme}-mode`}>
      <img src="/src/assets/img/hero-bg.jpg" alt="" />

      <div className="container" data-aos="zoom-out">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h3><b>Andrey Chacon L</b></h3>
            <div className="row">
              <p className="col-sm-3">
                I'm
                <span className="px-2 typed" ref={typedRef}></span>
              </p>
              <div className="col-sm-1 social-links">
                <a
                  href="https://www.linkedin.com/in/pabloandreychaconluna/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
              <div className="col theme align-end">
                <label htmlFor="select-theme" className="form-label d-inline px-2">
                  Select Theme:
                </label>
                <select
                  className="form-select d-inline"
                  name="select-theme"
                  id="select-theme"
                  onChange={handleThemeChange}
                  value={isUsingSystemTheme ? 'system' : theme}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>

            {/* Cart section*/}
            <section id="cart" className={`cart section ${theme}-mode`}>
              <div className="container" data-aos="fade-up">
                <h3><b>Postore Cart</b></h3>
                <p>
                  Do you need a website to sell your products online by
                  allowing your customers to add items to their cart and
                  proceed to checkout?
                </p>
                <p>
                  Click the button below to go to the cart page and see how it
                  works.
                </p>
                <p>
                  Payment through Paypal and pure HTML, CSS and Vanilla
                  Javascript
                </p>
                <div className="language-switch mt-3">
                  <a href="cart/" className="btn btn-outline-primary">
                    Go to my Cart page example
                  </a>
                </div>
              </div>
            </section>
            {/* End Cart section*/}

            {/* Download Section */}
            <section id="download" className="download section">
              <div className="container" data-aos="">
                <h3>Download My Sales App: <b>Postore</b></h3>
                <p>
                  Get the latest version of my Point of Sales App for Windows for free!
                  <br />
                  This app is designed to help you manage your sales and inventory to be reflected in your cart website

                  Click the button below to download.
                </p>
                <div className="language-switch mt-3">
                  <Link to="/download" className="btn btn-outline-primary">
                    Download
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;