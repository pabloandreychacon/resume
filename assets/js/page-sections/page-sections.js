class MyHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `      
      <header
        id="header"
        class="header d-flex flex-column justify-content-center"
      >
        <i class="header-toggle d-xl-none bi bi-list"></i>

        <nav id="navmenu" class="navmenu">
          <ul>
            <li>
              <a href="#hero" class="active"
                ><i class="bi bi-house navicon"></i><span>Home</span></a
              >
            </li>
            <li>
              <a href="#about"
                ><i class="bi bi-person navicon"></i><span>About</span></a
              >
            </li>
            <li>
              <a href="#stats"
                ><i class="bi bi-file-earmark-text navicon"></i
                ><span>Stats</span></a
              >
            </li>
            <li>
              <a href="#skills"
                ><i class="bi bi-images navicon"></i><span>Skills</span></a
              >
            </li>
            <!-- <li><a href="#services"><i class="bi bi-hdd-stack navicon"></i><span>Services</span></a></li> -->
            <li>
              <a href="#contact"
                ><i class="bi bi-envelope navicon"></i><span>Contact</span></a
              >
            </li>
          </ul>
        </nav>
      </header>
    `;
  }
}

// Define the element
customElements.define("my-header", MyHeader);

class MyFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<footer id="footer" class="footer position-relative">
      <div class="container">
        <h3 class="sitename">Andrey Chacon</h3>
        <!-- <p>Et aut eum quis fuga eos sunt ipsa nihil. Labore corporis magni eligendi fuga maxime saepe commodi placeat.</p> -->
        <div class="social-links d-flex justify-content-center">          
          <a
            href="https://www.linkedin.com/in/pabloandreychaconluna/"
            target="_blank"
            ><i class="bi bi-linkedin"></i
          ></a>
        </div>
        <div class="container">
          <div class="copyright">
            <span>Copyright</span>
            <strong class="px-1 sitename">Andrey Chacon</strong>
            <span>All Rights Reserved</span>
          </div>
          <div class="credits"></div>
        </div>
      </div>
    </footer>`;
  }
}

// Define the element
customElements.define("my-footer", MyFooter);
