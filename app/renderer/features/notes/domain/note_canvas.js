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
exports.boundsOf = exports.linePathOf = exports.withLine = exports.sidesOf = exports.withPlace = exports.withoutLine = exports.withoutCard = exports.withCard = exports.cardOf = void 0;
var note_attachments_1 = require("../../../../shared/note_attachments");
var note_bookmarks_1 = require("../../../../shared/note_bookmarks");
var note_canvas_1 = require("../../../../shared/note_canvas");
var notes_1 = require("../../../../shared/notes");
var constants_1 = require("../../../core/constants/constants");
var cardOf = function (node) {
    var _a, _b, _c, _d, _e;
    if (node.type === 'file' && node.file !== undefined) {
        var id = node.file.endsWith('.md') ? node.file.slice(0, -3) : null;
        if (id !== null && (0, notes_1.isNoteId)(id))
            return { kind: 'note', id: id };
        var path = (0, note_attachments_1.noteFilePath)(node.file);
        return path === null ? { kind: 'other', text: node.file } : { kind: 'file', path: path };
    }
    if (node.type === 'link' && node.url !== undefined) {
        var url = (0, note_bookmarks_1.bookmarkUrlOf)(node.url);
        return url === null ? { kind: 'other', text: node.url } : { kind: 'link', url: url };
    }
    if (node.type === 'text') {
        var parts = (0, notes_1.linkPartsOf)(((_a = node.text) !== null && _a !== void 0 ? _a : '').trim());
        var only = parts.length === 1 ? parts[0] : null;
        return (only === null || only === void 0 ? void 0 : only.kind) === 'quest' ? { kind: 'quest', id: only.id, shown: only.shown } : { kind: 'text', text: (_b = node.text) !== null && _b !== void 0 ? _b : '' };
    }
    if (node.type === 'group')
        return { kind: 'group', label: typeof node.label === 'string' ? node.label : '' };
    return { kind: 'other', text: (_e = (_d = (_c = node.text) !== null && _c !== void 0 ? _c : node.file) !== null && _d !== void 0 ? _d : node.url) !== null && _e !== void 0 ? _e : '' };
};
exports.cardOf = cardOf;
var fieldsOf = function (card) {
    return card.kind === 'note' ? { type: 'file', file: "".concat(card.id, ".md") } : card.kind === 'quest' ? { type: 'text', text: "[[".concat((0, notes_1.questLinkOf)(card.id, card.title), "]]") } : card.kind === 'link' ? { type: 'link', url: card.url } : { type: 'file', file: card.path };
};
// The card, centred on centre, stepped down and right past any card that
// starts at the same place, so a run of new cards fans out instead of stacking.
var withCard = function (canvas, id, card, centre) {
    var size = constants_1.CANVAS_CARD_SIZE[card.kind];
    var at = { x: Math.round(centre.x - size.width / 2), y: Math.round(centre.y - size.height / 2) };
    while (canvas.nodes.some(function (node) { return node.x === at.x && node.y === at.y; }))
        at = { x: at.x + constants_1.CANVAS_CASCADE_PX, y: at.y + constants_1.CANVAS_CASCADE_PX };
    return __assign(__assign({}, canvas), { nodes: __spreadArray(__spreadArray([], canvas.nodes, true), [__assign(__assign(__assign({ id: id }, fieldsOf(card)), at), size)], false) });
};
exports.withCard = withCard;
var withoutCard = function (canvas, id) { return ({ nodes: canvas.nodes.filter(function (node) { return node.id !== id; }), edges: canvas.edges.filter(function (edge) { return edge.fromNode !== id && edge.toNode !== id; }) }); };
exports.withoutCard = withoutCard;
var withoutLine = function (canvas, id) { return (__assign(__assign({}, canvas), { edges: canvas.edges.filter(function (edge) { return edge.id !== id; }) })); };
exports.withoutLine = withoutLine;
// Moves or resizes a card; resizing never makes it smaller than CANVAS_MIN_SIZE,
// and moving leaves a smaller card made in Obsidian the size it is.
var withPlace = function (canvas, id, place) { return (__assign(__assign({}, canvas), { nodes: canvas.nodes.map(function (node) {
        var _a, _b;
        return node.id !== id
            ? node
            : __assign(__assign({}, node), { x: Math.round((_a = place.x) !== null && _a !== void 0 ? _a : node.x), y: Math.round((_b = place.y) !== null && _b !== void 0 ? _b : node.y), width: place.width === undefined ? node.width : Math.max(constants_1.CANVAS_MIN_SIZE.width, Math.round(place.width)), height: place.height === undefined ? node.height : Math.max(constants_1.CANVAS_MIN_SIZE.height, Math.round(place.height)) });
    }) })); };
