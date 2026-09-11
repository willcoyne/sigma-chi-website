import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served at the root of the custom domain washusigmachi.org, so no path prefix.
  // Override with BASE_PATH=/sigma-chi-website/ to preview under the
  // bare github.io project URL instead.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
