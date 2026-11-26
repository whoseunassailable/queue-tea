"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askingLine = exports.stepLine = void 0;
var en_1 = require("../../../l10n/en");
// The working line for what Start is about to do.
var stepLine = function (step) {
    if (step.kind === 'noRepo')
        return en_1.t.flow.settingOut;
    return step.kind === 'switch' ? en_1.t.flow.switching(step.branch) : en_1.t.flow.making(step.branch, step.from);
};
exports.stepLine = stepLine;
// What the card says while a session has yet to act on what it was asked,
// or null when nothing waits on it.
var askingLine = function (active, session) {
    if (active.asking === null)
        return null;
    var isBegin = active.asking === 'begin';
    if (session === 'none')
        return isBegin ? en_1.t.flow.takesWhenOpen : en_1.t.flow.noSessionToSave;
    if (session === 'working')
        return isBegin ? en_1.t.flow.takesWhenTurnEnds : en_1.t.flow.savesWhenTurnEnds;
    return isBegin ? en_1.t.flow.handing : en_1.t.flow.saving;
};
exports.askingLine = askingLine;
