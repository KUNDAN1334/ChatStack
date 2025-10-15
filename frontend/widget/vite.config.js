import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/widget.jsx',
      name: 'ProdeskChatbot',
      fileName: (format) => `widget.${format}.js`,
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  }
})
