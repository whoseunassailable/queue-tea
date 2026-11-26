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
var designs_1 = require("../../../../shared/designs");
var scene_edits_1 = require("./scene_edits");
var text = function (id, name, x, y) { return ({ id: id, type: 'text', name: name, x: x, y: y, width: 310, text: name, font: 'Nunito Sans', size: 15, weight: 400, color: '#1B6650' }); };
var frame = function (id, name, x, y, width, height, children) {
    if (children === void 0) { children = []; }
    return ({ id: id, type: 'frame', name: name, x: x, y: y, width: width, height: height, fill: '#DDF2E8', radius: 12, children: children });
};
// Hero holds the sun; the tip card holds its title; the chart is a layer
// type the editor doesn't know, with a field of its own.
var SCENE = {
    format: 1,
    name: 'Welcome',
    width: 390,
    height: 844,
    fill: '#F6F1E7',
    grid: { size: 8 },
    nodes: [
        frame('hero', 'Hero', 0, 0, 390, 420, [frame('sun', 'Sun', 250, 60, 90, 90)]),
        text('headline', 'Headline', 24, 293),
        frame('tip', 'Tip card', 24, 467, 342, 104, [text('tip-title', 'Tip title', 16, 16)]),
        { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] },
    ],
};
var ids = function (scene) { return (0, designs_1.layersOf)(scene.nodes).map(function (l) { return l.id; }); };
(0, vitest_1.describe)('finding a layer', function () {
    (0, vitest_1.it)('finds a layer at any depth, and none that is gone', function () {
        var _a;
        (0, vitest_1.expect)((_a = (0, scene_edits_1.layerOf)(SCENE, 'tip-title')) === null || _a === void 0 ? void 0 : _a.name).toBe('Tip title');
        (0, vitest_1.expect)((0, scene_edits_1.layerOf)(SCENE, 'gone')).toBeNull();
    });
    (0, vitest_1.it)('names the layer it sits in, and none at the top', function () {
        (0, vitest_1.expect)((0, scene_edits_1.parentOf)(SCENE, 'sun')).toBe('hero');
        (0, vitest_1.expect)((0, scene_edits_1.parentOf)(SCENE, 'hero')).toBeNull();
        (0, vitest_1.expect)((0, scene_edits_1.parentOf)(SCENE, 'gone')).toBeNull();
    });
    (0, vitest_1.it)('places a nested layer by adding up its parents', function () {
        (0, vitest_1.expect)((0, scene_edits_1.placeOf)(SCENE, 'sun')).toEqual({ x: 250, y: 60 });
        (0, vitest_1.expect)((0, scene_edits_1.placeOf)(SCENE, 'tip-title')).toEqual({ x: 40, y: 483 });
        (0, vitest_1.expect)((0, scene_edits_1.placeOf)(SCENE, 'gone')).toBeNull();
    });
});
(0, vitest_1.describe)('changing a layer', function () {
    (0, vitest_1.it)('changes only the fields given, and keeps the rest', function () {
        var after = (0, scene_edits_1.updateLayer)(SCENE, 'chart', { x: 40 });
        (0, vitest_1.expect)((0, scene_edits_1.layerOf)(after, 'chart')).toEqual(__assign(__assign({}, SCENE.nodes[3]), { x: 40 }));
    });
    (0, vitest_1.it)('changes a nested layer and leaves its neighbours alone', function () {
        var _a, _b;
        var after = (0, scene_edits_1.updateLayer)(SCENE, 'sun', { width: 120 });
        (0, vitest_1.expect)((_a = (0, scene_edits_1.layerOf)(after, 'sun')) === null || _a === void 0 ? void 0 : _a.width).toBe(120);
        (0, vitest_1.expect)((_b = (0, scene_edits_1.layerOf)(after, 'hero')) === null || _b === void 0 ? void 0 : _b.width).toBe(390);
        (0, vitest_1.expect)((0, scene_edits_1.layerOf)(after, 'tip')).toEqual((0, scene_edits_1.layerOf)(SCENE, 'tip'));
    });
    (0, vitest_1.it)('changes the design frame itself', function () {
        var after = (0, scene_edits_1.updateLayer)(SCENE, scene_edits_1.DESIGN_FRAME, { fill: '#000000' });
        (0, vitest_1.expect)(after.fill).toBe('#000000');
        (0, vitest_1.expect)(after.grid).toEqual({ size: 8 });
        (0, vitest_1.expect)(after.nodes).toBe(SCENE.nodes);
    });
    (0, vitest_1.it)('leaves the scene it was given as it was, so undo can go back to it', function () {
        var _a, _b;
        (0, scene_edits_1.updateLayer)(SCENE, 'sun', { width: 120 });
        (0, scene_edits_1.moveBy)(SCENE, 'headline', 5, 5);
        (0, scene_edits_1.removeLayer)(SCENE, 'tip');
        (0, vitest_1.expect)((_a = (0, scene_edits_1.layerOf)(SCENE, 'sun')) === null || _a === void 0 ? void 0 : _a.width).toBe(90);
        (0, vitest_1.expect)((_b = (0, scene_edits_1.layerOf)(SCENE, 'headline')) === null || _b === void 0 ? void 0 : _b.x).toBe(24);
        (0, vitest_1.expect)((0, scene_edits_1.layerOf)(SCENE, 'tip')).not.toBeNull();
    });
});
(0, vitest_1.describe)('moving', function () {
    (0, vitest_1.it)('moves by whole pixels', function () {
        (0, vitest_1.expect)((0, scene_edits_1.layerOf)((0, scene_edits_1.moveBy)(SCENE, 'headline', 10.4, -3.6), 'headline')).toMatchObject({ x: 34, y: 289 });
    });
    (0, vitest_1.it)('moves a nested layer within its parent', function () {
        var _a, _b;
        var after = (0, scene_edits_1.moveBy)(SCENE, 'sun', -10, 0);
        (0, vitest_1.expect)((_a = (0, scene_edits_1.layerOf)(after, 'sun')) === null || _a === void 0 ? void 0 : _a.x).toBe(240);
        (0, vitest_1.expect)((_b = (0, scene_edits_1.layerOf)(after, 'hero')) === null || _b === void 0 ? void 0 : _b.x).toBe(0);
    });
    (0, vitest_1.it)('stops at 10,000 either way', function () {
        (0, vitest_1.expect)((0, scene_edits_1.layerOf)((0, scene_edits_1.moveBy)(SCENE, 'headline', 20000, -20000), 'headline')).toMatchObject({ x: 10000, y: -10000 });
    });
    (0, vitest_1.it)('leaves the scene alone for a layer that is gone', function () {
        (0, vitest_1.expect)((0, scene_edits_1.moveBy)(SCENE, 'gone', 5, 5)).toBe(SCENE);
    });
});
(0, vitest_1.describe)('resizing by a handle', function () {
    var START = { x: 10, y: 20, width: 100, height: 50 };
    vitest_1.it.each([
        ['e', { x: 10, y: 20, width: 110, height: 50 }],
        ['w', { x: 20, y: 20, width: 90, height: 50 }],
        ['s', { x: 10, y: 20, width: 100, height: 55 }],
        ['n', { x: 10, y: 25, width: 100, height: 45 }],
        ['se', { x: 10, y: 20, width: 110, height: 55 }],
        ['sw', { x: 20, y: 20, width: 90, height: 55 }],
        ['ne', { x: 10, y: 25, width: 110, height: 45 }],
        ['nw', { x: 20, y: 25, width: 90, height: 45 }],
    ])('the %s handle dragged right 10 and down 5 gives %j', function (handle, box) {
        (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, handle, 10, 5, false)).toEqual(box);
    });
    (0, vitest_1.it)('never makes a box smaller than 1 px, and keeps the far side still', function () {
        (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'w', 500, 0, false)).toEqual({ x: 109, y: 20, width: 1, height: 50 });
        (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'n', 0, 500, false)).toEqual({ x: 10, y: 69, width: 100, height: 1 });
        (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'se', -500, -500, false)).toEqual({ x: 10, y: 20, width: 1, height: 1 });
    });
    (0, vitest_1.it)('never makes a box larger than 10,000 px', function () {
        (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'se', 20000, 20000, false)).toMatchObject({ width: 10000, height: 10000 });
    });
    (0, vitest_1.describe)('keeping proportions', function () {
        (0, vitest_1.it)('lets the side that moved most lead a corner', function () {
            (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'se', 50, 0, true)).toEqual({ x: 10, y: 20, width: 150, height: 75 });
            (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'se', 0, 50, true)).toEqual({ x: 10, y: 20, width: 200, height: 100 });
        });
        (0, vitest_1.it)('makes the other side follow a side handle', function () {
            (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'e', 20, 0, true)).toMatchObject({ width: 120, height: 60 });
            (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 's', 0, 10, true)).toMatchObject({ width: 120, height: 60 });
        });
        (0, vitest_1.it)('keeps the opposite corner still from the north-west', function () {
            (0, vitest_1.expect)((0, scene_edits_1.resizeBox)(START, 'nw', -50, 0, true)).toEqual({ x: -40, y: -5, width: 150, height: 75 });
        });
        (0, vitest_1.it)('does nothing odd with a box of no size', function () {
            var box = (0, scene_edits_1.resizeBox)({ x: 0, y: 0, width: 0, height: 0 }, 'se', 10, 10, true);
            (0, vitest_1.expect)(box).toEqual({ x: 0, y: 0, width: 10, height: 10 });
        });
    });
});
(0, vitest_1.describe)('deleting', function () {
    (0, vitest_1.it)('removes a layer at the top', function () {
        (0, vitest_1.expect)(ids((0, scene_edits_1.removeLayer)(SCENE, 'headline'))).toEqual(['hero', 'sun', 'tip', 'tip-title', 'chart']);
    });
    (0, vitest_1.it)('removes a nested layer and keeps its parent', function () {
        (0, vitest_1.expect)(ids((0, scene_edits_1.removeLayer)(SCENE, 'sun'))).toEqual(['hero', 'headline', 'tip', 'tip-title', 'chart']);
    });
    (0, vitest_1.it)('removes a frame with everything in it', function () {
        (0, vitest_1.expect)(ids((0, scene_edits_1.removeLayer)(SCENE, 'tip'))).toEqual(['hero', 'sun', 'headline', 'chart']);
    });
    (0, vitest_1.it)('changes nothing for a layer that is gone', function () {
        (0, vitest_1.expect)(ids((0, scene_edits_1.removeLayer)(SCENE, 'gone'))).toEqual(ids(SCENE));
    });
});
(0, vitest_1.describe)('duplicating', function () {
    (0, vitest_1.it)('puts the copy just above the layer, 16 px right and down', function () {
        var copied = (0, scene_edits_1.duplicateLayer)(SCENE, 'headline');
        (0, vitest_1.expect)(copied.scene.nodes.map(function (l) { return l.id; })).toEqual(['hero', 'headline', copied.id, 'tip', 'chart']);
        (0, vitest_1.expect)((0, scene_edits_1.layerOf)(copied.scene, copied.id)).toMatchObject({ x: 40, y: 309, text: 'Headline' });
    });
    (0, vitest_1.it)('gives the copy and everything in it ids of their own', function () {
        var _a;
        var copied = (0, scene_edits_1.duplicateLayer)(SCENE, 'tip');
        var all = ids(copied.scene);
        (0, vitest_1.expect)(new Set(all).size).toBe(all.length);
        (0, vitest_1.expect)(copied.id).not.toBe('tip');
        (0, vitest_1.expect)((_a = (0, scene_edits_1.layerOf)(copied.scene, copied.id)) === null || _a === void 0 ? void 0 : _a.children).toHaveLength(1);
    });
    (0, vitest_1.it)('gives each of two copies its own id', function () {
        var once = (0, scene_edits_1.duplicateLayer)(SCENE, 'headline');
        var twice = (0, scene_edits_1.duplicateLayer)(once.scene, 'headline');
        var all = ids(twice.scene);
        (0, vitest_1.expect)(new Set(all).size).toBe(all.length);
        (0, vitest_1.expect)(twice.id).not.toBe(once.id);
    });
    (0, vitest_1.it)('keeps the fields of a layer it does not know, as a copy of their own', function () {
        var _a;
        var copied = (0, scene_edits_1.duplicateLayer)(SCENE, 'chart');
        var copy = (0, scene_edits_1.layerOf)(copied.scene, copied.id);
        (0, vitest_1.expect)(copy).toMatchObject({ type: 'chart', series: [1, 2, 3], height: 60 });
        copy.series.push(4);
        (0, vitest_1.expect)((_a = (0, scene_edits_1.layerOf)(copied.scene, 'chart')) === null || _a === void 0 ? void 0 : _a.series).toEqual([1, 2, 3]);
    });
    (0, vitest_1.it)('copies a nested layer inside the same parent', function () {
        var copied = (0, scene_edits_1.duplicateLayer)(SCENE, 'sun');
        (0, vitest_1.expect)((0, scene_edits_1.parentOf)(copied.scene, copied.id)).toBe('hero');
    });
    (0, vitest_1.it)('names a copy of a nameless layer from its id', function () {
        var nameless = (0, scene_edits_1.updateLayer)(SCENE, 'headline', { name: '' });
        (0, vitest_1.expect)((0, scene_edits_1.duplicateLayer)(nameless, 'headline').id).toBe('headline-2');
    });
    (0, vitest_1.it)('has nothing to copy for a layer that is gone', function () {
        (0, vitest_1.expect)((0, scene_edits_1.duplicateLayer)(SCENE, 'gone')).toBeNull();
    });
});
(0, vitest_1.describe)('Tab through the layers', function () {
    (0, vitest_1.it)('starts at the first layer, or the last going back', function () {
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, null, false)).toBe('hero');
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, null, true)).toBe('chart');
    });
    (0, vitest_1.it)('goes parents first, then what they hold', function () {
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, 'hero', false)).toBe('sun');
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, 'sun', false)).toBe('headline');
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, 'tip', false)).toBe('tip-title');
    });
    (0, vitest_1.it)('wraps round both ways', function () {
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, 'chart', false)).toBe('hero');
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, 'hero', true)).toBe('chart');
    });
    (0, vitest_1.it)('starts again from a layer that is gone', function () {
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(SCENE, 'gone', false)).toBe('hero');
    });
    (0, vitest_1.it)('has nowhere to go in an empty design', function () {
        (0, vitest_1.expect)((0, scene_edits_1.stepFrom)(__assign(__assign({}, SCENE), { nodes: [] }), null, false)).toBeNull();
    });
});
(0, vitest_1.describe)('the handles', function () {
    (0, vitest_1.it)('gives the design frame only its right and bottom edges', function () {
        (0, vitest_1.expect)((0, scene_edits_1.handlesOf)(scene_edits_1.DESIGN_FRAME, null)).toEqual(['e', 's', 'se']);
    });
    (0, vitest_1.it)('gives a text only its width, since it grows with what it says', function () {
        (0, vitest_1.expect)((0, scene_edits_1.handlesOf)('headline', (0, scene_edits_1.layerOf)(SCENE, 'headline'))).toEqual(['e', 'w']);
    });
    (0, vitest_1.it)('gives a frame and an unknown layer all eight', function () {
        (0, vitest_1.expect)((0, scene_edits_1.handlesOf)('tip', (0, scene_edits_1.layerOf)(SCENE, 'tip'))).toHaveLength(8);
        (0, vitest_1.expect)((0, scene_edits_1.handlesOf)('chart', (0, scene_edits_1.layerOf)(SCENE, 'chart'))).toHaveLength(8);
    });
});
