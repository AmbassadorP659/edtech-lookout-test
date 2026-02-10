import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Note: Since index.html and App.jsx are in your root, 
  // no additional 'root' or 'base' paths are needed.
})