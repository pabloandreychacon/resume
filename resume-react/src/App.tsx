import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Download from './components/Download';
import ScrollTop from './components/ScrollTop';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';

import { useThemeContextHook } from './hooks/useThemeContextHook'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import AOS (Animate On Scroll)
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import custom CSS
import './assets/css/main.css';

function App() {
  // Initialize theme
  const { theme } = useThemeContextHook();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  const location = useLocation();

  return (
    <>
      <div className={`index-page ${theme}-mode`}>
        {/* Navigation Section */}
        <div id="navSection">
          <Navigation />
        </div>

        {/* Header */}
        <Header />

        <main className="main">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/download" element={<Download />} />
            {/* Default route - shows all sections for backward compatibility */}
            <Route path="/all" element={
              <>
                <Hero />
                <About />
                <Stats />
                <Skills />
                <Contact />
                <Download />
              </>
            } />
          </Routes>

          {/* Show all sections on the home page if no specific route is selected */}
          {location.pathname === '/' && (
            <>
              <About />
              <Stats />
              <Skills />
              <Contact />
            </>
          )}
        </main>

        <Footer />

        {/* Scroll Top */}
        <ScrollTop />

        {/* Preloader */}
        <Preloader />
      </div>
    </>
  );
}

export default App;
