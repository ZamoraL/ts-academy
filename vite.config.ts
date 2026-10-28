import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
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
