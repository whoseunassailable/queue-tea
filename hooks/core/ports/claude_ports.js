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
exports.onViewChange = void 0;
exports.askOf = askOf;
exports.portsOf = portsOf;
var claude_host_1 = require("../host/claude_host");
var logger_1 = require("../logger/logger");
var view_store_1 = require("../store/view_store");
function askOf($) {
    return {
        fork: function (prompt) { return $.model.fork({ prompt: prompt }); },
        complete: function (prompt) { return $.model.complete({ model: 'claude-haiku-5-5', prompt: prompt, maxTokens: 200 }); },
        sleep: function (ms) { return $.clock.sleep(ms); },
        log: function (text) { return $.ui.log(text, { to: 'debug' }); },
    };
}
var STATUS_KEYS = ['record', 'isChecking', 'allowance'];
var hex = function (bytes) { return __spreadArray([], bytes, true).map(function (b) { return b.toString(16).padStart(2, '0'); }).join(''); };
// What runs when a value the status line shows changes, kept out of here so
// the core doesn't reach the feature that draws it.
var viewChanged = null;
var onViewChange = function (fn) {
    viewChanged = fn;
};
exports.onViewChange = onViewChange;
function portsOf($) {
    var _this = this;
    return {
        host: (0, claude_host_1.hostOf)($),
        ask: askOf($),
        clear: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, $.command.run({ command: 'clear' })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        submit: function (text, asUser) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, $.prompt.submit(asUser === true ? { text: text, asUser: true } : { text: text })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        toast: function (text) { return $.ui.toast(text); },
        status: function (text) { return $.ui.status(text); },
        now: function () { return $.clock.now(); },
        later: function (work) {
            $.clock.after(0, function () {
                work().catch(function (err) { return (0, logger_1.debug)(portsOf($), 'queue-tea work failed', err); });
            });
        },
        newId: function () { return "t-".concat(hex(crypto.getRandomValues(new Uint8Array(4)))); },
        get: function (key) { return (0, view_store_1.getView)($, key); },
        set: function (key, value) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, view_store_1.setView)($, key, value)];
                    case 1:
                        _a.sent();
                        if (!STATUS_KEYS.includes(key)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (viewChanged === null || viewChanged === void 0 ? void 0 : viewChanged(portsOf($)))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        log: function (text) { return $.ui.log(text, { to: 'debug' }); },
        ui: {
            open: function (spec) { return $.ui.open(spec); },
            close: function (id) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.ui.close({ id: id })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
        },
        prompt: {
            read: function () { return $.prompt.read(); },
            fill: function (text) { return $.prompt.fill({ text: text, mode: 'append' }); },
            send: function (text) { return $.prompt.submit({ text: text, asUser: true }); },
        },
        session: {
            id: function () { return $.session.id(); },
            usage: function () { return $.session.usage(); },
            append: function (note) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, $.session.append({ message: { type: 'user', content: [{ type: 'text', text: note }] } })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
        },
    };
}
