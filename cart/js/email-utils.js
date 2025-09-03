// Utility functions for email handling
class EmailUtils {
  /**
   * Get the business email directly from localStorage
   * This bypasses potential synchronization issues with globalStore
   * @returns {string|null} The business email or null if not found
   */
  static getBusinessEmail() {
    try {
      // Get the current business email from localStorage
      const email = JSON.parse(localStorage.getItem("postore_email"));
      if (email) {
        return email;
      }

      // Fallback to default email if not found
      console.warn("Business email not found in localStorage, using default");
      return "pabloandreychacon@hotmail.com";
    } catch (error) {
      console.error("Error reading business email from localStorage:", error);
      return "pabloandreychacon@hotmail.com";
    }
  }

  /**
   * Set the business email in localStorage
   * @param {string} email - The email to set
   */
  static setBusinessEmail(email) {
    try {
      // Save email to localStorage
      localStorage.setItem("postore_email", JSON.stringify(email));

      // Also update the globalStore if it exists
      if (window.globalStore) {
        window.globalStore.setState({ Email: email });
      }
    } catch (error) {
      console.error("Error saving business email to localStorage:", error);
    }
  }
}

// Make it globally available
window.EmailUtils = EmailUtils;
