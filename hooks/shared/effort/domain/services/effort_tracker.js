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
exports.applyPending = exports.createTracker = exports.countToolCall = void 0;
var checkpoints_1 = require("../../../checkpoints/domain/services/checkpoints");
var queue_rules_1 = require("../../../records/domain/services/queue_rules");
var time_1 = require("../../../time/domain/services/time");
var realm_time_1 = require("../../../time/domain/services/realm_time");
var READS = { Read: 'file_path', Grep: 'path', Glob: 'path' };
var CHANGES = { Edit: 'file_path', Write: 'file_path', NotebookEdit: 'notebook_path' };
var once = function (list, path) {
    return typeof path === 'string' && path !== '' && !list.includes(path) ? __spreadArray(__spreadArray([], list, true), [path], false) : list;
};
// The files a tool call read or changed, each path once.
var countToolCall = function (files, tool, input) {
    var read = READS[tool];
    var changed = CHANGES[tool];
    if (read !== undefined)
        return __assign(__assign({}, files), { read: once(files.read, input[read]) });
    if (changed !== undefined)
        return __assign(__assign({}, files), { changed: once(files.changed, input[changed]) });
    return files;
};
exports.countToolCall = countToolCall;
var nothing = function (offsetMinutes) { return ({
    minutes: {},
    projectMinutes: {},
    taskPeriods: [],
    projectPeriods: [],
    offsetMinutes: offsetMinutes,
    files: { read: [], changed: [] },
    understanding: 0,
    improving: 0,
    commands: [],
}); };
// What happened since the last flush: time between activity, files touched by
// tool calls, and the kind of each message.
var createTracker = function (gapMinutes, offsetMinutes) {
    var last = null;
    var pending = nothing(offsetMinutes);
    var to = 'task';
    return {
        activity: function (nowMs) {
            var minutes = (0, time_1.accrue)(last, nowMs, gapMinutes);
            var day = (0, time_1.dayKey)(nowMs, offsetMinutes);
            if (minutes > 0 && to === 'task')
                pending.minutes = (0, time_1.addMinutes)(pending.minutes, day, minutes);
            if (minutes > 0 && to === 'project')
                pending.projectMinutes = (0, time_1.addMinutes)(pending.projectMinutes, day, minutes);
            if (minutes > 0)
                (to === 'task' ? pending.taskPeriods : pending.projectPeriods).push({ start: last, end: nowMs });
            last = nowMs;
        },
        // After a quick question time goes to the project, until the next task message.
        route: function (where) {
            to = where;
        },
        toolCall: function (tool, input) {
            pending.files = (0, exports.countToolCall)(pending.files, tool, input);
        },
        command: function (run) {
            pending.commands.push(run);
        },
        intent: function (intent) {
            if (intent === 'understanding')
                pending.understanding += 1;
            else
                pending.improving += 1;
        },
        take: function () {
            var taken = pending;
            pending = nothing(offsetMinutes);
            return taken;
        },
    };
};
exports.createTracker = createTracker;
// Adds what the tracker took to the current task, or its minutes to the
// project when no task is current or Codex has it. With `seen`, the task's checkpoint also
// gets the commands, the files changed and what git says now.
var applyPending = function (record, pending, seen, place) {
    var _a, _b;
    var current = (0, queue_rules_1.currentTask)(record.tasks, place);
    var unassigned = (0, time_1.mergeMinutes)(record.unassignedMinutesByDay, pending.projectMinutes);
    if (current === null || current.codexSince !== null) {
        var tracked_1 = (0, realm_time_1.recordRealmTime)(record, {
            onQuests: [], elsewhere: __spreadArray(__spreadArray([], pending.taskPeriods, true), pending.projectPeriods, true),
            minutesOnQuests: {}, minutesElsewhere: (0, time_1.mergeMinutes)(pending.minutes, pending.projectMinutes), offsetMinutes: pending.offsetMinutes,
        });
        return __assign(__assign({}, tracked_1), { unassignedMinutesByDay: (0, time_1.mergeMinutes)(unassigned, pending.minutes) });
    }
    var files = {
        read: pending.files.read.reduce(once, current.files.read),
        changed: pending.files.changed.reduce(once, current.files.changed),
    };
    // The clock skips long idle gaps, so building time is the clock's minutes
    // less those that fell inside a check, not less every check's whole run.
    var inChecks = (0, realm_time_1.overlapMinutes)(pending.taskPeriods, (_a = current.testPeriods) !== null && _a !== void 0 ? _a : []);
    var counted = __assign(__assign(__assign(__assign({}, current), { minutesByDay: (0, time_1.mergeMinutes)(current.minutesByDay, pending.minutes) }), (inChecks > 0 ? { minutesInChecks: Math.round((((_b = current.minutesInChecks) !== null && _b !== void 0 ? _b : 0) + inChecks) * 100) / 100 } : {})), { files: files, effort: __assign(__assign({}, current.effort), { filesRead: files.read.length, filesChanged: files.changed.length, understandingMessages: current.effort.understandingMessages + pending.understanding, improvingMessages: current.effort.improvingMessages + pending.improving }) });
    var task = seen === undefined
        ? counted
        : (0, checkpoints_1.noteSeen)(counted, { at: seen.at, files: pending.files.changed, commands: pending.commands, git: seen.git });
    var tracked = (0, realm_time_1.recordRealmTime)(record, {
        onQuests: pending.taskPeriods, elsewhere: pending.projectPeriods,
        minutesOnQuests: pending.minutes, minutesElsewhere: pending.projectMinutes, offsetMinutes: pending.offsetMinutes,
    });
    return __assign(__assign({}, tracked), { unassignedMinutesByDay: unassigned, tasks: record.tasks.map(function (t) { return (t.id === task.id ? task : t); }) });
};
exports.applyPending = applyPending;
