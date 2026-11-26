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
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var mac_1 = require("./mac");
var setup_1 = require("../../features/codex/data/setup");
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var NASTY = ['plain', 'with space', "o'brien", 'say "hi"', '$(touch pwned)', '`touch pwned`', 'back\\slash', 'semi;colon', 'amp&ersand'];
(0, vitest_1.describe)('the line given to a terminal', function () {
    vitest_1.it.each(NASTY)('reaches the folder %s and runs nothing else', function (name) { return __awaiter(void 0, void 0, void 0, function () {
        var root, _a, folder, line, stdout;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = promises_1.realpath;
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-quote-'))];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                case 2:
                    root = _b.sent();
                    folder = (0, node_path_1.join)(root, name);
                    return [4 /*yield*/, (0, promises_1.mkdir)(folder)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, , 7, 9]);
                    line = (0, mac_1.claudeLine)(folder).replace(/claude$/, 'pwd');
                    return [4 /*yield*/, run('sh', ['-c', line], { cwd: root })];
                case 5:
                    stdout = (_b.sent()).stdout;
                    (0, vitest_1.expect)(stdout.trim()).toBe(folder);
                    return [4 /*yield*/, (0, vitest_1.expect)(run('ls', [(0, node_path_1.join)(root, 'pwned')])).rejects.toThrow()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, (0, promises_1.rm)(root, { recursive: true, force: true })];
                case 8:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('quotes a single quote so the shell gets it back whole', function () {
        (0, vitest_1.expect)((0, mac_1.shellQuote)("o'brien")).toBe("'o'\\''brien'");
    });
});
// Each argument codex gets, in <>, from a real shell with codex as a function.
var codexArgs = function (line, cwd) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, run('sh', ['-c', "codex() { for arg in \"$@\"; do printf '<%s>' \"$arg\"; done; }; ".concat(line)], { cwd: cwd })];
        case 1: return [2 /*return*/, (_a.sent()).stdout];
    }
}); }); };
var BRIEF = 'From Queue-tea:\n- Don\'t commit; say "done".\n$(touch pwned) `touch pwned` back\\slash';
(0, vitest_1.describe)('the line that opens Codex', function () {
    (0, vitest_1.it)('passes MCP configuration through the shell as literal arguments, even with quoted paths', function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, _a, config, line, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = promises_1.realpath;
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-mcp-quote-'))];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
                case 2:
                    root = _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, , 6, 8]);
                    config = (0, setup_1.codexConfigArgs)({ command: "o'brien $(touch pwned)", server: "".concat(root, "/a \"quoted\" server.cjs"), electron: true }, root);
                    line = (0, mac_1.codexPasteLine)(root, BRIEF, config);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, codexArgs(line, root)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe("<--sandbox><workspace-write><--ask-for-approval><on-request>".concat(config.map(function (arg) { return "<".concat(arg, ">"); }).join(''), "<").concat(BRIEF, ">"));
                    return [4 /*yield*/, (0, vitest_1.expect)(run('ls', [(0, node_path_1.join)(root, 'pwned')])).rejects.toThrow()];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, (0, promises_1.rm)(root, { recursive: true, force: true })];
                case 7:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reaches the folder and gives codex its guard, then the brief from the file whole, running nothing else', function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, _a, folder, briefs, file, args;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = promises_1.realpath;
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-codex-'))];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                case 2:
                    root = _b.sent();
                    folder = (0, node_path_1.join)(root, "o'brien $(touch pwned)");
                    briefs = (0, node_path_1.join)(root, 'say "hi"');
                    return [4 /*yield*/, (0, promises_1.mkdir)(folder)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)(briefs)];
                case 4:
                    _b.sent();
                    file = (0, node_path_1.join)(briefs, 't-1.md');
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, "".concat(BRIEF, "\n"))];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, , 10, 12]);
                    return [4 /*yield*/, codexArgs((0, mac_1.codexLine)(folder, file), root)];
                case 7:
                    args = _b.sent();
                    (0, vitest_1.expect)(args).toBe("<--sandbox><workspace-write><--ask-for-approval><on-request><".concat(BRIEF, ">"));
                    return [4 /*yield*/, (0, vitest_1.expect)(run('ls', [(0, node_path_1.join)(root, 'pwned')])).rejects.toThrow()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(run('ls', [(0, node_path_1.join)(folder, 'pwned')])).rejects.toThrow()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, (0, promises_1.rm)(root, { recursive: true, force: true })];
                case 11:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('to paste, carries the brief itself, quoted, and needs no file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var root, _a, line, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = promises_1.realpath;
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-codex-'))];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
                case 2:
                    root = _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, , 6, 8]);
                    line = (0, mac_1.codexPasteLine)(root, BRIEF);
                    (0, vitest_1.expect)(line).not.toContain('$(cat');
                    (0, vitest_1.expect)(line).toContain("'From Queue-tea:\n- Don'\\''t commit;");
                    _b = vitest_1.expect;
                    return [4 /*yield*/, codexArgs(line, root)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe("<--sandbox><workspace-write><--ask-for-approval><on-request><".concat(BRIEF, ">"));
                    return [4 /*yield*/, (0, vitest_1.expect)(run('ls', [(0, node_path_1.join)(root, 'pwned')])).rejects.toThrow()];
                case 5:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, (0, promises_1.rm)(root, { recursive: true, force: true })];
                case 7:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('AppleScript text', function () {
    vitest_1.it.runIf(process.platform === 'darwin').each(NASTY)('keeps %s as it is', function (text) { return __awaiter(void 0, void 0, void 0, function () {
        var stdout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, run('osascript', ['-e', "return ".concat((0, mac_1.appleScriptText)(text))])];
                case 1:
                    stdout = (_a.sent()).stdout;
                    (0, vitest_1.expect)(stdout.replace(/\n$/, '')).toBe(text);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.runIf(process.platform === 'darwin')('keeps the Codex line as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var line, stdout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    line = (0, mac_1.codexLine)("/p/o'brien", '/h/.queue-tea/briefs/t-1.md');
                    return [4 /*yield*/, run('osascript', ['-e', "return ".concat((0, mac_1.appleScriptText)(line))])];
                case 1:
                    stdout = (_a.sent()).stdout;
                    (0, vitest_1.expect)(stdout.replace(/\n$/, '')).toBe(line);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('opening Claude Code', function () {
    (0, vitest_1.it)('Terminal runs claude in a new window and comes forward', function () {
        var argv = (0, mac_1.openLineArgv)('terminal', '/p/my realm', (0, mac_1.claudeLine)('/p/my realm'));
        (0, vitest_1.expect)(argv[0]).toBe('osascript');
        (0, vitest_1.expect)(argv.join(' ')).toContain("set queueTeaTab to do script \"cd '/p/my realm' && claude\"");
        (0, vitest_1.expect)(argv.join(' ')).toContain('activate');
    });
    (0, vitest_1.it)('iTerm2 writes the line into a new window', function () {
        var argv = (0, mac_1.openLineArgv)('iterm', '/p/demo', (0, mac_1.claudeLine)('/p/demo'));
        (0, vitest_1.expect)(argv[0]).toBe('osascript');
        (0, vitest_1.expect)(argv.join(' ')).toContain('create window with default profile');
        (0, vitest_1.expect)(argv.join(' ')).toContain("write text \"cd '/p/demo' && claude\"");
    });
    (0, vitest_1.it)('VS Code opens the folder by name, since an installed app has no shell PATH', function () {
        (0, vitest_1.expect)((0, mac_1.openLineArgv)('vscode', '/p/demo', (0, mac_1.claudeLine)('/p/demo'))).toEqual(['open', '-a', 'Visual Studio Code', '/p/demo']);
    });
    (0, vitest_1.it)('bringing a terminal forward never runs claude or codex', function () {
        for (var _i = 0, _a = ['terminal', 'iterm', 'vscode']; _i < _a.length; _i++) {
            var terminal = _a[_i];
            (0, vitest_1.expect)((0, mac_1.bringForwardArgv)(terminal, '/p/demo').join(' ')).not.toContain('claude');
            (0, vitest_1.expect)((0, mac_1.bringForwardArgv)(terminal, '/p/demo').join(' ')).not.toContain('codex');
        }
    });
    (0, vitest_1.it)('Terminal runs the Codex line in a new window, its quotes kept for AppleScript', function () {
        var argv = (0, mac_1.openLineArgv)('terminal', '/p/demo', (0, mac_1.codexLine)('/p/demo', '/h/.queue-tea/briefs/t-1.md'));
        (0, vitest_1.expect)(argv.join(' ')).toContain("do script \"cd '/p/demo' && codex --sandbox workspace-write --ask-for-approval on-request \\\"$(cat '/h/.queue-tea/briefs/t-1.md')\\\"\"");
    });
});
