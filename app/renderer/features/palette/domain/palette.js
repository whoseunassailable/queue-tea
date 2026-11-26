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
exports.filterPalette = exports.snippetOf = exports.matchScore = exports.canRun = exports.paletteEntries = void 0;
var routes_1 = require("../../../config/routing/routes");
var constants_1 = require("../../../core/constants/constants");
var en_1 = require("../../../l10n/en");
var notes_view_1 = require("../../notes/domain/notes_view");
var board_1 = require("../../quests/domain/board");
var entry = function (over) { return (__assign({ also: '', keys: null, reason: null, start: null, fill: null, note: null, detail: null, isBusy: false }, over)); };
var GO_TO = [
    { route: routes_1.ROUTES.home, label: en_1.t.nav.home, keys: '⌘1' },
    { route: routes_1.ROUTES.quests, label: en_1.t.nav.quests, keys: '⌘2' },
    { route: routes_1.ROUTES.designs, label: en_1.t.nav.designs, keys: '⌘3' },
    { route: routes_1.ROUTES.branches, label: en_1.t.nav.branches, keys: '⌘4' },
    { route: routes_1.ROUTES.chronicle, label: en_1.t.nav.chronicle, keys: '⌘5' },
    { route: routes_1.ROUTES.mana, label: en_1.t.nav.mana, keys: '⌘6' },
    { route: routes_1.ROUTES.notes, label: en_1.t.nav.notes, keys: '⌘7' },
    { route: routes_1.ROUTES.calendar, label: en_1.t.nav.calendar, keys: '⌘8' },
    { route: routes_1.ROUTES.guild, label: en_1.t.nav.guild, keys: null },
    { route: routes_1.ROUTES.hoard, label: en_1.t.nav.hoard, keys: null },
    { route: routes_1.ROUTES.library, label: en_1.t.nav.library, keys: null },
    { route: routes_1.ROUTES.settings, label: en_1.t.nav.settings, keys: '⌘,' },
];
var allQuests = function (view) { return __spreadArray(__spreadArray([], (0, board_1.rowsOf)(view.ready), true), (0, board_1.rowsOf)(view.sealed), true).map(function (row) { return row.quest; }); };
var questEntries = function (view, input) {
    var waiting = null;
    return allQuests(view).map(function (quest) {
        var _a;
        return entry({
            id: "quest:".concat(quest.id),
            section: 'quests',
            label: quest.title,
            also: (_a = quest.branch) !== null && _a !== void 0 ? _a : '',
            reason: quest.sealedBecause === null ? waiting : en_1.t.palette.sealed,
            run: function () { return input.onOpenQuest(quest.id); },
            start: quest.sealedBecause === null && waiting === null ? function () { return input.onStart(quest); } : null,
        });
    });
};
var suggestions = function (view, input) {
    var main = allQuests(view).find(function (quest) { return quest.isStar; });
    var newQuest = entry({ id: 'suggest:new', section: 'suggested', label: en_1.t.actions.newQuest, keys: '⌘N', run: function () { return input.onNewQuest(''); } });
    if (view.active !== null) {
        return [
            entry({ id: 'suggest:open', section: 'suggested', label: en_1.t.actions.openClaude, keys: '⌘↩', run: input.onOpenClaude }),
            entry({ id: 'suggest:finish', section: 'suggested', label: "".concat(en_1.t.actions.finish, " ").concat(view.active.title), keys: 'd', run: input.onFinish }),
            newQuest,
        ];
    }
    if (main === undefined)
        return [newQuest];
    return [entry({ id: 'suggest:start', section: 'suggested', label: en_1.t.actions.startNamed(main.title), keys: 's', run: function () { return input.onStart(main); } }), newQuest];
};
// The actions by name, found by typing, including those that can't run now.
var actions = function (view, input) {
    var noActive = view.active === null ? en_1.t.palette.noActive : null;
    var main = allQuests(view).find(function (quest) { return quest.isStar; });
    return [
        entry({
            id: 'action:start',
            section: 'actions',
            label: main === undefined ? en_1.t.actions.start : en_1.t.actions.startNamed(main.title),
            keys: 's',
            reason: main === undefined ? en_1.t.palette.nothingToStart : null,
            run: function () { return main !== undefined && input.onStart(main); },
        }),
        entry({ id: 'action:open', section: 'actions', label: en_1.t.actions.openClaude, keys: '⌘↩', reason: noActive, run: input.onOpenClaude }),
        entry({ id: 'action:finish', section: 'actions', label: en_1.t.actions.finish, keys: 'd', reason: noActive, run: input.onFinish }),
        entry({ id: 'action:back', section: 'actions', label: en_1.t.actions.back, keys: 'b', reason: noActive, run: input.onBack }),
        entry({ id: 'action:new-note', section: 'actions', label: en_1.t.notebook.newNote, keys: en_1.t.notebook.newNoteKeys, run: input.onNewNote }),
    ];
};
// The live notes, newest first, so equal matches keep that order; or one row
// saying they're still being read or couldn't be.
var noteEntries = function (input) {
    var notes = input.notes;
    if (notes.status === 'loading')
        return [entry({ id: 'notes:reading', section: 'notes', label: en_1.t.palette.readingNotes, isBusy: true, run: function () { } })];
    if (notes.status === 'failed')
        return [entry({ id: 'notes:failed', section: 'notes', label: en_1.t.palette.notesFailed, run: function () { return input.onGo(routes_1.ROUTES.notes); } })];
    var found = notes.data.notes
        .filter(function (note) { return !note.isArchived; })
        .sort(function (a, b) { return b.updated.localeCompare(a.updated); })
        .map(function (note) { return entry({ id: "note:".concat(note.id), section: 'notes', label: note.title, note: note, run: function () { return input.onOpenNote(note.id); }, start: function () { return input.onOpenNote(note.id); } }); });
    if (input.isRefreshingNotes)
        found.push(entry({ id: 'notes:refreshing', section: 'notes', label: en_1.t.palette.readingNotes, isBusy: true, run: function () { } }));
    if (input.notesProblem)
        found.push(entry({ id: 'notes:refresh-failed', section: 'notes', label: en_1.t.palette.notesRefreshFailed, run: function () { return input.onGo(routes_1.ROUTES.notes); } }));
    if (notes.data.unreadable.length > 0)
        found.push(entry({ id: 'notes:unreadable', section: 'notes', label: en_1.t.palette.notesUnreadable, run: function () { return input.onGo(routes_1.ROUTES.notes); } }));
    return found;
};
var creates = function (input) { return [
    entry({ id: 'create', section: 'create', label: '', run: function () { }, keys: '⌘N', fill: { label: en_1.t.palette.create, run: input.onNewQuest, start: null } }),
    entry({ id: 'create:jot', section: 'create', label: '', run: function () { }, fill: { label: en_1.t.palette.jot, run: function (words) { return input.onJot(words, false); }, start: function (words) { return input.onJot(words, true); } } }),
]; };
var paletteEntries = function (input) {
    var view = input.view, realms = input.realms, selected = input.selected;
    var others = realms.filter(function (row) { return row.key !== selected; });
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (view === null ? [] : __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], suggestions(view, input), true), questEntries(view, input), true), actions(view, input), true), noteEntries(input), true), creates(input), true)), true), GO_TO.map(function (place) { return entry({ id: "go:".concat(place.route), section: 'goto', label: place.label, keys: place.keys, run: function () { return input.onGo(place.route); } }); }), true), others.map(function (row) { return entry({ id: "realm:".concat(row.key), section: 'realms', label: row.name, run: function () { return input.onPickRealm(row.key); } }); }), true), [
        entry({ id: 'file:open', section: 'actions', label: en_1.t.firstRun.open, keys: '⌘O', run: input.onOpenFolder }),
    ], false);
};
exports.paletteEntries = paletteEntries;
// A quest's reason is about starting it, and opening it is always fine.
var canRun = function (item) { return !item.isBusy && (item.reason === null || item.section === 'quests'); };
exports.canRun = canRun;
var SECTION_ORDER = ['quests', 'actions', 'goto', 'realms', 'notes'];
// How well the words fit: from the start, then whole inside it, then letters in
// order. 0 is no match.
var matchScore = function (text, query) {
    var hay = text.toLowerCase();
    var needle = query.toLowerCase();
    if (hay.startsWith(needle))
        return 3;
    if (hay.includes(needle))
        return 2;
    var at = 0;
    for (var _i = 0, needle_1 = needle; _i < needle_1.length; _i++) {
        var letter = needle_1[_i];
        at = hay.indexOf(letter, at);
        if (at === -1)
            return 0;
        at += 1;
    }
    return 1;
};
exports.matchScore = matchScore;
// A note matches as Notes search does, every word in it, never by letters in
// order; its title fitting the words ranks it higher.
// shortcut: lower-cases every note on each key; keep a lower-cased copy per read if typing lags on a large vault.
var noteScore = function (note, words) {
    if (!(0, notes_view_1.matches)(note, words))
        return 0;
    var title = note.title.toLowerCase();
    var needle = words.toLowerCase();
    return title.startsWith(needle) ? 3 : title.includes(needle) ? 2 : 1;
};
var scoreOf = function (item, words) {
    return item.note !== null ? noteScore(item.note, words) : Math.max((0, exports.matchScore)(item.label, words), item.also === '' ? 0 : (0, exports.matchScore)(item.also, words));
};
// The line of a note's text holding the first word its title lacks, cut to
// PALETTE_SNIPPET letters around that word. Null when the title holds them all.
var snippetOf = function (note, query) {
    var title = note.title.toLowerCase();
    var word = query
        .toLowerCase()
        .split(/\s+/)
        .find(function (word) { return word !== '' && !word.startsWith('#') && !title.includes(word); });
    if (word === undefined)
        return null;
    var line = note.body
        .split('\n')
        .map(function (line) { return line.trim(); })
        .find(function (line) { return line.toLowerCase().includes(word); });
    if (line === undefined || line.length <= constants_1.PALETTE_SNIPPET)
        return line !== null && line !== void 0 ? line : null;
    var from = Math.max(0, Math.min(line.toLowerCase().indexOf(word) - 20, line.length - constants_1.PALETTE_SNIPPET));
    return "".concat(from > 0 ? '…' : '').concat(line.slice(from, from + constants_1.PALETTE_SNIPPET)).concat(from + constants_1.PALETTE_SNIPPET < line.length ? '…' : '');
};
exports.snippetOf = snippetOf;
var isStatus = function (item) { return item.section === 'notes' && item.note === null; };
// With nothing typed, the shortcuts; with words, what fits them, then whether
// the notes are still being read, then Create.
var filterPalette = function (entries, query) {
    var words = query.trim();
    if (words === '')
        return entries.filter(function (item) { return item.section === 'suggested' || item.section === 'goto' || item.section === 'realms'; });
    var ranked = entries
        .filter(function (item) { return item.section !== 'suggested' && item.section !== 'create' && !isStatus(item); })
        .map(function (item) { return ({ item: item, score: scoreOf(item, words) }); })
        .filter(function (_a) {
        var score = _a.score;
        return score > 0;
    })
        .sort(function (a, b) { return b.score - a.score; });
    // Sections go by their best match, so Return lands on the strongest entry
    // wherever it is, and ties keep the order sections are listed in.
    var bestIn = function (section) { var _a, _b; return (_b = (_a = ranked.find(function (_a) {
        var item = _a.item;
        return item.section === section;
    })) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 0; };
    var order = __spreadArray([], SECTION_ORDER, true).sort(function (a, b) { return bestIn(b) - bestIn(a); });
    var found = order.flatMap(function (section) {
        var inSection = ranked.filter(function (_a) {
            var item = _a.item;
            return item.section === section;
        }).map(function (_a) {
            var item = _a.item;
            return item;
        });
        return section === 'notes' ? inSection.slice(0, constants_1.PALETTE_NOTE_ROWS).map(function (item) { return (__assign(__assign({}, item), { detail: item.note === null ? null : (0, exports.snippetOf)(item.note, words) })); }) : inSection;
    });
    var made = entries.flatMap(function (item) {
        var fill = item.fill;
        if (item.section !== 'create' || fill === null)
            return [];
        var start = fill.start;
        return [__assign(__assign({}, item), { label: fill.label(words), run: function () { return fill.run(words); }, start: start === null ? null : function () { return start(words); } })];
    });
    return __spreadArray(__spreadArray(__spreadArray([], found, true), entries.filter(isStatus), true), made, true);
};
exports.filterPalette = filterPalette;
