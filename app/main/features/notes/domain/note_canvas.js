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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCanvas = exports.canvasText = exports.canvasOf = void 0;
var note_canvas_1 = require("../../../../shared/note_canvas");
// The canvas file, read from disk or sent by the window. Every field the
// format may add is kept as it came, as long as it's a plain value, so a
// board made in Obsidian saves back without losing its colours or labels.
// null: not a canvas Queue-tea can keep safely.
var KEY = /^[A-Za-z][A-Za-z0-9_-]{0,39}$/;
var isObject = function (value) { return typeof value === 'object' && value !== null && !Array.isArray(value); };
var isId = function (value) { return typeof value === 'string' && value.length > 0 && value.length <= note_canvas_1.CANVAS_LIMITS.id; };
var isPlace = function (value) { return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= note_canvas_1.CANVAS_LIMITS.coordinate; };
var isSize = function (value) { return isPlace(value) && value > 0; };
var isValue = function (value) { return (typeof value === 'string' ? value.length <= note_canvas_1.CANVAS_LIMITS.text : typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))); };
var extrasOf = function (value, known) {
    var extra = Object.entries(value).filter(function (_a) {
        var key = _a[0], field = _a[1];
        return !known.includes(key) && field !== undefined;
    });
    if (extra.length > note_canvas_1.CANVAS_LIMITS.extras || extra.some(function (_a) {
        var key = _a[0], field = _a[1];
        return !KEY.test(key) || !isValue(field);
    }))
        return null;
    return Object.fromEntries(extra);
};
var nodeOf = function (value) {
    if (!isObject(value) || !isId(value.id) || typeof value.type !== 'string' || !KEY.test(value.type))
        return null;
    var x = value.x, y = value.y, width = value.width, height = value.height;
    if (!isPlace(x) || !isPlace(y) || !isSize(width) || !isSize(height))
        return null;
    if (['text', 'file', 'url'].some(function (field) { return value[field] !== undefined && typeof value[field] !== 'string'; }))
        return null;
    var extras = extrasOf(value, ['id', 'type', 'x', 'y', 'width', 'height']);
    return extras === null ? null : __assign(__assign({ id: value.id, type: value.type }, extras), { x: x, y: y, width: width, height: height });
};
var edgeOf = function (value) {
    if (!isObject(value) || !isId(value.id) || !isId(value.fromNode) || !isId(value.toNode))
        return null;
    var extras = extrasOf(value, ['id', 'fromNode', 'toNode']);
    return extras === null ? null : __assign({ id: value.id, fromNode: value.fromNode, toNode: value.toNode }, extras);
};
var isUnique = function (ids) { return new Set(ids).size === ids.length; };
var canvasOf = function (value) {
    var _a, _b;
    if (!isObject(value))
        return null;
    var given = { nodes: (_a = value.nodes) !== null && _a !== void 0 ? _a : [], edges: (_b = value.edges) !== null && _b !== void 0 ? _b : [] };
    if (!Array.isArray(given.nodes) || !Array.isArray(given.edges) || given.nodes.length > note_canvas_1.CANVAS_LIMITS.nodes || given.edges.length > note_canvas_1.CANVAS_LIMITS.edges)
        return null;
    var nodes = given.nodes.map(nodeOf);
    var edges = given.edges.map(edgeOf);
    if (nodes.some(function (node) { return node === null; }) || edges.some(function (edge) { return edge === null; }))
        return null;
    var kept = nodes;
    if (!isUnique(kept.map(function (node) { return node.id; })) || !isUnique(edges.map(function (edge) { return edge.id; })))
        return null;
    var ids = new Set(kept.map(function (node) { return node.id; }));
    // A line to a card that isn't there draws nothing in Obsidian either, so dropping it loses nothing.
    return { nodes: kept, edges: edges.filter(function (edge) { return ids.has(edge.fromNode) && ids.has(edge.toNode); }) };
};
exports.canvasOf = canvasOf;
// Tabs, as Obsidian writes it, so a board saved here diffs cleanly there.
var canvasText = function (canvas) { return "".concat(JSON.stringify({ nodes: canvas.nodes, edges: canvas.edges }, null, '\t'), "\n"); };
exports.canvasText = canvasText;
var parseCanvas = function (text) {
    if (text.trim() === '')
        return { nodes: [], edges: [] };
    try {
        return (0, exports.canvasOf)(JSON.parse(text));
    }
    catch (_a) {
        // Not JSON at all: the caller says so, and the file is left as it is.
        return null;
    }
};
exports.parseCanvas = parseCanvas;
