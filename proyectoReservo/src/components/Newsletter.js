// =============================================================
// Newsletter.js — Suscripción a la newsletter (issue #24)
// Formulario con el email y la casilla de consentimiento (RGPD).
// Va dentro del pie de página; Footer.js es el issue #19 (Jean).
// =============================================================

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400';

// Pinta el formulario dentro del contenedor que le pasa main.js
// (el <div id="footer-newsletter"> que hay dentro del <footer>).
export function renderNewsletter(container) {
  container.innerHTML = /*html*/ `
    <!-- Contenedor centrado con ancho máximo y márgenes laterales, como el resto de secciones -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md">
        <!-- id del título: el formulario lo usa como nombre (aria-labelledby) -->
        <h2 id="newsletter-title" class="text-lg font-semibold text-white">Suscríbete a la newsletter</h2>
        <p class="mt-2 text-sm text-slate-400">
          Novedades de Reservo y consejos para tu negocio, una vez al mes.
        </p>

        <!-- aria-labelledby: el lector de pantalla anuncia el formulario con el texto del título -->
        <form id="newsletter-form" class="mt-4" aria-labelledby="newsletter-title">
          <!-- Etiqueta visible del campo: el documento pide que cada campo tenga la suya (apartado 3.2).
               for="newsletter-email" la une al input, así al pulsarla se pone el cursor en el campo -->
          <label for="newsletter-email" class="text-sm font-medium text-slate-300">Tu email</label>

          <!-- Campo y botón: apilados en móvil (flex-col) y en fila a partir de sm (sm:flex-row) -->
          <div class="mt-2 flex flex-col gap-3 sm:flex-row">
            <!-- type="email": en el móvil sale el teclado con la @.
                 autocomplete="email": el navegador puede proponer el email del usuario.
                 min-w-0 + flex-1: el campo ocupa el espacio que deja el botón sin desbordarse -->
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="tu@email.com"
              required
              class="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-400 ${focusRing}"
            />
            <!-- Botón principal, con el mismo estilo que el del Hero -->
            <button
              type="submit"
              class="shrink-0 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 ${focusRing}"
            >
              Suscribirme
            </button>
          </div>

          <!-- Consentimiento para guardar el email (RGPD, apartado 1.5 del documento).
               El <input> va dentro del <label>, así al pulsar el texto también se marca la casilla.
               accent-indigo-500 pinta la casilla con el color de la marca -->
          <label class="mt-3 flex items-start gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              name="consent"
              required
              class="mt-1 h-4 w-4 shrink-0 accent-indigo-500 ${focusRing}"
            />
            Acepto que Reservo guarde mi email para enviarme la newsletter.
          </label>
        </form>
      </div>
    </div>
  `;
}
