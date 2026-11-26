"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var history_1 = require("./history");
var scene = function (width) { return ({ format: 1, name: 'Welcome', width: width, height: 844, fill: '#F6F1E7', nodes: [] }); };
var widths = function (h) { return ({ past: h.past.map(function (s) { return s.width; }), present: h.present.width, future: h.future.map(function (s) { return s.width; }) }); };
(0, vitest_1.describe)('undo and redo', function () {
    (0, vitest_1.it)('starts with nothing to undo or redo', function () {
        (0, vitest_1.expect)(widths((0, history_1.historyOf)(scene(1)))).toEqual({ past: [], present: 1, future: [] });
    });
    (0, vitest_1.it)('goes back a change and forward again', function () {
        var changed = (0, history_1.commit)((0, history_1.commit)((0, history_1.historyOf)(scene(1)), scene(2)), scene(3));
        (0, vitest_1.expect)(widths((0, history_1.undo)(changed))).toEqual({ past: [1], present: 2, future: [3] });
        (0, vitest_1.expect)(widths((0, history_1.undo)((0, history_1.undo)(changed)))).toEqual({ past: [], present: 1, future: [2, 3] });
        (0, vitest_1.expect)(widths((0, history_1.redo)((0, history_1.undo)((0, history_1.undo)(changed))))).toEqual({ past: [1], present: 2, future: [3] });
    });
    (0, vitest_1.it)('drops what could be redone once something new is changed', function () {
        var undone = (0, history_1.undo)((0, history_1.commit)((0, history_1.commit)((0, history_1.historyOf)(scene(1)), scene(2)), scene(3)));
        (0, vitest_1.expect)(widths((0, history_1.commit)(undone, scene(9)))).toEqual({ past: [1, 2], present: 9, future: [] });
    });
    (0, vitest_1.it)('leaves the history alone with nothing to undo or redo', function () {
        var start = (0, history_1.historyOf)(scene(1));
        (0, vitest_1.expect)((0, history_1.undo)(start)).toBe(start);
        (0, vitest_1.expect)((0, history_1.redo)(start)).toBe(start);
    });
    (0, vitest_1.it)('counts the same scene again as no change', function () {
        var start = (0, history_1.historyOf)(scene(1));
        (0, vitest_1.expect)((0, history_1.commit)(start, start.present)).toBe(start);
    });
    (0, vitest_1.it)('keeps the last 200 steps, and forgets the oldest', function () {
        var h = (0, history_1.historyOf)(scene(0));
        for (var width = 1; width <= 250; width += 1)
            h = (0, history_1.commit)(h, scene(width));
        (0, vitest_1.expect)(h.past).toHaveLength(200);
        (0, vitest_1.expect)(h.past[0].width).toBe(50);
        for (var i = 0; i < 200; i += 1)
            h = (0, history_1.undo)(h);
        (0, vitest_1.expect)(h.present.width).toBe(50);
        (0, vitest_1.expect)((0, history_1.undo)(h)).toBe(h);
    });
});
