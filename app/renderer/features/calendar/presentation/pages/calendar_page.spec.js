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
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var app_1 = require("../../../../app/app");
var en_1 = require("../../../../l10n/en");
var test_support_1 = require("../../../../test_support");
var workspace_store_1 = require("../../../workspace/state_management/workspace_store");
var calendar_page_1 = require("./calendar_page");
var KEY = 'a-000001';
var HERE = 'America/Chicago';
// Wednesday 25 November 2026, 13:44 in Chicago.
var NOW = Date.parse('2026-11-25T19:44:00Z');
var c = en_1.t.calendar;
var ok = function (data) { return ({ ok: true, data: data }); };
var CALL = { id: 'e-1', title: 'Call with Ana', when: { kind: 'timed', start: '2026-11-26T15:00', end: '2026-11-26T15:30', zone: 'Europe/Lisbon' }, place: 'Zoom', notes: null };
var TRIP = { id: 'e-2', title: 'Lisbon trip', when: { kind: 'allDay', startDay: '2026-12-03', endDay: '2026-12-05' }, place: null, notes: null };
var realmWith = function (over) {
    if (over === void 0) { over = {}; }
    return (0, test_support_1.projectView)(KEY, over);
};
var REALM = realmWith({
    ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 't-ship', title: 'Ship the parser', due: '2026-11-27' }) }],
    activeQuests: [(0, test_support_1.activeQuest)({ id: 't-late', title: 'Fix the login', due: '2026-11-20' })],
});
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (_a) {
        var engine, onOpenQuest, onSay;
        var _b = _a === void 0 ? {} : _a, _c = _b.events, events = _c === void 0 ? [CALL, TRIP] : _c, _d = _b.realm, realm = _d === void 0 ? REALM : _d, _e = _b.over, over = _e === void 0 ? {} : _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)(__assign({ readCalendar: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ok({ events: events, unreadable: 0 })];
                        }); }); }) }, over)).engine;
                    onOpenQuest = vitest_1.vi.fn();
                    onSay = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void (0, preact_1.render)(<calendar_page_1.CalendarPage engine={engine} realm={realm} onOpenQuest={onOpenQuest} onSay={onSay} nowMs={function () { return NOW; }} zone={function () { return HERE; }}/>)];
                        }); }); })];
                case 1:
                    _f.sent();
                    return [2 /*return*/, { engine: engine, onOpenQuest: onOpenQuest, onSay: onSay }];
            }
        });
    });
};
var dayCell = function (day) { return preact_1.screen.getByRole('button', { name: c.addOn(day) }).closest('[role="gridcell"]'); };
var fill = function (label, value) { return preact_1.fireEvent.input(preact_1.screen.getByLabelText(new RegExp("^".concat(label))), { target: { value: value } }); };
(0, vitest_1.afterEach)(function () {
    (0, preact_1.cleanup)();
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)('the month', function () {
    (0, vitest_1.it)("opens on this month, with events and due dates on their days on the Mac's clock", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _i, _b, day;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'November 2026' })];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.clock(HERE))).toBeTruthy();
                    // 15:00 in Lisbon is 09:00 in Chicago.
                    (0, vitest_1.expect)((0, preact_1.within)(dayCell('2026-11-26')).getByRole('button', { name: c.editEvent('Call with Ana') }).textContent).toBe('09:00Call with Ana');
                    (0, vitest_1.expect)((0, preact_1.within)(dayCell('2026-11-27')).getByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dayCell('2026-11-20')).getByRole('button', { name: c.openQuest('Fix the login', c.overdue) })).toBeTruthy();
                    for (_i = 0, _b = ['2026-12-03', '2026-12-04', '2026-12-05']; _i < _b.length; _i++) {
                        day = _b[_i];
                        (0, vitest_1.expect)((0, preact_1.within)(dayCell(day)).getByRole('button', { name: c.editEvent('Lisbon trip') })).toBeTruthy();
                    }
                    (0, vitest_1.expect)(dayCell('2026-11-25').getAttribute('aria-current')).toBe('date');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('pages to the next month and back to today', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'November 2026' })];
                case 2:
                    _a.sent();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.next.month }));
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: 'December 2026' })).toBeTruthy();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.previous.month }));
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.previous.month }));
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: 'October 2026' })).toBeTruthy();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.today }));
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: 'November 2026' })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a busy day’s first items and sends the rest to the agenda', function () { return __awaiter(void 0, void 0, void 0, function () {
        var busy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    busy = ['A', 'B', 'C', 'D'].map(function (title, i) { return ({ id: "e-".concat(i + 10), title: title, when: { kind: 'allDay', startDay: '2026-11-30', endDay: '2026-11-30' }, place: null, notes: null }); });
                    return [4 /*yield*/, open({ events: busy })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'November 2026' })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dayCell('2026-11-30')).getAllByRole('button', { name: /^Edit / })).toHaveLength(2);
                    preact_1.fireEvent.click((0, preact_1.within)(dayCell('2026-11-30')).getByRole('button', { name: c.moreOn(2, '2026-11-30') }));
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: c.modes.agenda }).getAttribute('aria-pressed')).toBe('true');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: c.dayName('2026-11-30') })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getAllByRole('button', { name: /^Edit / })).toHaveLength(4);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens a due date’s quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onOpenQuest, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    onOpenQuest = (_c.sent()).onOpenQuest;
                    _b = (_a = preact_1.fireEvent).click;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) })];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    (0, vitest_1.expect)(onOpenQuest).toHaveBeenCalledWith('t-ship');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the week and the agenda', function () {
    (0, vitest_1.it)('puts a timed event at its hour, and all-day items above', function () { return __awaiter(void 0, void 0, void 0, function () {
        var thursday, block;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ events: [CALL, __assign(__assign({}, TRIP), { when: { kind: 'allDay', startDay: '2026-11-24', endDay: '2026-11-24' } })] })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'November 2026' })];
                case 2:
                    _a.sent();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.modes.week }));
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: '23 – 29 Nov 2026' })).toBeTruthy();
                    thursday = preact_1.screen.getByRole('group', { name: c.dayName('2026-11-26') });
                    block = (0, preact_1.within)(thursday).getByRole('button', { name: c.editEvent('Call with Ana') }).parentElement;
                    (0, vitest_1.expect)(block.style.top).toBe("".concat(9 * 44, "px"));
                    (0, vitest_1.expect)(block.style.height).toBe('22px');
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('group', { name: c.allDayRow })).getByRole('button', { name: c.editEvent('Lisbon trip') })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('group', { name: c.allDayRow })).getByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("lists four weeks by day, with overdue quests first and an event's own zone beside the Mac's", function () { return __awaiter(void 0, void 0, void 0, function () {
        var headings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'November 2026' })];
                case 2:
                    _a.sent();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.modes.agenda }));
                    headings = preact_1.screen.getAllByRole('heading', { level: 2 }).map(function (h) { return h.textContent; });
                    (0, vitest_1.expect)(headings).toEqual(['25 Nov – 22 Dec 2026', c.overdueGroup, c.dayName('2026-11-26'), c.dayName('2026-11-27'), c.dayName('2026-12-03'), c.dayName('2026-12-04'), c.dayName('2026-12-05')]);
                    (0, vitest_1.expect)(preact_1.screen.getByText("09:00 \u2013 09:30 \u00B7 ".concat(c.inZone('15:00', '15:30', 'Europe/Lisbon')))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('Zoom')).toBeTruthy();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.next.agenda }));
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.emptyRange)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('adding, changing and removing events', function () {
    (0, vitest_1.it)('adds an event on a day, with every field checked before it is sent', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, onSay, _b, _c, sheet;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _d.sent(), engine = _a.engine, onSay = _a.onSay;
                    _c = (_b = preact_1.fireEvent).click;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: c.addOn('2026-12-01') })];
                case 2:
                    _c.apply(_b, [_d.sent()]);
                    sheet = preact_1.screen.getByRole('dialog', { name: c.form.add });
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(/^Starts/).value).toBe('2026-12-01');
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(/^Start time/).value).toBe('09:00');
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(/^Time zone/).value).toBe(HERE);
                    preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: c.form.addIt }));
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.form.titleRequired)).toBeTruthy();
                    (0, vitest_1.expect)(engine.saveCalendarEvent).not.toHaveBeenCalled();
                    fill('Title', 'Dentist');
                    fill('End time', '08:00');
                    preact_1.fireEvent.blur(preact_1.screen.getByLabelText(/^End time/));
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.form.endsFirst)).toBeTruthy();
                    fill('End time', '09:45');
                    fill('Place', 'Main St');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: c.form.addIt }))];
                        }); }); })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(engine.saveCalendarEvent).toHaveBeenCalledWith(KEY, null, { title: 'Dentist', when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T09:45', zone: HERE }, place: 'Main St', notes: null });
                    (0, vitest_1.expect)(onSay).toHaveBeenCalledWith(c.saved('Dentist'));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 4:
                    _d.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dayCell('2026-12-01')).getByRole('button', { name: c.editEvent('Dentist') })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('adds an all-day event without times', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_c.sent()).engine;
                    _b = (_a = preact_1.fireEvent).click;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: c.newEvent })];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    fill('Title', 'Holiday');
                    preact_1.fireEvent.click(preact_1.screen.getByLabelText(c.form.allDay));
                    (0, vitest_1.expect)(preact_1.screen.queryByLabelText(/^Start time/)).toBeNull();
                    fill('Starts', '2026-12-24');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.form.addIt }))];
                        }); }); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(engine.saveCalendarEvent).toHaveBeenCalledWith(KEY, null, vitest_1.expect.objectContaining({ when: { kind: 'allDay', startDay: '2026-12-24', endDay: '2026-12-24' } }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps the sheet open with the engine's reason when a save is refused", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, open({ over: { saveCalendarEvent: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: false, error: { message: 'Pick a time zone from the list, such as America/Chicago.' } })];
                            }); }); }) } })];
                case 1:
                    _d.sent();
                    _b = (_a = preact_1.fireEvent).click;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: c.newEvent })];
                case 2:
                    _b.apply(_a, [_d.sent()]);
                    fill('Title', 'Call');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.form.addIt }))];
                        }); }); })];
                case 3:
                    _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 4:
                    _c.apply(void 0, [(_d.sent()).textContent]).toBe('Pick a time zone from the list, such as America/Chicago.');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog', { name: c.form.add })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('changes an event on its own zone’s clock, keeping its id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_c.sent()).engine;
                    _b = (_a = preact_1.fireEvent).click;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: c.editEvent('Call with Ana') })];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog', { name: c.form.edit })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(/^Start time/).value).toBe('15:00');
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(/^Time zone/).value).toBe('Europe/Lisbon');
                    fill('Title', 'Call with Ana and Rui');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.form.save }))];
                        }); }); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(engine.saveCalendarEvent).toHaveBeenCalledWith(KEY, 'e-1', { title: 'Call with Ana and Rui', when: CALL.when, place: 'Zoom', notes: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('removes an event after asking', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, onSay, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _d.sent(), engine = _a.engine, onSay = _a.onSay;
                    _c = (_b = preact_1.fireEvent).click;
                    return [4 /*yield*/, preact_1.screen.findAllByRole('button', { name: c.editEvent('Lisbon trip') })];
                case 2:
                    _c.apply(_b, [(_d.sent())[0]]);
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.form.remove }));
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog', { name: c.removeTitle('Lisbon trip') })).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.removeIt }))];
                        }); }); })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(engine.removeCalendarEvent).toHaveBeenCalledWith(KEY, 'e-2');
                    (0, vitest_1.expect)(onSay).toHaveBeenCalledWith(c.removed('Lisbon trip'));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 4:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('every state', function () {
    (0, vitest_1.it)('says it is reading, then shows the month', function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    answer = function () { };
                    return [4 /*yield*/, open({ over: { readCalendar: vitest_1.vi.fn(function () { return new Promise(function (done) { return (answer = done); }); }) } })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.loading.calendar)).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, answer(ok({ events: [], unreadable: 0 }))];
                        }); }); })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'November 2026' })];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers a first event when there is nothing to show', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ events: [], realm: realmWith() })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: c.emptyTitle })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    // The second New event button is the one in the empty state.
                    preact_1.fireEvent.click(preact_1.screen.getAllByRole('button', { name: c.newEvent })[1]);
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog', { name: c.form.add })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(/^Starts/).value).toBe('2026-11-25');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says why it failed, and tries again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readCalendar, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readCalendar = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't read this realm's calendar." } })];
                    }); }); });
                    return [4 /*yield*/, open({ over: { readCalendar: readCalendar } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't read this realm's calendar.")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    readCalendar.mockResolvedValueOnce({ ok: true, data: { events: [CALL], unreadable: 0 } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.failed.tryAgain }))];
                        }); }); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: 'November 2026' })).toBeTruthy(); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("says when some of the file couldn't be read, and shows the rest", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ over: { readCalendar: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ok({ events: [CALL], unreadable: 2 })];
                            }); }); }) } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(c.unreadable(2))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: c.editEvent('Call with Ana') })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('in the app', function () {
    (0, vitest_1.afterEach)(function () { return vitest_1.vi.useRealTimers(); });
    (0, vitest_1.it)('opens on ⌘8, and a due date opens its quest on the board', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readQuestFacts, engine, workspace, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Only the clock is faked, so the month shown holds the due date.
                    vitest_1.vi.useFakeTimers({ toFake: ['Date'] });
                    vitest_1.vi.setSystemTime(NOW);
                    window.location.hash = '#/home';
                    readQuestFacts = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(test_support_1.QUEST_FACTS)];
                    }); }); });
                    engine = (0, test_support_1.fakeEngine)({ readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ok((0, test_support_1.projectView)(key, { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 't-ship', title: 'Ship the parser', due: '2026-11-27' }) }], canStart: 1 }))];
                        }); }); }, readQuestFacts: readQuestFacts }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                                        return [4 /*yield*/, workspace.start()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, { key: '8', metaKey: true }); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/calendar'); })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: c.title })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = preact_1.fireEvent).click;
                                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: c.openQuest('Ship the parser', c.states.waiting) })];
                                case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                            }
                        }); }); })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/quests'); })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readQuestFacts).toHaveBeenCalledWith(KEY, 't-ship'); })];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
