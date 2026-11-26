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
exports.isInPlay = exports.questLineOf = exports.questLinesOf = exports.withLink = exports.linkQueryAt = exports.linkPicksOf = exports.linkOptionsOf = exports.brewLineOf = exports.toggleTaskAt = exports.tickedItemsOf = exports.lineOf = exports.linkLineOf = exports.localDay = exports.whenOf = exports.captureOf = exports.tagsError = exports.tagsOf = exports.journalOf = exports.dailyBodyOf = exports.dayError = exports.isDay = exports.templateChange = exports.isUntitled = exports.folderNameError = exports.folderError = exports.titleError = exports.foldersOf = exports.matches = exports.folderPageOf = exports.folderKeyOf = void 0;
var notes_1 = require("../../../../shared/notes");
var format_1 = require("../../../core/domain/format");
var constants_1 = require("../../../core/constants/constants");
var en_1 = require("../../../l10n/en");
// A folder can't start with a space, so this never meets a folder name.
var folderKeyOf = function (group) { var _a; return (_a = group.folder) !== null && _a !== void 0 ? _a : ' pinned'; };
exports.folderKeyOf = folderKeyOf;
// A folded folder takes one place too, bounding a realm with many folders.
// Keep the full group for its count and only render this page's visible notes.
var folderPageOf = function (groups, folded, requested) {
    var sizeOf = function (group) { return folded.has((0, exports.folderKeyOf)(group)) ? 1 : Math.max(1, group.notes.length); };
    var pages = Math.max(1, Math.ceil(groups.reduce(function (sum, group) { return sum + sizeOf(group); }, 0) / constants_1.NOTE_LIST_PAGE_SIZE));
    var page = Math.max(0, Math.min(pages - 1, requested));
    var start = page * constants_1.NOTE_LIST_PAGE_SIZE;
    var end = start + constants_1.NOTE_LIST_PAGE_SIZE;
    var shown = [];
    var at = 0;
    for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
        var group = groups_1[_i];
        var size = sizeOf(group);
        if (at < end && at + size > start)
            shown.push(__assign(__assign({}, group), { visible: folded.has((0, exports.folderKeyOf)(group)) ? [] : group.notes.slice(Math.max(0, start - at), end - at) }));
        at += size;
        if (at >= end)
            break;
    }
    return { groups: shown, page: page, pages: pages };
};
exports.folderPageOf = folderPageOf;
var words = function (query) { return query.toLowerCase().split(/\s+/).filter(function (word) { return word !== ''; }); };
var searchText = new WeakMap();
// IPC replies and saved edits replace notes. A weak key releases old bodies
// and ensures an edited note never inherits the previous search text.
var searchable = function (note) {
    var kept = searchText.get(note);
    if (kept !== undefined)
        return kept;
    var tags = note.tags.map(function (tag) { return tag.toLowerCase(); });
    var made = { text: "".concat(note.title, "\n").concat(note.body, "\n").concat(tags.map(function (tag) { return "#".concat(tag); }).join(' ')).toLowerCase(), tags: tags };
    searchText.set(note, made);
    return made;
};
// A note matches when every word is in its title, body or tags; a #word
// matches tags only.
var matching = function (query) {
    var terms = words(query);
    return function (note) {
        if (terms.length === 0)
            return true;
        var _a = searchable(note), text = _a.text, tags = _a.tags;
        return terms.every(function (word) { return (word.startsWith('#') ? tags.some(function (tag) { return tag.startsWith(word.slice(1)); }) : text.includes(word)); });
    };
};
var matches = function (note, query) { return matching(query)(note); };
exports.matches = matches;
// Pinned notes first, in their own group and not in their folder too; then
// Inbox, then the rest A to Z; newest note first in each. Archived notes
// show in their folders.
var foldersOf = function (notes, query, isArchived) {
    var match = matching(query);
    var shown = notes.filter(function (note) { return note.isArchived === isArchived && match(note); }).sort(function (a, b) { return b.updated.localeCompare(a.updated); });
    var pinned = [];
    var folders = new Map();
    for (var _i = 0, shown_1 = shown; _i < shown_1.length; _i++) {
        var note = shown_1[_i];
        if (!isArchived && note.isPinned)
            pinned.push(note);
        else {
            if (!folders.has(note.folder))
                folders.set(note.folder, []);
            folders.get(note.folder).push(note);
        }
    }
    var names = __spreadArray([], folders.keys(), true).sort(function (a, b) { return (a === notes_1.INBOX ? -1 : b === notes_1.INBOX ? 1 : a.localeCompare(b)); });
    return __spreadArray(__spreadArray([], (pinned.length > 0 ? [{ folder: null, notes: pinned }] : []), true), names.map(function (folder) { return ({ folder: folder, notes: folders.get(folder) }); }), true);
};
exports.foldersOf = foldersOf;
// notes and id, when given, check the title is free among the live notes.
var titleError = function (title, notes, id) {
    if (notes === void 0) { notes = []; }
    if (id === void 0) { id = null; }
    var trimmed = title.trim();
    if (trimmed === '')
        return en_1.t.notebook.titleRequired;
    if (trimmed.length > notes_1.NOTE_LIMITS.title)
        return en_1.t.notebook.titleLong;
    if (notes_1.NOTE_TITLE_BAD.test(trimmed))
        return en_1.t.notebook.titleBad;
    if ((0, notes_1.isTitleTaken)(notes, trimmed, id))
        return en_1.t.notebook.titleTaken(trimmed);
    return undefined;
};
exports.titleError = titleError;
var folderError = function (folder) {
    if (folder.trim().length > notes_1.NOTE_LIMITS.folder)
        return en_1.t.notebook.folderLong;
    if (notes_1.NOTE_FOLDER_BAD.test(folder))
        return en_1.t.notebook.folderSlash;
    return undefined;
};
exports.folderError = folderError;
// A folder's new name, which can't be empty.
var folderNameError = function (folder) { return (folder.trim() === '' ? en_1.t.notebook.folderRequired : (0, exports.folderError)(folder)); };
exports.folderNameError = folderNameError;
// "Untitled", or "Untitled 2" when that was taken.
var isUntitled = function (title) {
    var name = en_1.t.notebook.untitled;
    return title === name || (title.startsWith("".concat(name, " ")) && /^\d+$/.test(title.slice(name.length + 1)));
};
exports.isUntitled = isUntitled;
// Picking a template gives a note its type and starting text. A Daily note
// still called Untitled takes today's date as its title.
var templateChange = function (type, title, notes, id, today) {
    var named = type === 'daily' && (0, exports.isUntitled)(title) ? (0, notes_1.freeTitle)(notes, today, id) : title;
    return __assign({ type: type, body: type === 'daily' ? (0, exports.dailyBodyOf)(notes, today, named) : en_1.t.notebook.templates[type] }, (named === title ? {} : { title: named }));
};
exports.templateChange = templateChange;
// A day's note is the live note titled with its date, as Obsidian names
// daily notes. A date that doesn't exist, such as 2026-02-30, isn't a day.
var isDay = function (title) { return /^\d{4}-\d{2}-\d{2}$/.test(title) && (0, exports.localDay)(new Date("".concat(title, "T12:00"))) === title; };
exports.isDay = isDay;
var dayError = function (day) { return (day.trim() === '' ? en_1.t.notebook.dayRequired : (0, exports.isDay)(day.trim()) ? undefined : en_1.t.notebook.dayBad); };
exports.dayError = dayError;
// What a new day starts with: the realm's "Daily template" note when it has
// text, else the built-in one. {{date}} and {{title}} become the day and title.
var dailyBodyOf = function (notes, day, title) {
    var _a, _b;
    if (title === void 0) { title = day; }
    var own = (_b = (_a = (0, notes_1.noteTitled)(notes, notes_1.DAILY_TEMPLATE)) === null || _a === void 0 ? void 0 : _a.body) !== null && _b !== void 0 ? _b : '';
    return (own.trim() === '' ? en_1.t.notebook.templates.daily : own).replace(/\{\{\s*date\s*\}\}/g, function () { return day; }).replace(/\{\{\s*title\s*\}\}/g, function () { return title; });
};
exports.dailyBodyOf = dailyBodyOf;
// The journal: the live days that match, newest first, a group per month.
var journalOf = function (notes, query) {
    var match = matching(query);
    var days = notes.filter(function (note) { return !note.isArchived && (0, exports.isDay)(note.title) && match(note); }).sort(function (a, b) { return b.title.localeCompare(a.title); });
    var months = new Map();
    for (var _i = 0, days_1 = days; _i < days_1.length; _i++) {
        var day = days_1[_i];
        var month = day.title.slice(0, 7);
        if (!months.has(month))
            months.set(month, []);
        months.get(month).push(day);
    }
    return __spreadArray([], months, true).map(function (_a) {
        var month = _a[0], days = _a[1];
        return ({
            folder: "".concat(en_1.t.months[Number(month.slice(5)) - 1], " ").concat(month.slice(0, 4)),
            notes: days,
        });
    });
};
exports.journalOf = journalOf;
var tagsOf = function (text) { return __spreadArray([], new Set(text.split(',').map(notes_1.cleanTag).filter(function (tag) { return tag !== ''; })), true); };
exports.tagsOf = tagsOf;
var tagsError = function (text) {
    var tags = (0, exports.tagsOf)(text);
    if (tags.some(function (tag) { return tag.length > notes_1.NOTE_LIMITS.tag; }))
        return en_1.t.notebook.tagLong;
    if (tags.length > notes_1.NOTE_LIMITS.tags)
        return en_1.t.notebook.tooManyTags;
    return undefined;
};
exports.tagsError = tagsError;
var CAPTURE_TITLE = 80;
// A jotted line becomes a note: its first line, cleaned, is the title, and the
// whole text is the body when the title couldn't hold it.
var captureOf = function (text) {
    var trimmed = text.trim();
    if (trimmed === '')
        return null;
    var first = trimmed.split('\n')[0].replace(new RegExp(notes_1.NOTE_TITLE_BAD.source, 'g'), ' ').replace(/\s+/g, ' ').trim();
    var cut = first.length <= CAPTURE_TITLE ? first : "".concat(first.slice(0, first.lastIndexOf(' ', CAPTURE_TITLE) > 20 ? first.lastIndexOf(' ', CAPTURE_TITLE) : CAPTURE_TITLE), "\u2026");
    var title = cut === '' ? en_1.t.notebook.untitled : cut;
    return { title: title, folder: notes_1.INBOX, body: title === trimmed ? '' : trimmed };
};
exports.captureOf = captureOf;
// When a note was edited, as the list says it: "Today 14:02", "Yesterday" or
// "5 Nov". today and yesterday are local days, YYYY-MM-DD.
var whenOf = function (iso, today, yesterday) {
    var day = iso.slice(0, 10);
    if (day === today)
        return en_1.t.notebook.today(iso.slice(11, 16));
    if (day === yesterday)
        return en_1.t.notebook.yesterday;
    return (0, format_1.dayOf)(iso);
};
exports.whenOf = whenOf;
var localDay = function (at) { return "".concat(at.getFullYear(), "-").concat(String(at.getMonth() + 1).padStart(2, '0'), "-").concat(String(at.getDate()).padStart(2, '0')); };
exports.localDay = localDay;
// The line of a note that links to a title, for its backlink.
var linkLineOf = function (body, title) {
    var _a;
    return (_a = body
        .split('\n')
        .map(function (line) { return line.trim(); })
        .find(function (line) { return (0, notes_1.linksOf)(line).some(function (linked) { return linked.toLowerCase() === title.toLowerCase(); }); })) !== null && _a !== void 0 ? _a : null;
};
exports.linkLineOf = linkLineOf;
// The 1-based line a checklist item sits on.
var lineOf = function (body, item) {
    var at = body.split('\n').findIndex(function (line) { return /^\s*[-*+] \[ \] /.test(line) && line.replace(/^\s*[-*+] \[ \] /, '').trim().slice(0, notes_1.NOTE_LIMITS.item) === item; });
    return at === -1 ? null : at + 1;
};
exports.lineOf = lineOf;
var tickedItemsOf = function (body) {
    return body
        .split('\n')
        .map(function (line) { var _a, _b, _c; return (_c = (_b = (_a = /^\s*[-*+] \[[xX]\] (.+)$/.exec(line)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : ''; })
        .filter(function (item) { return item !== ''; });
};
exports.tickedItemsOf = tickedItemsOf;
var TASK_LINE = /^(\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\]\s+\S)/;
var FENCE = /^\s*(?:>\s*)*(```|~~~)/;
// Ticks or unticks the index-th checklist line, counted as the Read view
// shows the boxes: in order, leaving out lines inside fenced code.
// shortcut: counts lines by pattern, so a task-like line in indented (4-space) code shifts the count; upgrade to the lexer's positions if that bites.
var toggleTaskAt = function (body, index) {
    var lines = body.split('\n');
    var fence = null;
    var n = -1;
    for (var _i = 0, _a = lines.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], i = _b[0], line = _b[1];
        var opened = FENCE.exec(line);
        if (opened !== null) {
            fence = fence === null ? opened[1] : fence === opened[1] ? null : fence;
            continue;
        }
        if (fence !== null || !TASK_LINE.test(line))
            continue;
        n += 1;
        if (n !== index)
            continue;
        lines[i] = line.replace(TASK_LINE, function (_, before, mark, after) { return "".concat(before).concat(mark === ' ' ? 'x' : ' ').concat(after); });
        return lines.join('\n');
    }
    return body;
};
exports.toggleTaskAt = toggleTaskAt;
// What BrewQuest's card says about the note.
var brewLineOf = function (note, proposal) {
    var waiting = proposal.quests.length;
    if (note.quests.length === 0)
        return (0, notes_1.openItemsOf)(note.body).length === 0 ? en_1.t.notebook.brew.asOne : en_1.t.notebook.brew.canBe(waiting);
    return waiting === 0 ? en_1.t.notebook.brew.allFiled(note.quests.length) : en_1.t.notebook.brew.someLeft(note.quests.length, waiting);
};
exports.brewLineOf = brewLineOf;
// How well a title fits what's typed: starting with it, then a word starting
// with it, then holding it anywhere; 3 is no match.
var rankOf = function (query) {
    var q = query.trim().toLowerCase();
    return function (title) {
        var low = title.toLowerCase();
        if (low.startsWith(q))
            return 0;
        if (low.split(/\s+/).some(function (word) { return word.startsWith(q); }))
            return 1;
        return low.includes(q) ? 2 : 3;
    };
};
// The notes the [[ picker offers, best fit first, newest first in each. A note
// titled like a quest link isn't one, since linking it would link the quest.
var linkOptionsOf = function (notes, query, exceptId, most) {
    var rank = rankOf(query);
    return notes
        .filter(function (note) { return !note.isArchived && note.id !== exceptId && (0, notes_1.questIdOf)(note.title) === null && rank(note.title) < 3; })
        .sort(function (a, b) { return rank(a.title) - rank(b.title) || b.updated.localeCompare(a.updated); })
        .slice(0, most);
};
exports.linkOptionsOf = linkOptionsOf;
// What the [[ picker offers: notes, then the quests in play, which are the ones
// Quests can open. Up to questRows rows are kept for quests, and each side
// fills what the other leaves. Quests in progress come first in each fit.
var linkPicksOf = function (notes, quests, query, exceptId, rows, questRows) {
    var rank = rankOf(query);
    var found = __spreadArray([], quests, true).flatMap(function (_a) {
        var id = _a[0], line = _a[1];
        return (line.title !== null && IN_PLAY.includes(line.state) && rank(line.title) < 3 ? [{ id: id, title: line.title, state: line.state }] : []);
    })
        .sort(function (a, b) { return rank(a.title) - rank(b.title) || IN_PLAY.indexOf(a.state) - IN_PLAY.indexOf(b.state); });
    var picked = (0, exports.linkOptionsOf)(notes, query, exceptId, rows - Math.min(found.length, questRows));
    return { notes: picked, quests: found.slice(0, rows - picked.length) };
};
exports.linkPicksOf = linkPicksOf;
// The [[ being typed at the caret, and what follows it so far, on one line.
var linkQueryAt = function (body, caret) {
    var line = body.slice(body.lastIndexOf('\n', caret - 1) + 1, caret);
    var open = line.lastIndexOf('[[');
    if (open === -1)
        return null;
    var query = line.slice(open + 2);
    if (query.includes(']') || query.includes('[') || query.length > notes_1.NOTE_LIMITS.title)
        return null;
    return { start: caret - query.length, query: query };
};
exports.linkQueryAt = linkQueryAt;
var withLink = function (body, start, caret, title) {
    var after = body.slice(caret).startsWith(']]') ? body.slice(caret + 2) : body.slice(caret);
    var inserted = "".concat(title, "]]");
    return { body: body.slice(0, start) + inserted + after, caret: start + inserted.length };
};
exports.withLink = withLink;
// Where a quest filed from a note is now, read from the queue itself, so a
// note never keeps its own copy to go stale.
var questLinesOf = function (view) {
    var lines = new Map();
    var add = function (entries, state) {
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var entry = entries_1[_i];
            lines.set(entry.quest.id, { title: entry.quest.title, state: state, priority: entry.quest.priority, difficulty: entry.quest.difficulty });
            if (entry.kind === 'saga')
                for (var _a = 0, _b = entry.chapters; _a < _b.length; _a++) {
                    var chapter = _b[_a];
                    lines.set(chapter.id, { title: chapter.title, state: state, priority: chapter.priority, difficulty: chapter.difficulty });
                }
        }
    };
    add(view.ready, 'waiting');
    add(view.sealed, 'sealed');
    for (var _i = 0, _a = view.victories; _i < _a.length; _i++) {
        var victory = _a[_i];
        lines.set(victory.id, { title: victory.title, state: 'done', priority: null, difficulty: null });
    }
    for (var _b = 0, _c = view.activeQuests; _b < _c.length; _b++) {
        var quest = _c[_b];
        lines.set(quest.id, { title: quest.title, state: 'active', priority: quest.priority, difficulty: quest.difficulty });
    }
    return lines;
};
exports.questLinesOf = questLinesOf;
var questLineOf = function (lines, id) { var _a; return (_a = lines.get(id)) !== null && _a !== void 0 ? _a : { title: null, state: 'gone', priority: null, difficulty: null }; };
exports.questLineOf = questLineOf;
// In the order the [[ picker offers them.
var IN_PLAY = ['active', 'waiting', 'sealed'];
// Whether a quest can still take more under it.
var isInPlay = function (lines, id) { return IN_PLAY.includes((0, exports.questLineOf)(lines, id).state); };
exports.isInPlay = isInPlay;
