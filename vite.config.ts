import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // Rutas relativas: funciona en cualquier subcarpeta (p. ej. GitHub Pages en /<repo>/). Las rutas van en el hash.
  base: './',
  plugins: [react(), tailwindcss()],
  // El sandbox de los ejercicios de React tiene su propio build: vite.sandbox.config.ts.
  test: {
    include: ['src/**/*.test.ts'],
  },
})
