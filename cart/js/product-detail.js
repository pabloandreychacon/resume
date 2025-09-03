// Product Detail Page JavaScript
class ProductDetail {
  constructor() {
    this.product = null;
    this.categories = {};
    this.mainImageUrl = "";
    this.otherImageUrls = [];
    this.init();
  }

  async init() {
    await this.loadCategories();
    await this.loadProduct();
    await this.loadRelatedProducts();
    window.currentProductImages = [this.mainImageUrl, ...this.otherImageUrls];
    this.bindEvents();
  }

  async loadCategories() {
    try {
      // Try to get business email, fallback to default if not available
      const businessEmail =
        (window.EmailUtils?.getBusinessEmail &&
          window.EmailUtils.getBusinessEmail()) ||
        this.getEmailFromLocalStorage() ||
        "pabloandreychacon@hotmail.com";
      if (!businessEmail) return;

      const { data, error } = await supabase
        .from("Categories")
        .select("*")
        .eq("BusinessEmail", businessEmail)
        .eq("Active", true);

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      this.categories = {};
      data.forEach((category) => {
        this.categories[category.CategoryId] = category.Name;
      });
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  async loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
      console.error("No product ID provided");
      // Don't redirect immediately, let the user see the error
      document.body.innerHTML =
        '<div class="container"><h1>Error: No product ID provided</h1><p><a href="../index.html">Return to home</a></p></div>';
      return;
    }

    try {
      // Try to get business email, fallback to default if not available
      const businessEmail =
        (window.EmailUtils?.getBusinessEmail &&
          window.EmailUtils.getBusinessEmail()) ||
        this.getEmailFromLocalStorage() ||
        "pabloandreychacon@hotmail.com";
      if (!businessEmail) {
        console.error("Business email not available");
        // Don't redirect immediately, show error
        document.body.innerHTML =
          '<div class="container"><h1>Error: Business email not available</h1><p><a href="../index.html">Return to home</a></p></div>';
        return;
      }

      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("Id", productId)
        .eq("BusinessEmail", businessEmail)
        .eq("Active", true)
        .single();

      if (error || !data) {
        console.error("Error fetching product:", error);
        // Don't redirect immediately, show error
        document.body.innerHTML =
          '<div class="container"><h1>Error: Product not found</h1><p><a href="../index.html">Return to home</a></p></div>';
        return;
      }

      this.product = data;
      await this.loadProductMedia();
      this.mainImageUrl = data.ImageUrl || ""; // Assuming ImageUrl is the main image URL

      this.renderProduct();
    } catch (error) {
      console.error("Error loading product:", error);
      // Don't redirect immediately, show error
      document.body.innerHTML =
        '<div class="container"><h1>Error loading product</h1><p><a href="../index.html">Return to home</a></p></div>';
    }
  }

  async loadProductMedia() {
    try {
      // Try to get business email, fallback to default if not available
      const businessEmail =
        (window.EmailUtils?.getBusinessEmail &&
          window.EmailUtils.getBusinessEmail()) ||
        this.getEmailFromLocalStorage() ||
        "pabloandreychacon@hotmail.com";
      if (!businessEmail) {
        this.productMedia = [];
        return;
      }

      const { data, error } = await supabase
        .from("ProductMedia")
        .select("*")
        .eq("ProductId", this.product.Id)
        .eq("BusinessEmail", businessEmail)
        .order("DisplayOrder", { ascending: true });

      if (error) {
        console.error("Error fetching product media:", error);
        this.productMedia = [];
        return;
      }

      this.productMedia = data || [];
      this.otherImageUrls = this.productMedia.map((media) => media.MediaUrl);
    } catch (error) {
      console.error("Error loading product media:", error);
      this.productMedia = [];
    }
  }

