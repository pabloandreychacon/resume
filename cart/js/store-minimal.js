// Minimal store implementation for non-index pages
class MinimalStore {
  constructor() {
    this.cart = this.loadFromStorage("modernstore_cart") || [];
    this.wishlist = this.loadFromStorage("modernstore_wishlist") || [];
    this.updateUI();
  }

  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return null;
    }
  }

  updateUI() {
    const cartCount = document.getElementById("cartCount");
    const wishlistCount = document.getElementById("wishlistCount");
    
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
    }
    
    if (wishlistCount) {
      wishlistCount.textContent = this.wishlist.length;
    }
  }
}

// Initialize minimal store when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  // Wait for header section to load
  document.addEventListener("sectionLoaded", function(e) {
    if (e.detail.id === "headerSection") {
      // Give the DOM time to update
      setTimeout(function() {
        window.minimalStore = new MinimalStore();
      }, 200);
    }
  });
});