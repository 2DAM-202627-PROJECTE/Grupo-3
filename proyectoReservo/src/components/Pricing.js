// =============================================================
// Pricing.js — Sección de precios (issue #14)
// Muestra un título, un subtítulo y una tarjeta por cada plan.
// (El plan Pro destacado y el interruptor mensual/anual son el issue #16)
// =============================================================

// Pinta la sección dentro del contenedor que le pasa main.js
// (el <section id="precios">).
export function renderPricing(container) {
  // Espaciado vertical de la sección: más grande en escritorio (lg:)
  container.className = 'py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <!-- Contenedor centrado con ancho máximo y márgenes laterales -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Cabecera de la sección: título y subtítulo centrados -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Precios simples y transparentes
        </h2>
        <p class="mt-4 text-lg text-slate-400">
          14 días gratis en cualquier plan. Sin permanencia.
        </p>
      </div>

      <!-- Aquí se meterán las tarjetas de los planes (parte 3) -->
      <div id="pricing-grid" class="mt-14 grid gap-6"></div>
    </div>
  `;
}
