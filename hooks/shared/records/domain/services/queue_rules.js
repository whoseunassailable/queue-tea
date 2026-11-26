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
exports.removeTask = exports.setPriority = exports.newTask = exports.currentTask = exports.taskFolder = exports.suggestion = exports.orderQueue = exports.PRIORITY_ORDER = void 0;
var helpers_1 = require("./helpers");
exports.PRIORITY_ORDER = ['urgent', 'high', 'mid', 'okay', 'low'];
// Queued tasks only: priority first, then oldest first.
var orderQueue = function (tasks) {
    return tasks
        .filter(function (t) { return t.state === 'queued'; })
        .sort(function (a, b) {
        return exports.PRIORITY_ORDER.indexOf(a.priority) - exports.PRIORITY_ORDER.indexOf(b.priority) ||
            Date.parse(a.created) - Date.parse(b.created);
    });
};
exports.orderQueue = orderQueue;
var suggestion = function (tasks) { var _a; return (_a = (0, exports.orderQueue)(tasks)[0]) !== null && _a !== void 0 ? _a : null; };
exports.suggestion = suggestion;
var taskFolder = function (task, projectPath) { var _a; return (_a = task.worktreePath) !== null && _a !== void 0 ? _a : projectPath; };
exports.taskFolder = taskFolder;
// A terminal only owns the task in its checkout. The app may ask for the
// first active task when no terminal context is supplied.
var currentTask = function (tasks, place) { var _a; return (_a = tasks.find(function (t) { return t.state === 'current' && (place == null || (0, exports.taskFolder)(t, place.projectPath) === place.cwd); })) !== null && _a !== void 0 ? _a : null; };
exports.currentTask = currentTask;
var newTask = function (input) {
    var _a;
    return ({
        id: input.id,
        title: input.title,
        state: 'queued',
        priority: input.priority,
        difficulty: { expected: input.difficulty, actual: null },
        messages: input.messages,
        handoff: null,
        branch: null,
        baseBranch: null,
        startCommit: null,
        blockedBy: [],
        blockedReason: null,
        checkpoint: null,
        created: input.now,
        started: null,
        finished: null,
        minutesByDay: {},
        effort: {
            understandingMessages: 0,
            improvingMessages: 0,
            filesRead: 0,
            filesChanged: 0,
            linesAdded: 0,
            linesRemoved: 0,
            filesTouched: 0,
        },
        files: { read: [], changed: [] },
        parentId: (_a = input.parentId) !== null && _a !== void 0 ? _a : null,
        description: null,
        criteria: [],
        review: null,
        helpers: (0, helpers_1.defaultHelpers)(),
        codexSince: null,
        worktreePath: null,
    });
};
exports.newTask = newTask;
var setPriority = function (tasks, id, priority) {
    return tasks.map(function (t) { return (t.id === id ? __assign(__assign({}, t), { priority: priority }) : t); });
};
exports.setPriority = setPriority;
// Only a queued task can be removed. The tasks under it are then on their own.
var removeTask = function (tasks, id) {
    if (!tasks.some(function (t) { return t.id === id && t.state === 'queued'; }))
        return tasks;
    return tasks.map(function (t) { return (t.id === id ? __assign(__assign({}, t), { state: 'removed' }) : t.parentId === id ? __assign(__assign({}, t), { parentId: null }) : t); });
};
exports.removeTask = removeTask;
