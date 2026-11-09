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

const sectorDemos = {
  gimnasio: {
    name: 'FitZone Gym',
    titleStart: 'Llena tus clases',
    titleHighlight: 'sin complicarte',
    description: 'Gestiona clases, entrenamientos y reservas desde un solo lugar. Tus clientes reservan online y tú te centras en el gimnasio.',
    heading: 'Clases disponibles', items: [
      ['Spinning', '09:00 · 45 min', '6 plazas', 'emerald', true],
      ['Yoga', '12:30 · 60 min', '2 plazas', 'amber', true],
      ['CrossFit', '18:00 · 50 min', 'Completo', 'rose', false],
    ],
  },
  restaurante: {
    name: 'La Mesa',
    titleStart: 'Cada mesa reservada',
    titleHighlight: 'sin llamadas',
    description: 'Organiza las reservas y los turnos de tu restaurante. Tus clientes eligen mesa y horario online, a cualquier hora.',
    heading: 'Mesas disponibles', items: [
      ['Mesa interior', '13:00 · 2 personas', '4 mesas', 'emerald', true],
      ['Terraza', '14:00 · 2 personas', '1 mesa', 'amber', true],
      ['Sala privada', '21:00 · 8 personas', 'Completo', 'rose', false],
    ],
  },
  peluqueria: {
    name: 'Studio Belleza',
    titleStart: 'Tu agenda de servicios',
    titleHighlight: 'siempre organizada',
    description: 'Gestiona citas de corte, color y peinado en una agenda clara. Tus clientes reservan cuando mejor les viene.',
    heading: 'Servicios disponibles', items: [
      ['Corte', '10:00 · 30 min', '6 plazas', 'emerald', true],
      ['Color', '12:30 · 90 min', '2 plazas', 'amber', true],
      ['Peinado', '18:00 · 45 min', 'Completo', 'rose', false],
    ],
  },
  clinica: {
    name: 'Clínica Salud',
    titleStart: 'Más tiempo para tus pacientes',
    titleHighlight: 'menos llamadas',
    description: 'Organiza consultas y citas por especialista. Tus pacientes reservan online y reciben recordatorios automáticos.',
    heading: 'Citas disponibles', items: [
      ['Fisioterapia', '09:00 · 45 min', '6 plazas', 'emerald', true],
      ['Nutrición', '12:30 · 60 min', '2 plazas', 'amber', true],
      ['Revisión general', '18:00 · 30 min', 'Completo', 'rose', false],
    ],
  },
};

let heroContainer;

