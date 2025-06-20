class MyMainHero extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <!-- Hero Section -->
      <section id="hero" class="hero section">
        <img src="assets/img/hero-bg.jpg" alt="" />

        <div class="container" data-aos="zoom-out">
          <div class="row justify-content-center">
            <div class="col-lg-9">
              <h2>Andrey Chacon</h2>
              <p>
                I'm
                <span class="typed" data-typed-items="Developer, Freelancer"
                  >Developer</span
                ><span
                  class="typed-cursor typed-cursor--blink"
                  aria-hidden="true"
                ></span>
              </p>
              <div class="social-links w-50">
                <a
                  href="https://www.facebook.com/profile.php?id=100088596949141"
                  target="_blank"
                  ><i class="bi bi-facebook"></i
                ></a>
                <a
                  href="https://www.instagram.com/pabloandreychaconluna/"
                  target="_blank"
                  ><i class="bi bi-instagram"></i
                ></a>
                <a
                  href="https://www.linkedin.com/in/pabloandreychaconluna/"
                  target="_blank"
                  ><i class="bi bi-linkedin"></i
                ></a>
              </div>
              <div class="theme p-2">
                <label for="select-them" class="form-label"
                  >Select Theme:</label
                >
                <select
                  class="form-select"
                  name="select-theme"
                  id="select-theme"
                >
                  <option value="light">Light</option>
                  <option value="dark" selected>Dark</option>
                </select>                
              </div>              
              <!-- Download Section -->
              <section id="download" class="download section">
                <div class="container" data-aos="fade-up">
                  <h3>Download My Sales App: <b>Postore</b></h3>
                  <p>
                    Get the latest version of my Point of Sales App for free! Click the
                    button below to download.
                  </p>
                  <div class="language-switch mt-3">
                    <a href="download.html" class="btn btn-outline-primary">Download</a>
                  </div>                  
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <!-- /Hero Section -->`;
  }
}

customElements.define("my-main-hero", MyMainHero);

class MyMainAbout extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<!-- About Section -->
      <section id="about" class="about section">
        <!-- Section Title -->
        <div class="container section-title" data-aos="fade-up">
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
        <!-- End Section Title -->

        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4 justify-content-center">
            <div class="col-lg-4">
              <img src="assets/img/profile-img.jpg" class="img-fluid" alt="" />
            </div>
            <div class="col-lg-8 content">
              <h2>Web Developer.</h2>
              <p class="fst-italic py-3">
                Design, maintenance, support, and development for web
                applications and APIs.
              </p>
              <div class="row">
                <div class="col-lg-6">
                  <ul>
                    <li>
                      <i class="bi bi-chevron-right"></i>
                      <strong>Birthday:</strong> <span>6 Aug</span>
                    </li>
                    <!-- <li><i class="bi bi-chevron-right"></i> <strong>Website:</strong> <span>www.example.com</span></li> -->
                    <li>
                      <i class="bi bi-chevron-right"></i>
                      <strong>Phone:</strong> <span>+(506) 86906111</span>
                    </li>
                    <li>
                      <i class="bi bi-chevron-right"></i>
                      <strong>City:</strong> <span>Heredia, Costa Rica</span>
                    </li>
                  </ul>
                </div>
                <div class="col-lg-6">
                  <ul>
                    <!-- <li><i class="bi bi-chevron-right"></i> <strong>Age:</strong> <span>30</span></li> -->
                    <li>
                      <i class="bi bi-chevron-right"></i>
                      <strong>Degree:</strong> <span>Bachelor</span>
                    </li>
                    <li>
                      <i class="bi bi-chevron-right"></i>
                      <strong>Email:</strong>
                      <span>pabloandreychaconluna@hotmail.com</span>
                    </li>
                    <li>
                      <i class="bi bi-chevron-right"></i>
                      <strong>Freelance/Developer:</strong>
                      <span>Available</span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- <p class="py-3">
              Officiis eligendi itaque labore et dolorum mollitia officiis optio vero. Quisquam sunt adipisci omnis et ut. Nulla accusantium dolor incidunt officia tempore. Et eius omnis.
              Cupiditate ut dicta maxime officiis quidem quia. Sed et consectetur qui quia repellendus itaque neque.
            </p> -->
            </div>
          </div>
        </div>
      </section>
      <!-- /About Section -->`;
  }
}

// Define the element
customElements.define("my-main-about", MyMainAbout);

