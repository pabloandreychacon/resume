// Shared form utilities
class FormUtils {
  // Input sanitization function
  static sanitizeInput(input) {
    if (!input) return '';
    return input
      .trim()
      .replace(/[<>\"'&]/g, function(match) {
        const map = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return map[match];
      })
      .substring(0, 1000); // Limit length
  }

  // Sanitize multiple form fields
  static sanitizeFormData(formData) {
    const sanitized = {};
    for (const [key, value] of Object.entries(formData)) {
      sanitized[key] = this.sanitizeInput(value);
    }
    return sanitized;
  }

  // Email validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show/hide loading state
  static toggleLoadingState(submitBtnId, loadingBtnId, isLoading) {
    const submitBtn = document.getElementById(submitBtnId);
    const loadingBtn = document.getElementById(loadingBtnId);
    
    if (isLoading) {
      submitBtn.classList.add('d-none');
      loadingBtn.classList.remove('d-none');
    } else {
      submitBtn.classList.remove('d-none');
      loadingBtn.classList.add('d-none');
    }
  }
}

// Make it globally available
window.FormUtils = FormUtils;