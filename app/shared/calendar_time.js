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
exports.wallIn = exports.instantOf = exports.offsetAt = exports.wallOf = exports.knownZones = exports.hereZone = exports.zoneNameOf = void 0;
// Wall times and moments, on any zone's clock. The window and main both read
// a timed event's start and end with these, so they agree on what an event
// means. Intl knows every zone's rules, summer time included.
var MINUTE = 60000;
var DAY = 24 * 60 * MINUTE;
// An IANA name, such as America/Chicago or UTC. Offsets like +05:30 aren't
// zones: they don't move with summer time.
var ZONE_NAME = /^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+)*$/;
var formatters = new Map();
var formatterOf = function (zone) {
    var known = formatters.get(zone);
    if (known !== undefined)
        return known;
    var made = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    formatters.set(zone, made);
    return made;
};
// The zone's own name for itself, so europe/lisbon is kept as Europe/Lisbon;
// null for a name Intl doesn't know.
var zoneNameOf = function (value) {
    if (typeof value !== 'string' || value.length > 64 || !ZONE_NAME.test(value))
        return null;
    try {
        return formatterOf(value).resolvedOptions().timeZone;
    }
    catch (_a) {
        return null;
    }
};
exports.zoneNameOf = zoneNameOf;
// The Mac's own zone, as the window reads it.
var hereZone = function () { return Intl.DateTimeFormat().resolvedOptions().timeZone; };
exports.hereZone = hereZone;
// Every zone this computer knows, for the event sheet's list.
var knownZones = function () { return (typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : []); };
exports.knownZones = knownZones;
var partsOf = function (ms, zone) {
    var parts = Object.fromEntries(formatterOf(zone).formatToParts(new Date(ms)).map(function (part) { return [part.type, part.value]; }));
    return [Number(parts.year), Number(parts.month), Number(parts.day), Number(parts.hour) % 24, Number(parts.minute), Number(parts.second)];
};
var utcOfWall = function (wall) { return Date.UTC(Number(wall.slice(0, 4)), Number(wall.slice(5, 7)) - 1, Number(wall.slice(8, 10)), Number(wall.slice(11, 13)), Number(wall.slice(14, 16))); };
var pad = function (n, width) {
    if (width === void 0) { width = 2; }
    return String(n).padStart(width, '0');
};
// A moment as a wall time on the zone's clock, to the minute.
var wallOf = function (ms, zone) {
    var _a = partsOf(ms, zone), year = _a[0], month = _a[1], day = _a[2], hour = _a[3], minute = _a[4];
    return "".concat(pad(year, 4), "-").concat(pad(month), "-").concat(pad(day), "T").concat(pad(hour), ":").concat(pad(minute));
};
exports.wallOf = wallOf;
// How far the zone's clock is ahead of UTC at a moment, in minutes.
var offsetAt = function (ms, zone) {
    var whole = Math.floor(ms / 1000) * 1000;
    var _a = partsOf(whole, zone), year = _a[0], month = _a[1], day = _a[2], hour = _a[3], minute = _a[4], second = _a[5];
    return Math.round((Date.UTC(year, month - 1, day, hour, minute, second) - whole) / MINUTE);
};
exports.offsetAt = offsetAt;
// The moment a wall time names on the zone's clock. When the clocks go back
// it happens twice, and this is the first. When they go forward it never
// happens, and this is the moment as far past the jump: 2:30 on a night that
// skips from 2:00 to 3:00 is 3:30.
var instantOf = function (wall, zone) {
    var local = utcOfWall(wall);
    var before = (0, exports.offsetAt)(local - DAY, zone);
    var after = (0, exports.offsetAt)(local + DAY, zone);
    var fits = __spreadArray([], new Set([before, after]), true).map(function (offset) { return local - offset * MINUTE; }).filter(function (ms) { return (0, exports.wallOf)(ms, zone) === wall; });
    return fits.length > 0 ? Math.min.apply(Math, fits) : local - before * MINUTE;
};
exports.instantOf = instantOf;
// The same moment read on another clock: 09:00 in Lisbon is 03:00 in Chicago.
var wallIn = function (wall, from, to) { return (0, exports.wallOf)((0, exports.instantOf)(wall, from), to); };
exports.wallIn = wallIn;
