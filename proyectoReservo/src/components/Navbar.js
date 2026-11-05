// =============================================================
// Navbar.js — Navegación principal adaptable a móvil y escritorio.
// =============================================================

export function renderNavbar(container) {
  container.innerHTML = /*html*/ `
    <div class="relative z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#hero" class="text-xl font-extrabold tracking-tight text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-label="Reservo, ir al inicio">
          Reservo<span class="text-indigo-400">.</span>
        </a>

        <button
          id="mobile-menu-toggle"
          type="button"
          class="inline-flex items-center justify-center rounded-lg border border-slate-700 p-2 text-slate-200 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:hidden"
          aria-expanded="false"
          aria-controls="primary-navigation"
          aria-label="Abrir menú de navegación"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
          </svg>
        </button>

        <div id="primary-navigation" class="absolute left-0 right-0 top-full hidden border-b border-slate-800 bg-slate-950 px-4 py-4 shadow-xl md:static md:block md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <ul class="flex flex-col gap-1 md:flex-row md:items-center md:gap-7">
            <li><a class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:px-0 md:py-1 md:hover:bg-transparent" href="#funciones">Funciones</a></li>
            <li><a class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:px-0 md:py-1 md:hover:bg-transparent" href="#como-funciona">Cómo funciona</a></li>
            <li><a class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:px-0 md:py-1 md:hover:bg-transparent" href="#precios">Precios</a></li>
            <li><a class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:px-0 md:py-1 md:hover:bg-transparent" href="#faq">FAQ</a></li>
            <li class="pt-2 md:ml-1 md:pt-0"><a href="#login" class="btn-secondary block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">Iniciar sesión</a></li>
            <li class="pt-2 md:pt-0"><a href="#cta" class="btn-primary block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">Prueba gratis</a></li>
          </ul>
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
