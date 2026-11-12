# Grupo-3

## Reservo · Landing page

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
Grupo-3/
├── .github/workflows/
│   └── deploy.yml                # Publica la web en GitHub Pages al subir a main
├── Docs/
│   ├── Documentació de planificació i disseny-2.pdf   # Documento de planificación y diseño
│   ├── kanban/                   # Capturas del tablero Kanban
│   └── mockups/                  # Wireframes y mockups (escritorio y móvil)
├── proyectoReservo/              # Proyecto de Vite (aquí se ejecutan los comandos npm)
│   ├── public/
│   │   └── favicon.svg           # Icono de la pestaña
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js         # Barra de navegación + menú móvil
│   │   │   ├── Hero.js           # Sección principal con tarjeta de reserva de ejemplo
│   │   │   ├── Sectors.js        # Selector de sector que cambia el Hero
│   │   │   ├── Features.js       # Cuadrícula de funcionalidades
│   │   │   ├── HowItWorks.js     # Cómo funciona en 3 pasos
│   │   │   ├── Pricing.js        # Planes y precios (mensual / anual)
│   │   │   ├── Testimonials.js   # Opiniones de clientes (pendiente)
│   │   │   ├── Faq.js            # Preguntas frecuentes (desplegables)
│   │   │   ├── Cta.js            # Formulario de prueba gratuita
│   │   │   ├── Footer.js         # Pie de página
│   │   │   ├── Newsletter.js     # Suscripción a la newsletter (dentro del footer)
│   │   │   └── PreferencesBar.js # Aviso de cookies de la primera visita
│   │   ├── intro/
│   │   │   ├── Intro.js          # Intro animada "Un día con Reservo" (solo la primera vez)
│   │   │   └── intro.css         # Estilos de la intro
│   │   ├── main.js               # Punto de entrada: crea las secciones y pinta los componentes
│   │   ├── scrollReveal.js       # Animación de las secciones al hacer scroll
│   │   └── style.css             # Tailwind v4, variables del tema claro y estilos comunes
│   ├── index.html                # Landing: HTML base con <div id="app">
│   ├── LICENSE                   # Licencia del proyecto
│   ├── politica-cookies.html     # Página legal: política de cookies
│   ├── package.json              # Dependencias y scripts
│   └── vite.config.js            # Vite + Tailwind, base /Grupo-3/ y build multipágina
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
8. **FAQ**: preguntas frecuentes, que se abren y cierran sin JavaScript.
9. **CTA**: formulario para dejar el email y empezar la prueba gratuita.
10. **Footer**: logo, copyright con el año actual y enlaces.


