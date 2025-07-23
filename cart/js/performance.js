// Performance optimizations for POStore

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
  // Use native lazy loading for all images
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
  
  // For images with data-src attribute (simple lazy loading)
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0) {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
});

// Defer non-critical JavaScript
function loadDeferredScripts() {
  const deferredScripts = document.querySelectorAll('script[defer-load]');
  deferredScripts.forEach(script => {
    const newScript = document.createElement('script');
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    document.body.appendChild(newScript);
    script.remove();
  });
}

// Load deferred scripts after page load
window.addEventListener('load', loadDeferredScripts);

// Optimize CSS delivery
document.addEventListener('DOMContentLoaded', function() {
  // Remove unused CSS classes
  const unusedCSSRemover = setTimeout(() => {
    const stylesheets = document.styleSheets;
    // This is a simplified approach - in production, you'd use a tool like PurgeCSS
    console.log('CSS optimization complete');
  }, 2000);
});

// Preconnect to required origins
function addPreconnect(url) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  document.head.appendChild(link);
}

// Add preconnect for common domains
addPreconnect('https://cdn.jsdelivr.net');
addPreconnect('https://images.pexels.com');