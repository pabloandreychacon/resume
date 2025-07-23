// read json data from products.js
//import { products } from "../data/products.js";
import renderProducts from "../components/productList.js";
/* import { renderCart } from './components/cart.js';
import { renderCategories } from './components/categoryList.js';
import { renderCartCount } from './components/cartCount.js';
import { renderCartTotal } from './components/cartTotal.js';
import { renderCartItems } from './components/cartItems.js';
import { renderCartActions } from './components/cartActions.js';
import { renderCartEmpty } from './components/cartEmpty.js'; */

// Initialize the application
async function init() {
  this.loadProducts();
  this.bindEvents();
  this.renderProducts();
  this.updateCartUI();
  // this.updateWishlistUI(); // <-- REMOVED
}

// Call the init function to start the application
init();
