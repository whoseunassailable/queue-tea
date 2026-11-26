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
var vitest_1 = require("vitest");
var branch_source_1 = require("./branch_source");
vitest_1.vi.mock('./observation', function () { return ({ observeTask: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ state: 'paused', steps: [], seenAt: null })];
    }); }); } }); });
vitest_1.vi.mock('../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl', function () { return ({ worktreesRepositoryImpl: function () { return ({ list: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); }); } }); } }); });
(0, vitest_1.it)('bounds Git fanout across a large graph and preserves task order and live values', function () { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, scope, active, peak, count, run, d, first, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tasks = Array.from({ length: 24 }, function (_, n) { return ({ id: "task-".concat(n), title: "Task ".concat(n), branch: "task/".concat(n), baseBranch: 'main', state: 'current', startCommit: 'old' }); });
                scope = { ctx: { projectPath: '/repo' }, record: { tasks: tasks } };
                active = 0;
                peak = 0;
                count = 1;
                run = vitest_1.vi.fn(function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                    var command, stdout;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                active++;
                                peak = Math.max(peak, active);
                                return [4 /*yield*/, new Promise(function (done) { return setImmediate(done); })];
                            case 1:
                                _a.sent();
                                active--;
                                command = argv[2];
                                stdout = command === 'for-each-ref' ? __spreadArray(['main\0base'], tasks.map(function (t) { return "".concat(t.branch, "\0").concat(t.id); }), true).join('\n') : command === 'rev-list' ? String(count) : 'fork';
                                return [2 /*return*/, { exitCode: command === 'merge-base' && argv.includes('--is-ancestor') ? 1 : 0, stdout: stdout, stderr: '' }];
                        }
                    });
                }); });
                d = { host: { run: run }, now: function () { return count; } };
                return [4 /*yield*/, (0, branch_source_1.graphOf)(d, scope)];
            case 1:
                first = _b.sent();
                (0, vitest_1.expect)(peak).toBeLessThanOrEqual(4);
                (0, vitest_1.expect)(first.tasks.map(function (t) { return t.id; })).toEqual(tasks.map(function (t) { return t.id; }));
                (0, vitest_1.expect)(first.tasks.every(function (t) { return t.commits === 1; })).toBe(true);
                count = 2;
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, branch_source_1.graphOf)(d, scope)];
            case 2:
                _a.apply(void 0, [(_b.sent()).tasks.every(function (t) { return t.commits === 2; })]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('drains outstanding task reads after a failure before releasing a graph for retry', function () { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, release, started, held, firstBatch, jobs, startedTasks, run, d, settled, graph;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tasks = Array.from({ length: 12 }, function (_, n) { return ({ id: "task-".concat(n), branch: "task/".concat(n), baseBranch: 'main', state: 'current' }); });
                held = new Promise(function (done) { release = done; });
                firstBatch = new Promise(function (done) { started = done; });
                jobs = 0;
                startedTasks = new Set();
                run = vitest_1.vi.fn(function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (argv.includes('for-each-ref'))
                                    return [2 /*return*/, { exitCode: 0, stdout: __spreadArray(['main\0base'], tasks.map(function (t) { return "".concat(t.branch, "\0").concat(t.id); }), true).join('\n'), stderr: '' }];
                                if (!argv.includes('merge-base')) return [3 /*break*/, 4];
                                startedTasks.add(argv.find(function (arg) { return /^task-/.test(arg); }));
                                jobs++;
                                if (jobs === 4)
                                    started();
                                if (!(jobs === 1)) return [3 /*break*/, 2];
                                return [4 /*yield*/, firstBatch];
                            case 1:
                                _a.sent();
                                throw new Error('disk failed');
                            case 2: return [4 /*yield*/, held];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/, { exitCode: 0, stdout: '', stderr: '' }];
                        }
                    });
                }); });
                d = { host: { run: run }, now: function () { return 1; } };
                settled = false;
                graph = (0, branch_source_1.graphOf)(d, { ctx: { projectPath: '/repo' }, record: { tasks: tasks } }).then(function () { settled = true; }, function () { settled = true; });
                return [4 /*yield*/, firstBatch];
            case 1:
                _a.sent();
                return [4 /*yield*/, new Promise(function (done) { return setImmediate(done); })];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(settled).toBe(false);
                (0, vitest_1.expect)(jobs).toBe(4);
                release();
                return [4 /*yield*/, graph];
            case 3:
                _a.sent();
                (0, vitest_1.expect)(settled).toBe(true);
                (0, vitest_1.expect)(startedTasks.size).toBe(4);
                return [2 /*return*/];
        }
    });
}); });
