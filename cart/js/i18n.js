// i18n.js - Internationalization library

class I18n {
  constructor() {
    console.log("I18n constructor called");
    this.currentLanguage = this.getLanguage();
    console.log("Current language set to:", this.currentLanguage);
    this.translations = {};
    this.init();
  }

  async init() {
    // Load translations for the current language
    await this.loadTranslations(this.currentLanguage);

    // Listen for language change events
    window.addEventListener("languageChange", (event) => {
      console.log("languageChange event received:", event.detail.language);
      this.changeLanguage(event.detail.language);
    });

    // Listen for section loaded events to update translations in dynamically loaded content
    document.addEventListener("sectionLoaded", () => {
      console.log("Section loaded, updating page translations");
      this.updatePageTranslations();
    });

    // Update page translations immediately after initialization
    this.updatePageTranslations();
  }

  getLanguage() {
    console.log("Getting language...");
    // Check for language in URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLanguage = urlParams.get("lang");
    console.log("URL language parameter:", urlLanguage);
    if (urlLanguage && (urlLanguage === "en" || urlLanguage === "es")) {
      // Save URL language to localStorage for future visits
      localStorage.setItem("language", urlLanguage);
      return urlLanguage;
    }

    // Check if language is stored in localStorage
    const storedLanguage = localStorage.getItem("language");
    console.log("Stored language:", storedLanguage);
    if (storedLanguage) {
      return storedLanguage;
    }

    // Check browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    console.log("Browser language:", browserLanguage);
    if (browserLanguage.startsWith("es")) {
      return "es";
    }

    // Default to English
    console.log("Defaulting to English");
    return "en";
  }

  async loadTranslations(language) {
    console.log("Loading translations for:", language);
    try {
      // Determine the correct path based on current location
      const currentPath = window.location.pathname;
      const isInSubdirectory =
        currentPath.includes("/pages/") || currentPath.includes("/admin/");
      const translationPath = isInSubdirectory
        ? `../translations/${language}.json`
        : `translations/${language}.json`;

      const response = await fetch(translationPath);
      console.log("Fetch response for", language, ":", response.status);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} translations`);
      }
      this.translations[language] = await response.json();
      console.log(
        "Translations loaded for:",
        language,
        this.translations[language]
      );
      return this.translations[language];
    } catch (error) {
      console.error(`Error loading ${language} translations:`, error);
      // Fallback to English if translations can't be loaded
      if (language !== "en") {
        return this.loadTranslations("en");
      }
      return {};
    }
  }

  async changeLanguage(language) {
    console.log("changeLanguage called with:", language);
    console.log("Current language:", this.currentLanguage);
    if (this.currentLanguage !== language) {
      console.log(
        "Language changing from",
        this.currentLanguage,
        "to",
        language
      );
      this.currentLanguage = language;
      localStorage.setItem("language", language);
      console.log("Language saved to localStorage:", language);

      // Load translations if not already loaded
      if (!this.translations[language]) {
        console.log("Loading translations for:", language);
        await this.loadTranslations(language);
      }

      // Emit event for other parts of the app to update
      window.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: { language: language },
        })
      );
      console.log("languageChanged event dispatched");

      // Update all translated elements on the page
      this.updatePageTranslations();
      console.log("Page translations updated for:", language);
    } else {
      console.log("Language is already set to:", language);
    }
  }

  t(key) {
    // Return translated string or the key if not found
    const translation = this.translations[this.currentLanguage]?.[key] || key;
    /* console.log(
      "Translating key:",
      key,
      "to:",
      translation,
      "in language:",
      this.currentLanguage
    ); */
    return translation;
  }

  updatePageTranslations() {
    console.log("updatePageTranslations called");
    // Update all elements with data-i18n attributes
    const elements = document.querySelectorAll("[data-i18n]");
    console.log("Found", elements.length, "elements with data-i18n attribute");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.t(key);
      /* console.log("Translating element with key:", key, "to:", translation); */

      // Check if it's an input placeholder or regular text content
      if (element.tagName === "INPUT" && element.hasAttribute("placeholder")) {
        element.setAttribute("placeholder", translation);
      } else if (element.hasAttribute("aria-label")) {
        element.setAttribute("aria-label", translation);
      } else {
        element.textContent = translation;
      }
    });

    // Update the html lang attribute
    document.documentElement.lang = this.currentLanguage;
    console.log("HTML lang attribute updated to:", this.currentLanguage);
  }

  // Method to translate and replace placeholders in strings
  translateWithPlaceholders(key, placeholders = {}) {
    let translation = this.t(key);

    // Replace placeholders in the format {placeholderName}
    for (const [placeholder, value] of Object.entries(placeholders)) {
      translation = translation.replace(
        new RegExp(`{${placeholder}}`, "g"),
        value
      );
    }

    return translation;
  }
}

// Initialize i18n when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired for i18n");
  console.log("Initializing i18n...");
  window.i18n = new I18n();
  console.log("i18n initialized with language:", window.i18n.currentLanguage);
  // Update page translations when DOM is loaded
  window.i18n.updatePageTranslations();
  console.log("Page translations updated");
});

// Also initialize immediately if DOM is already loaded
console.log("Document readyState:", document.readyState);
if (document.readyState === "loading") {
  console.log("Document is still loading, waiting for DOMContentLoaded");
  document.addEventListener("DOMContentLoaded", initializeI18n);
} else {
  console.log("Document is already loaded, calling initializeI18n immediately");
  initializeI18n();
}

function initializeI18n() {
  console.log("initializeI18n called");
  if (!window.i18n) {
    console.log("Creating new I18n instance");
    window.i18n = new I18n();
  } else {
    console.log("i18n instance already exists");
  }
}

// Make sure i18n is available globally
if (typeof window !== "undefined") {
  window.I18n = I18n;
}
