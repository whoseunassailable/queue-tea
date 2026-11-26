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
var design_files_1 = require("./design_files");
var text = function (id, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: id, type: 'text', name: id, x: 24, y: 40, width: 342, text: 'Walk better', font: 'Nunito Sans', size: 15, weight: 400, color: '#2A2218' }, over));
};
var frame = function (id, children, over) {
    if (children === void 0) { children = []; }
    if (over === void 0) { over = {}; }
    return (__assign({ id: id, type: 'frame', name: id, x: 0, y: 0, width: 390, height: 420, fill: '#BFE3D5', radius: 12, children: children }, over));
};
var scene = function (nodes, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ format: 1, name: 'Welcome', width: 390, height: 844, fill: '#F6F1E7', nodes: nodes }, over));
};
var detail = function (parsed) {
    if (parsed.ok)
        throw new Error('should not read');
    return parsed.detail;
};
var value = function (parsed) {
    if (!parsed.ok)
        throw new Error("should read: ".concat(parsed.detail));
    return parsed.value;
};
// A comma missing after "width": 390, so the parser stops on line 5.
var LIVE_WALK = '{\n  "format": 1,\n  "name": "Live walk",\n  "width": 390\n  "height": 844\n}\n';
(0, vitest_1.describe)('where a JSON mistake is', function () {
    (0, vitest_1.it)('takes the line the parser names', function () {
        (0, vitest_1.expect)((0, design_files_1.lineOf)('', "Expected ',' after property value in JSON at position 52 (line 4 column 3)")).toBe(4);
    });
    (0, vitest_1.it)('counts the lines up to a position when that is all it gives', function () {
        (0, vitest_1.expect)((0, design_files_1.lineOf)('a\nb\nc', 'Unexpected token in JSON at position 4')).toBe(3);
    });
    (0, vitest_1.it)('has no line when the parser gives neither', function () {
        (0, vitest_1.expect)((0, design_files_1.lineOf)('{', 'Unexpected end of JSON input')).toBeNull();
    });
    (0, vitest_1.it)('says the line, in plain words, never the parser\'s', function () {
        var said = detail((0, design_files_1.parseJson)(LIVE_WALK));
        (0, vitest_1.expect)(said).toBe('It has a mistake near line 5.');
        (0, vitest_1.expect)(said).not.toMatch(/Expected|position|JSON|token/);
    });
    // V8 gives no position for an unexpected token, only the text round it.
    (0, vitest_1.it)('finds the line of a word that is not JSON, mid-file', function () {
        (0, vitest_1.expect)(detail((0, design_files_1.parseJson)('{\n  "format": 1,\n  "name": "Welcome",\n  "width": 390,\n  "height": 844,\n  "fill": nope,\n  "nodes": []\n}\n'))).toBe('It has a mistake near line 6.');
    });
    (0, vitest_1.it)('finds the line of a stray bracket at the end of the file', function () {
        (0, vitest_1.expect)(detail((0, design_files_1.parseJson)('{ "format": 1,\n "comments": [\n }'))).toBe('It has a mistake near line 3.');
    });
    (0, vitest_1.it)('finds the line of a mistake in the first few characters', function () {
        (0, vitest_1.expect)(detail((0, design_files_1.parseJson)('[\nnope, 1, 2, 3, 4, 5, 6, 7, 8]'))).toBe('It has a mistake near line 2.');
    });
    (0, vitest_1.it)('trusts the place over words in the quoted text that look like a line', function () {
        // V8 quotes ',\n  "c": no line 1\n}' round the bad o, and the mistake is on line 4.
        var file = '{\n  "a": 1,\n  "b": 2,\n  "c": no line 1\n}\n';
        (0, vitest_1.expect)(detail((0, design_files_1.parseJson)(file))).toBe('It has a mistake near line 4.');
    });
    (0, vitest_1.it)('says it cannot place a mistake in a file so short V8 quotes all of it', function () {
        (0, vitest_1.expect)(detail((0, design_files_1.parseJson)('{"a": nope}'))).toBe('It has a mistake Queue-tea can’t place.');
    });
    (0, vitest_1.it)('reads good JSON as it is', function () {
        (0, vitest_1.expect)(value((0, design_files_1.parseJson)('{"a": [1, 2]}'))).toEqual({ a: [1, 2] });
    });
});
(0, vitest_1.describe)('a design file', function () {
    (0, vitest_1.it)('reads a good one', function () {
        (0, vitest_1.expect)(value((0, design_files_1.parseScene)(JSON.stringify(scene([frame('hero', [frame('sun')]), text('headline')])))).name).toBe('Welcome');
    });
    (0, vitest_1.it)('gives the line of a JSON mistake', function () {
        (0, vitest_1.expect)(detail((0, design_files_1.parseScene)(LIVE_WALK))).toBe('It has a mistake near line 5.');
    });
    (0, vitest_1.it)('keeps fields and layers it does not know, just as they were', function () {
        var read = value((0, design_files_1.checkScene)(scene([text('headline', { locked: true }), { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] }], { grid: { size: 8 } })));
        (0, vitest_1.expect)(read.grid).toEqual({ size: 8 });
        (0, vitest_1.expect)(read.nodes[0].locked).toBe(true);
        (0, vitest_1.expect)(read.nodes[1]).toMatchObject({ type: 'chart', series: [1, 2, 3] });
    });
    (0, vitest_1.it)('accepts an unknown layer type without a height', function () {
        (0, vitest_1.expect)((0, design_files_1.checkScene)(scene([{ id: 'odd', type: 'sparkle', name: 'Odd', x: 0, y: 0, width: 10 }])).ok).toBe(true);
    });
    vitest_1.it.each([
        ['nothing', null, 'It isn’t a design.'],
        ['a list', [], 'It isn’t a design.'],
        ['format 2', scene([], { format: 2 }), 'It isn’t in a design format this app knows.'],
        ['no name', scene([], { name: '  ' }), 'The design has no usable name.'],
        ['a width of 0', scene([], { width: 0 }), 'The design has no usable width.'],
        ['a width over 10,000', scene([], { width: 10001 }), 'The design has no usable width.'],
        ['a fill that is not #RRGGBB', scene([], { fill: 'red' }), 'The design has no usable fill.'],
        ['no layers', scene(undefined), 'The design has no usable layers.'],
    ])('refuses %s', function (_, file, said) {
        (0, vitest_1.expect)(detail((0, design_files_1.checkScene)(file))).toBe(said);
    });
    vitest_1.it.each([
        ['a layer that is not an object', [5], 'One of its layers isn’t a layer.'],
        ['a layer with no id', [text('')], 'One of its layers has no id.'],
        ['two layers with one id', [text('a'), frame('f', [text('a', { name: 'Again' })])], 'The layer “Again” shares its id with another layer.'],
        ['a layer with no type', [text('a', { type: 3 })], 'The layer “a” has no usable type.'],
        ['an x past 10,000', [text('a', { x: 10001 })], 'The layer “a” has no usable x.'],
        ['a y below -10,000', [text('a', { y: -10001 })], 'The layer “a” has no usable y.'],
        ['a negative width', [text('a', { width: -1 })], 'The layer “a” has no usable width.'],
        ['a text with no colour', [text('a', { color: 'blue' })], 'The layer “a” has no usable color.'],
        ['a text size of 0', [text('a', { size: 0 })], 'The layer “a” has no usable size.'],
        ['a text weight of 950', [text('a', { weight: 950 })], 'The layer “a” has no usable weight.'],
        ['a text aligned to justify', [text('a', { align: 'justify' })], 'The layer “a” has no usable align.'],
        ['a frame with no height', [frame('f', [], { height: undefined })], 'The layer “f” has no usable height.'],
        ['a frame radius over 1,000', [frame('f', [], { radius: 1001 })], 'The layer “f” has no usable radius.'],
        ['a frame stroke with no colour', [frame('f', [], { stroke: { width: 1 } })], 'The layer “f” has no usable stroke.'],
        ['a frame whose children are not a list', [frame('f', [], { children: {} })], 'The layer “f” has no usable children.'],
        ['a bad layer deep inside', [frame('f', [frame('g', [text('t', { size: 'big' })])])], 'The layer “t” has no usable size.'],
    ])('refuses %s', function (_, nodes, said) {
        (0, vitest_1.expect)(detail((0, design_files_1.checkScene)(scene(nodes)))).toBe(said);
    });
    (0, vitest_1.it)('takes 2,000 layers and refuses the 2,001st', function () {
        var many = function (n) { return Array.from({ length: n }, function (_, i) { return text("t".concat(i)); }); };
        (0, vitest_1.expect)((0, design_files_1.checkScene)(scene(many(2000))).ok).toBe(true);
        (0, vitest_1.expect)(detail((0, design_files_1.checkScene)(scene(many(2001))))).toBe('It has more than 2000 layers.');
    });
    (0, vitest_1.it)('takes layers nested 20 deep and refuses 21', function () {
        var nest = function (depth) { return (depth === 1 ? frame('f1') : frame("f".concat(depth), [nest(depth - 1)])); };
        (0, vitest_1.expect)((0, design_files_1.checkScene)(scene([nest(20)])).ok).toBe(true);
        (0, vitest_1.expect)(detail((0, design_files_1.checkScene)(scene([nest(21)])))).toBe('Its layers nest more than 20 deep.');
    });
});
(0, vitest_1.describe)('a version file', function () {
    (0, vitest_1.it)('reads a good one, and keeps fields it does not know', function () {
        var read = value((0, design_files_1.parseVersion)(JSON.stringify({ format: 1, label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles'], theme: 'night' })));
        (0, vitest_1.expect)(read).toMatchObject({ label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles'], next: null, theme: 'night' });
    });
    (0, vitest_1.it)('fills in what it can do without', function () {
        (0, vitest_1.expect)(value((0, design_files_1.parseVersion)('{"format": 1, "label": "First sketch"}'))).toMatchObject({ made: null, by: null, from: null, designs: [], next: null });
    });
    (0, vitest_1.it)('takes a label of 40 characters and refuses 41, like the form', function () {
        (0, vitest_1.expect)((0, design_files_1.parseVersion)(JSON.stringify({ format: 1, label: 'x'.repeat(40) })).ok).toBe(true);
        (0, vitest_1.expect)(detail((0, design_files_1.parseVersion)(JSON.stringify({ format: 1, label: 'x'.repeat(41) })))).toBe('The version has no usable label.');
    });
    (0, vitest_1.it)('takes an author it does not know as none', function () {
        (0, vitest_1.expect)(value((0, design_files_1.parseVersion)('{"format": 1, "label": "v5", "by": "robot"}')).by).toBeNull();
    });
    (0, vitest_1.it)('reads the next version a quest was filed for', function () {
        (0, vitest_1.expect)(value((0, design_files_1.parseVersion)('{"format": 1, "label": "5.4.3", "next": {"label": "5.4.4", "quest": "Designs 5.4.4"}}')).next).toEqual({ label: '5.4.4', quest: 'Designs 5.4.4' });
    });
    vitest_1.it.each([
        ['missing', '{"format": 1, "label": "5.4.3"}'],
        ['null', '{"format": 1, "label": "5.4.3", "approved": null}'],
    ])('reads an approval that is %s as not approved', function (_, file) {
        (0, vitest_1.expect)(value((0, design_files_1.parseVersion)(file)).approved).toBeNull();
    });
    (0, vitest_1.it)('reads who approved the version and when', function () {
        (0, vitest_1.expect)(value((0, design_files_1.parseVersion)('{"format": 1, "label": "5.4.3", "approved": {"by": "Zoë", "at": "2026-11-05T12:00:00.000Z"}}')).approved).toEqual({ by: 'Zoë', at: '2026-11-05T12:00:00.000Z' });
    });
    (0, vitest_1.it)('takes an approver of 100 characters and refuses 101', function () {
        var _a;
        var approvedBy = function (by) { return (0, design_files_1.parseVersion)(JSON.stringify({ format: 1, label: '5.4.3', approved: { by: by, at: '2026-11-05T12:00:00.000Z' } })); };
        (0, vitest_1.expect)((_a = value(approvedBy('x'.repeat(100))).approved) === null || _a === void 0 ? void 0 : _a.by).toBe('x'.repeat(100));
        (0, vitest_1.expect)(detail(approvedBy('x'.repeat(101)))).toBe('The version has no usable approval.');
    });
    vitest_1.it.each([
        ['a JSON mistake', '{ "format": 1, "label": "5.4.2",\n  "made": "2026-10-28T16:02:00-06:00"\n  "designs": [] }\n', 'It has a mistake near line 3.'],
        ['something that is not an object', '[1]', 'It isn’t a version file.'],
        ['an unknown format', '{"format": 2, "label": "v5"}', 'It isn’t in a design format this app knows.'],
        ['no label', '{"format": 1}', 'The version has no usable label.'],
        ['a design id that climbs out', '{"format": 1, "label": "v5", "designs": ["../x"]}', 'The version has no usable list of designs.'],
        ['a next version with no label', '{"format": 1, "label": "v5", "next": {"label": "", "quest": "Q"}}', 'The version has no usable next version.'],
        ['an approval that is not an object', '{"format": 1, "label": "v5", "approved": true}', 'The version has no usable approval.'],
        ['an approval that is a list', '{"format": 1, "label": "v5", "approved": [{"by": "Rohan", "at": "2026-11-05T12:00:00Z"}]}', 'The version has no usable approval.'],
        ['an approval by no one', '{"format": 1, "label": "v5", "approved": {"by": "  ", "at": "2026-11-05T12:00:00Z"}}', 'The version has no usable approval.'],
        ['an approval with no approver', '{"format": 1, "label": "v5", "approved": {"at": "2026-11-05T12:00:00Z"}}', 'The version has no usable approval.'],
        ['an approval at a time that is not a date', '{"format": 1, "label": "v5", "approved": {"by": "Rohan", "at": "last Tuesday-ish"}}', 'The version has no usable approval.'],
        ['an approval at a number', '{"format": 1, "label": "v5", "approved": {"by": "Rohan", "at": 1762344000000}}', 'The version has no usable approval.'],
        ['an approval with no time', '{"format": 1, "label": "v5", "approved": {"by": "Rohan"}}', 'The version has no usable approval.'],
    ])('refuses %s', function (_, file, said) {
        (0, vitest_1.expect)(detail((0, design_files_1.parseVersion)(file))).toBe(said);
    });
});
(0, vitest_1.describe)('a comments file', function () {
    var COMMENT = { id: 'c1', design: 'welcome', on: 'headline', text: 'Shorter', by: 'Rohan', at: '2026-11-05T14:02:00-06:00', resolved: null, sentTo: null };
    (0, vitest_1.it)('reads a good one, and keeps fields it does not know', function () {
        var read = value((0, design_files_1.parseComments)(JSON.stringify({ format: 1, comments: [COMMENT], pinned: ['c1'] })));
        (0, vitest_1.expect)(read.comments).toEqual([COMMENT]);
        (0, vitest_1.expect)(read.pinned).toEqual(['c1']);
    });
    (0, vitest_1.it)('takes a missing format as 1', function () {
        (0, vitest_1.expect)(value((0, design_files_1.parseComments)(JSON.stringify({ comments: [] }))).format).toBe(1);
    });
    vitest_1.it.each([
        ['no list of comments', { format: 1 }, 'It isn’t a comments file.'],
        ['a comment with no text', { format: 1, comments: [__assign(__assign({}, COMMENT), { text: undefined })] }, 'One of its comments is missing a field.'],
        ['a comment on a design id that climbs out', { format: 1, comments: [__assign(__assign({}, COMMENT), { design: '../x' })] }, 'One of its comments is missing a field.'],
    ])('refuses %s', function (_, file, said) {
        (0, vitest_1.expect)(detail((0, design_files_1.parseComments)(JSON.stringify(file)))).toBe(said);
    });
});
