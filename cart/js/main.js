// POStore JavaScript

class EcommerceStore {
  constructor() {
    this.products = [];
    this.cart = this.loadFromStorage("postore_cart") || [];
    this.wishlist = this.loadFromStorage("postore_wishlist") || [];
    this.currentFilter = "all";
    this.currentSort = "default";
    this.categories = {};
    this.init();
  }

  async init() {
    console.log("EcommerceStore init() called");

    // Wait for globalStore to be available
    if (!window.globalStore) {
      console.log("Waiting for globalStore...");
      setTimeout(() => this.init(), 100);
      return;
    }

    // Wait for business data to be ready
    if (!window.businessDataReady) {
      console.log("Waiting for business data to be ready...");
      setTimeout(() => this.init(), 100);
      return;
    }
    
    const businessEmail = window.globalStore?.state?.Email;
    if (!businessEmail || businessEmail.trim() === "") {
      console.error("Business email still not available after business data loaded");
      window.globalStore.setState({
        ...window.globalStore.state,
        Email: "pabloandreychacon@hotmail.com",
      });
    }

    // If we have business data but no email, set default email
    if (!businessEmail || businessEmail.trim() === "") {
      console.log("Setting default email since none was found");
      window.globalStore.setState({
        ...window.globalStore.state,
        Email: "pabloandreychacon@hotmail.com",
      });
    }

    const finalEmail = window.globalStore.state.Email;
    console.log("Starting to load categories and products for:", finalEmail);
    await this.loadCategories();
    await this.loadProducts();
    this.bindEvents();
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
    // Get current business email from window.globalStore.state.Email
    const businessEmail = window.globalStore?.state?.Email || "";
    if (!businessEmail) {
      console.error("Business email not set in globalStore");
      return;
    }
    
    console.log('Loading categories for business email:', businessEmail);
    
    try {
      const { data, error } = await supabase
        .from("Categories")
        .select("*")
        .eq("BusinessEmail", businessEmail);

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
      // Get current business email from window.globalStore.state.Email
      const businessEmail = window.globalStore?.state?.Email || "";
      if (!businessEmail) {
        console.error("Business email not set in globalStore");
        return;
      }

      console.log("Loading products for business email:", businessEmail);

      // Fetch products from Supabase filter by column: BusinessEmail === businessEmail
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("BusinessEmail", businessEmail);

      if (error) {
        console.error("Error fetching products from Supabase:", error);
        return;
      }

      console.log("Products loaded:", data?.length || 0, "products found");
      this.products = data || [];
      this.cleanupCart();
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
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortProducts(e.target.value);
      });
    }

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
        //if (confirm("Are you sure you want to clear your wishlist?")) {
        this.clearWishlist();
        //}
      });
    }
  }

  renderProducts(products) {
    const container = document.getElementById("productsContainer");
    if (!container) return; // Exit if container doesn't exist (not on main page)
    
    container.innerHTML = "";

    let filteredProducts = products || this.products;

    // Apply category filter only if not searching
    if (!products && this.currentFilter && this.currentFilter !== "all") {
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
                <img src="${product.ImageUrl}?t=${Date.now()}" alt="${
      product.Name
    }" class="card-img-top product-image" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <p class="product-category mb-1">${
                      this.categories[product.CategoryId] || "uncategorized"
                    }</p>
                    <h5 class="product-title">${product.Name}</h5>
                    <p class="product-price">$${this.calculatePriceWithTax(product)}</p>
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
                    <button class="btn ${
                      product.StockQuantity === 0
                        ? "btn-secondary"
                        : "btn-primary"
                    } add-to-cart-btn mt-auto" data-product-id="${
      product.Id
    }" ${product.StockQuantity === 0 ? "disabled" : ""}>
                        <i class="bi bi-cart-plus me-2"></i>${
                          product.StockQuantity === 0
                            ? "Out of Stock"
                            : "Add to Cart"
                        }
                    </button>
                    <button class="btn btn-outline-danger wishlist-btn mt-2" data-product-id="${
                      product.Id
                    }">
                        <i class="bi bi-heart me-2"></i>
                        Add to Wishlist
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
        window.location.href = `pages/product-detail.html?id=${product.Id}`;
      }
    });

    // Add click event for add to cart button
    col.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.store) {
        window.store.addToCart(product);
      }
    });

    // Add click event for wishlist button
    col.querySelector(".wishlist-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.store) {
        window.store.toggleWishlist(product);
      }
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
    this.saveToStorage("postore_cart", this.cart);
  }

  cleanupCart() {
    if (!window.store) return;

    const validProductIds = this.products.map((p) => p.Id);
    const originalCartLength = window.store.cart.length;
    const originalWishlistLength = window.store.wishlist.length;

    window.store.cart = window.store.cart.filter((item) =>
      validProductIds.includes(item.Id || item.id)
    );

    window.store.wishlist = window.store.wishlist.filter((item) =>
      validProductIds.includes(item.Id || item.id)
    );

    if (window.store.cart.length !== originalCartLength) {
      window.store.saveToStorage("postore_cart", window.store.cart);
    }

    if (window.store.wishlist.length !== originalWishlistLength) {
      window.store.saveToStorage("postore_wishlist", window.store.wishlist);
    }

    if (
      window.store.cart.length !== originalCartLength ||
      window.store.wishlist.length !== originalWishlistLength
    ) {
      if (window.store.updateCartUI) {
        window.store.updateCartUI();
      }
    }
  }

  clearWishlist() {
    this.wishlist = [];
    this.updateCartUI(); // <-- was this.updateWishlistUI()
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
          this.showToast(`Cannot add more ${product.Name}. Stock limit reached (${product.StockQuantity} available)`, "warning");
          return false;
        } else {
          this.showToast(`Only ${availableToAdd} more can be added. Stock limit: ${product.StockQuantity}`, "warning");
          return false;
        }
      }
    }

    const existingItem = this.cart.find((item) => item.Id === product.Id);

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
    this.showToast(`${product.Name} added to cart!`, "success");
    return true;
  }

  addToCartFromWishlist(productId) {
    StoreFunctions.addToCartFromWishlist(this, productId);
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => (item.Id || item.id) !== productId);
    this.updateCartUI(); // <-- was this.updateWishlistUI()
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
          this.showToast(`Cannot set quantity to ${quantity}. Only ${item.StockQuantity} available in stock`, "warning");
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

    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = this.cart.reduce(
      (sum, item) => sum + this.calculatePriceWithTax(item) * item.quantity,
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
                                <p class="cart-item-price mb-0">$${this.calculatePriceWithTax(item)}</p>
                            </div>
                        </div>
                        <div class="col-3">
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
                                <p class="cart-item-price mb-0">$${this.calculatePriceWithTax(item)}</p>
                            </div>
                        </div>
                        <div class="col-3">
                            <button class="btn btn-sm btn-primary mb-1 w-100" onclick="(window.store || window.productStore).addToCartFromWishlist(${item.Id || item.id})">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger w-100" onclick="(window.store || window.productStore).toggleWishlist({...${JSON.stringify(item).replace(/"/g, '&quot;')}, Id: ${item.Id || item.id}})">
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

    this.saveToStorage("postore_wishlist", this.wishlist);
    this.updateCartUI(); // <-- was this.updateWishlistUI()

    // Update only the specific product card's wishlist button instead of re-rendering all products
    this.updateWishlistButton(product.Id);
  }

  updateWishlistButton(productId) {
    const wishlistBtn = document.querySelector(
      `[data-product-id="${productId}"].wishlist-btn`
    );
    if (wishlistBtn) {
      const isInWishlist = this.isInWishlist(productId);
      wishlistBtn.innerHTML = `<i class="bi bi-heart${
        isInWishlist ? "-fill" : ""
      } me-2"></i>${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}`;
    }
  }

  checkout() {
    if (this.cart.length === 0) return;

    // Cart is already saved to localStorage automatically

    // Redirect to checkout page - handle different page contexts
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
      // Already in pages folder, use relative path
      window.location.href = "checkout.html";
    } else {
      // In root folder, use pages/ path
      window.location.href = "pages/checkout.html";
    }
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
    if (!container) return; // Exit if container doesn't exist (not on main page)

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

  calculatePriceWithTax(product) {
    const basePrice = parseFloat(product.Price || 0);
    const taxRate = parseFloat(product.TaxRate || product.taxes || product.Taxes || 0) / 100;
    return (basePrice * (1 + taxRate)).toFixed(2);
  }

  applySorting(products) {
    switch (this.currentSort) {
      case "price-low":
        return products.sort((a, b) => this.calculatePriceWithTax(a) - this.calculatePriceWithTax(b));
      case "price-high":
        return products.sort((a, b) => this.calculatePriceWithTax(b) - this.calculatePriceWithTax(a));
      case "name":
        return products.sort((a, b) => a.Name.localeCompare(b.Name));
      default:
        return products;
    }
  }

  sortProducts(sortType) {
    this.currentSort = sortType;
    this.renderProducts();
  }

  filterProducts(category) {
    this.currentFilter = category;
    this.renderProducts();
  }
}

// Initialize store when DOM is ready and sections are loaded
let productStore;
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
        initializeProductStore();
      }
    });
  } else {
    // No dynamic sections, initialize immediately
    initializeProductStore();
  }
});

function initializeProductStore() {
  console.log("Initializing ProductStore...");
  productStore = new EcommerceStore();
  window.productStore = productStore;
  window.store = productStore; // Also set as window.store for compatibility
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
