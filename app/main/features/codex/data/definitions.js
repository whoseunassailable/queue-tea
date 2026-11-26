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
exports.codexSkills = exports.companionSkills = exports.helperInstructions = exports.helperDefinition = void 0;
var commands_1 = require("../../../../../hooks/core/session/commands");
var helpers_1 = require("../../../../../hooks/shared/records/domain/services/helpers");
var constants_1 = require("../domain/constants");
var files = import.meta.glob('../../../../../agents/*.md', { query: '?raw', import: 'default', eager: true });
var skills = import.meta.glob('../../../../../skills/*/SKILL.md', { query: '?raw', import: 'default', eager: true });
var helperDefinition = function (id) {
    var _a, _b, _c, _d;
    var source = (_a = Object.entries(files).find(function (_a) {
        var path = _a[0];
        return path.endsWith("/".concat(id, ".md"));
    })) === null || _a === void 0 ? void 0 : _a[1];
    if (source === undefined)
        throw new Error("Missing bundled helper: ".concat(id));
    var _e = source.split(/^---\s*$/m), head = _e[1], body = _e[2];
    return {
        description: (_c = (_b = head === null || head === void 0 ? void 0 : head.match(/^description:\s*(.+)$/m)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : id,
        skills: __spreadArray([], (head !== null && head !== void 0 ? head : '').matchAll(/^\s+-\s+([\w:-]+)\s*$/gm), true).map(function (match) { return match[1]; }),
        body: (_d = body === null || body === void 0 ? void 0 : body.trim()) !== null && _d !== void 0 ? _d : '',
    };
};
exports.helperDefinition = helperDefinition;
var helperInstructions = function (id) {
    var helper = (0, exports.helperDefinition)(id);
    return [
        "Use the ".concat(id, " procedure below in Codex. It is the shared Queue-tea helper definition."),
        'Apply the role’s restrictions even though Claude-only disallowedTools metadata cannot enforce them here. Do not delegate again or finish the task. Use Codex tools for reading, editing and commands. In design metadata, identify your work as codex.',
        'Load the named companion skills only if available in this Codex session. Report any missing skills and use the self-contained procedure below; do not invent their contents or install them without authorization. Existing session authorization takes precedence over a skill’s generic ask-first wording.',
        "Companion skills: ".concat(helper.skills.join(', '), ". Queue-tea\u2019s tea-concile is bundled as a Codex skill."),
        helper.body,
    ].join('\n\n');
};
exports.helperInstructions = helperInstructions;
var companionSkills = function () { return __spreadArray([], new Set(helpers_1.HELPER_IDS.flatMap(function (id) { return (0, exports.helperDefinition)(id).skills; })), true).filter(function (name) { return !name.startsWith('queue-tea:'); }); };
exports.companionSkills = companionSkills;
var workflows = {
    'queue-tea': 'Call queue_tea and show the current task, active feature and queued tasks. This is a text view; use the Queue-tea app for its interactive menu and task actions.',
    done: 'Read queue_tea, then call done with the current taskId and a truthful checked summary. If a helper is requested, run that helper’s skill, then retry. Report that review is waiting in Queue-tea; never finish the task yourself.',
    steep: 'Call steep with the user’s message. If the parent is unclear, ask whether it belongs under the active feature or stands alone; pass parentId only for the user’s chosen parent. This queues the message without starting it or changing branches.',
    feature: 'Call feature with the supplied title/id, off to clear it, or no args to show the active feature. Report ambiguity without choosing an arbitrary match.',
    brew: 'Call brew with the request, then perform it in the same conversation and branch, outside the queue. Do not file a task, record helper runs on the current task, or call done/task_looks_done for the errand. Verify the requested work before replying.',
    instant: 'Call instant with the request, then perform it in the same conversation and branch, outside the queue. Do not file a task, record helper runs on the current task, or call done/task_looks_done for the errand. Verify the requested work before replying.',
    tea: 'Call tea with the question, then read what is needed and answer. Change no files or queue records. Do not call done/task_looks_done or record helper runs for this question.',
};
var skill = function (name, description, body) {
    return "---\nname: ".concat(name, "\ndescription: ").concat(JSON.stringify(description), "\n---\n\n").concat(constants_1.CODEX_TEXT.skillMarker, "\n\n").concat(body, "\n");
};
// Generated from the command catalog and agent sources; no second set of personas.
var codexSkills = function () { return Object.fromEntries(__spreadArray(__spreadArray(__spreadArray([], commands_1.QUEUE_TEA_COMMANDS.map(function (command) { return [command.name, skill(command.name, "Queue-tea ".concat(command.name, " workflow, also called /").concat(command.name, ". ").concat(command.description, "."), "".concat(workflows[command.name], "\n\nUse the Queue-tea MCP tools. If they are unavailable, report that setup is needed; do not claim a queue mutation succeeded. Rohan commits, pushes and merges."))]; }), true), helpers_1.HELPER_IDS.map(function (id) { return [id, skill(id, (0, exports.helperDefinition)(id).description, "".concat((0, exports.helperInstructions)(id), "\n\nFor current-task work, read queue_tea before starting and call helper_finished with this helper id and that taskId only after completing and reporting the work. For an errand or standalone helper request, do not mark a task. If delegation is available and authorized, give a subagent these instructions; otherwise perform the role in this conversation."))]; }), true), Object.entries(skills).map(function (_a) {
    var path = _a[0], body = _a[1];
    return [path.split('/').at(-2), "".concat(body, "\n\n").concat(constants_1.CODEX_TEXT.skillMarker, "\n\nIn Codex, use the current execution tool and its approval flow. Claude\u2019s /add-dir and git guard are not present. Existing user authorization takes precedence over generic ask-first instructions. Never commit, merge, push, rebase, reset, revert, cherry-pick or tag.\n")];
}), true)); };
exports.codexSkills = codexSkills;
