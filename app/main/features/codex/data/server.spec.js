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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
var inMemory_js_1 = require("@modelcontextprotocol/sdk/inMemory.js");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var fixtures_1 = require("../../tasks/api/fixtures");
var constants_1 = require("../domain/constants");
var context_1 = require("./context");
var server_1 = require("./server");
var root;
var context;
var server;
var client;
var logs;
var seed = function (record) { return (0, promises_1.writeFile)(context.ctx.file, JSON.stringify(record)); };
var read = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(context.ctx.file, 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var call = function (name_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([name_1], args_1, true), void 0, function (name, args) {
        var result, content;
        if (args === void 0) { args = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.callTool({ name: name, arguments: args })];
                case 1:
                    result = _a.sent();
                    content = result.content;
                    return [2 /*return*/, { error: result.isError === true, text: content[0].text }];
            }
        });
    });
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cwd, log, _b, clientSide, serverSide;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-codex-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
            case 2:
                root = _c.sent();
                cwd = (0, node_path_1.join)(root, 'workspace');
                return [4 /*yield*/, (0, promises_1.mkdir)(cwd)];
            case 3:
                _c.sent();
                logs = [];
                log = (0, logger_1.createLogger)('dev', function (line) { return logs.push(line); });
                return [4 /*yield*/, (0, context_1.loadCodexContext)((0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        throw new Error('unexpected open');
                    }); }); }), log, cwd, root)];
            case 4:
                context = _c.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(root, '.queue-tea/projects'), { recursive: true })];
            case 5:
                _c.sent();
                return [4 /*yield*/, seed(__assign(__assign({}, (0, record_source_1.emptyRecord)('workspace', cwd)), { tasks: [
                            (0, fixtures_1.makeTask)({ id: 'other', state: 'current', worktreePath: (0, node_path_1.join)(root, 'other') }),
                            (0, fixtures_1.makeTask)({ id: 'ours', state: 'current', worktreePath: cwd }),
                            (0, fixtures_1.makeTask)({ id: 'feature', title: 'New flow' }),
                        ] }))];
            case 6:
                _c.sent();
                server = (0, server_1.createCodexServer)(context, log);
                client = new index_js_1.Client({ name: 'test', version: '1' });
                _b = inMemory_js_1.InMemoryTransport.createLinkedPair(), clientSide = _b[0], serverSide = _b[1];
                return [4 /*yield*/, server.connect(serverSide)];
            case 7:
                _c.sent();
                return [4 /*yield*/, client.connect(clientSide)];
            case 8:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (client === null || client === void 0 ? void 0 : client.close())];
            case 1:
                _a.sent();
                return [4 /*yield*/, (server === null || server === void 0 ? void 0 : server.close())];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.rm)(root, { recursive: true, force: true })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)('Queue-tea MCP operations', function () {
    (0, vitest_1.it)('exposes all workflows and selects the current task in this folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var names, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client.listTools()];
                case 1:
                    names = (_d.sent()).tools.map(function (t) { return t.name; });
                    (0, vitest_1.expect)(names).toEqual(vitest_1.expect.arrayContaining(['queue_tea', 'brew', 'instant', 'tea', 'steep', 'feature', 'done', 'task_looks_done', 'helper_instructions', 'helper_finished']));
                    _a = vitest_1.expect;
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, call('queue_tea')];
                case 2:
                    _a.apply(void 0, [_c.apply(_b, [(_d.sent()).text]).current.id]).toBe('ours');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('errands return the request and never write queue records', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _i, _a, name_1, result, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)(context.ctx.file, 'utf8')];
                case 1:
                    before = _e.sent();
                    _i = 0, _a = ['brew', 'instant', 'tea'];
                    _e.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    name_1 = _a[_i];
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, call(name_1, { request: 'Explain this code' })];
                case 3:
                    result = _c.apply(_b, [(_e.sent()).text]);
                    (0, vitest_1.expect)(result.request).toBe('Explain this code');
                    (0, vitest_1.expect)(result.instructions).toContain('outside the Queue-tea queue');
                    if (name_1 === 'tea')
                        (0, vitest_1.expect)(result.instructions).toContain('change no files');
                    _e.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(context.ctx.file, 'utf8')];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toBe(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('queues messages under an explicitly selected feature and preserves both active tasks', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, result, filed, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, call('feature', { args: 'New flow' })];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 2:
                    _a.apply(void 0, [(_d.sent()).feature]).toBe('feature');
                    return [4 /*yield*/, call('steep', { message: 'Add a keyboard shortcut', parentId: 'feature' })];
                case 3:
                    result = _d.sent();
                    (0, vitest_1.expect)(result.error).toBe(false);
                    filed = JSON.parse(result.text).task;
                    (0, vitest_1.expect)(filed).toMatchObject({ state: 'queued', parentId: 'feature', messages: ['Add a keyboard shortcut'] });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 4:
                    _b.apply(void 0, [(_d.sent()).tasks.filter(function (t) { return t.state === 'current'; }).map(function (t) { return t.id; })]).toEqual(['other', 'ours']);
                    return [4 /*yield*/, call('feature', { args: 'off' })];
                case 5:
                    _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 6:
                    _c.apply(void 0, [(_d.sent()).feature]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reminds once, records completed helpers idempotently, and requests review without finishing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, _a, record;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, call('task_looks_done', { taskId: 'ours', checked: 'npm test passed' })];
                case 1:
                    first = _b.sent();
                    (0, vitest_1.expect)(first.text).toContain('tea-dd');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).tasks.find(function (t) { return t.id === 'ours'; }).review]).toBe(null);
                    return [4 /*yield*/, call('helper_finished', { taskId: 'ours', helper: 'tea-dd' })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, call('helper_finished', { taskId: 'ours', helper: 'tea-dd' })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, call('done', { taskId: 'ours', checked: 'npm test: 12 passed' })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, read()];
                case 6:
                    record = _b.sent();
                    (0, vitest_1.expect)(record.tasks.find(function (t) { return t.id === 'ours'; })).toMatchObject({ state: 'current', helpers: { ran: ['tea-dd'] }, review: { checked: 'npm test: 12 passed' } });
                    (0, vitest_1.expect)(record.tasks.find(function (t) { return t.id === 'other'; }).review).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects other worktrees, stale task IDs, bad schemas and unreadable records', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, taskId, _b, _c, _d, _e, args, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _i = 0, _a = ['other', 'stale'];
                    _j.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    taskId = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, call('done', { taskId: taskId })];
                case 2:
                    _b.apply(void 0, [(_j.sent()).error]).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, call('helper_finished', { taskId: taskId, helper: 'tea-dd' })];
                case 3:
                    _c.apply(void 0, [(_j.sent()).error]).toBe(true);
                    _j.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    _d = 0, _e = [{ message: ' ' }, { message: 'x', cwd: '/elsewhere' }, { message: 'x', parentId: 'missing' }];
                    _j.label = 6;
                case 6:
                    if (!(_d < _e.length)) return [3 /*break*/, 9];
                    args = _e[_d];
                    _f = vitest_1.expect;
                    return [4 /*yield*/, call('steep', args)];
                case 7:
                    _f.apply(void 0, [(_j.sent()).error]).toBe(true);
                    _j.label = 8;
                case 8:
                    _d++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, (0, promises_1.writeFile)(context.ctx.file, 'broken')];
                case 10:
                    _j.sent();
                    _g = vitest_1.expect;
                    return [4 /*yield*/, call('steep', { message: 'Keep this' })];
                case 11:
                    _g.apply(void 0, [(_j.sent()).error]).toBe(true);
                    _h = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(context.ctx.file, 'utf8')];
                case 12:
                    _h.apply(void 0, [_j.sent()]).toBe('broken');
                    (0, vitest_1.expect)(logs.join('')).toContain('Codex tool failed');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps concurrent record writers through the shared lock', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all(Array.from({ length: 8 }, function (_, i) { return call('steep', { message: "Task ".concat(i) }); }))];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).tasks]).toHaveLength(11);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('loads every shared helper, retaining external skill names without claiming they are installed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, helper, result, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, _a = ['chai-pter', 'commit-chai-n', 'mocha-mockup', 'tea-dd'];
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    helper = _a[_i];
                    return [4 /*yield*/, call('helper_instructions', { helper: helper })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.error).toBe(false);
                    (0, vitest_1.expect)(result.text).toContain('Companion skills:');
                    (0, vitest_1.expect)(result.text).toContain('Report any missing skills');
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _b = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 5:
                    _b.apply(void 0, [(_c.sent()).tasks.find(function (t) { return t.id === 'ours'; }).helpers.ran]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the set_test_profile tool', function () {
    var ours = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, read()];
            case 1: return [2 /*return*/, (_a.sent()).tasks.find(function (t) { return t.id === 'ours'; })];
        }
    }); }); };
    (0, vitest_1.it)("records Tea-DD's pick with its reason on the current task", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, result, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, client.listTools()];
                case 1:
                    _a.apply(void 0, [(_c.sent()).tools.map(function (t) { return t.name; })]).toContain('set_test_profile');
                    return [4 /*yield*/, call('set_test_profile', { taskId: 'ours', profile: 'deep', reason: ' a new tool ' })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)(result.error).toBe(false);
                    (0, vitest_1.expect)(JSON.parse(result.text).text).toBe('Recorded deep on ours. Run the checks it asks for.');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, ours()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).testProfile]).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("leaves Rohan's pick standing, and says so", function () { return __awaiter(void 0, void 0, void 0, function () {
        var record, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, read()];
                case 1:
                    record = _e.sent();
                    return [4 /*yield*/, seed(__assign(__assign({}, record), { tasks: record.tasks.map(function (t) { return (t.id === 'ours' ? __assign(__assign({}, t), { testProfile: { id: 'quick', by: 'rohan' } }) : t); }) }))];
                case 2:
                    _e.sent();
                    _a = vitest_1.expect;
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, call('set_test_profile', { taskId: 'ours', profile: 'release', reason: 'x' })];
                case 3:
                    _a.apply(void 0, [_c.apply(_b, [(_e.sent()).text]).text]).toBe(constants_1.CODEX_TEXT.rohansProfile('quick'));
                    _d = vitest_1.expect;
                    return [4 /*yield*/, ours()];
                case 4:
                    _d.apply(void 0, [(_e.sent()).testProfile]).toEqual({ id: 'quick', by: 'rohan' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses the task current in another worktree, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, read()];
                case 1:
                    before = _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, call('set_test_profile', { taskId: 'other', profile: 'deep', reason: 'x' })];
                case 2:
                    _a.apply(void 0, [(_c.sent()).error]).toBe(true);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toEqual(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a stale task, an unknown profile and a blank or long reason, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _i, _a, args, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, read()];
                case 1:
                    before = _d.sent();
                    _i = 0, _a = [
                        { taskId: 'stale', profile: 'deep', reason: 'x' },
                        { taskId: 'ours', profile: 'huge', reason: 'x' },
                        { taskId: 'ours', profile: 'deep', reason: '   ' },
                        { taskId: 'ours', profile: 'deep', reason: 'x'.repeat(161) },
                        { taskId: 'ours', profile: 'deep' },
                    ];
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    args = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, call('set_test_profile', args)];
                case 3:
                    _b.apply(void 0, [(_d.sent()).error]).toBe(true);
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _c = vitest_1.expect;
                    return [4 /*yield*/, read()];
                case 6:
                    _c.apply(void 0, [_d.sent()]).toEqual(before);
                    return [2 /*return*/];
            }
        });
    }); });
});
