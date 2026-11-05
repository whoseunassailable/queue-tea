import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
    plugins: [externalizeDepsPlugin(), {
      name: 'build-provenance',
      writeBundle() {
        const git = (...args: string[]) => execFileSync('git', args, { cwd: resolve(__dirname, '..'), encoding: 'utf8' }).trim()
        let integration = 'main'
        try { integration = git('config', '--get', 'queue-tea.integrationBranch') || 'main' } catch { /* The default integration branch is main. */ }
        const provenance = { version: 1, commit: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current'), integration, dirty: git('status', '--porcelain') !== '', builtAt: new Date().toISOString() }
        mkdirSync(resolve(__dirname, 'out'), { recursive: true })
        writeFileSync(resolve(__dirname, 'out/provenance.json'), JSON.stringify(provenance))
      },
    }],
    // A packaged stage build is still packaged, so it has to be told what it is.
    define: { QUEUE_TEA_BUILT_FLAVOR: JSON.stringify(process.env.QUEUE_TEA_BUILD_FLAVOR ?? '') },
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
