// Función para cargar las categorías desde el archivo JSON
function loadCategoryButtons() {
  fetch('data/categories.json')
    .then(response => response.json())
    .then(categories => {
      const categoryContainer = document.querySelector('.d-flex.gap-2.flex-wrap');
      
      // Limpiar el contenedor
      categoryContainer.innerHTML = '';
      
      // Agregar el botón "All Products"
      const allButton = document.createElement('button');
      allButton.className = 'btn btn-outline-primary active';
      allButton.setAttribute('data-category', 'all');
      allButton.textContent = 'All Products';
      categoryContainer.appendChild(allButton);
      
      // Agregar los botones de categoría desde el JSON
      categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary';
        button.setAttribute('data-category', category.name);
        
        // Usar el displayName del JSON
        button.textContent = category.displayName;
        categoryContainer.appendChild(button);
      });
      
      // Agregar event listeners a los botones
      setupCategoryFilters();
    })
    .catch(error => console.error('Error loading categories:', error));
}

// Función para configurar los filtros de categoría
function setupCategoryFilters() {
  const categoryButtons = document.querySelectorAll('[data-category]');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover la clase active de todos los botones
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Agregar la clase active al botón clickeado
      this.classList.add('active');
      
      // Filtrar productos usando el atributo data-category
      const category = this.getAttribute('data-category');
      
      // Filtrar los productos visibles según la categoría seleccionada
      const products = document.querySelectorAll('.product-card');
      
      // Obtener el contenedor de productos
      const productContainer = document.getElementById('productsContainer');
      
      products.forEach(product => {
        // Obtener el elemento padre (col) de la tarjeta
        const productCol = product.closest('.col-lg-3');
        
        if (category === 'all' || product.getAttribute('data-category') === category) {
          productCol.classList.remove('d-none');
        } else {
          productCol.classList.add('d-none');
        }
      });
      
      // Forzar reflow para reorganizar las tarjetas visibles
      productContainer.classList.add('row-reflow');
      setTimeout(() => {
        productContainer.classList.remove('row-reflow');
      }, 10);
    });
  });
}

// Definir la función filterProductsByCategory para evitar el error
function filterProductsByCategory(category) {
  const products = document.querySelectorAll('.product-card');
  const productContainer = document.getElementById('productsContainer');
  
  products.forEach(product => {
    // Obtener el elemento padre (col) de la tarjeta
    const productCol = product.closest('.col-lg-3');
    
    if (category === 'all' || product.getAttribute('data-category') === category) {
      productCol.classList.remove('d-none');
    } else {
      productCol.classList.add('d-none');
    }
  });
  
  // Forzar reflow para reorganizar las tarjetas visibles
  productContainer.classList.add('row-reflow');
  setTimeout(() => {
    productContainer.classList.remove('row-reflow');
  }, 10);
}

// Cargar los botones de categoría cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadCategoryButtons);