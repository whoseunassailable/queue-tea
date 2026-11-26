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
exports.updateService = void 0;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var update_1 = require("../../../../shared/update");
var update_runner_mjs_1 = require("../../../../tools/update_runner.mjs");
var messages_1 = require("../../../core/messages");
var updateService = function (d) {
    var pending = null;
    var queue = function (request_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([request_1], args_1, true), void 0, function (request, retry) {
            var err_1;
            if (retry === void 0) { retry = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, update_runner_mjs_1.queuePublished)(request, { repository: d.repository, tools: d.tools, retry: retry })];
                    case 1:
                        _a.sent();
                        pending = null;
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        d.log.error('starting the acknowledged update failed', err_1);
                        pending = request;
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var read = function () { return __awaiter(void 0, void 0, void 0, function () {
        var saved, _a, state, installed, _b, canRestart, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(d.enabled && !pending)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)()];
                case 1:
                    _a = _d.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = null;
                    _d.label = 3;
                case 3:
                    saved = _a;
                    state = pending ? { phase: 'failed', commit: pending.commit, detail: messages_1.UPDATE_TEXT.startFailed } : saved && saved.repository === d.repository ? saved : { phase: 'idle', commit: null, detail: null };
                    if (!d.enabled) return [3 /*break*/, 5];
                    return [4 /*yield*/, d.installed()];
                case 4:
                    _b = _d.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = null;
                    _d.label = 6;
                case 6:
                    installed = _b;
                    _c = (0, update_1.changedBuild)(d.running, installed);
                    if (!_c) return [3 /*break*/, 8];
                    return [4 /*yield*/, d.isBusy()];
                case 7:
                    _c = !(_d.sent());
                    _d.label = 8;
                case 8:
                    canRestart = _c && state.phase !== 'installing';
                    return [2 /*return*/, { running: d.running, installed: installed, state: state, canRestart: canRestart, canRetry: d.enabled && state.phase === 'failed' }];
            }
        });
    }); };
    return {
        read: read,
        published: function (repo, remote, branch, commit) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!d.enabled || !d.repository)
                            return [2 /*return*/];
                        return [4 /*yield*/, queue({ repo: repo, remote: remote, branch: branch, commit: commit })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        apply: function () { return __awaiter(void 0, void 0, void 0, function () {
            var state, request, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, read()
                        // The button reads "Retry update" while a build failed, so a retry goes first; a restart here would drop an unsaved request.
                    ];
                    case 1:
                        state = _d.sent();
                        if (!(state.canRetry && d.repository)) return [3 /*break*/, 6];
                        if (!(pending !== null && pending !== void 0)) return [3 /*break*/, 2];
                        _a = pending;
                        return [3 /*break*/, 4];
                    case 2:
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)((0, update_runner_mjs_1.updateFolder)(), 'request.json'), 'utf8')];
                    case 3:
                        _a = _c.apply(_b, [_d.sent()]);
                        _d.label = 4;
                    case 4:
                        request = _a;
                        if (!pending && request.repository !== d.repository)
                            throw new Error('The update request belongs to another repository.');
                        return [4 /*yield*/, queue(request, true)];
                    case 5:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!state.canRestart) return [3 /*break*/, 8];
                        return [4 /*yield*/, d.restart()];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8: return [2 /*return*/, read()];
                }
            });
        }); },
    };
};
exports.updateService = updateService;
