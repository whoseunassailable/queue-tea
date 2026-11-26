"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryApi = void 0;
var time_1 = require("../../../../../hooks/shared/time/domain/services/time");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var library_1 = require("../domain/library");
var TITLE_LIMIT = 200;
var AUTHOR_LIMIT = 200;
var MOST_PAGES = 100000;
var isPageCount = function (value) { return Number.isInteger(value) && value >= 1 && value <= MOST_PAGES; };
var pageIn = function (value, total) {
    if (!Number.isInteger(value) || value < 0 || value > total)
        throw new reply_1.Refusal(messages_1.MESSAGES.badPage(total));
    return value;
};
var bookOf = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    var title = typeof v.title === 'string' ? v.title.trim() : '';
    if (title === '')
        throw new reply_1.Refusal(messages_1.MESSAGES.titleRequired);
    if (title.length > TITLE_LIMIT)
        throw new reply_1.Refusal(messages_1.MESSAGES.titleTooLong);
    if (!isPageCount(v.totalPages))
        throw new reply_1.Refusal(messages_1.MESSAGES.badTotalPages);
    var author = typeof v.author === 'string' ? v.author.trim().slice(0, AUTHOR_LIMIT) : '';
    return { title: title, author: author === '' ? null : author, totalPages: v.totalPages, page: pageIn(v.page, v.totalPages) };
};
// Books have nothing to do with any project, so they keep to a file of their
// own, beside the records and never in one. Every flavor of the app shares it.
var libraryApi = function (d) {
    var file = "".concat(d.home, "/.queue-tea/library.json");
    var today = function () { return (0, time_1.dayKey)(d.now(), d.offsetMinutes()); };
    var load = function () { return __awaiter(void 0, void 0, void 0, function () {
        var library, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, d.host.exists(file)];
                case 1:
                    if (!(_b.sent()))
                        return [2 /*return*/, (0, library_1.emptyLibrary)()];
                    _a = library_1.parseLibrary;
                    return [4 /*yield*/, d.host.read(file)];
                case 2:
                    library = _a.apply(void 0, [_b.sent()]);
                    // A file that doesn't read is left for you: it's your reading history.
                    if (library === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.brokenLibrary(file));
                    return [2 /*return*/, library];
            }
        });
    }); };
    var save = function (library) { return __awaiter(void 0, void 0, void 0, function () {
        var made, tmp, _a, _b, _c, moved;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, d.host.makeDirs("".concat(d.home, "/.queue-tea"))];
                case 1:
                    made = _d.sent();
                    if (made.exitCode !== 0)
                        throw new Error(made.stderr);
                    tmp = "".concat(file, ".tmp");
                    return [4 /*yield*/, d.host.write(tmp, JSON.stringify(library, null, 2))];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, d.host.exists(file)];
                case 3:
                    if (!_d.sent()) return [3 /*break*/, 6];
                    _b = (_a = d.host).write;
                    _c = ["".concat(file, ".bak")];
                    return [4 /*yield*/, d.host.read(file)];
                case 4: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [4 /*yield*/, d.host.move(tmp, file)];
                case 7:
                    moved = _d.sent();
                    if (moved.exitCode !== 0)
                        throw new Error(moved.stderr);
                    return [2 /*return*/];
            }
        });
    }); };
    // One change at a time, so two quick ones can't lose each other.
    var queue = Promise.resolve();
    var change = function (failure, work) {
        var run = queue.then(function () {
            return (0, reply_1.reply)(d.log, failure, function () { return __awaiter(void 0, void 0, void 0, function () {
                var next, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = work;
                            return [4 /*yield*/, load()];
                        case 1:
                            next = _a.apply(void 0, [_b.sent()]);
                            return [4 /*yield*/, save(next)];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, (0, library_1.libraryViewOf)(next, today())];
                    }
                });
            }); });
        });
        queue = run;
        return run;
    };
    var known = function (library, id) {
        var book = library.books.find(function (b) { return b.id === id; });
        if (book === undefined)
            throw new reply_1.Refusal(messages_1.MESSAGES.bookGone);
        return book;
    };
    return {
        readLibrary: function () { return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readLibrary, function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = library_1.libraryViewOf;
                    return [4 /*yield*/, load()];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), today()])];
            }
        }); }); }); },
        addBook: function (input) { return change(messages_1.MESSAGES.saveBook, function (library) { return (0, library_1.addBook)(library, bookOf(input), d.newId(), today()); }); },
        setBookPage: function (id, page) {
            return change(messages_1.MESSAGES.saveBook, function (library) {
                var book = known(library, id);
                return (0, library_1.setPage)(library, book.id, pageIn(page, book.totalPages), today());
            });
        },
        finishBook: function (id) { return change(messages_1.MESSAGES.saveBook, function (library) { return (0, library_1.finishBook)(library, known(library, id).id, today()); }); },
        removeBook: function (id) { return change(messages_1.MESSAGES.saveBook, function (library) { return (0, library_1.removeBook)(library, known(library, id).id); }); },
    };
};
exports.libraryApi = libraryApi;
