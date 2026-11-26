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
exports.eventInputOf = exports.validateEvent = exports.withStartDay = exports.formOf = exports.newEventForm = exports.EVENT_FIELDS = void 0;
var calendar_1 = require("../../../../shared/calendar");
var calendar_time_1 = require("../../../../shared/calendar_time");
var en_1 = require("../../../l10n/en");
var quest_form_1 = require("../../quests/domain/quest_form");
var calendar_days_1 = require("./calendar_days");
var HOUR_MS = 3600000;
var TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
exports.EVENT_FIELDS = ['title', 'startDay', 'endDay', 'startTime', 'endTime', 'zone', 'place', 'notes'];
// A new event on a day: an hour from the next whole hour when it's today,
// from 9:00 on any other day, in the Mac's zone.
var newEventForm = function (day, here, nowMs) {
    var now = (0, calendar_time_1.wallOf)(nowMs, here);
    var startMs = now.slice(0, 10) === day ? (0, calendar_time_1.instantOf)("".concat(now.slice(0, 13), ":00"), here) + HOUR_MS : (0, calendar_time_1.instantOf)("".concat(day, "T09:00"), here);
    var start = (0, calendar_time_1.wallOf)(startMs, here);
    var end = (0, calendar_time_1.wallOf)(startMs + HOUR_MS, here);
    return { title: '', isAllDay: false, startDay: start.slice(0, 10), endDay: end.slice(0, 10), startTime: start.slice(11), endTime: end.slice(11), zone: here, place: '', notes: '' };
};
exports.newEventForm = newEventForm;
// An event as the sheet edits it, on the clock of the zone it was made in.
var formOf = function (event, here) {
    var _a, _b;
    var base = { title: event.title, place: (_a = event.place) !== null && _a !== void 0 ? _a : '', notes: (_b = event.notes) !== null && _b !== void 0 ? _b : '' };
    var when = event.when;
    if (when.kind === 'allDay')
        return __assign(__assign({}, base), { isAllDay: true, startDay: when.startDay, endDay: when.endDay, startTime: '09:00', endTime: '10:00', zone: here });
    return __assign(__assign({}, base), { isAllDay: false, startDay: when.start.slice(0, 10), endDay: when.end.slice(0, 10), startTime: when.start.slice(11), endTime: when.end.slice(11), zone: when.zone });
};
exports.formOf = formOf;
// Moving the start day moves the end with it, so the event keeps its length.
var withStartDay = function (form, startDay) {
    return (0, calendar_1.isDay)(form.startDay) && (0, calendar_1.isDay)(startDay) && (0, calendar_1.isDay)(form.endDay) ? __assign(__assign({}, form), { startDay: startDay, endDay: (0, calendar_days_1.addDays)(form.endDay, (0, calendar_days_1.daysFrom)(form.startDay, startDay)) }) : __assign(__assign({}, form), { startDay: startDay });
};
exports.withStartDay = withStartDay;
var dayError = function (value, required) { return (value.trim() === '' ? required : (0, calendar_1.isDay)(value.trim()) ? undefined : en_1.t.calendar.form.dayBad); };
var timeError = function (value, required) { return (value.trim() === '' ? required : TIME.test(value.trim()) ? undefined : en_1.t.calendar.form.timeBad); };
// What's wrong with the end once the start reads: before the start, or more than a year after.
var lengthError = function (form) {
    if (form.isAllDay) {
        var span = (0, calendar_days_1.daysFrom)(form.startDay.trim(), form.endDay.trim());
        if (span < 0)
            return { endDay: en_1.t.calendar.form.endsFirst };
        return span >= calendar_1.CALENDAR_LIMITS.spanDays ? { endDay: en_1.t.calendar.form.tooLong } : {};
    }
    var zone = (0, calendar_time_1.zoneNameOf)(form.zone.trim());
    if (zone === null)
        return {};
    var length = (0, calendar_time_1.instantOf)("".concat(form.endDay.trim(), "T").concat(form.endTime.trim()), zone) - (0, calendar_time_1.instantOf)("".concat(form.startDay.trim(), "T").concat(form.startTime.trim()), zone);
    if (length <= 0)
        return { endTime: en_1.t.calendar.form.endsFirst };
    return length > calendar_1.CALENDAR_LIMITS.spanDays * 24 * HOUR_MS ? { endDay: en_1.t.calendar.form.tooLong } : {};
};
var validateEvent = function (form) {
    var errors = __assign(__assign({ title: (0, quest_form_1.titleError)(form.title), startDay: dayError(form.startDay, en_1.t.calendar.form.startDayRequired), endDay: dayError(form.endDay, en_1.t.calendar.form.endDayRequired) }, (form.isAllDay
        ? {}
        : {
            startTime: timeError(form.startTime, en_1.t.calendar.form.startTimeRequired),
            endTime: timeError(form.endTime, en_1.t.calendar.form.endTimeRequired),
            zone: form.zone.trim() === '' ? en_1.t.calendar.form.zoneRequired : (0, calendar_time_1.zoneNameOf)(form.zone.trim()) === null ? en_1.t.calendar.form.zoneBad : undefined,
        })), { place: form.place.trim().length > calendar_1.CALENDAR_LIMITS.place ? en_1.t.calendar.form.placeLong : undefined, notes: form.notes.trim().length > calendar_1.CALENDAR_LIMITS.notes ? en_1.t.calendar.form.notesLong : undefined });
    var readable = Object.entries(errors).every(function (_a) {
        var field = _a[0], error = _a[1];
        return error === undefined || field === 'title' || field === 'place' || field === 'notes';
    });
    var all = readable ? __assign(__assign({}, errors), lengthError(form)) : errors;
    return Object.fromEntries(Object.entries(all).filter(function (_a) {
        var error = _a[1];
        return error !== undefined;
    }));
};
exports.validateEvent = validateEvent;
var eventInputOf = function (form) {
    var _a;
    return ({
        title: form.title.trim(),
        when: form.isAllDay
            ? { kind: 'allDay', startDay: form.startDay.trim(), endDay: form.endDay.trim() }
            : { kind: 'timed', start: "".concat(form.startDay.trim(), "T").concat(form.startTime.trim()), end: "".concat(form.endDay.trim(), "T").concat(form.endTime.trim()), zone: (_a = (0, calendar_time_1.zoneNameOf)(form.zone.trim())) !== null && _a !== void 0 ? _a : form.zone.trim() },
        place: form.place.trim() === '' ? null : form.place.trim(),
        notes: form.notes.trim() === '' ? null : form.notes.trim(),
    });
};
exports.eventInputOf = eventInputOf;
