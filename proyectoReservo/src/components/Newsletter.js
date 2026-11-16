// =============================================================
// Newsletter.js — Suscripción a la newsletter (issue #24)
// Formulario con el email y la casilla de consentimiento (RGPD).
// Va dentro del pie de página; Footer.js es el issue #19 (Jean).
// El email se envía a Mailchimp, que guarda la lista de suscriptores y manda
// un email para confirmar la suscripción (doble opt-in).
//
// Partes del archivo:
//   1. Configuración          → constantes que usa el resto del archivo
//   2. HTML del formulario    → renderNewsletter (lo llama main.js)
//   3. Envío a Mailchimp      → subscribeToMailchimp (con reintentos) y los mensajes de su respuesta
//   4. Validación y envío     → setupNewsletter (errores y confirmación)
// =============================================================

// -------------------------------------------------------------
// 1. Configuración
// -------------------------------------------------------------

import { t } from '../i18n.js';

// Clases comunes para el foco visible al navegar con el teclado (accesibilidad)
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

// Comprueba que el texto tiene forma de email: algo + @ + algo + . + algo,
// sin espacios. No dice si el email existe, solo si está bien escrito.
//   "ana@negocio.com" → true     "ana@negocio" → false     "ana negocio.com" → false
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dirección del formulario de Mailchimp (la "lista de distribución" del apartado 1.4
// del documento). Sale del código del formulario que da Mailchimp (Forms → Embedded forms):
//   - u: la cuenta, id: la lista (audience), f_id: el formulario
// Mailchimp da la dirección acabada en /post; aquí se usa /post-json, que responde con
// datos en vez de abrir una página de Mailchimp. No es secreta: va en cualquier web
// que tenga el formulario
const MAILCHIMP_URL =
  'https://github.us11.list-manage.com/subscribe/post-json?u=77fed9aaaae99e17a417d82ca&id=5545d6efa4&f_id=000be6e0f0';

// Campo "trampa" contra bots: tiene que ir vacío. Una persona no lo ve, pero un bot
// que rellena todos los campos sí lo rellena, y Mailchimp descarta esa suscripción
const MAILCHIMP_HONEYPOT = 'b_77fed9aaaae99e17a417d82ca_5545d6efa4';

// Tiempo máximo esperando la respuesta de Mailchimp (8 segundos, en milisegundos).
// Normalmente responde en menos de 1 segundo
const MAILCHIMP_TIMEOUT = 8000;

// Intentos en total si falla la conexión. Las redes del instituto a veces cortan una
// conexión suelta (net::ERR_CONNECTION_CLOSED) y al volver a intentarlo funciona.
// No se ponen más: si Mailchimp no responde, cada intento espera hasta MAILCHIMP_TIMEOUT
// y la persona se quedaría demasiado rato viendo "Enviando…"
const MAILCHIMP_ATTEMPTS = 3;

// Espera antes de cada reintento, y cada vez el doble: 1 s antes del 2.º y 2 s antes del 3.º.
// Así, si la red está dando un corte de unos segundos, tiene más tiempo para recuperarse
const MAILCHIMP_RETRY_DELAY = 1000;

// -------------------------------------------------------------
// 2. HTML del formulario
// -------------------------------------------------------------

// Pinta el formulario dentro del contenedor que le pasa main.js
// (el <div id="footer-newsletter"> que hay dentro del <footer>).
export function renderNewsletter(container) {
  // Fondo lila muy claro, un poco más oscuro que el resto de la página, igual que el footer.
  // bg-(--bg-dark)/80 usa la variable --bg-dark de style.css (#f3f1fd) al 80%: deja ver un poco la aurora.
  // border-t: línea fina que la separa de la última sección
  container.className = 'border-t border-slate-200/70 bg-(--bg-dark)/80';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales, como el resto de secciones -->
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <!-- Bloque centrado: mx-auto lo centra en la página y text-center centra los textos.
           max-w-xl: ancho máximo para que el campo de email no quede demasiado largo -->
      <div class="mx-auto max-w-xl text-center">
        <!-- id del título: el formulario lo usa como nombre (aria-labelledby) -->
        <h2 id="newsletter-title" data-i18n="newsletter.heading" class="text-2xl font-bold tracking-tight text-slate-900">${t('newsletter.heading')}</h2>
        <p class="mt-2 text-sm text-slate-600">
          <span data-i18n="newsletter.description">${t('newsletter.description')}</span>
        </p>

        <!-- aria-labelledby: el lector de pantalla anuncia el formulario con el texto del título.
             novalidate: desactiva los avisos del navegador para usar los nuestros (setupNewsletter),
             que salen como texto debajo del formulario y son iguales en todos los navegadores -->
        <!-- text-left: en móvil el título y la frase van centrados, pero dentro del formulario
             la etiqueta, la casilla y el mensaje se alinean a la izquierda con el campo de email -->
        <form id="newsletter-form" class="text-left" aria-label="Suscripción a la newsletter" novalidate>
          <!-- Etiqueta visible del campo: el documento pide que cada campo tenga la suya (apartado 3.2).
               for="newsletter-email" la une al input, así al pulsarla se pone el cursor en el campo -->
          <label for="newsletter-email" class="text-sm font-medium text-slate-700"><span data-i18n="newsletter.email">${t('newsletter.email')}</span></label>

          <!-- Campo y botón: apilados en móvil (flex-col) y en fila a partir de sm (sm:flex-row) -->
          <div class="mt-2 flex flex-col gap-3 sm:flex-row">
            <!-- type="email": en el móvil sale el teclado con la @.
                 autocomplete="email": el navegador puede proponer el email del usuario.
                 min-w-0 + flex-1: el campo ocupa el espacio que deja el botón sin desbordarse.
                 aria-describedby: une el campo con el mensaje de abajo, así el lector de pantalla
                 lee el error al volver al campo.
                 bg-white + border-slate-300: campo blanco con borde gris, para que se distinga
                 bien del fondo. Al pasar el ratón el borde se oscurece un poco.
                 aria-invalid:border-red-500: si el JavaScript marca el campo como erróneo
                 (aria-invalid="true"), el borde se pone rojo -->
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="${t('newsletter.emailPlaceholder')}"
              data-i18n-placeholder="newsletter.emailPlaceholder"
              required
              aria-describedby="newsletter-message"
              class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 transition hover:border-slate-400 aria-invalid:border-red-500 ${focusRing}"
            />
            <!-- Botón secundario: blanco con borde y texto índigo. Justo encima está el formulario
                 de prueba gratuita (Cta.js) con su botón índigo relleno; así al final de la página
                 solo destaca una acción principal ("Empezar") y la newsletter queda en segundo plano.
                 Al pasar el ratón, el fondo se vuelve lila muy claro.
                 disabled:: mientras se espera a Mailchimp, el botón se ve apagado -->
            <button
              type="submit"
              class="shrink-0 rounded-lg border border-indigo-600 bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-wait disabled:opacity-60 ${focusRing}"
            >
              <span data-i18n="newsletter.submit">${t('newsletter.submit')}</span>
            </button>
          </div>

          <!-- Consentimiento para guardar el email (RGPD, apartado 1.5 del documento).
               Dice dónde se guarda (Mailchimp), porque el email sale de la web hacia otro servicio.
               El <input> va dentro del <label>, así al pulsar el texto también se marca la casilla.
               accent-indigo-500 pinta la casilla con el color de la marca.
               mt-0.5: la línea de texto mide 20 px y la casilla 16 px; bajándola 2 px queda
               centrada con la primera línea (si el texto ocupa dos, sigue alineada con la de arriba) -->
          <label class="mt-3 flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="consent"
              required
              class="mt-0.5 h-4 w-4 shrink-0 accent-indigo-500 ${focusRing}"
            />
            <span data-i18n="newsletter.consent">${t('newsletter.consent')}</span>
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
// 3. Envío a Mailchimp
// -------------------------------------------------------------

// Envía el email a Mailchimp y devuelve una promesa con su respuesta:
//   { result: 'success' | 'error', msg: 'texto de Mailchimp, en inglés' }
//
// Se hace con JSONP (un <script> que carga la dirección de Mailchimp) y no con fetch,
// porque el navegador no deja leer con fetch la respuesta de otra web (Mailchimp) si esa
// web no lo permite (CORS). Con JSONP, Mailchimp responde llamando a una función nuestra:
//   reservoNewsletter123({ "result": "success", "msg": "..." })
function subscribeToMailchimp(email) {
  return new Promise((resolve, reject) => {
    // Nombre único para la función que llamará Mailchimp (Date.now() = milisegundos actuales)
    const callbackName = `reservoNewsletter${Date.now()}`;
    const script = document.createElement('script');

    // Si en 10 segundos no ha respondido, se da por fallido
    const timer = setTimeout(() => finish(new Error('Mailchimp no responde')), MAILCHIMP_TIMEOUT);

    // Se llama una sola vez, tanto si va bien como si va mal: limpia y termina la promesa
    function finish(error, data) {
      clearTimeout(timer);
      // Si Mailchimp respondiera tarde, encontraría una función vacía en vez de dar error
      window[callbackName] = () => {};
      script.remove();
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    }

    // La función a la que llamará Mailchimp con su respuesta
    window[callbackName] = (data) => finish(null, data);

    // Si no se puede cargar (sin conexión, Mailchimp caído...), también se da por fallido
    script.onerror = () => finish(new Error('No se ha podido conectar con Mailchimp'));

    // Datos que se envían en la dirección. URLSearchParams los codifica (la @ pasa a %40...).
    //   EMAIL: el email, honeypot: vacío, c: el nombre de nuestra función
    const params = new URLSearchParams({ EMAIL: email, [MAILCHIMP_HONEYPOT]: '', c: callbackName });
    script.src = `${MAILCHIMP_URL}&${params}`;
    document.body.appendChild(script);
  });
}

// Igual que subscribeToMailchimp, pero si falla la conexión lo vuelve a intentar,
// hasta MAILCHIMP_ATTEMPTS veces en total. Si fallan todas, el error llega a
// setupNewsletter, que muestra el mensaje
async function subscribeWithRetry(email) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await subscribeToMailchimp(email);
    } catch (error) {
      // Era el último intento: se pasa el error a quien ha llamado a esta función
      if (attempt === MAILCHIMP_ATTEMPTS) throw error;

      // Espera antes de reintentar: 1 s, 2 s... (2 ** 0 = 1, 2 ** 1 = 2).
      // Es una promesa que se cumple cuando acaba el setTimeout
      const delay = MAILCHIMP_RETRY_DELAY * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Esta función pasa la respuesta de Mailchimp al mensaje en español que ve la persona.
// Devuelve { ok: true/false, text: 'mensaje en español' } y, si Mailchimp pide un captcha,
// también captchaUrl (ver más abajo)
function mailchimpMessage({ result, msg = '' }, email) {
  // Mailchimp a veces pide un captcha ("no soy un robot") antes de aceptar la suscripción:
  // responde { result: 'redirect', msg: 'captcha' }. Nuestro formulario no puede mostrarlo,
  // así que se da un enlace a su formulario (la dirección /post, sin -json), que abre
  // el captcha con el email ya escrito
  if (result === 'redirect' || /captcha/i.test(msg)) {
    const params = new URLSearchParams({ EMAIL: email });
    return {
      ok: false,
      text: 'Para terminar, confirma que no eres un robot: ',
      captchaUrl: `${MAILCHIMP_URL.replace('/post-json', '/post')}&${params}`,
    };
  }

  // Mailchimp escribe su respuesta en el idioma del navegador de la persona. Por eso los
  // textos se buscan en inglés, castellano y catalán. /.../i: sin importar mayúsculas
  if (result === 'success') {
    // Si el email ya estaba en la lista, Mailchimp responde "success" pero avisa de que
    // ya estabas suscrito: "You're already subscribed" · "Ya estás suscrito" · "Ja estàs subscrit"
    if (/already|ya est|ja est/i.test(msg)) {
      return { ok: true, text: 'Este email ya estaba suscrito a la newsletter. ¡Gracias!' };
    }
    // Si no, es una suscripción nueva. Con el doble opt-in activado en Mailchimp,
    // llega un email para confirmarla
    return {
      ok: true,
      text: `¡Casi está! Te hemos enviado un email a ${email}. Pulsa el botón que contiene para confirmar la suscripción.`,
    };
  }

  // Errores más habituales
  if (/already|ya est|ja est/i.test(msg)) {
    return { ok: false, text: 'Este email ya está suscrito a la newsletter.' };
  }
  if (/fake|fals/i.test(msg)) {
    // Mailchimp comprueba que el dominio del email exista de verdad (example.com no vale)
    return { ok: false, text: 'Este email no parece real. Revisa que esté bien escrito.' };
  }
  if (/too many|demasiad|massa/i.test(msg)) {
    return { ok: false, text: 'Has hecho demasiados intentos con este email. Prueba otra vez en unos minutos.' };
  }
  return { ok: false, text: 'No hemos podido suscribir este email. Prueba con otro o inténtalo más tarde.' };
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
  function showError(key, input) {
    message.dataset.i18n = key;
    message.textContent = t(key);
    message.className = 'mt-3 min-h-5 text-sm text-red-600';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }

  // Quita el error de un campo cuando el usuario lo corrige
  function clearError(input) {
    input.removeAttribute('aria-invalid');
    message.textContent = '';
    delete message.dataset.i18n;
  }

  // El error se quita en cuanto el usuario escribe en el campo o marca la casilla
  emailInput.addEventListener('input', () => clearError(emailInput));
  consentInput.addEventListener('change', () => clearError(consentInput));

  // --- Envío del formulario ---
  const button = form.querySelector('button[type="submit"]');

  // async: dentro se puede usar await para esperar la respuesta de Mailchimp
  form.addEventListener('submit', async (event) => {
    // Sin esto, el navegador enviaría el formulario y recargaría la página
    event.preventDefault();

    // trim() quita los espacios del principio y del final ("  ana@x.com " → "ana@x.com")
    const email = emailInput.value.trim();

    // a) Validación: se comprueba en orden y se para en el primer error
    if (email === '') {
      showError('newsletter.emptyEmail', emailInput);
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      showError('newsletter.invalidEmail', emailInput);
      return;
    }
    if (!consentInput.checked) {
      showError('newsletter.consentRequired', consentInput);
      return;
    }

    // b) Todo correcto: se guarda el email y se muestra la confirmación en verde.
    // toLowerCase(): "Ana@Negocio.com" y "ana@negocio.com" cuentan como el mismo email
    const isNew = addSubscriber(email.toLowerCase());
    message.dataset.i18n = isNew ? 'newsletter.success' : 'newsletter.alreadySubscribed';
    message.textContent = t(message.dataset.i18n);
    message.className = 'mt-3 min-h-5 text-sm text-emerald-700';

      if (response.ok) {
        // Confirmación en verde y formulario vacío.
        // reset() no borra el mensaje porque es un <p>, no un campo
        message.textContent = response.text;
        message.className = 'mt-3 min-h-5 text-sm text-emerald-700';
        form.reset();
      } else if (response.captchaUrl) {
        // Captcha: el texto y un enlace al formulario de Mailchimp, en una pestaña nueva.
        // El enlace se crea con createElement (y no con innerHTML) para que el email
        // que ha escrito la persona nunca se pueda interpretar como HTML
        const link = document.createElement('a');
        link.href = response.captchaUrl;
        link.target = '_blank';
        // noopener: la pestaña de Mailchimp no puede controlar esta página
        link.rel = 'noopener';
        link.className = 'font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900';
        link.textContent = 'completar la suscripción en Mailchimp (se abre en una pestaña nueva)';
        message.replaceChildren(response.text, link);
        message.className = 'mt-3 min-h-5 text-sm text-slate-700';
      } else {
        // Mailchimp ha rechazado el email (ya suscrito, demasiados intentos...)
        showError(response.text, emailInput);
      }
    } catch {
      // No se ha podido conectar con Mailchimp o no ha respondido a tiempo
      // (apartado 3.3 del documento, riesgos: "mensaje de error claro al usuario")
      showError('No se ha podido conectar con el servicio de la newsletter. Revisa tu conexión e inténtalo de nuevo.', emailInput);
    } finally {
      // finally: se hace siempre, haya ido bien o mal
      button.disabled = false;
    }
  });
}
