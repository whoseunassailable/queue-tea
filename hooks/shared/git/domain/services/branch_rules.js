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
exports.parseStatusPaths = exports.parseShortstat = exports.slugBranch = exports.branchSlug = exports.holdReason = exports.parseStatus = void 0;
// `git status --porcelain=v2 --branch`: the `#` lines describe the branch,
// every other line is one uncommitted file, untracked included.
var parseStatus = function (text) {
    var _a, _b, _c;
    var branch = null;
    var isDetached = false;
    var head = null;
    var hasUpstream = false;
    var unpushed = 0;
    var uncommitted = 0;
    for (var _i = 0, _d = text.split('\n'); _i < _d.length; _i++) {
        var line = _d[_i];
        if (line === '')
            continue;
        if (!line.startsWith('# ')) {
            uncommitted += 1;
            continue;
        }
        var _e = (_a = line.match(/^# (\S+) ?(.*)$/)) !== null && _a !== void 0 ? _a : [], key = _e[1], _f = _e[2], value = _f === void 0 ? '' : _f;
        if (key === 'branch.oid')
            head = value === '(initial)' ? null : value.slice(0, 7);
        if (key === 'branch.head') {
            isDetached = value === '(detached)';
            branch = isDetached ? null : value;
        }
        if (key === 'branch.upstream')
            hasUpstream = true;
        if (key === 'branch.ab')
            unpushed = Number((_c = (_b = value.match(/^\+(\d+)/)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : 0);
    }
    return { branch: branch, isDetached: isDetached, head: head, uncommitted: uncommitted, unpushed: unpushed, hasUpstream: hasUpstream };
};
exports.parseStatus = parseStatus;
var count = function (n, one, many) { return "".concat(n, " ").concat(n === 1 ? one : many); };
// What keeps a task from starting, in plain words; null when nothing does.
var holdReason = function (g) {
    if (!g.isRepo)
        return null;
    if (g.isDetached)
        return 'Detached HEAD: check out a branch first';
    var parts = [
        g.uncommitted > 0 ? "".concat(count(g.uncommitted, 'file', 'files'), " not committed") : null,
        g.hasUpstream && g.unpushed > 0 ? "".concat(count(g.unpushed, 'commit', 'commits'), " not pushed") : null,
    ].filter(function (part) { return part !== null; });
    if (parts.length > 0)
        return parts.join(' · ');
    // A branch never pushed holds a task only when it has commits no remote has.
    if (!g.hasUpstream && g.unpushed > 0)
        return 'This branch has never been pushed';
    return null;
};
exports.holdReason = holdReason;
// Words a branch name does without.
var FILLER = new Set(('a an the and or but nor of to for from in into on onto at by with without via as about than ' +
    'is are was were be been being it its this that these those there here ' +
    'i me my we us our you your he she they them their ' +
    'please pls can could would should will shall must may might need needs want wants let lets ' +
    'just also so then now some any all very really maybe still again ' +
    'make makes making get gets getting do does doing go going see try tell through').split(' '));
var SLUG_LENGTH = 30;
var SLUG_WORDS = 4;
// A branch's short name from a task title: up to four of its meaningful
// words, in order, at most 30 characters, without links, ports, filler
// words and punctuation. The same title always gives the same name.
var branchSlug = function (title) {
    var _a, _b;
    var words = title
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S*/g, ' ')
        .replace(/\bwww\.\S+/g, ' ')
        .replace(/\b(?:localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?/g, ' ')
        .replace(/:\d{2,5}\b/g, ' ')
        .replace(/\bports?\s*#?\d{2,5}\b/g, ' ')
        .split(/[^a-z0-9]+/)
        .filter(function (w) { return w !== ''; });
    var meaningful = words.filter(function (w) { return !FILLER.has(w) && (w.length > 1 || /\d/.test(w)); });
    var pool = meaningful.length > 0 ? meaningful : words;
    // A word that would run past the length is passed over for a later one.
    var picked = [];
    for (var _i = 0, pool_1 = pool; _i < pool_1.length; _i++) {
        var word = pool_1[_i];
        if (picked.length === SLUG_WORDS)
            break;
        if (__spreadArray(__spreadArray([], picked, true), [word], false).join('-').length <= SLUG_LENGTH)
            picked.push(word);
    }
    if (picked.length > 0)
        return picked.join('-');
    return (_b = (_a = pool[0]) === null || _a === void 0 ? void 0 : _a.slice(0, SLUG_LENGTH)) !== null && _b !== void 0 ? _b : 'task';
};
exports.branchSlug = branchSlug;
// `task/<short name>`; a name taken by another branch gets -2, -3 and so on.
var slugBranch = function (title, taken) {
    var base = "task/".concat((0, exports.branchSlug)(title));
    if (!taken.includes(base))
        return base;
    var n = 2;
    while (taken.includes("".concat(base, "-").concat(n)))
        n += 1;
    return "".concat(base, "-").concat(n);
};
exports.slugBranch = slugBranch;
var parseShortstat = function (text) {
    var _a, _b, _c, _d, _e, _f;
    return ({
        filesTouched: Number((_b = (_a = text.match(/(\d+) files? changed/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0),
        linesAdded: Number((_d = (_c = text.match(/(\d+) insertions?\(\+\)/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 0),
        linesRemoved: Number((_f = (_e = text.match(/(\d+) deletions?\(-\)/)) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : 0),
    });
};
exports.parseShortstat = parseShortstat;
// The paths `git status --porcelain=v2` lists as not committed, untracked
// included; a renamed file by its new path.
var parseStatusPaths = function (text) {
    return text
        .split('\n')
        .filter(function (line) { return line !== '' && !line.startsWith('# '); })
        .map(function (line) {
        var fields = line.split(' ');
        if (line.startsWith('1 '))
            return fields.slice(8).join(' ');
        if (line.startsWith('2 '))
            return fields.slice(9).join(' ').split('\t')[0];
        if (line.startsWith('u '))
            return fields.slice(10).join(' ');
        return line.slice(2);
    });
};
exports.parseStatusPaths = parseStatusPaths;
