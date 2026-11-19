// =============================================================
// Testimonials.js — Sección de testimonios (issue #15 y #21)
// Muestra 3 tarjetas de testimonios con estrellas, cita,
// nombre del cliente y sector de su negocio.
// En móvil se muestran de uno en uno mediante un carrusel/controles
// para reducir el desplazamiento vertical (apartado 7.2 del documento de diseño).
//
// Partes del archivo:
//   1. Iconos y datos       → la estrella y flechas de Lucide y el array testimonials
//   2. Una tarjeta          → renderStars y testimonialCard
//   3. HTML de la sección   → renderTestimonials (lo llama main.js)
//   4. Lógica de carrusel   → setupTestimonialsCarousel (solo móvil)
// =============================================================

// -------------------------------------------------------------
// 1. Iconos y datos
// -------------------------------------------------------------

// createIcons convierte cada <i data-lucide="..."> en su dibujo SVG.
import { createIcons, Star, ChevronLeft, ChevronRight } from 'lucide';
import { t } from '../i18n.js';

// Datos de los 3 testimonios. Si se añade o quita alguno, solo hay que tocar este array.
//   - quote:  lo que dice el cliente
//   - author: nombre del cliente
//   - sector: tipo de negocio (uno distinto en cada tarjeta, apartado 2.3 del documento)
//   - rating: estrellas de la valoración (de 1 a 5)
const testimonials = [
  {
    quote: 'testimonials.quoteGym',
    author: 'Marcos R.',
    sector: 'testimonials.gym',
    rating: 5,
  },
  {
    quote: 'testimonials.quoteRestaurant',
    author: 'Javier M.',
    sector: 'testimonials.restaurant',
    rating: 5,
  },
  {
    quote: 'testimonials.quoteSalon',
    author: 'Lucía B.',
    sector: 'testimonials.salon',
    rating: 5,
  },
];

// -------------------------------------------------------------
// 2. Una tarjeta
// -------------------------------------------------------------

// Genera tantas estrellas como diga rating (5 si no se indica).
function renderStars(rating = 5) {
  return Array.from({ length: rating })
    .map(
      () => /*html*/ `
      <i data-lucide="star" class="h-4 w-4 fill-amber-400 text-amber-400"></i>
    `
    )
    .join('');
}

// Genera el HTML de una tarjeta de testimonio.
function testimonialCard({ quote, author, sector, rating }, index) {
  // En móvil (menor que lg:), solo se muestra la primera tarjeta por defecto.
  // Las demás llevan max-lg:hidden y el carrusel las alterna.
  const hiddenOnMobile = index === 0 ? '' : 'max-lg:hidden';

  return /*html*/ `
    <figure 
      data-testimonial-slide="${index}"
      class="glass flex flex-col justify-between rounded-xl border border-slate-200/80 p-6 shadow-sm transition hover:border-indigo-300 sm:p-8 ${hiddenOnMobile}"
    >
      <div>
        <!-- Estrellas de valoración -->
        <div class="flex items-center gap-1" role="img" aria-label="${t('testimonials.rating', { rating })}" data-i18n-aria-label="testimonials.rating" data-i18n-rating="${rating}">
          ${renderStars(rating)}
        </div>

        <!-- Cita del cliente, con comillas tipográficas (“ ”) -->
        <blockquote class="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          “<span data-i18n="${quote}">${t(quote)}</span>”
        </blockquote>
      </div>

      <!-- Autor y sector -->
      <figcaption class="mt-6 border-t border-slate-200/60 pt-4">
        <p class="text-sm font-semibold text-slate-900">${author}</p>
        <p data-i18n="${sector}" class="text-xs text-slate-500">${t(sector)}</p>
      </figcaption>
    </figure>
  `;
}

// -------------------------------------------------------------
// 3. HTML de la sección
// -------------------------------------------------------------

