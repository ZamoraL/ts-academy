import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Build aparte para el sandbox de los ejercicios de React. Usa la versión de desarrollo de React
// porque `act`, que necesita Testing Library, no existe en la de producción. Se escribe en dist/
// junto a la app (`npm run build` hace primero la app y luego esto).
export default defineConfig({
  base: './',
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('development') },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: { input: { sandbox: 'sandbox.html' } },
  },
})
