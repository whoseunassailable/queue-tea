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
exports.libraryViewOf = exports.removeBook = exports.finishBook = exports.setPage = exports.addBook = exports.parseLibrary = exports.emptyLibrary = void 0;
var week_stats_1 = require("../../../../../hooks/shared/time/domain/services/week_stats");
var VERSION = 1;
var emptyLibrary = function () { return ({ version: VERSION, books: [] }); };
exports.emptyLibrary = emptyLibrary;
var isBook = function (value) {
    var book = value;
    return typeof (book === null || book === void 0 ? void 0 : book.id) === 'string' && typeof book.title === 'string' && typeof book.totalPages === 'number' && typeof book.firstPage === 'number' && typeof book.page === 'number' && Array.isArray(book.log);
};
var parseLibrary = function (text) {
    try {
        var parsed = JSON.parse(text);
        if ((parsed === null || parsed === void 0 ? void 0 : parsed.version) !== VERSION || !Array.isArray(parsed.books) || !parsed.books.every(isBook))
            return 'unreadable';
        return parsed;
    }
    catch (_a) {
        // Not JSON: the caller says so, and keeps the file as it is.
        return 'unreadable';
    }
};
exports.parseLibrary = parseLibrary;
var withEntry = function (log, day, page) { return __spreadArray(__spreadArray([], log.filter(function (entry) { return entry.day !== day; }), true), [{ day: day, page: page }], false); };
var addBook = function (library, input, id, today) { return (__assign(__assign({}, library), { books: __spreadArray(__spreadArray([], library.books, true), [
        {
            id: id,
            title: input.title,
            author: input.author,
            totalPages: input.totalPages,
            firstPage: input.page,
            page: input.page,
            started: today,
            finished: input.page >= input.totalPages ? today : null,
            log: [{ day: today, page: input.page }],
        },
    ], false) })); };
exports.addBook = addBook;
var changed = function (library, id, change) { return (__assign(__assign({}, library), { books: library.books.map(function (book) { return (book.id === id ? change(book) : book); }) })); };
// The last page finishes a book, and going back in one opens it again.
var setPage = function (library, id, page, today) {
    return changed(library, id, function (book) {
        var _a;
        return (__assign(__assign({}, book), { page: page, finished: page < book.totalPages ? null : ((_a = book.finished) !== null && _a !== void 0 ? _a : today), log: withEntry(book.log, today, page) }));
    });
};
exports.setPage = setPage;
var finishBook = function (library, id, today) { return changed(library, id, function (book) { return (__assign(__assign({}, book), { page: book.totalPages, finished: today, log: withEntry(book.log, today, book.totalPages) })); }); };
exports.finishBook = finishBook;
var removeBook = function (library, id) { return (__assign(__assign({}, library), { books: library.books.filter(function (book) { return book.id !== id; }) })); };
exports.removeBook = removeBook;
// The new pages each entry reached. Going back in a book isn't reading, and
// reading the same pages again isn't more of it.
var gainsOf = function (book) {
    var reached = book.firstPage;
    return __spreadArray([], book.log, true).sort(function (a, b) { return a.day.localeCompare(b.day); })
        .map(function (entry) {
        var pages = Math.max(0, entry.page - reached);
        reached = Math.max(reached, entry.page);
        return { day: entry.day, pages: pages };
    });
};
var libraryViewOf = function (library, today) {
    var week = (0, week_stats_1.weekOf)(today);
    var gains = library.books.flatMap(gainsOf);
    var count = function (isDay) { return gains.reduce(function (sum, gain) { return (isDay(gain.day) ? sum + gain.pages : sum); }, 0); };
    var finished = library.books.filter(function (book) { return book.finished !== null; }).sort(function (a, b) { var _a, _b; return ((_a = b.finished) !== null && _a !== void 0 ? _a : '').localeCompare((_b = a.finished) !== null && _b !== void 0 ? _b : ''); });
    return {
        reading: library.books.filter(function (book) { return book.finished === null; }),
        finished: finished,
        finishedCount: finished.length,
        // What you'd read before it came onto the shelf counts here, and only here.
        pagesRead: count(function () { return true; }) + library.books.reduce(function (sum, book) { return sum + book.firstPage; }, 0),
        pagesThisWeek: count(function (day) { return week.includes(day); }),
        pagesToday: count(function (day) { return day === today; }),
    };
};
exports.libraryViewOf = libraryViewOf;
