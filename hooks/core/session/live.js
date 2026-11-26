"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.live = void 0;
var options_1 = require("./options");
// The session's own: where it works, its options, whether a turn runs, and
// what the app is told. A reload starts them over.
exports.live = {
    opts: (0, options_1.readOptions)({}),
    ctx: null,
    isTurnRunning: false,
    sessionId: null,
    startedAt: null,
    recordSeenAt: null,
};
