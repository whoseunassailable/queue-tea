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
var library_1 = require("./library");
var DAY = '2026-11-04'; // a Wednesday
var book = function (over) { return (__assign({ title: over.id, author: null, totalPages: 300, firstPage: 0, page: 0, started: '2026-11-01', finished: null, log: [] }, over)); };
var library = function () {
    var books = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        books[_i] = arguments[_i];
    }
    return ({ version: 1, books: books });
};
(0, vitest_1.describe)('adding a book', function () {
    (0, vitest_1.it)('starts reading at the page given', function () {
        var next = (0, library_1.addBook)((0, library_1.emptyLibrary)(), { title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 30 }, 'b-1', DAY);
        (0, vitest_1.expect)(next.books).toEqual([{ id: 'b-1', title: 'Dune', author: 'Frank Herbert', totalPages: 412, firstPage: 30, page: 30, started: DAY, finished: null, log: [{ day: DAY, page: 30 }] }]);
    });
    (0, vitest_1.it)('counts a book already read through as finished', function () {
        var _a;
        (0, vitest_1.expect)((_a = (0, library_1.addBook)((0, library_1.emptyLibrary)(), { title: 'Dune', author: null, totalPages: 412, page: 412 }, 'b-1', DAY).books[0]) === null || _a === void 0 ? void 0 : _a.finished).toBe(DAY);
    });
});
(0, vitest_1.describe)('reading on', function () {
    (0, vitest_1.it)('moves the page and logs the day', function () {
        var next = (0, library_1.setPage)(library(book({ id: 'a', page: 10 })), 'a', 40, DAY);
        (0, vitest_1.expect)(next.books[0]).toMatchObject({ page: 40, finished: null, log: [{ day: DAY, page: 40 }] });
    });
    (0, vitest_1.it)('keeps one entry a day, the latest', function () {
        var _a;
        var once = (0, library_1.setPage)(library(book({ id: 'a' })), 'a', 40, DAY);
        (0, vitest_1.expect)((_a = (0, library_1.setPage)(once, 'a', 60, DAY).books[0]) === null || _a === void 0 ? void 0 : _a.log).toEqual([{ day: DAY, page: 60 }]);
    });
    (0, vitest_1.it)('finishes a book on its last page', function () {
        var _a;
        (0, vitest_1.expect)((_a = (0, library_1.setPage)(library(book({ id: 'a' })), 'a', 300, DAY).books[0]) === null || _a === void 0 ? void 0 : _a.finished).toBe(DAY);
    });
    (0, vitest_1.it)('reopens a finished book when you go back in it', function () {
        var _a;
        (0, vitest_1.expect)((_a = (0, library_1.setPage)(library(book({ id: 'a', page: 300, finished: DAY })), 'a', 200, DAY).books[0]) === null || _a === void 0 ? void 0 : _a.finished).toBeNull();
    });
    (0, vitest_1.it)('leaves other books alone', function () {
        var other = book({ id: 'b', page: 5 });
        (0, vitest_1.expect)((0, library_1.setPage)(library(book({ id: 'a' }), other), 'a', 40, DAY).books[1]).toEqual(other);
    });
    (0, vitest_1.it)('finishing moves to the last page', function () {
        (0, vitest_1.expect)((0, library_1.finishBook)(library(book({ id: 'a', page: 10 })), 'a', DAY).books[0]).toMatchObject({ page: 300, finished: DAY });
    });
    (0, vitest_1.it)('removing leaves the rest', function () {
        (0, vitest_1.expect)((0, library_1.removeBook)(library(book({ id: 'a' }), book({ id: 'b' })), 'a').books.map(function (b) { return b.id; })).toEqual(['b']);
    });
});
(0, vitest_1.describe)('what the page shows', function () {
    (0, vitest_1.it)('splits reading from finished, the latest finished first', function () {
        var view = (0, library_1.libraryViewOf)(library(book({ id: 'r' }), book({ id: 'old', page: 300, finished: '2026-10-01' }), book({ id: 'new', page: 300, finished: '2026-11-01' })), DAY);
        (0, vitest_1.expect)(view.reading.map(function (b) { return b.id; })).toEqual(['r']);
        (0, vitest_1.expect)(view.finished.map(function (b) { return b.id; })).toEqual(['new', 'old']);
    });
    (0, vitest_1.it)('counts what was finished', function () {
        (0, vitest_1.expect)((0, library_1.libraryViewOf)(library(book({ id: 'a', page: 300, finished: DAY }), book({ id: 'b' })), DAY).finishedCount).toBe(1);
    });
    (0, vitest_1.it)('counts pages read in all, today and this week, not where you stood', function () {
        var view = (0, library_1.libraryViewOf)(library(book({
            id: 'a',
            page: 120,
            log: [
                { day: '2026-10-20', page: 50 },
                { day: '2026-11-02', page: 100 },
                { day: DAY, page: 120 },
            ],
        })), DAY);
        (0, vitest_1.expect)(view).toMatchObject({ pagesRead: 120, pagesThisWeek: 70, pagesToday: 20 });
    });
    (0, vitest_1.it)('doesn\'t call the pages you\'d read already today\'s reading', function () {
        var added = (0, library_1.addBook)((0, library_1.emptyLibrary)(), { title: 'Dune', author: null, totalPages: 412, page: 300 }, 'b-1', DAY);
        (0, vitest_1.expect)((0, library_1.libraryViewOf)(added, DAY)).toMatchObject({ pagesRead: 300, pagesThisWeek: 0, pagesToday: 0 });
    });
    (0, vitest_1.it)('counts on from the page a book came in at', function () {
        var added = (0, library_1.addBook)((0, library_1.emptyLibrary)(), { title: 'Dune', author: null, totalPages: 412, page: 300 }, 'b-1', DAY);
        (0, vitest_1.expect)((0, library_1.libraryViewOf)((0, library_1.setPage)(added, 'b-1', 320, DAY), DAY)).toMatchObject({ pagesRead: 320, pagesToday: 20 });
    });
    (0, vitest_1.it)('counts a book already read through as read, and none of it as today', function () {
        var added = (0, library_1.addBook)((0, library_1.emptyLibrary)(), { title: 'Dune', author: null, totalPages: 412, page: 412 }, 'b-1', DAY);
        (0, vitest_1.expect)((0, library_1.libraryViewOf)(added, DAY)).toMatchObject({ finishedCount: 1, pagesRead: 412, pagesToday: 0 });
    });
    (0, vitest_1.it)('doesn\'t count the same pages twice', function () {
        var view = (0, library_1.libraryViewOf)(library(book({ id: 'a', page: 120, log: [{ day: '2026-11-01', page: 100 }, { day: '2026-11-02', page: 50 }, { day: DAY, page: 120 }] })), DAY);
        (0, vitest_1.expect)(view).toMatchObject({ pagesRead: 120, pagesToday: 20 });
    });
    (0, vitest_1.it)('doesn\'t count going back as reading', function () {
        var view = (0, library_1.libraryViewOf)(library(book({ id: 'a', page: 50, log: [{ day: '2026-11-02', page: 100 }, { day: DAY, page: 50 }] })), DAY);
        (0, vitest_1.expect)(view.pagesToday).toBe(0);
    });
    (0, vitest_1.it)('is all zeroes for an empty shelf', function () {
        (0, vitest_1.expect)((0, library_1.libraryViewOf)((0, library_1.emptyLibrary)(), DAY)).toEqual({ reading: [], finished: [], finishedCount: 0, pagesRead: 0, pagesThisWeek: 0, pagesToday: 0 });
    });
});
(0, vitest_1.describe)('reading the file', function () {
    (0, vitest_1.it)('reads what it wrote', function () {
        var shelf = library(book({ id: 'a' }));
        (0, vitest_1.expect)((0, library_1.parseLibrary)(JSON.stringify(shelf))).toEqual(shelf);
    });
    vitest_1.it.each([
        ['not JSON', '{ nope'],
        ['no books', '{"version":1}'],
        ['a newer version', '{"version":2,"books":[]}'],
        ['books that aren\'t', '{"version":1,"books":[{"title":1}]}'],
    ])('refuses %s', function (_, text) {
        (0, vitest_1.expect)((0, library_1.parseLibrary)(text)).toBe('unreadable');
    });
});
