// Checkout.js - Modified for PayPal integration

// Update business name when data is ready
function updateCheckoutBusinessInfo() {
  const businessName = window.globalStore?.state?.BusinessName || "POStore";
  const businessNameElement = document.getElementById("business-name");
  if (businessNameElement) {
    businessNameElement.textContent = businessName;
  }
}

// Listen for business data loaded event
window.addEventListener("businessDataLoaded", updateCheckoutBusinessInfo);

// Also check if business data is already loaded
document.addEventListener("DOMContentLoaded", function () {
  if (window.businessDataReady && window.globalStore?.state) {
    updateCheckoutBusinessInfo();
  }
});

// Format prices when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Initialize local currency display
  const localCurrencyDisplay = document.getElementById("localCurrencyDisplay");
  if (localCurrencyDisplay) {
    localCurrencyDisplay.innerHTML = "";
  }

  // Only initialize order summary prices to 0 if cart is empty
  const cart = JSON.parse(localStorage.getItem("postore_cart")) || [];
  if (cart.length === 0) {
    const subtotal = document.getElementById("subtotal");
    if (subtotal) {
      subtotal.textContent = StoreFunctions.formatPrice(0);
    }

    const shippingCost = document.getElementById("shippingCost");
    if (shippingCost) {
      shippingCost.textContent = StoreFunctions.formatPrice(0);
    }

    const tax = document.getElementById("tax");
    if (tax) {
      tax.textContent = StoreFunctions.formatPrice(0);
    }

    const total = document.getElementById("total");
    if (total) {
      total.textContent = StoreFunctions.formatPrice(0);
    }
  }
});

