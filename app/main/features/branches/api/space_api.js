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
exports.clearAfterMerge = exports.removeTaskFolder = exports.freeFolderSpace = exports.readFolderSpace = void 0;
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var task_input_1 = require("../../tasks/domain/task_input");
var scope_1 = require("../../tasks/api/scope");
var constants_1 = require("../domain/constants");
var branch_source_1 = require("../data/branch_source");
var operation_store_1 = require("../data/operation_store");
var space_source_1 = require("../data/space_source");
var readFolderSpace = function (d, key) {
    return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.spaceRead, function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = space_source_1.spaceOf;
                _b = [d];
                return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
        }
    }); }); });
};
exports.readFolderSpace = readFolderSpace;
// Every picked folder is checked before any is cleared, so a refusal leaves
// them all as they were.
var freeFolderSpace = function (d, key, paths) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.spaceFree, function () { return __awaiter(void 0, void 0, void 0, function () {
    var initial;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!Array.isArray(paths) || !paths.every(function (p) { return typeof p === 'string'; }))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                if (!paths.length)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.spaceChoose);
                return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                initial = _a.sent();
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, initial.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var scope, owned, picked, _i, picked_1, o, _a, picked_2, o, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 1:
                                    scope = _d.sent();
                                    return [4 /*yield*/, (0, space_source_1.ownedFolders)(d, scope)];
                                case 2:
                                    owned = _d.sent();
                                    picked = __spreadArray([], new Set(paths), true).map(function (path) { return owned.find(function (o) { return o.path === path; }); });
                                    if (picked.some(function (o) { return !o; }))
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                                    return [4 /*yield*/, (0, space_source_1.isUpdateRunning)(d)];
                                case 3:
                                    if (_d.sent())
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.spaceUpdating);
                                    _i = 0, picked_1 = picked;
                                    _d.label = 4;
                                case 4:
                                    if (!(_i < picked_1.length)) return [3 /*break*/, 7];
                                    o = picked_1[_i];
                                    return [4 /*yield*/, (0, space_source_1.heldOf)(d, scope, o)];
                                case 5:
                                    if (_d.sent())
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.spaceHeld);
                                    _d.label = 6;
                                case 6:
                                    _i++;
                                    return [3 /*break*/, 4];
                                case 7:
                                    _a = 0, picked_2 = picked;
                                    _d.label = 8;
                                case 8:
                                    if (!(_a < picked_2.length)) return [3 /*break*/, 11];
                                    o = picked_2[_a];
                                    return [4 /*yield*/, (0, space_source_1.clearBuildFolders)(d, o.path)];
                                case 9:
                                    _d.sent();
                                    _d.label = 10;
                                case 10:
                                    _a++;
                                    return [3 /*break*/, 8];
                                case 11:
                                    _b = space_source_1.spaceOf;
                                    _c = [d];
                                    return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 12: return [2 /*return*/, _b.apply(void 0, _c.concat([_d.sent()]))];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.freeFolderSpace = freeFolderSpace;
// A plain `git worktree remove`, never --force: git itself refuses a folder
// with changes. The branch is kept, and the quest forgets the folder so
// starting it again makes a fresh one.
var removeTaskFolder = function (d, key, taskId) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.spaceRemove, function () { return __awaiter(void 0, void 0, void 0, function () {
    var initial, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                initial = _a.sent();
                id = (0, task_input_1.questIdOf)(taskId);
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, initial.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var scope, owned, state, _a, _b, saved, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 1:
                                    scope = _e.sent();
                                    return [4 /*yield*/, (0, space_source_1.ownedFolders)(d, scope)];
                                case 2:
                                    owned = (_e.sent()).find(function (o) { return o.task.id === id; });
                                    if (!owned)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.missing);
                                    _a = space_source_1.folderStateOf;
                                    _b = [d, scope];
                                    return [4 /*yield*/, (0, branch_source_1.headsOf)(d, scope.ctx.projectPath)];
                                case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_e.sent(), owned]))];
                                case 4:
                                    state = _e.sent();
                                    if (state.held)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.spaceHeld);
                                    if (!state.merged)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.notMerged);
                                    if (state.changed.length)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.folderChanged);
                                    return [4 /*yield*/, (0, space_source_1.isUpdateRunning)(d)];
                                case 5:
                                    if (_e.sent())
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.spaceUpdating);
                                    return [4 /*yield*/, (0, branch_source_1.gitIn)(d, scope.ctx.projectPath)(['worktree', 'remove', '--', owned.path])];
                                case 6:
                                    _e.sent();
                                    d.log.debug("Removed the worktree ".concat(owned.path));
                                    return [4 /*yield*/, scope.deps.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return t.id === id && t.worktreePath === owned.path ? __assign(__assign({}, t), { worktreePath: null }) : t; }) })); })];
                                case 7:
                                    saved = _e.sent();
                                    if (saved === 'unreadable')
                                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                                    _c = space_source_1.spaceOf;
                                    _d = [d];
                                    return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                                case 8: return [2 /*return*/, _c.apply(void 0, _d.concat([_e.sent()]))];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.removeTaskFolder = removeTaskFolder;