function renderSectorDemo(sectorId) {
  if (!heroContainer) return;
  const demo = sectorDemos[sectorId] ?? sectorDemos.gimnasio;
  heroContainer.querySelector('#hero-booking-card').setAttribute('aria-label', `Ejemplo de reserva en ${demo.name}`);
  heroContainer.querySelector('#hero-title-start').textContent = demo.titleStart;
  heroContainer.querySelector('#hero-title-highlight').textContent = demo.titleHighlight;
  heroContainer.querySelector('#hero-description').textContent = demo.description;
  heroContainer.querySelector('#hero-business-name').textContent = demo.name;
  heroContainer.querySelector('#hero-options-heading').textContent = demo.heading;
  const list = heroContainer.querySelector('#hero-classes');
  const firstAvailableIndex = demo.items.findIndex((item) => item[4]);
  list.innerHTML = demo.items.map(([name, time, availability, color, available], index) => {
    const active = available && index === firstAvailableIndex;
    const badgeColors = {
      emerald: 'bg-emerald-400/10 text-emerald-300',
      amber: 'bg-amber-400/10 text-amber-300',
      rose: 'bg-rose-400/10 text-rose-300',
    };
    return /*html*/ `
      <li>
        <button type="button" class="hero-class flex w-full items-center justify-between rounded-lg border ${active ? 'border-indigo-400 bg-slate-800' : 'border-transparent bg-slate-800/70'} px-3 py-2.5 text-left transition hover:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${available ? '' : 'opacity-60'}" aria-pressed="${active}" data-class="${name}" ${available ? '' : 'disabled'}>
          <span><span class="block text-sm font-medium text-slate-200">${name}</span><span class="block text-xs text-slate-400">${time}</span></span>
          <span class="rounded-full ${badgeColors[color]} px-2.5 py-1 text-xs font-semibold">${availability}</span>
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

        <!-- Badge: etiqueta en forma de píldora con un puntito delante -->
        <span class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
          <!-- aria-hidden: el punto es decorativo, los lectores de pantalla lo ignoran -->
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden="true"></span>
          Nuevo · Recordatorios por WhatsApp
        </span>

        <!-- Título principal (el único h1 de la página). El tamaño crece con la pantalla: 4xl → 5xl → 6xl -->
        <h1 class="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span id="hero-title-start">Llena tus clases</span>
          <!-- Texto con degradado: el fondo es el degradado, se recorta a la forma
               de las letras (bg-clip-text) y el texto se hace transparente para que se vea -->
          <span id="hero-title-highlight" class="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">sin complicarte</span>
        </h1>

        <!-- Subtítulo -->
        <p id="hero-description" class="mt-6 text-lg leading-relaxed text-slate-400">
          Gestiona clases, entrenamientos y reservas desde un solo lugar. Tus clientes reservan online y tú te centras en el gimnasio.
        </p>

        <!-- Botones: apilados en móvil (flex-col) y en fila a partir de sm (sm:flex-row).
             Son enlaces <a> porque llevan a otras secciones de la página -->
        <!-- sm:justify-center: cuando van en fila (tablet), los botones quedan centrados como el texto;
             lg:justify-start: en escritorio vuelven a la izquierda -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <!-- Botón principal: va al formulario de prueba gratuita.
               focus-visible:ring muestra un anillo al navegar con el teclado (accesibilidad) -->
          <a href="#cta" class="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            Empieza gratis 14 días
          </a>
          <!-- Botón secundario: va a la sección "Cómo funciona" -->
          <a href="#como-funciona" class="rounded-lg border border-slate-700 bg-slate-800/60 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            Ver cómo funciona
          </a>
        </div>

        <!-- Texto pequeño bajo los botones. slate-400 y no slate-500 para mantener
             un contraste mínimo de 4.5:1 con el fondo (apartado 3.2) -->
        <p class="mt-4 text-sm text-slate-400">Sin tarjeta de crédito · Cancela cuando quieras</p>

        <!-- Enlace para volver a ver la intro animada (src/intro/Intro.js), que solo sale sola
             la primera vez. Carga la página con ?intro, que hace que la intro salga siempre.
             La ruta empieza por BASE_URL ("/" en local y "/Grupo-3/" en GitHub Pages) -->
        <a href="${import.meta.env.BASE_URL}?intro" class="mt-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-indigo-300 transition hover:text-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
          <!-- Icono de "play" (decorativo: el texto ya dice lo que hace) -->
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
          </svg>
          Ver la intro otra vez
        </a>
      </div>

      <!-- Columna derecha: ejemplo de reserva para FitZone Gym -->
      <div id="hero-card" class="mx-auto w-full max-w-md">
        <article id="hero-booking-card" class="rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl shadow-indigo-950/40 sm:p-6" aria-label="Ejemplo de reserva en FitZone Gym">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Reserva online</p>
              <h2 id="hero-business-name" class="mt-1 text-xl font-bold text-white">FitZone Gym</h2>
            </div>
            <span class="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">Abierto</span>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-200">Elige un día</h3>
            <span class="text-xs text-slate-400">Junio 2026</span>
          </div>
          <div class="mt-3 grid grid-cols-5 gap-2" role="group" aria-label="Selecciona un día de reserva">
            <button type="button" class="hero-day rounded-xl border border-slate-700 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-pressed="false" data-day="Lun 22">
              <span class="block text-xs text-slate-400">Lun</span><span class="mt-1 block font-semibold text-slate-200">22</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-slate-700 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-pressed="false" data-day="Mar 23">
              <span class="block text-xs text-slate-400">Mar</span><span class="mt-1 block font-semibold text-slate-200">23</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-indigo-400 bg-indigo-600 px-2 py-3 text-center shadow-lg shadow-indigo-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300" aria-pressed="true" data-day="Mié 24">
              <span class="block text-xs text-indigo-100">Mié</span><span class="mt-1 block font-semibold text-white">24</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-slate-700 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-pressed="false" data-day="Jue 25">
              <span class="block text-xs text-slate-400">Jue</span><span class="mt-1 block font-semibold text-slate-200">25</span>
            </button>
            <button type="button" class="hero-day rounded-xl border border-slate-700 px-2 py-3 text-center transition hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-pressed="false" data-day="Vie 26">
              <span class="block text-xs text-slate-400">Vie</span><span class="mt-1 block font-semibold text-slate-200">26</span>
            </button>
          </div>

          <div class="mt-6 border-t border-slate-800 pt-5">
            <div class="flex items-center justify-between">
              <h3 id="hero-options-heading" class="text-sm font-semibold text-slate-200">Clases disponibles</h3>
              <span id="hero-selected-day" class="text-xs text-slate-400">Mié 24</span>
            </div>
            <ul id="hero-classes" class="mt-3 space-y-2" aria-label="Opciones y disponibilidad"></ul>
          </div>
          <button id="hero-confirm-booking" type="button" class="mt-5 block w-full rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">Confirmar reserva</button>
          <p id="hero-booking-status" class="mt-3 hidden text-center text-sm text-emerald-300" role="status" aria-live="polite"></p>
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
      classButton.classList.toggle('bg-slate-800', isActive);
      classButton.classList.toggle('border-transparent', !isActive);
      classButton.classList.toggle('bg-slate-800/70', !isActive);
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
        dayButton.classList.toggle('shadow-indigo-950/40', isActive);
        dayButton.classList.toggle('border-slate-700', !isActive);
        dayButton.querySelector('span').classList.toggle('text-indigo-100', isActive);
        dayButton.querySelector('span').classList.toggle('text-slate-400', !isActive);
        dayButton.querySelectorAll('span')[1].classList.toggle('text-white', isActive);
        dayButton.querySelectorAll('span')[1].classList.toggle('text-slate-200', !isActive);
      });
      // El día elegido se muestra junto a "Clases disponibles" (data-day="Mié 24" → "Mié 24")
      selectedDay.textContent = button.dataset.day;
      bookingStatus.classList.add('hidden');
    });
  });

  // --- Confirmar la reserva ---
  // Es una simulación: no se envía nada, solo se muestra un mensaje con la clase y el día elegidos.
  // El mensaje tiene aria-live, así el lector de pantalla lo lee cuando aparece
  confirmButton.addEventListener('click', () => {
    const selectedClass = container.querySelector('.hero-class[aria-pressed="true"]');
    bookingStatus.textContent = `Reserva de prueba confirmada: ${selectedClass.dataset.class} · ${selectedDay.textContent}`;
    bookingStatus.classList.remove('hidden');
  });
}
