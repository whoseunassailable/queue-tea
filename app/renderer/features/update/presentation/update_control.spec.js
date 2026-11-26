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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var test_support_1 = require("../../../test_support");
var update_control_1 = require("./update_control");
(0, vitest_1.afterEach)(preact_1.cleanup);
var view = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: null, state: { phase: 'idle', commit: null, detail: null }, canRetry: false, canRestart: false }, over));
};
var setup = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (data) {
        var readAppUpdate, _a, engine, fire;
        if (data === void 0) { data = view(); }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readAppUpdate = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: data })];
                    }); }); });
                    _a = (0, test_support_1.fakeEngine)({ readAppUpdate: readAppUpdate }), engine = _a.engine, fire = _a.fire;
                    (0, preact_1.render)(<update_control_1.UpdateControl engine={engine}/>);
                    return [4 /*yield*/, preact_1.screen.findByText('v1.5.2')];
                case 1:
                    _b.sent();
                    return [2 /*return*/, { engine: engine, fire: fire, readAppUpdate: readAppUpdate }];
            }
        });
    });
};
(0, vitest_1.it)('shows the running version next to Settings and disables an unavailable update', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: 'Settings' }).textContent).toContain('v1.5.2');
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Update' }).disabled).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('enables Update when a same-version build can safely restart', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, button;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup(view({ installed: { version: '1.5.2', commit: 'b'.repeat(40) }, state: { phase: 'installed', commit: 'b'.repeat(40), detail: null }, canRestart: true }))];
            case 1:
                engine = (_a.sent()).engine;
                button = preact_1.screen.getByRole('button', { name: 'Update' });
                (0, vitest_1.expect)(button.disabled).toBe(false);
                return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(button); })];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(engine.applyAppUpdate).toHaveBeenCalledOnce();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows build progress and a useful retry after failure', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, fire, readAppUpdate, engine, retry;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup(view({ state: { phase: 'building', commit: 'b'.repeat(40), detail: null } }))];
            case 1:
                _a = _b.sent(), fire = _a.fire, readAppUpdate = _a.readAppUpdate, engine = _a.engine;
                (0, vitest_1.expect)(preact_1.screen.getByRole('status').textContent).toContain('Building and testing');
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Update' }).disabled).toBe(true);
                readAppUpdate.mockResolvedValue({ ok: true, data: view({ state: { phase: 'failed', commit: 'b'.repeat(40), detail: 'Fix local dependencies, then retry.' }, canRetry: true }) });
                (0, preact_1.act)(fire);
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Retry update' })];
            case 2:
                retry = _b.sent();
                (0, vitest_1.expect)(retry.disabled).toBe(false);
                (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toContain('Fix local dependencies');
                return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(retry); })];
            case 3:
                _b.sent();
                (0, vitest_1.expect)(engine.applyAppUpdate).toHaveBeenCalledOnce();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a failed Update press stays on screen until a later read shows the update has moved on', function () { return __awaiter(void 0, void 0, void 0, function () {
    var installed, readAppUpdate, applyAppUpdate, _a, engine, fire, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                installed = view({ installed: { version: '1.5.2', commit: 'b'.repeat(40) }, state: { phase: 'installed', commit: 'b'.repeat(40), detail: null }, canRestart: true });
                readAppUpdate = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ ok: true, data: installed })];
                }); }); });
                applyAppUpdate = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ ok: false, error: { message: "Couldn't read or apply the app update. Try again." } })];
                }); }); });
                _a = (0, test_support_1.fakeEngine)({ readAppUpdate: readAppUpdate, applyAppUpdate: applyAppUpdate }), engine = _a.engine, fire = _a.fire;
                (0, preact_1.render)(<update_control_1.UpdateControl engine={engine}/>);
                return [4 /*yield*/, preact_1.screen.findByText('v1.5.2')];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Update' })); })];
            case 2:
                _c.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 3:
                _b.apply(void 0, [(_c.sent()).textContent]).toContain("Couldn't read or apply");
                return [4 /*yield*/, (0, preact_1.act)(fire)];
            case 4:
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toContain("Couldn't read or apply");
                readAppUpdate.mockResolvedValue({ ok: true, data: view({ state: { phase: 'building', commit: 'c'.repeat(40), detail: null } }) });
                (0, preact_1.act)(fire);
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByRole('status').textContent).toContain('Building and testing'); })];
            case 5:
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.queryByRole('alert')).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('Update restarts into an installed build while a later push is still building', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, button;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup(view({ installed: { version: '1.5.2', commit: 'b'.repeat(40) }, state: { phase: 'building', commit: 'c'.repeat(40), detail: null }, canRestart: true }))];
            case 1:
                engine = (_a.sent()).engine;
                button = preact_1.screen.getByRole('button', { name: 'Update' });
                (0, vitest_1.expect)(button.disabled).toBe(false);
                return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(button); })];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(engine.applyAppUpdate).toHaveBeenCalledOnce();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('allows a failed status read to be tried again', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, retry;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)({ readAppUpdate: vitest_1.vi.fn().mockRejectedValueOnce(new Error('IPC gone')).mockResolvedValue({ ok: true, data: view() }) }).engine;
                (0, preact_1.render)(<update_control_1.UpdateControl engine={engine}/>);
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Retry update' })];
            case 1:
                retry = _a.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(retry); })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByText('v1.5.2')).toBeTruthy(); })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
