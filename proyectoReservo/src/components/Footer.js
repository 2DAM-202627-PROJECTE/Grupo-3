// =============================================================
// Footer.js — Pie de página (issue #19)
// Logo + copyright con año dinámico, enlaces legales,
// enlaces a redes sociales. En móvil, apilado y centrado.
// =============================================================

// ---------------------------------------------------------------
// Datos
// ---------------------------------------------------------------

// Enlaces legales. Si se añade o quita alguno, solo hay que tocar este array.
// 'Cookies' apunta a su página estática; Privacidad y Aviso legal siguen sin página por ahora.
// import.meta.env.BASE_URL es la ruta base de la web ("/" en local y "/Grupo-3/" en GitHub Pages).
const legalLinks = [
  { label: 'Privacidad' },
  { label: 'Aviso legal' },
  { label: 'Cookies', href: `${import.meta.env.BASE_URL}politica-cookies.html` },
  { label: 'Contacto' },
];

// Redes sociales. Los iconos de marcas (Instagram, X, LinkedIn, YouTube) no están
// en Lucide porque son marcas registradas, así que se usan SVGs inline.
// Los destinos se añadirán cuando el equipo confirme las URLs reales.
const socialLinks = [
  {
    label: 'X (Twitter)',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  },
  {
    label: 'Instagram',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
  },
  {
    label: 'LinkedIn',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  },
  {
    label: 'YouTube',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  },
];

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

// Logo SVG inline (la "R" con degradado). Mismo diseño que el favicon.
// Se usa inline para poder controlarlo con Tailwind (tamaño, margen…).
function logoSvg() {
  return /*html*/ `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
         class="h-8 w-8" aria-hidden="true">
      <defs>
        <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4f35f5"></stop>
          <stop offset="100%" stop-color="#06b6d4"></stop>
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#footerLogoGradient)"></rect>
      <path d="M19 49V15h16c10 0 15 5 15 13
           0 6-3 10-9 12l10 9H38l-9-9h-1v9H19zm9-18h7
           c4 0 6-1 6-4s-2-4-6-4h-7v8z" fill="#ffffff"></path>
    </svg>
  `;
}

// ---------------------------------------------------------------
// Render
// ---------------------------------------------------------------

// Pinta el footer dentro del contenedor que le pasa main.js
// (el <div id="footer-content">).
export function renderFooter(container) {
  // Borde superior sutil para separar de la newsletter. Mismo fondo lila muy claro que la
  // newsletter (--bg-dark de style.css), así el pie se ve como un solo bloque, como en el mockup
  container.className = 'border-t border-slate-200/70 bg-(--bg-dark)/80';

  // Año dinámico con JS: si la página se abre en 2027, pondrá "© 2027"
  const year = new Date().getFullYear();

  container.innerHTML = /*html*/ `
    <!-- Contenedor centrado con ancho máximo -->
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <!-- Bloque superior: logo + copyright y redes sociales.
           En móvil va apilado y centrado (flex-col items-center text-center),
           en escritorio en fila con espacio entre ellos (sm:flex-row sm:justify-between) -->
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">

        <!-- Logo + nombre + copyright -->
        <div class="flex items-center gap-3">
          ${logoSvg()}
          <span class="text-sm text-slate-600">
            © ${year} Reservo. Todos los derechos reservados.
          </span>
        </div>

        <!-- Redes sociales: role="group" con aria-label para que los lectores de pantalla lo reconozcan -->
        <div class="flex items-center gap-4" role="group" aria-label="Redes sociales">
          ${socialLinks
            .map(
              ({ svg, label }) => /*html*/ `
              <span class="text-slate-500" role="img" aria-label="${label}">
                ${svg}
              </span>
            `,
            )
            .join('')}
        </div>
      </div>

      <!-- Separador -->
      <hr class="my-8 border-slate-200" />

      <!-- Enlaces legales: centrados en móvil, en fila en escritorio -->
      <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Enlaces legales">
        ${legalLinks
          .map(
            ({ label, href }) => /*html*/ `
          ${href
            ? `<a href="${href}" class="text-sm text-slate-400 transition hover:text-slate-200">${label}</a>`
            : `<span class="text-sm text-slate-500" aria-disabled="true">${label}</span>`}
        `,
          )
          .join('')}
      </nav>
    </div>
  `;
}
