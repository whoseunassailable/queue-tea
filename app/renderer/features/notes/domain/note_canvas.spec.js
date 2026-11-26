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
var vitest_1 = require("vitest");
var constants_1 = require("../../../core/constants/constants");
var note_canvas_1 = require("./note_canvas");
var node = function (id, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: id, type: 'text', text: '', x: 0, y: 0, width: 100, height: 50 }, over));
};
var empty = { nodes: [], edges: [] };
(0, vitest_1.describe)('what a card shows', function () {
    (0, vitest_1.it)('reads notes, quests, files, links, text and groups as Obsidian stores them', function () {
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'file', file: 'n-3f9a2b7e.md' }))).toEqual({ kind: 'note', id: 'n-3f9a2b7e' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'file', file: 'Clinic visit.md' }))).toEqual({ kind: 'note', id: 'Clinic visit' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'file', file: 'attachments/ab.png' }))).toEqual({ kind: 'file', path: 'attachments/ab.png' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'link', url: 'https://example.com/post' }))).toEqual({ kind: 'link', url: 'https://example.com/post' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { text: ' [[quest:t-e84dd5ab|Write the parser]] ' }))).toEqual({ kind: 'quest', id: 't-e84dd5ab', shown: 'Write the parser' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { text: 'Do [[quest:t-e84dd5ab|this]] first' }))).toEqual({ kind: 'text', text: 'Do [[quest:t-e84dd5ab|this]] first' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'group', label: 'Week 1' }))).toEqual({ kind: 'group', label: 'Week 1' });
    });
    (0, vitest_1.it)('shows what it cannot follow as it is: a note in a subfolder, a file outside the vault, a link that is not a web page', function () {
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'file', file: 'Projects/plan.md' }))).toEqual({ kind: 'other', text: 'Projects/plan.md' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'file', file: '../secret.png' }))).toEqual({ kind: 'other', text: '../secret.png' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'link', url: 'javascript:alert(1)' }))).toEqual({ kind: 'other', text: 'javascript:alert(1)' });
        (0, vitest_1.expect)((0, note_canvas_1.cardOf)(node('a', { type: 'sticker', text: undefined }))).toEqual({ kind: 'other', text: '' });
    });
});
(0, vitest_1.describe)('changing the board', function () {
    (0, vitest_1.it)('centres a new card on the view, fanning out past one already there, in the format Obsidian reads', function () {
        var one = (0, note_canvas_1.withCard)(empty, 'a', { kind: 'note', id: 'n-1' }, { x: 0, y: 0 });
        var three = (0, note_canvas_1.withCard)((0, note_canvas_1.withCard)(one, 'b', { kind: 'note', id: 'n-2' }, { x: 0, y: 0 }), 'c', { kind: 'note', id: 'n-3' }, { x: 0, y: 0 });
        var size = constants_1.CANVAS_CARD_SIZE.note;
        (0, vitest_1.expect)(one.nodes).toEqual([__assign({ id: 'a', type: 'file', file: 'n-1.md', x: -size.width / 2, y: -size.height / 2 }, size)]);
        (0, vitest_1.expect)(three.nodes.map(function (card) { return [card.x, card.y]; })).toEqual([0, 1, 2].map(function (n) { return [-size.width / 2 + n * constants_1.CANVAS_CASCADE_PX, -size.height / 2 + n * constants_1.CANVAS_CASCADE_PX]; }));
        (0, vitest_1.expect)((0, note_canvas_1.withCard)(empty, 'q', { kind: 'quest', id: 't-1', title: 'Write [the] parser' }, { x: 0, y: 0 }).nodes[0]).toMatchObject(__assign({ type: 'text', text: '[[quest:t-1|Write the parser]]' }, constants_1.CANVAS_CARD_SIZE.quest));
        (0, vitest_1.expect)((0, note_canvas_1.withCard)(empty, 'c', { kind: 'link', url: 'https://example.com' }, { x: 0, y: 0 }).nodes[0]).toMatchObject({ type: 'link', url: 'https://example.com' });
        (0, vitest_1.expect)((0, note_canvas_1.withCard)(empty, 'd', { kind: 'file', path: 'attachments/ab.png' }, { x: 0, y: 0 }).nodes[0]).toMatchObject({ type: 'file', file: 'attachments/ab.png' });
    });
    (0, vitest_1.it)('moves and resizes in whole pixels, never below the smallest card, keeping fields it does not own', function () {
        var board = { nodes: [node('a', { color: '3' })], edges: [] };
        (0, vitest_1.expect)((0, note_canvas_1.withPlace)(board, 'a', { x: 10.4, y: -3.6 }).nodes[0]).toEqual(node('a', { color: '3', x: 10, y: -4 }));
        (0, vitest_1.expect)((0, note_canvas_1.withPlace)(board, 'a', { width: 5, height: 900.5 }).nodes[0]).toMatchObject({ width: constants_1.CANVAS_MIN_SIZE.width, height: 901 });
    });
    (0, vitest_1.it)('joins two cards once, from the sides that face each other, and never a card to itself', function () {
        var board = { nodes: [node('a'), node('b', { x: 300, y: 40 }), node('c', { y: 300 })], edges: [] };
        var joined = (0, note_canvas_1.withLine)(board, 'e', 'a', 'b');
        (0, vitest_1.expect)(joined.edges).toEqual([{ id: 'e', fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left' }]);
        (0, vitest_1.expect)((0, note_canvas_1.withLine)(joined, 'f', 'b', 'a')).toBe(joined);
        (0, vitest_1.expect)((0, note_canvas_1.withLine)(joined, 'f', 'a', 'a')).toBe(joined);
        (0, vitest_1.expect)((0, note_canvas_1.withLine)(joined, 'f', 'a', 'gone')).toBe(joined);
        (0, vitest_1.expect)((0, note_canvas_1.withLine)(joined, 'f', 'a', 'c').edges[1]).toMatchObject({ fromSide: 'bottom', toSide: 'top' });
    });
    (0, vitest_1.it)('removes a card with its lines, or one line alone', function () {
        var board = (0, note_canvas_1.withLine)((0, note_canvas_1.withLine)({ nodes: [node('a'), node('b', { x: 300 }), node('c', { y: 300 })], edges: [] }, 'ab', 'a', 'b'), 'bc', 'b', 'c');
        (0, vitest_1.expect)((0, note_canvas_1.withoutCard)(board, 'b')).toEqual({ nodes: [node('a'), node('c', { y: 300 })], edges: [] });
        (0, vitest_1.expect)((0, note_canvas_1.withoutLine)(board, 'ab').edges.map(function (edge) { return edge.id; })).toEqual(['bc']);
    });
});
(0, vitest_1.describe)('drawing the board', function () {
    (0, vitest_1.it)('faces left and right when cards sit side by side, and up and down otherwise', function () {
        (0, vitest_1.expect)((0, note_canvas_1.sidesOf)(node('a'), node('b', { x: -300, y: 50 }))).toEqual(['left', 'right']);
        (0, vitest_1.expect)((0, note_canvas_1.sidesOf)(node('a'), node('b', { x: 20, y: -200 }))).toEqual(['top', 'bottom']);
    });
    (0, vitest_1.it)('bows a line out of the sides it was given, with arrows where the format puts them', function () {
        var _a = [node('a'), node('b', { x: 300 })], a = _a[0], b = _a[1];
        var path = (0, note_canvas_1.linePathOf)(a, b, { id: 'e', fromNode: 'a', toNode: 'b' });
        (0, vitest_1.expect)(path).toMatchObject({ isArrowTo: true, isArrowFrom: false, mid: { x: 200, y: 25 } });
        (0, vitest_1.expect)(path.d).toBe('M 100 25 C 200 25 200 25 300 25');
        (0, vitest_1.expect)((0, note_canvas_1.linePathOf)(a, b, { id: 'e', fromNode: 'a', fromSide: 'bottom', toNode: 'b', toSide: 'nowhere', fromEnd: 'arrow', toEnd: 'none' })).toMatchObject({ isArrowTo: false, isArrowFrom: true, d: vitest_1.expect.stringMatching(/^M 50 50 C 50 /) });
    });
    (0, vitest_1.it)('bounds every card, or none on an empty board', function () {
        (0, vitest_1.expect)((0, note_canvas_1.boundsOf)([])).toBeNull();
        (0, vitest_1.expect)((0, note_canvas_1.boundsOf)([node('a', { x: -10 }), node('b', { x: 200, y: 300 })])).toEqual({ left: -10, top: 0, right: 300, bottom: 350 });
    });
});
