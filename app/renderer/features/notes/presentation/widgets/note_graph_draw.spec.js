"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_support_1 = require("../../../../test_support");
var note_graph_1 = require("../../domain/note_graph");
var note_graph_draw_1 = require("./note_graph_draw");
// A 2D context that records the text it is asked to fill and ignores everything else.
var recordingContext = function () {
    var texts = [];
    var ctx = new Proxy({}, {
        get: function (store, key) { return (key === 'fillText' ? function (text) { return void texts.push(text); } : key in store ? store[key] : function () { return undefined; }); },
        set: function (store, key, value) { return ((store[key] = value), true); },
    });
    return { ctx: ctx, texts: texts };
};
(0, vitest_1.it)('labels a quest that is not in the queue with the gone-quest text', function () {
    var open = (0, test_support_1.note)({ id: 'n-00000001', title: 'Gait sensor', body: '[[quest:t-5e6f|Old]]' });
    var graph = (0, note_graph_1.noteGraphOf)([open], new Map());
    var gone = (0, note_graph_1.questNodeId)('t-5e6f');
    var colour = '#000';
    var colours = { note: colour, meeting: colour, quest: colour, gone: colour, line: colour, ring: colour, label: colour, halo: colour };
    // goneQuest is the argument the fix is expected to pass the text in by.
    var frame = {
        width: 800, height: 600, ratio: 1, view: { zoom: 1, x: 400, y: 300 },
        graph: graph,
        shown: new Set(graph.nodes.keys()), openId: open.id, hot: null, isLabelled: true,
        colours: colours,
        points: new Map([[open.id, { x: 0, y: 0 }], [gone, { x: 60, y: 0 }]]),
        goneQuest: 'Quest not in the queue',
    };
    var _a = recordingContext(), ctx = _a.ctx, texts = _a.texts;
    (0, note_graph_draw_1.drawGraph)(ctx, frame);
    (0, vitest_1.expect)(texts).toContain('Gait sensor');
    (0, vitest_1.expect)(texts).toContain('Quest not in the queue');
});
