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
var testing_1 = require("claude-code/testing");
var ranking_1 = require("../../../../hooks/shared/backlog/domain/services/ranking");
var helpers_1 = require("../../../helpers");
var at = function (minute) { return "2026-10-21T10:".concat(String(minute).padStart(2, '0'), ":00+02:00"); };
var titles = function (record, budget) {
    if (budget === void 0) { budget = null; }
    return (0, ranking_1.rankBacklog)(record, budget).map(function (r) { return r.task.title; });
};
(0, testing_1.test)('a task waiting for an unfinished one is blocked; a done or removed blocker stops blocking', function () {
    var a = (0, helpers_1.makeTask)({ title: 'A' });
    var b = (0, helpers_1.makeTask)({ title: 'B', blockedBy: [a.id] });
    (0, testing_1.expect)((0, ranking_1.isBlocked)(b, [a, b])).toBe(true);
    (0, testing_1.expect)((0, ranking_1.blockedText)(b, [a, b])).toBe('waits for A');
    (0, testing_1.expect)((0, ranking_1.isBlocked)(b, [__assign(__assign({}, a), { state: 'done' }), b])).toBe(false);
    (0, testing_1.expect)((0, ranking_1.isBlocked)(b, [__assign(__assign({}, a), { state: 'removed' }), b])).toBe(false);
});
(0, testing_1.test)('a typed reason blocks until it is cleared', function () {
    var a = (0, helpers_1.makeTask)({ title: 'A', blockedReason: 'waiting for the API key' });
    (0, testing_1.expect)((0, ranking_1.isBlocked)(a, [a])).toBe(true);
    (0, testing_1.expect)((0, ranking_1.blockedText)(a, [a])).toBe('waiting for the API key');
    (0, testing_1.expect)((0, ranking_1.blockedTasks)([a]).map(function (t) { return t.title; })).toEqual(['A']);
});
(0, testing_1.test)('a wait that would close a loop is found, and is not offered', function () {
    var a = (0, helpers_1.makeTask)({ title: 'A' });
    var b = (0, helpers_1.makeTask)({ title: 'B', blockedBy: [a.id] });
    var c = (0, helpers_1.makeTask)({ title: 'C', blockedBy: [b.id] });
    var tasks = [a, b, c];
    (0, testing_1.expect)((0, ranking_1.wouldLoop)(tasks, a.id, c.id)).toBe(true);
    (0, testing_1.expect)((0, ranking_1.wouldLoop)(tasks, c.id, a.id)).toBe(false);
    (0, testing_1.expect)((0, ranking_1.canWaitFor)(tasks, a.id).map(function (t) { return t.title; })).toEqual([]);
    (0, testing_1.expect)((0, ranking_1.canWaitFor)(tasks, c.id).map(function (t) { return t.title; })).toEqual(['A']);
});
(0, testing_1.test)('a blocked task is never suggested', function () {
    var a = (0, helpers_1.makeTask)({ title: 'A', priority: 'low', created: at(2) });
    var b = (0, helpers_1.makeTask)({ title: 'B', priority: 'urgent', created: at(1), blockedBy: [a.id] });
    (0, testing_1.expect)(titles({ tasks: [a, b], playNext: null })).toEqual(['A']);
    (0, testing_1.expect)((0, ranking_1.suggest)({ tasks: [b, __assign(__assign({}, a), { blockedReason: 'later' })], playNext: null }, null)).toBe(null);
});
(0, testing_1.test)('a task takes the highest priority of the tasks waiting for it', function () {
    var a = (0, helpers_1.makeTask)({ title: 'A', priority: 'low', created: at(1) });
    var b = (0, helpers_1.makeTask)({ title: 'B', priority: 'urgent', blockedBy: [a.id] });
    var c = (0, helpers_1.makeTask)({ title: 'C', priority: 'high', created: at(0) });
    (0, testing_1.expect)((0, ranking_1.effectivePriority)(a, [a, b, c])).toBe('urgent');
    (0, testing_1.expect)(titles({ tasks: [a, b, c], playNext: null })).toEqual(['A', 'C']);
    (0, testing_1.expect)((0, ranking_1.rankBacklog)({ tasks: [a, b, c], playNext: null }, null)[0].why).toBe('urgent, from what waits for it · unblocks B');
});
(0, testing_1.test)('same priority: the one that unblocks more first, then the oldest', function () {
    var a = (0, helpers_1.makeTask)({ title: 'A', created: at(1) });
    var b = (0, helpers_1.makeTask)({ title: 'B', created: at(2) });
    var waits = (0, helpers_1.makeTask)({ title: 'W', blockedBy: [b.id] });
    (0, testing_1.expect)(titles({ tasks: [a, b, waits], playNext: null })).toEqual(['B', 'A']);
});
(0, testing_1.test)('Play next comes before every priority', function () {
    var a = (0, helpers_1.makeTask)({ title: 'A', priority: 'urgent' });
    var b = (0, helpers_1.makeTask)({ title: 'B', priority: 'low' });
    var ranked = (0, ranking_1.rankBacklog)({ tasks: [a, b], playNext: b.id }, null);
    (0, testing_1.expect)(ranked.map(function (r) { return r.task.title; })).toEqual(['B', 'A']);
    (0, testing_1.expect)(ranked[0].why).toBe('you chose Play next');
});
(0, testing_1.test)('with a time set, what fits comes first; with nothing fitting, the shortest', function () {
    var refactor = (0, helpers_1.makeTask)({ title: 'Refactor', priority: 'high', difficulty: { expected: 'hard', actual: null } });
    var fix = (0, helpers_1.makeTask)({ title: 'Fix', priority: 'mid', difficulty: { expected: 'light', actual: null } });
    var record = { tasks: [refactor, fix], playNext: null };
    (0, testing_1.expect)(titles(record)).toEqual(['Refactor', 'Fix']);
    (0, testing_1.expect)(titles(record, 30)).toEqual(['Fix', 'Refactor']);
    (0, testing_1.expect)((0, ranking_1.rankBacklog)(record, 30)[0].why).toBe('mid · fits 30m');
    (0, testing_1.expect)((0, ranking_1.rankBacklog)({ tasks: [refactor], playNext: null }, 30)[0].why).toBe('high · nothing fits 30m; the shortest');
});
(0, testing_1.test)('the estimate: defaults until three tasks of a difficulty are done, then their middle value, less time so far', function () {
    var done = function (minutes) {
        return (0, helpers_1.makeTask)({ state: 'done', difficulty: { expected: 'light', actual: 'light' }, minutesByDay: { '2026-10-20': minutes } });
    };
    var light = (0, helpers_1.makeTask)({ difficulty: { expected: 'light', actual: null } });
    (0, testing_1.expect)((0, ranking_1.typicalMinutes)([light], 'light')).toBe(30);
    (0, testing_1.expect)((0, ranking_1.typicalMinutes)([light], 'medium')).toBe(90);
    (0, testing_1.expect)((0, ranking_1.typicalMinutes)([light], 'hard')).toBe(240);
    (0, testing_1.expect)((0, ranking_1.typicalMinutes)([done(20), done(50), done(12), light], 'light')).toBe(20);
    (0, testing_1.expect)((0, ranking_1.typicalMinutes)([done(20), done(50), done(12), done(40), light], 'light')).toBe(30);
    (0, testing_1.expect)((0, ranking_1.estimateMinutes)(__assign(__assign({}, light), { minutesByDay: { '2026-10-21': 25 } }), [light])).toBe(10);
    (0, testing_1.expect)((0, ranking_1.rankBacklog)({ tasks: [light], playNext: null }, null)[0].isShort).toBe(true);
});
(0, testing_1.test)('Time I have steps any, 30m, 1h, 2h and round again', function () {
    (0, testing_1.expect)((0, ranking_1.nextBudget)(null)).toBe(30);
    (0, testing_1.expect)((0, ranking_1.nextBudget)(30)).toBe(60);
    (0, testing_1.expect)((0, ranking_1.nextBudget)(60)).toBe(120);
    (0, testing_1.expect)((0, ranking_1.nextBudget)(120)).toBe(null);
});
