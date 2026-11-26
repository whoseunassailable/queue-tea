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
exports.change = exports.applySaved = exports.markUnreadable = void 0;
exports.loadRecord = loadRecord;
exports.reloadIfChanged = reloadIfChanged;
exports.changeRecord = changeRecord;
var logger_1 = require("../../../../core/logger/logger");
var live_1 = require("../../../../core/session/live");
var ranking_1 = require("../../../backlog/domain/services/ranking");
var records_providers_1 = require("../../records_providers");
// The menu's failed state, with why the record can't be read and whether
// its last good copy can take its place. Nothing is written to it.
var markUnreadable = function (p, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 5]);
                _b = (_a = p).set;
                _c = ['loadError'];
                return [4 /*yield*/, (0, records_providers_1.recordsRepositoryOf)(p, ctx).problem()];
            case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 2:
                _d.sent();
                return [3 /*break*/, 5];
            case 3:
                err_1 = _d.sent();
                p.log("reading why the record can't be read failed: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                return [4 /*yield*/, p.set('loadError', null)];
            case 4:
                _d.sent();
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, p.set('load', 'failed')];
            case 6:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.markUnreadable = markUnreadable;
// Shows what a change left: the record, or on an unreadable one says so in
// the panel. Returns the record as saved, or null.
var applySaved = function (p, ctx, saved) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(saved === 'unreadable')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports.markUnreadable)(p, ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/, null];
            case 2: return [4 /*yield*/, p.set('record', saved)];
            case 3:
                _a.sent();
                return [2 /*return*/, saved];
        }
    });
}); };
exports.applySaved = applySaved;
// Changes the record; on an unreadable one says so in the panel and changes
// nothing. Returns the record as saved, or null.
var change = function (p, ctx, fn) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = exports.applySaved;
            _b = [p, ctx];
            return [4 /*yield*/, (0, records_providers_1.recordsRepositoryOf)(p, ctx).update(fn)];
        case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
    }
}); }); };
exports.change = change;
function loadRecord(p) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, record, err_2, _a, _b, _c, err_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    ctx = live_1.live.ctx;
                    if (!(ctx === null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, p.set('load', 'failed')];
                case 1:
                    _d.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, p.set('load', 'loading')];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 11, , 13]);
                    return [4 /*yield*/, (0, records_providers_1.recordsRepositoryOf)(p, ctx).read()];
                case 5:
                    record = _d.sent();
                    if (!(record === 'unreadable')) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, exports.markUnreadable)(p, ctx)];
                case 6:
                    _d.sent();
                    return [2 /*return*/];
                case 7: return [4 /*yield*/, p.set('record', record)];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, p.set('loadError', null)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, p.set('load', 'ready')];
                case 10:
                    _d.sent();
                    return [3 /*break*/, 13];
                case 11:
                    err_2 = _d.sent();
                    (0, logger_1.debug)(p, 'reading the record failed', err_2);
                    // Says why when it can: Claude Code wouldn't open the file, say.
                    return [4 /*yield*/, (0, exports.markUnreadable)(p, ctx)];
                case 12:
                    // Says why when it can: Claude Code wouldn't open the file, say.
                    _d.sent();
                    return [2 /*return*/];
                case 13:
                    _d.trys.push([13, 16, , 17]);
                    _b = (_a = p).set;
                    _c = ['others'];
                    return [4 /*yield*/, (0, records_providers_1.recordsRepositoryOf)(p, ctx).others(function (r) { var _a, _b; return (_b = (_a = (0, ranking_1.suggest)(r, null)) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : null; })];
                case 14: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                case 15:
                    _d.sent();
                    return [3 /*break*/, 17];
                case 16:
                    err_3 = _d.sent();
                    (0, logger_1.debug)(p, "reading the other projects' records failed", err_3);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
// The record again when something else changed it: the app or another
// session. Nothing waits on this, so it shows no loading state. Returns the
// fresh record, or null when there is nothing new.
function reloadIfChanged(p, ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var at, isFirstLook, record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.host.modifiedAt(ctx.file)];
                case 1:
                    at = _a.sent();
                    isFirstLook = live_1.live.recordSeenAt === null;
                    if (at === null || at === live_1.live.recordSeenAt)
                        return [2 /*return*/, null];
                    live_1.live.recordSeenAt = at;
                    if (isFirstLook)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, records_providers_1.recordsRepositoryOf)(p, ctx).read()];
                case 2:
                    record = _a.sent();
                    if (!(record === 'unreadable')) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, exports.markUnreadable)(p, ctx)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, null];
                case 4: return [4 /*yield*/, p.set('record', record)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, p.set('loadError', null)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, p.set('load', 'ready')];
                case 7:
                    _a.sent();
                    return [2 /*return*/, record];
            }
        });
    });
}
function changeRecord(p, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx = live_1.live.ctx;
                    if (ctx === null)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, exports.change)(p, ctx, fn)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    (0, logger_1.debug)(p, 'writing the record failed', err_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
