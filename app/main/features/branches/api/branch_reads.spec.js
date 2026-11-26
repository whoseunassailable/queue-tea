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
var vitest_1 = require("vitest");
var logger_1 = require("../../../core/logger");
var scope_1 = require("../../tasks/api/scope");
var branch_source_1 = require("../data/branch_source");
var merge_workspace_1 = require("../data/merge_workspace");
var branch_api_1 = require("./branch_api");
var test_fixtures_1 = require("../../../../renderer/features/branches/test_fixtures");
vitest_1.vi.mock('../../tasks/api/scope', function () { return ({ scopeOf: vitest_1.vi.fn(function (_d, key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ key: key, ctx: { projectPath: '/repo' }, record: { tasks: [{ id: 'one', branch: 'task/one', baseBranch: 'main' }] } })];
    }); }); }) }); });
vitest_1.vi.mock('../data/branch_source', function () { return ({ graphOf: vitest_1.vi.fn(), reviewOf: vitest_1.vi.fn() }); });
vitest_1.vi.mock('../data/merge_workspace', function () { return ({ workspaceOf: vitest_1.vi.fn() }); });
vitest_1.vi.mock('../data/commit_progress', function () { return ({ readCommitProgress: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, null];
    }); }); } }); });
vitest_1.vi.mock('../data/operation_store', function () { return ({ loadOperation: function (_d, _key, id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ id: id })];
    }); }); }, operationsOf: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); } }); });
