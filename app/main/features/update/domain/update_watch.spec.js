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
var update_watch_1 = require("./update_watch");
var setup = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.installed, installed = _c === void 0 ? '1.5.0' : _c, _d = _b.isAway, isAway = _d === void 0 ? true : _d, _e = _b.isBusy, isBusy = _e === void 0 ? false : _e, _f = _b.says, says = _f === void 0 ? false : _f;
    var restart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    var ask = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, says];
    }); }); });
    var log = { error: vitest_1.vi.fn() };
    var check = (0, update_watch_1.updateWatch)({ running: { version: '1.4.0', commit: 'a'.repeat(40) }, installed: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, installed === null ? null : { version: installed, commit: 'a'.repeat(40) }];
        }); }); }, isAway: function () { return isAway; }, isBusy: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, isBusy];
        }); }); }, ask: ask, restart: restart, log: log });
    return { check: check, restart: restart, ask: ask, log: log };
};
(0, vitest_1.describe)('moving to the installed version', function () {
    (0, vitest_1.it)('restarts for a changed source commit at the same displayed version, after work is safe', function () { return __awaiter(void 0, void 0, void 0, function () {
        var busy, restart, check;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    busy = true;
                    restart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    check = (0, update_watch_1.updateWatch)({ running: { version: '1.5.2', commit: 'a'.repeat(40) }, installed: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ version: '1.5.2', commit: 'b'.repeat(40) })];
                        }); }); }, isAway: function () { return true; }, isBusy: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, busy];
                        }); }); }, ask: vitest_1.vi.fn(), restart: restart, log: { error: vitest_1.vi.fn() } });
                    return [4 /*yield*/, check()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                    busy = false;
                    return [4 /*yield*/, check()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(restart).toHaveBeenCalledWith(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never restarts a busy app for a major update even after an earlier confirmation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, ask;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ installed: '2.0.0', isAway: false, isBusy: true, says: true }), check = _a.check, restart = _a.restart, ask = _a.ask;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(ask).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does nothing while the installed copy is the one running', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, ask, log;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ installed: '1.4.0' }), check = _a.check, restart = _a.restart, ask = _a.ask, log = _a.log;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(ask).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(log.error).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('restarts quietly, behind what you are using, once you step away', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, ask;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup(), check = _a.check, restart = _a.restart, ask = _a.ask;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(restart).toHaveBeenCalledWith(false);
                    (0, vitest_1.expect)(ask).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('waits while you are using the window, without asking about a small update', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, ask;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ isAway: false }), check = _a.check, restart = _a.restart, ask = _a.ask;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(ask).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('waits while something is half done, even when you are away', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ isBusy: true }), check = _a.check, restart = _a.restart;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks once about a new major version while you use the window, and restarts in front on yes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, ask;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ installed: '2.0.0', isAway: false, says: true }), check = _a.check, restart = _a.restart, ask = _a.ask;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(ask).toHaveBeenCalledWith('2.0.0');
                    (0, vitest_1.expect)(restart).toHaveBeenCalledWith(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes Later as an answer and never asks again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, ask;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ installed: '2.0.0', isAway: false, says: false }), check = _a.check, restart = _a.restart, ask = _a.ask;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, check()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(ask).toHaveBeenCalledOnce();
                    (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves to a major version without asking when you are away', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, ask;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ installed: '2.0.0' }), check = _a.check, restart = _a.restart, ask = _a.ask;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(ask).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(restart).toHaveBeenCalledWith(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('logs a failed restart and tries again on the next check', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart, log;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup(), check = _a.check, restart = _a.restart, log = _a.log;
                    restart.mockRejectedValueOnce(new Error('no shell'));
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, check()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(log.error).toHaveBeenCalledOnce();
                    (0, vitest_1.expect)(restart).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does nothing when the installed copy says no version', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, restart;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ installed: null }), check = _a.check, restart = _a.restart;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(restart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
