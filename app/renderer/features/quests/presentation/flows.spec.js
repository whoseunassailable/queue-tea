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
var format_1 = require("../../../core/domain/format");
var en_1 = require("../../../l10n/en");
var test_support_1 = require("../../../test_support");
var workspace_store_1 = require("../../workspace/state_management/workspace_store");
var KEY = 'a-000001';
var MAIN = (0, test_support_1.quest)({ id: 'first', title: 'First quest', isStar: true, why: 'urgent' });
var OTHER = (0, test_support_1.quest)({ id: 'second', title: 'Second quest' });
var SEALED = (0, test_support_1.quest)({ id: 'stuck', title: 'Stuck quest', sealedBecause: 'waiting for the clinic' });
var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: MAIN }, { kind: 'quest', quest: OTHER }], sealed: [{ kind: 'quest', quest: SEALED }], canStart: 2, sealedCount: 1 });
var withActive = function (over, session, view) {
    if (over === void 0) { over = {}; }
    if (session === void 0) { session = 'open'; }
    if (view === void 0) { view = BOARD; }
    return (__assign(__assign({}, view), { active: (0, test_support_1.activeQuest)(over), activeQuests: [(0, test_support_1.activeQuest)(over)], session: { state: session, allowance: null } }));
};
var hold = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ kind: 'uncommitted', reason: '10 files not committed', branch: 'task/old', head: 'abc1234', files: Array.from({ length: 10 }, function (_, i) { return "file".concat(i, ".md"); }), fileCount: 10, command: 'git status' }, over));
};
var held = function (over) {
    if (over === void 0) { over = {}; }
    return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: hold(over) } })];
    }); }); });
};
var open = function (view_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([view_1], args_1, true), void 0, function (view, over) {
        var _a, engine, fire, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view })];
                        }); }); } }, over)), engine = _a.engine, fire = _a.fire;
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
                    _b.sent();
                    return [2 /*return*/, { engine: engine, workspace: workspace, fire: fire }];
            }
        });
    });
};
var key = function (name, over) {
    if (over === void 0) { over = {}; }
    return (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, __assign({ key: name }, over)); });
};
var press = function (name) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: name })); }); };
var button = function (name) { return preact_1.screen.getByRole('button', { name: name }); };
(0, vitest_1.beforeEach)(function () {
    window.location.hash = '#/home';
});
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('Start from Home', function () {
    (0, vitest_1.it)('names the main quest on its button', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.startNamed('First quest'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'claude'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('s starts the main quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('s')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledWith(KEY, 'first'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the arrow keys to scroll Home', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.fireEvent.keyDown(document.body, { key: 'ArrowDown' })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows nothing to press with nothing on the board', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open((0, test_support_1.projectView)(KEY))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: /^Start/ })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the working line on the card, in place of the Now card', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD, { checkStart: function () { return new Promise(function () { }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.startNamed('First quest'))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('status', { name: en_1.t.flow.working })).getByText(en_1.t.flow.checking)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('heading', { name: en_1.t.quest.noneTitle })).toBeNull();
                    (0, vitest_1.expect)(engine.startQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Start from Quests', function () {
    (0, vitest_1.beforeEach)(function () {
        window.location.hash = '#/quests';
    });
    (0, vitest_1.it)('the detail pane starts the quest open in it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'second')];
                        }); }); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.start)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('calls the main quest Start ★', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(button(en_1.t.actions.startMain)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('s starts the row open, not the main quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'second')];
                        }); }); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, key('s')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers no Start on a sealed quest, and s does nothing there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'stuck')];
                        }); }); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: /^Start/ })).toBeNull();
                    return [4 /*yield*/, key('s')];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(engine.checkStart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('allows another Start while a quest is active', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive())];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(button(en_1.t.actions.startMain).disabled).toBe(false);
                    return [4 /*yield*/, key('s')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledWith(KEY, 'first'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the hold where the active quest would be', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD, { checkStart: held() })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.startMain)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.flow.gate('First quest'))];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.qlist')) === null || _a === void 0 ? void 0 : _a.textContent).toContain(en_1.t.flow.gate('First quest'));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a missed checkpoint in the detail pane of that quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.noteFor('first', en_1.t.flow.noCheckpointYet)];
                        }); }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('complementary')).getByText(en_1.t.flow.noCheckpointYet, { exact: false })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the git hold', function () {
    var heldOpen = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(BOARD, { checkStart: held(over) })];
                    case 1:
                        opened = _a.sent();
                        return [4 /*yield*/, press(en_1.t.actions.startNamed('First quest'))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByText(en_1.t.flow.gate('First quest'))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    (0, vitest_1.it)('says what holds it in the engine\'s words, on which branch, and what to do', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, heldOpen()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('10 files not committed on task/old, abc1234')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText("".concat(en_1.t.flow.advice.uncommitted, " ").concat(en_1.t.flow.nothingChanged))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('lists seven files, and shows the rest when asked', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, heldOpen()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('file6.md')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByText('file7.md')).toBeNull();
                    return [4 /*yield*/, press(en_1.t.flow.more(3))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('file9.md')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts files it was not given', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, heldOpen({ files: Array.from({ length: 20 }, function (_, i) { return "f".concat(i, ".md"); }), fileCount: 25 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.flow.more(18))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.flow.more(5))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has no file list when no file holds it', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, heldOpen({ kind: 'unpushed', reason: '2 commits not pushed', files: [], fileCount: 0, command: 'git push' })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.files')).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByText("".concat(en_1.t.flow.advice.unpushed, " ").concat(en_1.t.flow.nothingChanged))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('copies a command, and no button reads Commit, Push, Merge or Pull', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _i, _a, control;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, heldOpen({ kind: 'unpushed', reason: '2 commits not pushed', files: [], fileCount: 0, command: 'git push' })];
                case 1:
                    engine = (_d.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByText('git push')).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.flow.copy)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.copyText).toHaveBeenCalledWith('git push'); })];
                case 3:
                    _d.sent();
                    for (_i = 0, _a = preact_1.screen.getAllByRole('button'); _i < _a.length; _i++) {
                        control = _a[_i];
                        (0, vitest_1.expect)("".concat((_b = control.textContent) !== null && _b !== void 0 ? _b : '', " ").concat((_c = control.getAttribute('aria-label')) !== null && _c !== void 0 ? _c : '')).not.toMatch(/\b(commit|push|merge|pull)\b/i);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a branch that could not be made has no command to copy', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, heldOpen({ kind: 'branch', reason: "Couldn't make the branch task/x. Check again to retry.", files: [], fileCount: 0, command: null })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.flow.copy })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Check again and r both check again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, heldOpen()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.flow.checkAgain)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledTimes(2); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('r')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledTimes(3); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Cancel and Esc both go back to the Now card', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, heldOpen()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.cancel)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.quest.noneTitle })).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.actions.startNamed('First quest'))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.flow.gate('First quest'))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, key('Escape')];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.quest.noneTitle })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('when Start is refused', function () {
    (0, vitest_1.it)('says why in plain words, with a way to try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkStart, engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    checkStart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: 'The other one was started first.' } })];
                    }); }); });
                    return [4 /*yield*/, open(BOARD, { checkStart: checkStart })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.startNamed('First quest'))];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).textContent]).toContain('The other one was started first.');
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledTimes(2); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a terminal that would not open', function () {
    var failed = { startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: { kind: 'started', view: withActive({}, 'none'), branch: 'task/x', notice: null, handover: { kind: 'failed', terminal: 'iterm', command: "cd '/p' && claude" } } })];
        }); }); } };
    (0, vitest_1.it)('names it, and offers another try and the line to copy', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD, failed)];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.startNamed('First quest'))];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.flow.couldntOpen('iTerm2'))];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText("cd '/p' && claude")).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.continueIn).toHaveBeenCalledWith(KEY, 'first', 'claude'); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the active quest', function () {
    (0, vitest_1.it)('offers its four actions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, name_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withActive())];
                case 1:
                    _b.sent();
                    for (_i = 0, _a = [en_1.t.actions.openClaude, en_1.t.actions.finish, en_1.t.actions.back, en_1.t.actions.seal]; _i < _a.length; _i++) {
                        name_1 = _a[_i];
                        (0, vitest_1.expect)(button(name_1)).toBeTruthy();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['open', en_1.t.flow.handing],
        ['working', en_1.t.flow.takesWhenTurnEnds],
        ['none', en_1.t.flow.takesWhenOpen],
    ])('with a begin waiting and a session %s, says what happens next', function (session, line) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ asking: 'begin' }, session))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(line)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['open', en_1.t.flow.saving],
        ['working', en_1.t.flow.savesWhenTurnEnds],
        ['none', en_1.t.flow.noSessionToSave],
    ])('with a checkpoint awaited and a session %s, offers to go without', function (session, line) { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ asking: 'putBack' }, session))];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByText(line)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.actions.finish })).toBeNull();
                    return [4 /*yield*/, press(en_1.t.actions.backNow)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.putBackNow).toHaveBeenCalledWith(KEY, 'active'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Open in Claude Code opens it, as does c and ⌘↩', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive())];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.openClaude)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openClaude).toHaveBeenCalledTimes(1); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('c')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openClaude).toHaveBeenCalledTimes(2); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, key('Enter', { metaKey: true })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openClaude).toHaveBeenCalledTimes(3); })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Back to the board and b both put it back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var putBackQuest, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    putBackQuest = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { view: withActive(), went: 'asked', missedCheckpoint: null, isCodexTimeLost: false } })];
                    }); }); });
                    return [4 /*yield*/, open(withActive(), { putBackQuest: putBackQuest })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.back)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.putBackQuest).toHaveBeenCalledWith(KEY, 'active', null); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('b')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.putBackQuest).toHaveBeenCalledTimes(2); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('b does nothing while the checkpoint is awaited', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ asking: 'putBack' }))];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('b')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.putBackQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows on the board too', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.location.hash = '#/quests';
                    return [4 /*yield*/, open(withActive())];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(document.querySelector('.qlist')).getByRole('button', { name: en_1.t.actions.finish })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('sealing the active quest', function () {
    var sealOpen = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(withActive(), over)];
                    case 1:
                        opened = _a.sent();
                        return [4 /*yield*/, press(en_1.t.actions.seal)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    (0, vitest_1.it)('says it goes back with a checkpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sealOpen()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.form.sealActive)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('puts it back with the seal, and closes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sealOpen()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(preact_1.screen.getByLabelText(en_1.t.form.reason), { target: { value: 'waiting for the clinic' } })];
                        }); }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.sealIt)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.putBackQuest).toHaveBeenCalledWith(KEY, 'active', { reason: 'waiting for the clinic' }); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a refusal in the dialog and keeps it open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sealOpen({ putBackQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'Those two wait for each other.' } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(preact_1.screen.getByLabelText(en_1.t.form.reason), { target: { value: 'waiting' } })];
                        }); }); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.sealIt)];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 4:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe('Those two wait for each other.');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('k seals it from Home', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withActive())];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, key('k')];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Judgement', function () {
    var REVIEW = { at: 'now', checked: 'docs build and typecheck pass' };
    (0, vitest_1.it)('asks the question with what Claude checked, in place of the Now card', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ review: REVIEW }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.judgement.ask('Active one') })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(REVIEW.checked, { exact: false })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.actions.finish })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the completion criteria under it', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ review: REVIEW, criteria: ['Docs build'] }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('Docs build')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves out the line when Claude said nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ review: { at: 'now', checked: null } }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.judgement.checked)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Yes and y both open the Finish sheet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withActive({ review: REVIEW }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.judgement.yes)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByText(en_1.t.finish.howHard)).toBeTruthy();
                    return [4 /*yield*/, key('Escape')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, key('y')];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Not yet and n both clear the question', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ review: REVIEW }))];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('n')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.notYet).toHaveBeenCalledWith(KEY, 'active'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('y and n mean nothing with no question asked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive())];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('n')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, key('y')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.notYet).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks the realm in the sidebar', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    row = (0, test_support_1.projectRow)(KEY, { status: { kind: 'judgement' } });
                    return [4 /*yield*/, open(withActive({ review: REVIEW }), { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: [row] })];
                            }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.status.judgement)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the Finish sheet', function () {
    var sheet = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over, view) {
            var opened;
            if (over === void 0) { over = {}; }
            if (view === void 0) { view = withActive(); }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(view, over)];
                    case 1:
                        opened = _a.sent();
                        return [4 /*yield*/, press(en_1.t.actions.finish)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, opened), { dialog: preact_1.screen.getByRole('dialog') })];
                }
            });
        });
    };
    var pressed = function (name) { return (0, preact_1.within)(preact_1.screen.getByRole('group', { name: en_1.t.finish.howHard })).getByRole('button', { name: name }).getAttribute('aria-pressed'); };
    var noLog = withActive({}, 'open', __assign(__assign({}, BOARD), { docsLogPath: null }));
    (0, vitest_1.it)('starts on the difficulty expected, and says what will happen', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(pressed(en_1.t.finish.option('Hard', 50, true))).toBe('true');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.finish.meta('14m', 'task/active', 1))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.finish.row('docs/task_log.md'), { exact: false })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('d opens it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withActive())];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, key('d')];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('finishes as the difficulty picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.finish.option('Light', 10, false))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.finish.go)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.finishQuest).toHaveBeenCalledWith(KEY, 'active', 'light', null); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks where the task log goes the first time, offering docs/task_log.md', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet({}, noLog)];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText("".concat(en_1.t.finish.path, " *")).value).toBe('docs/task_log.md');
                    return [4 /*yield*/, press(en_1.t.finish.go)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.finishQuest).toHaveBeenCalledWith(KEY, 'active', 'hard', 'docs/task_log.md'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the error under the path as it loses focus', function () { return __awaiter(void 0, void 0, void 0, function () {
        var field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet({}, noLog)];
                case 1:
                    _a.sent();
                    field = preact_1.screen.getByLabelText("".concat(en_1.t.finish.path, " *"));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(field, { target: { value: '  ' } })];
                        }); }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(field)];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.finish.pathRequired)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('blocks Finish on a bad path, with the button still enabled and the error shown', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sheet({}, noLog)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(preact_1.screen.getByLabelText("".concat(en_1.t.finish.path, " *")), { target: { value: 'docs/' } })];
                        }); }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(button(en_1.t.finish.go).disabled).toBe(false);
                    return [4 /*yield*/, press(en_1.t.finish.go)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.finish.pathBad)).toBeTruthy();
                    (0, vitest_1.expect)(engine.finishQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads Finishing… while it works, and a second ⌘↩ does nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finishQuest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finishQuest = vitest_1.vi.fn(function () { return new Promise(function () { }); });
                    return [4 /*yield*/, sheet({ finishQuest: finishQuest })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, key('Enter', { metaKey: true })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.finish.going })).toBeTruthy();
                    return [4 /*yield*/, key('Enter', { metaKey: true })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(finishQuest).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays open with the reason when it fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sheet({ finishQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'That quest is no longer the active one.' } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.finish.go)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe('That quest is no longer the active one.');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('closes on a win, showing the victory', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sheet()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.finish.go)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.win.title })];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.finish.howHard)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the victory', function () {
    var won = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (victory, settings, view) {
            var finishQuest, opened;
            if (victory === void 0) { victory = {}; }
            if (settings === void 0) { settings = {}; }
            if (view === void 0) { view = withActive(); }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        finishQuest = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { view: __assign(__assign({}, BOARD), { key: key }), logPath: 'docs/task_log.md', logFailedAt: null, minutes: 14, victory: __assign(__assign({}, test_support_1.VICTORY), victory), isCodexTimeLost: false } })];
                        }); }); });
                        return [4 /*yield*/, open(view, {
                                finishQuest: finishQuest,
                                readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ ok: true, data: __assign({ sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} }, settings) })];
                                }); }); },
                            })];
                    case 1:
                        opened = _a.sent();
                        return [4 /*yield*/, press(en_1.t.actions.finish)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, press(en_1.t.finish.go)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.win.title })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    (0, vitest_1.it)('shows what was earned', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.kicker.quest)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.quest.xp(50))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.toLevel(70, 200, 3))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.quest.gold(50))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.hoard(170))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText("".concat(en_1.t.win.finishedAs('Hard', 'Hard'), " \u00B7 ").concat(en_1.t.win.rowWent('docs/task_log.md')))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('calls a boss a boss', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won({ kind: 'boss' })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.kicker.boss)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a level-up and how the dragon grows', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won({ didLevelUp: true, level: 3 })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.level(3))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.nextLevel(300))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.grows(en_1.t.stage.hatchling, 5))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a badge in the panel and in a toast', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won({ newBadges: ['firstFlame'] })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByText(en_1.t.badges.firstFlame)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.win.badgeToast(en_1.t.badges.firstFlame))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the dragon cheers until it closes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, won()];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.rm')) === null || _a === void 0 ? void 0 : _a.className).toContain('m-cheer');
                    return [4 /*yield*/, press(en_1.t.win.close)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)((_b = document.querySelector('.rm')) === null || _b === void 0 ? void 0 : _b.className).not.toContain('m-cheer');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('closes with Back to the lair', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.win.close)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('heading', { name: en_1.t.win.title })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Esc closes it and the badge toast together', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won({ newBadges: ['firstFlame'] })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, key('Escape')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('heading', { name: en_1.t.win.title })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.win.badgeToast(en_1.t.badges.firstFlame))).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('closes on a click on the sky, but not on the panel', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('heading', { name: en_1.t.win.title }))];
                        }); }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.win.title })).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(document.querySelector('.win-layer'))];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('heading', { name: en_1.t.win.title })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the keys working: s starts the next quest and closes it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('s')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledWith(KEY, 'first'); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('heading', { name: en_1.t.win.title })).toBeNull(); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('drops the coins in Calm mode', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won({}, { isCalm: true })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.coins')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('throws coins otherwise', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, won()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelectorAll('.cn')).toHaveLength(8);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Start in Codex', function () {
    (0, vitest_1.it)('on Home, starts the main quest in Codex, beside Start ★', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.startCodex)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'codex'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('in the detail pane, starts the quest open in it in Codex', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.location.hash = '#/quests';
                    return [4 /*yield*/, open(BOARD)];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'second')];
                        }); }); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.startCodex)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.startQuest).toHaveBeenCalledWith(KEY, 'second', 'codex'); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('is enabled while a quest is active, and missing on a sealed quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.location.hash = '#/quests';
                    return [4 /*yield*/, open(withActive())];
                case 1:
                    workspace = (_a.sent()).workspace;
                    (0, vitest_1.expect)(button(en_1.t.actions.startCodex).disabled).toBe(false);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'stuck')];
                        }); }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.actions.startCodex })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the active quest and Codex', function () {
    var SINCE = '2026-10-27T18:00:00+01:00';
    (0, vitest_1.it)('with Claude Code, offers Continue in Codex, which moves it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive())];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(button(en_1.t.actions.openClaude)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.actions.reopenCodex })).toBeNull();
                    return [4 /*yield*/, press(en_1.t.actions.continueCodex)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.continueIn).toHaveBeenCalledWith(KEY, 'active', 'codex'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with Codex, says since when in place of the session, and offers Show Codex instead of Open in Claude Code', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withActive({ codexSince: SINCE }))];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.quest.withCodex((0, format_1.dayAndTime)(SINCE)))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.session.open)).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.actions.openClaude })).toBeNull();
                    return [4 /*yield*/, press(en_1.t.actions.showCodex)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openClaude).toHaveBeenCalledWith(KEY, 'active'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with Codex, Continue in Claude Code brings it back, and Open Codex again opens Codex on it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    view = withActive({ codexSince: SINCE });
                    return [4 /*yield*/, open(view, { continueIn: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: { view: view, handover: { kind: 'opened', terminal: 'terminal' }, isCodexTimeLost: false } })];
                            }); }); }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.continueClaude)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.continueIn).toHaveBeenCalledWith(KEY, 'active', 'claude'); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.reopenCodex)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.continueIn).toHaveBeenLastCalledWith(KEY, 'active', 'codex'); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a refusal to move shows why, and the quest stays with Claude Code', function () { return __awaiter(void 0, void 0, void 0, function () {
        var message, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    message = 'Claude Code is still working on Active one. Wait for its turn to end, or stop it with Esc in its terminal, then try again. Nothing has changed.';
                    return [4 /*yield*/, open(withActive({}, 'working'), { continueIn: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: false, error: { message: message } })];
                            }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.continueCodex)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(message)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(button(en_1.t.actions.continueCodex)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("when Claude's allowance is used up", function () {
    var allowance = { percent: 100, resetsAt: new Date(Date.now() + 3600000).toISOString() };
    var line = "! ".concat(en_1.t.quest.claudeOut((0, format_1.refillTime)(allowance)));
    var out = function (view) { return (__assign(__assign({}, view), { session: { state: 'open', allowance: allowance } })); };
    (0, vitest_1.it)('says Codex can carry on beside Start on Home, with Start ★ still first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var actions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(out(BOARD))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(line)).toBeTruthy();
                    actions = preact_1.screen.getAllByRole('button').map(function (b) { return b.textContent; });
                    (0, vitest_1.expect)(actions.indexOf(en_1.t.actions.startNamed('First quest'))).toBeLessThan(actions.indexOf(en_1.t.actions.startCodex));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so in the detail pane of a quest that can start', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.location.hash = '#/quests';
                    return [4 /*yield*/, open(out(BOARD))];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'second')];
                        }); }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('complementary', { name: en_1.t.detail.label })).getByText(line)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so on a quest with Claude Code, and not on one with Codex', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(out(withActive()))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(line)).toBeTruthy();
                    (0, preact_1.cleanup)();
                    return [4 /*yield*/, open(out(withActive({ codexSince: '2026-10-27T18:00:00+01:00' })))];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(line)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says nothing while the allowance lasts', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(__assign(__assign({}, BOARD), { session: { state: 'open', allowance: { percent: 99, resetsAt: allowance.resetsAt } } }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(line)).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(/allowance is used up/)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
