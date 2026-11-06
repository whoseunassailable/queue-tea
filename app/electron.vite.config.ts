import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { build as viteBuild } from 'vite'
import { currentProvenance } from './tools/release_guard.mjs'

export default defineConfig({
  main: {
    esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
    plugins: [externalizeDepsPlugin(), {
      name: 'build-provenance',
      async writeBundle() {
        const provenance = currentProvenance()
        mkdirSync(resolve(__dirname, 'out'), { recursive: true })
        writeFileSync(resolve(__dirname, 'out/provenance.json'), JSON.stringify(provenance))
        // A standalone stdio server, outside app.asar in packaged builds. Bundle
        // its SDK as well so the user's shell needs no npm install.
        await viteBuild({
          configFile: false,
          root: __dirname,
          ssr: { noExternal: true },
          build: {
            ssr: resolve(__dirname, 'main/codex.ts'),
            target: 'node22',
            outDir: resolve(__dirname, 'out/codex'),
            rollupOptions: { output: { format: 'cjs', entryFileNames: 'server.cjs', inlineDynamicImports: true } },
          },
        })
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
