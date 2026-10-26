// =============================================================
// Hero.js — Primera sección de la página (issue #8)
// Izquierda: badge, título, subtítulo y botones.
// Derecha: hueco para la tarjeta de reserva (issue #9, Arnau).
// =============================================================

// Pinta el Hero dentro del contenedor que le pasa main.js
// (el <section id="hero">).
export function renderHero(container) {
  // relative + overflow-hidden: por si luego se añaden fondos o
  // decoraciones posicionadas, que no se salgan de la sección
  container.className = 'relative overflow-hidden';

  container.innerHTML = `
    <!-- Contenedor centrado. Es un grid: 1 columna en móvil y 2 en escritorio (lg:grid-cols-2) -->
    <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">

      <!-- Columna izquierda: texto y botones -->
      <div id="hero-text" class="max-w-xl">

        <!-- Badge: etiqueta en forma de píldora con un puntito delante -->
        <span class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
          <!-- aria-hidden: el punto es decorativo, los lectores de pantalla lo ignoran -->
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden="true"></span>
          Nuevo · Recordatorios por WhatsApp
        </span>

        <!-- Título principal (el único h1 de la página). El tamaño crece con la pantalla: 4xl → 5xl → 6xl -->
        <h1 class="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Las reservas de tu negocio,
          <!-- Texto con degradado: el fondo es el degradado, se recorta a la forma
               de las letras (bg-clip-text) y el texto se hace transparente para que se vea -->
          <span class="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">en piloto automático</span>
        </h1>

        <!-- Subtítulo -->
        <p class="mt-6 text-lg leading-relaxed text-slate-400">
          Gimnasios, restaurantes, peluquerías o clínicas: tus clientes reservan online 24/7
          y tú te olvidas del teléfono y las libretas.
        </p>

        <!-- Botones: apilados en móvil (flex-col) y en fila a partir de sm (sm:flex-row).
             Son enlaces <a> porque llevan a otras secciones de la página -->
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
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

        <!-- Texto pequeño bajo los botones -->
        <p class="mt-4 text-sm text-slate-500">Sin tarjeta de crédito · Cancela cuando quieras</p>
      </div>

      <!-- Columna derecha: tarjeta de reserva (la hace Arnau en el #9) -->
      <div id="hero-card"></div>
    </div>
  `;
}
