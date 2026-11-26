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
var test_support_1 = require("../../../test_support");
var notes_view_1 = require("./notes_view");
(0, vitest_1.it)('splits folders across bounded pages without losing notes or their full counts', function () {
    var notes = Array.from({ length: 235 }, function (_, i) { return (0, test_support_1.note)({ id: "n-".concat(i), folder: i < 5 ? 'Inbox' : 'Research' }); });
    var groups = (0, notes_view_1.foldersOf)(notes, '', false);
    var pages = [0, 1, 2].map(function (page) { return (0, notes_view_1.folderPageOf)(groups, new Set(), page); });
    (0, vitest_1.expect)(pages.map(function (page) { return page.groups.flatMap(function (group) { return group.visible; }).length; })).toEqual([100, 100, 35]);
    (0, vitest_1.expect)(pages[1].groups[0].notes).toHaveLength(230);
    (0, vitest_1.expect)(pages.flatMap(function (page) { return page.groups.flatMap(function (group) { return group.visible.map(function (n) { return n.id; }); }); })).toEqual(notes.map(function (n) { return n.id; }));
    (0, vitest_1.expect)((0, notes_view_1.folderPageOf)(groups, new Set(), 99).page).toBe(2);
    (0, vitest_1.expect)((0, notes_view_1.folderPageOf)([], new Set(), 9)).toMatchObject({ groups: [], page: 0, pages: 1 });
});
(0, vitest_1.it)('bounds a realm with thousands of folded folders as well as thousands of notes', function () {
    var notes = Array.from({ length: 5000 }, function (_, i) { return (0, test_support_1.note)({ id: "n-".concat(i), folder: "Folder ".concat(i) }); });
    var groups = (0, notes_view_1.foldersOf)(notes, '', false);
    var folded = new Set(groups.map(notes_view_1.folderKeyOf));
    var first = (0, notes_view_1.folderPageOf)(groups, folded, 0);
    (0, vitest_1.expect)(first.groups).toHaveLength(100);
    (0, vitest_1.expect)(first.groups.flatMap(function (group) { return group.visible; })).toHaveLength(0);
    (0, vitest_1.expect)(first.pages).toBe(50);
    (0, vitest_1.expect)((0, notes_view_1.folderPageOf)(groups, folded, 49).groups).toHaveLength(100);
});
(0, vitest_1.it)('searches all words across title, body and tag prefixes and refreshes replaced notes', function () {
    var original = (0, test_support_1.note)({ title: 'Café plan', body: 'Try the NEEDLE experiment', tags: ['Deep-work'] });
    (0, vitest_1.expect)((0, notes_view_1.matches)(original, 'CAFÉ needle #deep')).toBe(true);
    (0, vitest_1.expect)((0, notes_view_1.matches)(original, '#needle')).toBe(false);
    (0, vitest_1.expect)((0, notes_view_1.matches)(original, 'needle missing')).toBe(false);
    var replaced = __assign(__assign({}, original), { title: 'Different', body: 'Revised', tags: ['Research'] });
    (0, vitest_1.expect)((0, notes_view_1.matches)(replaced, 'needle')).toBe(false);
    (0, vitest_1.expect)((0, notes_view_1.matches)(replaced, 'revised #res')).toBe(true);
});
(0, vitest_1.it)('groups and repeatedly searches 5,000 substantial notes within the warm search budget', function () {
    var notes = Array.from({ length: 5000 }, function (_, i) { return (0, test_support_1.note)({ id: "n-".concat(i), title: "Idea ".concat(i), folder: "Folder ".concat(i % 100), isPinned: i % 2 === 0, tags: ['Research'], body: "".concat('Experiment observations. '.repeat(200), " marker-").concat(i) }); });
    // Warm once, as the first typed search does. Every query still searches all
    // 5,000 bodies, including the final note, before the list selects a page.
    (0, notes_view_1.foldersOf)(notes, 'experiment', false);
    var started = performance.now();
    for (var i = 0; i < 5; i += 1) {
        var groups = (0, notes_view_1.foldersOf)(notes, "#res marker-".concat(4995 + i), false);
        (0, vitest_1.expect)(groups.flatMap(function (group) { return group.notes; }).map(function (n) { return n.id; })).toEqual(["n-".concat(4995 + i)]);
    }
    var took = performance.now() - started;
    process.stdout.write("Five warm searches across 5,000 notes: ".concat(Math.round(took), " ms\n"));
    (0, vitest_1.expect)(took).toBeLessThan(500);
});
