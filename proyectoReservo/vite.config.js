import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Ruta absoluta de un archivo de esta carpeta (la raíz del proyecto).
// import.meta.url es la dirección de este mismo archivo (vite.config.js).
// fileURLToPath la convierte en una ruta normal, respetando los espacios del nombre
// de la carpeta ("Projecte Intermodular")
const page = (file) => fileURLToPath(new URL(file, import.meta.url))

export default defineConfig({
  plugins: [tailwindcss()],

  // Configuración multipágina (apartado 3 del documento, viabilidad técnica): además de la landing,
  // la web tiene páginas legales separadas. Cada HTML de esta lista se incluye en
  // la build (npm run build) como una página más dentro de dist/
  build: {
    rolldownOptions: {
      input: {
        main: page('index.html'),
        cookies: page('politica-cookies.html'),
      },
    },
  },
})
