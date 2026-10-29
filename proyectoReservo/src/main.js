// =============================================================
// main.js — Punto de entrada de la página (issue #5)
// Crea la estructura semántica de la página dentro de <div id="app">:
//   <nav>     → barra de navegación
//   <main>    → contenido principal (aquí irán las secciones)
//   <footer>  → pie de página
// =============================================================

// Estilos globales (Tailwind + style.css). Vite los mete en la página al importarlos.
import './style.css';

// Contenedor raíz que hay en index.html. Todo lo que se pinta va dentro de él.
const app = document.querySelector('#app');

// Barra de navegación. aria-label le da un nombre para los lectores de pantalla
// ("Navegación principal"), útil si más adelante hay otro <nav> en la página.
// Su contenido lo pintará Navbar.js cuando esté hecho.
const nav = document.createElement('nav');
nav.id = 'navbar';
nav.setAttribute('aria-label', 'Navegación principal');
app.appendChild(nav);

// Contenido principal de la página. Solo puede haber un <main>.
const main = document.createElement('main');
app.appendChild(main);

// Pie de página. Su contenido lo pintará Footer.js cuando esté hecho.
const footer = document.createElement('footer');
footer.id = 'footer';
app.appendChild(footer);
