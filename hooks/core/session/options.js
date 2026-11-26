"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOptions = void 0;
var DEFAULTS = { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 };
var positive = function (value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
};
// The userConfig values, each a positive number or its default.
var readOptions = function (options) { return ({
    idleGapMinutes: positive(options.idleGapMinutes, DEFAULTS.idleGapMinutes),
    freshAtTokens: positive(options.freshAtTokens, DEFAULTS.freshAtTokens),
    handoffAtPercent: positive(options.handoffAtPercent, DEFAULTS.handoffAtPercent),
    checkTimeoutSeconds: positive(options.checkTimeoutSeconds, DEFAULTS.checkTimeoutSeconds),
}); };
exports.readOptions = readOptions;
