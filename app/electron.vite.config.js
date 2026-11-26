"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var preset_vite_1 = require("@preact/preset-vite");
var electron_vite_1 = require("electron-vite");
var vite_1 = require("vite");
var release_guard_mjs_1 = require("./tools/release_guard.mjs");
// Every build gets its compiler options here, so none reads the repo's root
// tsconfig, which extends a gitignored file that a clean release copy lacks.
var esbuild = { tsconfigRaw: JSON.stringify({ compilerOptions: { target: 'ES2023', jsx: 'react-jsx', jsxImportSource: 'preact' } }) };
exports.default = (0, electron_vite_1.defineConfig)({
    main: {
        esbuild: esbuild,
        plugins: [(0, electron_vite_1.externalizeDepsPlugin)(), {
                name: 'build-provenance',
                writeBundle: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var provenance;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    provenance = (0, release_guard_mjs_1.currentProvenance)();
                                    (0, node_fs_1.mkdirSync)((0, node_path_1.resolve)(__dirname, 'out'), { recursive: true });
                                    (0, node_fs_1.writeFileSync)((0, node_path_1.resolve)(__dirname, 'out/provenance.json'), JSON.stringify(provenance));
                                    // A standalone stdio server, outside app.asar in packaged builds. Bundle
                                    // its SDK as well so the user's shell needs no npm install.
                                    return [4 /*yield*/, (0, vite_1.build)({
                                            configFile: false,
                                            esbuild: esbuild,
                                            root: __dirname,
                                            ssr: { noExternal: true },
                                            build: {
                                                ssr: (0, node_path_1.resolve)(__dirname, 'main/codex.ts'),
                                                target: 'node22',
                                                outDir: (0, node_path_1.resolve)(__dirname, 'out/codex'),
                                                rollupOptions: { output: { format: 'cjs', entryFileNames: 'server.cjs', inlineDynamicImports: true } },
                                            },
                                        })];
                                case 1:
                                    // A standalone stdio server, outside app.asar in packaged builds. Bundle
                                    // its SDK as well so the user's shell needs no npm install.
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
            }],
        // A packaged stage build is still packaged, so it has to be told what it is.
        define: { QUEUE_TEA_BUILT_FLAVOR: JSON.stringify((_a = process.env.QUEUE_TEA_BUILD_FLAVOR) !== null && _a !== void 0 ? _a : ''), QUEUE_TEA_SOURCE: JSON.stringify((0, release_guard_mjs_1.currentProvenance)()) },
        build: { lib: { entry: (0, node_path_1.resolve)(__dirname, 'main/main.ts') } },
    },
    preload: {
        esbuild: esbuild,
        plugins: [(0, electron_vite_1.externalizeDepsPlugin)()],
        build: { lib: { entry: (0, node_path_1.resolve)(__dirname, 'preload/preload.ts') } },
    },
    renderer: {
        esbuild: esbuild,
        root: (0, node_path_1.resolve)(__dirname, 'renderer'),
        plugins: [(0, preset_vite_1.default)()],
        server: { fs: { allow: [(0, node_path_1.resolve)(__dirname, '..')] } },
        build: { rollupOptions: { input: (0, node_path_1.resolve)(__dirname, 'renderer/index.html') } },
    },
});
