import { selectHeroSector } from './Hero.js';

const sectors = [
  { id: 'gimnasio', icon: '🏋️', name: 'Gimnasios', detail: 'Clases, entrenamientos y aforo.' },
  { id: 'restaurante', icon: '🍽️', name: 'Restaurantes', detail: 'Mesas, turnos y reservas.' },
  { id: 'peluqueria', icon: '✂️', name: 'Peluquerías', detail: 'Servicios, profesionales y horarios.' },
  { id: 'clinica', icon: '🩺', name: 'Clínicas', detail: 'Consultas y citas por especialista.' },
];

export function renderSectors(container) {
  container.className = 'border-y border-white/60 bg-white/30 py-20 lg:py-24';
  container.innerHTML = /*html*/ `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Pensado para cualquier negocio con citas</h2>
        <p class="mt-4 text-lg text-slate-600">Elige tu sector y descubre cómo se vería tu página de reservas.</p>
      </div>
      <div class="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" role="group" aria-label="Selecciona un sector para actualizar la demo">
        ${sectors.map(({ id, icon, name, detail }, index) => `
          <button type="button" class="sector-option glass rounded-xl border ${index === 0 ? 'border-indigo-400 bg-indigo-50/80' : 'border-white/90 bg-white/55'} p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:p-5" aria-pressed="${index === 0}" data-sector="${id}">
            <span class="text-2xl" aria-hidden="true">${icon}</span>
            <span class="mt-3 block font-semibold text-slate-900">${name}</span>
            <span class="mt-1 block text-sm leading-relaxed text-slate-600">${detail}</span>
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
        sectorButton.classList.toggle('bg-indigo-50/80', isActive);
        sectorButton.classList.toggle('border-white/90', !isActive);
        sectorButton.classList.toggle('bg-white/55', !isActive);
      });
      selectHeroSector(button.dataset.sector);
    });
  });
}
