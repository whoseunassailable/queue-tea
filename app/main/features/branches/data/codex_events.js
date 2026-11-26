"use strict";
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
exports.codexEvents = exports.CodexEvents = void 0;
var activity_1 = require("../../../../../hooks/shared/activity/domain/services/activity");
var constants_1 = require("../domain/constants");
var textOf = function (value) { var _a; return typeof value === 'string' ? value : Array.isArray(value) ? value.map(function (v) { return typeof (v === null || v === void 0 ? void 0 : v.text) === 'string' ? v.text : ''; }).join('\n') : (_a = JSON.stringify(value)) !== null && _a !== void 0 ? _a : ''; };
var commandOf = function (value) { return typeof value === 'string' ? value : Array.isArray(value) ? value.length >= 3 && /^-(?:l?c|cl)$/.test(String(value[1])) ? String(value[2]) : value.join(' ') : null; };
var parse = function (text) { try {
    var v = JSON.parse(text);
    return v && typeof v === 'object' ? v : null;
}
catch (_a) {
    return null; /* A partial tool result is not evidence yet. */
} };
// Native item events expose the actual nested commands/file changes, including
// exec batches. No JavaScript is evaluated and no success is inferred from prose.
// Recent steps stay in memory only, so a result can find the step it ends.
var CodexEvents = /** @class */ (function () {
    function CodexEvents(since) {
        this.since = since;
        this.steps = new Map();
        this.calls = new Map();
        this.sessions = new Map();
        this.working = false;
        this.complete = false;
        this.needsYou = false;
        this.seenAt = null;
    }
    CodexEvents.prototype.accept = function (line) {
        var _a, _b, _c, _d, _e, _f, _g;
        var row = parse(line);
        var p = row === null || row === void 0 ? void 0 : row.payload;
        var ms = Date.parse((_a = row === null || row === void 0 ? void 0 : row.timestamp) !== null && _a !== void 0 ? _a : '');
        if (!p || !Number.isFinite(ms) || ms < this.since || ms > Date.now() + 60000)
            return;
        this.seenAt = Math.max((_b = this.seenAt) !== null && _b !== void 0 ? _b : 0, ms);
        var at = new Date(ms).toISOString();
        if (row.type === 'event_msg') {
            if (p.type === 'task_started') {
                this.working = true;
                this.complete = false;
                this.needsYou = false;
            }
            if (p.type === 'task_complete' || p.type === 'turn_aborted') {
                this.working = false;
                this.complete = p.type === 'task_complete';
                this.needsYou = false;
            }
            if (['item_started', 'item_updated', 'item_completed'].includes(String(p.type)))
                this.item(p.item, at, p.type === 'item_completed', typeof p.started_at_ms === 'number' ? new Date(p.started_at_ms).toISOString() : at);
            this.trim();
            return;
        }
        if (row.type !== 'response_item')
            return;
        if (p.type === 'message' && p.role === 'assistant' && (p.phase === 'final_answer' || p.channel === 'final')) {
            this.working = false;
            this.complete = true;
        }
        var call = String((_d = (_c = p.call_id) !== null && _c !== void 0 ? _c : p.id) !== null && _d !== void 0 ? _d : '');
        var name = String((_e = p.name) !== null && _e !== void 0 ? _e : '').split('.').at(-1);
        if (p.type === 'function_call' || p.type === 'custom_tool_call') {
            this.working = true;
            this.complete = false;
            this.needsYou = false;
            var input = typeof p.arguments === 'string' ? parse(p.arguments) : typeof p.input === 'string' ? parse(p.input) : null;
            if (name === 'request_user_input' || name === 'request_user_input_async') {
                this.needsYou = true;
                this.working = false;
            }
            if (name === 'write_stdin' && input) {
                var original = this.sessions.get(String(input.session_id));
                if (original)
                    this.calls.set(call, original);
            }
            var cmd = input && commandOf((_f = input.cmd) !== null && _f !== void 0 ? _f : input.command);
            var step = cmd ? (0, activity_1.toolStep)('Bash', { command: cmd }, "codex-".concat(call), at) : null;
            if (step) {
                this.steps.set(step.id, step);
                this.calls.set(call, step.id);
            }
            if (name === 'apply_patch' && typeof p.input === 'string')
                this.patch(p.input, "codex-".concat(call), at, false);
            if (input && ['read_file', 'Read', 'read', 'write_file', 'Write', 'edit_file', 'Edit'].includes(name)) {
                var file = (_g = input.file_path) !== null && _g !== void 0 ? _g : input.path;
                var tool = /write/i.test(name) ? 'Write' : /edit/i.test(name) ? 'Edit' : 'Read';
                var entry = (0, activity_1.toolStep)(tool, { file_path: file }, "codex-".concat(call), at);
                if (entry) {
                    this.steps.set(entry.id, entry);
                    this.calls.set(call, entry.id);
                }
            }
        }
        if (p.type === 'function_call_output' || p.type === 'custom_tool_call_output') {
            var output = textOf(p.output);
            var id = this.calls.get(call);
            var entry = id ? this.steps.get(id) : null;
            if (entry)
                this.result(entry, output, at);
            for (var _i = 0, _h = this.steps.values(); _i < _h.length; _i++) {
                var step = _h[_i];
                if (step.id.startsWith("codex-".concat(call, ":")) && step.status === 'running')
                    this.steps.set(step.id, (0, activity_1.finishStep)(step, { isError: p.isError === true || /^(?:error|failed)/i.test(output) }, at));
            }
            // Function exec exposes nested results as JSON text blocks. Native item
            // events carry their identities and end those steps when they arrive.
        }
        this.trim();
    };
    CodexEvents.prototype.trim = function () {
        while (this.steps.size > 200)
            this.steps.delete(this.steps.keys().next().value);
        if (this.calls.size > 400)
            for (var _i = 0, _a = this.calls; _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], id = _b[1];
                if (!this.steps.has(id))
                    this.calls.delete(key);
            }
        if (this.sessions.size > 400)
            for (var _c = 0, _d = this.sessions; _c < _d.length; _c++) {
                var _e = _d[_c], key = _e[0], id = _e[1];
                if (!this.steps.has(id))
                    this.sessions.delete(key);
            }
    };
    CodexEvents.prototype.result = function (entry, output, at) {
        var _a, _b, _c, _d, _e;
        var structured = parse(output);
        if (entry.kind !== 'command' && entry.kind !== 'test') {
            this.steps.set(entry.id, (0, activity_1.finishStep)(entry, { isError: (structured === null || structured === void 0 ? void 0 : structured.isError) === true }, at));
            return;
        }
        var exit = (_a = structured === null || structured === void 0 ? void 0 : structured.exit_code) !== null && _a !== void 0 ? _a : structured === null || structured === void 0 ? void 0 : structured.exitCode;
        var code = typeof exit === 'number' ? exit : Number((_c = (_b = /(?:Process exited with code|Exit code:)\s*(-?\d+)/.exec(output)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : NaN);
        var session = (_d = structured === null || structured === void 0 ? void 0 : structured.session_id) !== null && _d !== void 0 ? _d : (_e = /(?:session ID|session_id["': ]+)\s*([\w-]+)/.exec(output)) === null || _e === void 0 ? void 0 : _e[1];
        if (session !== undefined && session !== null)
            this.sessions.set(String(session), entry.id);
        // Without an exit code the command is still running.
        if (Number.isFinite(code))
            this.steps.set(entry.id, (0, activity_1.finishStep)(entry, { result: { exitCode: code } }, at));
    };
    CodexEvents.prototype.patch = function (text, id, at, finished) {
        for (var _i = 0, _a = text.matchAll(/^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm); _i < _a.length; _i++) {
            var match = _a[_i];
            var file = match[1];
            this.steps.set("".concat(id, ":").concat(file), { id: "".concat(id, ":").concat(file), at: at, finished: finished ? at : null, kind: 'edit', subject: file, status: finished ? 'succeeded' : 'running' });
        }
    };
    CodexEvents.prototype.item = function (value, at, completed, startedAt) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!value || typeof value !== 'object')
            return;
        var item = value;
        var id = String((_a = item.id) !== null && _a !== void 0 ? _a : '');
        if (!id)
            return;
        var type = String(item.type).toLowerCase().replace(/_/g, '');
        if (type === 'commandexecution') {
            var command_1 = commandOf(item.command);
            if (!command_1)
                return;
            var previous = __spreadArray([], this.steps.values(), true).find(function (s) { return !s.id.startsWith('codex-item-') && s.subject === command_1 && s.status === 'running'; });
            var sessionKey = String((_b = item.process_id) !== null && _b !== void 0 ? _b : '');
            var stable = (_d = (_c = this.sessions.get(sessionKey)) !== null && _c !== void 0 ? _c : previous === null || previous === void 0 ? void 0 : previous.id) !== null && _d !== void 0 ? _d : "codex-item-".concat(id);
            var entry = (_e = this.steps.get(stable)) !== null && _e !== void 0 ? _e : (0, activity_1.toolStep)('Bash', { command: command_1 }, stable, startedAt);
            if (sessionKey)
                this.sessions.set(sessionKey, stable);
            var code = item.exit_code;
            this.steps.set(stable, completed && typeof code === 'number' ? (0, activity_1.finishStep)(entry, { result: { exitCode: code } }, at) : entry);
        }
        if (type === 'filechange') {
            var changes = item.changes && typeof item.changes === 'object' ? item.changes : {};
            var _loop_1 = function (file, change) {
                var pending = __spreadArray([], this_1.steps.values(), true).find(function (s) { return s.kind === 'edit' && s.subject === file && s.status === 'running'; });
                var stable = (_f = pending === null || pending === void 0 ? void 0 : pending.id) !== null && _f !== void 0 ? _f : "codex-file-".concat(id, ":").concat(file);
                var status_1 = ['failed', 'declined'].includes(String(item.status).toLowerCase()) ? 'failed' : completed ? 'succeeded' : 'running';
                this_1.steps.set(stable, { id: stable, at: (_g = pending === null || pending === void 0 ? void 0 : pending.at) !== null && _g !== void 0 ? _g : at, finished: completed ? at : null, kind: change.type === 'add' ? 'write' : 'edit', status: status_1, subject: file });
            };
            var this_1 = this;
            for (var _i = 0, _h = Object.entries(changes); _i < _h.length; _i++) {
                var _j = _h[_i], file = _j[0], change = _j[1];
                _loop_1(file, change);
            }
        }
        if (type === 'agentmessage' && item.phase === 'final_answer') {
            this.working = false;
            this.complete = true;
        }
    };
    CodexEvents.prototype.snapshot = function (now, since) {
        var _a;
        if (since === void 0) { since = this.since; }
        if (((_a = this.seenAt) !== null && _a !== void 0 ? _a : 0) < since)
            return { state: 'unobserved', seenAt: null, step: null };
        return { state: this.needsYou ? 'needsYou' : this.complete ? 'review' : this.working && this.seenAt !== null && now - this.seenAt < constants_1.BRANCH_LIMITS.recentMs ? 'working' : 'unobserved', seenAt: this.seenAt, step: activity_1.latestStep.apply(void 0, __spreadArray([], this.steps.values(), true).filter(function (s) { return Date.parse(s.at) >= since && Date.parse(s.at) <= now; })) };
    };
    return CodexEvents;
}());
exports.CodexEvents = CodexEvents;
var codexEvents = function (text, since, now) {
    var reader = new CodexEvents(since);
    for (var _i = 0, _a = text.split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        reader.accept(line);
    }
    return reader.snapshot(now);
};
exports.codexEvents = codexEvents;
