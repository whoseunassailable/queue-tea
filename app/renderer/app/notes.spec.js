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
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var notes_1 = require("../../shared/notes");
var workspace_store_1 = require("../features/workspace/state_management/workspace_store");
var en_1 = require("../l10n/en");
var test_support_1 = require("../test_support");
var app_1 = require("./app");
// The graph is laid out at once, with no worker: the centre (or the first note
// for the whole realm) at (0, 0), and the others, by id, at (100, 0),
// (-100, 0), (0, 100) and (0, -100). Every layout asked for is kept, newest last.
var layouts = vitest_1.vi.hoisted(function () { return []; });
vitest_1.vi.mock('../features/notes/presentation/state_management/graph_layout', function () { return __awaiter(void 0, void 0, void 0, function () {
    var actual, spots, workerLayout;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vitest_1.vi.importActual('../features/notes/presentation/state_management/graph_layout')];
            case 1:
                actual = _a.sent();
                spots = [{ x: 100, y: 0 }, { x: -100, y: 0 }, { x: 0, y: 100 }, { x: 0, y: -100 }];
                workerLayout = function (input) {
                    var _a;
                    layouts.push(input);
                    var centre = (_a = input.centre) !== null && _a !== void 0 ? _a : input.ids[0];
                    var others = input.ids.filter(function (id) { return id !== centre; }).sort();
                    var points = new Map(__spreadArray([[centre, { x: 0, y: 0 }]], others.map(function (id, i) { var _a; return [id, (_a = spots[i]) !== null && _a !== void 0 ? _a : { x: 0, y: 100 * i }]; }), true));
                    return { done: Promise.resolve(points), cancel: function () { } };
                };
                return [2 /*return*/, __assign(__assign({}, actual), { workerLayout: workerLayout })];
        }
    });
}); });
var KEY = 'a-000001';
var FOLDER = '/Users/me/.queue-tea/notes/a-000001';
var ok = function (data) { return ({ ok: true, data: data }); };
var never = function () { return new Promise(function () { }); };
// The notes a test works on, changed as main would change them.
var memoryNotes = function (start) {
    var notes = start;
    var n = 0;
    var view = function () { return ({ notes: notes, unreadable: [], folder: FOLDER }); };
    return {
        readNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ok(view())];
        }); }); }),
        createNote: vitest_1.vi.fn(function (_key, input) { return __awaiter(void 0, void 0, void 0, function () {
            var made;
            return __generator(this, function (_a) {
                n += 1;
                made = (0, test_support_1.note)(__assign(__assign({ id: "n-new".concat(n) }, input), { stamp: "new-".concat(n), updated: '2026-11-07T12:00:00+01:00' }));
                notes = __spreadArray([made], notes, true);
                return [2 /*return*/, ok({ view: view(), id: made.id })];
            });
        }); }),
        saveNote: vitest_1.vi.fn(function (_key, id, change) { return __awaiter(void 0, void 0, void 0, function () {
            var saved;
            return __generator(this, function (_a) {
                n += 1;
                saved = __assign(__assign(__assign({}, notes.find(function (one) { return one.id === id; })), change), { stamp: "s-".concat(n) });
                notes = notes.map(function (one) { return (one.id === id ? saved : one); });
                return [2 /*return*/, ok({ kind: 'saved', view: view(), note: saved, relinked: 0 })];
            });
        }); }),
        archiveNote: vitest_1.vi.fn(function (_key, id, isArchived) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                notes = notes.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { isArchived: isArchived, stamp: "a-".concat(id) }) : one); });
                return [2 /*return*/, ok(view())];
            });
        }); }),
        renameFolder: vitest_1.vi.fn(function (_key, from, to) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                n += 1;
                notes = notes.map(function (one) { return (one.folder === from ? __assign(__assign({}, one), { folder: to, stamp: "r-".concat(n, "-").concat(one.id) }) : one); });
                return [2 /*return*/, ok(view())];
            });
        }); }),
        deleteNote: vitest_1.vi.fn(function (_key, id) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                notes = notes.filter(function (one) { return one.id !== id; });
                return [2 /*return*/, ok(view())];
            });
        }); }),
        fileNoteQuests: vitest_1.vi.fn(function (key, id, proposal) { return __awaiter(void 0, void 0, void 0, function () {
            var parent;
            return __generator(this, function (_a) {
                parent = proposal.parent.kind === 'new' && !notes.find(function (one) { return one.id === id; }).quests.some(function (q) { return q.item === null; }) ? [{ id: 't-parent', item: null }] : [];
                notes = notes.map(function (one) { return (one.id === id ? __assign(__assign({}, one), { quests: __spreadArray(__spreadArray(__spreadArray([], one.quests, true), parent, true), proposal.quests.map(function (q) { return ({ id: "t-".concat(q.item), item: q.item }); }), true), stamp: "filed-".concat(one.quests.length) }) : one); });
                return [2 /*return*/, ok({ view: view(), project: (0, test_support_1.projectView)(key, { ready: proposal.quests.map(function (q) { return ({ kind: 'quest', quest: (0, test_support_1.quest)({ id: "t-".concat(q.item), title: q.title }) }); }) }) })];
            });
        }); }),
    };
};
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var engine, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.location.hash = '#/notes';
                    engine = (0, test_support_1.fakeEngine)(over).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                                        return [4 /*yield*/, workspace.start()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, engine];
            }
        });
    });
};
var press = function (name) { return (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: name }))];
}); }); }); };
var body = function () { return preact_1.screen.getByLabelText(en_1.t.notebook.body, { selector: 'textarea' }); };
var write = function (text) {
    var box = body();
    box.focus();
    preact_1.fireEvent.input(box, { target: { value: text, selectionStart: text.length, selectionEnd: text.length } });
};
var brewTransfer = function () {
    var data = new Map();
    return {
        get types() { return __spreadArray([], data.keys(), true); },
        files: [],
        effectAllowed: 'uninitialized',
        dropEffect: 'none',
        setData: function (type, value) { return data.set(type, value); },
        getData: function (type) { var _a; return (_a = data.get(type)) !== null && _a !== void 0 ? _a : ''; },
    };
};
var dragBrew = function () {
    var dataTransfer = brewTransfer();
    var robot = preact_1.screen.getByLabelText('Drag BrewQuest onto a note');
    preact_1.fireEvent.dragStart(robot, { dataTransfer: dataTransfer });
    return { robot: robot, dataTransfer: dataTransfer };
};
(0, vitest_1.afterEach)(function () {
    (0, preact_1.cleanup)();
    vitest_1.vi.useRealTimers();
    window.innerWidth = 1280;
});
(0, vitest_1.describe)('the Notes page', function () {
    (0, vitest_1.it)('pages a large list, keeps a keyboard entry on each page, and searches beyond that page', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, list, entry;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    notes = Array.from({ length: 205 }, function (_, i) { return (0, test_support_1.note)({ id: "n-".concat(i), title: "Idea ".concat(i), body: i === 204 ? 'A hidden needle' : '' }); });
                    return [4 /*yield*/, open(memoryNotes(notes))];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Idea 0')];
                case 2:
                    _d.sent();
                    list = preact_1.screen.getByRole('navigation', { name: 'Notes' });
                    (0, vitest_1.expect)(list.querySelectorAll('.nt-item')).toHaveLength(100);
                    return [4 /*yield*/, press('Next notes')];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(list.querySelectorAll('.nt-item')).toHaveLength(100);
                    entry = list.querySelector('.nt-item[tabindex="0"]');
                    (0, vitest_1.expect)(entry.textContent).toContain('Idea 100');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(document.activeElement).toBe(entry); })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(entry, { key: 'ArrowDown' })];
                        }); }); })];
                case 5:
                    _d.sent();
                    (0, vitest_1.expect)((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.textContent).toContain('Idea 101');
                    return [4 /*yield*/, press('Next notes')];
                case 6:
                    _d.sent();
                    (0, vitest_1.expect)(list.querySelectorAll('.nt-item')).toHaveLength(5);
                    return [4 /*yield*/, press('Previous notes')];
                case 7:
                    _d.sent();
                    (0, vitest_1.expect)(list.querySelectorAll('.nt-item')).toHaveLength(100);
                    (0, vitest_1.expect)((_b = list.querySelector('.nt-item')) === null || _b === void 0 ? void 0 : _b.textContent).toContain('Idea 100');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(preact_1.screen.getByLabelText(en_1.t.notebook.search), { target: { value: 'needle' } })];
                        }); }); })];
                case 8:
                    _d.sent();
                    (0, vitest_1.expect)(list.querySelectorAll('.nt-item')).toHaveLength(1);
                    (0, vitest_1.expect)((0, preact_1.within)(list).getByRole('button', { name: /^Idea 204/ })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(list).queryByRole('button', { name: 'Next notes' })).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(preact_1.screen.getByLabelText(en_1.t.notebook.search), { target: { value: '' } })];
                        }); }); })];
                case 9:
                    _d.sent();
                    (0, vitest_1.expect)((_c = list.querySelector('.nt-item')) === null || _c === void 0 ? void 0 : _c.textContent).toContain('Idea 0');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('History shows loading, an empty history, and returns focus when closed with Esc', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readNoteHistory, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    readNoteHistory = vitest_1.vi.fn().mockImplementationOnce(never).mockResolvedValue(ok([]));
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { readNoteHistory: readNoteHistory }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.open }))];
                        }); }); })];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.history.loading)];
                case 4:
                    _a.apply(void 0, [(_c.sent()).closest('[role="status"]')]).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(window, { key: 'Escape' })];
                        }); }); })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 6:
                    _c.sent();
                    (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.open }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.open }))];
                        }); }); })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readNoteHistory).toHaveBeenCalledTimes(2); })];
                case 8:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.history.empty)];
                case 9:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(readNoteHistory).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.notebook.history.restore })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves pending edits before History opens, previews safely, and restores an older version', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, older, version, readNoteHistory, restoreNoteVersion, sheet, _a, preview;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ body: 'Before typing', stamp: 'initial' })]);
                    older = (0, test_support_1.note)({ body: '<img src=x onerror=alert(1)>\nEarlier words', stamp: 'earlier' });
                    version = { id: 'old', savedAt: '2026-11-06T10:00:00Z' };
                    readNoteHistory = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok([version])];
                    }); }); });
                    restoreNoteVersion = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var saved;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, notes.saveNote(KEY, older.id, older)];
                                case 1:
                                    saved = _a.sent();
                                    return [2 /*return*/, saved];
                            }
                        });
                    }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { readNoteHistory: readNoteHistory, readNoteVersion: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ok(older)];
                            }); }); }, restoreNoteVersion: restoreNoteVersion }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    write('Pending words');
                    return [4 /*yield*/, press(en_1.t.notebook.history.open)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, older.id, vitest_1.expect.objectContaining({ body: 'Pending words' }), 'initial');
                    _a = preact_1.within;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 4:
                    sheet = _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, sheet.findByLabelText(en_1.t.notebook.history.preview)];
                case 5:
                    preview = _b.sent();
                    (0, vitest_1.expect)(preview.textContent).toBe(older.body);
                    (0, vitest_1.expect)(preview.querySelector('img')).toBeNull();
                    return [4 /*yield*/, press(en_1.t.notebook.history.restore)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 7:
                    _b.sent();
                    (0, vitest_1.expect)(restoreNoteVersion).toHaveBeenCalledWith(KEY, older.id, 'old', 's-1');
                    (0, vitest_1.expect)(body().value).toBe(older.body);
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.history.restored)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('retries a failed history read and a failed preview, then reports a failed restore and retries it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var older, version, readNoteHistory, readNoteVersion, restoreNoteVersion, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    older = (0, test_support_1.note)({ body: 'Older', stamp: 'old' });
                    version = { id: 'old', savedAt: '2026-11-06T10:00:00Z' };
                    readNoteHistory = vitest_1.vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'History could not be read.' } }).mockResolvedValue(ok([version]));
                    readNoteVersion = vitest_1.vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Preview could not be read.' } }).mockResolvedValue(ok(older));
                    restoreNoteVersion = vitest_1.vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Restore failed.' } }).mockImplementation(never);
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { readNoteHistory: readNoteHistory, readNoteVersion: readNoteVersion, restoreNoteVersion: restoreNoteVersion }))];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.history.open)];
                case 3:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 4:
                    _a.apply(void 0, [(_d.sent()).textContent]).toContain('History could not be read.');
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 5:
                    _d.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 6:
                    _b.apply(void 0, [(_d.sent()).textContent]).toContain('Preview could not be read.');
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.notebook.history.preview)];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.history.restore)];
                case 9:
                    _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 10:
                    _c.apply(void 0, [(_d.sent()).textContent]).toContain('Restore failed.');
                    return [4 /*yield*/, press(en_1.t.notebook.history.restore)];
                case 11:
                    _d.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.history.restoring).closest('[role="status"]')).toBeTruthy();
                    preact_1.fireEvent.keyDown(window, { key: 'Escape' });
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a restore conflict keeps the current text and asks for another review before restoring', function () { return __awaiter(void 0, void 0, void 0, function () {
        var older, restoreNoteVersion, sheet, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    older = (0, test_support_1.note)({ body: 'Older', stamp: 'old' });
                    restoreNoteVersion = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok({ kind: 'changed', note: (0, test_support_1.note)({ body: 'Changed outside', stamp: 'outside' }) })];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)({ body: 'Current' })])), { readNoteHistory: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ok([{ id: 'old', savedAt: '2026-11-06T10:00:00Z' }])];
                            }); }); }, readNoteVersion: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ok(older)];
                            }); }); }, restoreNoteVersion: restoreNoteVersion }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.history.open)];
                case 3:
                    _c.sent();
                    _a = preact_1.within;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 4:
                    sheet = _a.apply(void 0, [_c.sent()]);
                    return [4 /*yield*/, sheet.findByLabelText(en_1.t.notebook.history.preview)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.history.restore)];
                case 6:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 7:
                    _b.apply(void 0, [(_c.sent()).textContent]).toContain(en_1.t.notebook.history.changed);
                    (0, vitest_1.expect)(body().value).toBe('Current');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.restore }).disabled).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each(notes_1.NOTE_TYPES)('starts an empty note from the %s template and saves its type', function (type) { return __awaiter(void 0, void 0, void 0, function () {
        var notes, templates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ title: 'My note', folder: 'Plans' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('My note')];
                case 2:
                    _a.sent();
                    templates = preact_1.screen.getByRole('group', { name: en_1.t.notebook.templatesLabel });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(templates).getByRole('button', { name: en_1.t.notebook.types[type] }))];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(body().value).toBe(en_1.t.notebook.templates[type]);
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(en_1.t.notebook.type).value).toBe(type);
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(en_1.t.notebook.folder).value).toBe('Plans');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('group', { name: en_1.t.notebook.templatesLabel })).toBeNull();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ type: type, folder: 'Plans', body: en_1.t.notebook.templates[type] }), 's-1'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('changing or clearing the type keeps existing text and the folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, type;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ type: 'idea', body: 'Keep my words', folder: 'Plans' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('group', { name: en_1.t.notebook.templatesLabel })).toBeNull();
                    type = preact_1.screen.getByLabelText(en_1.t.notebook.type);
                    preact_1.fireEvent.change(type, { target: { value: 'bug' } });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ type: 'bug', body: 'Keep my words', folder: 'Plans' }), 's-1'); })];
                case 3:
                    _a.sent();
                    preact_1.fireEvent.change(type, { target: { value: '' } });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenLastCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ type: null, body: 'Keep my words', folder: 'Plans' }), vitest_1.expect.any(String)); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(body().value).toBe('Keep my words');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('group', { name: en_1.t.notebook.templatesLabel })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('pins at once into Pinned, folds that group, and unpins back to its folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, pinned;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)(), (0, test_support_1.note)({ id: 'other', title: 'Other', folder: 'Ideas' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.pin)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ isPinned: true }), 's-1');
                    return [4 /*yield*/, preact_1.screen.findByRole('region', { name: en_1.t.notebook.pinned })];
                case 4:
                    pinned = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pinned).getByRole('button', { name: /^Bug Bounty Helper/ }).textContent).toContain('Ideas');
                    (0, vitest_1.expect)(preact_1.screen.getAllByRole('button', { name: /^Bug Bounty Helper/ })).toHaveLength(1);
                    return [4 /*yield*/, press(/^Pinned 1/)];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pinned).queryByRole('button', { name: /^Bug Bounty Helper/ })).toBeNull();
                    return [4 /*yield*/, press(/^Pinned 1/)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.unpin)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('region', { name: en_1.t.notebook.pinned })).toBeNull(); })];
                case 8:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('region', { name: 'Ideas' })).getByRole('button', { name: /^Bug Bounty Helper/ })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed pin save keeps the text and offers Retry', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, saveNote, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ body: 'Keep this' })]);
                    saveNote = vitest_1.vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Could not save the pin.' } }).mockImplementation(notes.saveNote);
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { saveNote: saveNote }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.pin)];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 4:
                    _a.apply(void 0, [(_c.sent()).textContent]).toContain('Could not save the pin.');
                    (0, vitest_1.expect)(body().value).toBe('Keep this');
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 5:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('region', { name: en_1.t.notebook.pinned })];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves the open note before renaming its folder and adopts the new folder for later edits', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ folder: 'Ideas' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    write('Unsaved words');
                    return [4 /*yield*/, press(en_1.t.notebook.renameFolderLabel('Ideas'))];
                case 3:
                    _a.sent();
                    dialog = preact_1.screen.getByRole('dialog', { name: en_1.t.notebook.renameTitle('Ideas') });
                    preact_1.fireEvent.input((0, preact_1.within)(dialog).getByLabelText("".concat(en_1.t.notebook.folderName, " *")), { target: { value: 'Plans' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(dialog)];
                        }); }); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ body: 'Unsaved words' }), 's-1');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.renameFolder).toHaveBeenCalledWith(KEY, 'Ideas', 'Plans'); })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(notes.saveNote.mock.invocationCallOrder[0]).toBeLessThan(notes.renameFolder.mock.invocationCallOrder[0]);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByLabelText(en_1.t.notebook.folder).value).toBe('Plans'); })];
                case 6:
                    _a.sent();
                    write('Later words');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenLastCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ body: 'Later words', folder: 'Plans' }), vitest_1.expect.stringMatching(/^r-/)); })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks folder names on blur and submit, and does not rename Inbox', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, dialog, field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)(), (0, test_support_1.note)({ id: 'inbox', title: 'Inbox note', folder: 'Inbox' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Inbox note')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.notebook.renameFolderLabel('Inbox') })).toBeNull();
                    return [4 /*yield*/, press(en_1.t.notebook.renameFolderLabel('Ideas'))];
                case 3:
                    _a.sent();
                    dialog = preact_1.screen.getByRole('dialog');
                    field = (0, preact_1.within)(dialog).getByLabelText("".concat(en_1.t.notebook.folderName, " *"));
                    preact_1.fireEvent.input(field, { target: { value: 'a/b' } });
                    preact_1.fireEvent.blur(field);
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(en_1.t.notebook.folderSlash)).toBeTruthy();
                    preact_1.fireEvent.input(field, { target: { value: ' ' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(dialog)];
                        }); }); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(en_1.t.notebook.folderRequired)).toBeTruthy();
                    (0, vitest_1.expect)(notes.renameFolder).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('can rename a folder whose notes are all pinned', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, dialog, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ isPinned: true })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.renameFolderLabel('Ideas'))];
                case 3:
                    _b.sent();
                    dialog = preact_1.screen.getByRole('dialog');
                    preact_1.fireEvent.input((0, preact_1.within)(dialog).getByLabelText("".concat(en_1.t.notebook.folderName, " *")), { target: { value: 'Plans' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(dialog)];
                        }); }); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.renameFolder).toHaveBeenCalledWith(KEY, 'Ideas', 'Plans'); })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Plans')];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('region', { name: en_1.t.notebook.pinned })).getByRole('button', { name: /^Bug Bounty Helper/ }).textContent).toContain('Plans');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the rename dialog open when saving the open note fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, saveNote, dialog, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    saveNote = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: 'Cannot save.' } })];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { saveNote: saveNote }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    write('Keep these unsaved words');
                    return [4 /*yield*/, press(en_1.t.notebook.renameFolderLabel('Ideas'))];
                case 3:
                    _b.sent();
                    dialog = preact_1.screen.getByRole('dialog');
                    preact_1.fireEvent.input((0, preact_1.within)(dialog).getByLabelText("".concat(en_1.t.notebook.folderName, " *")), { target: { value: 'Plans' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(dialog)];
                        }); }); })];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(dialog).findByRole('alert')];
                case 5:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe(en_1.t.notebook.openNotSaved);
                    (0, vitest_1.expect)(notes.renameFolder).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(body().value).toBe('Keep these unsaved words');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a failed rename in its dialog and lets the same request be retried', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, renameFolder, dialog, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    renameFolder = vitest_1.vi.fn().mockResolvedValueOnce({ ok: false, error: { message: 'Could not rename.' } }).mockImplementation(notes.renameFolder);
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { renameFolder: renameFolder }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.renameFolderLabel('Ideas'))];
                case 3:
                    _b.sent();
                    dialog = preact_1.screen.getByRole('dialog');
                    preact_1.fireEvent.input((0, preact_1.within)(dialog).getByLabelText("".concat(en_1.t.notebook.folderName, " *")), { target: { value: 'Plans' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(dialog)];
                        }); }); })];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(dialog).findByRole('alert')];
                case 5:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe('Could not rename.');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(dialog)];
                        }); }); })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 7:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('region', { name: 'Plans' })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('is the seventh tab, and says what it is reading while the notes load', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ readNotes: never })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.notes }).getAttribute('aria-current')).toBe('page');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.loading.notes).closest('[role="status"]')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says why the notes could not be read, and reads them again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, readNotes, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    readNotes = vitest_1.vi.fn().mockResolvedValueOnce({ ok: false, error: { message: "Couldn't read this realm's notes." } }).mockImplementation(notes.readNotes);
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { readNotes: readNotes }))];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 2:
                    _a.apply(void 0, [(_c.sent()).textContent]).toContain("Couldn't read this realm's notes.");
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 3:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with no notes yet, says where they will live, and a jotted line becomes one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, _a, capture, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    notes = memoryNotes([]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.emptyTitle('a'))];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.emptyWhere(FOLDER))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.captureHint)).toBeTruthy();
                    capture = preact_1.screen.getByLabelText(en_1.t.notebook.capture);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(capture.closest('form'))];
                        }); }); })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)((_c = document.getElementById(capture.getAttribute('aria-describedby'))) === null || _c === void 0 ? void 0 : _c.textContent).toBe(en_1.t.notebook.captureEmpty);
                    preact_1.fireEvent.input(capture, { target: { value: 'Try a [[graph]] view' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit(capture.closest('form'))];
                        }); }); })];
                case 4:
                    _d.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Try a graph view', folder: 'Inbox', body: 'Try a [[graph]] view' });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(capture.value).toBe(''); })];
                case 5:
                    _d.sent();
                    preact_1.fireEvent.input(capture, { target: { value: 'Open this one' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(capture, { key: 'Enter', metaKey: true })];
                        }); }); })];
                case 6:
                    _d.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Open this one')];
                case 7:
                    _b.apply(void 0, [_d.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘J puts the cursor in the capture line, and ⌘F in search', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)()]))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    preact_1.fireEvent.keyDown(window, { key: 'j', metaKey: true });
                    (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByLabelText(en_1.t.notebook.capture));
                    preact_1.fireEvent.keyDown(window, { key: 'f', metaKey: true });
                    (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByLabelText(en_1.t.notebook.search));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a title another note has is refused under the field, and Esc puts the saved one back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var title;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                case 2:
                    title = (_b.sent());
                    preact_1.fireEvent.input(title, { target: { value: 'beta' } });
                    preact_1.fireEvent.blur(title);
                    (0, vitest_1.expect)((_a = document.getElementById(title.getAttribute('aria-describedby'))) === null || _a === void 0 ? void 0 : _a.textContent).toBe(en_1.t.notebook.titleTaken('beta'));
                    preact_1.fireEvent.keyDown(title, { key: 'Escape' });
                    (0, vitest_1.expect)(title.value).toBe('Alpha');
                    (0, vitest_1.expect)(title.getAttribute('aria-invalid')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('edits that could not be saved come back when the note is opened again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, saveNote, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]);
                    saveNote = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't save this note." } })];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { saveNote: saveNote }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                case 2:
                    _b.sent();
                    write('Words not yet saved');
                    return [4 /*yield*/, press(/^Beta/)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Beta')];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.notSavedRow)];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [4 /*yield*/, press(/^Alpha/)];
                case 6:
                    _b.sent();
                    (0, vitest_1.expect)(body().value).toBe('Words not yet saved');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens the newest note, and saves what is typed a moment after typing stops', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ id: 'old', title: 'Old', updated: '2026-11-01T00:00:00' }), (0, test_support_1.note)({ id: 'new', title: 'New', updated: '2026-11-06T00:00:00' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('New')];
                case 2:
                    _b.sent();
                    write('Hello');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.unsaved)).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, 'new', { title: 'New', folder: 'Ideas', type: null, isPinned: false, tags: [], body: 'Hello' }, 's-1'); })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(/^Saved/)];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('typing back to what is saved needs no save, and says Saved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ body: 'Same' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    write('Samex');
                    write('Same');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(/^Saved/)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(notes.saveNote).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a blank title shows its error under the field and is never saved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, title;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    title = (_b.sent());
                    preact_1.fireEvent.input(title, { target: { value: '  ' } });
                    preact_1.fireEvent.blur(title);
                    (0, vitest_1.expect)((_a = document.getElementById(title.getAttribute('aria-describedby'))) === null || _a === void 0 ? void 0 : _a.textContent).toBe('Title is required.');
                    write('Still saves the text');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalled(); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(notes.saveNote.mock.calls[0][2].title).toBe('Bug Bounty Helper');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('when the file changed outside, stops and asks which version to keep', function () { return __awaiter(void 0, void 0, void 0, function () {
        var theirs, notes, saveNote, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    theirs = (0, test_support_1.note)({ body: 'Their words', stamp: 's-theirs' });
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    saveNote = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok({ kind: 'changed', note: theirs })];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { saveNote: saveNote }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    write('My words');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.changedTitle)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.notebook.loadTheirs)];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(body().value).toBe('Their words');
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.notebook.changedTitle)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed save says so where the saving happens, and tries again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, saveNote, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    saveNote = vitest_1.vi.fn().mockResolvedValueOnce({ ok: false, error: { message: "Couldn't save this note. Your text is still here. Try again." } }).mockImplementation(notes.saveNote);
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { saveNote: saveNote }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _c.sent();
                    write('Words');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(/Couldn't save this note/)];
                case 3:
                    _a.apply(void 0, [(_c.sent()).closest('[role="alert"]')]).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 4:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(/^Saved/)];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('typing [[ offers the realm’s other notes, and Enter links one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var picker;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'here', title: 'Here', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'plan', title: 'Plan', folder: 'Research' }), (0, test_support_1.note)({ id: 'other', title: 'Other' })]))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Here')];
                case 2:
                    _a.sent();
                    write('See [[pl');
                    picker = preact_1.screen.getByRole('listbox', { name: en_1.t.notebook.linkPicker });
                    (0, vitest_1.expect)((0, preact_1.within)(picker).getAllByRole('option').map(function (option) { return __spreadArray([], option.children, true).map(function (part) { return part.textContent; }); })).toEqual([['Plan', 'Research']]);
                    preact_1.fireEvent.keyDown(body(), { key: 'Enter' });
                    (0, vitest_1.expect)(body().value).toBe('See [[Plan]]');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('listbox')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers notes then quests with their states, and the keyboard inserts a quest id and title', function () { return __awaiter(void 0, void 0, void 0, function () {
        var options, about, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)({ id: 'here', title: 'Here', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'plan', title: 'Plan' })])), { readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ok((0, test_support_1.projectView)(key, {
                                        ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 't-abc', title: 'Plan' }) }],
                                        victories: [{ id: 't-def', title: 'Plan done', finished: '', minutes: 1, xp: 1 }],
                                    }))];
                            });
                        }); } }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Here')];
                case 2:
                    _b.sent();
                    write('See [[pl');
                    options = (0, preact_1.within)(preact_1.screen.getByRole('listbox')).getAllByRole('option');
                    (0, vitest_1.expect)(options.map(function (option) { return option.textContent; })).toEqual(['PlanIdeas', "Plan".concat(en_1.t.notebook.questState.waiting)]);
                    (0, vitest_1.expect)(options[1].getAttribute('aria-label')).toBe(en_1.t.notebook.pickQuest('Plan', 'waiting'));
                    preact_1.fireEvent.keyDown(body(), { key: 'ArrowDown' });
                    (0, vitest_1.expect)(body().getAttribute('aria-activedescendant')).toBe(options[1].id);
                    preact_1.fireEvent.keyDown(body(), { key: 'Tab' });
                    (0, vitest_1.expect)(body().value).toBe('See [[quest:t-abc|Plan]]');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('listbox')).toBeNull();
                    about = preact_1.screen.getByRole('complementary', { name: en_1.t.notebook.inspector });
                    (0, vitest_1.expect)((0, preact_1.within)(about).getByRole('button', { name: en_1.t.notebook.openQuest('Plan') })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(about).queryByRole('button', { name: en_1.t.notebook.makeIt })).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(about).getByRole('button', { name: en_1.t.notebook.openQuest('Plan') }))];
                        }); }); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(window.location.hash).toBe('#/quests');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('complementary', { name: en_1.t.detail.label })];
                case 4:
                    _a.apply(void 0, [(_b.sent()).textContent]).toContain('Plan');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('clicking a quest in the picker inserts it, and Escape leaves the typed text', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ok((0, test_support_1.projectView)(key, { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 't-abc', title: 'Write parser' }) }] }))];
                        }); }); } }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    write('[[Write');
                    preact_1.fireEvent.keyDown(body(), { key: 'Escape' });
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('listbox')).toBeNull();
                    (0, vitest_1.expect)(body().value).toBe('[[Write');
                    write('[[Write ');
                    preact_1.fireEvent.mouseDown(preact_1.screen.getByRole('option', { name: en_1.t.notebook.pickQuest('Write parser', 'waiting') }));
                    (0, vitest_1.expect)(body().value).toBe('[[quest:t-abc|Write parser]]');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('listbox')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('updates quest links in the inspector and Read when the queue changes, and never makes a missing quest into a note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, engine, fire, workspace, about, read, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    window.location.hash = '#/notes';
                    view = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 't-abc', title: 'Current title' }) }] });
                    _a = (0, test_support_1.fakeEngine)(__assign(__assign({}, memoryNotes([(0, test_support_1.note)({ body: '[[quest:t-abc|Written title]]' })])), { readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ok(view)];
                        }); }); } })), engine = _a.engine, fire = _a.fire;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                                        return [4 /*yield*/, workspace.start()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.read)];
                case 3:
                    _e.sent();
                    about = preact_1.screen.getByRole('complementary', { name: en_1.t.notebook.inspector });
                    read = preact_1.screen.getByRole('article');
                    (0, vitest_1.expect)((0, preact_1.within)(about).getByRole('button', { name: en_1.t.notebook.openQuest('Current title') })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(read).getByRole('button', { name: en_1.t.notebook.openQuestLink('Current title', 'waiting') })).toBeTruthy();
                    view = (0, test_support_1.projectView)(KEY, { sealed: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 't-abc', title: 'Renamed title' }) }] });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void fire()];
                        }); }); })];
                case 4:
                    _e.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(about).findByRole('button', { name: en_1.t.notebook.openQuest('Renamed title') })];
                case 5:
                    _b.apply(void 0, [_e.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(read).getByRole('button', { name: en_1.t.notebook.openQuestLink('Renamed title', 'sealed') })).toBeTruthy();
                    view = (0, test_support_1.projectView)(KEY, { victories: [{ id: 't-abc', title: 'Finished title', finished: '', minutes: 1, xp: 1 }] });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void fire()];
                        }); }); })];
                case 6:
                    _e.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(read).findByText('Finished title')];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(read).queryByRole('button')).toBeNull();
                    (0, vitest_1.expect)((0, preact_1.within)(about).queryByRole('button', { name: /in Quests/ })).toBeNull();
                    (0, vitest_1.expect)((0, preact_1.within)(about).getByText(en_1.t.notebook.questState.done)).toBeTruthy();
                    view = (0, test_support_1.projectView)(KEY);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void fire()];
                        }); }); })];
                case 8:
                    _e.sent();
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(read).findByText('Written title')];
                case 9:
                    _d.apply(void 0, [_e.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(about).getByText(en_1.t.notebook.goneQuest)).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(about).queryByRole('button', { name: en_1.t.notebook.makeIt })).toBeNull();
                    (0, vitest_1.expect)((0, preact_1.within)(read).queryByRole('button')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows links, broken links with a way to make the note, and backlinks', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, about;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ id: 'here', title: 'Here', body: '[[Plan]] and [[Missing]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'plan', title: 'Plan' }), (0, test_support_1.note)({ id: 'fan', title: 'Fan', body: 'I like [[here]]' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Here')];
                case 2:
                    _a.sent();
                    about = preact_1.screen.getByRole('complementary', { name: en_1.t.notebook.inspector });
                    (0, vitest_1.expect)((0, preact_1.within)(about).getByRole('button', { name: 'Plan' })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(about).getByText(en_1.t.notebook.broken('Missing'))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(about).getByRole('button', { name: 'Fan' })).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.notebook.makeIt)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Missing', folder: 'Ideas', body: '' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('BrewQuest shows live targets during its drag and reviews the note it lands on', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, editor, row, _a, robot, dataTransfer, sheet;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)(), (0, test_support_1.note)({ id: 'n-other', title: 'Release plan', body: '- [ ] Ship' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    editor = preact_1.screen.getByRole('region', { name: en_1.t.notebook.body });
                    row = (0, preact_1.within)(preact_1.screen.getByRole('navigation', { name: en_1.t.notebook.title })).getByRole('button', { name: /Release plan/ });
                    _a = dragBrew(), robot = _a.robot, dataTransfer = _a.dataTransfer;
                    (0, vitest_1.expect)(dataTransfer.effectAllowed).toBe('copy');
                    (0, vitest_1.expect)(dataTransfer.types).not.toContain('text/plain');
                    (0, vitest_1.expect)(editor.getAttribute('data-brew-target')).toBe('true');
                    (0, vitest_1.expect)(row.getAttribute('data-brew-target')).toBe('true');
                    (0, vitest_1.expect)(preact_1.screen.getAllByText('Drop to review quests')).toHaveLength(3);
                    (0, vitest_1.expect)(preact_1.fireEvent.dragOver(row, { dataTransfer: dataTransfer })).toBe(false);
                    (0, vitest_1.expect)(dataTransfer.dropEffect).toBe('copy');
                    (0, vitest_1.expect)(row.getAttribute('data-brew-over')).toBe('true');
                    (0, preact_1.fireEvent)(row, new MouseEvent('dragleave', { bubbles: true, relatedTarget: row.firstElementChild }));
                    (0, vitest_1.expect)(row.getAttribute('data-brew-over')).toBe('true');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(row, { dataTransfer: dataTransfer })];
                        }); }); })];
                case 3:
                    _b.sent();
                    preact_1.fireEvent.dragEnd(robot);
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: en_1.t.notebook.brew.sheet('Release plan') })];
                case 4:
                    sheet = _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.notebook.brew.questTitle(1), " *")).value).toBe('Ship');
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText("".concat(en_1.t.notebook.noteTitle, " *"))).toHaveProperty('value', 'Release plan');
                    (0, vitest_1.expect)(notes.fileNoteQuests).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(notes.saveNote).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(document.querySelector('[data-brew-target]')).toBeNull();
                    return [4 /*yield*/, press(en_1.t.actions.cancel)];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByRole('button', { name: en_1.t.notebook.brew.turn }));
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each(['write', 'read', 'graph'])('BrewQuest saves the latest text before reviewing a drop in %s', function (mode) { return __awaiter(void 0, void 0, void 0, function () {
        var notes, dataTransfer, target, sheet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    write('- [ ] A freshly typed quest');
                    if (!(mode !== 'write')) return [3 /*break*/, 4];
                    return [4 /*yield*/, press(en_1.t.notebook[mode])];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    dataTransfer = dragBrew().dataTransfer;
                    target = mode === 'write' ? body() : preact_1.screen.getByRole('region', { name: en_1.t.notebook.body });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(target, { dataTransfer: dataTransfer })];
                        }); }); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: en_1.t.notebook.brew.sheet('Bug Bounty Helper') })];
                case 6:
                    sheet = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.notebook.brew.questTitle(1), " *")).value).toBe('A freshly typed quest');
                    (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ body: '- [ ] A freshly typed quest' }), vitest_1.expect.any(String));
                    (0, vitest_1.expect)(notes.fileNoteQuests).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('BrewQuest leaves notes and quests alone after an invalid drop or a cancelled drag', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, original, editor, _a, robot, dataTransfer, cancelled, unrelated;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    original = body().value;
                    editor = preact_1.screen.getByRole('region', { name: en_1.t.notebook.body });
                    _a = dragBrew(), robot = _a.robot, dataTransfer = _a.dataTransfer;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(preact_1.screen.getByRole('complementary', { name: en_1.t.notebook.inspector }), { dataTransfer: dataTransfer })];
                        }); }); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(document.querySelector('[data-brew-target]')).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    cancelled = dragBrew();
                    preact_1.fireEvent.dragOver(editor, { dataTransfer: cancelled.dataTransfer });
                    preact_1.fireEvent.dragEnd(robot);
                    (0, vitest_1.expect)(document.querySelector('[data-brew-target]')).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(editor, { dataTransfer: cancelled.dataTransfer })];
                        }); }); })];
                case 4:
                    _b.sent();
                    unrelated = brewTransfer();
                    unrelated.setData('text/plain', 'unrelated text');
                    dragBrew();
                    (0, vitest_1.expect)(preact_1.fireEvent.dragOver(editor, { dataTransfer: unrelated })).toBe(true);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(editor, { dataTransfer: unrelated })];
                        }); }); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    (0, vitest_1.expect)(body().value).toBe(original);
                    (0, vitest_1.expect)(notes.saveNote).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(notes.fileNoteQuests).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(notes.createNote).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(notes.archiveNote).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('BrewQuest stops a drop when saving fails and keeps the open note and its edits', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, saveNote, dataTransfer, row, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)(), (0, test_support_1.note)({ id: 'n-other', title: 'Release plan' })]);
                    saveNote = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't save. Your text is still here." } })];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { saveNote: saveNote }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    write('Keep this unsaved text');
                    dataTransfer = dragBrew().dataTransfer;
                    row = (0, preact_1.within)(preact_1.screen.getByRole('navigation', { name: en_1.t.notebook.title })).getByRole('button', { name: /Release plan/ });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(row, { dataTransfer: dataTransfer })];
                        }); }); })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 4:
                    _a.apply(void 0, [(_b.sent()).textContent]).toContain("Couldn't save.");
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText("".concat(en_1.t.notebook.noteTitle, " *"))).toHaveProperty('value', 'Bug Bounty Helper');
                    (0, vitest_1.expect)(body().value).toBe('Keep this unsaved text');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    (0, vitest_1.expect)(notes.fileNoteQuests).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('BrewQuest refuses archived notes and a drag from another realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, dataTransfer, active, archived;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)(), (0, test_support_1.note)({ id: 'n-archived', title: 'Old plan', isArchived: true })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    dataTransfer = dragBrew().dataTransfer;
                    // The MIME type alone cannot make an outside drag into this realm's robot.
                    dataTransfer.setData(dataTransfer.types[0], 'another-realm');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(body(), { dataTransfer: dataTransfer })];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    active = dragBrew();
                    return [4 /*yield*/, press(en_1.t.notebook.archived(1))];
                case 4:
                    _a.sent();
                    archived = (0, preact_1.within)(preact_1.screen.getByRole('navigation', { name: en_1.t.notebook.title })).getByRole('button', { name: /Old plan/ });
                    (0, vitest_1.expect)(archived.hasAttribute('data-brew-target')).toBe(false);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.drop(archived, { dataTransfer: active.dataTransfer })];
                        }); }); })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    (0, vitest_1.expect)(notes.saveNote).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(notes.fileNoteQuests).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('BrewQuest drafts quests from the checklist, checks them, and files only what you keep', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, sheet, second, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ body: 'A helper.\n\n- [ ] Scan\n- [ ] Report\n- [x] Done' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.brew.turn }))];
                        }); }); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: en_1.t.notebook.brew.sheet('Bug Bounty Helper') })];
                case 4:
                    sheet = _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.notebook.brew.parent, " *")).value).toBe('Bug Bounty Helper');
                    second = (0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.notebook.brew.questTitle(2), " *"));
                    preact_1.fireEvent.input(second, { target: { value: '' } });
                    preact_1.fireEvent.blur(second);
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByText(en_1.t.notebook.brew.questTitleRequired)).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: en_1.t.notebook.brew.file(3) }))];
                        }); }); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(notes.fileNoteQuests).not.toHaveBeenCalled();
                    preact_1.fireEvent.click((0, preact_1.within)(sheet).getByLabelText(en_1.t.notebook.brew.include(2)));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: en_1.t.notebook.brew.file(2) }))];
                        }); }); })];
                case 6:
                    _b.sent();
                    (0, vitest_1.expect)(notes.fileNoteQuests).toHaveBeenCalledWith(KEY, 'n-00000001', { parent: { kind: 'new', title: 'Bug Bounty Helper' }, quests: [{ title: 'Scan', priority: 'mid', difficulty: 'medium', item: 'Scan' }] });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 7:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.brew.filed(2))];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.openQuest('Scan') })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.questState.waiting)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('BrewQuest says why filing failed, in its sheet, locks what went in, and tries again for the rest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, fileNoteQuests, sheet, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ body: '- [ ] Scan\n- [ ] Report' })]);
                    fileNoteQuests = vitest_1.vi.fn().mockImplementationOnce(function (key, id, proposal) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, notes.fileNoteQuests(key, id, __assign(__assign({}, proposal), { quests: proposal.quests.slice(0, 1) }))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, { ok: false, error: { message: "Couldn't file the quests." } }];
                            }
                        });
                    }); }).mockImplementation(notes.fileNoteQuests);
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { fileNoteQuests: fileNoteQuests }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.brew.turn }))];
                        }); }); })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 4:
                    sheet = _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: en_1.t.notebook.brew.file(3) }))];
                        }); }); })];
                case 5:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(sheet).findByRole('alert')];
                case 6:
                    _a.apply(void 0, [(_c.sent()).textContent]).toBe("Couldn't file the quests.");
                    // The parent and the first quest went in; both lock.
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(sheet).findAllByText(en_1.t.notebook.brew.filedRow)];
                case 7:
                    // The parent and the first quest went in; both lock.
                    _b.apply(void 0, [_c.sent()]).toHaveLength(2);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: en_1.t.notebook.brew.tryAgain }))];
                        }); }); })];
                case 8:
                    _c.sent();
                    (0, vitest_1.expect)(fileNoteQuests.mock.calls[1][2].quests.map(function (q) { return q.title; })).toEqual(['Report']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('archives a note, and deletes it forever only from Archived, after asking', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, dialog;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.archiveNote)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.archiveNote).toHaveBeenCalledWith(KEY, 'n-00000001', true); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = preact_1.fireEvent).click;
                                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.notebook.archived(1) })];
                                case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                            }
                        }); }); })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _b = (_a = preact_1.fireEvent).click;
                                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: /Bug Bounty Helper/ })];
                                case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                            }
                        }); }); })];
                case 6:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.archivedLine)).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.notebook.deleteForever)];
                case 7:
                    _b.sent();
                    dialog = preact_1.screen.getByRole('dialog', { name: en_1.t.notebook.deleteTitle('Bug Bounty Helper') });
                    (0, vitest_1.expect)((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.textContent).toBe(en_1.t.actions.cancel);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(dialog).getByRole('button', { name: en_1.t.notebook.deleteIt }))];
                        }); }); })];
                case 8:
                    _b.sent();
                    (0, vitest_1.expect)(notes.deleteNote).toHaveBeenCalledWith(KEY, 'n-00000001');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘E turns the note over to Read: Markdown drawn, HTML shown as text, and a box ticked saves the Markdown', function () { return __awaiter(void 0, void 0, void 0, function () {
        var md, notes, openLink, read, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    md = ['# Plan', '', 'See [[Other|the other]], [[Missing]] and [site](https://example.com). <img src=x onerror=alert(1)>', '', '- [ ] Scan', '- [x] Done', '', '> [!warning] Careful', '> Mind the gap', '', '| a | b |', '|---|---|', '| 1 | 2 |', '', '```', '<b>code</b>', '```', '', '![pic](https://example.com/p.png)'].join('\n');
                    notes = memoryNotes([(0, test_support_1.note)({ id: 'here', title: 'Here', body: md, updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'other', title: 'Other' })]);
                    openLink = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(null)];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { openLink: openLink }))];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Here')];
                case 2:
                    _d.sent();
                    preact_1.fireEvent.keyDown(window, { key: 'e', metaKey: true });
                    read = document.querySelector('.nt-read');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('combobox', { name: en_1.t.notebook.body })).toBeNull();
                    (0, vitest_1.expect)((0, preact_1.within)(read).getByRole('heading', { name: 'Plan' })).toBeTruthy();
                    (0, vitest_1.expect)((_b = read.querySelector('table td')) === null || _b === void 0 ? void 0 : _b.textContent).toBe('1');
                    (0, vitest_1.expect)((0, preact_1.within)(read).getByText('Careful')).toBeTruthy();
                    (0, vitest_1.expect)((_c = read.querySelector('pre code')) === null || _c === void 0 ? void 0 : _c.textContent).toBe('<b>code</b>');
                    (0, vitest_1.expect)(read.querySelector('img, b')).toBeNull();
                    (0, vitest_1.expect)(read.textContent).toContain('<img src=x onerror=alert(1)>');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(read).getByRole('link', { name: 'site' }))];
                        }); }); })];
                case 3:
                    _d.sent();
                    (0, vitest_1.expect)(openLink).toHaveBeenCalledWith('https://example.com');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(read).getByRole('link', { name: /pic/ }))];
                        }); }); })];
                case 4:
                    _d.sent();
                    (0, vitest_1.expect)(openLink).toHaveBeenLastCalledWith('https://example.com/p.png');
                    preact_1.fireEvent.click((0, preact_1.within)(read).getByLabelText(en_1.t.notebook.taskBox('Scan')));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalled(); })];
                case 5:
                    _d.sent();
                    (0, vitest_1.expect)(notes.saveNote.mock.calls[0][2].body).toContain('- [x] Scan');
                    return [4 /*yield*/, press('the other')];
                case 6:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Other')];
                case 7:
                    _a.apply(void 0, [_d.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.read }).getAttribute('aria-pressed')).toBe('true');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an archived note reads, with its boxes not tickable and no Write', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ body: '- [ ] Scan', isArchived: true })]))];
                case 1:
                    _b.sent();
                    _a = press;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.notebook.archived(1) }).then(function (b) { return b.textContent; })];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, press(/^Bug Bounty Helper/)];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText(en_1.t.notebook.taskBox('Scan')).disabled).toBe(true);
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.notebook.write })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('search narrows the list, and says what to try when nothing matches', function () { return __awaiter(void 0, void 0, void 0, function () {
        var search;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', tags: ['security'] }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: /Beta/ })];
                case 2:
                    _a.sent();
                    search = preact_1.screen.getByLabelText(en_1.t.notebook.search);
                    preact_1.fireEvent.input(search, { target: { value: '#security' } });
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: /^Beta/ })).toBeNull();
                    preact_1.fireEvent.input(search, { target: { value: 'zzz' } });
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.noMatch('zzz'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('below 900 px the note fills the page, and Notes opens the list as a drawer that Esc and picking close', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.innerWidth = 700;
                    return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByLabelText(en_1.t.notebook.search)).toBeNull();
                    return [4 /*yield*/, press(en_1.t.notebook.showList)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByLabelText(en_1.t.notebook.capture));
                    preact_1.fireEvent.keyDown(preact_1.screen.getByLabelText(en_1.t.notebook.capture), { key: 'Escape' });
                    (0, vitest_1.expect)(preact_1.screen.queryByLabelText(en_1.t.notebook.search)).toBeNull();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByRole('button', { name: en_1.t.notebook.showList })); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.showList)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, press(/^Beta/)];
                case 6:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Beta')];
                case 7:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByLabelText(en_1.t.notebook.search)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('from 900 to 1,179 px the inspector floats behind Details, and Esc puts it away', function () { return __awaiter(void 0, void 0, void 0, function () {
        var about;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.innerWidth = 1000;
                    return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)()]))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('complementary', { name: en_1.t.notebook.inspector })).toBeNull();
                    return [4 /*yield*/, press(en_1.t.notebook.details)];
                case 3:
                    _a.sent();
                    about = preact_1.screen.getByRole('complementary', { name: en_1.t.notebook.inspector });
                    preact_1.fireEvent.keyDown((0, preact_1.within)(about).getByLabelText(en_1.t.notebook.tags), { key: 'Escape' });
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('complementary', { name: en_1.t.notebook.inspector })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⇧⌘N from another screen opens Notes on a new Untitled note in Inbox', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void (window.location.hash = '#/quests')];
                        }); }); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByLabelText(en_1.t.notebook.search)).toBeNull(); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(window, { key: 'N', metaKey: true, shiftKey: true })];
                        }); }); })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Untitled', folder: 'Inbox', body: '' }); })];
                case 6:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Untitled')];
                case 7:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(window.location.hash).toBe('#/notes');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('folders fold, and the arrow keys move between notes and fold them', function () { return __awaiter(void 0, void 0, void 0, function () {
        var alpha;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', folder: 'Inbox', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta', folder: 'Inbox' }), (0, test_support_1.note)({ id: 'c', title: 'Gamma', folder: 'Research' })]))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                case 2:
                    _b.sent();
                    alpha = preact_1.screen.getByRole('button', { name: /^Alpha/ });
                    (0, vitest_1.expect)(alpha.tabIndex).toBe(0);
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: /^Beta/ }).tabIndex).toBe(-1);
                    alpha.focus();
                    preact_1.fireEvent.keyDown(alpha, { key: 'ArrowDown' });
                    (0, vitest_1.expect)((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.textContent).toMatch(/^Beta/);
                    preact_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: /^Beta/ })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: /Inbox/ }).getAttribute('aria-expanded')).toBe('false');
                    return [4 /*yield*/, press(/Inbox/)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: /^Beta/ })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a note that can’t be read shows where it was looking, with Try again and Show in Finder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, readNotes, showNotes, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    readNotes = vitest_1.vi.fn().mockResolvedValue({ ok: false, error: { message: "Queue-tea couldn't open this realm's folder." } });
                    showNotes = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(null)];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { readNotes: readNotes, showNotes: showNotes }))];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.failedTitle('a'))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.notebook.showInFinder)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(showNotes).toHaveBeenCalledWith(KEY);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('BrewQuest’s card counts what it can do, and the inspector shows the saga after filing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, sheet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ body: '- [ ] Scan\n- [ ] Report' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.brew.canBe(2))).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.brew.turn }))];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 4:
                    sheet = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByText(en_1.t.notebook.brew.fromLine(1))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByText(en_1.t.notebook.brew.totalWithParent(3, 'a', 2))).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: en_1.t.notebook.brew.file(3) }))];
                        }); }); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.brew.allFiled(3))).toBeTruthy(); })];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.saga(0, 2))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a link pasted in Read goes in at the end on a line of its own, saves, and reads as a bookmark card', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, openLink, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ body: 'Reading list' })]);
                    openLink = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(null)];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { openLink: openLink }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    preact_1.fireEvent.keyDown(window, { key: 'e', metaKey: true });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.paste(document.querySelector('.nt-read'), { clipboardData: { files: [], getData: function () { return 'https://example.com/post'; } } })];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(notes.saveNote).toHaveBeenCalledWith(KEY, 'n-00000001', vitest_1.expect.objectContaining({ body: 'Reading list\n\nhttps://example.com/post\n\n' }), 's-1'); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('link', { name: en_1.t.notebook.openBookmark('Example page', 'example.com') })];
                case 5:
                    card = _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(card)];
                        }); }); })];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(openLink).toHaveBeenCalledWith('https://example.com/post');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('Write, Read and Graph', function () {
        // jsdom's canvas has no 2D context, so the graph isn't drawn, and every
        // element measures 800 × 600: a fitted graph with notes at (100, 0) and
        // (-100, 0) puts the centre at (400, 300) and the note at (100, 0) at (500, 300).
        (0, vitest_1.beforeEach)(function () {
            layouts.length = 0;
            vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
            vitest_1.vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, x: 0, y: 0, width: 800, height: 600, right: 800, bottom: 600, toJSON: function () { } });
        });
        (0, vitest_1.afterEach)(function () { return vitest_1.vi.restoreAllMocks(); });
        var toggle = function () { return (0, preact_1.within)(preact_1.screen.getByRole('group', { name: en_1.t.notebook.viewAs })); };
        var mode = function () { return [en_1.t.notebook.write, en_1.t.notebook.read, en_1.t.notebook.graph].map(function (name) { return toggle().getByRole('button', { name: name }).getAttribute('aria-pressed'); }); };
        var graph = function () { return preact_1.screen.queryByRole('group', { name: /^Graph (around|of the whole realm)/ }); };
        var row = function (title) { return (0, preact_1.within)(preact_1.screen.getByRole('region', { name: 'Ideas' })).getByRole('button', { name: new RegExp("^".concat(title)) }); };
        // Lets the layout's answer, already settled, reach the view.
        var settle = function () { return (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 1: return [2 /*return*/, void (_a.sent())];
            }
        }); }); }); };
        (0, vitest_1.it)('Write, Read and Graph switch the view, and the choice stays on the next note', function () { return __awaiter(void 0, void 0, void 0, function () {
            var about, _a;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' }), (0, test_support_1.note)({ id: 'c', title: 'Cello', body: 'See [[Alpha]]' })]))];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                    case 2:
                        _d.sent();
                        (0, vitest_1.expect)(toggle().getByRole('button', { name: en_1.t.notebook.graph }).getAttribute('title')).toBe(en_1.t.notebook.graphKeys);
                        (0, vitest_1.expect)(mode()).toEqual(['true', 'false', 'false']);
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, settle()];
                    case 4:
                        _d.sent();
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'false', 'true']);
                        (0, vitest_1.expect)((_b = graph()) === null || _b === void 0 ? void 0 : _b.getAttribute('aria-label')).toMatch(/^Graph around Alpha/);
                        (0, vitest_1.expect)(preact_1.screen.queryByLabelText(en_1.t.notebook.body, { selector: 'textarea' })).toBeNull();
                        (0, vitest_1.expect)(preact_1.screen.getByDisplayValue('Alpha')).toBeTruthy();
                        about = preact_1.screen.getByRole('complementary', { name: en_1.t.notebook.inspector });
                        (0, vitest_1.expect)((0, preact_1.within)(about).getByRole('button', { name: 'Beta' })).toBeTruthy();
                        (0, vitest_1.expect)((0, preact_1.within)(about).getByRole('button', { name: 'Cello' })).toBeTruthy();
                        return [4 /*yield*/, press(en_1.t.notebook.read)];
                    case 5:
                        _d.sent();
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'true', 'false']);
                        (0, vitest_1.expect)(preact_1.screen.getByRole('article')).toBeTruthy();
                        (0, vitest_1.expect)(graph()).toBeNull();
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, void preact_1.fireEvent.click(row('Beta'))];
                            }); }); })];
                    case 7:
                        _d.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Beta')];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBeTruthy();
                        return [4 /*yield*/, settle()];
                    case 9:
                        _d.sent();
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'false', 'true']);
                        (0, vitest_1.expect)((_c = graph()) === null || _c === void 0 ? void 0 : _c.getAttribute('aria-label')).toMatch(/^Graph around Beta/);
                        return [4 /*yield*/, press(en_1.t.notebook.write)];
                    case 10:
                        _d.sent();
                        (0, vitest_1.expect)(mode()).toEqual(['true', 'false', 'false']);
                        (0, vitest_1.expect)(graph()).toBeNull();
                        (0, vitest_1.expect)(body().value).toBe('');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('⌘G opens Graph, and ⌘E goes back to Write from Graph', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                    case 2:
                        _a.sent();
                        preact_1.fireEvent.keyDown(window, { key: 'g', metaKey: true });
                        return [4 /*yield*/, settle()];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'false', 'true']);
                        (0, vitest_1.expect)(graph()).toBeTruthy();
                        preact_1.fireEvent.keyDown(window, { key: 'e', metaKey: true });
                        (0, vitest_1.expect)(mode()).toEqual(['true', 'false', 'false']);
                        (0, vitest_1.expect)(body().value).toBe('[[Beta]]');
                        preact_1.fireEvent.keyDown(window, { key: 'e', metaKey: true });
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'true', 'false']);
                        (0, vitest_1.expect)(preact_1.screen.getByRole('article')).toBeTruthy();
                        preact_1.fireEvent.keyDown(window, { key: 'e', metaKey: true });
                        (0, vitest_1.expect)(mode()).toEqual(['true', 'false', 'false']);
                        (0, vitest_1.expect)(body().value).toBe('[[Beta]]');
                        preact_1.fireEvent.keyDown(window, { key: 'e', metaKey: true });
                        preact_1.fireEvent.keyDown(window, { key: 'g', metaKey: true });
                        return [4 /*yield*/, settle()];
                    case 4:
                        _a.sent();
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'false', 'true']);
                        (0, vitest_1.expect)(graph()).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('an archived note shows Read and has no Graph button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'old', title: 'Old plan', body: '- [ ] Scan', isArchived: true })]))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')
                            // Graph was the choice when the archived note opened.
                        ];
                    case 2:
                        _b.sent();
                        // Graph was the choice when the archived note opened.
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 3:
                        // Graph was the choice when the archived note opened.
                        _b.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = (_a = preact_1.fireEvent).click;
                                        return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.notebook.archived(1) })];
                                    case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                                }
                            }); }); })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = (_a = preact_1.fireEvent).click;
                                        return [4 /*yield*/, preact_1.screen.findByRole('button', { name: /^Old plan/ })];
                                    case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                                }
                            }); }); })];
                    case 5:
                        _b.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.archivedLine)];
                    case 6:
                        _a.apply(void 0, [_b.sent()]).toBeTruthy();
                        (0, vitest_1.expect)(preact_1.screen.getByRole('article')).toBeTruthy();
                        (0, vitest_1.expect)(graph()).toBeNull();
                        (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.notebook.write })).toBeNull();
                        (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.notebook.graph })).toBeNull();
                        preact_1.fireEvent.keyDown(window, { key: 'g', metaKey: true });
                        return [4 /*yield*/, settle()];
                    case 7:
                        _b.sent();
                        (0, vitest_1.expect)(graph()).toBeNull();
                        (0, vitest_1.expect)(preact_1.screen.getByRole('article')).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('clicking a note in the graph opens it and stays in Graph', function () { return __awaiter(void 0, void 0, void 0, function () {
            var area, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', body: '[[Beta]] [[Cello]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' }), (0, test_support_1.note)({ id: 'c', title: 'Cello' })]))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, settle()
                            // Alpha is in the middle, Beta at (100, 0) and Cello at (-100, 0).
                        ];
                    case 4:
                        _c.sent();
                        area = graph();
                        preact_1.fireEvent.mouseDown(area, { clientX: 500, clientY: 300, button: 0 });
                        preact_1.fireEvent.mouseUp(area, { clientX: 500, clientY: 300, button: 0 });
                        _a = vitest_1.expect;
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Beta')];
                    case 5:
                        _a.apply(void 0, [_c.sent()]).toBeTruthy();
                        (0, vitest_1.expect)(row('Beta').getAttribute('aria-current')).toBe('true');
                        (0, vitest_1.expect)(row('Alpha').getAttribute('aria-current')).toBeNull();
                        return [4 /*yield*/, settle()];
                    case 6:
                        _c.sent();
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'false', 'true']);
                        (0, vitest_1.expect)((_b = graph()) === null || _b === void 0 ? void 0 : _b.getAttribute('aria-label')).toMatch(/^Graph around Beta/);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('a new empty note made while in Graph shows the map and no template chips', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, settle()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, void preact_1.fireEvent.keyDown(window, { key: 'N', metaKey: true, shiftKey: true })];
                            }); }); })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, settle()];
                    case 6:
                        _b.sent();
                        (0, vitest_1.expect)((_a = graph()) === null || _a === void 0 ? void 0 : _a.getAttribute('aria-label')).toMatch(/^Graph around Untitled/);
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'false', 'true']);
                        (0, vitest_1.expect)(preact_1.screen.queryByRole('group', { name: en_1.t.notebook.templatesLabel })).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("the graph's scope and filters stay while moving between notes", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]))];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, settle()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graphView.oneStep)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graphView.filter)];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('menuitemcheckbox', { name: en_1.t.notebook.graphView.quests }))];
                            }); }); })];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graphView.realm)];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, settle()];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, void preact_1.fireEvent.click(row('Beta'))];
                            }); }); })];
                    case 10:
                        _d.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Beta')];
                    case 11:
                        _a.apply(void 0, [_d.sent()]).toBeTruthy();
                        return [4 /*yield*/, settle()];
                    case 12:
                        _d.sent();
                        (0, vitest_1.expect)((_b = graph()) === null || _b === void 0 ? void 0 : _b.getAttribute('aria-label')).toMatch(/^Graph of the whole realm/);
                        (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.graphView.realm }).getAttribute('aria-pressed')).toBe('true');
                        return [4 /*yield*/, press(en_1.t.notebook.graphView.filter)];
                    case 13:
                        _d.sent();
                        (0, vitest_1.expect)(preact_1.screen.getByRole('menuitemcheckbox', { name: en_1.t.notebook.graphView.quests }).getAttribute('aria-checked')).toBe('false');
                        return [4 /*yield*/, press(en_1.t.notebook.graphView.around)];
                    case 14:
                        _d.sent();
                        return [4 /*yield*/, settle()];
                    case 15:
                        _d.sent();
                        (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.graphView.oneStep }).getAttribute('aria-pressed')).toBe('true');
                        (0, vitest_1.expect)((_c = graph()) === null || _c === void 0 ? void 0 : _c.getAttribute('aria-label')).toMatch(/^Graph around Beta: .* within 1 step$/);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('a new realm starts with no kept points', function () { return __awaiter(void 0, void 0, void 0, function () {
            var notesOf, engine, workspace, _a, before;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        window.location.hash = '#/notes';
                        notesOf = function (key) { return ({
                            // The same ids in both realms, as each realm numbers its own notes; the second has one more.
                            notes: key === KEY
                                ? [(0, test_support_1.note)({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]
                                : [(0, test_support_1.note)({ id: 'a', title: 'Other alpha', body: '[[Other beta]] [[Other cello]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Other beta' }), (0, test_support_1.note)({ id: 'c', title: 'Other cello' })],
                            unreadable: [],
                            folder: FOLDER,
                        }); };
                        engine = (0, test_support_1.fakeEngine)({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ok([(0, test_support_1.projectRow)(KEY), (0, test_support_1.projectRow)('b-000002')])];
                            }); }); }, readNotes: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ok(notesOf(key))];
                            }); }); } }).engine;
                        workspace = (0, workspace_store_1.createWorkspace)(engine);
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                                            return [4 /*yield*/, workspace.start()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, workspace.pick(KEY)];
                            }); }); })];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graphView.realm)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, settle()];
                    case 6:
                        _d.sent();
                        (0, vitest_1.expect)((_b = graph()) === null || _b === void 0 ? void 0 : _b.getAttribute('aria-label')).toMatch(/^Graph of the whole realm/);
                        (0, vitest_1.expect)(layouts.filter(function (input) { return input.centre === null; })).toHaveLength(1);
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, workspace.pick('b-000002')];
                            }); }); })];
                    case 7:
                        _d.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Other alpha')];
                    case 8:
                        _a.apply(void 0, [_d.sent()]).toBeTruthy();
                        before = layouts.length;
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 9:
                        _d.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graphView.realm)];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, settle()];
                    case 11:
                        _d.sent();
                        (0, vitest_1.expect)((_c = layouts.slice(before).find(function (input) { return input.centre === null; })) === null || _c === void 0 ? void 0 : _c.start).toEqual(new Map());
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('Esc in the graph puts the focus on the Graph button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var area;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', body: '[[Beta]]', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'b', title: 'Beta' })]))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, press(en_1.t.notebook.graph)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, settle()];
                    case 4:
                        _a.sent();
                        area = graph();
                        (0, preact_1.act)(function () { return area.focus(); });
                        preact_1.fireEvent.keyDown(area, { key: 'Escape' });
                        (0, vitest_1.expect)(document.activeElement).toBe(toggle().getByRole('button', { name: en_1.t.notebook.graph }));
                        (0, vitest_1.expect)(mode()).toEqual(['false', 'false', 'true']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
(0, vitest_1.describe)('daily notes and the journal', function () {
    // Today is pinned, on this computer's clock, so nothing hangs on the real date.
    var TODAY = '2026-11-20';
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers({ toFake: ['Date'] });
        vitest_1.vi.setSystemTime(new Date(2026, 10, 20, 12));
    });
    var list = function () { return (0, preact_1.within)(preact_1.screen.getByRole('navigation', { name: en_1.t.notebook.title })); };
    var dayField = function () { return preact_1.screen.getByLabelText("".concat(en_1.t.notebook.day, " *")); };
    var titleField = function () { return preact_1.screen.getByLabelText("".concat(en_1.t.notebook.noteTitle, " *")); };
    (0, vitest_1.it)('Today makes today’s note in Journal from the daily template, and pressing it again opens that note with no second note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.todayNoteLabel(TODAY))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledWith(KEY, { title: TODAY, folder: 'Journal', type: 'daily', body: en_1.t.notebook.templates.daily });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe(TODAY); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(body().value).toBe(en_1.t.notebook.templates.daily);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(document.activeElement).toBe(body()); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, press(/^Bug Bounty Helper/)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe('Bug Bounty Helper'); })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.todayNoteLabel(TODAY))];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe(TODAY); })];
                case 9:
                    _a.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the Journal lists the days newest first by month, each with its weekday, and no Rename', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([
                        (0, test_support_1.note)({ id: 'd1', title: '2026-11-03', folder: 'Journal' }),
                        (0, test_support_1.note)({ id: 'd2', title: '2026-11-20', folder: 'Journal' }),
                        (0, test_support_1.note)({ id: 'd3', title: '2026-10-31', folder: 'Ideas' }),
                        (0, test_support_1.note)({ id: 'plan', title: 'Plan', folder: 'Journal' }),
                        (0, test_support_1.note)({ id: 'old', title: '2026-11-01', folder: 'Journal', isArchived: true }),
                    ]))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('2026-10-31')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.journal(3))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(list().getByRole('heading', { level: 2 }).textContent).toBe("".concat(en_1.t.notebook.journalHeader, " 3"));
                    (0, vitest_1.expect)(list().getAllByRole('region').map(function (group) { return [group.getAttribute('aria-label'), (0, preact_1.within)(group).getAllByRole('button', { name: /^2026-/ }).map(function (row) { return row.textContent; })]; })).toEqual([
                        ['Nov 2026', ['2026-11-20Fri 20 Nov', '2026-11-03Tue 3 Nov']],
                        ['Oct 2026', ['2026-10-31Sat 31 Oct']],
                    ]);
                    (0, vitest_1.expect)(list().queryByRole('button', { name: /^Plan/ })).toBeNull();
                    (0, vitest_1.expect)(list().queryByRole('button', { name: en_1.t.notebook.renameFolderLabel('Nov 2026') })).toBeNull();
                    (0, vitest_1.expect)(list().queryByText(en_1.t.notebook.rename)).toBeNull();
                    (0, vitest_1.expect)(list().queryByRole('button', { name: en_1.t.notebook.newNote })).toBeNull();
                    (0, vitest_1.expect)(list().queryByLabelText(en_1.t.notebook.capture)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an empty Journal says how to start it, and a cleared Day shows Day is required. on blur and on submit, making nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.journal(0))];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(list().getByText(en_1.t.notebook.noJournal)).toBeTruthy();
                    (0, vitest_1.expect)(dayField().value).toBe(TODAY);
                    preact_1.fireEvent.input(dayField(), { target: { value: '' } });
                    preact_1.fireEvent.blur(dayField());
                    (0, vitest_1.expect)((_a = document.getElementById('nt-day-error')) === null || _a === void 0 ? void 0 : _a.textContent).toBe(en_1.t.notebook.dayRequired);
                    (0, vitest_1.expect)(dayField().getAttribute('aria-invalid')).toBe('true');
                    (0, vitest_1.expect)(dayField().getAttribute('aria-describedby')).toContain('nt-day-error');
                    preact_1.fireEvent.input(dayField(), { target: { value: '2026-11-18' } });
                    preact_1.fireEvent.blur(dayField());
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.notebook.dayRequired)).toBeNull();
                    preact_1.fireEvent.input(dayField(), { target: { value: '' } });
                    return [4 /*yield*/, press(en_1.t.notebook.openDay)];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.dayRequired)).toBeTruthy();
                    (0, vitest_1.expect)(notes.createNote).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Open day opens a day that is there, makes one that is not, and stays in the Journal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ id: 'a', title: 'Alpha', updated: '2026-11-08' }), (0, test_support_1.note)({ id: 'd', title: '2026-11-02', folder: 'Journal', body: 'Monday words' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.journal(1))];
                case 3:
                    _a.sent();
                    preact_1.fireEvent.input(dayField(), { target: { value: '2026-11-02' } });
                    return [4 /*yield*/, press(en_1.t.notebook.openDay)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe('2026-11-02'); })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(body().value).toBe('Monday words');
                    (0, vitest_1.expect)(notes.createNote).not.toHaveBeenCalled();
                    preact_1.fireEvent.input(dayField(), { target: { value: '2026-11-18' } });
                    return [4 /*yield*/, press(en_1.t.notebook.openDay)];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledWith(KEY, { title: '2026-11-18', folder: 'Journal', type: 'daily', body: en_1.t.notebook.templates.daily });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe('2026-11-18'); })];
                case 7:
                    _a.sent();
                    (0, vitest_1.expect)(list().getByRole('heading', { level: 2 }).textContent).toBe("".concat(en_1.t.notebook.journalHeader, " 2"));
                    (0, vitest_1.expect)((0, preact_1.within)(list().getByRole('region', { name: 'Nov 2026' })).getAllByRole('button', { name: /^2026-/ }).map(function (row) { return row.textContent; })).toEqual(['2026-11-18Wed 18 Nov', '2026-11-02Mon 2 Nov']);
                    (0, vitest_1.expect)(list().getByRole('button', { name: en_1.t.notebook.backToNotes })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a Daily template note’s own text, with {{date}} put in, starts a new day', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)({ id: 'tpl', title: 'daily template', folder: 'Journal', body: '# {{date}}\n\n- [ ] Plan {{ title }}' })]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('daily template')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.todayNoteLabel(TODAY))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledWith(KEY, { title: TODAY, folder: 'Journal', type: 'daily', body: "# ".concat(TODAY, "\n\n- [ ] Plan ").concat(TODAY) });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(body().value).toBe("# ".concat(TODAY, "\n\n- [ ] Plan ").concat(TODAY)); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Edit the daily template makes it in Journal when it is missing, opens it when it is there, and shows the notes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    return [4 /*yield*/, open(notes)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.journal(0))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.editDailyTemplate)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledWith(KEY, { title: 'Daily template', folder: 'Journal', body: en_1.t.notebook.templates.daily });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe('Daily template'); })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(list().getByRole('heading', { level: 2 }).textContent).toBe("".concat(en_1.t.notebook.title, " 2"));
                    (0, vitest_1.expect)((0, preact_1.within)(list().getByRole('region', { name: 'Journal' })).getByRole('button', { name: /^Daily template/ })).toBeTruthy();
                    return [4 /*yield*/, press(/^Bug Bounty Helper/)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe('Bug Bounty Helper'); })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.journal(0))];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.notebook.editDailyTemplate)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titleField().value).toBe('Daily template'); })];
                case 10:
                    _a.sent();
                    (0, vitest_1.expect)(notes.createNote).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(list().getByRole('button', { name: en_1.t.notebook.newNote })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the foot counts Journal and Archived, each opens its list, Back to notes returns, and Archived has no Today', function () { return __awaiter(void 0, void 0, void 0, function () {
        var foot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(memoryNotes([
                        (0, test_support_1.note)({ id: 'a', title: 'Alpha', updated: '2026-11-08' }),
                        (0, test_support_1.note)({ id: 'd', title: '2026-11-19', folder: 'Journal' }),
                        (0, test_support_1.note)({ id: 'x', title: '2026-11-01', isArchived: true }),
                        (0, test_support_1.note)({ id: 'y', title: 'Gone', isArchived: true }),
                    ]))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                case 2:
                    _a.sent();
                    foot = function () { return list().getAllByRole('button', { name: /^(Journal \(|Archived \(|Back to notes)/ }).map(function (button) { return button.textContent; }); };
                    (0, vitest_1.expect)(foot()).toEqual([en_1.t.notebook.journal(1), en_1.t.notebook.archived(2)]);
                    return [4 /*yield*/, press(en_1.t.notebook.archived(2))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(list().getByRole('heading', { level: 2 }).textContent).toBe("".concat(en_1.t.notebook.archivedHeader, " 2"));
                    (0, vitest_1.expect)(foot()).toEqual([en_1.t.notebook.backToNotes]);
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.notebook.todayNoteLabel(TODAY) })).toBeNull();
                    return [4 /*yield*/, press(en_1.t.notebook.backToNotes)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(foot()).toEqual([en_1.t.notebook.journal(1), en_1.t.notebook.archived(2)]);
                    return [4 /*yield*/, press(en_1.t.notebook.journal(1))];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(list().getByRole('heading', { level: 2 }).textContent).toBe("".concat(en_1.t.notebook.journalHeader, " 1"));
                    (0, vitest_1.expect)(foot()).toEqual([en_1.t.notebook.backToNotes]);
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.todayNoteLabel(TODAY) })).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.notebook.backToNotes)];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(list().getByRole('heading', { level: 2 }).textContent).toBe("".concat(en_1.t.notebook.title, " 2"));
                    (0, vitest_1.expect)(list().getByLabelText(en_1.t.notebook.capture)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Export notes and Restore from backup', function () {
    var b = en_1.t.notebook.backup;
    var FOLDER_NAME = 'Notes backup a-000001 2026-11-17';
    var exportDone = function (over) {
        if (over === void 0) { over = {}; }
        return ok(__assign({ folder: FOLDER_NAME, notes: 3, files: 2, skipped: [] }, over));
    };
    var restoreDone = function (over) {
        if (over === void 0) { over = {}; }
        return ok(__assign({ view: { notes: [(0, test_support_1.note)()], unreadable: [], folder: FOLDER }, added: 0, renamed: 0, same: 0, toHistory: 0, files: 0, skipped: [] }, over));
    };
    var failure = function (message) { return ({ ok: false, error: { message: message } }); };
    var link = function (name) { return preact_1.screen.getByRole('button', { name: name }); };
    (0, vitest_1.it)('an export says how many notes and files went into which folder, and that History stays behind', function () { return __awaiter(void 0, void 0, void 0, function () {
        var exportNotes, dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    exportNotes = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, exportDone()];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { exportNotes: exportNotes }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(b.export)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.exportedTitle })];
                case 4:
                    dialog = _a.sent();
                    (0, vitest_1.expect)(exportNotes).toHaveBeenCalledWith(KEY);
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(b.exported(3, 2, FOLDER_NAME))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(b.historyStays)).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).queryByText(b.leftOut(1))).toBeNull();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).queryByRole('listitem')).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(dialog).getByRole('button', { name: b.close }))];
                        }); }); })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(document.activeElement).toBe(link(b.export)); })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an export that left files out lists each with why', function () { return __awaiter(void 0, void 0, void 0, function () {
        var skipped, dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skipped = [
                        { path: 'huge.pdf', reason: 'size' },
                        { path: 'Locked.md', reason: 'unreadable' },
                    ];
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { exportNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, exportDone({ notes: 2, files: 1, skipped: skipped })];
                            }); }); }) }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(b.export)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.exportedTitle })];
                case 4:
                    dialog = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(b.exported(2, 1, FOLDER_NAME))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(b.leftOut(2))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getAllByRole('listitem').map(function (item) { return item.textContent; })).toEqual(["huge.pdf: ".concat(b.reasons.size), "Locked.md: ".concat(b.reasons.unreadable)]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a restore shows only the lines that are not zero, and the list shows the notes it brought back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var back, restoreNotes, dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    back = (0, test_support_1.note)({ id: 'n-back', title: 'From the backup', stamp: 'b-1' });
                    restoreNotes = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, restoreDone({ view: { notes: [(0, test_support_1.note)(), back], unreadable: [], folder: FOLDER }, added: 2, renamed: 1, toHistory: 1, files: 3 })];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { restoreNotes: restoreNotes }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(b.restore)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.restoredTitle })];
                case 4:
                    dialog = _a.sent();
                    (0, vitest_1.expect)(restoreNotes).toHaveBeenCalledWith(KEY);
                    (0, vitest_1.expect)(__spreadArray([], dialog.querySelectorAll('p.form-line'), true).map(function (line) { return line.textContent; })).toEqual([b.added(2, 3), b.renamed(1), b.toHistory(1)]);
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).queryByText(b.nothingNew)).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: /From the backup/ })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a restore of notes that are all here already says so in one line', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { restoreNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, restoreDone({ same: 4 })];
                        }); }); }) }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(b.restore)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.restoredTitle })];
                case 4:
                    dialog = _a.sent();
                    (0, vitest_1.expect)(__spreadArray([], dialog.querySelectorAll('p.form-line'), true).map(function (line) { return line.textContent; })).toEqual([b.nothingNew]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a restore that left items out lists each with why, under what it did bring back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var skipped, dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    skipped = [
                        { path: 'attachments/abc.png', reason: 'damaged' },
                        { path: 'table.csv', reason: 'taken' },
                    ];
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { restoreNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, restoreDone({ same: 2, skipped: skipped })];
                            }); }); }) }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(b.restore)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.restoredTitle })];
                case 4:
                    dialog = _a.sent();
                    (0, vitest_1.expect)(__spreadArray([], dialog.querySelectorAll('p.form-line'), true).map(function (line) { return line.textContent; })).toEqual([b.same(2), b.leftOut(2)]);
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getAllByRole('listitem').map(function (item) { return item.textContent; })).toEqual(["attachments/abc.png: ".concat(b.reasons.damaged), "table.csv: ".concat(b.reasons.taken)]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a cancelled folder picker opens no dialog and leaves both links ready', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, exportNotes, restoreNotes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    exportNotes = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(null)];
                    }); }); });
                    restoreNotes = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(null)];
                    }); }); });
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { exportNotes: exportNotes, restoreNotes: restoreNotes }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(b.export)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)([link(b.export).disabled, link(b.restore).disabled]).toEqual([false, false]); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(b.exporting)).toBeNull();
                    return [4 /*yield*/, press(b.restore)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)([link(b.export).disabled, link(b.restore).disabled]).toEqual([false, false]); })];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(exportNotes).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(restoreNotes).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(b.restoring)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('while one works, a line with a spinner says so and both links wait', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { exportNotes: never }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(b.export)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)((_a = preact_1.screen.getByText(b.exporting).closest('[role="status"]')) === null || _a === void 0 ? void 0 : _a.querySelector('.spinner')).toBeTruthy();
                    (0, vitest_1.expect)([link(b.export).disabled, link(b.restore).disabled]).toEqual([true, true]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed export says why in its dialog, and Try again asks again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var message, exportNotes, failed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    message = 'Nothing was saved. Check that the disk is connected, has free space and lets you save there, then try again.';
                    exportNotes = vitest_1.vi.fn().mockResolvedValueOnce(failure(message)).mockResolvedValueOnce(exportDone());
                    return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([(0, test_support_1.note)()])), { exportNotes: exportNotes }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(b.export)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.exportFailed })];
                case 4:
                    failed = _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(failed).getByRole('alert').textContent).toBe(message);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(failed).getByRole('button', { name: en_1.t.failed.tryAgain }))];
                        }); }); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(exportNotes).toHaveBeenCalledTimes(2);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.exportedTitle })];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed restore says why, re-reads the notes it may have added, and Close puts it away', function () { return __awaiter(void 0, void 0, void 0, function () {
        var notes, message, reads, failed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notes = memoryNotes([(0, test_support_1.note)()]);
                    message = 'Restoring stopped. Notes already restored are kept; trying again adds only the rest.';
                    return [4 /*yield*/, open(__assign(__assign({}, notes), { restoreNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, failure(message)];
                            }); }); }) }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Bug Bounty Helper')];
                case 2:
                    _a.sent();
                    reads = notes.readNotes.mock.calls.length;
                    return [4 /*yield*/, press(b.restore)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.restoreFailed })];
                case 4:
                    failed = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(failed).getByRole('alert').textContent).toBe(message);
                    (0, vitest_1.expect)(notes.readNotes.mock.calls.length).toBeGreaterThan(reads);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(failed).getByRole('button', { name: b.close }))];
                        }); }); })];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a realm with no notes yet still offers both, and says there is nothing to export', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open(__assign(__assign({}, memoryNotes([])), { exportNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, failure('This realm has no notes to export yet.')];
                        }); }); }) }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.emptyTitle('a'))];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)([link(b.export).disabled, link(b.restore).disabled]).toEqual([false, false]);
                    return [4 /*yield*/, press(b.export)];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = preact_1.within;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: b.exportFailed })];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).getByRole('alert').textContent]).toBe('This realm has no notes to export yet.');
                    return [2 /*return*/];
            }
        });
    }); });
});
