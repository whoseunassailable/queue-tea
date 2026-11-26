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
exports.noteText = exports.parseNote = void 0;
var notes_1 = require("../../../../shared/notes");
var OWNED = ['title', 'folder', 'type', 'pinned', 'tags', 'created', 'updated', 'archived', 'quests', 'aliases'];
var jsonOr = function (text) {
    try {
        return JSON.parse(text);
    }
    catch (_a) {
        // Not JSON: a plain YAML value, such as Obsidian writes. The text is the value.
        return text.replace(/^(['"])(.*)\1$/, '$2');
    }
};
var textOf = function (value, most) { return (typeof value === 'string' ? value.trim().slice(0, most) : ''); };
var tagsOf = function (value) {
    var raw = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
    var tags = raw.map(function (tag) { return (0, notes_1.cleanTag)(textOf(tag, notes_1.NOTE_LIMITS.tag)); }).filter(function (tag) { return tag !== ''; });
    return __spreadArray([], new Set(tags), true).slice(0, notes_1.NOTE_LIMITS.tags);
};
var questsOf = function (value) {
    // shortcut: a quests line that isn't Queue-tea's JSON reads as none and is rewritten on the next save; upgrade if other tools start writing it.
    return Array.isArray(value)
        ? value.filter(function (q) { return typeof (q === null || q === void 0 ? void 0 : q.id) === 'string' && (q.item === null || typeof q.item === 'string'); }).map(function (q) { return ({ id: q.id, item: q.item }); })
        : [];
};
var parseNote = function (raw, name, fileTime) {
    var text = raw.replace(/\r\n/g, '\n');
    var lines = text.split('\n');
    var end = lines[0] === '---' ? lines.indexOf('---', 1) : -1;
    var found = {};
    var rest = [];
    for (var i = 1; i < end; i += 1) {
        var line = lines[i];
        var m = /^([A-Za-z_][\w-]*):\s?(.*)$/.exec(line);
        var key = m === null || m === void 0 ? void 0 : m[1];
        if (m === null || key === undefined || !OWNED.includes(key) || (key === 'type' && (0, notes_1.noteTypeOf)(jsonOr(m[2].trim())) === null)) {
            rest.push(line);
            continue;
        }
        // A YAML list under the key: "tags:" then "  - idea" lines.
        if (m[2].trim() === '') {
            var items = [];
            while (i + 1 < end && /^\s+-\s/.test(lines[i + 1]))
                items.push(lines[++i].replace(/^\s+-\s+/, ''));
            found[key] = items.map(jsonOr);
        }
        else
            found[key] = jsonOr(m[2].trim());
    }
    var title = textOf(found.title, notes_1.NOTE_LIMITS.title) || name;
    var aliases = (Array.isArray(found.aliases) ? found.aliases : typeof found.aliases === 'string' ? [found.aliases] : []).map(function (alias) { return textOf(alias, notes_1.NOTE_LIMITS.title); }).filter(function (alias) { return alias !== '' && alias !== title; });
    return {
        title: title,
        folder: textOf(found.folder, notes_1.NOTE_LIMITS.folder) || notes_1.INBOX,
        type: (0, notes_1.noteTypeOf)(found.type),
        isPinned: found.pinned === true || found.pinned === 'true',
        tags: tagsOf(found.tags),
        created: textOf(found.created, 40) || fileTime,
        updated: textOf(found.updated, 40) || fileTime,
        isArchived: found.archived === true || found.archived === 'true',
        quests: questsOf(found.quests),
        aliases: __spreadArray([], new Set(aliases), true),
        body: end === -1 ? text : lines.slice(end + 1).join('\n'),
        rest: rest,
    };
};
exports.parseNote = parseNote;
// The rest without a type line, and the list under it, once Queue-tea writes its own.
var withoutType = function (rest) {
    var isType = false;
    return rest.filter(function (line) {
        isType = /^type:/.test(line) || (isType && /^\s/.test(line));
        return !isType;
    });
};
var noteText = function (note) {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
        '---',
        "title: ".concat(JSON.stringify(note.title)),
        "folder: ".concat(JSON.stringify(note.folder))
    ], (note.type === null ? [] : ["type: ".concat(JSON.stringify(note.type))]), true), (note.isPinned ? ['pinned: true'] : []), true), [
        "tags: ".concat(JSON.stringify(note.tags)),
        "created: ".concat(JSON.stringify(note.created)),
        "updated: ".concat(JSON.stringify(note.updated)),
        "archived: ".concat(note.isArchived),
        "quests: ".concat(JSON.stringify(note.quests)),
        "aliases: ".concat(JSON.stringify(__spreadArray([note.title], note.aliases.filter(function (alias) { return alias !== note.title; }), true)))
    ], false), (note.type === null ? note.rest : withoutType(note.rest)), true), [
        '---',
        note.body,
    ], false).join('\n');
};
exports.noteText = noteText;
