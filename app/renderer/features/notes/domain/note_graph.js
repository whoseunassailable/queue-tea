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
exports.shownIdsOf = exports.aroundOf = exports.noteGraphOf = exports.questIdOfNode = exports.questNodeId = exports.SHOW_ALL = void 0;
var notes_1 = require("../../../../shared/notes");
var notes_view_1 = require("./notes_view");
exports.SHOW_ALL = { hiddenTypes: new Set(), quests: true, doneQuests: true };
// A note id can't hold '/', so a quest's node id never clashes with a note's.
var QUEST_NODE = 'quest/';
var questNodeId = function (questId) { return "".concat(QUEST_NODE).concat(questId); };
exports.questNodeId = questNodeId;
var questIdOfNode = function (nodeId) { return (nodeId.startsWith(QUEST_NODE) ? nodeId.slice(QUEST_NODE.length) : null); };
exports.questIdOfNode = questIdOfNode;
// Keeps nodes and their neighbours, and counts and lists the lines between them.
var graphOf = function (nodes, neighbours) {
    var _a;
    var edges = [];
    var kept = new Map();
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var _b = nodes_1[_i], id = _b[0], node = _b[1];
        var near = (_a = neighbours.get(id)) !== null && _a !== void 0 ? _a : new Set();
        kept.set(id, __assign(__assign({}, node), { links: near.size }));
        for (var _c = 0, near_1 = near; _c < near_1.length; _c++) {
            var other = near_1[_c];
            if (id < other)
                edges.push({ a: id, b: other });
        }
    }
    return { nodes: kept, edges: edges, neighbours: neighbours };
};
var noteGraphOf = function (notes, quests) {
    var live = notes.filter(function (note) { return !note.isArchived; });
    // The first note with a title wins, as noteTitled picks it.
    var byTitle = new Map();
    for (var _i = 0, live_1 = live; _i < live_1.length; _i++) {
        var note = live_1[_i];
        if (!byTitle.has(note.title.toLowerCase()))
            byTitle.set(note.title.toLowerCase(), note);
    }
    var nodes = new Map();
    var neighbours = new Map();
    var join = function (a, b) {
        var _a, _b;
        if (a === b)
            return;
        neighbours.set(a, ((_a = neighbours.get(a)) !== null && _a !== void 0 ? _a : new Set()).add(b));
        neighbours.set(b, ((_b = neighbours.get(b)) !== null && _b !== void 0 ? _b : new Set()).add(a));
    };
    for (var _a = 0, live_2 = live; _a < live_2.length; _a++) {
        var note = live_2[_a];
        nodes.set(note.id, { id: note.id, kind: note.type === 'meeting' ? 'meeting' : 'note', title: note.title, noteType: note.type, questState: null, links: 0 });
    }
    for (var _b = 0, live_3 = live; _b < live_3.length; _b++) {
        var note = live_3[_b];
        for (var _c = 0, _d = (0, notes_1.linksOf)(note.body); _c < _d.length; _c++) {
            var title = _d[_c];
            var target = byTitle.get(title.toLowerCase());
            if (target !== undefined)
                join(note.id, target.id);
        }
        for (var _e = 0, _f = __spreadArray(__spreadArray([], (0, notes_1.questLinksOf)(note.body), true), note.quests.map(function (quest) { return quest.id; }), true); _e < _f.length; _e++) {
            var questId = _f[_e];
            var id = (0, exports.questNodeId)(questId);
            if (!nodes.has(id)) {
                var line = (0, notes_view_1.questLineOf)(quests, questId);
                nodes.set(id, { id: id, kind: 'quest', title: line.title, noteType: null, questState: line.state, links: 0 });
            }
            join(note.id, id);
        }
    }
    return graphOf(nodes, neighbours);
};
exports.noteGraphOf = noteGraphOf;
// The nodes within steps of the centre, following lines either way.
var aroundOf = function (graph, centre, steps) {
    var _a;
    if (!graph.nodes.has(centre))
        return { nodes: new Map(), edges: [], neighbours: new Map() };
    var reached = new Set([centre]);
    var edge = [centre];
    for (var step = 0; step < steps; step++) {
        var next = [];
        for (var _i = 0, edge_1 = edge; _i < edge_1.length; _i++) {
            var id = edge_1[_i];
            for (var _b = 0, _c = (_a = graph.neighbours.get(id)) !== null && _a !== void 0 ? _a : []; _b < _c.length; _b++) {
                var other = _c[_b];
                if (!reached.has(other)) {
                    reached.add(other);
                    next.push(other);
                }
            }
        }
        edge = next;
    }
    var nodes = new Map(__spreadArray([], graph.nodes, true).filter(function (_a) {
        var id = _a[0];
        return reached.has(id);
    }));
    var neighbours = new Map(__spreadArray([], reached, true).map(function (id) { var _a; return [id, new Set(__spreadArray([], ((_a = graph.neighbours.get(id)) !== null && _a !== void 0 ? _a : []), true).filter(function (other) { return reached.has(other); }))]; }));
    return graphOf(nodes, neighbours);
};
exports.aroundOf = aroundOf;
var shownIdsOf = function (graph, filter, openId) {
    var isShown = function (node) {
        var _a;
        if (node.id === openId)
            return true;
        if (node.kind === 'quest')
            return filter.quests && (node.questState !== 'done' || filter.doneQuests);
        return !filter.hiddenTypes.has((_a = node.noteType) !== null && _a !== void 0 ? _a : 'none');
    };
    return new Set(__spreadArray([], graph.nodes.values(), true).filter(isShown).map(function (node) { return node.id; }));
};
exports.shownIdsOf = shownIdsOf;
