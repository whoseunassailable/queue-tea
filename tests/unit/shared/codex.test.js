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
var testing_1 = require("claude-code/testing");
var codex_log_source_1 = require("../../../hooks/shared/codex/data/datasources/codex_log_source");
var helpers_1 = require("../../helpers");
var SINCE = Date.parse('2026-10-21T06:00:00Z');
var NOW = Date.parse('2026-10-21T07:12:00Z');
var SESSIONS = '/h/.codex/sessions';
// Lines the way Codex writes them: the timestamp first, the session's folder
// in the first line's payload.
var session = function (cwd, stamps) {
    return __spreadArray(__spreadArray([
        JSON.stringify({ timestamp: stamps[0], type: 'session_meta', payload: { id: 's', timestamp: stamps[0], cwd: cwd } })
    ], stamps.slice(1).map(function (at) { return JSON.stringify({ timestamp: at, type: 'event_msg', payload: { type: 'agent_message' } }); }), true), [
        '',
    ], false).join('\n');
};
// Codex's log in memory: each file with its text and when it last changed.
var codexLog = function (files) {
    var mem = (0, helpers_1.memoryHost)({ files: Object.fromEntries(Object.entries(files).map(function (_a) {
            var path = _a[0], f = _a[1];
            return [path, f.text];
        })) });
    for (var _i = 0, _a = Object.keys(files); _i < _a.length; _i++) {
        var path = _a[_i];
        mem.dirs.add(path.slice(0, path.lastIndexOf('/')));
    }
    mem.host.modifiedAt = function (path) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        return [2 /*return*/, (_b = (_a = files[path]) === null || _a === void 0 ? void 0 : _a.modified) !== null && _b !== void 0 ? _b : null];
    }); }); };
    var reads = [];
    var read = mem.host.read;
    mem.host.read = function (path) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            reads.push(path);
            return [2 /*return*/, read(path)];
        });
    }); };
    return { host: mem.host, reads: reads };
};
(0, testing_1.test)('only sessions run in the folder count, and only from the moment given', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, stamps;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                host = codexLog((_a = {},
                    _a["".concat(SESSIONS, "/2026/10/21/rollout-a.jsonl")] = { text: session('/p', ['2026-10-21T05:50:00Z', '2026-10-21T06:05:00Z', '2026-10-21T06:10:00Z']), modified: NOW },
                    _a["".concat(SESSIONS, "/2026/10/21/rollout-b.jsonl")] = { text: session('/elsewhere', ['2026-10-21T06:01:00Z', '2026-10-21T06:20:00Z']), modified: NOW },
                    _a)).host;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', SINCE, NOW)];
            case 1:
                stamps = _b.sent();
                (0, testing_1.expect)(stamps.sort()).toEqual([Date.parse('2026-10-21T06:05:00Z'), Date.parse('2026-10-21T06:10:00Z')]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a session last changed before the moment given is not opened', function () { return __awaiter(void 0, void 0, void 0, function () {
    var old, _a, host, reads, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                old = "".concat(SESSIONS, "/2026/10/21/rollout-old.jsonl");
                _a = codexLog((_c = {}, _c[old] = { text: session('/p', ['2026-10-21T05:00:00Z', '2026-10-21T05:30:00Z']), modified: SINCE - 1 }, _c)), host = _a.host, reads = _a.reads;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', SINCE, NOW)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toEqual([]);
                (0, testing_1.expect)(reads).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a first line Codex has not finished writing is skipped, and the other sessions still count', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                host = codexLog((_b = {},
                    _b["".concat(SESSIONS, "/2026/10/21/rollout-new.jsonl")] = { text: '{"timestamp":"2026-10-21T06:30:00Z","type":"session_me', modified: NOW },
                    _b["".concat(SESSIONS, "/2026/10/21/rollout-a.jsonl")] = { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW },
                    _b)).host;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', SINCE, NOW)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual([Date.parse('2026-10-21T06:05:00Z')]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('files that are not sessions are passed over', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                host = codexLog((_b = {}, _b["".concat(SESSIONS, "/2026/10/21/notes.txt")] = { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW }, _b)).host;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', SINCE, NOW)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('days with no Codex folder are passed over, and no Codex at all reads as nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                host = codexLog((_c = {}, _c["".concat(SESSIONS, "/2026/10/21/rollout-a.jsonl")] = { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW }, _c)).host;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', SINCE, NOW)];
            case 1:
                _a.apply(void 0, [_d.sent()]).toEqual([Date.parse('2026-10-21T06:05:00Z')]);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(codexLog({}).host, '/h', '/p', SINCE, NOW)];
            case 2:
                _b.apply(void 0, [_d.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a session started the day before, in the folder of that day, counts from the moment given', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                host = codexLog((_b = {},
                    _b["".concat(SESSIONS, "/2026/10/20/rollout-a.jsonl")] = { text: session('/p', ['2026-10-20T23:00:00Z', '2026-10-21T05:00:00Z', '2026-10-21T06:05:00Z']), modified: NOW },
                    _b)).host;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', SINCE, NOW)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual([Date.parse('2026-10-21T06:05:00Z')]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('east of UTC, a session started after local midnight on the last day counts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var since, now, host, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                since = Date.parse('2026-10-21T23:00:00Z');
                now = Date.parse('2026-10-22T22:30:00Z');
                host = codexLog((_b = {},
                    _b["".concat(SESSIONS, "/2026/10/23/rollout-a.jsonl")] = { text: session('/p', ['2026-10-22T22:10:00Z', '2026-10-22T22:20:00Z']), modified: now },
                    _b)).host;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', since, now)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual([Date.parse('2026-10-22T22:10:00Z'), Date.parse('2026-10-22T22:20:00Z')]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a session file that cannot be read fails the whole read, so its time is not quietly lost', function () { return __awaiter(void 0, void 0, void 0, function () {
    var file, host;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                file = "".concat(SESSIONS, "/2026/10/21/rollout-a.jsonl");
                host = codexLog((_a = {}, _a[file] = { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW }, _a)).host;
                host.read = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error('EACCES');
                    });
                }); };
                return [4 /*yield*/, (0, testing_1.expect)((0, codex_log_source_1.readCodexActivity)(host, '/h', '/p', SINCE, NOW)).rejects.toThrow('EACCES')];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
