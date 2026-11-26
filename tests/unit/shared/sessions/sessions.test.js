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
var testing_1 = require("claude-code/testing");
var session_beat_1 = require("../../../../hooks/app/session/session_beat");
var live_1 = require("../../../../hooks/core/session/live");
var session_source_1 = require("../../../../hooks/shared/sessions/data/datasources/session_source");
var session_rules_1 = require("../../../../hooks/shared/sessions/domain/services/session_rules");
var helpers_1 = require("../../../helpers");
var session = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 's-1', projectPath: '/p', recordFile: helpers_1.CTX.file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: helpers_1.CTX.options, heartbeat: 1000, startedAt: 1000 }, over));
};
var fresh = function () {
    live_1.live.ctx = helpers_1.CTX;
    live_1.live.isTurnRunning = false;
    live_1.live.sessionId = null;
    live_1.live.startedAt = null;
};
(0, testing_1.test)('a session is fresh up to 90 s and stale past it', function () {
    (0, testing_1.expect)(session_rules_1.STALE_MS).toBe(90000);
    (0, testing_1.expect)((0, session_rules_1.isFresh)(session({ heartbeat: 0 }), 90000)).toBe(true);
    (0, testing_1.expect)((0, session_rules_1.isFresh)(session({ heartbeat: 0 }), 90001)).toBe(false);
});
(0, testing_1.test)('a file that is not a session reads as none', function () {
    var _a;
    (0, testing_1.expect)((0, session_rules_1.parseSession)('{half')).toBe(null);
    (0, testing_1.expect)((0, session_rules_1.parseSession)('{"id":"s"}')).toBe(null);
    (0, testing_1.expect)((_a = (0, session_rules_1.parseSession)(JSON.stringify(session()))) === null || _a === void 0 ? void 0 : _a.id).toBe('s-1');
});
(0, testing_1.test)('a session file is written through a temp file, read and removed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)();
                return [4 /*yield*/, (0, session_source_1.writeSessionFile)(mem.host, '/h', session())];
            case 1:
                _c.sent();
                (0, testing_1.expect)(mem.writes).toEqual(["".concat((0, session_rules_1.sessionPath)('/h', 's-1'), ".tmp")]);
                _a = testing_1.expect;
                return [4 /*yield*/, (0, session_source_1.readSessions)(mem.host, '/h')];
            case 2:
                _a.apply(void 0, [(_c.sent()).map(function (s) { return s.id; })]).toEqual(['s-1']);
                return [4 /*yield*/, (0, session_source_1.removeSessionFile)(mem.host, '/h', 's-1')];
            case 3:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, (0, session_source_1.readSessions)(mem.host, '/h')];
            case 4:
                _b.apply(void 0, [_c.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable session file is skipped, the rest still read', function () { return __awaiter(void 0, void 0, void 0, function () {
    var folder, mem, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                folder = (0, session_rules_1.sessionsFolder)('/h');
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b["".concat(folder, "/bad.json")] = '{nope', _b["".concat(folder, "/s-1.json")] = JSON.stringify(session()), _b) });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, session_source_1.readSessions)(mem.host, '/h')];
            case 1:
                _a.apply(void 0, [(_c.sent()).map(function (s) { return s.id; })]).toEqual(['s-1']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a beat writes where the session is, and its current task', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, mem, ports, written;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fresh();
                current = (0, helpers_1.makeTask)({ state: 'current' });
                mem = (0, helpers_1.memoryHost)();
                ports = (0, helpers_1.fakePorts)(mem, { view: { record: { version: 1, project: { name: 'p', path: '/p' }, docsLogPath: null, playNext: null, feature: null, tasks: [current], unassignedMinutesByDay: {}, requests: [] } } }).ports;
                return [4 /*yield*/, (0, session_beat_1.beat)(ports)];
            case 1:
                _a.sent();
                written = (0, session_rules_1.parseSession)(mem.files.get((0, session_rules_1.sessionPath)('/h', 's-1')));
                (0, testing_1.expect)(written).toMatchObject({ id: 's-1', projectPath: '/p', recordFile: helpers_1.CTX.file, currentTaskId: current.id, isTurnRunning: false });
                (0, testing_1.expect)(written === null || written === void 0 ? void 0 : written.heartbeat).toBe(Date.parse('2026-10-21T07:12:00Z'));
                (0, testing_1.expect)(written === null || written === void 0 ? void 0 : written.options).toEqual(helpers_1.CTX.options);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a beat carries the commit warning, so the app can show it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, ports, written;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)();
                ports = (0, helpers_1.fakePorts)(mem, { view: { warning: 'During the last turn a commit appeared.' } }).ports;
                live_1.live.ctx = helpers_1.CTX;
                return [4 /*yield*/, (0, session_beat_1.beat)(ports)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, session_source_1.readSessions)(mem.host, helpers_1.CTX.home)];
            case 2:
                written = (_a.sent())[0];
                (0, testing_1.expect)(written === null || written === void 0 ? void 0 : written.warning).toBe('During the last turn a commit appeared.');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a beat under a new id, after a /clear, removes the old file', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, ports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fresh();
                mem = (0, helpers_1.memoryHost)();
                ports = (0, helpers_1.fakePorts)(mem).ports;
                return [4 /*yield*/, (0, session_beat_1.beat)(ports)];
            case 1:
                _a.sent();
                ports.session.id = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, 's-2'];
                }); }); };
                return [4 /*yield*/, (0, session_beat_1.beat)(ports)];
            case 2:
                _a.sent();
                (0, testing_1.expect)(mem.files.has((0, session_rules_1.sessionPath)('/h', 's-1'))).toBe(false);
                (0, testing_1.expect)(mem.files.has((0, session_rules_1.sessionPath)('/h', 's-2'))).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the session file goes at the session end', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, ports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fresh();
                mem = (0, helpers_1.memoryHost)();
                ports = (0, helpers_1.fakePorts)(mem).ports;
                return [4 /*yield*/, (0, session_beat_1.beat)(ports)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, session_beat_1.endBeat)(ports)];
            case 2:
                _a.sent();
                (0, testing_1.expect)(mem.files.has((0, session_rules_1.sessionPath)('/h', 's-1'))).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the first beat clears what crashed sessions left, and leaves live ones', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, mem, ports;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fresh();
                now = Date.parse('2026-10-21T07:12:00Z');
                mem = (0, helpers_1.memoryHost)({
                    files: (_a = {},
                        _a[(0, session_rules_1.sessionPath)('/h', 'crashed')] = JSON.stringify(session({ id: 'crashed', heartbeat: now - session_rules_1.STALE_MS - 1 })),
                        _a[(0, session_rules_1.sessionPath)('/h', 'alive')] = JSON.stringify(session({ id: 'alive', heartbeat: now })),
                        _a),
                });
                ports = (0, helpers_1.fakePorts)(mem).ports;
                return [4 /*yield*/, (0, session_beat_1.beat)(ports)];
            case 1:
                _b.sent();
                (0, testing_1.expect)(mem.files.has((0, session_rules_1.sessionPath)('/h', 'crashed'))).toBe(false);
                (0, testing_1.expect)(mem.files.has((0, session_rules_1.sessionPath)('/h', 'alive'))).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a beat that cannot write leaves the session going', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, done;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fresh();
                mem = (0, helpers_1.memoryHost)();
                mem.host.write = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error('disk full');
                    });
                }); };
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, done = _a.done;
                return [4 /*yield*/, (0, session_beat_1.beat)(ports)];
            case 1:
                _b.sent();
                (0, testing_1.expect)(done.logs.some(function (line) { return line.includes('session file'); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
