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
var app_1 = require("../../../app/app");
var en_1 = require("../../../l10n/en");
var test_support_1 = require("../../../test_support");
var workspace_store_1 = require("../../workspace/state_management/workspace_store");
var KEY = 'a-000001';
var IMAGE = "attachments/".concat('a1'.repeat(32), ".png");
var PDF = "attachments/".concat('b2'.repeat(32), ".pdf");
var OTHER = "attachments/".concat('c3'.repeat(32), ".png");
var png = function (name) {
    if (name === void 0) { name = 'mock.png'; }
    return new File(['image'], name, { type: 'image/png' });
};
var pdf = function (name) {
    if (name === void 0) { name = 'spec.pdf'; }
    return new File(['%PDF-1.4'], name, { type: 'application/pdf' });
};
var saved = function (path) { return ({ ok: true, data: { path: path, kind: path.endsWith('.pdf') ? 'pdf' : 'image' } }); };
var later = function () {
    var done = function () { };
    var promise = new Promise(function (resolve) { done = resolve; });
    return { promise: promise, done: done };
};
// One quest in the realm. Its edits land in the record and come back in the
// view, as main's do.
var open = function (description_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([description_1], args_1, true), void 0, function (description, over) {
        var row, view, editQuest, engine, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    row = (0, test_support_1.quest)({ id: 'first', title: 'First quest', description: description });
                    view = function () { return (0, test_support_1.projectView)(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: row }] }); };
                    editQuest = vitest_1.vi.fn(function (_key, _id, edit) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            row = __assign(__assign(__assign({}, row), edit), { testProfile: row.testProfile });
                            return [2 /*return*/, { ok: true, data: view() }];
                        });
                    }); });
                    engine = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view() })];
                        }); }); }, editQuest: editQuest, attachNoteFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, saved(IMAGE)];
                        }); }); }) }, over)).engine;
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
                    return [2 /*return*/, { engine: engine, record: function () { return row; } }];
            }
        });
    });
};
var pane = function () { return document.querySelector('.detail'); };
var box = function () { return (0, preact_1.within)(pane()).getByRole('textbox', { name: en_1.t.detail.description }); };
var pick = function () {
    var files = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        files[_i] = arguments[_i];
    }
    return preact_1.fireEvent.change((0, preact_1.within)(pane()).getByLabelText(en_1.t.files.attachFile), { target: { files: files } });
};
var drop = function () {
    var files = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        files[_i] = arguments[_i];
    }
    return preact_1.fireEvent.drop(box().closest('.nt-dropzone'), { dataTransfer: { files: files } });
};
(0, vitest_1.beforeEach)(function () {
    window.location.hash = '#/quests';
});
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)("a file in a quest's description", function () {
    (0, vitest_1.it)('picked, is kept for the realm, says it is attaching, then is saved once with its link at the end', function () { return __awaiter(void 0, void 0, void 0, function () {
        var upload, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    upload = later();
                    return [4 /*yield*/, open('Why it matters', { attachNoteFile: vitest_1.vi.fn(function () { return upload.promise; }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    pick(png());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.attachNoteFile).toHaveBeenCalledWith(KEY, null, vitest_1.expect.objectContaining({ name: 'mock.png', type: 'image/png', bytes: vitest_1.expect.any(Uint8Array) })); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(pane().textContent).toContain(en_1.t.files.attaching('mock.png'));
                    (0, vitest_1.expect)(engine.editQuest).not.toHaveBeenCalled();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, upload.done(saved(IMAGE))];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledTimes(1); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: "Why it matters\n![mock.png](<".concat(IMAGE, ">)\n") });
                    (0, vitest_1.expect)(pane().textContent).toContain(en_1.t.files.attached);
                    (0, vitest_1.expect)(box().value).toBe("Why it matters\n![mock.png](<".concat(IMAGE, ">)\n"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('dropped on an empty description, becomes its first line', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(null, { attachNoteFile: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, saved(PDF)];
                        }); }); }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    drop(pdf());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: "[spec.pdf](<".concat(PDF, ">)\n") }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.attachNoteFile).toHaveBeenCalledWith(KEY, null, vitest_1.expect.objectContaining({ name: 'spec.pdf' }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('pasted while the box has focus, goes in at the caret and the caret moves past it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, text, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('First line\nSecond line')];
                case 1:
                    engine = (_a.sent()).engine;
                    text = box();
                    text.focus();
                    text.setSelectionRange(11, 11);
                    preact_1.fireEvent.paste(text, { clipboardData: { files: [png()] } });
                    next = "First line\n![mock.png](<".concat(IMAGE, ">)\nSecond line");
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: next }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(box().value).toBe(next);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(box().selectionStart).toBe(next.indexOf('Second line')); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('dropped just after typing, keeps what was typed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(null)];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.input(box(), { target: { value: 'Half a thought' } });
                    drop(png());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: "Half a thought\n![mock.png](<".concat(IMAGE, ">)\n") }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('landing while the typed text is still saving, keeps that text', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    first = later();
                    return [4 /*yield*/, open(null)];
                case 1:
                    engine = (_a.sent()).engine;
                    vitest_1.vi.mocked(engine.editQuest).mockImplementationOnce(function () { return first.promise; });
                    preact_1.fireEvent.input(box(), { target: { value: 'Typed' } });
                    preact_1.fireEvent.blur(box());
                    drop(png());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledTimes(2); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(vitest_1.vi.mocked(engine.editQuest).mock.calls.map(function (call) { return call[2]; })).toEqual([{ description: 'Typed' }, { description: "Typed\n![mock.png](<".concat(IMAGE, ">)\n") }]);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, first.done({ ok: true, data: (0, test_support_1.projectView)(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'first', title: 'First quest', description: 'Typed' }) }] }) })];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('in a batch, every file keeps its link', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, record;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('Two of them')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, record = _a.record;
                    vitest_1.vi.mocked(engine.attachNoteFile).mockResolvedValueOnce(saved(IMAGE)).mockResolvedValueOnce(saved(PDF));
                    drop(png(), pdf());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledTimes(2); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(record().description).toBe("Two of them\n![mock.png](<".concat(IMAGE, ">)\n[spec.pdf](<").concat(PDF, ">)\n"));
                    return [2 /*return*/];
            }
        });
    }); });
    // Main answers edits in the order they were sent, and each answer is
    // adopted as it lands, so an older answer can arrive after a newer save.
    (0, vitest_1.it)('in a batch dropped while typed text is saving, keeps the text and every link whenever the saves come back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row, view, answers, editQuest, second, attachNoteFile, engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    row = (0, test_support_1.quest)({ id: 'first', title: 'First quest', description: null });
                    view = function () { return (0, test_support_1.projectView)(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: row }] }); };
                    answers = [];
                    editQuest = vitest_1.vi.fn(function (_key, _id, edit) { return new Promise(function (resolve) {
                        answers.push(function () {
                            row = __assign(__assign(__assign({}, row), edit), { testProfile: row.testProfile });
                            resolve({ ok: true, data: view() });
                        });
                    }); });
                    second = later();
                    attachNoteFile = vitest_1.vi.fn().mockResolvedValueOnce(saved(IMAGE)).mockImplementationOnce(function () { return second.promise; });
                    engine = (0, test_support_1.fakeEngine)({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view() })];
                        }); }); }, editQuest: editQuest, attachNoteFile: attachNoteFile }).engine;
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
                    preact_1.fireEvent.input(box(), { target: { value: 'Typed' } });
                    preact_1.fireEvent.blur(box());
                    drop(png(), png('other.png'));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(editQuest).toHaveBeenCalledTimes(2); })
                        // The typed text's save comes back before the second file is in.
                    ];
                case 2:
                    _a.sent();
                    // The typed text's save comes back before the second file is in.
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, answers[0]()];
                        }); }); })];
                case 3:
                    // The typed text's save comes back before the second file is in.
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, second.done(saved(OTHER))];
                        }); }); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(editQuest).toHaveBeenCalledTimes(3); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, answers[1]()];
                        }); }); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, answers[2]()];
                        }); }); })];
                case 7:
                    _a.sent();
                    (0, vitest_1.expect)(editQuest.mock.calls.at(-1)[2]).toEqual({ description: "Typed\n![mock.png](<".concat(IMAGE, ">)\n![other.png](<").concat(OTHER, ">)\n") });
                    (0, vitest_1.expect)(row.description).toBe("Typed\n![mock.png](<".concat(IMAGE, ">)\n![other.png](<").concat(OTHER, ">)\n"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('that fails to attach, says so with Try again and leaves the description as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
        var message, engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    message = "Couldn't attach this file. Your quest is unchanged. Try again.";
                    return [4 /*yield*/, open('Why it matters')];
                case 1:
                    engine = (_b.sent()).engine;
                    vitest_1.vi.mocked(engine.attachNoteFile).mockResolvedValueOnce({ ok: false, error: { message: message } });
                    pick(png());
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByRole('alert')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).textContent]).toContain(message);
                    (0, vitest_1.expect)(engine.editQuest).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(box().value).toBe('Why it matters');
                    preact_1.fireEvent.click((0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.failed.tryAgain }));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: "Why it matters\n![mock.png](<".concat(IMAGE, ">)\n") }); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['the Attach file… button', function () { return (0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.files.attachFile }); }],
        ["a preview's Download button", function () { return (0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.files.downloadFile('mock.png') }); }],
    ])('a web link pasted while %s has focus leaves the description alone', function (_where, target) { return __awaiter(void 0, void 0, void 0, function () {
        var engine, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open("Why it matters\n![mock.png](<".concat(IMAGE, ">)"))];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByAltText('mock.png')];
                case 2:
                    _a.sent();
                    button = target();
                    button.focus();
                    preact_1.fireEvent.paste(button, { clipboardData: { files: [], getData: function (type) { return (type === 'text/plain' ? 'https://example.com/post' : ''); } } });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 50); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.editQuest).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(box().value).toBe("Why it matters\n![mock.png](<".concat(IMAGE, ">)"));
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a text file', new File(['words'], 'notes.txt', { type: 'text/plain' }), en_1.t.files.fileType],
        ['a 12 MB image', new File([new Uint8Array(12 * 1024 * 1024)], 'huge.png', { type: 'image/png' }), en_1.t.files.fileSize],
    ])('that is %s, shows why under the box and asks the engine nothing', function (_kind, file, message) { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('Why it matters')];
                case 1:
                    engine = (_b.sent()).engine;
                    pick(file);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByRole('alert')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).textContent]).toContain(message);
                    (0, vitest_1.expect)(engine.attachNoteFile).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(engine.editQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("the description's previews", function () {
    (0, vitest_1.it)('show one per linked file, in order, and one goes when its link is deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open("Look:\n![mock.png](<".concat(IMAGE, ">)\n[spec.pdf](<").concat(PDF, ">)\n[site](https://example.com)"))];
                case 1:
                    engine = (_c.sent()).engine;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByAltText('mock.png')];
                case 2:
                    _a.apply(void 0, [(_c.sent()).getAttribute('src')]).toBe("note-file://realm/".concat(KEY, "/").concat(IMAGE));
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByRole('button', { name: en_1.t.files.previewPdfName('spec.pdf') })];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getAllByRole('button', { name: /^Download / }).map(function (button) { return button.getAttribute('aria-label'); })).toEqual([en_1.t.files.downloadFile('mock.png'), en_1.t.files.downloadFile('spec.pdf')]);
                    (0, vitest_1.expect)(engine.readNoteFile).toHaveBeenCalledWith(KEY, IMAGE);
                    (0, vitest_1.expect)(engine.readNoteFile).toHaveBeenCalledWith(KEY, PDF);
                    preact_1.fireEvent.input(box(), { target: { value: "Look:\n[spec.pdf](<".concat(PDF, ">)") } });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(pane()).queryByAltText('mock.png')).toBe(null); })];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.files.downloadFile('spec.pdf') })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a description with no saved file shows no previews', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('Just words, and [a site](https://example.com)')];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(document.querySelector('.d-files')).toBe(null);
                    (0, vitest_1.expect)(engine.readNoteFile).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a missing file names itself, says what went wrong, and Try again can bring it back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, missing, readNoteFile, alert, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)().engine;
                    missing = "Couldn't read this file. Check that it is still in the notes folder, then try again.";
                    readNoteFile = vitest_1.vi.fn(engine.readNoteFile).mockResolvedValueOnce({ ok: false, error: { message: missing } });
                    return [4 /*yield*/, open("![mock.png](<".concat(IMAGE, ">)"), { readNoteFile: readNoteFile })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByRole('alert')];
                case 2:
                    alert = _b.sent();
                    (0, vitest_1.expect)(alert.textContent).toContain("mock.png: ".concat(missing));
                    preact_1.fireEvent.click((0, preact_1.within)(alert).getByRole('button', { name: en_1.t.failed.tryAgain }));
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByAltText('mock.png')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a file in New quest', function () {
    var dialog = function () { return preact_1.screen.getByRole('dialog'); };
    var openSheet = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(null, over)];
                    case 1:
                        opened = _a.sent();
                        preact_1.fireEvent.click(preact_1.screen.getAllByRole('button', { name: en_1.t.actions.newQuest })[0]);
                        return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByLabelText("".concat(en_1.t.form.title, " *"))).toBeTruthy(); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    var description = function () { return (0, preact_1.within)(dialog()).getByLabelText(en_1.t.form.description); };
    var attach = function () {
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return preact_1.fireEvent.change((0, preact_1.within)(dialog()).getByLabelText(en_1.t.files.attachFile), { target: { files: files } });
    };
    var submit = function () { return preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.actions.add })); };
    (0, vitest_1.it)('goes at the end of the description, with its preview under it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, openSheet()];
                case 1:
                    engine = (_b.sent()).engine;
                    preact_1.fireEvent.input(description(), { target: { value: 'Like this' } });
                    attach(png());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(description().value).toBe("Like this\n![mock.png](<".concat(IMAGE, ">)\n")); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.attachNoteFile).toHaveBeenCalledWith(KEY, null, vitest_1.expect.objectContaining({ name: 'mock.png' }));
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(dialog()).findByAltText('mock.png')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).getAttribute('src')]).toBe("note-file://realm/".concat(KEY, "/").concat(IMAGE));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('still attaching holds the filing with a line under Description, and once in, the quest files with its link', function () { return __awaiter(void 0, void 0, void 0, function () {
        var upload, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    upload = later();
                    return [4 /*yield*/, openSheet({ attachNoteFile: vitest_1.vi.fn(function () { return upload.promise; }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.input((0, preact_1.within)(dialog()).getByLabelText("".concat(en_1.t.form.title, " *")), { target: { value: 'With a mock' } });
                    attach(png());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(dialog().textContent).toContain(en_1.t.files.attaching('mock.png')); })];
                case 2:
                    _a.sent();
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.stillAttaching)).toBeTruthy(); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(description().getAttribute('aria-invalid')).toBe('true');
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, upload.done(saved(IMAGE))];
                        }); }); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).queryByText(en_1.t.form.stillAttaching)).toBe(null); })];
                case 5:
                    _a.sent();
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ title: 'With a mock', description: "![mock.png](<".concat(IMAGE, ">)") })); })];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
