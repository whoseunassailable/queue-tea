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
exports.spaceOf = exports.folderStateOf = exports.mergedOf = exports.heldOf = exports.isUpdateRunning = exports.clearBuildFolders = exports.buildFoldersOf = exports.ownedFolders = void 0;
var promises_1 = require("node:fs/promises");
var update_runner_mjs_1 = require("../../../../tools/update_runner.mjs");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var worktrees_repository_impl_1 = require("../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl");
var git_rules_1 = require("../domain/git_rules");
var space_rules_1 = require("../domain/space_rules");
var branch_source_1 = require("./branch_source");
// Each quest's own checkout: never the project's folder, nor a merge's
// detached integration folder.
var ownedFolders = function (d, scope) { return __awaiter(void 0, void 0, void 0, function () {
    var root;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                root = scope.ctx.projectPath;
                return [4 /*yield*/, (0, worktrees_repository_impl_1.worktreesRepositoryImpl)(d.host, root).list()];
            case 1: return [2 /*return*/, (_a.sent()).flatMap(function (w) {
                    var task = w.path !== root && w.branch ? scope.record.tasks.find(function (t) { return t.branch === w.branch; }) : undefined;
                    return task ? [{ task: task, path: w.path }] : [];
                })];
        }
    });
}); };
exports.ownedFolders = ownedFolders;
// The build folders git itself calls ignored, checked again with
// check-ignore. Never `git clean -X`: that would take .env files too.
var buildFoldersOf = function (d, path) { return __awaiter(void 0, void 0, void 0, function () {
    var listed, _a, ignored, _i, listed_1, folder, checked;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = space_rules_1.buildFoldersIn;
                return [4 /*yield*/, (0, branch_source_1.gitIn)(d, path)(['ls-files', '-z', '--others', '--ignored', '--exclude-standard', '--directory'])];
            case 1:
                listed = _a.apply(void 0, [_b.sent()]);
                ignored = [];
                _i = 0, listed_1 = listed;
                _b.label = 2;
            case 2:
                if (!(_i < listed_1.length)) return [3 /*break*/, 5];
                folder = listed_1[_i];
                return [4 /*yield*/, d.host.run(['git', 'check-ignore', '-q', '--', folder], path)];
            case 3:
                checked = _b.sent();
                if (checked.exitCode > 1)
                    throw new Error("git check-ignore failed (".concat(checked.exitCode, "): ").concat(checked.stderr));
                if (checked.exitCode === 0)
                    ignored.push(folder);
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, ignored];
        }
    });
}); };
exports.buildFoldersOf = buildFoldersOf;
var clearBuildFolders = function (d, path) { return __awaiter(void 0, void 0, void 0, function () {
    var folders, _i, folders_1, folder, removed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.buildFoldersOf)(d, path)];
            case 1:
                folders = _a.sent();
                _i = 0, folders_1 = folders;
                _a.label = 2;
            case 2:
                if (!(_i < folders_1.length)) return [3 /*break*/, 5];
                folder = folders_1[_i];
                return [4 /*yield*/, d.host.run(['rm', '-rf', '--', folder], path)];
            case 3:
                removed = _a.sent();
                if (removed.exitCode !== 0)
                    throw new Error("removing ".concat(folder, " in ").concat(path, " failed: ").concat(removed.stderr));
                d.log.debug("Cleared ".concat(folder, " in ").concat(path));
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, folders];
        }
    });
}); };
exports.clearBuildFolders = clearBuildFolders;
// Disk use in bytes. du still prints what it could read when part of a
// folder is unreadable, so only an empty answer is a failure.
var bytesOf = function (d, cwd, paths) { return __awaiter(void 0, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!paths.length)
                    return [2 /*return*/, 0];
                return [4 /*yield*/, d.host.run(__spreadArray(['du', '-sk', '--'], paths, true), cwd)];
            case 1:
                r = _a.sent();
                if (r.exitCode !== 0 && !r.stdout.trim())
                    throw new Error("du failed in ".concat(cwd, " (").concat(r.exitCode, "): ").concat(r.stderr));
                return [2 /*return*/, r.stdout.split('\n').reduce(function (sum, line) { return sum + (Number.parseInt(line, 10) || 0); }, 0) * 1024];
        }
    });
}); };
// A session can reach a folder through a symlink. A path that no longer
// resolves is safe to compare as written: it cannot match a real folder's.
var realOf = function (path) { return (0, promises_1.realpath)(path).catch(function () { return path; }); };
var isSessionIn = function (d, path) { return __awaiter(void 0, void 0, void 0, function () {
    var real, _i, _a, s, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, realOf(path)];
            case 1:
                real = _d.sent();
                _i = 0;
                return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
            case 2:
                _a = _d.sent();
                _d.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                s = _a[_i];
                _b = (0, session_rules_1.isFresh)(s, d.now());
                if (!_b) return [3 /*break*/, 5];
                return [4 /*yield*/, realOf((_c = s.workingPath) !== null && _c !== void 0 ? _c : s.projectPath)];
            case 4:
                _b = (_d.sent()) === real;
                _d.label = 5;
            case 5:
                if (_b)
                    return [2 /*return*/, true];
                _d.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [2 /*return*/, false];
        }
    });
}); };
// An app update builds with the first matching node_modules it finds, which
// can be a task folder's, so no build folder goes while one runs.
var isUpdateRunning = function (d) { return __awaiter(void 0, void 0, void 0, function () {
    var state, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)((0, update_runner_mjs_1.updateFolder)(d.home))];
            case 1:
                state = _a.sent();
                return [2 /*return*/, !!state && !['idle', 'installed', 'failed'].includes(state.phase)];
            case 2:
                err_1 = _a.sent();
                // A damaged update state cannot say; clearing stays possible, and a
                // broken update can be retried.
                d.log.error('Reading the update state before clearing build folders failed', err_1);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.isUpdateRunning = isUpdateRunning;
var heldOf = function (d_1, scope_1, _a) { return __awaiter(void 0, [d_1, scope_1, _a], void 0, function (d, scope, _b) {
    var _c, _d;
    var task = _b.task, path = _b.path;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _c = space_rules_1.holdOf;
                _d = [scope.record.tasks, task, path, scope.ctx.projectPath];
                return [4 /*yield*/, isSessionIn(d, path)];
            case 1: return [2 /*return*/, _c.apply(void 0, _d.concat([_e.sent()]))];
        }
    });
}); };
exports.heldOf = heldOf;
var mergedOf = function (d, scope, heads, task) { return __awaiter(void 0, void 0, void 0, function () {
    var head, base, _a;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                head = (_b = heads.find(function (h) { return h.branch === task.branch; })) === null || _b === void 0 ? void 0 : _b.head;
                base = (_c = heads.find(function (h) { return h.branch === task.baseBranch; })) === null || _c === void 0 ? void 0 : _c.head;
                _a = !!head && !!base && head !== task.startCommit;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, branch_source_1.ancestor)(d, scope.ctx.projectPath, head, base)];
            case 1:
                _a = (_d.sent());
                _d.label = 2;
            case 2: return [2 /*return*/, _a];
        }
    });
}); };
exports.mergedOf = mergedOf;
// What the Free space sheet decides on, without the sizes.
var folderStateOf = function (d, scope, heads, owned) { return __awaiter(void 0, void 0, void 0, function () {
    var task, path, merged, changed, _a, held;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = owned.task, path = owned.path;
                return [4 /*yield*/, (0, exports.mergedOf)(d, scope, heads, task)];
            case 1:
                merged = _b.sent();
                _a = git_rules_1.parseStatus;
                return [4 /*yield*/, (0, branch_source_1.gitIn)(d, path)(['status', '--porcelain=v1', '-z', '--untracked-files=all'])];
            case 2:
                changed = _a.apply(void 0, [_b.sent()]);
                return [4 /*yield*/, (0, exports.heldOf)(d, scope, owned)];
            case 3:
                held = _b.sent();
                return [2 /*return*/, { merged: merged, changed: changed, held: held, removable: merged && !held && changed.length === 0 }];
        }
    });
}); };
exports.folderStateOf = folderStateOf;
var spaceOf = function (d, scope) { return __awaiter(void 0, void 0, void 0, function () {
    var heads, folders, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, branch_source_1.headsOf)(d, scope.ctx.projectPath)];
            case 1:
                heads = _b.sent();
                _a = branch_source_1.taskReads;
                return [4 /*yield*/, (0, exports.ownedFolders)(d, scope)];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), function (owned) { return __awaiter(void 0, void 0, void 0, function () {
                        var folders, _a;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, exports.buildFoldersOf)(d, owned.path)];
                                case 1:
                                    folders = _c.sent();
                                    _b = { taskId: owned.task.id, title: owned.task.title, branch: owned.task.branch, path: owned.path, folders: folders };
                                    return [4 /*yield*/, bytesOf(d, owned.path, ['.'])];
                                case 2:
                                    _b.bytes = _c.sent();
                                    return [4 /*yield*/, bytesOf(d, owned.path, folders)];
                                case 3:
                                    _a = [(_b.freeable = _c.sent(), _b)];
                                    return [4 /*yield*/, (0, exports.folderStateOf)(d, scope, heads, owned)];
                                case 4: return [2 /*return*/, __assign.apply(void 0, _a.concat([_c.sent()]))];
                            }
                        });
                    }); }])];
            case 3:
                folders = _b.sent();
                return [2 /*return*/, { at: d.now(), folders: folders.sort(function (a, b) { return b.freeable - a.freeable; }) }];
        }
    });
}); };
exports.spaceOf = spaceOf;
