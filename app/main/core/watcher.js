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
exports.watchFolders = exports.hasChanged = void 0;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
// Whether anything was added, removed or rewritten between two looks.
var hasChanged = function (before, after) {
    var names = Object.keys(after);
    return names.length !== Object.keys(before).length || names.some(function (name) { return before[name] !== after[name]; });
};
exports.hasChanged = hasChanged;
// When each file in a folder last changed. A file can go between the listing
// and the stat, in which case it is simply not there.
var stampsOf = function (folder) { return __awaiter(void 0, void 0, void 0, function () {
    var stamps, entries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stamps = {};
                return [4 /*yield*/, (0, promises_1.readdir)(folder, { withFileTypes: true })];
            case 1:
                entries = _a.sent();
                return [4 /*yield*/, Promise.all(entries
                        .filter(function (e) { return e.isFile(); })
                        .map(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 2, , 3]);
                                    _a = stamps;
                                    _b = "".concat(folder, "/").concat(e.name);
                                    return [4 /*yield*/, (0, promises_1.stat)("".concat(folder, "/").concat(e.name))];
                                case 1:
                                    _a[_b] = (_d.sent()).mtimeMs;
                                    return [3 /*break*/, 3];
                                case 2:
                                    _c = _d.sent();
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                return [2 /*return*/, stamps];
        }
    });
}); };
// Watches folders and not files: the atomic replace swaps the file, so a watch
// on it goes stale. fs.watch can drop or repeat events, so every event is
// checked against the files' times, and a slow sweep catches a dropped one.
var watchFolders = function (folders_1, onChange_1, _a) { return __awaiter(void 0, [folders_1, onChange_1, _a], void 0, function (folders, onChange, _b) {
    var look, seen, settling, check, settle, watchers, _i, watchers_1, watcher, sweep;
    var settleMs = _b.settleMs, sweepMs = _b.sweepMs, log = _b.log;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                look = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b, _c, _d; return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _b = (_a = Object.assign).apply;
                            _c = [Object];
                            _d = [[{}]];
                            return [4 /*yield*/, Promise.all(folders.map(stampsOf))];
                        case 1: return [2 /*return*/, _b.apply(_a, _c.concat([__spreadArray.apply(void 0, _d.concat([(_e.sent()), false]))]))];
                    }
                }); }); };
                return [4 /*yield*/, Promise.all(folders.map(function (folder) { return (0, promises_1.mkdir)(folder, { recursive: true }); }))];
            case 1:
                _c.sent();
                return [4 /*yield*/, look()];
            case 2:
                seen = _c.sent();
                settling = null;
                check = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var now, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, look()];
                            case 1:
                                now = _a.sent();
                                if (!(0, exports.hasChanged)(seen, now))
                                    return [2 /*return*/];
                                seen = now;
                                log.debug('records or sessions changed');
                                onChange();
                                return [3 /*break*/, 3];
                            case 2:
                                err_1 = _a.sent();
                                log.error('checking the watched folders failed', err_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                settle = function () {
                    if (settling !== null)
                        clearTimeout(settling);
                    settling = setTimeout(function () { return void check(); }, settleMs);
                };
                watchers = folders.map(function (folder) { return (0, node_fs_1.watch)(folder, settle); });
                for (_i = 0, watchers_1 = watchers; _i < watchers_1.length; _i++) {
                    watcher = watchers_1[_i];
                    watcher.on('error', function (err) { return log.error('a folder watch failed', err); });
                }
                sweep = setInterval(function () { return void check(); }, sweepMs);
                return [2 /*return*/, function () {
                        clearInterval(sweep);
                        if (settling !== null)
                            clearTimeout(settling);
                        for (var _i = 0, watchers_2 = watchers; _i < watchers_2.length; _i++) {
                            var watcher = watchers_2[_i];
                            watcher.close();
                        }
                    }];
        }
    });
}); };
exports.watchFolders = watchFolders;
