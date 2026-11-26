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
exports.withoutReview = exports.withoutQuest = exports.withPlayNext = exports.withPriority = void 0;
var changeEntry = function (entry, change) {
    return entry.kind === 'quest' ? __assign(__assign({}, entry), { quest: change(entry.quest) }) : __assign(__assign({}, entry), { quest: change(entry.quest), chapters: entry.chapters.map(change) });
};
var changeQuests = function (view, change) { return (__assign(__assign({}, view), { ready: view.ready.map(function (entry) { return changeEntry(entry, change); }), sealed: view.sealed.map(function (entry) { return changeEntry(entry, change); }) })); };
var withPriority = function (id, priority) { return function (view) {
    return changeQuests(view, function (quest) { return (quest.id === id ? __assign(__assign({}, quest), { priority: priority }) : quest); });
}; };
exports.withPriority = withPriority;
var withPlayNext = function (id) { return function (view) {
    return changeQuests(view, function (quest) { return (quest.id === id ? __assign(__assign({}, quest), { isPlayNext: !quest.isPlayNext }) : __assign(__assign({}, quest), { isPlayNext: false })); });
}; };
exports.withPlayNext = withPlayNext;
var dropQuest = function (entries, id) {
    return entries
        .filter(function (entry) { return entry.quest.id !== id; })
        .map(function (entry) { return (entry.kind === 'saga' ? __assign(__assign({}, entry), { chapters: entry.chapters.filter(function (c) { return c.id !== id; }) }) : entry); });
};
var withoutQuest = function (id) { return function (view) { return (__assign(__assign({}, view), { ready: dropQuest(view.ready, id), sealed: dropQuest(view.sealed, id) })); }; };
exports.withoutQuest = withoutQuest;
var withoutReview = function (view, id) {
    var _a;
    if (id === void 0) { id = (_a = view.active) === null || _a === void 0 ? void 0 : _a.id; }
    return (__assign(__assign({}, view), { active: view.active !== null && view.active.id === id ? __assign(__assign({}, view.active), { review: null }) : view.active, activeQuests: view.activeQuests.map(function (q) { return q.id === id ? __assign(__assign({}, q), { review: null }) : q; }) }));
};
exports.withoutReview = withoutReview;
