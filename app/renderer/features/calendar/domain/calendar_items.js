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
exports.lanesOf = exports.minutesOn = exports.touches = exports.itemsOn = exports.isTimed = exports.firstDayOf = exports.itemsOf = exports.dueItemsOf = exports.eventItemOf = void 0;
var calendar_time_1 = require("../../../../shared/calendar_time");
var calendar_days_1 = require("./calendar_days");
var MINUTES_IN_DAY = 24 * 60;
var eventItemOf = function (event, here) {
    var when = event.when;
    if (when.kind === 'allDay')
        return { kind: 'event', key: event.id, event: event, firstDay: when.startDay, lastDay: when.endDay, start: null, end: null };
    var start = (0, calendar_time_1.wallIn)(when.start, when.zone, here);
    var end = (0, calendar_time_1.wallIn)(when.end, when.zone, here);
    var firstDay = start.slice(0, 10);
    // An event that ends at midnight is over before the next day starts.
    var endDay = end.slice(11) === '00:00' ? (0, calendar_days_1.addDays)(end.slice(0, 10), -1) : end.slice(0, 10);
    return { kind: 'event', key: event.id, event: event, firstDay: firstDay, lastDay: endDay < firstDay ? firstDay : endDay, start: start, end: end };
};
exports.eventItemOf = eventItemOf;
var questsOf = function (realm) { return __spreadArray(__spreadArray([], realm.activeQuests.map(function (quest) { return ({ quest: quest, state: 'active' }); }), true), __spreadArray(__spreadArray([], realm.ready, true), realm.sealed, true).flatMap(function (entry) { return __spreadArray([entry.quest], (entry.kind === 'saga' ? entry.chapters : []), true); }).map(function (quest) { return ({ quest: quest, state: quest.sealedBecause === null ? 'waiting' : 'sealed' }); }), true); };
var dueItemsOf = function (realm, today) {
    var seen = new Set();
    return questsOf(realm).flatMap(function (_a) {
        var quest = _a.quest, state = _a.state;
        if (quest.due === null || seen.has(quest.id))
            return [];
        seen.add(quest.id);
        return [{ kind: 'due', key: "due-".concat(quest.id), questId: quest.id, title: quest.title, state: state, day: quest.due, isOverdue: quest.due < today }];
    });
};
exports.dueItemsOf = dueItemsOf;
var itemsOf = function (events, realm, here, today) { return __spreadArray(__spreadArray([], events.map(function (event) { return (0, exports.eventItemOf)(event, here); }), true), (0, exports.dueItemsOf)(realm, today), true); };
exports.itemsOf = itemsOf;
var firstDayOf = function (item) { return (item.kind === 'due' ? item.day : item.firstDay); };
exports.firstDayOf = firstDayOf;
var lastDayOf = function (item) { return (item.kind === 'due' ? item.day : item.lastDay); };
var isTimed = function (item) { return item.kind === 'event' && item.start !== null; };
exports.isTimed = isTimed;
// All-day events first, then due dates, then the timed ones by when they start.
var rank = function (item) { return (item.kind === 'due' ? 1 : item.start === null ? 0 : 2); };
var titleOf = function (item) { return (item.kind === 'due' ? item.title : item.event.title); };
var compare = function (a, b) { var _a, _b; return rank(a) - rank(b) || (a.kind === 'event' && b.kind === 'event' ? ((_a = a.start) !== null && _a !== void 0 ? _a : a.firstDay).localeCompare((_b = b.start) !== null && _b !== void 0 ? _b : b.firstDay) : 0) || titleOf(a).localeCompare(titleOf(b)); };
var itemsOn = function (items, day) { return items.filter(function (item) { return (0, exports.firstDayOf)(item) <= day && day <= lastDayOf(item); }).sort(compare); };
exports.itemsOn = itemsOn;
var touches = function (item, first, last) { return (0, exports.firstDayOf)(item) <= last && lastDayOf(item) >= first; };
exports.touches = touches;
// Where a timed event sits on one day of the week grid, in minutes from
// midnight. A part on another day is cut at the day's edges.
var minutesOn = function (item, day) {
    var at = function (wall) { return (0, calendar_days_1.daysFrom)(day, wall.slice(0, 10)) * MINUTES_IN_DAY + Number(wall.slice(11, 13)) * 60 + Number(wall.slice(14, 16)); };
    return { from: Math.max(0, at(item.start)), to: Math.min(MINUTES_IN_DAY, at(item.end)) };
};
exports.minutesOn = minutesOn;
// The shortest a block is drawn, so a five-minute call can still be read.
var SHORTEST = 20;
var lanesOf = function (spans) {
    var sorted = __spreadArray([], spans, true).sort(function (a, b) { return a.from - b.from || b.to - a.to; });
    var placed = [];
    var run = [];
    var runEnd = -1;
    var close = function () {
        var lanes = Math.max.apply(Math, __spreadArray([1], run.map(function (p) { return p.lane + 1; }), false));
        for (var _i = 0, run_1 = run; _i < run_1.length; _i++) {
            var p = run_1[_i];
            p.lanes = lanes;
        }
        run = [];
    };
    var _loop_1 = function (span) {
        var to = Math.max(span.to, span.from + SHORTEST);
        if (span.from >= runEnd) {
            close();
            runEnd = -1;
        }
        var free = __spreadArray([], Array(run.length + 1).keys(), true).find(function (lane) { return run.every(function (p) { return p.lane !== lane || p.to <= span.from; }); });
        var one = { item: span.item, from: span.from, to: to, lane: free, lanes: 1 };
        run.push(one);
        placed.push(one);
        runEnd = Math.max(runEnd, to);
    };
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var span = sorted_1[_i];
        _loop_1(span);
    }
    close();
    return placed;
};
exports.lanesOf = lanesOf;
