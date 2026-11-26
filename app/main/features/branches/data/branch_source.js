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
exports.reviewOf = exports.workingSnapshot = exports.graphOf = exports.taskReads = exports.pendingGit = exports.headsOf = exports.ancestor = exports.headOf = exports.gitIn = exports.digest = void 0;
var node_crypto_1 = require("node:crypto");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var worktrees_repository_impl_1 = require("../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl");
var reply_1 = require("../../../core/reply");
var constants_1 = require("../domain/constants");
var git_rules_1 = require("../domain/git_rules");
var observation_1 = require("./observation");
var digest = function (text) { return (0, node_crypto_1.createHash)('sha256').update(text).digest('hex'); };
exports.digest = digest;
var gitIn = function (d, cwd) { return function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d.host.run(__spreadArray(['git', '--no-optional-locks'], args, true), cwd)];
            case 1:
                r = _a.sent();
                if (r.exitCode !== 0)
                    throw new Error("git ".concat(args[0], " failed (").concat(r.exitCode, "): ").concat(r.stderr));
                return [2 /*return*/, r.stdout];
        }
    });
}); }; };
exports.gitIn = gitIn;
var headOf = function (d, root, branch) { return __awaiter(void 0, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, git_rules_1.isBranch)(branch))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [4 /*yield*/, d.host.run(['git', 'rev-parse', '--verify', "refs/heads/".concat(branch, "^{commit}")], root)];
            case 1:
                r = _a.sent();
                if (r.exitCode !== 0)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.missing);
                return [2 /*return*/, r.stdout.trim()];
        }
    });
}); };
exports.headOf = headOf;
var ancestor = function (d, root, a, b) { return __awaiter(void 0, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d.host.run(['git', 'merge-base', '--is-ancestor', a, b], root)];
            case 1:
                r = _a.sent();
                if (r.exitCode > 1)
                    throw new Error("ancestry failed: ".concat(r.stderr));
                return [2 /*return*/, r.exitCode === 0];
        }
    });
}); };
exports.ancestor = ancestor;
var headsOf = function (d, root) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.gitIn)(d, root)(['for-each-ref', '--format=%(refname:strip=2)%00%(objectname)', 'refs/heads/'])];
            case 1: return [2 /*return*/, (_a.sent()).trim().split('\n').filter(Boolean).map(function (line) {
                    var _a = line.split('\0'), _b = _a[0], branch = _b === void 0 ? '' : _b, _c = _a[1], head = _c === void 0 ? '' : _c;
                    return { branch: branch, head: head };
                })];
        }
    });
}); };
exports.headsOf = headsOf;
var pendingGit = function (d, path) { return __awaiter(void 0, void 0, void 0, function () {
    var git, _i, _a, name_1, file;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                git = (0, exports.gitIn)(d, path);
                _i = 0, _a = ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply'];
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                name_1 = _a[_i];
                return [4 /*yield*/, git(['rev-parse', '--path-format=absolute', '--git-path', name_1])];
            case 2:
                file = (_b.sent()).trim();
                return [4 /*yield*/, d.host.exists(file)];
            case 3:
                if (_b.sent())
                    return [2 /*return*/, true];
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, false];
        }
    });
}); };
exports.pendingGit = pendingGit;
// A graph can span hundreds of retained tasks. Bound the disk/Git work while
// keeping result order stable. A failure stops workers from taking more tasks.
var taskReads = function (items, read) { return __awaiter(void 0, void 0, void 0, function () {
    var result, next, stopped, workers, _i, workers_1, worker;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = [];
                next = 0;
                stopped = false;
                return [4 /*yield*/, Promise.allSettled(Array.from({ length: Math.min(items.length, constants_1.BRANCH_LIMITS.graphWorkers) }, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var index, _a, _b, err_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!(!stopped && next < items.length)) return [3 /*break*/, 5];
                                    index = next++;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    _a = result;
                                    _b = index;
                                    return [4 /*yield*/, read(items[index])];
                                case 2:
                                    _a[_b] = _c.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _c.sent();
                                    stopped = true;
                                    throw err_1;
                                case 4: return [3 /*break*/, 0];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                workers = _a.sent();
                for (_i = 0, workers_1 = workers; _i < workers_1.length; _i++) {
                    worker = workers_1[_i];
                    if (worker.status === 'rejected')
                        throw worker.reason;
                }
                return [2 /*return*/, result];
        }
    });
}); };
exports.taskReads = taskReads;
var graphOf = function (d, scope) { return __awaiter(void 0, void 0, void 0, function () {
    var root, git, allHeads, integration, relevant, heads, commits, _a, _b, checkouts, tasks;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                root = scope.ctx.projectPath;
                git = (0, exports.gitIn)(d, root);
                return [4 /*yield*/, (0, exports.headsOf)(d, root)];
            case 1:
                allHeads = _j.sent();
                integration = (_h = (_f = (_d = (_c = allHeads.find(function (h) { return h.branch === 'main'; })) === null || _c === void 0 ? void 0 : _c.branch) !== null && _d !== void 0 ? _d : (_e = allHeads.find(function (h) { return h.branch === 'master'; })) === null || _e === void 0 ? void 0 : _e.branch) !== null && _f !== void 0 ? _f : (_g = allHeads[0]) === null || _g === void 0 ? void 0 : _g.branch) !== null && _h !== void 0 ? _h : '';
                relevant = new Set(__spreadArray([integration], scope.record.tasks.filter(function (t) { return t.state !== 'removed'; }).flatMap(function (t) { return [t.branch, t.baseBranch]; }), true));
                heads = allHeads.filter(function (h) { return relevant.has(h.branch); });
                if (!heads.length) return [3 /*break*/, 3];
                _b = git_rules_1.parseLog;
                return [4 /*yield*/, git(__spreadArray(__spreadArray(['log', '--topo-order', "--max-count=".concat(constants_1.BRANCH_LIMITS.graph), '--format=%H%x00%P%x00%s'], heads.map(function (h) { return "refs/heads/".concat(h.branch); }), true), ['--'], false))];
            case 2:
                _a = _b.apply(void 0, [_j.sent()]);
                return [3 /*break*/, 4];
            case 3:
                _a = [];
                _j.label = 4;
            case 4:
                commits = _a;
                return [4 /*yield*/, (0, worktrees_repository_impl_1.worktreesRepositoryImpl)(d.host, root).list()];
            case 5:
                checkouts = _j.sent();
                return [4 /*yield*/, (0, exports.taskReads)(scope.record.tasks.filter(function (t) { return t.branch && t.state !== 'removed'; }), function (task) { return __awaiter(void 0, void 0, void 0, function () {
                        var head, base, observation, forkResult, _a, merged, _b, folder, changed, _c, _d, _e, _f;
                        var _g;
                        var _h, _j, _k, _l, _m, _o, _p;
                        return __generator(this, function (_q) {
                            switch (_q.label) {
                                case 0:
                                    head = (_j = (_h = heads.find(function (h) { return h.branch === task.branch; })) === null || _h === void 0 ? void 0 : _h.head) !== null && _j !== void 0 ? _j : null;
                                    base = (_l = (_k = heads.find(function (h) { return h.branch === task.baseBranch; })) === null || _k === void 0 ? void 0 : _k.head) !== null && _l !== void 0 ? _l : null;
                                    return [4 /*yield*/, (0, observation_1.observeTask)(d, root, task)];
                                case 1:
                                    observation = _q.sent();
                                    if (!(head && base)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, d.host.run(['git', 'merge-base', base, head], root)];
                                case 2:
                                    _a = _q.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    _a = null;
                                    _q.label = 4;
                                case 4:
                                    forkResult = _a;
                                    _b = !!head && !!base && head !== task.startCommit;
                                    if (!_b) return [3 /*break*/, 6];
                                    return [4 /*yield*/, (0, exports.ancestor)(d, root, head, base)];
                                case 5:
                                    _b = (_q.sent());
                                    _q.label = 6;
                                case 6:
                                    merged = _b;
                                    folder = (_m = checkouts.find(function (w) { return w.branch === task.branch; })) === null || _m === void 0 ? void 0 : _m.path;
                                    if (!folder) return [3 /*break*/, 8];
                                    _d = git_rules_1.parseStatus;
                                    return [4 /*yield*/, (0, exports.gitIn)(d, folder)(['status', '--porcelain=v1', '-z', '--untracked-files=all'])];
                                case 7:
                                    _c = _d.apply(void 0, [_q.sent()]).length;
                                    return [3 /*break*/, 9];
                                case 8:
                                    _c = null;
                                    _q.label = 9;
                                case 9:
                                    changed = _c;
                                    _g = { id: task.id, title: task.title, branch: task.branch, base: task.baseBranch, head: head, fork: (forkResult === null || forkResult === void 0 ? void 0 : forkResult.exitCode) === 0 ? forkResult.stdout.trim() : null, merged: merged, state: merged ? 'merged' : observation.state, latest: (_p = (_o = observation.step) === null || _o === void 0 ? void 0 : _o.subject) !== null && _p !== void 0 ? _p : null, seenAt: observation.seenAt, changed: changed };
                                    if (!(head && base)) return [3 /*break*/, 11];
                                    _f = Number;
                                    return [4 /*yield*/, git(['rev-list', '--count', "".concat(base, "..").concat(head)])];
                                case 10:
                                    _e = _f.apply(void 0, [(_q.sent()).trim()]);
                                    return [3 /*break*/, 12];
                                case 11:
                                    _e = null;
                                    _q.label = 12;
                                case 12: return [2 /*return*/, (_g.commits = _e, _g)];
                            }
                        });
                    }); })];
            case 6:
                tasks = _j.sent();
                return [2 /*return*/, { at: d.now(), integration: integration, heads: heads, commits: commits, tasks: tasks, limited: commits.length === constants_1.BRANCH_LIMITS.graph }];
        }
    });
}); };
exports.graphOf = graphOf;
// A fingerprint includes the complete diff and untracked contents, not just
// status letters. Editing an already-dirty file invalidates the review too.
var workingSnapshot = function (d, path, files) { return __awaiter(void 0, void 0, void 0, function () {
    var git, diff, untracked, _i, _a, file, hash;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                git = (0, exports.gitIn)(d, path);
                return [4 /*yield*/, git(['diff', '--no-ext-diff', '--no-textconv', '--binary', 'HEAD', '--'])];
            case 1:
                diff = _b.sent();
                untracked = [];
                _i = 0, _a = files.filter(function (f) { return f.status === '??'; });
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                file = _a[_i];
                return [4 /*yield*/, git(['hash-object', '--', file.path])];
            case 3:
                hash = _b.sent();
                untracked.push("".concat(file.path, "\0").concat(hash));
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, { diff: diff, fingerprint: (0, exports.digest)(JSON.stringify(files) + diff + untracked.join('\0')) }];
        }
    });
}); };
exports.workingSnapshot = workingSnapshot;
var reviewOf = function (d, scope, task, target) { return __awaiter(void 0, void 0, void 0, function () {
    var root, git, _a, sourceHead, targetHead, heads, checkouts, observation, source, destination, files, _b, _c, working, _d, targetStatus, _e, targetTask, targetWorking, _f, sessionWriter, sourcePending, _g, targetPending, _h, merged, untrackedDiff, _i, _j, file, result, diff, blocked, _k;
    var _l;
    var _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                root = scope.ctx.projectPath;
                git = (0, exports.gitIn)(d, root);
                if (!task.branch || target === task.branch)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [4 /*yield*/, Promise.all([
                        (0, exports.headOf)(d, root, task.branch), (0, exports.headOf)(d, root, target), (0, exports.headsOf)(d, root), (0, worktrees_repository_impl_1.worktreesRepositoryImpl)(d.host, root).list(), (0, observation_1.observeTask)(d, root, task),
                    ])];
            case 1:
                _a = _p.sent(), sourceHead = _a[0], targetHead = _a[1], heads = _a[2], checkouts = _a[3], observation = _a[4];
                source = (_m = checkouts.find(function (w) { return w.branch === task.branch; })) === null || _m === void 0 ? void 0 : _m.path;
                destination = (_o = checkouts.find(function (w) { return w.branch === target; })) === null || _o === void 0 ? void 0 : _o.path;
                if (!source) return [3 /*break*/, 3];
                _c = git_rules_1.parseStatus;
                return [4 /*yield*/, (0, exports.gitIn)(d, source)(['status', '--porcelain=v1', '-z', '--untracked-files=all'])];
            case 2:
                _b = _c.apply(void 0, [_p.sent()]);
                return [3 /*break*/, 4];
            case 3:
                _b = [];
                _p.label = 4;
            case 4:
                files = _b;
                if (!source) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, exports.workingSnapshot)(d, source, files)];
            case 5:
                _d = _p.sent();
                return [3 /*break*/, 7];
            case 6:
                _d = { diff: '', fingerprint: '' };
                _p.label = 7;
            case 7:
                working = _d;
                if (!destination) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, exports.gitIn)(d, destination)(['status', '--porcelain=v1', '-z', '--untracked-files=all'])];
            case 8:
                _e = _p.sent();
                return [3 /*break*/, 10];
            case 9:
                _e = '';
                _p.label = 10;
            case 10:
                targetStatus = _e;
                targetTask = scope.record.tasks.find(function (t) { var _a; return t.id !== task.id && t.state === 'current' && ((_a = t.worktreePath) !== null && _a !== void 0 ? _a : root) === destination; });
                _f = targetTask;
                if (!_f) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, observation_1.observeTask)(d, root, targetTask)];
            case 11:
                _f = (_p.sent()).state === 'working';
                _p.label = 12;
            case 12:
                targetWorking = _f;
                return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
            case 13:
                sessionWriter = (_p.sent()).some(function (s) { var _a; return (0, session_rules_1.isFresh)(s, d.now()) && s.isTurnRunning && [source, destination].includes((_a = s.workingPath) !== null && _a !== void 0 ? _a : s.projectPath); });
                if (!source) return [3 /*break*/, 15];
                return [4 /*yield*/, (0, exports.pendingGit)(d, source)];
            case 14:
                _g = _p.sent();
                return [3 /*break*/, 16];
            case 15:
                _g = false;
                _p.label = 16;
            case 16:
                sourcePending = _g;
                if (!destination) return [3 /*break*/, 18];
                return [4 /*yield*/, (0, exports.pendingGit)(d, destination)];
            case 17:
                _h = _p.sent();
                return [3 /*break*/, 19];
            case 18:
                _h = false;
                _p.label = 19;
            case 19:
                targetPending = _h;
                return [4 /*yield*/, (0, exports.ancestor)(d, root, sourceHead, targetHead)];
            case 20:
                merged = _p.sent();
                untrackedDiff = '';
                if (!source) return [3 /*break*/, 24];
                _i = 0, _j = files.filter(function (f) { return f.status === '??'; });
                _p.label = 21;
            case 21:
                if (!(_i < _j.length)) return [3 /*break*/, 24];
                file = _j[_i];
                return [4 /*yield*/, d.host.run(['git', 'diff', '--no-index', '--no-ext-diff', '--no-textconv', '--', '/dev/null', file.path], source)];
            case 22:
                result = _p.sent();
                if (result.exitCode > 1)
                    throw new Error("reading untracked diff failed: ".concat(result.stderr));
                untrackedDiff += result.stdout;
                _p.label = 23;
            case 23:
                _i++;
                return [3 /*break*/, 21];
            case 24: return [4 /*yield*/, git(['diff', '--no-ext-diff', '--no-textconv', "".concat(targetHead, "...").concat(sourceHead), '--'])];
            case 25:
                diff = (_p.sent()) + working.diff + untrackedDiff;
                blocked = observation.state === 'working' || targetWorking || sessionWriter ? constants_1.BRANCH_TEXT.writer : sourcePending || targetPending ? constants_1.BRANCH_TEXT.pending : files.length || targetStatus ? constants_1.BRANCH_TEXT.dirty : merged ? constants_1.BRANCH_TEXT.noMerge : null;
                _l = { taskId: task.id, source: task.branch, target: target, targets: heads.map(function (h) { return h.branch; }).filter(function (b) { return b !== task.branch; }), sourceHead: sourceHead, targetHead: targetHead, fingerprint: (0, exports.digest)(sourceHead + targetHead + working.fingerprint + targetStatus), files: files, diff: diff.slice(0, constants_1.BRANCH_LIMITS.diff), truncated: diff.length > constants_1.BRANCH_LIMITS.diff };
                _k = git_rules_1.parseLog;
                return [4 /*yield*/, git(['log', '--format=%H%x00%P%x00%s', "".concat(targetHead, "..").concat(sourceHead), '--'])];
            case 26:
                _l.commits = _k.apply(void 0, [_p.sent()]), _l.step = observation.step, _l.checks = [], _l.state = observation.state, _l.blocked = blocked, _l.merged = merged, _l.operation = null;
                return [4 /*yield*/, git(['remote'])];
            case 27: return [2 /*return*/, (_l.remotes = (_p.sent()).trim().split('\n').filter(Boolean), _l)];
        }
    });
}); };
exports.reviewOf = reviewOf;
