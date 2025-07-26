// Need to wait until the DOM is fully loaded before running the script
// This is to ensure that all elements are available for manipulation

function toExecuteOnLoad() {
  "use strict";

  /**
   * Load navigation dynamically
   */
  function loadNavigation() {
    console.log("loadNavigation function called");
    const navSection = document.getElementById("navSection");
    console.log("navSection element:", navSection);

    if (navSection) {
      console.log("Attempting to fetch sections/nav.html");
      fetch("sections/nav.html")
        .then((response) => {
          console.log("Navigation fetch response status:", response.status);
          if (!response.ok) {
            throw new Error("Failed to load navigation");
          }
          return response.text();
        })
        .then((html) => {
          console.log("Navigation HTML content received, length:", html.length);
          navSection.innerHTML = html;
          console.log("Navigation loaded successfully");
        })
        .catch((error) => {
          console.error("Error loading navigation:", error);
          navSection.innerHTML = "<p>Navigation could not be loaded</p>";
        });
    } else {
      console.error("navSection element not found");
    }
  }

  // Load navigation when DOM is ready
  loadNavigation();

  /**
   * Load contact section dynamically
   */
  function loadContactSection() {
    const contactSection = document.getElementById("contactSection");
    if (contactSection) {
      fetch("sections/contact.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load contact section");
          }
          return response.text();
        })
        .then((html) => {
          console.log("Raw HTML content:", html);
          console.log("HTML content length:", html.length);

          contactSection.innerHTML = html;
          console.log("Contact section loaded successfully");
          console.log("Contact section element:", contactSection);
          console.log("Contact section innerHTML:", contactSection.innerHTML);

          // Force visibility
          contactSection.style.display = "block";
          contactSection.style.visibility = "visible";
          contactSection.style.opacity = "1";

          // Check if the section is actually visible
          const computedStyle = window.getComputedStyle(contactSection);
          console.log("Contact section computed styles:", {
            display: computedStyle.display,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity,
            height: computedStyle.height,
            width: computedStyle.width,
          });
        })
        .catch((error) => {
          console.error("Error loading contact section:", error);
          contactSection.innerHTML =
            "<p>Contact section could not be loaded</p>";
        });
    }
  }

  // Load contact section when DOM is ready
  loadContactSection();

  /**
   * Handle contact form submission with EmailJS
   */
  function initializeContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Show loading button, hide submit button
        const submitBtn = document.getElementById("submitBtn");
        const loadingBtn = document.getElementById("loadingBtn");
        const formSuccess = document.getElementById("formSuccess");

        if (submitBtn && loadingBtn) {
          submitBtn.classList.add("d-none");
          loadingBtn.classList.remove("d-none");
        }

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get("from_name");
        const email = formData.get("from_email");
        const subject = formData.get("subject");
        const message = formData.get("message");

        // Load EmailJS dynamically
        var script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
        script.onload = function () {
          // Initialize EmailJS
          emailjs.init("L7o6hZUmFJQ_Jbqu0");

          // Send the email
          emailjs
            .send("service_s481rtv", "template_771ecr6", {
              to_email: "pabloandreychacon@gmail.com",
              from_name: name,
              from_email: email,
              subject: subject,
              message: `Subject: ${subject}
From: ${email}

${message}`,
            })
            .then(
              function () {
                // Show success message
                if (formSuccess) {
                  formSuccess.classList.remove("d-none");
                }
                contactForm.reset();

                // Hide loading button, show submit button
                if (loadingBtn && submitBtn) {
                  loadingBtn.classList.add("d-none");
                  submitBtn.classList.remove("d-none");
                }
              },
              function (error) {
                console.error("Email sending failed:", error);
                alert("Failed to send message. Please try again later.");

                // Hide loading button, show submit button
                if (loadingBtn && submitBtn) {
                  loadingBtn.classList.add("d-none");
                  submitBtn.classList.remove("d-none");
                }
              }
            );
        };
        document.head.appendChild(script);
      });
    }
  }

  // Initialize contact form after contact section is loaded
  setTimeout(() => {
    initializeContactForm();
  }, 1000);

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector(".header-toggle");

  function headerToggle() {
    document.querySelector("#header").classList.toggle("header-show");
    console.log("Header toggle clicked");
    headerToggleBtn.classList.toggle("bi-list");
    headerToggleBtn.classList.toggle("bi-x");
  }
  headerToggleBtn.addEventListener("click", headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".header-show")) {
        headerToggle();
      }
    });
  });
  /**
   * Hide mobile nav on scroll
   */
  window.addEventListener("scroll", () => {
    if (document.querySelector(".header-show")) {
      headerToggle();
    }
  });
  /**
   * Hide mobile nav on click outside
   */
  document.addEventListener("click", (e) => {
    if (
      document.querySelector(".header-show") &&
      !e.target.closest("#navmenu") &&
      !e.target.closest(".header-toggle")
    ) {
      headerToggle();
    }
  });
  /**
   * Hide mobile nav on ESC key
   */
  document.addEventListener("keydown", (e) => {
    // Check if the ESC key is pressed and the header is visible
    // and the click is not inside the navmenu or header toggle button
    // This is to prevent the header from closing when clicking inside the navmenu or header toggle button
    if (
      e.key === "Escape" &&
      document.querySelector(".header-show") &&
      !e.target.closest("#navmenu") &&
      !e.target.closest(".header-toggle")
    ) {
      headerToggle();
    }
  });
  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  /* const selectTyped = document.querySelector(".typed");
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  } */

  /**
   * Initiate Pure Counter
   */
  /* new PureCounter(); */

  /**
   * Animate the skills items on reveal
   */
  /* let skillsAnimation = document.querySelectorAll(".skills-animation");
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: "80%",
      handler: function (direction) {
        let progress = item.querySelectorAll(".progress .progress-bar");
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }); */

  /**
   * Initiate glightbox
   */
  /* const glightbox = GLightbox({
    selector: ".glightbox",
  }); */

  /**
   * Init isotope layout and filters
   */
  /* document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            if (typeof aosInit === "function") {
              aosInit();
            }
          },
          false
        );
      });
  }); */

  /**
   * Init swiper sliders
   */
  /* function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  } */

  //window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);

  /**
   * Theme switcher
   */

  const selectTheme = document.querySelector("#select-theme");
  const html = document.querySelector("html");
  const body = document.querySelector("body");
  if (selectTheme) {
    selectTheme.addEventListener("change", function () {
      html.setAttribute("data-bs-theme", this.value);
      localStorage.setItem("theme", this.value);
      if (this.value === "dark") {
        body.classList.add("dark-mode");
      } else {
        body.classList.remove("dark-mode");
      }
    });
  }
  if (localStorage.getItem("theme") !== null) {
    // If a theme is stored in localStorage, apply it
    html.setAttribute("data-bs-theme", localStorage.getItem("theme"));
    selectTheme.value = localStorage.getItem("theme");
  } else {
    // Default theme
    html.setAttribute("data-bs-theme", "light");
  }
  // if the theme is dark, add the dark-mode class to body
  if (html.getAttribute("data-bs-theme") === "dark") {
    selectTheme.value = "dark";
    body.classList.add("dark-mode");
  } else {
    selectTheme.value = "light";
    body.classList.remove("dark-mode");
  }
}

document.addEventListener("DOMContentLoaded", toExecuteOnLoad);
// This ensures that the function toExecuteOnLoad is executed once the DOM is fully loaded
// and ready for manipulation. This is important for ensuring that all elements are available
// before the script tries to access them.
