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
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var messages_1 = require("../../../core/messages");
var node_host_1 = require("../../../core/node_host");
var stream_process_1 = require("../../../core/stream_process");
var test_fixtures_1 = require("../../../../renderer/features/branches/test_fixtures");
var fixtures_1 = require("../../tasks/api/fixtures");
var helper_stream_1 = require("../domain/helper_stream");
var helpers_api_1 = require("./helpers_api");
var KEY = 'demo-abc123';
var NOW = Date.parse('2026-11-06T09:00:00Z');
var line = function (event) { return "".concat(JSON.stringify(event), "\n"); };
var INIT = line({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:tea-dd', 'queue-tea:chai-pter'] });
var READ = line({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: '/x/timer.ts' } }] } });
var DONE = line({ type: 'result', subtype: 'success', is_error: false, result: 'Added three tests.' });
var ran = function (exitCode, stderr) {
    if (stderr === void 0) { stderr = ''; }
    return ({ exitCode: exitCode, stdout: '', stderr: stderr });
};
var home;
var folder;
var told;
var requests;
var script;
var api;
var last = function () { var _a; return (_a = told[told.length - 1]) !== null && _a !== void 0 ? _a : []; };
var jobOf = function (helper) { return last().find(function (job) { return job.helper === helper; }); };
var seed = function (tasks) {
    if (tasks === void 0) { tasks = [(0, fixtures_1.makeTask)({ id: 'a' })]; }
    return (0, promises_1.writeFile)("".concat(home, "/.queue-tea/projects/").concat(KEY, ".json"), JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', folder)), { tasks: tasks })));
};
var data = function (reply) {
    if (!reply.ok)
        throw new Error(reply.error.message);
    return reply.data;
};
// A run that waits until it is stopped, as a long order would. Like the real
// one, it ends at once when the stop came first.
var untilStopped = function (request) {
    return new Promise(function (done) {
        if (request.signal.aborted)
            done(ran(130));
        else
            request.signal.addEventListener('abort', function () { return done(ran(130)); }, { once: true });
    });
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var log, stream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-helpers-'))];
            case 1:
                home = _a.sent();
                folder = (0, node_path_1.join)(home, 'demo');
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(folder)];
            case 3:
                _a.sent();
                return [4 /*yield*/, seed()];
            case 4:
                _a.sent();
                told = [];
                requests = [];
                script = function (_, out) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        out(INIT + READ.slice(0, 20));
                        out(READ.slice(20) + DONE);
                        return [2 /*return*/, ran(0)];
                    });
                }); };
                log = (0, logger_1.createLogger)('dev', function () { });
                stream = (function (_log, request, out) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        requests.push(request);
                        return [2 /*return*/, script(request, out !== null && out !== void 0 ? out : (function () { }))];
                    });
                }); });
                api = (0, helpers_api_1.helpersApi)({ host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ran(0)];
                    }); }); }), home: home, now: function () { return NOW; }, log: log, offsetMinutes: function () { return 60; }, newId: function () { return 't-new'; }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); }, copy: function () { }, stream: stream, tell: function (jobs) { return told.push(jobs); } });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
