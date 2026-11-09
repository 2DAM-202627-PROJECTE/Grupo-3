// =============================================================
// Intro.js — Intro animada "Un día con Reservo"
// Va antes de la landing y avanza con el scroll (hacia delante y hacia atrás).
// Solo se ve la primera vez: después se entra directamente en la landing.
//
// Escenas:
//   1. La tarjeta de reserva se convierte en una agenda cerrada
//   2. La agenda se abre: el "antes" (agenda de papel caótica)
//   3. Se pasa la página: el "después" (agenda digital de Reservo)
//   4. Llueven las reservas desde los móviles de los clientes
//   5. Los recordatorios salen solos hacia los móviles
//   6. La agenda cambia de sector: gimnasio, peluquería, restaurante, clínica
//   7. Final: la agenda se aleja, aparece el logo y empieza la landing
//
// Librerías:
//   - GSAP: hace las animaciones. Una "timeline" es una lista de animaciones
//     colocadas en el tiempo, como en un editor de vídeo.
//   - ScrollTrigger (plugin de GSAP): une la timeline al scroll. Bajar = avanzar el vídeo.
//   - Lenis: scroll suave, con inercia.
//
// Partes del archivo:
//   1. ¿Se enseña la intro?  → primera visita, sin animaciones reducidas, sin #enlace
//   2. Datos                 → días, horas, sectores y reservas
//   3. HTML                  → la escena con el libro, los móviles y los textos
//   4. Pintar la semana      → cabeceras, horas, líneas y reservas
//   5. Estado inicial        → cómo está todo antes de empezar a bajar
//   6. La película           → la timeline, escena a escena
//   7. Principio "vivo"      → entrada al cargar, tarjeta que se usa sola e inclinación con el ratón
//   8. Scroll                → Lenis y ScrollTrigger
//   9. Función principal     → initIntro(), que se llama desde main.js
// =============================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// -------------------------------------------------------------
// 1. ¿Se enseña la intro?
// -------------------------------------------------------------

// Nombre de la marca que se guarda en localStorage cuando ya se ha visto la intro.
// No es una cookie de seguimiento: solo recuerda una preferencia de esta web
const SEEN_KEY = 'reservo-intro-vista';

// localStorage puede fallar (por ejemplo, en algunos modos privados), por eso va con try/catch
function hasSeenIntro() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Si no se puede guardar, la próxima vez se verá otra vez la intro: no pasa nada
  }
}

// La intro se enseña si:
//   - la URL lleva ?intro (para probarla otra vez aunque ya se haya visto), o
//   - es la primera visita, no se ha entrado con un enlace a una sección (#precios…)
//     y la persona no ha pedido reducir las animaciones
function shouldShowIntro() {
  if (new URLSearchParams(location.search).has('intro')) return true;
  if (hasSeenIntro()) return false;
  if (location.hash) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}

// -------------------------------------------------------------
// 2. Datos
// -------------------------------------------------------------

const DAYS = ['Lun 22', 'Mar 23', 'Mié 24', 'Jue 25', 'Vie 26'];
const HOURS = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

// Cada sector: nombre en plural (para el texto), nombre del negocio,
// los 5 servicios que se reservan y un color para cada uno
const SECTORS = [
  {
    plural: 'gimnasios',
    business: 'FitZone Gym',
    items: ['Spinning', 'Yoga', 'CrossFit', 'Pilates', 'Boxeo'],
    colors: ['#4f46e5', '#0891b2', '#059669', '#d97706', '#db2777'],
  },
  {
    plural: 'peluquerías',
    business: 'Estudio Lúa',
    items: ['Corte', 'Color', 'Peinado', 'Barba', 'Mechas'],
    colors: ['#c026d3', '#db2777', '#9333ea', '#e11d48', '#7c3aed'],
  },
  {
    plural: 'restaurantes',
    business: 'La Terraza',
    items: ['Mesa 2', 'Mesa 4', 'Terraza', 'Mesa 6', 'Barra'],
    colors: ['#ea580c', '#d97706', '#ca8a04', '#dc2626', '#b45309'],
  },
  {
    plural: 'clínicas',
    business: 'Clínica Sonrisa',
    items: ['Revisión', 'Limpieza', 'Ortodoncia', 'Empaste', 'Consulta'],
    colors: ['#0d9488', '#0891b2', '#0284c7', '#059669', '#2563eb'],
  },
];

