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
var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'first', title: 'Fix the docs', isStar: true, xp: 25 }) }], canStart: 1 });
var ACCOUNTS = { kind: 'ready', accounts: [{ login: 'first-account', isActive: true, isWorking: true }, { login: 'second-account', isActive: false, isWorking: true }] };
var settings = function (over) { return ({ ok: true, data: __assign({ sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} }, over) }); };
var open = function (route_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([route_1], args_1, true), void 0, function (route, over) {
        var engine, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.location.hash = "#".concat(route);
                    engine = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: BOARD })];
                        }); }); }, readGithub: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: ACCOUNTS })];
                        }); }); } }, over)).engine;
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
                    return [2 /*return*/, { engine: engine, workspace: workspace }];
            }
        });
    });
};
var press = function (name) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: name })); }); };
var input = function (label, value) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.input(preact_1.screen.getByLabelText(label), { target: { value: value } }); }); };
var hud = function () { return document.querySelector('.hud'); };
// An account in the open dialog, once gh has answered.
var pick = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var radio;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, preact_1.within)(preact_1.screen.getByRole('dialog')).findByRole('radio', { name: name })];
            case 1:
                radio = _a.sent();
                (0, preact_1.act)(function () { return void preact_1.fireEvent.click(radio); });
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () {
    window.innerWidth = 1280;
});
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('the HUD', function () {
    (0, vitest_1.it)('leaves mana out until it\'s known, so nothing looks like a button that isn\'t', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.GAME), { allowance: null }) })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByRole('button', { name: en_1.t.github.connect })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).queryByText(/mana/i)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows mana once it is', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.GAME), { allowance: { percent: 62, resetsAt: null } }) })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByText(en_1.t.hud.mana(38, null))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('makes the chips that go somewhere real links', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByRole('link', { name: /^Level 2/ }).getAttribute('href')).toBe('#/hoard');
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByRole('link', { name: en_1.t.hud.streakLink(test_support_1.GAME.streak, test_support_1.GAME.bestStreak) }).getAttribute('href')).toBe('#/chronicle');
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByRole('link', { name: en_1.t.hud.goldLink(test_support_1.GAME.gold) }).getAttribute('href')).toBe('#/hoard');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says what the quest ahead does for your level', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.GAME), { xpIntoLevel: 190, xpToNextLevel: 200, level: 2 }) })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByText(en_1.t.hud.levelsUp('Fix the docs', 3))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts the quest in hand first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    view = (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)({ title: 'The quest in hand', xp: 50 }) });
                    return [4 /*yield*/, open('/home', { readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: view })];
                            }); }); }, readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.GAME), { xpIntoLevel: 190, xpToNextLevel: 200 }) })];
                            }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByText(en_1.t.hud.levelsUp('The quest in hand', 3))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('warns when the streak is still to keep today', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(KEY) })];
                        }); }); }, readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.GAME), { streak: 4, wonToday: false, xpIntoLevel: 20, xpToNextLevel: 200 }) })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByText(en_1.t.hud.keepStreak(4))).toBeTruthy();
                    (0, vitest_1.expect)(document.querySelector('.hud-chip.risk')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows on the bar what the quest ahead would add', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.bar .gain')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('keeping realms apart in Settings', function () {
    (0, vitest_1.it)('asks only for the realm you\'re in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readSettingsPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readSettingsPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: test_support_1.SETTINGS_PAGE })];
                    }); }); });
                    return [4 /*yield*/, open('/settings', { readSettingsPage: readSettingsPage })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readSettingsPage).toHaveBeenCalledWith(KEY); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names it, and lists no other', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.settings.thisRealm('a') })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByText('b-000002.json')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads again when you change realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readSettingsPage, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readSettingsPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: test_support_1.SETTINGS_PAGE })];
                    }); }); });
                    return [4 /*yield*/, open('/settings', { readSettingsPage: readSettingsPage, listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)(KEY), (0, test_support_1.projectRow)('b-000002')] })];
                            }); }); } })];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick('b-000002')];
                        }); }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readSettingsPage).toHaveBeenCalledWith('b-000002'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the section out with no realm picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings', { readSettingsPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.SETTINGS_PAGE), { realm: null }) })];
                        }); }); }, listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.settings.claude })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.settings.setNow)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a log path that leaves the realm, under the field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings', { readSettingsPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.SETTINGS_PAGE), { realm: __assign(__assign({}, test_support_1.SETTINGS_PAGE.realm), { logPath: null }) }) })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.settings.setNow })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.settings.setNow)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, input("".concat(en_1.t.finish.path, " *"), '../other-realm/log.md')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.save)];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.finish.pathOutside)).toBeTruthy();
                    (0, vitest_1.expect)(engine.setTaskLog).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('an empty board', function () {
    var empty = { readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(KEY) })];
        }); }); } };
    (0, vitest_1.it)('offers a way to fill it, on the board', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests', empty)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.empty.boardLine, { exact: false })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers a way to fill it, on Home', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', empty)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.empty.fileOne)];
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
    (0, vitest_1.it)('doesn\'t call a realm your first when you\'ve won elsewhere', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', empty)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.empty.noVictoriesHere)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.empty.noVictories)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('still welcomes a first victory when there are none anywhere', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', __assign(__assign({}, empty), { readGame: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.GAME), { victories: 0 }) })];
                        }); }); } }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.empty.noVictories)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows no such offer on a board with quests', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.empty.fileOne })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('connecting a realm to GitHub', function () {
    (0, vitest_1.it)('offers it where mana was, as a real button', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByRole('button', { name: en_1.t.github.connect })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the account once it\'s connected', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                return [2 /*return*/, settings({ realmAccounts: (_a = {}, _a[KEY] = 'first-account', _a) })];
                            });
                        }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByRole('button', { name: en_1.t.github.connected('first-account') })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps it to this realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, settings({ realmAccounts: { 'b-000002': 'first-account' } })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(hud()).getByRole('button', { name: en_1.t.github.connect })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('lists the accounts, and saves the one picked for this realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.github.connect)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, pick(/second-account/)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.save)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () {
                            var _a;
                            return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: (_a = {}, _a[KEY] = 'second-account', _a) });
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps other realms\' accounts when saving', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, settings({ realmAccounts: { 'b-000002': 'first-account' } })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.github.connect)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, pick(/second-account/)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.save)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () {
                            var _a;
                            return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: (_a = { 'b-000002': 'first-account' }, _a[KEY] = 'second-account', _a) });
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('can disconnect', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                return [2 /*return*/, settings({ realmAccounts: (_a = {}, _a[KEY] = 'first-account', _a) })];
                            });
                        }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.github.connected('first-account'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, pick(en_1.t.github.none)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.save)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: {} }); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when a connected account has gone from gh, and offers another', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                return [2 /*return*/, settings({ realmAccounts: (_a = {}, _a[KEY] = 'gone-account', _a) })];
                            });
                        }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.github.connected('gone-account'))];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.gone('gone-account'))];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByRole('radio', { name: /first-account/ })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).queryByRole('radio', { checked: true })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks an account whose sign-in lapsed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', { readGithub: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'ready', accounts: [{ login: 'first-account', isActive: true, isWorking: false }] } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.github.connect)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.lapsed, { exact: false })];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says what to do when gh isn\'t installed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', { readGithub: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'missing' } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.github.connect)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.missing)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('brew install gh')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers adding the first account when there are none', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', { readGithub: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'ready', accounts: [] } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.github.connect)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.github.add })];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.github.noAccounts)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when the accounts can\'t be read, with a way to try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readGithub, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readGithub = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't read your GitHub accounts." } })];
                    }); }); });
                    return [4 /*yield*/, open('/home', { readGithub: readGithub })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.github.connect)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't read your GitHub accounts.")];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readGithub).toHaveBeenCalledTimes(2); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('adding a GitHub account', function () {
    var CODE = { code: '100F-29B8', url: 'https://github.com/login/device' };
    var signingIn = function (over) {
        if (over === void 0) { over = {}; }
        return open('/home', __assign({ startGithubLogin: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ ok: true, data: CODE })];
            }); }); }), awaitGithubLogin: vitest_1.vi.fn(function () { return new Promise(function () { }); }) }, over));
    };
    var startIt = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, press(en_1.t.github.connect)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.github.add)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, vitest_1.it)('shows the code, and says to sign in as the account you want', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, signingIn()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startIt()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('100F-29B8')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.github.signInAs)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('copies the code and opens GitHub', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signingIn()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, startIt()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('100F-29B8')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.github.openIt)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.copyText).toHaveBeenCalledWith('100F-29B8'); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openGithubLogin).toHaveBeenCalled(); })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows it waiting', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, signingIn()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startIt()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.waiting)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('picks the new account when it comes in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finish, awaitGithubLogin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finish = function () { };
                    awaitGithubLogin = vitest_1.vi.fn(function () { return new Promise(function (done) { return (finish = done); }); });
                    return [4 /*yield*/, signingIn({ awaitGithubLogin: awaitGithubLogin })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, startIt()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('100F-29B8')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, finish({ ok: true, data: { view: ACCOUNTS, added: 'second-account' } })];
                        }); }); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByRole('radio', { name: /second-account/ }).checked).toBe(true); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('cancels the sign-in when you leave', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, signingIn()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, startIt()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('100F-29B8')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.actions.cancel)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.cancelGithubLogin).toHaveBeenCalled(); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says why it couldn\'t start', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, signingIn({ startGithubLogin: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "GitHub's sign-in didn't start." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, startIt()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("GitHub's sign-in didn't start.")];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('GitHub in Settings', function () {
    (0, vitest_1.it)('lists the accounts, with a button to add one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('first-account')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('second-account')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.github.add })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows and changes this realm\'s account', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                return [2 /*return*/, settings({ realmAccounts: (_a = {}, _a[KEY] = 'first-account', _a) })];
                            });
                        }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.github.changeFor('a') })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.github.changeFor('a'))];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a new realm', function () {
    var NEW = { path: '/p/demo', name: 'demo', key: 'demo-abc123', isKnown: false, isRepo: true };
    var addRealm = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened, _a;
            var _b;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, open('/home', __assign({ openFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: NEW })];
                            }); }); }, addProject: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: 'demo-abc123' })];
                            }); }); }) }, over))];
                    case 1:
                        opened = _c.sent();
                        return [4 /*yield*/, press(en_1.t.firstRun.openFolder)];
                    case 2:
                        _c.sent();
                        _a = [__assign({}, opened)];
                        _b = {};
                        return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                    case 3: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.dialog = _c.sent(), _b)]))];
                }
            });
        });
    };
    (0, vitest_1.it)('asks which account, listing what\'s available', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dialog, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, addRealm()];
                case 1:
                    dialog = (_b.sent()).dialog;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(dialog).findByRole('radio', { name: /first-account/ })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByRole('radio', { name: /second-account/ })).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByRole('radio', { name: en_1.t.github.none })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('won\'t add until it\'s answered, with the error under the choice', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, dialog;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, addRealm()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, dialog = _a.dialog;
                    return [4 /*yield*/, (0, preact_1.within)(dialog).findByRole('radio', { name: /first-account/ })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.github.pickOne)).toBeTruthy();
                    (0, vitest_1.expect)(engine.addProject).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves the account for the new realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addRealm()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, pick(/second-account/)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ realmAccounts: { 'demo-abc123': 'second-account' } }); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('adds with no account when that\'s the answer, and saves none', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addRealm()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, pick(en_1.t.github.none)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(engine.addProject).toHaveBeenCalled();
                    (0, vitest_1.expect)(engine.saveSettings).not.toHaveBeenCalledWith(vitest_1.expect.objectContaining({ realmAccounts: vitest_1.expect.anything() }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('doesn\'t hold you up with no accounts to pick from', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addRealm({ readGithub: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'ready', accounts: [] } })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.noAccounts)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.addProject).toHaveBeenCalled(); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('doesn\'t hold you up with gh not installed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addRealm({ readGithub: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'missing' } })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.missing)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.addProject).toHaveBeenCalled(); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the Library', function () {
    var book = function (over) { return (__assign({ title: over.id, author: null, totalPages: 400, firstPage: 0, page: 0, started: '2026-11-01', finished: null, log: [] }, over)); };
    var shelf = function (over) {
        if (over === void 0) { over = {}; }
        return (__assign({ reading: [], finished: [], finishedCount: 0, pagesRead: 0, pagesThisWeek: 0, pagesToday: 0 }, over));
    };
    var reply = function (over) {
        if (over === void 0) { over = {}; }
        return vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: shelf(over) })];
        }); }); });
    };
    var DUNE = book({ id: 'dune', title: 'Dune', author: 'Frank Herbert', page: 100 });
    (0, vitest_1.it)('is in the sidebar, with no realm needed', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readLibrary: reply(), listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.library }).getAttribute('href')).toBe('#/library');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says what to do with an empty shelf', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/library', { readLibrary: reply() })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.library.empty)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows how far through a book you are', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE] }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Dune' })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('Frank Herbert')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.progress(25, 300))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('img', { name: en_1.t.library.percent(25) })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows what you\'ve read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE], finishedCount: 3, pagesRead: 1200, pagesThisWeek: 80, pagesToday: 20 }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.library.stats(3, 1200))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.pace(20, 80))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('lists finished books with when', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/library', { readLibrary: reply({ finished: [book({ id: 'done', title: 'Emma', page: 400, finished: '2026-10-20' })], finishedCount: 1 }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Emma')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.finishedOn('20 Oct', 400))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves the page you\'ve reached', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setBookPage, page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setBookPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: shelf({ reading: [__assign(__assign({}, DUNE), { page: 150 })] }) })];
                    }); }); });
                    return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage: setBookPage })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.library.pageOf('Dune'))];
                case 2:
                    page = (_b.sent());
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(page, { target: { value: '150' } })];
                        }); }); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(page)];
                        }); }); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(setBookPage).toHaveBeenCalledWith('dune', 150); })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.library.progress(38, 250))];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves nothing when the page hasn\'t moved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setBookPage, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setBookPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: shelf() })];
                    }); }); });
                    return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage: setBookPage })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.library.pageOf('Dune'))];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(page)];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(setBookPage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps what you typed and says why when it can\'t save', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't save that." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.library.pageOf('Dune'))];
                case 2:
                    page = (_b.sent());
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(page, { target: { value: '150' } })];
                        }); }); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(page)];
                        }); }); })];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't save that.")];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(page.value).toBe('150');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the page saved elsewhere', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readLibrary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readLibrary = reply({ reading: [DUNE] });
                    return [4 /*yield*/, open('/library', { readLibrary: readLibrary, addBook: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: shelf({ reading: [__assign(__assign({}, DUNE), { page: 220 })] }) })];
                            }); }); }) })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.library.pageOf('Dune'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.library.add)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, input("".concat(en_1.t.form.title, " *"), 'Dune')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, input("".concat(en_1.t.library.totalPages, " *"), '412')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.library.addIt)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByLabelText(en_1.t.library.pageOf('Dune')).value).toBe('220'); })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says under the field when the page is past the end, and saves nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setBookPage, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setBookPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: shelf() })];
                    }); }); });
                    return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE] }), setBookPage: setBookPage })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.library.pageOf('Dune'))];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(page, { target: { value: '401' } })];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(page)];
                        }); }); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.badPage(400))).toBeTruthy();
                    (0, vitest_1.expect)(setBookPage).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks a book finished', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finishBook;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    finishBook = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: shelf() })];
                    }); }); });
                    return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE] }), finishBook: finishBook })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Dune' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.library.finish('Dune'))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(finishBook).toHaveBeenCalledWith('dune'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes a book off the shelf, asking first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var removeBook;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    removeBook = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: shelf() })];
                    }); }); });
                    return [4 /*yield*/, open('/library', { readLibrary: reply({ reading: [DUNE] }), removeBook: removeBook })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Dune' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.library.remove('Dune'))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(removeBook).not.toHaveBeenCalled();
                    return [4 /*yield*/, press(en_1.t.library.removeIt)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(removeBook).toHaveBeenCalledWith('dune'); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('adding a book', function () {
        var sheet = function () {
            var args_1 = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args_1[_i] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
                var opened;
                if (over === void 0) { over = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, open('/library', __assign({ readLibrary: reply(), addBook: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ ok: true, data: shelf({ reading: [DUNE] }) })];
                                }); }); }) }, over))];
                        case 1:
                            opened = _a.sent();
                            return [4 /*yield*/, preact_1.screen.findByText(en_1.t.library.empty)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, press(en_1.t.library.add)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, opened];
                    }
                });
            });
        };
        (0, vitest_1.it)('checks each field as it loses focus', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sheet()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, void preact_1.fireEvent.blur(preact_1.screen.getByLabelText("".concat(en_1.t.form.title, " *")))];
                            }); }); })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.form.titleRequired)).toBeTruthy();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, void preact_1.fireEvent.blur(preact_1.screen.getByLabelText("".concat(en_1.t.library.totalPages, " *")))];
                            }); }); })];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.pagesRequired)).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('checks everything on submit, with the button enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var engine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sheet()];
                    case 1:
                        engine = (_a.sent()).engine;
                        (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.library.addIt }).disabled).toBe(false);
                        return [4 /*yield*/, press(en_1.t.library.addIt)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.form.titleRequired)).toBeTruthy();
                        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.pagesRequired)).toBeTruthy();
                        (0, vitest_1.expect)(engine.addBook).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('keeps the button still under the mouse, so an error can\'t make the press miss', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sheet()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(preact_1.fireEvent.mouseDown(preact_1.screen.getByRole('button', { name: en_1.t.library.addIt }))).toBe(false);
                        (0, vitest_1.expect)(preact_1.fireEvent.mouseDown(preact_1.screen.getByLabelText("".concat(en_1.t.form.title, " *")))).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('refuses pages that aren\'t a number, in plain words', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sheet()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, input("".concat(en_1.t.library.totalPages, " *"), 'lots')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, press(en_1.t.library.addIt)];
                    case 3:
                        _a.sent();
                        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.pagesBad)).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('refuses a page past the end', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sheet()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, input("".concat(en_1.t.library.totalPages, " *"), '100')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, input(en_1.t.library.startPage, '101')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, press(en_1.t.library.addIt)];
                    case 4:
                        _a.sent();
                        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.library.badPage(100))).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('adds the book and closes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var engine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sheet()];
                    case 1:
                        engine = (_a.sent()).engine;
                        return [4 /*yield*/, input("".concat(en_1.t.form.title, " *"), 'Dune')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, input(en_1.t.library.author, 'Frank Herbert')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, input("".concat(en_1.t.library.totalPages, " *"), '412')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, input(en_1.t.library.startPage, '30')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, press(en_1.t.library.addIt)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.addBook).toHaveBeenCalledWith({ title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 30 }); })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('stays open with the reason when it can\'t save', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, sheet({ addBook: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: false, error: { message: "Couldn't save that." } })];
                            }); }); } })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, input("".concat(en_1.t.form.title, " *"), 'Dune')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, input("".concat(en_1.t.library.totalPages, " *"), '412')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, press(en_1.t.library.addIt)];
                    case 4:
                        _b.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                    case 5:
                        _a.apply(void 0, [(_b.sent()).textContent]).toBe("Couldn't save that.");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.it)('says when the shelf can\'t be read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/library', { readLibrary: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Your library file can't be read." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).textContent]).toContain("Your library file can't be read.");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('can be reached from the palette', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readLibrary: reply() })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, { key: 'k', metaKey: true }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('option', { name: /Library/ })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
