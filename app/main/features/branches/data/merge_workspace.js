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
exports.workspaceOf = exports.safeResolutionPath = exports.conflictEntries = exports.workspacePath = void 0;
var promises_1 = require("node:fs/promises");
var node_crypto_1 = require("node:crypto");
var node_path_1 = require("node:path");
var reply_1 = require("../../../core/reply");
var constants_1 = require("../domain/constants");
var checks_source_1 = require("./checks_source");
var git_rules_1 = require("../domain/git_rules");
var branch_source_1 = require("./branch_source");
var operation_store_1 = require("./operation_store");
var workspacePath = function (d, op) { return "".concat((0, operation_store_1.operationPath)(d, op.key, op.id), "/worktree"); };
exports.workspacePath = workspacePath;
var conflictEntries = function (text) { return text.split('\0').filter(Boolean).map(function (line) {
    var tab = line.indexOf('\t');
    var _a = line.slice(0, tab).split(' '), _b = _a[0], mode = _b === void 0 ? '' : _b, _c = _a[1], oid = _c === void 0 ? '' : _c, _d = _a[2], stage = _d === void 0 ? '' : _d;
    return { mode: mode, oid: oid, stage: Number(stage), path: line.slice(tab + 1) };
}); };
exports.conflictEntries = conflictEntries;
// Never follow a symlink (including a symlink in an ancestor folder) when
// writing a resolution. Git blobs can still be selected safely via the index.
var safeResolutionPath = function (folder, path) { return __awaiter(void 0, void 0, void 0, function () {
    var root, file, parent, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, git_rules_1.isFile)(path))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.unsafePath);
                return [4 /*yield*/, (0, promises_1.realpath)(folder)];
            case 1:
                root = _a.sent();
                file = (0, node_path_1.resolve)(root, path);
                if ((0, node_path_1.relative)(root, file).startsWith('..'))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.unsafePath);
                return [4 /*yield*/, (0, promises_1.realpath)((0, node_path_1.dirname)(file))];
            case 2:
                parent = _a.sent();
                if (parent !== root && !parent.startsWith(root + '/'))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.unsafePath);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, promises_1.lstat)(file)];
            case 4:
                if (!(_a.sent()).isFile())
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.unsafePath);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                if (err_1.code !== 'ENOENT')
                    throw err_1;
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, (0, node_path_1.join)(parent, file.slice(file.lastIndexOf('/') + 1))];
        }
    });
}); };
exports.safeResolutionPath = safeResolutionPath;
var workspaceOf = function (d, root, saved) { return __awaiter(void 0, void 0, void 0, function () {
    var op, path, git, head, parents, _a, _b, _c, _d, entries, _e, conflicts, _loop_1, _i, _f, name_1, mergeHead, diff, unstaged, untracked, _loop_2, _g, _h, name_2, metadata, links, _j, _k, _loop_3, _l, links_1, link, tree, original, temporary, result, _m, _o, file, committedTree, _p, availableChecks, _q, checks, checksCurrent;
    var _r, _s, _t, _u, _v;
    return __generator(this, function (_w) {
        switch (_w.label) {
            case 0:
                op = __assign({}, saved);
                path = (0, exports.workspacePath)(d, op);
                return [4 /*yield*/, d.host.exists(path)];
            case 1:
                if (!(_w.sent()) || op.stage === 'abandoned')
                    return [2 /*return*/, { operation: op, conflicts: [], diff: '', truncated: false, approval: null }];
                git = (0, branch_source_1.gitIn)(d, path);
                return [4 /*yield*/, git(['rev-parse', 'HEAD'])];
            case 2:
                head = (_w.sent()).trim();
                if (!(['committing', 'applying', 'merged'].includes(op.stage) && head !== op.targetHead)) return [3 /*break*/, 7];
                return [4 /*yield*/, git(['show', '-s', '--format=%P', head])];
            case 3:
                parents = (_w.sent()).trim().split(' ');
                if (parents[0] !== op.targetHead || parents[1] !== op.sourceHead || parents.length !== 2)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                op.commit = head;
                _a = op;
                return [4 /*yield*/, git(['show', '-s', '--format=%B', head])];
            case 4:
                _a.message = (_w.sent()).trimEnd();
                _b = op;
                _c = branch_source_1.ancestor;
                _d = [d, root, head];
                return [4 /*yield*/, (0, branch_source_1.headOf)(d, root, op.target)];
            case 5: return [4 /*yield*/, _c.apply(void 0, _d.concat([_w.sent()]))];
            case 6:
                _b.stage = (_w.sent()) ? 'merged' : 'applying';
                _w.label = 7;
            case 7:
                _e = exports.conflictEntries;
                return [4 /*yield*/, git(['ls-files', '-u', '-z'])];
            case 8:
                entries = _e.apply(void 0, [_w.sent()]);
                conflicts = [];
                _loop_1 = function (name_1) {
                    var parts, editable, texts, result, _x, _y, err_2;
                    return __generator(this, function (_z) {
                        switch (_z.label) {
                            case 0:
                                parts = entries.filter(function (e) { return e.path === name_1; });
                                editable = parts.every(function (p) { return p.mode === '100644' || p.mode === '100755'; });
                                return [4 /*yield*/, Promise.all([1, 2, 3].map(function (stage) { return __awaiter(void 0, void 0, void 0, function () {
                                        var entry, size, _a, text;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    entry = parts.find(function (p) { return p.stage === stage; });
                                                    if (!entry)
                                                        return [2 /*return*/, null];
                                                    _a = Number;
                                                    return [4 /*yield*/, git(['cat-file', '-s', entry.oid])];
                                                case 1:
                                                    size = _a.apply(void 0, [_b.sent()]);
                                                    if (size > constants_1.BRANCH_LIMITS.conflict) {
                                                        editable = false;
                                                        return [2 /*return*/, null];
                                                    }
                                                    return [4 /*yield*/, git(['cat-file', 'blob', entry.oid])];
                                                case 2:
                                                    text = _b.sent();
                                                    if (text.includes('\0') || text.includes('\ufffd')) {
                                                        editable = false;
                                                        return [2 /*return*/, null];
                                                    }
                                                    return [2 /*return*/, text];
                                            }
                                        });
                                    }); }))];
                            case 1:
                                texts = _z.sent();
                                result = null;
                                if (!editable) return [3 /*break*/, 7];
                                _z.label = 2;
                            case 2:
                                _z.trys.push([2, 5, , 6]);
                                _y = (_x = d.host).read;
                                return [4 /*yield*/, (0, exports.safeResolutionPath)(path, name_1)];
                            case 3: return [4 /*yield*/, _y.apply(_x, [_z.sent()])];
                            case 4:
                                result = _z.sent();
                                return [3 /*break*/, 6];
                            case 5:
                                err_2 = _z.sent();
                                if (err_2.code !== 'ENOENT') {
                                    editable = false;
                                    d.log.warn("Conflict result unavailable: ".concat(String(err_2)));
                                }
                                return [3 /*break*/, 6];
                            case 6:
                                if (((_r = result === null || result === void 0 ? void 0 : result.length) !== null && _r !== void 0 ? _r : 0) > constants_1.BRANCH_LIMITS.conflict) {
                                    editable = false;
                                    result = null;
                                }
                                _z.label = 7;
                            case 7:
                                conflicts.push({ path: name_1, base: (_s = texts[0]) !== null && _s !== void 0 ? _s : null, target: (_t = texts[1]) !== null && _t !== void 0 ? _t : null, source: (_u = texts[2]) !== null && _u !== void 0 ? _u : null, result: result, editable: editable });
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _f = __spreadArray([], new Set(entries.map(function (e) { return e.path; })), true);
                _w.label = 9;
            case 9:
                if (!(_i < _f.length)) return [3 /*break*/, 12];
                name_1 = _f[_i];
                return [5 /*yield**/, _loop_1(name_1)];
            case 10:
                _w.sent();
                _w.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 9];
            case 12:
                if (!(['preparing', 'conflicts', 'ready', 'committing'].includes(op.stage) && !op.commit)) return [3 /*break*/, 14];
                return [4 /*yield*/, d.host.run(['git', 'rev-parse', '-q', '--verify', 'MERGE_HEAD'], path)];
            case 13:
                mergeHead = _w.sent();
                if (mergeHead.exitCode === 0 && mergeHead.stdout.trim() === op.sourceHead)
                    op.stage = conflicts.length ? 'conflicts' : 'ready';
                else
                    op.stage = 'failed';
                _w.label = 14;
            case 14: return [4 /*yield*/, git(['diff', '--no-ext-diff', '--no-textconv', op.targetHead, '--'])];
            case 15:
                diff = _w.sent();
                return [4 /*yield*/, git(['diff', '--no-ext-diff', '--no-textconv', '--'])];
            case 16:
                unstaged = _w.sent();
                return [4 /*yield*/, git(['ls-files', '--others', '--exclude-standard', '--directory', '-z'])];
            case 17:
                untracked = (_w.sent()).split('\0').filter(Boolean);
                _loop_2 = function (name_2) {
                    var file, _0, _1, _2;
                    return __generator(this, function (_3) {
                        switch (_3.label) {
                            case 0:
                                if (!/(^|\/)node_modules\/$/.test(name_2) || !(0, git_rules_1.isFile)(name_2.slice(0, -1)))
                                    return [2 /*return*/, "continue"];
                                file = (0, node_path_1.resolve)(path, name_2);
                                return [4 /*yield*/, (0, promises_1.lstat)(file)];
                            case 1:
                                _0 = (_3.sent()).isDirectory();
                                if (!_0) return [3 /*break*/, 4];
                                return [4 /*yield*/, (0, promises_1.realpath)(file)];
                            case 2:
                                _2 = (_1 = (_3.sent())).startsWith;
                                return [4 /*yield*/, (0, promises_1.realpath)(path)];
                            case 3:
                                _0 = _2.apply(_1, [(_3.sent()) + '/']);
                                _3.label = 4;
                            case 4:
                                if (_0)
                                    untracked = untracked.filter(function (p) { return p !== name_2; });
                                return [2 /*return*/];
                        }
                    });
                };
                _g = 0, _h = __spreadArray([], untracked, true);
                _w.label = 18;
            case 18:
                if (!(_g < _h.length)) return [3 /*break*/, 21];
                name_2 = _h[_g];
                return [5 /*yield**/, _loop_2(name_2)];
            case 19:
                _w.sent();
                _w.label = 20;
            case 20:
                _g++;
                return [3 /*break*/, 18];
            case 21:
                metadata = "".concat((0, operation_store_1.operationPath)(d, op.key, op.id), "/dependencies.json");
                return [4 /*yield*/, d.host.exists(metadata)];
            case 22:
                if (!_w.sent()) return [3 /*break*/, 27];
                _k = (_j = JSON).parse;
                return [4 /*yield*/, d.host.read(metadata)];
            case 23:
                links = _k.apply(_j, [_w.sent()]);
                _loop_3 = function (link) {
                    var file, _4;
                    return __generator(this, function (_5) {
                        switch (_5.label) {
                            case 0:
                                if (!(0, git_rules_1.isFile)(link.path) || link.path.split('/').at(-1) !== 'node_modules' || !untracked.includes(link.path))
                                    return [2 /*return*/, "continue"];
                                file = (0, node_path_1.resolve)(path, link.path);
                                return [4 /*yield*/, (0, promises_1.lstat)(file)];
                            case 1:
                                _4 = (_5.sent()).isSymbolicLink();
                                if (!_4) return [3 /*break*/, 3];
                                return [4 /*yield*/, (0, promises_1.realpath)(file)];
                            case 2:
                                _4 = (_5.sent()) === link.target;
                                _5.label = 3;
                            case 3:
                                if (_4)
                                    untracked = untracked.filter(function (p) { return p !== link.path; });
                                return [2 /*return*/];
                        }
                    });
                };
                _l = 0, links_1 = links;
                _w.label = 24;
            case 24:
                if (!(_l < links_1.length)) return [3 /*break*/, 27];
                link = links_1[_l];
                return [5 /*yield**/, _loop_3(link)];
            case 25:
                _w.sent();
                _w.label = 26;
            case 26:
                _l++;
                return [3 /*break*/, 24];
            case 27:
                tree = null;
                if (!!conflicts.length) return [3 /*break*/, 37];
                return [4 /*yield*/, git(['rev-parse', '--path-format=absolute', '--git-path', 'index'])];
            case 28:
                original = (_w.sent()).trim();
                temporary = "".concat((0, operation_store_1.operationPath)(d, op.key, op.id), "/index-").concat((0, node_crypto_1.randomUUID)());
                _w.label = 29;
            case 29:
                _w.trys.push([29, , 32, 37]);
                return [4 /*yield*/, (0, promises_1.copyFile)(original, temporary)];
            case 30:
                _w.sent();
                return [4 /*yield*/, d.host.run(['env', "GIT_INDEX_FILE=".concat(temporary), 'git', 'write-tree'], path)];
            case 31:
                result = _w.sent();
                if (result.exitCode)
                    throw new Error("Reading prepared tree failed: ".concat(result.stderr));
                tree = result.stdout.trim();
                return [3 /*break*/, 37];
            case 32:
                _m = 0, _o = [temporary, temporary + '.lock'];
                _w.label = 33;
            case 33:
                if (!(_m < _o.length)) return [3 /*break*/, 36];
                file = _o[_m];
                return [4 /*yield*/, d.host.remove(file)];
            case 34:
                if ((_w.sent()).exitCode)
                    d.log.warn('Could not remove a temporary review index');
                _w.label = 35;
            case 35:
                _m++;
                return [3 /*break*/, 33];
            case 36: return [7 /*endfinally*/];
            case 37:
                if (!op.commit) return [3 /*break*/, 39];
                return [4 /*yield*/, git(['rev-parse', "".concat(op.commit, "^{tree}")])];
            case 38:
                _p = (_w.sent()).trim();
                return [3 /*break*/, 40];
            case 39:
                _p = null;
                _w.label = 40;
            case 40:
                committedTree = _p;
                op.tree = tree;
                if (!tree) return [3 /*break*/, 42];
                return [4 /*yield*/, (0, checks_source_1.discoverChecks)(d, path, tree)];
            case 41:
                _q = _w.sent();
                return [3 /*break*/, 43];
            case 42:
                _q = [];
                _w.label = 43;
            case 43:
                availableChecks = _q;
                return [4 /*yield*/, (0, checks_source_1.readChecks)(d, op)];
            case 44:
                checks = _w.sent();
                checksCurrent = tree !== null && (0, checks_source_1.checksPassed)(checks, tree, availableChecks);
                return [2 /*return*/, { availableChecks: availableChecks, checks: checks, checksCurrent: checksCurrent, operation: op, conflicts: conflicts, diff: diff.slice(0, constants_1.BRANCH_LIMITS.diff), truncated: diff.length > constants_1.BRANCH_LIMITS.diff,
                        approval: (op.stage === 'ready' || op.stage === 'applying') && tree && !unstaged && !untracked.length && (!committedTree || committedTree === tree) ? (0, branch_source_1.digest)(op.id + op.sourceHead + op.targetHead + tree + ((_v = op.commit) !== null && _v !== void 0 ? _v : '')) : null }];
        }
    });
}); };
exports.workspaceOf = workspaceOf;
