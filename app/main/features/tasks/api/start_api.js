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
exports.copyText = exports.continueIn = exports.openClaude = exports.startQuest = exports.checkStart = void 0;
var add_request_1 = require("../../../../../hooks/features/tasks/domain/usecases/add_request");
var leave_codex_1 = require("../../../../../hooks/features/tasks/domain/usecases/leave_codex");
var send_to_codex_1 = require("../../../../../hooks/features/tasks/domain/usecases/send_to_codex");
var start_parallel_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/start_parallel_task");
var worktrees_repository_impl_1 = require("../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var ranking_1 = require("../../../../../hooks/shared/backlog/domain/services/ranking");
var checkpoints_1 = require("../../../../../hooks/shared/checkpoints/domain/services/checkpoints");
var description_files_1 = require("../../../../../hooks/shared/records/domain/services/description_files");
var check_now_1 = require("../../../../../hooks/shared/checkpoints/domain/usecases/check_now");
var branch_rules_1 = require("../../../../../hooks/shared/git/domain/services/branch_rules");
var queue_rules_1 = require("../../../../../hooks/shared/records/domain/services/queue_rules");
var constants_1 = require("../../../core/constants");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var claude_code_1 = require("../data/claude_code");
var hold_1 = require("../domain/hold");
var task_input_1 = require("../domain/task_input");
var scope_1 = require("./scope");
// A folder that has moved answers git like one that was never a repository,
// and Start would claim the quest with no branch.
var needFolder = function (d, scope) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d.host.exists(scope.ctx.cwd)];
            case 1:
                if (!(_a.sent()))
                    throw new reply_1.Refusal(messages_1.MESSAGES.folderGone(scope.ctx.cwd));
                return [2 /*return*/];
        }
    });
}); };
var holdOf = function (scope, git, reason) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    var _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _b = {
                    kind: (0, hold_1.holdKindOf)(git),
                    reason: reason,
                    branch: git.branch,
                    head: git.head
                };
                if (!(git.uncommitted > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, scope.deps.git.facts()];
            case 1:
                _a = ((_d = (_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.uncommitted) !== null && _d !== void 0 ? _d : []);
                return [3 /*break*/, 3];
            case 2:
                _a = [];
                _e.label = 3;
            case 3: return [2 /*return*/, (_b.files = _a,
                    _b.fileCount = git.uncommitted,
                    _b.command = (0, hold_1.holdCommandOf)(git),
                    _b)];
        }
    });
}); };
var stepOf = function (d, scope, task, git) { return __awaiter(void 0, void 0, void 0, function () {
    var branches;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!git.isRepo)
                    return [2 /*return*/, { kind: 'noRepo' }];
                return [4 /*yield*/, scope.deps.git.branches()];
            case 1:
                branches = _b.sent();
                if (task.branch !== null && branches.includes(task.branch))
                    return [2 /*return*/, { kind: 'switch', branch: task.branch }];
                _a = { kind: 'make', branch: (0, branch_rules_1.slugBranch)(task.title, branches) };
                return [4 /*yield*/, (0, worktrees_repository_impl_1.worktreesRepositoryImpl)(d.host, scope.ctx.projectPath).base()];
            case 2: return [2 /*return*/, (_a.from = (_b.sent()).branch, _a)];
        }
    });
}); };
var goneSentence = function (record, taskId) {
    var other = (0, queue_rules_1.currentTask)(record.tasks);
    var task = record.tasks.find(function (t) { return t.id === taskId; });
    return other === null || task === undefined || other.id === taskId ? messages_1.MESSAGES.questGone : messages_1.MESSAGES.startedFirst(other.title, task.title);
};
// What Start would do, changing nothing: the hold, or the step to name while
// it runs. Check again is this call again.
var checkStart = function (d, key, taskId) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.checkStart, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, tasks, task, git, reason, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    scope = _d.sent();
                    return [4 /*yield*/, needFolder(d, scope)];
                case 2:
                    _d.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    tasks = scope.record.tasks;
                    task = tasks.find(function (t) { return t.id === id; });
                    if (task === undefined || task.state !== 'queued')
                        throw new reply_1.Refusal(goneSentence(scope.record, id));
                    if ((0, ranking_1.isBlocked)(task, tasks))
                        throw new reply_1.Refusal(messages_1.MESSAGES.sealedQuest(task.title, (0, ranking_1.blockedText)(task, tasks)));
                    return [4 /*yield*/, scope.deps.git.state()];
                case 3:
                    git = _d.sent();
                    reason = git.isRepo ? null : (0, branch_rules_1.holdReason)(git);
                    if (!(reason === null)) return [3 /*break*/, 5];
                    _b = { kind: 'clear' };
                    return [4 /*yield*/, stepOf(d, scope, task, git)];
                case 4:
                    _a = (_b.step = _d.sent(), _b);
                    return [3 /*break*/, 7];
                case 5:
                    _c = { kind: 'held' };
                    return [4 /*yield*/, holdOf(scope, git, reason)];
                case 6:
                    _a = (_c.hold = _d.sent(), _c);
                    _d.label = 7;
                case 7: return [2 /*return*/, _a];
            }
        });
    }); });
};
exports.checkStart = checkStart;
// The session gets the quest through the record, and a session opened now finds
// the request waiting there. The quest has started by this point, so a request
// that fails to save only means Continue in the terminal.
var handOver = function (d, scope, taskId, started) { return __awaiter(void 0, void 0, void 0, function () {
    var isOpen, record, asked, err_1, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, scope_1.isSessionOpen)(d, scope.ctx.cwd)];
            case 1:
                isOpen = _c.sent();
                record = started;
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, add_request_1.addRequestUseCase)(scope.deps, scope.ctx, 'begin', taskId)];
            case 3:
                asked = _c.sent();
                if (asked !== 'unreadable')
                    record = asked;
                return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                d.log.error('asking a session to begin failed', err_1);
                return [3 /*break*/, 5];
            case 5:
                _b = { record: record };
                if (!isOpen) return [3 /*break*/, 6];
                _a = { kind: 'session' };
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, (0, claude_code_1.openClaudeCode)(d, scope.ctx.cwd, false)];
            case 7:
                _a = _c.sent();
                _c.label = 8;
            case 8: return [2 /*return*/, (_b.handover = _a, _b)];
        }
    });
}); };
// Codex opens with the brief; no session is asked, since Claude Code isn't on it.
var toCodex = function (d, scope, task) { return __awaiter(void 0, void 0, void 0, function () {
    var checked;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, check_now_1.checkNowUseCase)(scope.deps.git, function (text) { return d.log.debug(text); }, task)];
            case 1:
                checked = _a.sent();
                return [2 /*return*/, (0, claude_code_1.openCodex)(d, scope.ctx.cwd, task.id, (0, checkpoints_1.codexBrief)(task, scope.ctx.cwd, checked, (0, description_files_1.notesFolderOf)(scope.ctx)))];
        }
    });
}); };
var startQuest = function (d, key, taskId, platform) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.startQuest, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, on, result, _a, _b, git, startedScope, _c, record, handover, _d, latest;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    scope = _h.sent();
                    return [4 /*yield*/, needFolder(d, scope)];
                case 2:
                    _h.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    on = (0, task_input_1.platformOf)(platform);
                    return [4 /*yield*/, (0, start_parallel_task_1.startParallelTaskUseCase)(__assign(__assign({}, scope.deps), { worktrees: (0, worktrees_repository_impl_1.worktreesRepositoryImpl)(d.host, scope.ctx.projectPath) }), scope.ctx, id, on)];
                case 3:
                    result = _h.sent();
                    if (result.kind === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    if (result.kind === 'gone')
                        throw new reply_1.Refusal(goneSentence(scope.record, id));
                    if (result.kind === 'blocked' || result.kind === 'refused')
                        throw new reply_1.Refusal((0, messages_1.inGameWords)(result.notice));
                    if (!(result.kind === 'held')) return [3 /*break*/, 6];
                    _e = { kind: 'held' };
                    _a = holdOf;
                    _b = [scope];
                    return [4 /*yield*/, scope.deps.git.state()];
                case 4: return [4 /*yield*/, _a.apply(void 0, _b.concat([_h.sent(), result.text]))];
                case 5: return [2 /*return*/, (_e.hold = _h.sent(), _e)];
                case 6:
                    if (!(result.kind === 'branch_failed')) return [3 /*break*/, 8];
                    return [4 /*yield*/, scope.deps.git.state()];
                case 7:
                    git = _h.sent();
                    return [2 /*return*/, { kind: 'held', hold: { kind: 'branch', reason: result.text, branch: git.branch, head: git.head, files: [], fileCount: 0, command: null } }];
                case 8: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, id)];
                case 9:
                    startedScope = _h.sent();
                    if (!(on === 'codex')) return [3 /*break*/, 11];
                    _f = { record: result.record };
                    return [4 /*yield*/, toCodex(d, startedScope, result.task)];
                case 10:
                    _d = (_f.handover = _h.sent(), _f);
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, handOver(d, startedScope, id, result.record)];
                case 12:
                    _d = _h.sent();
                    _h.label = 13;
                case 13:
                    _c = _d, record = _c.record, handover = _c.handover;
                    return [4 /*yield*/, scope.deps.records.read()];
                case 14:
                    latest = _h.sent();
                    _g = {
                        kind: 'started'
                    };
                    return [4 /*yield*/, (0, scope_1.realmView)(d, scope.key, latest === 'unreadable' ? record : latest)];
                case 15: return [2 /*return*/, (_g.view = _h.sent(),
                        _g.branch = result.task.branch,
                        _g.notice = result.notice === null ? null : (0, messages_1.inGameWords)(result.notice),
                        _g.handover = handover,
                        _g)];
            }
        });
    }); });
};
exports.startQuest = startQuest;
// A quest with Codex only brings its terminal forward: Codex can't be found
// running from here, and a second one must not start.
var openClaude = function (d, key, taskId) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.openClaude, function () { return __awaiter(void 0, void 0, void 0, function () {
        var initial, task, selected, ctx, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    initial = _d.sent();
                    task = taskId === undefined ? (0, queue_rules_1.currentTask)(initial.record.tasks) : (_c = initial.record.tasks.find(function (t) { return t.id === (0, task_input_1.questIdOf)(taskId); })) !== null && _c !== void 0 ? _c : null;
                    if (taskId !== undefined && (task === null || task === void 0 ? void 0 : task.state) !== 'current')
                        throw new reply_1.Refusal(messages_1.MESSAGES.notActiveMove);
                    return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, task === null || task === void 0 ? void 0 : task.id)];
                case 2:
                    selected = _d.sent();
                    return [4 /*yield*/, needFolder(d, selected)];
                case 3:
                    _d.sent();
                    ctx = selected.ctx;
                    if (task !== null && task.codexSince !== null)
                        return [2 /*return*/, (0, claude_code_1.focusCodex)(d, ctx.cwd, (0, checkpoints_1.codexBrief)(task, ctx.cwd, null, (0, description_files_1.notesFolderOf)(ctx)))];
                    _a = claude_code_1.openClaudeCode;
                    _b = [d, ctx.cwd];
                    return [4 /*yield*/, (0, scope_1.isSessionOpen)(d, ctx.cwd)];
                case 4: return [2 /*return*/, _a.apply(void 0, _b.concat([_d.sent()]))];
            }
        });
    }); });
};
exports.openClaude = openClaude;
var isClaudeWorking = function (d, scope) { return __awaiter(void 0, void 0, void 0, function () {
    var sessions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
            case 1:
                sessions = _a.sent();
                return [2 /*return*/, sessions.some(function (s) { var _a; return ((_a = s.workingPath) !== null && _a !== void 0 ? _a : s.projectPath) === scope.ctx.cwd && (0, session_rules_1.isFresh)(s, d.now()) && s.isTurnRunning; })];
        }
    });
}); };
// The quest in hand moves to Codex, refused while Claude Code's turn runs so
// the two never work at once; or comes back to Claude Code with its time on
// Codex, handed over the way Start hands it.
var continueIn = function (d, key, taskId, platform) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.continueIn, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, to, task, saved, isCodexTimeLost, back, _a, record, handover;
        var _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, taskId)];
                case 1:
                    scope = _e.sent();
                    return [4 /*yield*/, needFolder(d, scope)];
                case 2:
                    _e.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    to = (0, task_input_1.platformOf)(platform);
                    task = scope.record.tasks.find(function (t) { return t.id === id; });
                    if ((task === null || task === void 0 ? void 0 : task.state) !== 'current')
                        throw new reply_1.Refusal(messages_1.MESSAGES.notActiveMove);
                    if (!(to === 'codex')) return [3 /*break*/, 7];
                    return [4 /*yield*/, isClaudeWorking(d, scope)];
                case 3:
                    if (_e.sent())
                        throw new reply_1.Refusal(messages_1.MESSAGES.claudeWorking(task.title));
                    return [4 /*yield*/, (0, send_to_codex_1.sendToCodexUseCase)(scope.deps, scope.ctx, id)];
                case 4:
                    saved = _e.sent();
                    if (saved === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    _b = {};
                    return [4 /*yield*/, (0, scope_1.realmView)(d, scope.key, saved)];
                case 5:
                    _b.view = _e.sent();
                    return [4 /*yield*/, toCodex(d, scope, (_d = saved.tasks.find(function (t) { return t.id === id; })) !== null && _d !== void 0 ? _d : task)];
                case 6: return [2 /*return*/, (_b.handover = _e.sent(), _b.isCodexTimeLost = false, _b)];
                case 7: return [4 /*yield*/, (0, leave_codex_1.leaveCodexUseCase)(scope.deps, scope.ctx, id)];
                case 8:
                    isCodexTimeLost = _e.sent();
                    return [4 /*yield*/, scope.deps.records.read()];
                case 9:
                    back = _e.sent();
                    if (back === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    return [4 /*yield*/, handOver(d, scope, id, back)];
                case 10:
                    _a = _e.sent(), record = _a.record, handover = _a.handover;
                    _c = {};
                    return [4 /*yield*/, (0, scope_1.realmView)(d, scope.key, record)];
                case 11: return [2 /*return*/, (_c.view = _e.sent(), _c.handover = handover, _c.isCodexTimeLost = isCodexTimeLost, _c)];
            }
        });
    }); });
};
exports.continueIn = continueIn;
var copyText = function (d, text) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.copyText, function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (typeof text !== 'string' || text === '' || text.length > constants_1.COPY_LIMIT)
                throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
            d.copy(text);
            return [2 /*return*/, null];
        });
    }); });
};
exports.copyText = copyText;
