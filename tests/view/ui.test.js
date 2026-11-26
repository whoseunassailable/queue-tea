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
var testing_1 = require("claude-code/testing");
var checkpoints_1 = require("../../hooks/shared/checkpoints/domain/services/checkpoints");
var record_source_1 = require("../../hooks/shared/records/data/datasources/record_source");
var help_view_1 = require("../../hooks/app/menu/help_view");
var commit_guard_text_1 = require("../../hooks/features/commit_guard/presentation/constants/commit_guard_text");
var tasks_text_1 = require("../../hooks/features/tasks/presentation/constants/tasks_text");
var helpers_1 = require("../helpers");
var FILE = (0, record_source_1.recordPath)('/h', (0, record_source_1.projectKey)('/p'));
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var DIRTY = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +2 -0', '? a', '? b', '? c', ''].join('\n');
var SURFACES = ['terminal', 'desktop'];
var PANE = {
    plugin: 'queue-tea',
    component: 'Pane',
    requestId: 'queue-tea',
    props: {
        title: 'Queue-tea · p',
        isFocused: false,
        bodyColumns: 60,
        placement: 'dock',
        scroll: { offset: 0, bodyRows: 30 },
        view: {},
    },
};
var BAND = {
    plugin: 'queue-tea',
    component: 'AbovePrompt',
    requestId: 'above-prompt',
    props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 12, bodyColumns: 60, scroll: { offset: 0, bodyRows: 12 }, view: {} },
};
var COMMAND = { origin: { kind: 'composer' }, presentation: { isFullscreen: true, columns: 120 } };
var usage = { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
// Everything beneath the plugin a session start needs, then the start.
var startSession = function ($_1, on_1) {
    var args_1 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args_1[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([$_1, on_1], args_1, true), void 0, function ($, on, options) {
        var mem, seen, clock;
        var _a;
        var _b;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mem = (0, helpers_1.memoryHost)({
                        files: __assign(__assign({}, options.others), (options.file === undefined ? {} : (_a = {}, _a[FILE] = options.file, _a))),
                        git: __assign(__assign(__assign({ 'git rev-parse --show-toplevel': { stdout: '/p\n' }, 'date +%z': { stdout: '+0200\n' }, 'git rev-parse --is-inside-work-tree': { stdout: 'true\n' } }, (options.status === 'missing' ? {} : { 'git status --porcelain=v2 --branch': { stdout: (_b = options.status) !== null && _b !== void 0 ? _b : CLEAN } })), { 'git branch --format=%(refname:short)': { stdout: 'main\n' } }), options.git),
                    });
                    seen = {
                        toasts: [],
                        submits: [],
                        prompts: [],
                        clears: 0,
                        forks: 0,
                        commands: [],
                        tools: [],
                        logs: [],
                        opens: [],
                        closes: [],
                        statuses: [],
                    };
                    clock = testing_1.mock.clock(on, { now: Date.parse('2026-10-21T07:12:00Z') });
                    testing_1.mock.env(on, { HOME: '/h' });
                    on('prompt.submit', function (_, e) {
                        seen.submits.push(e.text);
                        seen.prompts.push({ text: e.text, origin: e.origin });
                        return options.drop === undefined ? { text: e.text } : { drop: options.drop };
                    });
                    on('command.run', function (_, e) {
                        if (e.command === 'clear')
                            seen.clears += 1;
                        return { text: '' };
                    });
                    (0, helpers_1.answerHost)(on, mem, { refused: options.refused });
                    on('session.cwd', function () { return ({ value: '/p' }); });
                    on('tool.register', function (_, e) {
                        seen.tools.push(e.name);
                        return { value: { tool: "mcp__queue-tea__".concat(e.name) } };
                    });
                    on('command.register', function (_, e) {
                        seen.commands.push(e.name);
                        return { value: { command: e.name } };
                    });
                    on('session.usage', function () {
                        var _a;
                        return ({
                            value: { context: { tokens: (_a = options.tokens) !== null && _a !== void 0 ? _a : 1000, window: 1000000 }, rateLimits: [] },
                        });
                    });
                    on('turn.complete', function () { return ({ text: '', reason: 'end_turn', category: null, explanation: null }); });
                    on('turn.start', function (_, e) { return ({ turnId: e.turnId }); });
                    on('ui.open', function (_, e) {
                        seen.opens.push(e);
                        return { value: { isPlaced: true } };
                    });
                    on('ui.close', function (_, e) {
                        seen.closes.push(e.id);
                        return { value: undefined };
                    });
                    on('ui.status', function (_, e) {
                        seen.statuses.push(e.text);
                        return { value: undefined };
                    });
                    on('ui.log', function (_, e) {
                        seen.logs.push(e.text);
                        return { value: undefined };
                    });
                    on('ui.toast', function (_, e) {
                        seen.toasts.push(e.text);
                        return { value: undefined };
                    });
                    on('model.fork', function () {
                        seen.forks += 1;
                        var reply = options.reply;
                        return {
                            value: reply === undefined
                                ? { isAnswered: false, reason: 'api-error', status: 500, error: 'server_error', usage: usage }
                                : { isAnswered: true, text: reply, usage: usage },
                        };
                    });
                    on('session.start', function (_, e) { return ({ cwd: e.cwd }); });
                    return [4 /*yield*/, $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, clock.settle()];
                case 2:
                    _c.sent();
                    return [2 /*return*/, { mem: mem, seen: seen, clock: clock }];
            }
        });
    });
};
var record = function (over) {
    if (over === void 0) { over = {}; }
    return JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), over));
};
// The menu pane on one of its views, reached the way Rohan reaches it: back
// to the list when a view shows, then the view's entry.
var mountView = function ($, surface, view) { return __awaiter(void 0, void 0, void 0, function () {
    var ui;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: surface }))];
            case 1:
                ui = _a.sent();
                return [4 /*yield*/, ui.find({ key: 'menu:back' })];
            case 2:
                if (!((_a.sent()) !== undefined)) return [3 /*break*/, 4];
                return [4 /*yield*/, ui.press({ key: 'menu:back' })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!(view !== 'menu')) return [3 /*break*/, 6];
                return [4 /*yield*/, ui.press({ key: "menu:".concat(view) })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/, ui];
        }
    });
}); };
(0, testing_1.test)('loading shows the turning character and Reading your queue…', function ($) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, SURFACES_1, surface, ui, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0, SURFACES_1 = SURFACES;
                _c.label = 1;
            case 1:
                if (!(_i < SURFACES_1.length)) return [3 /*break*/, 6];
                surface = SURFACES_1[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: surface }))];
            case 2:
                ui = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Reading your queue…/ })];
            case 3:
                _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.text]).toMatch(/^[◐◓◑◒] Reading your queue…$/);
                return [4 /*yield*/, ui.unmount()];
            case 4:
                _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('empty shows the empty line', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, SURFACES_2, surface, ui, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, startSession($, on)];
            case 1:
                _b.sent();
                _i = 0, SURFACES_2 = SURFACES;
                _b.label = 2;
            case 2:
                if (!(_i < SURFACES_2.length)) return [3 /*break*/, 7];
                surface = SURFACES_2[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: surface }))];
            case 3:
                ui = _b.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: "Nothing queued yet. Tell me what you're working on and it becomes the first task." })];
            case 4:
                _a.apply(void 0, [_b.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("failed shows Couldn't read your task record and Try again", function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, SURFACES_3, surface, ui, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: '{bad' })];
            case 1:
                _c.sent();
                _i = 0, SURFACES_3 = SURFACES;
                _c.label = 2;
            case 2:
                if (!(_i < SURFACES_3.length)) return [3 /*break*/, 8];
                surface = SURFACES_3[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: surface }))];
            case 3:
                ui = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: "Couldn't read your task record" })];
            case 4:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'retry' })];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a broken record says why, and the last good copy brings the queue back', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, seen, ui, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Kept in the copy', priority: 'high' });
                return [4 /*yield*/, startSession($, on, { file: '{bad', others: (_e = {}, _e["".concat(FILE, ".bak")] = record({ tasks: [task] }), _e) })];
            case 1:
                _a = _f.sent(), mem = _a.mem, seen = _a.seen;
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'terminal' }))];
            case 2:
                ui = _f.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /^It isn't valid JSON \(.+\)\.$/ })];
            case 3:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /^It is left as it is\. Use the last good copy, try again, or look/ })];
            case 4:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'restore' })];
            case 5:
                _f.sent();
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(record({ tasks: [task] }));
                (0, testing_1.expect)(__spreadArray([], mem.files.keys(), true).some(function (path) { return path.startsWith("".concat(FILE, ".broken-")); })).toBe(true);
                (0, testing_1.expect)(seen.toasts.some(function (t) { return t.startsWith('Queue-tea: back to the last good copy.'); })).toBe(true);
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: "Couldn't read your task record" })];
            case 6:
                _d.apply(void 0, [_f.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a newer Queue-tea’s record says to update, with no copy to go back to', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var newer, ui, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                newer = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { version: 3 }));
                return [4 /*yield*/, startSession($, on, { file: newer, others: (_d = {}, _d["".concat(FILE, ".bak")] = record(), _d) })];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'terminal' }))];
            case 2:
                ui = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /newer Queue-tea \(record version 3\); update Queue-tea to read it\.$/ })];
            case 3:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'restore' })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeUndefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'retry' })];
            case 5:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
