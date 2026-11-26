"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var queue_rules_1 = require("../../../../hooks/shared/records/domain/services/queue_rules");
var helpers_1 = require("../../../helpers");
var at = function (minute) { return "2026-10-21T10:".concat(String(minute).padStart(2, '0'), ":00+02:00"); };
(0, testing_1.test)('urgent before high before mid before okay before low', function () {
    var tasks = [
        (0, helpers_1.makeTask)({ title: 'low', priority: 'low', created: at(1) }),
        (0, helpers_1.makeTask)({ title: 'okay', priority: 'okay', created: at(2) }),
        (0, helpers_1.makeTask)({ title: 'mid', priority: 'mid', created: at(3) }),
        (0, helpers_1.makeTask)({ title: 'high', priority: 'high', created: at(4) }),
        (0, helpers_1.makeTask)({ title: 'urgent', priority: 'urgent', created: at(5) }),
    ];
    (0, testing_1.expect)((0, queue_rules_1.orderQueue)(tasks).map(function (t) { return t.title; })).toEqual(['urgent', 'high', 'mid', 'okay', 'low']);
});
(0, testing_1.test)('same priority: oldest first', function () {
    var tasks = [
        (0, helpers_1.makeTask)({ title: 'newer', priority: 'high', created: at(9) }),
        (0, helpers_1.makeTask)({ title: 'older', priority: 'high', created: at(2) }),
    ];
    (0, testing_1.expect)((0, queue_rules_1.orderQueue)(tasks).map(function (t) { return t.title; })).toEqual(['older', 'newer']);
});
(0, testing_1.test)('only queued tasks are in the queue', function () {
    var tasks = [
        (0, helpers_1.makeTask)({ title: 'q' }),
        (0, helpers_1.makeTask)({ title: 'c', state: 'current' }),
        (0, helpers_1.makeTask)({ title: 'd', state: 'done' }),
        (0, helpers_1.makeTask)({ title: 'r', state: 'removed' }),
    ];
    (0, testing_1.expect)((0, queue_rules_1.orderQueue)(tasks).map(function (t) { return t.title; })).toEqual(['q']);
});
(0, testing_1.test)('suggestion is the first of the queue, null when empty', function () {
    var _a;
    var tasks = [
        (0, helpers_1.makeTask)({ title: 'later', priority: 'low' }),
        (0, helpers_1.makeTask)({ title: 'first', priority: 'urgent' }),
    ];
    (0, testing_1.expect)((_a = (0, queue_rules_1.suggestion)(tasks)) === null || _a === void 0 ? void 0 : _a.title).toBe('first');
    (0, testing_1.expect)((0, queue_rules_1.suggestion)([])).toBeNull();
});
(0, testing_1.test)('currentTask finds the current one, null when none', function () {
    var _a;
    var tasks = [(0, helpers_1.makeTask)(), (0, helpers_1.makeTask)({ title: 'now', state: 'current' })];
    (0, testing_1.expect)((_a = (0, queue_rules_1.currentTask)(tasks)) === null || _a === void 0 ? void 0 : _a.title).toBe('now');
    (0, testing_1.expect)((0, queue_rules_1.currentTask)([(0, helpers_1.makeTask)()])).toBeNull();
});
(0, testing_1.test)('removeTask marks a queued task removed and leaves a current one alone', function () {
    var _a, _b;
    var queued = (0, helpers_1.makeTask)();
    var current = (0, helpers_1.makeTask)({ state: 'current' });
    var tasks = [queued, current];
    (0, testing_1.expect)((_a = (0, queue_rules_1.removeTask)(tasks, queued.id).find(function (t) { return t.id === queued.id; })) === null || _a === void 0 ? void 0 : _a.state).toBe('removed');
    (0, testing_1.expect)((_b = (0, queue_rules_1.removeTask)(tasks, current.id).find(function (t) { return t.id === current.id; })) === null || _b === void 0 ? void 0 : _b.state).toBe('current');
});
(0, testing_1.test)('setPriority moves a task in the order', function () {
    var a = (0, helpers_1.makeTask)({ title: 'a', priority: 'high', created: at(1) });
    var b = (0, helpers_1.makeTask)({ title: 'b', priority: 'low', created: at(2) });
    (0, testing_1.expect)((0, queue_rules_1.orderQueue)((0, queue_rules_1.setPriority)([a, b], b.id, 'urgent')).map(function (t) { return t.title; })).toEqual(['b', 'a']);
});
(0, testing_1.test)('newTask is queued with empty time and effort', function () {
    var task = (0, queue_rules_1.newTask)({
        title: 'Retry button',
        priority: 'high',
        difficulty: 'light',
        messages: ['add a retry button'],
        now: at(0),
        id: 't-0000abcd',
    });
    (0, testing_1.expect)(task.state).toBe('queued');
    (0, testing_1.expect)(task.difficulty).toEqual({ expected: 'light', actual: null });
    (0, testing_1.expect)(task.created).toBe(at(0));
    (0, testing_1.expect)(task.minutesByDay).toEqual({});
    (0, testing_1.expect)(task.effort.linesAdded).toBe(0);
    (0, testing_1.expect)(task.files).toEqual({ read: [], changed: [] });
});
(0, testing_1.test)('currentTask matches the session folder, with legacy tasks in the main checkout', function () {
    var _a, _b;
    var legacy = (0, helpers_1.makeTask)({ id: 'legacy', state: 'current' });
    var one = (0, helpers_1.makeTask)({ id: 'one', state: 'current', worktreePath: '/worktrees/one' });
    var two = (0, helpers_1.makeTask)({ id: 'two', state: 'current', worktreePath: '/worktrees/two' });
    var tasks = [legacy, one, two];
    (0, testing_1.expect)((_a = (0, queue_rules_1.currentTask)(tasks, { projectPath: '/p', cwd: '/p' })) === null || _a === void 0 ? void 0 : _a.id).toBe('legacy');
    (0, testing_1.expect)((_b = (0, queue_rules_1.currentTask)(tasks, { projectPath: '/p', cwd: '/worktrees/two' })) === null || _b === void 0 ? void 0 : _b.id).toBe('two');
    (0, testing_1.expect)((0, queue_rules_1.currentTask)(tasks, { projectPath: '/p', cwd: '/another' })).toBeNull();
});
