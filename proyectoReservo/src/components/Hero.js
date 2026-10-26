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

        <p class="mt-6 text-lg leading-relaxed text-slate-400">
          Gimnasios, restaurantes, peluquerías o clínicas: tus clientes reservan online 24/7
          y tú te olvidas del teléfono y las libretas.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#cta" class="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            Empieza gratis 14 días
          </a>
          <a href="#como-funciona" class="rounded-lg border border-slate-700 bg-slate-800/60 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            Ver cómo funciona
          </a>
        </div>

        <p class="mt-4 text-sm text-slate-500">Sin tarjeta de crédito · Cancela cuando quieras</p>
      </div>

      <!-- Columna derecha: tarjeta de reserva (la hace Arnau en el #9) -->
      <div id="hero-card"></div>
    </div>
  `;
}