// After a merge, the build folders of this quest's folder and of every other
// finished, merged quest's folder go, unless someone is working there. A
// quest is usually still current when its own merge completes, so its folder
// is kept then and cleared at a later merge. A put-back quest keeps its
// install for when it resumes. Returns the lines for the merge's log.
var clearAfterMerge = function (d, key, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var lines, others, scope, heads, _i, _a, owned, own, _b, _c, cleared, err_1, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                lines = [];
                others = 0;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 16, , 17]);
                return [4 /*yield*/, (0, space_source_1.isUpdateRunning)(d)];
            case 2:
                if (_d.sent())
                    return [2 /*return*/, [constants_1.BRANCH_TEXT.keptForUpdate]];
                return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 3:
                scope = _d.sent();
                return [4 /*yield*/, (0, branch_source_1.headsOf)(d, scope.ctx.projectPath)];
            case 4:
                heads = _d.sent();
                _i = 0;
                return [4 /*yield*/, (0, space_source_1.ownedFolders)(d, scope)];
            case 5:
                _a = _d.sent();
                _d.label = 6;
            case 6:
                if (!(_i < _a.length)) return [3 /*break*/, 15];
                owned = _a[_i];
                own = owned.task.id === taskId;
                _d.label = 7;
            case 7:
                _d.trys.push([7, 13, , 14]);
                _b = !own;
                if (!_b) return [3 /*break*/, 10];
                _c = owned.task.state !== 'done';
                if (_c) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, space_source_1.mergedOf)(d, scope, heads, owned.task)];
            case 8:
                _c = !(_d.sent());
                _d.label = 9;
            case 9:
                _b = (_c);
                _d.label = 10;
            case 10:
                if (_b)
                    return [3 /*break*/, 14];
                return [4 /*yield*/, (0, space_source_1.heldOf)(d, scope, owned)];
            case 11:
                if (_d.sent()) {
                    if (own)
                        lines.push(constants_1.BRANCH_TEXT.keptAfterMerge);
                    return [3 /*break*/, 14];
                }
                return [4 /*yield*/, (0, space_source_1.clearBuildFolders)(d, owned.path)];
            case 12:
                cleared = _d.sent();
                if (own && cleared.length)
                    lines.push(constants_1.BRANCH_TEXT.clearedAfterMerge(cleared));
                if (!own && cleared.length)
                    others++;
                return [3 /*break*/, 14];
            case 13:
                err_1 = _d.sent();
                // The merge is already done; Free space on the Branches page can try again.
                d.log.error("Clearing build folders in ".concat(owned.path, " after a merge failed"), err_1);
                return [3 /*break*/, 14];
            case 14:
                _i++;
                return [3 /*break*/, 6];
            case 15: return [3 /*break*/, 17];
            case 16:
                err_2 = _d.sent();
                // As above: the merge stands whatever happens here.
                d.log.error('Clearing build folders after a merge failed', err_2);
                return [3 /*break*/, 17];
            case 17:
                if (others)
                    lines.push(constants_1.BRANCH_TEXT.clearedMergedAfterMerge(others));
                return [2 /*return*/, lines];
        }
    });
}); };
exports.clearAfterMerge = clearAfterMerge;
