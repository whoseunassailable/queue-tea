"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFlowKey = void 0;
// Acts on a key meant for the quest in hand, on either page, and says whether
// it was one. Keys for something that can't happen now do nothing.
var runFlowKey = function (key, view, flow, actions) {
    var active = view.active;
    var isFree = active !== null && active.asking !== 'putBack';
    if (key.kind === 'checkAgain') {
        if ((flow === null || flow === void 0 ? void 0 : flow.kind) === 'held' || (flow === null || flow === void 0 ? void 0 : flow.kind) === 'refused' || (flow === null || flow === void 0 ? void 0 : flow.kind) === 'openFailed')
            actions.onCheckAgain();
    }
    else if (key.kind === 'cancel') {
        if (flow !== undefined)
            actions.onCancel();
    }
    else if (key.kind === 'open') {
        if (active !== null)
            actions.onOpenClaude(active);
    }
    else if (key.kind === 'finish') {
        if (isFree)
            actions.onFinish(active);
    }
    else if (key.kind === 'back') {
        if (isFree)
            actions.onBack(active);
    }
    else if (key.kind === 'yes') {
        if ((active === null || active === void 0 ? void 0 : active.review) != null)
            actions.onFinish(active);
    }
    else if (key.kind === 'notYet') {
        if ((active === null || active === void 0 ? void 0 : active.review) != null)
            actions.onNotYet(active);
    }
    else if (key.kind === 'time')
        actions.onStepBudget();
    else
        return false;
    return true;
};
exports.runFlowKey = runFlowKey;
