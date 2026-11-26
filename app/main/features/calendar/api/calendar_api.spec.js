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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var messages_1 = require("../../../core/messages");
var node_host_1 = require("../../../core/node_host");
var calendar_api_1 = require("./calendar_api");
var KEY = 'demo-abc123';
var CALL = { title: 'Call with Ana', when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:30', zone: 'Europe/Lisbon' }, place: null, notes: null };
var TRIP = { title: 'Lisbon trip', when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-06' }, place: 'Lisbon', notes: 'Pack the adapter.' };
var home;
var file;
var ids;
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
var onDisk = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var makeApi = function () {
    var log = (0, logger_1.createLogger)('dev', function () { });
    return (0, calendar_api_1.calendarApi)({ host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
        }); }); }), home: home, log: log, newId: function () { return "e-".concat((ids += 1)); } });
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-calendar-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                file = (0, node_path_1.join)(home, '.queue-tea/notes', KEY, 'Calendar.json');
                ids = 0;
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify((0, record_source_1.emptyRecord)('demo', '/p/demo')))];
            case 4:
                _b.sent();
                api = makeApi();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('a realm calendar on disk', function () {
    (0, vitest_1.it)('starts empty, and writes nothing to find that out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readCalendar(KEY)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ events: [], unreadable: 0 });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readFile)(file, 'utf8')).rejects.toThrow()];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps events beside the realm's notes, earliest first, and reads them back after a restart", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, TRIP)];
                case 1:
                    _a.apply(void 0, [_g.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, CALL)];
                case 2:
                    _b.apply(void 0, [_g.sent()]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_g.sent()).format]).toBe(1);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _d.apply(void 0, [(_g.sent()).events.map(function (e) { return e.title; })]).toEqual(['Call with Ana', 'Lisbon trip']);
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, makeApi().readCalendar(KEY)];
                case 5:
                    _e.apply(void 0, [_f.apply(void 0, [_g.sent()]).events]).toEqual([
                        __assign({ id: 'e-2' }, CALL),
                        __assign({ id: 'e-1' }, TRIP),
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('changes an event in place, keeping its id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, CALL)];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, 'e-1', __assign(__assign({}, CALL), { title: 'Call with Ana and Rui', place: 'Zoom' }))];
                case 2:
                    view = _b.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(view.events).toEqual([__assign(__assign({ id: 'e-1' }, CALL), { title: 'Call with Ana and Rui', place: 'Zoom' })]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('removes an event, and says so when it is already gone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, CALL)];
                case 1:
                    _a.apply(void 0, [_h.sent()]);
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.removeCalendarEvent(KEY, 'e-1')];
                case 2:
                    _b.apply(void 0, [_c.apply(void 0, [_h.sent()]).events]).toEqual([]);
                    _d = vitest_1.expect;
                    _e = refused;
                    return [4 /*yield*/, api.removeCalendarEvent(KEY, 'e-1')];
                case 3:
                    _d.apply(void 0, [_e.apply(void 0, [_h.sent()])]).toBe(messages_1.MESSAGES.eventGone);
                    _f = vitest_1.expect;
                    _g = refused;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, 'e-1', CALL)];
                case 4:
                    _f.apply(void 0, [_g.apply(void 0, [_h.sent()])]).toBe(messages_1.MESSAGES.eventGone);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the zone by its own name, and trims what it was sent', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, __assign(__assign({}, CALL), { title: '  Call\nwith Ana ', when: __assign(__assign({}, CALL.when), { zone: 'europe/lisbon' }), place: '  ', notes: ' Bring the notes ' }))];
                case 1:
                    view = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(view.events[0]).toMatchObject({ title: 'Call with Ana', when: { zone: 'Europe/Lisbon' }, place: null, notes: 'Bring the notes' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm it does not know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readCalendar('../other')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.saveCalendarEvent('ghost-abc123', null, CALL)];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves two quick changes one after the other, so neither is lost', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([api.saveCalendarEvent(KEY, null, CALL), api.saveCalendarEvent(KEY, null, TRIP)])];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readCalendar(KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).events]).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('what an event may say', function () {
    var refusal = function (over) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = refused;
                return [4 /*yield*/, api.saveCalendarEvent(KEY, null, __assign(__assign({}, CALL), over))];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    }); }); };
    (0, vitest_1.it)('needs a title of 200 characters or fewer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusal({ title: '  ' })];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toBe(messages_1.MESSAGES.titleRequired);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, refusal({ title: 'x'.repeat(201) })];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe(messages_1.MESSAGES.titleTooLong);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('needs real days and times, in a zone Intl knows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusal({ when: { kind: 'allDay', startDay: '2026-02-30', endDay: '2026-03-01' } })];
                case 1:
                    _a.apply(void 0, [_e.sent()]).toBe(messages_1.MESSAGES.eventDayBad);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, refusal({ when: { kind: 'timed', start: '2026-12-01T25:00', end: '2026-12-01T26:00', zone: 'UTC' } })];
                case 2:
                    _b.apply(void 0, [_e.sent()]).toBe(messages_1.MESSAGES.eventTimeBad);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, refusal({ when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T10:00', zone: 'Mars/Base' } })];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toBe(messages_1.MESSAGES.eventZoneBad);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, refusal({ when: { kind: 'weekly' } })];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toBe(messages_1.MESSAGES.badValue);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('needs the end after the start, and no more than a year between them', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusal({ when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-02' } })];
                case 1:
                    _a.apply(void 0, [_h.sent()]).toBe(messages_1.MESSAGES.eventEndsFirst);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, refusal({ when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:00', zone: 'UTC' } })];
                case 2:
                    _b.apply(void 0, [_h.sent()]).toBe(messages_1.MESSAGES.eventEndsFirst);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, refusal({ when: { kind: 'allDay', startDay: '2026-01-01', endDay: '2027-01-02' } })];
                case 3:
                    _c.apply(void 0, [_h.sent()]).toBe(messages_1.MESSAGES.eventTooLong);
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, __assign(__assign({}, CALL), { when: { kind: 'allDay', startDay: '2026-01-01', endDay: '2027-01-01' } }))];
                case 4:
                    _d.apply(void 0, [_e.apply(void 0, [_h.sent()]).events]).toHaveLength(1);
                    _f = vitest_1.expect;
                    _g = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, __assign(__assign({}, CALL), { when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-03' } }))];
                case 5:
                    _f.apply(void 0, [_g.apply(void 0, [_h.sent()]).events]).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads a time the clocks repeat as its first: 1:30 to 1:15 the night Chicago goes back ends first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var night, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    night = function (start, end) { return (__assign(__assign({}, CALL), { when: { kind: 'timed', start: "2026-11-01T".concat(start), end: "2026-11-01T".concat(end), zone: 'America/Chicago' } })); };
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, night('01:30', '01:15'))];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.eventEndsFirst);
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, night('00:30', '02:30'))];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()]).events]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a place to 200 characters and notes to 5,000', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusal({ place: 'x'.repeat(201) })];
                case 1:
                    _a.apply(void 0, [_d.sent()]).toBe(messages_1.MESSAGES.eventPlaceLong);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, refusal({ notes: 'x'.repeat(5001) })];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toBe(messages_1.MESSAGES.eventNotesLong);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, refusal({ place: 7 })];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toBe(messages_1.MESSAGES.badValue);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a hand-edited Calendar.json', function () {
    var write = function (value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/notes', KEY), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, typeof value === 'string' ? value : JSON.stringify(value))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, vitest_1.it)('keeps the events it cannot read, and writes them back untouched', function () { return __awaiter(void 0, void 0, void 0, function () {
        var broken, _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    broken = { id: 'e-9', title: 'Half typed', when: { kind: 'timed', start: '2026-12-01T09' } };
                    return [4 /*yield*/, write({ format: 1, events: [__assign({ id: 'e-7' }, TRIP), broken, __assign({ id: 'e-7' }, CALL)] })];
                case 1:
                    _h.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readCalendar(KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_h.sent()])]).toEqual({ events: [__assign({ id: 'e-7' }, TRIP)], unreadable: 2 });
                    _c = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, CALL)];
                case 3:
                    _c.apply(void 0, [_h.sent()]);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _d.apply(void 0, [(_h.sent()).events]).toContainEqual(broken);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _e.apply(void 0, [(_h.sent()).events]).toContainEqual(__assign({ id: 'e-7' }, CALL));
                    _f = vitest_1.expect;
                    _g = data;
                    return [4 /*yield*/, api.readCalendar(KEY)];
                case 6:
                    _f.apply(void 0, [_g.apply(void 0, [_h.sent()]).unreadable]).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves a file that is not a calendar as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, text, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _i = 0, _a = ['{ not json', '[]', JSON.stringify({ events: [] }), JSON.stringify({ format: 1, events: {} })];
                    _g.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    text = _a[_i];
                    return [4 /*yield*/, write(text)];
                case 2:
                    _g.sent();
                    _b = vitest_1.expect;
                    _c = refused;
                    return [4 /*yield*/, api.readCalendar(KEY)];
                case 3:
                    _b.apply(void 0, [_c.apply(void 0, [_g.sent()])]).toBe(messages_1.MESSAGES.badCalendarFile(file));
                    _d = vitest_1.expect;
                    _e = refused;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, CALL)];
                case 4:
                    _d.apply(void 0, [_e.apply(void 0, [_g.sent()])]).toBe(messages_1.MESSAGES.badCalendarFile(file));
                    _f = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 5:
                    _f.apply(void 0, [_g.sent()]).toBe(text);
                    _g.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves a file a newer Queue-tea wrote as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, write({ format: 2, events: [] })];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readCalendar(KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.newerCalendar(file));
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.removeCalendarEvent(KEY, 'e-1')];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.newerCalendar(file));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the last good copy beside it before each write', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, CALL)];
                case 1:
                    _a.apply(void 0, [_f.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.saveCalendarEvent(KEY, null, TRIP)];
                case 2:
                    _b.apply(void 0, [_f.sent()]);
                    _c = vitest_1.expect;
                    _e = (_d = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)("".concat(file, ".bak"), 'utf8')];
                case 3:
                    _c.apply(void 0, [_e.apply(_d, [_f.sent()]).events]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
