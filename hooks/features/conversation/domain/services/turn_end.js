"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turnEnd = void 0;
var allowance_1 = require("./allowance");
// What the end of a turn calls for: a fresh conversation past the size, or a
// handoff note once per reset window at the allowance mark.
var turnEnd = function (reading, ctx, handedOffFor) {
    if ((0, allowance_1.shouldFresh)(reading.tokens, ctx.options.freshAtTokens))
        return 'fresh';
    var a = reading.allowance;
    return a !== null && (0, allowance_1.shouldHandoff)(a.percent, ctx.options.handoffAtPercent, handedOffFor, a.resetsAt) ? 'note' : 'none';
};
exports.turnEnd = turnEnd;
