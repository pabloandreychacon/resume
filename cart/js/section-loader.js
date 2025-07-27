// Function to load HTML sections
function loadSection(elementId, sectionPath, searchPath = "") {
  const element = document.getElementById(elementId);
  if (!element) return;

  fetch(sectionPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      // If a search path is provided, add it to the href attributes in the HTML
      if (searchPath) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const links = doc.querySelectorAll("a[href]");
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && !href.startsWith("#") && !href.startsWith("http")) {
            link.setAttribute("href", searchPath + href);
          }
        });
        html = doc.documentElement.innerHTML;
      }
      element.innerHTML = html;
      // Re-initialize any scripts that might be needed for the loaded section
      const scripts = element.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(script.innerHTML));
        script.parentNode.replaceChild(newScript, script);
      });
      // Dispatch a custom event to notify that the section has been loaded
      const event = new CustomEvent("sectionLoaded", {
        detail: { id: elementId },
      });
      document.dispatchEvent(event);
    })
    .catch((error) => {
      console.error("Error loading section:", error);
      element.innerHTML = `<div class="alert alert-danger">Error loading content</div>`;
    });
}
