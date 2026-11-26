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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetLabel = exports.nextBudget = exports.BUDGETS = exports.canWaitFor = exports.blockedTasks = exports.suggest = exports.rankBacklog = exports.estimateMinutes = exports.typicalMinutes = exports.effectivePriority = exports.waitingFor = exports.wouldLoop = exports.blockedText = exports.isBlocked = exports.blockersOf = exports.formatSpan = exports.SHORT_MINUTES = void 0;
var queue_rules_1 = require("../../../records/domain/services/queue_rules");
var time_1 = require("../../../time/domain/services/time");
// What decides the order of the backlog: what blocks what, how long a task
// needs, and which one to suggest. Pure; the panel and the flow call it.
var DEFAULT_MINUTES = { light: 30, medium: 90, hard: 240 };
exports.SHORT_MINUTES = 30;
var LEAST_MINUTES = 10;
// "30m", "1h", "1h 30m": whole hours without their "0m".
var formatSpan = function (m) { return (m >= 60 && m % 60 === 0 ? "".concat(m / 60, "h") : (0, time_1.formatMinutes)(m)); };
exports.formatSpan = formatSpan;
var isOpen = function (t) { return t.state === 'queued' || t.state === 'current'; };
var total = function (t) { return Object.values(t.minutesByDay).reduce(function (a, b) { return a + b; }, 0); };
// The unfinished tasks a task waits for. One done or removed stops blocking.
var blockersOf = function (task, tasks) {
    return task.blockedBy
        .map(function (id) { return tasks.find(function (t) { return t.id === id; }); })
        .filter(function (t) { return t !== undefined && isOpen(t); });
};
exports.blockersOf = blockersOf;
var isBlocked = function (task, tasks) {
    return task.blockedReason !== null || (0, exports.blockersOf)(task, tasks).length > 0;
};
exports.isBlocked = isBlocked;
// Why a task is blocked, in plain words.
var blockedText = function (task, tasks) {
    var waits = (0, exports.blockersOf)(task, tasks);
    return __spreadArray(__spreadArray([], (task.blockedReason === null ? [] : [task.blockedReason]), true), (waits.length === 0 ? [] : ["waits for ".concat(waits.map(function (t) { return t.title; }).join(', '))]), true).join(' · ');
};
exports.blockedText = blockedText;
// True when `taskId` waiting for `blockerId` would close a loop: the blocker
// already waits, directly or not, for the task.
var wouldLoop = function (tasks, taskId, blockerId) {
    var _a, _b;
    var seen = new Set();
    var stack = [blockerId];
    var _loop_1 = function () {
        var id = stack.pop();
        if (id === taskId)
            return { value: true };
        if (seen.has(id))
            return "continue";
        seen.add(id);
        stack.push.apply(stack, ((_b = (_a = tasks.find(function (t) { return t.id === id; })) === null || _a === void 0 ? void 0 : _a.blockedBy) !== null && _b !== void 0 ? _b : []));
    };
    while (stack.length > 0) {
        var state_1 = _loop_1();
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
};
exports.wouldLoop = wouldLoop;
// The unfinished tasks that wait for this one, directly or not.
var waitingFor = function (task, tasks) {
    var found = [];
    var seen = new Set([task.id]);
    var stack = [task.id];
    while (stack.length > 0) {
        var id = stack.pop();
        for (var _i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
            var t = tasks_1[_i];
            if (isOpen(t) && t.blockedBy.includes(id) && !seen.has(t.id)) {
                seen.add(t.id);
                found.push(t);
                stack.push(t.id);
            }
        }
    }
    return found;
};
exports.waitingFor = waitingFor;
// A task's priority, raised to the highest of the tasks waiting for it.
var effectivePriority = function (task, tasks) {
    return __spreadArray([task], (0, exports.waitingFor)(task, tasks), true).map(function (t) { return t.priority; })
        .reduce(function (best, p) { return (queue_rules_1.PRIORITY_ORDER.indexOf(p) < queue_rules_1.PRIORITY_ORDER.indexOf(best) ? p : best); });
};
exports.effectivePriority = effectivePriority;
// The usual time for a difficulty here: the middle value of this project's
// finished tasks of that difficulty, once there are three.
var typicalMinutes = function (tasks, difficulty) {
    var done = tasks
        .filter(function (t) { var _a; return t.state === 'done' && ((_a = t.difficulty.actual) !== null && _a !== void 0 ? _a : t.difficulty.expected) === difficulty; })
        .map(total)
        .filter(function (m) { return m > 0; })
        .sort(function (a, b) { return a - b; });
    if (done.length < 3)
        return DEFAULT_MINUTES[difficulty];
    var mid = Math.floor(done.length / 2);
    return done.length % 2 === 1 ? done[mid] : Math.round((done[mid - 1] + done[mid]) / 2);
};
exports.typicalMinutes = typicalMinutes;
// The time a task still needs: the usual time for its expected difficulty,
// less the time it already had.
var estimateMinutes = function (task, tasks) {
    return Math.max(LEAST_MINUTES, (0, exports.typicalMinutes)(tasks, task.difficulty.expected) - total(task));
};
exports.estimateMinutes = estimateMinutes;
// The tasks that can start, in the order to take them. The first is the
// suggestion: Play next, then what fits the time Rohan has, then priority
// (raised by the tasks waiting), then what unblocks more, then a feature's
// own tasks before the feature, then the oldest. With a time set and nothing
// fitting, the shortest come first.
var rankBacklog = function (record, budget) {
    var tasks = record.tasks;
    // Features with tasks still open under them.
    var leading = new Set(tasks.filter(function (t) { return t.parentId !== null && isOpen(t); }).map(function (t) { return t.parentId; }));
    var rows = tasks
        .filter(function (t) { return t.state === 'queued' && !(0, exports.isBlocked)(t, tasks); })
        .map(function (task) {
        var estimate = (0, exports.estimateMinutes)(task, tasks);
        return {
            task: task,
            estimate: estimate,
            isShort: estimate <= exports.SHORT_MINUTES,
            fits: budget === null ? null : estimate <= budget,
            priority: (0, exports.effectivePriority)(task, tasks),
            unblocks: (0, exports.waitingFor)(task, tasks),
            why: '',
        };
    });
    var isNext = function (r) { return Number(r.task.id === record.playNext); };
    var rank = function (r) { return queue_rules_1.PRIORITY_ORDER.indexOf(r.priority); };
    rows.sort(function (a, b) {
        return isNext(b) - isNext(a) ||
            Number(b.fits === true) - Number(a.fits === true) ||
            (a.fits === false && b.fits === false ? a.estimate - b.estimate : 0) ||
            rank(a) - rank(b) ||
            b.unblocks.length - a.unblocks.length ||
            Number(leading.has(a.task.id)) - Number(leading.has(b.task.id)) ||
            Date.parse(a.task.created) - Date.parse(b.task.created);
    });
    return rows.map(function (r) { return (__assign(__assign({}, r), { why: whyOf(r, record.playNext, budget) })); });
};
exports.rankBacklog = rankBacklog;
var whyOf = function (r, playNext, budget) {
    if (r.task.id === playNext)
        return 'you chose Play next';
    var first = r.unblocks[0];
    return __spreadArray(__spreadArray([
        r.priority === r.task.priority ? r.priority : "".concat(r.priority, ", from what waits for it")
    ], (first === undefined ? [] : ["unblocks ".concat(first.title).concat(r.unblocks.length > 1 ? " +".concat(r.unblocks.length - 1) : '')]), true), (budget === null ? [] : [r.fits ? "fits ".concat((0, exports.formatSpan)(budget)) : "nothing fits ".concat((0, exports.formatSpan)(budget), "; the shortest")]), true).join(' · ');
};
// The suggestion (★), or null when nothing can start.
var suggest = function (record, budget) { var _a, _b; return (_b = (_a = (0, exports.rankBacklog)(record, budget)[0]) === null || _a === void 0 ? void 0 : _a.task) !== null && _b !== void 0 ? _b : null; };
exports.suggest = suggest;
// Queued tasks that are blocked, oldest first.
var blockedTasks = function (tasks) {
    return tasks
        .filter(function (t) { return t.state === 'queued' && (0, exports.isBlocked)(t, tasks); })
        .sort(function (a, b) { return Date.parse(a.created) - Date.parse(b.created); });
};
exports.blockedTasks = blockedTasks;
// The tasks `taskId` can be set to wait for: unfinished, not itself, not one
// that would close a loop, not one it already waits for.
var canWaitFor = function (tasks, taskId) {
    return tasks.filter(function (t) {
        var _a, _b;
        return isOpen(t) &&
            t.id !== taskId &&
            !((_b = (_a = tasks.find(function (x) { return x.id === taskId; })) === null || _a === void 0 ? void 0 : _a.blockedBy.includes(t.id)) !== null && _b !== void 0 ? _b : false) &&
            !(0, exports.wouldLoop)(tasks, taskId, t.id);
    });
};
exports.canWaitFor = canWaitFor;
// The choices for "Time I have", in the order `t` steps through them.
exports.BUDGETS = [null, 30, 60, 120];
var nextBudget = function (budget) { var _a; return (_a = exports.BUDGETS[(exports.BUDGETS.indexOf(budget) + 1) % exports.BUDGETS.length]) !== null && _a !== void 0 ? _a : null; };
exports.nextBudget = nextBudget;
var budgetLabel = function (budget) { return (budget === null ? 'any' : (0, exports.formatSpan)(budget)); };
exports.budgetLabel = budgetLabel;
