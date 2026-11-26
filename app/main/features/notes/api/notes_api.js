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
exports.notesApi = void 0;
var node_crypto_1 = require("node:crypto");
var file_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/file_task");
var time_1 = require("../../../../../hooks/shared/time/domain/services/time");
var notes_1 = require("../../../../shared/notes");
var constants_1 = require("../../../core/constants");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var projects_api_1 = require("../../projects/api/projects_api");
var scope_1 = require("../../tasks/api/scope");
var task_input_1 = require("../../tasks/domain/task_input");
var note_file_1 = require("../domain/note_file");
var note_bookmarks_1 = require("../../../../shared/note_bookmarks");
var bookmark_page_1 = require("../data/bookmark_page");
var note_backup_1 = require("../data/note_backup");
var note_files_1 = require("../data/note_files");
var bookmark_1 = require("../domain/bookmark");
var note_canvas_1 = require("../domain/note_canvas");
var note_canvas_2 = require("../../../../shared/note_canvas");
var note_history_1 = require("../domain/note_history");
var stampOf = function (text) { return (0, node_crypto_1.createHash)('sha1').update(text).digest('hex'); };
var same = function (a, b) { return a.toLowerCase() === b.toLowerCase(); };
// Everything from the window is checked again here: the editor's checks are
// for the person writing, these are for the file.
var folderNameOf = function (value) {
    var folder = typeof value === 'string' ? value.trim().replace(/[\r\n]/g, ' ') : '';
    if (folder.length > notes_1.NOTE_LIMITS.folder)
        throw new reply_1.Refusal(messages_1.MESSAGES.noteFolderLong);
    if (notes_1.NOTE_FOLDER_BAD.test(folder))
        throw new reply_1.Refusal(messages_1.MESSAGES.noteFolderBad);
    return folder;
};
var changeOf = function (value) {
    var _a, _b, _c;
    var v = (value !== null && value !== void 0 ? value : {});
    var title = typeof v.title === 'string' ? v.title.trim() : '';
    if (title === '')
        throw new reply_1.Refusal(messages_1.MESSAGES.noteTitleRequired);
    if (title.length > notes_1.NOTE_LIMITS.title)
        throw new reply_1.Refusal(messages_1.MESSAGES.noteTitleLong);
    if (notes_1.NOTE_TITLE_BAD.test(title))
        throw new reply_1.Refusal(messages_1.MESSAGES.noteTitleBad);
    var folder = folderNameOf(v.folder);
    var type = (_a = v.type) !== null && _a !== void 0 ? _a : null;
    if (type !== null && (0, notes_1.noteTypeOf)(type) !== type)
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    var isPinned = (_b = v.isPinned) !== null && _b !== void 0 ? _b : false;
    if (typeof isPinned !== 'boolean')
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    if (typeof v.body !== 'string')
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    if (v.body.length > notes_1.NOTE_LIMITS.body)
        throw new reply_1.Refusal(messages_1.MESSAGES.noteTooLong);
    var given = (_c = v.tags) !== null && _c !== void 0 ? _c : [];
    if (!Array.isArray(given) || given.some(function (tag) { return typeof tag !== 'string'; }))
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    var tags = __spreadArray([], new Set(given.map(notes_1.cleanTag).filter(function (tag) { return tag !== ''; })), true);
    if (tags.some(function (tag) { return tag.length > notes_1.NOTE_LIMITS.tag; }))
        throw new reply_1.Refusal(messages_1.MESSAGES.noteTagLong);
    if (tags.length > notes_1.NOTE_LIMITS.tags)
        throw new reply_1.Refusal(messages_1.MESSAGES.noteTooManyTags);
    return { title: title, folder: folder === '' ? notes_1.INBOX : folder, type: type, isPinned: isPinned, tags: tags, body: v.body };
};
var proposedOf = function (value) {
    if (!Array.isArray(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    if (value.length === 0)
        throw new reply_1.Refusal(messages_1.MESSAGES.noQuestsToFile);
    if (value.length > notes_1.NOTE_LIMITS.quests)
        throw new reply_1.Refusal(messages_1.MESSAGES.tooManyQuests);
    return value.map(function (q) {
        var _a;
        var item = (_a = q === null || q === void 0 ? void 0 : q.item) !== null && _a !== void 0 ? _a : null;
        if (item !== null && (typeof item !== 'string' || item.length > notes_1.NOTE_LIMITS.item))
            throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
        // newQuestOf checks the title, priority and difficulty as the quest form does.
        var quest = (0, task_input_1.newQuestOf)(__assign(__assign({}, q), { parent: { kind: 'none' } }));
        return { title: quest.title, priority: quest.priority, difficulty: quest.difficulty, item: item };
    });
};
// A link from a note opens in the browser or mail app, and nothing else does.
var LINK_KINDS = ['http:', 'https:', 'mailto:'];
var linkOf = function (value) {
    if (typeof value !== 'string' || value.length > 2048)
        throw new reply_1.Refusal(messages_1.MESSAGES.badNoteLink);
    try {
        if (LINK_KINDS.includes(new URL(value).protocol))
            return value;
    }
    catch (_a) {
        // Not a URL at all: refused below, as any other kind is.
    }
    throw new reply_1.Refusal(messages_1.MESSAGES.badNoteLink);
};
// A file too large or not a plain file is refused; anything else just wouldn't read.
var skipOf = function (err) { return (err instanceof reply_1.Refusal ? 'size' : 'unreadable'); };
// A realm's notes keep to a folder of Markdown files outside its repository:
// one there would hold Start until committed, and notes change all the time.
// The folder opens as an Obsidian vault as it is.
var notesApi = function (d) {
    var files = (0, note_files_1.noteFiles)(d.home);
    var bookmarks = new Map();
    var folderOf = function (key) { return "".concat(d.home, "/").concat(notes_1.NOTES_FOLDER, "/").concat(key); };
    var pathOf = function (key, id) { return "".concat(folderOf(key), "/").concat(id, ".md"); };
    var historyOf = function (key, id) { return "".concat(folderOf(key), "/").concat(notes_1.NOTE_HISTORY_FOLDER, "/").concat(id); };
    var nowText = function () { return (0, time_1.isoLocal)(d.now(), d.offsetMinutes()); };
    var realmOf = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = !(0, projects_api_1.isProjectKey)(key);
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, d.host.exists("".concat((0, constants_1.projectsFolder)(d.home), "/").concat(key, ".json"))];
                case 1:
                    _a = !(_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a)
                        throw new reply_1.Refusal(messages_1.MESSAGES.unknownProject);
                    return [2 /*return*/, key];
            }
        });
    }); };
    var idOf = function (id) {
        if (!(0, notes_1.isNoteId)(id))
            throw new reply_1.Refusal(messages_1.MESSAGES.unknownNote);
        return id;
    };
    var readOne = function (key, id) { return __awaiter(void 0, void 0, void 0, function () {
        var path, text, changed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = pathOf(key, id);
                    return [4 /*yield*/, d.host.exists(path)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, d.host.read(path)];
                case 2:
                    text = _a.sent();
                    return [4 /*yield*/, d.host.modifiedAt(path)];
                case 3:
                    changed = _a.sent();
                    d.log.debug("note read: ".concat(path));
                    return [2 /*return*/, { id: id, text: text, file: (0, note_file_1.parseNote)(text, id, (0, time_1.isoLocal)(changed !== null && changed !== void 0 ? changed : d.now(), d.offsetMinutes())) }];
            }
        });
    }); };
    var loadAll = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var names, loaded, unreadable, _i, _a, name_1, one, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, d.host.list(folderOf(key))];
                case 1:
                    names = (_b.sent()).filter(function (name) { return name.endsWith('.md') && (0, notes_1.isNoteId)(name.slice(0, -3)); }).sort();
                    loaded = [];
                    unreadable = [];
                    _i = 0, _a = names.slice(0, notes_1.NOTE_LIMITS.notes);
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    name_1 = _a[_i];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, readOne(key, name_1.slice(0, -3))];
                case 4:
                    one = _b.sent();
                    if (one !== null)
                        loaded.push(one);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    // One file that won't read doesn't hide the rest; the page names it.
                    d.log.error("reading note ".concat(name_1, " failed"), err_1);
                    unreadable.push(name_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, { loaded: loaded, unreadable: unreadable }];
            }
        });
    }); };
    var noteOf = function (_a) {
        var id = _a.id, file = _a.file, text = _a.text;
        return ({ id: id, title: file.title, folder: file.folder, type: file.type, isPinned: file.isPinned, tags: file.tags, created: file.created, updated: file.updated, isArchived: file.isArchived, quests: file.quests, body: file.body, stamp: stampOf(text) });
    };
    var titlesOf = function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadAll(key)];
            case 1: return [2 /*return*/, (_a.sent()).loaded.map(function (one) { return ({ id: one.id, title: one.file.title, isArchived: one.file.isArchived }); })];
        }
    }); }); };
    var viewOf = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, loaded, unreadable;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadAll(key)];
                case 1:
                    _a = _b.sent(), loaded = _a.loaded, unreadable = _a.unreadable;
                    return [2 /*return*/, { notes: loaded.map(noteOf).sort(function (a, b) { return b.updated.localeCompare(a.updated); }), unreadable: unreadable, folder: folderOf(key) }];
            }
        });
    }); };
    var history = function (key, id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, d.host.list(historyOf(key, id))];
                case 1: return [2 /*return*/, (_a.sent())
                        .filter(function (name) { return name.endsWith('.md') && notes_1.NOTE_VERSION_ID.test(name.slice(0, -3)); })
                        .map(function (name) { return ({ id: name.slice(0, -3), savedAt: new Date(Number(notes_1.NOTE_VERSION_ID.exec(name.slice(0, -3))[1])).toISOString() }); })
                        .sort(function (a, b) { return b.id.localeCompare(a.id); })];
            }
        });
    }); };
    var snapshot = function (key_1, id_1, text_1) {
        var args_1 = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args_1[_i - 3] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([key_1, id_1, text_1], args_1, true), void 0, function (key, id, text, isSave) {
            var latest, hash, _a, at, version, path, made, moved;
            if (isSave === void 0) { isSave = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, history(key, id)];
                    case 1:
                        latest = (_b.sent())[0];
                        hash = stampOf(text);
                        _a = !isSave && (latest === null || latest === void 0 ? void 0 : latest.id.endsWith(hash));
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, d.host.read("".concat(historyOf(key, id), "/").concat(latest.id, ".md"))];
                    case 2:
                        _a = (_b.sent()) === text;
                        _b.label = 3;
                    case 3:
                        // Before overwriting, also keep an imported or externally edited file.
                        if (_a)
                            return [2 /*return*/];
                        at = Math.max(d.now(), latest === undefined ? 0 : Number(notes_1.NOTE_VERSION_ID.exec(latest.id)[1]) + 1);
                        version = "v-".concat(String(at).padStart(13, '0'), "-").concat(hash);
                        path = "".concat(historyOf(key, id), "/").concat(version, ".md");
                        return [4 /*yield*/, d.host.makeDirs(historyOf(key, id))];
                    case 4:
                        made = _b.sent();
                        if (made.exitCode !== 0)
                            throw new Error(made.stderr);
                        return [4 /*yield*/, d.host.write("".concat(path, ".tmp"), text)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, d.host.move("".concat(path, ".tmp"), path)];
                    case 6:
                        moved = _b.sent();
                        if (moved.exitCode !== 0)
                            throw new Error(moved.stderr);
                        d.log.debug("note version kept: ".concat(path));
                        return [2 /*return*/];
                }
            });
        });
    };
    var readVersion = function (key, id, version) { return __awaiter(void 0, void 0, void 0, function () {
        var path, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof version !== 'string' || !notes_1.NOTE_VERSION_ID.test(version))
                        throw new reply_1.Refusal(messages_1.MESSAGES.unknownNoteVersion);
                    path = "".concat(historyOf(key, id), "/").concat(version, ".md");
                    return [4 /*yield*/, d.host.exists(path)];
                case 1:
                    if (!(_a.sent()))
                        throw new reply_1.Refusal(messages_1.MESSAGES.unknownNoteVersion);
                    return [4 /*yield*/, d.host.read(path)];
                case 2:
                    text = _a.sent();
                    if (!version.endsWith(stampOf(text)))
                        throw new reply_1.Refusal(messages_1.MESSAGES.unknownNoteVersion);
                    d.log.debug("note version read: ".concat(path));
                    return [2 /*return*/, { id: id, text: text, file: (0, note_file_1.parseNote)(text, id, new Date(Number(notes_1.NOTE_VERSION_ID.exec(version)[1])).toISOString()) }];
            }
        });
    }); };
    var remove = function (path) { return __awaiter(void 0, void 0, void 0, function () {
        var gone;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, d.host.remove(path)];
                case 1:
                    gone = _a.sent();
                    if (gone.exitCode !== 0)
                        throw new Error(gone.stderr);
                    return [2 /*return*/];
            }
        });
    }); };
    // Snapshots are durable before the new text replaces the live file. A failed
    // snapshot/write never leaves half a note. Legacy backups join the history.
    var write = function (key, id, file) { return __awaiter(void 0, void 0, void 0, function () {
        var made, path, text, _a, _b, _c, _d, moved, versions, keep, _i, versions_1, version;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, d.host.makeDirs(folderOf(key))];
                case 1:
                    made = _e.sent();
                    if (made.exitCode !== 0)
                        throw new Error(made.stderr);
                    path = pathOf(key, id);
                    text = (0, note_file_1.noteText)(file);
                    return [4 /*yield*/, d.host.write("".concat(path, ".tmp"), text)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, d.host.exists("".concat(path, ".bak"))];
                case 3:
                    if (!_e.sent()) return [3 /*break*/, 7];
                    return [4 /*yield*/, history(key, id)];
                case 4:
                    if (!((_e.sent()).length === 0)) return [3 /*break*/, 7];
                    _a = snapshot;
                    _b = [key, id];
                    return [4 /*yield*/, d.host.read("".concat(path, ".bak"))];
                case 5: return [4 /*yield*/, _a.apply(void 0, _b.concat([_e.sent()]))];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7: return [4 /*yield*/, d.host.exists(path)];
                case 8:
                    if (!_e.sent()) return [3 /*break*/, 11];
                    _c = snapshot;
                    _d = [key, id];
                    return [4 /*yield*/, d.host.read(path)];
                case 9: return [4 /*yield*/, _c.apply(void 0, _d.concat([_e.sent()]))];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11: return [4 /*yield*/, snapshot(key, id, text, true)];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, d.host.move("".concat(path, ".tmp"), path)];
                case 13:
                    moved = _e.sent();
                    if (moved.exitCode !== 0)
                        throw new Error(moved.stderr);
                    return [4 /*yield*/, remove("".concat(path, ".bak"))];
                case 14:
                    _e.sent();
                    return [4 /*yield*/, history(key, id)];
                case 15:
                    versions = _e.sent();
                    keep = new Set((0, note_history_1.versionsToKeep)(versions).map(function (version) { return version.id; }));
                    _i = 0, versions_1 = versions;
                    _e.label = 16;
                case 16:
                    if (!(_i < versions_1.length)) return [3 /*break*/, 19];
                    version = versions_1[_i];
                    if (!!keep.has(version.id)) return [3 /*break*/, 18];
                    return [4 /*yield*/, remove("".concat(historyOf(key, id), "/").concat(version.id, ".md"))];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 16];
                case 19:
                    d.log.debug("note written: ".concat(path));
                    return [2 /*return*/, { id: id, file: file, text: text }];
            }
        });
    }); };
    var known = function (key, id) { return __awaiter(void 0, void 0, void 0, function () {
        var one;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readOne(key, id)];
                case 1:
                    one = _a.sent();
                    if (one === null)
                        throw new reply_1.Refusal(messages_1.MESSAGES.noteGone);
                    return [2 /*return*/, one];
            }
        });
    }); };
    // One change at a time, so two quick saves can't lose each other.
    var queue = Promise.resolve();
    var inTurn = function (failure, work) {
        var run = queue.then(function () { return (0, reply_1.reply)(d.log, failure, work); });
        queue = run;
        return run;
    };
    // Renaming a note rewrites [[Old]] in the realm's other notes, unless
    // another note has the old title too and the links could mean that one.
    // How many notes it rewrote, for the save line.
    var relink = function (key, id, from, to) { return __awaiter(void 0, void 0, void 0, function () {
        var loaded, others, linking, _i, linking_1, one;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadAll(key)];
                case 1:
                    loaded = (_a.sent()).loaded;
                    others = loaded.filter(function (one) { return one.id !== id; });
                    if (others.some(function (one) { return same(one.file.title, from); }))
                        return [2 /*return*/, 0];
                    linking = others.filter(function (one) { return (0, notes_1.linksOf)(one.file.body).some(function (title) { return same(title, from); }); });
                    _i = 0, linking_1 = linking;
                    _a.label = 2;
                case 2:
                    if (!(_i < linking_1.length)) return [3 /*break*/, 5];
                    one = linking_1[_i];
                    return [4 /*yield*/, write(key, one.id, __assign(__assign({}, one.file), { body: (0, notes_1.renameLinks)(one.file.body, from, to) }))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, linking.length];
            }
        });
    }); };
    // The picker waits on the person, so it runs before the work joins the
    // save queue: an open note keeps saving while it is up.
    var picked = function (key, failure, button, check) {
        if (check === void 0) { check = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); }; }
        return (0, reply_1.reply)(d.log, failure, function () { return __awaiter(void 0, void 0, void 0, function () {
            var realm, folder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, realmOf(key)];
                    case 1:
                        realm = _a.sent();
                        return [4 /*yield*/, check(realm)];
                    case 2:
                        _a.sent();
                        if (d.pickFolder === undefined)
                            throw new Error('pickFolder is unavailable');
                        return [4 /*yield*/, d.pickFolder(button)];
                    case 3:
                        folder = _a.sent();
                        return [2 /*return*/, folder === null ? null : { realm: realm, folder: folder }];
                }
            });
        }); });
    };
    var canvasPathOf = function (key) { return "".concat(folderOf(key), "/").concat(note_canvas_2.NOTE_CANVAS); };
    // The board as its file holds it, or an empty one before the first save. A
    // file that isn't a canvas is refused and never written over.
    var canvasViewOf = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var path, text, canvas;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = canvasPathOf(key);
                    return [4 /*yield*/, d.host.exists(path)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, { canvas: { nodes: [], edges: [] }, stamp: null }];
                    return [4 /*yield*/, d.host.read(path)];
                case 2:
                    text = _a.sent();
                    d.log.debug("canvas read: ".concat(path));
                    canvas = text.length > note_canvas_2.CANVAS_LIMITS.bytes ? null : (0, note_canvas_1.parseCanvas)(text);
                    if (canvas === null)
                        throw new reply_1.Refusal(messages_1.MESSAGES.badCanvasFile);
                    return [2 /*return*/, { canvas: canvas, stamp: stampOf(text) }];
            }
        });
    }); };
    var newId = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var tries, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tries = 0;
                    _a.label = 1;
                case 1:
                    if (!(tries < 5)) return [3 /*break*/, 4];
                    id = d.newNoteId();
                    return [4 /*yield*/, d.host.exists(pathOf(key, id))];
                case 2:
                    if (!(_a.sent()))
                        return [2 /*return*/, id];
                    _a.label = 3;
                case 3:
                    tries += 1;
                    return [3 /*break*/, 1];
                case 4: throw new Error('no free note id after 5 tries');
            }
        });
    }); };
    return {
        // No note id: a file for a quest's description, kept in the same vault.
        attachNoteFile: function (key, id, file) {
            return inTurn(id === null ? messages_1.MESSAGES.attachQuestFile : messages_1.MESSAGES.attachNoteFile, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _b.sent();
                            _a = id !== null;
                            if (!_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, known(realm, idOf(id))];
                        case 2:
                            _a = (_b.sent()).file.isArchived;
                            _b.label = 3;
                        case 3:
                            if (_a)
                                throw new reply_1.Refusal(messages_1.MESSAGES.archivedNoteFile);
                            return [2 /*return*/, files.import(realm, file)];
                    }
                });
            }); });
        },
        readNoteFile: function (key, href) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readNoteFile, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, path, file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _a.sent();
                            path = (0, note_files_1.filePathOf)(href);
                            return [4 /*yield*/, files.read(realm, path)];
                        case 2:
                            file = _a.sent();
                            return [2 /*return*/, { path: path, kind: file.kind }];
                    }
                });
            }); });
        },
        // Only main's private protocol uses the bytes; the window gets metadata.
        serveNoteFile: function (key, href) { return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readNoteFile, function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = files).read;
                    return [4 /*yield*/, realmOf(key)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent(), (0, note_files_1.filePathOf)(href)])];
            }
        }); }); }); },
        downloadNoteFile: function (key, href) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.downloadNoteFile, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, path, file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _a.sent();
                            path = (0, note_files_1.filePathOf)(href);
                            return [4 /*yield*/, files.read(realm, path)];
                        case 2:
                            file = _a.sent();
                            if (d.saveNoteFile === undefined)
                                throw new Error('saveNoteFile is unavailable');
                            return [2 /*return*/, d.saveNoteFile(path.split('/').at(-1), file.bytes)];
                    }
                });
            }); });
        },
        readNotes: function (key) { return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readNotes, function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = viewOf;
                    return [4 /*yield*/, realmOf(key)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        }); }); }); },
        readNoteHistory: function (key, id) {
            return inTurn(messages_1.MESSAGES.readNoteHistory, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, one;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _a.sent();
                            return [4 /*yield*/, known(realm, idOf(id))];
                        case 2:
                            one = _a.sent();
                            return [2 /*return*/, history(realm, one.id)];
                    }
                });
            }); });
        },
        readNoteVersion: function (key, id, version) {
            return inTurn(messages_1.MESSAGES.readNoteHistory, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, one, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _b.sent();
                            return [4 /*yield*/, known(realm, idOf(id))];
                        case 2:
                            one = _b.sent();
                            _a = noteOf;
                            return [4 /*yield*/, readVersion(realm, one.id, version)];
                        case 3: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            }); });
        },
        restoreNoteVersion: function (key, id, version, stamp) {
            return inTurn(messages_1.MESSAGES.restoreNoteVersion, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, noteId, previous, now, next, title, _a, _b, saved, relinked, _c;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _e.sent();
                            noteId = idOf(id);
                            return [4 /*yield*/, readVersion(realm, noteId, version)];
                        case 2:
                            previous = _e.sent();
                            return [4 /*yield*/, readOne(realm, noteId)];
                        case 3:
                            now = _e.sent();
                            if (now === null)
                                return [2 /*return*/, { kind: 'changed', note: null }];
                            if (stampOf(now.text) !== stamp)
                                return [2 /*return*/, { kind: 'changed', note: noteOf(now) }];
                            next = changeOf(__assign(__assign({}, previous.file), { type: now.file.type, isPinned: now.file.isPinned }));
                            if (!now.file.isArchived) return [3 /*break*/, 4];
                            _a = next.title;
                            return [3 /*break*/, 6];
                        case 4:
                            _b = notes_1.freeTitle;
                            return [4 /*yield*/, titlesOf(realm)];
                        case 5:
                            _a = _b.apply(void 0, [_e.sent(), next.title, noteId]);
                            _e.label = 6;
                        case 6:
                            title = _a;
                            return [4 /*yield*/, write(realm, noteId, __assign(__assign(__assign({}, now.file), next), { title: title, updated: nowText() }))];
                        case 7:
                            saved = _e.sent();
                            if (!same(now.file.title, title)) return [3 /*break*/, 8];
                            _c = 0;
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, relink(realm, noteId, now.file.title, title)];
                        case 9:
                            _c = _e.sent();
                            _e.label = 10;
                        case 10:
                            relinked = _c;
                            _d = { kind: 'saved' };
                            return [4 /*yield*/, viewOf(realm)];
                        case 11: return [2 /*return*/, (_d.view = _e.sent(), _d.note = noteOf(saved), _d.relinked = relinked, _d)];
                    }
                });
            }); });
        },
        openLink: function (url) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.openLink, function () { return __awaiter(void 0, void 0, void 0, function () {
                var opened;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, d.host.open(linkOf(url))];
                        case 1:
                            opened = _a.sent();
                            if (opened.exitCode !== 0)
                                throw new Error(opened.stderr);
                            return [2 /*return*/, null];
                    }
                });
            }); });
        },
        // A preview read once stays for the session, so turning to Read doesn't
        // fetch every page again. A failed read isn't kept, so Try again reads anew.
        readBookmark: function (url) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readBookmark, function () { return __awaiter(void 0, void 0, void 0, function () {
                var link, known, bookmark, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            link = typeof url === 'string' ? (0, note_bookmarks_1.bookmarkUrlOf)(url) : null;
                            if (link === null)
                                throw new reply_1.Refusal(messages_1.MESSAGES.badBookmark);
                            known = bookmarks.get(link);
                            if (known !== undefined)
                                return [2 /*return*/, known];
                            _a = bookmark_1.bookmarkOf;
                            _b = [link];
                            return [4 /*yield*/, ((_c = d.readPage) !== null && _c !== void 0 ? _c : bookmark_page_1.readPage)(link)];
                        case 1:
                            bookmark = _a.apply(void 0, _b.concat([_d.sent()]));
                            if (bookmarks.size >= note_bookmarks_1.BOOKMARK_LIMITS.cache)
                                bookmarks.delete(bookmarks.keys().next().value);
                            bookmarks.set(link, bookmark);
                            return [2 /*return*/, bookmark];
                    }
                });
            }); });
        },
        readCanvas: function (key) { return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readCanvas, function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = canvasViewOf;
                    return [4 /*yield*/, realmOf(key)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            }
        }); }); }); },
        // stamp is the file as the board read it, null when there was none. When
        // the file on disk isn't that one any more, nothing is written and the
        // board gets the file as it is now, to ask which to keep.
        saveCanvas: function (key, canvas, stamp) {
            return inTurn(messages_1.MESSAGES.saveCanvas, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, counts, next, text, path, now, _a, _b, made, moved;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _d.sent();
                            counts = (canvas !== null && canvas !== void 0 ? canvas : {});
                            if ((Array.isArray(counts.nodes) && counts.nodes.length > note_canvas_2.CANVAS_LIMITS.nodes) || (Array.isArray(counts.edges) && counts.edges.length > note_canvas_2.CANVAS_LIMITS.edges))
                                throw new reply_1.Refusal(messages_1.MESSAGES.canvasTooBig);
                            next = (0, note_canvas_1.canvasOf)(canvas);
                            if (next === null || (stamp !== null && typeof stamp !== 'string'))
                                throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
                            text = (0, note_canvas_1.canvasText)(next);
                            if (text.length > note_canvas_2.CANVAS_LIMITS.bytes)
                                throw new reply_1.Refusal(messages_1.MESSAGES.canvasTooBig);
                            path = canvasPathOf(realm);
                            return [4 /*yield*/, d.host.exists(path)];
                        case 2:
                            if (!(_d.sent())) return [3 /*break*/, 4];
                            _b = stampOf;
                            return [4 /*yield*/, d.host.read(path)];
                        case 3:
                            _a = _b.apply(void 0, [_d.sent()]);
                            return [3 /*break*/, 5];
                        case 4:
                            _a = null;
                            _d.label = 5;
                        case 5:
                            now = _a;
                            if (!(now !== stamp)) return [3 /*break*/, 7];
                            _c = { kind: 'changed' };
                            return [4 /*yield*/, canvasViewOf(realm)];
                        case 6: return [2 /*return*/, (_c.view = _d.sent(), _c)];
                        case 7: return [4 /*yield*/, d.host.makeDirs(folderOf(realm))];
                        case 8:
                            made = _d.sent();
                            if (made.exitCode !== 0)
                                throw new Error(made.stderr);
                            return [4 /*yield*/, d.host.write("".concat(path, ".tmp"), text)];
                        case 9:
                            _d.sent();
                            return [4 /*yield*/, d.host.move("".concat(path, ".tmp"), path)];
                        case 10:
                            moved = _d.sent();
                            if (moved.exitCode !== 0)
                                throw new Error(moved.stderr);
                            d.log.debug("canvas written: ".concat(path));
                            return [2 /*return*/, { kind: 'saved', stamp: stampOf(text) }];
                    }
                });
            }); });
        },
        // Shows the realm's notes folder in Finder, made first if it isn't there yet.
        showNotes: function (key) {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.showRecord, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, made;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _a.sent();
                            return [4 /*yield*/, d.host.makeDirs(folderOf(realm))];
                        case 2:
                            made = _a.sent();
                            if (made.exitCode !== 0)
                                throw new Error(made.stderr);
                            d.reveal(folderOf(realm));
                            return [2 /*return*/, null];
                    }
                });
            }); });
        },
        // A new folder holding the realm's notes byte for byte and the files they
        // can link, as an Obsidian vault does; history stays behind. Unreadable
        // files are left out and named. null: the picker was cancelled.
        exportNotes: function (key) { return __awaiter(void 0, void 0, void 0, function () {
            var asked, _a, realm, parent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, picked(key, messages_1.MESSAGES.exportNotes, messages_1.MESSAGES.exportButton, function (realm) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, d.host.exists(folderOf(realm))];
                                    case 1:
                                        _a = !(_b.sent());
                                        if (_a) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, note_backup_1.backupEntriesOf)(folderOf(realm))];
                                    case 2:
                                        _a = (_b.sent()).notes.length === 0;
                                        _b.label = 3;
                                    case 3:
                                        if (_a)
                                            throw new reply_1.Refusal(messages_1.MESSAGES.nothingToExport);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        asked = _b.sent();
                        if (!asked.ok || asked.data === null)
                            return [2 /*return*/, asked];
                        _a = asked.data, realm = _a.realm, parent = _a.folder;
                        return [2 /*return*/, inTurn(messages_1.MESSAGES.exportNotes, function () { return __awaiter(void 0, void 0, void 0, function () {
                                var vault, entries, folder, copied, skipped, _i, _a, _b, kind, paths, _c, paths_1, path, bytes, err_2, err_3;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            vault = folderOf(realm);
                                            return [4 /*yield*/, (0, note_backup_1.backupEntriesOf)(vault)];
                                        case 1:
                                            entries = _d.sent();
                                            return [4 /*yield*/, (0, note_backup_1.newBackupFolder)(parent, "Notes backup ".concat(realm, " ").concat(nowText().slice(0, 10)))];
                                        case 2:
                                            folder = _d.sent();
                                            copied = { notes: 0, files: 0 };
                                            skipped = [];
                                            _d.label = 3;
                                        case 3:
                                            _d.trys.push([3, 15, , 17]);
                                            _i = 0, _a = [['notes', entries.notes], ['files', entries.files]];
                                            _d.label = 4;
                                        case 4:
                                            if (!(_i < _a.length)) return [3 /*break*/, 13];
                                            _b = _a[_i], kind = _b[0], paths = _b[1];
                                            _c = 0, paths_1 = paths;
                                            _d.label = 5;
                                        case 5:
                                            if (!(_c < paths_1.length)) return [3 /*break*/, 12];
                                            path = paths_1[_c];
                                            bytes = void 0;
                                            _d.label = 6;
                                        case 6:
                                            _d.trys.push([6, 8, , 9]);
                                            return [4 /*yield*/, (0, note_backup_1.readBackupFile)(vault, path)];
                                        case 7:
                                            bytes = _d.sent();
                                            return [3 /*break*/, 9];
                                        case 8:
                                            err_2 = _d.sent();
                                            // One file that won't read doesn't stop the backup; the result names it.
                                            d.log.error("exporting ".concat(path, " failed"), err_2);
                                            skipped.push({ path: path, reason: skipOf(err_2) });
                                            return [3 /*break*/, 11];
                                        case 9: return [4 /*yield*/, (0, note_backup_1.writeBackupFile)(folder, path, bytes)];
                                        case 10:
                                            _d.sent();
                                            copied[kind] += 1;
                                            _d.label = 11;
                                        case 11:
                                            _c++;
                                            return [3 /*break*/, 5];
                                        case 12:
                                            _i++;
                                            return [3 /*break*/, 4];
                                        case 13: 
                                        // Written last: a folder cut short never reads as a backup.
                                        return [4 /*yield*/, (0, note_backup_1.writeBackupFile)(folder, note_backup_1.BACKUP_MANIFEST, "".concat(JSON.stringify(__assign({ format: note_backup_1.BACKUP_FORMAT, realm: realm, exported: nowText() }, copied), null, 2), "\n"))];
                                        case 14:
                                            // Written last: a folder cut short never reads as a backup.
                                            _d.sent();
                                            return [3 /*break*/, 17];
                                        case 15:
                                            err_3 = _d.sent();
                                            return [4 /*yield*/, (0, note_backup_1.removeBackupFolder)(folder).catch(function (gone) { return d.log.error("removing the unfinished backup ".concat(folder, " failed"), gone); })];
                                        case 16:
                                            _d.sent();
                                            throw err_3;
                                        case 17:
                                            d.log.debug("notes exported: ".concat(folder));
                                            return [2 /*return*/, __assign(__assign({ folder: folder.split('/').at(-1) }, copied), { skipped: skipped })];
                                    }
                                });
                            }); })];
                }
            });
        }); },
        // Never replaces anything, so running it twice changes nothing more. A
        // note is matched by id: a missing one comes back as it was saved; one
        // that differs stays, and the backup's text joins its History. A file is
        // matched by name. A backup file that is unreadable, too large, damaged
        // or named like a different file here is left out and named.
        restoreNotes: function (key) { return __awaiter(void 0, void 0, void 0, function () {
            var asked, _a, realm, backup;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, picked(key, messages_1.MESSAGES.restoreNotes, messages_1.MESSAGES.restoreButton)];
                    case 1:
                        asked = _b.sent();
                        if (!asked.ok || asked.data === null)
                            return [2 /*return*/, asked];
                        _a = asked.data, realm = _a.realm, backup = _a.folder;
                        return [2 /*return*/, inTurn(messages_1.MESSAGES.restoreNotes, function () { return __awaiter(void 0, void 0, void 0, function () {
                                var format, _a, _b, err_4, entries, done, skipped, fromBackup, place, _i, _c, path, bytes, hash, placed, titles, _loop_1, _d, _e, name_2;
                                var _f;
                                var _g, _h;
                                return __generator(this, function (_j) {
                                    switch (_j.label) {
                                        case 0:
                                            _j.trys.push([0, 2, , 3]);
                                            _b = (_a = JSON).parse;
                                            return [4 /*yield*/, (0, note_backup_1.readBackupFile)(backup, note_backup_1.BACKUP_MANIFEST)];
                                        case 1:
                                            format = (_g = _b.apply(_a, [(_j.sent()).toString('utf8')])) === null || _g === void 0 ? void 0 : _g.format;
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_4 = _j.sent();
                                            // No manifest, or one that isn't JSON: refused below as not a backup.
                                            d.log.debug("no notes backup manifest in ".concat(backup, ": ").concat(String(err_4)));
                                            return [3 /*break*/, 3];
                                        case 3:
                                            if (typeof format === 'number' && format > note_backup_1.BACKUP_FORMAT)
                                                throw new reply_1.Refusal(messages_1.MESSAGES.backupTooNew);
                                            if (format !== note_backup_1.BACKUP_FORMAT)
                                                throw new reply_1.Refusal(messages_1.MESSAGES.notABackup);
                                            return [4 /*yield*/, (0, note_backup_1.backupEntriesOf)(backup)];
                                        case 4:
                                            entries = _j.sent();
                                            if (entries.notes.length > notes_1.NOTE_LIMITS.notes)
                                                throw new reply_1.Refusal(messages_1.MESSAGES.backupTooBig);
                                            done = { added: 0, renamed: 0, same: 0, toHistory: 0, files: 0 };
                                            skipped = [];
                                            fromBackup = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                                                var err_5;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            return [4 /*yield*/, (0, note_backup_1.readBackupFile)(backup, path)];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                        case 2:
                                                            err_5 = _a.sent();
                                                            d.log.error("reading ".concat(path, " from the backup failed"), err_5);
                                                            skipped.push({ path: path, reason: skipOf(err_5) });
                                                            return [2 /*return*/, null];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); };
                                            place = function (path, bytes) { return files.publish(realm, path, bytes).catch(function (err) { return (err instanceof reply_1.Refusal ? 'different' : Promise.reject(err)); }); };
                                            _i = 0, _c = entries.files;
                                            _j.label = 5;
                                        case 5:
                                            if (!(_i < _c.length)) return [3 /*break*/, 10];
                                            path = _c[_i];
                                            return [4 /*yield*/, fromBackup(path)];
                                        case 6:
                                            bytes = _j.sent();
                                            if (bytes === null)
                                                return [3 /*break*/, 9];
                                            hash = (_h = /^attachments\/([0-9a-f]{64})\./.exec(path)) === null || _h === void 0 ? void 0 : _h[1];
                                            if (!(hash !== undefined && (0, node_crypto_1.createHash)('sha256').update(bytes).digest('hex') !== hash)) return [3 /*break*/, 7];
                                            skipped.push({ path: path, reason: 'damaged' });
                                            return [3 /*break*/, 9];
                                        case 7: return [4 /*yield*/, place(path, bytes)];
                                        case 8:
                                            placed = _j.sent();
                                            if (placed === 'different')
                                                skipped.push({ path: path, reason: 'taken' });
                                            else if (placed === 'added')
                                                done.files += 1;
                                            _j.label = 9;
                                        case 9:
                                            _i++;
                                            return [3 /*break*/, 5];
                                        case 10: return [4 /*yield*/, titlesOf(realm)];
                                        case 11:
                                            titles = _j.sent();
                                            _loop_1 = function (name_2) {
                                                var bytes, id, text, file, now, title, _k;
                                                return __generator(this, function (_l) {
                                                    switch (_l.label) {
                                                        case 0: return [4 /*yield*/, fromBackup(name_2)];
                                                        case 1:
                                                            bytes = _l.sent();
                                                            if (bytes === null)
                                                                return [2 /*return*/, "continue"];
                                                            id = name_2.slice(0, -3);
                                                            text = bytes.toString('utf8');
                                                            file = (0, note_file_1.parseNote)(text, id, nowText());
                                                            return [4 /*yield*/, readOne(realm, id)];
                                                        case 2:
                                                            now = _l.sent();
                                                            if (!(file.body.length > notes_1.NOTE_LIMITS.body)) return [3 /*break*/, 3];
                                                            skipped.push({ path: name_2, reason: 'size' });
                                                            return [3 /*break*/, 14];
                                                        case 3:
                                                            if (!(now === null)) return [3 /*break*/, 9];
                                                            title = file.isArchived ? file.title : (0, notes_1.freeTitle)(titles, file.title);
                                                            if (!(title !== file.title)) return [3 /*break*/, 6];
                                                            return [4 /*yield*/, snapshot(realm, id, text)];
                                                        case 4:
                                                            _l.sent();
                                                            return [4 /*yield*/, write(realm, id, __assign(__assign({}, file), { title: title }))];
                                                        case 5:
                                                            _l.sent();
                                                            done.renamed += 1;
                                                            return [3 /*break*/, 8];
                                                        case 6: return [4 /*yield*/, place(name_2, bytes)];
                                                        case 7:
                                                            if ((_l.sent()) === 'different') {
                                                                skipped.push({ path: name_2, reason: 'taken' });
                                                                return [2 /*return*/, "continue"];
                                                            }
                                                            _l.label = 8;
                                                        case 8:
                                                            titles.push({ id: id, title: title, isArchived: file.isArchived });
                                                            done.added += 1;
                                                            return [3 /*break*/, 14];
                                                        case 9:
                                                            _k = now.text === text;
                                                            if (_k) return [3 /*break*/, 11];
                                                            return [4 /*yield*/, history(realm, id)];
                                                        case 10:
                                                            _k = (_l.sent()).some(function (version) { return version.id.endsWith("-".concat(stampOf(text))); });
                                                            _l.label = 11;
                                                        case 11:
                                                            if (!_k) return [3 /*break*/, 12];
                                                            done.same += 1;
                                                            return [3 /*break*/, 14];
                                                        case 12: return [4 /*yield*/, snapshot(realm, id, text)];
                                                        case 13:
                                                            _l.sent();
                                                            done.toHistory += 1;
                                                            _l.label = 14;
                                                        case 14: return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _d = 0, _e = entries.notes;
                                            _j.label = 12;
                                        case 12:
                                            if (!(_d < _e.length)) return [3 /*break*/, 15];
                                            name_2 = _e[_d];
                                            return [5 /*yield**/, _loop_1(name_2)];
                                        case 13:
                                            _j.sent();
                                            _j.label = 14;
                                        case 14:
                                            _d++;
                                            return [3 /*break*/, 12];
                                        case 15:
                                            d.log.debug("notes restored from ".concat(backup, ": ").concat(JSON.stringify(done), ", skipped ").concat(skipped.length));
                                            _f = {};
                                            return [4 /*yield*/, viewOf(realm)];
                                        case 16: return [2 /*return*/, __assign.apply(void 0, [__assign.apply(void 0, [(_f.view = _j.sent(), _f), done]), { skipped: skipped }])];
                                    }
                                });
                            }); })];
                }
            });
        }); },
        createNote: function (key, input) {
            return inTurn(messages_1.MESSAGES.saveNote, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, note, now, id, title, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _c.sent();
                            note = changeOf(__assign(__assign({}, input), { tags: [] }));
                            now = nowText();
                            return [4 /*yield*/, newId(realm)
                                // A taken title gets the next number, so a link still means one note.
                            ];
                        case 2:
                            id = _c.sent();
                            _a = notes_1.freeTitle;
                            return [4 /*yield*/, titlesOf(realm)];
                        case 3:
                            title = _a.apply(void 0, [_c.sent(), note.title]);
                            return [4 /*yield*/, write(realm, id, __assign(__assign({}, note), { title: title, created: now, updated: now, isArchived: false, quests: [], aliases: [], rest: [] }))];
                        case 4:
                            _c.sent();
                            _b = {};
                            return [4 /*yield*/, viewOf(realm)];
                        case 5: return [2 /*return*/, (_b.view = _c.sent(), _b.id = id, _b)];
                    }
                });
            }); });
        },
        // stamp is the file as the editor read it. When the file on disk isn't
        // that one any more, nothing is written and the window asks what to keep.
        saveNote: function (key, id, change, stamp) {
            return inTurn(messages_1.MESSAGES.saveNote, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, noteId, next, now, _a, _b, saved, relinked, _c;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _e.sent();
                            noteId = idOf(id);
                            next = changeOf(change);
                            return [4 /*yield*/, readOne(realm, noteId)];
                        case 2:
                            now = _e.sent();
                            if (now === null)
                                return [2 /*return*/, { kind: 'changed', note: null }];
                            if (stampOf(now.text) !== stamp)
                                return [2 /*return*/, { kind: 'changed', note: noteOf(now) }];
                            _a = !same(now.file.title, next.title);
                            if (!_a) return [3 /*break*/, 4];
                            _b = notes_1.isTitleTaken;
                            return [4 /*yield*/, titlesOf(realm)];
                        case 3:
                            _a = _b.apply(void 0, [_e.sent(), next.title, noteId]);
                            _e.label = 4;
                        case 4:
                            if (_a)
                                throw new reply_1.Refusal(messages_1.MESSAGES.noteTitleTaken(next.title));
                            return [4 /*yield*/, write(realm, noteId, __assign(__assign(__assign({}, now.file), next), { updated: nowText() }))];
                        case 5:
                            saved = _e.sent();
                            if (!same(now.file.title, next.title)) return [3 /*break*/, 6];
                            _c = 0;
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, relink(realm, noteId, now.file.title, next.title)];
                        case 7:
                            _c = _e.sent();
                            _e.label = 8;
                        case 8:
                            relinked = _c;
                            _d = { kind: 'saved' };
                            return [4 /*yield*/, viewOf(realm)];
                        case 9: return [2 /*return*/, (_d.view = _e.sent(), _d.note = noteOf(saved), _d.relinked = relinked, _d)];
                    }
                });
            }); });
        },
        archiveNote: function (key, id, isArchived) {
            return inTurn(messages_1.MESSAGES.saveNote, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, one, title, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _c.sent();
                            if (typeof isArchived !== 'boolean')
                                throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
                            return [4 /*yield*/, known(realm, idOf(id))
                                // A note restored while another has its title comes back numbered.
                            ];
                        case 2:
                            one = _c.sent();
                            if (!isArchived) return [3 /*break*/, 3];
                            _a = one.file.title;
                            return [3 /*break*/, 5];
                        case 3:
                            _b = notes_1.freeTitle;
                            return [4 /*yield*/, titlesOf(realm)];
                        case 4:
                            _a = _b.apply(void 0, [_c.sent(), one.file.title, one.id]);
                            _c.label = 5;
                        case 5:
                            title = _a;
                            return [4 /*yield*/, write(realm, one.id, __assign(__assign({}, one.file), { title: title, isArchived: isArchived }))];
                        case 6:
                            _c.sent();
                            return [2 /*return*/, viewOf(realm)];
                    }
                });
            }); });
        },
        // Moves every note in a folder, archived ones too, to another; onto one
        // that's there already, the two become one. Links name a note by title and
        // the files stay where they are, so every link still works.
        renameFolder: function (key, from, to) {
            return inTurn(messages_1.MESSAGES.renameFolder, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, name, _i, _a, one;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, realmOf(key)
                            // Inbox keeps its name: new notes land there.
                        ];
                        case 1:
                            realm = _b.sent();
                            // Inbox keeps its name: new notes land there.
                            if (typeof from !== 'string' || from === '' || from === notes_1.INBOX)
                                throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
                            name = folderNameOf(to);
                            if (name === '')
                                throw new reply_1.Refusal(messages_1.MESSAGES.noteFolderRequired);
                            _i = 0;
                            return [4 /*yield*/, loadAll(realm)];
                        case 2:
                            _a = (_b.sent()).loaded.filter(function (one) { return one.file.folder === from; });
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            one = _a[_i];
                            return [4 /*yield*/, write(realm, one.id, __assign(__assign({}, one.file), { folder: name }))];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            d.log.debug("notes folder renamed: ".concat(from, " \u2192 ").concat(name));
                            return [2 /*return*/, viewOf(realm)];
                    }
                });
            }); });
        },
        deleteNote: function (key, id) {
            return inTurn(messages_1.MESSAGES.saveNote, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, one, versions, _i, _a, name_3, gone, _b, _c, path;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _d.sent();
                            return [4 /*yield*/, known(realm, idOf(id))];
                        case 2:
                            one = _d.sent();
                            if (!one.file.isArchived)
                                throw new reply_1.Refusal(messages_1.MESSAGES.deleteNotArchived);
                            versions = historyOf(realm, one.id);
                            _i = 0;
                            return [4 /*yield*/, d.host.list(versions)];
                        case 3:
                            _a = _d.sent();
                            _d.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            name_3 = _a[_i];
                            return [4 /*yield*/, remove("".concat(versions, "/").concat(name_3))];
                        case 5:
                            _d.sent();
                            _d.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [4 /*yield*/, d.host.exists(versions)];
                        case 8:
                            if (!_d.sent()) return [3 /*break*/, 10];
                            return [4 /*yield*/, d.host.removeDir(versions)];
                        case 9:
                            gone = _d.sent();
                            if (gone.exitCode !== 0)
                                throw new Error(gone.stderr);
                            _d.label = 10;
                        case 10:
                            _b = 0, _c = [pathOf(realm, one.id), "".concat(pathOf(realm, one.id), ".bak"), "".concat(pathOf(realm, one.id), ".tmp")];
                            _d.label = 11;
                        case 11:
                            if (!(_b < _c.length)) return [3 /*break*/, 14];
                            path = _c[_b];
                            return [4 /*yield*/, remove(path)];
                        case 12:
                            _d.sent();
                            _d.label = 13;
                        case 13:
                            _b++;
                            return [3 /*break*/, 11];
                        case 14:
                            d.log.debug("note deleted: ".concat(pathOf(realm, one.id)));
                            return [2 /*return*/, viewOf(realm)];
                    }
                });
            }); });
        },
        // Files the quests one by one into the realm's queue, and links each to
        // the note as soon as it is in. A line the note already lists is skipped,
        // so Try again after a failure part way never files a line twice.
        fileNoteQuests: function (key, id, proposal) {
            return inTurn(messages_1.MESSAGES.fileNoteQuests, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, note, p, asked, parent, scope, isOpen, own, filedItems, quests, from, record, _i, quests_1, quest, about, filed, linked;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _b.sent();
                            return [4 /*yield*/, known(realm, idOf(id))];
                        case 2:
                            note = _b.sent();
                            p = (proposal !== null && proposal !== void 0 ? proposal : {});
                            asked = proposedOf(p.quests);
                            parent = (0, task_input_1.parentOf)(p.parent);
                            return [4 /*yield*/, (0, scope_1.scopeOf)(d, realm)];
                        case 3:
                            scope = _b.sent();
                            isOpen = function (questId) { return scope.record.tasks.some(function (task) { return task.id === questId && (task.state === 'queued' || task.state === 'current'); }); };
                            own = note.file.quests.find(function (q) { return q.item === null && isOpen(q.id); });
                            if (parent.kind === 'new' && own !== undefined)
                                parent = { kind: 'task', id: own.id };
                            filedItems = new Set(note.file.quests.map(function (q) { return q.item; }));
                            quests = asked.filter(function (quest) { return !filedItems.has(quest.item); });
                            from = "From the note \"".concat(note.file.title, "\" in Notes.");
                            record = scope.record;
                            _i = 0, quests_1 = quests;
                            _b.label = 4;
                        case 4:
                            if (!(_i < quests_1.length)) return [3 /*break*/, 8];
                            quest = quests_1[_i];
                            about = quest.item === null ? (0, notes_1.firstParagraphOf)(note.file.body) : null;
                            return [4 /*yield*/, (0, file_task_1.fileTaskUseCase)(scope.deps, scope.ctx, { title: quest.title, priority: quest.priority, difficulty: quest.difficulty, parent: parent, description: about === null ? from : "".concat(from, "\n\n").concat(about), criteria: [], text: quest.title, intent: 'improving' })];
                        case 5:
                            filed = _b.sent();
                            if (filed.kind === 'unreadable')
                                throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                            if (filed.kind === 'refused')
                                throw new reply_1.Refusal((0, messages_1.inGameWords)(filed.notice));
                            linked = [{ id: filed.task.id, item: quest.item }];
                            if (parent.kind === 'new' && filed.parent !== null) {
                                linked.unshift({ id: filed.parent.id, item: null });
                                parent = { kind: 'task', id: filed.parent.id };
                            }
                            return [4 /*yield*/, write(realm, note.id, __assign(__assign({}, note.file), { quests: __spreadArray(__spreadArray([], note.file.quests, true), linked, true) }))];
                        case 6:
                            note = _b.sent();
                            record = filed.record;
                            _b.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 4];
                        case 8:
                            _a = {};
                            return [4 /*yield*/, viewOf(realm)];
                        case 9:
                            _a.view = _b.sent();
                            return [4 /*yield*/, (0, scope_1.realmView)(d, realm, record)];
                        case 10: return [2 /*return*/, (_a.project = _b.sent(), _a)];
                    }
                });
            }); });
        },
    };
};
exports.notesApi = notesApi;
