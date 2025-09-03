class CustomHead extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // This method is called when the element is added to the DOM
    // You can dynamically create and append elements like <link>, <meta>, <style>, <title> here

    const metaUTF = document.createElement("meta");
    metaUTF.setAttribute("name", "charset");
    metaUTF.setAttribute("content", "UTF-8");
    document.head.appendChild(metaUTF);
    
    // Add preconnect for Supabase storage
    const preconnectSupabase = document.createElement("link");
    preconnectSupabase.setAttribute("rel", "preconnect");
    preconnectSupabase.setAttribute("href", "https://supabase.co");
    document.head.appendChild(preconnectSupabase);
    
    // Add DNS prefetch for image domains
    const dnsPrefetch = document.createElement("link");
    dnsPrefetch.setAttribute("rel", "dns-prefetch");
    dnsPrefetch.setAttribute("href", "https://supabase.co");
    document.head.appendChild(dnsPrefetch);

    const metaViewport = document.createElement("meta");
    metaViewport.setAttribute("name", "viewport");
    metaViewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0"
    );
    document.head.appendChild(metaViewport);

    const titleElement = document.createElement("title");
    titleElement.textContent = this.getAttribute("page-title") || "POStore";
    document.head.appendChild(titleElement);

    const metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    metaDescription.setAttribute(
      "content",
      this.getAttribute("description") || "Default description."
    );
    document.head.appendChild(metaDescription);

    // keywords
    const metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    metaKeywords.setAttribute(
      "content",
      this.getAttribute("keywords") || "default, keywords, here"
    );
    document.head.appendChild(metaKeywords);

    // author
    const metaAuthor = document.createElement("meta");
    metaAuthor.setAttribute("name", "author");
    metaAuthor.setAttribute(
      "content",
      this.getAttribute("author") || "POStore Team"
    );
    document.head.appendChild(metaAuthor);

    // Example of adding a favicon
    const linkFavicon = document.createElement("link");
    linkFavicon.setAttribute("rel", "icon");
    linkFavicon.setAttribute(
      "href",
      this.getAttribute("favicon-url") || "favicon.ico"
    );
    linkFavicon.setAttribute("type", "image/x-icon");
    document.head.appendChild(linkFavicon);

    // Example of adding a Bootstrap CSS
    const linkBootstrap = document.createElement("link");
    linkBootstrap.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    );
    linkBootstrap.setAttribute("rel", "stylesheet");
    document.head.appendChild(linkBootstrap);

    // Example of adding Bootstrap Icons
    const linkBootstrapIcons = document.createElement("link");
    linkBootstrapIcons.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
    );
    linkBootstrapIcons.setAttribute("rel", "stylesheet");
    document.head.appendChild(linkBootstrapIcons);

    // Example of adding a list of stylesheets from the attribute string list
    const stylesheets = this.getAttribute("stylesheets");
    if (stylesheets) {
      stylesheets.split(",").forEach((stylesheet) => {
        const linkStylesheet = document.createElement("link");
        linkStylesheet.setAttribute("rel", "stylesheet");
        linkStylesheet.setAttribute("href", stylesheet.trim());
        document.head.appendChild(linkStylesheet);
      });
    }

    // Example of adding a list of scripts
    const scripts = this.getAttribute("scripts");
    if (scripts) {
      scripts.split(",").forEach((script) => {
        const scriptElement = document.createElement("script");
        scriptElement.setAttribute("src", script.trim());
        scriptElement.setAttribute("defer", "");
        document.head.appendChild(scriptElement);
      });
    }
    /* const scriptElement = document.createElement("script");
    scriptElement.setAttribute(
      "src",
      this.getAttribute("script-url") || "script.js"
    );
    scriptElement.setAttribute("defer", "");
    document.head.appendChild(scriptElement); */
  }
}

// Define the element
customElements.define("custom-head", CustomHead);