// A current task with the old step log: many steps, each with long output.
var oldLog = function (steps, outputChars) { return Array.from({ length: steps }, function (_, i) { return ({
    id: "old-".concat(i), at: "2026-10-21T08:".concat(String(i % 60).padStart(2, '0'), ":00+02:00"), finished: "2026-10-21T08:".concat(String(i % 60).padStart(2, '0'), ":30+02:00"),
    kind: i % 2 === 0 ? 'test' : 'command', status: 'succeeded', subject: "npm test -- step ".concat(i), output: 'é'.repeat(outputChars), truncated: true,
}); }); };
(0, testing_1.test)('a record over the 4 MiB Claude Code reads at once still loads, and its next save drops the old step log', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, file, mem, ui, _a, _b, saved;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Long task', state: 'current', branch: 'task/long' });
                file = record({ tasks: [__assign(__assign({}, task), { activity: oldLog(300, 8000) })] });
                (0, testing_1.expect)(new TextEncoder().encode(file).length).toBeGreaterThan(4194304);
                on('tool.call', function () { return ({ result: { stdout: 'On branch task/long', exitCode: 0 } }); });
                return [4 /*yield*/, startSession($, on, { file: file })];
            case 1:
                mem = (_d.sent()).mem;
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 2:
                ui = _d.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: "Couldn't read your task record" })];
            case 3:
                _a.apply(void 0, [_d.sent()]).toBeUndefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Long task/ })];
            case 4:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'git status' })];
            case 6:
                _d.sent();
                saved = mem.files.get(FILE);
                (0, testing_1.expect)(new TextEncoder().encode(saved).length).toBeLessThan(100000);
                (0, testing_1.expect)(saved).not.toContain('"activity"');
                (0, testing_1.expect)(saved).not.toContain('éééé');
                (0, testing_1.expect)((_c = recordOf(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.step).toMatchObject({ kind: 'command', subject: 'git status', status: 'succeeded' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the task in progress shows one line with the step it is on now', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var seen, mem, ui, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                on('tool.call', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ui;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, mountView($, 'terminal', 'current')];
                            case 1:
                                ui = _b.sent();
                                return [4 /*yield*/, ui.find({ type: 'Text', text: /^ {2}Now: / })];
                            case 2:
                                seen = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.text;
                                return [4 /*yield*/, ui.unmount()];
                            case 3:
                                _b.sent();
                                return [2 /*return*/, { result: { stdout: '3 pass', exitCode: 0 } }];
                        }
                    });
                }); });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [(0, helpers_1.makeTask)({ title: 'Now', state: 'current' })] }) })];
            case 1:
                mem = (_d.sent()).mem;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'npm test\necho done' })];
            case 2:
                _d.sent();
                (0, testing_1.expect)(seen).toBe('  Now: running checks · npm test');
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 3:
                ui = _d.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /^ {2}Last step: / })];
            case 4:
                _a.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.text]).toBe('  Last step: ran checks · npm test');
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /3 pass/ })];
            case 5:
                _b.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _d.sent();
                (0, testing_1.expect)(mem.files.get(FILE)).not.toContain('3 pass');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a record the engine will not open says why and what to do, not only that it could not be read', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ui, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record(), refused: [FILE] })];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'terminal' }))];
            case 2:
                ui = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: "Couldn't read your task record" })];
            case 3:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: 'Claude Code could not open the file.' })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /^Check that .+ is there and that you can read it, then try again\. The debug log has the details\.$/ })];
            case 5:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'retry' })];
            case 6:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('after a /clear the record is read again', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var mem, task, _i, SURFACES_4, surface, ui, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                on('classic.SessionStart', function () { return ({}); });
                return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                mem = (_d.sent()).mem;
                task = (0, helpers_1.makeTask)({ title: 'Filed in another session', priority: 'high' });
                mem.files.set(FILE, record({ tasks: [task] }));
                return [4 /*yield*/, $.classic.SessionStart({ source: 'clear' })];
            case 2:
                _d.sent();
                _i = 0, SURFACES_4 = SURFACES;
                _d.label = 3;
            case 3:
                if (!(_i < SURFACES_4.length)) return [3 /*break*/, 9];
                surface = SURFACES_4[_i];
                return [4 /*yield*/, mountView($, surface, 'backlog')];
            case 4:
                ui = _d.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Reading your queue…/ })];
            case 5:
                _a.apply(void 0, [_d.sent()]).toBeUndefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(task.id) })];
            case 6:
                _b.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.text]).toMatch(/^★ \[high\] Filed in another session/);
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 3];
            case 9: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Up next is in priority order with the suggestion marked', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, _i, SURFACES_5, surface, ui, first, second;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tasks = [
                    (0, helpers_1.makeTask)({ title: 'Later', priority: 'low' }),
                    (0, helpers_1.makeTask)({ title: 'Soon', priority: 'urgent' }),
                    (0, helpers_1.makeTask)({ title: 'Now', state: 'current' }),
                ];
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: tasks }) })];
            case 1:
                _a.sent();
                _i = 0, SURFACES_5 = SURFACES;
                _a.label = 2;
            case 2:
                if (!(_i < SURFACES_5.length)) return [3 /*break*/, 8];
                surface = SURFACES_5[_i];
                return [4 /*yield*/, mountView($, surface, 'backlog')];
            case 3:
                ui = _a.sent();
                return [4 /*yield*/, ui.find({ key: "row:".concat(tasks[1].id) })];
            case 4:
                first = _a.sent();
                return [4 /*yield*/, ui.find({ key: "row:".concat(tasks[0].id) })];
            case 5:
                second = _a.sent();
                (0, testing_1.expect)(first === null || first === void 0 ? void 0 : first.text).toMatch(/^★ \[urgent\] Soon/);
                (0, testing_1.expect)(second === null || second === void 0 ? void 0 : second.text).toMatch(/^ {2}\[low\] Later/);
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a held start shows what is left and Check again', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _i, SURFACES_6, surface, band, ui, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record(), status: DIRTY })];
            case 1:
                mem = (_c.sent()).mem;
                return [4 /*yield*/, $.command.run(__assign({ command: 'steep', args: 'add dark mode' }, COMMAND))];
            case 2:
                _c.sent();
                _i = 0, SURFACES_6 = SURFACES;
                _c.label = 3;
            case 3:
                if (!(_i < SURFACES_6.length)) return [3 /*break*/, 12];
                surface = SURFACES_6[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
            case 4:
                band = _c.sent();
                return [4 /*yield*/, band.press({ key: 'save' })];
            case 5:
                _c.sent();
                return [4 /*yield*/, band.unmount()];
            case 6:
                _c.sent();
                return [4 /*yield*/, mountView($, surface, 'current')];
            case 7:
                ui = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '3 files not committed · 2 commits not pushed' })];
            case 8:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'check-again' })];
            case 9:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 10:
                _c.sent();
                return [3 /*break*/, 12];
            case 11:
                _i++;
                return [3 /*break*/, 3];
            case 12:
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.includes('switch'); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Is this done for now? Yes leads to the difficulty band', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _i, SURFACES_7, surface, ui, _a, band, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 2:
                _d.sent();
                _i = 0, SURFACES_7 = SURFACES;
                _d.label = 3;
            case 3:
                if (!(_i < SURFACES_7.length)) return [3 /*break*/, 13];
                surface = SURFACES_7[_i];
                return [4 /*yield*/, mountView($, surface, 'current')];
            case 4:
                ui = _d.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Is this done for now\?/ })];
            case 5:
                _a.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'done-yes' })];
            case 6:
                _d.sent();
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
            case 8:
                band = _d.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'diff:hard' })];
            case 9:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'save-difficulty' })];
            case 10:
                _c.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 11:
                _d.sent();
                return [3 /*break*/, 13];
            case 12:
                _i++;
                return [3 /*break*/, 3];
            case 13: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the file band: pick high and hard, Save, toast Queued: … (high)', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, seen, mem, _i, SURFACES_8, surface, band, _b, saved;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [task] }),
                        reply: '{"kind":"new","intent":"improving","title":"Dark mode","difficulty":"light"}',
                    })];
            case 1:
                _a = _c.sent(), seen = _a.seen, mem = _a.mem;
                return [4 /*yield*/, $.prompt.submit({ text: 'add dark mode', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _c.sent();
                _i = 0, SURFACES_8 = SURFACES;
                _c.label = 3;
            case 3:
                if (!(_i < SURFACES_8.length)) return [3 /*break*/, 11];
                surface = SURFACES_8[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
            case 4:
                band = _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /New task: Dark mode/ })];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, band.press({ key: 'prio:high' })];
            case 6:
                _c.sent();
                return [4 /*yield*/, band.press({ key: 'diff:hard' })];
            case 7:
                _c.sent();
                return [4 /*yield*/, band.press({ key: 'save' })];
            case 8:
                _c.sent();
                return [4 /*yield*/, band.unmount()];
            case 9:
                _c.sent();
                return [3 /*break*/, 11];
            case 10:
                _i++;
                return [3 /*break*/, 3];
            case 11:
                (0, testing_1.expect)(seen.toasts).toEqual(['Queued: Dark mode (high)']);
                saved = JSON.parse(mem.files.get(FILE)).tasks.find(function (t) { return t.title === 'Dark mode'; });
                (0, testing_1.expect)([saved === null || saved === void 0 ? void 0 : saved.priority, saved === null || saved === void 0 ? void 0 : saved.difficulty.expected, saved === null || saved === void 0 ? void 0 : saved.state]).toEqual(['high', 'hard', 'queued']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("the unsure band without a check says the check didn't run", function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, SURFACES_9, surface, band, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'hmm', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _e.sent();
                _i = 0, SURFACES_9 = SURFACES;
                _e.label = 3;
            case 3:
                if (!(_i < SURFACES_9.length)) return [3 /*break*/, 11];
                surface = SURFACES_9[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
            case 4:
                band = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: "The check didn't run, so pick one." })];
            case 5:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'same-task' })];
            case 6:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'new-task' })];
            case 7:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'quick-question' })];
            case 8:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 3];
            case 11: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('/steep files without a check', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var answer, band, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _b.sent();
                return [4 /*yield*/, $.command.run(__assign({ command: 'steep', args: 'add dark mode' }, COMMAND))];
            case 2:
                answer = _b.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain('band above the prompt');
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _b.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /New task: add dark mode/ })];
            case 4:
                _a.apply(void 0, [_b.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a subagent finishing writes no handoff note and clears nothing', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, seen, clock, turn;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), tokens: 200000, reply: 'note' })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                turn = { answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'end_turn', category: null, explanation: null };
                return [4 /*yield*/, $.turn.complete(__assign(__assign({}, turn), { agentId: 'a1' }))];
            case 2:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                (0, testing_1.expect)(seen.forks).toBe(0);
                (0, testing_1.expect)(seen.clears).toBe(0);
                return [4 /*yield*/, $.turn.complete(turn)];
            case 4:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 5:
                _b.sent();
                (0, testing_1.expect)(seen.forks).toBe(1);
                (0, testing_1.expect)(seen.clears).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a git error at the start still registers the tools and the commands', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, seen;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), status: 'missing' })];
            case 1:
                seen = (_a.sent()).seen;
                (0, testing_1.expect)(seen.tools).toEqual(['task_looks_done', 'propose_commit', 'set_test_profile']);
                (0, testing_1.expect)(seen.commands).toEqual(['queue-tea', 'done', 'steep', 'brew', 'instant', 'tea', 'feature']);
                return [2 /*return*/];
        }
    });
}); });
var DAY_ONE = '2026-10-21';
var HANDOFF = [
    'Overview:',
    '- Redesign the panel',
    'What changed:',
    '- Wrote the bars',
    'Current state:',
    '- On task/now, 2 files not committed, 130 tests pass',
    'Decisions:',
    '- Stacked sections',
    'Next steps:',
    '- Write the spec',
].join('\n');
(0, testing_1.test)('the views: a bar each with its count, the done list and the week chart', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, _i, SURFACES_10, surface, ui, _a, _b, _c, _d, _e, _f, _g;
    var _h;
    var _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                tasks = [
                    (0, helpers_1.makeTask)({ title: 'Now', state: 'current', priority: 'high', branch: 'task/now', minutesByDay: { '2026-10-20': 30 } }),
                    (0, helpers_1.makeTask)({ title: 'Waiting', priority: 'urgent' }),
                    (0, helpers_1.makeTask)({ title: 'Finished', state: 'done', finished: '2026-10-21T08:00:00+02:00', minutesByDay: (_h = {}, _h[DAY_ONE] = 60, _h) }),
                ];
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: tasks }) })];
            case 1:
                _k.sent();
                _i = 0, SURFACES_10 = SURFACES;
                _k.label = 2;
            case 2:
                if (!(_i < SURFACES_10.length)) return [3 /*break*/, 17];
                surface = SURFACES_10[_i];
                return [4 /*yield*/, mountView($, surface, 'current')];
            case 3:
                ui = _k.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /▶ In progress \(1\)/ })];
            case 4:
                _a.apply(void 0, [_k.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'done' })];
            case 5:
                _b.apply(void 0, [_k.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'back' })];
            case 6:
                _c.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _k.sent();
                return [4 /*yield*/, mountView($, surface, 'backlog')];
            case 8:
                ui = _k.sent();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /○ Backlog \(1\)/ })];
            case 9:
                _d.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 10:
                _k.sent();
                return [4 /*yield*/, mountView($, surface, 'history')];
            case 11:
                ui = _k.sent();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /✓ Done this week \(1\) · 1h 30m/ })];
            case 12:
                _e.apply(void 0, [_k.sent()]).toBeDefined();
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Finished · done 1h/ })];
            case 13:
                _f.apply(void 0, [_k.sent()]).toBeDefined();
                _g = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /^M / })];
            case 14:
                _g.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.text]).toBe('M    T ▄  W █  T    F    S    S  ');
                return [4 /*yield*/, ui.unmount()];
            case 15:
                _k.sent();
                _k.label = 16;
            case 16:
                _i++;
                return [3 /*break*/, 2];
            case 17: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the backlog has a New task field that files what is typed', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, ui, band, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tasks = [(0, helpers_1.makeTask)({ title: 'Waiting', priority: 'urgent' })];
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: tasks }) })];
            case 1:
                _b.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 2:
                ui = _b.sent();
                return [4 /*yield*/, ui.input({ key: 'new-task', text: 'Write the docs' })];
            case 3:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 4:
                band = _b.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /New task: Write the docs/ })];
            case 5:
                _a.apply(void 0, [_b.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 6:
                _b.sent();
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Continue shows the handoff note as numbered sections', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _i, SURFACES_11, surface, ui, _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                task = (0, helpers_1.makeTask)({
                    title: 'Now',
                    state: 'current',
                    handoff: { text: HANDOFF, written: '2026-10-21T08:30:00+02:00' },
                });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _g.sent();
                _i = 0, SURFACES_11 = SURFACES;
                _g.label = 2;
            case 2:
                if (!(_i < SURFACES_11.length)) return [3 /*break*/, 12];
                surface = SURFACES_11[_i];
                return [4 /*yield*/, mountView($, surface, 'current')];
            case 3:
                ui = _g.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Handoff note · 08:30/ })];
            case 4:
                _a.apply(void 0, [_g.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '1 Overview' })];
            case 5:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '5 Next steps' })];
            case 6:
                _c.apply(void 0, [_g.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '☐ Write the spec' })];
            case 7:
                _d.apply(void 0, [_g.sent()]).toBeDefined();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '✓ Wrote the bars' })];
            case 8:
                _e.apply(void 0, [_g.sent()]).toBeDefined();
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'continue' })];
            case 9:
                _f.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 10:
                _g.sent();
                _g.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 2];
            case 12: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Continue shows the checkpoint Claude wrote, as numbered sections', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _i, SURFACES_12, surface, ui, _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                task = (0, helpers_1.makeTask)({
                    title: 'Now',
                    state: 'current',
                    checkpoint: __assign(__assign({}, (0, checkpoints_1.emptyCheckpoint)()), { written: '2026-10-21T08:45:00+02:00', goal: 'Show the checkpoint on the card', changes: ['Read the card in menu.tsx'], remaining: ['Write the test'], nextAction: 'Run the tests' }),
                });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _j.sent();
                _i = 0, SURFACES_12 = SURFACES;
                _j.label = 2;
            case 2:
                if (!(_i < SURFACES_12.length)) return [3 /*break*/, 14];
                surface = SURFACES_12[_i];
                return [4 /*yield*/, mountView($, surface, 'current')];
            case 3:
                ui = _j.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Checkpoint · 08:45/ })];
            case 4:
                _a.apply(void 0, [_j.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '1 Goal' })];
            case 5:
                _b.apply(void 0, [_j.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: 'Show the checkpoint on the card' })];
            case 6:
                _c.apply(void 0, [_j.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '✓ Read the card in menu.tsx' })];
            case 7:
                _d.apply(void 0, [_j.sent()]).toBeDefined();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '☐ Write the test' })];
            case 8:
                _e.apply(void 0, [_j.sent()]).toBeDefined();
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '4 Next action' })];
            case 9:
                _f.apply(void 0, [_j.sent()]).toBeDefined();
                _g = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '☐ Run the tests' })];
            case 10:
                _g.apply(void 0, [_j.sent()]).toBeDefined();
                _h = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'continue' })];
            case 11:
                _h.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 12:
                _j.sent();
                _j.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 2];
            case 14: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('task_looks_done with what Claude checked shows it beside the question', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, ui, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done', checked: 'ran the tests: 130 pass' })];
            case 2:
                _c.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 3:
                ui = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: 'Claude checked: ran the tests: 130 pass' })];
            case 4:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'done-not-yet' })];
            case 5:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Claude checked/ })];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Back to queue saves a handoff note and puts the task in Up next on its branch', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, seen, clock, ui, saved, _b, _c;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now', startCommit: '1a2b3c4' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [task] }),
                        reply: HANDOFF,
                        git: { 'git log -1 --format=%h %s': { stdout: '1a2b3c4 Add bars\n' } },
                    })];
            case 1:
                _a = _f.sent(), mem = _a.mem, seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 2:
                ui = _f.sent();
                return [4 /*yield*/, ui.press({ key: 'back' })];
            case 3:
                _f.sent();
                return [4 /*yield*/, clock.settle()];
            case 4:
                _f.sent();
                saved = JSON.parse(mem.files.get(FILE)).tasks[0];
                (0, testing_1.expect)([saved.state, saved.branch, saved.startCommit, (_d = saved.handoff) === null || _d === void 0 ? void 0 : _d.text]).toEqual(['queued', 'task/now', '1a2b3c4', HANDOFF]);
                (0, testing_1.expect)(seen.forks).toBe(1);
                (0, testing_1.expect)(seen.toasts).toEqual(['Back in the backlog: Now']);
                return [4 /*yield*/, ui.press({ key: 'menu:back' })];
            case 5:
                _f.sent();
                return [4 /*yield*/, ui.press({ key: 'menu:backlog' })];
            case 6:
                _f.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(task.id) })];
            case 7:
                _b.apply(void 0, [(_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.text]).toMatch(/^★ \[mid\] Now/);
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /task\/now/ })];
            case 8:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 9:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a commit made during a turn is named in the menu', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, seen, clock, turn, ui, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [task] }),
                        git: {
                            'git rev-parse HEAD': { stdout: 'aaaaaaa\n' },
                            'git symbolic-ref --short -q HEAD': { stdout: 'task/now\n' },
                            'git log --format=%h %s aaaaaaa..bbbbbbb': { stdout: 'bbbbbbb Sneaky commit\n' },
                        },
                    })];
            case 1:
                _a = _d.sent(), mem = _a.mem, seen = _a.seen, clock = _a.clock;
                turn = { answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'end_turn', category: null, explanation: null };
                return [4 /*yield*/, $.turn.start({ text: 'go', turnId: 't1' })];
            case 2:
                _d.sent();
                mem.git['git rev-parse HEAD'] = { stdout: 'bbbbbbb\n' };
                return [4 /*yield*/, $.turn.complete(turn)];
            case 3:
                _d.sent();
                return [4 /*yield*/, clock.settle()];
            case 4:
                _d.sent();
                (0, testing_1.expect)(seen.toasts).toEqual(['Queue-tea: a commit appeared: bbbbbbb Sneaky commit']);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'terminal' }))];
            case 5:
                ui = _d.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /During the last turn a commit appeared: bbbbbbb Sneaky commit/ })];
            case 6:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'dismiss-warning' })];
            case 7:
                _d.sent();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /During the last turn/ })];
            case 8:
                _c.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 9:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
