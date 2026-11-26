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
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var messages_1 = require("../../../core/messages");
var node_host_1 = require("../../../core/node_host");
var reply_1 = require("../../../core/reply");
var notes_api_1 = require("./notes_api");
var note_protocol_1 = require("./note_protocol");
var KEY = 'demo-abc123';
var NOW = Date.parse('2026-11-07T12:00:00Z');
var home;
var dir;
var api;
var ids;
var deps;
var downloads;
var revealed = [];
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var refused = function (answer) {
    if (answer.ok)
        throw new Error('should be refused');
    return answer.error.message;
};
var change = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ title: 'Plan', folder: 'Ideas', type: null, isPinned: false, tags: [], body: 'Body' }, over));
};
var created = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var _a;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.createNote(KEY, change(over))];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        });
    });
};
var only = function (view, id) { return view.notes.find(function (n) { return n.id === id; }); };
var makeApi = function (over) {
    if (over === void 0) { over = {}; }
    var log = (0, logger_1.createLogger)('dev', function () { });
    var host = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
    }); }); });
    return (0, notes_api_1.notesApi)(__assign({ host: host, home: home, now: function () { return NOW; }, offsetMinutes: function () { return 60; }, log: log, newId: function () { return "t-".concat((ids += 1)); }, newNoteId: function () { return "n-".concat((ids += 1)); }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, 'terminal'];
        }); }); }, copy: function () { }, prepareCodex: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); }); }, reveal: function (path) { return void revealed.push(path); } }, over));
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log, host;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-notes-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                dir = (0, node_path_1.join)(home, '.queue-tea/notes', KEY);
                ids = 0;
                downloads = [];
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify((0, record_source_1.emptyRecord)('demo', '/p/demo')))];
            case 4:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                host = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                }); }); });
                deps = { host: host, home: home, now: function () { return NOW; }, offsetMinutes: function () { return 60; }, log: log, newId: function () { return "t-".concat((ids += 1)); }, newNoteId: function () { return "n-".concat((ids += 1)); }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); }, copy: function () { }, prepareCodex: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); }, reveal: function (path) { return void revealed.push(path); }, saveNoteFile: function (name, bytes) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        downloads.push({ name: name, bytes: bytes });
                        return [2 /*return*/, true];
                    }); }); } };
                api = (0, notes_api_1.notesApi)(deps);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('types, pins and folders on disk', function () {
    (0, vitest_1.it)('keeps a type and pin across reopening, archiving, restoring and unpinning', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, view, _b, _c, _d, _e, _f, _g, _h, restored, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0: return [4 /*yield*/, created({ type: 'bug' })];
                case 1:
                    _a = _r.sent(), id = _a.id, view = _a.view;
                    (0, vitest_1.expect)(only(view, id)).toMatchObject({ folder: 'Ideas', type: 'bug', isPinned: false });
                    _b = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ type: 'bug', isPinned: true }), only(view, id).stamp)];
                case 2:
                    _b.apply(void 0, [_r.sent()]);
                    api = makeApi();
                    _c = vitest_1.expect;
                    _d = only;
                    _e = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_e.apply(void 0, [_r.sent()]), id])]).toMatchObject({ type: 'bug', isPinned: true });
                    _f = vitest_1.expect;
                    _g = only;
                    _h = data;
                    return [4 /*yield*/, api.archiveNote(KEY, id, true)];
                case 4:
                    _f.apply(void 0, [_g.apply(void 0, [_h.apply(void 0, [_r.sent()]), id]).isPinned]).toBe(true);
                    _j = only;
                    _k = data;
                    return [4 /*yield*/, api.archiveNote(KEY, id, false)];
                case 5:
                    restored = _j.apply(void 0, [_k.apply(void 0, [_r.sent()]), id]);
                    _l = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ type: 'bug', isPinned: false }), restored.stamp)];
                case 6:
                    _l.apply(void 0, [_r.sent()]);
                    _m = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(id, ".md")), 'utf8')];
                case 7:
                    _m.apply(void 0, [_r.sent()]).not.toMatch(/^pinned:/m);
                    _o = vitest_1.expect;
                    _p = only;
                    _q = data;
                    return [4 /*yield*/, makeApi().readNotes(KEY)];
                case 8:
                    _o.apply(void 0, [_p.apply(void 0, [_q.apply(void 0, [_r.sent()]), id])]).toMatchObject({ type: 'bug', isPinned: false, body: 'Body' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses an unknown type and a pin that is not a boolean before writing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, over, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _i = 0, _a = [{ type: 'book' }, { type: {} }, { isPinned: 'true' }, { isPinned: 1 }];
                    _e.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    over = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.createNote(KEY, __assign(__assign({}, change()), over))];
                case 2:
                    _b.apply(void 0, [(_e.sent()).ok]).toBe(false);
                    _e.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 5:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()]).notes]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves a note by folder while its title, links, aliases and pin stay the same', function () { return __awaiter(void 0, void 0, void 0, function () {
        var target, source, result, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, created({ type: 'research', isPinned: true })];
                case 1:
                    target = _c.sent();
                    return [4 /*yield*/, created({ title: 'Index', body: '[[Plan]] [[Plan#Risks|risks]]' })];
                case 2:
                    source = _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.saveNote(KEY, target.id, change({ folder: 'Research', type: 'research', isPinned: true }), only(target.view, target.id).stamp)];
                case 3:
                    result = _a.apply(void 0, [_c.sent()]);
                    if (result.kind !== 'saved')
                        throw new Error('should save');
                    (0, vitest_1.expect)(result.relinked).toBe(0);
                    (0, vitest_1.expect)(result.note).toMatchObject({ id: target.id, title: 'Plan', folder: 'Research', type: 'research', isPinned: true });
                    (0, vitest_1.expect)(only(result.view, source.id).body).toBe('[[Plan]] [[Plan#Risks|risks]]');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(target.id, ".md")), 'utf8')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toContain('aliases: ["Plan"]');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('renames every note in a folder, including archived pins, and merges into an existing folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, second, index, before, renamed, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created({ title: 'One', type: 'idea', isPinned: true })];
                case 1:
                    first = _f.sent();
                    return [4 /*yield*/, created({ title: 'Two' })];
                case 2:
                    second = _f.sent();
                    return [4 /*yield*/, api.archiveNote(KEY, second.id, true)];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, created({ title: 'Index', folder: 'Plans', body: '[[One]] [[Two#Heading|two]]' })];
                case 4:
                    index = _f.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(index.id, ".md")), 'utf8')];
                case 5:
                    before = _f.sent();
                    _a = data;
                    return [4 /*yield*/, api.renameFolder(KEY, 'Ideas', ' Plans ')];
                case 6:
                    renamed = _a.apply(void 0, [_f.sent()]);
                    (0, vitest_1.expect)(only(renamed, first.id)).toMatchObject({ folder: 'Plans', type: 'idea', isPinned: true, updated: only(first.view, first.id).updated });
                    (0, vitest_1.expect)(only(renamed, second.id)).toMatchObject({ folder: 'Plans', isArchived: true });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(index.id, ".md")), 'utf8')];
                case 7:
                    _b.apply(void 0, [_f.sent()]).toBe(before);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 8:
                    _c.apply(void 0, [(_f.sent()).filter(function (name) { return name.endsWith('.md'); }).sort()]).toEqual(["".concat(first.id, ".md"), "".concat(second.id, ".md"), "".concat(index.id, ".md")].sort());
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, makeApi().readNotes(KEY)];
                case 9:
                    _d.apply(void 0, [_e.apply(void 0, [_f.sent()]).notes.every(function (note) { return note.folder === 'Plans'; })]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects empty, nested and overlong folder names, and keeps Inbox fixed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, to, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _g.sent();
                    _i = 0, _a = ['', '  ', 'a/b', 'x'.repeat(61), 4];
                    _g.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    to = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.renameFolder(KEY, 'Ideas', to)];
                case 3:
                    _b.apply(void 0, [(_g.sent()).ok]).toBe(false);
                    _g.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _c = vitest_1.expect;
                    return [4 /*yield*/, api.renameFolder(KEY, 'Inbox', 'Other')];
                case 6:
                    _c.apply(void 0, [(_g.sent()).ok]).toBe(false);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, api.renameFolder('../outside', 'Ideas', 'Plans')];
                case 7:
                    _d.apply(void 0, [(_g.sent()).ok]).toBe(false);
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 8:
                    _e.apply(void 0, [_f.apply(void 0, [_g.sent()]).notes[0].folder]).toBe('Ideas');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does not let an editor with a stale stamp undo a folder rename', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, view, result, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _c.sent(), id = _a.id, view = _a.view;
                    return [4 /*yield*/, api.renameFolder(KEY, 'Ideas', 'Plans')];
                case 2:
                    _c.sent();
                    _b = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Stale' }), only(view, id).stamp)];
                case 3:
                    result = _b.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(result).toMatchObject({ kind: 'changed', note: { folder: 'Plans', body: 'Body' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('serializes a pin save and folder rename without losing either change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, view, _b, saved, renamed;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _c.sent(), id = _a.id, view = _a.view;
                    return [4 /*yield*/, Promise.all([api.saveNote(KEY, id, change({ isPinned: true }), only(view, id).stamp), api.renameFolder(KEY, 'Ideas', 'Plans')])];
                case 2:
                    _b = _c.sent(), saved = _b[0], renamed = _b[1];
                    (0, vitest_1.expect)(data(saved).kind).toBe('saved');
                    (0, vitest_1.expect)(only(data(renamed), id)).toMatchObject({ folder: 'Plans', isPinned: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reports a partial rename and retries the remaining notes without rewriting moved ones', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, second, log, host, write, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, created({ title: 'One' })];
                case 1:
                    first = _l.sent();
                    return [4 /*yield*/, created({ title: 'Two' })];
                case 2:
                    second = _l.sent();
                    log = (0, logger_1.createLogger)('dev', function () { });
                    host = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); });
                    write = vitest_1.vi.spyOn(host, 'write').mockImplementation(function (path, text) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (path === (0, node_path_1.join)(dir, "".concat(second.id, ".md.tmp")))
                                        throw new Error('disk full');
                                    return [4 /*yield*/, (0, promises_1.writeFile)(path, text)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    api = makeApi({ host: host });
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.renameFolder(KEY, 'Ideas', 'Plans')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_l.sent()])]).toContain('Any notes already moved');
                    _c = vitest_1.expect;
                    _d = only;
                    _e = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 4:
                    _c.apply(void 0, [_d.apply(void 0, [_e.apply(void 0, [_l.sent()]), first.id]).folder]).toBe('Plans');
                    _f = vitest_1.expect;
                    _g = only;
                    _h = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 5:
                    _f.apply(void 0, [_g.apply(void 0, [_h.apply(void 0, [_l.sent()]), second.id]).folder]).toBe('Ideas');
                    write.mockRestore();
                    _j = vitest_1.expect;
                    _k = data;
                    return [4 /*yield*/, api.renameFolder(KEY, 'Ideas', 'Plans')];
                case 6:
                    _j.apply(void 0, [_k.apply(void 0, [_l.sent()]).notes.every(function (note) { return note.folder === 'Plans'; })]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('note files', function () {
    var png = function () { return new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64')); };
    var upload = function () { return ({ name: 'diagram.png', type: 'image/png', bytes: png() }); };
    (0, vitest_1.it)('keeps the bytes beside notes, deduplicates simultaneous imports, and reads them after reopening', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, secondWriter, _a, one, two, file, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_j.sent()).id;
                    secondWriter = (0, notes_api_1.notesApi)(deps);
                    return [4 /*yield*/, Promise.all([api.attachNoteFile(KEY, id, upload()), secondWriter.attachNoteFile(KEY, id, upload())])];
                case 2:
                    _a = _j.sent(), one = _a[0], two = _a[1];
                    file = data(one);
                    (0, vitest_1.expect)(data(two)).toEqual(file);
                    (0, vitest_1.expect)(file).toMatchObject({ kind: 'image' });
                    (0, vitest_1.expect)(file.path).toMatch(/^attachments\/[a-f0-9]+\.png$/);
                    _b = vitest_1.expect;
                    _c = Uint8Array.bind;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, file.path))];
                case 3:
                    _b.apply(void 0, [new (_c.apply(Uint8Array, [void 0, _j.sent()]))()]).toEqual(png());
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(dir, 'attachments'))];
                case 4:
                    _d.apply(void 0, [_j.sent()]).toHaveLength(1);
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, (0, notes_api_1.notesApi)(deps).readNoteFile(KEY, file.path)];
                case 5:
                    _e.apply(void 0, [_f.apply(void 0, [_j.sent()])]).toEqual(file);
                    _g = vitest_1.expect;
                    _h = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 6:
                    _g.apply(void 0, [_h.apply(void 0, [_j.sent()]).notes]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks bytes as well as names, refuses other types and the exact size limit, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_k.sent()).id;
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, { name: 'fake.png', type: 'image/png', bytes: new Uint8Array([1, 2]) })];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_k.sent()])]).toBe('Only image or PDF files are accepted.');
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, __assign(__assign({}, upload()), { name: '../../x.png' }))];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_k.sent()])]).toBe('Only image or PDF files are accepted.');
                    _e = vitest_1.expect;
                    _f = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, __assign(__assign({}, upload()), { bytes: new Uint8Array(10 * 1024 * 1024) }))];
                case 4:
                    _e.apply(void 0, [_f.apply(void 0, [_k.sent()])]).toBe('File must be under 10 MB.');
                    _g = vitest_1.expect;
                    _h = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, __assign(__assign({}, upload()), { bytes: [1, 2] }))];
                case 5:
                    _g.apply(void 0, [_h.apply(void 0, [_k.sent()])]).toBe('Only image or PDF files are accepted.');
                    _j = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 6:
                    _j.apply(void 0, [_k.sent()]).not.toContain('attachments');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('requires a known realm and a live note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_d.sent()).id;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.attachNoteFile('../x', id, upload())];
                case 2:
                    _a.apply(void 0, [(_d.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.attachNoteFile(KEY, 'missing', upload())];
                case 3:
                    _b.apply(void 0, [(_d.sent()).ok]).toBe(false);
                    return [4 /*yield*/, api.archiveNote(KEY, id, true)];
                case 4:
                    _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, upload())];
                case 5:
                    _c.apply(void 0, [(_d.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps a quest's file in the realm's vault with no note, under its content hash", function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.attachNoteFile(KEY, null, upload())];
                case 1:
                    file = _a.apply(void 0, [_j.sent()]);
                    (0, vitest_1.expect)(file).toEqual({ path: "attachments/".concat((0, node_crypto_1.createHash)('sha256').update(png()).digest('hex'), ".png"), kind: 'image' });
                    _b = vitest_1.expect;
                    _c = Uint8Array.bind;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, file.path))];
                case 2:
                    _b.apply(void 0, [new (_c.apply(Uint8Array, [void 0, _j.sent()]))()]).toEqual(png());
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 3:
                    _d.apply(void 0, [_j.sent()]).toEqual(['attachments']);
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 4:
                    _e.apply(void 0, [_f.apply(void 0, [_j.sent()]).notes]).toEqual([]);
                    _g = vitest_1.expect;
                    _h = data;
                    return [4 /*yield*/, (0, notes_api_1.notesApi)(deps).readNoteFile(KEY, file.path)];
                case 5:
                    _g.apply(void 0, [_h.apply(void 0, [_j.sent()])]).toEqual(file);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("refuses a quest's file for an unknown realm, of another type, or 10 MB, with the notes' sentences, and writes nothing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.attachNoteFile('../x', null, upload())];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_m.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.attachNoteFile('unknown-abc123', null, upload())];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_m.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    _e = vitest_1.expect;
                    _f = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, null, { name: 'notes.txt', type: 'text/plain', bytes: new Uint8Array([1, 2]) })];
                case 3:
                    _e.apply(void 0, [_f.apply(void 0, [_m.sent()])]).toBe('Only image or PDF files are accepted.');
                    _g = vitest_1.expect;
                    _h = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, null, { name: 'fake.png', type: 'image/png', bytes: new Uint8Array([1, 2]) })];
                case 4:
                    _g.apply(void 0, [_h.apply(void 0, [_m.sent()])]).toBe('Only image or PDF files are accepted.');
                    _j = vitest_1.expect;
                    _k = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, null, __assign(__assign({}, upload()), { bytes: new Uint8Array(10 * 1024 * 1024) }))];
                case 5:
                    _j.apply(void 0, [_k.apply(void 0, [_m.sent()])]).toBe('File must be under 10 MB.');
                    _l = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(home, '.queue-tea/notes')).catch(function () { return []; })];
                case 6:
                    _l.apply(void 0, [_m.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("a quest's file that can't be written says the quest is unchanged; a note's still says the note is there", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_e.sent()).id;
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'attachments'), 'not a folder')];
                case 2:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, null, upload())];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.attachQuestFile);
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, upload())];
                case 4:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.attachNoteFile);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('retains shared files when either note is permanently deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, file, _a, second, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    first = _g.sent();
                    _a = data;
                    return [4 /*yield*/, api.attachNoteFile(KEY, first.id, upload())];
                case 2:
                    file = _a.apply(void 0, [_g.sent()]);
                    return [4 /*yield*/, created({ title: 'Shared', body: "![Shared](<".concat(file.path, ">)") })];
                case 3:
                    second = _g.sent();
                    return [4 /*yield*/, api.archiveNote(KEY, first.id, true)];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, api.deleteNote(KEY, first.id)];
                case 5:
                    _g.sent();
                    _b = vitest_1.expect;
                    _c = Uint8Array.bind;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, file.path))];
                case 6:
                    _b.apply(void 0, [new (_c.apply(Uint8Array, [void 0, _g.sent()]))()]).toEqual(png());
                    _d = vitest_1.expect;
                    _e = only;
                    _f = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 7:
                    _d.apply(void 0, [_e.apply(void 0, [_f.apply(void 0, [_g.sent()]), second.id]).body]).toContain(file.path);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses traversals and symlinks, and describes other local files as downloads', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, file, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(dir, 'attachments'))];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'private.png'), png())];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'private.png'), (0, node_path_1.join)(dir, 'attachments', 'escape.png'))];
                case 4:
                    _j.sent();
                    _i = 0, _a = ['../private.png', 'attachments/escape.png', '/etc/passwd', 'file:///etc/passwd'];
                    _j.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    file = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.readNoteFile(KEY, file)];
                case 6:
                    _b.apply(void 0, [(_j.sent()).ok]).toBe(false);
                    _j.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'table.csv'), 'a,b\n1,2')];
                case 9:
                    _j.sent();
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.readNoteFile(KEY, 'table.csv')];
                case 10:
                    _c.apply(void 0, [_d.apply(void 0, [_j.sent()])]).toEqual({ path: 'table.csv', kind: 'other' });
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, api.downloadNoteFile(KEY, 'table.csv')];
                case 11:
                    _e.apply(void 0, [_f.apply(void 0, [_j.sent()])]).toBe(true);
                    (0, vitest_1.expect)(downloads).toEqual([{ name: 'table.csv', bytes: Buffer.from('a,b\n1,2') }]);
                    _g = vitest_1.expect;
                    _h = data;
                    return [4 /*yield*/, (0, notes_api_1.notesApi)(__assign(__assign({}, deps), { saveNoteFile: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, false];
                            }); }); } })).downloadNoteFile(KEY, 'table.csv')];
                case 12:
                    _g.apply(void 0, [_h.apply(void 0, [_j.sent()])]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses an attachments folder redirected outside the vault', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_c.sent()).id;
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'outside'))];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'outside'), (0, node_path_1.join)(dir, 'attachments'))];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, upload())];
                case 4:
                    _a.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(home, 'outside'))];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('serves detected preview types only, and refuses malformed URLs and files outside the vault', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, image, _a, response, _b, _c, pdf, report, _d, _e, _f, _g, _h, _i, _j, url, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_l.sent()).id;
                    _a = data;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, upload())];
                case 2:
                    image = _a.apply(void 0, [_l.sent()]);
                    return [4 /*yield*/, (0, note_protocol_1.noteFileResponse)("note-file://realm/".concat(KEY, "/").concat(image.path), api)];
                case 3:
                    response = _l.sent();
                    (0, vitest_1.expect)(response.status).toBe(200);
                    (0, vitest_1.expect)(response.headers.get('content-type')).toBe('image/png');
                    (0, vitest_1.expect)(response.headers.get('x-content-type-options')).toBe('nosniff');
                    _b = vitest_1.expect;
                    _c = Uint8Array.bind;
                    return [4 /*yield*/, response.arrayBuffer()];
                case 4:
                    _b.apply(void 0, [new (_c.apply(Uint8Array, [void 0, _l.sent()]))()]).toEqual(png());
                    pdf = new Uint8Array(Buffer.from('%PDF-1.4\n%%EOF'));
                    _d = data;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, { name: 'report.pdf', type: 'application/pdf', bytes: pdf })];
                case 5:
                    report = _d.apply(void 0, [_l.sent()]);
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, api.attachNoteFile(KEY, id, { name: 'Report', type: 'application/pdf', bytes: pdf })];
                case 6:
                    _e.apply(void 0, [_f.apply(void 0, [_l.sent()])]).toEqual(report);
                    _g = vitest_1.expect;
                    return [4 /*yield*/, (0, note_protocol_1.noteFileResponse)("note-file://realm/".concat(KEY, "/").concat(report.path), api)];
                case 7:
                    _g.apply(void 0, [(_l.sent()).headers.get('content-type')]).toBe('application/pdf');
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'unsafe.html'), '<script>alert(1)</script>')];
                case 8:
                    _l.sent();
                    _h = vitest_1.expect;
                    return [4 /*yield*/, (0, note_protocol_1.noteFileResponse)("note-file://realm/".concat(KEY, "/unsafe.html"), api)];
                case 9:
                    _h.apply(void 0, [(_l.sent()).status]).toBe(415);
                    _i = 0, _j = ['bad URL', "file://realm/".concat(KEY, "/").concat(image.path), "note-file://other/".concat(KEY, "/").concat(image.path), "note-file://realm/".concat(KEY, "/attachments/%2e%2e%2fsecret.png"), "note-file://realm/".concat(KEY, "/").concat(image.path, "?extra=1"), "note-file://realm/unknown-abc123/".concat(image.path)];
                    _l.label = 10;
                case 10:
                    if (!(_i < _j.length)) return [3 /*break*/, 13];
                    url = _j[_i];
                    _k = vitest_1.expect;
                    return [4 /*yield*/, (0, note_protocol_1.noteFileResponse)(url, api)];
                case 11:
                    _k.apply(void 0, [(_l.sent()).status]).toBeGreaterThanOrEqual(400);
                    _l.label = 12;
                case 12:
                    _i++;
                    return [3 /*break*/, 10];
                case 13: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('reading notes', function () {
    (0, vitest_1.it)('a realm with no notes yet has none, and says where they will live', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ notes: [], unreadable: [], folder: dir });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm Queue-tea does not know, and a key that could leave the folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readNotes('other-abc123')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe("That realm isn't one Queue-tea knows. Pick one from the list.");
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.readNotes('../x')];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).toBe("That realm isn't one Queue-tea knows. Pick one from the list.");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads notes made elsewhere, newest first, and skips what is not a note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Old idea.md'), '---\ntitle: Old idea\nupdated: 2026-01-01T00:00:00\n---\nText')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'New.md'), 'No front matter')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'New.md.bak'), 'a backup')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, '.hidden.md'), 'hidden')];
                case 5:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 6:
                    view = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(view.notes.map(function (n) { return [n.id, n.title]; })).toEqual([
                        ['New', 'New'],
                        ['Old idea', 'Old idea'],
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('opening a link', function () {
    (0, vitest_1.it)('opens web and email links, and refuses every other kind', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _i, _e, url, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.openLink('https://example.com/a?b=1')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_h.sent()])]).toBeNull();
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.openLink('mailto:rohan@example.com')];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_h.sent()])]).toBeNull();
                    _i = 0, _e = ['file:///etc/passwd', 'javascript:alert(1)', 'not a url', 7, 'https://x/' + 'a'.repeat(2050)];
                    _h.label = 3;
                case 3:
                    if (!(_i < _e.length)) return [3 /*break*/, 6];
                    url = _e[_i];
                    _f = vitest_1.expect;
                    _g = refused;
                    return [4 /*yield*/, api.openLink(url)];
                case 4:
                    _f.apply(void 0, [_g.apply(void 0, [_h.sent()])]).toBe('Queue-tea opens only web and email links from a note.');
                    _h.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('showing the folder', function () {
    (0, vitest_1.it)('makes the realm’s notes folder if needed, and shows it in Finder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.showNotes(KEY)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBeNull();
                    (0, vitest_1.expect)(revealed.at(-1)).toBe(dir);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 2:
                    _c.apply(void 0, [_d.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('writing notes', function () {
    (0, vitest_1.it)('creates a note as Markdown with front matter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, created({ tags: ['ignored'] })];
                case 1:
                    _a = _c.sent(), view = _a.view, id = _a.id;
                    (0, vitest_1.expect)(id).toBe('n-1');
                    (0, vitest_1.expect)(only(view, id)).toMatchObject({ title: 'Plan', folder: 'Ideas', tags: [], created: '2026-11-07T13:00:00+01:00', quests: [], body: 'Body' });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, 'n-1.md'), 'utf8')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe('---\ntitle: "Plan"\nfolder: "Ideas"\ntags: []\ncreated: "2026-11-07T13:00:00+01:00"\nupdated: "2026-11-07T13:00:00+01:00"\narchived: false\nquests: []\naliases: ["Plan"]\n---\nBody');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks a note as the editor does', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.createNote(KEY, change({ title: '  ' }))];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_k.sent()])]).toBe('Title is required.');
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.createNote(KEY, change({ title: 'A [[link]]' }))];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_k.sent()])]).toBe("A note title can't have [ ] | or # in it, because links are made of them.");
                    _e = vitest_1.expect;
                    _f = refused;
                    return [4 /*yield*/, api.createNote(KEY, change({ title: 'x'.repeat(201) }))];
                case 3:
                    _e.apply(void 0, [_f.apply(void 0, [_k.sent()])]).toBe('A note title can be 200 characters at most.');
                    _g = vitest_1.expect;
                    _h = refused;
                    return [4 /*yield*/, api.createNote(KEY, change({ folder: 'a/b' }))];
                case 4:
                    _g.apply(void 0, [_h.apply(void 0, [_k.sent()])]).toBe('A folder is one level, so leave out /.');
                    _j = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(home + '/.queue-tea')];
                case 5:
                    _j.apply(void 0, [_k.sent()]).not.toContain('notes');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps titles unique among live notes: a new one is numbered, a rename is refused', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, second, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, created({ title: 'Plan' })];
                case 1:
                    first = _e.sent();
                    return [4 /*yield*/, created({ title: 'plan' })];
                case 2:
                    second = _e.sent();
                    (0, vitest_1.expect)(only(second.view, second.id).title).toBe('plan 2');
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.saveNote(KEY, second.id, change({ title: 'PLAN' }), only(second.view, second.id).stamp)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe('A note called “PLAN” already exists. Pick another title.');
                    // A note that already shares its title, as one from Obsidian might, still saves its text.
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.saveNote(KEY, first.id, change({ title: 'Plan', body: 'More' }), only(second.view, first.id).stamp)];
                case 4:
                    // A note that already shares its title, as one from Obsidian might, still saves its text.
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()]).kind]).toBe('saved');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a note restored while another has its title comes back numbered', function () { return __awaiter(void 0, void 0, void 0, function () {
        var old, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, created({ title: 'Plan' })];
                case 1:
                    old = _d.sent();
                    return [4 /*yield*/, api.archiveNote(KEY, old.id, true)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, created({ title: 'Plan' })];
                case 3:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = only;
                    _c = data;
                    return [4 /*yield*/, api.archiveNote(KEY, old.id, false)];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_c.apply(void 0, [_d.sent()]), old.id]).title]).toBe('Plan 2');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves over the file it read, and refuses to when the file has changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, saved, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _g.sent(), view = _a.view, id = _a.id;
                    _b = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'New', tags: ['#idea', 'idea', ' '] }), only(view, id).stamp)];
                case 2:
                    saved = _b.apply(void 0, [_g.sent()]);
                    if (saved.kind !== 'saved')
                        throw new Error('should save');
                    (0, vitest_1.expect)(saved.note).toMatchObject({ body: 'New', tags: ['idea'] });
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Stale' }), only(view, id).stamp)];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_g.sent()])]).toEqual({ kind: 'changed', note: saved.note });
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, "".concat(id, ".md")))];
                case 4:
                    _g.sent();
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change(), saved.note.stamp)];
                case 5:
                    _e.apply(void 0, [_f.apply(void 0, [_g.sent()])]).toEqual({ kind: 'changed', note: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps each save in hidden history, including the first, across reopening the API', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, history, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _k.sent(), view = _a.view, id = _a.id;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Second' }), only(view, id).stamp)];
                case 2:
                    _k.sent();
                    api = (0, notes_api_1.notesApi)(deps);
                    _b = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 3:
                    history = _b.apply(void 0, [_k.sent()]);
                    (0, vitest_1.expect)(history).toHaveLength(2);
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, history[0].id)];
                case 4:
                    _c.apply(void 0, [_d.apply(void 0, [_k.sent()]).body]).toBe('Second');
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, history[1].id)];
                case 5:
                    _e.apply(void 0, [_f.apply(void 0, [_k.sent()]).body]).toBe('Body');
                    _g = vitest_1.expect;
                    _h = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 6:
                    _g.apply(void 0, [_h.apply(void 0, [_k.sent()]).notes]).toHaveLength(1);
                    _j = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 7:
                    _j.apply(void 0, [_k.sent()]).not.toContain("".concat(id, ".md.bak"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('renaming a note rewrites the links to it, unless the old title is shared', function () { return __awaiter(void 0, void 0, void 0, function () {
        var target, linking, view, _a, again, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created({ title: 'Plan' })];
                case 1:
                    target = _f.sent();
                    return [4 /*yield*/, created({ title: 'Linking', body: 'See [[Plan]] and [[plan|this]].' })];
                case 2:
                    linking = _f.sent();
                    _a = data;
                    return [4 /*yield*/, api.saveNote(KEY, target.id, change({ title: 'Roadmap' }), only(target.view, target.id).stamp)];
                case 3:
                    view = _a.apply(void 0, [_f.sent()]);
                    if (view.kind !== 'saved')
                        throw new Error('should save');
                    (0, vitest_1.expect)(only(view.view, linking.id).body).toBe('See [[Roadmap]] and [[Roadmap|this]].');
                    (0, vitest_1.expect)(view.relinked).toBe(1);
                    // Only a file made outside the app can share a title.
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Roadmap copy.md'), '---\ntitle: Roadmap\n---\n')];
                case 4:
                    // Only a file made outside the app can share a title.
                    _f.sent();
                    _b = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 5:
                    again = _b.apply(void 0, [_f.sent()]);
                    return [4 /*yield*/, api.saveNote(KEY, target.id, change({ title: 'Third' }), only(again, target.id).stamp)];
                case 6:
                    _f.sent();
                    _c = vitest_1.expect;
                    _d = only;
                    _e = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 7:
                    _c.apply(void 0, [_d.apply(void 0, [_e.apply(void 0, [_f.sent()]), linking.id]).body]).toBe('See [[Roadmap]] and [[Roadmap|this]].');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('archives, restores, and deletes only an archived note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_m.sent()).id;
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.deleteNote(KEY, id)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_m.sent()])]).toBe('Archive the note first. Only archived notes can be deleted.');
                    _c = vitest_1.expect;
                    _d = only;
                    _e = data;
                    return [4 /*yield*/, api.archiveNote(KEY, id, true)];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_e.apply(void 0, [_m.sent()]), id]).isArchived]).toBe(true);
                    _f = vitest_1.expect;
                    _g = data;
                    return [4 /*yield*/, api.deleteNote(KEY, id)];
                case 4:
                    _f.apply(void 0, [_g.apply(void 0, [_m.sent()]).notes]).toEqual([]);
                    _h = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 5:
                    _h.apply(void 0, [_m.sent()]).toEqual(['.history']);
                    _j = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(dir, '.history'))];
                case 6:
                    _j.apply(void 0, [_m.sent()]).toEqual([]);
                    _k = vitest_1.expect;
                    _l = refused;
                    return [4 /*yield*/, api.archiveNote(KEY, id, false)];
                case 7:
                    _k.apply(void 0, [_l.apply(void 0, [_m.sent()])]).toBe("That note isn't there any more. Pick another from the list.");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a note id that could leave the folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.archiveNote(KEY, '../../projects/demo-abc123', true)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe("That note isn't one Queue-tea can open. Pick another from the list.");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('note history', function () {
    (0, vitest_1.it)('repairs a damaged recovery point before replacing the live note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, first, _b, versions, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _f.sent(), view = _a.view, id = _a.id;
                    _b = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 2:
                    first = _b.apply(void 0, [_f.sent()])[0];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, '.history', id, "".concat(first.id, ".md")), 'Damaged')];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Next' }), only(view, id).stamp)];
                case 4:
                    _f.sent();
                    _c = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 5:
                    versions = _c.apply(void 0, [_f.sent()]);
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, versions[1].id)];
                case 6:
                    _d.apply(void 0, [_e.apply(void 0, [_f.sent()]).body]).toBe('Body');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed snapshot or live-file replacement keeps the existing note readable', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, path, original, _b, _c, _d, _e, _f, _g, versions, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _l.sent(), view = _a.view, id = _a.id;
                    path = (0, node_path_1.join)(dir, "".concat(id, ".md"));
                    return [4 /*yield*/, (0, promises_1.readFile)(path, 'utf8')];
                case 2:
                    original = _l.sent();
                    api = (0, notes_api_1.notesApi)(__assign(__assign({}, deps), { host: __assign(__assign({}, deps.host), { write: function (to, text) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (to.includes('/.history/'))
                                                throw new Error('disk full');
                                            return [4 /*yield*/, deps.host.write(to, text)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); } }) }));
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Unsaved' }), only(view, id).stamp)];
                case 3:
                    _b.apply(void 0, [(_l.sent()).ok]).toBe(false);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(path, 'utf8')];
                case 4:
                    _c.apply(void 0, [_l.sent()]).toBe(original);
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 5:
                    _d.apply(void 0, [_e.apply(void 0, [_l.sent()])]).toHaveLength(1);
                    api = (0, notes_api_1.notesApi)(__assign(__assign({}, deps), { host: __assign(__assign({}, deps.host), { move: function (from, to) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, to === path ? { exitCode: 1, stdout: '', stderr: 'disk failure' } : deps.host.move(from, to)];
                            }); }); } }) }));
                    _f = vitest_1.expect;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Recoverable attempt' }), only(view, id).stamp)];
                case 6:
                    _f.apply(void 0, [(_l.sent()).ok]).toBe(false);
                    _g = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(path, 'utf8')];
                case 7:
                    _g.apply(void 0, [_l.sent()]).toBe(original);
                    api = (0, notes_api_1.notesApi)(deps);
                    _h = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 8:
                    versions = _h.apply(void 0, [_l.sent()]);
                    _j = vitest_1.expect;
                    _k = data;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, versions[0].id)];
                case 9:
                    _j.apply(void 0, [_k.apply(void 0, [_l.sent()]).body]).toBe('Recoverable attempt');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saving over an external edit preserves it as a recovery point', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, current, _a, _b, versions, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_f.sent()).id;
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, "".concat(id, ".md")), 'Written outside')];
                case 2:
                    _f.sent();
                    _a = only;
                    _b = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 3:
                    current = _a.apply(void 0, [_b.apply(void 0, [_f.sent()]), id]);
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Kept mine' }), current.stamp)];
                case 4:
                    _f.sent();
                    _c = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 5:
                    versions = _c.apply(void 0, [_f.sent()]);
                    (0, vitest_1.expect)(versions).toHaveLength(3);
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, versions[1].id)];
                case 6:
                    _d.apply(void 0, [_e.apply(void 0, [_f.sent()]).body]).toBe('Written outside');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an imported note has no history until saving, which also preserves its original file and legacy backup', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, original, _c, _d, history, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Imported.md'), 'Original from Obsidian')];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Imported.md.bak'), 'Older backup')];
                case 3:
                    _h.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, 'Imported')];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_h.sent()])]).toEqual([]);
                    _c = only;
                    _d = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 5:
                    original = _c.apply(void 0, [_d.apply(void 0, [_h.sent()]), 'Imported']);
                    return [4 /*yield*/, api.saveNote(KEY, 'Imported', change({ body: 'Edited here' }), original.stamp)];
                case 6:
                    _h.sent();
                    _e = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, 'Imported')];
                case 7:
                    history = _e.apply(void 0, [_h.sent()]);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, Promise.all(history.map(function (version) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = data;
                                    return [4 /*yield*/, api.readNoteVersion(KEY, 'Imported', version.id)];
                                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()]).body];
                            }
                        }); }); }))];
                case 8:
                    _f.apply(void 0, [_h.sent()]).toEqual(['Edited here', 'Original from Obsidian', 'Older backup']);
                    _g = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 9:
                    _g.apply(void 0, [_h.sent()]).not.toContain('Imported.md.bak');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('restores editable fields, keeps quest links and archive status, and can recover the replaced text', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, first, _b, archived, _c, _d, restored, _e, history, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, created({ body: 'Original', tags: [] })];
                case 1:
                    _a = _j.sent(), view = _a.view, id = _a.id;
                    _b = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 2:
                    first = _b.apply(void 0, [_j.sent()])[0];
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ title: 'Renamed', folder: 'Later', type: 'research', isPinned: true, tags: ['later'], body: 'Latest' }), only(view, id).stamp)];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [{ title: 'Do it', priority: 'mid', difficulty: 'medium', item: 'Do it' }] })];
                case 4:
                    _j.sent();
                    _c = only;
                    _d = data;
                    return [4 /*yield*/, api.archiveNote(KEY, id, true)];
                case 5:
                    archived = _c.apply(void 0, [_d.apply(void 0, [_j.sent()]), id]);
                    _e = data;
                    return [4 /*yield*/, api.restoreNoteVersion(KEY, id, first.id, archived.stamp)];
                case 6:
                    restored = _e.apply(void 0, [_j.sent()]);
                    if (restored.kind !== 'saved')
                        throw new Error('should restore');
                    (0, vitest_1.expect)(restored.note).toMatchObject({ title: 'Plan', folder: 'Ideas', tags: [], body: 'Original', type: 'research', isPinned: true, isArchived: true, quests: archived.quests, created: archived.created });
                    _f = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 7:
                    history = _f.apply(void 0, [_j.sent()]);
                    _g = vitest_1.expect;
                    _h = data;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, history[1].id)];
                case 8:
                    _g.apply(void 0, [_h.apply(void 0, [_j.sent()])]).toMatchObject({ body: 'Latest', quests: archived.quests, isArchived: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a stale restore, and refused saves never add a version', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, first, _b, stamp, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _k.sent(), view = _a.view, id = _a.id;
                    _b = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 2:
                    first = _b.apply(void 0, [_k.sent()])[0];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, "".concat(id, ".md")), 'Changed outside')];
                case 3:
                    _k.sent();
                    stamp = only(view, id).stamp;
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.restoreNoteVersion(KEY, id, first.id, stamp)];
                case 4:
                    _c.apply(void 0, [_d.apply(void 0, [_k.sent()]).kind]).toBe('changed');
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change(), stamp)];
                case 5:
                    _e.apply(void 0, [_f.apply(void 0, [_k.sent()]).kind]).toBe('changed');
                    _g = vitest_1.expect;
                    _h = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 6:
                    _g.apply(void 0, [_h.apply(void 0, [_k.sent()])]).toHaveLength(1);
                    _j = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(id, ".md")), 'utf8')];
                case 7:
                    _j.apply(void 0, [_k.sent()]).toBe('Changed outside');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('restoring a renamed note updates backlinks, and a taken title gets the next number', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, first, _b, linking, now, _c, _d, restored, _e, _f, _g, _h, _j, _k, numbered, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _m.sent(), view = _a.view, id = _a.id;
                    _b = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 2:
                    first = _b.apply(void 0, [_m.sent()])[0];
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ title: 'Roadmap' }), only(view, id).stamp)];
                case 3:
                    _m.sent();
                    return [4 /*yield*/, created({ title: 'Links', body: 'See [[Roadmap]].' })];
                case 4:
                    linking = _m.sent();
                    _c = only;
                    _d = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 5:
                    now = _c.apply(void 0, [_d.apply(void 0, [_m.sent()]), id]);
                    _e = data;
                    return [4 /*yield*/, api.restoreNoteVersion(KEY, id, first.id, now.stamp)];
                case 6:
                    restored = _e.apply(void 0, [_m.sent()]);
                    (0, vitest_1.expect)(restored.kind).toBe('saved');
                    _f = vitest_1.expect;
                    _g = only;
                    _h = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 7:
                    _f.apply(void 0, [_g.apply(void 0, [_h.apply(void 0, [_m.sent()]), linking.id]).body]).toBe('See [[Plan]].');
                    return [4 /*yield*/, api.archiveNote(KEY, id, true)];
                case 8:
                    _m.sent();
                    return [4 /*yield*/, created()];
                case 9:
                    _m.sent();
                    return [4 /*yield*/, api.archiveNote(KEY, id, false)];
                case 10:
                    _m.sent();
                    _j = only;
                    _k = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 11:
                    now = _j.apply(void 0, [_k.apply(void 0, [_m.sent()]), id]);
                    _l = data;
                    return [4 /*yield*/, api.restoreNoteVersion(KEY, id, first.id, now.stamp)];
                case 12:
                    numbered = _l.apply(void 0, [_m.sent()]);
                    if (numbered.kind !== 'saved')
                        throw new Error('should restore');
                    (0, vitest_1.expect)(numbered.note.title).toBe('Plan 2');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks realm, note and version ids before using them as paths, and reports missing or damaged versions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b, _i, _c, version, _d, _e, first, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_j.sent()).id;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.readNoteHistory('../outside', id)];
                case 2:
                    _a.apply(void 0, [(_j.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.readNoteHistory(KEY, '../outside')];
                case 3:
                    _b.apply(void 0, [(_j.sent()).ok]).toBe(false);
                    _i = 0, _c = ['../../projects/demo-abc123', 42, 'v-not-a-version'];
                    _j.label = 4;
                case 4:
                    if (!(_i < _c.length)) return [3 /*break*/, 8];
                    version = _c[_i];
                    _d = vitest_1.expect;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, version)];
                case 5:
                    _d.apply(void 0, [(_j.sent()).ok]).toBe(false);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, api.restoreNoteVersion(KEY, id, version, 'stamp')];
                case 6:
                    _e.apply(void 0, [(_j.sent()).ok]).toBe(false);
                    _j.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8:
                    _f = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 9:
                    first = _f.apply(void 0, [_j.sent()])[0];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, '.history', id, "".concat(first.id, ".md")), 'Damaged')];
                case 10:
                    _j.sent();
                    _g = vitest_1.expect;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, first.id)];
                case 11:
                    _g.apply(void 0, [(_j.sent()).ok]).toBe(false);
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, '.history', id, "".concat(first.id, ".md")))];
                case 12:
                    _j.sent();
                    _h = vitest_1.expect;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, first.id)];
                case 13:
                    _h.apply(void 0, [(_j.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('prunes frequent saves to a bounded history and keeps independently queued saves', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, id, stamp, original, answers, history, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    _a = _f.sent(), view = _a.view, id = _a.id;
                    stamp = only(view, id).stamp;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(id, ".md")), 'utf8')
                        // A full on-disk history exercises pruning without 120 redundant saves.
                    ];
                case 2:
                    original = _f.sent();
                    // A full on-disk history exercises pruning without 120 redundant saves.
                    return [4 /*yield*/, Promise.all(Array.from({ length: 120 }, function (_, n) { return __awaiter(void 0, void 0, void 0, function () {
                            var text, hash;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        text = original.replace('\nBody', "\nSave ".concat(n));
                                        hash = (0, node_crypto_1.createHash)('sha1').update(text).digest('hex');
                                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, '.history', id, "v-".concat(NOW - 1000 + n, "-").concat(hash, ".md")), text)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    // A full on-disk history exercises pruning without 120 redundant saves.
                    _f.sent();
                    return [4 /*yield*/, Promise.all([api.saveNote(KEY, id, change({ body: 'Writer one' }), stamp), api.saveNote(KEY, id, change({ body: 'Writer two' }), stamp)])];
                case 4:
                    answers = _f.sent();
                    (0, vitest_1.expect)(answers.map(function (answer) { return data(answer).kind; })).toEqual(['saved', 'changed']);
                    _b = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, id)];
                case 5:
                    history = _b.apply(void 0, [_f.sent()]);
                    (0, vitest_1.expect)(history).toHaveLength(51);
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.readNoteVersion(KEY, id, history[0].id)];
                case 6:
                    _c.apply(void 0, [_d.apply(void 0, [_f.sent()]).body]).toBe('Writer one');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(dir, '.history', id))];
                case 7:
                    _e.apply(void 0, [_f.sent()]).toHaveLength(history.length);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('filing quests from a note', function () {
    var record = function () { return __awaiter(void 0, void 0, void 0, function () {
        var read, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), 'utf8')];
                case 1:
                    read = _a.apply(void 0, [_b.sent()]);
                    if (read === 'unreadable')
                        throw new Error('should read');
                    return [2 /*return*/, read];
            }
        });
    }); };
    (0, vitest_1.it)('files a new parent and its children, and links each to the note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, filed, _a, tasks;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, created({ title: 'Bug Bounty Helper', body: 'A helper.\n\n- [ ] Scan\n- [ ] Report' })];
                case 1:
                    id = (_b.sent()).id;
                    _a = data;
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, {
                            parent: { kind: 'new', title: 'Bug Bounty Helper' },
                            quests: [
                                { title: 'Scan', priority: 'high', difficulty: 'hard', item: 'Scan' },
                                { title: 'Report', priority: 'mid', difficulty: 'light', item: 'Report' },
                            ],
                        })];
                case 2:
                    filed = _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, record()];
                case 3:
                    tasks = (_b.sent()).tasks;
                    (0, vitest_1.expect)(tasks.map(function (t) { return [t.id, t.title, t.parentId]; })).toEqual([
                        ['t-2', 'Bug Bounty Helper', null],
                        ['t-3', 'Scan', 't-2'],
                        ['t-4', 'Report', 't-2'],
                    ]);
                    (0, vitest_1.expect)(tasks[1]).toMatchObject({ priority: 'high', description: 'From the note "Bug Bounty Helper" in Notes.' });
                    (0, vitest_1.expect)(only(filed.view, id).quests).toEqual([
                        { id: 't-2', item: null },
                        { id: 't-3', item: 'Scan' },
                        { id: 't-4', item: 'Report' },
                    ]);
                    (0, vitest_1.expect)(filed.project.kind).toBe('readable');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a note with no checklist is one quest, described by its first paragraph', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, created({ title: 'Idea', body: '# Idea\n\nWhy it matters.' })];
                case 1:
                    id = (_b.sent()).id;
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [{ title: 'Idea', priority: 'mid', difficulty: 'medium', item: null }] })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, record()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).tasks[0]]).toMatchObject({ title: 'Idea', parentId: null, description: 'From the note "Idea" in Notes.\n\nWhy it matters.' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks the quests and files nothing when one is wrong', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_f.sent()).id;
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [] })];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]).toBe('Pick at least one quest to file.');
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [{ title: ' ', priority: 'mid', difficulty: 'medium', item: null }] })];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_f.sent()])]).toBe('Title is required.');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, record()];
                case 4:
                    _e.apply(void 0, [(_f.sent()).tasks]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never files a line twice, and puts new lines under the note’s open parent', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, a, again, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, created({ title: 'Saga', body: '- [ ] A\n- [ ] B' })];
                case 1:
                    id = (_c.sent()).id;
                    a = { title: 'A', priority: 'mid', difficulty: 'medium', item: 'A' };
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [a] })];
                case 2:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [a, __assign(__assign({}, a), { title: 'B', item: 'B' })] })];
                case 3:
                    again = _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, record()];
                case 4:
                    _b.apply(void 0, [(_c.sent()).tasks.map(function (t) { return [t.title, t.parentId]; })]).toEqual([
                        ['Saga', null],
                        ['A', 't-2'],
                        ['B', 't-2'],
                    ]);
                    (0, vitest_1.expect)(only(again.view, id).quests.map(function (q) { return q.item; })).toEqual([null, 'A', 'B']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('once the note’s parent is done, new lines go under a new one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, file, done, _a, _b, tasks;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, created({ title: 'Saga' })];
                case 1:
                    id = (_c.sent()).id;
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [{ title: 'A', priority: 'mid', difficulty: 'medium', item: 'A' }] })];
                case 2:
                    _c.sent();
                    file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 3:
                    done = _b.apply(_a, [_c.sent()]);
                    done.tasks = done.tasks.map(function (t) { return (__assign(__assign({}, t), { state: 'done' })); });
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(done))];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [{ title: 'B', priority: 'mid', difficulty: 'medium', item: 'B' }] })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, record()];
                case 6:
                    tasks = (_c.sent()).tasks;
                    (0, vitest_1.expect)(tasks.map(function (t) { return [t.title, t.parentId]; })).toEqual([
                        ['Saga', null],
                        ['A', 't-2'],
                        ['Saga', null],
                        ['B', 't-4'],
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a parent that is not open, and files nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, message, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    id = (_e.sent()).id;
                    _a = refused;
                    return [4 /*yield*/, api.fileNoteQuests(KEY, id, { parent: { kind: 'task', id: 't-gone' }, quests: [{ title: 'A', priority: 'mid', difficulty: 'medium', item: 'A' }] })];
                case 2:
                    message = _a.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(message).toMatch(/Pick again\.$/);
                    _b = vitest_1.expect;
                    _c = only;
                    _d = data;
                    return [4 /*yield*/, api.readNotes(KEY)];
                case 3:
                    _b.apply(void 0, [_c.apply(void 0, [_d.apply(void 0, [_e.sent()]), id]).quests]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('reading a bookmark', function () {
    var PAGE = '<meta property="og:title" content="Example page"><meta property="og:description" content="What it is about."><meta property="og:site_name" content="Example">';
    (0, vitest_1.it)('refuses anything but a web link before reading a page', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readPage, _i, _a, url, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    readPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, PAGE];
                    }); }); });
                    api = makeApi({ readPage: readPage });
                    _i = 0, _a = [7, null, undefined, {}, ['https://example.com'], '', 'not a url', 'example.com', 'ftp://example.com/', 'file:///etc/passwd', 'javascript:alert(1)', 'mailto:rohan@example.com', 'https://exa mple.com', 'https://x/' + 'a'.repeat(2050)];
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    url = _a[_i];
                    _b = vitest_1.expect;
                    _c = refused;
                    return [4 /*yield*/, api.readBookmark(url)];
                case 2:
                    _b.apply(void 0, [_c.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.badBookmark);
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    (0, vitest_1.expect)(readPage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives the page’s title, description and site for the trimmed link', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readPage, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    readPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, PAGE];
                    }); }); });
                    api = makeApi({ readPage: readPage });
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readBookmark('  https://example.com/post\n')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ url: 'https://example.com/post', title: 'Example page', description: 'What it is about.', site: 'Example' });
                    (0, vitest_1.expect)(readPage).toHaveBeenCalledWith('https://example.com/post');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives an empty preview, not an error, for a page with nothing to show', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    api = makeApi({ readPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ''];
                        }); }); } });
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readBookmark('https://example.com/file.zip')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ url: 'https://example.com/file.zip', title: null, description: null, site: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads a page once for the session, and anew in another session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readPage, first, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    readPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, PAGE];
                    }); }); });
                    api = makeApi({ readPage: readPage });
                    _a = data;
                    return [4 /*yield*/, api.readBookmark('https://example.com/post')];
                case 1:
                    first = _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.readBookmark(' https://example.com/post ')];
                case 2:
                    _b.apply(void 0, [_c.apply(void 0, [_e.sent()])]).toEqual(first);
                    (0, vitest_1.expect)(readPage).toHaveBeenCalledTimes(1);
                    _d = data;
                    return [4 /*yield*/, makeApi({ readPage: readPage }).readBookmark('https://example.com/post')];
                case 3:
                    _d.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(readPage).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the 200 newest previews, dropping the oldest first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readPage, i, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    readPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, PAGE];
                    }); }); });
                    api = makeApi({ readPage: readPage });
                    i = 0;
                    _e.label = 1;
                case 1:
                    if (!(i <= 200)) return [3 /*break*/, 4];
                    _a = data;
                    return [4 /*yield*/, api.readBookmark("https://example.com/".concat(i))];
                case 2:
                    _a.apply(void 0, [_e.sent()]);
                    _e.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4:
                    (0, vitest_1.expect)(readPage).toHaveBeenCalledTimes(201);
                    _b = data;
                    return [4 /*yield*/, api.readBookmark('https://example.com/200')];
                case 5:
                    _b.apply(void 0, [_e.sent()]);
                    _c = data;
                    return [4 /*yield*/, api.readBookmark('https://example.com/1')];
                case 6:
                    _c.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(readPage).toHaveBeenCalledTimes(201);
                    _d = data;
                    return [4 /*yield*/, api.readBookmark('https://example.com/0')];
                case 7:
                    _d.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(readPage).toHaveBeenCalledTimes(202);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does not keep a failed read, so trying again reads the page anew', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readPage, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    readPage = vitest_1.vi.fn().mockRejectedValueOnce(new reply_1.Refusal(messages_1.MESSAGES.bookmarkSlow)).mockResolvedValue(PAGE);
                    api = makeApi({ readPage: readPage });
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readBookmark('https://example.com/post')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.bookmarkSlow);
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.readBookmark('https://example.com/post')];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()]).title]).toBe('Example page');
                    (0, vitest_1.expect)(readPage).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says a plain sentence when the read fails, and logs what went wrong', function () { return __awaiter(void 0, void 0, void 0, function () {
        var lines, log, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    lines = [];
                    log = (0, logger_1.createLogger)('dev', function (line) { return void lines.push(line); });
                    api = makeApi({ log: log, readPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            throw new Error('getaddrinfo ENOTFOUND example.invalid');
                        }); }); } });
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readBookmark('https://example.invalid/')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(messages_1.MESSAGES.readBookmark);
                    (0, vitest_1.expect)(lines.join('')).toContain('ENOTFOUND');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads through the private-address guard when no reader is given', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readBookmark('http://127.0.0.1:9/')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.bookmarkPrivate);
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.readBookmark('http://localhost:9/')];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.bookmarkPrivate);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the canvas', function () {
    var card = function (id, over) {
        if (over === void 0) { over = {}; }
        return (__assign({ id: id, type: 'file', file: 'n-1.md', x: 0, y: 0, width: 280, height: 160 }, over));
    };
    var board = { nodes: [card('a'), card('b', { type: 'link', file: undefined, url: 'https://example.com', x: 400, color: '4' })], edges: [{ id: 'e', fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left', label: 'then' }] };
    var file = function () { return (0, promises_1.readFile)((0, node_path_1.join)(dir, 'Canvas.canvas'), 'utf8'); };
    (0, vitest_1.it)('reads an empty board before the first save, then saves and reads it back as Obsidian writes it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, saved, _c, text, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readCanvas(KEY)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_g.sent()])]).toEqual({ canvas: { nodes: [], edges: [] }, stamp: null });
                    _c = data;
                    return [4 /*yield*/, api.saveCanvas(KEY, board, null)];
                case 2:
                    saved = _c.apply(void 0, [_g.sent()]);
                    (0, vitest_1.expect)(saved.kind).toBe('saved');
                    return [4 /*yield*/, file()];
                case 3:
                    text = _g.sent();
                    (0, vitest_1.expect)(text).toContain('\n\t"nodes": [');
                    (0, vitest_1.expect)(JSON.parse(text)).toEqual({ nodes: [card('a'), { id: 'b', type: 'link', url: 'https://example.com', color: '4', x: 400, y: 0, width: 280, height: 160 }], edges: board.edges });
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, makeApi().readCanvas(KEY)];
                case 4:
                    _d.apply(void 0, [_e.apply(void 0, [_g.sent()])]).toEqual({ canvas: JSON.parse(text), stamp: saved.kind === 'saved' ? saved.stamp : null });
                    _f = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(dir)];
                case 5:
                    _f.apply(void 0, [_g.sent()]).toEqual(['Canvas.canvas']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('writes nothing over a file changed since it was read, and hands back the file as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, _a, theirs, answer, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.saveCanvas(KEY, board, null)];
                case 1:
                    first = _a.apply(void 0, [_f.sent()]);
                    theirs = "".concat(JSON.stringify({ nodes: [card('z')], edges: [] }), "\n");
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Canvas.canvas'), theirs)];
                case 2:
                    _f.sent();
                    _b = data;
                    return [4 /*yield*/, api.saveCanvas(KEY, { nodes: [], edges: [] }, first.kind === 'saved' ? first.stamp : null)];
                case 3:
                    answer = _b.apply(void 0, [_f.sent()]);
                    (0, vitest_1.expect)(answer).toEqual({ kind: 'changed', view: { canvas: { nodes: [card('z')], edges: [] }, stamp: (0, node_crypto_1.createHash)('sha1').update(theirs).digest('hex') } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, file()];
                case 4:
                    _c.apply(void 0, [_f.sent()]).toBe(theirs);
                    // A board that never read a file can't write over one either.
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, api.saveCanvas(KEY, board, null)];
                case 5:
                    // A board that never read a file can't write over one either.
                    _d.apply(void 0, [_e.apply(void 0, [_f.sent()]).kind]).toBe('changed');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a file that is not a canvas and never writes over it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, text, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })];
                case 1:
                    _g.sent();
                    _i = 0, _a = ['{ not json', '{"nodes": "no"}', '{"nodes": [{"id": "a", "type": "file", "x": 0, "y": 0, "width": 0, "height": 10}]}'];
                    _g.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    text = _a[_i];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Canvas.canvas'), text)];
                case 3:
                    _g.sent();
                    _b = vitest_1.expect;
                    _c = refused;
                    return [4 /*yield*/, api.readCanvas(KEY)];
                case 4:
                    _b.apply(void 0, [_c.apply(void 0, [_g.sent()])]).toBe(messages_1.MESSAGES.badCanvasFile);
                    _d = vitest_1.expect;
                    _e = refused;
                    return [4 /*yield*/, api.saveCanvas(KEY, board, 'stale')];
                case 5:
                    _d.apply(void 0, [_e.apply(void 0, [_g.sent()])]).toBe(messages_1.MESSAGES.badCanvasFile);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, file()];
                case 6:
                    _f.apply(void 0, [_g.sent()]).toBe(text);
                    _g.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks the board from the window before writing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, bad, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _i = 0, _a = [null, 'board', { nodes: [card('a'), card('a')] }, { nodes: [card('a', { x: 'left' })] }, { nodes: [card('a', { extra: { nested: true } })] }, { nodes: [card('a', { text: 7 })] }, { nodes: [card('a', { type: 'not a type' })] }];
                    _p.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    bad = _a[_i];
                    _b = vitest_1.expect;
                    _c = refused;
                    return [4 /*yield*/, api.saveCanvas(KEY, bad, null)];
                case 2:
                    _b.apply(void 0, [_c.apply(void 0, [_p.sent()])]).toBe(messages_1.MESSAGES.badValue);
                    _p.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _d = vitest_1.expect;
                    _e = refused;
                    return [4 /*yield*/, api.saveCanvas(KEY, board, 7)];
                case 5:
                    _d.apply(void 0, [_e.apply(void 0, [_p.sent()])]).toBe(messages_1.MESSAGES.badValue);
                    _f = vitest_1.expect;
                    _g = refused;
                    return [4 /*yield*/, api.saveCanvas(KEY, { nodes: Array.from({ length: 1001 }, function (_, i) { return card("c".concat(i)); }), edges: [] }, null)];
                case 6:
                    _f.apply(void 0, [_g.apply(void 0, [_p.sent()])]).toBe(messages_1.MESSAGES.canvasTooBig);
                    _h = vitest_1.expect;
                    _j = refused;
                    return [4 /*yield*/, api.saveCanvas(KEY, { nodes: __spreadArray([card('a', { text: 'x'.repeat(100000) })], Array.from({ length: 60 }, function (_, i) { return card("c".concat(i), { text: 'x'.repeat(100000) }); }), true), edges: [] }, null)];
                case 7:
                    _h.apply(void 0, [_j.apply(void 0, [_p.sent()])]).toBe(messages_1.MESSAGES.canvasTooBig);
                    _k = vitest_1.expect;
                    _l = refused;
                    return [4 /*yield*/, api.readCanvas('../other')];
                case 8:
                    _k.apply(void 0, [_l.apply(void 0, [_p.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    _m = vitest_1.expect;
                    _o = refused;
                    return [4 /*yield*/, api.saveCanvas('../other', board, null)];
                case 9:
                    _m.apply(void 0, [_o.apply(void 0, [_p.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readdir)(dir)).rejects.toThrow()];
                case 10:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
