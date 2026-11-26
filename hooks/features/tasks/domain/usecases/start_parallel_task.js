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
exports.startParallelTaskUseCase = void 0;
var ranking_1 = require("../../../../shared/backlog/domain/services/ranking");
var branch_rules_1 = require("../../../../shared/git/domain/services/branch_rules");
var time_1 = require("../../../../shared/time/domain/services/time");
var activity_1 = require("../../../../shared/activity/domain/services/activity");
var start_task_1 = require("./start_task");
// The app starts each new quest in its own worktree. Existing checkouts and
// uncommitted work in them do not block another quest or change underneath it.
var startParallelTaskUseCase = function (d, ctx, taskId, platform) { return __awaiter(void 0, void 0, void 0, function () {
    var record, task, _a, base, branches, checkouts, resumed, existing, key, started, _b, claimed, refusal, saved, startedTask, err_1, undone, withActivity, at_1, _c, kinds, steps_1, recorded, err_2;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, d.records.read()];
            case 1:
                record = _e.sent();
                if (record === 'unreadable')
                    return [2 /*return*/, { kind: 'unreadable' }];
                task = record.tasks.find(function (t) { return t.id === taskId; });
                if ((task === null || task === void 0 ? void 0 : task.state) !== 'queued')
                    return [2 /*return*/, { kind: 'gone' }];
                if ((0, ranking_1.isBlocked)(task, record.tasks))
                    return [2 /*return*/, { kind: 'blocked', notice: "".concat(task.title, " is blocked: ").concat((0, ranking_1.blockedText)(task, record.tasks), ". Unblock it first.") }];
                return [4 /*yield*/, d.git.state()];
            case 2:
                if (!(_e.sent()).isRepo)
                    return [2 /*return*/, (0, start_task_1.startTaskUseCase)(d, ctx, taskId, platform)];
                return [4 /*yield*/, Promise.all([d.worktrees.base(), d.git.branches(), d.worktrees.list()])];
            case 3:
                _a = _e.sent(), base = _a[0], branches = _a[1], checkouts = _a[2];
                resumed = task.branch !== null && branches.includes(task.branch);
                existing = resumed ? checkouts.find(function (w) { return w.branch === task.branch; }) : undefined;
                // A legacy task can resume in the project's checkout. Another task there
                // must first release it; no branch is ever checked out over somebody's work.
                if (existing && existing.path !== task.worktreePath && existing.path !== ctx.projectPath) {
                    return [2 /*return*/, { kind: 'held', text: 'This branch is already open in another folder. Open that checkout or put its quest back before trying again.' }];
                }
                key = ctx.file.slice(ctx.file.lastIndexOf('/') + 1).replace(/\.json$/, '');
                _b = time_1.isoLocal;
                return [4 /*yield*/, d.env.now()];
            case 4:
                started = _b.apply(void 0, [_e.sent(), ctx.offsetMinutes]);
                claimed = null;
                refusal = null;
                return [4 /*yield*/, d.records.update(function (r) {
                        var _a, _b, _c, _d;
                        var fresh = r.tasks.find(function (t) { return t.id === taskId; });
                        if ((fresh === null || fresh === void 0 ? void 0 : fresh.state) !== 'queued') {
                            refusal = 'That quest was already started or removed.';
                            return r;
                        }
                        if ((0, ranking_1.isBlocked)(fresh, r.tasks)) {
                            refusal = 'That quest is blocked. Unblock it first.';
                            return r;
                        }
                        var branch = resumed ? task.branch : (0, branch_rules_1.slugBranch)(fresh.title, __spreadArray(__spreadArray([], branches, true), r.tasks.flatMap(function (t) { return t.branch === null ? [] : [t.branch]; }), true));
                        var folder = (_b = (_a = existing === null || existing === void 0 ? void 0 : existing.path) !== null && _a !== void 0 ? _a : fresh.worktreePath) !== null && _b !== void 0 ? _b : "".concat(ctx.home, "/.queue-tea/worktrees/").concat(key, "/").concat(branch.replace(/^task\//, ''));
                        if (r.tasks.some(function (t) { var _a; return t.state === 'current' && ((_a = t.worktreePath) !== null && _a !== void 0 ? _a : ctx.projectPath) === folder; })) {
                            refusal = 'Another quest is already using this checkout. Put it back first.';
                            return r;
                        }
                        claimed = __assign(__assign({}, fresh), { state: 'current', branch: branch, baseBranch: resumed ? (_c = fresh.baseBranch) !== null && _c !== void 0 ? _c : base.branch : base.branch, startCommit: resumed ? fresh.startCommit : base.commit, worktreePath: folder === ctx.projectPath ? null : folder, started: (_d = fresh.started) !== null && _d !== void 0 ? _d : started, review: null, codexSince: platform === 'codex' ? started : null });
                        return __assign(__assign({}, r), { version: 2, playNext: r.playNext === taskId ? null : r.playNext, tasks: r.tasks.map(function (t) { return t.id === taskId ? claimed : t; }) });
                    })];
            case 5:
                saved = _e.sent();
                if (saved === 'unreadable')
                    return [2 /*return*/, { kind: 'unreadable' }];
                if (refusal !== null || claimed === null)
                    return [2 /*return*/, { kind: 'refused', notice: refusal !== null && refusal !== void 0 ? refusal : 'The quest could not be started. Try again.', record: saved }];
                startedTask = claimed;
                _e.label = 6;
            case 6:
                _e.trys.push([6, 9, , 11]);
                if (!(existing === undefined)) return [3 /*break*/, 8];
                return [4 /*yield*/, d.worktrees.create(startedTask.worktreePath, startedTask.branch, base.branch, !resumed)];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8: return [3 /*break*/, 11];
            case 9:
                err_1 = _e.sent();
                d.env.log("making the quest worktree failed: ".concat(err_1 instanceof Error ? (_d = err_1.stack) !== null && _d !== void 0 ? _d : err_1.message : String(err_1)));
                return [4 /*yield*/, d.records.update(function (r) { return (__assign(__assign({}, r), { playNext: record.playNext === taskId && r.playNext === null ? taskId : r.playNext, tasks: r.tasks.map(function (t) { return t.id === taskId && t.worktreePath === startedTask.worktreePath && t.state === 'current' ? __assign(__assign({}, t), { state: 'queued', branch: task.branch, baseBranch: task.baseBranch, startCommit: task.startCommit, worktreePath: task.worktreePath, started: task.started, codexSince: null }) : t; }) })); })];
            case 10:
                undone = _e.sent();
                return [2 /*return*/, { kind: 'branch_failed', text: 'The quest folder could not be created. Check its branch and folder, then try again.', notice: null, record: undone }];
            case 11:
                withActivity = saved;
                _e.label = 12;
            case 12:
                _e.trys.push([12, 16, , 17]);
                _c = time_1.isoLocal;
                return [4 /*yield*/, d.env.now()];
            case 13:
                at_1 = _c.apply(void 0, [_e.sent(), ctx.offsetMinutes]);
                kinds = existing ? [] : __spreadArray(__spreadArray([], (!resumed ? ['branchCreated'] : []), true), ['branchSwitched'], false);
                if (!kinds.length) return [3 /*break*/, 15];
                steps_1 = kinds.map(function (kind) { return ({ id: d.env.newId(), at: at_1, finished: at_1, kind: kind, status: 'succeeded', subject: startedTask.branch }); });
                return [4 /*yield*/, d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return t.id === taskId ? steps_1.reduce(activity_1.keepStep, t) : t; }) })); })];
            case 14:
                recorded = _e.sent();
                if (recorded !== 'unreadable')
                    withActivity = recorded;
                _e.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                err_2 = _e.sent();
                d.env.log("recording worktree activity failed: ".concat(err_2 instanceof Error ? err_2.stack : String(err_2)));
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/, { kind: 'started', task: withActivity.tasks.find(function (t) { return t.id === taskId; }), record: withActivity, notice: task.branch !== null && !resumed ? "".concat(task.branch, " was gone, so this task starts again on ").concat(startedTask.branch, ", made from ").concat(base.branch, ".") : null }];
        }
    });
}); };
exports.startParallelTaskUseCase = startParallelTaskUseCase;