var TURN = { answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'end_turn', category: null, explanation: null };
var NEW_REPLY = '{"kind":"new","intent":"improving","title":"Dev server","difficulty":"light"}';
// A git command that makes or changes the branch; listing them is neither.
var isBranchRun = function (argv) { var _a; return argv[0] === 'git' && ['switch', 'checkout'].includes((_a = argv[1]) !== null && _a !== void 0 ? _a : ''); };
var noteOf = function (answer) { var _a; return ((_a = answer.context) !== null && _a !== void 0 ? _a : []).join('\n'); };
// The turn the engine runs for a submitted prompt: its start, then its end.
var runTurn = function ($_1, clock_1, text_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([$_1, clock_1, text_1], args_1, true), void 0, function ($, clock, text, turnId) {
        if (turnId === void 0) { turnId = 't1'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, $.turn.start({ text: text, turnId: turnId })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, $.turn.complete(__assign(__assign({}, TURN), { turnId: turnId }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, clock.settle()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
(0, testing_1.test)('/brew sends the request as Rohan’s, outside the queue: no check, no task, no branch, no clear', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, seen, mem, clock, runs, answer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current', branch: 'task/fix-login' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), reply: NEW_REPLY })];
            case 1:
                _a = _b.sent(), seen = _a.seen, mem = _a.mem, clock = _a.clock;
                runs = mem.runs.length;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: ' start the dev server and tell me its URL ' }, COMMAND))];
            case 2:
                answer = _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                (0, testing_1.expect)(answer.text).toBe('Brewing now, outside the queue.');
                (0, testing_1.expect)(noteOf(answer)).toContain('Rohan ran /brew');
                (0, testing_1.expect)(noteOf(answer)).toContain('"Fix login"');
                (0, testing_1.expect)(seen.logs).toEqual([]);
                (0, testing_1.expect)(seen.prompts).toEqual([
                    { text: 'start the dev server and tell me its URL', origin: { kind: 'plugin', name: 'queue-tea', asUser: true } },
                ]);
                return [4 /*yield*/, runTurn($, clock, 'start the dev server and tell me its URL')];
            case 4:
                _b.sent();
                (0, testing_1.expect)(seen.forks).toBe(0);
                (0, testing_1.expect)(seen.clears).toBe(0);
                (0, testing_1.expect)(mem.runs.slice(runs).filter(isBranchRun)).toEqual([]);
                (0, testing_1.expect)(JSON.parse(mem.files.get(FILE)).tasks.map(function (t) { return [t.title, t.state, t.branch]; })).toEqual([
                    ['Fix login', 'current', 'task/fix-login'],
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('/brew with nothing after it says what to write and sends nothing', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, seen, clock, answer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: '  ' }, COMMAND))];
            case 2:
                answer = _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                (0, testing_1.expect)(answer.text).toBe('Write what you want after the command: /brew <request>');
                (0, testing_1.expect)(answer.context).toBeUndefined();
                (0, testing_1.expect)(seen.prompts).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('/instant is /brew, and /tea asks for an answer that changes no files', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, seen, clock, instant, tea;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'instant', args: 'run the tests' }, COMMAND))];
            case 2:
                instant = _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                return [4 /*yield*/, runTurn($, clock, 'run the tests')];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.command.run(__assign({ command: 'tea', args: 'how do I start the server?' }, COMMAND))];
            case 5:
                tea = _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 6:
                _b.sent();
                (0, testing_1.expect)(tea.text).toBe('Pouring an answer, outside the queue.');
                (0, testing_1.expect)(seen.prompts.map(function (p) { return p.text; })).toEqual(['run the tests', 'how do I start the server?']);
                (0, testing_1.expect)(noteOf(instant)).toContain('Rohan ran /brew');
                (0, testing_1.expect)(noteOf(tea)).toContain('Rohan ran /tea');
                (0, testing_1.expect)(noteOf(tea)).toContain('change no files');
                (0, testing_1.expect)(seen.forks).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('during a /brew turn task_looks_done asks nothing; after it, it asks again', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, clock, asksDone, during, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                clock = (_c.sent()).clock;
                asksDone = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ui, found;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, mountView($, 'terminal', 'current')];
                            case 1:
                                ui = _a.sent();
                                return [4 /*yield*/, ui.find({ type: 'Text', text: /Is this done for now\?/ })];
                            case 2:
                                found = _a.sent();
                                return [4 /*yield*/, ui.unmount()];
                            case 3:
                                _a.sent();
                                return [2 /*return*/, found !== undefined];
                        }
                    });
                }); };
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: 'start the server' }, COMMAND))];
            case 2:
                _c.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.turn.start({ text: 'start the server', turnId: 't1' })];
            case 4:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 5:
                during = _c.sent();
                (0, testing_1.expect)(JSON.stringify(during)).toContain('errand');
                _a = testing_1.expect;
                return [4 /*yield*/, asksDone()];
            case 6:
                _a.apply(void 0, [_c.sent()]).toBe(false);
                return [4 /*yield*/, $.turn.complete(TURN)];
            case 7:
                _c.sent();
                return [4 /*yield*/, clock.settle()];
            case 8:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 9:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, asksDone()];
            case 10:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a /brew turn past the size starts no fresh conversation; the next turn does', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, seen, clock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), tokens: 200000, reply: 'note' })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: 'start the server' }, COMMAND))];
            case 2:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                return [4 /*yield*/, runTurn($, clock, 'start the server')];
            case 4:
                _b.sent();
                (0, testing_1.expect)(seen.forks).toBe(0);
                (0, testing_1.expect)(seen.clears).toBe(0);
                return [4 /*yield*/, runTurn($, clock, 'and the tests?', 't2')];
            case 5:
                _b.sent();
                (0, testing_1.expect)(seen.forks).toBe(1);
                (0, testing_1.expect)(seen.clears).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a message typed after /brew is checked as before', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, seen, clock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record(), reply: NEW_REPLY })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: 'start the server' }, COMMAND))];
            case 2:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                return [4 /*yield*/, runTurn($, clock, 'start the server')];
            case 4:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'start the server', wait: false, origin: { kind: 'composer' } })];
            case 5:
                _b.sent();
                (0, testing_1.expect)(seen.forks).toBe(1);
                (0, testing_1.expect)(seen.prompts.map(function (p) { return p.text; })).toEqual(['start the server']);
                return [2 /*return*/];
        }
    });
}); });
// Claude Code takes no prompt from a plugin that starts with /: it would run
// as a command. Such a request used to be dropped after "Brewing now".
(0, testing_1.test)('/brew with words that start with / sends nothing, says why and puts the line back in the empty prompt box', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var fills, _a, seen, clock, answer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fills = promptBox(on, '');
                return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: ' /plan the workspace switcher ' }, COMMAND))];
            case 2:
                answer = _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                (0, testing_1.expect)(answer.text).toBe('Not sent: words that start with / run as a command. Put a word before the / and send it again.');
                (0, testing_1.expect)(answer.context).toBeUndefined();
                (0, testing_1.expect)(seen.prompts).toEqual([]);
                (0, testing_1.expect)(fills).toEqual([{ text: '/brew /plan the workspace switcher', mode: 'append' }]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a /brew request that does not enter is not lost: Rohan is told and it goes back in the empty prompt box', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, fills, _a, seen, clock, answer, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                fills = promptBox(on, '');
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), drop: 'a Stop stands' })];
            case 1:
                _a = _e.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: 'start the dev server' }, COMMAND))];
            case 2:
                answer = _e.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _e.sent();
                (0, testing_1.expect)(answer.text).toBe('Brewing now, outside the queue.');
                (0, testing_1.expect)(seen.logs).toEqual(['/brew failed: a Stop stands']);
                (0, testing_1.expect)(seen.toasts).toEqual(['Queue-tea: /brew did not reach Claude. It is back in the prompt to send again.']);
                (0, testing_1.expect)(fills).toEqual([{ text: '/brew start the dev server', mode: 'append' }]);
                // No errand is on its way: the same words typed next are the task's.
                return [4 /*yield*/, $.turn.start({ text: 'start the dev server', turnId: 't1' })];
            case 4:
                // No errand is on its way: the same words typed next are the task's.
                _e.sent();
                _b = testing_1.expect;
                _d = (_c = JSON).stringify;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 5:
                _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).not.toContain('errand');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a /brew request that does not enter leaves a draft typed since alone, and says to send it again', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var fills, _a, seen, clock;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fills = promptBox(on, 'something else');
                return [4 /*yield*/, startSession($, on, { file: record(), drop: 'a Stop stands' })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: 'start the dev server' }, COMMAND))];
            case 2:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _b.sent();
                (0, testing_1.expect)(seen.toasts).toEqual(['Queue-tea: /brew did not reach Claude. Send it again.']);
                (0, testing_1.expect)(fills).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
