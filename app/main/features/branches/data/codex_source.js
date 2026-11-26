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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCodexSession = void 0;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_string_decoder_1 = require("node:string_decoder");
var codex_events_1 = require("./codex_events");
var activity_1 = require("../../../../../hooks/shared/activity/domain/services/activity");
var READ_CHUNK = 256000;
var DISCOVER_MS = 1000;
// shortcut: remembers where it stopped in up to 4,096 sessions; past that the oldest are read again from the start. Raise it if Codex keeps more.
var MAX_SESSIONS = 4096;
var catalog = new Map();
var cache = new Map();
// Discover by modification time, never by session start date: an old session
// resumed today belongs in today's activity too. Read only appended bytes.
var readCodexSession = function (d, folder, since) { return __awaiter(void 0, void 0, void 0, function () {
    var root, now, list, entries, paths, files, err_1, observations, _i, _a, _b, file, mtimeMs, listed, reader, size, err_2, handle, buffer, bytesRead, lines, _c, lines_1, line, row, latest;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                root = (0, node_path_1.join)(d.home, '.codex/sessions');
                now = d.now();
                list = catalog.get(root);
                if (!(!list || now - list.at > DISCOVER_MS)) return [3 /*break*/, 5];
                _h.label = 1;
            case 1:
                _h.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, promises_1.readdir)(root, { recursive: true, withFileTypes: true })];
            case 2:
                entries = _h.sent();
                paths = entries.filter(function (e) { return e.isFile() && e.name.endsWith('.jsonl'); }).map(function (e) { return (0, node_path_1.join)(e.parentPath, e.name); });
                return [4 /*yield*/, Promise.all(paths.map(function (path) { return (0, promises_1.stat)(path).then(function (info) { return ({ path: path, mtimeMs: info.mtimeMs, size: info.size }); }, function (err) {
                        if (err.code === 'ENOENT')
                            return null; // Deleted since the listing: nothing left to read.
                        throw err;
                    }); }))];
            case 3:
                files = _h.sent();
                list = { at: now, files: files.filter(function (file) { return file !== null; }) };
                catalog.set(root, list);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _h.sent();
                if (err_1.code === 'ENOENT')
                    return [2 /*return*/, { state: 'unobserved', seenAt: null, step: null }];
                throw err_1;
            case 5:
                observations = [];
                _i = 0, _a = list.files;
                _h.label = 6;
            case 6:
                if (!(_i < _a.length)) return [3 /*break*/, 20];
                _b = _a[_i], file = _b.path, mtimeMs = _b.mtimeMs, listed = _b.size;
                if (mtimeMs < since)
                    return [3 /*break*/, 19];
                reader = cache.get(file);
                size = listed;
                if (!((reader === null || reader === void 0 ? void 0 : reader.cwd) === folder)) return [3 /*break*/, 10];
                _h.label = 7;
            case 7:
                _h.trys.push([7, 9, , 10]);
                return [4 /*yield*/, (0, promises_1.stat)(file)];
            case 8:
                size = (_h.sent()).size;
                return [3 /*break*/, 10];
            case 9:
                err_2 = _h.sent();
                if (err_2.code === 'ENOENT')
                    return [3 /*break*/, 19];
                throw err_2;
            case 10:
                if (!reader || reader.offset > size) {
                    reader = { offset: 0, pending: '', decoder: new node_string_decoder_1.StringDecoder('utf8'), cwd: null, events: new codex_events_1.CodexEvents(0) };
                    if (cache.size >= MAX_SESSIONS)
                        cache.delete(cache.keys().next().value);
                    cache.set(file, reader);
                }
                // Another task's session is read when that task asks, from where it stopped.
                if ((reader.cwd !== null && reader.cwd !== folder) || reader.offset >= size) {
                    if (reader.cwd === folder)
                        observations.push(reader.events.snapshot(now, since));
                    return [3 /*break*/, 19];
                }
                return [4 /*yield*/, (0, promises_1.open)(file, 'r')];
            case 11:
                handle = _h.sent();
                _h.label = 12;
            case 12:
                _h.trys.push([12, , 16, 18]);
                _h.label = 13;
            case 13:
                if (!(reader.offset < size)) return [3 /*break*/, 15];
                buffer = Buffer.alloc(Math.min(READ_CHUNK, size - reader.offset));
                return [4 /*yield*/, handle.read(buffer, 0, buffer.length, reader.offset)];
            case 14:
                bytesRead = (_h.sent()).bytesRead;
                if (!bytesRead)
                    return [3 /*break*/, 15];
                reader.offset += bytesRead;
                lines = (reader.pending + reader.decoder.write(buffer.subarray(0, bytesRead))).split('\n');
                reader.pending = (_d = lines.pop()) !== null && _d !== void 0 ? _d : '';
                for (_c = 0, lines_1 = lines; _c < lines_1.length; _c++) {
                    line = lines_1[_c];
                    if (!reader.cwd) {
                        try {
                            row = JSON.parse(line);
                            if (row.type === 'session_meta')
                                reader.cwd = (_f = (_e = row.payload) === null || _e === void 0 ? void 0 : _e.cwd) !== null && _f !== void 0 ? _f : null;
                        }
                        catch (_j) {
                            continue; /* Incomplete metadata is not a task association. */
                        }
                    }
                    reader.events.accept(line);
                }
                if (reader.cwd !== null && reader.cwd !== folder)
                    return [3 /*break*/, 15];
                return [3 /*break*/, 13];
            case 15: return [3 /*break*/, 18];
            case 16: return [4 /*yield*/, handle.close()];
            case 17:
                _h.sent();
                return [7 /*endfinally*/];
            case 18:
                if (reader.cwd === folder)
                    observations.push(reader.events.snapshot(now, since));
                _h.label = 19;
            case 19:
                _i++;
                return [3 /*break*/, 6];
            case 20:
                observations.sort(function (a, b) { var _a, _b; return ((_a = b.seenAt) !== null && _a !== void 0 ? _a : 0) - ((_b = a.seenAt) !== null && _b !== void 0 ? _b : 0); });
                latest = (_g = observations[0]) !== null && _g !== void 0 ? _g : { state: 'unobserved', seenAt: null, step: null };
                // Several sessions can each have a step; the one started last is the task's.
                // An executing older session still blocks merging even when a newer, idle
                // session wrote the latest message.
                return [2 /*return*/, __assign(__assign({}, latest), { state: observations.some(function (o) { return o.state === 'working'; }) ? 'working' : latest.state, step: activity_1.latestStep.apply(void 0, observations.map(function (o) { return o.step; })) })];
        }
    });
}); };
exports.readCodexSession = readCodexSession;
