// =============================================================
// Navbar.js — Navegación principal adaptable a móvil y escritorio (issue #7, Arnau).
// En escritorio: logo, enlaces en el centro y botones a la derecha.
// En móvil: logo, "Prueba gratis" y un botón (☰) que abre los enlaces en un desplegable.
//
// Partes del archivo:
//   1. Datos y estilos   → los enlaces del menú y las clases del foco
//   2. Un enlace         → navLink
//   3. HTML de la barra  → renderNavbar (lo llama main.js)
//   4. Menú móvil        → abrir y cerrar el desplegable: ☰, enlaces, Escape y clic fuera
// =============================================================

// -------------------------------------------------------------
// 1. Datos y estilos
// -------------------------------------------------------------

// Enlaces a las secciones de la página (RF1). Si se añade o quita alguno, solo hay que tocar este array.
const links = [
  { label: 'Funciones', href: '#funciones' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Precios', href: '#precios' },
  { label: 'FAQ', href: '#faq' },
];

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400';

// -------------------------------------------------------------
// 2. Un enlace
// -------------------------------------------------------------

// Devuelve el HTML de un enlace del menú.
// En móvil ocupa toda la fila del desplegable (block + relleno) y en escritorio es un enlace de texto
function navLink({ label, href }) {
  return /*html*/ `
    <li>
      <a href="${href}" class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white md:px-0 md:py-1 md:hover:bg-transparent ${focusRing}">${label}</a>
    </li>
  `;
}

// -------------------------------------------------------------
// 3. HTML de la barra
// -------------------------------------------------------------

// Pinta la barra dentro del <nav id="navbar"> que le pasa main.js
export function renderNavbar(container) {
  container.innerHTML = /*html*/ `
    <!-- Barra con borde inferior y fondo del color de la página, como en el mockup.
         relative + z-20: el menú desplegable de móvil queda por encima del Hero -->
    <div class="relative z-20 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <!-- Tres zonas en fila: logo (izquierda), enlaces (centro) y acciones (derecha).
           relative: el desplegable de móvil (absolute top-full) se coloca justo debajo de esta fila -->
      <div class="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        <!-- Logo: el icono "R" (el mismo que el favicon) y el nombre, como en el mockup.
             El icono es decorativo (alt=""): el texto "Reservo" ya dice qué es.
             La ruta empieza por import.meta.env.BASE_URL ("/" en local y "/Grupo-3/" en
             GitHub Pages): Vite no corrige las rutas que van dentro de textos de JavaScript -->
        <a href="#hero" class="flex shrink-0 items-center gap-2 rounded-lg text-lg font-bold text-white ${focusRing}" aria-label="Reservo, ir al inicio">
          <img src="${import.meta.env.BASE_URL}favicon.svg" alt="" class="h-8 w-8" />
          Reservo
        </a>

        <!-- Enlaces. En móvil es un desplegable oculto (hidden) debajo de la barra;
             en escritorio (md:) se ve siempre, en fila y centrado (md:flex-1 + md:justify-center) -->
        <div id="primary-navigation" class="absolute inset-x-0 top-full hidden border-b border-slate-800 bg-slate-900 px-4 py-4 shadow-xl md:static md:flex md:flex-1 md:justify-center md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <ul class="flex flex-col gap-1 md:flex-row md:items-center md:gap-5 lg:gap-8">
            ${links.map(navLink).join('')}
            <!-- "Iniciar sesión" dentro del desplegable, solo en móvil (en escritorio va a la derecha) -->
            <li class="md:hidden">
              <a href="#login" class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white ${focusRing}">Iniciar sesión</a>
            </li>
          </ul>
        </div>

        <!-- Acciones de la derecha: "Iniciar sesión" (solo escritorio), "Prueba gratis" y el botón del menú (solo móvil).
             "Prueba gratis" se ve también en móvil, junto al botón del menú, como en el mockup -->
        <div class="flex shrink-0 items-center gap-3">
          <a href="#login" class="hidden rounded-lg text-sm font-medium text-slate-300 transition hover:text-white md:inline ${focusRing}">Iniciar sesión</a>
          <!-- Botón pequeño (px-4 py-2 text-sm), como en el mockup -->
          <a href="#cta" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 ${focusRing}">Prueba gratis</a>

          <!-- Botón del menú (☰), solo en móvil (md:hidden).
               aria-expanded dice si el menú está abierto y aria-controls qué menú abre.
               aria-label es fijo ("Menú de navegación"): el estado ya lo dice aria-expanded,
               así el lector de pantalla dice "Menú de navegación, contraído" o "…, expandido"
               p-2.5 + icono de 24 px: zona de pulsación de 44 px, el mínimo para el dedo -->
          <button
            id="mobile-menu-toggle"
            type="button"
            class="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-200 transition hover:bg-slate-800 md:hidden ${focusRing}"
            aria-expanded="false"
            aria-controls="primary-navigation"
            aria-label="Menú de navegación"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // -----------------------------------------------------------
  // 4. Menú móvil
  // -----------------------------------------------------------

  // --- Elementos: el botón ☰, el desplegable y todos los enlaces de la barra ---
  // Los enlaces se buscan en toda la barra (container) y no solo en el desplegable:
  // el logo y "Prueba gratis" están fuera de él, y al pulsarlos el menú también se tiene que cerrar
  const toggle = container.querySelector('#mobile-menu-toggle');
  const navigation = container.querySelector('#primary-navigation');
  const menuLinks = container.querySelectorAll('a');

  // --- Abrir o cerrar el menú ---
  // isOpen = true abre y false cierra. Cambia dos cosas a la vez:
  //   - aria-expanded: el lector de pantalla dice "expandido" o "contraído"
  //   - la clase hidden del desplegable (en escritorio no afecta: md:flex lo muestra siempre)
  const setMenuOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    navigation.classList.toggle('hidden', !isOpen);
  };

  // --- Clic en el botón ☰: si está cerrado lo abre, y al revés ---
  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // --- Al pulsar cualquier enlace de la barra, el menú se cierra (la página baja a la sección) ---
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // --- Tecla Escape: cierra el menú y devuelve el foco al botón ☰ ---
  // Así quien navega con teclado no se queda "perdido" dentro de un menú que ya no se ve
  container.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  // --- Clic fuera de la barra: cierra el menú ---
  // El evento se escucha en todo el documento. container.contains(event.target) dice si el clic
  // ha sido dentro de la barra (en el ☰, en un enlace…); si ha sido fuera (en el Hero, por ejemplo)
  // y el menú está abierto, se cierra. No se mueve el foco: el usuario ha elegido dónde pulsar
  document.addEventListener('click', (event) => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen && !container.contains(event.target)) {
      setMenuOpen(false);
    }
  });
}
