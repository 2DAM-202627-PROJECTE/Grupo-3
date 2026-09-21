# Grupo-3

# Reservo · Landing page

Landing page de un SaaS ficticio de **reservas online** para negocios con citas: gimnasios, restaurantes, peluquerías y clínicas.

Proyecto hecho con **Vite**, **JavaScript vanilla** y **Tailwind CSS v4**, organizado en componentes.

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| [Vite](https://vite.dev/) | 8 | Servidor de desarrollo y build |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilos con clases de utilidad (vía `@tailwindcss/vite`) |
| JavaScript | ES Modules | Componentes e interactividad, sin frameworks |

## Instalación y uso

Necesitas tener instalado [Node.js](https://nodejs.org/).

```bash
npm install      # instala las dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # genera la versión de producción en dist/
npm run preview  # previsualiza la versión de producción
```

## Estructura del proyecto

```
landing-page-prova/
├── public/
│   └── vite.svg              # Favicon
├── src/
│   ├── components/
│   │   ├── Navbar.js         # Barra de navegación + menú móvil
│   │   ├── Hero.js           # Sección principal con tarjeta de reserva de ejemplo
│   │   ├── Sectors.js        # Tipos de negocio (gimnasio, restaurante...)
│   │   ├── Features.js       # Cuadrícula de funcionalidades
│   │   ├── HowItWorks.js     # Cómo funciona en 3 pasos
│   │   ├── Pricing.js        # Planes y precios
│   │   ├── Testimonials.js   # Opiniones de clientes
│   │   ├── Faq.js            # Preguntas frecuentes (desplegables)
│   │   ├── Cta.js            # Formulario de registro
│   │   └── Footer.js         # Pie de página
│   ├── main.js               # Punto de entrada: crea los contenedores y renderiza los componentes
│   └── style.css             # Importación de Tailwind v4
├── index.html                # Estructura HTML base con <div id="app">
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite con el plugin de Tailwind
└── README.md
```

## Secciones de la página

1. **Navbar**: logo, enlaces a las secciones y botones "Iniciar sesión" y "Prueba gratis". En móvil se convierte en un menú desplegable.
2. **Hero**: titular principal, botones de acción y una tarjeta que simula la app reservando una clase de gimnasio.
3. **Sectors**: los cuatro tipos de negocio a los que se dirige el producto.
4. **Features**: seis funcionalidades (reservas 24/7, recordatorios, pagos, equipo, estadísticas, app móvil).
5. **How it works**: los tres pasos para empezar.
6. **Pricing**: tres planes (Básico 19€, Pro 49€ destacado, Empresa a medida).
7. **Testimonials**: tres opiniones de clientes.
8. **FAQ**: preguntas frecuentes con `<details>`, que se abren y cierran sin JavaScript.
9. **CTA**: formulario para dejar el email y empezar la prueba gratuita.
10. **Footer**: logo, copyright con el año actual y enlaces.


