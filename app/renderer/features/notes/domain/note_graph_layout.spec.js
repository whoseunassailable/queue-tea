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
var vitest_1 = require("vitest");
var note_graph_layout_1 = require("./note_graph_layout");
// Ids padded so that string order matches number order, as edges keep a < b.
var id = function (prefix, i) { return "".concat(prefix, "-").concat(String(i).padStart(2, '0')); };
(0, vitest_1.describe)('the layout', function () {
    (0, vitest_1.it)('lays out the same graph the same way twice', function () {
        var input = { ids: ['a', 'b', 'c', 'd'], edges: [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }], centre: null, start: new Map() };
        (0, vitest_1.expect)((0, note_graph_layout_1.layoutOf)(input)).toEqual((0, note_graph_layout_1.layoutOf)(input));
    });
    (0, vitest_1.it)('pins the centre note at the middle', function () {
        var input = { ids: ['c', 'x', 'y'], edges: [{ a: 'c', b: 'x' }, { a: 'c', b: 'y' }], centre: 'c', start: new Map() };
        (0, vitest_1.expect)((0, note_graph_layout_1.layoutOf)(input).get('c')).toEqual({ x: 0, y: 0 });
    });
    (0, vitest_1.it)('gives every node a finite place, linked or not', function () {
        var linked = Array.from({ length: 50 }, function (_, i) { return id('n', i); });
        var unlinked = Array.from({ length: 50 }, function (_, i) { return id('u', i); });
        var edges = linked.slice(1).map(function (b, i) { return ({ a: linked[i], b: b }); });
        var points = (0, note_graph_layout_1.layoutOf)({ ids: __spreadArray(__spreadArray([], linked, true), unlinked, true), edges: edges, centre: null, start: new Map() });
        (0, vitest_1.expect)(points.size).toBe(100);
        for (var _i = 0, _a = points.values(); _i < _a.length; _i++) {
            var point = _a[_i];
            (0, vitest_1.expect)(Number.isFinite(point.x)).toBe(true);
            (0, vitest_1.expect)(Number.isFinite(point.y)).toBe(true);
        }
    });
    (0, vitest_1.it)('reports progress rising to 1', function () {
        var ids = Array.from({ length: 10 }, function (_, i) { return id('n', i); });
        var edges = ids.slice(1).map(function (b, i) { return ({ a: ids[i], b: b }); });
        var shares = [];
        (0, note_graph_layout_1.layoutOf)({ ids: ids, edges: edges, centre: null, start: new Map() }, function (share) { return shares.push(share); });
        (0, vitest_1.expect)(shares.length).toBeGreaterThan(1);
        (0, vitest_1.expect)(shares.some(function (share) { return share < 1; })).toBe(true);
        shares.slice(1).forEach(function (share, i) { return (0, vitest_1.expect)(share).toBeGreaterThanOrEqual(shares[i]); });
        (0, vitest_1.expect)(shares.at(-1)).toBe(1);
    });
});
(0, vitest_1.describe)('finding a node', function () {
    (0, vitest_1.it)('finds the shown node within reach, and nothing beyond it or hidden', function () {
        var points = new Map([['a', { x: 0, y: 0 }], ['b', { x: 30, y: 0 }]]);
        (0, vitest_1.expect)((0, note_graph_layout_1.nodeAt)(points, new Set(['a', 'b']), { x: 4, y: 0 }, 10)).toBe('a');
        (0, vitest_1.expect)((0, note_graph_layout_1.nodeAt)(points, new Set(['a', 'b']), { x: 15, y: 0 }, 10)).toBeNull();
        (0, vitest_1.expect)((0, note_graph_layout_1.nodeAt)(points, new Set(['b']), { x: 4, y: 0 }, 10)).toBeNull();
    });
    (0, vitest_1.it)('moves to the nearest node in a direction', function () {
        var points = new Map([
            ['o', { x: 0, y: 0 }],
            ['p', { x: 10, y: 0 }],
            ['q', { x: 30, y: 1 }],
            ['r', { x: -5, y: 0 }],
            ['s', { x: 2, y: 20 }],
        ]);
        var shown = new Set(points.keys());
        (0, vitest_1.expect)((0, note_graph_layout_1.nextNode)(points, shown, 'o', 'right')).toBe('p');
        (0, vitest_1.expect)((0, note_graph_layout_1.nextNode)(points, shown, 'o', 'left')).toBe('r');
        // y grows downward, so down is the larger y.
        (0, vitest_1.expect)((0, note_graph_layout_1.nextNode)(points, shown, 'o', 'down')).toBe('s');
        (0, vitest_1.expect)((0, note_graph_layout_1.nextNode)(points, shown, 'o', 'up')).toBeNull();
    });
});
