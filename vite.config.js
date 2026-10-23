import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     tanstackRouter({
//       target: 'react',
//       autoCodeSplitting: true,
//     }),
//     react(),
//   ],
// })
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      react: path.resolve(import.meta.dirname, 'node_modules/react'),
      'react-dom': path.resolve(import.meta.dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],  // ← важно для монорепо
  },
})
