// =============================================================
// Navbar.js — Navegación principal adaptable a móvil y escritorio.
// =============================================================

// Enlaces a las secciones de la página (RF1). Si se añade o quita alguno, solo hay que tocar este array.
const links = [
  { label: 'Funciones', href: '#funciones' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Precios', href: '#precios' },
  { label: 'FAQ', href: '#faq' },
];

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400';

// Devuelve el HTML de un enlace del menú.
// En móvil ocupa toda la fila del desplegable (block + relleno) y en escritorio es un enlace de texto
function navLink({ label, href }) {
  return /*html*/ `
    <li>
      <a href="${href}" class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white md:px-0 md:py-1 md:hover:bg-transparent ${focusRing}">${label}</a>
    </li>
  `;
}

export function renderNavbar(container) {
  container.innerHTML = /*html*/ `
    <!-- Barra con borde inferior y fondo del color de la página, como en el mockup.
         relative + z-20: el menú desplegable de móvil queda por encima del Hero -->
    <div class="relative z-20 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <!-- Tres zonas en fila: logo (izquierda), enlaces (centro) y acciones (derecha).
           relative: el desplegable de móvil (absolute top-full) se coloca justo debajo de esta fila -->
      <div class="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        <!-- Logo: el icono "R" (el mismo que el favicon) y el nombre, como en el mockup.
             El icono es decorativo (alt=""): el texto "Reservo" ya dice qué es -->
        <a href="#hero" class="flex shrink-0 items-center gap-2 rounded-lg text-lg font-bold text-white ${focusRing}" aria-label="Reservo, ir al inicio">
          <img src="/favicon.svg" alt="" class="h-8 w-8" />
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
               p-2.5 + icono de 24 px: zona de pulsación de 44 px, el mínimo para el dedo -->
          <button
            id="mobile-menu-toggle"
            type="button"
            class="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-200 transition hover:bg-slate-800 md:hidden ${focusRing}"
            aria-expanded="false"
            aria-controls="primary-navigation"
            aria-label="Abrir menú de navegación"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const toggle = container.querySelector('#mobile-menu-toggle');
  const navigation = container.querySelector('#primary-navigation');
  const menuLinks = navigation.querySelectorAll('a');

  const setMenuOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    navigation.classList.toggle('hidden', !isOpen);
  };

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  container.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}
