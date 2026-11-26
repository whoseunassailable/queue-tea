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
var testing_1 = require("claude-code/testing");
var effort_tracker_1 = require("../../../hooks/shared/effort/domain/services/effort_tracker");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
var MIN = 60000;
var T0 = Date.parse('2026-10-21T08:00:00Z');
(0, testing_1.test)('each file counts once', function () {
    var files = { read: [], changed: [] };
    files = (0, effort_tracker_1.countToolCall)(files, 'Read', { file_path: '/r/a.ts' });
    files = (0, effort_tracker_1.countToolCall)(files, 'Read', { file_path: '/r/a.ts' });
    files = (0, effort_tracker_1.countToolCall)(files, 'Edit', { file_path: '/r/a.ts' });
    files = (0, effort_tracker_1.countToolCall)(files, 'Grep', { pattern: 'x', path: '/r/lib' });
    files = (0, effort_tracker_1.countToolCall)(files, 'Glob', { pattern: '*.ts' });
    files = (0, effort_tracker_1.countToolCall)(files, 'Write', { file_path: '/r/b.ts' });
    files = (0, effort_tracker_1.countToolCall)(files, 'NotebookEdit', { notebook_path: '/r/n.ipynb' });
    files = (0, effort_tracker_1.countToolCall)(files, 'Bash', { command: 'cat /r/c.ts' });
    (0, testing_1.expect)(files).toEqual({ read: ['/r/a.ts', '/r/lib'], changed: ['/r/a.ts', '/r/b.ts', '/r/n.ipynb'] });
});
(0, testing_1.test)('the tracker counts gaps of up to 15 minutes, by local day', function () {
    var tracker = (0, effort_tracker_1.createTracker)(15, 120);
    tracker.activity(T0);
    tracker.activity(T0 + 5 * MIN);
    tracker.activity(T0 + 9 * MIN);
    tracker.activity(T0 + 40 * MIN); // a 31-minute gap: not counted
    tracker.activity(T0 + 42 * MIN);
    (0, testing_1.expect)(tracker.take().minutes).toEqual({ '2026-10-21': 11 });
    (0, testing_1.expect)(tracker.take().minutes).toEqual({});
});
(0, testing_1.test)('a turn flushes minutes, files and intents to the current task', function () {
    var tracker = (0, effort_tracker_1.createTracker)(15, 0);
    tracker.activity(T0);
    tracker.toolCall('Read', { file_path: '/r/a.ts' });
    tracker.toolCall('Edit', { file_path: '/r/b.ts' });
    tracker.intent('understanding');
    tracker.intent('improving');
    tracker.intent('improving');
    tracker.activity(T0 + 9 * MIN);
    var current = (0, helpers_1.makeTask)({ state: 'current', files: { read: ['/r/a.ts'], changed: [] } });
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [(0, helpers_1.makeTask)(), current] });
    var after = (0, effort_tracker_1.applyPending)(record, tracker.take());
    var task = after.tasks.find(function (t) { return t.id === current.id; });
    (0, testing_1.expect)(task.minutesByDay).toEqual({ '2026-10-21': 9 });
    (0, testing_1.expect)(task.files).toEqual({ read: ['/r/a.ts'], changed: ['/r/b.ts'] });
    (0, testing_1.expect)(task.effort.filesRead).toBe(1);
    (0, testing_1.expect)(task.effort.filesChanged).toBe(1);
    (0, testing_1.expect)(task.effort.understandingMessages).toBe(1);
    (0, testing_1.expect)(task.effort.improvingMessages).toBe(2);
    (0, testing_1.expect)(after.unassignedMinutesByDay).toEqual({});
});
(0, testing_1.test)('with no current task, minutes go to the project and nothing else changes', function () {
    var tracker = (0, effort_tracker_1.createTracker)(15, 0);
    tracker.activity(T0);
    tracker.toolCall('Read', { file_path: '/r/a.ts' });
    tracker.intent('understanding');
    tracker.activity(T0 + 4 * MIN);
    var queued = (0, helpers_1.makeTask)();
    var after = (0, effort_tracker_1.applyPending)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [queued] }), tracker.take());
    (0, testing_1.expect)(after.unassignedMinutesByDay).toEqual({ '2026-10-21': 4 });
    (0, testing_1.expect)(after.tasks[0]).toEqual(queued);
});
(0, testing_1.test)("with Codex on the current task, the session's minutes go to the project and the task is left as it was", function () {
    var tracker = (0, effort_tracker_1.createTracker)(15, 0);
    tracker.activity(T0);
    tracker.toolCall('Read', { file_path: '/r/a.ts' });
    tracker.toolCall('Edit', { file_path: '/r/b.ts' });
    tracker.intent('improving');
    tracker.activity(T0 + 4 * MIN);
    var withCodex = (0, helpers_1.makeTask)({ state: 'current', codexSince: '2026-10-21T09:00:00+02:00', minutesByDay: { '2026-10-21': 2 } });
    var after = (0, effort_tracker_1.applyPending)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [withCodex] }), tracker.take());
    (0, testing_1.expect)(after.unassignedMinutesByDay).toEqual({ '2026-10-21': 4 });
    (0, testing_1.expect)(after.tasks[0]).toEqual(withCodex);
});
(0, testing_1.test)('parallel sessions charge time and files only to their own quest', function () {
    var tasks = [(0, helpers_1.makeTask)({ id: 'one', state: 'current', worktreePath: '/worktrees/one' }), (0, helpers_1.makeTask)({ id: 'two', state: 'current', worktreePath: '/worktrees/two' })];
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks });
    for (var _i = 0, _a = [['two', 9], ['one', 4]]; _i < _a.length; _i++) {
        var _b = _a[_i], id = _b[0], minutes = _b[1];
        var tracker = (0, effort_tracker_1.createTracker)(15, 0);
        tracker.activity(T0);
        tracker.toolCall('Edit', { file_path: "/worktrees/".concat(id, "/file.ts") });
        tracker.activity(T0 + minutes * MIN);
        record = (0, effort_tracker_1.applyPending)(record, tracker.take(), undefined, { projectPath: '/p', cwd: "/worktrees/".concat(id) });
    }
    (0, testing_1.expect)(record.tasks[0].minutesByDay).toEqual({ '2026-10-21': 4 });
    (0, testing_1.expect)(record.tasks[1].minutesByDay).toEqual({ '2026-10-21': 9 });
    (0, testing_1.expect)(record.tasks[0].files.changed).toEqual(['/worktrees/one/file.ts']);
    (0, testing_1.expect)(record.tasks[1].files.changed).toEqual(['/worktrees/two/file.ts']);
    (0, testing_1.expect)(record.unassignedMinutesByDay).toEqual({});
});
var flushed = function (testPeriods, stamps, minutesInChecks) {
    var tracker = (0, effort_tracker_1.createTracker)(15, 0);
    for (var _i = 0, stamps_1 = stamps; _i < stamps_1.length; _i++) {
        var at = stamps_1[_i];
        tracker.activity(T0 + at * MIN);
    }
    var current = (0, helpers_1.makeTask)(__assign(__assign({ state: 'current' }, (testPeriods === undefined ? {} : { testPeriods: testPeriods })), (minutesInChecks === undefined ? {} : { minutesInChecks: minutesInChecks })));
    return (0, effort_tracker_1.applyPending)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] }), tracker.take()).tasks[0];
};
var span = function (from, to) { return ({ start: T0 + from * MIN, end: T0 + to * MIN }); };
(0, testing_1.test)("the clock's minutes inside a check count as in checks; the rest is building", function () {
    var task = flushed([span(2, 5)], [0, 10]);
    (0, testing_1.expect)(task.minutesByDay).toEqual({ '2026-10-21': 10 });
    (0, testing_1.expect)(task.minutesInChecks).toBe(3);
});
(0, testing_1.test)('a long check across an idle gap counts only the minutes the clock kept', function () {
    // The check runs an hour; the clock skips the 35 idle minutes inside it.
    var task = flushed([span(0, 60)], [0, 5, 40, 45]);
    (0, testing_1.expect)(task.minutesByDay).toEqual({ '2026-10-21': 10 });
    (0, testing_1.expect)(task.minutesInChecks).toBe(10);
});
(0, testing_1.test)('minutes in checks add to the earlier turns’ count, to two decimals', function () {
    var task = flushed([{ start: T0, end: T0 + 20000 }], [0, 10], 1.5);
    (0, testing_1.expect)(task.minutesInChecks).toBe(1.83);
});
(0, testing_1.test)('a turn with no check in its time leaves minutes in checks as it was', function () {
    (0, testing_1.expect)(flushed([span(20, 30)], [0, 10]).minutesInChecks).toBeUndefined();
    (0, testing_1.expect)(flushed(undefined, [0, 10]).minutesInChecks).toBeUndefined();
    (0, testing_1.expect)(flushed([span(20, 30)], [0, 10], 4).minutesInChecks).toBe(4);
});
