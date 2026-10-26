// Funcionalidades: título, subtítulo y grid de tarjetas
export function renderFeatures(container) {
  container.className = 'py-20 lg:py-28';

  container.innerHTML = `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Todo lo que necesitas para gestionar reservas
        </h2>
        <p class="mt-4 text-lg text-slate-400">
          Una sola herramienta para tu agenda, tus clientes y tus cobros.
        </p>
      </div>

      <div id="features-grid" class="mt-14 grid gap-6"></div>
    </div>
  `;
}
