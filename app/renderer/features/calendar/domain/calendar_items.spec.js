"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_support_1 = require("../../../test_support");
var calendar_items_1 = require("./calendar_items");
var HERE = 'America/Chicago';
var timed = function (id, start, end, zone) {
    if (zone === void 0) { zone = HERE; }
    return ({ id: id, title: id, when: { kind: 'timed', start: start, end: end, zone: zone }, place: null, notes: null });
};
var allDay = function (id, startDay, endDay) { return ({ id: id, title: id, when: { kind: 'allDay', startDay: startDay, endDay: endDay }, place: null, notes: null }); };
var realmOf = function (over) {
    if (over === void 0) { over = {}; }
    var view = (0, test_support_1.projectView)('demo-abc123', over);
    if (view.kind !== 'readable')
        throw new Error('readable');
    return view;
};
var keys = function (items) { return items.map(function (item) { return item.key; }); };
(0, vitest_1.describe)('events on the Mac’s clock', function () {
    (0, vitest_1.it)('shows a call made in Lisbon at its hour in Chicago', function () {
        var item = (0, calendar_items_1.eventItemOf)(timed('call', '2026-11-25T09:00', '2026-11-25T10:00', 'Europe/Lisbon'), HERE);
        (0, vitest_1.expect)(item).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-25', start: '2026-11-25T03:00', end: '2026-11-25T04:00' });
    });
    (0, vitest_1.it)('moves a morning call in Tokyo onto the evening before in Chicago', function () {
        var item = (0, calendar_items_1.eventItemOf)(timed('standup', '2026-11-26T09:00', '2026-11-26T09:30', 'Asia/Tokyo'), HERE);
        (0, vitest_1.expect)(item).toMatchObject({ firstDay: '2026-11-25', start: '2026-11-25T18:00' });
    });
    (0, vitest_1.it)('keeps an all-day event on its own days, whatever the zone', function () {
        (0, vitest_1.expect)((0, calendar_items_1.eventItemOf)(allDay('trip', '2026-12-03', '2026-12-06'), 'Asia/Tokyo')).toMatchObject({ firstDay: '2026-12-03', lastDay: '2026-12-06', start: null });
    });
    (0, vitest_1.it)('puts an event that ends at midnight on its one day only, and one past midnight on both', function () {
        (0, vitest_1.expect)((0, calendar_items_1.eventItemOf)(timed('late', '2026-11-25T22:00', '2026-11-26T00:00'), HERE)).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-25' });
        (0, vitest_1.expect)((0, calendar_items_1.eventItemOf)(timed('later', '2026-11-25T22:00', '2026-11-26T01:00'), HERE)).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-26' });
    });
    (0, vitest_1.it)('cuts a part on another day at the edges of the day', function () {
        var item = { start: '2026-11-25T22:00', end: '2026-11-26T01:30' };
        (0, vitest_1.expect)((0, calendar_items_1.minutesOn)(item, '2026-11-25')).toEqual({ from: 22 * 60, to: 24 * 60 });
        (0, vitest_1.expect)((0, calendar_items_1.minutesOn)(item, '2026-11-26')).toEqual({ from: 0, to: 90 });
    });
});
(0, vitest_1.describe)('due dates', function () {
    (0, vitest_1.it)('takes every quest in play with a due date: on the board, in a saga, sealed and active', function () {
        var realm = realmOf({
            ready: [
                { kind: 'quest', quest: (0, test_support_1.quest)({ id: 'a', due: '2026-12-01' }) },
                { kind: 'quest', quest: (0, test_support_1.quest)({ id: 'none' }) },
                { kind: 'saga', quest: (0, test_support_1.quest)({ id: 'saga', due: '2026-12-10' }), chapters: [(0, test_support_1.quest)({ id: 'ch', due: '2026-12-02' }), (0, test_support_1.quest)({ id: 'ch-sealed', due: '2026-12-03', sealedBecause: 'Waits for ch' })], progress: { done: 0, total: 2, current: 0, blocked: 1 }, hasStar: false },
            ],
            sealed: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 's', due: '2026-11-20', sealedBecause: 'Waits for a' }) }],
            activeQuests: [(0, test_support_1.activeQuest)({ id: 'x', due: '2026-11-24' })],
        });
        var items = (0, calendar_items_1.dueItemsOf)(realm, '2026-11-25');
        (0, vitest_1.expect)(items.map(function (item) { return item.kind === 'due' && [item.questId, item.state, item.isOverdue]; })).toEqual([
            ['x', 'active', true],
            ['a', 'waiting', false],
            ['saga', 'waiting', false],
            ['ch', 'waiting', false],
            ['ch-sealed', 'sealed', false],
            ['s', 'sealed', true],
        ]);
    });
    (0, vitest_1.it)('is not overdue on the day itself', function () {
        var realm = realmOf({ ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'a', due: '2026-11-25' }) }] });
        (0, vitest_1.expect)((0, calendar_items_1.dueItemsOf)(realm, '2026-11-25')[0]).toMatchObject({ isOverdue: false });
    });
});
(0, vitest_1.describe)('a day’s items', function () {
    (0, vitest_1.it)('lists all-day events, then due dates, then timed ones by their start', function () {
        var realm = realmOf({ ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'ship', due: '2026-11-25' }) }] });
        var items = (0, calendar_items_1.itemsOf)([timed('noon', '2026-11-25T12:00', '2026-11-25T13:00'), timed('nine', '2026-11-25T09:00', '2026-11-25T09:30'), allDay('trip', '2026-11-24', '2026-11-26')], realm, HERE, '2026-11-25');
        (0, vitest_1.expect)(keys((0, calendar_items_1.itemsOn)(items, '2026-11-25'))).toEqual(['trip', 'due-ship', 'nine', 'noon']);
        (0, vitest_1.expect)(keys((0, calendar_items_1.itemsOn)(items, '2026-11-26'))).toEqual(['trip']);
    });
});
(0, vitest_1.describe)('lanes', function () {
    var lanes = function (spans) { return (0, calendar_items_1.lanesOf)(spans.map(function (_a) {
        var item = _a[0], from = _a[1], to = _a[2];
        return ({ item: item, from: from, to: to });
    })).map(function (p) { return [p.item, p.lane, p.lanes]; }); };
    (0, vitest_1.it)('gives events that overlap a lane each, and leaves the rest full width', function () {
        (0, vitest_1.expect)(lanes([['a', 540, 600], ['b', 570, 630], ['c', 700, 760]])).toEqual([
            ['a', 0, 2],
            ['b', 1, 2],
            ['c', 0, 1],
        ]);
    });
    (0, vitest_1.it)('reuses a lane once its event is over', function () {
        (0, vitest_1.expect)(lanes([['a', 540, 660], ['b', 540, 580], ['c', 600, 640]])).toEqual([
            ['a', 0, 2],
            ['b', 1, 2],
            ['c', 1, 2],
        ]);
    });
    (0, vitest_1.it)('draws a five-minute call tall enough to read, and lanes it by that size', function () {
        var placed = (0, calendar_items_1.lanesOf)([{ item: 'quick', from: 540, to: 545 }, { item: 'next', from: 550, to: 600 }]);
        (0, vitest_1.expect)(placed[0]).toMatchObject({ to: 560, lanes: 2 });
    });
});