// The held message's band: Cancel, and where a message sent on counts.
// The prompt box beneath the plugin: what it holds, and what is put in it.
var promptBox = function (on, draft) {
    var fills = [];
    on('prompt.read', function () { return ({ value: { text: draft, cursor: draft.length } }); });
    on('prompt.fill', function (_, e) {
        fills.push({ text: e.text, mode: e.mode });
        return { isFilled: true };
    });
    return fills;
};
(0, testing_1.test)('Cancel on a held new task sends nothing, files nothing, and puts the message back in the empty prompt box', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, fills, _a, seen, mem, band, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                fills = promptBox(on, '');
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), reply: NEW_REPLY })];
            case 1:
                _a = _c.sent(), seen = _a.seen, mem = _a.mem;
                return [4 /*yield*/, $.prompt.submit({ text: 'start the dev server', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _c.sent();
                return [4 /*yield*/, band.press({ key: 'cancel' })];
            case 4:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /New task: Dev server/ })];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                return [4 /*yield*/, band.unmount()];
            case 6:
                _c.sent();
                (0, testing_1.expect)(seen.prompts).toEqual([]);
                (0, testing_1.expect)(fills).toEqual([{ text: 'start the dev server', mode: 'append' }]);
                (0, testing_1.expect)(JSON.parse(mem.files.get(FILE)).tasks.map(function (t) { return t.title; })).toEqual(['Now']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Cancel on the unsure band leaves a draft typed since alone, and the next band goes up', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var fills, seen, band, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                fills = promptBox(on, 'half typed');
                return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                seen = (_c.sent()).seen;
                return [4 /*yield*/, $.prompt.submit({ text: 'hmm', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'and this', wait: false, origin: { kind: 'composer' } })];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 4:
                band = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'hmm' })];
            case 5:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, band.press({ key: 'cancel' })];
            case 6:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'and this' })];
            case 7:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 8:
                _c.sent();
                (0, testing_1.expect)(seen.prompts).toEqual([]);
                (0, testing_1.expect)(fills).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Quick question sends the message as Rohan’s; its time goes to the project and it is not counted', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, seen, mem, clock, band, saved;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [task] }),
                        reply: '{"kind":"unsure","intent":"understanding"}',
                    })];
            case 1:
                _a = _c.sent(), seen = _a.seen, mem = _a.mem, clock = _a.clock;
                return [4 /*yield*/, $.prompt.submit({ text: 'what does this error mean?', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _c.sent();
                return [4 /*yield*/, band.press({ key: 'quick-question' })];
            case 4:
                _c.sent();
                return [4 /*yield*/, band.unmount()];
            case 5:
                _c.sent();
                return [4 /*yield*/, clock.advance(5 * 60000)];
            case 6:
                _c.sent();
                return [4 /*yield*/, runTurn($, clock, 'what does this error mean?')];
            case 7:
                _c.sent();
                (0, testing_1.expect)(seen.prompts).toEqual([
                    { text: 'what does this error mean?', origin: { kind: 'plugin', name: 'queue-tea', asUser: true } },
                ]);
                saved = JSON.parse(mem.files.get(FILE));
                (0, testing_1.expect)(saved.unassignedMinutesByDay).toEqual((_b = {}, _b[DAY_ONE] = 5, _b));
                (0, testing_1.expect)(saved.tasks[0].minutesByDay).toEqual({});
                (0, testing_1.expect)(saved.tasks[0].effort.understandingMessages).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Same task on the unsure band counts the message once, and its time goes to the task', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, clock, band, saved;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [task] }),
                        reply: '{"kind":"unsure","intent":"understanding"}',
                    })];
            case 1:
                _a = _c.sent(), mem = _a.mem, clock = _a.clock;
                return [4 /*yield*/, $.prompt.submit({ text: 'why does it fail?', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _c.sent();
                return [4 /*yield*/, band.press({ key: 'same-task' })];
            case 4:
                _c.sent();
                return [4 /*yield*/, band.unmount()];
            case 5:
                _c.sent();
                return [4 /*yield*/, clock.advance(5 * 60000)];
            case 6:
                _c.sent();
                return [4 /*yield*/, runTurn($, clock, 'why does it fail?')];
            case 7:
                _c.sent();
                saved = JSON.parse(mem.files.get(FILE));
                (0, testing_1.expect)(saved.tasks[0].minutesByDay).toEqual((_b = {}, _b[DAY_ONE] = 5, _b));
                (0, testing_1.expect)(saved.tasks[0].effort.understandingMessages).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
// The tea cup above the prompt and the menu it opens.
var ENTRIES = ['brew', 'backlog', 'current', 'history', 'usage', 'settings', 'help'];
var SAME_REPLY = '{"kind":"same","intent":"improving"}';
var FOCUSED = __assign(__assign({}, PANE), { props: __assign(__assign({}, PANE.props), { isFocused: true }) });
var recordOf = function (mem) { return JSON.parse(mem.files.get(FILE)); };
(0, testing_1.test)('/queue-tea opens the menu asking for the keys, so Esc closes it; opening it files nothing', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, seen, before, answer, ui, _i, _b, _c, i, view, _d, _e, _f;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _a = _j.sent(), mem = _a.mem, seen = _a.seen;
                before = mem.files.get(FILE);
                (0, testing_1.expect)(seen.opens).toEqual([]);
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 2:
                answer = _j.sent();
                (0, testing_1.expect)(answer.text).toBe('Queue-tea menu opened.');
                (0, testing_1.expect)(seen.opens[0]).toMatchObject({ id: 'queue-tea', focus: true, closeOnEscape: true });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, FOCUSED), { surface: 'terminal' }))];
            case 3:
                ui = _j.sent();
                _i = 0, _b = ENTRIES.entries();
                _j.label = 4;
            case 4:
                if (!(_i < _b.length)) return [3 /*break*/, 7];
                _c = _b[_i], i = _c[0], view = _c[1];
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "menu:".concat(view) })];
            case 5:
                _d.apply(void 0, [(_g = (_j.sent())) === null || _g === void 0 ? void 0 : _g.props.hotkey]).toBe(String(i + 1));
                _j.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'menu:brew' })];
            case 8:
                _e.apply(void 0, [(_h = (_j.sent())) === null || _h === void 0 ? void 0 : _h.props.autoFocus]).toBe(true);
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '1–7 pick · tab move · enter press · esc close' })];
            case 9:
                _f.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 10:
                _j.sent();
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(before);
                (0, testing_1.expect)(recordOf(mem).tasks.length).toBe(1);
                (0, testing_1.expect)(seen.prompts).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('keyboard: every view has m back to the list, and a closed menu opens on the list again', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var seen, ui, _i, ENTRIES_1, view, _a, _b, _c, _d, band, _e, _f, _g;
    var _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record({ tasks: [(0, helpers_1.makeTask)({ title: 'Waiting' })] }) })];
            case 1:
                seen = (_l.sent()).seen;
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 2:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, FOCUSED), { surface: 'terminal' }))];
            case 3:
                ui = _l.sent();
                _i = 0, ENTRIES_1 = ENTRIES;
                _l.label = 4;
            case 4:
                if (!(_i < ENTRIES_1.length)) return [3 /*break*/, 12];
                view = ENTRIES_1[_i];
                return [4 /*yield*/, ui.press({ key: "menu:".concat(view) })];
            case 5:
                _l.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'menu:back' })];
            case 6:
                _a.apply(void 0, [(_h = (_l.sent())) === null || _h === void 0 ? void 0 : _h.props.hotkey]).toBe('m');
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'menu:brew' })];
            case 7:
                _b.apply(void 0, [_l.sent()]).toBeUndefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: 'm menu · tab move · enter press · esc close' })];
            case 8:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'menu:back' })];
            case 9:
                _l.sent();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'menu:brew' })];
            case 10:
                _d.apply(void 0, [_l.sent()]).toBeDefined();
                _l.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 4];
            case 12: return [4 /*yield*/, ui.press({ key: 'menu:history' })];
            case 13:
                _l.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 14:
                band = _l.sent();
                _e = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'cup-menu' })];
            case 15:
                _e.apply(void 0, [(_j = (_l.sent())) === null || _j === void 0 ? void 0 : _j.text]).toBe('Close menu');
                return [4 /*yield*/, band.press({ key: 'cup-menu' })];
            case 16:
                _l.sent();
                (0, testing_1.expect)(seen.closes).toEqual(['queue-tea']);
                _f = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'cup-menu' })];
            case 17:
                _f.apply(void 0, [(_k = (_l.sent())) === null || _k === void 0 ? void 0 : _k.text]).toBe('Menu');
                return [4 /*yield*/, band.unmount()];
            case 18:
                _l.sent();
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 19:
                _l.sent();
                _g = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'menu:brew' })];
            case 20:
                _g.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 21:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('docked 46 columns wide, the list and the hint without the keys fit uncut', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ui, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record({ tasks: [(0, helpers_1.makeTask)({ title: 'Waiting' })] }) })];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { props: __assign(__assign({}, PANE.props), { bodyColumns: 46 }), surface: 'terminal' }))];
            case 2:
                ui = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: 'click or ctrl+x tab for keys · esc closes' })];
            case 3:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '/config options and paths' })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '/steep /brew /tea /feature' })];
            case 5:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /…$/ })];
            case 6:
                _d.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Help, under the list: each command it names is registered, the keys by where they work, and it writes nothing', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, seen, before, _i, SURFACES_13, surface, ui, _b, HELP_COMMANDS_1, _c, usage_1, does, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record({ tasks: [(0, helpers_1.makeTask)({ title: 'Waiting' })] }) })];
            case 1:
                _a = _j.sent(), mem = _a.mem, seen = _a.seen;
                before = mem.files.get(FILE);
                _i = 0, SURFACES_13 = SURFACES;
                _j.label = 2;
            case 2:
                if (!(_i < SURFACES_13.length)) return [3 /*break*/, 14];
                surface = SURFACES_13[_i];
                return [4 /*yield*/, mountView($, surface, 'help')];
            case 3:
                ui = _j.sent();
                _b = 0, HELP_COMMANDS_1 = help_view_1.HELP_COMMANDS;
                _j.label = 4;
            case 4:
                if (!(_b < HELP_COMMANDS_1.length)) return [3 /*break*/, 8];
                _c = HELP_COMMANDS_1[_b], usage_1 = _c.usage, does = _c.does;
                (0, testing_1.expect)(seen.commands).toContain(usage_1.split(' ')[0].slice(1));
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: usage_1 })];
            case 5:
                _d.apply(void 0, [_j.sent()]).toBeDefined();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: does })];
            case 6:
                _e.apply(void 0, [_j.sent()]).toBeDefined();
                _j.label = 7;
            case 7:
                _b++;
                return [3 /*break*/, 4];
            case 8:
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /d done · b back to queue/ })];
            case 9:
                _f.apply(void 0, [_j.sent()]).toBeDefined();
                _g = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /p part of… · a active feature/ })];
            case 10:
                _g.apply(void 0, [_j.sent()]).toBeDefined();
                _h = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'menu:back' })];
            case 11:
                _h.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 12:
                _j.sent();
                _j.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 2];
            case 14:
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('/done opens the menu on Current task, where the question is', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, seen, answer, ui, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                seen = (_c.sent()).seen;
                return [4 /*yield*/, $.command.run(__assign({ command: 'done', args: '' }, COMMAND))];
            case 2:
                answer = _c.sent();
                (0, testing_1.expect)(answer.text).toBe('Asked in the Queue-tea menu.');
                (0, testing_1.expect)(seen.opens[0]).toMatchObject({ id: 'queue-tea', focus: true, closeOnEscape: true });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'terminal' }))];
            case 3:
                ui = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: 'Is this done for now?' })];
            case 4:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'done-yes' })];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Backlog: priority, Remove and Start go through the queue engine', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var tidy, typo, mem, ui, _a, _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                tidy = (0, helpers_1.makeTask)({ title: 'Tidy', priority: 'low' });
                typo = (0, helpers_1.makeTask)({ title: 'Typo', priority: 'okay' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [tidy, typo] }), status: DIRTY })];
            case 1:
                mem = (_e.sent()).mem;
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 2:
                ui = _e.sent();
                return [4 /*yield*/, ui.press({ key: "row:".concat(tidy.id) })];
            case 3:
                _e.sent();
                return [4 /*yield*/, ui.press({ key: "prio:".concat(tidy.id, ":high") })];
            case 4:
                _e.sent();
                (0, testing_1.expect)((_c = recordOf(mem).tasks.find(function (t) { return t.id === tidy.id; })) === null || _c === void 0 ? void 0 : _c.priority).toBe('high');
                return [4 /*yield*/, ui.press({ key: "row:".concat(typo.id) })];
            case 5:
                _e.sent();
                return [4 /*yield*/, ui.press({ key: "remove:".concat(typo.id) })];
            case 6:
                _e.sent();
                (0, testing_1.expect)((_d = recordOf(mem).tasks.find(function (t) { return t.id === typo.id; })) === null || _d === void 0 ? void 0 : _d.state).toBe('removed');
                // Start: the git check holds it, and the menu moves to where Check again is.
                return [4 /*yield*/, ui.press({ key: "row:".concat(tidy.id) })];
            case 7:
                // Start: the git check holds it, and the menu moves to where Check again is.
                _e.sent();
                return [4 /*yield*/, ui.press({ key: "start:".concat(tidy.id) })];
            case 8:
                _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '3 files not committed · 2 commits not pushed' })];
            case 9:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'check-again' })];
            case 10:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                (0, testing_1.expect)(mem.runs.some(isBranchRun)).toBe(false);
                return [4 /*yield*/, ui.unmount()];
            case 11:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Backlog: Play next puts a task first and says why, Start ★ names it; pressed again, it comes off', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var tidy, login, mem, ui, _a, _b, _c, _d, _e, _f;
    var _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                tidy = (0, helpers_1.makeTask)({ title: 'Tidy', priority: 'low' });
                login = (0, helpers_1.makeTask)({ title: 'Login', priority: 'high' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [tidy, login] }) })];
            case 1:
                mem = (_m.sent()).mem;
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 2:
                ui = _m.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(login.id) })];
            case 3:
                _a.apply(void 0, [(_g = (_m.sent())) === null || _g === void 0 ? void 0 : _g.text]).toMatch(/^★ \[high\] Login/);
                return [4 /*yield*/, ui.press({ key: "row:".concat(tidy.id) })];
            case 4:
                _m.sent();
                return [4 /*yield*/, ui.press({ key: "play-next:".concat(tidy.id) })];
            case 5:
                _m.sent();
                (0, testing_1.expect)(recordOf(mem).playNext).toBe(tidy.id);
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(tidy.id) })];
            case 6:
                _b.apply(void 0, [(_h = (_m.sent())) === null || _h === void 0 ? void 0 : _h.text]).toMatch(/^★ \[low\] Tidy/);
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /you chose Play next/ })];
            case 7:
                _c.apply(void 0, [_m.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'menu:back' })];
            case 8:
                _m.sent();
                return [4 /*yield*/, ui.press({ key: 'menu:current' })];
            case 9:
                _m.sent();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'start-next' })];
            case 10:
                _d.apply(void 0, [(_j = (_m.sent())) === null || _j === void 0 ? void 0 : _j.text]).toBe('Start ★ Tidy');
                return [4 /*yield*/, ui.press({ key: 'menu:back' })];
            case 11:
                _m.sent();
                return [4 /*yield*/, ui.press({ key: 'menu:backlog' })];
            case 12:
                _m.sent();
                return [4 /*yield*/, ui.press({ key: "row:".concat(tidy.id) })];
            case 13:
                _m.sent();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "play-next:".concat(tidy.id) })];
            case 14:
                _e.apply(void 0, [(_k = (_m.sent())) === null || _k === void 0 ? void 0 : _k.text]).toBe('Play next •');
                return [4 /*yield*/, ui.press({ key: "play-next:".concat(tidy.id) })];
            case 15:
                _m.sent();
                (0, testing_1.expect)(recordOf(mem).playNext).toBeNull();
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(login.id) })];
            case 16:
                _f.apply(void 0, [(_l = (_m.sent())) === null || _l === void 0 ? void 0 : _l.text]).toMatch(/^★ \[high\] Login/);
                return [4 /*yield*/, ui.unmount()];
            case 17:
                _m.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Backlog: each task shows its estimate, and Time I have puts what fits first', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var rewrite, typo, ui, _a, _b, _c, _d, _e, _f, _g, _i, _h, label, _j, _k;
    var _l, _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0:
                rewrite = (0, helpers_1.makeTask)({ title: 'Rewrite', priority: 'high', difficulty: { expected: 'hard', actual: null } });
                typo = (0, helpers_1.makeTask)({ title: 'Typo', priority: 'low', difficulty: { expected: 'light', actual: null } });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [rewrite, typo] }) })];
            case 1:
                _s.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 2:
                ui = _s.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Hard · ~4h · / })];
            case 3:
                _a.apply(void 0, [_s.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Light · ~30m short · / })];
            case 4:
                _b.apply(void 0, [_s.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'time' })];
            case 5:
                _c.apply(void 0, [(_l = (_s.sent())) === null || _l === void 0 ? void 0 : _l.text]).toBe('Time I have: any');
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(rewrite.id) })];
            case 6:
                _d.apply(void 0, [(_m = (_s.sent())) === null || _m === void 0 ? void 0 : _m.text]).toMatch(/^★ \[high\] Rewrite/);
                return [4 /*yield*/, ui.press({ key: 'time' })];
            case 7:
                _s.sent();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'time' })];
            case 8:
                _e.apply(void 0, [(_o = (_s.sent())) === null || _o === void 0 ? void 0 : _o.text]).toBe('Time I have: 30m');
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(typo.id) })];
            case 9:
                _f.apply(void 0, [(_p = (_s.sent())) === null || _p === void 0 ? void 0 : _p.text]).toMatch(/^★ \[low\] Typo/);
                _g = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /low · fits 30m/ })];
            case 10:
                _g.apply(void 0, [_s.sent()]).toBeDefined();
                _i = 0, _h = ['1h', '2h', 'any'];
                _s.label = 11;
            case 11:
                if (!(_i < _h.length)) return [3 /*break*/, 15];
                label = _h[_i];
                return [4 /*yield*/, ui.press({ key: 'time' })];
            case 12:
                _s.sent();
                _j = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'time' })];
            case 13:
                _j.apply(void 0, [(_q = (_s.sent())) === null || _q === void 0 ? void 0 : _q.text]).toBe("Time I have: ".concat(label));
                _s.label = 14;
            case 14:
                _i++;
                return [3 /*break*/, 11];
            case 15:
                _k = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(rewrite.id) })];
            case 16:
                _k.apply(void 0, [(_r = (_s.sent())) === null || _r === void 0 ? void 0 : _r.text]).toMatch(/^★ \[high\] Rewrite/);
                return [4 /*yield*/, ui.unmount()];
            case 17:
                _s.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Backlog: Blocked… sets what a task waits for; it moves to Blocked, and Unblock brings it back', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var api, screen, mem, ui, _a, _b, _c, _d, _e, _f, _g;
    var _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                api = (0, helpers_1.makeTask)({ title: 'API', priority: 'mid' });
                screen = (0, helpers_1.makeTask)({ title: 'Screen', priority: 'high' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [api, screen] }) })];
            case 1:
                mem = (_l.sent()).mem;
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 2:
                ui = _l.sent();
                return [4 /*yield*/, ui.press({ key: "row:".concat(screen.id) })];
            case 3:
                _l.sent();
                return [4 /*yield*/, ui.press({ key: "block:".concat(screen.id) })];
            case 4:
                _l.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /What does Screen wait for\?/ })];
            case 5:
                _a.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'block-cancel' })];
            case 6:
                _l.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /What does Screen wait for\?/ })];
            case 7:
                _b.apply(void 0, [_l.sent()]).toBeUndefined();
                // Cancel goes back to the row, still open.
                return [4 /*yield*/, ui.press({ key: "block:".concat(screen.id) })];
            case 8:
                // Cancel goes back to the row, still open.
                _l.sent();
                return [4 /*yield*/, ui.press({ key: "wait:".concat(api.id) })];
            case 9:
                _l.sent();
                (0, testing_1.expect)((_h = recordOf(mem).tasks.find(function (t) { return t.id === screen.id; })) === null || _h === void 0 ? void 0 : _h.blockedBy).toEqual([api.id]);
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Blocked \(1\)/ })];
            case 10:
                _c.apply(void 0, [_l.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /waits for API/ })];
            case 11:
                _d.apply(void 0, [_l.sent()]).toBeDefined();
                // API takes the priority of what waits for it, and is the suggestion.
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(api.id) })];
            case 12:
                // API takes the priority of what waits for it, and is the suggestion.
                _e.apply(void 0, [(_j = (_l.sent())) === null || _j === void 0 ? void 0 : _j.text]).toMatch(/^★ \[mid\] API/);
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /high, from what waits for it · unblocks Screen/ })];
            case 13:
                _f.apply(void 0, [_l.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: "row:".concat(screen.id) })];
            case 14:
                _l.sent();
                return [4 /*yield*/, ui.press({ key: "unblock:".concat(screen.id) })];
            case 15:
                _l.sent();
                (0, testing_1.expect)((_k = recordOf(mem).tasks.find(function (t) { return t.id === screen.id; })) === null || _k === void 0 ? void 0 : _k.blockedBy).toEqual([]);
                _g = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Blocked \(/ })];
            case 16:
                _g.apply(void 0, [_l.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 17:
                _l.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Backlog: other projects with tasks waiting, one dim line each', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var other, idle, ui, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                other = __assign(__assign({}, (0, record_source_1.emptyRecord)('example-app', '/q')), { tasks: [(0, helpers_1.makeTask)({ title: 'Fix the login' }), (0, helpers_1.makeTask)({ title: 'Docs', priority: 'low' })] });
                idle = (0, record_source_1.emptyRecord)('idle-app', '/r');
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [(0, helpers_1.makeTask)({ title: 'Here' })] }),
                        others: (_d = {}, _d[(0, record_source_1.recordPath)('/h', (0, record_source_1.projectKey)('/q'))] = JSON.stringify(other), _d[(0, record_source_1.recordPath)('/h', (0, record_source_1.projectKey)('/r'))] = JSON.stringify(idle), _d),
                    })];
            case 1:
                _e.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 2:
                ui = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Other projects \(1\)/ })];
            case 3:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: 'example-app · 2 waiting · ★ Fix the login' })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /idle-app/ })];
            case 5:
                _c.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Current task: what has moved under it is named, in the warning colour', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, ui, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now', baseBranch: 'main', startCommit: '1a2b3c4' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _c.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 2:
                ui = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: '! The branch task/now is gone.' })];
            case 3:
                _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.props.color]).toBe('warning');
                return [4 /*yield*/, ui.unmount()];
            case 4:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Usage: the current task’s lines so far, from git since it started, measured again after each turn', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, clock, ui, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'main', startCommit: '1a2b3c4' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [task] }),
                        git: { 'git diff --shortstat 1a2b3c4': { stdout: ' 3 files changed, 42 insertions(+), 7 deletions(-)\n' } },
                    })];
            case 1:
                _a = _d.sent(), mem = _a.mem, clock = _a.clock;
                return [4 /*yield*/, mountView($, 'terminal', 'usage')];
            case 2:
                ui = _d.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /changed · \+42 −7 lines$/ })];
            case 3:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                mem.git['git diff --shortstat 1a2b3c4'] = { stdout: ' 4 files changed, 50 insertions(+), 9 deletions(-)\n' };
                return [4 /*yield*/, runTurn($, clock, 'go on')];
            case 4:
                _d.sent();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /changed · \+50 −9 lines$/ })];
            case 5:
                _c.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Usage: a task with no start commit shows no line count rather than +0 −0', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ui, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record({ tasks: [(0, helpers_1.makeTask)({ title: 'Now', state: 'current' })] }) })];
            case 1:
                _c.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'usage')];
            case 2:
                ui = _c.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /files read · 0 changed$/ })];
            case 3:
                _a.apply(void 0, [_c.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /lines/ })];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Current task: Blocked… with a reason puts it back blocked, with a checkpoint', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, seen, clock, ui, _b, saved;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now', startCommit: '1a2b3c4' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [task] }),
                        reply: HANDOFF,
                        git: { 'git log -1 --format=%h %s': { stdout: '1a2b3c4 Add bars\n' } },
                    })];
            case 1:
                _a = _d.sent(), mem = _a.mem, seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 2:
                ui = _d.sent();
                return [4 /*yield*/, ui.press({ key: "block:".concat(task.id) })];
            case 3:
                _d.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /What does Now wait for\?/ })];
            case 4:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, ui.input({ key: 'block-reason', text: 'waiting for the API key' })];
            case 5:
                _d.sent();
                return [4 /*yield*/, clock.settle()];
            case 6:
                _d.sent();
                saved = recordOf(mem).tasks[0];
                (0, testing_1.expect)([saved.state, saved.blockedReason, (_c = saved.handoff) === null || _c === void 0 ? void 0 : _c.text]).toEqual(['queued', 'waiting for the API key', HANDOFF]);
                (0, testing_1.expect)(seen.toasts).toEqual(['Blocked: Now']);
                return [4 /*yield*/, ui.unmount()];
            case 7:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('moving around the menu leaves the current task, its branch and the record as they were', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, seen, clock, before, runs, ui, _i, ENTRIES_2, view, band;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current', branch: 'task/fix-login', startCommit: '1a2b3c4' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _a = _b.sent(), mem = _a.mem, seen = _a.seen, clock = _a.clock;
                before = mem.files.get(FILE);
                runs = mem.runs.length;
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'terminal' }))];
            case 3:
                ui = _b.sent();
                _i = 0, ENTRIES_2 = ENTRIES;
                _b.label = 4;
            case 4:
                if (!(_i < ENTRIES_2.length)) return [3 /*break*/, 8];
                view = ENTRIES_2[_i];
                return [4 /*yield*/, ui.press({ key: "menu:".concat(view) })];
            case 5:
                _b.sent();
                return [4 /*yield*/, ui.press({ key: 'menu:back' })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 4];
            case 8: return [4 /*yield*/, ui.unmount()];
            case 9:
                _b.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 10:
                band = _b.sent();
                return [4 /*yield*/, band.press({ key: 'cup-menu' })];
            case 11:
                _b.sent();
                return [4 /*yield*/, band.press({ key: 'cup-menu' })];
            case 12:
                _b.sent();
                return [4 /*yield*/, band.unmount()];
            case 13:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 14:
                _b.sent();
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(before);
                (0, testing_1.expect)(mem.runs.slice(runs).filter(isBranchRun)).toEqual([]);
                (0, testing_1.expect)(seen.clears).toBe(0);
                (0, testing_1.expect)(seen.prompts).toEqual([]);
                (0, testing_1.expect)(recordOf(mem).tasks.map(function (t) { return [t.title, t.state, t.branch]; })).toEqual([['Fix login', 'current', 'task/fix-login']]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('tasks in the record are all there after a restart, and the menu shows them', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var now, next, _a, mem, clock, band, ui, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current', branch: 'task/fix-login' });
                next = (0, helpers_1.makeTask)({ title: 'Dark mode', priority: 'high' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [now, next] }) })];
            case 1:
                _a = _e.sent(), mem = _a.mem, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 2:
                _e.sent();
                return [4 /*yield*/, $.command.run(__assign({ command: 'steep', args: 'Write the docs' }, COMMAND))];
            case 3:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 4:
                band = _e.sent();
                return [4 /*yield*/, band.press({ key: 'save' })];
            case 5:
                _e.sent();
                return [4 /*yield*/, band.unmount()
                    // A restart: a new session reads the same record.
                ];
            case 6:
                _e.sent();
                // A restart: a new session reads the same record.
                return [4 /*yield*/, $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })];
            case 7:
                // A restart: a new session reads the same record.
                _e.sent();
                return [4 /*yield*/, clock.settle()];
            case 8:
                _e.sent();
                (0, testing_1.expect)(recordOf(mem).tasks.map(function (t) { return [t.title, t.state]; })).toEqual([
                    ['Fix login', 'current'],
                    ['Dark mode', 'queued'],
                    ['Write the docs', 'queued'],
                ]);
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 9:
                ui = _e.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(next.id) })];
            case 10:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ text: /Write the docs/ })];
            case 11:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'menu:back' })];
            case 12:
                _e.sent();
                return [4 /*yield*/, ui.press({ key: 'menu:current' })];
            case 13:
                _e.sent();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Fix login/ })];
            case 14:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 15:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Brew now is the /brew errand: outside the queue, the task and branch kept, the menu closed', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, rows, _a, mem, seen, clock, ui, note, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current', branch: 'task/fix-login' });
                rows = testing_1.mock.session(on);
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _a = _e.sent(), mem = _a.mem, seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 2:
                _e.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'brew')];
            case 3:
                ui = _e.sent();
                return [4 /*yield*/, ui.input({ key: 'brew', text: ' run the tests ' })];
            case 4:
                _e.sent();
                return [4 /*yield*/, clock.settle()];
            case 5:
                _e.sent();
                (0, testing_1.expect)(seen.closes).toEqual(['queue-tea']);
                note = JSON.stringify(rows.appended().map(function (row) { return row.message; }));
                (0, testing_1.expect)(note).toContain('Rohan ran /brew');
                (0, testing_1.expect)(note).toContain('\\"Fix login\\"');
                (0, testing_1.expect)(seen.prompts).toEqual([{ text: 'run the tests', origin: { kind: 'plugin', name: 'queue-tea', asUser: true } }]);
                // Its turn is the errand's: task_looks_done asks nothing during it.
                return [4 /*yield*/, $.turn.start({ text: 'run the tests', turnId: 't1' })];
            case 6:
                // Its turn is the errand's: task_looks_done asks nothing during it.
                _e.sent();
                _b = testing_1.expect;
                _d = (_c = JSON).stringify;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 7:
                _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toContain('errand');
                (0, testing_1.expect)(recordOf(mem).tasks.map(function (t) { return [t.title, t.state, t.branch]; })).toEqual([['Fix login', 'current', 'task/fix-login']]);
                return [4 /*yield*/, ui.unmount()];
            case 8:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Brew now with words that start with / sends nothing, adds no note and puts the line back in the prompt box', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var rows, fills, _a, seen, clock, ui;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                rows = testing_1.mock.session(on);
                fills = promptBox(on, '');
                return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 2:
                _b.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'brew')];
            case 3:
                ui = _b.sent();
                return [4 /*yield*/, ui.input({ key: 'brew', text: '/plan the menu' })];
            case 4:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 5:
                _b.sent();
                (0, testing_1.expect)(seen.closes).toEqual(['queue-tea']);
                (0, testing_1.expect)(rows.appended()).toEqual([]);
                (0, testing_1.expect)(seen.prompts).toEqual([]);
                (0, testing_1.expect)(seen.toasts).toEqual([
                    'Queue-tea: Not sent: words that start with / run as a command. Put a word before the / and send it again.',
                ]);
                (0, testing_1.expect)(fills).toEqual([{ text: '/brew /plan the menu', mode: 'append' }]);
                return [4 /*yield*/, ui.unmount()];
            case 6:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the cup idles when nothing is going on', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var band, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _e.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 2:
                band = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Client', key: 'cup' })];
            case 3:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: '-ω-', in: 'cup' })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'idle' })];
            case 5:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'Nothing queued' })];
            case 6:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 7:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the cup brews while a task is current, or while a turn runs outside the queue', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, band, _a, _b, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', minutesByDay: (_e = {}, _e[DAY_ONE] = 42, _e) });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), reply: SAME_REPLY })];
            case 1:
                _f.sent();
                return [4 /*yield*/, $.prompt.submit({ text: 'keep going', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _f.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: '•ω•', in: 'cup' })];
            case 4:
                _a.apply(void 0, [_f.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'brewing' })];
            case 5:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'Now · 42m' })];
            case 6:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 7:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal', props: __assign(__assign({}, BAND.props), { isWorking: true }) }))];
            case 8:
                band = _f.sent();
                _d = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'brewing' })];
            case 9:
                _d.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 10:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the cup needs Rohan when Queue-tea asks, and the menu opens where the answer is', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, seen, band, _a, _b, _c, _d, ui, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                seen = (_f.sent()).seen;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 2:
                _f.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _f.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: '•o•', in: 'cup' })];
            case 4:
                _a.apply(void 0, [_f.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: '     !     ', in: 'cup' })];
            case 5:
                _b.apply(void 0, [_f.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'needs you' })];
            case 6:
                _c.apply(void 0, [_f.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'Is this done for now? Now' })];
            case 7:
                _d.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, band.press({ key: 'cup-menu' })];
            case 8:
                _f.sent();
                (0, testing_1.expect)(seen.opens[0]).toMatchObject({ id: 'queue-tea' });
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, PANE), { surface: 'terminal' }))];
            case 9:
                ui = _f.sent();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'done-yes' })];
            case 10:
                _e.apply(void 0, [_f.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 11:
                _f.sent();
                return [4 /*yield*/, band.unmount()];
            case 12:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the cup is pleased just after a task is done', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var done, band, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                done = (0, helpers_1.makeTask)({ title: 'Dark mode', state: 'done', finished: '2026-10-21T09:05:00+02:00' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [done] }) })];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 2:
                band = _d.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: '^ω^', in: 'cup' })];
            case 3:
                _a.apply(void 0, [_d.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'done' })];
            case 4:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: 'Finished: Dark mode' })];
            case 5:
                _c.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, band.unmount()];
            case 6:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the steam moves on the surface’s own clock, and nothing is written for it', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, seen, writes, band, steam, first, second, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                _a = _c.sent(), mem = _a.mem, seen = _a.seen;
                writes = mem.writes.length;
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal', props: __assign(__assign({}, BAND.props), { isWorking: true }) }))];
            case 2:
                band = _c.sent();
                steam = function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, band.find({ type: 'Text', text: /\(/, in: 'cup' })];
                        case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.text];
                    }
                }); }); };
                return [4 /*yield*/, steam()];
            case 3:
                first = _c.sent();
                return [4 /*yield*/, band.advance(500)];
            case 4:
                _c.sent();
                return [4 /*yield*/, steam()];
            case 5:
                second = _c.sent();
                return [4 /*yield*/, band.advance(500)];
            case 6:
                _c.sent();
                (0, testing_1.expect)(first).toBe('   ) ( )   ');
                (0, testing_1.expect)(second).toBe('   ( ) (   ');
                _b = testing_1.expect;
                return [4 /*yield*/, steam()];
            case 7:
                _b.apply(void 0, [_c.sent()]).toBe('   ) ) (   ');
                (0, testing_1.expect)(mem.writes.length).toBe(writes);
                (0, testing_1.expect)(seen.opens).toEqual([]);
                return [4 /*yield*/, band.unmount()];
            case 8:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('pointing at the cup winks, and a click opens the menu and closes it', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var seen, band, _a, _b, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })];
            case 1:
                seen = (_g.sent()).seen;
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal', viewport: { columns: 120, rows: 40, isFullscreen: true } }))];
            case 2:
                band = _g.sent();
                return [4 /*yield*/, band.resize({ columns: 11, rows: 3, in: 'cup' })];
            case 3:
                _g.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: ' · /queue-tea, or click the cup' })];
            case 4:
                _a.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, band.pointer({ type: 'enter', x: 5, y: 2 })];
            case 5:
                _g.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: '•ω-', in: 'cup' })];
            case 6:
                _b.apply(void 0, [_g.sent()]).toBeDefined();
                return [4 /*yield*/, band.pointer({ type: 'down', x: 5, y: 2, button: 'left' })];
            case 7:
                _g.sent();
                (0, testing_1.expect)(seen.opens[0]).toMatchObject({ id: 'queue-tea', focus: true, closeOnEscape: true });
                _c = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'cup-menu' })];
            case 8:
                _c.apply(void 0, [(_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.text]).toBe('Close menu');
                return [4 /*yield*/, band.pointer({ type: 'down', x: 5, y: 2, button: 'left' })];
            case 9:
                _g.sent();
                (0, testing_1.expect)(seen.closes).toEqual(['queue-tea']);
                _d = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'cup-menu' })];
            case 10:
                _d.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.text]).toBe('Menu');
                return [4 /*yield*/, band.unmount()];
            case 11:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no mouse, no Client or little room, the band still works from the keyboard', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var seen, main, _a, _b, _i, _c, surface, still, _d, _e, narrow, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, startSession($, on, { file: record() })
                // The main screen reports no clicks: the band names the keyboard way alone.
            ];
            case 1:
                seen = (_j.sent()).seen;
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal', viewport: { columns: 100, rows: 30, isFullscreen: false } }))];
            case 2:
                main = _j.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, main.find({ type: 'Text', text: ' · /queue-tea' })];
            case 3:
                _a.apply(void 0, [_j.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, main.find({ type: 'Text', text: /click/ })];
            case 4:
                _b.apply(void 0, [_j.sent()]).toBeUndefined();
                return [4 /*yield*/, main.press({ key: 'cup-menu' })];
            case 5:
                _j.sent();
                (0, testing_1.expect)(seen.opens.length).toBe(1);
                return [4 /*yield*/, main.unmount()
                    // A surface that runs no Client draws the cup still.
                ];
            case 6:
                _j.sent();
                _i = 0, _c = ['vscode', 'mobile'];
                _j.label = 7;
            case 7:
                if (!(_i < _c.length)) return [3 /*break*/, 13];
                surface = _c[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
            case 8:
                still = _j.sent();
                _d = testing_1.expect;
                return [4 /*yield*/, still.find({ type: 'Client' })];
            case 9:
                _d.apply(void 0, [_j.sent()]).toBeUndefined();
                _e = testing_1.expect;
                return [4 /*yield*/, still.find({ type: 'Text', text: '-ω-' })];
            case 10:
                _e.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, still.unmount()];
            case 11:
                _j.sent();
                _j.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 7];
            case 13: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal', props: __assign(__assign({}, BAND.props), { bodyColumns: 30 }) }))];
            case 14:
                narrow = _j.sent();
                _f = testing_1.expect;
                return [4 /*yield*/, narrow.find({ type: 'Client' })];
            case 15:
                _f.apply(void 0, [_j.sent()]).toBeUndefined();
                _g = testing_1.expect;
                return [4 /*yield*/, narrow.find({ type: 'Text', text: 'Nothing queued' })];
            case 16:
                _g.apply(void 0, [_j.sent()]).toBeDefined();
                _h = testing_1.expect;
                return [4 /*yield*/, narrow.find({ key: 'cup-menu' })];
            case 17:
                _h.apply(void 0, [_j.sent()]).toBeDefined();
                return [4 /*yield*/, narrow.unmount()];
            case 18:
                _j.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Backlog: a feature folds its tasks under it with their progress; tasks on their own stay in the list', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, close, docs, typo, stuck, _i, SURFACES_14, surface, ui, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var _w, _x, _y, _z, _0, _1;
    return __generator(this, function (_2) {
        switch (_2.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity', priority: 'mid' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys hint', priority: 'high', parentId: menu.id });
                close = (0, helpers_1.makeTask)({ title: 'Close button', parentId: menu.id, state: 'done' });
                docs = (0, helpers_1.makeTask)({ title: 'Menu docs', parentId: menu.id, blockedReason: 'waiting for copy' });
                typo = (0, helpers_1.makeTask)({ title: 'Typo', priority: 'low' });
                stuck = (0, helpers_1.makeTask)({ title: 'Stuck', blockedReason: 'no key' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [menu, keys, close, docs, typo, stuck] }) })];
            case 1:
                _2.sent();
                _i = 0, SURFACES_14 = SURFACES;
                _2.label = 2;
            case 2:
                if (!(_i < SURFACES_14.length)) return [3 /*break*/, 31];
                surface = SURFACES_14[_i];
                return [4 /*yield*/, mountView($, surface, 'backlog')
                    // Folded: the feature, how far it is, and the ★ task in it named.
                ];
            case 3:
                ui = _2.sent();
                // Folded: the feature, how far it is, and the ★ task in it named.
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(menu.id) })];
            case 4:
                // Folded: the feature, how far it is, and the ★ task in it named.
                _a.apply(void 0, [(_w = (_2.sent())) === null || _w === void 0 ? void 0 : _w.text]).toMatch(/^\[mid\] Menu parity/);
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "fold:".concat(menu.id) })];
            case 5:
                _b.apply(void 0, [(_x = (_2.sent())) === null || _x === void 0 ? void 0 : _x.text]).toBe('▸');
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /◆ 1\/3 done ▰▰▱▱▱ · 1 blocked/ })];
            case 6:
                _c.apply(void 0, [_2.sent()]).toBeDefined();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /★ Keys hint · high/ })];
            case 7:
                _d.apply(void 0, [_2.sent()]).toBeDefined();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(keys.id) })];
            case 8:
                _e.apply(void 0, [_2.sent()]).toBeUndefined();
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(typo.id) })];
            case 9:
                _f.apply(void 0, [(_y = (_2.sent())) === null || _y === void 0 ? void 0 : _y.text]).toMatch(/^ {2}\[low\] Typo/);
                // The count of what can start is as before; Blocked has the one not under a feature.
                _g = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /○ Backlog \(3\)/ })];
            case 10:
                // The count of what can start is as before; Blocked has the one not under a feature.
                _g.apply(void 0, [_2.sent()]).toBeDefined();
                _h = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /⊘ Blocked \(1\)/ })];
            case 11:
                _h.apply(void 0, [_2.sent()]).toBeDefined();
                // Unfolded: its tasks in the order they start, then the blocked, then the finished.
                return [4 /*yield*/, ui.press({ key: "fold:".concat(menu.id) })];
            case 12:
                // Unfolded: its tasks in the order they start, then the blocked, then the finished.
                _2.sent();
                _j = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "fold:".concat(menu.id) })];
            case 13:
                _j.apply(void 0, [(_z = (_2.sent())) === null || _z === void 0 ? void 0 : _z.text]).toBe('▾');
                _k = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(keys.id) })];
            case 14:
                _k.apply(void 0, [(_0 = (_2.sent())) === null || _0 === void 0 ? void 0 : _0.text]).toMatch(/^ {2}★ \[high\] Keys hint/);
                _l = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(docs.id) })];
            case 15:
                _l.apply(void 0, [(_1 = (_2.sent())) === null || _1 === void 0 ? void 0 : _1.text]).toMatch(/^ {4}\[mid\] Menu docs/);
                _m = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /waiting for copy/ })];
            case 16:
                _m.apply(void 0, [_2.sent()]).toBeDefined();
                _o = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /✓ Close button/ })];
            case 17:
                _o.apply(void 0, [_2.sent()]).toBeDefined();
                _p = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /★ Keys hint · high/ })];
            case 18:
                _p.apply(void 0, [_2.sent()]).toBeUndefined();
                // A task under the feature opens its own buttons; the feature's has no Part of….
                return [4 /*yield*/, ui.press({ key: "row:".concat(keys.id) })];
            case 19:
                // A task under the feature opens its own buttons; the feature's has no Part of….
                _2.sent();
                _q = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "start:".concat(keys.id) })];
            case 20:
                _q.apply(void 0, [_2.sent()]).toBeDefined();
                _r = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "part-of:".concat(keys.id) })];
            case 21:
                _r.apply(void 0, [_2.sent()]).toBeDefined();
                _s = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "feature:".concat(keys.id) })];
            case 22:
                _s.apply(void 0, [_2.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.press({ key: "row:".concat(menu.id) })];
            case 23:
                _2.sent();
                _t = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "feature:".concat(menu.id) })];
            case 24:
                _t.apply(void 0, [_2.sent()]).toBeDefined();
                _u = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "part-of:".concat(menu.id) })];
            case 25:
                _u.apply(void 0, [_2.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.press({ key: "row:".concat(menu.id) })];
            case 26:
                _2.sent();
                return [4 /*yield*/, ui.press({ key: "fold:".concat(menu.id) })];
            case 27:
                _2.sent();
                _v = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(keys.id) })];
            case 28:
                _v.apply(void 0, [_2.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.unmount()];
            case 29:
                _2.sent();
                _2.label = 30;
            case 30:
                _i++;
                return [3 /*break*/, 2];
            case 31: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Backlog: Part of… puts a task under a feature, and On its own takes it out again', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, docs, mem, ui, _a, _b, _c, _d, _e, _f;
    var _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys hint', parentId: menu.id });
                docs = (0, helpers_1.makeTask)({ title: 'Docs', priority: 'high' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [menu, keys, docs] }) })];
            case 1:
                mem = (_k.sent()).mem;
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 2:
                ui = _k.sent();
                return [4 /*yield*/, ui.press({ key: "row:".concat(docs.id) })];
            case 3:
                _k.sent();
                return [4 /*yield*/, ui.press({ key: "part-of:".concat(docs.id) })];
            case 4:
                _k.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Which feature is Docs part of\?/ })];
            case 5:
                _a.apply(void 0, [_k.sent()]).toBeDefined();
                // Not under a task that is itself under a feature.
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "parent:".concat(keys.id) })];
            case 6:
                // Not under a task that is itself under a feature.
                _b.apply(void 0, [_k.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.press({ key: 'part-of-cancel' })];
            case 7:
                _k.sent();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Which feature/ })];
            case 8:
                _c.apply(void 0, [_k.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.press({ key: "part-of:".concat(docs.id) })];
            case 9:
                _k.sent();
                return [4 /*yield*/, ui.press({ key: "parent:".concat(menu.id) })];
            case 10:
                _k.sent();
                (0, testing_1.expect)((_g = recordOf(mem).tasks.find(function (t) { return t.id === docs.id; })) === null || _g === void 0 ? void 0 : _g.parentId).toBe(menu.id);
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /◆ 0\/2 done/ })];
            case 11:
                _d.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: "fold:".concat(menu.id) })];
            case 12:
                _k.sent();
                return [4 /*yield*/, ui.press({ key: "part-of:".concat(docs.id) })];
            case 13:
                _k.sent();
                _e = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Now part of Menu parity\./ })];
            case 14:
                _e.apply(void 0, [_k.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'parent:none' })];
            case 15:
                _k.sent();
                (0, testing_1.expect)((_h = recordOf(mem).tasks.find(function (t) { return t.id === docs.id; })) === null || _h === void 0 ? void 0 : _h.parentId).toBeNull();
                _f = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "row:".concat(docs.id) })];
            case 16:
                _f.apply(void 0, [(_j = (_k.sent())) === null || _j === void 0 ? void 0 : _j.text]).toMatch(/^★ \[high\] Docs/);
                return [4 /*yield*/, ui.unmount()];
            case 17:
                _k.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with a feature active, /steep asks what the task is part of; Save files it under the pick, the current task kept', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var now, menu, _a, mem, seen, runs, _i, SURFACES_15, surface, band_1, _b, _c, _d, _e, _f, _g, band;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Login', state: 'current', branch: 'task/login' });
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [now, menu], feature: menu.id }) })];
            case 1:
                _a = _h.sent(), mem = _a.mem, seen = _a.seen;
                runs = mem.runs.length;
                return [4 /*yield*/, $.command.run(__assign({ command: 'steep', args: 'arrow keys' }, COMMAND))];
            case 2:
                _h.sent();
                _i = 0, SURFACES_15 = SURFACES;
                _h.label = 3;
            case 3:
                if (!(_i < SURFACES_15.length)) return [3 /*break*/, 13];
                surface = SURFACES_15[_i];
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: surface }))];
            case 4:
                band_1 = _h.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, band_1.find({ type: 'Text', text: 'Is it part of a feature? Pick one, or On its own.' })];
            case 5:
                _b.apply(void 0, [_h.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, band_1.find({ key: 'save' })];
            case 6:
                _c.apply(void 0, [_h.sent()]).toBeUndefined();
                _d = testing_1.expect;
                return [4 /*yield*/, band_1.find({ key: 'parent:none' })];
            case 7:
                _d.apply(void 0, [_h.sent()]).toBeDefined();
                _e = testing_1.expect;
                return [4 /*yield*/, band_1.find({ key: "parent:".concat(menu.id) })];
            case 8:
                _e.apply(void 0, [_h.sent()]).toBeDefined();
                _f = testing_1.expect;
                return [4 /*yield*/, band_1.find({ key: "parent:".concat(now.id) })];
            case 9:
                _f.apply(void 0, [_h.sent()]).toBeDefined();
                _g = testing_1.expect;
                return [4 /*yield*/, band_1.find({ key: 'parent:new' })];
            case 10:
                _g.apply(void 0, [_h.sent()]).toBeDefined();
                return [4 /*yield*/, band_1.unmount()];
            case 11:
                _h.sent();
                _h.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 3];
            case 13: return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 14:
                band = _h.sent();
                return [4 /*yield*/, band.press({ key: "parent:".concat(menu.id) })];
            case 15:
                _h.sent();
                return [4 /*yield*/, band.press({ key: 'save' })];
            case 16:
                _h.sent();
                return [4 /*yield*/, band.unmount()];
            case 17:
                _h.sent();
                (0, testing_1.expect)(seen.toasts).toEqual(['Queued: arrow keys (mid) · part of Menu parity']);
                (0, testing_1.expect)(recordOf(mem).tasks.map(function (t) { return [t.title, t.state, t.branch, t.parentId]; })).toEqual([
                    ['Login', 'current', 'task/login', null],
                    ['Menu parity', 'queued', null, null],
                    ['arrow keys', 'queued', null, menu.id],
                ]);
                (0, testing_1.expect)(mem.runs.slice(runs).filter(isBranchRun)).toEqual([]);
                (0, testing_1.expect)([seen.clears, seen.prompts]).toEqual([0, []]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no feature active, unrelated work is on its own and Save files it as before', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var now, mem, band, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Login', state: 'current', branch: 'task/login' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [now] }),
                        reply: '{"kind":"new","intent":"improving","title":"CI cache","difficulty":"light","parent":"none"}',
                    })];
            case 1:
                mem = (_d.sent()).mem;
                return [4 /*yield*/, $.prompt.submit({ text: 'fix the CI cache', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _d.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ type: 'Text', text: /Is it part of a feature/ })];
            case 4:
                _a.apply(void 0, [_d.sent()]).toBeUndefined();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'parent:none' })];
            case 5:
                _b.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.text]).toContain('On its own');
                return [4 /*yield*/, band.press({ key: 'save' })];
            case 6:
                _d.sent();
                return [4 /*yield*/, band.unmount()];
            case 7:
                _d.sent();
                (0, testing_1.expect)(recordOf(mem).tasks.map(function (t) { return [t.title, t.parentId]; })).toEqual([
                    ['Login', null],
                    ['CI cache', null],
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('New feature… names a feature, and Save files it with the task under it', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var now, mem, band, _a, tasks, feature;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Login', state: 'current', branch: 'task/login' });
                return [4 /*yield*/, startSession($, on, {
                        file: record({ tasks: [now] }),
                        reply: '{"kind":"new","intent":"improving","title":"Arrow keys","difficulty":"light","parent":"none"}',
                    })];
            case 1:
                mem = (_d.sent()).mem;
                return [4 /*yield*/, $.prompt.submit({ text: 'add arrow keys', wait: false, origin: { kind: 'composer' } })];
            case 2:
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _d.sent();
                return [4 /*yield*/, band.press({ key: 'parent:new' })];
            case 4:
                _d.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'save' })];
            case 5:
                _a.apply(void 0, [_d.sent()]).toBeUndefined();
                return [4 /*yield*/, band.input({ key: 'feature-title', text: 'Menu parity' })];
            case 6:
                _d.sent();
                return [4 /*yield*/, band.press({ key: 'save' })];
            case 7:
                _d.sent();
                return [4 /*yield*/, band.unmount()];
            case 8:
                _d.sent();
                tasks = recordOf(mem).tasks;
                feature = tasks.find(function (t) { return t.title === 'Menu parity'; });
                (0, testing_1.expect)(feature === null || feature === void 0 ? void 0 : feature.parentId).toBeNull();
                (0, testing_1.expect)((_b = tasks.find(function (t) { return t.title === 'Arrow keys'; })) === null || _b === void 0 ? void 0 : _b.parentId).toBe(feature === null || feature === void 0 ? void 0 : feature.id);
                (0, testing_1.expect)((_c = tasks.find(function (t) { return t.id === now.id; })) === null || _c === void 0 ? void 0 : _c.state).toBe('current');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('/feature sets the active feature, the backlog names it, and Clear or the row’s button clears it', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var menu, mem, answer, ui, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [menu] }) })];
            case 1:
                mem = (_e.sent()).mem;
                return [4 /*yield*/, $.command.run(__assign({ command: 'feature', args: 'menu parity' }, COMMAND))];
            case 2:
                answer = _e.sent();
                (0, testing_1.expect)(answer.text).toBe('Active feature: Menu parity. New tasks that belong to it are offered under it.');
                (0, testing_1.expect)(recordOf(mem).feature).toBe(menu.id);
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 3:
                ui = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /◆ Active feature: Menu parity/ })];
            case 4:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'feature:clear' })];
            case 5:
                _e.sent();
                (0, testing_1.expect)(recordOf(mem).feature).toBeNull();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Active feature:/ })];
            case 6:
                _b.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.press({ key: "row:".concat(menu.id) })];
            case 7:
                _e.sent();
                return [4 /*yield*/, ui.press({ key: "feature:".concat(menu.id) })];
            case 8:
                _e.sent();
                (0, testing_1.expect)(recordOf(mem).feature).toBe(menu.id);
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "feature:".concat(menu.id) })];
            case 9:
                _c.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.text]).toBe('Active feature •');
                return [4 /*yield*/, ui.press({ key: "feature:".concat(menu.id) })];
            case 10:
                _e.sent();
                (0, testing_1.expect)(recordOf(mem).feature).toBeNull();
                return [4 /*yield*/, ui.unmount()];
            case 11:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('/brew with a feature active files no task and leaves the feature, the task and its branch alone', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var menu, _a, seen, mem, clock, runs, band, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity', state: 'current', branch: 'task/menu-parity' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [menu], feature: menu.id }), reply: NEW_REPLY })];
            case 1:
                _a = _c.sent(), seen = _a.seen, mem = _a.mem, clock = _a.clock;
                runs = mem.runs.length;
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: 'add a test for the menu parity feature' }, COMMAND))];
            case 2:
                _c.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _c.sent();
                return [4 /*yield*/, runTurn($, clock, 'add a test for the menu parity feature')];
            case 4:
                _c.sent();
                (0, testing_1.expect)(seen.forks).toBe(0);
                (0, testing_1.expect)(recordOf(mem).tasks.map(function (t) { return [t.title, t.state, t.branch, t.parentId]; })).toEqual([
                    ['Menu parity', 'current', 'task/menu-parity', null],
                ]);
                (0, testing_1.expect)(recordOf(mem).feature).toBe(menu.id);
                (0, testing_1.expect)(mem.runs.slice(runs).filter(isBranchRun)).toEqual([]);
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 5:
                band = _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, band.find({ key: 'save' })];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBeUndefined();
                return [4 /*yield*/, band.unmount()];
            case 7:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Current task: the feature it is part of, how far that is, and Part of… from there', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, close, ui, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys hint', parentId: menu.id, state: 'current', branch: 'task/keys-hint' });
                close = (0, helpers_1.makeTask)({ title: 'Close button', parentId: menu.id, state: 'done' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [menu, keys, close] }) })];
            case 1:
                _e.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 2:
                ui = _e.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /◆ part of Menu parity · 1\/2 done ▰▰▰▱▱ · 1 in progress/ })];
            case 3:
                _a.apply(void 0, [_e.sent()]).toBeDefined();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: "feature:".concat(keys.id) })];
            case 4:
                _b.apply(void 0, [_e.sent()]).toBeUndefined();
                return [4 /*yield*/, ui.press({ key: "part-of:".concat(keys.id) })];
            case 5:
                _e.sent();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /Which feature is Keys hint part of\?/ })];
            case 6:
                _c.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, ui.press({ key: 'part-of-cancel' })];
            case 7:
                _e.sent();
                _d = testing_1.expect;
                return [4 /*yield*/, ui.find({ key: 'done' })];
            case 8:
                _d.apply(void 0, [_e.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 9:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('features and their tasks are all there after a restart, the active feature too', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, now, _a, mem, clock, band, ui, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys hint', parentId: menu.id });
                now = (0, helpers_1.makeTask)({ title: 'Login', state: 'current', branch: 'task/login' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [now, menu, keys], feature: menu.id }) })
                    // The message names the feature, so it is picked.
                ];
            case 1:
                _a = _d.sent(), mem = _a.mem, clock = _a.clock;
                // The message names the feature, so it is picked.
                return [4 /*yield*/, $.command.run(__assign({ command: 'steep', args: 'Arrows for menu parity' }, COMMAND))];
            case 2:
                // The message names the feature, so it is picked.
                _d.sent();
                return [4 /*yield*/, $.ui.mount(__assign(__assign({}, BAND), { surface: 'terminal' }))];
            case 3:
                band = _d.sent();
                return [4 /*yield*/, band.press({ key: 'save' })];
            case 4:
                _d.sent();
                return [4 /*yield*/, band.unmount()];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })];
            case 6:
                _d.sent();
                return [4 /*yield*/, clock.settle()];
            case 7:
                _d.sent();
                (0, testing_1.expect)(recordOf(mem).feature).toBe(menu.id);
                (0, testing_1.expect)(recordOf(mem).tasks.map(function (t) { return [t.title, t.parentId]; })).toEqual([
                    ['Login', null],
                    ['Menu parity', null],
                    ['Keys hint', menu.id],
                    ['Arrows for menu parity', menu.id],
                ]);
                return [4 /*yield*/, mountView($, 'terminal', 'backlog')];
            case 8:
                ui = _d.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /◆ 0\/2 done/ })];
            case 9:
                _b.apply(void 0, [_d.sent()]).toBeDefined();
                _c = testing_1.expect;
                return [4 /*yield*/, ui.find({ type: 'Text', text: /◆ Active feature: Menu parity/ })];
            case 10:
                _c.apply(void 0, [_d.sent()]).toBeDefined();
                return [4 /*yield*/, ui.unmount()];
            case 11:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
