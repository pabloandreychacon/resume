// POStore JavaScript

class EcommerceStore {
  constructor() {
    this.products = [];
    this.cart = this.loadFromStorage("modernstore_cart") || [];
    this.wishlist = this.loadFromStorage("modernstore_wishlist") || [];
    this.currentFilter = "all";
    this.currentSort = "default";
    this.init();
  }

  init() {
    this.loadProducts();
    this.bindEvents();
    this.renderProducts();
    this.updateCartUI();
    //this.updateWishlistUI();
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

  loadProducts() {
    // read data from json file data/products.json
    let productsData = [];
    // fetch from file
    fetch("data/products.json")
      .then((response) => response.json())
      .then((data) => {
        productsData = data;
        this.products = productsData;
        this.renderProducts();
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }

  bindEvents() {
    // Main search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchProducts(e.target.value);
      });
    }

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = document.getElementById("searchInput").value;
        this.searchProducts(query);
      });
    }

    // Small search functionality
    const searchInputSmall = document.getElementById("searchInputSmall");
    if (searchInputSmall) {
      searchInputSmall.addEventListener("input", (e) => {
        this.searchProducts(e.target.value);
      });
    }

    const searchBtnSmall = document.getElementById("searchBtnSmall");
    if (searchBtnSmall) {
      searchBtnSmall.addEventListener("click", () => {
        const query = document.getElementById("searchInputSmall").value;
        this.searchProducts(query);
      });
    }

    // Category filtering
    document.querySelectorAll("[data-category]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.filterProducts(e.target.dataset.category);

        // Update active state
        document
          .querySelectorAll("[data-category]")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });

    // Sorting
    document.getElementById("sortSelect").addEventListener("change", (e) => {
      this.sortProducts(e.target.value);
    });

    // Checkout button
    document.getElementById("checkoutBtn").addEventListener("click", () => {
      this.checkout();
    });

    // Clear wishlist button
    document
      .getElementById("clearWishlistBtn")
      .addEventListener("click", () => {
        //if (confirm("Are you sure you want to clear your wishlist?")) {
        this.clearWishlist();
        //}
      });
  }

  renderProducts(products) {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    let filteredProducts = products || this.products;

    // Apply category filter only if not searching
    if (!products && this.currentFilter !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === this.currentFilter
      );
    }

    // Apply sorting
    if (!products && this.currentSort !== "default") {
      filteredProducts = this.applySorting(filteredProducts);
    }

    if (filteredProducts.length === 0) {
      container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search display-1 text-muted"></i>
        <h3 class="mt-3 text-muted">No products found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
      return;
    }

    filteredProducts.forEach((product) => {
      const productCard = this.createProductCard(product);
      container.appendChild(productCard);
    });
  }

  createProductCard(product) {
    const col = document.createElement("div");
    col.className = "col-lg-3 col-md-4 col-sm-6 mb-4";

    col.innerHTML = `
            <div class="card product-card h-100 shadow-hover" data-product-id="${
              product.id
            }" data-category="${product.category}" id="product-${product.id}">
                <img src="${product.image}" alt="${
      product.name
    }" class="card-img-top product-image" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <p class="product-category mb-1">${product.category}</p>
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-price">$${product.price}</p>
                    <button class="btn btn-primary add-to-cart-btn mt-auto" data-product-id="${
                      product.id
                    }">
                        <i class="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-outline-danger wishlist-btn mt-2" data-product-id="${
                      product.id
                    }">
                        <i class="bi bi-heart${
                          this.isInWishlist(product.id) ? "-fill" : ""
                        } me-2"></i>
                        ${
                          this.isInWishlist(product.id)
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                    </button>
                    <div class="social-share-mini mt-2">
                      <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary share-product-btn" data-product-id="${product.id}" data-platform="facebook">
                          <i class="bi bi-facebook"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary share-product-btn" data-product-id="${product.id}" data-platform="twitter">
                          <i class="bi bi-twitter"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary share-product-btn" data-product-id="${product.id}" data-platform="pinterest">
                          <i class="bi bi-pinterest"></i>
                        </button>
                      </div>
                    </div>
                </div>
            </div>
        `;

    // Add click event for product details
    col.querySelector(".product-card").addEventListener("click", (e) => {
      if (
        !e.target.classList.contains("add-to-cart-btn") &&
        !e.target.closest(".add-to-cart-btn")
      ) {
        this.showProductDetails(product);
      }
    });

    // Add click event for add to cart button
    col.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      this.addToCart(product);
    });

    // Add click event for wishlist button
    col.querySelector(".wishlist-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleWishlist(product);
    });

    return col;
  }

  showProductDetails(product) {
    document.getElementById("modalProductName").textContent = product.name;
    document.getElementById("modalProductImage").src = product.image;
    document.getElementById("modalProductImage").alt = product.name;
    document.getElementById("modalProductCategory").textContent =
      product.category.toUpperCase();
    document.getElementById(
      "modalProductPrice"
    ).textContent = `$${product.price}`;
    document.getElementById("modalProductDescription").textContent =
      product.description;

    const modalAddToCartBtn = document.getElementById("modalAddToCart");
    modalAddToCartBtn.onclick = () => {
      this.addToCart(product);
      bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    };

    // Update wishlist button in modal
    const modalWishlistBtn = document.querySelector(
      "#productModal .btn-outline-primary"
    );
    if (modalWishlistBtn) {
      const isInWishlist = this.isInWishlist(product.id);
      modalWishlistBtn.innerHTML = `<i class="bi bi-heart${
        isInWishlist ? "-fill" : ""
      } me-2"></i>${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}`;
      modalWishlistBtn.onclick = () => {
        this.toggleWishlist(product);
        bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
      };
    }

    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  }

  clearCart() {
    this.cart = [];
    this.updateCartUI();
    this.saveToStorage("modernstore_cart", this.cart);
  }

  clearWishlist() {
    this.wishlist = [];
    this.updateCartUI(); // <-- was this.updateWishlistUI()
    this.saveToStorage("modernstore_wishlist", this.wishlist);
  }

  addToCart(product) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
      });
    }

    this.updateCartUI(); // <-- was this.updateWishlistUI()
    this.saveToStorage("modernstore_cart", this.cart);
    this.showToast(`${product.name} added to cart!`, "success");
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.updateCartUI(); // <-- was this.updateWishlistUI()
    this.saveToStorage("modernstore_cart", this.cart);
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.updateCartUI();
      this.saveToStorage("modernstore_cart", this.cart);
    }
  }

  updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const wishlistItems = document.getElementById("wishlistItems");
    const wishlistCount = document.getElementById("wishlistCount");

    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toFixed(2);
    wishlistCount.textContent = this.wishlist.length;

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-cart-x display-1"></i>
                    <p class="mt-3">Your cart is empty</p>
                </div>
            `;
      checkoutBtn.disabled = true;
    } else {
      cartItems.innerHTML = this.cart
        .map(
          (item) => `
                <div class="cart-item">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.image}" alt="${
            item.name
          }" class="cart-item-image">
                        </div>
                        <div class="col-6">
                            <div class="cart-item-info">
                                <h6>${item.name}</h6>
                                <p class="cart-item-price mb-0">$${
                                  item.price
                                }</p>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="quantity-controls d-flex align-items-center">
                                <button class="btn-sm" onclick="store.updateQuantity(${
                                  item.id
                                }, ${item.quantity - 1})">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <input type="number" value="${
                                  item.quantity
                                }" min="1" class="mx-1" 
                                       onchange="store.updateQuantity(${
                                         item.id
                                       }, parseInt(this.value))">
                                <button class="btn-sm" onclick="store.updateQuantity(${
                                  item.id
                                }, ${item.quantity + 1})">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                            <button class="btn btn-sm btn-outline-danger mt-1" onclick="store.removeFromCart(${
                              item.id
                            })">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
        )
        .join("");
      checkoutBtn.disabled = false;
    }

    // Update wishlist UI
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
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        </div>
                        <div class="col-6">
                            <div class="cart-item-info">
                                <h6>${item.name}</h6>
                                <p class="cart-item-price mb-0">$${item.price}</p>
                            </div>
                        </div>
                        <div class="col-3">
                            <button class="btn btn-sm btn-primary mb-1 w-100" onclick="store.addToCart(store.products.find(p => p.id === ${item.id}))">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger w-100" onclick="store.toggleWishlist(store.products.find(p => p.id === ${item.id}))">
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

  isInWishlist(productId) {
    return this.wishlist.some((item) => item.id === productId);
  }

  toggleWishlist(product) {
    const existingIndex = this.wishlist.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex > -1) {
      this.wishlist.splice(existingIndex, 1);
      this.showToast(`${product.name} removed from wishlist!`, "warning");
    } else {
      this.wishlist.push(product);
      this.showToast(`${product.name} added to wishlist!`, "success");
    }

    this.saveToStorage("modernstore_wishlist", this.wishlist);
    this.updateCartUI(); // <-- was this.updateWishlistUI()
    this.renderProducts();
  }

  checkout() {
    if (this.cart.length === 0) return;

    // Cart is already saved to localStorage automatically

    // Redirect to checkout page
    window.location.href = "pages/checkout.html";
  }

  showToast(message, type = "success") {
    // Create toast element
    const toastContainer =
      document.querySelector(".toast-container") || this.createToastContainer();

    const toastId = "toast-" + Date.now();
    const toastElement = document.createElement("div");
    toastElement.id = toastId;
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute("role", "alert");

    toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

    toastContainer.appendChild(toastElement);

    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Remove toast after it's hidden
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove();
    });
  }

  createToastContainer() {
    const container = document.createElement("div");
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = "1080";
    document.body.appendChild(container);
    return container;
  }

  searchProducts(query) {
    // Example: filter products by name
    const filtered = this.products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    this.renderProducts(filtered);
  }

  filterProducts(category) {
    this.currentFilter = category;
    this.renderProducts();
  }
}

