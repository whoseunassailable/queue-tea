"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var calendar_days_1 = require("./calendar_days");
(0, vitest_1.describe)('days', function () {
    (0, vitest_1.it)('counts across months, years and summer time without drifting', function () {
        (0, vitest_1.expect)((0, calendar_days_1.addDays)('2026-11-30', 1)).toBe('2026-12-01');
        (0, vitest_1.expect)((0, calendar_days_1.addDays)('2026-12-31', 1)).toBe('2027-01-01');
        (0, vitest_1.expect)((0, calendar_days_1.addDays)('2026-03-08', 1)).toBe('2026-03-09');
        (0, vitest_1.expect)((0, calendar_days_1.addDays)('2026-03-01', -1)).toBe('2026-02-28');
        (0, vitest_1.expect)((0, calendar_days_1.daysFrom)('2026-11-25', '2026-12-03')).toBe(8);
        (0, vitest_1.expect)((0, calendar_days_1.daysFrom)('2026-12-03', '2026-11-25')).toBe(-8);
    });
    (0, vitest_1.it)('starts each week on Monday', function () {
        (0, vitest_1.expect)((0, calendar_days_1.weekStartOf)('2026-11-25')).toBe('2026-11-23');
        (0, vitest_1.expect)((0, calendar_days_1.weekStartOf)('2026-11-29')).toBe('2026-11-23');
        (0, vitest_1.expect)((0, calendar_days_1.weekStartOf)('2026-11-30')).toBe('2026-11-30');
        (0, vitest_1.expect)((0, calendar_days_1.weekOf)('2026-11-25')).toEqual(['2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28', '2026-11-29']);
    });
    (0, vitest_1.it)('moves a month on, keeping to the last day of a shorter one', function () {
        (0, vitest_1.expect)((0, calendar_days_1.addMonths)('2026-01-31', 1)).toBe('2026-02-28');
        (0, vitest_1.expect)((0, calendar_days_1.addMonths)('2028-01-31', 1)).toBe('2028-02-29');
        (0, vitest_1.expect)((0, calendar_days_1.addMonths)('2026-12-15', 1)).toBe('2027-01-15');
        (0, vitest_1.expect)((0, calendar_days_1.addMonths)('2026-01-15', -1)).toBe('2025-12-15');
    });
    (0, vitest_1.it)("lays a month out in whole weeks, from the Monday before the 1st to the Sunday after the last", function () {
        var november = (0, calendar_days_1.monthWeeksOf)('2026-11-25');
        (0, vitest_1.expect)(november).toHaveLength(6);
        (0, vitest_1.expect)(november[0][0]).toBe('2026-10-26');
        (0, vitest_1.expect)(november[5][6]).toBe('2026-12-06');
        // February 2027 starts on a Monday and ends on a Sunday: four rows.
        (0, vitest_1.expect)((0, calendar_days_1.monthWeeksOf)('2027-02-10')).toHaveLength(4);
    });
    (0, vitest_1.it)('pages a month, a week or four weeks at a time', function () {
        (0, vitest_1.expect)((0, calendar_days_1.stepOf)('month', '2026-11-25', 1)).toBe('2026-12-01');
        (0, vitest_1.expect)((0, calendar_days_1.stepOf)('month', '2026-11-25', -1)).toBe('2026-10-01');
        (0, vitest_1.expect)((0, calendar_days_1.stepOf)('week', '2026-11-25', 1)).toBe('2026-12-02');
        (0, vitest_1.expect)((0, calendar_days_1.stepOf)('agenda', '2026-11-25', 1)).toBe('2026-12-23');
        (0, vitest_1.expect)((0, calendar_days_1.rangeOf)('week', '2026-11-25')).toEqual({ first: '2026-11-23', last: '2026-11-29' });
        (0, vitest_1.expect)((0, calendar_days_1.rangeOf)('agenda', '2026-11-25')).toEqual({ first: '2026-11-25', last: '2026-12-22' });
        (0, vitest_1.expect)((0, calendar_days_1.rangeOf)('month', '2026-11-25')).toEqual({ first: '2026-10-26', last: '2026-12-06' });
    });
    (0, vitest_1.it)("takes today from the Mac's clock, not UTC's", function () {
        var lateEvening = Date.parse('2026-11-26T03:30:00Z');
        (0, vitest_1.expect)((0, calendar_days_1.todayIn)('America/Chicago', lateEvening)).toBe('2026-11-25');
        (0, vitest_1.expect)((0, calendar_days_1.todayIn)('Asia/Tokyo', lateEvening)).toBe('2026-11-26');
    });
});
