import React, { useEffect } from 'react';
import { useThemeContextHook } from '../hooks/useThemeContextHook';

interface Skill {
  name: string;
  percentage: number;
}

const Skills: React.FC = () => {
  const { theme } = useThemeContextHook();
  const leftColumnSkills: Skill[] = [
    { name: 'HTML5', percentage: 100 },
    { name: 'CSS', percentage: 90 },
    { name: 'JavaScript', percentage: 85 }
  ];

  const rightColumnSkills: Skill[] = [
    { name: 'React', percentage: 90 },
    { name: 'Svelte', percentage: 70 },
    { name: 'Sql Server', percentage: 85 }
  ];

  useEffect(() => {
    // Animate progress bars when they come into view
    const animateProgressBars = () => {
      const progressBars = document.querySelectorAll('.progress-bar');
      progressBars.forEach((progressBar) => {
        const bar = progressBar as HTMLElement;
        const valuenow = bar.getAttribute('aria-valuenow');
        if (valuenow) {
          bar.style.width = `${valuenow}%`;
        }
      });
    };

    // Use IntersectionObserver to trigger animation when skills section is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateProgressBars();
          observer.unobserve(entry.target);
        }
      });
    });

    const skillsSection = document.querySelector('.skills-animation');
    if (skillsSection) {
      observer.observe(skillsSection);
    }

    return () => {
      if (skillsSection) {
        observer.unobserve(skillsSection);
      }
    };
  }, []);

  const renderSkill = (skill: Skill) => (
    <div className="progress" key={skill.name}>
      <span className="skill">
        <span>{skill.name}</span> <i className="val">{skill.percentage}%</i>
      </span>
      <div className="progress-bar-wrap">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={skill.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );

  return (
    <section id="skills" className={`skills section ${theme}-mode`}>
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>Skills</h2>
      </div>
      {/* End Section Title */}

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row skills-content skills-animation">
          <div className="col-lg-6">
            {leftColumnSkills.map(renderSkill)}
          </div>

          <div className="col-lg-6">
            {rightColumnSkills.map(renderSkill)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;