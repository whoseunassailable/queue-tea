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
exports.openMergeFolder = exports.abandonMerge = exports.completeMerge = exports.resolveMergeFile = exports.prepareMerge = exports.readMergeWorkspace = exports.readBranch = exports.readBranches = exports.runStep = exports.freshReview = exports.messageOf = exports.taskOf = exports.requestOf = void 0;
var node_crypto_1 = require("node:crypto");
var worktrees_repository_impl_1 = require("../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl");
var reply_1 = require("../../../core/reply");
var task_input_1 = require("../../tasks/domain/task_input");
var scope_1 = require("../../tasks/api/scope");
var constants_1 = require("../domain/constants");
var git_rules_1 = require("../domain/git_rules");
var git_mode_1 = require("../../../../../hooks/shared/records/domain/services/git_mode");
var branch_source_1 = require("../data/branch_source");
var checks_source_1 = require("../data/checks_source");
var merge_workspace_1 = require("../data/merge_workspace");
var operation_store_1 = require("../data/operation_store");
var user_git_1 = require("../data/user_git");
var commit_progress_1 = require("../data/commit_progress");
var live_output_1 = require("../data/live_output");
var pending_reads_1 = require("../data/pending_reads");
var space_api_1 = require("./space_api");
var requestOf = function (input) {
    var r = input;
    if (!r || !(0, git_rules_1.isBranch)(r.target) || typeof r.fingerprint !== 'string')
        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
    return { taskId: (0, task_input_1.questIdOf)(r.taskId), target: r.target, fingerprint: r.fingerprint, idleConfirmed: r.idleConfirmed === true };
};
exports.requestOf = requestOf;
var taskOf = function (scope, id) {
    var task = scope.record.tasks.find(function (t) { return t.id === (0, task_input_1.questIdOf)(id); });
    if (!(task === null || task === void 0 ? void 0 : task.branch))
        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.missing);
    return task;
};
exports.taskOf = taskOf;
var messageOf = function (input) {
    if (typeof input !== 'string' || !input.trim() || input.length > constants_1.BRANCH_LIMITS.message || input.includes('\0'))
        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.message);
    return input.trim();
};
exports.messageOf = messageOf;
var freshReview = function (d_1, scope_2, request_1) {
    var args_1 = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args_1[_i - 3] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([d_1, scope_2, request_1], args_1, true), void 0, function (d, scope, request, allowDirty) {
        var review;
        if (allowDirty === void 0) { allowDirty = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!request.idleConfirmed)
                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.idle);
                    return [4 /*yield*/, (0, branch_source_1.reviewOf)(d, scope, (0, exports.taskOf)(scope, request.taskId), request.target)];
                case 1:
                    review = _a.sent();
                    if (review.fingerprint !== request.fingerprint)
                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                    if (review.blocked && !(allowDirty && (review.blocked === constants_1.BRANCH_TEXT.dirty || review.blocked === constants_1.BRANCH_TEXT.noMerge)))
                        throw new reply_1.Refusal(review.blocked);
                    return [2 /*return*/, review];
            }
        });
    });
};
exports.freshReview = freshReview;
var runStep = function (d, op, cwd, action) { return __awaiter(void 0, void 0, void 0, function () {
    var event, index, stream, result, err_1, streamed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event = { at: d.now(), command: "git ".concat((0, user_git_1.argvOf)(action).map(function (a) { return /\s/.test(a) ? JSON.stringify(a) : a; }).join(' ')), status: 'running', output: '' };
                op.events.push(event);
                return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
            case 1:
                _a.sent();
                index = op.events.length - 1;
                stream = (0, live_output_1.liveOutput)(function (output, truncated) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                op.events[index] = __assign(__assign({}, event), { output: output, truncated: truncated });
                                return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, 7, 9]);
                return [4 /*yield*/, d.userGit(cwd, action, stream.append)];
            case 3:
                result = _a.sent();
                return [3 /*break*/, 9];
            case 4:
                err_1 = _a.sent();
                return [4 /*yield*/, stream.flush()];
            case 5:
                _a.sent();
                op.events[index] = __assign(__assign({}, op.events[index]), { status: 'failed', finished: d.now() });
                return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
            case 6:
                _a.sent();
                throw err_1;
            case 7: return [4 /*yield*/, stream.flush()];
            case 8:
                _a.sent();
                return [7 /*endfinally*/];
            case 9:
                streamed = op.events[index];
                op.events[index] = __assign(__assign({}, streamed), { finished: d.now(), exitCode: result.exitCode, status: result.exitCode === 0 ? 'succeeded' : 'failed', output: streamed.output || (result.stdout + result.stderr).slice(-constants_1.BRANCH_LIMITS.output) });
                return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
            case 10:
                _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.runStep = runStep;
var readBranches = function (d, key) { return (0, pending_reads_1.pendingRead)(d, ['graph', key], function () { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.read, function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = branch_source_1.graphOf;
            _b = [d];
            return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
        case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
    }
}); }); }); }); };
exports.readBranches = readBranches;
var readBranch = function (d, key, id, target) { return (0, pending_reads_1.pendingRead)(d, ['branch', key, id, target], function () { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.read, function () { return __awaiter(void 0, void 0, void 0, function () {
    var scope, task, selected, review, _a, ops, _b, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _g.sent();
                task = (0, exports.taskOf)(scope, id);
                selected = target === null || target === undefined ? (_e = task.baseBranch) !== null && _e !== void 0 ? _e : 'main' : target;
                if (!(0, git_rules_1.isBranch)(selected))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [4 /*yield*/, (0, branch_source_1.reviewOf)(d, scope, task, selected)];
            case 2:
                review = _g.sent();
                _a = review;
                return [4 /*yield*/, (0, commit_progress_1.readCommitProgress)(d, scope.key, task.id)];
            case 3:
                _a.commitProgress = _g.sent();
                review.proposal = (0, git_mode_1.gitModeOf)(scope.record) === 'assisted' ? (0, git_rules_1.proposalFor)(task.commitProposal, review.sourceHead, review.files) : null;
                return [4 /*yield*/, (0, operation_store_1.operationsOf)(d, scope.key)];
            case 4:
                ops = _g.sent();
                review.operation = (_f = ops.find(function (o) { return o.taskId === task.id && o.target === selected && o.stage !== 'abandoned'; })) !== null && _f !== void 0 ? _f : null;
                // Checks come from the in-app check runner, on the prepared merge.
                _b = review;
                if (!review.operation) return [3 /*break*/, 6];
                _d = checks_source_1.latestChecks;
                return [4 /*yield*/, (0, checks_source_1.readChecks)(d, review.operation)];
            case 5:
                _c = _d.apply(void 0, [_g.sent()]);
                return [3 /*break*/, 7];
            case 6:
                _c = [];
                _g.label = 7;
            case 7:
                // Checks come from the in-app check runner, on the prepared merge.
                _b.checks = _c;
                return [2 /*return*/, review];
        }
    });
}); }); }); };
exports.readBranch = readBranch;
var readMergeWorkspace = function (d, key, id) { return (0, pending_reads_1.pendingRead)(d, ['merge', key, id], function () { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.read, function () { return __awaiter(void 0, void 0, void 0, function () {
    var scope, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _c.sent();
                _a = merge_workspace_1.workspaceOf;
                _b = [d, scope.ctx.projectPath];
                return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, id)];
            case 2: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
        }
    });
}); }); }); };
exports.readMergeWorkspace = readMergeWorkspace;
var prepareMerge = function (d, key, input) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var initial, request;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                initial = _a.sent();
                request = (0, exports.requestOf)(input);
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, initial.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var scope, review, retained, op, folder, workspace, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 1:
                                    scope = _a.sent();
                                    return [4 /*yield*/, (0, exports.freshReview)(d, scope, request)];
                                case 2:
                                    review = _a.sent();
                                    return [4 /*yield*/, (0, operation_store_1.operationsOf)(d, scope.key)];
                                case 3:
                                    retained = (_a.sent()).find(function (o) { return o.target === request.target && !['merged', 'abandoned'].includes(o.stage); });
                                    if (retained) {
                                        if (retained.taskId === request.taskId && retained.sourceHead === review.sourceHead && retained.targetHead === review.targetHead)
                                            return [2 /*return*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, retained)];
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.reserved);
                                    }
                                    op = { version: 1, id: (0, node_crypto_1.randomUUID)(), key: scope.key, taskId: request.taskId, source: review.source, target: review.target, sourceHead: review.sourceHead, targetHead: review.targetHead,
                                        created: d.now(), stage: 'preparing', tree: null, commit: null, message: null, events: [], published: null };
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
                                case 4:
                                    _a.sent();
                                    folder = (0, merge_workspace_1.workspacePath)(d, op);
                                    _a.label = 5;
                                case 5:
                                    _a.trys.push([5, 10, , 12]);
                                    return [4 /*yield*/, (0, branch_source_1.gitIn)(d, scope.ctx.projectPath)(['worktree', 'add', '--detach', folder, op.targetHead])];
                                case 6:
                                    _a.sent();
                                    return [4 /*yield*/, (0, exports.runStep)(d, op, folder, { kind: 'prepare', source: op.sourceHead })];
                                case 7:
                                    _a.sent();
                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                                case 8:
                                    workspace = _a.sent();
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, workspace.operation)];
                                case 9:
                                    _a.sent();
                                    return [2 /*return*/, workspace];
                                case 10:
                                    err_2 = _a.sent();
                                    op.stage = 'failed';
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
                                case 11:
                                    _a.sent();
                                    throw err_2;
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.prepareMerge = prepareMerge;
var resolveMergeFile = function (d, key, input) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var initial, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                initial = _a.sent();
                r = input;
                if (!r || typeof r.path !== 'string' || !['base', 'target', 'source', 'edited'].includes(r.choice))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, initial.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var saved, workspace, op, file, folder, git, path, stage_1, entry, _a, next;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, initial.key, r.operationId)];
                                case 1:
                                    saved = _b.sent();
                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, initial.ctx.projectPath, saved)];
                                case 2:
                                    workspace = _b.sent();
                                    op = workspace.operation;
                                    if (op.stage !== 'conflicts')
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                    file = workspace.conflicts.find(function (f) { return f.path === r.path; });
                                    if (!file)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                                    folder = (0, merge_workspace_1.workspacePath)(d, op);
                                    git = (0, branch_source_1.gitIn)(d, folder);
                                    return [4 /*yield*/, (0, merge_workspace_1.safeResolutionPath)(folder, file.path)];
                                case 3:
                                    path = _b.sent();
                                    if (!(r.choice === 'edited')) return [3 /*break*/, 6];
                                    if (!file.editable || typeof r.text !== 'string' || r.text.length > constants_1.BRANCH_LIMITS.conflict || /^(<{7}|={7}|>{7}|\|{7})( |$)/m.test(r.text))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.unresolved);
                                    return [4 /*yield*/, d.host.write(path, r.text)];
                                case 4:
                                    _b.sent();
                                    return [4 /*yield*/, git(['--literal-pathspecs', 'add', '--', file.path])];
                                case 5:
                                    _b.sent();
                                    return [3 /*break*/, 12];
                                case 6:
                                    stage_1 = { base: 1, target: 2, source: 3 }[r.choice];
                                    _a = merge_workspace_1.conflictEntries;
                                    return [4 /*yield*/, git(['ls-files', '-u', '-z'])];
                                case 7:
                                    entry = _a.apply(void 0, [_b.sent()]).find(function (e) { return e.path === file.path && e.stage === stage_1; });
                                    if (!!entry) return [3 /*break*/, 9];
                                    return [4 /*yield*/, git(['--literal-pathspecs', 'rm', '-f', '--', file.path])];
                                case 8:
                                    _b.sent();
                                    return [3 /*break*/, 12];
                                case 9:
                                    if (!['100644', '100755'].includes(entry.mode))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.unsafePath);
                                    return [4 /*yield*/, git(['update-index', '--add', '--cacheinfo', "".concat(entry.mode, ",").concat(entry.oid, ",").concat(entry.path)])];
                                case 10:
                                    _b.sent();
                                    return [4 /*yield*/, git(['--literal-pathspecs', 'checkout-index', '-f', '--', file.path])];
                                case 11:
                                    _b.sent();
                                    _b.label = 12;
                                case 12:
                                    op.events.push({ at: d.now(), command: "Resolved ".concat(file.path, " (").concat(r.choice, ")"), status: 'succeeded', output: '' });
                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, initial.ctx.projectPath, op)];
                                case 13:
                                    next = _b.sent();
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, next.operation)];
                                case 14:
                                    _b.sent();
                                    return [2 /*return*/, next];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.resolveMergeFile = resolveMergeFile;
