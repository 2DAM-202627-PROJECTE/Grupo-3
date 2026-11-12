// =============================================================
// main.js — Punto de entrada de la página (issue #5)
// Crea la estructura semántica de la página dentro de <div id="app">:
//   <nav>     → barra de navegación
//   <main>    → contenido principal, con un <section> por componente
//   <footer>  → pie de página
//
// Partes del archivo:
//   1. Importaciones            → funciones render de cada componente
//   2. Lista de secciones       → el orden de la página
//   3. Estructura de la página  → <nav>, <main> con sus secciones y <footer>
//   4. Newsletter               → dentro del <footer>, arriba
//   5. Contenido del footer     → logo, redes y enlaces legales, debajo de la newsletter
//   6. Aviso de cookies         → fuera de #app, en el <body>
//   7. Al hacer scroll          → animación de las secciones y enlace activo del menú
//   8. Intro animada            → "Un día con Reservo", antes de la landing (solo la primera vez)
// =============================================================

// -------------------------------------------------------------
// 1. Importaciones
// -------------------------------------------------------------

// Los estilos (style.css con Tailwind) no se importan aquí: van con un <link> en
// index.html, igual que en las páginas legales. Si una página los importara desde
// JavaScript y otra con <link>, Firefox guardaría en caché la versión CSS y, al
// volver atrás a la landing, bloquearía este archivo y la página saldría en blanco.

// Funciones que pintan cada sección. Cada componente exporta un renderX(container)
// que recibe su <section> y le mete el HTML dentro.
// Solo se importan los componentes que ya tienen código: importar algo que un
// archivo vacío todavía no exporta daría error.
import { renderHero } from './components/Hero.js';
import { renderSectors } from './components/Sectors.js';
import { initActiveNavLink, renderNavbar } from './components/Navbar.js';
import { renderNavbar, initActiveNavLink } from './components/Navbar.js';
import { renderFeatures } from './components/Features.js';
import { renderHowItWorks } from './components/HowItWorks.js';
import { renderPricing } from './components/Pricing.js';
import { renderCta } from './components/Cta.js';
import { renderNewsletter } from './components/Newsletter.js';
import { renderFooter } from './components/Footer.js';
import { renderPreferencesBar } from './components/PreferencesBar.js';

// Animación de las secciones al hacer scroll (no es un componente, no pinta nada)
import { initScrollReveal } from './scrollReveal.js';

// Intro animada que va antes de la landing (tampoco es una sección de <main>)
import { initIntro } from './intro/Intro.js';

// -------------------------------------------------------------
// 2. Lista de secciones
// -------------------------------------------------------------

// Lista de secciones de la página, en el orden en que aparecen.
//   - id:     el id del <section>. Los enlaces del menú y los botones usan estos
//             ids para saltar a cada sección (por ejemplo href="#precios").
//   - render: la función que pinta la sección. null = componente aún sin hacer:
//             la sección se crea vacía y no se ve, pero su id ya existe.
// Cuando alguien termine un componente, solo tiene que importarlo arriba y
// cambiar su null por la función.
const sections = [
  { id: 'hero', render: renderHero },
  { id: 'sectores', render: renderSectors },
  { id: 'funciones', render: renderFeatures },
  { id: 'como-funciona', render: renderHowItWorks }, // HowItWorks.js
  { id: 'precios', render: renderPricing },
  { id: 'testimonios', render: null }, // Testimonials.js
  { id: 'faq', render: null }, // Faq.js
  { id: 'cta', render: renderCta },
];

// -------------------------------------------------------------
// 3. Estructura de la página
// -------------------------------------------------------------

// Contenedor raíz que hay en index.html. Todo lo que se pinta va dentro de él.
const app = document.querySelector('#app');

// Barra de navegación. aria-label le da un nombre para los lectores de pantalla
// ("Navegación principal"), útil si más adelante hay otro <nav> en la página.
// Su contenido lo pintará Navbar.js cuando esté hecho.
const nav = document.createElement('nav');
nav.id = 'navbar';
nav.setAttribute('aria-label', 'Navegación principal');
app.appendChild(nav);
renderNavbar(nav);

// Contenido principal de la página. Solo puede haber un <main>.
const main = document.createElement('main');
app.appendChild(main);

// Crea un <section> por cada elemento de la lista, lo mete en <main> y, si el
// componente ya está hecho, llama a su render para pintarlo.
// ({ id, render }) es desestructuración: saca las dos propiedades del objeto.
sections.forEach(({ id, render }) => {
  const section = document.createElement('section');
  section.id = id;
  main.appendChild(section);

  if (render) {
    render(section);
  }
});

// Pie de página.
const footer = document.createElement('footer');
footer.id = 'footer';
app.appendChild(footer);

// -------------------------------------------------------------
// 4. Newsletter
// -------------------------------------------------------------

// Newsletter (issue #24). Va primero dentro del pie de página.
const newsletter = document.createElement('div');
newsletter.id = 'footer-newsletter';
footer.appendChild(newsletter);
renderNewsletter(newsletter);

// -------------------------------------------------------------
// 5. Contenido del footer (issue #19)
// -------------------------------------------------------------

// Logo, copyright, redes sociales y enlaces legales.
// Va en su propio contenedor debajo de la newsletter.
const footerContent = document.createElement('div');
footerContent.id = 'footer-content';
footer.appendChild(footerContent);
renderFooter(footerContent);

// -------------------------------------------------------------
// 6. Aviso de cookies
// -------------------------------------------------------------

// Aviso de cookies (issue #24). Va directamente en el <body>, fuera de #app,
// porque no es parte del contenido: es una barra fija que flota encima de la página.
// Se llama "preferences-bar" y no "cookie-banner" para que no lo bloqueen los
// bloqueadores de anuncios (ver el comentario al principio de PreferencesBar.js)
const preferencesBar = document.createElement('div');
preferencesBar.id = 'preferences-bar';
document.body.appendChild(preferencesBar);
renderPreferencesBar(preferencesBar);

// -------------------------------------------------------------
// 7. Al hacer scroll
// -------------------------------------------------------------

// Animación de las secciones al entrar en pantalla. Va al final porque necesita que
// todas las secciones ya estén pintadas para buscar dentro de ellas qué animar (ver scrollReveal.js)
initScrollReveal();

// Enlace del menú marcado según la sección que se ve. También va al final
// porque necesita las secciones (ver Navbar.js, apartado 6)
initActiveNavLink();

// -------------------------------------------------------------
// 8. Intro animada
// -------------------------------------------------------------

// Se crea la última: se coloca antes de #app y necesita que la landing ya esté pintada
// para calcular bien dónde empieza y dónde acaba. Si ya se ha visto, no hace nada (ver Intro.js)
initIntro();