var pending = function () { var resolve; var promise = new Promise(function (done) { resolve = done; }); return { promise: promise, resolve: resolve }; };
var d = function () { return ({ log: (0, logger_1.createLogger)('dev', function () { }) }); };
(0, vitest_1.beforeEach)(function () { return vitest_1.vi.clearAllMocks(); });
(0, vitest_1.it)('shares only outstanding graph reads, then reads again for a fresh final result', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deps, work, reads, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                deps = d();
                work = pending();
                vitest_1.vi.mocked(branch_source_1.graphOf).mockReturnValue(work.promise);
                reads = Array.from({ length: 30 }, function () { return (0, branch_api_1.readBranches)(deps, 'realm'); });
                return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(branch_source_1.graphOf).toHaveBeenCalledTimes(1); })];
            case 1:
                _c.sent();
                work.resolve({ at: 1 });
                _a = vitest_1.expect;
                return [4 /*yield*/, Promise.all(reads)];
            case 2:
                _a.apply(void 0, [(_c.sent()).every(function (r) { return r.ok && r.data.at === 1; })]).toBe(true);
                vitest_1.vi.mocked(branch_source_1.graphOf).mockResolvedValue({ at: 2 });
                _b = vitest_1.expect;
                return [4 /*yield*/, (0, branch_api_1.readBranches)(deps, 'realm')];
            case 3:
                _b.apply(void 0, [_c.sent()]).toMatchObject({ ok: true, data: { at: 2 } });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shares matching branch and merge reads without conflating realms, destinations or operations', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deps, review, workspace, reads, merges, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                deps = d();
                review = pending();
                workspace = pending();
                vitest_1.vi.mocked(branch_source_1.reviewOf).mockImplementation(function (_d, _scope, _task, target) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = [{}];
                            return [4 /*yield*/, review.promise];
                        case 1: return [2 /*return*/, (__assign.apply(void 0, [__assign.apply(void 0, _a.concat([_b.sent()])), { target: target }]))];
                    }
                }); }); });
                vitest_1.vi.mocked(merge_workspace_1.workspaceOf).mockReturnValue(workspace.promise);
                reads = [(0, branch_api_1.readBranch)(deps, 'realm', 'one', 'main'), (0, branch_api_1.readBranch)(deps, 'realm', 'one', 'main'), (0, branch_api_1.readBranch)(deps, 'realm', 'one', 'stage'), (0, branch_api_1.readBranch)(deps, 'other', 'one', 'main')];
                merges = [(0, branch_api_1.readMergeWorkspace)(deps, 'realm', 'op-1'), (0, branch_api_1.readMergeWorkspace)(deps, 'realm', 'op-1'), (0, branch_api_1.readMergeWorkspace)(deps, 'realm', 'op-2')];
                return [4 /*yield*/, vitest_1.vi.waitFor(function () { (0, vitest_1.expect)(branch_source_1.reviewOf).toHaveBeenCalledTimes(3); (0, vitest_1.expect)(merge_workspace_1.workspaceOf).toHaveBeenCalledTimes(2); })];
            case 1:
                _b.sent();
                review.resolve({});
                workspace.resolve({ checksCurrent: false });
                _a = vitest_1.expect;
                return [4 /*yield*/, Promise.all(reads)];
            case 2:
                _a.apply(void 0, [(_b.sent()).map(function (r) { return r.ok && r.data.target; })]).toEqual(['main', 'main', 'stage', 'main']);
                return [4 /*yield*/, Promise.all(merges)];
            case 3:
                _b.sent();
                (0, vitest_1.expect)(scope_1.scopeOf).toHaveBeenCalledTimes(5);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('releases failed reads for retry and keeps engines separate', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deps, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                deps = d();
                vitest_1.vi.mocked(branch_source_1.graphOf).mockRejectedValueOnce(new Error('disk unavailable'));
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, branch_api_1.readBranches)(deps, 'realm')];
            case 1:
                _a.apply(void 0, [_c.sent()]).toMatchObject({ ok: false });
                vitest_1.vi.mocked(branch_source_1.graphOf).mockResolvedValue({ at: 3 });
                _b = vitest_1.expect;
                return [4 /*yield*/, (0, branch_api_1.readBranches)(deps, 'realm')];
            case 2:
                _b.apply(void 0, [_c.sent()]).toMatchObject({ ok: true });
                return [4 /*yield*/, (0, branch_api_1.readBranches)(d(), 'realm')];
            case 3:
                _c.sent();
                (0, vitest_1.expect)(branch_source_1.graphOf).toHaveBeenCalledTimes(3);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)('Claude\'s proposal in a branch review', function () {
    var PROPOSAL = { message: 'fixed the retry button', files: ['a.ts'], head: test_fixtures_1.SOURCE, at: '2026-11-20T09:00:00+01:00' };
    var CHANGED = [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }];
    var reading = function (record_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([record_1], args_1, true), void 0, function (record, sourceHead) {
            var answer;
            if (sourceHead === void 0) { sourceHead = test_fixtures_1.SOURCE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(scope_1.scopeOf).mockResolvedValueOnce({ key: 'realm', ctx: { projectPath: '/repo' }, record: record });
                        vitest_1.vi.mocked(branch_source_1.reviewOf).mockResolvedValueOnce((0, test_fixtures_1.branchReview)({ sourceHead: sourceHead, files: CHANGED }));
                        return [4 /*yield*/, (0, branch_api_1.readBranch)(d(), 'realm', 'one', 'main')];
                    case 1:
                        answer = _a.sent();
                        if (!answer.ok)
                            throw new Error("should read: ".concat(answer.error.message));
                        return [2 /*return*/, answer.data.proposal];
                }
            });
        });
    };
    var task = function (over) {
        if (over === void 0) { over = {}; }
        return (__assign({ id: 'one', branch: 'task/one', baseBranch: 'main', commitProposal: PROPOSAL }, over));
    };
    (0, vitest_1.it)('carries the proposal in an Assisted realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, reading({ gitMode: 'assisted', tasks: [task()] })];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual(PROPOSAL);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('carries it in a realm whose record is from before Git modes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, reading({ tasks: [task()] })];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual(PROPOSAL);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('carries none in a Manual realm, even with one saved on the task', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, reading({ gitMode: 'manual', tasks: [task()] })];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('carries none when the task has no proposal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, reading({ tasks: [task({ commitProposal: undefined })] })];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('carries none once the branch has a newer commit than the proposal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, reading({ tasks: [task()] }, test_fixtures_1.TARGET)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
