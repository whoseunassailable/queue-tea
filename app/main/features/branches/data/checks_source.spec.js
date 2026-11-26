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
var constants_1 = require("../domain/constants");
var checks_source_1 = require("./checks_source");
var choice = { id: 'current-definition', name: 'test', folder: '.', command: 'npm test' };
var run = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 'run', checkId: choice.id, name: 'test', command: 'npm test', tree: 'tree-one', at: 1, finished: 2, owner: 1, status: 'succeeded', output: 'passed', exitCode: 0, truncated: false }, over));
};
(0, vitest_1.it)('requires a current passing check and treats a later failure or cancellation as authoritative', function () {
    (0, vitest_1.expect)((0, checks_source_1.checksPassed)([], 'tree-one', [choice])).toBe(false);
    (0, vitest_1.expect)((0, checks_source_1.checksPassed)([run()], 'tree-two', [choice])).toBe(false);
    (0, vitest_1.expect)((0, checks_source_1.checksPassed)([run({ checkId: 'obsolete-definition' })], 'tree-one', [choice])).toBe(false);
    (0, vitest_1.expect)((0, checks_source_1.checksPassed)([run()], 'tree-one', [choice])).toBe(true);
    for (var _i = 0, _a = ['failed', 'cancelled', 'running', 'interrupted', 'setupRequired']; _i < _a.length; _i++) {
        var status_1 = _a[_i];
        (0, vitest_1.expect)((0, checks_source_1.checksPassed)([run(), run({ status: status_1 })], 'tree-one', [choice])).toBe(false);
    }
    (0, vitest_1.expect)((0, checks_source_1.checksPassed)([run({ status: 'failed' }), run()], 'tree-one', [choice])).toBe(true);
});
(0, vitest_1.it)('permits review when the project has no configured checks', function () {
    (0, vitest_1.expect)((0, checks_source_1.checksPassed)([], 'tree', [])).toBe(true);
});
(0, vitest_1.it)('finds the installed Node tools when launched from Finder with only system PATH', function () {
    var path = (0, constants_1.checkPath)('/example', '/usr/bin:/bin');
    (0, vitest_1.expect)(path).toContain('/opt/homebrew/bin');
    (0, vitest_1.expect)(path).toContain('/usr/local/bin');
    (0, vitest_1.expect)(path).toContain('/example/.local/bin');
});
