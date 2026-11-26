"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderOf = exports.lineReader = exports.seenIn = exports.doingOf = exports.HELPER_LIMITS = void 0;
var engine_api_1 = require("../../../../shared/engine_api");
exports.HELPER_LIMITS = { orderChars: engine_api_1.HELPER_ORDER_CHARS, runMinutes: 30, targetChars: 80, lineChars: 4000000 };
var clip = function (text) {
    if (typeof text !== 'string' || text.trim() === '')
        return null;
    var line = text.trim().split('\n')[0];
    return line.length > exports.HELPER_LIMITS.targetChars ? "".concat(line.slice(0, exports.HELPER_LIMITS.targetChars - 1), "\u2026") : line;
};
var fileOf = function (path) { var _a; return (typeof path === 'string' ? ((_a = path.split('/').filter(Boolean).pop()) !== null && _a !== void 0 ? _a : null) : null); };
var siteOf = function (url) {
    try {
        return typeof url === 'string' ? new URL(url).host : null;
    }
    catch (_a) {
        // Not a URL: the line just names no site.
        return null;
    }
};
var doingOf = function (tool, input) {
    var _a, _b;
    if (tool === 'Read')
        return { kind: 'reading', target: fileOf(input.file_path) };
    if (tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit')
        return { kind: 'editing', target: fileOf((_a = input.file_path) !== null && _a !== void 0 ? _a : input.notebook_path) };
    if (tool === 'Write')
        return { kind: 'writing', target: fileOf(input.file_path) };
    // Claude's own description is already a sentence ("Run the tests"), so it stands alone.
    if (tool === 'Bash')
        return clip(input.description) !== null ? { kind: 'step', target: clip(input.description) } : { kind: 'running', target: clip(input.command) };
    if (tool === 'Grep' || tool === 'Glob')
        return { kind: 'searching', target: clip(input.pattern) };
    if (tool === 'WebFetch' || tool === 'WebSearch')
        return { kind: 'browsing', target: (_b = clip(input.query)) !== null && _b !== void 0 ? _b : siteOf(input.url) };
    if (tool === 'Agent' || tool === 'Task')
        return { kind: 'asking', target: clip(input.subagent_type) };
    if (tool === 'Skill')
        return { kind: 'skill', target: clip(input.skill) };
    if (tool === 'TodoWrite')
        return { kind: 'planning', target: null };
    return { kind: 'working', target: tool };
};
exports.doingOf = doingOf;
var parse = function (line) {
    try {
        var event_1 = JSON.parse(line);
        return typeof event_1 === 'object' && event_1 !== null ? event_1 : null;
    }
    catch (_a) {
        // stream-json writes one event per line; anything else carries nothing for the card.
        return null;
    }
};
var seenIn = function (line, agent) {
    var _a, _b;
    var event = parse(line);
    if (event === null)
        return null;
    if (event.type === 'system' && event.subtype === 'init')
        return Array.isArray(event.agents) && !event.agents.includes(agent) ? { kind: 'missing' } : null;
    if (event.type === 'result') {
        var text = typeof event.result === 'string' ? event.result : '';
        return event.is_error === true || event.subtype !== 'success' ? { kind: 'failed', detail: text || String(event.subtype) } : { kind: 'done', reply: text };
    }
    if (event.type !== 'assistant' || !Array.isArray((_a = event.message) === null || _a === void 0 ? void 0 : _a.content))
        return null;
    var blocks = event.message.content.filter(function (b) { return typeof b === 'object' && b !== null; });
    var tool = blocks.filter(function (b) { return b.type === 'tool_use' && typeof b.name === 'string'; }).pop();
    if (tool !== undefined)
        return { kind: 'doing', doing: (0, exports.doingOf)(tool.name, ((_b = tool.input) !== null && _b !== void 0 ? _b : {})) };
    return blocks.some(function (b) { return b.type === 'text' || b.type === 'thinking'; }) ? { kind: 'doing', doing: { kind: 'thinking', target: null } } : null;
};
exports.seenIn = seenIn;
// Output arrives in chunks that cut lines anywhere; this hands on whole lines.
var lineReader = function (onLine) {
    var rest = '';
    return function (chunk) {
        var _a;
        var lines = (rest + chunk).split('\n');
        rest = (_a = lines.pop()) !== null && _a !== void 0 ? _a : '';
        // shortcut: a single line past the limit (a huge tool result) is dropped; the card never needs those.
        if (rest.length > exports.HELPER_LIMITS.lineChars)
            rest = '';
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            if (line.trim() !== '')
                onLine(line);
        }
    };
};
exports.lineReader = lineReader;
// The order as the engine takes it, or the sentence that says why not.
var orderOf = function (input) {
    var order = typeof input === 'string' ? input.trim() : '';
    if (order === '')
        return { ok: false, why: 'empty' };
    return order.length > exports.HELPER_LIMITS.orderChars ? { ok: false, why: 'long' } : { ok: true, order: order };
};
exports.orderOf = orderOf;