// A real shell starts slowly while the whole suite runs.
var REAL_WAIT = { timeout: 5000 };
(0, vitest_1.describe)('sending a helper an order', function () {
    (0, vitest_1.it)('runs Claude Code as that helper in the realm, and keeps the window told', function () { return __awaiter(void 0, void 0, void 0, function () {
        var job, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', '  Write tests for the timer  ')];
                case 1:
                    job = _a.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(job).toMatchObject({ helper: 'tea-dd', realm: KEY, folder: folder, order: 'Write tests for the timer', status: 'working' });
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { var _a; return (0, vitest_1.expect)((_a = jobOf('tea-dd')) === null || _a === void 0 ? void 0 : _a.status).toBe('done'); })];
                case 2:
                    _d.sent();
                    (0, vitest_1.expect)(requests[0]).toMatchObject({ cwd: folder, argv: ['claude', '-p', '--agent', 'queue-tea:tea-dd', '--output-format', 'stream-json', '--verbose', '--', 'Write tests for the timer'] });
                    (0, vitest_1.expect)(told.some(function (jobs) { var _a, _b; return ((_b = (_a = jobs[0]) === null || _a === void 0 ? void 0 : _a.doing) === null || _b === void 0 ? void 0 : _b.target) === 'timer.ts'; })).toBe(true);
                    (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ reply: 'Added three tests.', steps: 1, doing: null, finished: NOW });
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.readHelpers()];
                case 3:
                    _b.apply(void 0, [_c.apply(void 0, [_d.sent()])]).toEqual(last());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('works in the worktree of the quest under way', function () { return __awaiter(void 0, void 0, void 0, function () {
        var worktree, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    worktree = (0, node_path_1.join)(home, 'demo-wt');
                    return [4 /*yield*/, (0, promises_1.mkdir)(worktree)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed([(0, fixtures_1.makeTask)({ id: 'a', state: 'current', worktreePath: worktree })])];
                case 2:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 3:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { var _a; return (0, vitest_1.expect)((_a = requests[0]) === null || _a === void 0 ? void 0 : _a.cwd).toBe(worktree); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes one order at a time per helper, while the others stay free', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    script = untilStopped;
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'First')];
                case 1:
                    _a.apply(void 0, [_f.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Second')];
                case 2:
                    _b.apply(void 0, [_f.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.helperBusy } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper(KEY, 'chai-pter', 'Write it up')];
                case 3:
                    _c.apply(void 0, [(_f.sent()).ok]).toBe(true);
                    (0, vitest_1.expect)(api.isBusy()).toBe(true);
                    _d = data;
                    return [4 /*yield*/, api.stopHelper('tea-dd')];
                case 4:
                    _d.apply(void 0, [_f.sent()]);
                    _e = data;
                    return [4 /*yield*/, api.stopHelper('chai-pter')];
                case 5:
                    _e.apply(void 0, [_f.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(api.isBusy()).toBe(false); })];
                case 6:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts one run when two sends for the same helper land at once', function () { return __awaiter(void 0, void 0, void 0, function () {
        var both, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    script = untilStopped;
                    return [4 /*yield*/, Promise.all([api.sendHelper(KEY, 'tea-dd', 'First'), api.sendHelper(KEY, 'tea-dd', 'Second')])];
                case 1:
                    both = _b.sent();
                    (0, vitest_1.expect)(both.filter(function (answer) { return answer.ok; })).toHaveLength(1);
                    (0, vitest_1.expect)(both).toContainEqual({ ok: false, error: { message: messages_1.MESSAGES.helperBusy } });
                    (0, vitest_1.expect)(requests).toHaveLength(1);
                    _a = data;
                    return [4 /*yield*/, api.stopHelper('tea-dd')];
                case 2:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(api.isBusy()).toBe(false); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts a step for each tool, not for thinking', function () { return __awaiter(void 0, void 0, void 0, function () {
        var think, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    think = line({ type: 'assistant', message: { content: [{ type: 'text', text: 'Let me look.' }] } });
                    script = function (_, out) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            out(INIT + think + READ + think + READ + DONE);
                            return [2 /*return*/, ran(0)];
                        });
                    }); };
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'done', steps: 2 }); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(told.some(function (jobs) { var _a, _b; return ((_b = (_a = jobs[0]) === null || _a === void 0 ? void 0 : _a.doing) === null || _b === void 0 ? void 0 : _b.kind) === 'thinking'; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('fails plainly when the run ends without an answer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    script = function (_, out) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            out(INIT + READ);
                            return [2 /*return*/, ran(0)];
                        });
                    }); };
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: messages_1.MESSAGES.helperFailed, doing: null, finished: NOW }); })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stops when told to', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    script = untilStopped;
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'A long one')];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.stopHelper('tea-dd')];
                case 2:
                    _b.apply(void 0, [_c.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { var _a; return (0, vitest_1.expect)((_a = jobOf('tea-dd')) === null || _a === void 0 ? void 0 : _a.status).toBe('stopped'); })];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stops and says so when Claude Code doesn't have the helper", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    script = function (request, out) {
                        out(line({ type: 'system', subtype: 'init', agents: ['claude'] }));
                        return untilStopped(request);
                    };
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: messages_1.MESSAGES.helperMissing }); })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("says Claude Code couldn't be found", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    script = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ran(1, 'spawn claude ENOENT')];
                    }); }); };
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: messages_1.MESSAGES.helperNoClaude }); })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says an order that ran out of time was stopped', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    script = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ran(130)];
                    }); }); };
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: messages_1.MESSAGES.helperTimedOut(helper_stream_1.HELPER_LIMITS.runMinutes) }); })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('fails plainly when the run ends in an error', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    script = function (_, out) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            out(INIT + line({ type: 'result', subtype: 'error_during_execution', is_error: true }));
                            return [2 /*return*/, ran(1)];
                        });
                    }); };
                    _a = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: messages_1.MESSAGES.helperFailed }); })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('sending a helper to resolve a merge', function () {
    var OP = '12345678-1234-1234-1234-123456789abc';
    var integration = function () { return (0, node_path_1.join)(home, '.queue-tea/integrations', KEY); };
    var prepare = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (stage) {
            if (stage === void 0) { stage = 'conflicts'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(integration(), OP, 'worktree'), { recursive: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(integration(), "".concat(OP, ".json")), JSON.stringify((0, test_fixtures_1.mergeOperation)({ key: KEY, id: OP, stage: stage, source: 'task/guild', target: 'main' })))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    (0, vitest_1.it)("runs the helper in that merge's own folder with the Tea-concile order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var job, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.concileMerge(KEY, 'chai-pter', OP)];
                case 2:
                    job = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(job).toMatchObject({ helper: 'chai-pter', realm: KEY, merge: OP, folder: (0, node_path_1.join)(integration(), OP, 'worktree'), status: 'working' });
                    (0, vitest_1.expect)(job.order).toContain('queue-tea:tea-concile');
                    (0, vitest_1.expect)(job.order).toContain('task/guild into main');
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { var _a; return (0, vitest_1.expect)((_a = jobOf('chai-pter')) === null || _a === void 0 ? void 0 : _a.status).toBe('done'); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(requests[0]).toMatchObject({ cwd: (0, node_path_1.join)(integration(), OP, 'worktree') });
                    (0, vitest_1.expect)((_b = requests[0]) === null || _b === void 0 ? void 0 : _b.argv.slice(0, 4)).toEqual(['claude', '-p', '--agent', 'queue-tea:chai-pter']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a merge with no conflicts left, one it cannot find, and a busy helper', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, prepare('ready')];
                case 1:
                    _g.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.concileMerge(KEY, 'tea-dd', OP)];
                case 2:
                    _a.apply(void 0, [_g.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.helperNoConflicts } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.concileMerge(KEY, 'tea-dd', '../escape')];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toMatchObject({ ok: false });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, api.concileMerge(KEY, 'not-one', OP)];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.badValue } });
                    return [4 /*yield*/, prepare()];
                case 5:
                    _g.sent();
                    script = untilStopped;
                    _d = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 6:
                    _d.apply(void 0, [_g.sent()]);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, api.concileMerge(KEY, 'tea-dd', OP)];
                case 7:
                    _e.apply(void 0, [_g.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.helperBusy } });
                    _f = data;
                    return [4 /*yield*/, api.stopHelper('tea-dd')];
                case 8:
                    _f.apply(void 0, [_g.sent()]);
                    (0, vitest_1.expect)(requests).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an order from the Guild Hall belongs to no merge', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).merge]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('what it refuses', function () {
    (0, vitest_1.it)('a helper that is not one, or an order that is empty or too long', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper(KEY, 'barista', 'Hi')];
                case 1:
                    _a.apply(void 0, [_e.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.badValue } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', '   ')];
                case 2:
                    _b.apply(void 0, [_e.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.helperOrderEmpty } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'x'.repeat(helper_stream_1.HELPER_LIMITS.orderChars + 1))];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.helperOrderLong(helper_stream_1.HELPER_LIMITS.orderChars) } });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, api.stopHelper('barista')];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.badValue } });
                    (0, vitest_1.expect)(requests).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a realm it does not know, or one whose folder has gone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper('nope-000000', 'tea-dd', 'Hi')];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.unknownProject } });
                    return [4 /*yield*/, (0, promises_1.rm)(folder, { recursive: true })];
                case 2:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Hi')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.folderGone(folder) } });
                    (0, vitest_1.expect)(requests).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a realm whose record cannot be read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)("".concat(home, "/.queue-tea/projects/").concat(KEY, ".json"), '{ not json')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.sendHelper(KEY, 'tea-dd', 'Hi')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: messages_1.MESSAGES.unreadableRealm } });
                    (0, vitest_1.expect)(requests).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
