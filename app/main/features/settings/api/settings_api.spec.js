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
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var settings_api_1 = require("./settings_api");
var dir;
var deps;
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var log;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-settings-'))];
            case 1:
                dir = _a.sent();
                log = (0, logger_1.createLogger)('prod', function () { });
                deps = { host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }), file: (0, node_path_1.join)(dir, 'settings.json'), log: log };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(dir, { recursive: true, force: true }); });
(0, vitest_1.describe)('settings', function () {
    (0, vitest_1.it)('starts from the defaults', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, settings_api_1.readSettings)(deps)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: true, data: settings_api_1.DEFAULT_SETTINGS });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a chosen sky across reads', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, settings_api_1.saveSettings)(deps, { sky: 'night' })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, settings_api_1.readSettings)(deps)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ data: { sky: 'night' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a change keeps what was saved before', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, settings_api_1.saveSettings)(deps, { sky: 'day' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, settings_api_1.saveSettings)(deps, { isCalm: true })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, settings_api_1.readSettings)(deps)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ data: { sky: 'day', isCalm: true } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a value it cannot use and saves nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var saved, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, settings_api_1.saveSettings)(deps, { sky: 'purple' })];
                case 1:
                    saved = _b.sent();
                    (0, vitest_1.expect)(saved).toEqual({ ok: false, error: { message: "That setting isn't one Queue-tea can use. Pick another." } });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, deps.host.exists(deps.file)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps which account each realm belongs to', function () { return __awaiter(void 0, void 0, void 0, function () {
        var saved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, settings_api_1.saveSettings)(deps, { realmAccounts: { 'a-000001': 'first-account' } })];
                case 1:
                    saved = _a.sent();
                    (0, vitest_1.expect)(saved).toMatchObject({ ok: true, data: { realmAccounts: { 'a-000001': 'first-account' } } });
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a login that is not one', { 'a-000001': 'not a login' }],
        ['a list', ['first-account']],
        ['nothing', null],
    ])('refuses %s for a realm\'s account, keeping what was saved', function (_, realmAccounts) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, settings_api_1.saveSettings)(deps, { realmAccounts: { 'a-000001': 'first-account' } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, settings_api_1.saveSettings)(deps, { realmAccounts: realmAccounts })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, settings_api_1.readSettings)(deps)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ ok: true, data: { realmAccounts: { 'a-000001': 'first-account' } } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a broken settings file falls back to the defaults', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(deps.file, '{oops')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, settings_api_1.readSettings)(deps)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: true, data: settings_api_1.DEFAULT_SETTINGS });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a field with a bad value falls back and the rest are kept', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(deps.file, JSON.stringify({ sky: 'purple', isCalm: true }))];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, settings_api_1.readSettings)(deps)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ data: { sky: 'auto', isCalm: true } });
                    return [2 /*return*/];
            }
        });
    }); });
});