// Cada reserva: día (0-4), hora (0-5), cliente, servicio (0-4, de la lista del sector)
// y móvil del que sale (0-3)
const BOOKINGS = [
  { day: 2, hour: 0, name: 'Laura', item: 0, phone: 0 },
  { day: 0, hour: 1, name: 'Marc', item: 1, phone: 1 },
  { day: 3, hour: 3, name: 'Sara', item: 2, phone: 2 },
  { day: 1, hour: 0, name: 'Pablo', item: 3, phone: 3 },
  { day: 4, hour: 2, name: 'Laura', item: 1, phone: 0 },
  { day: 2, hour: 4, name: 'Marc', item: 4, phone: 1 },
  { day: 0, hour: 3, name: 'Sara', item: 0, phone: 2 },
  { day: 3, hour: 1, name: 'Pablo', item: 2, phone: 3 },
  { day: 1, hour: 5, name: 'Laura', item: 3, phone: 0 },
  { day: 4, hour: 4, name: 'Marc', item: 0, phone: 1 },
  { day: 2, hour: 2, name: 'Sara', item: 1, phone: 2 },
  { day: 0, hour: 5, name: 'Pablo', item: 4, phone: 3 },
];

// Reservas de las que sale un recordatorio en la escena 5 (una por móvil)
const REMINDERS = [0, 3, 6, 9];

// Palabras del título de entrada (la última parte, "tu negocio?", va aparte con degradado)
const TITLE_WORDS = ['¿Cómo', 'es', 'un', 'día', 'en'];

// -------------------------------------------------------------
// 3. HTML
// -------------------------------------------------------------