  renderProduct() {
    if (!this.product) return;

    document.getElementById("productName").textContent = this.product.Name;
    this.renderMediaGallery();
    document.getElementById("productPrice").textContent = this.formatPrice(
      this.calculatePriceWithTax(this.product)
    );
    document.getElementById("productDescription").textContent =
      this.product.Description || "No description available.";
    document.getElementById("productCategory").textContent =
      this.categories[this.product.CategoryId] || "Uncategorized";
    document.getElementById("productBreadcrumb").textContent =
      this.product.Name;

    // Stock info
    const stockInfo = document.getElementById("stockInfo");
    if (
      this.product.StockQuantity !== undefined &&
      this.product.StockQuantity !== null
    ) {
      const stockClass =
        this.product.StockQuantity > 10
          ? "text-success"
          : this.product.StockQuantity > 0
          ? "text-warning"
          : "text-danger";
      stockInfo.innerHTML = `<span class="${stockClass}"><i class="bi bi-box-seam me-1"></i>Stock: ${this.product.StockQuantity}</span>`;
    }

    // Update add to cart button based on stock
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (
      this.product.StockQuantity !== null &&
      this.product.StockQuantity !== undefined &&
      this.product.StockQuantity === 0
    ) {
      addToCartBtn.textContent = "Out of Stock";
      addToCartBtn.className = "btn btn-secondary btn-lg w-100";
      addToCartBtn.disabled = true;
    }

    // Update page title
    document.title = `${this.product.Name} - POStore`;
  }

  bindEvents() {
    // Remove any existing event listeners by cloning and replacing elements
    // This is a more robust approach to prevent duplicate event listeners

    // Quantity controls
    const decreaseQtyBtn = document.getElementById("decreaseQty");
    const newDecreaseQtyBtn = decreaseQtyBtn.cloneNode(true);
    decreaseQtyBtn.parentNode.replaceChild(newDecreaseQtyBtn, decreaseQtyBtn);
    newDecreaseQtyBtn.addEventListener("click", () => {
      const qtyInput = document.getElementById("quantity");
      const currentQty = parseInt(qtyInput.value);
      if (currentQty > 1) {
        qtyInput.value = currentQty - 1;
      }
    });

    const increaseQtyBtn = document.getElementById("increaseQty");
    const newIncreaseQtyBtn = increaseQtyBtn.cloneNode(true);
    increaseQtyBtn.parentNode.replaceChild(newIncreaseQtyBtn, increaseQtyBtn);
    newIncreaseQtyBtn.addEventListener("click", () => {
      const qtyInput = document.getElementById("quantity");
      const currentQty = parseInt(qtyInput.value);
      qtyInput.value = currentQty + 1;
    });

    // Add to cart with quantity
    const addToCartBtn = document.getElementById("addToCartBtn");
    const newAddToCartBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
    newAddToCartBtn.addEventListener("click", () => {
      const store = window.store || window.productStore;
      if (store && this.product) {
        // Check if product manages stock and has stock available
        if (
          this.product.StockQuantity !== null &&
          this.product.StockQuantity !== undefined &&
          this.product.StockQuantity === 0
        ) {
          return; // Don't add if stock is managed and is 0
        }

        const quantity = parseInt(document.getElementById("quantity").value);
        store.addToCart(this.product, quantity);
      }
    });

    // Add to wishlist
    const addToWishlistBtn = document.getElementById("addToWishlistBtn");
    const newAddToWishlistBtn = addToWishlistBtn.cloneNode(true);
    addToWishlistBtn.parentNode.replaceChild(
      newAddToWishlistBtn,
      addToWishlistBtn
    );
    newAddToWishlistBtn.addEventListener("click", () => {
      const store = window.store || window.productStore;
      if (store && this.product) {
        store.toggleWishlist(this.product);
        this.updateWishlistButton();
      }
    });

    // Update wishlist button on load
    this.updateWishlistButton();

    // Share buttons
    document.querySelectorAll(".share-product-btn").forEach((btn) => {
      // Remove existing event listeners by cloning
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener("click", (e) => {
        const platform =
          e.target.closest(".share-product-btn").dataset.platform;
        this.shareProduct(platform);
      });
    });
  }

