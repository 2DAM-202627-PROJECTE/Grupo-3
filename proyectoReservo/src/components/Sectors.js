// =============================================================
// Sectors.js — Selector de sector que cambia el Hero (RF8, Arnau)
// Cuatro botones con los tipos de negocio a los que se dirige Reservo.
// Al pulsar uno, se marca como elegido y la tarjeta de reserva del Hero
// cambia a ese sector. Iconos de Lucide (issue #13, Jean).
//
// Partes del archivo:
//   1. Iconos y datos       → los iconos de Lucide y el array sectors
//   2. HTML de la sección   → renderSectors (lo llama main.js)
//   3. Elegir un sector     → marcar el botón pulsado y avisar al Hero
// =============================================================

// -------------------------------------------------------------
// 1. Iconos y datos
// -------------------------------------------------------------

// Función del Hero que cambia su tarjeta de reserva al sector elegido
import { selectHeroSector } from './Hero.js';

// createIcons convierte cada <i data-lucide="..."> en su dibujo SVG.
// Solo se importan los iconos que se usan: así el JavaScript final pesa menos
import {
  createIcons,
  Dumbbell,
  Utensils,
  Scissors,
  Stethoscope,
} from 'lucide';

// Datos de cada sector. Si se añade o quita alguno, solo hay que tocar este array.
//   - id:     nombre interno del sector. Es el que recibe selectHeroSector del Hero
//   - icon:   nombre del icono de Lucide (va en data-lucide, en minúsculas)
//   - name:   título del botón
//   - detail: frase corta debajo del título
const sectors = [
  { id: 'gimnasio', icon: 'dumbbell', name: 'Gimnasios', detail: 'Clases, entrenamientos y aforo.' },
  { id: 'restaurante', icon: 'utensils', name: 'Restaurantes', detail: 'Mesas, turnos y reservas.' },
  { id: 'peluqueria', icon: 'scissors', name: 'Peluquerías', detail: 'Servicios, profesionales y horarios.' },
  { id: 'clinica', icon: 'stethoscope', name: 'Clínicas', detail: 'Consultas y citas por especialista.' },
];

// -------------------------------------------------------------
// 2. HTML de la sección
// -------------------------------------------------------------

// Pinta la sección dentro del <section id="sectores"> que le pasa main.js
export function renderSectors(container) {
  // Franja blanca medio transparente con una línea arriba y abajo: la separa del Hero y de Funciones
  container.className = 'border-y border-white/60 bg-white/30 py-20 lg:py-24';

  container.innerHTML = /*html*/ `
    <!-- Contenedor con márgenes laterales, como el resto de secciones -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Título y subtítulo centrados -->
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Pensado para cualquier negocio con citas</h2>
        <p class="mt-4 text-lg text-slate-600">Elige tu sector y descubre cómo se vería tu página de reservas.</p>
      </div>

      <!-- Botones de los sectores: 2 columnas en móvil y 4 en escritorio (lg).
           role="group" + aria-label: el lector de pantalla anuncia los cuatro botones juntos
           y explica para qué sirven -->
      <div class="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" role="group" aria-label="Selecciona un sector para actualizar la demo">
        ${sectors
          .map(
            ({ id, icon, name, detail }, index) => /*html*/ `
          <!-- Un botón por sector, con estilo de tarjeta de cristal (glass de style.css).
               El primero (gimnasio) empieza elegido, porque es el que muestra el Hero al cargar:
               borde índigo y fondo lila. Los demás, borde y fondo blancos.
               aria-pressed: dice al lector de pantalla si el botón está elegido ("true") o no.
               data-sector: guarda el id del sector para saber cuál se ha pulsado -->
          <button type="button" class="sector-option glass rounded-xl border ${index === 0 ? 'border-indigo-400 bg-indigo-50/80' : 'border-white/90 bg-white/55'} p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:p-5" aria-pressed="${index === 0}" data-sector="${id}">
            <!-- Icono del sector. Es un <span> y no un <div> porque dentro de un <button>
                 solo puede ir contenido en línea; block hace que ocupe su propia fila.
                 aria-hidden="true": es solo decoración, el nombre ya dice qué sector es -->
            <span class="block text-indigo-600" aria-hidden="true">
              <i data-lucide="${icon}" class="h-6 w-6"></i>
            </span>
            <span class="mt-3 block font-semibold text-slate-900">${name}</span>
            <span class="mt-1 block text-sm leading-relaxed text-slate-600">${detail}</span>
          </button>
        `,
          )
          .join('')}
      </div>
    </div>
  `;

  // Cambia los <i data-lucide="..."> de esta sección por sus SVG.
  // root: container → solo busca dentro de Sectores, no en toda la página
  createIcons({
    root: container,
    icons: {
      Dumbbell,
      Utensils,
      Scissors,
      Stethoscope,
    },
  });

  // -------------------------------------------------------------
  // 3. Elegir un sector
  // -------------------------------------------------------------

  // Al pulsar un botón: se marca como elegido, se desmarcan los demás
  // y el Hero cambia su tarjeta de reserva a ese sector
  container.querySelectorAll('.sector-option').forEach((button) => {
    button.addEventListener('click', () => {
      container.querySelectorAll('.sector-option').forEach((sectorButton) => {
        const isActive = sectorButton === button;
        sectorButton.setAttribute('aria-pressed', String(isActive));
        // toggle(clase, condición): pone la clase si la condición es true y la quita si es false.
        // El elegido lleva borde índigo y fondo lila; los demás, borde y fondo blancos
        sectorButton.classList.toggle('border-indigo-400', isActive);
        sectorButton.classList.toggle('bg-indigo-50/80', isActive);
        sectorButton.classList.toggle('border-white/90', !isActive);
        sectorButton.classList.toggle('bg-white/55', !isActive);
      });
      // button.dataset.sector lee el atributo data-sector del botón pulsado ("gimnasio", "clinica"...)
      selectHeroSector(button.dataset.sector);
    });
  });
}
