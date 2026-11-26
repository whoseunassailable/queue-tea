"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var calendar_1 = require("../../../../shared/calendar");
var calendar_time_1 = require("../../../../shared/calendar_time");
// Both sides read events with these, so they live in shared; the specs sit here.
(0, vitest_1.describe)('days and wall times', function () {
    vitest_1.it.each(['2026-12-01', '2028-02-29', '1999-12-31'])('takes the day %s', function (day) {
        (0, vitest_1.expect)((0, calendar_1.isDay)(day)).toBe(true);
    });
    vitest_1.it.each(['2026-02-30', '2026-13-01', '2026-1-01', ' 2026-12-01', '2026-12-01T09:00', '', 20261201, null])('refuses %s as a day', function (value) {
        (0, vitest_1.expect)((0, calendar_1.isDay)(value)).toBe(false);
    });
    vitest_1.it.each(['2026-12-01T00:00', '2026-12-01T23:59'])('takes the wall time %s', function (wall) {
        (0, vitest_1.expect)((0, calendar_1.isWallTime)(wall)).toBe(true);
    });
    vitest_1.it.each(['2026-12-01T24:00', '2026-12-01T9:00', '2026-12-01 09:00', '2026-02-30T09:00', '2026-12-01T09:00:00', '2026-12-01T09:00Z'])('refuses %s as a wall time', function (wall) {
        (0, vitest_1.expect)((0, calendar_1.isWallTime)(wall)).toBe(false);
    });
});
(0, vitest_1.describe)('zones', function () {
    (0, vitest_1.it)("keeps a zone by its own name, and refuses offsets and names Intl doesn't know", function () {
        (0, vitest_1.expect)((0, calendar_time_1.zoneNameOf)('Europe/Lisbon')).toBe('Europe/Lisbon');
        (0, vitest_1.expect)((0, calendar_time_1.zoneNameOf)('europe/lisbon')).toBe('Europe/Lisbon');
        (0, vitest_1.expect)((0, calendar_time_1.zoneNameOf)('UTC')).toBe('UTC');
        for (var _i = 0, _a = ['+05:30', 'Mars/Olympus_Mons', '', '../etc', 'America/Chicago\n', 7, null]; _i < _a.length; _i++) {
            var bad = _a[_i];
            (0, vitest_1.expect)((0, calendar_time_1.zoneNameOf)(bad)).toBeNull();
        }
    });
    (0, vitest_1.it)('reads a moment on any clock', function () {
        var noon = Date.parse('2026-07-01T12:00:00Z');
        (0, vitest_1.expect)((0, calendar_time_1.wallOf)(noon, 'America/Chicago')).toBe('2026-07-01T07:00');
        (0, vitest_1.expect)((0, calendar_time_1.wallOf)(noon, 'Asia/Kolkata')).toBe('2026-07-01T17:30');
        (0, vitest_1.expect)((0, calendar_time_1.offsetAt)(noon, 'Asia/Kolkata')).toBe(330);
        (0, vitest_1.expect)((0, calendar_time_1.offsetAt)(noon, 'America/Chicago')).toBe(-300);
        (0, vitest_1.expect)((0, calendar_time_1.offsetAt)(Date.parse('2026-12-01T12:00:00Z'), 'America/Chicago')).toBe(-360);
    });
    (0, vitest_1.it)('finds the moment a wall time names, in summer and winter', function () {
        (0, vitest_1.expect)(new Date((0, calendar_time_1.instantOf)('2026-07-01T09:00', 'Europe/Lisbon')).toISOString()).toBe('2026-07-01T08:00:00.000Z');
        (0, vitest_1.expect)(new Date((0, calendar_time_1.instantOf)('2026-12-01T09:00', 'Europe/Lisbon')).toISOString()).toBe('2026-12-01T09:00:00.000Z');
    });
    (0, vitest_1.it)('moves a time the clocks skip past the jump, and takes the first of a time they repeat', function () {
        // Chicago skips 2:00 to 3:00 on 8 March and repeats 1:00 to 2:00 on 1 November.
        (0, vitest_1.expect)((0, calendar_time_1.wallOf)((0, calendar_time_1.instantOf)('2026-03-08T02:30', 'America/Chicago'), 'America/Chicago')).toBe('2026-03-08T03:30');
        (0, vitest_1.expect)(new Date((0, calendar_time_1.instantOf)('2026-11-01T01:30', 'America/Chicago')).toISOString()).toBe('2026-11-01T06:30:00.000Z');
    });
    (0, vitest_1.it)('shows a 9:00 call in Lisbon at 3:00 in Chicago, and a late one in Tokyo on the day before in Los Angeles', function () {
        (0, vitest_1.expect)((0, calendar_time_1.wallIn)('2026-11-25T09:00', 'Europe/Lisbon', 'America/Chicago')).toBe('2026-11-25T03:00');
        (0, vitest_1.expect)((0, calendar_time_1.wallIn)('2026-11-26T08:30', 'Asia/Tokyo', 'America/Los_Angeles')).toBe('2026-11-25T15:30');
    });
});
