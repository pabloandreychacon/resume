// Product Detail Page JavaScript
class ProductDetail {
  constructor() {
    this.product = null;
    this.categories = {};
    this.init();
  }

  async init() {
    await this.loadCategories();
    await this.loadProduct();
    await this.loadRelatedProducts();
    this.bindEvents();
  }

  async loadCategories() {
    try {
      const { data, error } = await supabase
        .from('Categories')
        .select('*');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      this.categories = {};
      data.forEach(category => {
        this.categories[category.CategoryId] = category.Name;
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      window.location.href = '../index.html';
      return;
    }

    try {
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('Id', productId)
        .single();
      
      if (error || !data) {
        console.error('Error fetching product:', error);
        window.location.href = '../index.html';
        return;
      }
      
      this.product = data;
      this.renderProduct();
    } catch (error) {
      console.error('Error loading product:', error);
      window.location.href = '../index.html';
    }
  }

  renderProduct() {
    if (!this.product) return;

    document.getElementById('productName').textContent = this.product.Name;
    document.getElementById('productImage').src = `${this.product.ImageUrl}?t=${Date.now()}`;
    document.getElementById('productImage').alt = this.product.Name;
    document.getElementById('productPrice').textContent = `$${this.product.Price}`;
    document.getElementById('productDescription').textContent = this.product.Description || 'No description available.';
    document.getElementById('productCategory').textContent = this.categories[this.product.CategoryId] || 'Uncategorized';
    document.getElementById('productBreadcrumb').textContent = this.product.Name;

    // Stock info
    const stockInfo = document.getElementById('stockInfo');
    if (this.product.StockQuantity !== undefined && this.product.StockQuantity !== null) {
      const stockClass = this.product.StockQuantity > 10 ? 'text-success' : 
                        this.product.StockQuantity > 0 ? 'text-warning' : 'text-danger';
      stockInfo.innerHTML = `<span class="${stockClass}"><i class="bi bi-box-seam me-1"></i>Stock: ${this.product.StockQuantity}</span>`;
    }

    // Update add to cart button based on stock
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (this.product.StockQuantity !== null && this.product.StockQuantity !== undefined && this.product.StockQuantity === 0) {
      addToCartBtn.textContent = 'Out of Stock';
      addToCartBtn.className = 'btn btn-secondary btn-lg w-100';
      addToCartBtn.disabled = true;
    }

    // Update page title
    document.title = `${this.product.Name} - POStore`;
  }

  bindEvents() {
    // Quantity controls
    document.getElementById('decreaseQty').addEventListener('click', () => {
      const qtyInput = document.getElementById('quantity');
      const currentQty = parseInt(qtyInput.value);
      if (currentQty > 1) {
        qtyInput.value = currentQty - 1;
      }
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
      const qtyInput = document.getElementById('quantity');
      const currentQty = parseInt(qtyInput.value);
      qtyInput.value = currentQty + 1;
    });

    // Add to cart with quantity
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      const store = window.store || window.productStore;
      if (store && this.product) {
        // Check if product manages stock and has stock available
        if (this.product.StockQuantity !== null && this.product.StockQuantity !== undefined && this.product.StockQuantity === 0) {
          return; // Don't add if stock is managed and is 0
        }
        
        const quantity = parseInt(document.getElementById('quantity').value);
        store.addToCart(this.product, quantity);
      }
    });

    // Add to wishlist
    document.getElementById('addToWishlistBtn').addEventListener('click', () => {
      const store = window.store || window.productStore;
      if (store && this.product) {
        store.toggleWishlist(this.product);
        this.updateWishlistButton();
      }
    });

    // Update wishlist button on load
    this.updateWishlistButton();

    // Share buttons
    document.querySelectorAll('.share-product-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = e.target.closest('.share-product-btn').dataset.platform;
        this.shareProduct(platform);
      });
    });
  }

  async loadRelatedProducts() {
    if (!this.product) return;

    try {
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('CategoryId', this.product.CategoryId)
        .neq('Id', this.product.Id)
        .limit(4);
      
      if (error) {
        console.error('Error fetching related products:', error);
        return;
      }
      
      this.renderRelatedProducts(data || []);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  }

  renderRelatedProducts(products) {
    const container = document.getElementById('relatedProductsContainer');
    
    if (products.length === 0) {
      container.innerHTML = '<p class="text-muted">No related products found.</p>';
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="col-lg-3 col-md-6 mb-4">
        <div class="card h-100 shadow-sm" style="cursor: pointer;" onclick="window.location.href='product-detail.html?id=${product.Id}'">
          <img src="${product.ImageUrl}?t=${Date.now()}" alt="${product.Name}" class="card-img-top" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <p class="text-muted mb-1">${this.categories[product.CategoryId] || 'Uncategorized'}</p>
            <h6 class="card-title">${product.Name}</h6>
            <p class="text-primary fw-bold mt-auto">$${product.Price}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  updateWishlistButton() {
    const store = window.store || window.productStore;
    if (!store || !this.product) return;
    
    const btn = document.getElementById('addToWishlistBtn');
    const isInWishlist = store.wishlist.some(item => (item.Id || item.id) === this.product.Id);
    
    if (isInWishlist) {
      btn.innerHTML = '<i class="bi bi-heart-fill me-2"></i>Remove from Wishlist';
      btn.classList.remove('btn-outline-danger');
      btn.classList.add('btn-danger');
    } else {
      btn.innerHTML = '<i class="bi bi-heart me-2"></i>Add to Wishlist';
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-outline-danger');
    }
  }

  shareProduct(platform) {
    if (!this.product) return;

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(`Check out ${this.product.Name} - $${this.product.Price} at POStore!`);
    const imageUrl = encodeURIComponent(this.product.ImageUrl);
    
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        const fbText = `Check out ${this.product.Name} - $${this.product.Price} at POStore!`;
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://postore.com&quote=${encodeURIComponent(fbText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${imageUrl}&description=${pageTitle}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${pageTitle}&body=I thought you might be interested in this: ${decodeURIComponent(pageUrl)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new ProductDetail();
});