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
//   - featured:    true si es el plan recomendado (se destaca visualmente)
// El precio se guarda como número y no como texto ("19€") para poder
// calcular el precio anual más adelante (issue #16).
// Los datos siguen la tabla del apartado 2.4 del documento de planificación.
const plans = [
  {
    name: 'Básico',
    description: 'Autónomos y negocios con un profesional',
    price: 19,
    features: [
      '1 profesional',
      'Reservas online 24/7',
      'Recordatorios por email',
      'Estadísticas básicas',
      'Soporte por email',
    ],
    cta: 'Elegir plan',
  },
  {
    name: 'Pro',
    description: 'Negocios con equipo',
    price: 49,
    features: [
      'Hasta 5 profesionales',
      'Recordatorios por email y WhatsApp',
      'Pagos y señales',
      'Estadísticas completas',
      'Soporte por email y chat',
    ],
    cta: 'Empezar prueba',
    featured: true,
  },
  {
    name: 'Empresa',
    description: 'Cadenas y negocios con varios locales',
    price: null,
    features: [
      'Profesionales ilimitados',
      'Locales ilimitados',
      'Recordatorios por email y WhatsApp',
      'Pagos y señales',
      'Gestor dedicado',
    ],
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

// Clases de los dos estilos de botón: el principal (relleno índigo) para el plan
// destacado y el secundario (con borde) para el resto.
const buttonBase =
  'mt-8 rounded-lg px-6 py-3 text-center font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400';
const buttonPrimary = 'bg-indigo-600 text-white hover:bg-indigo-500';
const buttonSecondary = 'border border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800';

// Devuelve el HTML de UNA tarjeta de plan a partir de un objeto del array.
// featured = false por defecto, así los planes que no lo tienen no se destacan.
function planCard({ name, description, price, features, cta, featured = false }) {
  // Estilos de la tarjeta según si es el plan destacado o no:
  // el destacado lleva borde índigo, fondo índigo oscuro y una sombra suave.
  // "relative" hace falta para colocar el badge "Más popular" encima de la tarjeta.
  const cardClasses = featured
    ? 'relative border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/10'
    : 'border-slate-800 bg-slate-800/30';

  // El badge solo existe en el plan destacado. Si no lo es, se deja un string vacío.
  // absolute + -top-3 + left-1/2 + -translate-x-1/2: centrado sobre el borde superior.
  const badge = featured
    ? /*html*/ `<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">Más popular</span>`
    : '';

  return /*html*/ `
    <!-- Tarjeta: flex en columna para poder empujar el botón al fondo
         y que los botones de las 3 tarjetas queden alineados -->
    <article class="flex flex-col rounded-xl border p-8 ${cardClasses}">
      ${badge}

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

      <!-- Botón del plan: lleva al formulario de prueba gratuita (#cta).
           Principal en el plan destacado y secundario en los demás -->
      <a href="#cta" class="${buttonBase} ${featured ? buttonPrimary : buttonSecondary}">
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

      <!-- Interruptor mensual/anual: "Mensual" [interruptor] "Anual" "-20 %" -->
      <div class="mt-10 flex items-center justify-center gap-3 text-sm font-medium">
        <span class="text-slate-300">Mensual</span>

        <!-- El interruptor es un <button> con role="switch": así los lectores de pantalla
             lo anuncian como un interruptor y se puede usar con el teclado (Tab + Espacio).
             aria-checked indica si está activado ("true" = anual) y aria-label le pone nombre.
             Todo el aspecto depende de aria-checked, con las variantes de Tailwind:
               - aria-checked:bg-indigo-600 → el fondo se vuelve índigo al activarlo
               - group + group-aria-checked:translate-x-6 → la bolita se mueve a la derecha
             Así, en la parte 3 el JavaScript solo tendrá que cambiar aria-checked -->
        <button
          type="button"
          id="billing-toggle"
          role="switch"
          aria-checked="false"
          aria-label="Pago anual"
          class="group relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-slate-700 transition aria-checked:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <!-- Bolita del interruptor: empieza a la izquierda (translate-x-1) -->
          <span class="inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition group-aria-checked:translate-x-6"></span>
        </button>

        <span class="text-slate-300">Anual</span>
        <!-- Etiqueta con el descuento del pago anual (apartado 2.4 del documento) -->
        <span class="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">-20 %</span>
      </div>

      <!-- Grid de tarjetas: 1 columna en móvil (con ancho máximo para que no queden
           demasiado anchas) y 3 columnas en escritorio (lg:).
           plans.map() convierte cada plan en su tarjeta y .join('') las une en un string -->
      <div id="pricing-grid" class="mx-auto mt-12 grid max-w-md gap-6 lg:max-w-none lg:grid-cols-3">
        ${plans.map(planCard).join('')}
      </div>
    </div>
  `;
}
