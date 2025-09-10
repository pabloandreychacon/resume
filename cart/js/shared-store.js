// Shared store functionality for all pages
class SharedStore {
  constructor() {
    this.cart = this.loadFromStorage("postore_cart") || [];
    this.wishlist = this.loadFromStorage("postore_wishlist") || [];
    this.init();

    // Add event listener to refresh cart when page is shown again
    window.addEventListener("pageshow", (event) => {
      // Check if the page is being shown from cache (back/forward navigation)
      if (event.persisted) {
        this.refreshCartFromStorage();
      }
    });
  }

  init() {
    // Wait for cart components to load:
    // cartComponentsSection for cart page
    // headerSection for other pages
    document.addEventListener("sectionLoaded", (e) => {
      console.log("Section loaded:", e.detail.id);
      if (
        e.detail.id === "cartComponentsSection" ||
        e.detail.id === "headerSection"
      ) {
        this.bindEvents();
        this.updateCartUI();
      }
    });
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

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  calculatePriceWithTax(product) {
    const basePrice = parseFloat(product.Price || 0);
    const taxRate =
      parseFloat(product.TaxRate || product.taxes || product.Taxes || 0) / 100;
    return (basePrice * (1 + taxRate)).toFixed(2);
  }

  formatPrice(price) {
    return StoreFunctions.formatPrice(price);
  }

  bindEvents() {
    // Checkout button
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        this.checkout();
      });
    }

    // Clear wishlist button
    const clearWishlistBtn = document.getElementById("clearWishlistBtn");
    if (clearWishlistBtn) {
      clearWishlistBtn.addEventListener("click", () => {
        this.clearWishlist();
      });
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => (item.Id || item.id) !== productId);
    this.updateCartUI();
    this.saveToStorage("postore_cart", this.cart);
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.cart.find((item) => (item.Id || item.id) === productId);
    if (item) {
      // Check stock validation if product manages stock
      if (item.StockQuantity !== null && item.StockQuantity !== undefined) {
        if (quantity > item.StockQuantity) {
          alert(
            `Cannot set quantity to ${quantity}. Only ${item.StockQuantity} available in stock`
          );
          return;
        }
      }

      item.quantity = quantity;
      this.updateCartUI();
      this.saveToStorage("postore_cart", this.cart);
    }
  }

  updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const wishlistItems = document.getElementById("wishlistItems");
    const wishlistCount = document.getElementById("wishlistCount");

    // Always update cart count in header, even if cart items section is not loaded
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    // delayed to ensure DOM is ready for cartCount
    setTimeout(() => {
      console.log("Updating cart count to:", totalItems);
      if (cartCount) cartCount.textContent = totalItems;
    }, 500);

    // If cart items section is not loaded, don't update the rest of the UI
    if (!cartItems) return;

    const totalPrice = this.cart.reduce(
      (sum, item) =>
        sum + parseFloat(this.calculatePriceWithTax(item)) * item.quantity,
      0
    );

    if (cartTotal) cartTotal.textContent = totalPrice.toFixed(2);
    if (wishlistCount) wishlistCount.textContent = this.wishlist.length;

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
        <div class="text-center text-muted py-5">
          <i class="bi bi-cart-x display-1"></i>
          <p class="mt-3">Your cart is empty</p>
        </div>
      `;
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      cartItems.innerHTML = this.cart
        .map(
          (item) => `
            <div class="cart-item s">
              <div class="row align-items-center">
                <div class="col-sm-2">
                  <img src="${item.ImageUrl || item.imageUrl}" alt="${
            item.Name || item.name
          }" class="cart-item-image">
                </div>
                <div class="col-sm-6">
                  <div class="cart-item-info">
                    <h6>${item.Name || item.name}</h6>
                    <p class="cart-item-price mb-0">${this.formatPrice(
                      this.calculatePriceWithTax(item)
                    )}</p>
                  </div>
                </div>
                <div class="col">
                  <div class="quantity-controls d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="(window.store || window.productStore).updateQuantity(${
                      item.Id || item.id
                    }, ${item.quantity - 1})">
                      <i class="bi bi-dash"></i>
                    </button>
                    <input type="number" value="${
                      item.quantity
                    }" min="1" class="form-control mx-1 text-center" style="width: 60px;" 
                           onchange="(window.store || window.productStore).updateQuantity(${
                             item.Id || item.id
                           }, parseInt(this.value))">
                    <button class="btn btn-sm btn-outline-secondary" onclick="(window.store || window.productStore).updateQuantity(${
                      item.Id || item.id
                    }, ${item.quantity + 1})">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <button class="btn btn-sm btn-outline-danger mt-1" onclick="(window.store || window.productStore).removeFromCart(${
                    item.Id || item.id
                  })">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          `
        )
        .join("");
      if (checkoutBtn) checkoutBtn.disabled = false;
    }

    // Update wishlist UI
    if (wishlistItems) {
      if (this.wishlist.length === 0) {
        wishlistItems.innerHTML = `
          <div class="text-center text-muted py-5">
            <i class="bi bi-heart display-1"></i>
            <p class="mt-3">Your wishlist is empty</p>
          </div>
        `;
      } else {
        wishlistItems.innerHTML = this.wishlist
          .map(
            (item) => `
              <div class="cart-item">
                <div class="row align-items-center">
                  <div class="col-3">
                    <img src="${item.ImageUrl || item.imageUrl}" alt="${
              item.Name || item.name
            }" class="cart-item-image">
                  </div>
                  <div class="col-6">
                    <div class="cart-item-info">
                      <h6>${item.Name || item.name}</h6>
                      <p class="cart-item-price mb-0">${this.formatPrice(
                        this.calculatePriceWithTax(item)
                      )}</p>
                    </div>
                  </div>
                  <div class="col-3">
                    <button class="btn btn-sm btn-primary mb-1 w-100" onclick="(window.store || window.productStore).addToCartFromWishlist(${
                      item.Id || item.id
                    })">
                      <i class="bi bi-cart-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger w-100" onclick="(window.store || window.productStore).toggleWishlist({...${JSON.stringify(
                      item
                    ).replace(/"/g, '"')}, Id: ${item.Id || item.id}})">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            `
          )
          .join("");
      }
    }
  }

  toggleWishlist(product) {
    const existingIndex = this.wishlist.findIndex(
      (item) => (item.Id || item.id) === (product.Id || product.id)
    );

    if (existingIndex > -1) {
      this.wishlist.splice(existingIndex, 1);
    } else {
      this.wishlist.push(product);
    }

    this.saveToStorage("postore_wishlist", this.wishlist);
    this.updateCartUI();
  }

  clearWishlist() {
    this.wishlist = [];
    this.updateCartUI();
    this.saveToStorage("postore_wishlist", this.wishlist);
  }

  addToCart(product, quantity = 1) {
    // Check stock validation if product manages stock
    if (product.StockQuantity !== null && product.StockQuantity !== undefined) {
      const existingItem = this.cart.find((item) => item.Id === product.Id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      if (currentQuantityInCart + quantity > product.StockQuantity) {
        const availableToAdd = product.StockQuantity - currentQuantityInCart;
        if (availableToAdd <= 0) {
          alert(
            `Cannot add more ${product.Name}. Stock limit reached (${product.StockQuantity} available)`
          );
          return false;
        } else {
          alert(
            `Only ${availableToAdd} more can be added. Stock limit: ${product.StockQuantity}`
          );
          return false;
        }
      }
    }

    const existingItem = this.cart.find(
      (item) => (item.Id || item.id) === (product.Id || product.id)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        ...product,
        quantity: quantity,
      });
    }

    this.updateCartUI();
    this.saveToStorage("postore_cart", this.cart);
    return true;
  }

  addToCartFromWishlist(productId) {
    StoreFunctions.addToCartFromWishlist(this, productId);
  }

  checkout() {
    if (this.cart.length === 0) return;

    // Determine checkout path based on current location
    const isInPages = window.location.pathname.includes("/pages/");
    const checkoutPath = isInPages ? "checkout.html" : "pages/checkout.html";

    window.location.href = checkoutPath;
  }

  refreshCartFromStorage() {
    // Reload cart and wishlist from localStorage
    this.cart = this.loadFromStorage("postore_cart") || [];
    this.wishlist = this.loadFromStorage("postore_wishlist") || [];

    // Update UI to reflect new cart data
    this.updateCartUI();
  }
}

// Initialize shared store
let store;
document.addEventListener("DOMContentLoaded", function () {
  store = new SharedStore();
  window.store = store;
});
