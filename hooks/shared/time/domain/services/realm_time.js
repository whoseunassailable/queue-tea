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
exports.realmDayTime = exports.recordRealmTime = exports.overlapMinutes = exports.mergePeriods = void 0;
var time_1 = require("../constants/time");
var time_2 = require("./time");
// Copies before merging so reporting never changes the saved evidence.
var mergePeriods = function (periods) {
    var merged = [];
    for (var _i = 0, _a = __spreadArray([], periods, true).sort(function (a, b) { return a.start - b.start; }); _i < _a.length; _i++) {
        var period = _a[_i];
        var last = merged.at(-1);
        if (last !== undefined && period.start <= last.end)
            last.end = Math.max(last.end, period.end);
        else
            merged.push(__assign({}, period));
    }
    return merged;
};
exports.mergePeriods = mergePeriods;
// The minutes of `periods` that fall inside `within`, each minute once.
var overlapMinutes = function (periods, within) {
    var inside = (0, exports.mergePeriods)(within);
    return (0, exports.mergePeriods)(periods).reduce(function (sum, p) {
        return sum + inside.reduce(function (more, w) { return more + Math.max(0, Math.min(p.end, w.end) - Math.max(p.start, w.start)); }, 0);
    }, 0) / time_1.TIME.minute;
};
exports.overlapMinutes = overlapMinutes;
var minutesOf = function (periods) {
    return (0, exports.mergePeriods)(periods).reduce(function (sum, period) { return sum + (period.end - period.start) / time_1.TIME.minute; }, 0);
};
// Called inside the same record transaction as the existing minute counters.
var recordRealmTime = function (record, more) {
    var _a;
    var _b, _c, _d;
    if (more.onQuests.length === 0 && more.elsewhere.length === 0)
        return record;
    var previous = record.realmTime;
    var days = __assign({}, previous === null || previous === void 0 ? void 0 : previous.days);
    var offset = more.offsetMinutes * time_1.TIME.minute;
    for (var _i = 0, _e = ['onQuests', 'elsewhere']; _i < _e.length; _i++) {
        var kind = _e[_i];
        for (var _f = 0, _g = more[kind]; _f < _g.length; _f++) {
            var period = _g[_f];
            var start = period.start;
            while (start < period.end) {
                var end = Math.min(period.end, (Math.floor((start + offset) / time_1.TIME.day) + 1) * time_1.TIME.day - offset);
                var day = (0, time_2.dayKey)(start, more.offsetMinutes);
                var saved = (_b = days[day]) !== null && _b !== void 0 ? _b : { onQuests: [], elsewhere: [] };
                days[day] = __assign(__assign({}, saved), (_a = {}, _a[kind] = (0, exports.mergePeriods)(__spreadArray(__spreadArray([], saved[kind], true), [{ start: start, end: end }], false)), _a));
                start = end;
            }
        }
    }
    return __assign(__assign({}, record), { realmTime: {
            days: days,
            accountedOnQuests: (0, time_2.mergeMinutes)((_c = previous === null || previous === void 0 ? void 0 : previous.accountedOnQuests) !== null && _c !== void 0 ? _c : {}, more.minutesOnQuests),
            accountedElsewhere: (0, time_2.mergeMinutes)((_d = previous === null || previous === void 0 ? void 0 : previous.accountedElsewhere) !== null && _d !== void 0 ? _d : {}, more.minutesElsewhere),
        } });
};
exports.recordRealmTime = recordRealmTime;
var rounded = function (minutes) { return Math.round(minutes * 100) / 100; };
var realmDayTime = function (record, day) {
    var _a, _b, _c, _d;
    var rawOnQuests = record.tasks.reduce(function (sum, task) { var _a; return sum + ((_a = task.minutesByDay[day]) !== null && _a !== void 0 ? _a : 0); }, 0);
    var rawElsewhere = (_a = record.unassignedMinutesByDay[day]) !== null && _a !== void 0 ? _a : 0;
    var tracked = record.realmTime;
    if (tracked === undefined)
        return { onQuests: rawOnQuests, elsewhere: rawElsewhere };
    var periods = (_b = tracked.days[day]) !== null && _b !== void 0 ? _b : { onQuests: [], elsewhere: [] };
    var onQuests = minutesOf(periods.onQuests);
    var total = minutesOf(__spreadArray(__spreadArray([], periods.onQuests, true), periods.elsewhere, true));
    // Old or older-writer totals have no timing evidence; retain them as recorded.
    var earlierOnQuests = Math.max(0, rawOnQuests - ((_c = tracked.accountedOnQuests[day]) !== null && _c !== void 0 ? _c : 0));
    var earlierElsewhere = Math.max(0, rawElsewhere - ((_d = tracked.accountedElsewhere[day]) !== null && _d !== void 0 ? _d : 0));
    return {
        onQuests: rounded(earlierOnQuests + onQuests),
        elsewhere: rounded(earlierElsewhere + total - onQuests),
    };
};
exports.realmDayTime = realmDayTime;
