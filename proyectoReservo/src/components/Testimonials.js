// =============================================================
// Testimonials.js — Sección de testimonios (issue #15)
// Muestra 3 tarjetas de testimonios con estrellas, cita,
// nombre del cliente y sector de su negocio.
// =============================================================

import { createIcons, Star } from 'lucide';

// Datos de los 3 testimonios guardados en un array
const testimonials = [
  {
    quote:
      'Hemos dejado de atender llamadas que interrumpían entrenamientos. Los clientes reservan solos en diez segundos.',
    author: 'Marcos R.',
    sector: 'Gimnasio',
    rating: 5,
  },
  {
    quote:
      'Teníamos dos personas solo al teléfono: se perdía el tiempo. El 90% de las reservas llegan solas.',
    author: 'Javier M.',
    sector: 'Restaurante',
    rating: 5,
  },
  {
    quote:
      'Muy fácil de configurar. Ahora los clientes ven la disponibilidad y piden cita sin esperar.',
    author: 'Lucía B.',
    sector: 'Peluquería',
    rating: 5,
  },
];

// Genera las 5 estrellas de valoración con Lucide
function renderStars(rating = 5) {
  return Array.from({ length: rating })
    .map(
      () => /*html*/ `
      <i data-lucide="star" class="h-4 w-4 fill-amber-400 text-amber-400"></i>
    `
    )
    .join('');
}

// Genera el HTML de una tarjeta de testimonio
function testimonialCard({ quote, author, sector, rating }) {
  return /*html*/ `
    <article class="glass flex flex-col justify-between rounded-xl border border-slate-200/80 p-6 shadow-sm transition hover:border-indigo-300 sm:p-8">
      <div>
        <!-- Estrellas de valoración.
             role="img" + aria-label: el lector de pantalla lee "Valoración: 5 de 5 estrellas"
             en vez de nada. Sin role, un <div> no tiene rol y su aria-label no se lee -->
        <div class="flex items-center gap-1" role="img" aria-label="Valoración: ${rating} de 5 estrellas">
          ${renderStars(rating)}
        </div>

        <!-- Cita del cliente -->
        <blockquote class="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          "${quote}"
        </blockquote>
      </div>

      <!-- Autor y sector -->
      <footer class="mt-6 border-t border-slate-200/60 pt-4">
        <p class="text-sm font-semibold text-slate-900">${author}</p>
        <p class="text-xs text-slate-500">${sector}</p>
      </footer>
    </article>
  `;
}

// Pinta la sección dentro del contenedor que le pasa main.js (el <section id="testimonios">)
export function renderTestimonials(container) {
  container.className = 'py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Cabecera de la sección -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Lo que dicen nuestros clientes
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          Negocios reales que ya ahorran horas cada semana con Reservo.
        </p>
      </div>

      <!-- Grid de 3 tarjetas: 1 columna en móvil y tablet, 3 en escritorio (lg).
           Sin paso de 2 columnas: con 3 tarjetas, la tercera quedaría sola en su fila.
           max-w-2xl: en tablet las tarjetas no ocupan todo el ancho, para que las líneas
           de la cita no queden muy largas. lg:max-w-none lo quita en escritorio -->
      <div class="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
        ${testimonials.map(testimonialCard).join('')}
      </div>

    </div>
  `;

  // Renderizar las estrellas de Lucide
  createIcons({
    root: container,
    icons: {
      Star,
    },
  });
}

