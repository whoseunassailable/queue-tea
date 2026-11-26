"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todayIn = exports.stepOf = exports.rangeOf = exports.monthWeeksOf = exports.addMonths = exports.monthStartOf = exports.weekOf = exports.weekStartOf = exports.weekdayIndex = exports.daysFrom = exports.addDays = exports.AGENDA_DAYS = exports.CALENDAR_MODES = void 0;
var calendar_time_1 = require("../../../../shared/calendar_time");
// Days as YYYY-MM-DD, counted in UTC so no zone can move them. Weeks start on
// Monday, as everywhere else in the app.
var DAY_MS = 86400000;
exports.CALENDAR_MODES = ['month', 'week', 'agenda'];
// The agenda shows four weeks at a time.
exports.AGENDA_DAYS = 28;
var numberOf = function (day) { return Date.parse("".concat(day, "T00:00:00Z")) / DAY_MS; };
var dayOfNumber = function (n) { return new Date(n * DAY_MS).toISOString().slice(0, 10); };
var addDays = function (day, n) { return dayOfNumber(numberOf(day) + n); };
exports.addDays = addDays;
var daysFrom = function (from, to) { return numberOf(to) - numberOf(from); };
exports.daysFrom = daysFrom;
// 0 for Monday to 6 for Sunday.
var weekdayIndex = function (day) { return (new Date("".concat(day, "T00:00:00Z")).getUTCDay() + 6) % 7; };
exports.weekdayIndex = weekdayIndex;
var weekStartOf = function (day) { return (0, exports.addDays)(day, -(0, exports.weekdayIndex)(day)); };
exports.weekStartOf = weekStartOf;
var weekOf = function (day) { return Array.from({ length: 7 }, function (_, i) { return (0, exports.addDays)((0, exports.weekStartOf)(day), i); }); };
exports.weekOf = weekOf;
var monthStartOf = function (day) { return "".concat(day.slice(0, 7), "-01"); };
exports.monthStartOf = monthStartOf;
// The same day of another month, or that month's last when it's shorter:
// a month after 31 Jan is 28 Feb.
var addMonths = function (day, n) {
    var months = Number(day.slice(0, 4)) * 12 + Number(day.slice(5, 7)) - 1 + n;
    var year = Math.floor(months / 12);
    var month = months - year * 12;
    var last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return new Date(Date.UTC(year, month, Math.min(Number(day.slice(8, 10)), last))).toISOString().slice(0, 10);
};
exports.addMonths = addMonths;
// The month's whole weeks, Monday to Sunday, as rows of seven days.
var monthWeeksOf = function (day) {
    var first = (0, exports.weekStartOf)((0, exports.monthStartOf)(day));
    var last = (0, exports.addDays)((0, exports.monthStartOf)((0, exports.addMonths)((0, exports.monthStartOf)(day), 1)), -1);
    var weeks = [];
    for (var start = first; start <= last; start = (0, exports.addDays)(start, 7))
        weeks.push((0, exports.weekOf)(start));
    return weeks;
};
exports.monthWeeksOf = monthWeeksOf;
// The first and last day a view shows.
var rangeOf = function (mode, anchor) {
    if (mode === 'week')
        return { first: (0, exports.weekStartOf)(anchor), last: (0, exports.addDays)((0, exports.weekStartOf)(anchor), 6) };
    if (mode === 'agenda')
        return { first: anchor, last: (0, exports.addDays)(anchor, exports.AGENDA_DAYS - 1) };
    var weeks = (0, exports.monthWeeksOf)(anchor);
    return { first: weeks[0][0], last: weeks[weeks.length - 1][6] };
};
exports.rangeOf = rangeOf;
// Where Previous and Next go: a month, a week, or the agenda's four weeks.
var stepOf = function (mode, anchor, by) {
    if (mode === 'month')
        return (0, exports.addMonths)((0, exports.monthStartOf)(anchor), by);
    return (0, exports.addDays)(anchor, by * (mode === 'week' ? 7 : exports.AGENDA_DAYS));
};
exports.stepOf = stepOf;
var todayIn = function (zone, nowMs) { return (0, calendar_time_1.wallOf)(nowMs, zone).slice(0, 10); };
exports.todayIn = todayIn;
