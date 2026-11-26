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
var release_guard_mjs_1 = require("./release_guard.mjs");
var candidate = { version: 1, commit: 'a'.repeat(40), branch: 'main', integration: 'main', dirty: false, builtAt: '2026-11-04' };
(0, vitest_1.it)('prevents task, detached, dirty and untraceable builds from replacing production', function () {
    for (var _i = 0, _a = [null, __assign(__assign({}, candidate), { branch: 'task/feature' }), __assign(__assign({}, candidate), { branch: '' }), __assign(__assign({}, candidate), { dirty: true })]; _i < _a.length; _i++) {
        var c = _a[_i];
        (0, vitest_1.expect)((0, release_guard_mjs_1.releaseProblem)(c, null, function () { return true; })).not.toBeNull();
    }
});
(0, vitest_1.it)('requires the installed source history even when version numbers would permit an upgrade', function () {
    var ancestor = vitest_1.vi.fn(function () { return false; });
    (0, vitest_1.expect)((0, release_guard_mjs_1.releaseProblem)(candidate, { commit: 'b'.repeat(40) }, ancestor)).toContain('does not include');
    (0, vitest_1.expect)(ancestor).toHaveBeenCalledWith('b'.repeat(40), candidate.commit);
    (0, vitest_1.expect)((0, release_guard_mjs_1.releaseProblem)(candidate, { commit: 'b'.repeat(40) }, function () { return true; })).toBeNull();
});
