/// <reference types="vitest" />

import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The use of __dirname and __filename in ES modules is a Vite specific feature
 */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@public': resolve(__dirname, './public'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
