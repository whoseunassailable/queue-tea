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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var library_api_1 = require("./library_api");
var NOW = Date.parse('2026-11-04T12:00:00Z');
var DUNE = { title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 0 };
var home;
var file;
var ids;
var api;
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var refused = function (answer) {
    if (answer.ok)
        throw new Error('should be refused');
    return answer.error.message;
};
var onDisk = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-library-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                file = (0, node_path_1.join)(home, '.queue-tea/library.json');
                ids = 0;
                log = (0, logger_1.createLogger)('dev', function () { });
                api = (0, library_api_1.libraryApi)({ host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }), home: home, now: function () { return NOW; }, offsetMinutes: function () { return 60; }, log: log, newId: function () { return "b-".concat((ids += 1)); } });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('the shelf', function () {
    (0, vitest_1.it)('starts empty, and writes nothing to find that out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readLibrary()];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toMatchObject({ reading: [], finished: [] });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readFile)(file, 'utf8')).rejects.toThrow()];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a book in its own file, outside every record', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.addBook(DUNE)];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 2:
                    _b.apply(void 0, [(_c.sent()).books[0]]).toMatchObject({ title: 'Dune', totalPages: 412 });
                    (0, vitest_1.expect)(file.includes('/projects/')).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads back what it saved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.addBook(DUNE)];
                case 1:
                    _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.readLibrary()];
                case 2:
                    _b.apply(void 0, [_c.apply(void 0, [_d.sent()]).reading.map(function (b) { return b.title; })]).toEqual(['Dune']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves a copy of the last good file, and no temp file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.addBook(DUNE)];
                case 1:
                    _a.apply(void 0, [_d.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.addBook(__assign(__assign({}, DUNE), { title: 'Second' }))];
                case 2:
                    _b.apply(void 0, [_d.sent()]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(home, '.queue-tea'))];
                case 3:
                    _c.apply(void 0, [(_d.sent()).sort()]).toEqual(['library.json', 'library.json.bak']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes two saves at once without losing either', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([api.addBook(DUNE), api.addBook(__assign(__assign({}, DUNE), { title: 'Second' }))])];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).books]).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('checking a book', function () {
    vitest_1.it.each([
        ['no title', __assign(__assign({}, DUNE), { title: '   ' }), 'Title is required.'],
        ['a title too long', __assign(__assign({}, DUNE), { title: 'x'.repeat(201) }), 'Title must be 200 characters or fewer.'],
        ['no pages', __assign(__assign({}, DUNE), { totalPages: 0 }), 'Total pages must be a whole number from 1 to 100,000.'],
        ['part of a page', __assign(__assign({}, DUNE), { totalPages: 10.5 }), 'Total pages must be a whole number from 1 to 100,000.'],
        ['a page past the end', __assign(__assign({}, DUNE), { page: 413 }), 'Enter a page from 0 to 412.'],
        ['a page before the start', __assign(__assign({}, DUNE), { page: -1 }), 'Enter a page from 0 to 412.'],
    ])('refuses %s', function (_, input, message) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.addBook(input)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(message);
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readFile)(file, 'utf8')).rejects.toThrow()];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps no empty author', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.addBook(__assign(__assign({}, DUNE), { author: '   ' }))];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 2:
                    _b.apply(void 0, [(_c.sent()).books[0].author]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses something that isn\'t a book at all', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.addBook(null)];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('reading on', function () {
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.addBook(DUNE)];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves the page', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.setBookPage('b-1', 100)];
                case 1:
                    _a.apply(void 0, [(_c = _b.apply(void 0, [_d.sent()]).reading[0]) === null || _c === void 0 ? void 0 : _c.page]).toBe(100);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a page past the end, naming the end', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.setBookPage('b-1', 500)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe('Enter a page from 0 to 412.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 2:
                    _c.apply(void 0, [(_d.sent()).books[0].page]).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('finishes a book', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.finishBook('b-1')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).finished.map(function (b) { return b.title; })]).toEqual(['Dune']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('removes a book', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.removeBook('b-1')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).reading]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a book it doesn\'t know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.setBookPage('nope', 1)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_g.sent()])]).toBe("That book isn't on the shelf any more.");
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.finishBook('nope')];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_g.sent()])]).toBe("That book isn't on the shelf any more.");
                    _e = vitest_1.expect;
                    _f = refused;
                    return [4 /*yield*/, api.removeBook('nope')];
                case 3:
                    _e.apply(void 0, [_f.apply(void 0, [_g.sent()])]).toBe("That book isn't on the shelf any more.");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a file that doesn\'t read', function () {
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea'), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, '{ broken')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readLibrary()];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toContain("can't be read");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never overwrites it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.addBook(DUNE)];
                case 1:
                    _a.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe('{ broken');
                    return [2 /*return*/];
            }
        });
    }); });
});
