// Social sharing functionality
document.addEventListener("DOMContentLoaded", function () {
  // Wait for the common elements to load
  document.addEventListener("sectionLoaded", function (e) {
    if (e.detail.id === "commonElements") {
      setTimeout(setupSocialSharing, 300);
    }
  });

  // Set up product card sharing buttons
  setTimeout(function () {
    setupProductCardSharing();
  }, 1000);
});

function setupProductCardSharing() {
  document.addEventListener("click", function (e) {
    if (e.target.closest(".share-product-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.target.closest(".share-product-btn");
      const platform = button.getAttribute("data-platform");
      const productId = button.getAttribute("data-product-id");

      // Find product data
      if (window.store && window.store.products) {
        const product = window.store.products.find(
          (p) => (p.Id || p.id) == productId
        );
        if (product) {
          shareProductDirect(platform, product);
        }
      }
    }
  });
}

function setupSocialSharing() {
  const shareButtons = document.querySelectorAll(".share-btn");

  if (shareButtons.length > 0) {
    shareButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const platform = this.getAttribute("data-platform");
        shareProduct(platform);
      });
    });
  }
}

function shareProduct(platform) {
  // Get product information from modal
  const productName = document.getElementById("modalProductName").textContent;
  const productPrice = document.getElementById("modalProductPrice").textContent;
  const productImage = document.getElementById("modalProductImage").src;

  // Create sharing URL
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(
    `Check out ${productName} - ${productPrice} at POStore!`
  );
  const imageUrl = encodeURIComponent(productImage);

  let shareUrl = "";

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
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

  // Open share dialog
  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
}

function shareProductDirect(platform, product) {
  // Create sharing URL
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(
    `Check out ${product.Name || product.name} - $${
      product.Price || product.price
    } at POStore!`
  );
  const imageUrl = encodeURIComponent(
    product.ImageUrl || product.imageUrl || product.image
  );

  let shareUrl = "";

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
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

  // Open share dialog
  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
  
  // Ensure products remain visible after sharing
  setTimeout(() => {
    if (window.store) {
      window.store.renderProducts();
    }
  }, 100);
}
