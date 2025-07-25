// Checkout.js - Modified for PayPal integration

document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();
  loadOrderSummary();
  setupEventListeners();
});

function loadCartItems() {
  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("modernstore_cart")) || [];
  const cartItemsContainer = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="text-center text-muted">Your cart is empty</p>';
    return;
  }

  let itemsHtml = "";

  cart.forEach((item, index) => {
    itemsHtml += `
      <div class="card mb-3 cart-item" data-index="${index}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <div class="me-3">
                <img src="${item.ImageUrl || item.imageUrl || item.image || 'https://via.placeholder.com/50'}" alt="${item.Name || item.name}" width="50" height="50" class="rounded">
              </div>
              <div>
                <h6 class="mb-0">${item.Name || item.name}</h6>
                <p class="text-muted mb-0">$${(item.Price || item.price).toFixed(2)}</p>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <div class="input-group input-group-sm" style="width: 120px;">
                <button class="btn btn-outline-secondary decrease-qty" type="button">-</button>
                <input type="text" class="form-control text-center item-qty" value="${item.quantity}" readonly>
                <button class="btn btn-outline-secondary increase-qty" type="button">+</button>
              </div>
              <button class="btn btn-sm btn-outline-danger ms-2 remove-item">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = itemsHtml;
}

function loadOrderSummary() {
  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("modernstore_cart")) || [];
  const orderItemsContainer = document.getElementById("orderItems");

  if (cart.length === 0) {
    orderItemsContainer.innerHTML =
      '<p class="text-center text-muted">Your cart is empty</p>';
    updateTotals(0);
    return;
  }

  // Calculate subtotal
  let subtotal = 0;
  let itemsHtml = "";

  cart.forEach((item) => {
    const itemPrice = item.Price || item.price;
    const itemTotal = itemPrice * item.quantity;
    subtotal += itemTotal;

    itemsHtml += `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-0">${item.Name || item.name}</h6>
          <small class="text-muted">Qty: ${item.quantity}</small>
        </div>
        <span>$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  orderItemsContainer.innerHTML = itemsHtml;
  updateTotals(subtotal);
}

function updateTotals(subtotal) {
  // Get selected shipping method
  const shippingMethod = document.querySelector(
    'input[name="shipping"]:checked'
  );
  const shippingCost = shippingMethod ? parseFloat(shippingMethod.value) : 0;

  // Calculate tax (example: 8%)
  const taxRate = 0.0;
  const tax = subtotal * taxRate;

  // Calculate total
  const total = subtotal + shippingCost + tax;

  // Update UI
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shippingCost").textContent = 
    shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`;
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}

function setupEventListeners() {
  // Shipping method change
  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const subtotal = parseFloat(
        document.getElementById("subtotal").textContent.replace("$", "")
      );
      updateTotals(subtotal);
    });
  });
  
  // Quantity change buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('increase-qty')) {
      updateQuantity(e.target.closest('.cart-item'), 1);
    } else if (e.target.classList.contains('decrease-qty')) {
      updateQuantity(e.target.closest('.cart-item'), -1);
    } else if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
      removeItem(e.target.closest('.cart-item'));
    }
  });
}

function updateQuantity(cartItemEl, change) {
  const index = parseInt(cartItemEl.dataset.index);
  const cart = JSON.parse(localStorage.getItem("modernstore_cart")) || [];
  
  if (cart[index]) {
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem("modernstore_cart", JSON.stringify(cart));
    
    // Update UI
    cartItemEl.querySelector('.item-qty').value = cart[index].quantity;
    loadOrderSummary();
  }
}

function removeItem(cartItemEl) {
  const index = parseInt(cartItemEl.dataset.index);
  const cart = JSON.parse(localStorage.getItem("modernstore_cart")) || [];
  
  if (cart[index]) {
    cart.splice(index, 1);
    localStorage.setItem("modernstore_cart", JSON.stringify(cart));
    
    // Reload all cart UI
    loadCartItems();
    loadOrderSummary();
  }
}
