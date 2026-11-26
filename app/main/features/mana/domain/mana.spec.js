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
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../../tasks/api/fixtures");
var mana_1 = require("./mana");
var TODAY = '2026-10-28';
var NOW = Date.parse('2026-10-28T12:00:00Z');
var record = function (tasks, unassigned) {
    if (unassigned === void 0) { unassigned = {}; }
    return (__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', '/p/demo')), { tasks: tasks, unassignedMinutesByDay: unassigned }));
};
var session = function (over) {
    return (__assign({ id: 's', projectPath: '/p/demo', recordFile: 'f', currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW }, over));
};
(0, vitest_1.describe)('time in a realm', function () {
    (0, vitest_1.it)('splits today into quests and elsewhere', function () {
        var _a, _b;
        var view = (0, mana_1.manaOf)(record([(0, fixtures_1.makeTask)({ id: 'x', minutesByDay: (_a = {}, _a[TODAY] = 19, _a) })], (_b = {}, _b[TODAY] = 118, _b)), TODAY);
        (0, vitest_1.expect)(view.today).toEqual({ day: TODAY, onQuests: 19, elsewhere: 118 });
    });
    (0, vitest_1.it)('compares this week with the last', function () {
        var view = (0, mana_1.manaOf)(record([(0, fixtures_1.makeTask)({ id: 'x', minutesByDay: { '2026-10-20': 100, '2026-10-26': 30 } })], { '2026-10-27': 12 }), TODAY);
        (0, vitest_1.expect)(view).toMatchObject({ weekMinutes: 42, lastWeekMinutes: 100 });
    });
    (0, vitest_1.it)('counts this week\'s victories and what is in progress', function () {
        var view = (0, mana_1.manaOf)(record([(0, fixtures_1.makeTask)({ id: 'a', state: 'done', finished: '2026-10-27T12:00:00+01:00' }), (0, fixtures_1.makeTask)({ id: 'b', state: 'done', finished: '2026-10-20T12:00:00+01:00' }), (0, fixtures_1.makeTask)({ id: 'c', state: 'current' })]), TODAY);
        (0, vitest_1.expect)(view).toMatchObject({ victories: 1, inProgress: 1 });
    });
    (0, vitest_1.it)('lists this week\'s time by quest, the most first, without quests that had none', function () {
        var _a, _b, _c;
        var view = (0, mana_1.manaOf)(record([(0, fixtures_1.makeTask)({ id: 'a', title: 'Small', minutesByDay: (_a = {}, _a[TODAY] = 5, _a) }), (0, fixtures_1.makeTask)({ id: 'b', title: 'Big', minutesByDay: (_b = {}, _b[TODAY] = 50, _b) }), (0, fixtures_1.makeTask)({ id: 'c', title: 'Old', minutesByDay: { '2026-10-01': 50 } })], (_c = {}, _c[TODAY] = 9, _c)), TODAY);
        (0, vitest_1.expect)(view.byQuest).toEqual([{ title: 'Big', minutes: 50 }, { title: 'Small', minutes: 5 }]);
        (0, vitest_1.expect)(view.elsewhere).toBe(9);
    });
    (0, vitest_1.it)('leaves the active quest out when there is none', function () {
        (0, vitest_1.expect)((0, mana_1.manaOf)(record([]), TODAY).active).toBeNull();
    });
    (0, vitest_1.it)('keeps the active quest\'s messages and files', function () {
        var _a;
        var task = (0, fixtures_1.makeTask)({ id: 'a', title: 'Boss', state: 'current', priority: 'urgent', minutesByDay: (_a = {}, _a[TODAY] = 43, _a), effort: { understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39, linesAdded: 0, linesRemoved: 0, filesTouched: 0 } });
        (0, vitest_1.expect)((0, mana_1.manaOf)(record([task]), TODAY).active).toMatchObject({ title: 'Boss', isBoss: true, minutes: 43, understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39 });
    });
});
(0, vitest_1.describe)('the allowance', function () {
    (0, vitest_1.it)('takes the newest live session that knows it', function () {
        var allowance = (0, mana_1.allowanceOf)([session({ heartbeat: NOW - 1000, allowance: { percent: 40, resetsAt: null } }), session({ heartbeat: NOW, allowance: { percent: 62, resetsAt: null } })], NOW);
        (0, vitest_1.expect)(allowance).toMatchObject({ percent: 62, isStale: false, seenAt: NOW });
    });
    (0, vitest_1.it)('falls back on the last one seen, and says it is old', function () {
        var allowance = (0, mana_1.allowanceOf)([session({ heartbeat: NOW - 600000, allowance: { percent: 62, resetsAt: null } })], NOW);
        (0, vitest_1.expect)(allowance).toMatchObject({ percent: 62, isStale: true });
    });
    (0, vitest_1.it)('has nothing to say when no session reported it', function () {
        (0, vitest_1.expect)((0, mana_1.allowanceOf)([session({ allowance: null })], NOW)).toBeNull();
    });
});