// Pinta la sección dentro del contenedor que le pasa main.js (el <section id="testimonios">)
export function renderTestimonials(container) {
  // Espaciado vertical responsive: py-16 en móvil, py-20 en tablet y py-28 en escritorio
  container.className = 'py-16 sm:py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales y sin desborde -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Cabecera de la sección: título y subtítulo centrados -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          <span data-i18n="testimonials.heading">${t('testimonials.heading')}</span>
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          <span data-i18n="testimonials.description">${t('testimonials.description')}</span>
        </p>
      </div>

      <!-- Contenedor de las tarjetas:
           En móvil y tablet (hasta lg) se muestra de 1 en 1 como carrusel para no hacer scroll largo.
           En escritorio (lg) se muestran las 3 tarjetas en fila -->
      <div class="mx-auto mt-12 max-w-xl lg:mt-14 lg:max-w-none">
        <div id="testimonials-track" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          ${testimonials.map(testimonialCard).join('')}
        </div>

        <!-- Controles de carrusel (solo en móvil y tablet, ocultos en lg) -->
        <div class="mt-8 flex items-center justify-between lg:hidden">
          <!-- Puntos indicadores (dots). role="group" (y no "tablist"): son botones normales,
               no pestañas; con "tablist" Lighthouse pide que dentro haya elementos role="tab".
               Cada botón mide 24 px de alto (h-6), el mínimo que pide Lighthouse para pulsar
               con el dedo; el punto que se ve es el <span> de dentro, más pequeño.
               aria-pressed="true" en el punto activo: el lector de pantalla dice cuál se está viendo -->
          <div class="flex items-center gap-1" role="group" aria-label="${t('testimonials.carouselLabel')}" data-i18n-aria-label="testimonials.carouselLabel">
            ${testimonials
              .map(
                (_, index) => /*html*/ `
              <button
                type="button"
                data-testimonial-dot="${index}"
                aria-pressed="${index === 0}"
                aria-label="${t('testimonials.goTo', { number: index + 1 })}" data-i18n-aria-label="testimonials.goTo" data-i18n-number="${index + 1}"
                class="flex h-6 min-w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span data-testimonial-dot-mark class="block h-2.5 rounded-full transition-all ${index === 0 ? 'w-8 bg-indigo-600' : 'w-2.5 bg-slate-300'}"></span>
              </button>
            `
              )
              .join('')}
          </div>

          <!-- Botones anterior / siguiente -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              id="testimonial-prev"
              aria-label="${t('testimonials.previous')}" data-i18n-aria-label="testimonials.previous"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <i data-lucide="chevron-left" class="h-5 w-5"></i>
            </button>
            <button
              type="button"
              id="testimonial-next"
              aria-label="${t('testimonials.next')}" data-i18n-aria-label="testimonials.next"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <i data-lucide="chevron-right" class="h-5 w-5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Cambia los <i data-lucide="..."> de esta sección por sus SVG
  createIcons({
    root: container,
    icons: {
      Star,
      ChevronLeft,
      ChevronRight,
    },
  });

  // Activa la navegación del carrusel en móvil
  setupTestimonialsCarousel(container);
}

// -------------------------------------------------------------
// 4. Lógica de carrusel en móvil
// -------------------------------------------------------------

function setupTestimonialsCarousel(container) {
  const slides = container.querySelectorAll('[data-testimonial-slide]');
  const dots = container.querySelectorAll('[data-testimonial-dot]');
  const prevBtn = container.querySelector('#testimonial-prev');
  const nextBtn = container.querySelector('#testimonial-next');

  if (!slides.length) return;

  let currentIndex = 0;

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    // Mostrar solo la tarjeta activa en móvil (las demás llevan max-lg:hidden)
    slides.forEach((slide, i) => {
      slide.classList.toggle('max-lg:hidden', i !== currentIndex);
    });

    // Actualizar los puntos (dots): el activo, alargado e índigo; los demás, redondos y grises.
    // Las clases van en el <span> de dentro (el punto que se ve); aria-pressed, en el botón
    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      const mark = dot.querySelector('[data-testimonial-dot-mark]');
      dot.setAttribute('aria-pressed', String(isActive));
      mark.classList.toggle('w-8', isActive);
      mark.classList.toggle('bg-indigo-600', isActive);
      mark.classList.toggle('w-2.5', !isActive);
      mark.classList.toggle('bg-slate-300', !isActive);
    });
  }

  prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });
}
