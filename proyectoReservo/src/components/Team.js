// =============================================================
// Team.js — Sección del equipo (issue #70)
// Presenta a las tres personas que hay detrás de Reservo:
// avatar con sus iniciales, nombre, rol y una frase.
//
// Partes del archivo:
//   1. Datos                → el array team
//   2. Una tarjeta          → memberCard
//   3. HTML de la sección   → renderTeam (lo llama main.js)
// =============================================================

// -------------------------------------------------------------
// 1. Datos
// -------------------------------------------------------------

import { t } from '../i18n.js';

// Integrantes del equipo. Si se añade o quita alguien, solo hay que tocar este array.
//   - name:     nombre y apellido (no se traduce)
//   - initials: letras del avatar. Se usan iniciales en vez de fotos, así la sección
//               no depende de imágenes y todas las tarjetas se ven iguales
//   - role:     clave del rol en Reservo (se traduce)
//   - bio:      clave de la frase que lo presenta (se traduce)
const team = [
  { name: 'Vlad Bobu', initials: 'VB', role: 'team.roleVlad', bio: 'team.bioVlad' },
  { name: 'Arnau Serra Soriano', initials: 'AS', role: 'team.roleArnau', bio: 'team.bioArnau' },
  { name: 'Jean Pierre Orozco Zubieta', initials: 'JO', role: 'team.roleJean', bio: 'team.bioJean' },
];

// -------------------------------------------------------------
// 2. Una tarjeta
// -------------------------------------------------------------

// Genera el HTML de la tarjeta de una persona.
// Con desestructuración ({ name, initials, ... }) se sacan las propiedades del objeto
function memberCard({ name, initials, role, bio }) {
  return /*html*/ `
    <!-- Cada persona es un <li>: el equipo es una lista (<ul>), y así el lector de pantalla
         dice cuántas personas hay. Tarjeta de cristal (glass de style.css), como Testimonios.
         Al pasar el ratón, el borde se vuelve índigo claro -->
    <li class="glass flex flex-col items-center rounded-xl border border-slate-200/80 p-6 text-center shadow-sm transition hover:border-indigo-300 lg:p-8">
      <!-- Avatar con las iniciales, con el mismo degradado índigo-violeta que el logo.
           aria-hidden="true": es decorativo, el nombre ya está escrito justo debajo -->
      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-violet-500 text-2xl font-bold text-white shadow-lg shadow-indigo-500/30" aria-hidden="true">
        ${initials}
      </div>

      <!-- Nombre (h3: va dentro de la sección, que ya tiene su h2) y rol -->
      <h3 class="mt-5 text-lg font-semibold text-slate-900">${name}</h3>
      <p data-i18n="${role}" class="mt-1 text-sm font-medium text-indigo-700">${t(role)}</p>

      <!-- Frase de presentación -->
      <p data-i18n="${bio}" class="mt-4 text-sm leading-relaxed text-slate-600">${t(bio)}</p>
    </li>
  `;
}

// -------------------------------------------------------------
// 3. HTML de la sección
// -------------------------------------------------------------

// Pinta la sección dentro del contenedor que le pasa main.js (el <section id="equipo">)
export function renderTeam(container) {
  // Mismo espacio arriba y abajo que el resto de secciones
  container.className = 'py-20 lg:py-28';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales, como el resto de secciones -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Cabecera de la sección: título y subtítulo centrados -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          <span data-i18n="team.heading">${t('team.heading')}</span>
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          <span data-i18n="team.description">${t('team.description')}</span>
        </p>
      </div>

      <!-- Lista de 3 tarjetas: 1 columna en móvil, 3 a partir de tableta (md).
           max-w-md en móvil: una sola tarjeta no se estira a todo el ancho.
           md:max-w-5xl: en pantallas grandes las tarjetas no se separan demasiado -->
      <ul class="mx-auto mt-14 grid max-w-md grid-cols-1 gap-6 md:max-w-5xl md:grid-cols-3">
        ${team.map(memberCard).join('')}
      </ul>
    </div>
  `;
}
