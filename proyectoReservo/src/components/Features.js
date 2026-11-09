// =============================================================
// Features.js — Sección de funcionalidades (issue #11 e issue #13)
// Muestra un título, un subtítulo y un grid de 6 tarjetas con iconos Lucide.
//
// Partes del archivo:
//   1. Iconos               → los iconos de Lucide que se usan
//   2. Datos de las tarjetas → el array features
//   3. Tarjeta              → featureCard
//   4. HTML de la sección   → renderFeatures (lo llama main.js) y pintar los iconos
// =============================================================

// -------------------------------------------------------------
// 1. Iconos
// -------------------------------------------------------------

// createIcons convierte cada <i data-lucide="..."> en su dibujo SVG.
// Solo se importan los iconos que se usan: así el JavaScript final pesa menos.
import {
  createIcons,
  Calendar,
  Bell,
  CreditCard,
  Users,
  ChartColumn,
  Smartphone,
} from 'lucide';

// -------------------------------------------------------------
// 2. Datos de las tarjetas
// -------------------------------------------------------------

// Datos de las tarjetas.
// Cada objeto es una funcionalidad: un icono (nombre Lucide), un título y un texto.
// Si queremos añadir, quitar o cambiar una tarjeta, solo hay que tocar este array:
// el HTML se genera automáticamente a partir de él (ver featureCard).
const features = [
  {
    icon: 'calendar',
    title: 'Reservas online 24/7',
    text: 'Tu propia página de reservas lista en minutos, integrable en tu web o Instagram.',
  },
  {
    icon: 'bell',
    title: 'Recordatorios automáticos',
    text: 'Email, SMS y WhatsApp antes de cada cita. Reduce los "no-shows" hasta un 70%.',
  },
  {
    icon: 'credit-card',
    title: 'Pagos y señales',
    text: 'Cobra por adelantado, pide una señal o vende bonos y membresías.',
  },
  {
    icon: 'users',
    title: 'Gestión de equipo',
    text: 'Horarios por empleado, salas o mesas. Cada uno ve solo su agenda.',
  },
  {
    icon: 'chart-column',
    title: 'Estadísticas',
    text: 'Ocupación, ingresos y clientes recurrentes en un panel claro.',
  },
  {
    icon: 'smartphone',
    title: 'App móvil',
    text: 'Gestiona tu negocio desde el móvil, estés donde estés.',
  },
];

// -------------------------------------------------------------
// 3. Tarjeta
// -------------------------------------------------------------

// Devuelve el HTML de UNA tarjeta a partir de un objeto del array.
// Usamos desestructuración ({ icon, title, text }) para sacar las propiedades directamente.
function featureCard({ icon, title, text }) {
  return /*html*/ `
    <!-- Tarjeta: borde, esquinas redondeadas y fondo algo más claro que la página.
         Al pasar el ratón el borde se vuelve índigo y la tarjeta sube 4px con una sombra suave
         (motion-safe: lo de subir solo si no se han pedido animaciones reducidas).
         En móvil hay 2 tarjetas por fila, así que el relleno, el icono y el título
         son más pequeños y crecen a partir de sm: -->
    <article class="glass rounded-xl p-4 transition duration-200 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 motion-safe:hover:-translate-y-1 sm:p-6">
      <!-- Icono: es decorativo (el título ya dice lo que es), así que aria-hidden -->
      <div class="text-indigo-600" aria-hidden="true">
        <i data-lucide="${icon}" class="h-6 w-6 sm:h-7 sm:w-7"></i>
      </div>
      <h3 class="mt-3 text-base font-semibold text-slate-900 sm:mt-4 sm:text-lg">${title}</h3>
      <p class="mt-2 text-sm leading-relaxed text-slate-600">${text}</p>
    </article>
  `;
}

// -------------------------------------------------------------
// 4. HTML de la sección
// -------------------------------------------------------------

// Pinta la sección dentro del contenedor que le pasa main.js
// (el <section id="funciones">).
export function renderFeatures(container) {
  // Espaciado vertical de la sección: más grande en escritorio (lg:)
  container.className = 'py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <!-- Contenedor centrado con ancho máximo y márgenes laterales -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Cabecera de la sección: título y subtítulo centrados -->
      <div class="mx-auto max-w-2xl text-center">
        <!-- h2 porque el h1 ya es el título del Hero (solo puede haber uno) -->
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Todo lo que necesitas para gestionar reservas
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          Una sola herramienta para tu agenda, tus clientes y tus cobros.
        </p>
      </div>

      <!-- Grid de tarjetas: 2 columnas en móvil y tablet, y 3 en escritorio (lg:).
           En móvil van de dos en dos para reducir el scroll (apartado 7.2 del documento).
           features.map() convierte cada objeto del array en el HTML de su tarjeta,
           y .join('') une todas esas tarjetas en un solo string -->
      <div id="features-grid" class="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        ${features.map(featureCard).join('')}
      </div>
    </div>
  `;

  // Renderizar los iconos de Lucide dentro del contenedor de la sección
  createIcons({
    root: container,
    icons: {
      Calendar,
      Bell,
      CreditCard,
      Users,
      ChartColumn,
      Smartphone,
    },
  });
}
