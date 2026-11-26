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
var test_support_1 = require("../../../test_support");
var note_graph_1 = require("./note_graph");
var line = function (title, state) { return ({ title: title, state: state, priority: 'mid', difficulty: 'medium' }); };
(0, vitest_1.describe)('the graph from the notes', function () {
    (0, vitest_1.it)('joins two notes once, whichever way and however often they link', function () {
        var a = (0, test_support_1.note)({ id: 'n-a', title: 'A', body: '[[B]] [[B]]' });
        var b = (0, test_support_1.note)({ id: 'n-b', title: 'B', body: '[[A]]' });
        // B comes first, so its link to A is read first and the ids still come out sorted.
        var graph = (0, note_graph_1.noteGraphOf)([b, a], new Map());
        (0, vitest_1.expect)(graph.edges).toEqual([{ a: 'n-a', b: 'n-b' }]);
        (0, vitest_1.expect)(graph.nodes.get('n-a').links).toBe(1);
        (0, vitest_1.expect)(graph.nodes.get('n-b').links).toBe(1);
    });
    (0, vitest_1.it)('matches a title ignoring case', function () {
        var threat = (0, test_support_1.note)({ id: 'n-threat', title: 'Threat model' });
        var plan = (0, test_support_1.note)({ id: 'n-plan', title: 'Plan', body: 'See [[threat MODEL]].' });
        (0, vitest_1.expect)((0, note_graph_1.noteGraphOf)([threat, plan], new Map()).edges).toEqual([{ a: 'n-plan', b: 'n-threat' }]);
    });
    (0, vitest_1.it)('ignores a link to itself', function () {
        var _a, _b;
        var a = (0, test_support_1.note)({ id: 'n-a', title: 'A', body: 'Back to [[A]].' });
        var graph = (0, note_graph_1.noteGraphOf)([a], new Map());
        (0, vitest_1.expect)(graph.edges).toEqual([]);
        (0, vitest_1.expect)(graph.nodes.get('n-a').links).toBe(0);
        (0, vitest_1.expect)((_b = (_a = graph.neighbours.get('n-a')) === null || _a === void 0 ? void 0 : _a.has('n-a')) !== null && _b !== void 0 ? _b : false).toBe(false);
        (0, vitest_1.expect)(__spreadArray([], (0, note_graph_1.aroundOf)(graph, 'n-a', 2).nodes.keys(), true)).toEqual(['n-a']);
    });
    (0, vitest_1.it)('leaves out archived notes, missing notes and attachment links', function () {
        var live = (0, test_support_1.note)({ id: 'n-live', title: 'Live', body: '[[Old]] [[Nowhere]] [[table.csv]]' });
        var old = (0, test_support_1.note)({ id: 'n-old', title: 'Old', isArchived: true, body: '[[Live]]' });
        var graph = (0, note_graph_1.noteGraphOf)([live, old], new Map());
        (0, vitest_1.expect)(__spreadArray([], graph.nodes.keys(), true)).toEqual(['n-live']);
        (0, vitest_1.expect)(graph.edges).toEqual([]);
    });
    (0, vitest_1.it)('adds each linked or filed quest once, with its state and title', function () {
        var parser = (0, test_support_1.note)({
            id: 'n-parser',
            title: 'Parser',
            body: 'First [[quest:t-1a2b|Parser]].',
            quests: [{ id: 't-1a2b', item: null }, { id: 't-3c4d', item: 'Ship' }],
        });
        var graph = (0, note_graph_1.noteGraphOf)([parser], new Map([['t-1a2b', line('Write the parser', 'active')]]));
        (0, vitest_1.expect)(graph.nodes.get('quest/t-1a2b')).toMatchObject({ kind: 'quest', title: 'Write the parser', questState: 'active' });
        (0, vitest_1.expect)(graph.nodes.get('quest/t-3c4d')).toMatchObject({ kind: 'quest', title: null, questState: 'gone' });
        (0, vitest_1.expect)(graph.edges).toHaveLength(2);
    });
    (0, vitest_1.it)('keeps a linked quest that left the queue, as gone', function () {
        var plan = (0, test_support_1.note)({ id: 'n-plan', title: 'Plan', body: 'Was [[quest:t-9e9e|Old work]].' });
        var graph = (0, note_graph_1.noteGraphOf)([plan], new Map());
        (0, vitest_1.expect)(graph.nodes.get('quest/t-9e9e')).toMatchObject({ kind: 'quest', questState: 'gone' });
        (0, vitest_1.expect)(graph.edges).toEqual([{ a: 'n-plan', b: 'quest/t-9e9e' }]);
    });
    (0, vitest_1.it)('marks a meeting note', function () {
        var graph = (0, note_graph_1.noteGraphOf)([(0, test_support_1.note)({ id: 'n-visit', title: 'Clinic visit', type: 'meeting' }), (0, test_support_1.note)({ id: 'n-idea', title: 'Gait sensor', type: 'idea' })], new Map());
        (0, vitest_1.expect)(graph.nodes.get('n-visit')).toMatchObject({ kind: 'meeting', noteType: 'meeting' });
        (0, vitest_1.expect)(graph.nodes.get('n-idea')).toMatchObject({ kind: 'note', noteType: 'idea' });
    });
    (0, vitest_1.it)('keeps one step or two steps around a note, through a shared quest too', function () {
        var a = (0, test_support_1.note)({ id: 'n-a', title: 'A', body: '[[quest:t-00aa]]' });
        var b = (0, test_support_1.note)({ id: 'n-b', title: 'B', body: '[[quest:t-00aa]] [[C]]' });
        var c = (0, test_support_1.note)({ id: 'n-c', title: 'C' });
        var graph = (0, note_graph_1.noteGraphOf)([a, b, c], new Map([['t-00aa', line('Shared', 'waiting')]]));
        var one = (0, note_graph_1.aroundOf)(graph, 'n-a', 1);
        (0, vitest_1.expect)(new Set(one.nodes.keys())).toEqual(new Set(['n-a', 'quest/t-00aa']));
        (0, vitest_1.expect)(one.edges).toEqual([{ a: 'n-a', b: 'quest/t-00aa' }]);
        (0, vitest_1.expect)(one.nodes.get('quest/t-00aa').links).toBe(1);
        var two = (0, note_graph_1.aroundOf)(graph, 'n-a', 2);
        (0, vitest_1.expect)(new Set(two.nodes.keys())).toEqual(new Set(['n-a', 'quest/t-00aa', 'n-b']));
        (0, vitest_1.expect)(two.edges).toHaveLength(2);
        (0, vitest_1.expect)(two.edges).toEqual(vitest_1.expect.arrayContaining([{ a: 'n-a', b: 'quest/t-00aa' }, { a: 'n-b', b: 'quest/t-00aa' }]));
        (0, vitest_1.expect)(graph.nodes.get('n-b').links).toBe(2);
        (0, vitest_1.expect)(two.nodes.get('n-b').links).toBe(1);
        (0, vitest_1.expect)(two.nodes.get('quest/t-00aa').links).toBe(2);
    });
    (0, vitest_1.it)('hides by type, quests and done quests, but never the open note', function () {
        var open = (0, test_support_1.note)({ id: 'n-open', title: 'Standup', type: 'meeting' });
        var retro = (0, test_support_1.note)({ id: 'n-meet', title: 'Retro', type: 'meeting' });
        var loose = (0, test_support_1.note)({ id: 'n-plain', title: 'Loose thought' });
        var idea = (0, test_support_1.note)({ id: 'n-idea', title: 'Graph view', type: 'idea', body: '[[quest:t-00a1]] [[quest:t-00d0]]' });
        var graph = (0, note_graph_1.noteGraphOf)([open, retro, loose, idea], new Map([['t-00a1', line('Draw it', 'active')], ['t-00d0', line('Ship it', 'done')]]));
        var shown = function (filter) { return __spreadArray([], (0, note_graph_1.shownIdsOf)(graph, filter, 'n-open'), true).sort(); };
        var hiding = function () {
            var types = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                types[_i] = arguments[_i];
            }
            return (__assign(__assign({}, note_graph_1.SHOW_ALL), { hiddenTypes: new Set(types) }));
        };
        (0, vitest_1.expect)(shown(note_graph_1.SHOW_ALL)).toEqual(['n-idea', 'n-meet', 'n-open', 'n-plain', 'quest/t-00a1', 'quest/t-00d0']);
        (0, vitest_1.expect)(shown(hiding('meeting'))).toEqual(['n-idea', 'n-open', 'n-plain', 'quest/t-00a1', 'quest/t-00d0']);
        (0, vitest_1.expect)(shown(hiding('none'))).toEqual(['n-idea', 'n-meet', 'n-open', 'quest/t-00a1', 'quest/t-00d0']);
        (0, vitest_1.expect)(shown(__assign(__assign({}, note_graph_1.SHOW_ALL), { quests: false }))).toEqual(['n-idea', 'n-meet', 'n-open', 'n-plain']);
        (0, vitest_1.expect)(shown(__assign(__assign({}, note_graph_1.SHOW_ALL), { doneQuests: false }))).toEqual(['n-idea', 'n-meet', 'n-open', 'n-plain', 'quest/t-00a1']);
    });
});
