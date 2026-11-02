import preact from '@preact/preset-vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [preact()],
  test: {
    include: ['main/**/*.spec.ts', 'renderer/**/*.spec.{ts,tsx}', 'tools/**/*.spec.ts'],
    environment: 'node',
    testTimeout: 30_000,
  },
})
