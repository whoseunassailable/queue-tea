"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var preset_vite_1 = require("@preact/preset-vite");
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, preset_vite_1.default)()],
    esbuild: { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) },
    // The Guild Hall bundles the helpers from the repository's root.
    server: { fs: { allow: [(0, node_path_1.resolve)(__dirname, '..')] } },
    test: {
        include: ['main/**/*.spec.ts', 'renderer/**/*.spec.{ts,tsx}', 'tools/**/*.spec.ts'],
        environment: 'node',
        testTimeout: 30000,
        setupFiles: ['renderer/test_setup.ts'],
    },
});
