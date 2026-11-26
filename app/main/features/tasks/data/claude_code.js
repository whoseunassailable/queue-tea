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
exports.openCodex = exports.focusCodex = exports.openClaudeCode = void 0;
var mac_1 = require("../../../core/platform/mac");
var CLAUDE = 'claude';
var briefFile = function (home, taskId) { return "".concat(home, "/.queue-tea/briefs/").concat(taskId, ".md"); };
// Opens the chosen terminal on the line, or only brings it forward. It never
// throws: the quest is safe either way, and failed gives the screen the line
// to copy. VS Code can't be told to run a line, so it is copied to paste.
var launch = function (d, path, line, isForwardOnly, pasted) { return __awaiter(void 0, void 0, void 0, function () {
    var terminal, failed, ran, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d.terminal()];
            case 1:
                terminal = _a.sent();
                failed = { kind: 'failed', terminal: terminal, command: line };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, d.host.run(isForwardOnly ? (0, mac_1.bringForwardArgv)(terminal, path) : (0, mac_1.openLineArgv)(terminal, path, line), d.home)];
            case 3:
                ran = _a.sent();
                if (ran.exitCode !== 0) {
                    d.log.warn("opening ".concat(terminal, " failed: ").concat(ran.stderr));
                    return [2 /*return*/, failed];
                }
                if (terminal === 'vscode' && !isForwardOnly)
                    d.copy(pasted);
                return [2 /*return*/, { kind: 'opened', terminal: terminal }];
            case 4:
                err_1 = _a.sent();
                d.log.error("opening ".concat(terminal, " failed"), err_1);
                return [2 /*return*/, failed];
            case 5: return [2 /*return*/];
        }
    });
}); };
// A session already here only comes forward, because Open in Claude Code must
// not start a second one.
var openClaudeCode = function (d, path, isSessionOpen) {
    return launch(d, path, (0, mac_1.claudeLine)(path), isSessionOpen, CLAUDE);
};
exports.openClaudeCode = openClaudeCode;
// Only brings the existing terminal forward. If that fails, recovery stays
// with Codex and carries the brief without relying on a file still existing.
var focusCodex = function (d, path, brief) { return __awaiter(void 0, void 0, void 0, function () {
    var line, focused, args;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                line = (0, mac_1.codexPasteLine)(path, brief);
                return [4 /*yield*/, launch(d, path, line, true, line)];
            case 1:
                focused = _c.sent();
                if (focused.kind !== 'failed')
                    return [2 /*return*/, focused
                        // An existing session needs no setup and cannot take new configuration.
                        // Only a failed focus needs a command that can start a replacement session.
                    ];
                return [4 /*yield*/, ((_a = d.prepareCodex) === null || _a === void 0 ? void 0 : _a.call(d, path))];
            case 2:
                args = (_b = _c.sent()) !== null && _b !== void 0 ? _b : [];
                return [2 /*return*/, __assign(__assign({}, focused), { command: (0, mac_1.codexPasteLine)(path, brief, args) })];
        }
    });
}); };
exports.focusCodex = focusCodex;
// Codex gets the brief as its first prompt, written to a file first. A brief
// that can't be written fails like a terminal that can't open.
var openCodex = function (d, path, taskId, brief) { return __awaiter(void 0, void 0, void 0, function () {
    var file, args, line, made, err_2;
    var _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                file = briefFile(d.home, taskId);
                return [4 /*yield*/, ((_b = d.prepareCodex) === null || _b === void 0 ? void 0 : _b.call(d, path))];
            case 1:
                args = (_c = _d.sent()) !== null && _c !== void 0 ? _c : [];
                line = (0, mac_1.codexLine)(path, file, args);
                _d.label = 2;
            case 2:
                _d.trys.push([2, 5, , 7]);
                return [4 /*yield*/, d.host.makeDirs("".concat(d.home, "/.queue-tea/briefs"))];
            case 3:
                made = _d.sent();
                if (made.exitCode !== 0)
                    throw new Error(made.stderr);
                return [4 /*yield*/, d.host.write(file, brief)];
            case 4:
                _d.sent();
                return [3 /*break*/, 7];
            case 5:
                err_2 = _d.sent();
                d.log.error('writing the Codex brief failed', err_2);
                _a = { kind: 'failed' };
                return [4 /*yield*/, d.terminal()];
            case 6: return [2 /*return*/, (_a.terminal = _d.sent(), _a.command = (0, mac_1.codexPasteLine)(path, brief, args), _a)];
            case 7: return [2 /*return*/, launch(d, path, line, false, line)];
        }
    });
}); };
exports.openCodex = openCodex;