// The same API over a real process: a stand-in claude, found first on the
// path, so no test spends tokens.
(0, vitest_1.describe)('with a real process', function () {
    var plant = function (body) { return __awaiter(void 0, void 0, void 0, function () {
        var bin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bin = (0, node_path_1.join)(home, '.local/bin');
                    return [4 /*yield*/, (0, promises_1.mkdir)(bin, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(bin, 'claude'), "#!/bin/sh\n".concat(body, "\n"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(bin, 'claude'), 493)
                        // Only the planted bin and the system folders, never a real claude.
                    ];
                case 3:
                    _a.sent();
                    // Only the planted bin and the system folders, never a real claude.
                    vitest_1.vi.stubEnv('PATH', '');
                    return [2 /*return*/];
            }
        });
    }); };
    var say = function (event) { return "printf '%s\\n' '".concat(JSON.stringify(event), "'"); };
    var real = function () {
        var log = (0, logger_1.createLogger)('dev', function () { });
        return (0, helpers_api_1.helpersApi)({ host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ran(0)];
            }); }); }), home: home, now: function () { return NOW; }, log: log, offsetMinutes: function () { return 60; }, newId: function () { return 't-new'; }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, 'terminal'];
            }); }); }, copy: function () { }, stream: stream_process_1.streamProcess, tell: function (jobs) { return told.push(jobs); } });
    };
    (0, vitest_1.afterEach)(function () { return vitest_1.vi.unstubAllEnvs(); });
    (0, vitest_1.it)('stops an order before its first step', function () { return __awaiter(void 0, void 0, void 0, function () {
        var helpers, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, plant('sleep 20')];
                case 1:
                    _c.sent();
                    helpers = real();
                    _a = data;
                    return [4 /*yield*/, helpers.sendHelper(KEY, 'tea-dd', 'A long one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = data;
                    return [4 /*yield*/, helpers.stopHelper('tea-dd')];
                case 3:
                    _b.apply(void 0, [_c.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'stopped', steps: 0, doing: null }); }, REAL_WAIT)];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a line it cannot read does not end the order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var helpers, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, plant([
                        say({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:tea-dd'] }),
                        say({ type: 'assistant', message: { content: [null] } }),
                        'sleep 0.3',
                        say({ type: 'result', subtype: 'success', is_error: false, result: 'Added three tests.' }),
                    ].join('\n'))];
                case 1:
                    _b.sent();
                    helpers = real();
                    _a = data;
                    return [4 /*yield*/, helpers.sendHelper(KEY, 'tea-dd', 'Test it')];
                case 2:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { var _a; return (0, vitest_1.expect)((_a = jobOf('tea-dd')) === null || _a === void 0 ? void 0 : _a.status).not.toBe('working'); }, REAL_WAIT)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(jobOf('tea-dd')).toMatchObject({ status: 'done', reply: 'Added three tests.', error: null });
                    return [2 /*return*/];
            }
        });
    }); });
});
