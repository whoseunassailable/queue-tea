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
exports.gameOf = exports.stageOf = exports.levelOf = exports.xpOf = void 0;
var families_1 = require("../../../../../../hooks/shared/backlog/domain/services/families");
var time_1 = require("../../../../../../hooks/shared/time/domain/services/time");
var week_stats_1 = require("../../../../../../hooks/shared/time/domain/services/week_stats");
// Every game number, worked out from the records each time. Nothing here is
// stored, and nothing here writes.
var XP = { light: 10, medium: 25, hard: 50 };
var DAY_MS = 86400000;
var xpOf = function (difficulty) { return XP[difficulty]; };
exports.xpOf = xpOf;
var actualOf = function (task) { var _a; return (_a = task.difficulty.actual) !== null && _a !== void 0 ? _a : task.difficulty.expected; };
// Reaching level L + 1 takes 100 × L XP more than reaching level L.
var levelOf = function (xp) {
    var level = 1;
    var spent = 0;
    while (xp - spent >= 100 * level) {
        spent += 100 * level;
        level += 1;
    }
    return { level: level, into: xp - spent, toNext: 100 * level };
};
exports.levelOf = levelOf;
var stageOf = function (level) {
    if (level >= 20)
        return 'elder';
    if (level >= 10)
        return 'adult';
    if (level >= 5)
        return 'young';
    return level >= 2 ? 'hatchling' : 'egg';
};
exports.stageOf = stageOf;
// A task keeps the local time it was finished in, so the day and hour come
// from its own text.
var dayOf = function (task) { return task.finished.slice(0, 10); };
var hourOf = function (task) { return Number(task.finished.slice(11, 13)); };
var nextDay = function (day) { return new Date(Date.parse("".concat(day, "T00:00:00Z")) + DAY_MS).toISOString().slice(0, 10); };
// Runs of days in a row, oldest first.
var runsOf = function (days) {
    var runs = [];
    for (var _i = 0, _a = __spreadArray([], new Set(days), true).sort(); _i < _a.length; _i++) {
        var day = _a[_i];
        var run = runs.at(-1);
        if (run !== undefined && nextDay(run.at(-1)) === day)
            run.push(day);
        else
            runs.push([day]);
    }
    return runs;
};
// A streak is alive through today: yesterday's run hasn't been missed yet.
var streakOf = function (runs, today) {
    var last = runs.at(-1);
    if (last === undefined)
        return 0;
    var end = last.at(-1);
    return end === today || nextDay(end) === today ? last.length : 0;
};
var countBadge = function (id, need, wins) {
    var reached = wins[need - 1];
    return { id: id, need: need, have: Math.min(wins.length, need), earnedOn: reached === undefined ? null : dayOf(reached) };
};
// The day a saga and every chapter were all won, or null.
var sagaWonOn = function (saga, tasks) {
    var chapters = (0, families_1.childrenOf)(saga, tasks);
    var whole = __spreadArray([saga], chapters, true);
    if (chapters.length === 0 || whole.some(function (t) { return t.state !== 'done' || t.finished === null; }))
        return null;
    return whole.map(dayOf).sort().at(-1);
};
var sagasEndOf = function (records) {
    var _a;
    var days = records.flatMap(function (r) { return r.tasks.map(function (t) { return sagaWonOn(t, r.tasks); }); }).filter(function (d) { return d !== null; });
    return { id: 'sagasEnd', need: 1, have: Math.min(days.length, 1), earnedOn: (_a = days.sort()[0]) !== null && _a !== void 0 ? _a : null };
};
var weekOfFireOf = function (runs, best) {
    var _a;
    var run = runs.find(function (r) { return r.length >= 7; });
    return { id: 'weekOfFire', need: 7, have: Math.min(best, 7), earnedOn: (_a = run === null || run === void 0 ? void 0 : run[6]) !== null && _a !== void 0 ? _a : null };
};
var gameOf = function (records, offsetMinutes, nowMs) {
    var _a;
    // Oldest first, so the nth win is the one that earned a count badge.
    var wins = records.flatMap(function (r) { return (0, week_stats_1.finishedTasks)(r.tasks); }).sort(function (a, b) { return Date.parse(a.finished) - Date.parse(b.finished); });
    var xp = wins.reduce(function (sum, t) { return sum + (0, exports.xpOf)(actualOf(t)); }, 0);
    var _b = (0, exports.levelOf)(xp), level = _b.level, into = _b.into, toNext = _b.toNext;
    var runs = runsOf(wins.map(dayOf));
    var best = runs.reduce(function (most, run) { return Math.max(most, run.length); }, 0);
    var hours = function (test) { return wins.filter(function (t) { return test(hourOf(t)); }); };
    return {
        victories: wins.length,
        xp: xp,
        gold: xp,
        level: level,
        xpIntoLevel: into,
        xpToNextLevel: toNext,
        stage: (0, exports.stageOf)(level),
        streak: streakOf(runs, (0, time_1.dayKey)(nowMs, offsetMinutes)),
        bestStreak: best,
        wonToday: ((_a = runs.at(-1)) === null || _a === void 0 ? void 0 : _a.at(-1)) === (0, time_1.dayKey)(nowMs, offsetMinutes),
        badges: [
            countBadge('firstFlame', 1, wins),
            countBadge('tenTales', 10, wins),
            countBadge('dragonSlayer', 5, wins.filter(function (t) { return actualOf(t) === 'hard'; })),
            sagasEndOf(records),
            countBadge('earlyBird', 1, hours(function (h) { return h >= 5 && h <= 8; })),
            countBadge('nightOwl', 1, hours(function (h) { return h >= 22 || h <= 3; })),
            weekOfFireOf(runs, best),
        ],
    };
};
exports.gameOf = gameOf;
