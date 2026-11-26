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
exports.partsOf = exports.filterEntries = exports.showsSection = exports.isFiltering = exports.hasFilters = exports.EMPTY_BOARD = void 0;
exports.EMPTY_BOARD = { search: '', filters: { priorities: [], difficulties: [], sections: [], onlySaga: false, fitsTime: false } };
var hasFilters = function (f) { return f.priorities.length > 0 || f.difficulties.length > 0 || f.sections.length > 0 || f.onlySaga || f.fitsTime; };
exports.hasFilters = hasFilters;
var isFiltering = function (view) { return view.search.trim() !== '' || (0, exports.hasFilters)(view.filters); };
exports.isFiltering = isFiltering;
var showsSection = function (f, section) { return f.sections.length === 0 || f.sections.includes(section); };
exports.showsSection = showsSection;
var matchesText = function (quest, words) { var _a; return words === '' || quest.title.toLowerCase().includes(words) || ((_a = quest.branch) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(words); };
var passes = function (quest, f, budget) {
    return (f.priorities.length === 0 || f.priorities.includes(quest.priority)) &&
        (f.difficulties.length === 0 || f.difficulties.includes(quest.difficulty)) &&
        (!f.fitsTime || budget === null || quest.estimateMinutes <= budget);
};
// What's left of the board. A saga stays for a chapter that matches, with only
// the chapters that do; when the saga itself matches it keeps them all.
var filterEntries = function (entries, view, activeSaga, budget) {
    var words = view.search.trim().toLowerCase();
    var filters = view.filters;
    var fits = function (quest) { return matchesText(quest, words) && passes(quest, filters, budget); };
    var inSaga = function (entry) { return !filters.onlySaga || entry.quest.title === activeSaga; };
    return entries.flatMap(function (entry) {
        if (!inSaga(entry))
            return [];
        if (entry.kind === 'quest')
            return fits(entry.quest) ? [entry] : [];
        if (fits(entry.quest))
            return [entry];
        var chapters = entry.chapters.filter(fits);
        return chapters.length === 0 ? [] : [__assign(__assign({}, entry), { chapters: chapters })];
    });
};
exports.filterEntries = filterEntries;
// A title split around the first match, for marking it.
var partsOf = function (title, search) {
    var words = search.trim().toLowerCase();
    var at = words === '' ? -1 : title.toLowerCase().indexOf(words);
    if (at === -1)
        return [{ text: title, isMatch: false }];
    var end = at + words.length;
    var parts = [
        { text: title.slice(0, at), isMatch: false },
        { text: title.slice(at, end), isMatch: true },
        { text: title.slice(end), isMatch: false },
    ];
    return parts.filter(function (part) { return part.text !== ''; });
};
exports.partsOf = partsOf;
