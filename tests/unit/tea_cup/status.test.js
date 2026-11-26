"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var time_1 = require("../../../hooks/shared/time/domain/services/time");
var status_line_1 = require("../../../hooks/features/tea_cup/presentation/widgets/status_line");
var week_stats_1 = require("../../../hooks/shared/time/domain/services/week_stats");
var helpers_1 = require("../../helpers");
(0, testing_1.test)('statusText', function () {
    var task = (0, helpers_1.makeTask)({ title: 'Retry button' });
    (0, testing_1.expect)((0, status_line_1.statusText)(task, 72, { percent: 62.4, resetsAt: null }, true)).toBe('Queue-tea: checking your message…');
    (0, testing_1.expect)((0, status_line_1.statusText)(task, 72, { percent: 62.4, resetsAt: null }, false)).toBe('Queue-tea: Retry button · 1h 12m · 5h 62%');
    (0, testing_1.expect)((0, status_line_1.statusText)(task, 72, null, false)).toBe('Queue-tea: Retry button · 1h 12m');
    (0, testing_1.expect)((0, status_line_1.statusText)(null, 0, null, false)).toBeUndefined();
});
(0, testing_1.test)('weekLine counts this week from Monday only', function () {
    // 2026-10-21 is a Wednesday; its week starts Monday 2026-10-19.
    var tasks = [
        (0, helpers_1.makeTask)({ state: 'done', finished: '2026-10-20T10:00:00+02:00', minutesByDay: { '2026-10-20': 100 } }),
        (0, helpers_1.makeTask)({ state: 'done', finished: '2026-10-21T10:00:00+02:00', minutesByDay: { '2026-10-21': 60 } }),
        (0, helpers_1.makeTask)({ state: 'done', finished: '2026-10-18T10:00:00+02:00', minutesByDay: { '2026-10-18': 500 } }),
        (0, helpers_1.makeTask)({ state: 'current', minutesByDay: { '2026-10-18': 30, '2026-10-19': 40 } }),
    ];
    (0, testing_1.expect)((0, week_stats_1.weekLine)(tasks, { '2026-10-19': 20, '2026-10-12': 99 }, '2026-10-21')).toBe('2 done · 3h 40m');
});
(0, testing_1.test)('weekLine on a Monday and a Sunday', function () {
    var done = (0, helpers_1.makeTask)({ state: 'done', finished: '2026-10-19T08:00:00+02:00', minutesByDay: { '2026-10-19': 30 } });
    (0, testing_1.expect)((0, week_stats_1.weekLine)([done], {}, '2026-10-19')).toBe('1 done · 30m');
    (0, testing_1.expect)((0, week_stats_1.weekLine)([done], {}, '2026-10-25')).toBe('1 done · 30m');
    (0, testing_1.expect)((0, week_stats_1.weekLine)([done], {}, '2026-10-26')).toBe('0 done · 0m');
});
(0, testing_1.test)('formatAge', function () {
    var MIN = 60000;
    (0, testing_1.expect)((0, time_1.formatAge)(5 * MIN)).toBe('5m');
    (0, testing_1.expect)((0, time_1.formatAge)(3 * 60 * MIN)).toBe('3h');
    (0, testing_1.expect)((0, time_1.formatAge)(50 * 60 * MIN)).toBe('2d');
    (0, testing_1.expect)((0, time_1.formatAge)(-5)).toBe('0m');
});
