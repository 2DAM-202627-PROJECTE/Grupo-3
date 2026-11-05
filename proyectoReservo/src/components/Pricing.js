// =============================================================
// Pricing.js — Sección de precios (issue #14)
// Muestra un título, un subtítulo y una tarjeta por cada plan.
// (El plan Pro destacado y el interruptor mensual/anual son el issue #16)
//
// Partes del archivo:
//   1. Datos de los planes       → plans y el descuento anual
//   2. Cálculo del precio        → annualPrice y priceBlock
//   3. Tarjeta de un plan        → estilos de los botones y planCard
//   4. HTML de la sección        → renderPricing (lo llama main.js)
//   5. Interruptor mensual/anual → resaltar opciones y setupBillingToggle
// =============================================================

// -------------------------------------------------------------
// 1. Datos de los planes
// -------------------------------------------------------------

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

// Descuento del pago anual: 20 % (apartado 2.4 del documento).
const ANNUAL_DISCOUNT = 0.2;

// -------------------------------------------------------------
// 2. Cálculo del precio
// -------------------------------------------------------------

// Precio mensual con el descuento anual aplicado, redondeado a euros enteros.
// 19 € → 15 €  y  49 € → 39 €, como en la tabla del documento.
function annualPrice(price) {
  return Math.round(price * (1 - ANNUAL_DISCOUNT));
}

// Devuelve el HTML del bloque de precio de un plan: el precio y una nota debajo.
//   - annual = false → precio mensual ("19€/mes")
//   - annual = true  → precio con descuento ("15€/mes") y el total al año
// Si el precio es null → "A medida" y sin nota.
function priceBlock(price, annual = false) {
  if (price === null) {
    // La nota vacía (h-5) ocupa el mismo alto que en los otros planes,
    // así las listas de las 3 tarjetas empiezan a la misma altura
    return /*html*/ `
      <p class="text-4xl font-extrabold text-white">A medida</p>
      <p class="mt-1 h-5 text-xs text-slate-400"></p>
    `;
  }

  const value = annual ? annualPrice(price) : price;
  const note = annual ? `Facturado anualmente (${value * 12} €/año)` : 'Facturado mensualmente';

  return /*html*/ `
    <p class="text-4xl font-extrabold text-white">
      ${value}€<span class="text-base font-normal text-slate-400">/mes</span>
    </p>
    <p class="mt-1 h-5 text-xs text-slate-400">${note}</p>
  `;
}

// -------------------------------------------------------------
// 3. Tarjeta de un plan
// -------------------------------------------------------------

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

      <!-- Precio. Al empezar se muestra el mensual.
           data-price guarda el precio mensual para que el interruptor pueda recalcularlo.
           El plan "A medida" no lo lleva porque su precio no cambia.
           transition-opacity duration-150: los cambios de opacidad duran 150 ms (el fundido).
           motion-reduce:transition-none: si el usuario ha pedido en su sistema reducir las
           animaciones, el cambio es instantáneo -->
      <div class="mt-6 transition-opacity duration-150 motion-reduce:transition-none" ${price !== null ? `data-price="${price}"` : ''}>
        ${priceBlock(price)}
      </div>

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

