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
exports.removeBackupFolder = exports.writeBackupFile = exports.newBackupFolder = exports.readBackupFile = exports.backupEntriesOf = exports.BACKUP_FORMAT = exports.BACKUP_MANIFEST = void 0;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var note_attachments_1 = require("../../../../shared/note_attachments");
var notes_1 = require("../../../../shared/notes");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
// Marks a folder as a Notes backup, so restore never reads an ordinary folder.
exports.BACKUP_MANIFEST = 'queue-tea-notes.json';
exports.BACKUP_FORMAT = 1;
// What a backup carries from a vault, and restore takes from a backup: the
// notes at the top, and the files a note can link (the top and attachments/).
// Symlinks, folders, hidden and odd names, and files half written (.tmp) or
// kept from an old save (.bak) are never part of it, nor is the backup's marker.
var backupEntriesOf = function (root) { return __awaiter(void 0, void 0, void 0, function () {
    var top, inside, _a, files;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readdir)(root, { withFileTypes: true })];
            case 1:
                top = _b.sent();
                if (!top.some(function (entry) { return entry.name === note_attachments_1.NOTE_ATTACHMENTS && entry.isDirectory(); })) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(root, note_attachments_1.NOTE_ATTACHMENTS), { withFileTypes: true })];
            case 2:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = [];
                _b.label = 4;
            case 4:
                inside = _a;
                files = __spreadArray(__spreadArray([], top.filter(function (entry) { return !entry.name.endsWith('.md'); }).map(function (entry) { return ({ entry: entry, path: entry.name }); }), true), inside.map(function (entry) { return ({ entry: entry, path: "".concat(note_attachments_1.NOTE_ATTACHMENTS, "/").concat(entry.name) }); }), true);
                return [2 /*return*/, {
                        notes: top.filter(function (entry) { return entry.isFile() && entry.name.endsWith('.md') && (0, notes_1.isNoteId)(entry.name.slice(0, -3)); }).map(function (entry) { return entry.name; }).sort(),
                        files: files.filter(function (_a) {
                            var entry = _a.entry, path = _a.path;
                            return entry.isFile() && path !== exports.BACKUP_MANIFEST && (0, note_attachments_1.noteFilePath)(path) === path && !/\.(tmp|bak)$/i.test(path);
                        }).map(function (_a) {
                            var path = _a.path;
                            return path;
                        }).sort(),
                    }];
        }
    });
}); };
exports.backupEntriesOf = backupEntriesOf;
// One file of a vault or backup, refused when it isn't a plain file under the limit.
var readBackupFile = function (root, path) { return __awaiter(void 0, void 0, void 0, function () {
    var file, info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.open)((0, node_path_1.join)(root, path), node_fs_1.constants.O_RDONLY | node_fs_1.constants.O_NOFOLLOW)];
            case 1:
                file = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 5, 7]);
                return [4 /*yield*/, file.stat()];
            case 3:
                info = _a.sent();
                if (!info.isFile() || info.size >= note_attachments_1.NOTE_FILE_LIMIT)
                    throw new reply_1.Refusal(messages_1.MESSAGES.noteFileSize);
                return [4 /*yield*/, file.readFile()];
            case 4: return [2 /*return*/, _a.sent()];
            case 5: return [4 /*yield*/, file.close()];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.readBackupFile = readBackupFile;
// A new folder in parent, "name 2" when name is taken; never one already there.
var newBackupFolder = function (parent, name) { return __awaiter(void 0, void 0, void 0, function () {
    var n, folder, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                n = 1;
                _a.label = 1;
            case 1:
                if (!(n < 100)) return [3 /*break*/, 6];
                folder = (0, node_path_1.join)(parent, n === 1 ? name : "".concat(name, " ").concat(n));
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, promises_1.mkdir)(folder)];
            case 3:
                _a.sent();
                return [2 /*return*/, folder];
            case 4:
                err_1 = _a.sent();
                if (err_1.code !== 'EEXIST')
                    throw err_1;
                return [3 /*break*/, 5];
            case 5:
                n += 1;
                return [3 /*break*/, 1];
            case 6: throw new Error("no free backup folder name for ".concat(name, " in ").concat(parent));
        }
    });
}); };
exports.newBackupFolder = newBackupFolder;
var writeBackupFile = function (folder, path, bytes) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!path.includes('/')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, path.split('/')[0]), { recursive: true })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, path), bytes, { flag: 'wx' })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.writeBackupFile = writeBackupFile;
var removeBackupFolder = function (folder) { return (0, promises_1.rm)(folder, { recursive: true, force: true }); };
exports.removeBackupFolder = removeBackupFolder;
