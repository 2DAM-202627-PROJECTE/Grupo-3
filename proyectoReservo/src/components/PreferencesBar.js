// =============================================================
// PreferencesBar.js — Aviso de cookies (issue #24)
// Ojo: el archivo, las funciones y el id NO llevan la palabra "cookie" a propósito.
// Los bloqueadores de anuncios (uBlock, AdBlock, Brave…) bloquean los archivos y ocultan
// los elementos con nombres como "CookieBanner.js" o "#cookie-banner". Si bloquean este
// archivo, main.js no puede importarlo y la página entera se queda en blanco.
// Barra fija abajo de la pantalla con los botones Aceptar y Rechazar.
// Sale en la primera visita (apartado 1.4 del documento, requisito 10):
// la elección se guarda y el aviso ya no vuelve a salir.
//
// Partes del archivo:
//   1. Configuración     → constantes que usa el resto del archivo
//   2. Elección guardada → leer y guardar la opción en localStorage
//   3. HTML del aviso    → renderPreferencesBar (lo llama main.js)
//   4. Botones           → setupPreferencesBar (guardar la opción y cerrar el aviso)
// =============================================================

// -------------------------------------------------------------
// 1. Configuración
// -------------------------------------------------------------

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad).
// El documento pide que el aviso de cookies también se pueda usar con el teclado (apartado 3.2)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

// Clases de los botones. Los dos tienen el mismo tamaño: rechazar tiene que ser
// igual de fácil que aceptar (RGPD). Aceptar va relleno y Rechazar con borde,
// como los botones principal y secundario del Hero.
const buttonBase = `rounded-lg px-5 py-2.5 text-sm font-semibold transition ${focusRing}`;
const buttonPrimary = 'bg-indigo-600 text-white hover:bg-indigo-500';
const buttonSecondary = 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100';

// Nombre con el que se guarda la elección en el localStorage del navegador.
// Es el mismo que aparece en la tabla de politica-cookies.html
const STORAGE_KEY = 'reservo-cookies';

// -------------------------------------------------------------
// 2. Elección guardada (localStorage)
// -------------------------------------------------------------

// Devuelve la opción guardada: "accepted", "rejected" o null si aún no ha elegido.
// localStorage se guarda en el navegador y sigue ahí en las siguientes visitas
// (apartado 3 del documento: "La elección se guardará en localStorage").
// Se exporta para que, si algún día se añaden cookies de análisis, se pueda
// comprobar con getCookieChoice() === 'accepted' antes de cargarlas.
export function getCookieChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // Si el navegador bloquea localStorage, se trata como si no hubiera elegido
    return null;
  }
}

// Guarda la opción elegida ("accepted" o "rejected")
function saveCookieChoice(choice) {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Si no se puede guardar, el aviso se cierra igual; volverá a salir en la próxima visita
  }
}

// -------------------------------------------------------------
// 3. HTML del aviso
// -------------------------------------------------------------

// Pinta el aviso dentro del contenedor que le pasa main.js
// (el <div id="preferences-bar">, que va fuera de #app, directamente en el <body>).
export function renderPreferencesBar(container) {
  // Si ya eligió en una visita anterior, el aviso no se pinta y no se hace nada más
  if (getCookieChoice() !== null) {
    container.remove();
    return;
  }

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
    <div class="mx-auto flex max-w-3xl flex-col gap-4 glass rounded-xl bg-white/85 p-5 sm:flex-row sm:items-center">
      <!-- Texto del aviso. flex-1: ocupa el espacio que dejan los botones.
           El enlace lleva a la página de la política de cookies (politica-cookies.html).
           import.meta.env.BASE_URL es la ruta base de la web ("/" en local y "/Grupo-3/" en GitHub Pages).
           Va subrayado para que se vea que es un enlace sin depender solo del color -->
      <p class="flex-1 text-sm text-slate-700">
        Usamos cookies propias para que la web funcione y, si las aceptas,
        cookies de análisis para mejorarla. Más información en nuestra
        <a href="${import.meta.env.BASE_URL}politica-cookies.html" class="rounded text-indigo-700 underline hover:text-indigo-900 ${focusRing}">política de cookies</a>.
      </p>

      <!-- Botones. data-cookie-choice guarda la opción de cada uno ("accepted" o "rejected"),
           así el JavaScript (setupPreferencesBar) sabe qué se ha elegido sin mirar el texto del botón.
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

  // Una vez pintado el HTML, se activan los botones
  setupPreferencesBar(container);
}

// -------------------------------------------------------------
// 4. Botones
// -------------------------------------------------------------

// Al pulsar Aceptar o Rechazar: se guarda la opción y se quita el aviso de la página.
function setupPreferencesBar(container) {
  // querySelectorAll devuelve los dos botones; forEach les pone el mismo evento a cada uno
  container.querySelectorAll('[data-cookie-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      // dataset.cookieChoice lee el atributo data-cookie-choice ("accepted" o "rejected")
      saveCookieChoice(button.dataset.cookieChoice);

      // remove() quita el aviso del HTML: desaparece y ya no se puede llegar a él con Tab
      container.remove();
    });
  });
}
