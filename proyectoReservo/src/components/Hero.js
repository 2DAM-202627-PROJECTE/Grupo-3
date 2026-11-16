// =============================================================
// Hero.js — Primera sección de la página (issue #8)
// Izquierda: título, subtítulo y botones.
// Derecha: tarjeta de reserva de ejemplo para FitZone Gym (issue #9, Arnau).
//
// Partes del archivo:
//   1. HTML de la sección          → renderHero (lo llama main.js)
//      Dentro del HTML: columna de texto (título, subtítulo, botones)
//      y columna de la tarjeta de reserva (días, clases y botón de confirmar)
//   2. Interactividad de la tarjeta → elegir día, elegir clase y confirmar
// =============================================================

import { t } from '../i18n.js';

const sectorDemos = {
  gimnasio: {
    name: 'FitZone Gym',
    titleStart: 'hero.gym.title',
    titleHighlight: 'hero.gym.highlight',
    description: 'hero.gym.description',
    heading: 'hero.availableClasses', items: [
      ['hero.spinning', '09:00 · 45 min', 'hero.sixSpots', 'emerald', true],
      ['hero.yoga', '12:30 · 60 min', 'hero.twoSpots', 'amber', true],
      ['hero.crossfit', '18:00 · 50 min', 'hero.full', 'rose', false],
    ],
  },
  restaurante: {
    name: 'La Mesa',
    titleStart: 'hero.restaurant.title',
    titleHighlight: 'hero.restaurant.highlight',
    description: 'hero.restaurant.description',
    heading: 'hero.availableTables', items: [
      ['hero.indoorTable', '13:00 · 2 personas', 'hero.fourTables', 'emerald', true],
      ['hero.terrace', '14:00 · 2 personas', 'hero.oneTable', 'amber', true],
      ['hero.privateRoom', '21:00 · 8 personas', 'hero.full', 'rose', false],
    ],
  },
  peluqueria: {
    name: 'Studio Belleza',
    titleStart: 'hero.salon.title',
    titleHighlight: 'hero.salon.highlight',
    description: 'hero.salon.description',
    heading: 'hero.availableServices', items: [
      ['hero.haircut', '10:00 · 30 min', 'hero.sixSpots', 'emerald', true],
      ['hero.hairColor', '12:30 · 90 min', 'hero.twoSpots', 'amber', true],
      ['hero.hairStyling', '18:00 · 45 min', 'hero.full', 'rose', false],
    ],
  },
  clinica: {
    name: 'Clínica Salud',
    titleStart: 'hero.clinic.title',
    titleHighlight: 'hero.clinic.highlight',
    description: 'hero.clinic.description',
    heading: 'hero.availableAppointments', items: [
      ['hero.physiotherapy', '09:00 · 45 min', 'hero.sixSpots', 'emerald', true],
      ['hero.nutrition', '12:30 · 60 min', 'hero.twoSpots', 'amber', true],
      ['hero.checkup', '18:00 · 30 min', 'hero.full', 'rose', false],
    ],
  },
};

let heroContainer;

