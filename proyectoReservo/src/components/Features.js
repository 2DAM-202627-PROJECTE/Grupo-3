// =============================================================
// Features.js — Sección de funcionalidades (issue #11)
// Muestra un título, un subtítulo y un grid de 6 tarjetas.
// =============================================================

// Datos de las tarjetas.
// Cada objeto es una funcionalidad: un icono (emoji), un título y un texto.
// Si queremos añadir, quitar o cambiar una tarjeta, solo hay que tocar este array:
// el HTML se genera automáticamente a partir de él (ver featureCard).
const features = [
  {
    icon: '📅',
    title: 'Reservas online 24/7',
    text: 'Tu propia página de reservas lista en minutos, integrable en tu web o Instagram.',
  },
  {
    icon: '🔔',
    title: 'Recordatorios automáticos',
    text: 'Email, SMS y WhatsApp antes de cada cita. Reduce los "no-shows" hasta un 70%.',
  },
  {
    icon: '💳',
    title: 'Pagos y señales',
    text: 'Cobra por adelantado, pide una señal o vende bonos y membresías.',
  },
  {
    icon: '👥',
    title: 'Gestión de equipo',
    text: 'Horarios por empleado, salas o mesas. Cada uno ve solo su agenda.',
  },
  {
    icon: '📊',
    title: 'Estadísticas',
    text: 'Ocupación, ingresos y clientes recurrentes en un panel claro.',
  },
  {
    icon: '📱',
    title: 'App móvil',
    text: 'Gestiona tu negocio desde el móvil, estés donde estés.',
  },
];

// Devuelve el HTML de UNA tarjeta a partir de un objeto del array.
// Usamos desestructuración ({ icon, title, text }) para sacar las propiedades directamente.
function featureCard({ icon, title, text }) {
  return `
    <!-- Tarjeta: borde, esquinas redondeadas y fondo algo más claro que la página.
         Al pasar el ratón el borde se vuelve índigo -->
    <article class="rounded-xl border border-slate-800 bg-slate-800/30 p-6 transition hover:border-indigo-500/50">
      <!-- Icono: es decorativo (el título ya dice lo que es), así que aria-hidden -->
      <div class="text-3xl" aria-hidden="true">${icon}</div>
      <h3 class="mt-4 text-lg font-semibold text-white">${title}</h3>
      <p class="mt-2 text-sm leading-relaxed text-slate-400">${text}</p>
    </article>
  `;
}

// Pinta la sección dentro del contenedor que le pasa main.js
// (el <section id="funciones">).
export function renderFeatures(container) {
  // Espaciado vertical de la sección: más grande en escritorio (lg:)
  container.className = 'py-20 lg:py-28';

  container.innerHTML = `
    <!-- Contenedor centrado con ancho máximo y márgenes laterales -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Cabecera de la sección: título y subtítulo centrados -->
      <div class="mx-auto max-w-2xl text-center">
        <!-- h2 porque el h1 ya es el título del Hero (solo puede haber uno) -->
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Todo lo que necesitas para gestionar reservas
        </h2>
        <p class="mt-4 text-lg text-slate-400">
          Una sola herramienta para tu agenda, tus clientes y tus cobros.
        </p>
      </div>

      <!-- Grid de tarjetas: 1 columna en móvil, 2 en tablet (md:) y 3 en escritorio (lg:).
           features.map() convierte cada objeto del array en el HTML de su tarjeta,
           y .join('') une todas esas tarjetas en un solo string -->
      <div id="features-grid" class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${features.map(featureCard).join('')}
      </div>
    </div>
  `;
}