  async loadRelatedProducts() {
    if (!this.product) return;

    try {
      // Try to get business email, fallback to default if not available
      const businessEmail =
        (window.EmailUtils?.getBusinessEmail &&
          window.EmailUtils.getBusinessEmail()) ||
        this.getEmailFromLocalStorage() ||
        "pabloandreychacon@hotmail.com";
      if (!businessEmail) return;

      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("CategoryId", this.product.CategoryId)
        .eq("BusinessEmail", businessEmail)
        .neq("Id", this.product.Id)
        .eq("Active", true)
        .limit(4);

      if (error) {
        console.error("Error fetching related products:", error);
        return;
      }

      this.renderRelatedProducts(data || []);
    } catch (error) {
      console.error("Error loading related products:", error);
    }
  }

  renderRelatedProducts(products) {
    const container = document.getElementById("relatedProductsContainer");

    if (products.length === 0) {
      container.innerHTML =
        '<p class="text-muted">No related products found.</p>';
      return;
    }

    container.innerHTML = products
      .map(
        (product) => `
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card h-100 shadow-sm" style="cursor: pointer;" onclick="window.location.href='../pages/product-detail.html?id=${
          product.Id
        }'">
          <img src="${product.ImageUrl}" alt="${
          product.Name
        }" class="card-img-top" style="height: 200px; object-fit: cover;" loading="lazy" decoding="async" onerror="this.onerror=null; this.src='../assets/img/fallback.png';">
          <div class="card-body d-flex flex-column">
            <p class="text-muted mb-1">${
              this.categories[product.CategoryId] || "Uncategorized"
            }</p>
            <h6 class="card-title">${product.Name}</h6>
            <p class="text-primary fw-bold mt-auto">${this.formatPrice(
              product.Price
            )}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderMediaGallery() {
    const container = document.querySelector(".product-image-container");
    const allMedia = [
      { MediaType: "image", MediaUrl: this.product.ImageUrl },
      ...(this.productMedia || []),
    ];

    if (allMedia.length <= 1) {
      // Use default image if no product image is available
      const imageUrl = this.product.ImageUrl || "";
      container.innerHTML = `<img
  id="productImage"
  src="${imageUrl}"
  alt="${this.product.Name || "Product Image"}"
  class="img-fluid rounded shadow"
  style="cursor: zoom-in"
  loading="eager"
  fetchpriority="high"
  onerror="this.onerror=null; this.src='';"
  onclick="showImageModal(window.currentProductImages || [this.src], 0)"
/>`;
      return;
    }

    // Amazon-style image gallery
    container.innerHTML = `
      <div class="row">
      <!-- Thumbnail Column -->
      <div class="col-2">
        <div class="d-flex flex-column gap-2">
        ${allMedia
          .map(
            (media, index) => `
          <img
          src="${media.MediaUrl || ""}"
          onerror="this.onerror=null; this.src='';"
        `
          )
          .join("")}
        </div>
      </div>
      <!-- Main Image -->
      <div class="col-10">
        <img 
        id="mainProductImage"
        src="${allMedia[0].MediaUrl || ""}"
        onerror="this.onerror=null; this.src='';"
      </div>
      </div>
    `;
  }

  selectImage(index) {
    const allMedia = [
      { MediaType: "image", MediaUrl: this.product.ImageUrl },
      ...(this.productMedia || []),
    ];
    const mainImage = document.getElementById("mainProductImage");
    const thumbnails = document.querySelectorAll(".product-thumbnail");

    // Update main image
    mainImage.src = allMedia[index].MediaUrl || "";

    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
      thumb.style.border =
        i === index ? "2px solid #007bff" : "2px solid #dee2e6";
    });
  }

  openImageModal() {
    const mainImage = document.getElementById("mainProductImage");
    const imageSrc = mainImage.src;

    // Create modal HTML
    const modalHtml = `
      <div class="modal fade" id="imageModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${this.product.Name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <img src="${imageSrc}" alt="${this.product.Name}" class="img-fluid" style="max-height: 80vh;" onerror="this.onerror=null; this.src='';">
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal
    const existingModal = document.getElementById("imageModal");
    if (existingModal) existingModal.remove();

    // Add new modal
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    const modal = new bootstrap.Modal(document.getElementById("imageModal"));
    modal.show();
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

  updateWishlistButton() {
    const store = window.store || window.productStore;
    if (!store || !this.product) return;

    const btn = document.getElementById("addToWishlistBtn");
    const isInWishlist = store.wishlist.some(
      (item) => (item.Id || item.id) === this.product.Id
    );

    if (isInWishlist) {
      btn.innerHTML =
        '<i class="bi bi-heart-fill me-2"></i>Remove from Wishlist';
      btn.classList.remove("btn-outline-danger");
      btn.classList.add("btn-danger");
    } else {
      btn.innerHTML = '<i class="bi bi-heart me-2"></i>Add to Wishlist';
      btn.classList.remove("btn-danger");
      btn.classList.add("btn-outline-danger");
    }
  }

  shareProduct(platform) {
    if (!this.product) return;

    // Try to get business email, fallback to default if not available
    const businessEmail =
      (window.EmailUtils?.getBusinessEmail &&
        window.EmailUtils.getBusinessEmail()) ||
      this.getEmailFromLocalStorage() ||
      "pabloandreychacon@hotmail.com";
    const baseUrl = window.location.href;
    const pageUrl = encodeURIComponent(
      businessEmail
        ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}email=${businessEmail}`
        : baseUrl
    );

    const formattedPrice = this.formatPrice(this.product.Price);
    const pageTitle = encodeURIComponent(
      `Check out ${this.product.Name} - ${formattedPrice} at POStore!`
    );
    const imageUrl = encodeURIComponent(this.product.ImageUrl);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        const fbText = `Check out ${this.product.Name} - ${formattedPrice} at POStore!`;
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${encodeURIComponent(
          fbText
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${imageUrl}&description=${pageTitle}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${pageTitle}&body=I thought you might be interested in this: ${decodeURIComponent(
          pageUrl
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  }

  /**
   * Get email from localStorage as a fallback when EmailUtils is not available
   * @returns {string|null} The business email or null if not found
   */
  getEmailFromLocalStorage() {
    try {
      // Get the current business email from localStorage
      const email = JSON.parse(localStorage.getItem("postore_email"));
      if (email) {
        return email;
      }
      return null;
    } catch (error) {
      console.error("Error reading business email from localStorage:", error);
      return null;
    }
  }
}

// Initialize when DOM is ready
let productDetail;
let productDetailInitialized = false; // Flag to prevent double initialization

function initProductDetail() {
  // Prevent double initialization
  if (productDetailInitialized) {
    return;
  }

  productDetail = new ProductDetail();
  window.productDetail = productDetail; // Make it globally available
  productDetailInitialized = true;
}

// Wait for business data to be loaded before initializing ProductDetail
window.addEventListener("businessDataLoaded", function () {
  initProductDetail();
});

// Ensure business data loader is initialized
document.addEventListener("DOMContentLoaded", function () {
  // Check if we have a product ID in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  // If no product ID, show error instead of redirecting immediately
  if (!productId) {
    console.error("No product ID provided in URL");
    document.body.innerHTML =
      '<div class="container"><h1>Error: No product ID provided</h1><p><a href="../index.html">Return to home</a></p></div>';
    return;
  }

  // If business data is already ready, initialize product detail immediately
  // Otherwise, we'll initialize when the businessDataLoaded event is dispatched
  if (window.businessDataReady) {
    initProductDetail();
  }
});
