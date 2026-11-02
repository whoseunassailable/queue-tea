import { resolve } from 'node:path'

import preact from '@preact/preset-vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: { lib: { entry: resolve(__dirname, 'main/main.ts') } },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: { lib: { entry: resolve(__dirname, 'preload/preload.ts') } },
  },
  renderer: {
    root: resolve(__dirname, 'renderer'),
    plugins: [preact()],
    server: { fs: { allow: [resolve(__dirname, '..')] } },
    build: { rollupOptions: { input: resolve(__dirname, 'renderer/index.html') } },
  },
})
