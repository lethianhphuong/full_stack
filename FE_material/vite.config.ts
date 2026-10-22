import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_APP_BASENAME || '/',
  server: {
    host: true, // Cho phép Docker container truy cập qua host.docker.internal
    port: 5173,
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@mui/material'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Allow @use '@/styles/...' in SCSS files
        additionalData: `@use "@/styles/variables" as *; @use "@/styles/mixins" as *;`,
      },
    },
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/Tooltip',
      '@mui/material/Container',
      '@mui/material/styles',
      '@mui/system',
    ],
  },
})
