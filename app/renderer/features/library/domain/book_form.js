"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookOf = exports.validateBook = exports.pageError = exports.totalPagesError = exports.EMPTY_BOOK = void 0;
var en_1 = require("../../../l10n/en");
var quest_form_1 = require("../../quests/domain/quest_form");
var MOST_PAGES = 100000;
var WHOLE = /^\d+$/;
exports.EMPTY_BOOK = { title: '', author: '', totalPages: '', page: '' };
var totalPagesError = function (value) {
    var trimmed = value.trim();
    if (trimmed === '')
        return en_1.t.library.pagesRequired;
    return WHOLE.test(trimmed) && Number(trimmed) >= 1 && Number(trimmed) <= MOST_PAGES ? undefined : en_1.t.library.pagesBad;
};
exports.totalPagesError = totalPagesError;
var pageError = function (value, total) { return (WHOLE.test(value.trim()) && Number(value.trim()) <= total ? undefined : en_1.t.library.badPage(total)); };
exports.pageError = pageError;
// A book you haven't started has no page to give, so an empty one is 0. A page
// can only be judged against a total that reads.
var startError = function (form) { return (form.page.trim() === '' || (0, exports.totalPagesError)(form.totalPages) !== undefined ? undefined : (0, exports.pageError)(form.page, Number(form.totalPages.trim()))); };
var validateBook = function (form) {
    var errors = { title: (0, quest_form_1.titleError)(form.title), totalPages: (0, exports.totalPagesError)(form.totalPages), page: startError(form) };
    return Object.fromEntries(Object.entries(errors).filter(function (_a) {
        var error = _a[1];
        return error !== undefined;
    }));
};
exports.validateBook = validateBook;
var bookOf = function (form) { return ({
    title: form.title.trim(),
    author: form.author.trim() === '' ? null : form.author.trim(),
    totalPages: Number(form.totalPages.trim()),
    page: form.page.trim() === '' ? 0 : Number(form.page.trim()),
}); };
exports.bookOf = bookOf;
