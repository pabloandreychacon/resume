// Centralized store functions to avoid duplication
class StoreFunctions {
  static calculatePriceWithTax(product) {
    const basePrice = parseFloat(product.Price || 0);
    const taxRate =
      parseFloat(product.TaxRate || product.taxes || product.Taxes || 0) / 100;
    return (basePrice * (1 + taxRate)).toFixed(2);
  }

  static async waitForPriceFormatter(maxWaitTime = 5000, retryInterval = 50) {
    // First wait for priceFormatter to exist
    const startTime = Date.now();
    while (typeof window.priceFormatter === "undefined" && Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    
    // If it doesn't exist after timeout, return false
    if (typeof window.priceFormatter === "undefined") {
      console.warn("Price formatter not available after waiting", maxWaitTime, "ms");
      return false;
    }
    
    // Now wait for initialization
    const initStartTime = Date.now();
    while (!window.priceFormatter.initialized && Date.now() - initStartTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
    
    return window.priceFormatter.initialized || false;
  }

  static formatPrice(price) {
    // Use the global price formatter if available, otherwise fallback to default formatting
    if (window.priceFormatter && window.priceFormatter.initialized) {
      try {
        return window.priceFormatter.format(price);
      } catch (error) {
        console.error("Error using price formatter:", error);
        // Fall back to default formatting
      }
    }
    
    // If price formatter exists but not initialized, log warning and schedule retry
    if (window.priceFormatter && !window.priceFormatter.initialized) {
      console.warn("PriceFormatter not yet initialized, using default formatting");
      
      // Schedule a retry in the background
      setTimeout(async () => {
        const initialized = await this.waitForPriceFormatter();
        if (initialized) {
          console.log("Price formatter initialized in background");
        } else {
          console.warn("Price formatter initialization timed out");
        }
      }, 0);
    }
    
    // Always provide a fallback
    return `${parseFloat(price || 0).toFixed(2)}`;
  }
  
  static formatPriceWithUsdEquivalent(price) {
    // Use the global price formatter if available, otherwise fallback to default formatting
    if (window.priceFormatter && window.priceFormatter.initialized) {
      try {
        return window.priceFormatter.formatWithUsdEquivalent(price);
      } catch (error) {
        console.error("Error formatting price with USD equivalent:", error);
        // Fall back to regular price formatting
        return this.formatPrice(price);
      }
    }
    
    // If price formatter exists but not initialized, log warning and schedule retry
    if (window.priceFormatter && !window.priceFormatter.initialized) {
      console.warn("PriceFormatter not yet initialized, using default formatting");
      
      // Schedule a retry in the background
      setTimeout(async () => {
        const initialized = await this.waitForPriceFormatter();
        if (initialized) {
          console.log("Price formatter initialized in background for USD equivalent");
        } else {
          console.warn("Price formatter initialization timed out for USD equivalent");
        }
      }, 0);
    }
    
    // Always provide a fallback
    return `${parseFloat(price || 0).toFixed(2)}`;
  }

  static addToCartFromWishlist(store, productId) {
    const wishlistItem = store.wishlist.find(
      (item) => (item.Id || item.id) === productId
    );
    if (wishlistItem) {
      // Check if product manages stock and is out of stock
      if (
        wishlistItem.StockQuantity !== null &&
        wishlistItem.StockQuantity !== undefined &&
        wishlistItem.StockQuantity === 0
      ) {
        if (store.showToast) {
          store.showToast(
            `${wishlistItem.Name} is out of stock and cannot be added to cart`,
            "warning"
          );
        } else {
          alert(
            `${wishlistItem.Name} is out of stock and cannot be added to cart`
          );
        }
        return;
      }

      const success = store.addToCart(wishlistItem, 1);
      if (success) {
        store.toggleWishlist(wishlistItem);
      }
    }
  }

  static addToCart(store, product, quantity = 1) {
    // Check stock validation if product manages stock
    if (product.StockQuantity !== null && product.StockQuantity !== undefined) {
      const existingItem = store.cart.find((item) => item.Id === product.Id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      if (currentQuantityInCart + quantity > product.StockQuantity) {
        const availableToAdd = product.StockQuantity - currentQuantityInCart;
        if (availableToAdd <= 0) {
          const message = `Cannot add more ${product.Name}. Stock limit reached (${product.StockQuantity} available)`;
          if (store.showToast) {
            store.showToast(message, "warning");
          } else {
            alert(message);
          }
          return false;
        } else {
          const message = `Only ${availableToAdd} more can be added. Stock limit: ${product.StockQuantity}`;
          if (store.showToast) {
            store.showToast(message, "warning");
          } else {
            alert(message);
          }
          return false;
        }
      }
    }

    const existingItem = store.cart.find((item) => item.Id === product.Id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      store.cart.push({
        ...product,
        quantity: quantity,
      });
    }

    store.updateCartUI();
    store.saveToStorage("postore_cart", store.cart);

    const message = `${product.Name} added to cart!`;
    if (store.showToast) {
      store.showToast(message, "success");
    }
    return true;
  }

  static updateQuantity(store, productId, quantity) {
    if (quantity <= 0) {
      store.removeFromCart(productId);
      return;
    }

    const item = store.cart.find((item) => (item.Id || item.id) === productId);
    if (item) {
      // Check stock validation if product manages stock
      if (item.StockQuantity !== null && item.StockQuantity !== undefined) {
        if (quantity > item.StockQuantity) {
          const message = `Cannot set quantity to ${quantity}. Only ${item.StockQuantity} available in stock`;
          if (store.showToast) {
            store.showToast(message, "warning");
          } else {
            alert(message);
          }
          return;
        }
      }

      item.quantity = quantity;
      store.updateCartUI();
      store.saveToStorage("postore_cart", store.cart);
    }
  }
}

// Make it globally available
window.StoreFunctions = StoreFunctions;
