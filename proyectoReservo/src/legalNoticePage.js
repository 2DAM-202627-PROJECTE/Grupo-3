// =============================================================
// legalNoticePage.js — Traducción de la página de aviso legal (issue #71)
// La página (aviso-legal.html) es HTML normal con los textos en castellano.
// Cada texto lleva su clave (data-i18n, data-i18n-html...) y este archivo los pone
// en el idioma de la persona, igual que cookiesPage.js en la política de cookies.
// =============================================================

import { initializeLanguage } from './i18n.js';

// Título de la pestaña y descripción de esta página (las de la landing son otras)
initializeLanguage({ title: 'legalPage.title', description: 'legalPage.metaDescription' });