// Toda la escena. Lo que es decoración lleva aria-hidden; los textos importantes son texto real
const introHTML = /*html*/ `
  <div class="stage">

    <!-- Fondo "aurora": manchas de color difuminadas que se mueven despacio (ver intro.css).
         Al final de la intro se apagan y queda el fondo de la landing -->
    <div class="aurora" aria-hidden="true">
      <span class="aurora-blob blob-1"></span>
      <span class="aurora-blob blob-2"></span>
      <span class="aurora-blob blob-3"></span>
      <span class="aurora-blob blob-4"></span>
    </div>

    <!-- Logo arriba a la izquierda, en el mismo sitio donde luego estará el de la navbar.
         Así la marca se ve desde el primer momento -->
    <div class="intro-brand">
      <img src="${import.meta.env.BASE_URL}favicon.svg" alt="" class="h-8 w-8" />
      <span>Reservo</span>
    </div>

    <!-- ESCENA 1: texto de entrada. No es un h1: el h1 de la página es el del Hero.
         Cada palabra va en su propio <span class="word"> para que aparezcan una a una al cargar -->
    <div class="intro">
      <p class="intro-title text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        ${TITLE_WORDS.map((word) => `<span class="word">${word}</span>`).join(' ')}
        <span class="word gradient-word bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">tu negocio?</span>
      </p>
      <p class="intro-subtitle mt-6 text-lg leading-relaxed text-slate-300">
        Baja despacio y mira cómo cambia con Reservo.
      </p>
    </div>

    <!-- Indicador de scroll: un ratón con la ruedecita moviéndose (se entiende sin leer) -->
    <div class="scroll-hint" aria-hidden="true">
      <div class="scroll-hint-inner">
        <span class="mouse"><span class="wheel"></span></span>
        <span class="hint-text">Desliza</span>
      </div>
    </div>

    <!-- Frases de cada escena (encima de la agenda) -->
    <div class="captions">
      <p class="caption">Así es hoy la agenda de muchos negocios…</p>
      <p class="caption">Con Reservo, todo en <span class="gradient-text">orden</span></p>
      <p class="caption">Tus clientes reservan solos, <span class="gradient-text">24/7</span></p>
      <p class="caption">Y les recordamos la cita <span class="gradient-text">por ti</span></p>
      <p class="caption">Perfecto para <span class="gradient-text" data-sector-name>gimnasios</span></p>
    </div>

    <!-- Móviles de los clientes (escenas 4 y 5) -->
    <div class="phones" aria-hidden="true">
      <div class="phone" data-phone="0"><span>Laura</span></div>
      <div class="phone" data-phone="1"><span>Marc</span></div>
      <div class="phone" data-phone="2"><span>Sara</span></div>
      <div class="phone" data-phone="3"><span>Pablo</span></div>
    </div>

    <!-- Burbujas de recordatorio (escena 5). Las rellena el apartado 4 -->
    <div class="bubbles" aria-hidden="true"></div>

    <!-- ESCENA 7: logo y nombre antes de pasar a la landing -->
    <div class="outro">
      <img src="${import.meta.env.BASE_URL}favicon.svg" alt="" class="h-20 w-20" />
      <p class="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Reservo</p>
      <p class="mt-3 text-lg text-slate-400">Las reservas de tu negocio, en piloto automático</p>
    </div>

    <!-- Escena 3D: perspective da profundidad a los giros -->
    <div class="scene">

      <!-- ESCENA 1: tarjeta de reserva, como la del Hero. Se convierte en la tapa.
           Dos capas:
             - .hero-card: solo se mueve con el scroll (viaja al centro y se convierte en la tapa)
             - .card-inner: es la tarjeta que se ve; entra al cargar y se inclina siguiendo el ratón
           Separadas para que las animaciones no se pisen entre ellas -->
      <div class="hero-card" aria-hidden="true">
        <div class="card-inner">
          <p class="text-xs font-semibold tracking-widest text-indigo-300">RESERVA ONLINE</p>
          <p class="mt-1 text-lg font-bold text-white">FitZone Gym</p>
          <div class="mt-5 grid grid-cols-5 gap-2 text-center text-xs">
            <span class="day">Lun<b>22</b></span>
            <span class="day">Mar<b>23</b></span>
            <span class="day is-active">Mié<b>24</b></span>
            <span class="day">Jue<b>25</b></span>
            <span class="day">Vie<b>26</b></span>
          </div>
          <div class="mt-5 space-y-2 text-sm">
            <div class="slot">Spinning <small>09:00</small></div>
            <div class="slot">Yoga <small>12:30</small></div>
            <div class="slot">CrossFit <small>18:00</small></div>
          </div>
          <div class="card-button mt-5">Confirmar reserva</div>

          <!-- Cursor de mentira que usa la tarjeta solo (la tarjeta "viva") -->
          <svg class="fake-cursor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 3l14 8-6 1.5L10 19z" fill="white" stroke="#0f172a" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <!-- El libro: dos páginas de ancho. Empieza cerrado (solo se ve la tapa) -->
      <div class="book">

        <!-- Página derecha de abajo del todo: la agenda digital (escena 3) -->
        <div class="page page-right digital">
          <div class="digital-head">
            <span class="d-week">Semana 24 · Junio</span>
            <span class="live"><i></i> En directo</span>
          </div>
          <div class="week"></div>
        </div>

        <!-- Hoja que se pasa (escena 3). Delante: papel caótico. Detrás: resumen digital -->
        <div class="leaf leaf-page">
          <div class="face front paper">
            <p class="paper-date">Miércoles 24</p>
            <ul class="paper-list">
              <li><s>9:00 Laura — corte</s> → ¿10:00?</li>
              <li>10:30 ¿Marc o Marta? 📞</li>
              <li><s>11:00 Sara</s> <em>no vino</em></li>
              <li>12:00 ??? llamar</li>
              <li>12:00 Pablo (¡doble!)</li>
              <li class="faint">17:00 …</li>
            </ul>
            <div class="missed">
              <svg class="phone-ring" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              </svg>
              3 llamadas perdidas
            </div>
            <div class="stain" aria-hidden="true"></div>
          </div>
          <div class="face back digital digital-left">
            <p class="d-kicker">RESERVO</p>
            <p class="d-title" data-business>FitZone Gym</p>
            <div class="stat">
              <span>Reservas esta semana</span>
              <b data-counter="bookings">0</b>
            </div>
            <div class="stat">
              <span>Citas sin aparecer</span>
              <b><span data-counter="noshows">12</span><small class="badge">−70 %</small></b>
            </div>
            <div class="stat">
              <span>Recordatorios enviados</span>
              <b data-counter="reminders">0</b>
            </div>
          </div>
        </div>

        <!-- Tapa (escena 2). Delante: la portada. Detrás: el interior de la tapa, con notas -->
        <div class="leaf leaf-cover">
          <div class="face front cover">
            <img src="${import.meta.env.BASE_URL}favicon.svg" alt="" class="h-16 w-16" />
            <p class="mt-4 text-2xl font-bold text-white">Agenda</p>
            <p class="text-sm text-indigo-200/70">2026</p>
          </div>
          <div class="face back paper">
            <p class="paper-date">Notas</p>
            <div class="postit">¡¡Llamar a TODOS para confirmar mañana!!</div>
            <ul class="paper-list">
              <li>Lunes: 4 citas sin aparecer</li>
              <li><s>Contestar WhatsApps</s></li>
              <li>Hoja de turnos → ¿dónde está?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// -------------------------------------------------------------
// 4. Pintar la semana
// -------------------------------------------------------------

// Pinta los días, las horas, las líneas y una tarjetita por reserva.
// Devuelve las reservas (chips) en el mismo orden que BOOKINGS
function buildWeek(week) {
  // Esquina vacía (encima de la columna de las horas) y cabeceras de los días
  week.insertAdjacentHTML(
    'beforeend',
    `<span></span>` + DAYS.map((day) => `<span class="day-head">${day}</span>`).join(''),
  );

  // cells[día][hora] guarda cada hueco para luego meter las reservas
  const cells = DAYS.map(() => []);

  HOURS.forEach((hour, h) => {
    // La fila empieza en la 2 (la 1 son las cabeceras)
    const row = h + 2;
    week.insertAdjacentHTML('beforeend', `<span class="hour" style="grid-row:${row}">${hour}</span>`);
    week.insertAdjacentHTML('beforeend', `<span class="hline" style="grid-row:${row}"></span>`);

    DAYS.forEach((_, d) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.gridRow = row;
      cell.style.gridColumn = d + 2;
      week.appendChild(cell);
      cells[d][h] = cell;
    });
  });

  return BOOKINGS.map(({ day, hour }) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    cells[day][hour].appendChild(chip);
    return chip;
  });
}

// Cambia la agenda al sector número index: nombre del negocio, texto de la frase,
// y el servicio y el color de cada reserva
function applySector(index, { chips, business, sectorName }) {
  const sector = SECTORS[index];
  business.textContent = sector.business;
  sectorName.textContent = sector.plural;

  chips.forEach((chip, i) => {
    const { name, item } = BOOKINGS[i];
    chip.style.background = sector.colors[item];
    chip.innerHTML = `${name}<small>${sector.items[item]}</small>`;
  });
}

// -------------------------------------------------------------
// 5 y 6. Estado inicial y la película
// -------------------------------------------------------------

// Crea la timeline con todas las escenas. Recibe la sección de la intro
function buildTimeline(section) {
  const $ = (selector) => section.querySelector(selector);
  const $$ = (selector) => gsap.utils.toArray(section.querySelectorAll(selector));

  const stage = $('.stage');
  const card = $('.hero-card');
  const book = $('.book');
  const captions = $$('.caption');
  const phones = $$('.phone');
  const chips = buildWeek($('.week'));
  const business = $('[data-business]');
  const sectorName = $('[data-sector-name]');
  const counters = {
    bookings: $('[data-counter="bookings"]'),
    noshows: $('[data-counter="noshows"]'),
    reminders: $('[data-counter="reminders"]'),
  };

  // Al empezar, la agenda es de gimnasio
  applySector(0, { chips, business, sectorName });

  // Burbujas de recordatorio: una por cada reserva de REMINDERS.
  // Son dos capas: .bubble solo se mueve (de la reserva al móvil) y .bubble-body,
  // la de dentro, es la que se ve y solo aparece y desaparece.
  // Si las dos cosas se animaran en el mismo elemento, al volver a subir rápido
  // GSAP podría dejar la burbuja visible donde no toca
  const bubbles = REMINDERS.map((i) => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `<div class="bubble-body">🔔 Recordatorio · ${DAYS[BOOKINGS[i].day]} ${HOURS[BOOKINGS[i].hour]}</div>`;
    $('.bubbles').appendChild(bubble);
    return bubble;
  });

  // --- 5. Estado inicial ---

  // En escritorio la tarjeta empieza a la derecha (como en el Hero); en móvil, debajo del texto
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  if (isDesktop) {
    gsap.set(card, { xPercent: -50, yPercent: -50, x: '24vw', y: 0 });
  } else {
    // En móvil se calcula dónde cabe: justo debajo del texto (24px de separación)
    // y por encima del indicador de scroll (deja 90px abajo).
    // Si la pantalla es baja y no cabe entera, se encoge lo justo
    const textBottom = $('.intro').getBoundingClientRect().bottom + 24;
    const space = window.innerHeight - 90 - textBottom;
    const scale = Math.min(1, space / card.offsetHeight);
    const height = card.offsetHeight * scale;

    // y es la distancia desde el centro de la escena hasta donde tiene que quedar el centro de la tarjeta
    const scene = $('.scene').getBoundingClientRect();
    const y = textBottom + height / 2 - (scene.top + scene.height / 2);

    gsap.set(card, { xPercent: -50, yPercent: -50, x: 0, y, scale });
  }

  // El libro empieza invisible y desplazado media página a la izquierda (-25% de su ancho):
  // así la tapa, que está en la mitad derecha, queda justo en el centro
  gsap.set(book, { autoAlpha: 0, xPercent: -25 });
  gsap.set(captions, { autoAlpha: 0, y: 20 });
  gsap.set(phones, { autoAlpha: 0, scale: 0.6 });
  gsap.set($$('.week .hline'), { scaleX: 0 });
  gsap.set($$('.week .day-head, .week .hour'), { autoAlpha: 0 });
  gsap.set(chips, { autoAlpha: 0 });
  gsap.set($('.badge'), { autoAlpha: 0 });
  gsap.set(bubbles, { xPercent: -50, yPercent: -50 });
  gsap.set($$('.bubble-body'), { autoAlpha: 0 });

  // Escala para que la tarjeta acabe del tamaño de la tapa (ancho de página / ancho de tarjeta)
  const coverScale = () => book.offsetWidth / 2 / card.offsetWidth;

  // Centro de un elemento, en píxeles desde la esquina del escenario
  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top };
  };

  // ¿Se ven los móviles? En pantallas estrechas están ocultos (ver intro.css)
  const phonesVisible = () => phones[0].getBoundingClientRect().width > 0;

  // Distancia desde el centro de un móvil hasta el centro de una reserva (para que salga "de" él).
  // Si los móviles están ocultos, la reserva cae desde arriba
  const fromPhone = (chip, phone, axis) => {
    if (!phonesVisible()) return axis === 'x' ? 0 : -window.innerHeight * 0.4;
    const c = centerOf(chip);
    const p = centerOf(phone);
    return axis === 'x' ? p.x - c.x : p.y - c.y;
  };

  // Un contador que sube o baja con la timeline (funciona igual hacia delante y hacia atrás)
  const countTo = (el, from, to, duration, at) => {
    const value = { n: from };
    tl.fromTo(
      value,
      { n: from },
      { n: to, duration, ease: 'none', onUpdate: () => (el.textContent = Math.round(value.n)) },
      at,
    );
  };

  // --- 6. La película ---
  // Los números del final de cada línea son el momento de la timeline (en "segundos" de la película;
  // luego ScrollTrigger los estira a lo largo del scroll)
  const tl = gsap.timeline();

  // ESCENA 1: el texto se va y la tarjeta viaja al centro y se convierte en la tapa
  tl.to($('.scroll-hint'), { autoAlpha: 0, duration: 0.3 }, 0)
    .to($('.intro'), { autoAlpha: 0, x: -80, filter: 'blur(8px)', duration: 1, ease: 'power1.in' }, 0)
    .to(card, { x: 0, y: 0, rotationY: -25, rotationX: 10, scale: coverScale, duration: 1.1, ease: 'power2.inOut' }, 0)
    .to(card, { rotationY: 0, rotationX: 0, duration: 0.4, ease: 'power1.out' }, 1.1)
    // Fundido cruzado: la tarjeta desaparece mientras aparece el libro en el mismo sitio
    .to(card, { autoAlpha: 0, duration: 0.3 }, 1.35)
    .to(book, { autoAlpha: 1, duration: 0.3 }, 1.35)

    // ESCENA 2: la agenda se abre (la tapa gira sobre el lomo mientras el libro se centra)
    .to(book, { xPercent: 0, duration: 1.4, ease: 'power2.inOut' }, 1.9)
    .to($('.leaf-cover'), { rotationY: -180, duration: 1.4, ease: 'power2.inOut' }, 1.9)
    .to(captions[0], { autoAlpha: 1, y: 0, duration: 0.4 }, 2.9)
    .to(captions[0], { autoAlpha: 0, y: -20, duration: 0.4 }, 4.3)

    // ESCENA 3: se pasa la página y la semana se dibuja
    .to($('.leaf-page'), { rotationY: -180, duration: 1.4, ease: 'power2.inOut' }, 4.5)
    .to(captions[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 5.6)
    .to($$('.week .day-head'), { autoAlpha: 1, stagger: 0.06, duration: 0.3 }, 5.9)
    .to($$('.week .hline'), { scaleX: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out' }, 5.9)
    .to($$('.week .hour'), { autoAlpha: 1, stagger: 0.06, duration: 0.3 }, 6.0)
    .to(captions[1], { autoAlpha: 0, y: -20, duration: 0.4 }, 7.0)

    // ESCENA 4: aparecen los móviles y llueven las reservas
    .to(captions[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 7.3)
    .to(phones, { autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.6)' }, 7.2);

  const CHIPS_START = 7.9;
  const CHIP_GAP = 0.35;

  chips.forEach((chip, i) => {
    const phone = phones[BOOKINGS[i].phone];
    const t = CHIPS_START + i * CHIP_GAP;

    // El móvil "late" al enviar la reserva
    tl.to(phone, { scale: 1.12, duration: 0.12 }, t - 0.12).to(phone, { scale: 1, duration: 0.2 }, t);

    // La reserva vuela desde el móvil hasta su hueco.
    // immediateRender: false → la posición de salida se calcula justo cuando empieza este trozo,
    // con el libro ya abierto y en su sitio
    tl.fromTo(
      chip,
      { x: () => fromPhone(chip, phone, 'x'), y: () => fromPhone(chip, phone, 'y'), scale: 0.3, rotation: -15, autoAlpha: 0 },
      { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', immediateRender: false },
      t,
    );
  });

  countTo(counters.bookings, 0, 128, chips.length * CHIP_GAP + 0.3, CHIPS_START);

  // ESCENA 5: los recordatorios salen de las reservas y vuelan a los móviles
  tl.to(captions[2], { autoAlpha: 0, y: -20, duration: 0.4 }, 12.6).to(captions[3], { autoAlpha: 1, y: 0, duration: 0.4 }, 12.9);

  bubbles.forEach((bubble, i) => {
    const chip = chips[REMINDERS[i]];
    const phone = phones[BOOKINGS[REMINDERS[i]].phone];
    const t = 13.0 + i * 0.4;

    const body = bubble.firstElementChild;

    // De la reserva al móvil (si los móviles están ocultos, sube y se va)
    tl.fromTo(
      bubble,
      { x: () => centerOf(chip).x, y: () => centerOf(chip).y, scale: 0.4 },
      {
        x: () => (phonesVisible() ? centerOf(phone).x : centerOf(chip).x),
        y: () => (phonesVisible() ? centerOf(phone).y - 80 : centerOf(chip).y - 160),
        scale: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        immediateRender: false,
      },
      t,
    )
      // Aparece al salir y desaparece al llegar
      .to(body, { autoAlpha: 1, duration: 0.2 }, t)
      .to(body, { autoAlpha: 0, duration: 0.25 }, t + 1.0)
      .to(phone, { scale: 1.12, duration: 0.12 }, t + 0.7)
      .to(phone, { scale: 1, duration: 0.2 }, t + 0.82);
  });

  countTo(counters.reminders, 0, 36, 1.8, 13.0);
  countTo(counters.noshows, 12, 4, 1.4, 13.4);
  tl.to($('.badge'), { autoAlpha: 1, duration: 0.3 }, 14.6);

  // ESCENA 6: la agenda cambia de sector tres veces
  tl.to(captions[3], { autoAlpha: 0, y: -20, duration: 0.4 }, 15.4).to(captions[4], { autoAlpha: 1, y: 0, duration: 0.4 }, 15.7);

  // "sector" va de 0 a 3. Cada vez que cruza un número entero (redondeando) cambia el sector.
  // Así funciona igual bajando que subiendo
  const SECTOR_START = 15.9;
  const sector = { value: 0, current: 0 };
  tl.to(
    sector,
    {
      value: 3,
      duration: 3,
      ease: 'none',
      onUpdate: () => {
        const index = Math.round(sector.value);
        if (index !== sector.current) {
          sector.current = index;
          applySector(index, { chips, business, sectorName });
        }
      },
    },
    SECTOR_START,
  );

  // En cada cambio, las reservas y el nombre "parpadean": se encogen y vuelven
  [1, 2, 3].forEach((k) => {
    const t = SECTOR_START + k - 0.5;
    tl.to([chips, business, sectorName], { scale: 0.85, autoAlpha: 0.2, duration: 0.15 }, t - 0.15).to(
      [chips, business, sectorName],
      { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'back.out(2)' },
      t,
    );
  });

  // ESCENA 7: todo se va, la aurora se apaga (queda el fondo de la landing) y aparece el logo
  tl.to(captions[4], { autoAlpha: 0, y: -20, duration: 0.4 }, 19.4)
    .to(phones, { autoAlpha: 0, scale: 0.6, stagger: 0.05, duration: 0.4 }, 19.4)
    .to(book, { scale: 0.5, y: -40, autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 19.5)
    .to($('.aurora'), { autoAlpha: 0, duration: 1.2, ease: 'power1.inOut' }, 19.6)
    // El logo de arriba a la izquierda se va: ahora el logo está en el centro
    .to($('.intro-brand'), { autoAlpha: 0, duration: 0.4 }, 19.6)
    .fromTo($('.outro'), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 20.2)
    // Pausa con el logo antes de soltar la página
    .to({}, { duration: 0.8 });

  return tl;
}

// -------------------------------------------------------------
// 7. Principio "vivo" (antes de empezar a bajar)
// -------------------------------------------------------------

// Estas animaciones van por tiempo, no por scroll:
//   - Entrada al cargar: logo, título palabra a palabra, subtítulo, tarjeta e indicador
//   - Tarjeta viva: un cursor de mentira elige día, clase y confirma la reserva, en bucle
//   - Inclinación: la tarjeta se inclina un poco hacia donde está el ratón
// En cuanto se empieza a bajar se paran (la tarjeta pasa a ser la tapa de la agenda),
// y si se vuelve arriba del todo, vuelven a empezar.
// Devuelve una función update(progreso) que se llama cada vez que cambia el scroll de la intro
function buildStartScene(section) {
  const $ = (selector) => section.querySelector(selector);
  const $$ = (selector) => [...section.querySelectorAll(selector)];

  const inner = $('.card-inner');
  const days = $$('.card-inner .day');
  const slots = $$('.card-inner .slot');
  const button = $('.card-button');
  const cursor = $('.fake-cursor');
  const buttonText = button.textContent;

  // --- Tarjeta viva: estados de la tarjeta ---
  const setDay = (index) => days.forEach((day, i) => day.classList.toggle('is-active', i === index));
  const setSlot = (index) => slots.forEach((slot, i) => slot.classList.toggle('is-selected', i === index));
  const setDone = (done) => {
    button.classList.toggle('is-done', done);
    button.textContent = done ? '¡Reservado! ✓' : buttonText;
  };
  // Como al principio: miércoles marcado, ninguna clase elegida y el botón normal
  const resetCard = () => {
    setDay(2);
    setSlot(-1);
    setDone(false);
  };

  // Punto de un elemento donde "hace clic" el cursor (un poco a la derecha y abajo del centro).
  // offsetLeft/offsetTop: posición dentro de .card-inner (que tiene position: relative)
  const pointAt = (el) => ({ x: el.offsetLeft + el.offsetWidth * 0.55, y: el.offsetTop + el.offsetHeight * 0.6 });

  // --- Tarjeta viva: el bucle ---
  // repeat: -1 → se repite siempre. paused: empieza parado (arranca al acabar la entrada)
  const loop = gsap.timeline({ repeat: -1, paused: true });

  // Mueve el cursor hasta un elemento y "hace clic" (se encoge y vuelve)
  const clickOn = (el, action) => {
    loop
      .to(cursor, { x: () => pointAt(el).x, y: () => pointAt(el).y, duration: 0.7, ease: 'power2.inOut' })
      .to(cursor, { scale: 0.75, duration: 0.1 })
      .call(action)
      .to(cursor, { scale: 1, duration: 0.15 })
      .to({}, { duration: 0.35 });
  };

  // Una reserva completa: aparece el cursor, elige día y clase, confirma, espera y se resetea
  const booking = (dayIndex, slotIndex) => {
    loop
      .set(cursor, { x: () => pointAt(button).x + 70, y: () => pointAt(button).y + 50, scale: 1 })
      .to(cursor, { autoAlpha: 1, duration: 0.3 });
    clickOn(days[dayIndex], () => setDay(dayIndex));
    clickOn(slots[slotIndex], () => setSlot(slotIndex));
    clickOn(button, () => setDone(true));
    loop.to(cursor, { autoAlpha: 0, duration: 0.3 }, '+=0.6').call(resetCard, [], '+=0.8');
  };

  // Dos reservas distintas, para que no parezca siempre lo mismo
  booking(3, 1);
  booking(0, 2);

  // --- Inclinación con el ratón (solo con ratón, no en pantallas táctiles) ---
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // quickTo crea una función que anima una propiedad hacia el valor que se le pasa,
  // reutilizando la misma animación (ideal para eventos que se repiten mucho, como mousemove)
  const tiltX = gsap.quickTo(inner, 'rotationX', { duration: 0.6, ease: 'power3.out' });
  const tiltY = gsap.quickTo(inner, 'rotationY', { duration: 0.6, ease: 'power3.out' });
  let tiltOn = false;

  section.addEventListener('pointermove', (event) => {
    if (!hasMouse || !tiltOn) return;
    // Posición del ratón de -0.5 a 0.5 (0 = centro de la pantalla)
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    tiltY(x * 16);
    tiltX(-y * 12);
  });

  const resetTilt = () => {
    tiltX(0);
    tiltY(0);
  };
  section.addEventListener('pointerleave', resetTilt);

  // --- Entrada al cargar ---
  // Primero se colocan todos en su estado de salida (ocultos y desplazados) y después
  // la timeline los lleva a su sitio. Se hace con set + to y no con from porque así
  // las palabras que aún no han empezado se quedan ocultas esperando su turno
  let entered = false;
  let active = true;

  const brand = $('.intro-brand');
  const words = $$('.intro-title .word');
  const subtitle = $('.intro-subtitle');
  const hint = $('.scroll-hint-inner');

  gsap.set(brand, { autoAlpha: 0, y: -12 });
  gsap.set(words, { autoAlpha: 0, y: 40, rotationX: -50 });
  gsap.set(subtitle, { autoAlpha: 0, y: 20 });
  gsap.set(inner, { autoAlpha: 0, y: 80, rotationX: 30, rotationY: -20, scale: 0.9 });
  gsap.set(hint, { autoAlpha: 0, y: 10 });

  gsap
    .timeline({
      onComplete: () => {
        entered = true;
        // Si mientras entraba ya se ha empezado a bajar, no se arranca nada
        if (active) {
          tiltOn = true;
          loop.play();
        }
      },
    })
    .to(brand, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
    .to(words, { autoAlpha: 1, y: 0, rotationX: 0, stagger: 0.07, duration: 0.6, ease: 'power3.out' }, 0.1)
    .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.55)
    .to(inner, { autoAlpha: 1, y: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 1, ease: 'power3.out' }, 0.2)
    .to(hint, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.9);

  // --- Parar al bajar y volver a empezar arriba del todo ---
  return function update(progress) {
    const atTop = progress < 0.002;

    if (!atTop && active) {
      active = false;
      tiltOn = false;
      resetTilt();
      loop.pause();
      gsap.set(cursor, { autoAlpha: 0 });
      resetCard();
    } else if (atTop && !active) {
      active = true;
      if (entered) {
        tiltOn = true;
        loop.restart();
      }
    }
  };
}

// -------------------------------------------------------------
// 8 y 9. Scroll y función principal
// -------------------------------------------------------------

// Crea la intro antes de la landing, si toca enseñarla (ver apartado 1)
export function initIntro() {
  if (!shouldShowIntro()) return;

  // La sección va al principio del <body>, antes de la landing (#app)
  const section = document.createElement('section');
  section.className = 'story';
  section.setAttribute('aria-label', 'Intro: un día con Reservo');
  section.innerHTML = introHTML;
  document.body.prepend(section);

  // Mientras se ve la intro, el <html> lleva la clase intro-playing (esconde el aviso de cookies)
  document.documentElement.classList.add('intro-playing');

  // Scroll suave con Lenis. anchors: los enlaces #id (menú, botones) también bajan suave
  const lenis = new Lenis({ anchors: true });

  // Lenis y ScrollTrigger tienen que ir sincronizados: cada vez que Lenis mueve la página,
  // ScrollTrigger recalcula; y Lenis se mueve con el mismo "reloj" que GSAP
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const tl = buildTimeline(section);
  const updateStart = buildStartScene(section);

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    // Cada "segundo" de la película son 450px de scroll
    end: () => `+=${tl.duration() * 450}`,
    // pin: la sección se queda fija en pantalla mientras dura la intro
    pin: true,
    // scrub: la timeline sigue al scroll, con 1 segundo de suavizado
    scrub: 1,
    animation: tl,
    // Al cambiar el tamaño de la ventana se recalculan las medidas
    invalidateOnRefresh: true,
    // Al llegar al final: ya se ha visto (la próxima vez se entra directo) y aparece
    // el aviso de cookies. Si se vuelve a subir, el aviso se vuelve a esconder
    onLeave: () => {
      markIntroSeen();
      document.documentElement.classList.remove('intro-playing');
    },
    onEnterBack: () => document.documentElement.classList.add('intro-playing'),
    // En cada movimiento del scroll: el principio "vivo" se para o vuelve a empezar (apartado 7)
    onUpdate: (self) => updateStart(self.progress),
  });
}
