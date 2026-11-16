import en from './locales/en.js';
import es from './locales/es.js';
import ca from './locales/ca.js';

const STORAGE_KEY = 'reservo-language';
// Register locale modules here; the selector cycles through the registered language codes.
const catalogs = { es, en, ca };
let currentLanguage = 'es';

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

function updateDocumentLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = t('document.title');
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

export function applyTranslations(root) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n, translationValues(element));
  });

  root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel, translationValues(element)));
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
}

function updateLanguageButtons(container) {
  const languages = Object.keys(catalogs);
  const currentIndex = languages.indexOf(currentLanguage);
  const nextLanguage = languages[(currentIndex + 1) % languages.length];

  container.querySelectorAll('[data-language-toggle]').forEach((button) => {
    button.setAttribute('aria-label', t('language.changeTo', { language: nextLanguage.toUpperCase() }));
    const [currentCode, nextCode] = button.querySelectorAll('[data-language-code]');
    [[currentCode, currentLanguage], [nextCode, nextLanguage]].forEach(([code, language]) => {
      code.dataset.languageCode = language;
      code.textContent = language.toUpperCase();
      const isCurrent = language === currentLanguage;
      code.classList.toggle('font-bold', isCurrent);
      code.classList.toggle('text-indigo-700', isCurrent);
      code.classList.toggle('text-slate-400', !isCurrent);
    });
  });
}

function setLanguage(language, container) {
  if (!Object.hasOwn(catalogs, language)) {
    throw new Error(`Unsupported language "${language}".`);
  }

  currentLanguage = language;
  updateDocumentLanguage();
  applyTranslations(document);
  updateLanguageButtons(container);

  try {
    localStorage.setItem(STORAGE_KEY, currentLanguage);
  } catch (error) {
    console.warn('No se pudo guardar el idioma seleccionado.', error);
  }
}

export function initializeLanguage(container) {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (Object.hasOwn(catalogs, savedLanguage)) currentLanguage = savedLanguage;
  } catch (error) {
    console.warn('No se pudo leer el idioma guardado; se usará español.', error);
  }

  updateDocumentLanguage();
  applyTranslations(document);
  updateLanguageButtons(container);

  container.querySelectorAll('[data-language-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const languages = Object.keys(catalogs);
      const currentIndex = languages.indexOf(currentLanguage);
      setLanguage(languages[(currentIndex + 1) % languages.length], container);
    });
  });
}

export function getLanguage() {
  return currentLanguage;
}
