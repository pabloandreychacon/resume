// Global Price Formatter Module
class PriceFormatter {
  constructor() {
    this.settings = null;
    this.formatter = null;
    this.exchangeRate = 1; // Default exchange rate (no conversion)
    this.initialized = false;
  }

  async init() {
    try {
      // Get settings from Supabase
      await this.loadSettings();
      this.initialized = true;
      console.log("PriceFormatter initialized with settings:", this.settings);
    } catch (error) {
      console.error("Error initializing PriceFormatter:", error);
      // Set default formatter as fallback
      this.formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
  }

  async loadSettings() {
    // Wait for Supabase to be initialized
    while (typeof supabase === "undefined") {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
      // Get the current business email from localStorage
      const email = JSON.parse(localStorage.getItem("postore_email"));

      if (!email) {
        console.warn("No business email found, using default price formatting");
        this.setDefaultFormatter();
        return;
      }

      // Get settings from Supabase
      const { data, error } = await supabase
        .from("Settings")
        .select("LanguageFormat, CurrencyCode, ExchangeRate")
        .eq("Email", email)
        .single();

      if (error || !data) {
        console.warn("Error loading settings from Supabase:", error);
        this.setDefaultFormatter();
        return;
      }

      this.settings = data;

      // Set up formatter based on settings
      const languageFormat = data.LanguageFormat || "en-US";
      const currencyCode = data.CurrencyCode || "USD";
      this.exchangeRate = data.ExchangeRate || 1;

      this.formatter = new Intl.NumberFormat(languageFormat, {
        style: "currency",
        currency: currencyCode,
      });

      console.log(
        `Price formatter configured with ${languageFormat} and ${currencyCode}`
      );
    } catch (error) {
      console.error("Error in loadSettings:", error);
      this.setDefaultFormatter();
    }
  }

  setDefaultFormatter() {
    // Default to USD formatting for United States
    this.formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    this.settings = {
      LanguageFormat: "en-US",
      CurrencyCode: "USD",
      ExchangeRate: 1,
    };
  }

  format(price) {
    if (!this.initialized) {
      console.warn(
        "PriceFormatter not initialized yet, using default formatting"
      );
      return `${parseFloat(price).toFixed(2)}`;
    }

    try {
      return this.formatter.format(parseFloat(price));
    } catch (error) {
      console.error("Error formatting price:", error);
      return `${parseFloat(price).toFixed(2)}`;
    }
  }
}

// Create global instance
const priceFormatter = new PriceFormatter();

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  await priceFormatter.init();
});

// Make it globally available
window.priceFormatter = priceFormatter;
