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
var logger_1 = require("../../../core/logger");
var mac_1 = require("../../../core/platform/mac");
var claude_code_1 = require("./claude_code");
var ran;
var exitCode;
var copied;
var logged;
var deps = function (terminal, over) {
    if (terminal === void 0) { terminal = 'terminal'; }
    if (over === void 0) { over = {}; }
    return (__assign({ host: {
            run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    ran.push(argv);
                    return [2 /*return*/, { exitCode: exitCode, stdout: '', stderr: exitCode === 0 ? '' : 'no such application' }];
                });
            }); },
        }, home: '/home', terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, terminal];
        }); }); }, copy: function (text) { return void copied.push(text); }, log: (0, logger_1.createLogger)('dev', function (line) { return void logged.push(line); }) }, over));
};
(0, vitest_1.beforeEach)(function () {
    ran = [];
    exitCode = 0;
    copied = [];
    logged = [];
});
(0, vitest_1.describe)('opening Claude Code', function () {
    (0, vitest_1.it)('opens the chosen terminal when no session is open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claude_code_1.openClaudeCode)(deps('iterm'), '/p/demo', false)];
                case 1:
                    handover = _a.sent();
                    (0, vitest_1.expect)(handover).toEqual({ kind: 'opened', terminal: 'iterm' });
                    (0, vitest_1.expect)(ran[0].join(' ')).toContain('claude');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('brings the terminal forward when a session is open, and starts no second one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claude_code_1.openClaudeCode)(deps('terminal'), '/p/demo', true)];
                case 1:
                    handover = _a.sent();
                    (0, vitest_1.expect)(handover).toEqual({ kind: 'opened', terminal: 'terminal' });
                    (0, vitest_1.expect)(ran[0].join(' ')).not.toContain('claude');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('copies claude for VS Code, which has to be pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claude_code_1.openClaudeCode)(deps('vscode'), '/p/demo', false)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(copied).toEqual(['claude']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the clipboard alone when VS Code is only brought forward', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claude_code_1.openClaudeCode)(deps('vscode'), '/p/demo', true)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(copied).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names the terminal and gives the line to copy when it would not open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exitCode = 1;
                    return [4 /*yield*/, (0, claude_code_1.openClaudeCode)(deps('iterm'), '/p/my realm', false)];
                case 1:
                    handover = _a.sent();
                    (0, vitest_1.expect)(handover).toEqual({ kind: 'failed', terminal: 'iterm', command: "cd '/p/my realm' && claude" });
                    (0, vitest_1.expect)(logged.join('\n')).toContain('no such application');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reports a failure when the launch itself throws', function () { return __awaiter(void 0, void 0, void 0, function () {
        var copy, handover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    copy = vitest_1.vi.fn(function () {
                        throw new Error('clipboard is locked');
                    });
                    return [4 /*yield*/, (0, claude_code_1.openClaudeCode)(deps('vscode', { copy: copy }), '/p/demo', false)];
                case 1:
                    handover = _a.sent();
                    (0, vitest_1.expect)(handover.kind).toBe('failed');
                    (0, vitest_1.expect)(logged.join('\n')).toContain('clipboard is locked');
                    return [2 /*return*/];
            }
        });
    }); });
});
// A host that also makes folders and writes files, or fails to.
var briefHost = function (over) {
    var _a;
    if (over === void 0) { over = {}; }
    var written = {};
    var host = {
        run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ran.push(argv);
                return [2 /*return*/, { exitCode: exitCode, stdout: '', stderr: exitCode === 0 ? '' : 'no such application' }];
            });
        }); },
        makeDirs: function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            return [2 /*return*/, ({ exitCode: (_a = over.madeExit) !== null && _a !== void 0 ? _a : 0, stdout: '', stderr: over.madeExit ? 'Permission denied' : '' })];
        }); }); },
        write: (_a = over.write) !== null && _a !== void 0 ? _a : (function (path, text) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                written[path] = text;
                return [2 /*return*/];
            });
        }); }),
    };
    return { host: host, written: written };
};
var BRIEF_FILE = '/home/.queue-tea/briefs/t-1.md';
(0, vitest_1.describe)('opening Codex', function () {
    (0, vitest_1.it)('focuses an existing session without attempting setup that would fail', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepareCodex, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prepareCodex = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        throw new Error('edited skill');
                    }); }); });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, claude_code_1.focusCodex)(deps('terminal', { prepareCodex: prepareCodex }), '/p/demo', 'Task: A')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({ kind: 'opened', terminal: 'terminal' });
                    (0, vitest_1.expect)(prepareCodex).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(ran).toHaveLength(1);
                    (0, vitest_1.expect)(ran[0].join(' ')).not.toContain('do script');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('prepares a configured recovery command only after focusing fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var args, prepareCodex, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    exitCode = 1;
                    args = ['-c', 'mcp_servers.queue-tea.required=true'];
                    prepareCodex = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            (0, vitest_1.expect)(ran).toHaveLength(1);
                            return [2 /*return*/, args];
                        });
                    }); });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, claude_code_1.focusCodex)(deps('iterm', { prepareCodex: prepareCodex }), '/p/demo', 'Task: A')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({ kind: 'failed', terminal: 'iterm', command: (0, mac_1.codexPasteLine)('/p/demo', 'Task: A', args) });
                    (0, vitest_1.expect)(prepareCodex).toHaveBeenCalledWith('/p/demo');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('prepares the adapter before launch and preserves its configuration in fallback commands', function () { return __awaiter(void 0, void 0, void 0, function () {
        var host, prepareCodex, result, _a, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    host = briefHost({ madeExit: 1 }).host;
                    prepareCodex = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ['-c', 'mcp_servers.queue-tea.required=true']];
                    }); }); });
                    return [4 /*yield*/, (0, claude_code_1.openCodex)(deps('terminal', { host: host, prepareCodex: prepareCodex }), '/p/demo', 't-1', 'Task: A')];
                case 1:
                    result = _f.sent();
                    (0, vitest_1.expect)(prepareCodex).toHaveBeenCalledWith('/p/demo');
                    _b = (_a = (0, vitest_1.expect)(result)).toEqual;
                    _e = { kind: 'failed', terminal: 'terminal' };
                    _c = mac_1.codexPasteLine;
                    _d = ['/p/demo', 'Task: A'];
                    return [4 /*yield*/, prepareCodex()];
                case 2:
                    _b.apply(_a, [(_e.command = _c.apply(void 0, _d.concat([_f.sent()])), _e)]);
                    (0, vitest_1.expect)(ran).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does not launch a bare session when adapter setup fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var host;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = briefHost().host;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, claude_code_1.openCodex)(deps('terminal', { host: host, prepareCodex: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                throw new Error('edited skill');
                            }); }); } }), '/p/demo', 't-1', 'Task: A')).rejects.toThrow('edited skill')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(ran).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('writes the brief under ~/.queue-tea/briefs and opens the terminal on Codex reading it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, host, written, handover;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = briefHost(), host = _a.host, written = _a.written;
                    return [4 /*yield*/, (0, claude_code_1.openCodex)(deps('terminal', { host: host }), '/p/demo', 't-1', 'From Queue-tea: the rules.\n\nTask: A')];
                case 1:
                    handover = _c.sent();
                    (0, vitest_1.expect)(handover).toEqual({ kind: 'opened', terminal: 'terminal' });
                    (0, vitest_1.expect)(written).toEqual((_b = {}, _b[BRIEF_FILE] = 'From Queue-tea: the rules.\n\nTask: A', _b));
                    (0, vitest_1.expect)(ran).toHaveLength(1);
                    (0, vitest_1.expect)(ran[0].join(' ')).toContain("codex --sandbox workspace-write --ask-for-approval on-request \\\"$(cat '".concat(BRIEF_FILE, "')\\\""));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('copies the whole Codex line for VS Code, which has to be pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var host;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = briefHost().host;
                    return [4 /*yield*/, (0, claude_code_1.openCodex)(deps('vscode', { host: host }), '/p/demo', 't-1', 'Task: A')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(copied).toEqual([(0, mac_1.codexLine)('/p/demo', BRIEF_FILE)]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a briefs folder that cannot be made opens nothing, and gives a line to paste that carries the brief', function () { return __awaiter(void 0, void 0, void 0, function () {
        var host, handover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = briefHost({ madeExit: 1 }).host;
                    return [4 /*yield*/, (0, claude_code_1.openCodex)(deps('iterm', { host: host }), '/p/demo', 't-1', 'Task: A')];
                case 1:
                    handover = _a.sent();
                    (0, vitest_1.expect)(handover).toEqual({ kind: 'failed', terminal: 'iterm', command: (0, mac_1.codexPasteLine)('/p/demo', 'Task: A') });
                    if (handover.kind !== 'failed')
                        return [2 /*return*/];
                    (0, vitest_1.expect)(handover.command).not.toContain('$(cat');
                    (0, vitest_1.expect)(handover.command).toContain("'Task: A'");
                    (0, vitest_1.expect)(ran).toEqual([]);
                    (0, vitest_1.expect)(logged.join('\n')).toContain('writing the Codex brief failed');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a brief that cannot be written fails the same way, with a single quote in it escaped', function () { return __awaiter(void 0, void 0, void 0, function () {
        var host, handover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = briefHost({
                        write: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                throw new Error('ENOSPC: no space left');
                            });
                        }); },
                    }).host;
                    return [4 /*yield*/, (0, claude_code_1.openCodex)(deps('terminal', { host: host }), '/p/demo', 't-1', "Don't push.")];
                case 1:
                    handover = _a.sent();
                    (0, vitest_1.expect)(handover).toEqual({ kind: 'failed', terminal: 'terminal', command: "cd '/p/demo' && codex --sandbox workspace-write --ask-for-approval on-request 'Don'\\''t push.'" });
                    (0, vitest_1.expect)(ran).toEqual([]);
                    (0, vitest_1.expect)(logged.join('\n')).toContain('ENOSPC');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a terminal that will not open, once the brief is written, gives the line that reads it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var host, handover;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exitCode = 1;
                    host = briefHost().host;
                    return [4 /*yield*/, (0, claude_code_1.openCodex)(deps('iterm', { host: host }), '/p/demo', 't-1', 'Task: A')];
                case 1:
                    handover = _a.sent();
                    (0, vitest_1.expect)(handover).toEqual({ kind: 'failed', terminal: 'iterm', command: (0, mac_1.codexLine)('/p/demo', BRIEF_FILE) });
                    return [2 /*return*/];
            }
        });
    }); });
});
