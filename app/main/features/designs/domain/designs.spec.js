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
// The shared design rules, tested with the rest of the designs' rules: vitest
// reads no specs under shared/.
var vitest_1 = require("vitest");
var designs_1 = require("../../../../shared/designs");
var frame = function (id, children) {
    if (children === void 0) { children = []; }
    return ({ id: id, type: 'frame', name: id, x: 0, y: 0, width: 10, height: 10, children: children });
};
var text = function (id) { return ({ id: id, type: 'text', name: id, x: 0, y: 0, width: 10, text: id, font: 'Nunito Sans', size: 15, weight: 400, color: '#000000' }); };
var comment = function (over) { return (__assign({ id: 'c1', design: 'welcome', on: null, text: 'Shorter', by: 'Rohan', at: '2026-11-05T10:00:00Z', resolved: null, sentTo: null }, over)); };
(0, vitest_1.describe)("a version's folder", function () {
    vitest_1.it.each([
        ['5.4.3', '5.4.3'],
        ['v5', 'v5'],
        ['Onboarding pass 2', 'onboarding-pass-2'],
        ['First sketch', 'first-sketch'],
        ['  First   sketch!! ', 'first-sketch'],
        ['UPPER', 'upper'],
    ])('is the label %j lower-cased with runs of other characters as one dash: %j', function (label, folder) {
        (0, vitest_1.expect)((0, designs_1.folderOf)(label)).toBe(folder);
    });
    vitest_1.it.each(['../x', '..', 'a/../../b', '.hidden', 'a\\b', '/etc/passwd'])('never climbs out of the designs folder from %j', function (label) {
        var folder = (0, designs_1.folderOf)(label);
        (0, vitest_1.expect)(folder.includes('..')).toBe(false);
        (0, vitest_1.expect)(folder.includes('/')).toBe(false);
        (0, vitest_1.expect)(folder.includes('\\')).toBe(false);
        (0, vitest_1.expect)(folder.startsWith('.')).toBe(false);
    });
    (0, vitest_1.it)('is empty for a label with no letter or number', function () {
        (0, vitest_1.expect)((0, designs_1.folderOf)('...')).toBe('');
        (0, vitest_1.expect)((0, designs_1.folderOf)('!!!')).toBe('');
        (0, vitest_1.expect)((0, designs_1.folderOf)('')).toBe('');
    });
    (0, vitest_1.it)('turns letters outside a to z into dashes, so the folder is still a safe name', function () {
        (0, vitest_1.expect)((0, designs_1.isFolderName)((0, designs_1.folderOf)('Café crème 2'))).toBe(true);
    });
    (0, vitest_1.it)('makes two labels that differ only in case or spacing the same folder', function () {
        (0, vitest_1.expect)((0, designs_1.folderOf)('Onboarding Pass 2')).toBe((0, designs_1.folderOf)('onboarding  pass-2'));
    });
    (0, vitest_1.it)('makes every realistic label a folder name the API accepts', function () {
        for (var _i = 0, _a = ['5.4.3', 'v5', 'Onboarding pass 2', 'First sketch', 'x'.repeat(40), 'Release 2026.11 (final)']; _i < _a.length; _i++) {
            var label = _a[_i];
            (0, vitest_1.expect)((0, designs_1.isFolderName)((0, designs_1.folderOf)(label)), label).toBe(true);
        }
    });
});
(0, vitest_1.describe)('the names the window may send', function () {
    vitest_1.it.each(['5.4.3', 'v5', 'onboarding-pass-2', 'a', '1'])('accepts the folder %j', function (name) {
        (0, vitest_1.expect)((0, designs_1.isFolderName)(name)).toBe(true);
    });
    vitest_1.it.each(['../x', 'a/b', '.hidden', 'UPPER', '', '..', 'a..b', '-a', 'a-', 'a.', 'a b', 'a\\b', 'x'.repeat(61), 5, null, undefined])('refuses the folder %j', function (name) {
        (0, vitest_1.expect)((0, designs_1.isFolderName)(name)).toBe(false);
    });
    vitest_1.it.each(['welcome', 'pair-your-insoles', 'w2'])('accepts the design id %j', function (id) {
        (0, vitest_1.expect)((0, designs_1.isDesignId)(id)).toBe(true);
    });
    vitest_1.it.each(['../x', 'a/b', 'a.b', '.hidden', 'Welcome', '', '-a', 'a-', 'x'.repeat(61), 7, null])('refuses the design id %j', function (id) {
        (0, vitest_1.expect)((0, designs_1.isDesignId)(id)).toBe(false);
    });
    vitest_1.it.each(['#DDF2E8', '#ddf2e8', '#000000'])('accepts the colour %j', function (colour) {
        (0, vitest_1.expect)((0, designs_1.isHex)(colour)).toBe(true);
    });
    vitest_1.it.each(['#DDF2E', 'DDF2E8', '#GGGGGG', '#DDF2E8FF', 'red', '', null])('refuses the colour %j', function (colour) {
        (0, vitest_1.expect)((0, designs_1.isHex)(colour)).toBe(false);
    });
});
(0, vitest_1.describe)('the suggested next label', function () {
    vitest_1.it.each([
        ['5.4.3', '5.4.4'],
        ['v5', 'v6'],
        ['Onboarding pass 2', 'Onboarding pass 3'],
        ['First sketch', 'First sketch 2'],
        ['v9', 'v10'],
        ['5.4.9', '5.4.10'],
        ['Pass 2 final', 'Pass 3 final'],
        ['0', '1'],
    ])('after %j is %j', function (label, next) {
        (0, vitest_1.expect)((0, designs_1.suggestLabel)(label, [])).toBe(next);
    });
    (0, vitest_1.it)('skips a label already taken', function () {
        (0, vitest_1.expect)((0, designs_1.suggestLabel)('5.4.3', ['5.4.3', '5.4.4'])).toBe('5.4.5');
    });
    (0, vitest_1.it)('skips a taken label given by its folder', function () {
        (0, vitest_1.expect)((0, designs_1.suggestLabel)('First sketch', ['first-sketch', 'first-sketch-2'])).toBe('First sketch 3');
        (0, vitest_1.expect)((0, designs_1.suggestLabel)('Onboarding pass 2', ['onboarding-pass-3'])).toBe('Onboarding pass 4');
    });
    (0, vitest_1.it)('skips every taken label in a row', function () {
        (0, vitest_1.expect)((0, designs_1.suggestLabel)('v1', ['v2', 'v3', 'v4'])).toBe('v5');
    });
});
(0, vitest_1.describe)('a free id', function () {
    (0, vitest_1.it)('is the name in folder form', function () {
        (0, vitest_1.expect)((0, designs_1.freeId)('Tip card', new Set())).toBe('tip-card');
    });
    (0, vitest_1.it)('gets the next free number when the name is taken', function () {
        (0, vitest_1.expect)((0, designs_1.freeId)('Tip card', new Set(['tip-card']))).toBe('tip-card-2');
        (0, vitest_1.expect)((0, designs_1.freeId)('Tip card', new Set(['tip-card', 'tip-card-2']))).toBe('tip-card-3');
    });
    (0, vitest_1.it)('is "layer" for a name with no letters', function () {
        (0, vitest_1.expect)((0, designs_1.freeId)('!!', new Set())).toBe('layer');
    });
    (0, vitest_1.it)('is always a design id, even from dots or a long name', function () {
        for (var _i = 0, _a = ['5.4', 'Welcome (yours)', 'x'.repeat(80), "".concat('a'.repeat(54), " b")]; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            (0, vitest_1.expect)((0, designs_1.isDesignId)((0, designs_1.freeId)(name_1, new Set())), name_1).toBe(true);
        }
    });
});
(0, vitest_1.describe)('a comment', function () {
    (0, vitest_1.it)('is open until resolved or sent', function () {
        (0, vitest_1.expect)((0, designs_1.isOpen)(comment({}))).toBe(true);
        (0, vitest_1.expect)((0, designs_1.isOpen)(comment({ resolved: '2026-11-05T11:00:00Z' }))).toBe(false);
        (0, vitest_1.expect)((0, designs_1.isOpen)(comment({ sentTo: '5.4.4' }))).toBe(false);
    });
});
(0, vitest_1.describe)('the layers of a design', function () {
    (0, vitest_1.it)('lists parents before what they hold, in drawing order', function () {
        var nodes = [frame('hero', [frame('sun'), text('sky')]), text('headline'), frame('tip', [text('tip-title')])];
        (0, vitest_1.expect)((0, designs_1.layersOf)(nodes).map(function (l) { return l.id; })).toEqual(['hero', 'sun', 'sky', 'headline', 'tip', 'tip-title']);
    });
    (0, vitest_1.it)('gives children only to a frame', function () {
        (0, vitest_1.expect)((0, designs_1.childrenOf)(__assign(__assign({}, text('t')), { children: [text('inner')] }))).toEqual([]);
        (0, vitest_1.expect)((0, designs_1.childrenOf)(frame('f', [text('inner')])).map(function (l) { return l.id; })).toEqual(['inner']);
        (0, vitest_1.expect)((0, designs_1.childrenOf)(__assign(__assign({}, frame('f')), { children: 'not a list' }))).toEqual([]);
    });
});
