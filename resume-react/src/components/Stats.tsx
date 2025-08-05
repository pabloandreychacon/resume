import React, { useEffect } from 'react';
import { useThemeContextHook } from '../hooks/useThemeContextHook';

interface CounterProps {
  start: number;
  end: number;
  duration: number;
  element: HTMLElement;
}

const Stats: React.FC = () => {
  const { theme } = useThemeContextHook();
  useEffect(() => {
    // Simple counter implementation
    const startCounter = ({ start, end, duration, element }: CounterProps) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // Initialize counters
    const counters = document.querySelectorAll('.purecounter');
    counters.forEach((counter) => {
      const element = counter as HTMLElement;
      const start = parseInt(element.getAttribute('data-purecounter-start') || '0', 10);
      const end = parseInt(element.getAttribute('data-purecounter-end') || '0', 10);
      const duration = parseInt(element.getAttribute('data-purecounter-duration') || '1', 10) * 1000;

      // Start the counter when element is in viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounter({ start, end, duration, element });
            observer.unobserve(element);
          }
        });
      });

      observer.observe(element);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <section id="stats" className={`stats section ${theme}-mode`}>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div
            className="col-lg-6 col-md-6 d-flex flex-column align-items-center"
          >
            <i className="bi bi-emoji-smile"></i>
            <div className="stats-item">
              <span
                data-purecounter-start="0"
                data-purecounter-end="15"
                data-purecounter-duration="1"
                className="purecounter"
              >0</span>
              <p>Happy Clients</p>
            </div>
          </div>
          {/* End Stats Item */}

          <div
            className="col-lg-6 col-md-6 d-flex flex-column align-items-center"
          >
            <i className="bi bi-journal-richtext"></i>
            <div className="stats-item">
              <span
                data-purecounter-start="0"
                data-purecounter-end="10"
                data-purecounter-duration="1"
                className="purecounter"
              >0</span>
              <p>Projects</p>
            </div>
          </div>
          {/* End Stats Item */}
        </div>
      </div>
    </section>
  );
};

export default Stats;