// -------------------------------------------------------------
// 4. HTML de la sección
// -------------------------------------------------------------

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

      <!-- Interruptor mensual/anual: "Mensual" [interruptor] "Anual" "-20 %".
           La opción activa sale en blanco y la otra en gris (lo cambia setBilling).
           data-billing-label sirve para encontrar cada palabra desde el JavaScript.
           Las palabras también se pueden pulsar: cursor-pointer muestra la manita,
           select-none evita que se seleccione el texto al hacer clic rápido, y py-3
           agranda la zona de pulsación hasta 44 px de alto (mínimo para móvil, apartado 8.2.2) -->
      <div class="mt-10 flex items-center justify-center gap-3 text-sm font-medium">
        <span data-billing-label="monthly" class="cursor-pointer select-none py-3 text-white transition-colors">Mensual</span>

        <!-- El interruptor es un <button> con role="switch": así los lectores de pantalla
             lo anuncian como un interruptor y se puede usar con el teclado (Tab + Espacio).
             aria-checked indica si está activado ("true" = anual) y aria-label le pone nombre.
             Todo el aspecto depende de aria-checked, con las variantes de Tailwind:
               - aria-checked:bg-indigo-600 → el fondo se vuelve índigo al activarlo
               - group + group-aria-checked:translate-x-6 → la bolita se mueve a la derecha
             Así, el JavaScript (setupBillingToggle) solo tiene que cambiar aria-checked.
             before:absolute before:-inset-2 crea una capa invisible 8 px más grande por cada lado:
             el interruptor se ve igual, pero la zona que se puede pulsar mide 64×44 px.
             Hover (al pasar el ratón) el fondo se aclara un poco para indicar que se puede pulsar:
               - apagado: hover:bg-slate-600 (gris algo más claro)
               - encendido: aria-checked:hover:bg-indigo-500 (índigo algo más claro) -->
        <button
          type="button"
          id="billing-toggle"
          role="switch"
          aria-checked="false"
          aria-label="Pago anual"
          class="group relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-slate-700 transition before:absolute before:-inset-2 hover:bg-slate-600 aria-checked:bg-indigo-600 aria-checked:hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <!-- Bolita del interruptor: empieza a la izquierda (translate-x-1) -->
          <span class="inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition group-aria-checked:translate-x-6"></span>
        </button>

        <span data-billing-label="annual" class="cursor-pointer select-none py-3 text-slate-400 transition-colors">Anual</span>
        <!-- Etiqueta con el descuento del pago anual (apartado 2.4 del documento).
             En mensual es suave (fondo cian transparente) y en anual se rellena de cian
             para reforzar que el descuento se está aplicando (lo cambia setBilling) -->
        <span data-billing-badge class="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300 transition-colors">-20 %</span>
      </div>

      <!-- Aviso para lectores de pantalla. No se ve (sr-only = "screen reader only"),
           pero aria-live="polite" hace que el lector lea su texto cada vez que cambia,
           cuando termine lo que esté diciendo. Empieza vacío para que no se lea nada al cargar.
           Así, quien no ve la pantalla se entera de que los precios han cambiado -->
      <p data-billing-status class="sr-only" aria-live="polite"></p>

      <!-- Grid de tarjetas: 1 columna en móvil (con ancho máximo para que no queden
           demasiado anchas) y 3 columnas en escritorio (lg:).
           plans.map() convierte cada plan en su tarjeta y .join('') las une en un string -->
      <div id="pricing-grid" class="mx-auto mt-12 grid max-w-md gap-6 lg:max-w-none lg:grid-cols-3">
        ${plans.map(planCard).join('')}
      </div>
    </div>
  `;

  // Una vez pintado el HTML, se activa el interruptor
  setupBillingToggle(container);
}

// -------------------------------------------------------------
// 5. Interruptor mensual/anual
// -------------------------------------------------------------

// Pone una palabra del interruptor en blanco (activa) o en gris (inactiva).
// El gris es slate-400 y no slate-500 para mantener un contraste mínimo de 4.5:1 (apartado 3.2).
// classList.toggle(clase, condición) añade la clase si la condición es true y la quita si es false.
function highlightLabel(label, active) {
  label.classList.toggle('text-white', active);
  label.classList.toggle('text-slate-400', !active);
}

// Pone la etiqueta "-20 %" rellena (descuento activo) o suave (inactivo).
//   - activo:   fondo cian sólido y texto casi negro (slate-950), que contrasta bien sobre el cian
//   - inactivo: fondo cian transparente y texto cian claro, como al cargar la página
function highlightBadge(badge, active) {
  badge.classList.toggle('bg-cyan-500', active);
  badge.classList.toggle('text-slate-950', active);
  badge.classList.toggle('bg-cyan-500/10', !active);
  badge.classList.toggle('text-cyan-300', !active);
}

// Lógica del interruptor mensual/anual.
// Al pulsarlo cambia su estado y actualiza solo los precios, sin volver a pintar toda la sección.
function setupBillingToggle(container) {
  // --- Elementos que cambian al cambiar de modo ---
  const toggle = container.querySelector('#billing-toggle');
  const monthlyLabel = container.querySelector('[data-billing-label="monthly"]');
  const annualLabel = container.querySelector('[data-billing-label="annual"]');
  const discountBadge = container.querySelector('[data-billing-badge]');
  const status = container.querySelector('[data-billing-status]');

  // --- Cambiar de modo ---

  // Aplica un modo de facturación: annual = true (anual) o false (mensual).
  // Todo lo que tiene que cambiar al cambiar de modo está aquí, en un solo sitio.
  function setBilling(annual) {
    // Si ya estamos en ese modo (por ejemplo, pulsar "Anual" estando en anual),
    // no se hace nada: así los precios no parpadean sin motivo
    if (toggle.getAttribute('aria-checked') === String(annual)) {
      return;
    }

    // Al cambiar aria-checked, Tailwind mueve la bolita y cambia el color solo
    // (y el lector de pantalla anuncia "activado" / "desactivado")
    toggle.setAttribute('aria-checked', String(annual));

    // Resalta la palabra de la opción activa y apaga la otra
    highlightLabel(monthlyLabel, !annual);
    highlightLabel(annualLabel, annual);

    // Rellena la etiqueta "-20 %" solo cuando el descuento anual está activo
    highlightBadge(discountBadge, annual);

    // Texto que leerá el lector de pantalla (por el aria-live del párrafo).
    // textContent y no innerHTML: es solo texto, sin etiquetas
    status.textContent = annual
      ? 'Mostrando precios con pago anual, con un 20 % de descuento'
      : 'Mostrando precios con pago mensual';

    // Recorre los bloques de precio que tienen data-price (Básico y Pro)
    // y los vuelve a generar con el precio mensual o el anual, con un fundido:
    //   1. opacity-0 → el precio se desvanece (150 ms, por la transición del bloque)
    //   2. cuando ya es invisible (setTimeout de 150 ms) se cambia el contenido
    //   3. se quita opacity-0 → el precio nuevo aparece poco a poco
    // Se usa innerHTML porque el contenido sale de nuestros datos, no de lo que escribe el usuario
    container.querySelectorAll('[data-price]').forEach((block) => {
      const price = Number(block.dataset.price); // data-price="19" → 19 (número)

      block.classList.add('opacity-0');
      setTimeout(() => {
        block.innerHTML = priceBlock(price, annual);
        block.classList.remove('opacity-0');
      }, 150);
    });
  }

  // --- Clics del usuario ---

  // Al pulsar el interruptor se pasa al modo contrario del actual
  toggle.addEventListener('click', () => {
    const isAnnual = toggle.getAttribute('aria-checked') === 'true';
    setBilling(!isAnnual);
  });

  // Al pulsar una palabra se va directamente a ese modo (no al contrario):
  // pulsar "Anual" estando ya en anual no cambia nada.
  // Con el teclado no hace falta: el interruptor ya se puede usar con Tab + Espacio
  monthlyLabel.addEventListener('click', () => setBilling(false));
  annualLabel.addEventListener('click', () => setBilling(true));
}
