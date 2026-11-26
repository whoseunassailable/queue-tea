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
var vitest_1 = require("vitest");
var note_history_1 = require("./note_history");
var NOW = Date.parse('2026-11-07T12:00:00Z');
var HOUR = 3600000;
var version = function (at) { return ({ id: String(at), savedAt: new Date(at).toISOString() }); };
(0, vitest_1.describe)('bounded note history', function () {
    (0, vitest_1.it)('keeps every version while there are fewer than 50', function () {
        var versions = Array.from({ length: 49 }, function (_, n) { return version(NOW - n); });
        (0, vitest_1.expect)((0, note_history_1.versionsToKeep)(versions)).toEqual(versions);
    });
    (0, vitest_1.it)('keeps 50 recent saves, 24 older hourly versions and 26 daily versions, newest first', function () {
        var burst = Array.from({ length: 50 }, function (_, n) { return version(NOW - n); });
        var older = Array.from({ length: 24 * 40 }, function (_, n) { return version(NOW - (n + 1) * HOUR); });
        var kept = (0, note_history_1.versionsToKeep)(__spreadArray([], older, true).reverse().concat(burst));
        (0, vitest_1.expect)(kept).toHaveLength(100);
        (0, vitest_1.expect)(kept.slice(0, 50)).toEqual(burst);
        (0, vitest_1.expect)(kept.slice(50, 74)).toEqual(older.slice(0, 24));
        (0, vitest_1.expect)(new Set(kept.slice(74).map(function (v) { return v.savedAt.slice(0, 10); })).size).toBe(26);
        (0, vitest_1.expect)(kept.some(function (v) { return Date.parse(v.savedAt) < NOW - 20 * 24 * HOUR; })).toBe(true);
    });
    (0, vitest_1.it)('a burst of autosaves cannot evict the hourly and daily recovery points', function () {
        var versions = Array.from({ length: 40 }, function (_, n) { return version(NOW - (n + 1) * 24 * HOUR); });
        for (var n = 0; n < 300; n += 1)
            versions = (0, note_history_1.versionsToKeep)(__spreadArray(__spreadArray([], versions, true), [version(NOW + n * 800)], false));
        (0, vitest_1.expect)(versions.length).toBeLessThanOrEqual(100);
        (0, vitest_1.expect)(versions.slice(0, 50).map(function (v) { return v.id; })).toEqual(Array.from({ length: 50 }, function (_, n) { return String(NOW + (299 - n) * 800); }));
        (0, vitest_1.expect)(versions.some(function (v) { return Date.parse(v.savedAt) < NOW - 20 * 24 * HOUR; })).toBe(true);
    });
});
