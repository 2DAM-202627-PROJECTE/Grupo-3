// =============================================================
// HowItWorks.js — Sección "Cómo funciona" en 3 pasos (issue #12)
// Muestra el título, subtítulo y 3 pasos explicativos con
// círculo numerado en degradado, desarrollados con detalle.
// =============================================================

// Datos de los 3 pasos.
// El profesor pidió desarrollarlos con más detalle (issue #12).
// Cada objeto contiene:
//   - number: número del paso
//   - title: título del paso
//   - text: descripción detallada del proceso
const steps = [
  {
    number: 1,
    title: 'Crea tu cuenta',
    text: 'Regístrate gratis en menos de dos minutos. Selecciona tu sector (peluquería, clínica, restaurante o gimnasio) y personaliza el nombre y la marca de tu negocio.',
  },
  {
    number: 2,
    title: 'Configura tus servicios',
    text: 'Define tus horarios, disponibilidad y duración de cada cita. Añade tu catálogo de servicios, precios, empleados asignados o mesas y salas según tu actividad.',
  },
  {
    number: 3,
    title: 'Comparte tu enlace',
    text: 'Publica tu enlace de reservas en tu web, perfil de Instagram, WhatsApp o Google Business. Tus clientes reservarán y pagarán online de forma autónoma 24/7.',
  },
];

// Genera el HTML de una tarjeta/paso
function stepItem({ number, title, text }) {
  return /*html*/ `
    <article class="flex flex-col items-center text-center">
      <!-- Círculo numerado con degradado índigo a cian -->
      <div 
        class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-xl font-bold text-white shadow-lg shadow-indigo-500/25"
        aria-hidden="true"
      >
        ${number}
      </div>

      <!-- Título del paso -->
      <h3 class="mt-6 text-xl font-semibold text-white">
        ${title}
      </h3>

      <!-- Descripción desarrollada -->
      <p class="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
        ${text}
      </p>
    </article>
  `;
}

// Pinta la sección dentro del contenedor que le pasa main.js (el <section id="como-funciona">)
export function renderHowItWorks(container) {
  // Fondo más oscuro (bg-slate-950/60) y bordes sutiles para alternar y destacar la sección
  container.className = 'border-y border-slate-800/60 bg-slate-950/60 py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Cabecera de la sección -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Empieza en 3 pasos
        </h2>
        <p class="mt-4 text-lg text-slate-400">
          En menos de 10 minutos tendrás tu agenda online.
        </p>
      </div>

      <!-- Grid de los 3 pasos: 1 columna en móvil, 3 en escritorio -->
      <div class="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
        ${steps.map(stepItem).join('')}
      </div>

    </div>
  `;
}

