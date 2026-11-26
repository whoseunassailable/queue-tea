"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.momentumOf = exports.questAheadOf = exports.isStreakAtRisk = void 0;
var board_1 = require("../../quests/domain/board");
var constants_1 = require("../../../core/constants/constants");
var en_1 = require("../../../l10n/en");
var CLOSE_SHARE = 0.9;
var isStreakAtRisk = function (game) { return game.streak > 0 && !game.wonToday; };
exports.isStreakAtRisk = isStreakAtRisk;
// The quest in hand, or the main quest waiting.
var questAheadOf = function (view) {
    var _a, _b;
    if (view === null)
        return null;
    var quest = (_a = view.active) !== null && _a !== void 0 ? _a : (_b = (0, board_1.rowsOf)(view.ready).find(function (row) { return row.quest.isStar; })) === null || _b === void 0 ? void 0 : _b.quest;
    return quest === undefined ? null : { title: quest.title, xp: quest.xp };
};
exports.questAheadOf = questAheadOf;
// The unearned badge you're nearest to, among those with something to count.
var nearestBadge = function (badges) {
    var _a;
    var counting = badges.filter(function (badge) { return badge.earnedOn === null && badge.have > 0; });
    return (_a = counting.sort(function (a, b) { return a.need - a.have - (b.need - b.have); })[0]) !== null && _a !== void 0 ? _a : null;
};
var laterHook = function (game) {
    var badge = nearestBadge(game.badges);
    if (badge !== null)
        return en_1.t.hud.nearBadge(badge.need - badge.have, en_1.t.badges[badge.id]);
    var growsAt = constants_1.GROWS_AT[game.stage];
    return growsAt === null ? en_1.t.hud.elder : en_1.t.hud.grows(en_1.t.stage[game.stage], growsAt);
};
// What the level bar says. Worked out from the game and the quest ahead, so
// nothing is kept, and it always ends in something to go and do.
var momentumOf = function (game, quest) {
    var left = game.xpToNextLevel - game.xpIntoLevel;
    var nextLevel = game.level + 1;
    var reachesLevel = quest !== null && quest.xp >= left;
    var atRisk = (0, exports.isStreakAtRisk)(game);
    var share = game.xpIntoLevel / game.xpToNextLevel;
    var hookOf = function () {
        if (reachesLevel)
            return en_1.t.hud.levelsUp(quest.title, nextLevel);
        if (atRisk)
            return en_1.t.hud.keepStreak(game.streak);
        if (quest !== null)
            return en_1.t.hud.questsToGo(Math.ceil(left / quest.xp), quest.xp, nextLevel);
        return laterHook(game);
    };
    return {
        share: share,
        gain: quest === null ? 0 : Math.min(quest.xp, left) / game.xpToNextLevel,
        headline: en_1.t.hud.toGo(left, nextLevel),
        hook: hookOf(),
        isClose: reachesLevel || share >= CLOSE_SHARE,
    };
};
exports.momentumOf = momentumOf;
