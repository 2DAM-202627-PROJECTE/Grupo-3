// =============================================================
// CookieBanner.js — Aviso de cookies (issue #24)
// Barra fija abajo de la pantalla con los botones Aceptar y Rechazar.
// Sale en la primera visita (apartado 1.4 del documento, requisito 10).
//
// Partes del archivo:
//   1. Configuración → constantes que usa el resto del archivo
//   2. HTML del aviso → renderCookieBanner (lo llama main.js)
// =============================================================

// -------------------------------------------------------------
// 1. Configuración
// -------------------------------------------------------------

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad).
// El documento pide que el aviso de cookies también se pueda usar con el teclado (apartado 3.2)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400';

// Clases de los botones. Los dos tienen el mismo tamaño: rechazar tiene que ser
// igual de fácil que aceptar (RGPD). Aceptar va relleno y Rechazar con borde,
// como los botones principal y secundario del Hero.
const buttonBase = `rounded-lg px-5 py-2.5 text-sm font-semibold transition ${focusRing}`;
const buttonPrimary = 'bg-indigo-600 text-white hover:bg-indigo-500';
const buttonSecondary = 'border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700';

// -------------------------------------------------------------
// 2. HTML del aviso
// -------------------------------------------------------------

// Pinta el aviso dentro del contenedor que le pasa main.js
// (el <div id="cookie-banner">, que va fuera de #app, directamente en el <body>).
export function renderCookieBanner(container) {
  // fixed inset-x-0 bottom-0: el aviso se queda pegado abajo, de lado a lado,
  // aunque el usuario haga scroll. z-50 lo pone por encima del resto de la página.
  // role="region" + aria-label: el lector de pantalla lo anuncia como "Aviso de cookies"
  // y el usuario puede saltar directamente a él
  container.className = 'fixed inset-x-0 bottom-0 z-50 p-4';
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Aviso de cookies');

  container.innerHTML = /*html*/ `
    <!-- Tarjeta del aviso: centrada y con ancho máximo.
         En móvil el texto va encima de los botones (flex-col) y a partir de sm van en fila -->
    <div class="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-lg shadow-black/40 sm:flex-row sm:items-center">
      <!-- Texto del aviso. flex-1: ocupa el espacio que dejan los botones.
           El enlace lleva a la página de la política de cookies (politica-cookies.html).
           Va subrayado para que se vea que es un enlace sin depender solo del color -->
      <p class="flex-1 text-sm text-slate-300">
        Usamos cookies propias para que la web funcione y, si las aceptas,
        cookies de análisis para mejorarla. Más información en nuestra
        <a href="/politica-cookies.html" class="rounded text-indigo-300 underline hover:text-indigo-200 ${focusRing}">política de cookies</a>.
      </p>

      <!-- Botones. data-cookie-choice guarda la opción de cada uno ("accepted" o "rejected"),
           así el JavaScript (parte 5) sabe qué se ha elegido sin mirar el texto del botón.
           shrink-0: los botones no se aplastan aunque el texto sea largo -->
      <div class="flex shrink-0 gap-3">
        <button type="button" data-cookie-choice="rejected" class="flex-1 sm:flex-none ${buttonBase} ${buttonSecondary}">
          Rechazar
        </button>
        <button type="button" data-cookie-choice="accepted" class="flex-1 sm:flex-none ${buttonBase} ${buttonPrimary}">
          Aceptar
        </button>
      </div>
    </div>
  `;
}
