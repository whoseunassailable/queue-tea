"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chronicleOf = exports.totalOf = exports.dayTimeOf = exports.dayBefore = void 0;
var time_1 = require("../../../../../hooks/shared/time/domain/services/time");
var realm_time_1 = require("../../../../../hooks/shared/time/domain/services/realm_time");
var week_stats_1 = require("../../../../../hooks/shared/time/domain/services/week_stats");
var game_1 = require("../../game/domain/services/game");
var RANK = { light: 0, medium: 1, hard: 2 };
var DAY_MS = 86400000;
// The day before, by the calendar: the text holds no time zone to get wrong.
var dayBefore = function (day) { return (0, time_1.dayKey)(Date.parse("".concat(day, "T00:00:00Z")) - DAY_MS, 0); };
exports.dayBefore = dayBefore;
var minutesOf = function (task) { return Object.values(task.minutesByDay).reduce(function (sum, m) { return sum + m; }, 0); };
var dayTimeOf = function (records, day) { return ({
    day: day,
    onQuests: records.reduce(function (sum, r) { return sum + (0, realm_time_1.realmDayTime)(r, day).onQuests; }, 0),
    elsewhere: records.reduce(function (sum, r) { return sum + (0, realm_time_1.realmDayTime)(r, day).elsewhere; }, 0),
}); };
exports.dayTimeOf = dayTimeOf;
var totalOf = function (days) { return days.reduce(function (sum, d) { return sum + d.onQuests + d.elsewhere; }, 0); };
exports.totalOf = totalOf;
var lineOf = function (record, task) {
    var _a;
    var actual = (_a = task.difficulty.actual) !== null && _a !== void 0 ? _a : task.difficulty.expected;
    return {
        id: task.id,
        title: task.title,
        priority: task.priority,
        realm: record.project.name,
        realmPath: record.project.path,
        started: task.started,
        finished: task.finished,
        minutes: minutesOf(task),
        expected: task.difficulty.expected,
        actual: actual,
        xp: (0, game_1.xpOf)(actual),
        improvingMessages: task.effort.improvingMessages,
        filesRead: task.effort.filesRead,
        filesChanged: task.effort.filesChanged,
        linesAdded: task.effort.linesAdded,
        linesRemoved: task.effort.linesRemoved,
        filesTouched: task.effort.filesTouched,
        branch: task.branch,
        startCommit: task.startCommit,
    };
};
var winsIn = function (records, week) {
    return records
        .flatMap(function (r) { return (0, week_stats_1.finishedTasks)(r.tasks).map(function (t) { return lineOf(r, t); }); })
        .filter(function (line) { return week.includes(line.finished.slice(0, 10)); })
        .sort(function (a, b) { return Date.parse(b.finished) - Date.parse(a.finished); });
};
// One week of what happened, from the records as they are. `day` is any day in
// the week. Only read: nothing here is kept.
var chronicleOf = function (records, day, today) {
    var week = (0, week_stats_1.weekOf)(day);
    var days = week.map(function (d) { return (0, exports.dayTimeOf)(records, d); });
    var victories = winsIn(records, week);
    var lastWeek = (0, week_stats_1.weekOf)((0, exports.dayBefore)(week[0]));
    var onQuests = days.reduce(function (sum, d) { return sum + d.onQuests; }, 0);
    var elsewhere = days.reduce(function (sum, d) { return sum + d.elsewhere; }, 0);
    var moved = function (line) { return RANK[line.actual] - RANK[line.expected]; };
    return {
        days: days,
        victories: victories,
        minutes: onQuests + elsewhere,
        onQuests: onQuests,
        elsewhere: elsewhere,
        asExpected: victories.filter(function (v) { return moved(v) === 0; }).length,
        harder: victories.filter(function (v) { return moved(v) > 0; }).length,
        easier: victories.filter(function (v) { return moved(v) < 0; }).length,
        xp: victories.reduce(function (sum, v) { return sum + v.xp; }, 0),
        lastWeek: { victories: winsIn(records, lastWeek).length, minutes: (0, exports.totalOf)(lastWeek.map(function (d) { return (0, exports.dayTimeOf)(records, d); })) },
        hasAny: records.some(function (r) { return (0, week_stats_1.finishedTasks)(r.tasks).length > 0; }),
        isThisWeek: (0, week_stats_1.weekOf)(today)[0] === week[0],
    };
};
exports.chronicleOf = chronicleOf;