function renderSectorDemo(sectorId) {
  if (!heroContainer) return;
  const demo = sectorDemos[sectorId] ?? sectorDemos.gimnasio;
  const bookingCard = heroContainer.querySelector('#hero-booking-card');
  bookingCard.dataset.i18nAriaLabel = 'hero.bookingLabel';
  bookingCard.dataset.i18nBusiness = demo.name;
  bookingCard.setAttribute('aria-label', t('hero.bookingLabel', { business: demo.name }));
  const titleStart = heroContainer.querySelector('#hero-title-start');
  titleStart.dataset.i18n = demo.titleStart;
  titleStart.textContent = t(demo.titleStart);
  const titleHighlight = heroContainer.querySelector('#hero-title-highlight');
  titleHighlight.dataset.i18n = demo.titleHighlight;
  titleHighlight.textContent = t(demo.titleHighlight);
  const description = heroContainer.querySelector('#hero-description');
  description.dataset.i18n = demo.description;
  description.textContent = t(demo.description);
  heroContainer.querySelector('#hero-business-name').textContent = demo.name;
  const heading = heroContainer.querySelector('#hero-options-heading');
  heading.dataset.i18n = demo.heading;
  heading.textContent = t(demo.heading);
  const list = heroContainer.querySelector('#hero-classes');
  const firstAvailableIndex = demo.items.findIndex((item) => item[4]);
  list.innerHTML = demo.items.map(([nameKey, time, availabilityKey, color, available], index) => {
    const active = available && index === firstAvailableIndex;
    const badgeColors = {
      emerald: 'bg-emerald-50 text-emerald-700',
      amber: 'bg-amber-50 text-amber-700',
      rose: 'bg-rose-50 text-rose-700',
    };
    return /*html*/ `
      <li>
        <button type="button" class="hero-class flex w-full items-center justify-between rounded-lg border ${active ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white/70'} px-3 py-2.5 text-left transition hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${available ? '' : 'opacity-60'}" aria-pressed="${active}" data-class="${nameKey}" ${available ? '' : 'disabled'}>
          <span><span data-i18n="${nameKey}" class="class-name block text-sm font-medium text-slate-800">${t(nameKey)}</span><span class="block text-xs text-slate-600">${time}</span></span>
          <span data-i18n="${availabilityKey}" class="rounded-full ${badgeColors[color]} px-2.5 py-1 text-xs font-semibold">${t(availabilityKey)}</span>
        </button>
      </li>
    `;
  }).join('');
  const confirmButton = heroContainer.querySelector('#hero-confirm-booking');
  confirmButton.disabled = firstAvailableIndex === -1;
  confirmButton.classList.toggle('cursor-not-allowed', confirmButton.disabled);
  confirmButton.classList.toggle('opacity-50', confirmButton.disabled);
  heroContainer.querySelector('#hero-booking-status').classList.add('hidden');
}

export function selectHeroSector(sectorId) {
  if (sectorDemos[sectorId]) renderSectorDemo(sectorId);
}

// -------------------------------------------------------------
// 1. HTML de la sección
// -------------------------------------------------------------

