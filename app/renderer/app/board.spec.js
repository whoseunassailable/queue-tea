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
var FIRST = (0, test_support_1.quest)({ id: 'first', title: 'First quest', isStar: true, why: 'mid', priority: 'high' });
var SECOND = (0, test_support_1.quest)({ id: 'second', title: 'Second quest', branch: 'task/needle', priority: 'low' });
var SAGA = { kind: 'saga', quest: (0, test_support_1.quest)({ id: 'saga', title: 'The saga' }), chapters: [(0, test_support_1.quest)({ id: 'hay', title: 'Hay', parentId: 'saga' }), (0, test_support_1.quest)({ id: 'pin', title: 'Pin', parentId: 'saga' })], progress: { done: 0, total: 2, current: 0, blocked: 0 }, hasStar: false };
var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: SECOND }, SAGA], canStart: 5 });
var open = function (route_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([route_1], args_1, true), void 0, function (route, view, over) {
        var _a, engine, fire, workspace;
        if (view === void 0) { view = BOARD; }
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.location.hash = "#".concat(route);
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
var press = function (name) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: name })); }); };
var key = function (name, over) {
    if (over === void 0) { over = {}; }
    return (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, __assign({ key: name }, over)); });
};
var search = function (text) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.input(preact_1.screen.getByRole('searchbox', { name: en_1.t.filters.search }), { target: { value: text } }); }); };
var titles = function () { return __spreadArray([], document.querySelectorAll('.board-list .qc-title'), true).map(function (el) { return el.textContent; }); };
var live = function (over) { return function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ ok: true, data: __assign({ drift: [], mismatch: null, warning: null }, over) })];
}); }); }; };
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('search on the board', function () {
    (0, vitest_1.it)('narrows the board as you type', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, search('second')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toEqual(['Second quest']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('finds a quest by its branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, search('needle')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toEqual(['Second quest']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks what matched', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, search('sec')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.board-list mark')) === null || _a === void 0 ? void 0 : _a.textContent).toBe('Sec');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a saga for a chapter that matches, and unfolds it', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests', BOARD, { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                return [2 /*return*/, ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: (_a = {}, _a[KEY] = ['saga'], _a), terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } })];
                            });
                        }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).not.toContain('Pin');
                    return [4 /*yield*/, search('pin')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toEqual(['The saga', 'Pin']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('still counts all of a saga\'s chapters in its detail', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'saga')];
                        }); }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, search('pin')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.detail.chapters(2) })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('still counts all of a saga\'s chapters when removing it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    workspace = (_c.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.openQuest(KEY, 'saga')];
                        }); }); })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, search('pin')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, press(en_1.t.actions.remove)];
                case 4:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = preact_1.within;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 5:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).getByText(en_1.t.form.removeLine(2))]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when nothing matches, and clears', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, search('zebra')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.filters.noMatch('zebra'))).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.filters.clearSearch)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toContain('First quest');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Esc in the box clears it', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, search('second')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(preact_1.screen.getByRole('searchbox', { name: en_1.t.filters.search }), { key: 'Escape' }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toContain('First quest');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘F goes to the box', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, key('f', { metaKey: true })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByRole('searchbox', { name: en_1.t.filters.search }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves the keys on to what\'s left', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, search('second')];
                case 2:
                    _b.sent();
                    (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
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
    (0, vitest_1.it)('each realm keeps its own search', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, search('second')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick('b-000002')];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick(KEY)];
                        }); }); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('searchbox', { name: en_1.t.filters.search }).value).toBe('second');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('filters', function () {
    (0, vitest_1.it)('filters by priority, and clears', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.filters.title)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(preact_1.screen.getByRole('group', { name: en_1.t.filters.title })).getByRole('checkbox', { name: en_1.t.priority.low })); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toEqual(['Second quest']);
                    return [4 /*yield*/, press(en_1.t.filters.clearAll)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toContain('First quest');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows each filter that is on as a chip that turns it off', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.filters.title)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(preact_1.screen.getByRole('group', { name: en_1.t.filters.title })).getByRole('checkbox', { name: en_1.t.priority.low })); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.filters.buttonLabel(1) }).classList.contains('on')).toBe(true);
                    return [4 /*yield*/, press(en_1.t.filters.remove(en_1.t.priority.low))];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toContain('First quest');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.filters.title }).classList.contains('on')).toBe(false);
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('group', { name: en_1.t.filters.on })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when no quest passes the filters, and leaves the chips to clear them', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.filters.title)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(preact_1.screen.getByRole('group', { name: en_1.t.filters.title })).getByRole('checkbox', { name: en_1.t.priority.urgent })); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.filters.noMatch(''))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.filters.clearSearch })).toBeNull();
                    return [4 /*yield*/, press(en_1.t.filters.clearAll)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(titles()).toContain('First quest');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps to a section', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.filters.title)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('checkbox', { name: en_1.t.filters.sections.sealed })); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.board-list')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers Fits Time I have only with a time set', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.filters.title)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('checkbox', { name: en_1.t.filters.fitsTime })).toBeNull();
                    (0, preact_1.cleanup)();
                    return [4 /*yield*/, open('/quests', __assign(__assign({}, BOARD), { budget: 60 }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.filters.title)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('checkbox', { name: en_1.t.filters.fitsTime })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Time I have', function () {
    (0, vitest_1.it)('steps through its choices from the board', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.board.timeLabel('any'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.setTimeBudget).toHaveBeenCalledWith(KEY, 30); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes the board main hands back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var short;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    short = (0, test_support_1.projectView)(KEY, { budget: 30, ready: [{ kind: 'quest', quest: __assign(__assign({}, SECOND), { isStar: true }) }], canStart: 1 });
                    return [4 /*yield*/, open('/quests', BOARD, { setTimeBudget: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: short })];
                            }); }); } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.board.timeLabel('any'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(titles()).toEqual(['Second quest']); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.board.timeLabel('30m') })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('t steps it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('t')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.setTimeBudget).toHaveBeenCalledWith(KEY, 30); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows on Home too', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('t')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.setTimeBudget).toHaveBeenCalled(); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when it could not change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/quests', BOARD, { setTimeBudget: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't change Time I have." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.board.timeLabel('any'))];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't change Time I have.")];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('dragging a quest', function () {
    var row = function (title) { return (0, preact_1.within)(document.querySelector('.board-list')).getByText(title).closest('.qrow'); };
    var drag = function (from, to) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragStart(row(from)); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragOver(row(to)); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.drop(row(to)); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, vitest_1.it)('shows where it would land', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragStart(row('First quest')); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragOver(row('The saga')); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(row('The saga').className).toContain('drop');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('allows a drop only on another row', function () { return __awaiter(void 0, void 0, void 0, function () {
        var other, same;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragStart(row('First quest')); })];
                case 2:
                    _a.sent();
                    other = preact_1.createEvent.dragOver(row('The saga'));
                    same = preact_1.createEvent.dragOver(row('First quest'));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void (0, preact_1.fireEvent)(row('The saga'), other); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void (0, preact_1.fireEvent)(row('First quest'), same); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(other.defaultPrevented).toBe(true);
                    (0, vitest_1.expect)(same.defaultPrevented).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks first, with the saga already picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, drag('First quest', 'The saga')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 3:
                    dialog = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(en_1.t.form.moveLine('First quest', 'The saga'))).toBeTruthy();
                    (0, vitest_1.expect)(engine.moveQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves it once you say so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, drag('First quest', 'The saga')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.move)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.moveQuest).toHaveBeenCalledWith(KEY, 'first', 'saga'); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a refusal and moves nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/quests', BOARD, { moveQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'Hay is part of a saga, so its chapters go under that.' } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, drag('First quest', 'Hay')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.move)];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Hay is part of a saga, so its chapters go under that.')];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does nothing dropped on itself', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, drag('First quest', 'First quest')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('forgets the drag when it ends elsewhere', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragStart(row('First quest')); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragOver(row('The saga')); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragEnd(row('First quest')); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(row('The saga').className).not.toContain('drop');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('filling a quest in from its checkpoint', function () {
    var FILLED = (0, test_support_1.quest)({ id: 'first', title: 'First quest', isStar: true, goal: 'Fix the docs site', acceptance: ['Docs build', 'Links work'] });
    var view = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: FILLED }], canStart: 1 });
    (0, vitest_1.it)('fills the description from the goal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests', view)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.detail.useGoal)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: 'Fix the docs site' }); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('fills the criteria from the acceptance criteria', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests', view)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.detail.useAcceptance(2))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { criteria: ['Docs build', 'Links work'] }); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers neither once they are filled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var done;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    done = (0, test_support_1.quest)(__assign(__assign({}, FILLED), { description: 'Mine', criteria: ['Mine'] }));
                    return [4 /*yield*/, open('/quests', (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: done }], canStart: 1 }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.detail.useGoal })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.detail.useAcceptance(2) })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers neither with no checkpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.detail.useGoal })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Home\'s live lines', function () {
    var held = (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)() });
    (0, vitest_1.it)('shows drift under the card', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', held, { readLive: live({ drift: ['The branch task/x is gone.'] }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('The branch task/x is gone.', { exact: false })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the branch mismatch with Switch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: null } }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.live.mismatch('main', 'task/x'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.live.switch)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.switchBranch).toHaveBeenCalledWith(KEY); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('w switches', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: null } }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.live.mismatch('main', 'task/x'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, key('w')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.switchBranch).toHaveBeenCalled(); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers no Switch with work uncommitted, and says what to do', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: '2 files not committed' } }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.live.mismatchHeld('main', 'task/x'))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.live.switch })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says a refused switch out loud', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', held, { readLive: live({ mismatch: { on: 'main', branch: 'task/x', uncommitted: null } }), switchBranch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: '1 file not committed: commit or stash first, then Switch.' } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.live.mismatch('main', 'task/x'))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.live.switch)];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('1 file not committed: commit or stash first, then Switch.')];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the commit warning, and OK dismisses it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', held, { readLive: live({ warning: 'During the last turn a commit appeared.' }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('During the last turn a commit appeared.')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.actions.ok)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText('During the last turn a commit appeared.')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('o dismisses it, and a new warning still shows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readLive, fire, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readLive = vitest_1.vi.fn(live({ warning: 'First warning.' }));
                    return [4 /*yield*/, open('/home', held, { readLive: readLive })];
                case 1:
                    fire = (_b.sent()).fire;
                    return [4 /*yield*/, preact_1.screen.findByText('First warning.')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, key('o')];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText('First warning.')).toBeNull();
                    readLive.mockImplementation(live({ warning: 'Second warning.' }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fire()];
                        }); }); })];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Second warning.')];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the warning with no quest active', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', (0, test_support_1.projectView)(KEY), { readLive: live({ warning: 'A commit appeared.' }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('A commit appeared.')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the card alone when git can\'t be read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', held, { readLive: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't check git for the active quest." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.actions.finish })).toBeTruthy();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't check git for the active quest.")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
