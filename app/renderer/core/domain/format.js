"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clockTime = exports.dayName = exports.weekdayOf = exports.isClaudeOut = exports.refillTime = exports.manaLeft = exports.dayAndTime = exports.dayOf = exports.formatSpan = exports.formatMinutes = exports.formatAge = void 0;
var ranking_1 = require("../../../../hooks/shared/backlog/domain/services/ranking");
Object.defineProperty(exports, "formatSpan", { enumerable: true, get: function () { return ranking_1.formatSpan; } });
var time_1 = require("../../../../hooks/shared/time/domain/services/time");
Object.defineProperty(exports, "formatAge", { enumerable: true, get: function () { return time_1.formatAge; } });
Object.defineProperty(exports, "formatMinutes", { enumerable: true, get: function () { return time_1.formatMinutes; } });
var en_1 = require("../../l10n/en");
// A record's times keep the local time they were written in, so they read
// straight from the text: "2026-10-20T22:17:00+02:00" is 20 Oct 22:17.
var dayOf = function (iso) {
    var _a;
    var month = (_a = en_1.t.months[Number(iso.slice(5, 7)) - 1]) !== null && _a !== void 0 ? _a : '';
    return "".concat(Number(iso.slice(8, 10)), " ").concat(month);
};
exports.dayOf = dayOf;
var dayAndTime = function (iso) { return "".concat((0, exports.dayOf)(iso), " ").concat(iso.slice(11, 16)); };
exports.dayAndTime = dayAndTime;
var manaLeft = function (allowance) { return Math.max(0, Math.min(100, Math.round(100 - allowance.percent))); };
exports.manaLeft = manaLeft;
// When the mana refills, on this computer's clock; null when it can't be read.
var refillTime = function (allowance) {
    if (allowance.resetsAt === null)
        return null;
    var at = new Date(allowance.resetsAt);
    if (Number.isNaN(at.getTime()))
        return null;
    return "".concat(String(at.getHours()).padStart(2, '0'), ":").concat(String(at.getMinutes()).padStart(2, '0'));
};
exports.refillTime = refillTime;
// Claude's allowance is used up until it resets; unknown counts as not.
var isClaudeOut = function (allowance, nowMs) {
    return allowance !== null && allowance.percent >= 100 && (allowance.resetsAt === null || Date.parse(allowance.resetsAt) > nowMs);
};
exports.isClaudeOut = isClaudeOut;
// Monday first, from a `YYYY-MM-DD` day: the text holds no time zone to get wrong.
var weekdayIndex = function (day) { return (new Date("".concat(day, "T00:00:00Z")).getUTCDay() + 6) % 7; };
var weekdayOf = function (day) { var _a; return (_a = en_1.t.weekdays[weekdayIndex(day)]) !== null && _a !== void 0 ? _a : ''; };
exports.weekdayOf = weekdayOf;
var dayName = function (day) { return "".concat((0, exports.weekdayOf)(day), " ").concat((0, exports.dayOf)(day)); };
exports.dayName = dayName;
// A moment on this computer's clock.
var clockTime = function (ms) {
    var at = new Date(ms);
    return "".concat(String(at.getHours()).padStart(2, '0'), ":").concat(String(at.getMinutes()).padStart(2, '0'));
};
exports.clockTime = clockTime;
