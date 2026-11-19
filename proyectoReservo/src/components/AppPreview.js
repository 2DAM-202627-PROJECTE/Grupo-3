// =============================================================
// AppPreview.js — Vista previa del panel de Reservo (issue #73)
// Enseña cómo es la app por dentro: una ventana de navegador con el
// panel de FitZone Gym (el mismo negocio que la tarjeta del Hero).
// Está hecha con HTML y Tailwind, no con una imagen: se ve nítida en
// cualquier pantalla, se traduce y casi no pesa (no baja el rendimiento).
//
// Partes del archivo:
//   1. Datos                → menú, cifras del día, clases y semana
//   2. Piezas del panel     → navItem, statCard, classRow, weekBar
//   3. HTML de la sección   → renderAppPreview (lo llama main.js)
//   4. Animación            → al entrar en pantalla, las piezas se montan una detrás de otra
//                             (los estilos están en style.css, apartado 5)
// =============================================================

// -------------------------------------------------------------
// 1. Datos
// -------------------------------------------------------------

// createIcons convierte cada <i data-lucide="..."> en su dibujo SVG.
// Solo se importan los iconos que usa el panel
import {
  createIcons,
  CalendarCheck,
  CalendarDays,
  ChartColumn,
  Euro,
  LayoutDashboard,
  MessageCircle,
  Percent,
  Plus,
  Settings,
  Users,
} from 'lucide';
import { t } from '../i18n.js';

// Menú lateral del panel. active: la opción que se está viendo
const navItems = [
  { icon: 'layout-dashboard', label: 'preview.navDashboard', active: true },
  { icon: 'calendar-days', label: 'preview.navCalendar' },
  { icon: 'users', label: 'preview.navClients' },
  { icon: 'chart-column', label: 'preview.navStats' },
  { icon: 'settings', label: 'preview.navSettings' },
];

// Las tres cifras del día.
//   - value:  el número (es un número y no un texto, para poder contar desde 0 en la animación)
//   - suffix: lo que va detrás del número (opcional: " %", " €")
//   - note:   texto pequeño debajo (opcional)
//   - bar:    porcentaje para dibujar una barra (opcional, solo en ocupación)
// Cuadran con las clases de abajo: 14 + 13 + 16 + 9 = 52 reservas de 63 plazas (83 %)
const stats = [
  { icon: 'calendar-check', label: 'preview.statBookings', value: 52, note: 'preview.statBookingsNote' },
  { icon: 'percent', label: 'preview.statOccupancy', value: 83, suffix: ' %', bar: 83 },
  { icon: 'euro', label: 'preview.statRevenue', value: 642, suffix: ' €', note: 'preview.statRevenueNote' },
];

// Retrasos de la animación (en milisegundos, desde que el panel entra en pantalla).
// Las piezas salen en este orden: cifras → filas de la agenda → barras de la semana → aviso
const DELAY = {
  fill: 200, // barra de ocupación del día
  rowsStart: 300, // primera fila de la agenda
  rowsStep: 150, // cada fila, 150 ms después de la anterior
  barsStart: 500, // primera barra de la semana
  barsStep: 80, // cada barra, 80 ms después de la anterior
  toast: 1500, // aviso de WhatsApp, al final
};

// Cuánto dura la cuenta de las cifras, de 0 a su valor (en milisegundos)
const COUNT_MS = 1200;

// Clases de hoy. Son las mismas que la tarjeta del Hero para el miércoles 24, con las mismas
// horas y plazas libres (Spinning 6, Yoga 2, CrossFit completo), así las dos vistas cuadran.
//   - booked / capacity: plazas reservadas / plazas totales
//   - color: el mismo color que tiene esa clase en la agenda de la intro (SECTORS en Intro.js)
const classes = [
  { time: '09:00', name: 'preview.classSpinning', coach: 'Marta', booked: 14, capacity: 20, color: 'bg-indigo-600' },
  { time: '12:30', name: 'preview.classYoga', coach: 'Laura', booked: 13, capacity: 15, color: 'bg-cyan-600' },
  { time: '18:00', name: 'preview.classCrossfit', coach: 'Joan', booked: 16, capacity: 16, color: 'bg-emerald-600' },
  { time: '19:30', name: 'preview.classPilates', coach: 'Àlex', booked: 9, capacity: 12, color: 'bg-amber-600' },
];

// Colores del estado de una clase, los mismos que las etiquetas del Hero:
// verde si hay plazas, ámbar si quedan pocas (2 o menos) y rojo si está completa
const statusColors = {
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-700' },
};

