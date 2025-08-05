# POStore - React E-commerce

Una aplicación de e-commerce moderna construida con React, TypeScript, Vite, Bootstrap, EmailJS, Supabase y React Router.

## 🚀 Características

- **React 18** con TypeScript para type safety
- **Vite** para desarrollo rápido y build optimizado
- **Bootstrap 5** y React Bootstrap para UI moderna
- **React Router** para navegación SPA
- **Context API** para estado global (carrito, wishlist, etc.)
- **EmailJS** para formularios de contacto y soporte
- **Supabase** para backend y base de datos
- **Responsive Design** para todos los dispositivos
- **Dark Mode** toggle
- **Carrito de compras** persistente
- **Lista de deseos** funcional
- **Checkout** completo con formularios

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone <tu-repositorio>
cd postore-react
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_de_emailjs
VITE_EMAILJS_SERVICE_ID=tu_service_id_de_emailjs
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_de_emailjs
```

4. **Ejecuta el servidor de desarrollo**
```bash
npm run dev
```

5. **Abre tu navegador**
Visita `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Navegación principal
│   ├── Footer.tsx      # Pie de página
│   ├── CartOffcanvas.tsx
│   └── WishlistOffcanvas.tsx
├── context/            # Context API
│   └── GlobalContext.tsx
├── data/              # Datos estáticos
│   ├── products.json
│   └── categories.json
├── lib/               # Configuraciones de librerías
│   ├── supabase.ts
│   └── emailjs.ts
├── pages/             # Páginas de la aplicación
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Support.tsx
│   ├── Cart.tsx
│   ├── Wishlist.tsx
│   ├── Checkout.tsx
│   ├── FAQ.tsx
│   └── ProductDetail.tsx
├── types/             # Definiciones de TypeScript
│   └── index.ts
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Bootstrap 5, React Bootstrap
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Email**: EmailJS
- **Styling**: CSS3, Bootstrap Icons
- **Build Tool**: Vite
- **Package Manager**: npm

## 📱 Páginas Disponibles

- **Home** (`/`) - Página principal con productos destacados
- **About** (`/about`) - Información sobre la empresa
- **Contact** (`/contact`) - Formulario de contacto
- **Support** (`/support`) - Soporte al cliente y tickets
- **Cart** (`/cart`) - Carrito de compras
- **Wishlist** (`/wishlist`) - Lista de deseos
- **Checkout** (`/checkout`) - Proceso de compra
- **FAQ** (`/faq`) - Preguntas frecuentes
- **Product Detail** (`/product/:id`) - Detalles del producto

## 🔧 Funcionalidades Principales

### 🛒 Carrito de Compras
- Agregar/remover productos
- Actualizar cantidades
- Persistencia en localStorage
- Cálculo automático de totales

### ❤️ Lista de Deseos
- Agregar productos a favoritos
- Mover productos al carrito
- Persistencia en localStorage

### 📧 Formularios de Contacto
- Formulario de contacto general
- Tickets de soporte
- Integración con EmailJS
- Validación de formularios

### 🌙 Modo Oscuro
- Toggle entre modo claro y oscuro
- Persistencia de preferencia
- Transiciones suaves

### 📱 Responsive Design
- Diseño adaptativo para móviles
- Navegación optimizada
- Componentes offcanvas para carrito/wishlist

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🔧 Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Configura las tablas necesarias:
   - `products` - Productos
   - `categories` - Categorías
   - `orders` - Órdenes
   - `users` - Usuarios (opcional)

3. Actualiza las credenciales en `src/lib/supabase.ts`

## 📧 Configuración de EmailJS

1. Crea una cuenta en [EmailJS](https://www.emailjs.com)
2. Configura un servicio de email
3. Crea templates para:
   - Formulario de contacto
   - Tickets de soporte
4. Actualiza las credenciales en `src/lib/emailjs.ts`

## 🎨 Personalización

### Colores y Temas
Modifica los estilos en `src/index.css` y `src/App.css`

### Datos de Productos
Actualiza `src/data/products.json` con tus productos

### Información de la Empresa
Modifica el estado inicial en `src/context/GlobalContext.tsx`

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

## 🌐 Despliegue

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

### GitHub Pages
```bash
npm run build
# Configura GitHub Actions para deploy automático
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico, contacta:
- Email: support@postore.com
- Teléfono: +1 (800) 123-4567

## 🙏 Agradecimientos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Bootstrap](https://getbootstrap.com/)
- [Supabase](https://supabase.com/)
- [EmailJS](https://www.emailjs.com/)
- [React Router](https://reactrouter.com/)
