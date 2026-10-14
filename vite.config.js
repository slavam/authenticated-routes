import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

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
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],  // ← важно для монорепо
  },
})
