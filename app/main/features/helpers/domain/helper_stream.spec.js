"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var helper_stream_1 = require("./helper_stream");
var AGENT = 'queue-tea:tea-dd';
var line = function (event) { return JSON.stringify(event); };
var tool = function (name, input) { return line({ type: 'assistant', message: { content: [{ type: 'tool_use', name: name, input: input }] } }); };
(0, vitest_1.describe)('what a stream line means', function () {
    (0, vitest_1.it)('names the file a helper reads, edits or writes, not its whole path', function () {
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(tool('Read', { file_path: '/p/demo/src/timer.ts' }), AGENT)).toEqual({ kind: 'doing', doing: { kind: 'reading', target: 'timer.ts' } });
        (0, vitest_1.expect)((0, helper_stream_1.doingOf)('Edit', { file_path: '/p/demo/a.ts' })).toEqual({ kind: 'editing', target: 'a.ts' });
        (0, vitest_1.expect)((0, helper_stream_1.doingOf)('Write', { file_path: '/p/demo/b.md' })).toEqual({ kind: 'writing', target: 'b.md' });
    });
    (0, vitest_1.it)("says a command in Claude's own words when it gave them", function () {
        (0, vitest_1.expect)((0, helper_stream_1.doingOf)('Bash', { command: 'npm test -- --run', description: 'Run the tests' })).toEqual({ kind: 'step', target: 'Run the tests' });
        (0, vitest_1.expect)((0, helper_stream_1.doingOf)('Bash', { command: 'npm test' })).toEqual({ kind: 'running', target: 'npm test' });
    });
    (0, vitest_1.it)('cuts a long target short', function () {
        var target = (0, helper_stream_1.doingOf)('Grep', { pattern: 'x'.repeat(200) }).target;
        (0, vitest_1.expect)(target.length).toBe(helper_stream_1.HELPER_LIMITS.targetChars);
        (0, vitest_1.expect)(target.endsWith('…')).toBe(true);
    });
    (0, vitest_1.it)('names the site a page comes from', function () {
        (0, vitest_1.expect)((0, helper_stream_1.doingOf)('WebFetch', { url: 'https://vitest.dev/api/' })).toEqual({ kind: 'browsing', target: 'vitest.dev' });
        (0, vitest_1.expect)((0, helper_stream_1.doingOf)('WebFetch', { url: 'not a url' })).toEqual({ kind: 'browsing', target: null });
    });
    (0, vitest_1.it)('takes the last tool when one message holds several', function () {
        var both = line({ type: 'assistant', message: { content: [{ type: 'text', text: 'First' }, { type: 'tool_use', name: 'Read', input: { file_path: 'a' } }, { type: 'tool_use', name: 'Glob', input: { pattern: '*.ts' } }] } });
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(both, AGENT)).toEqual({ kind: 'doing', doing: { kind: 'searching', target: '*.ts' } });
    });
    (0, vitest_1.it)('is thinking when it only writes', function () {
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'assistant', message: { content: [{ type: 'text', text: 'Let me look.' }] } }), AGENT)).toEqual({ kind: 'doing', doing: { kind: 'thinking', target: null } });
    });
    (0, vitest_1.it)('hands on the answer, or a failure', function () {
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'result', subtype: 'success', is_error: false, result: 'All green.' }), AGENT)).toEqual({ kind: 'done', reply: 'All green.' });
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'result', subtype: 'error_max_turns', is_error: true }), AGENT)).toEqual({ kind: 'failed', detail: 'error_max_turns' });
    });
    (0, vitest_1.it)("notices when Claude Code doesn't have the helper", function () {
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:chai-pter'] }), AGENT)).toEqual({ kind: 'missing' });
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'system', subtype: 'init', agents: ['claude', AGENT] }), AGENT)).toBeNull();
    });
    (0, vitest_1.it)('passes over what the card has no use for', function () {
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)('Warning: this sign-in can end soon', AGENT)).toBeNull();
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'system', subtype: 'hook_started' }), AGENT)).toBeNull();
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'user', message: { content: [{ type: 'tool_result' }] } }), AGENT)).toBeNull();
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)('null', AGENT)).toBeNull();
    });
    (0, vitest_1.it)('names a tool it does not know by its own name', function () {
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(tool('mcp__linear__create_issue', { title: 'x' }), AGENT)).toEqual({ kind: 'doing', doing: { kind: 'working', target: 'mcp__linear__create_issue' } });
    });
    (0, vitest_1.it)('does not call the helper missing when Claude Code lists no agents', function () {
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(line({ type: 'system', subtype: 'init' }), AGENT)).toBeNull();
    });
    (0, vitest_1.it)('passes over a message holding a block it cannot read, keeping the tool beside it', function () {
        var odd = line({ type: 'assistant', message: { content: [null, { type: 'tool_use', name: 'Read', input: { file_path: '/x/timer.ts' } }] } });
        (0, vitest_1.expect)((0, helper_stream_1.seenIn)(odd, AGENT)).toEqual({ kind: 'doing', doing: { kind: 'reading', target: 'timer.ts' } });
    });
});
(0, vitest_1.describe)('reading the stream in chunks', function () {
    (0, vitest_1.it)('hands on whole lines however the chunks cut them', function () {
        var lines = [];
        var read = (0, helper_stream_1.lineReader)(function (l) { return lines.push(l); });
        read('{"a":');
        read('1}\n{"b"');
        read(':2}\n\n');
        (0, vitest_1.expect)(lines).toEqual(['{"a":1}', '{"b":2}']);
    });
    (0, vitest_1.it)('drops a line too long to keep', function () {
        var lines = [];
        var read = (0, helper_stream_1.lineReader)(function (l) { return lines.push(l); });
        read('x'.repeat(helper_stream_1.HELPER_LIMITS.lineChars + 1));
        read('tail\n');
        (0, vitest_1.expect)(lines).toEqual(['tail']);
    });
});
(0, vitest_1.describe)('the order', function () {
    (0, vitest_1.it)('takes it trimmed', function () {
        (0, vitest_1.expect)((0, helper_stream_1.orderOf)('  Write tests  ')).toEqual({ ok: true, order: 'Write tests' });
    });
    (0, vitest_1.it)('refuses one that is empty, too long or not text', function () {
        (0, vitest_1.expect)((0, helper_stream_1.orderOf)('   ')).toEqual({ ok: false, why: 'empty' });
        (0, vitest_1.expect)((0, helper_stream_1.orderOf)(42)).toEqual({ ok: false, why: 'empty' });
        (0, vitest_1.expect)((0, helper_stream_1.orderOf)('x'.repeat(helper_stream_1.HELPER_LIMITS.orderChars + 1))).toEqual({ ok: false, why: 'long' });
    });
    (0, vitest_1.it)('takes one of exactly the longest length, as the form does', function () {
        var longest = 'x'.repeat(helper_stream_1.HELPER_LIMITS.orderChars);
        (0, vitest_1.expect)((0, helper_stream_1.orderOf)("  ".concat(longest, "\n"))).toEqual({ ok: true, order: longest });
    });
});
