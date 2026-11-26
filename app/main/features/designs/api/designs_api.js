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
exports.designsApi = void 0;
var node_crypto_1 = require("node:crypto");
var designs_1 = require("../../../../shared/designs");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var scope_1 = require("../../tasks/api/scope");
var design_files_1 = require("../domain/design_files");
var VERSION = 'version.json';
var COMMENTS = 'comments.json';
var DESIGN = '.design.json';
var stampOf = function (text) { return (0, node_crypto_1.createHash)('sha1').update(text).digest('hex'); };
var jsonOf = function (value) { return "".concat(JSON.stringify(value, null, 2), "\n"); };
var fileOf = function (id) { return "".concat(id).concat(DESIGN); };
var parserOf = function (file) {
    if (file === VERSION)
        return design_files_1.parseVersion;
    if (file === COMMENTS)
        return design_files_1.parseComments;
    return design_files_1.parseScene;
};
var folderArg = function (value) {
    if (!(0, designs_1.isFolderName)(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.unknownDesign);
    return value;
};
var idArg = function (value) {
    if (!(0, designs_1.isDesignId)(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.unknownDesign);
    return value;
};
// Designs in the order the version lists them, then any it doesn't, by name.
var idsIn = function (files, listed) {
    var present = files.filter(function (f) { return f.endsWith(DESIGN); }).map(function (f) { return f.slice(0, -DESIGN.length); }).filter(designs_1.isDesignId);
    var first = listed.filter(function (id) { return present.includes(id); });
    return __spreadArray(__spreadArray([], first, true), present.filter(function (id) { return !first.includes(id); }).sort(), true);
};
var counted = function (comments) {
    var _a, _b;
    var sent = comments.filter(function (c) { return c.sentTo !== null; });
    return { open: comments.filter(designs_1.isOpen).length, resolved: comments.filter(function (c) { return c.resolved !== null && c.sentTo === null; }).length, sent: sent.length, sentTo: (_b = (_a = sent.at(-1)) === null || _a === void 0 ? void 0 : _a.sentTo) !== null && _b !== void 0 ? _b : null };
};
var designsApi = function (d) {
    var now = function () { return new Date(d.now()).toISOString(); };
    var realmOf = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var scope;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    scope = _a.sent();
                    return [2 /*return*/, { key: scope.key, path: scope.ctx.projectPath, base: "".concat(scope.ctx.projectPath, "/").concat(designs_1.DESIGNS_FOLDER) }];
            }
        });
    }); };
    // The last good copy lives outside the realm: beside the file it would be an
    // uncommitted file of its own, and hold Start.
    var backupOf = function (realm, folder, file) { return "".concat(d.home, "/.queue-tea/designs/").concat(realm.key, "/").concat(folder, "/").concat(file); };
    var keepBackup = function (realm, folder, file, text) { return __awaiter(void 0, void 0, void 0, function () {
        var backup, _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    backup = backupOf(realm, folder, file);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, d.host.exists(backup)];
                case 2:
                    _a = (_b.sent());
                    if (!_a) return [3 /*break*/, 4];
                    return [4 /*yield*/, d.host.read(backup)];
                case 3:
                    _a = (_b.sent()) === text;
                    _b.label = 4;
                case 4:
                    if (_a)
                        return [2 /*return*/];
                    return [4 /*yield*/, d.host.write(backup, text)];
                case 5:
                    _b.sent();
                    d.log.debug("designs: kept the last good copy of ".concat(folder, "/").concat(file));
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    // The copy only helps mend a file later; the read or save it rides on
                    // matters more, so a copy that can't be kept is logged and let go.
                    d.log.warn("designs: couldn't keep the last good copy of ".concat(folder, "/").concat(file, ": ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var problemOf = function (realm, folder, file, detail) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        file: "".concat(designs_1.DESIGNS_FOLDER, "/").concat(folder, "/").concat(file),
                        detail: detail
                    };
                    return [4 /*yield*/, d.host.modifiedAt(backupOf(realm, folder, file))];
                case 1: return [2 /*return*/, (_a.backupAt = _b.sent(),
                        _a)
                    // Written whole beside the file, then moved over it, so a crash never leaves
                    // half a file. A file that read cleanly is kept as the last good copy first.
                ];
            }
        });
    }); };
    // Written whole beside the file, then moved over it, so a crash never leaves
    // half a file. A file that read cleanly is kept as the last good copy first.
    var writeFile = function (realm, folder, file, text) { return __awaiter(void 0, void 0, void 0, function () {
        var path, old, tmp, moved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = "".concat(realm.base, "/").concat(folder, "/").concat(file);
                    return [4 /*yield*/, d.host.exists(path)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, d.host.read(path)];
                case 2:
                    old = _a.sent();
                    if (!parserOf(file)(old).ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, keepBackup(realm, folder, file, old)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    tmp = "".concat(path, ".tmp");
                    return [4 /*yield*/, d.host.write(tmp, text)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, d.host.move(tmp, path)];
                case 6:
                    moved = _a.sent();
                    if (moved.exitCode !== 0)
                        throw new Error(moved.stderr);
                    d.log.debug("designs: wrote ".concat(folder, "/").concat(file));
                    return [2 /*return*/];
            }
        });
    }); };
    var readParsed = function (realm, folder, file, parse) { return __awaiter(void 0, void 0, void 0, function () {
        var path, text, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = "".concat(realm.base, "/").concat(folder, "/").concat(file);
                    return [4 /*yield*/, d.host.exists(path)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, d.host.read(path)];
                case 2:
                    text = _a.sent();
                    d.log.debug("designs: read ".concat(folder, "/").concat(file));
                    parsed = parse(text);
                    if (!parsed.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, keepBackup(realm, folder, file, text)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, parsed];
            }
        });
    }); };
    var versionOf = function (realm, folder) { return __awaiter(void 0, void 0, void 0, function () {
        var parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readParsed(realm, folder, VERSION, design_files_1.parseVersion)];
                case 1:
                    parsed = _a.sent();
                    if (parsed === null || !parsed.ok)
                        throw new reply_1.Refusal(messages_1.MESSAGES.brokenVersion("".concat(designs_1.DESIGNS_FOLDER, "/").concat(folder, "/").concat(VERSION)));
                    return [2 /*return*/, parsed.value];
            }
        });
    }); };
    var commentsOf = function (realm, folder) { return __awaiter(void 0, void 0, void 0, function () {
        var parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readParsed(realm, folder, COMMENTS, design_files_1.parseComments)];
                case 1:
                    parsed = _a.sent();
                    if (parsed === null)
                        return [2 /*return*/, { format: 1, comments: [] }];
                    if (!parsed.ok)
                        throw new reply_1.Refusal(messages_1.MESSAGES.brokenComments("".concat(designs_1.DESIGNS_FOLDER, "/").concat(folder, "/").concat(COMMENTS)));
                    return [2 /*return*/, parsed.value];
            }
        });
    }); };
    // A version's row in the history, and when it was made for sorting: a row
    // that doesn't read sorts by when its file last changed.
    var rowOf = function (realm, folder) { return __awaiter(void 0, void 0, void 0, function () {
        var files, blank, designCount, at, version, _a, _b, v, comments, made;
        var _c, _d, _e, _f;
        var _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, d.host.list("".concat(realm.base, "/").concat(folder))];
                case 1:
                    files = _h.sent();
                    blank = { folder: folder, label: folder, made: null, by: null, from: null, next: null, approved: null, open: 0, resolved: 0, sent: 0, sentTo: null };
                    designCount = idsIn(files, []).length;
                    return [4 /*yield*/, d.host.modifiedAt("".concat(realm.base, "/").concat(folder, "/").concat(VERSION))];
                case 2:
                    at = (_g = (_h.sent())) !== null && _g !== void 0 ? _g : 0;
                    return [4 /*yield*/, readParsed(realm, folder, VERSION, design_files_1.parseVersion)];
                case 3:
                    version = _h.sent();
                    if (!(version === null)) return [3 /*break*/, 5];
                    _c = {};
                    _a = [__assign({}, blank)];
                    _d = { designCount: designCount };
                    return [4 /*yield*/, problemOf(realm, folder, VERSION, messages_1.MESSAGES.designFaults.noVersionFile)];
                case 4: return [2 /*return*/, (_c.row = __assign.apply(void 0, _a.concat([(_d.problem = _h.sent(), _d)])), _c.at = at, _c)];
                case 5:
                    if (!!version.ok) return [3 /*break*/, 7];
                    _e = {};
                    _b = [__assign({}, blank)];
                    _f = { designCount: designCount };
                    return [4 /*yield*/, problemOf(realm, folder, VERSION, version.detail)];
                case 6: return [2 /*return*/, (_e.row = __assign.apply(void 0, _b.concat([(_f.problem = _h.sent(), _f)])), _e.at = at, _e)];
                case 7:
                    v = version.value;
                    return [4 /*yield*/, readParsed(realm, folder, COMMENTS, design_files_1.parseComments)];
                case 8:
                    comments = _h.sent();
                    made = v.made === null ? Number.NaN : Date.parse(v.made);
                    return [2 /*return*/, {
                            row: __assign({ folder: folder, label: v.label, made: v.made, by: v.by, from: v.from, next: v.next, approved: v.approved, designCount: designCount, problem: null }, counted((comments === null || comments === void 0 ? void 0 : comments.ok) === true ? comments.value.comments : [])),
                            at: Number.isNaN(made) ? at : made,
                        }];
            }
        });
    }); };
    var foldersOf = function (realm) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d.listFolders(realm.base)];
            case 1: return [2 /*return*/, (_a.sent()).filter(designs_1.isFolderName)
                // One change at a time per realm, so two quick saves can't lose each other.
            ];
        }
    }); }); };
    // One change at a time per realm, so two quick saves can't lose each other.
    var queues = new Map();
    var inTurn = function (key, work) {
        var _a;
        var name = String(key);
        var run = ((_a = queues.get(name)) !== null && _a !== void 0 ? _a : Promise.resolve()).then(work, work);
        queues.set(name, run.then(function () { return undefined; }, function () { return undefined; }));
        return run;
    };
    var authorOf = function (realm) { return __awaiter(void 0, void 0, void 0, function () {
        var named, first;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, d.host.run(['git', 'config', 'user.name'], realm.path)];
                case 1:
                    named = _a.sent();
                    first = named.exitCode === 0 ? named.stdout.trim().split(/\s+/)[0] : '';
                    return [2 /*return*/, first === undefined || first === '' ? 'You' : first];
            }
        });
    }); };
    var uncommittedIn = function (realm, folder) { return __awaiter(void 0, void 0, void 0, function () {
        var status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, d.host.run(['git', 'status', '--porcelain', '--untracked-files=all', '--', "".concat(designs_1.DESIGNS_FOLDER, "/").concat(folder)], realm.path)];
                case 1:
                    status = _a.sent();
                    if (status.exitCode !== 0) {
                        // Not a git folder, or git isn't there: nothing to warn about committing.
                        d.log.debug("designs: git status failed in ".concat(realm.path, ": ").concat(status.stderr));
                        return [2 /*return*/, 0];
                    }
                    return [2 /*return*/, status.stdout.split('\n').filter(function (line) { return line.trim() !== ''; }).length];
            }
        });
    }); };
    var changeComments = function (key, folder, failure, work) {
        return inTurn(key, function () {
            return (0, reply_1.reply)(d.log, failure, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, name, next, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _b.sent();
                            name = folderArg(folder);
                            return [4 /*yield*/, versionOf(realm, name)];
                        case 2:
                            _b.sent();
                            _a = work;
                            return [4 /*yield*/, commentsOf(realm, name)];
                        case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), realm, name])];
                        case 4:
                            next = _b.sent();
                            return [4 /*yield*/, writeFile(realm, name, COMMENTS, jsonOf(next))];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, next.comments];
                    }
                });
            }); });
        });
    };
    return {
        readDesigns: function (key) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readDesigns, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, rows, _a, _b, has, coming;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _c.sent();
                            _b = (_a = Promise).all;
                            return [4 /*yield*/, foldersOf(realm)];
                        case 2: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (folder) { return rowOf(realm, folder); })])];
                        case 3:
                            rows = (_c.sent()).sort(function (a, b) { return b.at - a.at; }).map(function (r) { return r.row; });
                            has = function (label) { return rows.some(function (r) { return r.folder === (0, designs_1.folderOf)(label); }); };
                            coming = rows.flatMap(function (r) { return (r.next !== null && !has(r.next.label) ? [__assign(__assign({}, r.next), { from: r.label })] : []); });
                            return [2 /*return*/, { versions: rows, coming: coming }];
                    }
                });
            }); });
        },
        readDesignVersion: function (key, folder) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readDesigns, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, name, version, comments, commentsProblem, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _d.sent();
                            name = folderArg(folder);
                            return [4 /*yield*/, versionOf(realm, name)];
                        case 2:
                            version = _d.sent();
                            return [4 /*yield*/, readParsed(realm, name, COMMENTS, design_files_1.parseComments)];
                        case 3:
                            comments = _d.sent();
                            if (!(comments !== null && !comments.ok)) return [3 /*break*/, 5];
                            return [4 /*yield*/, problemOf(realm, name, COMMENTS, comments.detail)];
                        case 4:
                            _a = _d.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            _a = null;
                            _d.label = 6;
                        case 6:
                            commentsProblem = _a;
                            _c = {
                                folder: name,
                                label: version.label
                            };
                            _b = idsIn;
                            return [4 /*yield*/, d.host.list("".concat(realm.base, "/").concat(name))];
                        case 7:
                            _c.designs = _b.apply(void 0, [_d.sent(), version.designs]),
                                _c.comments = (comments === null || comments === void 0 ? void 0 : comments.ok) === true ? comments.value.comments : [],
                                _c.commentsProblem = commentsProblem;
                            return [4 /*yield*/, uncommittedIn(realm, name)];
                        case 8: return [2 /*return*/, (_c.uncommitted = _d.sent(),
                                _c)];
                    }
                });
            }); });
        },
        readDesign: function (key, folder, id) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readDesign, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, name, file, path, text, parsed;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _c.sent();
                            name = folderArg(folder);
                            file = fileOf(idArg(id));
                            path = "".concat(realm.base, "/").concat(name, "/").concat(file);
                            return [4 /*yield*/, d.host.exists(path)];
                        case 2:
                            if (!(_c.sent()))
                                throw new reply_1.Refusal(messages_1.MESSAGES.designGone);
                            return [4 /*yield*/, d.host.read(path)];
                        case 3:
                            text = _c.sent();
                            d.log.debug("designs: read ".concat(name, "/").concat(file));
                            if (!(text.length > designs_1.LIMITS.bytes)) return [3 /*break*/, 5];
                            _a = { kind: 'broken' };
                            return [4 /*yield*/, problemOf(realm, name, file, messages_1.MESSAGES.designFaults.tooLarge)];
                        case 4: return [2 /*return*/, (_a.problem = _c.sent(), _a)];
                        case 5:
                            parsed = (0, design_files_1.parseScene)(text);
                            if (!!parsed.ok) return [3 /*break*/, 7];
                            _b = { kind: 'broken' };
                            return [4 /*yield*/, problemOf(realm, name, file, parsed.detail)];
                        case 6: return [2 /*return*/, (_b.problem = _c.sent(), _b)];
                        case 7: return [4 /*yield*/, keepBackup(realm, name, file, text)];
                        case 8:
                            _c.sent();
                            return [2 /*return*/, { kind: 'ready', scene: parsed.value, stamp: stampOf(text) }];
                    }
                });
            }); });
        },
        // stamp is the file as the editor read it. When the file on disk is
        // something else now, it's left alone and the window is told.
        saveDesign: function (key, folder, id, scene, stamp) {
            return inTurn(key, function () {
                return (0, reply_1.reply)(d.log, messages_1.MESSAGES.saveDesign, function () { return __awaiter(void 0, void 0, void 0, function () {
                    var realm, name, file, checked, path, _a, _b, text;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, realmOf(key)];
                            case 1:
                                realm = _c.sent();
                                name = folderArg(folder);
                                file = fileOf(idArg(id));
                                checked = (0, design_files_1.checkScene)(scene);
                                if (!checked.ok)
                                    throw new reply_1.Refusal(messages_1.MESSAGES.badScene);
                                path = "".concat(realm.base, "/").concat(name, "/").concat(file);
                                return [4 /*yield*/, d.host.exists(path)];
                            case 2:
                                _a = !(_c.sent());
                                if (_a) return [3 /*break*/, 4];
                                _b = stampOf;
                                return [4 /*yield*/, d.host.read(path)];
                            case 3:
                                _a = _b.apply(void 0, [_c.sent()]) !== stamp;
                                _c.label = 4;
                            case 4:
                                if (_a)
                                    return [2 /*return*/, { kind: 'changed' }];
                                text = jsonOf(__assign(__assign({}, checked.value), { edited: { by: 'you', at: now() } }));
                                return [4 /*yield*/, writeFile(realm, name, file, text)];
                            case 5:
                                _c.sent();
                                return [2 /*return*/, { kind: 'saved', stamp: stampOf(text), at: d.now() }];
                        }
                    });
                }); });
            });
        },
        // Your edits beside the file that changed under them, as "<name> (yours)".
        saveDesignCopy: function (key, folder, id, scene) {
            return inTurn(key, function () {
                return (0, reply_1.reply)(d.log, messages_1.MESSAGES.saveDesign, function () { return __awaiter(void 0, void 0, void 0, function () {
                    var realm, name, of, checked, version, ids, _a, _b, copy, listed;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, realmOf(key)];
                            case 1:
                                realm = _c.sent();
                                name = folderArg(folder);
                                of = idArg(id);
                                checked = (0, design_files_1.checkScene)(scene);
                                if (!checked.ok)
                                    throw new reply_1.Refusal(messages_1.MESSAGES.badScene);
                                return [4 /*yield*/, versionOf(realm, name)];
                            case 2:
                                version = _c.sent();
                                _a = Set.bind;
                                _b = idsIn;
                                return [4 /*yield*/, d.host.list("".concat(realm.base, "/").concat(name))];
                            case 3:
                                ids = new (_a.apply(Set, [void 0, _b.apply(void 0, [_c.sent(), []])]))();
                                copy = (0, designs_1.freeId)("".concat(of, "-yours"), ids);
                                return [4 /*yield*/, writeFile(realm, name, fileOf(copy), jsonOf(__assign(__assign({}, checked.value), { name: "".concat(checked.value.name, " (yours)"), edited: { by: 'you', at: now() } })))];
                            case 4:
                                _c.sent();
                                listed = version.designs.includes(of) ? version.designs : __spreadArray(__spreadArray([], version.designs, true), [of], false);
                                return [4 /*yield*/, writeFile(realm, name, VERSION, jsonOf(__assign(__assign({}, version), { designs: listed.flatMap(function (each) { return (each === of ? [each, copy] : [each]); }) })))];
                            case 5:
                                _c.sent();
                                return [2 /*return*/, copy];
                        }
                    });
                }); });
            });
        },
        // file: 'version', 'comments' or a design's id.
        restoreDesignFile: function (key, folder, file) {
            return inTurn(key, function () {
                return (0, reply_1.reply)(d.log, messages_1.MESSAGES.restoreDesign, function () { return __awaiter(void 0, void 0, void 0, function () {
                    var realm, name, target, backup, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, realmOf(key)];
                            case 1:
                                realm = _c.sent();
                                name = folderArg(folder);
                                target = file === 'version' ? VERSION : file === 'comments' ? COMMENTS : fileOf(idArg(file));
                                backup = backupOf(realm, name, target);
                                return [4 /*yield*/, d.host.exists(backup)];
                            case 2:
                                if (!(_c.sent()))
                                    throw new reply_1.Refusal(messages_1.MESSAGES.noBackup);
                                _a = writeFile;
                                _b = [realm, name, target];
                                return [4 /*yield*/, d.host.read(backup)];
                            case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                            case 4:
                                _c.sent();
                                return [2 /*return*/, null];
                        }
                    });
                }); });
            });
        },
        addDesignComment: function (key, folder, input) {
            return changeComments(key, folder, messages_1.MESSAGES.addComment, function (file, realm, name) { return __awaiter(void 0, void 0, void 0, function () {
                var v, design, text, on, comment;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            v = (input !== null && input !== void 0 ? input : {});
                            design = idArg(v.design);
                            return [4 /*yield*/, d.host.exists("".concat(realm.base, "/").concat(name, "/").concat(fileOf(design)))];
                        case 1:
                            if (!(_b.sent()))
                                throw new reply_1.Refusal(messages_1.MESSAGES.designGone);
                            text = typeof v.text === 'string' ? v.text.trim() : '';
                            if (text === '')
                                throw new reply_1.Refusal(messages_1.MESSAGES.commentRequired);
                            if (text.length > designs_1.LIMITS.comment)
                                throw new reply_1.Refusal(messages_1.MESSAGES.commentLong);
                            on = typeof v.on === 'string' && v.on !== '' && v.on.length <= 100 ? v.on : null;
                            _a = { id: "c-".concat((0, node_crypto_1.randomBytes)(4).toString('hex')), design: design, on: on, text: text };
                            return [4 /*yield*/, authorOf(realm)];
                        case 2:
                            comment = (_a.by = _b.sent(), _a.at = now(), _a.resolved = null, _a.sentTo = null, _a);
                            return [2 /*return*/, __assign(__assign({}, file), { comments: __spreadArray(__spreadArray([], file.comments, true), [comment], false) })];
                    }
                });
            }); });
        },
        setDesignComment: function (key, folder, id, isResolved) {
            return changeComments(key, folder, messages_1.MESSAGES.setComment, function (file) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!file.comments.some(function (c) { return c.id === id; }))
                        throw new reply_1.Refusal(messages_1.MESSAGES.commentGone);
                    return [2 /*return*/, __assign(__assign({}, file), { comments: file.comments.map(function (c) { return (c.id === id ? __assign(__assign({}, c), { resolved: isResolved === true ? now() : null }) : c); }) })];
                });
            }); });
        },
        // After Next version filed its quest: the open comments count as sent, and
        // the version names the one that's coming.
        sendDesignComments: function (key, folder, next) {
            return inTurn(key, function () {
                return (0, reply_1.reply)(d.log, messages_1.MESSAGES.sendComments, function () { return __awaiter(void 0, void 0, void 0, function () {
                    var realm, name, v, label, quest, folders, coming, version, file;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, realmOf(key)];
                            case 1:
                                realm = _a.sent();
                                name = folderArg(folder);
                                v = (next !== null && next !== void 0 ? next : {});
                                label = typeof v.label === 'string' ? v.label.trim() : '';
                                quest = typeof v.quest === 'string' ? v.quest.trim() : '';
                                if (label === '' || label.length > designs_1.LIMITS.label || (0, designs_1.folderOf)(label) === '')
                                    throw new reply_1.Refusal(messages_1.MESSAGES.badLabel);
                                return [4 /*yield*/, foldersOf(realm)];
                            case 2:
                                folders = _a.sent();
                                return [4 /*yield*/, Promise.all(folders.map(function (f) { return __awaiter(void 0, void 0, void 0, function () {
                                        var v;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, readParsed(realm, f, VERSION, design_files_1.parseVersion)];
                                                case 1:
                                                    v = _a.sent();
                                                    return [2 /*return*/, (v === null || v === void 0 ? void 0 : v.ok) === true && v.value.next !== null ? (0, designs_1.folderOf)(v.value.next.label) : null];
                                            }
                                        });
                                    }); }))];
                            case 3:
                                coming = _a.sent();
                                if (__spreadArray(__spreadArray([], folders, true), coming, true).includes((0, designs_1.folderOf)(label)))
                                    throw new reply_1.Refusal(messages_1.MESSAGES.labelTaken(label));
                                if (quest === '' || quest.length > designs_1.LIMITS.title)
                                    throw new reply_1.Refusal(messages_1.MESSAGES.badQuestTitle);
                                return [4 /*yield*/, versionOf(realm, name)];
                            case 4:
                                version = _a.sent();
                                return [4 /*yield*/, commentsOf(realm, name)];
                            case 5:
                                file = _a.sent();
                                if (!file.comments.some(designs_1.isOpen)) return [3 /*break*/, 7];
                                return [4 /*yield*/, writeFile(realm, name, COMMENTS, jsonOf(__assign(__assign({}, file), { comments: file.comments.map(function (c) { return ((0, designs_1.isOpen)(c) ? __assign(__assign({}, c), { sentTo: label }) : c); }) })))];
                            case 6:
                                _a.sent();
                                _a.label = 7;
                            case 7: return [4 /*yield*/, writeFile(realm, name, VERSION, jsonOf(__assign(__assign({}, version), { next: { label: label, quest: quest } })))];
                            case 8:
                                _a.sent();
                                return [2 /*return*/, null];
                        }
                    });
                }); });
            });
        },
        // Approving names the person and the time; withdrawing clears it. Every
        // other field of the version is written back as it was read.
        setDesignApproval: function (key, folder, isApproved) {
            return inTurn(key, function () {
                return (0, reply_1.reply)(d.log, messages_1.MESSAGES.setApproval, function () { return __awaiter(void 0, void 0, void 0, function () {
                    var realm, name, version, approved, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, realmOf(key)];
                            case 1:
                                realm = _c.sent();
                                name = folderArg(folder);
                                return [4 /*yield*/, versionOf(realm, name)];
                            case 2:
                                version = _c.sent();
                                if (!(isApproved === true)) return [3 /*break*/, 4];
                                _b = {};
                                return [4 /*yield*/, authorOf(realm)];
                            case 3:
                                _a = (_b.by = _c.sent(), _b.at = now(), _b);
                                return [3 /*break*/, 5];
                            case 4:
                                _a = null;
                                _c.label = 5;
                            case 5:
                                approved = _a;
                                return [4 /*yield*/, writeFile(realm, name, VERSION, jsonOf(__assign(__assign({}, version), { approved: approved })))];
                            case 6:
                                _c.sent();
                                return [2 /*return*/, null];
                        }
                    });
                }); });
            });
        },
        showDesigns: function (key) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.showRecord, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _c.sent();
                            _b = (_a = d).reveal;
                            return [4 /*yield*/, d.host.exists(realm.base)];
                        case 2:
                            _b.apply(_a, [(_c.sent()) ? realm.base : realm.path]);
                            return [2 /*return*/, null];
                    }
                });
            }); });
        },
    };
};
exports.designsApi = designsApi;
