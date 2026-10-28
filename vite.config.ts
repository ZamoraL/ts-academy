import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: funciona en cualquier subcarpeta (p. ej. GitHub Pages en /<repo>/). Las rutas van en el hash.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    // Segunda página: el sandbox donde corren los ejercicios de React.
    rollupOptions: {
      input: { main: 'index.html', sandbox: 'sandbox.html' },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
