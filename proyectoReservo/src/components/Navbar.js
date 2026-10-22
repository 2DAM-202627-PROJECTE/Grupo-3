export function renderNavbar(element) {
  const links = [
    { href: '#funciones', label: 'Funciones' },
    { href: '#como-funciona', label: 'Cómo funciona' },
    { href: '#precios', label: 'Precios' },
    { href: '#preguntas', label: 'FAQ' },
  ];

  const items = links
    .map(link => `<a href="${link.href}" class="hover:text-indigo-400 transition-colors">${link.label}</a>`)
    .join('');

  element.innerHTML = `
    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            R
          </div>
          <span class="font-bold text-lg tracking-tight text-white">Reservo</span>
        </a>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          ${items}
        </div>

        <div class="flex items-center gap-4">
          <a href="#" class="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">Iniciar sesión</a>
          <a href="#precios" class="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20">
            Prueba gratis
          </a>
          <button id="menu-btn" class="md:hidden text-slate-300 hover:text-white cursor-pointer" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden md:hidden border-t border-slate-800 px-4 py-4 flex-col gap-4 text-sm font-medium text-slate-300">
        ${items}
      </div>
    </nav>
  `;

  // Obre i tanca el menú en mòbil
  const button = element.querySelector('#menu-btn');
  const menu = element.querySelector('#mobile-menu');

  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('flex', open);
    button.setAttribute('aria-expanded', open);
  };

  button.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
}
