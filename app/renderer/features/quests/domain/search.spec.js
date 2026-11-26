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
var test_support_1 = require("../../../test_support");
var board_1 = require("./board");
var search_1 = require("./search");
var one = function (id, over) {
    if (over === void 0) { over = {}; }
    return ({ kind: 'quest', quest: (0, test_support_1.quest)(__assign({ id: id, title: id }, over)) });
};
var saga = function (id, chapters, over) {
    if (over === void 0) { over = {}; }
    return ({
        kind: 'saga',
        quest: (0, test_support_1.quest)(__assign({ id: id, title: id }, over)),
        chapters: chapters.map(function (title) { return (0, test_support_1.quest)({ id: title, title: title, parentId: id }); }),
        progress: { done: 0, total: chapters.length, current: 0, blocked: 0 },
        hasStar: false,
    });
};
var board = function (over) { return (__assign(__assign(__assign({}, search_1.EMPTY_BOARD), over), { filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), over.filters) })); };
var ids = function (entries) { return (0, board_1.rowsOf)(entries).map(function (row) { return row.quest.id; }); };
(0, vitest_1.describe)('search', function () {
    (0, vitest_1.it)('leaves the board alone with nothing asked', function () {
        var entries = [one('a'), one('b')];
        (0, vitest_1.expect)((0, search_1.filterEntries)(entries, search_1.EMPTY_BOARD, null, null)).toEqual(entries);
        (0, vitest_1.expect)((0, search_1.isFiltering)(search_1.EMPTY_BOARD)).toBe(false);
    });
    (0, vitest_1.it)('matches a title, whatever the case', function () {
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)([one('Fix the docs'), one('Other')], board({ search: 'FIX' }), null, null))).toEqual(['Fix the docs']);
    });
    (0, vitest_1.it)('matches a branch', function () {
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)([one('a', { branch: 'task/fix-it' }), one('b')], board({ search: 'fix-it' }), null, null))).toEqual(['a']);
    });
    (0, vitest_1.it)('ignores spaces around what was typed', function () {
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)([one('Fix')], board({ search: '  fix ' }), null, null))).toEqual(['Fix']);
        (0, vitest_1.expect)((0, search_1.isFiltering)(board({ search: '   ' }))).toBe(false);
    });
    (0, vitest_1.it)('keeps a saga on screen for a chapter that matches, without its other chapters', function () {
        var filtered = (0, search_1.filterEntries)([saga('The saga', ['Needle', 'Hay'])], board({ search: 'needle' }), null, null);
        (0, vitest_1.expect)(ids(filtered)).toEqual(['The saga', 'Needle']);
    });
    (0, vitest_1.it)('keeps every chapter when the saga itself matches', function () {
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)([saga('Needle saga', ['One', 'Two'])], board({ search: 'needle' }), null, null))).toEqual(['Needle saga', 'One', 'Two']);
    });
    (0, vitest_1.it)('drops a saga with no match in it', function () {
        (0, vitest_1.expect)((0, search_1.filterEntries)([saga('The saga', ['One'])], board({ search: 'needle' }), null, null)).toEqual([]);
    });
});
(0, vitest_1.describe)('filters', function () {
    (0, vitest_1.it)('filters by priority and difficulty, and they combine', function () {
        var entries = [one('a', { priority: 'high', difficulty: 'hard' }), one('b', { priority: 'high', difficulty: 'light' }), one('c', { priority: 'low', difficulty: 'hard' })];
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)(entries, board({ filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { priorities: ['high'] }) }), null, null))).toEqual(['a', 'b']);
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)(entries, board({ filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { priorities: ['high'], difficulties: ['hard'] }) }), null, null))).toEqual(['a']);
    });
    (0, vitest_1.it)('combines with the search', function () {
        var entries = [one('Fix a', { priority: 'high' }), one('Fix b', { priority: 'low' })];
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)(entries, board({ search: 'fix', filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { priorities: ['low'] }) }), null, null))).toEqual(['Fix b']);
    });
    (0, vitest_1.it)('keeps to the active saga', function () {
        var entries = [saga('The saga', ['One']), one('Other')];
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)(entries, board({ filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { onlySaga: true }) }), 'The saga', null))).toEqual(['The saga', 'One']);
    });
    (0, vitest_1.it)('shows nothing for Only the active saga with no saga active', function () {
        (0, vitest_1.expect)((0, search_1.filterEntries)([one('a')], board({ filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { onlySaga: true }) }), null, null)).toEqual([]);
    });
    (0, vitest_1.it)('keeps what fits the time', function () {
        var entries = [one('short', { estimateMinutes: 30 }), one('long', { estimateMinutes: 240 })];
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)(entries, board({ filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { fitsTime: true }) }), null, 60))).toEqual(['short']);
    });
    (0, vitest_1.it)('ignores Fits Time I have with no time set', function () {
        (0, vitest_1.expect)(ids((0, search_1.filterEntries)([one('a')], board({ filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { fitsTime: true }) }), null, null))).toEqual(['a']);
    });
    (0, vitest_1.it)('says when any is set', function () {
        (0, vitest_1.expect)((0, search_1.hasFilters)(search_1.EMPTY_BOARD.filters)).toBe(false);
        (0, vitest_1.expect)((0, search_1.hasFilters)(__assign(__assign({}, search_1.EMPTY_BOARD.filters), { sections: ['sealed'] }))).toBe(true);
    });
    (0, vitest_1.it)('filters 500 quests within 50 ms', function () {
        var entries = Array.from({ length: 500 }, function (_, i) { return one("Quest number ".concat(i), { branch: "task/quest-".concat(i) }); });
        var started = performance.now();
        var found = (0, search_1.filterEntries)(entries, board({ search: 'number 49', filters: __assign(__assign({}, search_1.EMPTY_BOARD.filters), { priorities: ['mid'] }) }), null, null);
        (0, vitest_1.expect)(performance.now() - started).toBeLessThan(50);
        (0, vitest_1.expect)(found.length).toBe(11);
    });
});
(0, vitest_1.describe)('marking the match', function () {
    (0, vitest_1.it)('splits a title around what was searched for', function () {
        (0, vitest_1.expect)((0, search_1.partsOf)('Fix cut-off diagrams', 'diagrams')).toEqual([
            { text: 'Fix cut-off ', isMatch: false },
            { text: 'diagrams', isMatch: true },
        ]);
    });
    (0, vitest_1.it)('keeps the title\'s own case', function () {
        (0, vitest_1.expect)((0, search_1.partsOf)('DIAGRAMS', 'diagrams')).toEqual([{ text: 'DIAGRAMS', isMatch: true }]);
    });
    (0, vitest_1.it)('leaves a title alone with nothing searched for, or no match', function () {
        (0, vitest_1.expect)((0, search_1.partsOf)('Title', ' ')).toEqual([{ text: 'Title', isMatch: false }]);
        (0, vitest_1.expect)((0, search_1.partsOf)('Title', 'other')).toEqual([{ text: 'Title', isMatch: false }]);
    });
    (0, vitest_1.it)('takes what was typed as plain text, not a pattern', function () {
        (0, vitest_1.expect)((0, search_1.partsOf)('a.b', '.')).toEqual([
            { text: 'a', isMatch: false },
            { text: '.', isMatch: true },
            { text: 'b', isMatch: false },
        ]);
    });
});