class MyMainStats extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <!-- Stats Section -->
      <section id="stats" class="stats section">
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4">
            <div
              class="col-lg-6 col-md-6 d-flex flex-column align-items-center"
            >
              <i class="bi bi-emoji-smile"></i>
              <div class="stats-item">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="15"
                  data-purecounter-duration="1"
                  class="purecounter"
                ></span>
                <p>Happy Clients</p>
              </div>
            </div>
            <!-- End Stats Item -->

            <div
              class="col-lg-6 col-md-6 d-flex flex-column align-items-center"
            >
              <i class="bi bi-journal-richtext"></i>
              <div class="stats-item">
                <span
                  data-purecounter-start="0"
                  data-purecounter-end="10"
                  data-purecounter-duration="1"
                  class="purecounter"
                ></span>
                <p>Projects</p>
              </div>
            </div>
            <!-- End Stats Item -->

            <div
              class="col-lg-3 col-md-6 d-flex flex-column align-items-center d-none"
            >
              <!-- <i class="bi bi-headset"></i>
            <div class="stats-item">
              <span data-purecounter-start="0" data-purecounter-end="1463" data-purecounter-duration="1" class="purecounter"></span>
              <p>Hours Of Support</p>
            </div> -->
            </div>
            <!-- End Stats Item -->

            <div
              class="col-lg-3 col-md-6 d-flex flex-column align-items-center d-none"
            >
              <!-- <i class="bi bi-people"></i>
            <div class="stats-item">
              <span data-purecounter-start="0" data-purecounter-end="15" data-purecounter-duration="1" class="purecounter"></span>
              <p>Hard Workers</p>
            </div> -->
            </div>
            <!-- End Stats Item -->
          </div>
        </div>
      </section>
      <!-- /Stats Section -->`;
  }
}

// Define the element
customElements.define("my-main-stats", MyMainStats);

class MyMainSkills extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<!-- Skills Section -->
      <section id="skills" class="skills section">
        <!-- Section Title -->
        <div class="container section-title" data-aos="fade-up">
          <h2>Skills</h2>
          <!-- <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p> -->
        </div>
        <!-- End Section Title -->

        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row skills-content skills-animation">
            <div class="col-lg-6">
              <div class="progress">
                <span class="skill"
                  ><span>HTML5</span> <i class="val">100%</i></span
                >
                <div class="progress-bar-wrap">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!-- End Skills Item -->

              <div class="progress">
                <span class="skill"
                  ><span>CSS</span> <i class="val">90%</i></span
                >
                <div class="progress-bar-wrap">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="90"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!-- End Skills Item -->

              <div class="progress">
                <span class="skill"
                  ><span>JavaScript</span> <i class="val">85%</i></span
                >
                <div class="progress-bar-wrap">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="85"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!-- End Skills Item -->
            </div>

            <div class="col-lg-6">
              <div class="progress">
                <span class="skill"
                  ><span>React</span> <i class="val">90%</i></span
                >
                <div class="progress-bar-wrap">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="90"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!-- End Skills Item -->

              <div class="progress">
                <span class="skill"
                  ><span>Svelte</span> <i class="val">70%</i></span
                >
                <div class="progress-bar-wrap">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="70"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!-- End Skills Item -->

              <div class="progress">
                <span class="skill"
                  ><span>Sql Server</span> <i class="val">85%</i></span
                >
                <div class="progress-bar-wrap">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    aria-valuenow="85"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!-- End Skills Item -->
            </div>
          </div>
        </div>
      </section>
      <!-- /Skills Section -->`;
  }
}

// Define the element
customElements.define("my-main-skills", MyMainSkills);

class MyMainContact extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <!-- Contact Section -->
      <section id="contact" class="contact section">
        <!-- Section Title -->
        <div class="container section-title" data-aos="fade-up">
          <h2>Contact</h2>
          <!-- <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p> -->
        </div>
        <!-- End Section Title -->

        <div class="container" data-aos="fade" data-aos-delay="100">
          <div class="row gy-4">
            <div class="col-lg-4">
              <div
                class="info-item d-flex"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <i class="bi bi-geo-alt flex-shrink-0"></i>
                <div>
                  <h3>Address</h3>
                  <p>Calle La Joaquina, San Rafael, Heredia, Costa Rica</p>
                </div>
              </div>
              <!-- End Info Item -->

              <div
                class="info-item d-flex"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <i class="bi bi-telephone flex-shrink-0"></i>
                <div>
                  <h3>Call Us</h3>
                  <p>+(506) 86906111</p>
                </div>
              </div>
              <!-- End Info Item -->

              <div
                class="info-item d-flex"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <i class="bi bi-envelope flex-shrink-0"></i>
                <div>
                  <h3>Email</h3>
                  <p>pabloandreychaconluna@hotmail.com</p>
                </div>
              </div>
              <!-- End Info Item -->
            </div>

            <!-- <div class="col-lg-8">
            <form action="forms/contact.php" method="post" class="php-email-form" data-aos="fade-up" data-aos-delay="200">
              <div class="row gy-4">

                <div class="col-md-6">
                  <input type="text" name="name" class="form-control" placeholder="Your Name" required="">
                </div>

                <div class="col-md-6 ">
                  <input type="email" class="form-control" name="email" placeholder="Your Email" required="">
                </div>

                <div class="col-md-12">
                  <input type="text" class="form-control" name="subject" placeholder="Subject" required="">
                </div>

                <div class="col-md-12">
                  <textarea class="form-control" name="message" rows="6" placeholder="Message" required=""></textarea>
                </div>

                <div class="col-md-12 text-center">
                  <div class="loading">Loading</div>
                  <div class="error-message"></div>
                  <div class="sent-message">Your message has been sent. Thank you!</div>

                  <button type="submit">Send Message</button>
                </div>

              </div>
            </form>
          </div> --><!-- End Contact Form -->
          </div>
        </div>
      </section>
      <!-- /Contact Section -->`;
  }
}

// Define the element
customElements.define("my-main-contact", MyMainContact);
