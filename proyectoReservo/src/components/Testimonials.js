// =============================================================
// Testimonials.js — Sección de testimonios (issue #15, Jean)
// Muestra 3 tarjetas de testimonios con estrellas, cita,
// nombre del cliente y sector de su negocio.
//
// Partes del archivo:
//   1. Iconos y datos       → la estrella de Lucide y el array testimonials
//   2. Una tarjeta          → renderStars y testimonialCard
//   3. HTML de la sección   → renderTestimonials (lo llama main.js)
// =============================================================

// -------------------------------------------------------------
// 1. Iconos y datos
// -------------------------------------------------------------

// createIcons convierte cada <i data-lucide="..."> en su dibujo SVG.
// Solo se importa la estrella, que es el único icono de la sección
import { createIcons, Star } from 'lucide';

// Datos de los 3 testimonios. Si se añade o quita alguno, solo hay que tocar este array.
//   - quote:  lo que dice el cliente
//   - author: nombre del cliente
//   - sector: tipo de negocio (uno distinto en cada tarjeta, apartado 2.3 del documento)
//   - rating: estrellas de la valoración (de 1 a 5)
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

// -------------------------------------------------------------
// 2. Una tarjeta
// -------------------------------------------------------------

// Genera tantas estrellas como diga rating (5 si no se indica).
// Array.from({ length: 5 }) crea un array de 5 huecos; map pone una estrella en cada uno.
// fill-amber-400: la estrella va rellena de amarillo (los iconos de Lucide solo traen el contorno)
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
// Recibe un objeto del array y con desestructuración ({ quote, author, ... })
// saca sus propiedades directamente
function testimonialCard({ quote, author, sector, rating }) {
  return /*html*/ `
    <!-- Cada testimonio es un <figure>: la etiqueta de HTML para una cita (<blockquote>)
         con su autor (<figcaption>). Antes era un <article>, pero el validador de W3C
         avisa de que un <article> debería tener título, y una cita no lo tiene (issue #28).
         Tarjeta de cristal (glass de style.css). flex-col + justify-between: el autor
         queda siempre abajo, aunque las citas tengan largos distintos.
         Al pasar el ratón, el borde se vuelve índigo claro -->
    <figure class="glass flex flex-col justify-between rounded-xl border border-slate-200/80 p-6 shadow-sm transition hover:border-indigo-300 sm:p-8">
      <div>
        <!-- Estrellas de valoración.
             role="img" + aria-label: el lector de pantalla lee "Valoración: 5 de 5 estrellas"
             en vez de nada. Sin role, un <div> no tiene rol y su aria-label no se lee -->
        <div class="flex items-center gap-1" role="img" aria-label="Valoración: ${rating} de 5 estrellas">
          ${renderStars(rating)}
        </div>

        <!-- Cita del cliente, con comillas tipográficas (“ ”) en vez de las rectas (" ") -->
        <blockquote class="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          “${quote}”
        </blockquote>
      </div>

      <!-- Autor y sector. <figcaption> dice de quién es la cita del <figure>.
           Una línea fina lo separa de la cita -->
      <figcaption class="mt-6 border-t border-slate-200/60 pt-4">
        <p class="text-sm font-semibold text-slate-900">${author}</p>
        <p class="text-xs text-slate-500">${sector}</p>
      </figcaption>
    </figure>
  `;
}

// -------------------------------------------------------------
// 3. HTML de la sección
// -------------------------------------------------------------

// Pinta la sección dentro del contenedor que le pasa main.js (el <section id="testimonios">)
export function renderTestimonials(container) {
  // Mismo espacio arriba y abajo que el resto de secciones
  container.className = 'py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales, como el resto de secciones -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Cabecera de la sección: título y subtítulo centrados -->
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

  // Cambia los <i data-lucide="star"> de esta sección por sus SVG.
  // root: container → solo busca dentro de Testimonios, no en toda la página
  createIcons({
    root: container,
    icons: {
      Star,
    },
  });
}
