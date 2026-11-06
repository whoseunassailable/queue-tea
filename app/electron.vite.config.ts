import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { currentProvenance } from './tools/release_guard.mjs'

export default defineConfig({
  main: {
    esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
    plugins: [externalizeDepsPlugin(), {
      name: 'build-provenance',
      writeBundle() {
        const provenance = currentProvenance()
        mkdirSync(resolve(__dirname, 'out'), { recursive: true })
        writeFileSync(resolve(__dirname, 'out/provenance.json'), JSON.stringify(provenance))
      },
    }],
    // A packaged stage build is still packaged, so it has to be told what it is.
    define: { QUEUE_TEA_BUILT_FLAVOR: JSON.stringify(process.env.QUEUE_TEA_BUILD_FLAVOR ?? ''), QUEUE_TEA_SOURCE: JSON.stringify(currentProvenance()) },
    build: { lib: { entry: resolve(__dirname, 'main/main.ts') } },
  },
  preload: {
    esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
    plugins: [externalizeDepsPlugin()],
    build: { lib: { entry: resolve(__dirname, 'preload/preload.ts') } },
  },
  renderer: {
    esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
    root: resolve(__dirname, 'renderer'),
    plugins: [preact()],
    server: { fs: { allow: [resolve(__dirname, '..')] } },
    build: { rollupOptions: { input: resolve(__dirname, 'renderer/index.html') } },
  },
})
