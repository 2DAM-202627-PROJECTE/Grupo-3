// Hero: texto principal y botones (izquierda) + tarjeta de reserva (derecha, issue #9)
export function renderHero(container) {
  container.className = 'relative overflow-hidden';

  container.innerHTML = `
    <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
      <!-- Columna izquierda: texto y botones -->
      <div id="hero-text" class="max-w-xl">
        <span class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden="true"></span>
          Nuevo · Recordatorios por WhatsApp
        </span>

        <h1 class="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Las reservas de tu negocio,
          <span class="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">en piloto automático</span>
        </h1>
      </div>

      <!-- Columna derecha: tarjeta de reserva (la hace Arnau en el #9) -->
      <div id="hero-card"></div>
    </div>
  `;
}
