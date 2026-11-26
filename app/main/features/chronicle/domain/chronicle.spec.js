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
var chronicle_1 = require("./chronicle");
var TODAY = '2026-10-28'; // a Wednesday
var won = function (id, day, over) {
    var _a;
    if (over === void 0) { over = {}; }
    return (0, fixtures_1.makeTask)(__assign({ id: id, state: 'done', finished: "".concat(day, "T12:00:00+01:00"), difficulty: { expected: 'medium', actual: 'medium' }, minutesByDay: (_a = {}, _a[day] = 30, _a) }, over));
};
var record = function (name, tasks, unassigned) {
    if (unassigned === void 0) { unassigned = {}; }
    return (__assign(__assign({}, (0, record_source_1.emptyRecord)(name, "/p/".concat(name))), { tasks: tasks, unassignedMinutesByDay: unassigned }));
};
(0, vitest_1.describe)('a week of the chronicle', function () {
    (0, vitest_1.it)('runs Monday to Sunday and says which week it is', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [])], TODAY, TODAY);
        (0, vitest_1.expect)(view.days.map(function (d) { return d.day; })).toEqual(['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01']);
        (0, vitest_1.expect)(view.isThisWeek).toBe(true);
    });
    (0, vitest_1.it)('splits each day into time on quests and time elsewhere', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [(0, fixtures_1.makeTask)({ id: 'x', minutesByDay: { '2026-10-27': 20 } }), won('y', '2026-10-27')], { '2026-10-27': 15 })], TODAY, TODAY);
        (0, vitest_1.expect)(view.days[1]).toEqual({ day: '2026-10-27', onQuests: 50, elsewhere: 15 });
        (0, vitest_1.expect)(view).toMatchObject({ minutes: 65, onQuests: 50, elsewhere: 15 });
    });
    (0, vitest_1.it)('adds up the realms it was given', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [won('x', '2026-10-27')]), record('b', [won('y', '2026-10-28')], { '2026-10-28': 10 })], TODAY, TODAY);
        (0, vitest_1.expect)(view.victories.map(function (v) { return v.realm; })).toEqual(['b', 'a']);
        (0, vitest_1.expect)(view.minutes).toBe(70);
    });
    (0, vitest_1.it)('counts who was as expected, harder and easier, and the XP by what it really was', function () {
        var view = (0, chronicle_1.chronicleOf)([
            record('a', [
                won('same', '2026-10-27'),
                won('up', '2026-10-27', { difficulty: { expected: 'light', actual: 'hard' } }),
                won('down', '2026-10-27', { difficulty: { expected: 'hard', actual: 'light' } }),
            ]),
        ], TODAY, TODAY);
        (0, vitest_1.expect)(view).toMatchObject({ asExpected: 1, harder: 1, easier: 1, xp: 85 });
    });
    (0, vitest_1.it)('takes a win with no actual difficulty as expected', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [won('x', '2026-10-27', { difficulty: { expected: 'hard', actual: null } })])], TODAY, TODAY);
        (0, vitest_1.expect)(view).toMatchObject({ asExpected: 1, xp: 50 });
        (0, vitest_1.expect)(view.victories[0].actual).toBe('hard');
    });
    (0, vitest_1.it)('lists the latest win first, and leaves out other weeks', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [won('old', '2026-10-20'), won('one', '2026-10-26'), won('two', '2026-10-28')])], TODAY, TODAY);
        (0, vitest_1.expect)(view.victories.map(function (v) { return v.id; })).toEqual(['two', 'one']);
    });
    (0, vitest_1.it)('reads an earlier week from any day in it', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [won('old', '2026-10-20')])], '2026-10-22', TODAY);
        (0, vitest_1.expect)(view.days[0].day).toBe('2026-10-19');
        (0, vitest_1.expect)(view.victories.map(function (v) { return v.id; })).toEqual(['old']);
        (0, vitest_1.expect)(view.isThisWeek).toBe(false);
    });
    (0, vitest_1.it)('tells of last week for the empty state', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [won('old', '2026-10-20')], { '2026-10-21': 5 })], TODAY, TODAY);
        (0, vitest_1.expect)(view.lastWeek).toEqual({ victories: 1, minutes: 35 });
        (0, vitest_1.expect)(view.hasAny).toBe(true);
    });
    (0, vitest_1.it)('a week with no time at all is all zeroes, and nothing breaks', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [])], TODAY, TODAY);
        (0, vitest_1.expect)(view).toMatchObject({ minutes: 0, onQuests: 0, elsewhere: 0, asExpected: 0, harder: 0, easier: 0, xp: 0, hasAny: false, lastWeek: { victories: 0, minutes: 0 } });
        (0, vitest_1.expect)(view.victories).toEqual([]);
    });
    (0, vitest_1.it)('a day with time and no victory still counts', function () {
        var view = (0, chronicle_1.chronicleOf)([record('a', [], { '2026-10-27': 40 })], TODAY, TODAY);
        (0, vitest_1.expect)(view).toMatchObject({ minutes: 40, elsewhere: 40, hasAny: false });
        (0, vitest_1.expect)(view.victories).toEqual([]);
    });
    (0, vitest_1.it)('keeps what a row needs for its detail', function () {
        var task = won('x', '2026-10-27', {
            title: 'Fix it',
            branch: 'task/fix',
            startCommit: 'abcdef1234',
            started: '2026-10-27T11:00:00+01:00',
            effort: { understandingMessages: 1, improvingMessages: 4, filesRead: 2, filesChanged: 16, linesAdded: 958, linesRemoved: 799, filesTouched: 27 },
        });
        (0, vitest_1.expect)((0, chronicle_1.chronicleOf)([record('a', [task])], TODAY, TODAY).victories[0]).toMatchObject({
            title: 'Fix it',
            branch: 'task/fix',
            startCommit: 'abcdef1234',
            started: '2026-10-27T11:00:00+01:00',
            improvingMessages: 4,
            filesRead: 2,
            filesChanged: 16,
            linesAdded: 958,
            linesRemoved: 799,
            filesTouched: 27,
            minutes: 30,
        });
    });
});
