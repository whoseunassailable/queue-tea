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
var record_source_1 = require("../../../../../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../../../tasks/api/fixtures");
var victory_1 = require("./victory");
var NOW = Date.parse('2026-10-27T12:00:00Z');
var PATH = '/p/demo';
var won = function (over) {
    return (0, fixtures_1.makeTask)(__assign({ state: 'done', finished: '2026-10-27T12:00:00+01:00', difficulty: { expected: 'medium', actual: 'medium' } }, over));
};
var record = function (tasks, path) {
    if (path === void 0) { path = PATH; }
    return (__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', path)), { tasks: tasks }));
};
(0, vitest_1.describe)('what a win earned', function () {
    (0, vitest_1.it)('counts the XP and gold by the difficulty chosen, not the one expected', function () {
        var task = won({ id: 'one', title: 'Fix it', difficulty: { expected: 'light', actual: 'hard' } });
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([task])], PATH, 'one', 60, NOW)).toMatchObject({ title: 'Fix it', xp: 50, gold: 50, actual: 'hard', expected: 'light', hoard: 50 });
    });
    (0, vitest_1.it)('reports where the bar stands after the win', function () {
        var task = won({ id: 'one', difficulty: { expected: 'hard', actual: 'hard' } });
        var other = won({ id: 'old', difficulty: { expected: 'hard', actual: 'hard' } });
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([task, other])], PATH, 'one', 60, NOW)).toMatchObject({ level: 2, didLevelUp: true, xpIntoLevel: 0, xpToNextLevel: 200, nextLevelAt: 300, stage: 'hatchling' });
    });
    (0, vitest_1.it)('stays on the level when the win does not reach the next', function () {
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([won({ id: 'one' })])], PATH, 'one', 60, NOW)).toMatchObject({ level: 1, didLevelUp: false, xpIntoLevel: 25, xpToNextLevel: 100 });
    });
    (0, vitest_1.it)('names a badge earned by this win', function () {
        var victory = (0, victory_1.victoryOf)([record([won({ id: 'one' })])], PATH, 'one', 60, NOW);
        (0, vitest_1.expect)(victory.newBadges).toContain('firstFlame');
    });
    (0, vitest_1.it)('leaves out a badge earned before', function () {
        var older = won({ id: 'old', finished: '2026-10-20T12:00:00+01:00' });
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([older, won({ id: 'one' })])], PATH, 'one', 60, NOW).newBadges).not.toContain('firstFlame');
    });
    (0, vitest_1.it)('counts every realm in the hoard', function () {
        var elsewhere = record([won({ id: 'far', finished: '2026-10-20T12:00:00+01:00' })], '/p/other');
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([won({ id: 'one' })]), elsewhere], PATH, 'one', 60, NOW).hoard).toBe(50);
    });
    (0, vitest_1.it)('calls an urgent quest a boss', function () {
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([won({ id: 'one', priority: 'urgent' })])], PATH, 'one', 60, NOW).kind).toBe('boss');
    });
    (0, vitest_1.it)('calls the win that ends a saga a saga won', function () {
        var saga = won({ id: 'saga' });
        var chapter = won({ id: 'one', parentId: 'saga' });
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([saga, chapter])], PATH, 'one', 60, NOW).kind).toBe('saga');
    });
    (0, vitest_1.it)('keeps a chapter a quest while the saga goes on', function () {
        var saga = (0, fixtures_1.makeTask)({ id: 'saga' });
        var chapter = won({ id: 'one', parentId: 'saga' });
        (0, vitest_1.expect)((0, victory_1.victoryOf)([record([saga, chapter])], PATH, 'one', 60, NOW).kind).toBe('quest');
    });
    (0, vitest_1.it)('throws when the win is not in the records, for the caller to report', function () {
        (0, vitest_1.expect)(function () { return (0, victory_1.victoryOf)([record([])], PATH, 'one', 60, NOW); }).toThrow();
    });
});
