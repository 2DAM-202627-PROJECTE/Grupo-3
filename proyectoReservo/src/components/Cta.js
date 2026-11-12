// =============================================================
// Cta.js — Formulario de prueba gratuita (issue #17, RF2 y RF6)
// Sección final de la landing: los botones "Prueba gratis" del menú
// y del Hero llevan aquí (href="#cta"). Pide solo el email, valida
// su formato y, al enviarlo, muestra un mensaje de confirmación.
//
// Partes del archivo:
//   1. Configuración        → constantes que usa el resto del archivo
//   2. HTML de la sección   → renderCta (lo llama main.js)
//   3. Validación y envío   → setupCta (errores y confirmación)
// =============================================================

// -------------------------------------------------------------
// 1. Configuración
// -------------------------------------------------------------

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

// Comprueba que el texto tiene forma de email: algo + @ + algo + . + algo, sin espacios.
// Es la misma comprobación que la newsletter (Newsletter.js), así los dos formularios
// aceptan los mismos emails. type="email" del navegador daría por bueno "ana@negocio".
//   "ana@negocio.com" → true     "ana@negocio" → false     "ana negocio.com" → false
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Clases del mensaje de debajo del formulario. Solo cambia el color:
// rojo para los errores y verde para la confirmación
const messageBase = 'mt-3 min-h-5 text-sm';

// -------------------------------------------------------------
// 2. HTML de la sección
// -------------------------------------------------------------

// Pinta la sección dentro del <section id="cta"> que le pasa main.js
export function renderCta(container) {
  // Mismo espacio arriba y abajo que el resto de secciones
  container.className = 'py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales. max-w-4xl: más estrecho que las otras
         secciones, porque aquí solo hay un título y un campo -->
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <!-- Tarjeta de cristal (glass de style.css) con el borde en degradado
           (gradient-border), igual que el plan Pro: es la acción más importante de la página -->
      <div class="glass gradient-border rounded-2xl p-8 sm:p-12">
        <!-- Bloque centrado: max-w-2xl para que el campo de email no quede demasiado largo -->
        <div class="mx-auto max-w-2xl text-center">
          <!-- id del título: el formulario lo usa como nombre (aria-labelledby) -->
          <h2 id="cta-title" class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            ¿Listo para llenar tu agenda?
          </h2>
          <p class="mt-4 text-lg text-slate-600">Empieza tu prueba gratuita de 14 días. Sin compromiso.</p>

          <!-- aria-labelledby: el lector de pantalla anuncia el formulario con el texto del título.
               novalidate: desactiva los avisos del navegador para usar los nuestros (setupCta),
               que salen como texto debajo del campo y son iguales en todos los navegadores.
               text-left: la etiqueta y el mensaje se alinean a la izquierda con el campo -->
          <form id="free-trial-form" class="mt-8 text-left" aria-labelledby="cta-title" novalidate>
            <!-- Etiqueta visible del campo (apartado 3.2 del documento).
                 for="free-trial-email" la une al input: al pulsarla se pone el cursor en el campo -->
            <label for="free-trial-email" class="text-sm font-medium text-slate-700">Correo electrónico</label>

            <!-- Campo y botón: apilados en móvil (flex-col) y en fila a partir de sm (sm:flex-row) -->
            <div class="mt-2 flex flex-col gap-3 sm:flex-row">
              <!-- type="email": en el móvil sale el teclado con la @.
                   autocomplete="email": el navegador puede proponer el email del usuario.
                   min-w-0 + flex-1: el campo ocupa el espacio que deja el botón sin desbordarse.
                   aria-describedby: une el campo con el mensaje de abajo, así el lector de
                   pantalla lee el error al volver al campo.
                   aria-invalid:border-red-500: si el JavaScript marca el campo como erróneo,
                   el borde se pone rojo -->
              <input
                id="free-trial-email"
                name="email"
                type="email"
                required
                autocomplete="email"
                placeholder="tu@empresa.com"
                aria-describedby="free-trial-message"
                class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 transition hover:border-slate-400 aria-invalid:border-red-500 ${focusRing}"
              />
              <!-- Botón principal, con el mismo estilo que el del Hero -->
              <button
                type="submit"
                class="shrink-0 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 ${focusRing}"
              >
                Empezar
              </button>
            </div>

            <!-- Mensaje del formulario: los errores o la confirmación.
                 Empieza vacío. aria-live="polite" hace que el lector de pantalla lo lea
                 cada vez que cambia. min-h-5 reserva su alto para que el resto no salte -->
            <p id="free-trial-message" class="${messageBase}" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </div>
  `;

  // Una vez pintado el HTML, se activa la validación del formulario
  setupCta(container);
}

// -------------------------------------------------------------
// 3. Validación y envío del formulario
// -------------------------------------------------------------

function setupCta(container) {
  // --- Elementos del formulario que se van a usar ---
  const form = container.querySelector('#free-trial-form');
  const emailInput = form.querySelector('#free-trial-email');
  const message = form.querySelector('#free-trial-message');

  // Muestra un error: texto en rojo debajo del campo (no solo color: el documento
  // pide que los errores se lean como texto, apartado 3.2) y el foco en el campo
  function showError(text) {
    message.textContent = text;
    message.className = `${messageBase} text-red-600`;
    emailInput.setAttribute('aria-invalid', 'true');
    emailInput.focus();
  }

  // El error se quita en cuanto el usuario vuelve a escribir en el campo
  emailInput.addEventListener('input', () => {
    emailInput.removeAttribute('aria-invalid');
    message.textContent = '';
  });

  // --- Envío del formulario ---
  form.addEventListener('submit', (event) => {
    // Sin esto, el navegador enviaría el formulario y recargaría la página
    event.preventDefault();

    // trim() quita los espacios del principio y del final ("  ana@x.com " → "ana@x.com")
    const email = emailInput.value.trim();

    // a) Validación: primero que no esté vacío y después que tenga forma de email
    if (email === '') {
      showError('Escribe tu email para empezar la prueba.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      showError('Introduce un email válido, por ejemplo: nombre@empresa.com');
      return;
    }

    // b) Todo correcto: no hay servidor, así que la prueba no se crea de verdad.
    //    Se muestra la confirmación en verde y se vacía el campo
    message.textContent = `¡Listo! Te hemos enviado un email a ${email} para activar tu prueba gratuita de 14 días.`;
    message.className = `${messageBase} text-emerald-700`;
    form.reset();
  });
}
