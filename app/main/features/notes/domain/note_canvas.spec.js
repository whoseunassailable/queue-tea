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
var note_canvas_1 = require("./note_canvas");
var node = function (id, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: id, type: 'text', text: 'Hi', x: 0, y: 0, width: 100, height: 50 }, over));
};
(0, vitest_1.describe)('a canvas file', function () {
    (0, vitest_1.it)('keeps every plain field it does not read, so an Obsidian board saves back whole', function () {
        var board = { nodes: [node('a', { color: '#ff0000', isLocked: true, z: 2 }), node('g', { type: 'group', label: 'Week 1', background: 'bg.png', backgroundStyle: 'cover', text: undefined })], edges: [{ id: 'e', fromNode: 'a', fromSide: 'bottom', fromEnd: 'arrow', toNode: 'g', toSide: 'top', toEnd: 'none', color: '2', label: 'next' }] };
        (0, vitest_1.expect)((0, note_canvas_1.canvasOf)(board)).toEqual({ nodes: [node('a', { color: '#ff0000', isLocked: true, z: 2 }), { id: 'g', type: 'group', label: 'Week 1', background: 'bg.png', backgroundStyle: 'cover', x: 0, y: 0, width: 100, height: 50 }], edges: board.edges });
        (0, vitest_1.expect)((0, note_canvas_1.parseCanvas)((0, note_canvas_1.canvasText)((0, note_canvas_1.canvasOf)(board)))).toEqual((0, note_canvas_1.canvasOf)(board));
    });
    (0, vitest_1.it)('reads an empty file and missing lists as an empty board', function () {
        (0, vitest_1.expect)((0, note_canvas_1.parseCanvas)('')).toEqual({ nodes: [], edges: [] });
        (0, vitest_1.expect)((0, note_canvas_1.parseCanvas)('{}')).toEqual({ nodes: [], edges: [] });
    });
    (0, vitest_1.it)('drops a line to a card that is not there', function () {
        var _a;
        (0, vitest_1.expect)((_a = (0, note_canvas_1.canvasOf)({ nodes: [node('a')], edges: [{ id: 'e', fromNode: 'a', toNode: 'gone' }] })) === null || _a === void 0 ? void 0 : _a.edges).toEqual([]);
    });
    (0, vitest_1.it)('refuses what it could not write back safely', function () {
        for (var _i = 0, _a = [
            '{ not json',
            '[]',
            '{"nodes": {}}',
            JSON.stringify({ nodes: [node('a'), node('a')] }),
            JSON.stringify({ nodes: [node('a')], edges: [{ id: 'e', fromNode: 'a', toNode: 'a' }, { id: 'e', fromNode: 'a', toNode: 'a' }] }),
            JSON.stringify({ nodes: [node('')] }),
            JSON.stringify({ nodes: [node('x'.repeat(65))] }),
            JSON.stringify({ nodes: [node('a', { type: 'bad type' })] }),
            JSON.stringify({ nodes: [node('a', { width: -1 })] }),
            JSON.stringify({ nodes: [node('a', { x: 1e8 })] }),
            JSON.stringify({ nodes: [node('a', { file: 3 })] }),
            JSON.stringify({ nodes: [node('a', { meta: { nested: true } })] }),
            JSON.stringify({ nodes: [node('a', { 'bad key': 1 })] }),
            JSON.stringify({ nodes: [node('a', Object.fromEntries(Array.from({ length: 20 }, function (_, i) { return ["k".concat(i), i]; })))] }),
            JSON.stringify({ nodes: Array.from({ length: 1001 }, function (_, i) { return node("n".concat(i)); }) }),
        ]; _i < _a.length; _i++) {
            var bad = _a[_i];
            (0, vitest_1.expect)((0, note_canvas_1.parseCanvas)(bad)).toBeNull();
        }
    });
});
