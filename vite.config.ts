import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from a GitHub Pages project subpath (username.github.io/sigma-chi-website/),
  // so assets must be requested relative to that prefix. Override with
  // BASE_PATH=/ when deploying to a custom domain or a *.github.io root repo.
  base: process.env.BASE_PATH ?? '/sigma-chi-website/',
  plugins: [react()],
})
