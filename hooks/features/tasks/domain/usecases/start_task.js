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
exports.startTaskUseCase = void 0;
var ranking_1 = require("../../../../shared/backlog/domain/services/ranking");
var branch_rules_1 = require("../../../../shared/git/domain/services/branch_rules");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var time_1 = require("../../../../shared/time/domain/services/time");
var activity_1 = require("../../../../shared/activity/domain/services/activity");
var NOT_A_REPO = 'Not a git repository, so no branches are made';
// The git check, then the claim, then the branch.
var startTaskUseCase = function (d_1, ctx_1, taskId_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([d_1, ctx_1, taskId_1], args_1, true), void 0, function (d, ctx, taskId, platform) {
        var record, task, git, reason, branch, isResumed, branches, head, _a, started, _b, refused, before, saved, notice, err_1, wasNext_1, verb, undone, undoErr_1, withActivity, at_1, _c, steps_1, recorded, err_2;
        var _d, _e, _f, _g;
        if (platform === void 0) { platform = 'claude'; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, d.records.read()];
                case 1:
                    record = _h.sent();
                    if (record === 'unreadable')
                        return [2 /*return*/, { kind: 'unreadable' }];
                    task = record.tasks.find(function (t) { return t.id === taskId; });
                    if (task === undefined || task.state !== 'queued' || (0, queue_rules_1.currentTask)(record.tasks, ctx) !== null)
                        return [2 /*return*/, { kind: 'gone' }];
                    if (task.worktreePath !== null && task.worktreePath !== ctx.cwd)
                        return [2 /*return*/, { kind: 'held', text: 'This task has its own folder. Open it from Queue-tea to continue there.' }];
                    if ((0, ranking_1.isBlocked)(task, record.tasks)) {
                        return [2 /*return*/, { kind: 'blocked', notice: "".concat(task.title, " is blocked: ").concat((0, ranking_1.blockedText)(task, record.tasks), ". Unblock it first.") }];
                    }
                    return [4 /*yield*/, d.git.state()];
                case 2:
                    git = _h.sent();
                    reason = (0, branch_rules_1.holdReason)(git);
                    if (reason !== null)
                        return [2 /*return*/, { kind: 'held', text: reason }
                            // A task put back in the queue goes on on its own branch; one whose branch
                            // is gone starts again on a new one from here.
                        ];
                    branch = null;
                    isResumed = false;
                    if (!git.isRepo) return [3 /*break*/, 4];
                    return [4 /*yield*/, d.git.branches()];
                case 3:
                    branches = _h.sent();
                    isResumed = task.branch !== null && branches.includes(task.branch);
                    branch = isResumed ? task.branch : (0, branch_rules_1.slugBranch)(task.title, branches);
                    _h.label = 4;
                case 4:
                    if (!(git.isRepo && !isResumed)) return [3 /*break*/, 6];
                    return [4 /*yield*/, d.git.head()];
                case 5:
                    _a = ((_e = (_d = (_h.sent())) === null || _d === void 0 ? void 0 : _d.commit) !== null && _e !== void 0 ? _e : git.head);
                    return [3 /*break*/, 7];
                case 6:
                    _a = null;
                    _h.label = 7;
                case 7:
                    head = _a;
                    _b = time_1.isoLocal;
                    return [4 /*yield*/, d.env.now()];
                case 8:
                    started = _b.apply(void 0, [_h.sent(), ctx.offsetMinutes]);
                    refused = null;
                    before = task;
                    return [4 /*yield*/, d.records.update(function (r) {
                            var fresh = r.tasks.find(function (t) { return t.id === taskId; });
                            var other = (0, queue_rules_1.currentTask)(r.tasks, ctx);
                            refused =
                                fresh === undefined || (fresh.state !== 'queued' && fresh.state !== 'current')
                                    ? "".concat(task.title, " is no longer in the backlog.")
                                    : other !== null
                                        ? other.id === taskId
                                            ? "".concat(task.title, " was started already, maybe in another session.")
                                            : "".concat(other.title, " was started first, maybe in another session, so ").concat(task.title, " waits in the backlog.")
                                        : (0, ranking_1.isBlocked)(fresh, r.tasks)
                                            ? "".concat(task.title, " is blocked: ").concat((0, ranking_1.blockedText)(fresh, r.tasks), ". Unblock it first.")
                                            : null;
                            if (refused !== null || fresh === undefined)
                                return r;
                            before = fresh;
                            return __assign(__assign({}, r), { playNext: r.playNext === taskId ? null : r.playNext, tasks: r.tasks.map(function (t) {
                                    var _a;
                                    return t.id !== taskId
                                        ? t
                                        : __assign(__assign({}, t), { state: 'current', worktreePath: ctx.cwd === ctx.projectPath ? null : ctx.cwd, codexSince: platform === 'codex' ? started : null, started: (_a = t.started) !== null && _a !== void 0 ? _a : started, branch: branch, baseBranch: isResumed ? t.baseBranch : git.isRepo ? git.branch : null, startCommit: isResumed ? t.startCommit : head });
                                }) });
                        })];
                case 9:
                    saved = _h.sent();
                    if (saved === 'unreadable')
                        return [2 /*return*/, { kind: 'unreadable' }];
                    if (refused !== null)
                        return [2 /*return*/, { kind: 'refused', notice: refused, record: saved }];
                    if (branch === null)
                        return [2 /*return*/, { kind: 'started', task: saved.tasks.find(function (t) { return t.id === taskId; }), notice: NOT_A_REPO, record: saved }];
                    notice = task.branch !== null && !isResumed ? "".concat(task.branch, " was gone, so this task starts again on ").concat(branch, ", made from ").concat(git.branch, ".") : null;
                    _h.label = 10;
                case 10:
                    _h.trys.push([10, 15, , 20]);
                    if (!(isResumed && git.branch !== branch)) return [3 /*break*/, 12];
                    return [4 /*yield*/, d.git.switchTo(branch)];
                case 11:
                    _h.sent();
                    return [3 /*break*/, 14];
                case 12:
                    if (!!isResumed) return [3 /*break*/, 14];
                    return [4 /*yield*/, d.git.make(branch)];
                case 13:
                    _h.sent();
                    _h.label = 14;
                case 14: return [3 /*break*/, 20];
                case 15:
                    err_1 = _h.sent();
                    d.env.log("".concat(isResumed ? 'switching to' : 'making', " ").concat(branch, " failed: ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                    wasNext_1 = record.playNext === taskId;
                    verb = isResumed ? 'switch to' : 'make';
                    undone = void 0;
                    _h.label = 16;
                case 16:
                    _h.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, d.records.update(function (r) { return (__assign(__assign({}, r), { playNext: wasNext_1 && r.playNext === null ? taskId : r.playNext, tasks: r.tasks.map(function (t) {
                                return t.id === taskId && t.state === 'current'
                                    ? __assign(__assign({}, t), { state: 'queued', codexSince: null, started: before.started, worktreePath: before.worktreePath, branch: before.branch, baseBranch: before.baseBranch, startCommit: before.startCommit }) : t;
                            }) })); })];
                case 17:
                    undone = _h.sent();
                    return [3 /*break*/, 19];
                case 18:
                    undoErr_1 = _h.sent();
                    // The file keeps the claim, so the task shows as current. Check again
                    // would find it not queued and only clear the line, so it isn't offered.
                    d.env.log("taking back ".concat(task.title, " failed: ").concat(undoErr_1 instanceof Error ? ((_f = undoErr_1.stack) !== null && _f !== void 0 ? _f : undoErr_1.message) : String(undoErr_1)));
                    return [2 /*return*/, { kind: 'refused', notice: "Couldn't ".concat(verb, " the branch ").concat(branch, " or put ").concat(task.title, " back in the queue. Press Back to queue to try again."), record: saved }];
                case 19: return [2 /*return*/, { kind: 'branch_failed', text: "Couldn't ".concat(verb, " the branch ").concat(branch, ". Check again to retry."), notice: notice, record: undone }];
                case 20:
                    withActivity = saved;
                    _h.label = 21;
                case 21:
                    _h.trys.push([21, 25, , 26]);
                    _c = time_1.isoLocal;
                    return [4 /*yield*/, d.env.now()];
                case 22:
                    at_1 = _c.apply(void 0, [_h.sent(), ctx.offsetMinutes]);
                    steps_1 = __spreadArray(__spreadArray([], (!isResumed ? [{ id: d.env.newId(), kind: 'branchCreated' }] : []), true), (!isResumed || git.branch !== branch ? [{ id: d.env.newId(), kind: 'branchSwitched' }] : []), true);
                    if (!(steps_1.length > 0)) return [3 /*break*/, 24];
                    return [4 /*yield*/, d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return t.id !== taskId ? t : steps_1.reduce(function (task, step) { return (0, activity_1.keepStep)(task, __assign(__assign({}, step), { at: at_1, finished: at_1, status: 'succeeded', subject: branch })); }, t); }) })); })];
                case 23:
                    recorded = _h.sent();
                    if (recorded !== 'unreadable')
                        withActivity = recorded;
                    _h.label = 24;
                case 24: return [3 /*break*/, 26];
                case 25:
                    err_2 = _h.sent();
                    d.env.log("recording the branch steps failed: ".concat(err_2 instanceof Error ? ((_g = err_2.stack) !== null && _g !== void 0 ? _g : err_2.message) : String(err_2)));
                    return [3 /*break*/, 26];
                case 26: return [2 /*return*/, { kind: 'started', task: withActivity.tasks.find(function (t) { return t.id === taskId; }), notice: notice, record: withActivity }];
            }
        });
    });
};
exports.startTaskUseCase = startTaskUseCase;
