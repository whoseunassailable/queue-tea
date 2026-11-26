"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var realm_time_1 = require("../../../hooks/shared/time/domain/services/realm_time");
var time_1 = require("../../../hooks/shared/time/domain/services/time");
var MIN = 60000;
(0, testing_1.test)('a gap of 15 minutes counts, 15m01s does not', function () {
    (0, testing_1.expect)((0, time_1.accrue)(0, 15 * MIN, 15)).toBe(15);
    (0, testing_1.expect)((0, time_1.accrue)(0, 15 * MIN + 1000, 15)).toBe(0);
    (0, testing_1.expect)((0, time_1.accrue)(0, 90000, 15)).toBe(1.5);
});
(0, testing_1.test)('no earlier activity counts nothing', function () {
    (0, testing_1.expect)((0, time_1.accrue)(null, 5 * MIN, 15)).toBe(0);
});
(0, testing_1.test)('a negative gap counts nothing', function () {
    (0, testing_1.expect)((0, time_1.accrue)(10 * MIN, 5 * MIN, 15)).toBe(0);
});
(0, testing_1.test)('dayKey uses the local offset across midnight', function () {
    (0, testing_1.expect)((0, time_1.dayKey)(Date.parse('2026-10-21T23:50:00Z'), 120)).toBe('2026-10-22');
    (0, testing_1.expect)((0, time_1.dayKey)(Date.parse('2026-10-21T23:50:00Z'), 0)).toBe('2026-10-21');
    (0, testing_1.expect)((0, time_1.dayKey)(Date.parse('2026-10-22T03:00:00Z'), -330)).toBe('2026-10-21');
});
(0, testing_1.test)('addMinutes adds to the day and rounds to two decimals', function () {
    (0, testing_1.expect)((0, time_1.addMinutes)({ '2026-10-21': 1.111 }, '2026-10-21', 2.222)).toEqual({ '2026-10-21': 3.33 });
    (0, testing_1.expect)((0, time_1.addMinutes)({}, '2026-10-22', 5)).toEqual({ '2026-10-22': 5 });
});
(0, testing_1.test)('formatMinutes', function () {
    (0, testing_1.expect)((0, time_1.formatMinutes)(0.5)).toBe('0m');
    (0, testing_1.expect)((0, time_1.formatMinutes)(24)).toBe('24m');
    (0, testing_1.expect)((0, time_1.formatMinutes)(84)).toBe('1h 24m');
    (0, testing_1.expect)((0, time_1.formatMinutes)(400)).toBe('6h 40m');
    (0, testing_1.expect)((0, time_1.formatMinutes)(120)).toBe('2h 0m');
});
(0, testing_1.test)('parseOffset', function () {
    (0, testing_1.expect)((0, time_1.parseOffset)('+0200\n')).toBe(120);
    (0, testing_1.expect)((0, time_1.parseOffset)('-0530')).toBe(-330);
    (0, testing_1.expect)((0, time_1.parseOffset)('garbage')).toBe(0);
});
(0, testing_1.test)('isoLocal writes the local time with its offset', function () {
    (0, testing_1.expect)((0, time_1.isoLocal)(Date.parse('2026-10-21T07:12:00Z'), 120)).toBe('2026-10-21T09:12:00+02:00');
    (0, testing_1.expect)((0, time_1.isoLocal)(Date.parse('2026-10-21T07:12:00Z'), -330)).toBe('2026-10-21T01:42:00-05:30');
    (0, testing_1.expect)((0, time_1.isoLocal)(Date.parse('2026-10-21T07:12:00Z'), 0)).toBe('2026-10-21T07:12:00+00:00');
});
(0, testing_1.test)('mergeMinutes adds each day of the second into the first', function () {
    (0, testing_1.expect)((0, time_1.mergeMinutes)({ '2026-10-21': 5 }, { '2026-10-21': 2.5, '2026-10-22': 3 })).toEqual({ '2026-10-21': 7.5, '2026-10-22': 3 });
    (0, testing_1.expect)((0, time_1.mergeMinutes)({ '2026-10-21': 5 }, {})).toEqual({ '2026-10-21': 5 });
    (0, testing_1.expect)((0, time_1.mergeMinutes)({}, { '2026-10-21': 1.111 })).toEqual({ '2026-10-21': 1.11 });
});
(0, testing_1.test)('minutesOfStamps counts each gap up to the idle limit, whatever order the stamps come in', function () {
    var t0 = Date.parse('2026-10-21T08:00:00Z');
    // 10 and 5 minutes, a 16-minute gap that does not count, then 2.
    var stamps = [t0 + 15 * MIN, t0, t0 + 33 * MIN, t0 + 10 * MIN, t0 + 31 * MIN];
    (0, testing_1.expect)((0, time_1.minutesOfStamps)(stamps, 15, 120)).toEqual({ '2026-10-21': 17 });
});
(0, testing_1.test)('minutesOfStamps puts each gap on the local day it ends on', function () {
    // 23:50, 23:55 and 00:05 at +02:00.
    var stamps = ['2026-10-21T21:50:00Z', '2026-10-21T21:55:00Z', '2026-10-21T22:05:00Z'].map(Date.parse);
    (0, testing_1.expect)((0, time_1.minutesOfStamps)(stamps, 15, 120)).toEqual({ '2026-10-21': 5, '2026-10-22': 10 });
    (0, testing_1.expect)((0, time_1.minutesOfStamps)(stamps, 15, 0)).toEqual({ '2026-10-21': 15 });
});
(0, testing_1.test)('minutesOfStamps counts nothing for no stamps, one stamp, or the same moment twice', function () {
    var t0 = Date.parse('2026-10-21T08:00:00Z');
    (0, testing_1.expect)((0, time_1.minutesOfStamps)([], 15, 120)).toEqual({});
    (0, testing_1.expect)((0, time_1.minutesOfStamps)([t0], 15, 120)).toEqual({});
    (0, testing_1.expect)((0, time_1.minutesOfStamps)([t0, t0], 15, 120)).toEqual({});
});
(0, testing_1.test)('overlapMinutes counts the minutes that fall inside the checks, each once', function () {
    var at = function (from, to) { return ({ start: from * MIN, end: to * MIN }); };
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([at(0, 10)], [at(2, 5)])).toBe(3);
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([at(0, 10)], [at(8, 30)])).toBe(2);
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([at(3, 4)], [at(0, 60)])).toBe(1);
    // Two checks running at once, and a span the clock took twice.
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([at(0, 10), at(0, 10)], [at(2, 6), at(4, 8)])).toBe(6);
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([at(0, 5), at(10, 15)], [at(3, 12)])).toBe(4);
});
(0, testing_1.test)('overlapMinutes counts nothing when the spans only touch, or either side is empty', function () {
    var at = function (from, to) { return ({ start: from * MIN, end: to * MIN }); };
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([at(0, 5)], [at(5, 9)])).toBe(0);
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([], [at(0, 9)])).toBe(0);
    (0, testing_1.expect)((0, realm_time_1.overlapMinutes)([at(0, 9)], [])).toBe(0);
});
(0, testing_1.test)('overlapMinutes leaves the spans it was given as they were', function () {
    var periods = [{ start: 4 * MIN, end: 9 * MIN }, { start: 0, end: 6 * MIN }];
    var within = [{ start: 5 * MIN, end: 7 * MIN }, { start: 2 * MIN, end: 6 * MIN }];
    var copies = JSON.stringify([periods, within]);
    (0, realm_time_1.overlapMinutes)(periods, within);
    (0, testing_1.expect)(JSON.stringify([periods, within])).toBe(copies);
});
