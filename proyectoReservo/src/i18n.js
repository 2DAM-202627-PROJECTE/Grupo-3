// =============================================================
// i18n.js — Traducción de la página (RF4, issue #23)
// Los textos de cada idioma están en src/locales (es.js, en.js y ca.js).
// Cada texto tiene una clave ("nav.pricing") y t('nav.pricing') lo devuelve en el idioma elegido.
//
// Partes del archivo:
//   1. Idiomas            → los catálogos y el idioma con el que empieza la página
//   2. Traducir un texto  → t
//   3. Cambiar de idioma  → applyTranslations, setLanguage e initializeLanguage
// =============================================================

import en from './locales/en.js';
import es from './locales/es.js';
import ca from './locales/ca.js';

// -------------------------------------------------------------
// 1. Idiomas
// -------------------------------------------------------------

// Clave de localStorage donde se guarda el idioma que ha elegido la persona
const STORAGE_KEY = 'reservo-language';

// Textos de cada idioma. Para añadir uno: crear su archivo en src/locales,
// importarlo arriba y añadirlo aquí y en LANGUAGES
const catalogs = { es, en, ca };

// Nombre de cada idioma escrito en ese mismo idioma (así lo reconoce quien lo habla).
// Lo usa el selector de idioma del menú (Navbar.js)
export const LANGUAGES = { es: 'Español', en: 'English', ca: 'Català' };

// Idioma con el que empieza la página, por orden:
//   1. el que la persona eligió en el menú otra vez (guardado en localStorage)
//   2. el primero de los idiomas del navegador que tengamos ("ca-ES" → "ca", "en-US" → "en")
//   3. si no hay ninguno, castellano
function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (Object.hasOwn(catalogs, saved)) return saved;
  } catch {
    // localStorage puede estar bloqueado (modo privado de algunos navegadores): se sigue sin él
  }

  // navigator.languages: los idiomas del navegador por orden de preferencia (["ca-ES", "es", "en"])
  for (const tag of navigator.languages ?? [navigator.language]) {
    const code = tag.toLowerCase().split('-')[0];
    if (Object.hasOwn(catalogs, code)) return code;
  }
  return 'es';
}

// Se calcula al cargar este archivo, antes de que se pinte nada:
// así cada componente ya sale en el idioma correcto y no se ve el cambio
let currentLanguage = detectLanguage();

export function getLanguage() {
  return currentLanguage;
}

// -------------------------------------------------------------
// 2. Traducir un texto
// -------------------------------------------------------------

// Devuelve el texto de una clave en el idioma actual.
// values rellena los huecos entre llaves: t('cta.confirmation', { email }) cambia {email} por el email.
// Si falta una clave o un valor, da error: así se ve enseguida al programar
export function t(key, values = {}) {
  const message = catalogs[currentLanguage][key];
  if (typeof message !== 'string') {
    throw new Error(`Missing "${key}" translation for "${currentLanguage}".`);
  }
  return message.replace(/\{(\w+)\}/gu, (placeholder, name) => {
    if (!(name in values)) {
      throw new Error(`Missing "${name}" value for translation "${key}".`);
    }
    return String(values[name]);
  });
}

// -------------------------------------------------------------
// 3. Cambiar de idioma
// -------------------------------------------------------------

// Claves del título de la pestaña y de la descripción para buscadores.
// Cada página puede poner las suyas con initializeLanguage (la de cookies lo hace)
let pageKeys = { title: 'document.title', description: 'document.description' };

// Idioma del <html> (lo usan los lectores de pantalla para pronunciar bien),
// título de la pestaña y descripción para buscadores
function updateDocumentLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = t(pageKeys.title);
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = t('document.description');
  const openGraphTitle = document.querySelector('meta[property="og:title"]');
  if (openGraphTitle) openGraphTitle.content = t('document.title');
  const openGraphDescription = document.querySelector('meta[property="og:description"]');
  if (openGraphDescription) openGraphDescription.content = t('document.description');
  const openGraphLocale = document.querySelector('meta[property="og:locale"]');
  if (openGraphLocale) {
    openGraphLocale.content = { es: 'es_ES', en: 'en_US', ca: 'ca_ES' }[currentLanguage];
  }
}

// Valores de los huecos {…} guardados en un elemento con data-i18n-*:
// data-i18n-email="ana@x.com" → { email: 'ana@x.com' }.
// Los que acaban en "Key" guardan otra clave, que también se traduce
// (data-i18n-day-key="intro.dayThursday" → { day: 'Jue 25' })
function translationValues(element) {
  const values = {};
  for (const [name, value] of Object.entries(element.dataset)) {
    if (name.startsWith('i18n') && name !== 'i18n') {
      const parameter = name.slice('i18n'.length);
      values[parameter.charAt(0).toLowerCase() + parameter.slice(1)] = value;
    }
  }
  if (element.dataset.i18nNameKey) values.name = t(element.dataset.i18nNameKey);
  if (element.dataset.i18nDayKey) values.day = t(element.dataset.i18nDayKey);
  if (element.dataset.i18nServiceKey) values.service = t(element.dataset.i18nServiceKey);
  return values;
}

// Vuelve a escribir en el idioma actual todos los textos de root que llevan su clave:
//   data-i18n             → el texto del elemento
//   data-i18n-aria-label  → el aria-label (lo que lee el lector de pantalla)
//   data-i18n-placeholder → el texto de ejemplo de un campo
//   data-i18n-html        → el HTML del elemento, para textos con <strong> dentro (página de cookies).
//                           Solo con textos de src/locales, que escribimos nosotros: nunca con datos
//                           que escriba la persona (un email, por ejemplo), porque se ejecutaría como HTML
export function applyTranslations(root) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n, translationValues(element));
  });

  root.querySelectorAll('[data-i18n-html]').forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });

  root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel, translationValues(element)));
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
}

// Cambia el idioma de toda la página y lo guarda para la próxima visita.
// Lo llama el selector de idioma del menú (Navbar.js)
export function setLanguage(language) {
  if (!Object.hasOwn(catalogs, language)) {
    throw new Error(`Unsupported language "${language}".`);
  }

  currentLanguage = language;
  updateDocumentLanguage();
  applyTranslations(document);

  // Solo se guarda cuando la persona lo elige: si no ha elegido nada,
  // en la próxima visita se vuelve a mirar el idioma del navegador
  try {
    localStorage.setItem(STORAGE_KEY, currentLanguage);
  } catch (error) {
    console.warn('No se pudo guardar el idioma seleccionado.', error);
  }
}

// Al cargar la página (main.js, después de pintar todo): pone el idioma en el <html>
// y el título, y traduce los textos que se hayan escrito directamente en el HTML.
// keys: claves del título y la descripción de otra página, por ejemplo
//   initializeLanguage({ title: 'cookiePage.title', description: 'cookiePage.metaDescription' })
export function initializeLanguage(keys = {}) {
  pageKeys = { ...pageKeys, ...keys };
  updateDocumentLanguage();
  applyTranslations(document);
}
