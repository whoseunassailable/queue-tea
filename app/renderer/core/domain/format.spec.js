"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_1 = require("./format");
var NOW = Date.parse('2026-10-27T17:50:00Z');
(0, vitest_1.describe)("whether Claude's allowance is used up", function () {
    (0, vitest_1.it)('is used up at 100% while the reset is still ahead', function () {
        (0, vitest_1.expect)((0, format_1.isClaudeOut)({ percent: 100, resetsAt: '2026-10-27T19:00:00Z' }, NOW)).toBe(true);
    });
    (0, vitest_1.it)('counts a reading over 100% as used up too', function () {
        (0, vitest_1.expect)((0, format_1.isClaudeOut)({ percent: 104, resetsAt: '2026-10-27T19:00:00Z' }, NOW)).toBe(true);
    });
    (0, vitest_1.it)('is used up at 100% when the reset is not known', function () {
        (0, vitest_1.expect)((0, format_1.isClaudeOut)({ percent: 100, resetsAt: null }, NOW)).toBe(true);
    });
    (0, vitest_1.it)('is not used up at 99%', function () {
        (0, vitest_1.expect)((0, format_1.isClaudeOut)({ percent: 99, resetsAt: '2026-10-27T19:00:00Z' }, NOW)).toBe(false);
    });
    (0, vitest_1.it)('is not used up once the reset has passed, or at the moment it comes', function () {
        (0, vitest_1.expect)((0, format_1.isClaudeOut)({ percent: 100, resetsAt: '2026-10-27T17:00:00Z' }, NOW)).toBe(false);
        (0, vitest_1.expect)((0, format_1.isClaudeOut)({ percent: 100, resetsAt: '2026-10-27T17:50:00Z' }, NOW)).toBe(false);
    });
    (0, vitest_1.it)('is not used up when nothing is known of the allowance', function () {
        (0, vitest_1.expect)((0, format_1.isClaudeOut)(null, NOW)).toBe(false);
    });
});
