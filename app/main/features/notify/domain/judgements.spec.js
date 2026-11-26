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
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../../tasks/api/fixtures");
var judgements_1 = require("./judgements");
var realm = function (key, tasks) { return ({ kind: 'readable', key: key, file: "/f/".concat(key, ".json"), modifiedAt: 0, record: __assign(__assign({}, (0, record_source_1.emptyRecord)(key, "/p/".concat(key))), { tasks: tasks }) }); };
var broken = { kind: 'unreadable', key: 'bad-000001', file: '/f/bad.json', name: 'bad', reason: 'no', isNewer: false, canRestore: false, modifiedAt: 0 };
var asking = function (id, at) {
    if (at === void 0) { at = '2026-10-27T18:00:00+01:00'; }
    return (0, fixtures_1.makeTask)({ id: id, title: "Quest ".concat(id), state: 'current', review: { at: at, checked: null } });
};
var setup = function (first) {
    if (first === void 0) { first = []; }
    var scanned = first;
    var isAway = true;
    var notify = vitest_1.vi.fn();
    var log = { error: vitest_1.vi.fn() };
    var check = (0, judgements_1.judgementWatch)({ scan: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, scanned];
        }); }); }, isAway: function () { return isAway; }, notify: notify, log: log });
    return { check: check, notify: notify, log: log, show: function (next) { return void (scanned = next); }, away: function (value) { return void (isAway = value); } };
};
(0, vitest_1.describe)('who is asking', function () {
    (0, vitest_1.it)('finds the active quest asking, in any realm', function () {
        (0, vitest_1.expect)((0, judgements_1.askedOf)([realm('a', [asking('one')]), realm('b', [(0, fixtures_1.makeTask)({ id: 'two', state: 'current' })])])).toEqual([{ key: 'a', taskId: 'one', title: 'Quest one', at: '2026-10-27T18:00:00+01:00' }]);
    });
    (0, vitest_1.it)('skips a record that doesn\'t read', function () {
        (0, vitest_1.expect)((0, judgements_1.askedOf)([broken])).toEqual([]);
    });
});
(0, vitest_1.describe)('the notification', function () {
    (0, vitest_1.it)('says nothing about what was already asked when the app opened', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, notify, log;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup([realm('a', [asking('one')])]), check = _a.check, notify = _a.notify, log = _a.log;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(notify).not.toHaveBeenCalled();
                    // Quiet because it knew to be, not because something fell over.
                    (0, vitest_1.expect)(log.error).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says once when Claude newly asks, in the background', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, notify, show;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup([realm('a', [(0, fixtures_1.makeTask)({ id: 'one', state: 'current' })])]), check = _a.check, notify = _a.notify, show = _a.show;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    show([realm('a', [asking('one')])]);
                    return [4 /*yield*/, check()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, check()];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(notify).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(notify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ key: 'a', title: 'Quest one' }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays quiet with the app in front', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, notify, show, away;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup(), check = _a.check, notify = _a.notify, show = _a.show, away = _a.away;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    away(false);
                    show([realm('a', [asking('one')])]);
                    return [4 /*yield*/, check()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(notify).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('doesn\'t bring it up later, once seen in front', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, notify, show, away;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup(), check = _a.check, notify = _a.notify, show = _a.show, away = _a.away;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    away(false);
                    show([realm('a', [asking('one')])]);
                    return [4 /*yield*/, check()];
                case 2:
                    _b.sent();
                    away(true);
                    return [4 /*yield*/, check()];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(notify).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tells of a realm the window isn\'t showing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, notify, show;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup([realm('a', [])]), check = _a.check, notify = _a.notify, show = _a.show;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    show([realm('a', []), realm('b', [asking('two')])]);
                    return [4 /*yield*/, check()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(notify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ key: 'b' }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tells again when Claude asks again after Not yet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, check, notify, show;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup([realm('a', [(0, fixtures_1.makeTask)({ id: 'one', state: 'current' })])]), check = _a.check, notify = _a.notify, show = _a.show;
                    return [4 /*yield*/, check()];
                case 1:
                    _b.sent();
                    show([realm('a', [asking('one', '2026-10-27T18:00:00+01:00')])]);
                    return [4 /*yield*/, check()];
                case 2:
                    _b.sent();
                    show([realm('a', [(0, fixtures_1.makeTask)({ id: 'one', state: 'current' })])]);
                    return [4 /*yield*/, check()];
                case 3:
                    _b.sent();
                    show([realm('a', [asking('one', '2026-10-27T18:30:00+01:00')])]);
                    return [4 /*yield*/, check()];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(notify).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tells once when two changes land together', function () { return __awaiter(void 0, void 0, void 0, function () {
        var release, scans, scanned, notify, check, first, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    release = function () { };
                    scans = [];
                    scanned = [];
                    notify = vitest_1.vi.fn();
                    check = (0, judgements_1.judgementWatch)({
                        scan: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(scans.length === 1)) return [3 /*break*/, 2];
                                        scans.push(new Promise(function (done) { return (release = done); }));
                                        return [4 /*yield*/, scans[1]];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        scans.push(Promise.resolve());
                                        _a.label = 3;
                                    case 3: return [2 /*return*/, scanned];
                                }
                            });
                        }); },
                        isAway: function () { return true; },
                        notify: notify,
                        log: { error: vitest_1.vi.fn() },
                    });
                    return [4 /*yield*/, check()];
                case 1:
                    _a.sent();
                    scanned = [realm('a', [asking('one')])];
                    first = check();
                    second = check();
                    release();
                    return [4 /*yield*/, Promise.all([first, second])];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(notify).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('logs a scan that fails, and carries on', function () { return __awaiter(void 0, void 0, void 0, function () {
        var log, scan, check;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log = { error: vitest_1.vi.fn() };
                    scan = vitest_1.vi.fn().mockRejectedValueOnce(new Error('disk')).mockResolvedValue([]);
                    check = (0, judgements_1.judgementWatch)({ scan: scan, isAway: function () { return true; }, notify: vitest_1.vi.fn(), log: log });
                    return [4 /*yield*/, check()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, check()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(log.error).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(scan).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
