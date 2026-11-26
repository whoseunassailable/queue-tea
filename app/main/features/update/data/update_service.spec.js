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
var vitest_1 = require("vitest");
var update_service_1 = require("./update_service");
var update_runner_mjs_1 = require("../../../../tools/update_runner.mjs");
var logger_1 = require("../../../core/logger");
vitest_1.vi.mock('../../../../tools/update_runner.mjs', function () { return ({ readUpdate: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, null];
    }); }); }), queuePublished: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, true];
    }); }); }), updateFolder: function () { return '/unused'; } }); });
(0, vitest_1.beforeEach)(function () { return vitest_1.vi.mocked(update_runner_mjs_1.readUpdate).mockReset().mockResolvedValue(null); });
var setup = function (busy, enabled) {
    if (busy === void 0) { busy = false; }
    if (enabled === void 0) { enabled = true; }
    var restart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    var service = (0, update_service_1.updateService)({ running: { version: '1.5.2', commit: 'a'.repeat(40) }, repository: '/repo/.git', enabled: enabled, tools: '/trusted/tools', isBusy: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, busy];
        }); }); },
        installed: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ version: '1.5.2', commit: 'b'.repeat(40) })];
        }); }); }, restart: restart, log: (0, logger_1.createLogger)('dev', function () { }) });
    return { service: service, restart: restart };
};
(0, vitest_1.it)('detects a changed source at the same version and restarts only when safe', function () { return __awaiter(void 0, void 0, void 0, function () {
    var safe, _a, busy, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                safe = setup();
                _a = vitest_1.expect;
                return [4 /*yield*/, safe.service.read()];
            case 1:
                _a.apply(void 0, [(_c.sent()).canRestart]).toBe(true);
                return [4 /*yield*/, safe.service.apply()];
            case 2:
                _c.sent();
                (0, vitest_1.expect)(safe.restart).toHaveBeenCalledOnce();
                busy = setup(true);
                _b = vitest_1.expect;
                return [4 /*yield*/, busy.service.read()];
            case 3:
                _b.apply(void 0, [(_c.sent()).canRestart]).toBe(false);
                return [4 /*yield*/, busy.service.apply()];
            case 4:
                _c.sent();
                (0, vitest_1.expect)(busy.restart).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('blocks restart during installation and offers retry after failure, beside the installed build', function () { return __awaiter(void 0, void 0, void 0, function () {
    var service, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                vitest_1.vi.mocked(update_runner_mjs_1.readUpdate).mockResolvedValue({ repository: '/repo/.git', phase: 'installing', commit: 'b'.repeat(40), detail: null });
                service = setup().service;
                _a = vitest_1.expect;
                return [4 /*yield*/, service.read()];
            case 1:
                _a.apply(void 0, [_c.sent()]).toMatchObject({ canRestart: false, canRetry: false });
                vitest_1.vi.mocked(update_runner_mjs_1.readUpdate).mockResolvedValue({ repository: '/repo/.git', phase: 'failed', commit: 'b'.repeat(40), detail: 'Retry' });
                _b = vitest_1.expect;
                return [4 /*yield*/, service.read()];
            case 2:
                _b.apply(void 0, [_c.sent()]).toMatchObject({ canRestart: true, canRetry: true });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a later push queued, building or failed does not block restarting into the build an earlier push installed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, phase, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0, _a = ['queued', 'checking', 'building', 'verifying', 'failed'];
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                phase = _a[_i];
                vitest_1.vi.mocked(update_runner_mjs_1.readUpdate).mockResolvedValue({ repository: '/repo/.git', phase: phase, commit: 'c'.repeat(40), detail: null });
                _b = vitest_1.expect;
                return [4 /*yield*/, setup().service.read()];
            case 2:
                _b.apply(void 0, [(_c.sent()).canRestart, phase]).toBe(true);
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('never offers a restart while the next build is being swapped into the Applications folder', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                vitest_1.vi.mocked(update_runner_mjs_1.readUpdate).mockResolvedValue({ repository: '/repo/.git', phase: 'installing', commit: 'c'.repeat(40), detail: null });
                _a = vitest_1.expect;
                return [4 /*yield*/, setup().service.read()];
            case 1:
                _a.apply(void 0, [(_b.sent()).canRestart]).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows and retries a launch failure even when its state could not be saved', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, service, restart, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                vitest_1.vi.mocked(update_runner_mjs_1.queuePublished).mockRejectedValueOnce(new Error('State directory unavailable'));
                _a = setup(), service = _a.service, restart = _a.restart;
                return [4 /*yield*/, service.published('/repo', 'origin', 'main', 'c'.repeat(40))];
            case 1:
                _c.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, service.read()];
            case 2:
                _b.apply(void 0, [_c.sent()]).toMatchObject({ state: { phase: 'failed', detail: vitest_1.expect.stringContaining('push succeeded') }, canRetry: true, canRestart: true });
                return [4 /*yield*/, service.apply()];
            case 3:
                _c.sent();
                (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                (0, vitest_1.expect)(update_runner_mjs_1.queuePublished).toHaveBeenLastCalledWith({ repo: '/repo', remote: 'origin', branch: 'main', commit: 'c'.repeat(40) }, { repository: '/repo/.git', tools: '/trusted/tools', retry: true });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('keeps stage/development and unrelated repository state away from production updates', function () { return __awaiter(void 0, void 0, void 0, function () {
    var disabled, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                disabled = setup(false, false);
                _a = vitest_1.expect;
                return [4 /*yield*/, disabled.service.read()];
            case 1:
                _a.apply(void 0, [_c.sent()]).toMatchObject({ canRestart: false, canRetry: false });
                vitest_1.vi.mocked(update_runner_mjs_1.queuePublished).mockClear();
                return [4 /*yield*/, disabled.service.published('/repo', 'origin', 'main', 'c'.repeat(40))];
            case 2:
                _c.sent();
                (0, vitest_1.expect)(update_runner_mjs_1.queuePublished).not.toHaveBeenCalled();
                vitest_1.vi.mocked(update_runner_mjs_1.readUpdate).mockResolvedValue({ repository: '/other/.git', phase: 'failed', commit: 'b'.repeat(40), detail: null });
                _b = vitest_1.expect;
                return [4 /*yield*/, setup().service.read()];
            case 3:
                _b.apply(void 0, [(_c.sent()).state.phase]).toBe('idle');
                return [2 /*return*/];
        }
    });
}); });
