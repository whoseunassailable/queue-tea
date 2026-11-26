"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stageState = exports.stageXp = exports.STAGES = void 0;
// Reaching level L + 1 takes 100 × L XP more than reaching level L.
var xpForLevel = function (level) { return (100 * level * (level - 1)) / 2; };
var FIRST_LEVEL = { egg: 1, hatchling: 2, young: 5, adult: 10, elder: 20 };
exports.STAGES = ['egg', 'hatchling', 'young', 'adult', 'elder'];
var stageXp = function (stage) { return xpForLevel(FIRST_LEVEL[stage]); };
exports.stageXp = stageXp;
var stageState = function (stage, now) {
    var _a = [exports.STAGES.indexOf(stage), exports.STAGES.indexOf(now)], at = _a[0], here = _a[1];
    if (at === here)
        return 'now';
    return at < here ? 'done' : 'locked';
};
exports.stageState = stageState;
