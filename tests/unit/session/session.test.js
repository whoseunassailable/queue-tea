"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var options_1 = require("../../../hooks/core/session/options");
(0, testing_1.test)('readOptions fills the defaults', function () {
    (0, testing_1.expect)((0, options_1.readOptions)({})).toEqual({
        idleGapMinutes: 15,
        freshAtTokens: 100000,
        handoffAtPercent: 90,
        checkTimeoutSeconds: 10,
    });
});
(0, testing_1.test)('readOptions keeps set numbers and drops nonsense', function () {
    (0, testing_1.expect)((0, options_1.readOptions)({ idleGapMinutes: 20, freshAtTokens: 'lots', handoffAtPercent: -5 })).toEqual({
        idleGapMinutes: 20,
        freshAtTokens: 100000,
        handoffAtPercent: 90,
        checkTimeoutSeconds: 10,
    });
});