// Initialize store when DOM is ready and sections are loaded
let store;
let sectionsToLoad = ["headerSection", "footerSection"]; // List of sections that need to be loaded
let loadedSections = [];

document.addEventListener("DOMContentLoaded", function () {
  // Check if we're using dynamic sections
  if (document.getElementById("headerSection")) {
    // Listen for section loaded events
    document.addEventListener("sectionLoaded", function (e) {
      loadedSections.push(e.detail.id);

      // Check if all required sections are loaded
      if (sectionsToLoad.every((section) => loadedSections.includes(section))) {
        initializeStore();
      }
    });
  } else {
    // No dynamic sections, initialize immediately
    initializeStore();
  }
});

function initializeStore() {
  store = new EcommerceStore();
  window.store = store;
}

// Add smooth scroll to navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Handle form submissions
document.addEventListener("submit", function (e) {
  e.preventDefault();
  store.showToast("Form submitted successfully!", "success");
});

document.addEventListener("DOMContentLoaded", function () {
  // Handle main search
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", function () {
      location.hash = "#products";
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    });

    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        searchBtn.click();
      }
    });
  }

  // Handle small search
  const searchBtnSmall = document.getElementById("searchBtnSmall");
  const searchInputSmall = document.getElementById("searchInputSmall");

  if (searchBtnSmall && searchInputSmall) {
    searchBtnSmall.addEventListener("click", function () {
      location.hash = "#products";
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    });

    searchInputSmall.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        searchBtnSmall.click();
      }
    });
  }
});
