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
var vitest_1 = require("vitest");
var git_rules_1 = require("./git_rules");
var observation_1 = require("../data/observation");
var graph_layout_1 = require("../../../../renderer/features/branches/domain/graph_layout");
var test_fixtures_1 = require("../../../../renderer/features/branches/test_fixtures");
var user_git_1 = require("../data/user_git");
var node_host_1 = require("../../../core/node_host");
(0, vitest_1.it)('parses NUL-delimited file names and both sides of a rename', function () {
    (0, vitest_1.expect)((0, git_rules_1.parseStatus)('R  new name\0old\nname\0?? :path\0 M x\0')).toEqual([
        { status: 'R ', path: 'new name', previous: 'old\nname' }, { status: '??', path: ':path', previous: null }, { status: ' M', path: 'x', previous: null },
    ]);
});
(0, vitest_1.it)('rejects options, traversal and malformed refs but permits slash branches', function () {
    for (var _i = 0, _a = ['--help', 'a..b', 'a.lock', 'refs/./head', 'a b', 'a@{b', 'a\\b', 'a\n']; _i < _a.length; _i++) {
        var branch = _a[_i];
        (0, vitest_1.expect)((0, git_rules_1.isBranch)(branch)).toBe(false);
    }
    (0, vitest_1.expect)((0, git_rules_1.isBranch)('task/tea')).toBe(true);
    (0, vitest_1.expect)((0, git_rules_1.isFile)('../../outside')).toBe(false);
    (0, vitest_1.expect)((0, git_rules_1.isFile)('dir/.git/config')).toBe(false);
    (0, vitest_1.expect)((0, git_rules_1.isFile)('folder/:literal')).toBe(true);
});
(0, vitest_1.it)('preserves both merge parents and never invents an ancestry edge from task grouping', function () {
    var graph = (0, test_fixtures_1.branchGraph)();
    graph.commits.unshift({ id: 'd'.repeat(40), parents: [test_fixtures_1.TARGET, test_fixtures_1.SOURCE], message: 'Approved merge' });
    var layout = (0, graph_layout_1.graphLayout)(graph);
    (0, vitest_1.expect)(layout.edges.map(function (e) { return [e.from.id, e.to.id]; })).toEqual([['d'.repeat(40), test_fixtures_1.TARGET], ['d'.repeat(40), test_fixtures_1.SOURCE], [test_fixtures_1.SOURCE, test_fixtures_1.FORK], [test_fixtures_1.TARGET, test_fixtures_1.FORK]]);
    (0, vitest_1.expect)((0, git_rules_1.parseLog)("".concat(test_fixtures_1.SOURCE, "\0").concat(test_fixtures_1.TARGET, " ").concat(test_fixtures_1.FORK, "\0merge\n"))[0].parents).toEqual([test_fixtures_1.TARGET, test_fixtures_1.FORK]);
});
(0, vitest_1.it)('keeps the general agent Git guard while exposing only typed user operations', function () {
    (0, vitest_1.expect)((0, node_host_1.isForbiddenGit)(['git', '-C', '/repo', 'commit', '-am', 'no'])).toBe(true);
    (0, vitest_1.expect)((0, node_host_1.isForbiddenGit)(['git', 'push', 'origin'])).toBe(true);
    (0, vitest_1.expect)((0, user_git_1.argvOf)({ kind: 'commitFiles', message: 'literal $(text)', files: [':(glob)*'] })).toEqual(['--literal-pathspecs', 'commit', '--only', '-m', 'literal $(text)', '--', ':(glob)*']);
    (0, vitest_1.expect)((0, user_git_1.argvOf)({ kind: 'push', remote: 'origin', head: test_fixtures_1.SOURCE, branch: 'main' })).not.toContain('--force');
});
(0, vitest_1.describe)('Codex event evidence', function () {
    var now = Date.parse('2026-11-04T12:00:00Z');
    var row = function (type, payload, time) {
        if (time === void 0) { time = now; }
        return JSON.stringify({ timestamp: new Date(time).toISOString(), type: type, payload: payload });
    };
    (0, vitest_1.it)('pulses only for a fresh executing turn and stops after completion or staleness', function () {
        var start = row('event_msg', { type: 'task_started' });
        (0, vitest_1.expect)((0, observation_1.codexEvents)(start, now - 1000, now).state).toBe('working');
        (0, vitest_1.expect)((0, observation_1.codexEvents)(start, now - 1000, now + 100000).state).toBe('unobserved');
        (0, vitest_1.expect)((0, observation_1.codexEvents)(start + '\n' + row('event_msg', { type: 'task_complete' }), now - 1000, now).state).toBe('review');
    });
    (0, vitest_1.it)('records an explicit failing command output and never treats prose as a passed test', function () {
        var text = [row('response_item', { type: 'function_call', name: 'exec_command', call_id: 'a', arguments: JSON.stringify({ cmd: 'npm test' }) }), row('response_item', { type: 'function_call_output', call_id: 'a', output: 'Process exited with code 1\nTests failed' }), row('response_item', { type: 'message', role: 'assistant', content: 'All tests pass' })].join('\n');
        var observed = (0, observation_1.codexEvents)(text, now - 1000, now);
        (0, vitest_1.expect)(observed.step).toMatchObject({ kind: 'test', status: 'failed', subject: 'npm test' });
    });
    (0, vitest_1.it)('does not call a background launch successful or accept future timestamps', function () {
        var text = [row('response_item', { type: 'function_call', name: 'exec_command', call_id: 'a', arguments: JSON.stringify({ cmd: 'npm test' }) }), row('response_item', { type: 'function_call_output', call_id: 'a', output: 'Process running with session ID 42' }), row('event_msg', { type: 'task_started' }, now + 10000)].join('\n');
        (0, vitest_1.expect)((0, observation_1.codexEvents)(text + '\n{"unfinished', now - 1000, now).step.status).toBe('running');
    });
});
(0, vitest_1.describe)('Claude\'s proposal as Branches shows it', function () {
    var changed = [{ status: ' M', path: 'a.ts', previous: null }, { status: '??', path: 'b.ts', previous: null }];
    var proposal = { message: 'fixed the retry button', files: ['a.ts', 'b.ts'], head: test_fixtures_1.SOURCE, at: '2026-11-20T09:00:00+01:00' };
    (0, vitest_1.it)('shows a proposal made on the branch\'s current commit, as it was saved', function () {
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(proposal, test_fixtures_1.SOURCE, changed)).toEqual(proposal);
    });
    (0, vitest_1.it)('keeps only the proposed files that are still changed', function () {
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(__assign(__assign({}, proposal), { files: ['gone.ts', 'b.ts'] }), test_fixtures_1.SOURCE, changed)).toEqual(__assign(__assign({}, proposal), { files: ['b.ts'] }));
    });
    (0, vitest_1.it)('drops a proposed path that is not a plain file in the repository, even when listed as changed', function () {
        var odd = __spreadArray(__spreadArray([], changed, true), [{ status: ' M', path: '.git/config', previous: null }, { status: ' M', path: '../outside.ts', previous: null }], false);
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(__assign(__assign({}, proposal), { files: ['.git/config', '../outside.ts', 42, 'a.ts'] }), test_fixtures_1.SOURCE, odd)).toEqual(__assign(__assign({}, proposal), { files: ['a.ts'] }));
    });
    (0, vitest_1.it)('shows nothing once the branch has moved on from the commit it was made on', function () {
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(proposal, test_fixtures_1.TARGET, changed)).toBeNull();
    });
    (0, vitest_1.it)('shows nothing when none of its files is still changed', function () {
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(proposal, test_fixtures_1.SOURCE, [])).toBeNull();
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(__assign(__assign({}, proposal), { files: [] }), test_fixtures_1.SOURCE, changed)).toBeNull();
    });
    vitest_1.it.each([
        ['no proposal', undefined],
        ['null', null],
        ['text', 'fixed x'],
        ['an empty message', __assign(__assign({}, proposal), { message: '' })],
        ['a blank message', __assign(__assign({}, proposal), { message: ' \n\t ' })],
        ['a message that is not text', __assign(__assign({}, proposal), { message: 42 })],
        ['no head', __assign(__assign({}, proposal), { head: undefined })],
        ['no time', __assign(__assign({}, proposal), { at: undefined })],
        ['a time that is not text', __assign(__assign({}, proposal), { at: 1 })],
        ['files that are not a list', __assign(__assign({}, proposal), { files: 'a.ts' })],
        ['no files', __assign(__assign({}, proposal), { files: undefined })],
    ])('shows nothing for %s read from the record', function (_, saved) {
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(saved, test_fixtures_1.SOURCE, changed)).toBeNull();
    });
    vitest_1.it.each([
        'fixed x\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
        'fixed x\n\nGenerated with Claude Code',
        'fixed x\n\nProposed by Claude',
        'fixed x 🤖',
    ])('shows nothing when the saved message credits Claude: %j', function (message) {
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(__assign(__assign({}, proposal), { message: message }), test_fixtures_1.SOURCE, changed)).toBeNull();
    });
    (0, vitest_1.it)('shows a message that only names Claude Code as a feature', function () {
        (0, vitest_1.expect)((0, git_rules_1.proposalFor)(__assign(__assign({}, proposal), { message: 'added Claude Code session probe' }), test_fixtures_1.SOURCE, changed)).toEqual(__assign(__assign({}, proposal), { message: 'added Claude Code session probe' }));
    });
});
