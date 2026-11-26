import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { configDefaults, defineConfig } from 'vitest/config'

import { BUDGET_SPECS, TEST_HOOK_TIMEOUT_MS, TEST_TIMEOUT_MS, TEST_WORKERS } from './tools/test_limits'

const SPECS = ['main/**/*.spec.ts', 'renderer/**/*.spec.{ts,tsx}', 'tools/**/*.spec.ts']

export default defineConfig({
  plugins: [preact()],
  esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
  // The Guild Hall bundles the helpers from the repository's root.
  server: { fs: { allow: [resolve(__dirname, '..')] } },
  test: {
    environment: 'node',
    testTimeout: TEST_TIMEOUT_MS,
    hookTimeout: TEST_HOOK_TIMEOUT_MS,
    // Vitest's default is every core but one. Its own process transforms each
    // file the workers load and reports for all of them, so on a laptop that
    // is also running the app and Claude Code it falls behind, and the tests
    // time out waiting on it.
    maxWorkers: TEST_WORKERS,
    setupFiles: ['renderer/test_setup.ts'],
    projects: [
      { extends: true, test: { name: 'app', include: SPECS, exclude: [...configDefaults.exclude, ...BUDGET_SPECS] } },
      // A later group: these start only once every other file has finished.
      { extends: true, test: { name: 'speed budgets', include: BUDGET_SPECS, sequence: { groupOrder: 1 } } },
    ],
  },
})