// Reservas de cada día de la semana, en % del día con más reservas.
// Los nombres cortos de lunes a viernes son los mismos que usa el Hero.
// today: el día que se está viendo (miércoles 24, como en la tarjeta del Hero)
const week = [
  { day: 'hero.monday', value: 62 },
  { day: 'hero.tuesday', value: 74 },
  { day: 'hero.wednesday', value: 86, today: true },
  { day: 'hero.thursday', value: 78 },
  { day: 'hero.friday', value: 100 },
  { day: 'preview.saturday', value: 55 },
  { day: 'preview.sunday', value: 28 },
];

// -------------------------------------------------------------
// 2. Piezas del panel
// -------------------------------------------------------------

// Una opción del menú lateral. La activa va con fondo índigo claro
function navItem({ icon, label, active }) {
  return /*html*/ `
    <li class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-600'}">
      <i data-lucide="${icon}" class="h-4 w-4"></i>
      <span data-i18n="${label}">${t(label)}</span>
    </li>
  `;
}

// Una tarjeta con una cifra del día (icono, título, número y nota o barra).
// En móvil las tres van en fila y son compactas: sin icono ni nota (hidden sm:…),
// con el número más pequeño, para que la sección no se haga muy larga
function statCard({ icon, label, value, suffix = '', note, bar }) {
  return /*html*/ `
    <div class="rounded-xl border border-slate-200/70 bg-white/80 p-3 sm:p-4">
      <div class="flex items-center justify-between gap-2">
        <p data-i18n="${label}" class="text-xs font-medium text-slate-600">${t(label)}</p>
        <!-- Icono en un cuadrado índigo claro (desde sm) -->
        <span class="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:flex">
          <i data-lucide="${icon}" class="h-4 w-4"></i>
        </span>
      </div>
      <!-- data-count y data-suffix: la animación cuenta desde 0 hasta este número.
           tabular-nums: todas las cifras miden lo mismo, así el número no "baila" mientras cuenta -->
      <p data-count="${value}" data-suffix="${suffix}" class="mt-1 text-lg font-bold tabular-nums text-slate-900 sm:mt-2 sm:text-2xl">${value}${suffix}</p>
      ${note ? `<p data-i18n="${note}" class="mt-1 hidden text-xs text-emerald-700 sm:block">${t(note)}</p>` : ''}
      ${
        bar
          ? /*html*/ `
        <!-- Barra de ocupación: el ancho se pone con style porque es un número de los datos.
             data-anim="fill": en la animación se llena de izquierda a derecha -->
        <div class="mt-3 h-1.5 rounded-full bg-slate-100">
          <div data-anim="fill" class="h-1.5 rounded-full bg-linear-to-r from-indigo-600 to-violet-500" style="width: ${bar}%; --delay: ${DELAY.fill}ms"></div>
        </div>`
          : ''
      }
    </div>
  `;
}

// Una fila de la agenda: punto de color, hora, clase, monitor y plazas.
// Si está llena (booked === capacity), sale la etiqueta "Completo" en rojo, como en el Hero.
// index: la posición de la fila (map lo pasa solo), para que cada una aparezca un poco después
function classRow({ time, name, coach, booked, capacity, color }, index) {
  const full = booked === capacity;
  const percent = Math.round((booked / capacity) * 100);
  const status = statusColors[capacity - booked <= 2 ? 'amber' : 'emerald'];
  const delay = DELAY.rowsStart + index * DELAY.rowsStep;

  return /*html*/ `
    <!-- data-anim="fade": en la animación, la fila aparece subiendo un poco -->
    <li data-anim="fade" class="flex items-center gap-3 py-3" style="--delay: ${delay}ms">
      <!-- Punto con el color de la clase (el mismo que en la agenda de la intro) -->
      <span class="h-2.5 w-2.5 shrink-0 rounded-full ${color}"></span>

      <!-- Hora, con ancho fijo para que las filas queden alineadas -->
      <span class="w-12 shrink-0 text-sm font-semibold text-slate-900">${time}</span>

      <!-- Clase y monitor. min-w-0 + truncate: si el texto no cabe, se corta con "…" -->
      <div class="min-w-0 flex-1">
        <p data-i18n="${name}" class="truncate text-sm font-medium text-slate-800">${t(name)}</p>
        <p data-i18n="preview.coach" data-i18n-name="${coach}" class="truncate text-xs text-slate-600">${t('preview.coach', { name: coach })}</p>
      </div>

      <!-- Plazas: número y barra pequeña con el color del estado, o la etiqueta "Completo" si está llena.
           "Completo" usa la misma traducción (hero.full) y los mismos colores que la tarjeta del Hero -->
      <div class="w-20 shrink-0 text-right">
        ${
          full
            ? `<span data-i18n="hero.full" class="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">${t('hero.full')}</span>`
            : /*html*/ `
          <p class="text-xs font-medium ${status.text}">${booked}/${capacity}</p>
          <div class="mt-1 h-1 rounded-full bg-slate-100">
            <div data-anim="fill" class="h-1 rounded-full ${status.bar}" style="width: ${percent}%; --delay: ${delay + 200}ms"></div>
          </div>`
        }
      </div>
    </li>
  `;
}

