// Shared store functionality for all pages
class SharedStore {
  constructor() {
    this.cart = this.loadFromStorage("postore_cart") || [];
    this.wishlist = this.loadFromStorage("postore_wishlist") || [];
    this.init();
  }

  init() {
    // Wait for cart components to load
    document.addEventListener("sectionLoaded", (e) => {
      if (e.detail.id === "cartComponentsSection") {
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

    if (!cartItems) return;

    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce(
      (sum, item) => sum + (item.Price || item.price) * item.quantity,
      0
    );

    if (cartCount) cartCount.textContent = totalItems;
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
                    <p class="cart-item-price mb-0">$${(
                      item.Price || item.price
                    ).toFixed(2)}</p>
                  </div>
                </div>
                <div class="col-3">
                  <div class="quantity-controls d-flex align-items-center">
                    <button class="btn-sm" onclick="store.updateQuantity(${
                      item.Id || item.id
                    }, ${item.quantity - 1})">
                      <i class="bi bi-dash"></i>
                    </button>
                    <input type="number" value="${
                      item.quantity
                    }" min="1" class="mx-1" 
                           onchange="store.updateQuantity(${
                             item.Id || item.id
                           }, parseInt(this.value))">
                    <button class="btn-sm" onclick="store.updateQuantity(${
                      item.Id || item.id
                    }, ${item.quantity + 1})">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <button class="btn btn-sm btn-outline-danger mt-1" onclick="store.removeFromCart(${
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
                      <p class="cart-item-price mb-0">$${(
                        item.Price || item.price
                      ).toFixed(2)}</p>
                    </div>
                  </div>
                  <div class="col-3">
                    <button class="btn btn-sm btn-outline-danger w-100" onclick="store.toggleWishlist(store.wishlist.find(p => (p.Id || p.id) === ${
                      item.Id || item.id
                    }))">
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

  addToCart(product) {
    const existingItem = this.cart.find(
      (item) => (item.Id || item.id) === (product.Id || product.id)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
      });
    }

    this.updateCartUI();
    this.saveToStorage("postore_cart", this.cart);
  }

  checkout() {
    if (this.cart.length === 0) return;

    // Determine checkout path based on current location
    const isInPages = window.location.pathname.includes("/pages/");
    const checkoutPath = isInPages ? "checkout.html" : "pages/checkout.html";

    window.location.href = checkoutPath;
  }
}

// Initialize shared store
let store;
document.addEventListener("DOMContentLoaded", function () {
  store = new SharedStore();
  window.store = store;
});
