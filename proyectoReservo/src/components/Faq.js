// =============================================================
// Faq.js — Sección de preguntas frecuentes en acordeón (issue #18, RF5)
// Muestra 4 preguntas frecuentes desplegables. Cada una se abre y se
// cierra de forma individual y el icono "+" cambia a "−".
// =============================================================

// Datos de las 4 preguntas frecuentes con sus respuestas
import { t } from '../i18n.js';

const faqs = [
  {
    question: 'faq.technicalQuestion',
    answer: 'faq.technicalAnswer',
  },
  {
    question: 'faq.cancelQuestion',
    answer: 'faq.cancelAnswer',
  },
  {
    question: 'faq.appQuestion',
    answer: 'faq.appAnswer',
  },
  {
    question: 'faq.paymentsQuestion',
    answer: 'faq.paymentsAnswer',
  },
];

// Genera el HTML de cada elemento del acordeón usando <details> y <summary>
// native HTML: funciona con teclado y lectores de pantalla de forma accesible
function faqItem({ question, answer }) {
  return /*html*/ `
    <!-- Cada pregunta es una tarjeta de cristal (glass de style.css).
         open:bg-white/80: la pregunta abierta tiene el fondo más opaco, para que la respuesta se lea bien.
         Al pasar el ratón y abierta, el borde se vuelve índigo muy claro -->
    <details 
      class="group glass rounded-xl p-6 transition-colors hover:border-indigo-200 open:border-indigo-200 open:bg-white/80"
    >
      <!-- list-none quita el triángulo por defecto de <summary> en Chrome y Firefox.
           Safari lo dibuja con ::-webkit-details-marker, así que hace falta
           [&::-webkit-details-marker]:hidden para quitarlo también ahí -->
      <summary 
        class="flex cursor-pointer items-center justify-between gap-4 font-semibold text-slate-900 list-none [&::-webkit-details-marker]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg select-none"
      >
        <span data-i18n="${question}" class="text-base sm:text-lg">${t(question)}</span>
        
        <!-- Icono + que cambia a − cuando está abierto (open) -->
        <span 
          class="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-200 group-hover:text-slate-900 group-open:bg-indigo-600 group-open:text-white"
          aria-hidden="true"
        >
          <!-- Signo + visible cuando está cerrado -->
          <span class="text-lg font-medium leading-none group-open:hidden">+</span>
          <!-- Signo − visible cuando está abierto -->
          <span class="hidden text-lg font-medium leading-none group-open:inline">−</span>
        </span>
      </summary>

      <!-- Respuesta desplegable -->
      <p class="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
        <span data-i18n="${answer}">${t(answer)}</span>
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
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          <span data-i18n="faq.heading">${t('faq.heading')}</span>
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          <span data-i18n="faq.description">${t('faq.description')}</span>
        </p>
      </div>

      <!-- Lista de acordeones apilados -->
      <div class="mt-12 flex flex-col gap-4">
        ${faqs.map(faqItem).join('')}
      </div>

    </div>
  `;
}