// Runs whatever the guard lets through, so a test sees whether it did.
var passedOn = function (on) {
    var ran = [];
    on('tool.call', function (_, e) {
        ran.push(e.tool);
        return { result: 'ran' };
    });
    return ran;
};
(0, testing_1.test)('in a realm made before Git modes the mod refuses a commit through Bash, naming propose_commit', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ran = passedOn(on);
                return [4 /*yield*/, startSession($, on)];
            case 1:
                _b.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'git commit -m x' })];
            case 2:
                _a.apply(void 0, [_b.sent()]).toMatchObject({ deny: commit_guard_text_1.GUARD_TEXT.assisted });
                (0, testing_1.expect)(ran).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('in an Assisted realm the mod refuses a push through Monitor, naming propose_commit', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ran = passedOn(on);
                return [4 /*yield*/, startSession($, on, { file: record({ gitMode: 'assisted' }) })];
            case 1:
                _b.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', command: 'git push' })];
            case 2:
                _a.apply(void 0, [_b.sent()]).toMatchObject({ deny: commit_guard_text_1.GUARD_TEXT.assisted });
                (0, testing_1.expect)(commit_guard_text_1.GUARD_TEXT.assisted).toContain('propose_commit');
                (0, testing_1.expect)(ran).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('in a Manual realm the mod still refuses a commit through Bash, in the plain words', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ran = passedOn(on);
                return [4 /*yield*/, startSession($, on, { file: record({ gitMode: 'manual' }) })];
            case 1:
                _b.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'git commit -m x' })];
            case 2:
                _a.apply(void 0, [_b.sent()]).toMatchObject({
                    deny: 'Queue-tea: commits and pushes are yours to make.',
                });
                (0, testing_1.expect)(ran).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('in a Manual realm the mod still refuses a push through Monitor, in the plain words', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ran = passedOn(on);
                return [4 /*yield*/, startSession($, on, { file: record({ gitMode: 'manual' }) })];
            case 1:
                _b.sent();
                _a = testing_1.expect;
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', command: 'git push' })];
            case 2:
                _a.apply(void 0, [_b.sent()]).toMatchObject({
                    deny: 'Queue-tea: commits and pushes are yours to make.',
                });
                (0, testing_1.expect)(ran).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
var HEAD_GIT = { 'git rev-parse HEAD': { stdout: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n' }, 'git symbolic-ref --short -q HEAD': { stdout: 'main\n' } };
(0, testing_1.test)('propose_commit saves Claude’s proposal on the current task for Branches', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, answer;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }), git: HEAD_GIT })];
            case 1:
                mem = (_b.sent()).mem;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__propose_commit', message: 'fixed the retry button', files: ['src/retry.ts'] })];
            case 2:
                answer = _b.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain(commit_guard_text_1.PROPOSAL_TEXT.saved(1));
                (0, testing_1.expect)((_a = recordOf(mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.commitProposal).toEqual({
                    message: 'fixed the retry button',
                    files: ['src/retry.ts'],
                    head: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
                    at: '2026-10-21T09:12:00+02:00',
                });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('propose_commit refuses in a Manual realm and saves nothing', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, answer;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task], gitMode: 'manual' }), git: HEAD_GIT })];
            case 1:
                mem = (_b.sent()).mem;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__propose_commit', message: 'fixed the retry button', files: ['src/retry.ts'] })];
            case 2:
                answer = _b.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain(JSON.stringify(commit_guard_text_1.PROPOSAL_TEXT.manual).slice(1, -1));
                (0, testing_1.expect)((_a = recordOf(mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.commitProposal).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('set_test_profile saves Tea-DD’s pick on the current task', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, answer;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                mem = (_b.sent()).mem;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__set_test_profile', profile: 'deep', reason: 'a new tool' })];
            case 2:
                answer = _b.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain(tasks_text_1.PROFILE_TEXT.saved('deep'));
                (0, testing_1.expect)((_a = recordOf(mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('during a /brew turn set_test_profile records nothing; after it, it records again', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, clock, before, during;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _a = _c.sent(), mem = _a.mem, clock = _a.clock;
                before = mem.files.get(FILE);
                return [4 /*yield*/, $.command.run(__assign({ command: 'brew', args: 'start the server' }, COMMAND))];
            case 2:
                _c.sent();
                return [4 /*yield*/, clock.settle()];
            case 3:
                _c.sent();
                return [4 /*yield*/, $.turn.start({ text: 'start the server', turnId: 't1' })];
            case 4:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__set_test_profile', profile: 'deep', reason: 'a new tool' })];
            case 5:
                during = _c.sent();
                (0, testing_1.expect)(JSON.stringify(during)).toContain(tasks_text_1.PROFILE_TEXT.errand);
                (0, testing_1.expect)(mem.files.get(FILE)).toBe(before);
                return [4 /*yield*/, $.turn.complete(TURN)];
            case 6:
                _c.sent();
                return [4 /*yield*/, clock.settle()];
            case 7:
                _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__set_test_profile', profile: 'deep', reason: 'a new tool' })];
            case 8:
                _c.sent();
                (0, testing_1.expect)((_b = recordOf(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
                return [2 /*return*/];
        }
    });
}); });
var NOTIFIED = '<task-notification>\n<task-id>bg-1</task-id>\n<status>completed</status>\n<summary>Background command "Run the tests" completed (exit code 0)</summary>\n</task-notification>';
var launchCheck = function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var started;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                on('tool.call', function () { return ({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } }); });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [(0, helpers_1.makeTask)({ title: 'Now', state: 'current' })] }) })];
            case 1:
                started = _c.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'npm test', run_in_background: true })];
            case 2:
                _c.sent();
                (0, testing_1.expect)((_a = recordOf(started.mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.step).toMatchObject({ kind: 'test', status: 'running', backgroundId: 'bg-1' });
                (0, testing_1.expect)((_b = recordOf(started.mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.waiting).toHaveLength(1);
                return [2 /*return*/, started];
        }
    });
}); };
(0, testing_1.test)('a background check ends when its notification arrives, and the minutes waited count as in checks', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, clock, task;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, launchCheck($, on)];
            case 1:
                _a = _c.sent(), mem = _a.mem, clock = _a.clock;
                return [4 /*yield*/, clock.advance(10 * 60000)];
            case 2:
                _c.sent();
                return [4 /*yield*/, $.prompt.submit({ text: NOTIFIED, wait: false, origin: { kind: 'task-notification' } })];
            case 3:
                _c.sent();
                return [4 /*yield*/, runTurn($, clock, NOTIFIED)];
            case 4:
                _c.sent();
                task = recordOf(mem).tasks[0];
                (0, testing_1.expect)(task.step).toMatchObject({ status: 'succeeded', finished: '2026-10-21T09:22:00+02:00' });
                (0, testing_1.expect)(task.waiting).toBeUndefined();
                (0, testing_1.expect)(task.minutesByDay).toEqual((_b = {}, _b[DAY_ONE] = 10, _b));
                (0, testing_1.expect)(task.minutesInChecks).toBe(10);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("a typed prompt with a notification's text ends no background check", function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, clock, task;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, launchCheck($, on)];
            case 1:
                _a = _b.sent(), mem = _a.mem, clock = _a.clock;
                return [4 /*yield*/, clock.advance(10 * 60000)];
            case 2:
                _b.sent();
                return [4 /*yield*/, $.prompt.submit({ text: NOTIFIED, wait: false, origin: { kind: 'composer' } })];
            case 3:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 4:
                _b.sent();
                task = recordOf(mem).tasks[0];
                (0, testing_1.expect)(task.step).toMatchObject({ status: 'running', finished: null });
                (0, testing_1.expect)(task.testPeriods).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the mod lets an ordinary command through', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                on('tool.call', function () { return ({ result: 'ok' }); });
                return [4 /*yield*/, startSession($, on)];
            case 1:
                _a.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'git status' })];
            case 2:
                result = (_a.sent());
                (0, testing_1.expect)(result.deny).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the status line follows the record', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, seen, clock, ui;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _a = _b.sent(), seen = _a.seen, clock = _a.clock;
                (0, testing_1.expect)(seen.statuses.at(-1)).toMatch(/^Queue-tea: Now/);
                return [4 /*yield*/, mountView($, 'terminal', 'current')];
            case 2:
                ui = _b.sent();
                return [4 /*yield*/, ui.press({ key: 'back' })];
            case 3:
                _b.sent();
                return [4 /*yield*/, clock.settle()];
            case 4:
                _b.sent();
                (0, testing_1.expect)(seen.statuses.at(-1)).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a Tea-DD run through the Agent tool counts at done', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                on('tool.call', function () { return ({ result: 'ok' }); });
                task = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current', branch: 'task/fix-login', helpers: { on: ['tea-dd'], ran: [], reminded: false } });
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', subagent_type: 'queue-tea:tea-dd' })];
            case 2:
                _d.sent();
                _a = testing_1.expect;
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 3:
                _a.apply(void 0, [_c.apply(_b, [_d.sent()])]).toContain('Rohan is asked');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a helper run during /brew does not count', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var task, clock, ui, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                on('tool.call', function () { return ({ result: 'ok' }); });
                task = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current', branch: 'task/fix-login', helpers: { on: ['tea-dd'], ran: [], reminded: false } });
                testing_1.mock.session(on);
                return [4 /*yield*/, startSession($, on, { file: record({ tasks: [task] }) })];
            case 1:
                clock = (_d.sent()).clock;
                return [4 /*yield*/, $.command.run(__assign({ command: 'queue-tea', args: '' }, COMMAND))];
            case 2:
                _d.sent();
                return [4 /*yield*/, mountView($, 'terminal', 'brew')];
            case 3:
                ui = _d.sent();
                return [4 /*yield*/, ui.input({ key: 'brew', text: 'run the tests' })];
            case 4:
                _d.sent();
                return [4 /*yield*/, clock.settle()];
            case 5:
                _d.sent();
                return [4 /*yield*/, $.turn.start({ text: 'run the tests', turnId: 't1' })];
            case 6:
                _d.sent();
                return [4 /*yield*/, $.tool.call({ tool: 'Agent', subagent_type: 'queue-tea:tea-dd' })];
            case 7:
                _d.sent();
                return [4 /*yield*/, $.turn.complete({ turnId: 't1' })];
            case 8:
                _d.sent();
                return [4 /*yield*/, clock.settle()];
            case 9:
                _d.sent();
                _a = testing_1.expect;
                _c = (_b = JSON).stringify;
                return [4 /*yield*/, $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })];
            case 10:
                _a.apply(void 0, [_c.apply(_b, [_d.sent()])]).toContain("hasn't run yet");
                return [4 /*yield*/, ui.unmount()];
            case 11:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
