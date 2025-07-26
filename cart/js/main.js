// POStore JavaScript

class EcommerceStore {
  constructor() {
    this.products = [];
    this.cart = this.loadFromStorage("modernstore_cart") || [];
    this.wishlist = this.loadFromStorage("modernstore_wishlist") || [];
    this.currentFilter = "all";
    this.currentSort = "default";
    this.categories = {};
    this.loadCategories();
    this.init();
  }

  async init() {
    await this.loadCategories();
    await this.loadProducts();
    this.bindEvents();
    this.updateCartUI();
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

  async loadCategories() {
    try {
      const { data, error } = await supabase.from("Categories").select("*");

      if (error) {
        console.error("Error fetching categories from Supabase:", error);
        this.categories = {};
        return;
      }

      this.categories = {};
      data.forEach((category) => {
        this.categories[category.CategoryId] = category.Name;
      });

      this.renderCategoryButtons(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      this.categories = {};
    }
  }

  async loadProducts() {
    try {
      const { data, error } = await supabase.from("Products").select("*");

      if (error) {
        console.error("Error fetching products from Supabase:", error);
        return;
      }

      this.products = data || [];
      this.renderProducts();
    } catch (error) {
      console.error("Error loading products:", error);
    }
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
        (product) => this.categories[product.CategoryId] === this.currentFilter
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
              product.Id
            }" data-category="${
      this.categories[product.CategoryId] || "uncategorized"
    }" id="product-${product.Id}">
                <img src="${product.ImageUrl}" alt="${
      product.Name
    }" class="card-img-top product-image" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <p class="product-category mb-1">${
                      this.categories[product.CategoryId] || "uncategorized"
                    }</p>
                    <h5 class="product-title">${product.Name}</h5>
                    <p class="product-price">$${product.Price}</p>
                    ${
                      product.StockQuantity !== undefined &&
                      product.StockQuantity !== null
                        ? `<p class="product-stock mb-2 ${
                            product.StockQuantity > 10
                              ? "text-success"
                              : product.StockQuantity > 0
                              ? "text-warning"
                              : "text-danger"
                          }"><i class="bi bi-box-seam me-1"></i>Stock: ${
                            product.StockQuantity
                          }</p>`
                        : ""
                    }
                    <button class="btn btn-primary add-to-cart-btn mt-auto" data-product-id="${
                      product.Id
                    }">
                        <i class="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-outline-danger wishlist-btn mt-2" data-product-id="${
                      product.Id
                    }">
                        <i class="bi bi-heart${
                          this.isInWishlist(product.Id) ? "-fill" : ""
                        } me-2"></i>
                        ${
                          this.isInWishlist(product.Id)
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                    </button>
                    <div class="social-share-mini mt-2">
                      <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary share-product-btn" data-product-id="${
                          product.Id
                        }" data-platform="facebook">
                          <i class="bi bi-facebook"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary share-product-btn" data-product-id="${
                          product.Id
                        }" data-platform="twitter">
                          <i class="bi bi-twitter"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary share-product-btn" data-product-id="${
                          product.Id
                        }" data-platform="pinterest">
                          <i class="bi bi-pinterest"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary share-product-btn" data-product-id="${
                          product.Id
                        }" data-platform="email">
                          <i class="bi bi-envelope"></i>
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
        !e.target.closest(".add-to-cart-btn") &&
        !e.target.classList.contains("wishlist-btn") &&
        !e.target.closest(".wishlist-btn") &&
        !e.target.classList.contains("share-product-btn") &&
        !e.target.closest(".share-product-btn")
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
    document.getElementById("modalProductName").textContent = product.Name;
    document.getElementById("modalProductImage").src = product.ImageUrl;
    document.getElementById("modalProductImage").alt = product.Name;
    document.getElementById("modalProductCategory").textContent = (
      this.categories[product.CategoryId] || "uncategorized"
    ).toUpperCase();
    document.getElementById(
      "modalProductPrice"
    ).textContent = `$${product.Price}`;
    document.getElementById("modalProductDescription").textContent =
      product.Description;

    const modalAddToCartBtn = document.getElementById("modalAddToCart");
    modalAddToCartBtn.onclick = () => {
      this.addToCart(product);
      bootstrap.Modal.getInstance(
        document.getElementById("productModal")
      ).hide();
    };

    // Update wishlist button in modal
    const modalWishlistBtn = document.querySelector(
      "#productModal .btn-outline-primary"
    );
    if (modalWishlistBtn) {
      const isInWishlist = this.isInWishlist(product.Id);
      modalWishlistBtn.innerHTML = `<i class="bi bi-heart${
        isInWishlist ? "-fill" : ""
      } me-2"></i>${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}`;
      modalWishlistBtn.onclick = () => {
        this.toggleWishlist(product);
        bootstrap.Modal.getInstance(
          document.getElementById("productModal")
        ).hide();
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
    const existingItem = this.cart.find((item) => item.Id === product.Id);

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
    this.showToast(`${product.Name} added to cart!`, "success");
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => (item.Id || item.id) !== productId);
    this.updateCartUI(); // <-- was this.updateWishlistUI()
    this.saveToStorage("modernstore_cart", this.cart);
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
      (sum, item) => sum + (item.Price || item.price) * item.quantity,
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
                            <img src="${item.ImageUrl || item.imageUrl}" alt="${
            item.Name || item.name
          }" class="cart-item-image">
                        </div>
                        <div class="col-6">
                            <div class="cart-item-info">
                                <h6>${item.Name || item.name}</h6>
                                <p class="cart-item-price mb-0">$${
                                  item.Price || item.price
                                }</p>
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
                            <img src="${item.ImageUrl || item.imageUrl}" alt="${
            item.Name || item.name
          }" class="cart-item-image">
                        </div>
                        <div class="col-6">
                            <div class="cart-item-info">
                                <h6>${item.Name || item.name}</h6>
                                <p class="cart-item-price mb-0">$${
                                  item.Price || item.price
                                }</p>
                            </div>
                        </div>
                        <div class="col-3">
                            <button class="btn btn-sm btn-primary mb-1 w-100" onclick="store.addToCart(store.products.find(p => p.Id === ${
                              item.Id || item.id
                            }))">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger w-100" onclick="store.toggleWishlist(store.products.find(p => p.Id === ${
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

  isInWishlist(productId) {
    return this.wishlist.some((item) => item.Id === productId);
  }

  toggleWishlist(product) {
    const existingIndex = this.wishlist.findIndex(
      (item) => item.Id === product.Id
    );

    if (existingIndex > -1) {
      this.wishlist.splice(existingIndex, 1);
      this.showToast(`${product.Name} removed from wishlist!`, "warning");
    } else {
      this.wishlist.push(product);
      this.showToast(`${product.Name} added to wishlist!`, "success");
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
      (product.Name || product.name).toLowerCase().includes(query.toLowerCase())
    );
    this.renderProducts(filtered);
  }

  renderCategoryButtons(categories) {
    const container = document.getElementById("categoryButtons");
    if (!container) return;

    // Keep the "All Products" button and add category buttons
    const allButton = container.querySelector('[data-category="all"]');
    container.innerHTML = "";
    container.appendChild(allButton);

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = "btn btn-outline-primary";
      button.setAttribute("data-category", category.Name);
      button.textContent = category.DisplayName || category.Name;

      button.addEventListener("click", (e) => {
        this.filterProducts(e.target.dataset.category);
        document
          .querySelectorAll("[data-category]")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });

      container.appendChild(button);
    });
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
