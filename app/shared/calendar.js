"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWallTime = exports.isDay = exports.CALENDAR_LIMITS = exports.CALENDAR_FORMAT = exports.CALENDAR_FILE = void 0;
// A realm's calendar: the events Rohan adds, kept in Calendar.json beside the
// realm's notes, and its quests' due dates, which stay on the quests.
// docs/calendar.md has the file and the rules.
exports.CALENDAR_FILE = 'Calendar.json';
exports.CALENDAR_FORMAT = 1;
exports.CALENDAR_LIMITS = { events: 5000, title: 200, place: 200, notes: 5000, spanDays: 366, bytes: 5000000 };
var DAY = /^\d{4}-\d{2}-\d{2}$/;
var WALL = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):[0-5]\d$/;
// A real day of the calendar: 2026-02-30 isn't one.
var isDay = function (value) {
    if (typeof value !== 'string' || !DAY.test(value))
        return false;
    var at = Date.parse("".concat(value, "T00:00:00Z"));
    return Number.isFinite(at) && new Date(at).toISOString().slice(0, 10) === value;
};
exports.isDay = isDay;
var isWallTime = function (value) {
    if (typeof value !== 'string')
        return false;
    var match = WALL.exec(value);
    return match !== null && (0, exports.isDay)(match[1]);
};
exports.isWallTime = isWallTime;
