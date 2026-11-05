// =============================================================
// Newsletter.js — Suscripción a la newsletter (issue #24)
// Formulario con el email y la casilla de consentimiento (RGPD).
// Va dentro del pie de página; Footer.js es el issue #19 (Jean).
//
// Partes del archivo:
//   1. Configuración          → constantes que usa el resto del archivo
//   2. HTML del formulario    → renderNewsletter (lo llama main.js)
//   3. Lista de suscriptores  → leer y guardar emails en localStorage
//   4. Validación y envío     → setupNewsletter (errores y confirmación)
// =============================================================

// -------------------------------------------------------------
// 1. Configuración
// -------------------------------------------------------------

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400';

// Comprueba que el texto tiene forma de email: algo + @ + algo + . + algo,
// sin espacios. No dice si el email existe, solo si está bien escrito.
//   "ana@negocio.com" → true     "ana@negocio" → false     "ana negocio.com" → false
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nombre con el que se guarda la lista de emails en el localStorage del navegador.
// No hay servidor, así que la "lista de distribución" del documento (apartado 1.4)
// se guarda aquí. localStorage solo guarda texto: la lista se pasa a JSON y al revés.
const STORAGE_KEY = 'reservo-newsletter';

// -------------------------------------------------------------
// 2. HTML del formulario
// -------------------------------------------------------------

