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
exports.commitBranchFiles = void 0;
var live_output_1 = require("../data/live_output");
var commit_progress_1 = require("../data/commit_progress");
var user_git_1 = require("../data/user_git");
var worktrees_repository_impl_1 = require("../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl");
var reply_1 = require("../../../core/reply");
var scope_1 = require("../../tasks/api/scope");
var constants_1 = require("../domain/constants");
var git_rules_1 = require("../domain/git_rules");
var branch_source_1 = require("../data/branch_source");
var operation_store_1 = require("../data/operation_store");
var branch_api_1 = require("./branch_api");
var commitBranchFiles = function (d, key, input) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var initial, request, r, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                initial = _a.sent();
                request = (0, branch_api_1.requestOf)(input);
                r = input;
                message = (0, branch_api_1.messageOf)(r.message);
                if (!Array.isArray(r.files) || !r.files.length || r.files.length > 1000 || !r.files.every(git_rules_1.isFile))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, initial.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var scope, task, receipt, previous, _a, _b, head, review, files, _i, _c, file, worktrees, source, git, action, progress, receiptData, save, stream, result, err_1, _d, _e;
                        var _f, _g;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 1:
                                    scope = _h.sent();
                                    task = (0, branch_api_1.taskOf)(scope, request.taskId);
                                    // This receipt makes a repeated click/IPC delivery idempotent. It is saved
                                    // before committing, so a crash cannot silently create a second commit.
                                    if (!/^[a-f0-9]{64}$/.test(request.fingerprint))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                                    receipt = "".concat((0, constants_1.operationsFolder)(d.home, scope.key), "/commit-").concat(request.fingerprint, ".json");
                                    return [4 /*yield*/, d.host.exists(receipt)];
                                case 2:
                                    if (!_h.sent()) return [3 /*break*/, 5];
                                    _b = (_a = JSON).parse;
                                    return [4 /*yield*/, d.host.read(receipt)];
                                case 3:
                                    previous = _b.apply(_a, [_h.sent()]);
                                    if (previous.taskId !== task.id)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                                    return [4 /*yield*/, (0, branch_source_1.headOf)(d, scope.ctx.projectPath, task.branch)];
                                case 4:
                                    head = _h.sent();
                                    if (head !== previous.before)
                                        return [2 /*return*/, (0, branch_source_1.reviewOf)(d, scope, task, request.target)];
                                    if (!previous.failed)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.receipt);
                                    _h.label = 5;
                                case 5: return [4 /*yield*/, (0, branch_api_1.freshReview)(d, scope, request, true)];
                                case 6:
                                    review = _h.sent();
                                    files = new Set(r.files);
                                    if (r.files.some(function (path) { return !review.files.some(function (f) { return f.path === path || f.previous === path; }); }))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                    for (_i = 0, _c = review.files; _i < _c.length; _i++) {
                                        file = _c[_i];
                                        if (file.previous && files.has(file.path))
                                            files.add(file.previous);
                                        if (file.status[0] !== ' ' && file.status[0] !== '?' && !files.has(file.path))
                                            throw new reply_1.Refusal(constants_1.BRANCH_TEXT.staged);
                                    }
                                    return [4 /*yield*/, (0, worktrees_repository_impl_1.worktreesRepositoryImpl)(d.host, scope.ctx.projectPath).list()];
                                case 7:
                                    worktrees = _h.sent();
                                    source = (_f = worktrees.find(function (w) { return w.branch === task.branch; })) === null || _f === void 0 ? void 0 : _f.path;
                                    if (!source || source !== ((_g = task.worktreePath) !== null && _g !== void 0 ? _g : scope.ctx.projectPath))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.missing);
                                    git = (0, branch_source_1.gitIn)(d, source);
                                    return [4 /*yield*/, git(__spreadArray(['--literal-pathspecs', 'add', '--'], files, true))
                                        // A new tracked file needs staging before commit --only can include it.
                                        // All staging is limited to the user's selection.
                                    ];
                                case 8:
                                    _h.sent();
                                    action = { kind: 'commitFiles', message: message, files: __spreadArray([], files, true) };
                                    progress = { owner: process.pid, command: "git ".concat((0, user_git_1.argvOf)(action).join(' ')), message: message, at: d.now(), finished: null, status: 'running', output: '', truncated: false, exitCode: null };
                                    receiptData = { before: review.sourceHead, taskId: task.id, files: __spreadArray([], files, true), message: message, failed: false, progress: progress };
                                    save = function () { return (0, commit_progress_1.writeReceipt)(d, receipt, receiptData); };
                                    return [4 /*yield*/, save()];
                                case 9:
                                    _h.sent();
                                    stream = (0, live_output_1.liveOutput)(function (output, truncated) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                progress.output = output;
                                                progress.truncated = truncated;
                                                return [4 /*yield*/, save()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    }); }); });
                                    _h.label = 10;
                                case 10:
                                    _h.trys.push([10, 12, 15, 17]);
                                    return [4 /*yield*/, d.userGit(source, action, stream.append)];
                                case 11:
                                    result = _h.sent();
                                    return [3 /*break*/, 17];
                                case 12:
                                    err_1 = _h.sent();
                                    return [4 /*yield*/, stream.flush()];
                                case 13:
                                    _h.sent();
                                    progress.status = 'interrupted';
                                    progress.finished = d.now();
                                    return [4 /*yield*/, save()];
                                case 14:
                                    _h.sent();
                                    throw err_1;
                                case 15: return [4 /*yield*/, stream.flush()];
                                case 16:
                                    _h.sent();
                                    return [7 /*endfinally*/];
                                case 17:
                                    progress.finished = d.now();
                                    progress.exitCode = result.exitCode;
                                    progress.status = result.exitCode === 0 ? 'succeeded' : 'failed';
                                    progress.output || (progress.output = (result.stdout + result.stderr).slice(-constants_1.BRANCH_LIMITS.output));
                                    receiptData.failed = result.exitCode !== 0;
                                    return [4 /*yield*/, save()];
                                case 18:
                                    _h.sent();
                                    if (result.exitCode !== 0) {
                                        d.log.error("source commit failed: ".concat(result.stderr));
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.action);
                                    }
                                    _d = branch_source_1.reviewOf;
                                    _e = [d];
                                    return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 19: return [2 /*return*/, _d.apply(void 0, _e.concat([_h.sent(), task, request.target]))];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.commitBranchFiles = commitBranchFiles;
