"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var hold_1 = require("./hold");
var git = function (over) { return (__assign({ isRepo: true, branch: 'task/x', isDetached: false, head: 'abc1234', uncommitted: 0, unpushed: 0, hasUpstream: true }, over)); };
(0, vitest_1.describe)('what holds a Start, and the command to copy', function () {
    vitest_1.it.each([
        ['files not committed', git({ uncommitted: 2 }), 'uncommitted', 'git status'],
        ['files come first when there are commits to push too', git({ uncommitted: 2, unpushed: 1 }), 'uncommitted', 'git status'],
        ['commits not pushed', git({ unpushed: 1 }), 'unpushed', 'git push'],
        ['a branch never pushed', git({ unpushed: 1, hasUpstream: false }), 'neverPushed', 'git push -u origin task/x'],
        ['a detached HEAD', git({ isDetached: true, branch: null }), 'detached', 'git switch <branch>'],
    ])('%s', function (_, state, kind, command) {
        (0, vitest_1.expect)((0, hold_1.holdKindOf)(state)).toBe(kind);
        (0, vitest_1.expect)((0, hold_1.holdCommandOf)(state)).toBe(command);
    });
});
