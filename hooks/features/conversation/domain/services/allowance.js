"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldHandoff = exports.windowKey = exports.shouldFresh = exports.formatAllowance = exports.readAllowance = void 0;
// The five-hour window of the rate-limit readings.
var readAllowance = function (rateLimits) {
    var _a;
    var window = rateLimits.find(function (r) { return r.kind === 'five_hour'; });
    return window === undefined ? null : { percent: window.percentUsed, resetsAt: (_a = window.resetsAt) !== null && _a !== void 0 ? _a : null };
};
exports.readAllowance = readAllowance;
var pad = function (n) { return String(n).padStart(2, '0'); };
var formatAllowance = function (a, offsetMinutes) {
    var used = "5h: ".concat(Math.round(a.percent), "%");
    if (a.resetsAt === null)
        return used;
    var local = new Date(Date.parse(a.resetsAt) + offsetMinutes * 60000);
    return "".concat(used, " \u00B7 resets ").concat(pad(local.getUTCHours()), ":").concat(pad(local.getUTCMinutes()));
};
exports.formatAllowance = formatAllowance;
var shouldFresh = function (tokens, freshAt) {
    return tokens !== undefined && tokens > freshAt;
};
exports.shouldFresh = shouldFresh;
// What a reset window is known by; one with no reset time is `unknown`.
var windowKey = function (resetsAt) { return resetsAt !== null && resetsAt !== void 0 ? resetsAt : 'unknown'; };
exports.windowKey = windowKey;
// Once per reset window, when the allowance's use reaches the mark.
var shouldHandoff = function (percent, mark, alreadyForReset, resetsAt) { return percent >= mark && alreadyForReset !== (0, exports.windowKey)(resetsAt); };
exports.shouldHandoff = shouldHandoff;
