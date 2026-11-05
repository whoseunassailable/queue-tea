import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [preact()],
  esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
  // The Guild Hall bundles the helpers from the repository's root.
  server: { fs: { allow: [resolve(__dirname, '..')] } },
  test: {
    include: ['main/**/*.spec.ts', 'renderer/**/*.spec.{ts,tsx}', 'tools/**/*.spec.ts'],
    environment: 'node',
    testTimeout: 30_000,
    setupFiles: ['renderer/test_setup.ts'],
  },
})
