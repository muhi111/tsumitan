import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/tsumitan-frontend/',  // ✅ ココが重要
  plugins: [react()],
})
