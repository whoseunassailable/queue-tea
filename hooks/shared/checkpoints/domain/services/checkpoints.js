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
exports.codexBrief = exports.firstMessage = exports.latestNote = exports.checkLines = exports.checkpointSections = exports.parseCheckpoint = exports.checkpointPrompt = exports.noteSeen = exports.commandRun = exports.isTestCommand = exports.emptyCheckpoint = void 0;
var checkpoints_text_1 = require("../constants/checkpoints_text");
var description_files_1 = require("../../../records/domain/services/description_files");
var first_object_1 = require("./first_object");
// A task's checkpoint: what Claude writes at a handoff, beside what
// Queue-tea saw itself, and the first message a fresh conversation gets.
var KEEP_COMMANDS = 15;
var emptyCheckpoint = function () { return ({
    written: null,
    goal: '',
    acceptance: [],
    changes: [],
    decisions: [],
    rejected: [],
    remaining: [],
    blockers: [],
    nextAction: '',
    seen: null,
}); };
exports.emptyCheckpoint = emptyCheckpoint;
// Test runners, type checks and linters: the checks a "done" leans on. A step
// of the command counts only when it starts with one, once wrappers such as
// caffeinate, env and npx are set aside, so `ls tests`, `grep e2e` and a build don't.
// A node script named lint or check, such as tools/check_layers.mjs, is a linter; checkout.mjs isn't.
var STEPS = /&&|\|\||[;|\n]/;
var WRAPPERS = /^(?:[({!]\s*|(?:do|then|else|time|env|caffeinate(?:\s+-\w+)*|timeout\s+\S+|npx(?:\s+(?:-y|--yes|-p\s+\S+|--package[=\s]\S+))*|\w+=\S*)\s+)+/;
var RUNNER = /^(?:(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?(?:test|e2e|typecheck|lint|check)(?::[\w-]+)?|vitest|jest|mocha|playwright\s+test|pytest|python3?\s+-m\s+pytest|tsc|eslint|claude\s+plugin\s+(?:test|validate)|node\s+--test|node\s+(?:\S*\/)?(?:lint|check)(?:[_-][\w-]*)?\.[cm]?js|(?:go|cargo|flutter|dart|swift|deno)\s+test|(?:flutter|dart)\s+analyze)(?:[\s)]|$)/;
var isTestCommand = function (command) {
    return command.split(STEPS).some(function (step) { return RUNNER.test(step.trim().replace(WRAPPERS, '')); });
};
exports.isTestCommand = isTestCommand;
var lastLine = function (text) {
    var _a;
    return (_a = text
        .split('\n')
        .map(function (line) { return line.trim(); })
        .filter(Boolean)
        .at(-1)) !== null && _a !== void 0 ? _a : '';
};
// One shell command as Queue-tea keeps it: cut short, with the last line of
// what it printed.
var commandRun = function (command, isOk, output, at) { return ({
    command: command.replace(/\s+/g, ' ').trim().slice(0, 160),
    isOk: isOk,
    isTest: (0, exports.isTestCommand)(command),
    at: at,
    summary: lastLine(output).slice(0, 120),
}); };
exports.commandRun = commandRun;
// Adds what Queue-tea saw since the last turn to a task's checkpoint.
var noteSeen = function (task, seen) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var before = (_a = task.checkpoint) !== null && _a !== void 0 ? _a : (0, exports.emptyCheckpoint)();
    var files = __spreadArray([], ((_c = (_b = before.seen) === null || _b === void 0 ? void 0 : _b.files) !== null && _c !== void 0 ? _c : []), true);
    for (var _i = 0, _j = seen.files; _i < _j.length; _i++) {
        var f = _j[_i];
        if (!files.includes(f))
            files.push(f);
    }
    return __assign(__assign({}, task), { checkpoint: __assign(__assign({}, before), { seen: {
                at: seen.at,
                files: files,
                commands: __spreadArray(__spreadArray([], ((_e = (_d = before.seen) === null || _d === void 0 ? void 0 : _d.commands) !== null && _e !== void 0 ? _e : []), true), seen.commands, true).slice(-KEEP_COMMANDS),
                git: (_h = (_f = seen.git) !== null && _f !== void 0 ? _f : (_g = before.seen) === null || _g === void 0 ? void 0 : _g.git) !== null && _h !== void 0 ? _h : null,
            } }) });
};
exports.noteSeen = noteSeen;
var ran = function (c) { return "- ".concat(c.isOk ? 'passed' : 'failed', ": ").concat(c.command).concat(c.summary === '' ? '' : " (".concat(c.summary, ")")); };
// The question for a checkpoint, with what git and Queue-tea saw, so Claude
// need not guess and cannot claim a check it didn't run.
var checkpointPrompt = function (task, git) {
    var _a, _b, _c;
    var seen = (_a = task.checkpoint) === null || _a === void 0 ? void 0 : _a.seen;
    return __spreadArray(__spreadArray([
        'Write a checkpoint for the current task so a fresh conversation can carry it on. Answer with one JSON object only, no other text:',
        '{"goal":"…","acceptance":["…"],"changes":["…"],"decisions":["…"],"rejected":["…"],"remaining":["…"],"blockers":["…"],"nextAction":"…"}',
        '- goal: what the task is for, in one or two lines.',
        '- acceptance: how to tell it is finished, one point each.',
        '- changes: what is done so far, naming the files.',
        '- decisions: what was decided, and why.',
        '- rejected: approaches tried or weighed and dropped, and why.',
        '- remaining: what is left, the next first.',
        '- blockers: what stops the work, or [] when nothing does.',
        '- nextAction: the very next step, exact enough to start on: a file, a command, a question.',
        'Say a check passed only when it is listed as passed below. Do not call the task finished unless every acceptance point is met and checked.',
        "The task: \"".concat(task.title, "\"."),
        git === null
            ? 'Not a git repository.'
            : "From git now: branch ".concat((_b = git.branch) !== null && _b !== void 0 ? _b : 'none (detached HEAD)', "; last commit ").concat((_c = git.head) !== null && _c !== void 0 ? _c : 'none', "; ").concat(git.uncommitted.length, " not committed").concat(git.uncommitted.length === 0 ? '' : ": ".concat(git.uncommitted.join(', ')), ".")
    ], (seen == null || seen.commands.length === 0
        ? ['Queue-tea saw no shell commands run during this task.']
        : __spreadArray(['Shell commands Queue-tea saw, latest last:'], seen.commands.map(ran), true)), true), [
        'Under 300 words in all.',
    ], false).join('\n');
};
exports.checkpointPrompt = checkpointPrompt;
var strings = function (value) {
    return Array.isArray(value) ? value.filter(function (v) { return typeof v === 'string' && v.trim() !== ''; }).map(function (v) { return v.trim(); }) : [];
};
var text = function (value) { return (typeof value === 'string' ? value.trim() : ''); };
// Claude's part of a checkpoint, or null when the reply isn't one.
var parseCheckpoint = function (reply, written) {
    var object = (0, first_object_1.firstObject)(reply);
    if (object === null)
        return null;
    var parsed;
    try {
        parsed = JSON.parse(object);
    }
    catch (_a) {
        return null;
    }
    var goal = text(parsed.goal);
    var nextAction = text(parsed.nextAction);
    if (goal === '' && nextAction === '')
        return null;
    return {
        written: written,
        goal: goal,
        acceptance: strings(parsed.acceptance),
        changes: strings(parsed.changes),
        decisions: strings(parsed.decisions),
        rejected: strings(parsed.rejected),
        remaining: strings(parsed.remaining),
        blockers: strings(parsed.blockers),
        nextAction: nextAction,
    };
};
exports.parseCheckpoint = parseCheckpoint;
// The sections of Claude's part, as the card and the first message list them.
var checkpointSections = function (c) {
    return [
        { heading: 'Goal', lines: c.goal === '' ? [] : [c.goal] },
        { heading: 'Acceptance criteria', lines: c.acceptance },
        { heading: 'Changes made', lines: c.changes },
        { heading: 'Decisions', lines: c.decisions },
        { heading: 'Approaches rejected', lines: c.rejected },
        { heading: 'Remaining', lines: c.remaining },
        { heading: 'Blockers', lines: c.blockers },
        { heading: 'Next action', lines: c.nextAction === '' ? [] : [c.nextAction] },
    ].filter(function (s) { return s.lines.length > 0; });
};
exports.checkpointSections = checkpointSections;
var count = function (n, one, many) { return "".concat(n, " ").concat(n === 1 ? one : many); };
// The repository now beside what the checkpoint saved, one line each:
// ✓ as saved, ✗ wrong for the task, ! changed since.
var checkLines = function (task, now, drift) {
    var _a, _b, _c, _d;
    if (now === null)
        return ['Not a git repository, so there is no branch to check.'];
    var saved = (_c = (_b = (_a = task.checkpoint) === null || _a === void 0 ? void 0 : _a.seen) === null || _b === void 0 ? void 0 : _b.git) !== null && _c !== void 0 ? _c : null;
    var lines = [];
    if (task.branch !== null) {
        lines.push(now.branch === task.branch
            ? "\u2713 On ".concat(task.branch, ", the task's branch.")
            : "\u2717 On ".concat((_d = now.branch) !== null && _d !== void 0 ? _d : 'a detached HEAD', "; the task is on ").concat(task.branch, "."));
    }
    if (now.head !== null) {
        lines.push((saved === null || saved === void 0 ? void 0 : saved.head) == null
            ? "Last commit: ".concat(now.head, ".")
            : saved.head === now.head
                ? "\u2713 Last commit ".concat(now.head, ", as saved.")
                : "! Last commit is now ".concat(now.head, "; the checkpoint saved ").concat(saved.head, "."));
    }
    var n = now.uncommitted.length;
    var listed = n === 0 ? '' : ": ".concat(now.uncommitted.slice(0, 8).join(', ')).concat(n > 8 ? " +".concat(n - 8) : '');
    var was = saved === null || saved.uncommitted.length === n ? '' : " (the checkpoint saved ".concat(saved.uncommitted.length, ")");
    lines.push("".concat(count(n, 'file', 'files'), " not committed").concat(listed).concat(was, "."));
    return __spreadArray(__spreadArray([], lines, true), drift.map(function (d) { return "! ".concat(d); }), true);
};
exports.checkLines = checkLines;
var list = function (lines) { return lines.map(function (l) { return "- ".concat(l); }); };
// The note a task carries on from, for the first message and the Continue
// card alike: the checkpoint Claude wrote, or the plain handoff note when it
// is newer or the only one.
var latestNote = function (task) {
    var _a, _b;
    var written = (_b = (_a = task.checkpoint) === null || _a === void 0 ? void 0 : _a.written) !== null && _b !== void 0 ? _b : null;
    if (task.handoff === null)
        return written === null ? null : 'checkpoint';
    if (written === null)
        return 'handoff';
    return Date.parse(task.handoff.written) > Date.parse(written) ? 'handoff' : 'checkpoint';
};
exports.latestNote = latestNote;
// The first message of a task's fresh conversation. A task that has been
// worked on brings its checkpoint, what Queue-tea checked just now, and the
// order to compare before trusting either. Files the description links get
// paths in the realm's notes folder, so Claude can open them.
var firstMessage = function (task, checked, files) {
    if (checked === void 0) { checked = null; }
    if (files === void 0) { files = null; }
    var c = task.checkpoint;
    var hasNote = task.handoff !== null || (c !== null && (c.written !== null || c.seen !== null));
    var hasFiles = files !== null && (0, description_files_1.descriptionFiles)(task.description).length > 0;
    var parts = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
        "".concat(checkpoints_text_1.FIRST_MESSAGE_LABELS.task, " ").concat(task.title)
    ], (task.description === null ? [] : ["".concat(checkpoints_text_1.FIRST_MESSAGE_LABELS.description, " ").concat(hasFiles ? (0, description_files_1.withFilePaths)(task.description, files) : task.description)]), true), (hasFiles ? [checkpoints_text_1.FIRST_MESSAGE_LABELS.files] : []), true), (task.criteria.length === 0 ? [] : [__spreadArray([checkpoints_text_1.FIRST_MESSAGE_LABELS.criteria], list(task.criteria), true).join('\n')]), true), task.messages, true);
    if (!hasNote)
        return parts.join('\n\n');
    var note = (0, exports.latestNote)(task);
    if (note === 'checkpoint' && c !== null && c.written !== null) {
        parts.push(__spreadArray([
            "Checkpoint from an earlier conversation (".concat(c.written, "). It may be out of date or wrong: check it before relying on it.")
        ], (0, exports.checkpointSections)(c).flatMap(function (s) {
            return s.heading === 'Goal' || s.heading === 'Next action' ? ["".concat(s.heading, ": ").concat(s.lines[0])] : __spreadArray(["".concat(s.heading, ":")], list(s.lines), true);
        }), true).join('\n'));
    }
    else if (note === 'handoff' && task.handoff !== null) {
        parts.push("Handoff note (".concat(task.handoff.written, "):\n").concat(task.handoff.text));
    }
    var seen = c === null || c === void 0 ? void 0 : c.seen;
    if (seen != null && (seen.files.length > 0 || seen.commands.length > 0)) {
        parts.push(__spreadArray(__spreadArray([
            "Seen by Queue-tea (".concat(seen.at, "):")
        ], (seen.files.length === 0 ? [] : ["Files Claude changed: ".concat(seen.files.join(', '))]), true), (seen.commands.length === 0 ? [] : __spreadArray(['Shell commands, latest last:'], seen.commands.map(ran), true)), true).join('\n'));
    }
    if (checked !== null)
        parts.push(__spreadArray(['Checked by Queue-tea just now:'], list(checked), true).join('\n'));
    parts.push('First compare the checkpoint with the repository and say in one line what differs. A check counts as passed only when Queue-tea saw it pass; rerun the ones the work relies on. Then do the next action.');
    return parts.join('\n\n');
};
exports.firstMessage = firstMessage;
// Codex's first prompt: Queue-tea's rules, then what Claude would get.
var codexBrief = function (task, folder, checked, files) {
    if (files === void 0) { files = null; }
    return "".concat((0, checkpoints_text_1.CODEX_RULES)(folder, task.branch), "\n\n").concat((0, exports.firstMessage)(task, checked, files));
};
exports.codexBrief = codexBrief;
