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
