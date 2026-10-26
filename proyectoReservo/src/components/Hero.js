// Hero: texto principal y botones (izquierda) + tarjeta de reserva (derecha, issue #9)
export function renderHero(container) {
  container.className = 'relative overflow-hidden';

  container.innerHTML = `
    <div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
      <!-- Columna izquierda: texto y botones -->
      <div id="hero-text" class="max-w-xl"></div>

      <!-- Columna derecha: tarjeta de reserva (la hace Arnau en el #9) -->
      <div id="hero-card"></div>
    </div>
  `;
}
