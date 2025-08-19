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
      const businessEmail = window.globalStore?.state?.Email;
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
      window.location.href = "../index.html";
      return;
    }

    try {
      const businessEmail = window.globalStore?.state?.Email;
      if (!businessEmail) {
        console.error("Business email not available");
        window.location.href = "../index.html";
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
        window.location.href = "../index.html";
        return;
      }

      this.product = data;
      await this.loadProductMedia();
      this.mainImageUrl = data.ImageUrl || ""; // Assuming ImageUrl is the main image URL

      this.renderProduct();
    } catch (error) {
      console.error("Error loading product:", error);
      window.location.href = "../index.html";
    }
  }

  async loadProductMedia() {
    try {
      const businessEmail = window.globalStore?.state?.Email;
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
    document.getElementById(
      "productPrice"
    ).textContent = `$${this.calculatePriceWithTax(this.product)}`;
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
    // Quantity controls
    document.getElementById("decreaseQty").addEventListener("click", () => {
      const qtyInput = document.getElementById("quantity");
      const currentQty = parseInt(qtyInput.value);
      if (currentQty > 1) {
        qtyInput.value = currentQty - 1;
      }
    });

    document.getElementById("increaseQty").addEventListener("click", () => {
      const qtyInput = document.getElementById("quantity");
      const currentQty = parseInt(qtyInput.value);
      qtyInput.value = currentQty + 1;
    });

    // Add to cart with quantity
    document.getElementById("addToCartBtn").addEventListener("click", () => {
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
    document
      .getElementById("addToWishlistBtn")
      .addEventListener("click", () => {
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
      btn.addEventListener("click", (e) => {
        const platform =
          e.target.closest(".share-product-btn").dataset.platform;
        this.shareProduct(platform);
      });
    });
  }

  async loadRelatedProducts() {
    if (!this.product) return;

    try {
      const businessEmail = window.globalStore?.state?.Email;
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
        <div class="card h-100 shadow-sm" style="cursor: pointer;" onclick="window.location.href='product-detail.html?id=${
          product.Id
        }'">
          <img src="${product.ImageUrl}?t=${Date.now()}" alt="${
          product.Name
        }" class="card-img-top" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <p class="text-muted mb-1">${
              this.categories[product.CategoryId] || "Uncategorized"
            }</p>
            <h6 class="card-title">${product.Name}</h6>
            <p class="text-primary fw-bold mt-auto">$${product.Price}</p>
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
      container.innerHTML = `<img
  id="productImage"
  src=""
  alt=""
  class="img-fluid rounded shadow"
  style="cursor: zoom-in"
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
          src="${media.MediaUrl}?t=${Date.now()}" 
          alt="${this.product.Name}" 
          class="img-thumbnail product-thumbnail ${
            index === 0 ? "active" : ""
          }" 
          style="cursor: pointer; height: 60px; object-fit: cover; border: 2px solid ${
            index === 0 ? "#007bff" : "#dee2e6"
          };"
          data-index="${index}"
          onclick="productDetail.selectImage(${index})"
          >
        `
          )
          .join("")}
        </div>
      </div>
      <!-- Main Image -->
      <div class="col-10">
        <img 
        id="mainProductImage" 
        src="${allMedia[0].MediaUrl}?t=${Date.now()}" 
        alt="${this.product.Name}" 
        class="img-fluid rounded shadow" 
        style="max-height: 500px; object-fit: contain; width: 100%; cursor: pointer;"
        onclick="showImageModal(window.currentProductImages || [this.src])"
        >
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
    mainImage.src = `${allMedia[index].MediaUrl}?t=${Date.now()}`;

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
              <img src="${imageSrc}" alt="${this.product.Name}" class="img-fluid" style="max-height: 80vh;">
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

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(
      `Check out ${this.product.Name} - $${this.product.Price} at POStore!`
    );
    const imageUrl = encodeURIComponent(this.product.ImageUrl);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        const fbText = `Check out ${this.product.Name} - $${this.product.Price} at POStore!`;
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://postore.com&quote=${encodeURIComponent(
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
}

// Initialize when DOM is ready
let productDetail;

function initProductDetail() {
  productDetail = new ProductDetail();
  window.productDetail = productDetail; // Make it globally available
}

// Wait for business data to be loaded before initializing ProductDetail
window.addEventListener("businessDataLoaded", function () {
  initProductDetail();
});

// If business data is already loaded, initialize immediately
document.addEventListener("DOMContentLoaded", function () {
  if (window.businessDataReady && window.globalStore?.state?.Email) {
    initProductDetail();
  }
});
