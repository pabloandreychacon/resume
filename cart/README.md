# POStore Newsletter System

## Configuración de EmailJS

El formulario de newsletter utiliza EmailJS para enviar correos electrónicos directamente desde JavaScript a un destinatario preseleccionado.

### Credenciales

- **Public Key**: L7o6hZUmFJQ_Jbqu0
- **Service ID**: service_s481rtv
- **Template ID**: template_771ecr6
- **Destinatario**: pabloandreychacon@gmail.com

### Implementación

El código se encuentra en `sections/footer.html` y utiliza la biblioteca EmailJS para enviar correos sin necesidad de un servidor backend. La biblioteca se carga dinámicamente cuando el usuario envía el formulario.

```javascript
// Cargar EmailJS dinámicamente
var script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
script.onload = function() {
  // Inicializar EmailJS y enviar el correo
  emailjs.init("L7o6hZUmFJQ_Jbqu0");
  
  emailjs.send("service_s481rtv", "template_771ecr6", {
    to_email: "pabloandreychacon@gmail.com",
    from_email: email,
    message: "Nueva suscripción al newsletter de: " + email
  });
};
```

### Cómo funciona

1. El usuario ingresa su correo electrónico en el formulario
2. Al hacer clic en "Subscribe", JavaScript intercepta el envío
3. Se carga dinámicamente la biblioteca EmailJS
4. EmailJS envía el correo a la dirección preseleccionada
5. Se muestra un mensaje de éxito o error según corresponda

### Mantenimiento

Para cambiar el destinatario, modificar la propiedad `to_email` en el objeto de parámetros del método `send`.

### Recommendations

Product Detail Pages: mismo modal pero con mas imágenes Create individual pages for each product with more detailed information, specifications, and reviews.

Related Products: Show related or recommended products on product detail pages to encourage additional purchases.

Filter Improvements: Add price range filters, sorting by popularity, and more advanced filtering options.

Mobile Optimization: Ensure the site is fully responsive and optimized for mobile devices.

### Performance Optimization

Performance optimizations implemented for the POStore website:

Lazy Loading for Images:
- Added native lazy loading with the loading="lazy" attribute
- Used simple JavaScript to handle data-src attributes

JavaScript Optimization:
- Deferred non-critical JavaScript loading
- Added script loading prioritization
- Implemented conditional loading for certain features

CSS Optimization:
- Minified and combined CSS files: only in production builds
- Optimized CSS delivery
- Added preconnect for external domains

General Optimizations:
- Improved resource loading order
- Added appropriate caching strategies
- Optimized image formats and sizes

### SEO

SEO improvements for the POStore website:

SEO-Friendly Product Markup:

Ensured clean, semantic HTML for product listings

Used appropriate heading levels and descriptive text

Included proper alt text for all product images

Open Graph and Twitter Card Metadata:

Added Open Graph tags for better sharing on Facebook and other platforms

Added Twitter Card metadata for rich previews when shared on Twitter

Included title, description, and image information

SEO-Friendly URLs and IDs:

Added unique IDs to product elements (product-1, product-2, etc.)

These IDs can be used in URLs for direct linking to products

Sitemap and Robots.txt:

Created a sitemap.xml file listing all pages with priority and update frequency

Added a robots.txt file to guide search engine crawlers