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
var en_1 = require("../../../l10n/en");
var event_form_1 = require("./event_form");
var HERE = 'America/Chicago';
var FORM = { title: 'Call', isAllDay: false, startDay: '2026-12-01', endDay: '2026-12-01', startTime: '09:00', endTime: '10:00', zone: HERE, place: '', notes: '' };
(0, vitest_1.describe)('a new event', function () {
    (0, vitest_1.it)('starts at the next whole hour today, for an hour', function () {
        var at = Date.parse('2026-11-25T19:44:00Z'); // 13:44 in Chicago
        (0, vitest_1.expect)((0, event_form_1.newEventForm)('2026-11-25', HERE, at)).toMatchObject({ startDay: '2026-11-25', startTime: '14:00', endDay: '2026-11-25', endTime: '15:00', zone: HERE, isAllDay: false });
    });
    (0, vitest_1.it)('runs past midnight when it starts at 23:00', function () {
        var at = Date.parse('2026-11-26T04:10:00Z'); // 22:10 in Chicago
        (0, vitest_1.expect)((0, event_form_1.newEventForm)('2026-11-25', HERE, at)).toMatchObject({ startDay: '2026-11-25', startTime: '23:00', endDay: '2026-11-26', endTime: '00:00' });
    });
    (0, vitest_1.it)('starts at 9:00 on any other day', function () {
        (0, vitest_1.expect)((0, event_form_1.newEventForm)('2026-12-03', HERE, Date.parse('2026-11-25T19:44:00Z'))).toMatchObject({ startDay: '2026-12-03', startTime: '09:00', endTime: '10:00' });
    });
});
(0, vitest_1.describe)('the sheet’s checks', function () {
    (0, vitest_1.it)('takes a whole timed event', function () {
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(FORM)).toEqual({});
    });
    (0, vitest_1.it)('says which field is missing, by name', function () {
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { title: ' ', startDay: '', endDay: '', startTime: '', endTime: '', zone: '' }))).toEqual({
            title: en_1.t.form.titleRequired,
            startDay: en_1.t.calendar.form.startDayRequired,
            endDay: en_1.t.calendar.form.endDayRequired,
            startTime: en_1.t.calendar.form.startTimeRequired,
            endTime: en_1.t.calendar.form.endTimeRequired,
            zone: en_1.t.calendar.form.zoneRequired,
        });
    });
    (0, vitest_1.it)("says how to fix a day, a time or a zone it can't read", function () {
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { startDay: '2026-02-30', startTime: '9am', zone: 'Chicago' }))).toEqual({ startDay: en_1.t.calendar.form.dayBad, startTime: en_1.t.calendar.form.timeBad, zone: en_1.t.calendar.form.zoneBad });
    });
    (0, vitest_1.it)('needs no times or zone for an all-day event', function () {
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { isAllDay: true, startTime: '', endTime: '', zone: '' }))).toEqual({});
    });
    (0, vitest_1.it)('puts an end before the start on the end', function () {
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { endTime: '08:30' }))).toEqual({ endTime: en_1.t.calendar.form.endsFirst });
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { isAllDay: true, endDay: '2026-11-30' }))).toEqual({ endDay: en_1.t.calendar.form.endsFirst });
    });
    (0, vitest_1.it)('judges the end in the event’s own zone', function () {
        // 09:00 to 09:30 the same morning is fine on any one clock.
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { zone: 'Asia/Tokyo', endTime: '09:30' }))).toEqual({});
    });
    (0, vitest_1.it)('holds an event to a year', function () {
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { isAllDay: true, startDay: '2026-01-01', endDay: '2027-01-02' }))).toEqual({ endDay: en_1.t.calendar.form.tooLong });
    });
    (0, vitest_1.it)('keeps place and notes to their lengths', function () {
        (0, vitest_1.expect)((0, event_form_1.validateEvent)(__assign(__assign({}, FORM), { place: 'x'.repeat(201), notes: 'x'.repeat(5001) }))).toEqual({ place: en_1.t.calendar.form.placeLong, notes: en_1.t.calendar.form.notesLong });
    });
});
(0, vitest_1.describe)('what the sheet sends and shows', function () {
    (0, vitest_1.it)('sends a timed event in its zone, by the zone’s own name, without empty text', function () {
        (0, vitest_1.expect)((0, event_form_1.eventInputOf)(__assign(__assign({}, FORM), { title: ' Call ', zone: 'europe/lisbon', place: '  ', notes: ' Agenda ' }))).toEqual({
            title: 'Call',
            when: { kind: 'timed', start: '2026-12-01T09:00', end: '2026-12-01T10:00', zone: 'Europe/Lisbon' },
            place: null,
            notes: 'Agenda',
        });
    });
    (0, vitest_1.it)('sends an all-day event as its days', function () {
        (0, vitest_1.expect)((0, event_form_1.eventInputOf)(__assign(__assign({}, FORM), { isAllDay: true, endDay: '2026-12-02' })).when).toEqual({ kind: 'allDay', startDay: '2026-12-01', endDay: '2026-12-02' });
    });
    (0, vitest_1.it)('opens an event on its own zone’s clock, and reads back what it sent', function () {
        var event = __assign({ id: 'e-1' }, (0, event_form_1.eventInputOf)(__assign(__assign({}, FORM), { zone: 'Europe/Lisbon', place: 'Zoom' })));
        (0, vitest_1.expect)((0, event_form_1.formOf)(event, HERE)).toEqual(__assign(__assign({}, FORM), { zone: 'Europe/Lisbon', place: 'Zoom' }));
        (0, vitest_1.expect)((0, event_form_1.eventInputOf)((0, event_form_1.formOf)(event, HERE))).toEqual((0, event_form_1.eventInputOf)(__assign(__assign({}, FORM), { zone: 'Europe/Lisbon', place: 'Zoom' })));
    });
    (0, vitest_1.it)('moves the end with the start, so the event keeps its length', function () {
        (0, vitest_1.expect)((0, event_form_1.withStartDay)(__assign(__assign({}, FORM), { endDay: '2026-12-03' }), '2026-12-05')).toMatchObject({ startDay: '2026-12-05', endDay: '2026-12-07' });
        (0, vitest_1.expect)((0, event_form_1.withStartDay)(FORM, '')).toMatchObject({ startDay: '', endDay: '2026-12-01' });
    });
});
