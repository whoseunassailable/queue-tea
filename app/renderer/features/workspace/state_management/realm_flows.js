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
exports.realmFlows = void 0;
var engine_client_1 = require("../../../core/api/engine_client");
var en_1 = require("../../../l10n/en");
// Adding a realm and putting a broken one right.
var realmFlows = function (engine, workspace) {
    var sayFailed = function (message) { return workspace.say({ tone: 'error', text: message }); };
    return {
        // The folder to ask about, or null when there's nothing to ask: the dialog
        // was cancelled, or Queue-tea knows it already and has gone there.
        openFolder: function () { return __awaiter(void 0, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.openFolder(); })];
                    case 1:
                        answer = _a.sent();
                        if (!answer.ok) {
                            sayFailed(answer.message);
                            return [2 /*return*/, null];
                        }
                        if (answer.data === null || !answer.data.isKnown)
                            return [2 /*return*/, answer.data];
                        return [4 /*yield*/, workspace.pick(answer.data.key)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, null];
                }
            });
        }); },
        add: function (path_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([path_1], args_1, true), void 0, function (path, isDetected) {
                var answer;
                if (isDetected === void 0) { isDetected = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.addProject(path); })];
                        case 1:
                            answer = _a.sent();
                            if (!answer.ok)
                                return [2 /*return*/, answer];
                            return [4 /*yield*/, workspace.refresh()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, workspace.pick(answer.data)];
                        case 3:
                            _a.sent();
                            if (isDetected)
                                workspace.setDetected(answer.data);
                            return [2 /*return*/, answer];
                    }
                });
            });
        },
        // A link or a notification. An unknown folder comes back to be asked about:
        // nothing is added on a link's word.
        arrived: function (opened, onAsk, onHome) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(opened.kind === 'failed')) return [3 /*break*/, 1];
                        sayFailed(opened.message);
                        return [3 /*break*/, 6];
                    case 1:
                        if (!(opened.kind === 'judgement')) return [3 /*break*/, 3];
                        return [4 /*yield*/, workspace.pick(opened.key)];
                    case 2:
                        _a.sent();
                        onHome();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!opened.pick.isKnown) return [3 /*break*/, 5];
                        workspace.setDetected(opened.pick.key);
                        return [4 /*yield*/, workspace.pick(opened.pick.key)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        onAsk(opened.pick);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); },
        install: function () { return __awaiter(void 0, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.installCommand(); })];
                    case 1:
                        answer = _a.sent();
                        if (!answer.ok)
                            sayFailed(answer.message);
                        else
                            workspace.say({ tone: answer.data.needsPath ? 'warning' : 'success', text: answer.data.needsPath ? en_1.t.settings.installedPath(answer.data.path) : en_1.t.settings.installed(answer.data.path) });
                        return [2 /*return*/, answer.ok];
                }
            });
        }); },
        takeWaiting: function (onEach) { return __awaiter(void 0, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.takeOpened(); })];
                    case 1:
                        answer = _a.sent();
                        if (answer.ok)
                            answer.data.forEach(function (opened) { return onEach(opened); });
                        else
                            sayFailed(answer.message);
                        return [2 /*return*/];
                }
            });
        }); },
        show: function (key) { return __awaiter(void 0, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.showRecord(key); })];
                    case 1:
                        answer = _a.sent();
                        if (!answer.ok)
                            sayFailed(answer.message);
                        return [2 /*return*/];
                }
            });
        }); },
        restore: function (key) { return __awaiter(void 0, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.restoreRealm(key); })];
                    case 1:
                        answer = _a.sent();
                        if (!answer.ok) {
                            sayFailed(answer.message);
                            return [2 /*return*/];
                        }
                        workspace.say({ tone: 'success', text: en_1.t.failedRecord.restored(answer.data) });
                        return [4 /*yield*/, workspace.refresh()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    };
};
exports.realmFlows = realmFlows;
