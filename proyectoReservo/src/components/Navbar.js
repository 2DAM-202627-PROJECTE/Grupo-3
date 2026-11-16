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
//   5. Barra fija        → se queda arriba al bajar y le aparece fondo, borde y sombra
//   6. Enlace activo     → initActiveNavLink (lo llama main.js): marca la sección que se ve
//   7. Idioma            → abrir y cerrar el desplegable de idioma y cambiar de idioma (issue #23)
// =============================================================

// -------------------------------------------------------------
// 1. Datos y estilos
// -------------------------------------------------------------

import { getLanguage, LANGUAGES, setLanguage, t } from '../i18n.js';

// Enlaces a las secciones de la página (RF1). Si se añade o quita alguno, solo hay que tocar este array.
const links = [
  { label: 'nav.features', href: '#funciones' },
  { label: 'nav.howItWorks', href: '#como-funciona' },
  { label: 'nav.pricing', href: '#precios' },
  { label: 'nav.faq', href: '#faq' },
];

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

// -------------------------------------------------------------
// 2. Un enlace
// -------------------------------------------------------------

// Estilos del enlace de la sección que se está viendo (los activa el apartado 6 con aria-current):
//   - texto blanco
//   - en móvil, fondo gris como el del hover
//   - en escritorio, una raya índigo debajo (el pseudo-elemento after:) que crece desde el centro:
//     normalmente tiene scale-x-0 (ancho 0) y con el enlace activo pasa a scale-x-100
const activeLink =
  'aria-[current=location]:text-indigo-600 aria-[current=location]:bg-indigo-50 md:aria-[current=location]:bg-transparent ' +
  'md:relative md:after:absolute md:after:inset-x-0 md:after:-bottom-0.5 md:after:h-0.5 md:after:rounded-full md:after:bg-indigo-500 ' +
  'md:after:scale-x-0 md:after:transition-transform md:after:duration-300 md:aria-[current=location]:after:scale-x-100';

// Devuelve el HTML de un enlace del menú.
// En móvil ocupa toda la fila del desplegable (block + relleno) y en escritorio es un enlace de texto
function navLink({ label, href }) {
  return /*html*/ `
    <li>
      <a href="${href}" data-i18n="${label}" class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:px-0 md:py-1 md:hover:bg-transparent ${activeLink} ${focusRing}">${t(label)}</a>
    </li>
  `;
}

// -------------------------------------------------------------
// 2b. Selector de idioma (issue #23)
// -------------------------------------------------------------

