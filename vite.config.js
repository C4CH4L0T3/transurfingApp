import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: necesario para que la app cargue desde el disco (Electron)
  // y sigue funcionando servida desde la raíz en la web (Vercel).
  base: './',
  plugins: [react(), tailwindcss()],
})