// Function to wait for price formatter initialization
async function waitForPriceFormatter(maxWaitTime = 5000) {
  // If priceFormatter doesn't exist yet, wait for it
  const startTime = Date.now();
  while (typeof window.priceFormatter === "undefined") {
    if (Date.now() - startTime > maxWaitTime) {
      console.warn("Price formatter not available after waiting", maxWaitTime, "ms");
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // If priceFormatter exists but is not initialized, wait for initialization
  if (window.priceFormatter && !window.priceFormatter.initialized) {
    const initStartTime = Date.now();
    // Wait for the price formatter to be initialized
    while (!window.priceFormatter.initialized) {
      if (Date.now() - initStartTime > maxWaitTime) {
        console.warn("Price formatter initialization timed out after", maxWaitTime, "ms");
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  
  return true;
}

// Function to wait for shared store initialization
async function waitForSharedStore() {
  // If store doesn't exist yet, wait for it
  while (typeof window.store === "undefined") {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // If store exists but doesn't have cart property yet, wait for it
  while (typeof window.store.cart === "undefined") {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Add event listener to refresh cart when page is shown again
window.addEventListener("pageshow", (event) => {
  // Check if the page is being shown from cache (back/forward navigation)
  if (event.persisted) {
    // Refresh cart items without waiting for shared store
    loadCartItems();
    loadOrderSummary();

    // Also try to refresh shared store in the background
    waitForSharedStore()
      .then(() => {
        console.log("Shared store re-initialized after page show");
        // Optionally refresh the UI again if needed
        // loadCartItems();
        // loadOrderSummary();
      })
      .catch((error) => {
        console.error(
          "Error re-initializing shared store after page show:",
          error
        );
      });
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  // Wait for price formatter and shared store before loading cart items
  // This ensures proper price formatting from the start
  try {
    const formatterInitialized = await waitForPriceFormatter(5000);
    if (formatterInitialized) {
      console.log("Price formatter initialized successfully");
    } else {
      console.warn("Price formatter initialization timed out, will use default formatting");
    }
  } catch (error) {
    console.error("Error initializing price formatter:", error);
  }

  try {
    await waitForSharedStore();
    console.log("Shared store initialized");
  } catch (error) {
    console.error("Error initializing shared store:", error);
  }

  // Initialize all functions after waiting for async operations
  // This ensures proper price formatting from the start
  loadCartItems();
  loadOrderSummary();
  setupEventListeners();
  loadShippingMethods();
});

async function loadCartItems(maxRetries = 3, retryDelay = 100) {
  // Always load cart from localStorage first to ensure we have the data
  let cart;
  let retryCount = 0;

  // Ensure price formatter is initialized before loading cart items
  if (!window.priceFormatter || !window.priceFormatter.initialized) {
    console.log("Price formatter not initialized, waiting before loading cart items...");
    await StoreFunctions.waitForPriceFormatter(3000);
  }

  while (retryCount <= maxRetries) {
    try {
      cart = JSON.parse(localStorage.getItem("postore_cart")) || [];
      break;
    } catch (error) {
      console.warn(
        `Error loading cart from localStorage (attempt ${retryCount + 1}):`,
        error
      );
      if (retryCount === maxRetries) {
        console.error(
          "Failed to load cart from localStorage after",
          maxRetries + 1,
          "attempts"
        );
        cart = [];
        break;
      }
      retryCount++;
      // Wait before retrying
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      wait(retryDelay * retryCount); // Exponential backoff
    }
  }

  // If shared store is available and initialized, refresh it from storage
  if (
    window.store &&
    typeof window.store.refreshCartFromStorage === "function"
  ) {
    try {
      // Refresh cart from storage using shared store
      window.store.refreshCartFromStorage();
      // Use the cart from shared store for consistency
      cart = window.store.cart;
    } catch (error) {
      console.error("Error refreshing cart from shared store:", error);
      // Fall back to localStorage data if shared store fails
    }
  }

  const cartItemsContainer = document.getElementById("cartItems");
  if (!cartItemsContainer) {
    console.error("Cart items container not found");
    return;
  }

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
          <div class="row d-flex justify-content-between align-items-center">
            <div class="col d-flex align-items-center">
              <div class="me-3">
                <img src="${
                  item.ImageUrl ||
                  item.imageUrl ||
                  item.image ||
                  "https://via.placeholder.com/50"
                }" alt="${
      item.Name || item.name
    }" width="50" height="50" class="rounded" onerror="this.onerror=null; this.src='https://via.placeholder.com/50';">
              </div>
              <div>
                <h6 class="mb-0">${item.Name || item.name}</h6>
                <p class="text-muted mb-0">${StoreFunctions.formatPrice(
                  calculatePriceWithTax(item)
                )}</p>
              </div>
            </div>
            <div class="col d-flex align-items-center">
              <div class="input-group input-group-sm" style="width: 120px;">
                <button class="btn btn-outline-secondary decrease-qty" type="button">-</button>
                <input type="text" class="form-control text-center item-qty" value="${
                  item.quantity
                }" readonly>
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

async function loadOrderSummary(maxRetries = 3, retryDelay = 100) {
  // Always load cart from localStorage first to ensure we have the data
  let cart;
  let retryCount = 0;
  
  // Ensure price formatter is initialized before loading order summary
  if (!window.priceFormatter || !window.priceFormatter.initialized) {
    console.log("Price formatter not initialized, waiting before loading order summary...");
    await StoreFunctions.waitForPriceFormatter(3000);
  }

  while (retryCount <= maxRetries) {
    try {
      cart = JSON.parse(localStorage.getItem("postore_cart")) || [];
      break;
    } catch (error) {
      console.warn(
        `Error loading cart from localStorage (attempt ${retryCount + 1}):`,
        error
      );
      if (retryCount === maxRetries) {
        console.error(
          "Failed to load cart from localStorage after",
          maxRetries + 1,
          "attempts"
        );
        cart = [];
        break;
      }
      retryCount++;
      // Wait before retrying
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await wait(retryDelay * retryCount); // Exponential backoff
    }
  }

  // If shared store is available and initialized, refresh it from storage
  if (
    window.store &&
    typeof window.store.refreshCartFromStorage === "function"
  ) {
    try {
      // Refresh cart from storage using shared store
      window.store.refreshCartFromStorage();
      // Use the cart from shared store for consistency
      cart = window.store.cart;
    } catch (error) {
      console.error("Error refreshing cart from shared store:", error);
      // Fall back to localStorage data if shared store fails
    }
  }

  const orderItemsContainer = document.getElementById("orderItems");
  if (!orderItemsContainer) {
    console.error("Order items container not found");
    updateTotals(0);
    return;
  }

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
    const itemPriceWithTax = parseFloat(calculatePriceWithTax(item));
    const itemTotal = itemPriceWithTax * item.quantity;
    subtotal += itemTotal;

    itemsHtml += `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-0">${item.Name || item.name}</h6>
          <small class="text-muted">Qty: ${item.quantity}</small>
        </div>
        <span>${StoreFunctions.formatPrice(itemTotal)}</span>
      </div>
    `;
  });

  orderItemsContainer.innerHTML = itemsHtml;
  updateTotals(subtotal);
}

function calculatePriceWithTax(item) {
  const basePrice = parseFloat(item.Price || item.price || 0);
  const taxRate =
    parseFloat(item.TaxRate || item.taxes || item.Taxes || 0) / 100;
  return (basePrice * (1 + taxRate)).toFixed(2);
}

function getExchangeRate() {
  // Get exchange rate from price formatter if available
  if (window.priceFormatter) {
    // Check if settings are loaded and contain ExchangeRate
    if (
      window.priceFormatter.settings &&
      window.priceFormatter.settings.ExchangeRate !== undefined
    ) {
      return window.priceFormatter.settings.ExchangeRate;
    }
    // Fallback to exchangeRate property if settings not loaded yet
    if (window.priceFormatter.exchangeRate !== undefined) {
      return window.priceFormatter.exchangeRate;
    }
  }
  return 1; // Default exchange rate
}

function updateTotals(subtotal) {
  // Get selected shipping method
  const shippingMethod = document.querySelector(
    'input[name="shipping"]:checked'
  );
  const shippingCost = shippingMethod ? parseFloat(shippingMethod.value) : 0;

  // Tax is already included in subtotal since we're using prices with tax
  const tax = 0;

  // Calculate total
  const total = subtotal + shippingCost + tax;

  // Get exchange rate
  const exchangeRate = getExchangeRate();
  // This is the USD equivalent (not local currency)
  const totalInUSD = total / exchangeRate;

  // Update UI
  document.getElementById("subtotal").textContent =
    StoreFunctions.formatPrice(subtotal);
  document.getElementById("shippingCost").textContent =
    shippingCost === 0 ? "FREE" : StoreFunctions.formatPrice(shippingCost);
  document.getElementById("tax").textContent = StoreFunctions.formatPrice(tax);
  document.getElementById("total").textContent =
    StoreFunctions.formatPrice(total);

  // Update local currency display if exchange rate is not 1
  const localCurrencyDisplay = document.getElementById("localCurrencyDisplay");
  if (localCurrencyDisplay && exchangeRate !== 1 && window.priceFormatter?.settings?.CurrencyCode !== 'USD') {
    localCurrencyDisplay.innerHTML = `
      <div class="alert alert-info mt-3">
        <small>
          <i class="bi bi-info-circle me-1"></i>
          <strong>Note:</strong> PayPal will process payment in USD: $${totalInUSD.toFixed(2)}
          (based on exchange rate: ${exchangeRate})
        </small>
      </div>
    `;
  } else if (localCurrencyDisplay) {
    localCurrencyDisplay.innerHTML = "";
  }
  
  // Trigger a custom event to notify that the total has been updated
  // This will be used to recalculate the PayPal amount
  const totalUpdatedEvent = new CustomEvent('totalUpdated', { detail: { total: total } });
  document.dispatchEvent(totalUpdatedEvent);
}

function setupEventListeners() {
  // Use event delegation for shipping method changes
  document.addEventListener("change", function (e) {
    if (e.target && e.target.name === "shipping") {
      handleShippingChange();
    }
  });

  // Quantity change buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("increase-qty")) {
      updateQuantity(e.target.closest(".cart-item"), 1);
    } else if (e.target.classList.contains("decrease-qty")) {
      updateQuantity(e.target.closest(".cart-item"), -1);
    } else if (
      e.target.classList.contains("remove-item") ||
      e.target.closest(".remove-item")
    ) {
      removeItem(e.target.closest(".cart-item"));
    }
  });
}

function updateQuantity(cartItemEl, change) {
  // Use shared store if available, otherwise use localStorage directly
  if (window.store && typeof window.store.updateQuantity === "function") {
    // Check if shared store is initialized
    if (window.store.cart !== undefined) {
      const index = parseInt(cartItemEl.dataset.index);
      // Get the cart from shared store
      const cart = window.store.cart;

      if (cart[index]) {
        const newQuantity = Math.max(1, cart[index].quantity + change);
        // Use shared store's updateQuantity method
        window.store.updateQuantity(
          cart[index].Id || cart[index].id,
          newQuantity
        );
        // Reload all cart UI
        loadCartItems();
        loadOrderSummary();
      }
      return;
    }
  }

  const index = parseInt(cartItemEl.dataset.index);

  // Load cart from localStorage with retry mechanism
  let cart;
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount <= maxRetries) {
    try {
      cart = JSON.parse(localStorage.getItem("postore_cart")) || [];
      break;
    } catch (error) {
      console.warn(
        `Error loading cart from localStorage (attempt ${retryCount + 1}):`,
        error
      );
      if (retryCount === maxRetries) {
        console.error(
          "Failed to load cart from localStorage after",
          maxRetries + 1,
          "attempts"
        );
        cart = [];
        break;
      }
      retryCount++;
      // Wait before retrying
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      wait(100 * retryCount); // Exponential backoff
    }
  }

  if (cart[index]) {
    const newQuantity = Math.max(1, cart[index].quantity + change);
    const item = cart[index];

    // Check stock validation if product manages stock
    if (item.StockQuantity !== null && item.StockQuantity !== undefined) {
      if (newQuantity > item.StockQuantity) {
        // Show toast notification if available
        if (window.store && window.store.showToast) {
          window.store.showToast(
            `Cannot increase quantity. Only ${item.StockQuantity} available in stock`,
            "warning"
          );
        } else {
          alert(
            `Cannot increase quantity. Only ${item.StockQuantity} available in stock`
          );
        }
        return;
      }
    }

    cart[index].quantity = newQuantity;

    // Save cart to localStorage with retry mechanism
    retryCount = 0;
    while (retryCount <= maxRetries) {
      try {
        localStorage.setItem("postore_cart", JSON.stringify(cart));
        break;
      } catch (error) {
        console.warn(
          `Error saving cart to localStorage (attempt ${retryCount + 1}):`,
          error
        );
        if (retryCount === maxRetries) {
          console.error(
            "Failed to save cart to localStorage after",
            maxRetries + 1,
            "attempts"
          );
          break;
        }
        retryCount++;
        // Wait before retrying
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        wait(100 * retryCount); // Exponential backoff
      }
    }

    // Update UI
    cartItemEl.querySelector(".item-qty").value = cart[index].quantity;
    loadOrderSummary();
  }
}

function removeItem(cartItemEl) {
  // Use shared store if available, otherwise use localStorage directly
  if (window.store && typeof window.store.removeFromCart === "function") {
    // Check if shared store is initialized
    if (window.store.cart !== undefined) {
      const index = parseInt(cartItemEl.dataset.index);
      // Get the cart from shared store
      const cart = window.store.cart;

      if (cart[index]) {
        // Use shared store's removeFromCart method
        window.store.removeFromCart(cart[index].Id || cart[index].id);
        // Reload all cart UI
        loadCartItems();
        loadOrderSummary();
      }
      return;
    }
  }

  const index = parseInt(cartItemEl.dataset.index);

  // Load cart from localStorage with retry mechanism
  let cart;
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount <= maxRetries) {
    try {
      cart = JSON.parse(localStorage.getItem("postore_cart")) || [];
      break;
    } catch (error) {
      console.warn(
        `Error loading cart from localStorage (attempt ${retryCount + 1}):`,
        error
      );
      if (retryCount === maxRetries) {
        console.error(
          "Failed to load cart from localStorage after",
          maxRetries + 1,
          "attempts"
        );
        cart = [];
        break;
      }
      retryCount++;
      // Wait before retrying
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      wait(100 * retryCount); // Exponential backoff
    }
  }

  if (cart[index]) {
    cart.splice(index, 1);

    // Save cart to localStorage with retry mechanism
    retryCount = 0;
    while (retryCount <= maxRetries) {
      try {
        localStorage.setItem("postore_cart", JSON.stringify(cart));
        break;
      } catch (error) {
        console.warn(
          `Error saving cart to localStorage (attempt ${retryCount + 1}):`,
          error
        );
        if (retryCount === maxRetries) {
          console.error(
            "Failed to save cart to localStorage after",
            maxRetries + 1,
            "attempts"
          );
          break;
        }
        retryCount++;
        // Wait before retrying
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        wait(100 * retryCount); // Exponential backoff
      }
    }

    // Reload all cart UI
    loadCartItems();
    loadOrderSummary();
  }
}
// Function to load shipping methods from Supabase
async function loadShippingMethods() {
  try {
    // Wait for Supabase to be initialized
    while (!window.supabase) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    let businessEmail =
      window.EmailUtils?.getBusinessEmail() || window.globalStore?.state.Email;

    // If no email found, use default
    if (!businessEmail) {
      businessEmail = "pabloandreychacon@hotmail.com";
    }

    // Fetch shipping methods from Supabase
    const { data: shippingMethods, error } = await supabase
      .from("ShippingMethods")
      .select("Description, Price")
      .eq("BusinessEmail", businessEmail)
      .eq("Active", true)
      .order("Price");

    if (error) {
      console.error("Error fetching shipping methods:", error);
      // Generate HTML with only pickup option
      generateShippingOptions([]);
      return;
    }

    // Generate HTML for shipping methods (pass empty array if no data found)
    generateShippingOptions(shippingMethods || []);
  } catch (error) {
    console.error("Error loading shipping methods:", error);
    // Generate HTML with only pickup option
    generateShippingOptions([]);
  }
}

// Function to generate HTML for shipping options
function generateShippingOptions(shippingMethods) {
  const container = document.getElementById("shippingMethodsContainer");

  if (!container) {
    console.error("Shipping methods container not found");
    return;
  }

  // Clear container
  container.innerHTML = "";

  // Always add pickup at store option first (always checked)
  const pickupDiv = document.createElement("div");
  pickupDiv.className = "form-check mb-2";
  pickupDiv.innerHTML = `
    <input
      class="form-check-input"
      type="radio"
      name="shipping"
      id="pickupShipping"
      value="0"
      checked
    />
    <label
      class="form-check-label d-flex justify-content-between w-100"
      for="pickupShipping"
    >
      <span>Pickup at Store (Available Today)</span>
      <span class="fw-bold text-success">FREE</span>
    </label>
  `;
  container.appendChild(pickupDiv);

  // Generate HTML for each shipping method from Supabase
  shippingMethods.forEach((method, index) => {
    const price = parseFloat(method.Price) || 0;
    const isFree = price === 0;

    // Skip if this is a free shipping method since we already have the pickup option
    if (isFree) return;

    const div = document.createElement("div");
    div.className = "form-check mb-2";

    div.innerHTML = `
      <input
        class="form-check-input"
        type="radio"
        name="shipping"
        id="shippingMethod${index}"
        value="${price}"
      />
      <label
        class="form-check-label d-flex justify-content-between w-100"
        for="shippingMethod${index}"
      >
        <span>${method.Description}</span>
        <span class="fw-bold ${isFree ? "text-success" : ""}">
          ${isFree ? "FREE" : StoreFunctions.formatPrice(price)}
        </span>
      </label>
    `;

    container.appendChild(div);
  });

  // Re-attach event listeners for shipping method changes
  setupShippingEventListeners();
}

// Function to set up event listeners for shipping methods
function setupShippingEventListeners() {
  // Remove existing listeners to avoid duplicates
  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.removeEventListener("change", handleShippingChange);
    radio.addEventListener("change", handleShippingChange);
  });
}

