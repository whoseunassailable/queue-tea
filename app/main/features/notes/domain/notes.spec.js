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
var notes_1 = require("../../../../shared/notes");
var note_file_1 = require("./note_file");
var note = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 'n-1', title: 'Bug Bounty Helper', folder: 'Ideas', type: null, isPinned: false, tags: [], created: '', updated: '', isArchived: false, quests: [], body: '', stamp: '' }, over));
};
(0, vitest_1.describe)('a note file', function () {
    vitest_1.it.each(notes_1.NOTE_TYPES)('reads and writes a %s type apart from the folder and pin', function (type) {
        var read = (0, note_file_1.parseNote)("---\nfolder: Plans\ntype: ".concat(type.toUpperCase(), "\npinned: true\n---\nKeep this text"), 'Plan', 'file-time');
        (0, vitest_1.expect)(read).toMatchObject({ folder: 'Plans', type: type, isPinned: true, body: 'Keep this text' });
        (0, vitest_1.expect)((0, note_file_1.parseNote)((0, note_file_1.noteText)(read), 'Plan', 'file-time')).toEqual(read);
    });
    (0, vitest_1.it)('keeps old files free of unset type and pin properties', function () {
        var read = (0, note_file_1.parseNote)('Body', 'Old', 'file-time');
        (0, vitest_1.expect)(read).toMatchObject({ type: null, isPinned: false });
        (0, vitest_1.expect)((0, note_file_1.noteText)(read)).not.toMatch(/^(type|pinned):/m);
    });
    vitest_1.it.each(['book', '\n  - book\n  - journal'])('keeps an unknown type until a known one replaces it: %s', function (value) {
        var read = (0, note_file_1.parseNote)("---\ntype: ".concat(value, "\ncssclass: wide\n---\nBody"), 'Old', 'file-time');
        var kept = (0, note_file_1.noteText)(read);
        (0, vitest_1.expect)(read.type).toBeNull();
        (0, vitest_1.expect)(kept).toContain("type: ".concat(value));
        var replaced = (0, note_file_1.noteText)(__assign(__assign({}, read), { type: 'idea' }));
        (0, vitest_1.expect)(replaced.match(/^type:/gm)).toHaveLength(1);
        (0, vitest_1.expect)(replaced).not.toContain('book');
        (0, vitest_1.expect)(replaced).toContain('cssclass: wide');
        (0, vitest_1.expect)((0, note_file_1.parseNote)(replaced, 'Old', 'file-time').type).toBe('idea');
    });
    (0, vitest_1.it)('removes the pin property when unpinned without changing the type or body', function () {
        var read = (0, note_file_1.parseNote)('---\ntype: bug\npinned: true\n---\nBody', 'Bug', 'file-time');
        var text = (0, note_file_1.noteText)(__assign(__assign({}, read), { isPinned: false }));
        (0, vitest_1.expect)(text).not.toMatch(/^pinned:/m);
        (0, vitest_1.expect)((0, note_file_1.parseNote)(text, 'Bug', 'file-time')).toMatchObject({ type: 'bug', isPinned: false, body: 'Body' });
    });
    (0, vitest_1.it)('reads what it writes, and keeps front matter it does not own', function () {
        var text = (0, note_file_1.noteText)({ title: 'Bug "Bounty"', folder: 'Ideas', type: null, isPinned: false, tags: ['security'], created: '2026-11-07T10:00:00', updated: '2026-11-07T11:00:00', isArchived: true, quests: [{ id: 't-1', item: null }], body: '# Plan\n\n---\nnot front matter', aliases: ['bbh'], rest: ['cssclass: wide'] });
        var read = (0, note_file_1.parseNote)(text, 'n-1', 'file-time');
        (0, vitest_1.expect)(read).toEqual({ title: 'Bug "Bounty"', folder: 'Ideas', type: null, isPinned: false, tags: ['security'], created: '2026-11-07T10:00:00', updated: '2026-11-07T11:00:00', isArchived: true, quests: [{ id: 't-1', item: null }], body: '# Plan\n\n---\nnot front matter', aliases: ['bbh'], rest: ['cssclass: wide'] });
        (0, vitest_1.expect)((0, note_file_1.noteText)(read)).toBe(text);
    });
    (0, vitest_1.it)('reads a note Obsidian wrote: plain values and YAML lists', function () {
        var read = (0, note_file_1.parseNote)('---\r\ntitle: My idea\r\ntags:\r\n  - "#ideas"\r\n  - deep work\r\naliases: [My idea, mi]\r\ncssclass: wide\r\n---\r\nHello', 'my-idea', 'file-time');
        (0, vitest_1.expect)(read).toMatchObject({ title: 'My idea', folder: 'Inbox', tags: ['ideas', 'deep-work'], created: 'file-time', isArchived: false, body: 'Hello', rest: ['cssclass: wide'] });
    });
    (0, vitest_1.it)('takes a file with no front matter as all body, named after the file', function () {
        (0, vitest_1.expect)((0, note_file_1.parseNote)('just text\n', 'Scratch', 'file-time')).toMatchObject({ title: 'Scratch', folder: 'Inbox', body: 'just text\n', rest: [] });
        (0, vitest_1.expect)((0, note_file_1.parseNote)('---\nno end', 'Open', 'file-time')).toMatchObject({ title: 'Open', body: '---\nno end' });
    });
    (0, vitest_1.it)('drops quest links it cannot read', function () {
        (0, vitest_1.expect)((0, note_file_1.parseNote)('---\nquests: [{"id":1}, {"id":"t-2","item":"x"}]\n---\n', 'n', 't').quests).toEqual([{ id: 't-2', item: 'x' }]);
    });
});
(0, vitest_1.describe)('titles', function () {
    (0, vitest_1.it)('are taken by a live note of the same title, whatever its case', function () {
        var notes = [note({ id: 'a', title: 'Plan' }), note({ id: 'b', title: 'Old', isArchived: true })];
        (0, vitest_1.expect)((0, notes_1.isTitleTaken)(notes, ' plan ', null)).toBe(true);
        (0, vitest_1.expect)((0, notes_1.isTitleTaken)(notes, 'Plan', 'a')).toBe(false);
        (0, vitest_1.expect)((0, notes_1.isTitleTaken)(notes, 'Old', null)).toBe(false);
        (0, vitest_1.expect)((0, notes_1.freeTitle)(__spreadArray(__spreadArray([], notes, true), [note({ id: 'c', title: 'Plan 2' })], false), 'Plan')).toBe('Plan 3');
    });
});
(0, vitest_1.describe)('note ids', function () {
    (0, vitest_1.it)('are file names with no folders, hidden files or ..', function () {
        (0, vitest_1.expect)(['n-1a2b3c4d', 'My idea', 'Bug (v2)'].every(notes_1.isNoteId)).toBe(true);
        (0, vitest_1.expect)(['', '.hidden', '../x', 'a/b', 'a\\b', 'a..b', 'x'.repeat(121), 7].some(notes_1.isNoteId)).toBe(false);
    });
});
(0, vitest_1.describe)('links', function () {
    (0, vitest_1.it)('finds each linked title once, with or without an alias or heading', function () {
        (0, vitest_1.expect)((0, notes_1.linksOf)('See [[Plan]], [[plan|the plan]], [[Risks#Top]] and [[ ]].')).toEqual(['Plan', 'Risks']);
    });
    (0, vitest_1.it)('cuts text into plain runs and links, showing an alias where one is given', function () {
        (0, vitest_1.expect)((0, notes_1.linkPartsOf)('See [[Plan|the plan]], [[Risks#Top]] and [[ ]].')).toEqual([
            { kind: 'text', text: 'See ' },
            { kind: 'link', title: 'Plan', shown: 'the plan' },
            { kind: 'text', text: ', ' },
            { kind: 'link', title: 'Risks', shown: 'Risks' },
            { kind: 'text', text: ' and ' },
            { kind: 'text', text: '[[ ]]' },
            { kind: 'text', text: '.' },
        ]);
    });
    (0, vitest_1.it)('renames every form of a link and leaves the others', function () {
        (0, vitest_1.expect)((0, notes_1.renameLinks)('[[Plan]] [[plan|p]] [[Plan#x]] [[Planet]]', 'Plan', 'Roadmap')).toBe('[[Roadmap]] [[Roadmap|p]] [[Roadmap#x]] [[Planet]]');
    });
    (0, vitest_1.it)('backlinks are the other live notes that link here', function () {
        var here = note();
        var notes = [here, note({ id: 'a', body: '[[bug bounty helper]]' }), note({ id: 'b', body: '[[Bug Bounty Helper]]', isArchived: true }), note({ id: 'c', body: 'none' })];
        (0, vitest_1.expect)((0, notes_1.backlinksOf)(notes, here).map(function (n) { return n.id; })).toEqual(['a']);
    });
});
(0, vitest_1.describe)('quest links', function () {
    (0, vitest_1.it)('recognises generated quest ids, ignoring case, while ordinary note titles stay notes', function () {
        (0, vitest_1.expect)((0, notes_1.questIdOf)(' QUEST:T-A1B2C3D4 ')).toBe('t-a1b2c3d4');
        (0, vitest_1.expect)((0, notes_1.questIdOf)('quest:t-12345678-abcd-4321-abcd-123456789abc')).toBe('t-12345678-abcd-4321-abcd-123456789abc');
        for (var _i = 0, _a = ['Quest plan', 'quest:', 'quest:t-plan', 'quest:t-abc/def']; _i < _a.length; _i++) {
            var title = _a[_i];
            (0, vitest_1.expect)((0, notes_1.questIdOf)(title)).toBeNull();
        }
    });
    (0, vitest_1.it)('writes an alias that cannot close or split the link, preserving unicode', function () {
        var written = (0, notes_1.questLinkOf)('t-abc123', 'Fix [[input]] | café\r\nnext');
        (0, vitest_1.expect)(written).toBe('quest:t-abc123|Fix input café next');
        (0, vitest_1.expect)((0, notes_1.linkPartsOf)("[[".concat(written, "]]"))).toEqual([{ kind: 'quest', id: 't-abc123', shown: 'Fix input café next' }]);
        (0, vitest_1.expect)((0, notes_1.questLinkOf)('t-abc123', ' []|\n ')).toBe('quest:t-abc123');
    });
    (0, vitest_1.it)('keeps quest ids separate from note links and deduplicates their aliases', function () {
        var body = '[[Plan]] [[quest:t-abc|Old]] [[QUEST:T-ABC|New]] [[quest:t-def]] [[quest:t-plan]]';
        (0, vitest_1.expect)((0, notes_1.questLinksOf)(body)).toEqual(['t-abc', 't-def']);
        (0, vitest_1.expect)((0, notes_1.linksOf)(body)).toEqual(['Plan', 'quest:t-plan']);
        (0, vitest_1.expect)((0, notes_1.linkPartsOf)('[[quest:t-def]]')).toEqual([{ kind: 'quest', id: 't-def', shown: 't-def' }]);
    });
    (0, vitest_1.it)('never rewrites a quest link or counts it as a backlink to a same-named note', function () {
        var body = '[[quest:t-abc|Plan]] [[Plan]]';
        (0, vitest_1.expect)((0, notes_1.renameLinks)(body, 'quest:t-abc', 'Roadmap')).toBe(body);
        (0, vitest_1.expect)((0, notes_1.renameLinks)(body, 'Plan', 'Roadmap')).toBe('[[quest:t-abc|Plan]] [[Roadmap]]');
        var here = note({ title: 'quest:t-abc' });
        (0, vitest_1.expect)((0, notes_1.backlinksOf)([here, note({ id: 'other', body: body })], here)).toEqual([]);
    });
});
(0, vitest_1.describe)('turning a note into quests', function () {
    var body = '# Plan\n\nAn intelligent security helper.\n\n- [ ] Scan dependencies\n- [x] Done already\n* [ ] Write the report\n- [ ] Scan dependencies\n';
    (0, vitest_1.it)('reads the unticked checklist lines', function () {
        (0, vitest_1.expect)((0, notes_1.openItemsOf)(body)).toEqual(['Scan dependencies', 'Write the report', 'Scan dependencies']);
    });
    (0, vitest_1.it)('offers a new parent named after the note for two or more lines', function () {
        (0, vitest_1.expect)((0, notes_1.proposalOf)(note({ body: body }))).toEqual({
            parent: { kind: 'new', title: 'Bug Bounty Helper' },
            quests: [
                { title: 'Scan dependencies', priority: 'mid', difficulty: 'medium', item: 'Scan dependencies' },
                { title: 'Write the report', priority: 'mid', difficulty: 'medium', item: 'Write the report' },
            ],
        });
    });
    (0, vitest_1.it)('offers only the lines not filed yet, under the note’s own quest', function () {
        var filed = note({ body: body, quests: [{ id: 't-own', item: null }, { id: 't-1', item: 'Scan dependencies' }] });
        (0, vitest_1.expect)((0, notes_1.proposalOf)(filed)).toEqual({ parent: { kind: 'task', id: 't-own' }, quests: [{ title: 'Write the report', priority: 'mid', difficulty: 'medium', item: 'Write the report' }] });
    });
    (0, vitest_1.it)('once the note’s own quest is done, offers new lines under a new parent, and never the note again', function () {
        var done = note({ body: body, quests: [{ id: 't-own', item: null }] });
        (0, vitest_1.expect)((0, notes_1.proposalOf)(done, function () { return false; }).parent).toEqual({ kind: 'new', title: 'Bug Bounty Helper' });
        (0, vitest_1.expect)((0, notes_1.proposalOf)(note({ body: 'Words', quests: [{ id: 't-own', item: null }] }), function () { return false; }).quests).toEqual([]);
    });
    (0, vitest_1.it)('once its lines are all filed, offers nothing, not the note itself', function () {
        (0, vitest_1.expect)((0, notes_1.proposalOf)(note({ body: '- [ ] Only this', quests: [{ id: 't-1', item: 'Only this' }] })).quests).toEqual([]);
    });
    (0, vitest_1.it)('makes one line one quest, and a note with none the quest itself', function () {
        (0, vitest_1.expect)((0, notes_1.proposalOf)(note({ body: '- [ ] Only this' })).quests).toEqual([{ title: 'Only this', priority: 'mid', difficulty: 'medium', item: 'Only this' }]);
        (0, vitest_1.expect)((0, notes_1.proposalOf)(note({ body: 'Words' }))).toEqual({ parent: { kind: 'none' }, quests: [{ title: 'Bug Bounty Helper', priority: 'mid', difficulty: 'medium', item: null }] });
        (0, vitest_1.expect)((0, notes_1.proposalOf)(note({ body: 'Words', quests: [{ id: 't-own', item: null }] })).quests).toEqual([]);
    });
    (0, vitest_1.it)('describes a quest with the first paragraph that is prose', function () {
        (0, vitest_1.expect)((0, notes_1.firstParagraphOf)(body)).toBe('An intelligent security helper.');
        (0, vitest_1.expect)((0, notes_1.firstParagraphOf)('# Only a heading')).toBeNull();
    });
});
