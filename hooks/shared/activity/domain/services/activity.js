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
exports.finishNotified = exports.waitingFor = exports.notifiedEnds = exports.finishBackgroundStep = exports.finishStep = exports.toolStep = exports.keepStep = exports.latestStep = exports.fromOldLog = exports.waitingOf = exports.stepOf = exports.stepSubject = void 0;
var checkpoints_1 = require("../../../checkpoints/domain/services/checkpoints");
var realm_time_1 = require("../../../time/domain/services/realm_time");
var step_limits_1 = require("../constants/step_limits");
var KINDS = ['branchCreated', 'branchSwitched', 'read', 'edit', 'write', 'command', 'test'];
var STATUSES = ['running', 'succeeded', 'failed', 'blocked'];
// The first line, trimmed, cut to the limit with an ellipsis.
var stepSubject = function (text) {
    var line = text.trim().split('\n')[0].trim();
    return line.length > step_limits_1.STEP_SUBJECT_LIMIT ? "".concat(line.slice(0, step_limits_1.STEP_SUBJECT_LIMIT - 1), "\u2026") : line;
};
exports.stepSubject = stepSubject;
var isTime = function (value) { return typeof value === 'string' && Number.isFinite(Date.parse(value)); };
// A step read from disk, where it is hand-editable, or from an older record's
// step log, whose entries carry output and an excerpt mark. Only a step's own
// fields are kept; anything malformed is no step.
var stepOf = function (raw) {
    if (raw === null || typeof raw !== 'object')
        return null;
    var s = raw;
    if (typeof s.id !== 'string' || s.id === '' || !isTime(s.at) || !(s.finished === null || isTime(s.finished)) ||
        !KINDS.includes(s.kind) || !STATUSES.includes(s.status) || typeof s.subject !== 'string')
        return null;
    return __assign({ id: s.id, at: s.at, finished: s.finished, kind: s.kind, status: s.status, subject: (0, exports.stepSubject)(s.subject) }, (typeof s.backgroundId === 'string' && s.backgroundId !== '' ? { backgroundId: s.backgroundId } : {}));
};
exports.stepOf = stepOf;
var isWaiting = function (step) { return step.status === 'running' && step.backgroundId !== undefined; };
var waitingOf = function (raw) {
    return Array.isArray(raw) ? raw.flatMap(function (entry) { return [(0, exports.stepOf)(entry)].filter(function (s) { return s !== null && isWaiting(s); }); }).slice(-step_limits_1.WAITING_LIMIT) : [];
};
exports.waitingOf = waitingOf;
// What an older record's step log leaves: its latest step as the step, and
// the background shells it still waited on. The rest, output included, goes.
var fromOldLog = function (raw) {
    var steps = (Array.isArray(raw) ? raw : []).map(exports.stepOf).filter(function (s) { return s !== null; })
        .sort(function (a, b) { return Date.parse(a.at) - Date.parse(b.at); });
    var step = steps.at(-1);
    var waiting = steps.filter(isWaiting).slice(-step_limits_1.WAITING_LIMIT);
    return __assign(__assign({}, (step === undefined ? {} : { step: step })), (waiting.length === 0 ? {} : { waiting: waiting }));
};
exports.fromOldLog = fromOldLog;
// The step started last of those given, or null for none.
var latestStep = function () {
    var steps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        steps[_i] = arguments[_i];
    }
    return steps.reduce(function (late, s) { return s == null || (late !== null && Date.parse(late.at) > Date.parse(s.at)) ? late : s; }, null);
};
exports.latestStep = latestStep;
// A finished check's span joins the quest's testing time. Merging keeps a step
// saved twice, or two checks running at once, from counting twice.
var checked = function (task, step) {
    var _a;
    var start = Date.parse(step.at);
    var end = step.kind === 'test' && step.finished !== null ? Date.parse(step.finished) : NaN;
    return end > start ? { testPeriods: (0, realm_time_1.mergePeriods)(__spreadArray(__spreadArray([], (_a = task.testPeriods) !== null && _a !== void 0 ? _a : [], true), [{ start: start, end: end }], false)) } : {};
};
// A step that starts becomes the task's step. A background shell's end that
// arrives later is not what the task is on now, so it changes the line only
// when it still is the task's step; either way it stops waiting.
var keepStep = function (task, step) {
    var _a;
    var waited = (0, exports.waitingOf)(task.waiting);
    var isLate = waited.some(function (w) { return w.id === step.id; }) && ((_a = task.step) === null || _a === void 0 ? void 0 : _a.id) !== step.id;
    var waiting = __spreadArray(__spreadArray([], waited.filter(function (w) { return w.id !== step.id; }), true), (isWaiting(step) ? [step] : []), true).slice(-step_limits_1.WAITING_LIMIT);
    var kept = __assign(__assign(__assign(__assign({}, task), (isLate ? {} : { step: step })), { waiting: waiting }), checked(task, step));
    if (waiting.length === 0)
        delete kept.waiting;
    return kept;
};
exports.keepStep = keepStep;
var toolStep = function (tool, input, id, at) {
    var _a;
    var kind = tool === 'Bash' ? ((0, checkpoints_1.isTestCommand)(String((_a = input.command) !== null && _a !== void 0 ? _a : '')) ? 'test' : 'command')
        : tool === 'Read' ? 'read' : tool === 'Edit' || tool === 'NotebookEdit' ? 'edit' : tool === 'Write' ? 'write' : null;
    var subject = tool === 'Bash' ? input.command : tool === 'NotebookEdit' ? input.notebook_path : input.file_path;
    if (kind === null || typeof subject !== 'string' || subject.trim() === '')
        return null;
    return { id: id, at: at, finished: null, kind: kind, status: 'running', subject: (0, exports.stepSubject)(subject) };
};
exports.toolStep = toolStep;
// How the tool's call ended. Its output is read for the exit code and a
// background shell's id, and never kept.
var finishStep = function (step, result, at) {
    var _a, _b;
    var out = result.result;
    var shell = out !== null && typeof out === 'object' ? out : null;
    var failed = result.isError === true || (shell === null || shell === void 0 ? void 0 : shell.interrupted) === true || ((_b = (_a = shell === null || shell === void 0 ? void 0 : shell.exitCode) !== null && _a !== void 0 ? _a : shell === null || shell === void 0 ? void 0 : shell.exit_code) !== null && _b !== void 0 ? _b : 0) !== 0;
    var pending = !failed && result.deny === undefined && typeof (shell === null || shell === void 0 ? void 0 : shell.backgroundTaskId) === 'string';
    return __assign(__assign(__assign({}, step), { finished: pending ? null : at, status: result.deny !== undefined ? 'blocked' : failed ? 'failed' : pending ? 'running' : 'succeeded' }), (pending ? { backgroundId: shell.backgroundTaskId } : {}));
};
exports.finishStep = finishStep;
// GetTask reports the eventual result of a background shell. A failed poll
// says nothing about the command itself, so it leaves that step waiting.
var finishBackgroundStep = function (step, result, at) {
    var _a;
    if (result === null || typeof result !== 'object')
        return step;
    var task = result;
    if (task.taskId !== step.backgroundId)
        return step;
    if (task.status === 'completed') {
        if (!Array.isArray((_a = task.result) === null || _a === void 0 ? void 0 : _a.content) || typeof task.result.isError !== 'boolean')
            return step;
        return (0, exports.finishStep)(step, { isError: task.result.isError }, at);
    }
    if (task.status === 'failed' || task.status === 'cancelled')
        return (0, exports.finishStep)(step, { isError: true }, at);
    return step;
};
exports.finishBackgroundStep = finishBackgroundStep;
var ENDED = ['completed', 'failed', 'killed'];
var notifiedEnds = function (text) {
    return __spreadArray([], text.matchAll(/<task-notification>([\s\S]*?)<\/task-notification>/g), true).flatMap(function (_a) {
        var body = _a[1];
        var tag = function (name) { var _a, _b, _c; return (_c = (_b = (_a = body.match(new RegExp("<".concat(name, ">([\\s\\S]*?)</").concat(name, ">")))) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : ''; };
        var id = tag('task-id');
        var status = tag('status');
        if (id === '' || !ENDED.includes(status))
            return [];
        return [{ id: id, isOk: status === 'completed' && !/exit code [1-9]/.test(tag('summary')) }];
    });
};
exports.notifiedEnds = notifiedEnds;
// The waiting step a background shell's id names, if the task waits on it.
var waitingFor = function (task, backgroundId) {
    return (0, exports.waitingOf)(task.waiting).find(function (s) { return s.backgroundId === backgroundId; });
};
exports.waitingFor = waitingFor;
// Ends the task's waiting steps that a notification names, keeping the span.
var finishNotified = function (task, ends, at) {
    return ends.reduce(function (t, end) {
        var step = (0, exports.waitingFor)(t, end.id);
        return step === undefined ? t : (0, exports.keepStep)(t, (0, exports.finishStep)(step, { isError: !end.isOk }, at));
    }, task);
};
exports.finishNotified = finishNotified;
