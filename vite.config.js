import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Srijan26_SnapSyntax_Binarysqad/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    strictPort: false
  }
})
