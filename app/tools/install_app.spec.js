"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var SCRIPT = (0, node_path_1.join)(__dirname, 'install_app.sh');
// Run against a folder of its own, never the real /Applications.
(0, vitest_1.describe)('installing the app', function () {
    var folder;
    // Writes what it was asked to a journal; pgrep's is there to show no one asks.
    var standIn = function (name) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, 'bin'), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'bin', name), "#!/bin/sh\necho \"".concat(name, " $*\" >>\"").concat((0, node_path_1.join)(folder, 'journal'), "\"\n"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(folder, 'bin', name), 493)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var install = function () { return run('/bin/sh', [SCRIPT], { cwd: folder, env: __assign(__assign({}, process.env), { PATH: "".concat((0, node_path_1.join)(folder, 'bin'), ":/usr/bin:/bin") }) }); };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-install-'))];
                case 1:
                    folder = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(folder, { recursive: true, force: true }); });
    (0, vitest_1.it)('stops with no build, and says what to run', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)(install()).rejects.toMatchObject({ code: 1, stderr: vitest_1.expect.stringContaining('npm run package') })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('swaps the new copy in under an open app and retains the previous app for recovery', function () { return __awaiter(void 0, void 0, void 0, function () {
        var apps, held, _a, _b, names, previous, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    apps = (0, node_path_1.join)(folder, 'Applications');
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, 'dist/mac-arm64/Queue-tea.app/Contents'), { recursive: true })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'dist/mac-arm64/Queue-tea.app/Contents/Info.plist'), 'new')];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(apps, 'Queue-tea.app/Contents'), { recursive: true })];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(apps, 'Queue-tea.app/Contents/Info.plist'), 'old')];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, standIn('node')];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, standIn('lsregister')];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, standIn('pgrep')
                        // What the open app holds keeps reading as it was.
                    ];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.open)((0, node_path_1.join)(apps, 'Queue-tea.app/Contents/Info.plist'), 'r')];
                case 8:
                    held = _e.sent();
                    return [4 /*yield*/, run('/bin/sh', [SCRIPT], { cwd: folder, env: __assign(__assign({}, process.env), { QUEUE_TEA_APPLICATIONS: apps, PATH: "".concat((0, node_path_1.join)(folder, 'bin'), ":/usr/bin:/bin") }) })];
                case 9:
                    _e.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(apps, 'Queue-tea.app/Contents/Info.plist'), 'utf8')];
                case 10:
                    _a.apply(void 0, [_e.sent()]).toBe('new');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, held.readFile()];
                case 11:
                    _b.apply(void 0, [(_e.sent()).toString()]).toBe('old');
                    return [4 /*yield*/, held.close()];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.readdir)(apps)];
                case 13:
                    names = _e.sent();
                    (0, vitest_1.expect)(names).toContain('Queue-tea.app');
                    previous = names.find(function (n) { return n.startsWith('.Queue-tea.app.previous-'); });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(apps, previous, 'Contents/Info.plist'), 'utf8')];
                case 14:
                    _c.apply(void 0, [_e.sent()]).toBe('old');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(folder, 'journal'), 'utf8')];
                case 15:
                    _d.apply(void 0, [_e.sent()]).toContain("lsregister -f ".concat((0, node_path_1.join)(apps, 'Queue-tea.app'), "\n"));
                    return [2 /*return*/];
            }
        });
    }); });
});
