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
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowanceOf = exports.manaOf = void 0;
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var week_stats_1 = require("../../../../../hooks/shared/time/domain/services/week_stats");
var queue_rules_1 = require("../../../../../hooks/shared/records/domain/services/queue_rules");
var chronicle_1 = require("../../chronicle/domain/chronicle");
var minutesIn = function (task, days) { return days.reduce(function (sum, d) { var _a; return sum + ((_a = task.minutesByDay[d]) !== null && _a !== void 0 ? _a : 0); }, 0); };
var activeOf = function (task) { return ({
    title: task.title,
    isBoss: task.priority === 'urgent',
    minutes: Object.values(task.minutesByDay).reduce(function (sum, m) { return sum + m; }, 0),
    understandingMessages: task.effort.understandingMessages,
    improvingMessages: task.effort.improvingMessages,
    filesRead: task.effort.filesRead,
    filesChanged: task.effort.filesChanged,
}); };
var manaOf = function (record, today) {
    var week = (0, week_stats_1.weekOf)(today);
    var lastWeek = (0, week_stats_1.weekOf)((0, chronicle_1.dayBefore)(week[0]));
    var days = week.map(function (day) { return (0, chronicle_1.dayTimeOf)([record], day); });
    var current = (0, queue_rules_1.currentTask)(record.tasks);
    return {
        today: (0, chronicle_1.dayTimeOf)([record], today),
        days: days,
        weekMinutes: (0, chronicle_1.totalOf)(days),
        lastWeekMinutes: (0, chronicle_1.totalOf)(lastWeek.map(function (day) { return (0, chronicle_1.dayTimeOf)([record], day); })),
        victories: (0, week_stats_1.doneThisWeek)(record.tasks, today).length,
        inProgress: record.tasks.filter(function (t) { return t.state === 'current'; }).length,
        active: current === null ? null : activeOf(current),
        byQuest: record.tasks
            .map(function (task) { return ({ title: task.title, minutes: minutesIn(task, week) }); })
            .filter(function (row) { return row.minutes > 0; })
            .sort(function (a, b) { return b.minutes - a.minutes; }),
        elsewhere: days.reduce(function (sum, d) { return sum + d.elsewhere; }, 0),
    };
};
exports.manaOf = manaOf;
// The newest word on the allowance: a live session's, or the last one seen.
var allowanceOf = function (sessions, nowMs) {
    var newest = sessions.filter(function (s) { return s.allowance !== null; }).sort(function (a, b) { return b.heartbeat - a.heartbeat; })[0];
    if ((newest === null || newest === void 0 ? void 0 : newest.allowance) == null)
        return null;
    return __assign(__assign({}, newest.allowance), { seenAt: newest.heartbeat, isStale: !(0, session_rules_1.isFresh)(newest, nowMs) });
};
exports.allowanceOf = allowanceOf;
