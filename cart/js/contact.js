// Add custom page scripts here
document.addEventListener("DOMContentLoaded", function () {
  // Wait for sections to load
  document.addEventListener("sectionLoaded", function (e) {
    if (e.detail.id === "headerSection") {
      // Add active class to the About nav link
      document.querySelectorAll(".nav-link").forEach((link) => {
        if (link.getAttribute("href").includes("contact")) {
          link.classList.add("active");
        }
      });
    }
  });
  // Handle form submission with EmailJS
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Show loading button, hide submit button
      document.getElementById("submitBtn").classList.add("d-none");
      document.getElementById("loadingBtn").classList.remove("d-none");

      // Get form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

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
            to_email:
              window.EmailUtils?.getBusinessEmail() ||
              "pabloandreychacon@gmail.com",
            from_name: name,
            from_email: email,
            subject: subject,
            message: `Subject: ${subject} From: ${email} ${message}`,
          })
          .then(
            function () {
              // Show success message
              document.getElementById("formSuccess").classList.remove("d-none");
              document.getElementById("contactForm").reset();

              // Hide loading button, show submit button
              document.getElementById("loadingBtn").classList.add("d-none");
              document.getElementById("submitBtn").classList.remove("d-none");
            },
            function (error) {
              console.error("Email sending failed:", error);
              alert("Failed to send message. Please try again later.");

              // Hide loading button, show submit button
              document.getElementById("loadingBtn").classList.add("d-none");
              document.getElementById("submitBtn").classList.remove("d-none");
            }
          );
      };
      document.head.appendChild(script);
    });

  // Set business phone number
  const businessPhone = (() => {
    try {
      const globalStateStr = localStorage.getItem("globalState");
      if (globalStateStr) {
        const globalState = JSON.parse(globalStateStr);
        if (globalState.Phone) {
          return globalState.Phone;
        }
      }
    } catch (error) {
      console.error("Error reading business phone from localStorage:", error);
    }
    return "+1 (800) 123-4567";
  })();
  // Update phone link and text
  document.getElementById("business-phone").textContent = businessPhone;

  // Set business email
  const businessEmail = window.EmailUtils?.getBusinessEmail() || "";
  // Update email text
  document.getElementById("business-email").textContent = businessEmail;

  // Set business address
  const businessAddress = (() => {
    try {
      const globalStateStr = localStorage.getItem("globalState");
      if (globalStateStr) {
        const globalState = JSON.parse(globalStateStr);
        if (globalState.Address) {
          return globalState.Address;
        }
      }
    } catch (error) {
      console.error("Error reading business address from localStorage:", error);
    }
    return "123 Commerce Street";
  })();
  // Update address text
  document.getElementById("business-address").textContent = businessAddress;

  // Set business location
  const businessLocation = (() => {
    try {
      const globalStateStr = localStorage.getItem("globalState");
      if (globalStateStr) {
        const globalState = JSON.parse(globalStateStr);
        if (globalState.MapLocation) {
          return globalState.MapLocation;
        }
      }
    } catch (error) {
      console.error("Error reading business location from localStorage:", error);
    }
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d171.12713250416522!2d-73.72860815528284!3d40.68220458419986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNueva%20York%2C%20EE.%20UU.!5e1!3m2!1ses-419!2scr!4v1753604260812!5m2!1ses-419!2scr";
  })();
  // Update iframe src
  document.getElementById("business-location").src = businessLocation;
});
