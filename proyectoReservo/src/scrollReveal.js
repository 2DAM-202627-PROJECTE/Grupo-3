// =============================================================
// scrollReveal.js — Animación de las secciones al hacer scroll
// Cuando un bloque de la página entra en pantalla, aparece subiendo un poco.
// Los estilos de la animación están en style.css, apartado 5:
//   .reveal              → el bloque espera invisible
//   .reveal.is-visible   → se reproduce la animación
//
// Partes del archivo:
//   1. Qué se anima      → los bloques de cada sección y las tarjetas de sus grids
//   2. Cuándo se anima   → IntersectionObserver avisa cuando un bloque entra en pantalla
//   3. Limpieza          → al acabar la animación se quitan las clases
//   4. Función principal → initScrollReveal(), que se llama desde main.js
// =============================================================

// Retraso entre tarjetas que entran en pantalla a la vez (en milisegundos).
// Con 100ms, la primera sale ya, la segunda a los 100ms, la tercera a los 200ms...
const STAGGER_MS = 100;

// -------------------------------------------------------------
// 1. Qué se anima
// -------------------------------------------------------------

// Devuelve la lista de elementos que se van a animar dentro de una sección.
// Todas las secciones tienen la misma forma:
//   <section>
//     <div class="mx-auto max-w-7xl ...">   ← contenedor
//       <div> título y subtítulo </div>
//       ...
//       <div class="grid ..."> tarjetas </div>
//     </div>
//   </section>
// Se anima cada hijo del contenedor por separado y, si un hijo es un grid,
// en vez del grid entero se anima cada tarjeta, para que salgan una detrás de otra.
function getRevealTargets(section) {
  const wrapper = section.firstElementChild;

  // Sección vacía (componente aún sin hacer): no hay nada que animar
  if (!wrapper) return [];

  const targets = [];

  // children es la lista de hijos directos. [...] la convierte en un array normal
  [...wrapper.children].forEach((child) => {
    // Los elementos sr-only solo existen para los lectores de pantalla (no se ven),
    // así que no tiene sentido animarlos
    if (child.classList.contains('sr-only')) return;

    if (child.classList.contains('grid')) {
      targets.push(...child.children);
    } else {
      targets.push(child);
    }
  });

  return targets;
}

// -------------------------------------------------------------
// 2. Cuándo se anima
// -------------------------------------------------------------

// IntersectionObserver vigila los elementos y llama a esta función cuando alguno
// entra o sale de la pantalla. Es mejor que escuchar el evento scroll, porque el
// navegador hace el cálculo por su cuenta y no se ejecuta código en cada píxel de scroll.
// entries son los elementos que han cambiado en este momento.
function handleIntersect(entries, observer) {
  // Solo los que acaban de entrar en pantalla
  const visible = entries.filter((entry) => entry.isIntersecting);

  // Cuántos elementos de cada padre han entrado ya en esta tanda.
  // Un Map guarda parejas clave → valor; aquí: elemento padre → contador
  const countByParent = new Map();

  visible.forEach((entry) => {
    const el = entry.target;

    // Si entran a la vez varias tarjetas del mismo grid (por ejemplo una fila),
    // cada una espera un poco más que la anterior: 0ms, 100ms, 200ms...
    // Se cuenta por padre para que el retraso no se acumule entre secciones distintas
    // cuando entran varias de golpe (por ejemplo en una pantalla muy alta).
    // Si entra uno solo, index es 0 y no espera nada
    const index = countByParent.get(el.parentElement) ?? 0;
    countByParent.set(el.parentElement, index + 1);

    el.style.setProperty('--reveal-delay', `${index * STAGGER_MS}ms`);
    el.classList.add('is-visible');

    // Ya se ha animado: se deja de vigilar para que no se repita al volver a subir
    observer.unobserve(el);
  });
}

// -------------------------------------------------------------
// 3. Limpieza
// -------------------------------------------------------------

// Cuando termina la animación se quitan las clases y el retraso, y el elemento
// queda como si nunca se hubiera animado.
// Hace falta porque una animación CSS se vuelve a reproducir si el elemento estaba
// oculto y se vuelve a mostrar: por ejemplo, las tarjetas de Precios en móvil,
// que se ocultan y se muestran al cambiar de pestaña
function cleanUp(event) {
  const el = event.currentTarget;

  // animationend también llega cuando termina una animación de un hijo.
  // Solo interesa la de este elemento
  if (event.target !== el) return;

  el.classList.remove('reveal', 'is-visible');
  el.style.removeProperty('--reveal-delay');
}

// -------------------------------------------------------------
// 4. Función principal
// -------------------------------------------------------------

// Prepara la animación en todas las secciones de <main> menos el Hero.
// El Hero no se anima porque es lo primero que se ve: tiene que aparecer en cuanto
// carga la página (además, animarlo empeoraría la nota de Lighthouse, issue #27)
export function initScrollReveal() {
  // Si la persona ha pedido reducir las animaciones en su sistema, no se hace nada.
  // El CSS ya no las aplicaría, pero así tampoco se ejecuta este código
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // threshold: 0.15 → avisa cuando se ve al menos el 15% del elemento.
  // rootMargin: el borde de abajo de la pantalla se sube un 5%, así la animación
  // empieza cuando el elemento ya ha entrado un poco y no justo en el borde
  const observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.15,
    rootMargin: '0px 0px -5% 0px',
  });

  const sections = document.querySelectorAll('main > section:not(#hero)');

  sections.forEach((section) => {
    getRevealTargets(section).forEach((el) => {
      el.classList.add('reveal');
      el.addEventListener('animationend', cleanUp);
      observer.observe(el);
    });
  });
}
