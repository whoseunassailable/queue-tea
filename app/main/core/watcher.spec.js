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
var logger_1 = require("./logger");
var watcher_1 = require("./watcher");
var log = (0, logger_1.createLogger)('prod', function () { });
var dir;
var stop = function () { };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-watch-'))];
            case 1:
                dir = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stop();
                return [4 /*yield*/, (0, promises_1.rm)(dir, { recursive: true, force: true })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)('hasChanged', function () {
    (0, vitest_1.it)('sees a new, a gone and a rewritten file, and nothing else', function () {
        (0, vitest_1.expect)((0, watcher_1.hasChanged)({ a: 1 }, { a: 1 })).toBe(false);
        (0, vitest_1.expect)((0, watcher_1.hasChanged)({ a: 1 }, { a: 2 })).toBe(true);
        (0, vitest_1.expect)((0, watcher_1.hasChanged)({ a: 1 }, { a: 1, b: 1 })).toBe(true);
        (0, vitest_1.expect)((0, watcher_1.hasChanged)({ a: 1, b: 1 }, { a: 1 })).toBe(true);
    });
});
(0, vitest_1.describe)('watchFolders', function () {
    (0, vitest_1.it)('makes a folder that is not there yet', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, watcher_1.watchFolders)([(0, node_path_1.join)(dir, 'new')], function () { }, { settleMs: 5, sweepMs: 1000, log: log })];
                case 1:
                    stop = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.writeFile)((0, node_path_1.join)(dir, 'new', 'x.json'), '{}')).resolves.toBeUndefined()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('sees an atomic replace, and only once for a burst', function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, changed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = (0, node_path_1.join)(dir, 'r.json');
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, '{}')];
                case 1:
                    _a.sent();
                    changed = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, watcher_1.watchFolders)([dir], changed, { settleMs: 30, sweepMs: 10000, log: log })];
                case 2:
                    stop = _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)("".concat(file, ".tmp"), '{"a":1}')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.rename)("".concat(file, ".tmp"), file)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(changed).toHaveBeenCalledTimes(1); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 80); })];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(changed).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays quiet when an event changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var changed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changed = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'r.json'), '{}')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, watcher_1.watchFolders)([dir], changed, { settleMs: 5, sweepMs: 20, log: log })];
                case 2:
                    stop = _a.sent();
                    return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 70); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(changed).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the sweep catches what the events miss', function () { return __awaiter(void 0, void 0, void 0, function () {
        var changed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changed = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, watcher_1.watchFolders)([dir], changed, { settleMs: 100000, sweepMs: 20, log: log })];
                case 1:
                    stop = _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'late.json'), '{}')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(changed).toHaveBeenCalled(); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
