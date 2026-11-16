// =============================================================
// cookiesPage.js — Traducción de la página de política de cookies (issue #23)
// La página (politica-cookies.html) es HTML normal con los textos en castellano.
// Cada texto lleva su clave (data-i18n, data-i18n-html...) y este archivo los pone
// en el idioma de la persona: el que eligió en el menú de la landing o, si no
// eligió ninguno, el de su navegador (ver detectLanguage en i18n.js).
// =============================================================

import { initializeLanguage } from './i18n.js';

// Título de la pestaña y descripción de esta página (las de la landing son otras)
initializeLanguage({ title: 'cookiePage.title', description: 'cookiePage.metaDescription' });
