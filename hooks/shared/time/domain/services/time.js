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
exports.formatAge = exports.isoLocal = exports.parseOffset = exports.formatMinutes = exports.minutesOfStamps = exports.periodsOfStamps = exports.mergeMinutes = exports.addMinutes = exports.accrue = exports.dayKey = void 0;
var MINUTE = 60000;
// The local day of a moment, as `YYYY-MM-DD`, for the offset `date +%z` gave.
var dayKey = function (ms, offsetMinutes) {
    return new Date(ms + offsetMinutes * MINUTE).toISOString().slice(0, 10);
};
exports.dayKey = dayKey;
// The minutes between two moments of activity, or 0 when there was no earlier
// one, the clock went back, or the gap was longer than the idle limit.
var accrue = function (prevMs, nowMs, gapMinutes) {
    if (prevMs === null)
        return 0;
    var minutes = (nowMs - prevMs) / MINUTE;
    return minutes < 0 || minutes > gapMinutes ? 0 : minutes;
};
exports.accrue = accrue;
var round2 = function (n) { return Math.round(n * 100) / 100; };
var addMinutes = function (byDay, day, minutes) {
    var _a;
    var _b;
    return (__assign(__assign({}, byDay), (_a = {}, _a[day] = round2(((_b = byDay[day]) !== null && _b !== void 0 ? _b : 0) + minutes), _a)));
};
exports.addMinutes = addMinutes;
var mergeMinutes = function (byDay, more) {
    return Object.entries(more).reduce(function (sum, _a) {
        var day = _a[0], minutes = _a[1];
        return (0, exports.addMinutes)(sum, day, minutes);
    }, byDay);
};
exports.mergeMinutes = mergeMinutes;
var periodsOfStamps = function (stamps, gapMinutes) {
    var periods = [];
    var last = null;
    for (var _i = 0, _a = __spreadArray([], stamps, true).sort(function (a, b) { return a - b; }); _i < _a.length; _i++) {
        var stamp = _a[_i];
        if ((0, exports.accrue)(last, stamp, gapMinutes) > 0)
            periods.push({ start: last, end: stamp });
        last = stamp;
    }
    return periods;
};
exports.periodsOfStamps = periodsOfStamps;
// Minutes per day from moments of activity, counted the way a session's are:
// each gap up to the idle limit.
var minutesOfStamps = function (stamps, gapMinutes, offsetMinutes) {
    var last = null;
    var byDay = {};
    for (var _i = 0, _a = __spreadArray([], stamps, true).sort(function (a, b) { return a - b; }); _i < _a.length; _i++) {
        var ms = _a[_i];
        var minutes = (0, exports.accrue)(last, ms, gapMinutes);
        if (minutes > 0)
            byDay = (0, exports.addMinutes)(byDay, (0, exports.dayKey)(ms, offsetMinutes), minutes);
        last = ms;
    }
    return byDay;
};
exports.minutesOfStamps = minutesOfStamps;
var formatMinutes = function (m) {
    var whole = Math.floor(m);
    var hours = Math.floor(whole / 60);
    return hours === 0 ? "".concat(whole, "m") : "".concat(hours, "h ").concat(whole % 60, "m");
};
exports.formatMinutes = formatMinutes;
// `+0200` → 120, `-0530` → -330; anything else → 0.
var parseOffset = function (dateZ) {
    var match = dateZ.trim().match(/^([+-])(\d{2})(\d{2})$/);
    if (match === null)
        return 0;
    var minutes = Number(match[2]) * 60 + Number(match[3]);
    return match[1] === '-' ? -minutes : minutes;
};
exports.parseOffset = parseOffset;
var pad = function (n) { return String(n).padStart(2, '0'); };
// ISO 8601 in local time with its offset: `2026-10-21T09:12:00+02:00`.
var isoLocal = function (ms, offsetMinutes) {
    var local = new Date(ms + offsetMinutes * MINUTE).toISOString().slice(0, 19);
    var sign = offsetMinutes < 0 ? '-' : '+';
    var abs = Math.abs(offsetMinutes);
    return "".concat(local).concat(sign).concat(pad(Math.floor(abs / 60)), ":").concat(pad(abs % 60));
};
exports.isoLocal = isoLocal;
var formatAge = function (ms) {
    var minutes = Math.max(0, Math.floor(ms / 60000));
    if (minutes < 60)
        return "".concat(minutes, "m");
    var hours = Math.floor(minutes / 60);
    return hours < 48 ? "".concat(hours, "h") : "".concat(Math.floor(hours / 24), "d");
};
exports.formatAge = formatAge;