// Un botón de idioma. lang="en": el lector de pantalla pronuncia "English" en inglés.
// aria-pressed marca el idioma actual (lo pone setupLanguageMenu) y los estilos lo usan
// con aria-pressed: (fondo lila y texto índigo). className: el tamaño de cada sitio.
// withCheck: la marca ✓ solo va en el desplegable; en móvil no cabe y el borde ya lo marca
function languageOption(code, className, withCheck = true) {
  return /*html*/ `
    <button type="button" lang="${code}" data-language-option="${code}" aria-pressed="false"
      class="group flex items-center gap-3 rounded-lg text-sm font-medium text-slate-700 transition hover:bg-slate-100 aria-pressed:bg-indigo-50 aria-pressed:font-semibold aria-pressed:text-indigo-700 ${className} ${focusRing}">
      ${LANGUAGES[code]}
      <!-- Marca ✓ del idioma actual: invisible si no está pulsado (group-aria-pressed:visible) -->
      ${withCheck ? /*html*/ `<svg class="invisible h-4 w-4 shrink-0 group-aria-pressed:visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>` : ''}
    </button>
  `;
}

// Escritorio: botón con el globo y el código del idioma ("ES") que abre un desplegable
// con los tres idiomas. Solo se ve a partir de md (hidden md:block): en móvil la barra no
// tiene sitio y los idiomas van dentro del menú ☰ (mobileLanguageOptions)
function languageMenu() {
  return /*html*/ `
    <div class="relative hidden md:block" data-language-menu>
      <!-- aria-expanded: si el desplegable está abierto; aria-controls: qué desplegable abre.
           aria-label lo rellena setupLanguageMenu: "Idioma: Español" -->
      <button id="language-button" type="button" aria-expanded="false" aria-controls="language-options"
        class="group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 aria-expanded:bg-slate-100 ${focusRing}">
        <!-- Globo: el icono que se suele usar para el idioma -->
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
        </svg>
        <span data-language-code>${getLanguage().toUpperCase()}</span>
        <!-- Flecha: gira al abrir (group-aria-expanded:rotate-180) -->
        <svg class="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Desplegable: debajo del botón y alineado a su derecha (right-0), oculto al empezar -->
      <div id="language-options" class="absolute right-0 top-full mt-2 hidden w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-indigo-500/10">
        ${Object.keys(LANGUAGES).map((code) => languageOption(code, 'w-full justify-between px-3 py-2 text-left')).join('')}
      </div>
    </div>
  `;
}

// Móvil: dentro del menú ☰, debajo de los enlaces, los tres idiomas en una fila.
// role="group" + aria-labelledby: el lector de pantalla los anuncia juntos como "Idioma"
function mobileLanguageOptions() {
  return /*html*/ `
    <li class="mt-2 border-t border-slate-200 px-3 pt-3 md:hidden">
      <p id="mobile-language-label" data-i18n="language.label" class="text-xs font-semibold uppercase tracking-wider text-slate-500">${t('language.label')}</p>
      <div class="mt-2 flex gap-2" role="group" aria-labelledby="mobile-language-label">
        ${Object.keys(LANGUAGES).map((code) => languageOption(code, 'flex-1 justify-center border border-slate-200 px-2 py-2.5 aria-pressed:border-indigo-300', false)).join('')}
      </div>
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
         relative + z-20: el menú desplegable de móvil queda por encima del Hero.
         Arriba del todo es transparente y sin borde; al bajar, el apartado 5 le pone
         fondo, borde y sombra (las clases de scrolledClasses).
         transition-[...]: el cambio entre los dos estados es suave (300ms) -->
    <div id="navbar-bar" class="relative z-20 border-b border-transparent backdrop-blur transition-[background-color,border-color,box-shadow] duration-300">
      <!-- Tres zonas en fila: logo (izquierda), enlaces (centro) y acciones (derecha).
           relative: el desplegable de móvil (absolute top-full) se coloca justo debajo de esta fila -->
      <div class="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        <!-- Logo: el icono "R" (el mismo que el favicon) y el nombre, como en el mockup.
             El icono es decorativo (alt=""): el texto "Reservo" ya dice qué es.
             La ruta empieza por import.meta.env.BASE_URL ("/" en local y "/Grupo-3/" en
             GitHub Pages): Vite no corrige las rutas que van dentro de textos de JavaScript -->
        <a href="#hero" class="flex shrink-0 items-center gap-2 rounded-lg text-lg font-bold text-slate-900 ${focusRing}" aria-label="${t('nav.homeLabel')}" data-i18n-aria-label="nav.homeLabel">
          <img src="${import.meta.env.BASE_URL}favicon.svg" alt="" class="h-8 w-8" />
          Reservo
        </a>

        <!-- Enlaces. En móvil es un desplegable oculto (hidden) debajo de la barra;
             en escritorio (md:) se ve siempre, en fila y centrado (md:flex-1 + md:justify-center) -->
        <div id="primary-navigation" class="absolute inset-x-0 top-full hidden border-b border-slate-200 bg-white px-4 py-4 shadow-xl md:static md:flex md:flex-1 md:justify-center md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <ul class="flex flex-col gap-1 md:flex-row md:items-center md:gap-5 lg:gap-8">
            ${links.map(navLink).join('')}
            <!-- "Iniciar sesión" dentro del desplegable, solo en móvil (en escritorio va a la derecha).
                 Es texto y no un enlace porque la web todavía no tiene página de login
                 (issue #28: sin enlaces rotos). text-slate-600: el mismo gris que los enlaces -->
            <li class="md:hidden">
              <span data-i18n="nav.login" class="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600">${t('nav.login')}</span>
            </li>
            <!-- Idiomas, solo en móvil (en escritorio es el desplegable de la derecha) -->
            ${mobileLanguageOptions()}
          </ul>
        </div>

        <!-- Acciones de la derecha: idioma e "Iniciar sesión" (solo escritorio), "Prueba gratis" y el botón del menú (solo móvil).
             "Prueba gratis" se ve también en móvil, junto al botón del menú, como en el mockup -->
        <div class="flex shrink-0 items-center gap-3">
          ${languageMenu()}
          <!-- "Iniciar sesión" en escritorio: también es texto, como en el desplegable de móvil -->
          <span data-i18n="nav.login" class="hidden rounded-lg text-sm font-medium text-slate-600 md:inline">${t('nav.login')}</span>
          <!-- Botón pequeño (px-4 py-2 text-sm), como en el mockup -->
          <a href="#cta" data-i18n="nav.tryForFree" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 ${focusRing}">${t('nav.tryForFree')}</a>

          <!-- Botón del menú (☰), solo en móvil (md:hidden).
               aria-expanded dice si el menú está abierto y aria-controls qué menú abre.
               aria-label es fijo ("Menú de navegación"): el estado ya lo dice aria-expanded,
               así el lector de pantalla dice "Menú de navegación, contraído" o "…, expandido"
               p-2.5 + icono de 24 px: zona de pulsación de 44 px, el mínimo para el dedo -->
          <button
            id="mobile-menu-toggle"
            type="button"
            class="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 transition hover:bg-slate-100 md:hidden ${focusRing}"
            aria-expanded="false"
            aria-controls="primary-navigation"
            aria-label="${t('nav.menuLabel')}"
            data-i18n-aria-label="nav.menuLabel"
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

  // Selector de idioma (apartado 7)
  setupLanguageMenu(container);

  // -----------------------------------------------------------
  // 5. Barra fija que cambia al hacer scroll
  // -----------------------------------------------------------

  // La barra se queda pegada arriba al bajar por la página.
  // sticky + top-0 va en el <nav> (el que crea main.js) y no en la barra de dentro,
  // porque sticky solo funciona dentro de su padre: el <nav> mide lo mismo que la barra,
  // pero su padre (#app) es toda la página. z-30: por encima de las secciones
  container.classList.add('sticky', 'top-0', 'z-30');

  const bar = container.querySelector('#navbar-bar');

  // Clases que se ponen al bajar: fondo blanco translúcido (cristal), borde de abajo y sombra suave
  const scrolledClasses = ['bg-white/70', 'border-slate-200/70', 'shadow-lg', 'shadow-indigo-500/5'];

  // Se comprueba si la página está arriba del todo (scrollY es lo que se ha bajado, en px).
  // classList.toggle(clase, condición) pone la clase si la condición es true y la quita si es false
  const updateBar = () => {
    const isScrolled = window.scrollY > 8;
    scrolledClasses.forEach((cls) => bar.classList.toggle(cls, isScrolled));
  };

  // passive: true le dice al navegador que este código no va a bloquear el scroll,
  // así el scroll sigue siendo fluido
  window.addEventListener('scroll', updateBar, { passive: true });

  // Una vez al cargar: si se recarga la página a mitad de scroll, la barra ya sale con fondo
  updateBar();
}

// -------------------------------------------------------------
// 6. Enlace activo según la sección
// -------------------------------------------------------------

// Marca en el menú el enlace de la sección que se está viendo.
// Se exporta aparte (no va dentro de renderNavbar) porque necesita que las secciones
// ya existan, y main.js pinta la barra antes que ellas: main.js la llama al final.
export function initActiveNavLink() {
  const navbar = document.querySelector('#navbar');

  // Las secciones que hay que vigilar: las de los enlaces del menú y el Hero
  // (el Hero no tiene enlace: cuando se ve, no se marca ninguno)
  const ids = ['hero', ...links.map((link) => link.href.slice(1))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

  // Marca el enlace de la sección id y desmarca el resto.
  // aria-current="location" es el atributo pensado para esto: el lector de pantalla dice
  // "ubicación actual" en ese enlace. Además los estilos lo usan (aria-[current=location]: en navLink)
  const setActive = (id) => {
    navbar.querySelectorAll('#primary-navigation a').forEach((link) => {
      if (link.getAttribute('href') === `#${id}`) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  // rootMargin '-50% 0px -50% 0px' encoge la zona vigilada hasta una línea en el centro
  // de la pantalla: la sección activa es la que está cruzando esa línea
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

// -------------------------------------------------------------
// 7. Selector de idioma (issue #23)
// -------------------------------------------------------------

// Abre y cierra el desplegable de idioma (escritorio) y cambia el idioma al pulsar
// cualquier botón de idioma (los del desplegable y los del menú de móvil)
function setupLanguageMenu(container) {
  const menu = container.querySelector('[data-language-menu]');
  const button = container.querySelector('#language-button');
  const panel = container.querySelector('#language-options');
  const options = container.querySelectorAll('[data-language-option]');

  // --- Abrir o cerrar el desplegable (igual que el menú móvil del apartado 4) ---
  const setOpen = (isOpen) => {
    button.setAttribute('aria-expanded', String(isOpen));
    panel.classList.toggle('hidden', !isOpen);
  };
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  // --- Pone el botón y las opciones como el idioma actual ---
  //   - el código del botón ("ES") y su aria-label ("Idioma: Español")
  //   - aria-pressed="true" solo en los botones del idioma actual (los estilos marcan ese)
  const update = () => {
    const language = getLanguage();
    button.querySelector('[data-language-code]').textContent = language.toUpperCase();
    button.setAttribute('aria-label', `${t('language.label')}: ${LANGUAGES[language]}`);
    options.forEach((option) => {
      option.setAttribute('aria-pressed', String(option.dataset.languageOption === language));
    });
  };

  // --- Clic en el botón del globo: abre o cierra ---
  button.addEventListener('click', () => setOpen(!isOpen()));

  // --- Clic en un idioma: se cambia toda la página (i18n.js) y se actualiza el selector.
  //     Si era el desplegable, se cierra y el foco vuelve al botón del globo ---
  options.forEach((option) => {
    option.addEventListener('click', () => {
      setLanguage(option.dataset.languageOption);
      update();
      if (panel.contains(option)) {
        setOpen(false);
        button.focus();
      }
    });
  });

  // --- Escape: cierra el desplegable y devuelve el foco al botón ---
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  // --- Clic fuera, o el foco sale con Tab: se cierra ---
  // relatedTarget es el elemento que recibe el foco; si no está dentro del selector, se cierra
  document.addEventListener('click', (event) => {
    if (isOpen() && !menu.contains(event.target)) setOpen(false);
  });
  menu.addEventListener('focusout', (event) => {
    if (isOpen() && !menu.contains(event.relatedTarget)) setOpen(false);
  });

  // Al empezar, el selector ya muestra el idioma con el que se ha cargado la página
  update();
}