exports.withPlace = withPlace;
var centreOf = function (node) { return ({ x: node.x + node.width / 2, y: node.y + node.height / 2 }); };
// The sides that face each other: across when the cards sit more side by side, up and down otherwise.
var sidesOf = function (from, to) {
    var _a = [centreOf(from), centreOf(to)], a = _a[0], b = _a[1];
    var _b = [b.x - a.x, b.y - a.y], dx = _b[0], dy = _b[1];
    if (Math.abs(dx) >= Math.abs(dy))
        return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
    return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
};
exports.sidesOf = sidesOf;
// One line from a card to another, drawn from facing sides, as Obsidian
// joins them; a line Queue-tea didn't make keeps the sides it was given. A
// card can't join itself, and two cards join once whichever way round.
// The same canvas back means nothing was added.
var withLine = function (canvas, id, fromId, toId) {
    var from = canvas.nodes.find(function (node) { return node.id === fromId; });
    var to = canvas.nodes.find(function (node) { return node.id === toId; });
    var isJoined = canvas.edges.some(function (edge) { return (edge.fromNode === fromId && edge.toNode === toId) || (edge.fromNode === toId && edge.toNode === fromId); });
    if (from === undefined || to === undefined || fromId === toId || isJoined)
        return canvas;
    var _a = (0, exports.sidesOf)(from, to), fromSide = _a[0], toSide = _a[1];
    return __assign(__assign({}, canvas), { edges: __spreadArray(__spreadArray([], canvas.edges, true), [{ id: id, fromNode: fromId, fromSide: fromSide, toNode: toId, toSide: toSide }], false) });
};
exports.withLine = withLine;
var OUT = { top: { x: 0, y: -1 }, right: { x: 1, y: 0 }, bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 } };
var sideOf = function (value) { var _a; return (_a = note_canvas_1.CANVAS_SIDES.find(function (side) { return side === value; })) !== null && _a !== void 0 ? _a : null; };
var anchorOf = function (node, side) { return ({ x: node.x + (node.width * (OUT[side].x + 1)) / 2, y: node.y + (node.height * (OUT[side].y + 1)) / 2 }); };
var linePathOf = function (from, to, edge) {
    var _a, _b;
    var facing = (0, exports.sidesOf)(from, to);
    var _c = [(_a = sideOf(edge.fromSide)) !== null && _a !== void 0 ? _a : facing[0], (_b = sideOf(edge.toSide)) !== null && _b !== void 0 ? _b : facing[1]], fromSide = _c[0], toSide = _c[1];
    var _d = [anchorOf(from, fromSide), anchorOf(to, toSide)], a = _d[0], b = _d[1];
    var bow = Math.min(constants_1.CANVAS_CURVE_PX, Math.hypot(b.x - a.x, b.y - a.y) / 2);
    var _e = [{ x: a.x + OUT[fromSide].x * bow, y: a.y + OUT[fromSide].y * bow }, { x: b.x + OUT[toSide].x * bow, y: b.y + OUT[toSide].y * bow }], c1 = _e[0], c2 = _e[1];
    // The curve's halfway point: a cubic Bézier at t = 0.5.
    var mid = { x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8 };
    return { d: "M ".concat(a.x, " ").concat(a.y, " C ").concat(c1.x, " ").concat(c1.y, " ").concat(c2.x, " ").concat(c2.y, " ").concat(b.x, " ").concat(b.y), mid: mid, isArrowTo: edge.toEnd !== 'none', isArrowFrom: edge.fromEnd === 'arrow' };
};
exports.linePathOf = linePathOf;
// The box round every card, or null for an empty board.
var boundsOf = function (nodes) {
    return nodes.length === 0
        ? null
        : nodes.reduce(function (box, node) { return ({ left: Math.min(box.left, node.x), top: Math.min(box.top, node.y), right: Math.max(box.right, node.x + node.width), bottom: Math.max(box.bottom, node.y + node.height) }); }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
};
exports.boundsOf = boundsOf;
