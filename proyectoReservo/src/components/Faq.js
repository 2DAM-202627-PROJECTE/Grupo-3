// =============================================================
// Faq.js — Sección de preguntas frecuentes en acordeón (issue #18, RF5)
// Muestra 4 preguntas frecuentes desplegables. Cada una se abre y se
// cierra de forma individual y el icono "+" cambia a "−".
// =============================================================

// Datos de las 4 preguntas frecuentes con sus respuestas
const faqs = [
  {
    question: '¿Necesito conocimientos técnicos?',
    answer:
      'No, en absoluto. Reservo está diseñado para que cualquier persona pueda configurarlo en menos de 10 minutos sin tocar una sola línea de código.',
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer:
      'Sí, no tenemos permanencia. Puedes cancelar o cambiar de plan cuando quieras desde tu panel de control con un solo clic.',
  },
  {
    question: '¿Mis clientes tienen que descargarse una app?',
    answer:
      'No. Tus clientes acceden directamente desde cualquier navegador móvil o de escritorio a través de tu enlace personalizado o integrado en tu web e Instagram.',
  },
  {
    question: '¿Cómo cobro a mis clientes?',
    answer:
      'Puedes conectar tu cuenta de Stripe para cobrar por adelantado con tarjeta de crédito, solicitar una señal o permitir el pago presencial en tu propio local.',
  },
];

// Genera el HTML de cada elemento del acordeón usando <details> y <summary>
// native HTML: funciona con teclado y lectores de pantalla de forma accesible
function faqItem({ question, answer }, index) {
  return /*html*/ `
    <details 
      class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-slate-700 open:border-slate-700 open:bg-slate-850"
    >
      <summary 
        class="flex cursor-pointer items-center justify-between gap-4 font-semibold text-white list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg select-none"
      >
        <span class="text-base sm:text-lg">${question}</span>
        
        <!-- Icono + que cambia a − cuando está abierto (open) -->
        <span 
          class="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors group-hover:bg-slate-700 group-hover:text-white group-open:bg-indigo-600 group-open:text-white"
          aria-hidden="true"
        >
          <!-- Signo + visible cuando está cerrado -->
          <span class="text-lg font-medium leading-none group-open:hidden">+</span>
          <!-- Signo − visible cuando está abierto -->
          <span class="hidden text-lg font-medium leading-none group-open:inline">−</span>
        </span>
      </summary>

      <!-- Respuesta desplegable -->
      <p class="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
        ${answer}
      </p>
    </details>
  `;
}

// Pinta la sección dentro del contenedor que le pasa main.js (el <section id="faq">)
export function renderFaq(container) {
  // Espaciado vertical similar al resto de secciones
  container.className = 'py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      
      <!-- Cabecera de la sección -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Preguntas frecuentes
        </h2>
        <p class="mt-4 text-lg text-slate-400">
          Todo lo que necesitas saber antes de empezar con Reservo.
        </p>
      </div>

      <!-- Lista de acordeones apilados -->
      <div class="mt-12 flex flex-col gap-4">
        ${faqs.map(faqItem).join('')}
      </div>

    </div>
  `;
}

