import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Ruta absoluta de un archivo de esta carpeta (la raíz del proyecto).
// import.meta.url es la dirección de este mismo archivo (vite.config.js).
// fileURLToPath la convierte en una ruta normal, respetando los espacios del nombre
// de la carpeta ("Projecte Intermodular")
const page = (file) => fileURLToPath(new URL(file, import.meta.url))

// defineConfig recibe una función para poder saber qué comando se está ejecutando:
//   - command: 'build' con npm run build, 'serve' con npm run dev y npm run preview
//   - isPreview: true solo con npm run preview
export default defineConfig(({ command, isPreview }) => ({
  plugins: [tailwindcss()],

  // URL base (tutorial de deploy del profesor, apartado "Adaptar site a la base URL").
  // En GitHub Pages la web está en https://2dam-202627-projecte.github.io/Grupo-3/,
  // así que todas las rutas tienen que empezar por /Grupo-3/.
  // Solo se usa al compilar (build) y en preview, que sirve lo compilado. Con npm run dev
  // se queda en '/', así en local se sigue abriendo http://localhost:5173/ como siempre.
  // En el JavaScript esta ruta se lee con import.meta.env.BASE_URL
  base: command === 'build' || isPreview ? '/Grupo-3/' : '/',

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
}))
