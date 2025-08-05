class CustomBottom extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // This method is called when the element is added to the DOM
    // You can dynamically create and append elements like <link>, <meta>, <style>, <title> here

    // add bootstrap.bundle.min.js
    const bootstrapScript = document.createElement("script");
    bootstrapScript.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
    );
    //bootstrapScript.setAttribute("defer", "");
    document.body.appendChild(bootstrapScript);

    // Example of adding a list of scripts
    const scripts = this.getAttribute("scripts");
    if (scripts) {
      scripts.split(",").forEach((script) => {
        const scriptElement = document.createElement("script");
        scriptElement.setAttribute("src", script.trim());
        //scriptElement.setAttribute("defer", "");
        document.body.appendChild(scriptElement);
      });
    }
    /* const scriptElement = document.createElement("script");
    scriptElement.setAttribute(
      "src",
      this.getAttribute("script-url") || "script.js"
    );
    scriptElement.setAttribute("defer", "");
    document.body.appendChild(scriptElement); */
  }
}

// Define the element
customElements.define("custom-bottom", CustomBottom);
