"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoldReward = exports.XpReward = exports.PriorityTag = void 0;
var en_1 = require("../../l10n/en");
var PriorityTag = function (_a) {
    var priority = _a.priority;
    return <span class={"tag ".concat(priority)}>{en_1.t.priority[priority]}</span>;
};
exports.PriorityTag = PriorityTag;
var XpReward = function (_a) {
    var xp = _a.xp;
    return <span class="reward xp">{en_1.t.quest.xp(xp)}</span>;
};
exports.XpReward = XpReward;
var GoldReward = function (_a) {
    var gold = _a.gold;
    return <span class="reward gold">{en_1.t.quest.gold(gold)}</span>;
};
exports.GoldReward = GoldReward;
