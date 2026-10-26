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

// Devuelve el HTML del precio de un plan.
// Si el precio es un número → "19€ /mes". Si es null → "A medida".
function formatPrice(price) {
  if (price === null) {
    return 'A medida';
  }
  return /*html*/ `${price}€<span class="text-base font-normal text-slate-400">/mes</span>`;
}

// Devuelve el HTML de UNA tarjeta de plan a partir de un objeto del array.
function planCard({ name, description, price, features, cta }) {
  return /*html*/ `
    <!-- Tarjeta: flex en columna para poder empujar el botón al fondo
         y que los botones de las 3 tarjetas queden alineados -->
    <article class="flex flex-col rounded-xl border border-slate-800 bg-slate-800/30 p-8">
      <!-- Nombre y descripción del plan -->
      <h3 class="text-lg font-semibold text-white">${name}</h3>
      <p class="mt-1 text-sm text-slate-400">${description}</p>

      <!-- Precio -->
      <p class="mt-6 text-4xl font-extrabold text-white">${formatPrice(price)}</p>

      <!-- Lista de características. Cada texto del array se convierte en un <li> con un ✓ delante.
           El ✓ es decorativo (aria-hidden): el lector de pantalla ya sabe que es una lista.
           flex-1 hace que la lista ocupe todo el espacio que sobra en la tarjeta, así el botón
           queda siempre abajo aunque un plan tenga menos características que otro -->
      <ul class="mt-6 flex-1 space-y-3 text-sm text-slate-300">
        ${features
          .map(
            (feature) => /*html*/ `
              <li class="flex items-center gap-2">
                <span class="text-indigo-400" aria-hidden="true">✓</span>
                ${feature}
              </li>
            `
          )
          .join('')}
      </ul>

      <!-- Botón del plan: lleva al formulario de prueba gratuita (#cta) -->
      <a href="#cta" class="mt-8 rounded-lg border border-slate-700 bg-slate-800/60 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
        ${cta}
      </a>
    </article>
  `;
}

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

      <!-- Grid de tarjetas: 1 columna en móvil (con ancho máximo para que no queden
           demasiado anchas) y 3 columnas en escritorio (lg:).
           plans.map() convierte cada plan en su tarjeta y .join('') las une en un string -->
      <div id="pricing-grid" class="mx-auto mt-14 grid max-w-md gap-6 lg:max-w-none lg:grid-cols-3">
        ${plans.map(planCard).join('')}
      </div>
    </div>
  `;
}