// Pinta el formulario dentro del contenedor que le pasa main.js
// (el <div id="footer-newsletter"> que hay dentro del <footer>).
export function renderNewsletter(container) {
  // Fondo más oscuro que el resto de la página, como el footer del mockup.
  // bg-(--bg-dark) usa la variable --bg-dark de style.css (#080d1f).
  // border-t: línea fina que la separa de la última sección
  container.className = 'border-t border-slate-800 bg-(--bg-dark)';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales, como el resto de secciones -->
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <!-- Bloque centrado: mx-auto lo centra en la página y text-center centra los textos.
           max-w-xl: ancho máximo para que el campo de email no quede demasiado largo -->
      <div class="mx-auto max-w-xl text-center">
        <!-- id del título: el formulario lo usa como nombre (aria-labelledby) -->
        <h2 id="newsletter-title" class="text-2xl font-bold tracking-tight text-white">Suscríbete a la newsletter</h2>
        <p class="mt-2 text-sm text-slate-400">
          Novedades de Reservo y consejos para tu negocio, una vez al mes.
        </p>

        <!-- aria-labelledby: el lector de pantalla anuncia el formulario con el texto del título.
             novalidate: desactiva los avisos del navegador para usar los nuestros (setupNewsletter),
             que salen como texto debajo del formulario y son iguales en todos los navegadores -->
        <!-- text-left: el título y la frase van centrados, pero dentro del formulario la
             etiqueta, la casilla y el mensaje se alinean a la izquierda con el campo de email -->
        <form id="newsletter-form" class="mt-6 text-left" aria-labelledby="newsletter-title" novalidate>
          <!-- Etiqueta visible del campo: el documento pide que cada campo tenga la suya (apartado 3.2).
               for="newsletter-email" la une al input, así al pulsarla se pone el cursor en el campo -->
          <label for="newsletter-email" class="text-sm font-medium text-slate-300">Tu email</label>

          <!-- Campo y botón: apilados en móvil (flex-col) y en fila a partir de sm (sm:flex-row) -->
          <div class="mt-2 flex flex-col gap-3 sm:flex-row">
            <!-- type="email": en el móvil sale el teclado con la @.
                 autocomplete="email": el navegador puede proponer el email del usuario.
                 min-w-0 + flex-1: el campo ocupa el espacio que deja el botón sin desbordarse.
                 aria-describedby: une el campo con el mensaje de abajo, así el lector de pantalla
                 lee el error al volver al campo.
                 aria-invalid:border-red-400: si el JavaScript marca el campo como erróneo
                 (aria-invalid="true"), el borde se pone rojo -->
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="tu@email.com"
              required
              aria-describedby="newsletter-message"
              class="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-400 aria-invalid:border-red-400 ${focusRing}"
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

          <!-- Mensaje del formulario: los errores o la confirmación.
               Empieza vacío. aria-live="polite" hace que el lector de pantalla lo lea
               cada vez que cambia. min-h-5 reserva su alto para que el resto no salte -->
          <p id="newsletter-message" class="mt-3 min-h-5 text-sm" aria-live="polite"></p>
        </form>
      </div>
    </div>
  `;

  // Una vez pintado el HTML, se activa la validación del formulario
  setupNewsletter(container);
}

// -------------------------------------------------------------
// 3. Lista de suscriptores (localStorage)
// -------------------------------------------------------------

// Devuelve la lista de emails guardados (un array). Si no hay nada, un array vacío.
function getSubscribers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    // Si el navegador bloquea localStorage (modo privado estricto) o el dato está roto
    return [];
  }
}

// Añade un email a la lista y la vuelve a guardar.
// Devuelve false si el email ya estaba, para avisar al usuario en vez de repetirlo.
function addSubscriber(email) {
  const subscribers = getSubscribers();
  if (subscribers.includes(email)) {
    return false;
  }
  subscribers.push(email);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
  } catch {
    // Si no se puede guardar, la suscripción sigue contando para el usuario:
    // en la página no hay nada más que hacer
  }
  return true;
}

// -------------------------------------------------------------
// 4. Validación y envío del formulario
// -------------------------------------------------------------

// Lógica del formulario: al enviarlo comprueba los datos y muestra los errores
// o la confirmación.
function setupNewsletter(container) {
  // --- Elementos del formulario que se van a usar ---
  const form = container.querySelector('#newsletter-form');
  const emailInput = form.querySelector('#newsletter-email');
  const consentInput = form.querySelector('input[name="consent"]');
  const message = form.querySelector('#newsletter-message');

  // --- Mensajes de error ---

  // Muestra un error: texto en rojo debajo del formulario (no solo color: el documento
  // pide que los errores se lean como texto, apartado 3.2) y el foco en el campo que falla.
  function showError(text, input) {
    message.textContent = text;
    message.className = 'mt-3 min-h-5 text-sm text-red-400';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }

  // Quita el error de un campo cuando el usuario lo corrige
  function clearError(input) {
    input.removeAttribute('aria-invalid');
    message.textContent = '';
  }

  // El error se quita en cuanto el usuario escribe en el campo o marca la casilla
  emailInput.addEventListener('input', () => clearError(emailInput));
  consentInput.addEventListener('change', () => clearError(consentInput));

  // --- Envío del formulario ---
  form.addEventListener('submit', (event) => {
    // Sin esto, el navegador enviaría el formulario y recargaría la página
    event.preventDefault();

    // trim() quita los espacios del principio y del final ("  ana@x.com " → "ana@x.com")
    const email = emailInput.value.trim();

    // a) Validación: se comprueba en orden y se para en el primer error
    if (email === '') {
      showError('Escribe tu email.', emailInput);
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      showError('El email no es válido. Ejemplo: nombre@negocio.com', emailInput);
      return;
    }
    if (!consentInput.checked) {
      showError('Marca la casilla para que podamos guardar tu email.', consentInput);
      return;
    }

    // b) Todo correcto: se guarda el email y se muestra la confirmación en verde.
    // toLowerCase(): "Ana@Negocio.com" y "ana@negocio.com" cuentan como el mismo email
    const isNew = addSubscriber(email.toLowerCase());
    message.textContent = isNew
      ? '¡Gracias! Te has suscrito a la newsletter.'
      : 'Este email ya estaba suscrito. ¡Gracias!';
    message.className = 'mt-3 min-h-5 text-sm text-emerald-400';

    // Vacía el formulario. reset() no borra el mensaje porque es un <p>, no un campo
    form.reset();
  });
}
