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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var messages_1 = require("../../../core/messages");
var node_host_1 = require("../../../core/node_host");
var notes_api_1 = require("./notes_api");
var KEY = 'demo-abc123';
var OTHER = 'other-def456';
var NOW = Date.parse('2026-11-07T12:00:00Z');
var BACKUP = "Notes backup ".concat(KEY, " 2026-11-07");
var MANIFEST = 'queue-tea-notes.json';
var TEN_MB = 10 * 1024 * 1024;
var PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64');
var PDF = Buffer.from('%PDF-1.4\n%%EOF\n');
// Front matter that never closes, with a Latin-1 é that isn't UTF-8.
var LOOSE = Buffer.concat([Buffer.from('---\ntitle: [unclosed\nCaf'), Buffer.from([0xe9]), Buffer.from('\n')]);
var WINDOWS = '---\r\ntitle: Windows\r\n---\r\nLine one\r\nLine two\r\n';
var home;
var dir;
var outside;
var ids;
var chosen;
var buttons;
var deps;
var api;
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
var vaultOf = function (key) { return (0, node_path_1.join)(home, '.queue-tea/notes', key); };
// Every entry under root by its path: a plain file's bytes, or what else it is.
var tree = function (root_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([root_1], args_1, true), void 0, function (root, prefix) {
        var found, _a, _b, entry, path, _c, _d, _e, _f, _g;
        if (prefix === void 0) { prefix = ''; }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    found = {};
                    _a = 0;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(root, prefix), { withFileTypes: true }).catch(function () { return []; })];
                case 1:
                    _b = _h.sent();
                    _h.label = 2;
                case 2:
                    if (!(_a < _b.length)) return [3 /*break*/, 8];
                    entry = _b[_a];
                    path = prefix === '' ? entry.name : "".concat(prefix, "/").concat(entry.name);
                    if (!entry.isSymbolicLink()) return [3 /*break*/, 3];
                    found[path] = 'symlink';
                    return [3 /*break*/, 7];
                case 3:
                    if (!entry.isDirectory()) return [3 /*break*/, 5];
                    _d = (_c = Object).assign;
                    _e = [found];
                    return [4 /*yield*/, tree(root, path)];
                case 4:
                    _d.apply(_c, _e.concat([_h.sent()]));
                    return [3 /*break*/, 7];
                case 5:
                    _f = found;
                    _g = path;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(root, path))];
                case 6:
                    _f[_g] = _h.sent();
                    _h.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, found];
            }
        });
    });
};
var historyCount = function (key) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = Object).keys;
            return [4 /*yield*/, tree(vaultOf(key), '.history')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]).length
            // A realm with what a vault holds: a live note, an archived one, one that
            // won't parse, one with Windows line ends, a picture, a file at the top, and
            // what a backup must leave behind.
        ];
    }
}); }); };
// A realm with what a vault holds: a live note, an archived one, one that
// won't parse, one with Windows line ends, a picture, a file at the top, and
// what a backup must leave behind.
var fillRealm = function () { return __awaiter(void 0, void 0, void 0, function () {
    var plan, old, _a, picture, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, created({ title: 'Plan', body: 'Live body' })];
            case 1:
                plan = _c.sent();
                return [4 /*yield*/, created({ title: 'Old' })];
            case 2:
                old = _c.sent();
                _a = data;
                return [4 /*yield*/, api.archiveNote(KEY, old.id, true)];
            case 3:
                _a.apply(void 0, [_c.sent()]);
                _b = data;
                return [4 /*yield*/, api.attachNoteFile(KEY, plan.id, { name: 'diagram.png', type: 'image/png', bytes: new Uint8Array(PNG) })];
            case 4:
                picture = _b.apply(void 0, [_c.sent()]);
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Loose.md'), LOOSE)];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Windows.md'), WINDOWS)];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'table.csv'), 'a,b\n1,2\n')];
            case 7:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Draft.md.tmp'), 'half written')];
            case 8:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Draft.md.bak'), 'an old save')];
            case 9:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, "".concat(picture.path, ".1234.tmp")), 'half a picture')];
            case 10:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, '.hidden.png'), PNG)];
            case 11:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, '.DS_Store'), 'finder')];
            case 12:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(dir, 'sub'))];
            case 13:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'sub/inner.png'), PNG)];
            case 14:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(dir, 'attachments/nested'))];
            case 15:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'attachments/nested/deep.png'), PNG)];
            case 16:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'secret.png'), PNG)];
            case 17:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'Secret.md'), 'private')];
            case 18:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'secret.png'), (0, node_path_1.join)(dir, 'linked.png'))];
            case 19:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'Secret.md'), (0, node_path_1.join)(dir, 'Linked.md'))];
            case 20:
                _c.sent();
                return [2 /*return*/, { plan: plan, old: old, picture: picture, exported: ["".concat(plan.id, ".md"), "".concat(old.id, ".md"), 'Loose.md', 'Windows.md', picture.path, 'table.csv'] }];
        }
    });
}); };
var exported = function () { return __awaiter(void 0, void 0, void 0, function () {
    var done, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                chosen = outside;
                _a = data;
                return [4 /*yield*/, api.exportNotes(KEY)];
            case 1:
                done = _a.apply(void 0, [_b.sent()]);
                return [2 /*return*/, (0, node_path_1.join)(outside, done.folder)];
        }
    });
}); };
// The reply as it comes, for a folder restore should refuse.
var restoreFrom = function (folder) {
    chosen = folder;
    return api.restoreNotes(KEY);
};
var restored = function (backup_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([backup_1], args_1, true), void 0, function (backup, key, from) {
        var _a;
        if (key === void 0) { key = KEY; }
        if (from === void 0) { from = api; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chosen = backup;
                    _a = data;
                    return [4 /*yield*/, from.restoreNotes(key)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        });
    });
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log, host;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-backup-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                dir = vaultOf(KEY);
                outside = (0, node_path_1.join)(home, 'Backups');
                ids = 0;
                chosen = outside;
                buttons = [];
                return [4 /*yield*/, (0, promises_1.mkdir)(outside)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify((0, record_source_1.emptyRecord)('demo', '/p/demo')))];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(OTHER, ".json")), JSON.stringify((0, record_source_1.emptyRecord)('other', '/p/other')))];
            case 6:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                host = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                }); }); });
                deps = { host: host, home: home, now: function () { return NOW; }, offsetMinutes: function () { return 60; }, log: log, newId: function () { return "t-".concat((ids += 1)); }, newNoteId: function () { return "n-".concat((ids += 1)); }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); }, copy: function () { }, prepareCodex: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, []];
                    }); }); }, reveal: function () { }, pickFolder: function (button) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            buttons.push(button);
                            return [2 /*return*/, chosen];
                        });
                    }); } };
                api = (0, notes_api_1.notesApi)(deps);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('exporting notes', function () {
    (0, vitest_1.it)('copies the notes and the files they can link byte for byte, and nothing else but the manifest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, done, _a, backup, _i, _b, path, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _e.sent();
                    _a = data;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 2:
                    done = _a.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(buttons).toEqual([messages_1.MESSAGES.exportButton]);
                    (0, vitest_1.expect)(done).toEqual({ folder: BACKUP, notes: 4, files: 2, skipped: [] });
                    return [4 /*yield*/, tree((0, node_path_1.join)(outside, BACKUP))];
                case 3:
                    backup = _e.sent();
                    (0, vitest_1.expect)(Object.keys(backup).sort()).toEqual(__spreadArray(__spreadArray([], realm.exported, true), [MANIFEST], false).sort());
                    _i = 0, _b = realm.exported;
                    _e.label = 4;
                case 4:
                    if (!(_i < _b.length)) return [3 /*break*/, 7];
                    path = _b[_i];
                    _d = (_c = (0, vitest_1.expect)(backup[path], path)).toEqual;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, path))];
                case 5:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('writes a manifest saying the format, the realm, when, and how many notes and files went in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 2:
                    _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(outside, BACKUP, MANIFEST), 'utf8')];
                case 3:
                    _b.apply(void 0, [_d.apply(_c, [_e.sent()])]).toEqual({ format: 1, realm: KEY, exported: '2026-11-07T13:00:00+01:00', notes: 4, files: 2 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves out a file too large and one that will not read, names them, and exports the rest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    plan = _f.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'huge.pdf'), Buffer.alloc(TEN_MB))];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Locked.md'), 'secret')];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(dir, 'Locked.md'), 0)];
                case 4:
                    _f.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 5:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]).toEqual({ folder: BACKUP, notes: 1, files: 0, skipped: [{ path: 'Locked.md', reason: 'unreadable' }, { path: 'huge.pdf', reason: 'size' }] });
                    _c = vitest_1.expect;
                    _e = (_d = Object).keys;
                    return [4 /*yield*/, tree((0, node_path_1.join)(outside, BACKUP))];
                case 6:
                    _c.apply(void 0, [_e.apply(_d, [_f.sent()]).sort()]).toEqual(["".concat(plan.id, ".md"), MANIFEST].sort());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm with no notes before the picker opens, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_h.sent()])]).toBe(messages_1.MESSAGES.nothingToExport);
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(dir, 'attachments'), { recursive: true })];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'attachments/picture.png'), PNG)];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Draft.md.tmp'), 'half written')];
                case 4:
                    _h.sent();
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 5:
                    _c.apply(void 0, [_d.apply(void 0, [_h.sent()])]).toBe(messages_1.MESSAGES.nothingToExport);
                    _e = vitest_1.expect;
                    _f = refused;
                    return [4 /*yield*/, api.exportNotes('unknown-abc123')];
                case 6:
                    _e.apply(void 0, [_f.apply(void 0, [_h.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    (0, vitest_1.expect)(buttons).toEqual([]);
                    _g = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(outside)];
                case 7:
                    _g.apply(void 0, [_h.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a cancelled picker gives nothing back and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, tree(dir)];
                case 2:
                    before = _e.sent();
                    chosen = null;
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBeNull();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(outside)];
                case 4:
                    _c.apply(void 0, [_e.sent()]).toEqual([]);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toEqual(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a backup name already taken that day gets the next number, and the first backup stays as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, view, _b, first, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, created({ body: 'First' })];
                case 1:
                    _a = _h.sent(), id = _a.id, view = _a.view;
                    _b = data;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 2:
                    _b.apply(void 0, [_h.sent()]);
                    return [4 /*yield*/, tree((0, node_path_1.join)(outside, BACKUP))];
                case 3:
                    first = _h.sent();
                    _c = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Second' }), view.notes[0].stamp)];
                case 4:
                    _c.apply(void 0, [_h.sent()]);
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 5:
                    _d.apply(void 0, [_e.apply(void 0, [_h.sent()]).folder]).toBe("".concat(BACKUP, " 2"));
                    _f = vitest_1.expect;
                    return [4 /*yield*/, tree((0, node_path_1.join)(outside, BACKUP))];
                case 6:
                    _f.apply(void 0, [_h.sent()]).toEqual(first);
                    _g = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(outside, "".concat(BACKUP, " 2"), "".concat(id, ".md")), 'utf8')];
                case 7:
                    _g.apply(void 0, [(_h.sent())]).toContain('Second');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a write that fails part way removes the unfinished backup and says nothing was saved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var parent, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, created({ title: 'A' })
                    // A note whose path in the backup is longer than the system allows.
                ];
                case 1:
                    _d.sent();
                    // A note whose path in the backup is longer than the system allows.
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, "Z".concat('z'.repeat(80), ".md")), 'too long a path there')];
                case 2:
                    // A note whose path in the backup is longer than the system allows.
                    _d.sent();
                    parent = outside;
                    while (parent.length < 950)
                        parent = (0, node_path_1.join)(parent, 'd'.repeat(Math.min(200, 950 - parent.length - 1)));
                    return [4 /*yield*/, (0, promises_1.mkdir)(parent, { recursive: true })];
                case 3:
                    _d.sent();
                    chosen = parent;
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.exportNotes);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(parent)];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('restoring notes', function () {
    (0, vitest_1.it)('into an empty realm brings back every note and file byte for byte, archived ones archived', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, backup, done, _i, _a, path, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _e.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _e.sent();
                    return [4 /*yield*/, (0, promises_1.rm)(dir, { recursive: true })];
                case 3:
                    _e.sent();
                    buttons = [];
                    return [4 /*yield*/, restored(backup)];
                case 4:
                    done = _e.sent();
                    (0, vitest_1.expect)(buttons).toEqual([messages_1.MESSAGES.restoreButton]);
                    (0, vitest_1.expect)(done).toMatchObject({ added: 4, renamed: 0, same: 0, toHistory: 0, skipped: [] });
                    _i = 0, _a = realm.exported;
                    _e.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    path = _a[_i];
                    _c = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 6:
                    _d = (_b = _c.apply(void 0, [(_e.sent())[path], path])).toEqual;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(backup, path))];
                case 7:
                    _d.apply(_b, [_e.sent()]);
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 5];
                case 9:
                    (0, vitest_1.expect)(done.view.notes.map(function (note) { return [note.id, note.isArchived]; }).sort()).toEqual([[realm.plan.id, false], [realm.old.id, true], ['Loose', false], ['Windows', false]].sort());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("never brings the backup's own manifest into the realm, so the realm exports again", function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, backup, done, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _e.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _e.sent();
                    return [4 /*yield*/, (0, promises_1.rm)(dir, { recursive: true })];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, restored(backup)];
                case 4:
                    done = _e.sent();
                    (0, vitest_1.expect)(done.files).toBe(2);
                    _a = vitest_1.expect;
                    _c = (_b = Object).keys;
                    return [4 /*yield*/, tree(dir)];
                case 5:
                    _a.apply(void 0, [_c.apply(_b, [_e.sent()]).filter(function (path) { return !path.startsWith('.history/'); }).sort()]).toEqual(__spreadArray([], realm.exported, true).sort());
                    chosen = outside;
                    _d = vitest_1.expect;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toMatchObject({ ok: true, data: { notes: 4, files: 2, skipped: [] } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a realm still holding a manifest from an earlier restore exports, with a fresh manifest of its own', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan, _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    plan = _j.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, MANIFEST), '{"format": 1, "realm": "elsewhere"}')];
                case 2:
                    _j.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.exportNotes(KEY)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_j.sent()])]).toEqual({ folder: BACKUP, notes: 1, files: 0, skipped: [] });
                    _c = vitest_1.expect;
                    _e = (_d = Object).keys;
                    return [4 /*yield*/, tree((0, node_path_1.join)(outside, BACKUP))];
                case 4:
                    _c.apply(void 0, [_e.apply(_d, [_j.sent()]).sort()]).toEqual(["".concat(plan.id, ".md"), MANIFEST].sort());
                    _f = vitest_1.expect;
                    _h = (_g = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(outside, BACKUP, MANIFEST), 'utf8')];
                case 5:
                    _f.apply(void 0, [_h.apply(_g, [_j.sent()])]).toMatchObject({ format: 1, realm: KEY });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a second and third restore of the same backup change nothing, even after a restart', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, backup, _a, after, counts, _i, _b, from, _c, _d, _e;
        var _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _h.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _h.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, 'Windows.md'))];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, realm.picture.path))];
                case 4:
                    _h.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 5:
                    _a.apply(void 0, [(_h.sent()).added]).toBe(1);
                    return [4 /*yield*/, tree(dir)];
                case 6:
                    after = _h.sent();
                    _f = { notes: Object.keys(after).filter(function (path) { return !path.includes('/') && path.endsWith('.md'); }).length };
                    return [4 /*yield*/, historyCount(KEY)];
                case 7:
                    _f.history = _h.sent();
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(dir, 'attachments'))];
                case 8:
                    counts = (_f.attachments = (_h.sent()).length, _f);
                    _i = 0, _b = [api, (0, notes_api_1.notesApi)(deps)];
                    _h.label = 9;
                case 9:
                    if (!(_i < _b.length)) return [3 /*break*/, 15];
                    from = _b[_i];
                    _c = vitest_1.expect;
                    return [4 /*yield*/, restored(backup, KEY, from)];
                case 10:
                    _c.apply(void 0, [_h.sent()]).toMatchObject({ added: 0, renamed: 0, same: 4, toHistory: 0, files: 0, skipped: [] });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 11:
                    _d.apply(void 0, [_h.sent()]).toEqual(after);
                    _e = vitest_1.expect;
                    _g = { notes: counts.notes };
                    return [4 /*yield*/, historyCount(KEY)];
                case 12:
                    _g.history = _h.sent();
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(dir, 'attachments'))];
                case 13:
                    _e.apply(void 0, [(_g.attachments = (_h.sent()).length, _g)]).toEqual(counts);
                    _h.label = 14;
                case 14:
                    _i++;
                    return [3 /*break*/, 9];
                case 15: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("a live note that differs stays as it is, and the backup's text joins its History once", function () { return __awaiter(void 0, void 0, void 0, function () {
        var backup, live, _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, exported()
                        // Edited in Obsidian after the backup: no History of its own yet.
                    ];
                case 2:
                    backup = _j.sent();
                    // Edited in Obsidian after the backup: no History of its own yet.
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'Windows.md'), '---\ntitle: Windows\n---\nRewritten\n')];
                case 3:
                    // Edited in Obsidian after the backup: no History of its own yet.
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, 'Windows.md'))];
                case 4:
                    live = _j.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 5:
                    _a.apply(void 0, [_j.sent()]).toMatchObject({ added: 0, same: 3, toHistory: 1 });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 6:
                    _b.apply(void 0, [_j.sent()]).toMatchObject({ added: 0, same: 4, toHistory: 0 });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, 'Windows.md'))];
                case 7:
                    _c.apply(void 0, [_j.sent()]).toEqual(live);
                    _d = vitest_1.expect;
                    _f = (_e = Object).values;
                    return [4 /*yield*/, tree(dir, '.history/Windows')];
                case 8:
                    _d.apply(void 0, [_f.apply(_e, [_j.sent()])]).toEqual([Buffer.from(WINDOWS)]);
                    _g = vitest_1.expect;
                    _h = data;
                    return [4 /*yield*/, api.readNoteHistory(KEY, 'Windows')];
                case 9:
                    _g.apply(void 0, [_h.apply(void 0, [_j.sent()])]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("a backup's text already in the note's History counts as already here", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, id, view, backup, _b, live, history, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, created({ body: 'First' })];
                case 1:
                    _a = _f.sent(), id = _a.id, view = _a.view;
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _f.sent();
                    _b = data;
                    return [4 /*yield*/, api.saveNote(KEY, id, change({ body: 'Second' }), view.notes[0].stamp)];
                case 3:
                    _b.apply(void 0, [_f.sent()]);
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(id, ".md")))];
                case 4:
                    live = _f.sent();
                    return [4 /*yield*/, tree(dir, ".history/".concat(id))];
                case 5:
                    history = _f.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 6:
                    _c.apply(void 0, [_f.sent()]).toMatchObject({ added: 0, same: 1, toHistory: 0 });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(id, ".md")))];
                case 7:
                    _d.apply(void 0, [_f.sent()]).toEqual(live);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, tree(dir, ".history/".concat(id))];
                case 8:
                    _e.apply(void 0, [_f.sent()]).toEqual(history);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a missing note whose title is taken now comes back as "Plan 2", and a second restore adds nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan, backup, _a, _b, taken, takenText, first, _c, original, _d, _e, _f, after, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, created({ title: 'Plan', body: 'From the backup' })];
                case 1:
                    plan = _j.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _j.sent();
                    _a = data;
                    return [4 /*yield*/, api.archiveNote(KEY, plan.id, true)];
                case 3:
                    _a.apply(void 0, [_j.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.deleteNote(KEY, plan.id)];
                case 4:
                    _b.apply(void 0, [_j.sent()]);
                    return [4 /*yield*/, created({ title: 'Plan', body: 'Written since' })];
                case 5:
                    taken = _j.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(taken.id, ".md")))];
                case 6:
                    takenText = _j.sent();
                    return [4 /*yield*/, restored(backup)];
                case 7:
                    first = _j.sent();
                    (0, vitest_1.expect)(first).toMatchObject({ added: 1, renamed: 1, same: 0, toHistory: 0, skipped: [] });
                    (0, vitest_1.expect)(first.view.notes.map(function (note) { return [note.id, note.title, note.body]; }).sort()).toEqual([[plan.id, 'Plan 2', 'From the backup'], [taken.id, 'Plan', 'Written since']].sort());
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(dir, "".concat(taken.id, ".md")))];
                case 8:
                    _c.apply(void 0, [_j.sent()]).toEqual(takenText);
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(backup, "".concat(plan.id, ".md")))];
                case 9:
                    original = _j.sent();
                    _d = vitest_1.expect;
                    _f = (_e = Object).values;
                    return [4 /*yield*/, tree(dir, ".history/".concat(plan.id))];
                case 10:
                    _d.apply(void 0, [_f.apply(_e, [_j.sent()]).filter(function (text) { return original.equals(text); })]).toHaveLength(1);
                    return [4 /*yield*/, tree(dir)];
                case 11:
                    after = _j.sent();
                    _g = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 12:
                    _g.apply(void 0, [_j.sent()]).toMatchObject({ added: 0, renamed: 0, same: 1, toHistory: 0, files: 0, skipped: [] });
                    _h = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 13:
                    _h.apply(void 0, [_j.sent()]).toEqual(after);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves out a damaged, a taken, a too-large and an unreadable file and a too-long note, names each, and restores the rest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, report, _a, backup, done, now, _i, _b, path;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.attachNoteFile(KEY, realm.plan.id, { name: 'report.pdf', type: 'application/pdf', bytes: new Uint8Array(PDF) })];
                case 2:
                    report = _a.apply(void 0, [_c.sent()]);
                    return [4 /*yield*/, exported()];
                case 3:
                    backup = _c.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, 'Windows.md'))];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, realm.picture.path))];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, report.path))];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'table.csv'), 'a,b\n9,9\n')];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(backup, realm.picture.path), 'not the picture its name promises')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(backup, 'huge.pdf'), Buffer.alloc(TEN_MB))];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(backup, 'locked.csv'), 'x')];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(backup, 'locked.csv'), 0)];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(backup, 'Long.md'), "---\ntitle: Long\n---\n".concat('x'.repeat(1000001)))];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'secret.png'), (0, node_path_1.join)(backup, 'attachments/escape.png'))];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, restored(backup)];
                case 14:
                    done = _c.sent();
                    (0, vitest_1.expect)(__spreadArray([], done.skipped, true).sort(function (a, b) { return a.path.localeCompare(b.path); })).toEqual([
                        { path: 'Long.md', reason: 'size' },
                        { path: realm.picture.path, reason: 'damaged' },
                        { path: 'huge.pdf', reason: 'size' },
                        { path: 'locked.csv', reason: 'unreadable' },
                        { path: 'table.csv', reason: 'taken' },
                    ].sort(function (a, b) { return a.path.localeCompare(b.path); }));
                    (0, vitest_1.expect)(done.added).toBe(1);
                    return [4 /*yield*/, tree(dir)];
                case 15:
                    now = _c.sent();
                    (0, vitest_1.expect)(now['Windows.md']).toEqual(Buffer.from(WINDOWS));
                    (0, vitest_1.expect)(now[report.path]).toEqual(PDF);
                    (0, vitest_1.expect)(now['table.csv']).toEqual(Buffer.from('a,b\n9,9\n'));
                    for (_i = 0, _b = [realm.picture.path, 'huge.pdf', 'locked.csv', 'Long.md', 'attachments/escape.png']; _i < _b.length; _i++) {
                        path = _b[_i];
                        (0, vitest_1.expect)(now[path], path).toBeUndefined();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("never follows a backup's attachments folder that links elsewhere", function () { return __awaiter(void 0, void 0, void 0, function () {
        var plan, backup, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, created()];
                case 1:
                    plan = _e.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _e.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'elsewhere'))];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'elsewhere/private.png'), PNG)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'elsewhere'), (0, node_path_1.join)(backup, 'attachments'))];
                case 5:
                    _e.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 6:
                    _a.apply(void 0, [_e.sent()]).toMatchObject({ added: 0, same: 1, files: 0, skipped: [] });
                    _b = vitest_1.expect;
                    _d = (_c = Object).keys;
                    return [4 /*yield*/, tree(dir)];
                case 7:
                    _b.apply(void 0, [_d.apply(_c, [_e.sent()]).filter(function (path) { return !path.startsWith('.history/'); })]).toEqual(["".concat(plan.id, ".md")]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('writes nothing through a live attachments folder that links outside the vault', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, backup, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _c.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _c.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, 'attachments'), { recursive: true })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'outside-vault'))];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'outside-vault'), (0, node_path_1.join)(dir, 'attachments'))];
                case 5:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 6:
                    _a.apply(void 0, [(_c.sent()).skipped.map(function (skip) { return skip.path; })]).toEqual([realm.picture.path]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(home, 'outside-vault'))];
                case 7:
                    _b.apply(void 0, [_c.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder that is not a backup, or one from a newer Queue-tea, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var cases, _i, cases_1, _a, name_1, manifest, message, folder, _b, _c, linked, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    cases = [
                        ['no manifest', null, messages_1.MESSAGES.notABackup],
                        ['not JSON', '{"format": 1', messages_1.MESSAGES.notABackup],
                        ['null', 'null', messages_1.MESSAGES.notABackup],
                        ['a format in words', '{"format": "1"}', messages_1.MESSAGES.notABackup],
                        ['format 0', '{"format": 0}', messages_1.MESSAGES.notABackup],
                        ['format 2', '{"format": 2}', messages_1.MESSAGES.backupTooNew],
                    ];
                    _i = 0, cases_1 = cases;
                    _g.label = 1;
                case 1:
                    if (!(_i < cases_1.length)) return [3 /*break*/, 8];
                    _a = cases_1[_i], name_1 = _a[0], manifest = _a[1], message = _a[2];
                    folder = (0, node_path_1.join)(outside, name_1);
                    return [4 /*yield*/, (0, promises_1.mkdir)(folder)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'n-1.md'), '---\ntitle: Plan\n---\nBody')];
                case 3:
                    _g.sent();
                    if (!(manifest !== null)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, MANIFEST), manifest)];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5:
                    _b = vitest_1.expect;
                    _c = refused;
                    return [4 /*yield*/, restoreFrom(folder)];
                case 6:
                    _b.apply(void 0, [_c.apply(void 0, [_g.sent()]), name_1]).toBe(message);
                    _g.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8:
                    linked = (0, node_path_1.join)(outside, 'manifest linked');
                    return [4 /*yield*/, (0, promises_1.mkdir)(linked)];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'real.json'), '{"format": 1}')];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'real.json'), (0, node_path_1.join)(linked, MANIFEST))];
                case 11:
                    _g.sent();
                    _d = vitest_1.expect;
                    _e = refused;
                    return [4 /*yield*/, restoreFrom(linked)];
                case 12:
                    _d.apply(void 0, [_e.apply(void 0, [_g.sent()])]).toBe(messages_1.MESSAGES.notABackup);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 13:
                    _f.apply(void 0, [_g.sent()]).toEqual({});
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a backup of more than 5,000 notes and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var folder, n, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    folder = (0, node_path_1.join)(outside, 'big');
                    return [4 /*yield*/, (0, promises_1.mkdir)(folder)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, MANIFEST), '{"format": 1}')];
                case 2:
                    _d.sent();
                    n = 0;
                    _d.label = 3;
                case 3:
                    if (!(n < 5001)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, "n-".concat(n, ".md")), 'x')];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    n += 1;
                    return [3 /*break*/, 3];
                case 6:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, restoreFrom(folder)];
                case 7:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.backupTooBig);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 8:
                    _c.apply(void 0, [_d.sent()]).toEqual({});
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a cancelled picker gives nothing back and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, tree(dir)];
                case 2:
                    before = _d.sent();
                    chosen = null;
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.restoreNotes(KEY)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBeNull();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toEqual(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('restores into another realm and leaves the first as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, backup, first, _a, other, _i, _b, path, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _d.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _d.sent();
                    return [4 /*yield*/, tree(dir)];
                case 3:
                    first = _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, restored(backup, OTHER)];
                case 4:
                    _a.apply(void 0, [_d.sent()]).toMatchObject({ added: 4, toHistory: 0, skipped: [] });
                    return [4 /*yield*/, tree(vaultOf(OTHER))];
                case 5:
                    other = _d.sent();
                    for (_i = 0, _b = realm.exported; _i < _b.length; _i++) {
                        path = _b[_i];
                        (0, vitest_1.expect)(other[path], path).toEqual(first[path]);
                    }
                    _c = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 6:
                    _c.apply(void 0, [_d.sent()]).toEqual(first);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a restore that cannot write here says so, and trying again adds the rest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var backup, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _d.sent();
                    return [4 /*yield*/, (0, promises_1.rm)(dir, { recursive: true })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'attachments'), 'a file where the folder goes')];
                case 5:
                    _d.sent();
                    chosen = backup;
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.restoreNotes(KEY)];
                case 6:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.restoreNotes);
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(dir, 'attachments'))];
                case 7:
                    _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, restored(backup)];
                case 8:
                    _c.apply(void 0, [_d.sent()]).toMatchObject({ added: 4, skipped: [] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('two restores at once leave one copy of everything, and only one of them adds it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realm, backup, _a, first, second, _i, _b, path, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, fillRealm()];
                case 1:
                    realm = _f.sent();
                    return [4 /*yield*/, exported()];
                case 2:
                    backup = _f.sent();
                    return [4 /*yield*/, (0, promises_1.rm)(dir, { recursive: true })];
                case 3:
                    _f.sent();
                    chosen = backup;
                    return [4 /*yield*/, Promise.all([api.restoreNotes(KEY), api.restoreNotes(KEY)])];
                case 4:
                    _a = (_f.sent()).map(function (answer) { return data(answer); }).sort(function (a, b) { return b.added - a.added; }), first = _a[0], second = _a[1];
                    (0, vitest_1.expect)(first).toMatchObject({ added: 4, files: 2, skipped: [] });
                    (0, vitest_1.expect)(second).toMatchObject({ added: 0, same: 4, files: 0, skipped: [] });
                    _i = 0, _b = realm.exported;
                    _f.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 9];
                    path = _b[_i];
                    _d = vitest_1.expect;
                    return [4 /*yield*/, tree(dir)];
                case 6:
                    _e = (_c = _d.apply(void 0, [(_f.sent())[path], path])).toEqual;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(backup, path))];
                case 7:
                    _e.apply(_c, [_f.sent()]);
                    _f.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 5];
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
