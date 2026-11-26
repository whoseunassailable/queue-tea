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
exports.versionsToKeep = void 0;
var notes_1 = require("../../../../shared/notes");
// Frequent autosaves retain detail near the present without displacing every
// older recovery point. Buckets use UTC, so daylight saving cannot merge them.
var versionsToKeep = function (versions) {
    var sorted = __spreadArray([], versions, true).sort(function (a, b) { return b.id.localeCompare(a.id); });
    var recent = sorted.slice(0, notes_1.NOTE_HISTORY_LIMITS.recent);
    var hourly = [];
    var daily = [];
    var hours = new Set();
    var days = new Set();
    for (var _i = 0, _a = sorted.slice(notes_1.NOTE_HISTORY_LIMITS.recent); _i < _a.length; _i++) {
        var version = _a[_i];
        var hour = version.savedAt.slice(0, 13);
        if (hourly.length < notes_1.NOTE_HISTORY_LIMITS.hourly) {
            if (!hours.has(hour))
                hourly.push(version);
            hours.add(hour);
        }
        else {
            var day = version.savedAt.slice(0, 10);
            if (!days.has(day) && daily.length < notes_1.NOTE_HISTORY_LIMITS.daily)
                daily.push(version);
            days.add(day);
        }
    }
    return __spreadArray(__spreadArray(__spreadArray([], recent, true), hourly, true), daily, true);
};
exports.versionsToKeep = versionsToKeep;
