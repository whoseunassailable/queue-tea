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
exports.withoutEvent = exports.withEvent = exports.calendarText = exports.parseCalendar = exports.eventInputOf = exports.isEventId = exports.emptyCalendar = void 0;
var calendar_1 = require("../../../../shared/calendar");
var calendar_time_1 = require("../../../../shared/calendar_time");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var DAY_MS = 86400000;
var EVENT_ID = /^e-[a-z0-9]{1,40}$/;
var emptyCalendar = function () { return ({ events: [], kept: [] }); };
exports.emptyCalendar = emptyCalendar;
var isEventId = function (value) { return typeof value === 'string' && EVENT_ID.test(value); };
exports.isEventId = isEventId;
var textOf = function (value, limit, tooLong) {
    if (value === null || value === undefined)
        return null;
    if (typeof value !== 'string')
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    var text = value.trim();
    if (text.length > limit)
        throw new reply_1.Refusal(tooLong);
    return text === '' ? null : text;
};
var titleOf = function (value) {
    var title = typeof value === 'string' ? value.trim().replace(/[\r\n]+/g, ' ') : '';
    if (title === '')
        throw new reply_1.Refusal(messages_1.MESSAGES.titleRequired);
    if (title.length > calendar_1.CALENDAR_LIMITS.title)
        throw new reply_1.Refusal(messages_1.MESSAGES.titleTooLong);
    return title;
};
var daysBetween = function (from, to) { return (Date.parse("".concat(to, "T00:00:00Z")) - Date.parse("".concat(from, "T00:00:00Z"))) / DAY_MS; };
var whenOf = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    if (v.kind === 'allDay') {
        if (!(0, calendar_1.isDay)(v.startDay) || !(0, calendar_1.isDay)(v.endDay))
            throw new reply_1.Refusal(messages_1.MESSAGES.eventDayBad);
        var span = daysBetween(v.startDay, v.endDay);
        if (span < 0)
            throw new reply_1.Refusal(messages_1.MESSAGES.eventEndsFirst);
        if (span >= calendar_1.CALENDAR_LIMITS.spanDays)
            throw new reply_1.Refusal(messages_1.MESSAGES.eventTooLong);
        return { kind: 'allDay', startDay: v.startDay, endDay: v.endDay };
    }
    if (v.kind === 'timed') {
        if (!(0, calendar_1.isWallTime)(v.start) || !(0, calendar_1.isWallTime)(v.end))
            throw new reply_1.Refusal(messages_1.MESSAGES.eventTimeBad);
        var zone = (0, calendar_time_1.zoneNameOf)(v.zone);
        if (zone === null)
            throw new reply_1.Refusal(messages_1.MESSAGES.eventZoneBad);
        var length_1 = (0, calendar_time_1.instantOf)(v.end, zone) - (0, calendar_time_1.instantOf)(v.start, zone);
        if (length_1 <= 0)
            throw new reply_1.Refusal(messages_1.MESSAGES.eventEndsFirst);
        if (length_1 > calendar_1.CALENDAR_LIMITS.spanDays * DAY_MS)
            throw new reply_1.Refusal(messages_1.MESSAGES.eventTooLong);
        return { kind: 'timed', start: v.start, end: v.end, zone: zone };
    }
    throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
};
// An event as the window sent it, checked again here: the sheet's checks are
// for the person typing, these are for the file.
var eventInputOf = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    return {
        title: titleOf(v.title),
        when: whenOf(v.when),
        place: textOf(v.place, calendar_1.CALENDAR_LIMITS.place, messages_1.MESSAGES.eventPlaceLong),
        notes: textOf(v.notes, calendar_1.CALENDAR_LIMITS.notes, messages_1.MESSAGES.eventNotesLong),
    };
};
exports.eventInputOf = eventInputOf;
var eventOf = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    if (!(0, exports.isEventId)(v.id))
        return null;
    try {
        return __assign({ id: v.id }, (0, exports.eventInputOf)(v));
    }
    catch (_a) {
        return null;
    }
};
// Calendar.json as Queue-tea reads it: unreadable when it isn't a calendar at
// all, newer when a later Queue-tea wrote it. Either way it's left as it is.
var parseCalendar = function (text) {
    var parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (_a) {
        return 'unreadable';
    }
    var file = (parsed !== null && parsed !== void 0 ? parsed : {});
    if (typeof parsed !== 'object' || Array.isArray(parsed) || !Number.isInteger(file.format) || !Array.isArray(file.events))
        return 'unreadable';
    if (file.format > calendar_1.CALENDAR_FORMAT)
        return 'newer';
    if (file.format < 1)
        return 'unreadable';
    var events = [];
    var kept = [];
    var ids = new Set();
    for (var _i = 0, _b = file.events; _i < _b.length; _i++) {
        var entry = _b[_i];
        var event_1 = eventOf(entry);
        // A second event with an id already read is kept as it came, not lost.
        if (event_1 === null || ids.has(event_1.id))
            kept.push(entry);
        else {
            ids.add(event_1.id);
            events.push(event_1);
        }
    }
    return { events: events, kept: kept };
};
exports.parseCalendar = parseCalendar;
var calendarText = function (file) { return "".concat(JSON.stringify({ format: calendar_1.CALENDAR_FORMAT, events: __spreadArray(__spreadArray([], file.events, true), file.kept, true) }, null, 2), "\n"); };
exports.calendarText = calendarText;
// Earliest first, so the file reads in order when opened by hand.
var startOf = function (event) { return (event.when.kind === 'allDay' ? Date.parse("".concat(event.when.startDay, "T00:00:00Z")) : (0, calendar_time_1.instantOf)(event.when.start, event.when.zone)); };
var inOrder = function (events) { return __spreadArray([], events, true).sort(function (a, b) { return startOf(a) - startOf(b) || a.id.localeCompare(b.id); }); };
var withEvent = function (file, event) { return (__assign(__assign({}, file), { events: inOrder(__spreadArray(__spreadArray([], file.events.filter(function (e) { return e.id !== event.id; }), true), [event], false)) })); };
exports.withEvent = withEvent;
var withoutEvent = function (file, id) { return (__assign(__assign({}, file), { events: file.events.filter(function (e) { return e.id !== id; }) })); };
exports.withoutEvent = withoutEvent;