// Handler for shipping method changes
function handleShippingChange() {
  const subtotalElement = document.getElementById("subtotal");
  const subtotalText = subtotalElement ? subtotalElement.textContent : "0.00";
  // Extract numeric value from formatted price
  // This function handles various international number formats
  function extractNumericValue(formattedString) {
    // Remove currency symbols and other non-numeric characters except
    // decimal separators (.,) and negative sign (-)
    let cleaned = formattedString.replace(/[^\d.,-]/g, "");

    // Handle negative numbers
    const isNegative = cleaned.includes("-");
    cleaned = cleaned.replace(/-/g, "");

    // Handle different decimal separators
    // If we have both . and , we need to determine which is the decimal separator
    const dotCount = (cleaned.match(/\./g) || []).length;
    const commaCount = (cleaned.match(/,/g) || []).length;

    if (dotCount > 0 && commaCount > 0) {
      // If both exist, assume the last one is the decimal separator
      // and the other is the thousands separator
      if (cleaned.lastIndexOf(".") > cleaned.lastIndexOf(",")) {
        // Dot is decimal separator
        cleaned = cleaned.replace(/,/g, ""); // Remove thousands separator
      } else {
        // Comma is decimal separator
        cleaned = cleaned.replace(/\./g, ""); // Remove thousands separator
        cleaned = cleaned.replace(/,/, "."); // Convert decimal separator to dot
      }
    } else if (commaCount > 1) {
      // Multiple commas, assume they're thousands separators
      cleaned = cleaned.replace(/,/g, "");
    } else if (dotCount > 1) {
      // Multiple dots, assume they're thousands separators
      cleaned = cleaned.replace(/\./g, "");
    } else if (commaCount === 1) {
      // Single comma, check position to determine if it's decimal separator
      const parts = cleaned.split(",");
      if (parts[1] && parts[1].length === 3) {
        // If after comma there are exactly 3 digits, it might be thousands separator
        // But we'll treat it as decimal separator for now to avoid complexity
        cleaned = cleaned.replace(/,/, ".");
      } else {
        cleaned = cleaned.replace(/,/, ".");
      }
    }

    // Parse the final number
    const result = parseFloat(cleaned) || 0;
    return isNegative ? -result : result;
  }

  const subtotal = extractNumericValue(subtotalText) || 0;
  updateTotals(subtotal);
}
