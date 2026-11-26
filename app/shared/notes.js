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
exports.firstParagraphOf = exports.proposalOf = exports.openItemsOf = exports.freeTitle = exports.isTitleTaken = exports.noteTitled = exports.backlinksOf = exports.renameLinks = exports.linkPartsOf = exports.questLinksOf = exports.linksOf = exports.questLinkOf = exports.questIdOf = exports.isNoteId = exports.cleanTag = exports.NOTE_FOLDER_BAD = exports.NOTE_TITLE_BAD = exports.noteTypeOf = exports.NOTE_TYPES = exports.NOTE_LIMITS = exports.DAILY_TEMPLATE = exports.JOURNAL = exports.INBOX = exports.NOTE_VERSION_ID = exports.NOTE_HISTORY_LIMITS = exports.NOTE_HISTORY_FOLDER = exports.NOTES_FOLDER = void 0;
var note_attachments_1 = require("./note_attachments");
var description_files_1 = require("../../hooks/shared/records/domain/services/description_files");
Object.defineProperty(exports, "NOTES_FOLDER", { enumerable: true, get: function () { return description_files_1.NOTES_FOLDER; } });
exports.NOTE_HISTORY_FOLDER = '.history';
exports.NOTE_HISTORY_LIMITS = { recent: 50, hourly: 24, daily: 26 };
exports.NOTE_VERSION_ID = /^v-(\d{13})-([a-f0-9]{40})$/;
exports.INBOX = 'Inbox';
// Where a day's note is made, and the note new days start from.
exports.JOURNAL = 'Journal';
exports.DAILY_TEMPLATE = 'Daily template';
exports.NOTE_LIMITS = { title: 200, folder: 60, tag: 40, tags: 20, item: 500, body: 1000000, notes: 5000, quests: 50 };
// What a note is, apart from where it's kept: each has a template.
exports.NOTE_TYPES = ['idea', 'feature', 'bug', 'meeting', 'research', 'decision', 'daily'];
var noteTypeOf = function (value) { var _a; return (_a = exports.NOTE_TYPES.find(function (type) { return typeof value === 'string' && type === value.trim().toLowerCase(); })) !== null && _a !== void 0 ? _a : null; };
exports.noteTypeOf = noteTypeOf;
// Links are [[Title]], so a title can't hold what a link is made of.
exports.NOTE_TITLE_BAD = /[[\]|#\r\n]/;
// A folder is one level.
exports.NOTE_FOLDER_BAD = /[\\/]/;
// A tag as Obsidian reads one: no #, and no spaces inside.
var cleanTag = function (tag) { return tag.trim().replace(/^#+/, '').replace(/\s+/g, '-'); };
exports.cleanTag = cleanTag;
// A note's id is its file name, which a note made in Obsidian picks itself:
// no folders, nothing hidden, no .. in it.
var isNoteId = function (value) { return typeof value === 'string' && /^[^./\\\0][^/\\\0]{0,119}$/.test(value) && !value.includes('..'); };
exports.isNoteId = isNoteId;
var same = function (a, b) { return a.toLowerCase() === b.toLowerCase(); };
var LINK = /\[\[([^[\]|#\n]+)((?:[#|][^\]\n]*)?)\]\]/g;
// [[quest:t-e84dd5ab|Write the parser]] links a quest by its id, so renaming
// the quest can't break it, and Obsidian still shows the title.
var QUEST_TARGET = /^quest:(t-[0-9a-f-]+)$/i;
var questIdOf = function (target) { var _a, _b, _c; return (_c = (_b = (_a = QUEST_TARGET.exec(target.trim())) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : null; };
exports.questIdOf = questIdOf;
// What goes between [[ and ]] for a quest. A title can hold what a link is made of, so that turns into spaces.
var questLinkOf = function (id, title) {
    var shown = title.replace(/[[\]|\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    return shown === '' ? "quest:".concat(id) : "quest:".concat(id, "|").concat(shown);
};
exports.questLinkOf = questLinkOf;
var targetsOf = function (body) { return __spreadArray([], body.matchAll(LINK), true).filter(function (m) {
    var path = (0, note_attachments_1.noteFilePath)(m[1].trim());
    return path === null || (!path.startsWith("".concat(note_attachments_1.NOTE_ATTACHMENTS, "/")) && body[m.index - 1] !== '!');
}).map(function (m) { return m[1].trim(); }).filter(function (target) { return target !== ''; }); };
var once = function (values) { return values.filter(function (value, i) { return values.findIndex(function (other) { return same(other, value); }) === i; }); };
// The notes a body links to, as written in [[Title]], [[Title|shown]] or [[Title#heading]].
var linksOf = function (body) { return once(targetsOf(body).filter(function (target) { return (0, exports.questIdOf)(target) === null; })); };
exports.linksOf = linksOf;
// The quests a body links to, by id.
var questLinksOf = function (body) { return once(targetsOf(body).flatMap(function (target) { var _a; return (_a = (0, exports.questIdOf)(target)) !== null && _a !== void 0 ? _a : []; })); };
exports.questLinksOf = questLinksOf;
var linkPartsOf = function (text) {
    var _a;
    var parts = [];
    var at = 0;
    for (var _i = 0, _b = text.matchAll(LINK); _i < _b.length; _i++) {
        var m = _b[_i];
        if (m.index > at)
            parts.push({ kind: 'text', text: text.slice(at, m.index) });
        var title = m[1].trim();
        var rest = (_a = m[2]) !== null && _a !== void 0 ? _a : '';
        var shown = rest.startsWith('|') && rest.length > 1 ? rest.slice(1) : null;
        var quest = (0, exports.questIdOf)(title);
        parts.push(title === '' ? { kind: 'text', text: m[0] } : quest !== null ? { kind: 'quest', id: quest, shown: shown !== null && shown !== void 0 ? shown : quest } : { kind: 'link', title: title, shown: shown !== null && shown !== void 0 ? shown : title });
        at = m.index + m[0].length;
    }
    if (at < text.length)
        parts.push({ kind: 'text', text: text.slice(at) });
    return parts;
};
exports.linkPartsOf = linkPartsOf;
var renameLinks = function (body, from, to) { return body.replace(LINK, function (link, title, rest, at) {
    var path = (0, note_attachments_1.noteFilePath)(title.trim());
    if (path !== null && (path.startsWith("".concat(note_attachments_1.NOTE_ATTACHMENTS, "/")) || body[at - 1] === '!'))
        return link;
    return same(title.trim(), from) && (0, exports.questIdOf)(title) === null ? "[[".concat(to).concat(rest, "]]") : link;
}); };
exports.renameLinks = renameLinks;
var backlinksOf = function (notes, note) { return notes.filter(function (other) { return other.id !== note.id && !other.isArchived && (0, exports.linksOf)(other.body).some(function (title) { return same(title, note.title); }); }); };
exports.backlinksOf = backlinksOf;
var noteTitled = function (notes, title) { return notes.find(function (note) { return !note.isArchived && same(note.title, title); }); };
exports.noteTitled = noteTitled;
// Titles are unique among the notes that aren't archived, so a link means one note.
var isTitleTaken = function (notes, title, exceptId) { return notes.some(function (note) { return note.id !== exceptId && !note.isArchived && same(note.title, title.trim()); }); };
exports.isTitleTaken = isTitleTaken;
// The title, or the title with the next free number: "Plan 2".
var freeTitle = function (notes, title, exceptId) {
    if (exceptId === void 0) { exceptId = null; }
    var base = title.trim();
    if (!(0, exports.isTitleTaken)(notes, base, exceptId))
        return base;
    var n = 2;
    var numbered = function () { return "".concat(base.slice(0, exports.NOTE_LIMITS.title - String(n).length - 1), " ").concat(n); };
    while ((0, exports.isTitleTaken)(notes, numbered(), exceptId))
        n += 1;
    return numbered();
};
exports.freeTitle = freeTitle;
// The unticked checklist lines: "- [ ] Write the parser".
var openItemsOf = function (body) {
    return body
        .split('\n')
        .map(function (line) { var _a, _b, _c; return (_c = (_b = (_a = /^\s*[-*+] \[ \] (.+)$/.exec(line)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : ''; })
        .filter(function (item) { return item !== ''; })
        .map(function (item) { return item.slice(0, exports.NOTE_LIMITS.item); });
};
exports.openItemsOf = openItemsOf;
// What Turn into quests offers: one quest per unticked line not filed yet,
// under the note's own quest while it's still open, or under a new one named
// after the note when there are two or more. With no lines, the note itself
// is the quest, but only while nothing has been filed from it. isOpen says
// whether a quest is still in play.
var proposalOf = function (note, isOpen) {
    if (isOpen === void 0) { isOpen = function () { return true; }; }
    var filed = new Set(note.quests.map(function (q) { return q.item; }));
    var own = note.quests.find(function (q) { return q.item === null && isOpen(q.id); });
    var items = (0, exports.openItemsOf)(note.body).filter(function (item, i, all) { return !filed.has(item) && all.indexOf(item) === i; });
    var quest = function (title, item) { return ({ title: title.slice(0, exports.NOTE_LIMITS.title), priority: 'mid', difficulty: 'medium', item: item }); };
    if (items.length === 0)
        return { parent: { kind: 'none' }, quests: note.quests.length > 0 ? [] : [quest(note.title, null)] };
    if (own !== undefined)
        return { parent: { kind: 'task', id: own.id }, quests: items.map(function (item) { return quest(item, item); }) };
    if (items.length === 1)
        return { parent: { kind: 'none' }, quests: [quest(items[0], items[0])] };
    return { parent: { kind: 'new', title: note.title.slice(0, exports.NOTE_LIMITS.title) }, quests: items.map(function (item) { return quest(item, item); }) };
};
exports.proposalOf = proposalOf;
// The first paragraph that isn't a heading or a checklist, for a quest's description.
var firstParagraphOf = function (body) {
    var para = body
        .split(/\n\s*\n/)
        .map(function (block) { return block.trim(); })
        .find(function (block) { return block !== '' && !block.startsWith('#') && !/^[-*+] \[[ x]\]/i.test(block); });
    return para === undefined ? null : para.slice(0, 2000);
};
exports.firstParagraphOf = firstParagraphOf;
