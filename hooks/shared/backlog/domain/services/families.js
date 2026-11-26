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
exports.groupBacklog = exports.guessParent = exports.namedTasks = exports.loneTasks = exports.filingCandidates = exports.setParent = exports.parentChoices = exports.parentRefusal = exports.activeFeature = exports.progressText = exports.progressOf = exports.childrenOf = exports.parentOf = void 0;
var ranking_1 = require("./ranking");
// Features and their tasks: a task can be filed under another, one level
// deep, and the backlog shows each feature with its tasks under it. Pure; the
// flow, the message check and the menu call it.
var isOpen = function (t) { return t.state === 'queued' || t.state === 'current'; };
// At most this many features are offered when a task is filed.
var MAX_CHOICES = 5;
// The task a task is part of; null when it is on its own or its feature was
// removed.
var parentOf = function (task, tasks) {
    if (task.parentId === null)
        return null;
    var parent = tasks.find(function (t) { return t.id === task.parentId; });
    return parent === undefined || parent.state === 'removed' ? null : parent;
};
exports.parentOf = parentOf;
// The tasks filed under a task, the removed ones left out.
var childrenOf = function (task, tasks) {
    return tasks.filter(function (t) { return t.parentId === task.id && t.state !== 'removed'; });
};
exports.childrenOf = childrenOf;
var progressOf = function (parent, tasks) {
    var children = (0, exports.childrenOf)(parent, tasks);
    return {
        done: children.filter(function (t) { return t.state === 'done'; }).length,
        total: children.length,
        current: children.filter(function (t) { return t.state === 'current'; }).length,
        blocked: children.filter(function (t) { return t.state === 'queued' && (0, ranking_1.isBlocked)(t, tasks); }).length,
    };
};
exports.progressOf = progressOf;
// "2/5 done ▰▰▱▱▱", then what is in progress and blocked.
var progressText = function (p) {
    var filled = p.total === 0 ? 0 : Math.round((p.done / p.total) * 5);
    return __spreadArray(__spreadArray([
        "".concat(p.done, "/").concat(p.total, " done ").concat('▰'.repeat(filled)).concat('▱'.repeat(5 - filled))
    ], (p.current > 0 ? ["".concat(p.current, " in progress")] : []), true), (p.blocked > 0 ? ["".concat(p.blocked, " blocked")] : []), true).join(' · ');
};
exports.progressText = progressText;
// The active feature, while it is open and on its own.
var activeFeature = function (record) {
    var task = record.feature === null ? undefined : record.tasks.find(function (t) { return t.id === record.feature; });
    return task !== undefined && isOpen(task) && (0, exports.parentOf)(task, record.tasks) === null ? task : null;
};
exports.activeFeature = activeFeature;
// Why `childId` can't be filed under `parentId`, in plain words; null when it
// can. The child may be one not saved yet.
var parentRefusal = function (tasks, childId, parentId) {
    var parent = tasks.find(function (t) { return t.id === parentId; });
    var child = tasks.find(function (t) { return t.id === childId; });
    if (parent === undefined || !isOpen(parent))
        return 'That feature is no longer open.';
    if (childId === parentId)
        return "A task can't be part of itself.";
    var above = (0, exports.parentOf)(parent, tasks);
    if (above !== null)
        return "".concat(parent.title, " is part of ").concat(above.title, ", so its tasks go under that.");
    if (child !== undefined && (0, exports.childrenOf)(child, tasks).length > 0) {
        return "".concat(child.title, " has tasks of its own, so it can't be part of another.");
    }
    return null;
};
exports.parentRefusal = parentRefusal;
// The features a task can be moved under: every open task that would take
// it, but the one it is under now.
var parentChoices = function (tasks, taskId) {
    var task = tasks.find(function (t) { return t.id === taskId; });
    return tasks.filter(function (t) { return t.id !== (task === null || task === void 0 ? void 0 : task.parentId) && (0, exports.parentRefusal)(tasks, taskId, t.id) === null; });
};
exports.parentChoices = parentChoices;
var setParent = function (tasks, taskId, parentId) {
    return tasks.map(function (t) { return (t.id === taskId ? __assign(__assign({}, t), { parentId: parentId }) : t); });
};
exports.setParent = setParent;
// The features a new task is offered under: the active feature, the current
// task (or the feature it is part of), then the other open features, newest
// first.
var filingCandidates = function (record) {
    var _a, _b;
    var tasks = record.tasks;
    var current = (_a = tasks.find(function (t) { return t.state === 'current'; })) !== null && _a !== void 0 ? _a : null;
    var features = tasks
        .filter(function (t) { return isOpen(t) && (0, exports.childrenOf)(t, tasks).some(isOpen); })
        .sort(function (a, b) { return Date.parse(b.created) - Date.parse(a.created); });
    var offered = [];
    for (var _i = 0, _c = __spreadArray([(0, exports.activeFeature)(record), current === null ? null : ((_b = (0, exports.parentOf)(current, tasks)) !== null && _b !== void 0 ? _b : current)], features, true); _i < _c.length; _i++) {
        var t = _c[_i];
        if (t !== null && isOpen(t) && (0, exports.parentOf)(t, tasks) === null && !offered.includes(t))
            offered.push(t);
    }
    return offered.slice(0, MAX_CHOICES);
};
exports.filingCandidates = filingCandidates;
// The open tasks on their own that are not offered as features, newest
// first. The message check is shown them too: a broad task with nothing
// under it yet ("Fix the documentation") can take the first piece of it.
var loneTasks = function (record) {
    var offered = (0, exports.filingCandidates)(record);
    return record.tasks
        .filter(function (t) { return isOpen(t) && (0, exports.parentOf)(t, record.tasks) === null && !offered.includes(t); })
        .sort(function (a, b) { return Date.parse(b.created) - Date.parse(a.created); })
        .slice(0, MAX_CHOICES);
};
exports.loneTasks = loneTasks;
var words = function (text) { return " ".concat(text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(), " "); };
// The open tasks on their own that a message names: by id, or by the whole
// of a title of two words or more.
var namedTasks = function (text, tasks) {
    var said = words(text);
    var lower = text.toLowerCase();
    return tasks.filter(function (t) {
        if (!isOpen(t) || (0, exports.parentOf)(t, tasks) !== null)
            return false;
        var title = words(t.title);
        return lower.includes(t.id.toLowerCase()) || (title.trim().includes(' ') && said.includes(title));
    });
};
exports.namedTasks = namedTasks;
// Where a new task goes, before Rohan says. A feature the message names is
// picked; two named, or no clear sign, and Rohan is asked (parent null);
// otherwise the check's answer, with on its own when it gives none. With an
// active feature, only the check's "none" leaves Rohan unasked: the feature
// is never taken for granted. A task on its own the check ties the work to
// is offered and picked; when the check can't tell, those it was shown are
// offered. `said` is the check's answer, undefined when it gave none, null
// when no check ran. Null when there is nothing to offer.
var guessParent = function (record, text, said) {
    var candidates = (0, exports.filingCandidates)(record);
    var named = (0, exports.namedTasks)(text, record.tasks);
    var lone = (0, exports.loneTasks)(record);
    var tied = lone.filter(function (t) { return t.id === said; });
    var choices = __spreadArray([], new Set(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], named, true), tied, true), candidates, true), (said === 'unsure' ? lone : []), true).map(function (t) { return t.id; })), true);
    if (choices.length === 0)
        return null;
    if (named.length === 1)
        return { parent: { kind: 'task', id: named[0].id }, choices: choices };
    if (named.length > 1)
        return { parent: null, choices: named.map(function (t) { return t.id; }) };
    if (said != null && __spreadArray(__spreadArray([], tied, true), candidates, true).some(function (t) { return t.id === said; }))
        return { parent: { kind: 'task', id: said }, choices: choices };
    var isAsked = said === 'unsure' || ((0, exports.activeFeature)(record) !== null && said !== 'none');
    return { parent: isAsked ? null : { kind: 'none' }, choices: choices };
};
exports.guessParent = guessParent;
// The feature a backlog row is shown under: its own, or itself when tasks are
// under it; null on its own.
var groupOf = function (task, tasks) { var _a; return (_a = (0, exports.parentOf)(task, tasks)) !== null && _a !== void 0 ? _a : ((0, exports.childrenOf)(task, tasks).length > 0 ? task : null); };
// The backlog with each feature's tasks under it. A feature stands where the
// first of its tasks stands in the order, so the order of what can start is
// kept; a feature with nothing that can start stands among the blocked.
var groupBacklog = function (ranked, blocked, tasks) {
    var groups = new Map();
    var ready = [];
    var stuck = [];
    var place = function (parent, into) {
        var known = groups.get(parent.id);
        if (known !== undefined)
            return known;
        var group = { parent: parent, rows: [], blocked: [], hasStar: false };
        groups.set(parent.id, group);
        into.push({ kind: 'group', group: group });
        return group;
    };
    ranked.forEach(function (row, i) {
        var parent = groupOf(row.task, tasks);
        if (parent === null) {
            ready.push({ kind: 'task', row: row });
            return;
        }
        var group = place(parent, ready);
        group.rows.push(row);
        if (i === 0)
            group.hasStar = true;
    });
    for (var _i = 0, blocked_1 = blocked; _i < blocked_1.length; _i++) {
        var task = blocked_1[_i];
        var parent_1 = groupOf(task, tasks);
        if (parent_1 === null)
            stuck.push({ kind: 'blocked', task: task });
        else
            place(parent_1, stuck).blocked.push(task);
    }
    return { ready: ready, blocked: stuck };
};
exports.groupBacklog = groupBacklog;