// Pinta el Hero dentro del contenedor que le pasa main.js
// (el <section id="hero">).
export function renderHero(container) {
  heroContainer = container;
  // relative + overflow-hidden: por si luego se añaden fondos o
  // decoraciones posicionadas, que no se salgan de la sección
  container.className = 'relative overflow-hidden';

  container.innerHTML = /*html*/ `
    <!-- Contenedor centrado. Es un grid: 1 columna en móvil y 2 en escritorio (lg:grid-cols-2) -->
    <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">

      <!-- Columna izquierda: texto y botones.
           En móvil y tablet va centrada, como en el mockup móvil (mx-auto + text-center).
           En escritorio (lg:) vuelve a la izquierda, junto a la tarjeta de reserva -->
      <div id="hero-text" class="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">

        <!-- Título principal (el único h1 de la página). El tamaño crece con la pantalla: 4xl → 5xl → 6xl.
             Es lo primero de la columna, así que no lleva margen arriba -->
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          <span id="hero-title-start" data-i18n="hero.gym.title">${t('hero.gym.title')}</span>
          <!-- Texto con degradado: el fondo es el degradado, se recorta a la forma
               de las letras (bg-clip-text) y el texto se hace transparente para que se vea -->
          <span id="hero-title-highlight" data-i18n="hero.gym.highlight" class="bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">${t('hero.gym.highlight')}</span>
        </h1>

        <!-- Subtítulo -->
        <p id="hero-description" data-i18n="hero.gym.description" class="mt-6 text-lg leading-relaxed text-slate-600">
          ${t('hero.gym.description')}
        </p>

        <!-- Botones: apilados en móvil (flex-col) y en fila a partir de sm (sm:flex-row).
             Son enlaces <a> porque llevan a otras secciones de la página -->
        <!-- sm:justify-center: cuando van en fila (tablet), los botones quedan centrados como el texto;
             lg:justify-start: en escritorio vuelven a la izquierda -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <!-- Botón principal: va al formulario de prueba gratuita.
               focus-visible:ring muestra un anillo al navegar con el teclado (accesibilidad) -->
          <a href="#cta" class="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <span data-i18n="hero.startTrial">${t('hero.startTrial')}</span>
          </a>
          <!-- Botón secundario: va a la sección "Cómo funciona" -->
          <a href="#como-funciona" class="rounded-lg border border-slate-200 bg-white/70 px-6 py-3 text-center font-semibold text-slate-800 backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <span data-i18n="hero.seeHowItWorks">${t('hero.seeHowItWorks')}</span>
          </a>
        </div>

        <!-- Texto pequeño bajo los botones. slate-600 y no slate-400 para mantener
             un contraste mínimo de 4.5:1 con el fondo (apartado 3.2) -->
        <p data-i18n="hero.noCard" class="mt-4 text-sm text-slate-600">Sin tarjeta de crédito · Cancela cuando quieras</p>

        <!-- Enlace para volver a ver la intro animada (src/intro/Intro.js), que solo sale sola
             la primera vez. Carga la página con ?intro, que hace que la intro salga siempre.
             La ruta empieza por BASE_URL ("/" en local y "/Grupo-3/" en GitHub Pages) -->
        <a href="${import.meta.env.BASE_URL}?intro" class="mt-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-indigo-600 transition hover:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          <!-- Icono de "play" (decorativo: el texto ya dice lo que hace) -->
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
          </svg>
          <span data-i18n="intro.watchAgain">${t('intro.watchAgain')}</span>
        </a>
      </div>

      <!-- Columna derecha: ejemplo de reserva para FitZone Gym -->
      <div id="hero-card" class="mx-auto w-full max-w-md">
        <article id="hero-booking-card" class="glass rounded-2xl p-5 sm:p-6" aria-label="${t('hero.bookingLabel', { business: 'FitZone Gym' })}" data-i18n-aria-label="hero.bookingLabel" data-i18n-business="FitZone Gym">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p data-i18n="hero.onlineBooking" class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">${t('hero.onlineBooking')}</p>
              <h2 id="hero-business-name" class="mt-1 text-xl font-bold text-slate-900">FitZone Gym</h2>
            </div>
            <span data-i18n="hero.open" class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">${t('hero.open')}</span>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <h3 data-i18n="hero.chooseDay" class="text-sm font-semibold text-slate-800">${t('hero.chooseDay')}</h3>
            <span data-i18n="hero.june2026" class="text-xs text-slate-600">${t('hero.june2026')}</span>
          </div>
          <div class="mt-3 grid grid-cols-5 gap-2" role="group" aria-label="${t('hero.chooseBookingDay')}" data-i18n-aria-label="hero.chooseBookingDay">
            <button type="button" class="hero-day rounded-xl border border-slate-200 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-pressed="false" data-day="Lun 22" data-day-key="hero.monday22">
              <span data-i18n="hero.monday" class="block text-xs text-slate-600">${t('hero.monday')}</span><span class="mt-1 block font-semibold text-slate-800">22</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-slate-200 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-pressed="false" data-day="Mar 23" data-day-key="hero.tuesday23">
              <span data-i18n="hero.tuesday" class="block text-xs text-slate-600">${t('hero.tuesday')}</span><span class="mt-1 block font-semibold text-slate-800">23</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-indigo-400 bg-indigo-600 px-2 py-3 text-center shadow-lg shadow-indigo-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-pressed="true" data-day="Mié 24" data-day-key="hero.wednesday24">
              <span data-i18n="hero.wednesday" class="block text-xs text-indigo-100">${t('hero.wednesday')}</span><span class="mt-1 block font-semibold text-white">24</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-slate-200 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-pressed="false" data-day="Jue 25" data-day-key="hero.thursday25">
              <span data-i18n="hero.thursday" class="block text-xs text-slate-600">${t('hero.thursday')}</span><span class="mt-1 block font-semibold text-slate-800">25</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-slate-200 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-pressed="false" data-day="Vie 26" data-day-key="hero.friday26">
              <span data-i18n="hero.friday" class="block text-xs text-slate-600">${t('hero.friday')}</span><span class="mt-1 block font-semibold text-slate-800">26</span>
            </button>
          </div>

          <div class="mt-6 border-t border-slate-200/80 pt-5">
            <div class="flex items-center justify-between">
              <h3 id="hero-options-heading" data-i18n="hero.availableClasses" class="text-sm font-semibold text-slate-800">${t('hero.availableClasses')}</h3>
              <span id="hero-selected-day" data-i18n="hero.wednesday24" class="text-xs text-slate-600">${t('hero.wednesday24')}</span>
            </div>
            <ul id="hero-classes" class="mt-3 space-y-2" aria-label="${t('hero.options')}" data-i18n-aria-label="hero.options"></ul>
          </div>
          <button id="hero-confirm-booking" data-i18n="hero.confirmBooking" type="button" class="mt-5 block w-full rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">${t('hero.confirmBooking')}</button>
          <p id="hero-booking-status" class="mt-3 hidden text-center text-sm text-emerald-700" role="status" aria-live="polite"></p>
        </article>
      </div>
    </div>
  `;

  // -----------------------------------------------------------
  // 2. Interactividad de la tarjeta
  // -----------------------------------------------------------

  // --- Elementos de la tarjeta que se van a usar ---
  // Las clases desactivadas (CrossFit, "Completo") no se pueden elegir: :not(:disabled) las deja fuera
  const dayButtons = container.querySelectorAll('.hero-day');
  renderSectorDemo('gimnasio');
  const selectedDay = container.querySelector('#hero-selected-day');
  const confirmButton = container.querySelector('#hero-confirm-booking');
  const bookingStatus = container.querySelector('#hero-booking-status');

  container.querySelector('#hero-classes').addEventListener('click', (event) => {
    const button = event.target.closest('.hero-class:not(:disabled)');
    if (!button) return;
    container.querySelectorAll('.hero-class:not(:disabled)').forEach((classButton) => {
      const isActive = classButton === button;
      classButton.setAttribute('aria-pressed', String(isActive));
      classButton.classList.toggle('border-indigo-400', isActive);
      classButton.classList.toggle('bg-indigo-50', isActive);
      classButton.classList.toggle('border-slate-200', !isActive);
      classButton.classList.toggle('bg-white/70', !isActive);
    });
    bookingStatus.classList.add('hidden');
  });

  // --- Elegir un día ---
  // Igual que las clases: se resalta el día pulsado (fondo índigo) y se apagan los demás.
  // Cada botón tiene dos <span>: el primero es el nombre del día ("Mié") y el segundo el número ("24")
  dayButtons.forEach((button) => {
    button.addEventListener('click', () => {
      dayButtons.forEach((dayButton) => {
        const isActive = dayButton === button;
        dayButton.setAttribute('aria-pressed', String(isActive));
        dayButton.classList.toggle('border-indigo-400', isActive);
        dayButton.classList.toggle('bg-indigo-600', isActive);
        dayButton.classList.toggle('shadow-lg', isActive);
        dayButton.classList.toggle('shadow-indigo-500/30', isActive);
        dayButton.classList.toggle('border-slate-200', !isActive);
        dayButton.querySelector('span').classList.toggle('text-indigo-100', isActive);
        dayButton.querySelector('span').classList.toggle('text-slate-600', !isActive);
        dayButton.querySelectorAll('span')[1].classList.toggle('text-white', isActive);
        dayButton.querySelectorAll('span')[1].classList.toggle('text-slate-800', !isActive);
      });
      // El día elegido se muestra junto a "Clases disponibles" (data-day="Mié 24" → "Mié 24")
      selectedDay.dataset.i18n = button.dataset.dayKey;
      selectedDay.textContent = t(button.dataset.dayKey);
      bookingStatus.classList.add('hidden');
    });
  });

  // --- Confirmar la reserva ---
  // Es una simulación: no se envía nada, solo se muestra un mensaje con la clase y el día elegidos.
  // El mensaje tiene aria-live, así el lector de pantalla lo lee cuando aparece
  confirmButton.addEventListener('click', () => {
    const selectedClass = container.querySelector('.hero-class[aria-pressed="true"]');
    bookingStatus.dataset.i18n = 'hero.confirmation';
    bookingStatus.dataset.i18nNameKey = selectedClass.dataset.class;
    bookingStatus.dataset.i18nDayKey = selectedDay.dataset.i18n;
    bookingStatus.textContent = t('hero.confirmation', {
      name: t(selectedClass.dataset.class),
      day: t(selectedDay.dataset.i18n),
    });
    bookingStatus.classList.remove('hidden');
  });
}
