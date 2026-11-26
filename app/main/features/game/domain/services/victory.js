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
exports.victoryOf = void 0;
var families_1 = require("../../../../../../hooks/shared/backlog/domain/services/families");
var game_1 = require("./game");
var isSagaWon = function (task, tasks) {
    var saga = task.parentId === null ? task : tasks.find(function (t) { return t.id === task.parentId; });
    if (saga === undefined)
        return false;
    var chapters = (0, families_1.childrenOf)(saga, tasks);
    return chapters.length > 0 && __spreadArray([saga], chapters, true).every(function (t) { return t.state === 'done'; });
};
var kindOf = function (task, tasks) {
    if (isSagaWon(task, tasks))
        return 'saga';
    return task.priority === 'urgent' ? 'boss' : 'quest';
};
var newBadges = function (was, now) {
    return now.badges.filter(function (badge) { var _a; return badge.earnedOn !== null && ((_a = was.badges.find(function (b) { return b.id === badge.id; })) === null || _a === void 0 ? void 0 : _a.earnedOn) === null; }).map(function (badge) { return badge.id; });
};
// What one win earned: the game now, against the same records without it.
// Nothing is kept, and the records aren't touched.
var victoryOf = function (records, path, taskId, offsetMinutes, nowMs) {
    var _a;
    var record = records.find(function (r) { return r.project.path === path; });
    var task = record === null || record === void 0 ? void 0 : record.tasks.find(function (t) { return t.id === taskId; });
    if (record === undefined || task === undefined)
        throw new Error("the win ".concat(taskId, " is not in the records"));
    var without = records.map(function (r) { return (r !== record ? r : __assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === taskId ? __assign(__assign({}, t), { state: 'current', finished: null }) : t); }) })); });
    var was = (0, game_1.gameOf)(without, offsetMinutes, nowMs);
    var now = (0, game_1.gameOf)(records, offsetMinutes, nowMs);
    var actual = (_a = task.difficulty.actual) !== null && _a !== void 0 ? _a : task.difficulty.expected;
    var xp = (0, game_1.xpOf)(actual);
    return {
        kind: kindOf(task, record.tasks),
        title: task.title,
        actual: actual,
        expected: task.difficulty.expected,
        xp: xp,
        gold: xp,
        level: now.level,
        didLevelUp: now.level > was.level,
        xpIntoLevel: now.xpIntoLevel,
        xpToNextLevel: now.xpToNextLevel,
        nextLevelAt: now.xp - now.xpIntoLevel + now.xpToNextLevel,
        hoard: now.gold,
        stage: now.stage,
        newBadges: newBadges(was, now),
    };
};
exports.victoryOf = victoryOf;
