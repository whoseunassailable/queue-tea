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
var FIRST = (0, test_support_1.quest)({ id: 'first', title: 'First quest', isStar: true, why: 'mid', priority: 'mid' });
var SECOND = (0, test_support_1.quest)({ id: 'second', title: 'Second quest', priority: 'high' });
var SAGA = { kind: 'saga', quest: (0, test_support_1.quest)({ id: 'saga', title: 'The saga' }), chapters: [(0, test_support_1.quest)({ id: 'chapter', title: 'A chapter', parentId: 'saga' })], progress: { done: 0, total: 1, current: 0, blocked: 0 }, hasStar: false };
var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: SECOND }, SAGA], canStart: 4 });
var CHOICES = {
    features: [{ id: 'saga', title: 'The saga', detail: '0/1 done' }],
    lone: [{ id: 'second', title: 'Second quest', detail: null }],
    parents: [{ id: 'saga', title: 'The saga', detail: '0/1 done' }],
    waitFor: [{ id: 'second', title: 'Second quest', detail: null }],
};
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over, view) {
        var engine, workspace;
        if (over === void 0) { over = {}; }
        if (view === void 0) { view = BOARD; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view })];
                        }); }); }, readChoices: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: CHOICES })];
                        }); }); } }, over)).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    // Inside act, so the page's effects have run and its keys are listening.
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
                    // Inside act, so the page's effects have run and its keys are listening.
                    _a.sent();
                    return [2 /*return*/, { engine: engine, workspace: workspace }];
            }
        });
    });
};
var key = function (name, over) {
    if (over === void 0) { over = {}; }
    return preact_1.fireEvent.keyDown(document.body, __assign({ key: name }, over));
};
var dialog = function () { return preact_1.screen.getByRole('dialog'); };
(0, vitest_1.beforeEach)(function () {
    window.location.hash = '#/quests';
});
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('the priority chip', function () {
    (0, vitest_1.it)('opens its five choices and saves the one picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getAllByRole('button', { name: en_1.t.edit.priorityOf('Second quest', 'High') })[0]);
                    preact_1.fireEvent.click(preact_1.screen.getByRole('menuitemradio', { name: /Urgent/ }));
                    (0, vitest_1.expect)(engine.setPriority).toHaveBeenCalledWith(KEY, 'second', 'urgent');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('picking the same priority writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getAllByRole('button', { name: en_1.t.edit.priorityOf('Second quest', 'High') })[0]);
                    preact_1.fireEvent.click(preact_1.screen.getByRole('menuitemradio', { name: /High/ }));
                    (0, vitest_1.expect)(engine.setPriority).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the keys on the board', function () {
    (0, vitest_1.it)('move the selection and act on it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    key('ArrowDown');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { var _a; return (0, vitest_1.expect)((_a = document.querySelector('.qrow.sel .qc-title')) === null || _a === void 0 ? void 0 : _a.textContent).toBe('Second quest'); })];
                case 2:
                    _a.sent();
                    key('1');
                    (0, vitest_1.expect)(engine.setPriority).toHaveBeenCalledWith(KEY, 'second', 'urgent');
                    key('f');
                    (0, vitest_1.expect)(engine.togglePlayNext).toHaveBeenCalledWith(KEY, 'second');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('x removes a plain quest at once, with Undo offered', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    key('x');
                    (0, vitest_1.expect)(engine.removeQuest).toHaveBeenCalledWith(KEY, 'first');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.edit.undo })).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘Z undoes the last edit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    key('x');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.edit.undo })).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    key('z', { metaKey: true });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.restoreQuest).toHaveBeenCalledWith(KEY, 'first'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('letters type normally inside a text field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    box = preact_1.screen.getByRole('textbox', { name: en_1.t.actions.addCriterion });
                    preact_1.fireEvent.keyDown(box, { key: 'x' });
                    preact_1.fireEvent.keyDown(box, { key: '1' });
                    (0, vitest_1.expect)(engine.removeQuest).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(engine.setPriority).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stay out of the way while a sheet is open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    key('k');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(dialog()).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    key('x');
                    (0, vitest_1.expect)(engine.removeQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('sagas', function () {
    (0, vitest_1.it)('fold, and the fold survives in the settings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_b.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.fold('The saga') }));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByText('A chapter')).toBe(null); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.actions.addChildTask('The saga') }).closest('.qrow')).toBeTruthy();
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ folds: (_a = {}, _a[KEY] = ['saga'], _a) });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a folded saga holding the ★ still shows it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var star, view;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    star = (0, test_support_1.quest)({ id: 'star', title: 'Star chapter', isStar: true, why: 'urgent', parentId: 'saga' });
                    view = (0, test_support_1.projectView)(KEY, { canStart: 1, ready: [__assign(__assign({}, SAGA), { chapters: [star], hasStar: true })] });
                    return [4 /*yield*/, open({ readSettings: function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    return [2 /*return*/, ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: (_a = {}, _a[KEY] = ['saga'], _a), terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } })];
                                });
                            }); } }, view)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.qrow .qc-title')) === null || _a === void 0 ? void 0 : _a.textContent).toBe('The saga');
                    (0, vitest_1.expect)(preact_1.screen.getByText('★ Star chapter · urgent')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('take a chapter inline, which counts as the pick', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.addChapter }));
                    box = preact_1.screen.getByLabelText(en_1.t.form.chapterHint('The saga'));
                    preact_1.fireEvent.input(box, { target: { value: 'One more' } });
                    preact_1.fireEvent.keyDown(box, { key: 'Enter' });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalled(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ title: 'One more', parent: { kind: 'task', id: 'saga' } }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a blank chapter says what is wrong and files nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.addChapter }));
                    preact_1.fireEvent.keyDown(preact_1.screen.getByLabelText(en_1.t.form.chapterHint('The saga')), { key: 'Enter' });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.form.titleRequired)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('New quest', function () {
    var openSheet = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over, view) {
            var opened;
            if (over === void 0) { over = {}; }
            if (view === void 0) { view = BOARD; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(over, view)];
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
    var title = function () { return (0, preact_1.within)(dialog()).getByLabelText("".concat(en_1.t.form.title, " *")); };
    var submit = function () { return preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.actions.add })); };
    (0, vitest_1.it)('files with Tea-DD on unless changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.input(title(), { target: { value: 'A new quest' } });
                    preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.helpers.use('Commit Chai-n') }));
                    preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.helpers.use('Tea-DD') }));
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ helpers: ['commit-chai-n'] })); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens with ⌘N too', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a.sent();
                    key('n', { metaKey: true });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(dialog()).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a required title as soon as the field is left', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet()];
                case 1:
                    _a.sent();
                    preact_1.fireEvent.blur(title());
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.titleRequired)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(title().getAttribute('aria-invalid')).toBe('true');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the button enabled, and pressing it shows every error and saves nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet({}, (0, test_support_1.projectView)(KEY, { activeSaga: 'The saga', activeSagaId: 'saga' }))];
                case 1:
                    engine = (_a.sent()).engine;
                    button = (0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.actions.add });
                    (0, vitest_1.expect)(button.disabled).toBe(false);
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.titleRequired)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.pickPart)).toBeTruthy();
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with an active saga, waits for Part of to be answered', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet({}, (0, test_support_1.projectView)(KEY, { activeSaga: 'The saga', activeSagaId: 'saga' }))];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.input(title(), { target: { value: 'New one' } });
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.pickPart)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('radio', { name: /The saga/ }));
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ parent: { kind: 'task', id: 'saga' } })); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('New saga makes its title required', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.input(title(), { target: { value: 'New one' } });
                    preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('radio', { name: en_1.t.form.newSaga }));
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.sagaRequired)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('files the quest, closes, and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.input(title(), { target: { value: 'New one' } });
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBe(null); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ title: 'New one', priority: 'mid', difficulty: 'medium', parent: { kind: 'none' } }));
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.edit.queued('New one', 'Mid', null))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('adds a child task using the plus inside a newly filed quest card', function () { return __awaiter(void 0, void 0, void 0, function () {
        var parent, child, fileQuest, add, pickedParent;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    parent = (0, test_support_1.quest)({ id: 'filed-parent', title: 'New one' });
                    child = (0, test_support_1.quest)({ id: 'child', title: 'First chapter', parentId: parent.id });
                    fileQuest = vitest_1.vi.fn()
                        .mockResolvedValueOnce({ ok: true, data: (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: parent }] }) })
                        .mockResolvedValueOnce({ ok: true, data: (0, test_support_1.projectView)(KEY, {
                            ready: [{ kind: 'saga', quest: parent, chapters: [child], progress: { done: 0, total: 1, current: 0, blocked: 0 }, hasStar: false }],
                        }) });
                    return [4 /*yield*/, openSheet({ fileQuest: fileQuest })];
                case 1:
                    _d.sent();
                    preact_1.fireEvent.input(title(), { target: { value: parent.title } });
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBe(null); })];
                case 2:
                    _d.sent();
                    add = preact_1.screen.getByRole('button', { name: en_1.t.actions.addChildTask(parent.title) });
                    (0, vitest_1.expect)((_a = add.textContent) === null || _a === void 0 ? void 0 : _a.trim()).toBe('+');
                    (0, vitest_1.expect)((_c = (_b = add.closest('.qrow')) === null || _b === void 0 ? void 0 : _b.querySelector('.qc-title')) === null || _c === void 0 ? void 0 : _c.textContent).toBe(parent.title);
                    preact_1.fireEvent.click(add);
                    return [4 /*yield*/, (0, preact_1.within)(dialog()).findByRole('radio', { name: parent.title })];
                case 3:
                    pickedParent = _d.sent();
                    (0, vitest_1.expect)(pickedParent.checked).toBe(true);
                    preact_1.fireEvent.input(title(), { target: { value: child.title } });
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBe(null); })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { var _a; return (0, vitest_1.expect)((_a = document.querySelector('.qrow.child .qc-title')) === null || _a === void 0 ? void 0 : _a.textContent).toBe(child.title); })];
                case 5:
                    _d.sent();
                    (0, vitest_1.expect)(fileQuest).toHaveBeenNthCalledWith(2, KEY, vitest_1.expect.objectContaining({ title: child.title, parent: { kind: 'task', id: parent.id } }));
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.edit.queued(child.title, 'Mid', parent.title))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.actions.addChildTask(parent.title) }).closest('.qrow')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.actions.addChildTask(child.title) })).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays open and shows the failure when the save fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet({ fileQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'That saga is no longer open. Pick again.' } })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    preact_1.fireEvent.input(title(), { target: { value: 'New one' } });
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByRole('alert').textContent).toContain('That saga is no longer open.'); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(title().value).toBe('New one');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a loading line, then a way back, when the choices fail', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet({ readChoices: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'Could not read.' } })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByRole('alert').textContent).toContain('Could not read.');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Esc cancels', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSheet()];
                case 1:
                    _a.sent();
                    key('Escape');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBe(null); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Seal…', function () {
    var openSeal = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(over)];
                    case 1:
                        opened = _a.sent();
                        preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.seal }));
                        return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.sealAsk('First quest'))).toBeTruthy(); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    var submit = function () { return preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.actions.sealIt })); };
    (0, vitest_1.it)('lists only what it may wait for, and seals with the pick', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, openSeal()];
                case 1:
                    engine = (_c.sent()).engine;
                    _b = (_a = preact_1.fireEvent).click;
                    return [4 /*yield*/, (0, preact_1.within)(dialog()).findByRole('radio', { name: 'Second quest' })];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.sealQuest).toHaveBeenCalledWith(KEY, 'first', { waitFor: 'second' }); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(document.body).queryAllByRole('radio', { name: 'The saga' })).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('seals with a reason', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSeal()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.input((0, preact_1.within)(dialog()).getByLabelText(en_1.t.form.reason), { target: { value: 'waiting for the clinic' } });
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.sealQuest).toHaveBeenCalledWith(KEY, 'first', { reason: 'waiting for the clinic' }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('wants one or the other', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openSeal()];
                case 1:
                    engine = (_a.sent()).engine;
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.sealRequired)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.sealQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a filter with no match says what to try', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, openSeal()];
                case 1:
                    _c.sent();
                    _b = (_a = preact_1.fireEvent).input;
                    return [4 /*yield*/, (0, preact_1.within)(dialog()).findByLabelText(en_1.t.form.filter)];
                case 2:
                    _b.apply(_a, [_c.sent(), { target: { value: 'zzz' } }]);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.noFilterMatch)).toBeTruthy(); })];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Unseal shows on a sealed quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    view = (0, test_support_1.projectView)(KEY, { sealedCount: 1, sealed: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 's', title: 'Stuck', sealedBecause: 'later' }) }] });
                    return [4 /*yield*/, open({}, view)];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.unseal }));
                    (0, vitest_1.expect)(engine.unsealQuest).toHaveBeenCalledWith(KEY, 's');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Part of…', function () {
    var openMove = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(over)];
                    case 1:
                        opened = _a.sent();
                        preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.partOf }));
                        return [4 /*yield*/, (0, preact_1.within)(dialog()).findByRole('radio', { name: /The saga/ })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    var submit = function () { return preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.actions.move })); };
    (0, vitest_1.it)('asks first, saying what stays the same', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openMove()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('radio', { name: /The saga/ }));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.moveLine('First quest', 'The saga'))).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.moveQuest).not.toHaveBeenCalled();
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.moveQuest).toHaveBeenCalledWith(KEY, 'first', 'saga'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('wants a pick', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openMove()];
                case 1:
                    engine = (_a.sent()).engine;
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.pickMove)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.moveQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a refused move shows the sentence and stays open', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openMove({ moveQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "First quest has chapters of its own, so it can't be part of another saga." } })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('radio', { name: /The saga/ }));
                    submit();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText("First quest has chapters of its own, so it can't be part of another saga.")).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Remove…', function () {
    (0, vitest_1.it)('a saga asks first, saying what happens to its chapters', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByText('The saga'));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { var _a; return (0, vitest_1.expect)((_a = document.querySelector('.detail .title-btn')) === null || _a === void 0 ? void 0 : _a.textContent).toBe('The saga'); })];
                case 2:
                    _a.sent();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.remove }));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(dialog()).getByText(en_1.t.form.removeLine(1))).toBeTruthy(); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.removeQuest).not.toHaveBeenCalled();
                    preact_1.fireEvent.click((0, preact_1.within)(dialog()).getByRole('button', { name: en_1.t.actions.removeIt }));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.removeQuest).toHaveBeenCalledWith(KEY, 'saga'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the detail pane', function () {
    (0, vitest_1.it)('changes the title on click, and refuses a blank one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.editTitle('First quest') }));
                    box = (0, preact_1.within)(document.querySelector('.detail')).getByLabelText("".concat(en_1.t.form.title, " *"));
                    preact_1.fireEvent.input(box, { target: { value: '   ' } });
                    preact_1.fireEvent.blur(box);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.form.titleRequired)).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.editQuest).not.toHaveBeenCalled();
                    preact_1.fireEvent.input(box, { target: { value: 'Better title' } });
                    preact_1.fireEvent.keyDown(box, { key: 'Enter' });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { title: 'Better title' }); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a change on disk leaves a description being typed alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var title, engine, workspace, box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    title = 'First quest';
                    engine = (0, test_support_1.fakeEngine)({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: __assign(__assign({}, FIRST), { title: title }) }] }) })];
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
                    _a.sent();
                    box = preact_1.screen.getByRole('textbox', { name: en_1.t.detail.description });
                    preact_1.fireEvent.input(box, { target: { value: 'Half a thought' } });
                    title = 'Renamed in a session';
                    return [4 /*yield*/, (0, preact_1.act)(function () { return workspace.refresh(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.actions.editTitle('Renamed in a session') })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('textbox', { name: en_1.t.detail.description }).value).toBe('Half a thought');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves the description when the field is left', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    box = preact_1.screen.getByRole('textbox', { name: en_1.t.detail.description });
                    preact_1.fireEvent.input(box, { target: { value: 'Why it matters' } });
                    preact_1.fireEvent.blur(box);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: 'Why it matters' }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('adds and removes a criterion', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, engine, box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    view = (0, test_support_1.projectView)(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: __assign(__assign({}, FIRST), { criteria: ['Old one'] }) }] });
                    return [4 /*yield*/, open({ editQuest: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: view })];
                            }); }); }) }, view)];
                case 1:
                    engine = (_a.sent()).engine;
                    box = preact_1.screen.getByRole('textbox', { name: en_1.t.actions.addCriterion });
                    preact_1.fireEvent.input(box, { target: { value: 'New one' } });
                    preact_1.fireEvent.keyDown(box, { key: 'Enter' });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { criteria: ['Old one', 'New one'] }); })];
                case 2:
                    _a.sent();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.removeCriterion('Old one') }));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenLastCalledWith(KEY, 'first', { criteria: [] }); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('makes a quest the active saga and turns it off', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, again;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.makeSaga }));
                    (0, vitest_1.expect)(engine.setActiveSaga).toHaveBeenCalledWith(KEY, 'first');
                    (0, preact_1.cleanup)();
                    return [4 /*yield*/, open({}, (0, test_support_1.projectView)(KEY, { canStart: 1, activeSaga: 'First quest', activeSagaId: 'first', ready: [{ kind: 'quest', quest: FIRST }] }))];
                case 2:
                    again = _a.sent();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.actions.sagaOff }));
                    (0, vitest_1.expect)(again.engine.setActiveSaga).toHaveBeenCalledWith(KEY, null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('no button reads Commit, Push, Merge or Pull, with the sheets open too', function () { return __awaiter(void 0, void 0, void 0, function () {
        var words;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a.sent();
                    preact_1.fireEvent.click(preact_1.screen.getAllByRole('button', { name: en_1.t.actions.newQuest })[0]);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(dialog()).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    words = __spreadArray([], document.querySelectorAll('button:not(.helper-chip), a'), true).map(function (el) { var _a; return ((_a = el.textContent) !== null && _a !== void 0 ? _a : '').toLowerCase(); });
                    (0, vitest_1.expect)(words.filter(function (word) { return /\b(commit|push|merge|pull)\b/.test(word); })).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('helper chips', function () {
    var chip = function (name) { return preact_1.screen.getByRole('button', { name: en_1.t.helpers.use(name) }); };
    var pressed = function (name) { return chip(name).getAttribute('aria-pressed'); };
    (0, vitest_1.it)('show what the quest has on', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)([pressed('Commit Chai-n'), pressed('Mocha Mockup'), pressed('Chai-pter'), pressed('Tea-DD')]).toEqual(['false', 'false', 'false', 'true']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("a click saves the quest's helpers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(chip('Commit Chai-n'));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { helpers: ['commit-chai-n', 'tea-dd'] }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('two quick clicks keep both', function () { return __awaiter(void 0, void 0, void 0, function () {
        var release, gate, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    release = function () { };
                    gate = new Promise(function (resolve) { return (release = resolve); });
                    return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    engine.editQuest = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, gate];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, { ok: true, data: BOARD }];
                            }
                        });
                    }); });
                    preact_1.fireEvent.click(chip('Commit Chai-n'));
                    preact_1.fireEvent.click(chip('Chai-pter'));
                    release();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenLastCalledWith(KEY, 'first', { helpers: ['commit-chai-n', 'chai-pter', 'tea-dd'] }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a finished save keeps the choice of a save still running', function () { return __awaiter(void 0, void 0, void 0, function () {
        var releases, engine, withHelpers, replies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    releases = [];
                    return [4 /*yield*/, open()];
                case 1:
                    engine = (_a.sent()).engine;
                    withHelpers = function (helpers) {
                        return (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)(__assign(__assign({}, FIRST), { helpers: helpers })) }, { kind: 'quest', quest: SECOND }, SAGA], canStart: 4 });
                    };
                    replies = [withHelpers(['commit-chai-n', 'tea-dd']), withHelpers(['commit-chai-n', 'chai-pter', 'tea-dd'])];
                    engine.editQuest = vitest_1.vi.fn(function () {
                        var reply = replies[releases.length];
                        return new Promise(function (resolve) { return releases.push(function () { return resolve({ ok: true, data: reply }); }); });
                    });
                    preact_1.fireEvent.click(chip('Commit Chai-n'));
                    preact_1.fireEvent.click(chip('Chai-pter'));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, releases[0]()];
                        }); }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(pressed('Chai-pter')).toBe('true');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, releases[1]()];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)([pressed('Commit Chai-n'), pressed('Chai-pter')]).toEqual(['true', 'true']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed save puts the chip back', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ editQuest: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'Could not save.' } })];
                        }); }); }) })];
                case 1:
                    _a.sent();
                    preact_1.fireEvent.click(chip('Commit Chai-n'));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByText('Could not save.')).toBeTruthy(); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(pressed('Commit Chai-n')).toBe('false');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the quest in hand has them too', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({}, (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)({ id: 'held', title: 'In hand', helpers: ['tea-dd'] }) }))];
                case 1:
                    engine = (_a.sent()).engine;
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.detail.openActive('In hand') }));
                    preact_1.fireEvent.click(chip('Mocha Mockup'));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'held', { helpers: ['mocha-mockup', 'tea-dd'] }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