var completeMerge = function (d, key, input) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var initial, r, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                initial = _a.sent();
                r = input;
                if (!r || typeof r.approval !== 'string')
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                message = (0, exports.messageOf)(r.message);
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, initial.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var scope, workspace, _a, _b, op, check, approvedTree, result, recovered, checkouts, destination, result, _c, _d, cleared, _i, cleared_1, line;
                        var _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 1:
                                    scope = _f.sent();
                                    _a = merge_workspace_1.workspaceOf;
                                    _b = [d, scope.ctx.projectPath];
                                    return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, r.operationId)];
                                case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_f.sent()]))];
                                case 3:
                                    workspace = _f.sent();
                                    op = workspace.operation;
                                    if (op.stage === 'merged')
                                        return [2 /*return*/, workspace]; // Retry after a lost response is harmless.
                                    if (!workspace.approval || workspace.approval !== r.approval)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                    if (!r.idleConfirmed)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.idle);
                                    if (!workspace.checksCurrent)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.checksRequired);
                                    check = function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var fresh, review;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                                case 1:
                                                    fresh = _a.sent();
                                                    return [4 /*yield*/, (0, branch_source_1.reviewOf)(d, fresh, (0, exports.taskOf)(fresh, op.taskId), op.target)];
                                                case 2:
                                                    review = _a.sent();
                                                    if (review.source !== op.source || review.sourceHead !== op.sourceHead || review.targetHead !== op.targetHead)
                                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                                    if (review.blocked)
                                                        throw new reply_1.Refusal(review.blocked);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); };
                                    return [4 /*yield*/, check()];
                                case 4:
                                    _f.sent();
                                    if (!!op.commit) return [3 /*break*/, 9];
                                    approvedTree = op.tree;
                                    op.stage = 'committing';
                                    op.message = message;
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
                                case 5:
                                    _f.sent();
                                    return [4 /*yield*/, (0, exports.runStep)(d, op, (0, merge_workspace_1.workspacePath)(d, op), { kind: 'commit', message: message })];
                                case 6:
                                    result = _f.sent();
                                    if (result.exitCode !== 0)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.action);
                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                                case 7:
                                    recovered = _f.sent();
                                    if (!recovered.operation.commit)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.action);
                                    Object.assign(op, recovered.operation);
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)
                                        // Commit hooks may change files or amend the result. Such changes need
                                        // their own review before the destination can move.
                                    ];
                                case 8:
                                    _f.sent();
                                    // Commit hooks may change files or amend the result. Such changes need
                                    // their own review before the destination can move.
                                    if (op.tree !== approvedTree || recovered.approval === null)
                                        return [2 /*return*/, recovered];
                                    _f.label = 9;
                                case 9: 
                                // A hook may have taken time. Recheck ownership, writers and both heads
                                // before applying, leaving the prepared merge intact on any refusal.
                                return [4 /*yield*/, check()];
                                case 10:
                                    // A hook may have taken time. Recheck ownership, writers and both heads
                                    // before applying, leaving the prepared merge intact on any refusal.
                                    _f.sent();
                                    return [4 /*yield*/, (0, worktrees_repository_impl_1.worktreesRepositoryImpl)(d.host, scope.ctx.projectPath).list()];
                                case 11:
                                    checkouts = _f.sent();
                                    destination = (_e = checkouts.find(function (w) { return w.branch === op.target; })) === null || _e === void 0 ? void 0 : _e.path;
                                    if (!destination) return [3 /*break*/, 14];
                                    return [4 /*yield*/, (0, branch_source_1.gitIn)(d, destination)(['symbolic-ref', '--short', 'HEAD'])];
                                case 12:
                                    if ((_f.sent()).trim() !== op.target)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                    return [4 /*yield*/, (0, exports.runStep)(d, op, destination, { kind: 'apply', commit: op.commit })];
                                case 13:
                                    result = _f.sent();
                                    if (result.exitCode !== 0)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.action);
                                    return [3 /*break*/, 16];
                                case 14: 
                                // Compare-and-swap: never overwrite a target that moved after approval.
                                return [4 /*yield*/, (0, branch_source_1.gitIn)(d, scope.ctx.projectPath)(['update-ref', "refs/heads/".concat(op.target), op.commit, op.targetHead])];
                                case 15:
                                    // Compare-and-swap: never overwrite a target that moved after approval.
                                    _f.sent();
                                    op.events.push({ at: d.now(), command: "Updated ".concat(op.target, " to ").concat(op.commit), status: 'succeeded', output: '' });
                                    _f.label = 16;
                                case 16:
                                    _c = branch_source_1.ancestor;
                                    _d = [d, scope.ctx.projectPath, op.commit];
                                    return [4 /*yield*/, (0, branch_source_1.headOf)(d, scope.ctx.projectPath, op.target)];
                                case 17: return [4 /*yield*/, _c.apply(void 0, _d.concat([_f.sent()]))];
                                case 18:
                                    if (!(_f.sent()))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.action);
                                    op.stage = 'merged';
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
                                case 19:
                                    _f.sent();
                                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, key, op.taskId)];
                                case 20:
                                    cleared = _f.sent();
                                    for (_i = 0, cleared_1 = cleared; _i < cleared_1.length; _i++) {
                                        line = cleared_1[_i];
                                        op.events.push({ at: d.now(), command: line, status: 'succeeded', output: '' });
                                    }
                                    if (!cleared.length) return [3 /*break*/, 22];
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)];
                                case 21:
                                    _f.sent();
                                    _f.label = 22;
                                case 22: return [2 /*return*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.completeMerge = completeMerge;
var abandonMerge = function (d, key, id) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var scope;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _a.sent();
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, scope.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var workspace, _a, _b, op, folder, _c, pending, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _a = merge_workspace_1.workspaceOf;
                                    _b = [d, scope.ctx.projectPath];
                                    return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, id)];
                                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_e.sent()]))];
                                case 2:
                                    workspace = _e.sent();
                                    op = workspace.operation;
                                    if (op.stage === 'merged')
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                                    folder = (0, merge_workspace_1.workspacePath)(d, op);
                                    _c = !op.commit;
                                    if (!_c) return [3 /*break*/, 4];
                                    return [4 /*yield*/, d.host.exists(folder)];
                                case 3:
                                    _c = (_e.sent());
                                    _e.label = 4;
                                case 4:
                                    if (!_c) return [3 /*break*/, 8];
                                    return [4 /*yield*/, d.host.run(['git', 'rev-parse', '-q', '--verify', 'MERGE_HEAD'], folder)];
                                case 5:
                                    pending = _e.sent();
                                    _d = pending.exitCode === 0;
                                    if (!_d) return [3 /*break*/, 7];
                                    return [4 /*yield*/, (0, exports.runStep)(d, op, folder, { kind: 'abort' })];
                                case 6:
                                    _d = (_e.sent()).exitCode !== 0;
                                    _e.label = 7;
                                case 7:
                                    if (_d)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.action);
                                    _e.label = 8;
                                case 8:
                                    op.stage = 'abandoned';
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)
                                        // The isolated folder is retained. No task branch or worktree is deleted.
                                    ];
                                case 9:
                                    _e.sent();
                                    // The isolated folder is retained. No task branch or worktree is deleted.
                                    return [2 /*return*/, { operation: op, conflicts: [], diff: '', truncated: false, approval: null }];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.abandonMerge = abandonMerge;
var openMergeFolder = function (d, key, id) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var scope, op, folder, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _b.sent();
                return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, id)];
            case 2:
                op = _b.sent();
                folder = (0, merge_workspace_1.workspacePath)(d, op);
                _a = !d.reveal;
                if (_a) return [3 /*break*/, 4];
                return [4 /*yield*/, d.host.exists(folder)];
            case 3:
                _a = !(_b.sent());
                _b.label = 4;
            case 4:
                if (_a)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.missing);
                d.reveal(folder);
                return [2 /*return*/, null];
        }
    });
}); }); };
exports.openMergeFolder = openMergeFolder;
