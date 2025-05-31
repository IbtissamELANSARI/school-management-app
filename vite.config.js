import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ command }) => {

  const config = {
    plugins: [react(), svgr()],
    server: {
      host: 'localhost',
      port: 3000
    },
    build: {
      outDir: 'docs',
    },
    resolve: {
      alias: {
        '@': '/src', // Adjust this path based on your project structure
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router', 'axios'], // Include necessary dependencies
    },
  }

  // Sets the base URL only during the build process
  if (command === 'build') {
    config.base = '/school-management-app'
  }

  return config
})