import { selectHeroSector } from './Hero.js';

const sectors = [
  { id: 'gimnasio', icon: '🏋️', name: 'Gimnasios', detail: 'Clases, entrenamientos y aforo.' },
  { id: 'restaurante', icon: '🍽️', name: 'Restaurantes', detail: 'Mesas, turnos y reservas.' },
  { id: 'peluqueria', icon: '✂️', name: 'Peluquerías', detail: 'Servicios, profesionales y horarios.' },
  { id: 'clinica', icon: '🩺', name: 'Clínicas', detail: 'Consultas y citas por especialista.' },
];

export function renderSectors(container) {
  container.className = 'border-y border-slate-800 bg-slate-900/40 py-20 lg:py-24';
  container.innerHTML = /*html*/ `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Pensado para cualquier negocio con citas</h2>
        <p class="mt-4 text-lg text-slate-400">Elige tu sector y descubre cómo se vería tu página de reservas.</p>
      </div>
      <div class="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" role="group" aria-label="Selecciona un sector para actualizar la demo">
        ${sectors.map(({ id, icon, name, detail }, index) => `
          <button type="button" class="sector-option rounded-xl border ${index === 0 ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-800 bg-slate-800/30'} p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:p-5" aria-pressed="${index === 0}" data-sector="${id}">
            <span class="text-2xl" aria-hidden="true">${icon}</span>
            <span class="mt-3 block font-semibold text-white">${name}</span>
            <span class="mt-1 block text-sm leading-relaxed text-slate-400">${detail}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('.sector-option').forEach((button) => {
    button.addEventListener('click', () => {
      container.querySelectorAll('.sector-option').forEach((sectorButton) => {
        const isActive = sectorButton === button;
        sectorButton.setAttribute('aria-pressed', String(isActive));
        sectorButton.classList.toggle('border-indigo-400', isActive);
        sectorButton.classList.toggle('bg-indigo-500/10', isActive);
        sectorButton.classList.toggle('border-slate-800', !isActive);
        sectorButton.classList.toggle('bg-slate-800/30', !isActive);
      });
      selectHeroSector(button.dataset.sector);
    });
  });
}
