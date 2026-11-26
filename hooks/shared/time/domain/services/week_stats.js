"use strict";
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
exports.weekChart = exports.weekLine = exports.weekMinutes = exports.finishedTasks = exports.doneThisWeek = exports.weekOf = void 0;
var time_1 = require("./time");
var realm_time_1 = require("./realm_time");
var DAY = 86400000;
// The days Monday to Sunday of the week that holds `today`, as `YYYY-MM-DD`.
var weekOf = function (today) {
    var ms = Date.parse("".concat(today, "T00:00:00Z"));
    var monday = ms - ((new Date(ms).getUTCDay() + 6) % 7) * DAY;
    return Array.from({ length: 7 }, function (_, i) { return new Date(monday + i * DAY).toISOString().slice(0, 10); });
};
exports.weekOf = weekOf;
// This week's finished tasks, the latest first.
var doneThisWeek = function (tasks, today) {
    var days = (0, exports.weekOf)(today);
    return tasks
        .filter(function (t) { return t.state === 'done' && t.finished !== null && days.includes(t.finished.slice(0, 10)); })
        .sort(function (a, b) { return Date.parse(b.finished) - Date.parse(a.finished); });
};
exports.doneThisWeek = doneThisWeek;
// Every finished task, the latest first.
var finishedTasks = function (tasks) {
    return tasks
        .filter(function (t) { return t.state === 'done' && t.finished !== null; })
        .sort(function (a, b) { return Date.parse(b.finished) - Date.parse(a.finished); });
};
exports.finishedTasks = finishedTasks;
// Minutes per day of the week, Monday first, tasks and project time together.
var weekMinutes = function (tasks, unassigned, today, realmTime) {
    return (0, exports.weekOf)(today).map(function (day) {
        var time = (0, realm_time_1.realmDayTime)({ tasks: tasks, unassignedMinutesByDay: unassigned, realmTime: realmTime }, day);
        return time.onQuests + time.elsewhere;
    });
};
exports.weekMinutes = weekMinutes;
var weekLine = function (tasks, unassigned, today, realmTime) {
    var minutes = (0, exports.weekMinutes)(tasks, unassigned, today, realmTime).reduce(function (a, b) { return a + b; }, 0);
    return "".concat((0, exports.doneThisWeek)(tasks, today).length, " done \u00B7 ").concat((0, time_1.formatMinutes)(minutes));
};
exports.weekLine = weekLine;
var BARS = '▁▂▃▄▅▆▇█';
var DAY_LETTERS = 'MTWTFSS';
// One bar per day, Monday to Sunday, the busiest day full height; a day with
// no time is blank. "M ▃  T ▆  W ▁  T █  F    S    S  "
var weekChart = function (minutesByDay) {
    var most = Math.max.apply(Math, __spreadArray([0], minutesByDay, false));
    return minutesByDay
        .map(function (m, i) {
        var bar = m <= 0 || most === 0 ? ' ' : BARS[Math.max(0, Math.ceil((m / most) * BARS.length) - 1)];
        return "".concat(DAY_LETTERS[i], " ").concat(bar);
    })
        .join('  ');
};
exports.weekChart = weekChart;
