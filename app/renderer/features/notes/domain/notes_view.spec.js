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
var marked_1 = require("marked");
var vitest_1 = require("vitest");
var notes_1 = require("../../../../shared/notes");
var en_1 = require("../../../l10n/en");
var test_support_1 = require("../../../test_support");
var notes_view_1 = require("./notes_view");
(0, vitest_1.describe)('days', function () {
    vitest_1.it.each(['2026-11-17', '2024-02-29', '2026-12-31', '2027-01-01'])('%s is a day', function (title) {
        (0, vitest_1.expect)((0, notes_view_1.isDay)(title)).toBe(true);
    });
    vitest_1.it.each(['2026-02-30', '2026-02-29', '2026-13-01', '2026-00-10', '2026-11-00', '2026-11-32', '2026-11-7', ' 2026-11-17', '2026-11-17 2', '2026/11/17', 'Plan', ''])('%j is not a day', function (title) {
        (0, vitest_1.expect)((0, notes_view_1.isDay)(title)).toBe(false);
    });
    (0, vitest_1.it)('a blank day is required, a day that is not a date says how to write one, and a real day passes', function () {
        (0, vitest_1.expect)((0, notes_view_1.dayError)('')).toBe('Day is required.');
        (0, vitest_1.expect)((0, notes_view_1.dayError)('   ')).toBe('Day is required.');
        (0, vitest_1.expect)((0, notes_view_1.dayError)('2026-02-30')).toBe('Enter a day as a date, like 2026-11-17.');
        (0, vitest_1.expect)((0, notes_view_1.dayError)('tomorrow')).toBe('Enter a day as a date, like 2026-11-17.');
        (0, vitest_1.expect)((0, notes_view_1.dayError)(' 2026-11-17 ')).toBeUndefined();
    });
});
(0, vitest_1.describe)('the daily template', function () {
    (0, vitest_1.it)('a new day starts from the built-in text when the realm has no Daily template note', function () {
        (0, vitest_1.expect)((0, notes_view_1.dailyBodyOf)([(0, test_support_1.note)({ title: 'Plan', body: '# {{date}}' })], '2026-11-17')).toBe(en_1.t.notebook.templates.daily);
    });
    (0, vitest_1.it)('a Daily template note in any case gives its text, with the day and title put in for every placeholder', function () {
        var notes = [(0, test_support_1.note)({ id: 'tpl', title: 'daily TEMPLATE', body: '# {{date}}\n\n{{ title }} · {{  date }} · {{title}}' })];
        (0, vitest_1.expect)((0, notes_view_1.dailyBodyOf)(notes, '2026-11-17', 'Standup')).toBe('# 2026-11-17\n\nStandup · 2026-11-17 · Standup');
        (0, vitest_1.expect)((0, notes_view_1.dailyBodyOf)(notes, '2026-11-17')).toBe('# 2026-11-17\n\n2026-11-17 · 2026-11-17 · 2026-11-17');
    });
    (0, vitest_1.it)('a blank Daily template note falls back to the built-in text', function () {
        (0, vitest_1.expect)((0, notes_view_1.dailyBodyOf)([(0, test_support_1.note)({ title: 'Daily template', body: '  \n\t\n' })], '2026-11-17')).toBe(en_1.t.notebook.templates.daily);
    });
    (0, vitest_1.it)('an archived Daily template note is ignored', function () {
        (0, vitest_1.expect)((0, notes_view_1.dailyBodyOf)([(0, test_support_1.note)({ title: 'Daily template', body: 'Old {{date}}', isArchived: true })], '2026-11-17')).toBe(en_1.t.notebook.templates.daily);
    });
    (0, vitest_1.it)('a title holding $& or $1 goes in as it is written', function () {
        var notes = [(0, test_support_1.note)({ title: 'Daily template', body: '{{title}} on {{date}}' })];
        (0, vitest_1.expect)((0, notes_view_1.dailyBodyOf)(notes, '2026-11-17', 'Costs $& and $1 and $$')).toBe('Costs $& and $1 and $$ on 2026-11-17');
    });
});
(0, vitest_1.describe)('the journal', function () {
    var rows = function (notes, query) { return (0, notes_view_1.journalOf)(notes, query).map(function (group) { return [group.folder, group.notes.map(function (n) { return n.title; })]; }); };
    (0, vitest_1.it)('lists only live notes titled with a real day, newest first, one group per month', function () {
        var notes = [
            (0, test_support_1.note)({ id: 'a', title: '2026-10-31' }),
            (0, test_support_1.note)({ id: 'b', title: '2026-11-03', folder: 'Ideas' }),
            (0, test_support_1.note)({ id: 'c', title: '2025-12-24' }),
            (0, test_support_1.note)({ id: 'd', title: '2026-11-17' }),
            (0, test_support_1.note)({ id: 'e', title: '2026-11-10', isArchived: true }),
            (0, test_support_1.note)({ id: 'f', title: '2026-11-17 2' }),
            (0, test_support_1.note)({ id: 'g', title: '2026-02-30' }),
            (0, test_support_1.note)({ id: 'h', title: 'Daily template' }),
        ];
        (0, vitest_1.expect)(rows(notes, '')).toEqual([
            ['Nov 2026', ['2026-11-17', '2026-11-03']],
            ['Oct 2026', ['2026-10-31']],
            ['Dec 2025', ['2025-12-24']],
        ]);
    });
    (0, vitest_1.it)('search keeps the days whose title, text or tags match', function () {
        var notes = [(0, test_support_1.note)({ id: 'a', title: '2026-11-17', body: 'Standup went well' }), (0, test_support_1.note)({ id: 'b', title: '2026-11-16', tags: ['standup'] }), (0, test_support_1.note)({ id: 'c', title: '2026-10-02' })];
        (0, vitest_1.expect)(rows(notes, 'standup')).toEqual([['Nov 2026', ['2026-11-17', '2026-11-16']]]);
        (0, vitest_1.expect)(rows(notes, '2026-10')).toEqual([['Oct 2026', ['2026-10-02']]]);
        (0, vitest_1.expect)(rows(notes, 'missing')).toEqual([]);
    });
    (0, vitest_1.it)('is empty with no days', function () {
        (0, vitest_1.expect)((0, notes_view_1.journalOf)([(0, test_support_1.note)()], '')).toEqual([]);
    });
});
(0, vitest_1.describe)('note templates', function () {
    vitest_1.it.each(notes_1.NOTE_TYPES)('starts a %s note with its own text and leaves the folder alone', function (type) {
        var patch = (0, notes_view_1.templateChange)(type, 'My note', [], 'me', '2026-11-07');
        (0, vitest_1.expect)(patch).toEqual({ type: type, body: en_1.t.notebook.templates[type] });
        (0, vitest_1.expect)(patch.body.length).toBeGreaterThan(20);
    });
    (0, vitest_1.it)('gives an untitled daily note today’s next free title, leaving a chosen title alone', function () {
        var notes = [(0, test_support_1.note)({ title: '2026-11-07' }), (0, test_support_1.note)({ id: 'next', title: '2026-11-07 2' })];
        (0, vitest_1.expect)((0, notes_view_1.templateChange)('daily', 'Untitled 2', notes, 'me', '2026-11-07').title).toBe('2026-11-07 3');
        (0, vitest_1.expect)((0, notes_view_1.templateChange)('daily', 'My journal', notes, 'me', '2026-11-07').title).toBeUndefined();
        (0, vitest_1.expect)((0, notes_view_1.templateChange)('idea', 'Untitled', notes, 'me', '2026-11-07').title).toBeUndefined();
    });
    (0, vitest_1.it)('a Daily note starts from the realm’s Daily template, with today and its title put in', function () {
        var notes = [(0, test_support_1.note)({ id: 'tpl', title: 'Daily template', body: '# {{date}} · {{title}}' }), (0, test_support_1.note)({ id: 'taken', title: '2026-11-07' })];
        (0, vitest_1.expect)((0, notes_view_1.templateChange)('daily', 'Untitled', notes, 'me', '2026-11-07')).toEqual({ type: 'daily', title: '2026-11-07 2', body: '# 2026-11-07 · 2026-11-07 2' });
        (0, vitest_1.expect)((0, notes_view_1.templateChange)('daily', 'My journal', notes, 'me', '2026-11-07')).toEqual({ type: 'daily', body: '# 2026-11-07 · My journal' });
        (0, vitest_1.expect)((0, notes_view_1.templateChange)('idea', 'Untitled', notes, 'me', '2026-11-07').body).toBe(en_1.t.notebook.templates.idea);
    });
});
(0, vitest_1.describe)('quick capture', function () {
    (0, vitest_1.it)('makes the line the title when it fits, with no body', function () {
        (0, vitest_1.expect)((0, notes_view_1.captureOf)('  Try a graph view  ')).toEqual({ title: 'Try a graph view', folder: 'Inbox', body: '' });
        (0, vitest_1.expect)((0, notes_view_1.captureOf)('   ')).toBeNull();
    });
    (0, vitest_1.it)('cleans what a title cannot hold, and keeps the whole text as the body', function () {
        (0, vitest_1.expect)((0, notes_view_1.captureOf)('Link [[Plan]] #idea\nmore')).toEqual({ title: 'Link Plan idea', folder: 'Inbox', body: 'Link [[Plan]] #idea\nmore' });
        var long = (0, notes_view_1.captureOf)("".concat('word '.repeat(30), "end"));
        (0, vitest_1.expect)(long.title.length).toBeLessThanOrEqual(81);
        (0, vitest_1.expect)(long.title.endsWith('…')).toBe(true);
    });
});
(0, vitest_1.describe)('checks', function () {
    (0, vitest_1.it)('a title is required, short enough, and free of link marks', function () {
        (0, vitest_1.expect)((0, notes_view_1.titleError)(' ')).toBe('Title is required.');
        (0, vitest_1.expect)((0, notes_view_1.titleError)('a|b')).toMatch(/can't have/);
        (0, vitest_1.expect)((0, notes_view_1.titleError)('x'.repeat(201))).toMatch(/200/);
        (0, vitest_1.expect)((0, notes_view_1.titleError)('Fine')).toBeUndefined();
    });
    (0, vitest_1.it)('a folder is one level', function () {
        (0, vitest_1.expect)((0, notes_view_1.folderError)('a/b')).toBe('A folder is one level, so leave out /.');
        (0, vitest_1.expect)((0, notes_view_1.folderError)('Research')).toBeUndefined();
    });
    (0, vitest_1.it)('a renamed folder must have a name within the folder limits', function () {
        (0, vitest_1.expect)((0, notes_view_1.folderNameError)('  ')).toBe(en_1.t.notebook.folderRequired);
        (0, vitest_1.expect)((0, notes_view_1.folderNameError)('a/b')).toBe(en_1.t.notebook.folderSlash);
        (0, vitest_1.expect)((0, notes_view_1.folderNameError)('x'.repeat(61))).toBe(en_1.t.notebook.folderLong);
        (0, vitest_1.expect)((0, notes_view_1.folderNameError)('Plans')).toBeUndefined();
    });
    (0, vitest_1.it)('tags come from commas, without # or repeats, with spaces as -', function () {
        (0, vitest_1.expect)((0, notes_view_1.tagsOf)('#a, b, a, ,, deep work')).toEqual(['a', 'b', 'deep-work']);
        (0, vitest_1.expect)((0, notes_view_1.tagsError)(Array.from({ length: 21 }, function (_, i) { return "t".concat(i); }).join(','))).toMatch(/20/);
    });
});
(0, vitest_1.describe)('the link picker', function () {
    (0, vitest_1.it)('opens on [[ before the caret, on the same line, until it is closed', function () {
        (0, vitest_1.expect)((0, notes_view_1.linkQueryAt)('See [[Pl', 8)).toEqual({ start: 6, query: 'Pl' });
        (0, vitest_1.expect)((0, notes_view_1.linkQueryAt)('See [[', 6)).toEqual({ start: 6, query: '' });
        (0, vitest_1.expect)((0, notes_view_1.linkQueryAt)('See [[Plan]] ', 13)).toBeNull();
        (0, vitest_1.expect)((0, notes_view_1.linkQueryAt)('[[a\nb', 5)).toBeNull();
    });
    (0, vitest_1.it)('puts the title in and closes the link, over a ]] already there', function () {
        (0, vitest_1.expect)((0, notes_view_1.withLink)('See [[Pl and', 6, 8, 'Plan')).toEqual({ body: 'See [[Plan]] and', caret: 12 });
        (0, vitest_1.expect)((0, notes_view_1.withLink)('See [[]]', 6, 6, 'Plan')).toEqual({ body: 'See [[Plan]]', caret: 12 });
    });
});
(0, vitest_1.describe)('ticking a box in the Read view', function () {
    var body = ['- [ ] one', '- [x] two', '  - [ ] nested', '', '1. [ ] ordered', '', '> [!warning] Careful', '> - [ ] quoted', '', '```', '- [ ] not a task, in code', '```', '- [ ]', '* [ ] star'].join('\n');
    // The boxes marked draws, in the order it draws them.
    var boxes = function (tokens) {
        return tokens.flatMap(function (token) { var _a; return __spreadArray(__spreadArray([], (token.type === 'list_item' && token.task ? [token] : []), true), boxes(__spreadArray(__spreadArray(__spreadArray([], ('items' in token ? token.items : []), true), ('tokens' in token && token.type !== 'list_item' ? token.tokens : []), true), (token.type === 'list_item' ? ((_a = token.tokens) !== null && _a !== void 0 ? _a : []) : []), true)), true); });
    };
    (0, vitest_1.it)('counts the lines in the order marked draws the boxes, leaving out code and empty boxes', function () {
        var drawn = boxes((0, marked_1.lexer)(body)).map(function (item) { return item.text.split('\n')[0]; });
        (0, vitest_1.expect)(drawn).toEqual(['one', 'two', 'nested', 'ordered', 'quoted', 'star']);
        drawn.forEach(function (text, i) {
            var changed = (0, notes_view_1.toggleTaskAt)(body, i).split('\n').filter(function (line, n) { return line !== body.split('\n')[n]; });
            (0, vitest_1.expect)(changed).toHaveLength(1);
            (0, vitest_1.expect)(changed[0]).toContain(text);
        });
    });
    (0, vitest_1.it)('ticks an open box and opens a ticked one, keeping the rest of the line', function () {
        (0, vitest_1.expect)((0, notes_view_1.toggleTaskAt)('- [ ] one', 0)).toBe('- [x] one');
        (0, vitest_1.expect)((0, notes_view_1.toggleTaskAt)('  - [X] two', 0)).toBe('  - [ ] two');
        (0, vitest_1.expect)((0, notes_view_1.toggleTaskAt)('- [ ] one', 3)).toBe('- [ ] one');
    });
});
(0, vitest_1.describe)('the picker’s order', function () {
    (0, vitest_1.it)('puts titles starting with the text first, then a word starting with it, then anywhere', function () {
        var notes = [(0, test_support_1.note)({ id: '1', title: 'Misplan' }), (0, test_support_1.note)({ id: '2', title: 'The plan' }), (0, test_support_1.note)({ id: '3', title: 'Plan B' }), (0, test_support_1.note)({ id: '4', title: 'Planet', isArchived: true }), (0, test_support_1.note)({ id: 'me', title: 'Plan me' })];
        (0, vitest_1.expect)((0, notes_view_1.linkOptionsOf)(notes, 'pla', 'me', 8).map(function (n) { return n.title; })).toEqual(['Plan B', 'The plan', 'Misplan']);
    });
});
(0, vitest_1.describe)('quests in the link picker', function () {
    var line = function (title, state) { return ({ title: title, state: state, priority: 'mid', difficulty: 'medium' }); };
    (0, vitest_1.it)('keeps three of eight rows for quests, then fills unused space from either side', function () {
        var notes = Array.from({ length: 10 }, function (_, i) { return (0, test_support_1.note)({ id: "n-".concat(i), title: "Plan ".concat(i) }); });
        var quests = new Map(Array.from({ length: 10 }, function (_, i) { return ["t-".concat(i), line("Plan quest ".concat(i), 'waiting')]; }));
        var picks = (0, notes_view_1.linkPicksOf)(notes, quests, '', 'here', 8, 3);
        (0, vitest_1.expect)([picks.notes.length, picks.quests.length]).toEqual([5, 3]);
        var fewNotes = (0, notes_view_1.linkPicksOf)(notes.slice(0, 1), quests, '', 'here', 8, 3);
        (0, vitest_1.expect)([fewNotes.notes.length, fewNotes.quests.length]).toEqual([1, 7]);
        var fewQuests = (0, notes_view_1.linkPicksOf)(notes, new Map(__spreadArray([], quests, true).slice(0, 1)), '', 'here', 8, 3);
        (0, vitest_1.expect)([fewQuests.notes.length, fewQuests.quests.length]).toEqual([7, 1]);
        (0, vitest_1.expect)((0, notes_view_1.linkPicksOf)([], quests, '', 'here', 8, 3).quests).toHaveLength(8);
        (0, vitest_1.expect)((0, notes_view_1.linkPicksOf)(notes, new Map(), '', 'here', 8, 3).notes).toHaveLength(8);
    });
    (0, vitest_1.it)('ranks matching titles before state, then active, waiting and sealed, excluding done and gone', function () {
        var quests = new Map([
            ['t-1', line('Misplan', 'active')], ['t-2', line('The plan', 'active')],
            ['t-3', line('Plan sealed', 'sealed')], ['t-4', line('Plan waiting', 'waiting')],
            ['t-5', line('Plan active', 'active')], ['t-6', line('Plan done', 'done')],
            ['t-7', line(null, 'gone')], ['t-8', line('Other', 'waiting')],
        ]);
        (0, vitest_1.expect)((0, notes_view_1.linkPicksOf)([], quests, ' PLA ', 'here', 8, 3).quests.map(function (q) { return q.id; })).toEqual(['t-5', 't-4', 't-3', 't-2', 't-1']);
        (0, vitest_1.expect)((0, notes_view_1.linkPicksOf)([], quests, 'no match', 'here', 8, 3)).toEqual({ notes: [], quests: [] });
    });
    (0, vitest_1.it)('offers a same-titled note and quest, while omitting archived, current and reserved note titles', function () {
        var notes = [(0, test_support_1.note)({ id: 'here' }), (0, test_support_1.note)({ id: 'old', isArchived: true }), (0, test_support_1.note)({ id: 'reserved', title: 'quest:t-abc' }), (0, test_support_1.note)({ id: 'plan', title: 'Plan' })];
        var picks = (0, notes_view_1.linkPicksOf)(notes, new Map([['t-abc', line('Plan', 'waiting')]]), '', 'here', 8, 3);
        (0, vitest_1.expect)(picks.notes.map(function (n) { return n.id; })).toEqual(['plan']);
        (0, vitest_1.expect)(picks.quests.map(function (q) { return q.id; })).toEqual(['t-abc']);
        (0, vitest_1.expect)((0, notes_view_1.withLink)('See [[pl]] after', 6, 8, 'quest:t-abc|Plan')).toEqual({ body: 'See [[quest:t-abc|Plan]] after', caret: 24 });
    });
});
(0, vitest_1.describe)('the list', function () {
    (0, vitest_1.it)('shows pins once at the top, newest first, with a real folder named Pinned kept separate', function () {
        var notes = [(0, test_support_1.note)({ id: 'old', isPinned: true, updated: '1' }), (0, test_support_1.note)({ id: 'new', folder: 'Inbox', isPinned: true, updated: '2' }), (0, test_support_1.note)({ id: 'inbox', folder: 'Inbox' }), (0, test_support_1.note)({ id: 'named', folder: 'Pinned' })];
        (0, vitest_1.expect)((0, notes_view_1.foldersOf)(notes, '', false).map(function (g) { return [g.folder, g.notes.map(function (n) { return n.id; })]; })).toEqual([[null, ['new', 'old']], ['Inbox', ['inbox']], ['Pinned', ['named']]]);
    });
    (0, vitest_1.it)('searches pinned notes too, and archived pins show in their own folder', function () {
        var notes = [(0, test_support_1.note)({ id: 'pin', isPinned: true, tags: ['special'] }), (0, test_support_1.note)({ id: 'archive', isPinned: true, isArchived: true, folder: 'Old' })];
        (0, vitest_1.expect)((0, notes_view_1.foldersOf)(notes, '#special', false).map(function (g) { return [g.folder, g.notes.map(function (n) { return n.id; })]; })).toEqual([[null, ['pin']]]);
        (0, vitest_1.expect)((0, notes_view_1.foldersOf)(notes, 'missing', false)).toEqual([]);
        (0, vitest_1.expect)((0, notes_view_1.foldersOf)(notes, '', true).map(function (g) { return [g.folder, g.notes.map(function (n) { return n.id; })]; })).toEqual([['Old', ['archive']]]);
    });
    (0, vitest_1.it)('a #word in search matches tags only', function () {
        (0, vitest_1.expect)((0, notes_view_1.matches)((0, test_support_1.note)({ body: '#security in text', tags: [] }), '#security')).toBe(false);
        (0, vitest_1.expect)((0, notes_view_1.matches)((0, test_support_1.note)({ tags: ['security'] }), '#sec')).toBe(true);
    });
    (0, vitest_1.it)('puts Inbox first, then folders A to Z, newest note first, and searches every word', function () {
        var notes = [(0, test_support_1.note)({ id: 'z', folder: 'Zeta' }), (0, test_support_1.note)({ id: 'i1', folder: 'Inbox', updated: '1' }), (0, test_support_1.note)({ id: 'i2', folder: 'Inbox', updated: '2', tags: ['x'] }), (0, test_support_1.note)({ id: 'a', folder: 'Alpha', isArchived: true })];
        (0, vitest_1.expect)((0, notes_view_1.foldersOf)(notes, '', false).map(function (g) { return [g.folder, g.notes.map(function (n) { return n.id; })]; })).toEqual([
            ['Inbox', ['i2', 'i1']],
            ['Zeta', ['z']],
        ]);
        (0, vitest_1.expect)((0, notes_view_1.foldersOf)(notes, '', true).map(function (g) { return g.folder; })).toEqual(['Alpha']);
        (0, vitest_1.expect)((0, notes_view_1.foldersOf)(notes, 'bug #x', false).flatMap(function (g) { return g.notes.map(function (n) { return n.id; }); })).toEqual(['i2']);
    });
});
(0, vitest_1.describe)('where a filed quest is now', function () {
    (0, vitest_1.it)('reads it from the queue: waiting, sealed, in progress, done, or gone', function () {
        var view = (0, test_support_1.projectView)('a-000001', {
            ready: [{ kind: 'saga', quest: (0, test_support_1.quest)({ id: 'p' }), chapters: [(0, test_support_1.quest)({ id: 'c' })], progress: { done: 0, total: 1 }, hasStar: false }],
            sealed: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 's' }) }],
            activeQuests: [(0, test_support_1.activeQuest)({ id: 'c', title: 'c' })],
            victories: [{ id: 'd', title: 'Done one', finished: '', minutes: 1, xp: 1 }],
        });
        var lines = (0, notes_view_1.questLinesOf)(view);
        (0, vitest_1.expect)(['p', 'c', 's', 'd', 'x'].map(function (id) { return (0, notes_view_1.questLineOf)(lines, id).state; })).toEqual(['waiting', 'active', 'sealed', 'done', 'gone']);
    });
});
