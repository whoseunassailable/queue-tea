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
exports.cancelMergeChecks = exports.runMergeChecks = void 0;
var node_crypto_1 = require("node:crypto");
var node_path_1 = require("node:path");
var reply_1 = require("../../../core/reply");
var stream_process_1 = require("../../../core/stream_process");
var scope_1 = require("../../tasks/api/scope");
var constants_1 = require("../domain/constants");
var checks_source_1 = require("../data/checks_source");
var dependency_setup_1 = require("../data/dependency_setup");
var live_output_1 = require("../data/live_output");
var operation_store_1 = require("../data/operation_store");
var merge_workspace_1 = require("../data/merge_workspace");
var executing = new Map();
var runMergeChecks = function (d, key, input) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var scope, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _a.sent();
                r = input;
                if (!r || typeof r.approval !== 'string' || !Array.isArray(r.checkIds) || !r.checkIds.length || !r.checkIds.every(function (id) { return typeof id === 'string'; }))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.checkSelection);
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, scope.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var op, workspace, folder, tree, choices, selected, runs, controller, lockKey, _loop_1, _i, selected_1, choice, state_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, r.operationId)];
                                case 1:
                                    op = _a.sent();
                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                                case 2:
                                    workspace = _a.sent();
                                    if (!workspace.approval || r.approval !== workspace.approval || !workspace.operation.tree)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                    folder = (0, merge_workspace_1.workspacePath)(d, op);
                                    tree = workspace.operation.tree;
                                    return [4 /*yield*/, (0, checks_source_1.discoverChecks)(d, folder, tree)];
                                case 3:
                                    choices = _a.sent();
                                    selected = __spreadArray([], new Set(r.checkIds), true).map(function (id) { return choices.find(function (c) { return c.id === id; }); });
                                    if (selected.some(function (c) { return !c; }))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                    return [4 /*yield*/, (0, checks_source_1.readChecks)(d, op)];
                                case 4:
                                    runs = _a.sent();
                                    if (runs.some(function (run) { return run.status === 'running'; }))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                                    controller = new AbortController();
                                    lockKey = "".concat(scope.key, "/").concat(op.id);
                                    executing.set(lockKey, controller);
                                    _a.label = 5;
                                case 5:
                                    _a.trys.push([5, , 10, 11]);
                                    _loop_1 = function (choice) {
                                        var current, run, stream, active, result, err_1, err_2;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (controller.signal.aborted)
                                                        return [2 /*return*/, "break"];
                                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                                                case 1:
                                                    current = _b.sent();
                                                    if (current.approval !== r.approval)
                                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                                    run = { id: (0, node_crypto_1.randomUUID)(), checkId: choice.id, name: choice.name, command: choice.command, tree: tree, at: d.now(), finished: null, owner: process.pid, status: 'running', output: '', exitCode: null, truncated: false };
                                                    runs.push(run);
                                                    return [4 /*yield*/, (0, checks_source_1.saveChecks)(d, op, runs)];
                                                case 2:
                                                    _b.sent();
                                                    stream = (0, live_output_1.liveOutput)(function (output, truncated) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                run.output = output;
                                                                run.truncated = truncated;
                                                                return [4 /*yield*/, (0, checks_source_1.saveChecks)(d, op, runs)];
                                                            case 1:
                                                                _a.sent();
                                                                return [2 /*return*/];
                                                        }
                                                    }); }); });
                                                    active = function () {
                                                        if (controller.signal.aborted)
                                                            throw new dependency_setup_1.CheckStopped('cancelled');
                                                        if (d.now() - run.at >= constants_1.BRANCH_LIMITS.checksMs)
                                                            throw new dependency_setup_1.CheckStopped('failed');
                                                    };
                                                    _b.label = 3;
                                                case 3:
                                                    _b.trys.push([3, 7, 8, 10]);
                                                    return [4 /*yield*/, (0, dependency_setup_1.inspectDependencies)(d, folder, choice.folder, active)];
                                                case 4:
                                                    _b.sent();
                                                    active();
                                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                                                case 5:
                                                    if ((_b.sent()).approval !== r.approval)
                                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.checkChanged);
                                                    active();
                                                    return [4 /*yield*/, (0, stream_process_1.streamProcess)(d.log, { argv: ['npm', 'run', choice.script], cwd: (0, node_path_1.join)(folder, choice.folder), signal: controller.signal, timeoutMs: Math.max(1, constants_1.BRANCH_LIMITS.checksMs - (d.now() - run.at)), env: { PATH: (0, constants_1.checkPath)(d.home, process.env.PATH), CI: '1', npm_config_offline: 'true', npm_config_update_notifier: 'false' } }, stream.append)];
                                                case 6:
                                                    result = _b.sent();
                                                    run.exitCode = result.exitCode;
                                                    run.status = controller.signal.aborted ? 'cancelled' : result.exitCode === 0 ? 'succeeded' : 'failed';
                                                    if (result.timedOut)
                                                        stream.append('\n' + constants_1.BRANCH_TEXT.checkTimeout);
                                                    if (!result.exitCode)
                                                        active();
                                                    return [3 /*break*/, 10];
                                                case 7:
                                                    err_1 = _b.sent();
                                                    if (controller.signal.aborted) {
                                                        run.status = 'cancelled';
                                                        stream.append(constants_1.BRANCH_TEXT.checkCancelled);
                                                    }
                                                    else if (err_1 instanceof dependency_setup_1.CheckStopped) {
                                                        run.status = err_1.status;
                                                        stream.append(err_1.message);
                                                    }
                                                    else if (err_1 instanceof dependency_setup_1.DependencySetupRequired) {
                                                        run.status = 'setupRequired';
                                                        stream.append(err_1.message);
                                                    }
                                                    else {
                                                        d.log.error('Preparing or running a merge check failed', err_1);
                                                        run.status = 'failed';
                                                        stream.append(err_1 instanceof reply_1.Refusal ? err_1.message : constants_1.BRANCH_TEXT.checkPreparationFailed);
                                                    }
                                                    return [3 /*break*/, 10];
                                                case 8: return [4 /*yield*/, stream.flush()];
                                                case 9:
                                                    _b.sent();
                                                    return [7 /*endfinally*/];
                                                case 10:
                                                    run.finished = d.now();
                                                    _b.label = 11;
                                                case 11:
                                                    _b.trys.push([11, 13, , 14]);
                                                    return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                                                case 12:
                                                    if ((_b.sent()).approval !== r.approval) {
                                                        run.status = 'failed';
                                                        run.output += '\n' + constants_1.BRANCH_TEXT.checkChanged;
                                                    }
                                                    return [3 /*break*/, 14];
                                                case 13:
                                                    err_2 = _b.sent();
                                                    d.log.error('Verifying the tree after a merge check failed', err_2);
                                                    run.status = 'failed';
                                                    run.output += '\n' + constants_1.BRANCH_TEXT.checkPreparationFailed;
                                                    return [3 /*break*/, 14];
                                                case 14: return [4 /*yield*/, (0, checks_source_1.saveChecks)(d, op, runs)];
                                                case 15:
                                                    _b.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, selected_1 = selected;
                                    _a.label = 6;
                                case 6:
                                    if (!(_i < selected_1.length)) return [3 /*break*/, 9];
                                    choice = selected_1[_i];
                                    return [5 /*yield**/, _loop_1(choice)];
                                case 7:
                                    state_1 = _a.sent();
                                    if (state_1 === "break")
                                        return [3 /*break*/, 9];
                                    _a.label = 8;
                                case 8:
                                    _i++;
                                    return [3 /*break*/, 6];
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    executing.delete(lockKey);
                                    return [7 /*endfinally*/];
                                case 11: return [2 /*return*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.runMergeChecks = runMergeChecks;
var cancelMergeChecks = function (d, key, id) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.action, function () { return __awaiter(void 0, void 0, void 0, function () {
    var scope, op;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _b.sent();
                return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, id)];
            case 2:
                op = _b.sent();
                (_a = executing.get("".concat(scope.key, "/").concat(op.id))) === null || _a === void 0 ? void 0 : _a.abort();
                return [2 /*return*/, null];
        }
    });
}); }); };
exports.cancelMergeChecks = cancelMergeChecks;
