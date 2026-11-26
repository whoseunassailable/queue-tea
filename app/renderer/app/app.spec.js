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
var workspace_store_1 = require("../features/workspace/state_management/workspace_store");
var en_1 = require("../l10n/en");
var test_support_1 = require("../test_support");
var app_1 = require("./app");
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var _a, engine, fire, workspace, view;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, test_support_1.fakeEngine)(over), engine = _a.engine, fire = _a.fire;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    view = (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _b.sent();
                    return [2 /*return*/, __assign({ engine: engine, fire: fire, workspace: workspace }, view)];
            }
        });
    });
};
var withView = function (view) { return ({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true, data: view })];
    }); }); } }); };
var never = function () { return new Promise(function () { }); };
var fail = function (message) { return ({ ok: false, error: { message: message } }); };
(0, vitest_1.beforeEach)(function () {
    window.location.hash = '';
});
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('every view shows where it is', function () {
    (0, vitest_1.it)('loading: a progress indicator and what is happening', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)({ listProjects: never, readGame: never }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                    void workspace.start();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getAllByText(en_1.t.loading.realms).length).toBeGreaterThan(0); })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.loading.game)).toBeTruthy();
                    (0, vitest_1.expect)(document.querySelector('.spinner')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('partly loaded: the quests show while the hoard is still being read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)(__assign({ readGame: never }, withView((0, test_support_1.projectView)('a-000001', { name: 'Gait' })))).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                    void workspace.start();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.board.title)).toBeTruthy(); })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.loading.game)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('done but empty: no realms, and what to try next', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.firstRun.title })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.firstRun.hint)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('done but empty: an empty board says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText("".concat(en_1.t.empty.boardTitle, ". ").concat(en_1.t.empty.boardLine))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('failed: what went wrong and a way to try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fail('Could not read your realms.')];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toContain('Could not read your realms.');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.failed.tryAgain })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('failed: a game that fails leaves the quests working', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fail('Could not work out your level.')];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toContain('Could not work out your level.');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.board.title)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an unreadable realm says why, in plain words', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withView({ kind: 'unreadable', key: 'a-000001', name: 'a', reason: 'it was written by a newer Queue-tea', file: '/x', isNewer: true, canRestore: false }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('It was written by a newer Queue-tea.')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the sidebar', function () {
    (0, vitest_1.it)('shows a realm that does not read as such', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(__assign({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [{ kind: 'unreadable', key: 'a-000001', name: 'a' }] })];
                        }); }); } }, withView({ kind: 'unreadable', key: 'a-000001', name: 'a', reason: 'no', file: '/x', isNewer: false, canRestore: false })))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.unreadable.sidebar)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the status it was given', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)('a-000001', { waiting: 3, status: { kind: 'waiting', count: 3, title: 'Next' } })] })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('3 waiting · ★ Next')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Home', function () {
    var active = { id: 'x', title: 'The boss', priority: 'urgent', difficulty: 'hard', xp: 50, branch: 'task/x', minutes: 43, started: '2026-10-20T22:17:00+02:00', isBoss: true, improvingMessages: 4, filesChanged: 40, review: null, criteria: [], helpers: [], testProfile: null, due: null, testingMinutes: 0, minutesInChecks: 0, asking: null, codexSince: null, worktreePath: null, baseBranch: null, parentId: null };
    (0, vitest_1.it)('shows the active quest with its reward and time', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withView((0, test_support_1.projectView)('a-000001', { active: active, session: { state: 'working', allowance: null } })))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: 'The boss' })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.quest.boss)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('In progress · 43m so far · started 20 Oct 22:17')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.session.working)).toBeTruthy();
                    (0, vitest_1.expect)((_a = document.querySelector('.rm')) === null || _a === void 0 ? void 0 : _a.className).toContain('m-working');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows Judgement when Claude says it looks done, with what it checked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withView((0, test_support_1.projectView)('a-000001', { active: __assign(__assign({}, active), { review: { at: 'x', checked: 'ran the tests' } }) })))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.judgement.ask('The boss') })).toBeTruthy();
                    (0, vitest_1.expect)((_a = document.querySelector('.card-note')) === null || _a === void 0 ? void 0 : _a.textContent).toBe("".concat(en_1.t.judgement.checked, " ran the tests"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with no active quest, names the main quest and why', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withView((0, test_support_1.projectView)('a-000001', { canStart: 1, ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'n', title: 'Next one', isStar: true, why: 'urgent' }) }] })))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.quest.noneTitle })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.quest.noneLine('Next one'))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('★ urgent')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the HUD from the game', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('Lv 2')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('180 XP to Lv 3')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('img', { name: '20 / 200 XP to Lv 3' })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('38% mana')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(String(test_support_1.GAME.gold))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Quests', function () {
    var ready = [
        { kind: 'quest', quest: (0, test_support_1.quest)({ id: 'first', title: 'First', isStar: true, why: 'urgent · unblocks Later', priority: 'urgent' }) },
        { kind: 'saga', quest: (0, test_support_1.quest)({ id: 'saga', title: 'Saga' }), chapters: [(0, test_support_1.quest)({ id: 'chapter', title: 'Chapter' })], progress: { done: 1, total: 3, current: 0, blocked: 0 }, hasStar: false },
        { kind: 'quest', quest: (0, test_support_1.quest)({ id: 'last', title: 'Last' }) },
    ];
    (0, vitest_1.beforeEach)(function () {
        window.location.hash = '#/quests';
    });
    (0, vitest_1.it)('keeps the order it was given, chapters under their saga, the ★ line as written', function () { return __awaiter(void 0, void 0, void 0, function () {
        var titles;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withView((0, test_support_1.projectView)('a-000001', { ready: ready, canStart: 4 })))];
                case 1:
                    _b.sent();
                    titles = __spreadArray([], document.querySelectorAll('.board-list .qc-title'), true).map(function (el) { return el.textContent; });
                    (0, vitest_1.expect)(titles).toEqual(['First', 'Saga', 'Chapter', 'Last']);
                    (0, vitest_1.expect)((_a = document.querySelector('.qrow.child .qc-title')) === null || _a === void 0 ? void 0 : _a.textContent).toBe('Chapter');
                    (0, vitest_1.expect)(preact_1.screen.getByText('★ urgent · unblocks Later')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens the ★ in the detail pane, then the quest picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var detail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(withView((0, test_support_1.projectView)('a-000001', { ready: ready, canStart: 4 })))];
                case 1:
                    _a.sent();
                    detail = function () { var _a; return (_a = document.querySelector('.detail .d-title')) === null || _a === void 0 ? void 0 : _a.textContent; };
                    (0, vitest_1.expect)(detail()).toBe('First');
                    preact_1.screen.getByText('Last').closest('button').click();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(detail()).toBe('Last'); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows sealed quests apart, with why', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(withView((0, test_support_1.projectView)('a-000001', { sealedCount: 1, sealed: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 's', title: 'Stuck', sealedBecause: 'waiting for the clinic' }) }] })))];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.fold .qrow.sealed .qc-sub')) === null || _a === void 0 ? void 0 : _a.textContent).toBe('⊘ waiting for the clinic');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.empty.allSealed)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the rules that hold everywhere', function () {
    (0, vitest_1.it)('no button reads Commit, Push, Merge or Pull on any screen', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _i, _a, hash, words;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    view = (0, test_support_1.projectView)('a-000001', { canStart: 1, ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'x', isStar: true }) }] });
                    _i = 0, _a = ['#/home', '#/quests'];
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    hash = _a[_i];
                    window.location.hash = hash;
                    return [4 /*yield*/, open(withView(view))];
                case 2:
                    _b.sent();
                    words = __spreadArray([], document.querySelectorAll('button:not(.helper-chip), a'), true).map(function (el) { var _a; return ((_a = el.textContent) !== null && _a !== void 0 ? _a : '').toLowerCase(); });
                    (0, vitest_1.expect)(words.filter(function (word) { return /\b(commit|push|merge|pull)\b/.test(word); })).toEqual([]);
                    (0, preact_1.cleanup)();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Calm mode marks the window, so every loop stops', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { sky: 'day', isCalm: true, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.rm')) === null || _a === void 0 ? void 0 : _a.className).toContain('calm');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the sky changes colours and scenery by class alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { sky: 'night', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.rm')) === null || _a === void 0 ? void 0 : _a.className).toContain('t-night');
                    return [2 /*return*/];
            }
        });
    }); });
});
