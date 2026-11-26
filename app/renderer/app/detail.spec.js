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
var KEY = 'a-000001';
var FIRST = (0, test_support_1.quest)({ id: 'first', title: 'First quest', isStar: true });
var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: FIRST }], canStart: 1 });
var HELD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: FIRST }], canStart: 1, active: (0, test_support_1.activeQuest)({ id: 'held', title: 'The quest in hand', priority: 'urgent', difficulty: 'hard' }) });
var facts = function (over) { return function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.QUEST_FACTS), over) })];
}); }); }; };
var ACTIVE = {
    minutes: 43,
    today: 19,
    started: '2026-10-20T22:17:00+02:00',
    understandingMessages: 1,
    improvingMessages: 4,
    filesRead: 33,
    filesChanged: 39,
    lines: { added: 812, removed: 95, since: '1649ade' },
    git: { branch: 'task/held', head: '7a2ecc7 changed the homepage', uncommitted: ['a.md', 'b.md'], uncommittedCount: 2 },
};
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (view, over) {
        var _a, engine, fire, workspace;
        if (view === void 0) { view = BOARD; }
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.location.hash = '#/quests';
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
                    return [2 /*return*/, { engine: engine, workspace: workspace, fire: fire, pane: function () { return preact_1.screen.getByRole('complementary', { name: en_1.t.detail.label }); } }];
            }
        });
    });
};
var press = function (name) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: name })); }); };
(0, vitest_1.beforeEach)(function () {
    window.innerWidth = 1280;
});
(0, vitest_1.afterEach)(function () {
    (0, preact_1.cleanup)();
    vitest_1.vi.useRealTimers();
});
(0, vitest_1.describe)('a quest\'s details on the board', function () {
    (0, vitest_1.it)('names the branch it will get', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD, { readQuestFacts: facts({ branchToBe: 'task/first' }) })];
                case 1:
                    pane = (_b.sent()).pane;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText('task/first')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the branch it already has', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, pane;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    view = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: __assign(__assign({}, FIRST), { branch: 'task/mine' }) }], canStart: 1 });
                    return [4 /*yield*/, open(view)];
                case 1:
                    pane = (_a.sent()).pane;
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText('task/mine')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says it is made at Start when it can\'t name one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    pane = (_b.sent()).pane;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.detail.noBranch)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows what it was filed with, folded', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, filed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open(BOARD, { readQuestFacts: facts({ messages: ['Fix the diagrams please'] }) })];
                case 1:
                    pane = (_a.sent()).pane;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.notes.filed(1))];
                case 2:
                    filed = (_a.sent()).closest('details');
                    (0, vitest_1.expect)(filed.open).toBe(false);
                    (0, vitest_1.expect)((0, preact_1.within)(filed).getByText('Fix the diagrams please')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves Filed with out when there is nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, pane, engine;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), pane = _a.pane, engine = _a.engine;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.readQuestFacts).toHaveBeenCalled(); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).queryByText(/Filed with/)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a checkpoint with its sections', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD, { readQuestFacts: facts({ note: { title: 'Checkpoint', written: '2026-10-26T16:35:00+01:00', text: '', sections: [{ heading: 'Goal', lines: ['Fix the docs'] }, { heading: 'Remaining', lines: ['- The diagrams'] }] } }) })];
                case 1:
                    pane = (_b.sent()).pane;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.notes.note('Checkpoint', '26 Oct 16:35'))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText('Goal')).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText('The diagrams')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a plain note as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD, { readQuestFacts: facts({ note: { title: 'Handoff note', written: '2026-10-26T16:35:00+01:00', text: 'Carry on with the diagrams.', sections: null } }) })];
                case 1:
                    pane = (_b.sent()).pane;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText('Carry on with the diagrams.')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('follows the quest when another is picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var second, view, readQuestFacts, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    second = (0, test_support_1.quest)({ id: 'second', title: 'Second quest' });
                    view = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: second }], canStart: 2 });
                    readQuestFacts = vitest_1.vi.fn(facts({}));
                    return [4 /*yield*/, open(view, { readQuestFacts: readQuestFacts })];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readQuestFacts).toHaveBeenCalledWith(KEY, 'first'); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'second')];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readQuestFacts).toHaveBeenCalledWith(KEY, 'second'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the pane standing when they can\'t be read, and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open(BOARD, { readQuestFacts: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't read this quest's details." } })];
                        }); }); } })];
                case 1:
                    pane = (_b.sent()).pane;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText("Couldn't read this quest's details.")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.actions.startMain })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the active quest\'s details', function () {
    var held = function (over) {
        if (over === void 0) { over = {}; }
        return open(HELD, __assign({ readQuestFacts: vitest_1.vi.fn(facts({ active: ACTIVE })) }, over));
    };
    var showIt = function () { return press(en_1.t.detail.openActive('The quest in hand')); };
    (0, vitest_1.it)('updates the activity when the record changes and retains it through a failed refresh', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readQuestFacts, _a, pane, fire, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    readQuestFacts = vitest_1.vi.fn(facts({ active: ACTIVE }));
                    return [4 /*yield*/, held({ readQuestFacts: readQuestFacts })];
                case 1:
                    _a = _e.sent(), pane = _a.pane, fire = _a.fire;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.activity.empty)];
                case 3:
                    _e.sent();
                    readQuestFacts.mockImplementation(facts({ active: ACTIVE, activity: {
                            step: { id: 'run', at: '2026-11-04T12:00:00Z', finished: null, kind: 'test', subject: 'npm test', status: 'running' },
                            commits: [], gitUnavailable: false,
                        } }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fire()];
                        }); }); })];
                case 4:
                    _e.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText('npm test')];
                case 5:
                    _b.apply(void 0, [_e.sent()]).toBeTruthy();
                    readQuestFacts.mockResolvedValue({ ok: false, error: { message: 'Could not read activity.' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fire()];
                        }); }); })];
                case 6:
                    _e.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText('Could not read activity.')];
                case 7:
                    _c.apply(void 0, [_e.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText('npm test')).toBeTruthy();
                    readQuestFacts.mockImplementation(facts({ active: ACTIVE }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.activity.refresh })); })];
                case 8:
                    _e.sent();
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.activity.empty)];
                case 9:
                    _d.apply(void 0, [_e.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a busy refresh without removing the activity already read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readQuestFacts, pane, finish, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readQuestFacts = vitest_1.vi.fn(facts({ active: ACTIVE }));
                    return [4 /*yield*/, held({ readQuestFacts: readQuestFacts })];
                case 1:
                    pane = (_b.sent()).pane;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.activity.empty)];
                case 3:
                    _b.sent();
                    readQuestFacts.mockImplementation(function () { return new Promise(function (resolve) { finish = resolve; }); });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.activity.refresh })); })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.activity.refreshing }).disabled).toBe(true);
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText(en_1.t.activity.empty)).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, finish({ ok: true, data: test_support_1.QUEST_FACTS })];
                        }); }); })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByRole('button', { name: en_1.t.activity.refresh })];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens from the card', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, pane, engine;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held()];
                case 1:
                    _a = _b.sent(), pane = _a.pane, engine = _a.engine;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByRole('heading', { name: 'The quest in hand' })).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.readQuestFacts).toHaveBeenCalledWith(KEY, 'held'); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows its time, effort, files and lines', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held()];
                case 1:
                    pane = (_b.sent()).pane;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.notes.time('43m', '20 Oct 22:17', '19m'))];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText(en_1.t.notes.effort(4, 1))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText(en_1.t.notes.files(33, 39))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByText(en_1.t.notes.lines(812, 95, '1649ade'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows git, with what isn\'t committed folded', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a, list;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held()];
                case 1:
                    pane = (_b.sent()).pane;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText('7a2ecc7 changed the homepage')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    list = (0, preact_1.within)(pane()).getByText(en_1.t.notes.uncommitted(2)).closest('details');
                    (0, vitest_1.expect)((0, preact_1.within)(list).getByText('a.md')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts files it wasn\'t given', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held({ readQuestFacts: facts({ active: __assign(__assign({}, ACTIVE), { git: __assign(__assign({}, ACTIVE.git), { uncommitted: ['a.md'], uncommittedCount: 25 }) }) }) })];
                case 1:
                    pane = (_b.sent()).pane;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.flow.more(24))];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has no git block without git, and the rest stands', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, held({ readQuestFacts: facts({ active: __assign(__assign({}, ACTIVE), { git: null, lines: null }) }) })];
                case 1:
                    pane = (_a.sent()).pane;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.notes.files(33, 39))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).queryByText(en_1.t.notes.gitLabel)).toBeNull();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).queryByText(en_1.t.notes.linesLabel)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the note it carries on from', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pane, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held({ readQuestFacts: facts({ active: ACTIVE, note: { title: 'Checkpoint', written: '2026-10-26T16:35:00+01:00', text: '', sections: [{ heading: 'Goal', lines: ['Get it testable'] }] } }) })];
                case 1:
                    pane = (_b.sent()).pane;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText('Get it testable')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('changes the priority from the pane', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, pane;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, pane = _a.pane;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(pane()).getByRole('button', { name: en_1.t.edit.priorityOf('The quest in hand', en_1.t.priority.urgent) })); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('menuitemradio', { name: new RegExp(en_1.t.priority.low) })); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.setPriority).toHaveBeenCalledWith(KEY, 'held', 'low'); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('measures the lines again every 30 s while it shows, and stops when it goes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readQuestFacts, _a, pane, workspace, seen, before, reopened, again;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readQuestFacts = vitest_1.vi.fn(facts({ active: ACTIVE }));
                    return [4 /*yield*/, open(HELD, { readQuestFacts: readQuestFacts })];
                case 1:
                    _a = _b.sent(), pane = _a.pane, workspace = _a.workspace;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.within)(pane()).findByText(en_1.t.notes.files(33, 39))];
                case 3:
                    _b.sent();
                    seen = function () { return readQuestFacts.mock.calls.filter(function (call) { return call[1] === 'held'; }).length; };
                    before = seen();
                    vitest_1.vi.useFakeTimers();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'first')];
                        }); }); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'held')];
                        }); }); })];
                case 5:
                    _b.sent();
                    reopened = seen();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void vitest_1.vi.advanceTimersByTime(30000)];
                        }); }); })];
                case 6:
                    _b.sent();
                    (0, vitest_1.expect)(before).toBeGreaterThan(0);
                    (0, vitest_1.expect)(seen()).toBeGreaterThan(reopened);
                    again = seen();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'first')];
                        }); }); })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void vitest_1.vi.advanceTimersByTime(60000)];
                        }); }); })];
                case 8:
                    _b.sent();
                    (0, vitest_1.expect)(seen()).toBe(again);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes back to a quest on the board when one is picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, pane, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held()];
                case 1:
                    _a = _b.sent(), pane = _a.pane, workspace = _a.workspace;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'first')];
                        }); }); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByRole('heading', { name: 'First quest' })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('falls back to the board when the quest in hand has gone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, pane, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, held()];
                case 1:
                    _a = _b.sent(), pane = _a.pane, workspace = _a.workspace;
                    return [4 /*yield*/, showIt()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.adopt(KEY, BOARD)];
                        }); }); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(pane()).getByRole('heading', { name: 'First quest' })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
