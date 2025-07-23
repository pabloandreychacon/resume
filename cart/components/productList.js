const renderProducts = (products) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear existing content
  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.innerHTML = `
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price.toFixed(2)}</p>
      <img src="${product.image}" alt="${product.name}" />
      <p>Category: ${product.category}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(productItem);
  });
};

export default renderProducts;
