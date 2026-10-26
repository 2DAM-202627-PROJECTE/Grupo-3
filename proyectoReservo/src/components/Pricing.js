// =============================================================
// Pricing.js — Sección de precios (issue #14)
// Muestra un título, un subtítulo y una tarjeta por cada plan.
// (El plan Pro destacado y el interruptor mensual/anual son el issue #16)
// =============================================================

// Datos de los planes.
// Cada objeto es un plan con:
//   - name:        nombre del plan
//   - description: frase corta debajo del nombre
//   - price:       precio mensual en euros (número). null = "A medida"
//   - features:    lista de características (cada una saldrá con un ✓)
//   - cta:         texto del botón (CTA = "call to action", llamada a la acción)
// El precio se guarda como número y no como texto ("19€") para poder
// calcular el precio anual más adelante (issue #16).
const plans = [
  {
    name: 'Básico',
    description: 'Para empezar',
    price: 19,
    features: ['1 profesional', 'Reservas ilimitadas', 'Recordatorios por email'],
    cta: 'Elegir plan',
  },
  {
    name: 'Pro',
    description: 'Para negocios en crecimiento',
    price: 49,
    features: ['Hasta 10 profesionales', 'SMS y WhatsApp', 'Pagos online y bonos', 'Estadísticas'],
    cta: 'Empezar prueba',
  },
  {
    name: 'Empresa',
    description: 'Cadenas y franquicias',
    price: null,
    features: ['Profesionales ilimitados', 'Varios locales', 'API e integraciones', 'Soporte prioritario'],
    cta: 'Contactar',
  },
];

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