// Una barra del gráfico de la semana. La altura sale del dato (style),
// y la de hoy va en índigo fuerte para que destaque.
// data-anim="bar": en la animación crece desde abajo, cada barra un poco después que la anterior
function weekBar({ day, value, today }, index) {
  return /*html*/ `
    <div class="flex flex-1 flex-col items-center gap-2">
      <!-- Hueco de la barra: ocupa todo el alto que queda (flex-1, mínimo 7 rem)
           y la barra crece desde abajo (items-end) -->
      <div class="flex min-h-28 w-full flex-1 items-end justify-center">
        <div data-anim="bar" class="w-full max-w-7 rounded-t-md ${today ? 'bg-indigo-600' : 'bg-indigo-200'}" style="height: ${value}%; --delay: ${DELAY.barsStart + index * DELAY.barsStep}ms"></div>
      </div>
      <span data-i18n="${day}" class="text-xs ${today ? 'font-semibold text-indigo-700' : 'text-slate-600'}">${t(day)}</span>
    </div>
  `;
}

// -------------------------------------------------------------
// 3. HTML de la sección
// -------------------------------------------------------------

// Pinta la sección dentro del contenedor que le pasa main.js (el <section id="panel">)
export function renderAppPreview(container) {
  // Mismo espacio arriba y abajo que el resto de secciones
  container.className = 'py-16 sm:py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales, como el resto de secciones -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Cabecera de la sección: título y subtítulo centrados -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          <span data-i18n="preview.heading">${t('preview.heading')}</span>
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          <span data-i18n="preview.description">${t('preview.description')}</span>
        </p>
      </div>

      <!-- La vista previa es un dibujo de la app, no algo que se pueda usar:
           role="img" + aria-label hace que el lector de pantalla la lea como una imagen
           con su descripción, en vez de leer uno a uno todos los textos de dentro.
           Ventana de cristal (glass de style.css) con las esquinas redondeadas -->
      <div data-preview-window role="img" aria-label="${t('preview.imageLabel')}" data-i18n-aria-label="preview.imageLabel" class="glass mx-auto mt-14 max-w-6xl overflow-hidden rounded-2xl">

        <!-- Barra del navegador: los tres puntos de colores y la dirección de la app -->
        <div class="flex items-center gap-3 border-b border-slate-200/70 bg-white/60 px-4 py-3">
          <div class="flex gap-1.5">
            <span class="h-3 w-3 rounded-full bg-rose-400"></span>
            <span class="h-3 w-3 rounded-full bg-amber-400"></span>
            <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
          </div>
          <span class="mx-auto rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-600">app.reservo.es/panel</span>
          <!-- Hueco del mismo ancho que los puntos, para que la dirección quede centrada -->
          <span class="w-12"></span>
        </div>

        <!-- Cuerpo: menú lateral (solo escritorio, lg) y contenido -->
        <div class="grid lg:grid-cols-[13rem_1fr]">
          <!-- Menú lateral. En móvil y tableta no se ve, para dejar sitio al contenido -->
          <div class="hidden border-r border-slate-200/70 bg-white/40 p-4 lg:block">
            <div class="flex items-center gap-2 px-3 pb-4 text-sm font-bold text-slate-900">
              <img src="${import.meta.env.BASE_URL}favicon.svg" alt="" class="h-6 w-6" />
              Reservo
            </div>
            <ul class="space-y-1">
              ${navItems.map(navItem).join('')}
            </ul>
          </div>

          <!-- Contenido del panel -->
          <div class="space-y-6 p-4 sm:p-6 lg:p-8">
            <!-- Cabecera: negocio y fecha a la izquierda, botón de nueva reserva a la derecha.
                 El "botón" es un <span>: es parte del dibujo, no hace nada -->
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-lg font-bold text-slate-900">FitZone Gym</p>
                <p data-i18n="preview.today" class="text-sm text-slate-600">${t('preview.today')}</p>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30">
                <i data-lucide="plus" class="h-4 w-4"></i>
                <span data-i18n="preview.newBooking">${t('preview.newBooking')}</span>
              </span>
            </div>

            <!-- Cifras del día: siempre 3 en fila (en móvil, más juntas) -->
            <div class="grid grid-cols-3 gap-2 sm:gap-4">
              ${stats.map(statCard).join('')}
            </div>

            <!-- Agenda y gráfico: uno debajo del otro hasta lg; en escritorio, en fila
                 (la agenda ocupa 3 de 5 columnas y el gráfico 2) -->
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
              <div class="rounded-xl border border-slate-200/70 bg-white/80 p-4 lg:col-span-3">
                <p data-i18n="preview.agenda" class="text-sm font-semibold text-slate-900">${t('preview.agenda')}</p>
                <!-- divide-y: línea fina entre las filas -->
                <ul class="mt-1 divide-y divide-slate-100">
                  ${classes.map(classRow).join('')}
                </ul>
              </div>

              <!-- flex-col + flex-1 en el gráfico: en escritorio, la tarjeta es tan alta como la agenda
                   y las barras se estiran para llenarla, sin dejar hueco debajo -->
              <div class="flex flex-col rounded-xl border border-slate-200/70 bg-white/80 p-4 lg:col-span-2">
                <p data-i18n="preview.week" class="text-sm font-semibold text-slate-900">${t('preview.week')}</p>
                <div class="mt-4 flex flex-1 gap-2">
                  ${week.map(weekBar).join('')}
                </div>
              </div>
            </div>

            <!-- Aviso de recordatorio enviado: enseña la función de recordatorios por WhatsApp.
                 En la animación llega el último, como si acabara de enviarse -->
            <div data-anim="fade" class="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3" style="--delay: ${DELAY.toast}ms">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <i data-lucide="message-circle" class="h-4 w-4"></i>
              </span>
              <p data-i18n="preview.reminder" class="text-sm text-emerald-900">${t('preview.reminder')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Cambia los <i data-lucide="..."> de esta sección por sus SVG.
  // root: container → solo busca dentro de esta sección, no en toda la página
  createIcons({
    root: container,
    icons: {
      CalendarCheck,
      CalendarDays,
      ChartColumn,
      Euro,
      LayoutDashboard,
      MessageCircle,
      Percent,
      Plus,
      Settings,
      Users,
    },
  });

  // Prepara la animación del panel (apartado 4)
  setupPreviewAnimation(container);
}

// -------------------------------------------------------------
// 4. Animación
// -------------------------------------------------------------

// Cuenta desde 0 hasta el número de data-count, en COUNT_MS milisegundos.
// requestAnimationFrame llama a frame() en cada fotograma de la pantalla (unas 60 veces por
// segundo). Cada vez se calcula qué parte del tiempo ha pasado (progress, de 0 a 1) y se
// escribe el número que toca. La curva (1 - (1 - progress)³) hace que cuente rápido al
// principio y frene al final, como las barras
function countUp(element) {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / COUNT_MS, 1);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// Deja el panel en espera y lo anima la primera vez que entra en pantalla
function setupPreviewAnimation(container) {
  // Si la persona ha pedido reducir las animaciones, el panel se queda tal cual, ya completo
  // (el CSS tampoco aplicaría nada; así además no se ejecuta este código)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const panel = container.querySelector('[data-preview-window]');
  const counters = panel.querySelectorAll('[data-count]');

  // Estado de espera: las piezas con data-anim se esconden (CSS) y las cifras empiezan en 0
  panel.classList.add('preview-anim');
  counters.forEach((counter) => {
    counter.textContent = `0${counter.dataset.suffix}`;
  });

  // IntersectionObserver avisa cuando el panel entra en pantalla.
  // threshold: 0.25 → cuando se ve al menos una cuarta parte, así la animación no
  // empieza cuando el panel apenas asoma por abajo
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      // Solo la primera vez: deja de vigilar el panel
      observer.disconnect();
      panel.classList.add('is-playing');
      counters.forEach(countUp);
    },
    { threshold: 0.25 },
  );
  observer.observe(panel);
}
