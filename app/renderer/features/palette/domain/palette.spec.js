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
var palette_1 = require("./palette");
var noop = function () { };
var BOARD = (0, test_support_1.projectView)('a-000001', { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'first', title: 'Fix the docs', isStar: true, branch: 'task/fix-docs' }) }, { kind: 'quest', quest: (0, test_support_1.quest)({ id: 'second', title: 'Other quest' }) }], sealed: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'stuck', title: 'Stuck quest', sealedBecause: 'waiting' }) }], canStart: 2 });
var input = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ view: BOARD, notes: { status: 'ready', data: test_support_1.NOTES }, realms: [(0, test_support_1.projectRow)('a-000001', { name: 'here' }), (0, test_support_1.projectRow)('b-000002', { name: 'elsewhere' })], selected: 'a-000001', onStart: noop, onOpenQuest: noop, onFinish: noop, onBack: noop, onOpenClaude: noop, onNewQuest: noop, onNewNote: noop, onOpenNote: noop, onJot: noop, onGo: noop, onPickRealm: noop, onOpenFolder: noop }, over));
};
var labels = function (entries, section) { return entries.filter(function (e) { return e.section === section; }).map(function (e) { return e.label; }); };
(0, vitest_1.describe)('what the palette offers', function () {
    (0, vitest_1.it)('suggests starting the main quest, and a new quest', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), ''), 'suggested')).toEqual(['Start ★ Fix the docs', 'New quest']);
    });
    (0, vitest_1.it)('suggests the active quest\'s actions when there is one', function () {
        var view = __assign(__assign({}, BOARD), { active: (0, test_support_1.activeQuest)() });
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: view })), ''), 'suggested')).toEqual(['Open in Claude Code', 'Finish quest… Active one', 'New quest']);
    });
    (0, vitest_1.it)('with no realm picked, still goes places', function () {
        var entries = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: null, selected: null })), '');
        (0, vitest_1.expect)(labels(entries, 'suggested')).toEqual([]);
        (0, vitest_1.expect)(labels(entries, 'goto')).toContain('Settings');
        (0, vitest_1.expect)(labels(entries, 'realms')).toEqual(['here', 'elsewhere']);
    });
    (0, vitest_1.it)('leaves the quests out until you type', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), ''), 'quests')).toEqual([]);
    });
    (0, vitest_1.it)('lists the other realms and not this one, by name', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), ''), 'realms')).toEqual(['elsewhere']);
    });
    (0, vitest_1.it)('shows the keys', function () {
        var _a, _b;
        var entries = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), '');
        (0, vitest_1.expect)((_a = entries.find(function (e) { return e.label === 'New quest'; })) === null || _a === void 0 ? void 0 : _a.keys).toBe('⌘N');
        (0, vitest_1.expect)((_b = entries.find(function (e) { return e.label === 'Home'; })) === null || _b === void 0 ? void 0 : _b.keys).toBe('⌘1');
    });
    (0, vitest_1.it)('gives the tabs the same keys as the menu, with Designs on ⌘3', function () {
        var goTo = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), '').filter(function (e) { var _a; return e.section === 'goto' && ((_a = e.keys) === null || _a === void 0 ? void 0 : _a.match(/^⌘\d$/)); });
        (0, vitest_1.expect)(goTo.map(function (e) { return [e.label, e.keys]; })).toEqual([
            ['Home', '⌘1'],
            ['Quests', '⌘2'],
            ['Designs', '⌘3'],
            ['Branches', '⌘4'],
            ['Chronicle', '⌘5'],
            ['Mana & time', '⌘6'],
            ['Notes', '⌘7'],
            ['Calendar', '⌘8'],
        ]);
    });
});
(0, vitest_1.describe)('typing in the palette', function () {
    (0, vitest_1.it)('finds a quest by title', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'docs'), 'quests')).toEqual(['Fix the docs']);
    });
    (0, vitest_1.it)('finds a quest by branch', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'task/fix'), 'quests')).toEqual(['Fix the docs']);
    });
    (0, vitest_1.it)('finds a sealed quest as well', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'stuck'), 'quests')).toEqual(['Stuck quest']);
    });
    (0, vitest_1.it)('finds letters in order, not only side by side', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'ftd'), 'quests')).toEqual(['Fix the docs']);
    });
    (0, vitest_1.it)('offers to file what was typed, always', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'zebra'), 'create')).toEqual(['+ New quest "zebra"', '+ Jot "zebra" into Inbox']);
    });
    (0, vitest_1.it)('offers no Create with no realm to file in', function () {
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: null, selected: null })), 'zebra'), 'create')).toEqual([]);
    });
    (0, vitest_1.it)('files the words as they were typed', function () {
        var _a;
        var onNewQuest = vitest_1.vi.fn();
        (_a = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ onNewQuest: onNewQuest })), '  Mend the Gate ').find(function (e) { return e.section === 'create'; })) === null || _a === void 0 ? void 0 : _a.run();
        (0, vitest_1.expect)(onNewQuest).toHaveBeenCalledWith('Mend the Gate');
    });
    (0, vitest_1.it)('puts what starts with the words first', function () {
        var view = __assign(__assign({}, BOARD), { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'a', title: 'Later about fix' }) }, { kind: 'quest', quest: (0, test_support_1.quest)({ id: 'b', title: 'Fix first' }) }] });
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: view })), 'fix'), 'quests')).toEqual(['Fix first', 'Later about fix']);
    });
});
(0, vitest_1.describe)('the order of what\'s found', function () {
    (0, vitest_1.it)('leads with the strongest match, whichever section it is in', function () {
        var first = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'hoard')[0];
        (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.label).toBe('Hoard');
    });
    (0, vitest_1.it)('lets a quest lead when it fits best', function () {
        var first = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'other')[0];
        (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.label).toBe('Other quest');
    });
});
(0, vitest_1.describe)('what can\'t run', function () {
    var held = __assign(__assign({}, BOARD), { active: (0, test_support_1.activeQuest)({ title: 'The active one' }) });
    (0, vitest_1.it)('allows Start while another quest is active', function () {
        var entry = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: held })), 'docs').find(function (e) { return e.section === 'quests'; });
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.reason).toBeNull();
    });
    (0, vitest_1.it)('still opens the quest, since opening isn\'t starting', function () {
        var _a;
        var onOpenQuest = vitest_1.vi.fn();
        (_a = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: held, onOpenQuest: onOpenQuest })), 'docs').find(function (e) { return e.section === 'quests'; })) === null || _a === void 0 ? void 0 : _a.run();
        (0, vitest_1.expect)(onOpenQuest).toHaveBeenCalledWith('first');
    });
    (0, vitest_1.it)('offers Start for another unsealed quest', function () {
        var entry = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: held })), 'docs').find(function (e) { return e.section === 'quests'; });
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.start).toBeTypeOf('function');
    });
    (0, vitest_1.it)('has no start for a sealed quest', function () {
        var entry = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'stuck').find(function (e) { return e.section === 'quests'; });
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.start).toBeNull();
    });
    (0, vitest_1.it)('dims Start ★ with nothing to run, when asked for by name', function () {
        var entry = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ view: held })), 'start').find(function (e) { return e.section === 'actions'; });
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.reason).toBeNull();
    });
    (0, vitest_1.it)('dims Back to the board with no active quest', function () {
        var entry = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input()), 'back').find(function (e) { return e.section === 'actions'; });
        (0, vitest_1.expect)(entry === null || entry === void 0 ? void 0 : entry.reason).toBe('No quest is active.');
    });
});
(0, vitest_1.describe)('matching', function () {
    (0, vitest_1.it)('scores a start above a word above letters in order, and no match at none', function () {
        var start = (0, palette_1.matchScore)('Fix the docs', 'fix');
        var inside = (0, palette_1.matchScore)('The fix', 'fix');
        var scattered = (0, palette_1.matchScore)('Find it x', 'fix');
        (0, vitest_1.expect)(start).toBeGreaterThan(inside);
        (0, vitest_1.expect)(inside).toBeGreaterThan(scattered);
        (0, vitest_1.expect)(scattered).toBeGreaterThan(0);
        (0, vitest_1.expect)((0, palette_1.matchScore)('Other', 'fix')).toBe(0);
    });
});
(0, vitest_1.describe)('notes in the palette', function () {
    var withNotes = function (notes, over) {
        if (over === void 0) { over = {}; }
        return (0, palette_1.paletteEntries)(input(__assign({ notes: { status: 'ready', data: __assign(__assign({}, test_support_1.NOTES), { notes: notes }) } }, over)));
    };
    (0, vitest_1.it)('finds every word across title and text, ignoring case, without fuzzy body matches', function () {
        var entries = withNotes([(0, test_support_1.note)({ title: 'Sensor diary', body: 'Calibrate the pressure gauge.' })]);
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)(entries, 'SENSOR pressure'), 'notes')).toEqual(['Sensor diary']);
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)(entries, 'srdy'), 'notes')).toEqual([]);
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)(entries, 'sensor missing'), 'notes')).toEqual([]);
    });
    (0, vitest_1.it)('matches #words only against tags and leaves archived notes out', function () {
        var entries = withNotes([(0, test_support_1.note)({ id: 'tagged', title: 'Tagged', tags: ['research'] }), (0, test_support_1.note)({ id: 'body', title: 'Body', body: '#research' }), (0, test_support_1.note)({ id: 'old', title: 'Archived', tags: ['research'], isArchived: true })]);
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)(entries, '#res'), 'notes')).toEqual(['Tagged']);
    });
    (0, vitest_1.it)('ranks title matches before text and keeps newest first for equal matches', function () {
        var entries = withNotes([(0, test_support_1.note)({ id: 'text', title: 'Diary', body: 'sensor' }), (0, test_support_1.note)({ id: 'old', title: 'Sensor old', updated: '2026-11-01' }), (0, test_support_1.note)({ id: 'new', title: 'Sensor new', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'inside', title: 'A sensor' })]);
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)(entries, 'sensor'), 'notes')).toEqual(['Sensor new', 'Sensor old', 'A sensor', 'Diary']);
        (0, vitest_1.expect)(labels((0, palette_1.filterPalette)(entries, ''), 'notes')).toEqual([]);
    });
    (0, vitest_1.it)('limits note results to five without hiding other sections', function () {
        var entries = withNotes(Array.from({ length: 8 }, function (_, i) { return (0, test_support_1.note)({ id: "n-".concat(i), title: "Docs ".concat(i) }); }));
        var found = (0, palette_1.filterPalette)(entries, 'docs');
        (0, vitest_1.expect)(labels(found, 'notes')).toHaveLength(5);
        (0, vitest_1.expect)(labels(found, 'quests')).toEqual(['Fix the docs']);
        (0, vitest_1.expect)(labels(found, 'create')).toHaveLength(2);
    });
    (0, vitest_1.it)('opens a note by id with Return or the open shortcut', function () {
        var _a;
        var onOpenNote = vitest_1.vi.fn();
        var found = (0, palette_1.filterPalette)(withNotes([(0, test_support_1.note)({ id: 'sensor', title: 'Sensor' })], { onOpenNote: onOpenNote }), 'sensor').find(function (e) { return e.note !== null; });
        found.run();
        (0, vitest_1.expect)(onOpenNote).toHaveBeenLastCalledWith('sensor');
        (0, vitest_1.expect)(found.start).toBeTypeOf('function');
        (_a = found.start) === null || _a === void 0 ? void 0 : _a.call(found);
        (0, vitest_1.expect)(onOpenNote).toHaveBeenCalledTimes(2);
    });
    (0, vitest_1.it)('offers New note with its key and jots the trimmed words with either open choice', function () {
        var _a;
        var onNewNote = vitest_1.vi.fn();
        var onJot = vitest_1.vi.fn();
        var entries = withNotes([], { onNewNote: onNewNote, onJot: onJot });
        var make = (0, palette_1.filterPalette)(entries, 'new note').find(function (e) { return e.id === 'action:new-note'; });
        (0, vitest_1.expect)(make.keys).toBe('⇧⌘N');
        make.run();
        (0, vitest_1.expect)(onNewNote).toHaveBeenCalledOnce();
        var jot = (0, palette_1.filterPalette)(entries, '  Buy milk  ').find(function (e) { return e.id === 'create:jot'; });
        jot.run();
        (_a = jot.start) === null || _a === void 0 ? void 0 : _a.call(jot);
        (0, vitest_1.expect)(onJot.mock.calls).toEqual([['Buy milk', false], ['Buy milk', true]]);
    });
    (0, vitest_1.it)('keeps navigation and creation working while notes load or fail', function () {
        var onGo = vitest_1.vi.fn();
        var loading = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ notes: { status: 'loading' } })), 'sensor');
        (0, vitest_1.expect)((0, palette_1.canRun)(loading.find(function (e) { return e.id === 'notes:reading'; }))).toBe(false);
        (0, vitest_1.expect)(labels(loading, 'create')).toHaveLength(2);
        var failed = (0, palette_1.filterPalette)((0, palette_1.paletteEntries)(input({ notes: { status: 'failed', message: 'private failure' }, onGo: onGo })), 'sensor');
        var retry = failed.find(function (e) { return e.id === 'notes:failed'; });
        (0, vitest_1.expect)(retry.label).not.toContain('private failure');
        retry.run();
        (0, vitest_1.expect)(onGo).toHaveBeenCalledWith('/notes');
    });
    (0, vitest_1.it)('shows the matching line around a body word, and no snippet for title-only matches', function () {
        var one = (0, test_support_1.note)({ title: 'Sensor', body: "Unrelated line\n".concat('a'.repeat(90), " pressure ").concat('z'.repeat(90)) });
        var snippet = (0, palette_1.snippetOf)(one, 'sensor pressure');
        (0, vitest_1.expect)(snippet).toContain('pressure');
        (0, vitest_1.expect)(snippet.startsWith('…')).toBe(true);
        (0, vitest_1.expect)(snippet.endsWith('…')).toBe(true);
        (0, vitest_1.expect)(snippet.length).toBeLessThanOrEqual(62);
        (0, vitest_1.expect)((0, palette_1.snippetOf)(one, 'sensor')).toBeNull();
    });
});
