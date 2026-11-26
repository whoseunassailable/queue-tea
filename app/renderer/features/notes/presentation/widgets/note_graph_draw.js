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
exports.drawGraph = exports.graphColoursOf = exports.radiusOf = void 0;
var constants_1 = require("../../../../core/constants/constants");
var DIM = 0.18;
var DONE_ALPHA = 0.45;
var QUEST_SIZE = 6;
var RING_GAP = 3;
var LABEL_FONT = '600 11px "Nunito Sans", system-ui, sans-serif';
// A note grows a little with its links, so hubs stand out.
var radiusOf = function (node) { return (node.kind === 'quest' ? QUEST_SIZE : 4 + Math.min(6, Math.sqrt(node.links) * 1.5)); };
exports.radiusOf = radiusOf;
var TOKENS = {
    note: ['--ink2', '#54473A'],
    meeting: ['--mp', '#3BA6D6'],
    quest: ['--xp', '#2E9C7E'],
    gone: ['--ink3', '#665848'],
    line: ['--line-soft', 'rgba(184,137,58,.45)'],
    ring: ['--gold', '#E8B04B'],
    label: ['--ink', '#2A2218'],
    halo: ['--pn-solid', '#FFFAEE'],
};
// The theme's colours where the graph sits, so day, evening and night all read.
var graphColoursOf = function (element) {
    var style = getComputedStyle(element);
    var colours = {};
    for (var _i = 0, _a = Object.entries(TOKENS); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], _c = _b[1], token = _c[0], fallback = _c[1];
        colours[key] = style.getPropertyValue(token).trim() || fallback;
    }
    return colours;
};
exports.graphColoursOf = graphColoursOf;
var shortTitleOf = function (title) { return (title.length > constants_1.GRAPH_LABEL_CHARS ? "".concat(title.slice(0, constants_1.GRAPH_LABEL_CHARS - 1).trimEnd(), "\u2026") : title); };
var shapeOf = function (ctx, node, at) {
    var r = (0, exports.radiusOf)(node);
    if (node.kind === 'quest') {
        ctx.moveTo(at.x, at.y - r);
        ctx.lineTo(at.x + r, at.y);
        ctx.lineTo(at.x, at.y + r);
        ctx.lineTo(at.x - r, at.y);
        ctx.closePath();
    }
    else {
        ctx.moveTo(at.x + r, at.y);
        ctx.arc(at.x, at.y, r, 0, Math.PI * 2);
    }
};
var drawGraph = function (ctx, frame) {
    var _a, _b;
    var width = frame.width, height = frame.height, ratio = frame.ratio, view = frame.view, graph = frame.graph, points = frame.points, shown = frame.shown, openId = frame.openId, hot = frame.hot, isLabelled = frame.isLabelled, colours = frame.colours, goneQuest = frame.goneQuest;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    var near = hot === null ? null : new Set(__spreadArray([hot], ((_a = graph.neighbours.get(hot)) !== null && _a !== void 0 ? _a : []), true));
    var isBright = function (id) { return near === null || near.has(id); };
    // Layout units from here on, so shapes and lines grow with the zoom.
    ctx.setTransform(ratio * view.zoom, 0, 0, ratio * view.zoom, ratio * view.x, ratio * view.y);
    ctx.lineWidth = 1 / view.zoom;
    ctx.strokeStyle = colours.line;
    // One path per brightness, since a stroke per line is slow at 10,000 lines.
    var strokeLines = function (alpha, isKept) {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (var _i = 0, _a = graph.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            var a = points.get(edge.a);
            var b = points.get(edge.b);
            if (a === undefined || b === undefined || !shown.has(edge.a) || !shown.has(edge.b) || !isKept(edge))
                continue;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
    };
    if (hot === null)
        strokeLines(1, function () { return true; });
    else {
        strokeLines(DIM, function (edge) { return edge.a !== hot && edge.b !== hot; });
        strokeLines(1, function (edge) { return edge.a === hot || edge.b === hot; });
    }
    for (var _i = 0, shown_1 = shown; _i < shown_1.length; _i++) {
        var id = shown_1[_i];
        var node = graph.nodes.get(id);
        var at = points.get(id);
        if (node === undefined || at === undefined)
            continue;
        var alpha = isBright(id) ? 1 : DIM;
        ctx.beginPath();
        shapeOf(ctx, node, at);
        if (node.kind === 'quest' && node.questState === 'gone') {
            ctx.globalAlpha = alpha;
            ctx.setLineDash([2 / view.zoom, 2 / view.zoom]);
            ctx.strokeStyle = colours.gone;
            ctx.stroke();
            ctx.setLineDash([]);
            continue;
        }
        ctx.globalAlpha = node.questState === 'done' ? alpha * DONE_ALPHA : alpha;
        ctx.fillStyle = node.kind === 'quest' ? colours.quest : node.kind === 'meeting' ? colours.meeting : colours.note;
        ctx.fill();
    }
    var open = graph.nodes.get(openId);
    var openAt = points.get(openId);
    if (open !== undefined && openAt !== undefined) {
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2 / view.zoom;
        ctx.strokeStyle = colours.ring;
        ctx.beginPath();
        ctx.arc(openAt.x, openAt.y, (0, exports.radiusOf)(open) + RING_GAP / view.zoom + 1, 0, Math.PI * 2);
        ctx.stroke();
    }
    // Labels in screen pixels, so they stay one size at any zoom.
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.font = LABEL_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = colours.halo;
    ctx.fillStyle = colours.label;
    for (var _c = 0, shown_2 = shown; _c < shown_2.length; _c++) {
        var id = shown_2[_c];
        if (!isLabelled && id !== openId && id !== hot)
            continue;
        var node = graph.nodes.get(id);
        var at = points.get(id);
        if (node === undefined || at === undefined)
            continue;
        var x = at.x * view.zoom + view.x;
        var y = (at.y + (0, exports.radiusOf)(node)) * view.zoom + view.y + 3;
        // Off screen, a title costs time and shows nothing.
        if (x < -200 || x > width + 200 || y < -20 || y > height + 20)
            continue;
        ctx.globalAlpha = isBright(id) ? 1 : DIM;
        var title = shortTitleOf((_b = node.title) !== null && _b !== void 0 ? _b : goneQuest);
        ctx.strokeText(title, x, y);
        ctx.fillText(title, x, y);
    }
    ctx.globalAlpha = 1;
};
exports.drawGraph = drawGraph;
