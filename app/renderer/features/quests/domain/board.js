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
exports.stepFrom = exports.openRow = exports.metaOf = exports.withWholeSagas = exports.rowsOf = void 0;
var format_1 = require("../../../core/domain/format");
var en_1 = require("../../../l10n/en");
var plain = function (quest, isChapter) { return ({ quest: quest, isChapter: isChapter, sagaOf: null, isFolded: false, foldedStar: null }); };
// The board as one list: a saga, then its chapters directly under it unless
// it is folded.
var rowsOf = function (entries, folded) {
    if (folded === void 0) { folded = []; }
    return entries.flatMap(function (entry) {
        var _a;
        if (entry.kind === 'quest')
            return [plain(entry.quest, false)];
        var isFolded = folded.includes(entry.quest.id);
        var saga = { quest: entry.quest, isChapter: false, sagaOf: entry, isFolded: isFolded, foldedStar: isFolded ? ((_a = entry.chapters.find(function (c) { return c.isStar; })) !== null && _a !== void 0 ? _a : null) : null };
        return isFolded ? [saga] : __spreadArray([saga], entry.chapters.map(function (chapter) { return plain(chapter, true); }), true);
    });
};
exports.rowsOf = rowsOf;
// A narrowed board keeps a saga with only the chapters that matched. What's said
// about the saga itself still has to be about all of it.
var withWholeSagas = function (rows, view) {
    var whole = __spreadArray(__spreadArray([], view.ready, true), view.sealed, true);
    return rows.map(function (row) {
        var saga = row.sagaOf === null ? undefined : whole.find(function (entry) { return entry.quest.id === row.quest.id; });
        return (saga === null || saga === void 0 ? void 0 : saga.kind) === 'saga' ? __assign(__assign({}, row), { sagaOf: saga }) : row;
    });
};
exports.withWholeSagas = withWholeSagas;
var metaOf = function (entry) {
    var quest = entry.quest, sagaOf = entry.sagaOf;
    var difficulty = en_1.t.difficulty[quest.difficulty];
    var estimate = (0, format_1.formatSpan)(quest.estimateMinutes);
    var waited = (0, format_1.formatAge)(quest.waitedMs);
    if (sagaOf !== null)
        return en_1.t.quest.sagaMeta(sagaOf.progress.done, sagaOf.progress.total, difficulty, estimate, waited);
    return quest.sealedBecause === null ? en_1.t.quest.meta(difficulty, estimate, waited) : "\u2298 ".concat(quest.sealedBecause);
};
exports.metaOf = metaOf;
// The quest the detail pane opens on: the one picked, else the ★, else the first.
var openRow = function (rows, picked) { var _a, _b, _c; return (_c = (_b = (_a = rows.find(function (r) { return r.quest.id === picked; })) !== null && _a !== void 0 ? _a : rows.find(function (r) { return r.quest.isStar; })) !== null && _b !== void 0 ? _b : rows[0]) !== null && _c !== void 0 ? _c : null; };
exports.openRow = openRow;
// The row after or before the open one, staying on the first or last.
var stepFrom = function (rows, openId, step) {
    var _a;
    var at = rows.findIndex(function (r) { return r.quest.id === openId; });
    return (_a = rows[Math.max(0, Math.min(rows.length - 1, at === -1 ? 0 : at + step))]) !== null && _a !== void 0 ? _a : null;
};
exports.stepFrom = stepFrom;
