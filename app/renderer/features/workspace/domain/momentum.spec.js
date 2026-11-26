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
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var en_1 = require("../../../l10n/en");
var test_support_1 = require("../../../test_support");
var momentum_1 = require("./momentum");
var game = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign(__assign(__assign({}, test_support_1.GAME), { xpIntoLevel: 150, xpToNextLevel: 200, level: 2, stage: 'hatchling', streak: 3, bestStreak: 5, wonToday: true, badges: [] }), over));
};
var QUEST = { title: 'Fix the docs', xp: 25 };
(0, vitest_1.describe)('the bar', function () {
    (0, vitest_1.it)('fills to where you are', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), null).share).toBe(0.75);
    });
    (0, vitest_1.it)('shows what the quest in hand would add', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), QUEST).gain).toBe(0.125);
    });
    (0, vitest_1.it)('stops the gain at the end of the level', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), __assign(__assign({}, QUEST), { xp: 500 })).gain).toBe(0.25);
    });
    (0, vitest_1.it)('has no gain with no quest', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), null).gain).toBe(0);
    });
    (0, vitest_1.it)('says how far to the next level', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), null).headline).toBe(en_1.t.hud.toGo(50, 3));
    });
});
(0, vitest_1.describe)('the line that keeps you going', function () {
    (0, vitest_1.it)('leads with a level the quest in hand reaches', function () {
        var momentum = (0, momentum_1.momentumOf)(game({ xpIntoLevel: 190 }), QUEST);
        (0, vitest_1.expect)(momentum.hook).toBe(en_1.t.hud.levelsUp('Fix the docs', 3));
        (0, vitest_1.expect)(momentum.isClose).toBe(true);
    });
    (0, vitest_1.it)('counts a quest worth exactly what\'s left', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ xpIntoLevel: 175 }), QUEST).hook).toBe(en_1.t.hud.levelsUp('Fix the docs', 3));
    });
    (0, vitest_1.it)('doesn\'t promise a level one XP short', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ xpIntoLevel: 174 }), QUEST).hook).toBe(en_1.t.hud.questsToGo(2, 25, 3));
    });
    (0, vitest_1.it)('warns of a streak still to keep today', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ wonToday: false, streak: 3 }), null).hook).toBe(en_1.t.hud.keepStreak(3));
        (0, vitest_1.expect)((0, momentum_1.isStreakAtRisk)(game({ wonToday: false, streak: 3 }))).toBe(true);
    });
    (0, vitest_1.it)('counts a streak of one as one to keep', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ wonToday: false, streak: 1 }), null).hook).toBe(en_1.t.hud.keepStreak(1));
    });
    (0, vitest_1.it)('has no streak to warn of with none going', function () {
        (0, vitest_1.expect)((0, momentum_1.isStreakAtRisk)(game({ wonToday: false, streak: 0 }))).toBe(false);
    });
    (0, vitest_1.it)('has no streak to warn of once today has counted', function () {
        (0, vitest_1.expect)((0, momentum_1.isStreakAtRisk)(game({ wonToday: true, streak: 3 }))).toBe(false);
    });
    (0, vitest_1.it)('puts a level before a streak, since the win does both', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ xpIntoLevel: 190, wonToday: false }), QUEST).hook).toBe(en_1.t.hud.levelsUp('Fix the docs', 3));
    });
    (0, vitest_1.it)('says how many quests like this one reach the level', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), __assign(__assign({}, QUEST), { xp: 10 })).hook).toBe(en_1.t.hud.questsToGo(5, 10, 3));
    });
    (0, vitest_1.it)('points to the nearest badge with no quest in hand', function () {
        var badges = [
            { id: 'tenTales', need: 10, have: 9, earnedOn: null },
            { id: 'dragonSlayer', need: 5, have: 1, earnedOn: null },
        ];
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ badges: badges }), null).hook).toBe(en_1.t.hud.nearBadge(1, en_1.t.badges.tenTales));
    });
    (0, vitest_1.it)('ignores a badge already earned, or with nothing to count', function () {
        var badges = [
            { id: 'tenTales', need: 10, have: 10, earnedOn: '2026-10-20' },
            { id: 'earlyBird', need: 1, have: 0, earnedOn: null },
        ];
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ badges: badges }), null).hook).toBe(en_1.t.hud.grows(en_1.t.stage.hatchling, 5));
    });
    (0, vitest_1.it)('falls back on how the dragon grows', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), null).hook).toBe(en_1.t.hud.grows(en_1.t.stage.hatchling, 5));
    });
    (0, vitest_1.it)('still has something to say for an elder', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ stage: 'elder', level: 22 }), null).hook).toBe(en_1.t.hud.elder);
    });
});
(0, vitest_1.describe)('being close', function () {
    (0, vitest_1.it)('is close within a quest of the level', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ xpIntoLevel: 180 }), QUEST).isClose).toBe(true);
    });
    (0, vitest_1.it)('is close at nine tenths with no quest', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game({ xpIntoLevel: 180 }), null).isClose).toBe(true);
    });
    (0, vitest_1.it)('isn\'t close otherwise', function () {
        (0, vitest_1.expect)((0, momentum_1.momentumOf)(game(), QUEST).isClose).toBe(false);
    });
});
(0, vitest_1.describe)('the quest ahead', function () {
    var view = function (over) { return (0, test_support_1.projectView)('a-000001', over); };
    (0, vitest_1.it)('is the quest in hand first', function () {
        (0, vitest_1.expect)((0, momentum_1.questAheadOf)(view({ active: (0, test_support_1.activeQuest)({ title: 'In hand', xp: 50 }), ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'x', isStar: true }) }] }))).toEqual({ title: 'In hand', xp: 50 });
    });
    (0, vitest_1.it)('is the main quest with none in hand', function () {
        (0, vitest_1.expect)((0, momentum_1.questAheadOf)(view({ ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'x' }) }, { kind: 'quest', quest: (0, test_support_1.quest)({ id: 'star', title: 'The star', isStar: true, xp: 10 }) }] }))).toEqual({ title: 'The star', xp: 10 });
    });
    (0, vitest_1.it)('is nothing with no realm, or nothing to do', function () {
        (0, vitest_1.expect)((0, momentum_1.questAheadOf)(null)).toBeNull();
        (0, vitest_1.expect)((0, momentum_1.questAheadOf)(view({}))).toBeNull();
    });
});
