export function renderCta(container) {
  container.className = 'py-20 lg:py-28';
  container.innerHTML = /*html*/ `
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-2xl border border-indigo-400/20 bg-linear-to-br from-indigo-500/20 via-slate-900 to-cyan-500/10 p-8 shadow-2xl shadow-indigo-950/30 sm:p-12">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">¿Listo para llenar tu agenda?</h2>
          <p class="mt-4 text-lg text-slate-300">Empieza tu prueba gratuita de 14 días. Sin compromiso.</p>
          <form id="free-trial-form" class="mt-8 text-left" novalidate>
            <label for="free-trial-email" class="mb-2 block text-sm font-medium text-slate-200">Correo electrónico</label>
            <div class="flex flex-col gap-3 sm:flex-row">
              <input
                id="free-trial-email"
                name="email"
                type="email"
                required
                autocomplete="email"
                placeholder="tu@empresa.com"
                aria-describedby="free-trial-message"
                class="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              />
              <button type="submit" class="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">Empezar</button>
            </div>
            <p id="free-trial-message" class="mt-3 hidden text-sm" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector('#free-trial-form');
  const emailInput = container.querySelector('#free-trial-email');
  const message = container.querySelector('#free-trial-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    emailInput.value = emailInput.value.trim();

    if (!emailInput.checkValidity()) {
      emailInput.setAttribute('aria-invalid', 'true');
      message.textContent = 'Introduce un correo electrónico válido para continuar.';
      message.classList.remove('hidden', 'text-emerald-300');
      message.classList.add('text-rose-300');
      emailInput.focus();
      return;
    }


    emailInput.setAttribute('aria-invalid', 'false');
    message.textContent = '¡Perfecto! Tu correo es válido. Ya puedes empezar tu prueba gratuita.';
    message.classList.remove('hidden', 'text-rose-300');
    message.classList.add('text-emerald-300');
  });
}