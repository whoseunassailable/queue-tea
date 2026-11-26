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
var vitest_1 = require("vitest");
var en_1 = require("../../../l10n/en");
var book_form_1 = require("./book_form");
var FORM = __assign(__assign({}, book_form_1.EMPTY_BOOK), { title: 'Dune', totalPages: '412' });
(0, vitest_1.describe)('total pages', function () {
    vitest_1.it.each(['1', '412', '100000', ' 412 '])('takes %s', function (value) {
        (0, vitest_1.expect)((0, book_form_1.totalPagesError)(value)).toBeUndefined();
    });
    (0, vitest_1.it)('is required', function () {
        (0, vitest_1.expect)((0, book_form_1.totalPagesError)('  ')).toBe(en_1.t.library.pagesRequired);
    });
    vitest_1.it.each(['0', 'lots', '12.5', '-3', '100001'])('refuses %s', function (value) {
        (0, vitest_1.expect)((0, book_form_1.totalPagesError)(value)).toBe(en_1.t.library.pagesBad);
    });
});
(0, vitest_1.describe)('the page reached', function () {
    vitest_1.it.each(['0', '100', '412'])('takes %s of 412', function (value) {
        (0, vitest_1.expect)((0, book_form_1.pageError)(value, 412)).toBeUndefined();
    });
    vitest_1.it.each(['413', 'ten', '1.5', '-1', ''])('refuses "%s", naming the end', function (value) {
        (0, vitest_1.expect)((0, book_form_1.pageError)(value, 412)).toBe(en_1.t.library.badPage(412));
    });
});
(0, vitest_1.describe)('a whole book', function () {
    (0, vitest_1.it)('passes with a title and a total', function () {
        (0, vitest_1.expect)((0, book_form_1.validateBook)(FORM)).toEqual({});
    });
    (0, vitest_1.it)('says everything that\'s wrong at once', function () {
        (0, vitest_1.expect)((0, book_form_1.validateBook)(book_form_1.EMPTY_BOOK)).toEqual({ title: en_1.t.form.titleRequired, totalPages: en_1.t.library.pagesRequired });
    });
    (0, vitest_1.it)('checks the page against the total', function () {
        (0, vitest_1.expect)((0, book_form_1.validateBook)(__assign(__assign({}, FORM), { page: '413' }))).toEqual({ page: en_1.t.library.badPage(412) });
    });
    (0, vitest_1.it)('leaves the page alone until the total reads', function () {
        (0, vitest_1.expect)((0, book_form_1.validateBook)(__assign(__assign({}, FORM), { totalPages: 'lots', page: '5' }))).toEqual({ totalPages: en_1.t.library.pagesBad });
    });
    (0, vitest_1.it)('reads a blank page as not started, and a blank author as none', function () {
        (0, vitest_1.expect)((0, book_form_1.bookOf)(__assign(__assign({}, FORM), { author: '  ' }))).toEqual({ title: 'Dune', author: null, totalPages: 412, page: 0 });
    });
    (0, vitest_1.it)('trims what it keeps', function () {
        (0, vitest_1.expect)((0, book_form_1.bookOf)({ title: ' Dune ', author: ' Frank Herbert ', totalPages: ' 412 ', page: ' 30 ' })).toEqual({ title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 30 });
    });
});
