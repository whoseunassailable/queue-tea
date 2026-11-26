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
exports.filePathOf = exports.noteFiles = void 0;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var note_attachments_1 = require("../../../../shared/note_attachments");
var notes_1 = require("../../../../shared/notes");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
// Content, rather than a picker-supplied MIME type, decides what may render.
var formatOf = function (bytes) {
    var b = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var head = b.subarray(0, 1024).toString('utf8');
    var hex = b.subarray(0, 12).toString('hex');
    var image = function (extension, mime) {
        if (mime === void 0) { mime = "image/".concat(extension); }
        return ({ extension: extension, mime: mime, kind: 'image' });
    };
    if (head.startsWith('%PDF-'))
        return { extension: 'pdf', mime: 'application/pdf', kind: 'pdf' };
    if (hex.startsWith('89504e470d0a1a0a'))
        return image('png');
    if (hex.startsWith('ffd8ff'))
        return image('jpg', 'image/jpeg');
    if (/^GIF8[79]a/.test(head))
        return image('gif');
    if (head.startsWith('RIFF') && b.subarray(8, 12).toString() === 'WEBP')
        return image('webp');
    if (head.startsWith('BM'))
        return image('bmp');
    if (hex.startsWith('00000100'))
        return image('ico', 'image/x-icon');
    if (b.subarray(4, 8).toString() === 'ftyp' && ['avif', 'avis'].includes(b.subarray(8, 12).toString()))
        return image('avif');
    if (/^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(head))
        return image('svg', 'image/svg+xml');
    return { extension: '', mime: 'application/octet-stream', kind: 'other' };
};
var noteFiles = function (home) {
    var vault = function (key) { return (0, node_path_1.resolve)(home, notes_1.NOTES_FOLDER, key); };
    var checkedPath = function (key, path) { return __awaiter(void 0, void 0, void 0, function () {
        var root, actual;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.realpath)(vault(key))];
                case 1:
                    root = _a.sent();
                    return [4 /*yield*/, (0, promises_1.realpath)((0, node_path_1.join)(root, path))];
                case 2:
                    actual = _a.sent();
                    if (!actual.startsWith(root + node_path_1.sep))
                        throw new reply_1.Refusal(messages_1.MESSAGES.badNoteFile);
                    return [2 /*return*/, actual];
            }
        });
    }); };
    var read = function (key, path) { return __awaiter(void 0, void 0, void 0, function () {
        var file, _a, info, bytes;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = promises_1.open;
                    return [4 /*yield*/, checkedPath(key, path)];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), node_fs_1.constants.O_RDONLY | node_fs_1.constants.O_NOFOLLOW])];
                case 2:
                    file = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, , 6, 8]);
                    return [4 /*yield*/, file.stat()];
                case 4:
                    info = _b.sent();
                    if (!info.isFile() || info.size >= note_attachments_1.NOTE_FILE_LIMIT)
                        throw new reply_1.Refusal(messages_1.MESSAGES.noteFileSize);
                    return [4 /*yield*/, file.readFile()];
                case 5:
                    bytes = _b.sent();
                    if (bytes.length >= note_attachments_1.NOTE_FILE_LIMIT)
                        throw new reply_1.Refusal(messages_1.MESSAGES.noteFileSize);
                    return [2 /*return*/, __assign({ bytes: bytes }, formatOf(bytes))];
                case 6: return [4 /*yield*/, file.close()];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Puts bytes at a vault path (from filePathOf) without replacing a file
    // already there. 'different': another file has that name and stays.
    var publish = function (key, path, bytes) { return __awaiter(void 0, void 0, void 0, function () {
        var parts, root, folder, target, temporary, output, err_1, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parts = path.split('/');
                    return [4 /*yield*/, (0, promises_1.mkdir)(node_path_1.join.apply(void 0, __spreadArray([vault(key)], parts.slice(0, -1), false)), { recursive: true })
                        // A symlinked attachments folder must not redirect writes out of the vault.
                    ];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.realpath)(vault(key))];
                case 2:
                    root = _a.sent();
                    return [4 /*yield*/, (0, promises_1.realpath)(node_path_1.join.apply(void 0, __spreadArray([root], parts.slice(0, -1), false)))];
                case 3:
                    folder = _a.sent();
                    if (folder !== root && !folder.startsWith(root + node_path_1.sep))
                        throw new reply_1.Refusal(messages_1.MESSAGES.badNoteFile);
                    target = (0, node_path_1.join)(folder, parts.at(-1));
                    temporary = "".concat(target, ".").concat((0, node_crypto_1.randomUUID)(), ".tmp");
                    return [4 /*yield*/, (0, promises_1.open)(temporary, node_fs_1.constants.O_WRONLY | node_fs_1.constants.O_CREAT | node_fs_1.constants.O_EXCL | node_fs_1.constants.O_NOFOLLOW, 384)];
                case 4:
                    output = _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, , 15, 17]);
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, , 8, 10]);
                    return [4 /*yield*/, output.writeFile(bytes)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, output.close()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10:
                    _a.trys.push([10, 12, , 14]);
                    // A hard link publishes the complete file without replacing one a
                    // second writer published first. Neither can read half a picture.
                    return [4 /*yield*/, (0, promises_1.link)(temporary, target)];
                case 11:
                    // A hard link publishes the complete file without replacing one a
                    // second writer published first. Neither can read half a picture.
                    _a.sent();
                    return [2 /*return*/, 'added'];
                case 12:
                    err_1 = _a.sent();
                    if (err_1.code !== 'EEXIST')
                        throw err_1;
                    return [4 /*yield*/, read(key, path)];
                case 13:
                    existing = _a.sent();
                    return [2 /*return*/, existing.bytes.equals(Buffer.from(bytes)) ? 'same' : 'different'];
                case 14: return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, (0, promises_1.unlink)(temporary)];
                case 16:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    }); };
    return {
        read: read,
        publish: publish,
        import: function (key, value) { return __awaiter(void 0, void 0, void 0, function () {
            var file, error, format, extension, hash, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = (value !== null && value !== void 0 ? value : {});
                        if (typeof file.name !== 'string' || typeof file.type !== 'string' || !(file.bytes instanceof Uint8Array) || /[\\/\x00-\x1f]/.test(file.name))
                            throw new reply_1.Refusal(messages_1.MESSAGES.noteFileType);
                        error = (0, note_attachments_1.attachmentError)({ name: file.name, type: file.type, size: file.bytes.byteLength });
                        if (error !== undefined)
                            throw new reply_1.Refusal(error === 'type' ? messages_1.MESSAGES.noteFileType : messages_1.MESSAGES.noteFileSize);
                        format = formatOf(file.bytes);
                        extension = (0, note_attachments_1.extensionOf)(file.name).replace(/^jpeg$/, 'jpg');
                        if (format.kind === 'other' || (file.name.includes('.') && extension !== format.extension))
                            throw new reply_1.Refusal(messages_1.MESSAGES.noteFileType);
                        hash = (0, node_crypto_1.createHash)('sha256').update(file.bytes).digest('hex');
                        path = "".concat(note_attachments_1.NOTE_ATTACHMENTS, "/").concat(hash, ".").concat(format.extension);
                        return [4 /*yield*/, publish(key, path, file.bytes)];
                    case 1:
                        if ((_a.sent()) === 'different')
                            throw new Error("a different file is already at ".concat(path));
                        return [2 /*return*/, { path: path, kind: format.kind }];
                }
            });
        }); },
    };
};
exports.noteFiles = noteFiles;
var filePathOf = function (value) {
    var path = typeof value === 'string' ? (0, note_attachments_1.noteFilePath)(value) : null;
    if (path === null)
        throw new reply_1.Refusal(messages_1.MESSAGES.badNoteFile);
    return path;
};
exports.filePathOf = filePathOf;
