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
var OTHER = 'b-000002';
var KNOWN = { path: '/p/b', name: 'b', key: OTHER, isKnown: true, isRepo: true };
var NEW = { path: '/p/demo', name: 'demo', key: 'demo-abc123', isKnown: false, isRepo: true };
var TWO = { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)(KEY, { name: 'a' }), (0, test_support_1.projectRow)(OTHER, { name: 'b' })] })];
    }); }); } };
var open = function (route_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([route_1], args_1, true), void 0, function (route, over) {
        var heard, menu, engine, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.location.hash = "#".concat(route);
                    heard = null;
                    menu = null;
                    engine = (0, test_support_1.fakeEngine)(__assign(__assign(__assign({}, TWO), { onOpened: function (listener) {
                            heard = listener;
                            return function () { };
                        }, onMenu: function (listener) {
                            menu = listener;
                            return function () { };
                        } }), over)).engine;
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
                    return [2 /*return*/, { engine: engine, workspace: workspace, arrive: function (opened) { return (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, heard === null || heard === void 0 ? void 0 : heard(opened)];
                            }); }); }); }, menu: function (item) { return (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, menu === null || menu === void 0 ? void 0 : menu(item)];
                            }); }); }); } }];
            }
        });
    });
};
var press = function (name) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: name })); }); };
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('a link to a realm it knows', function () {
    (0, vitest_1.it)('selects it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, arrive;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, arrive = _a.arrive;
                    return [4 /*yield*/, arrive({ kind: 'folder', pick: KNOWN })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ lastProject: OTHER }); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tags it Detected in the sidebar', function () { return __awaiter(void 0, void 0, void 0, function () {
        var arrive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    arrive = (_a.sent()).arrive;
                    return [4 /*yield*/, arrive({ kind: 'folder', pick: KNOWN })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('button', { name: /^b/ })).getByText(new RegExp(en_1.t.status.detected))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('button', { name: /^a/ })).queryByText(new RegExp(en_1.t.status.detected))).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves the tag to the next realm opened', function () { return __awaiter(void 0, void 0, void 0, function () {
        var arrive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    arrive = (_a.sent()).arrive;
                    return [4 /*yield*/, arrive({ kind: 'folder', pick: KNOWN })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, arrive({ kind: 'folder', pick: __assign(__assign({}, KNOWN), { key: KEY }) })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('button', { name: /^b/ })).queryByText(new RegExp(en_1.t.status.detected))).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a link to a folder it doesn\'t know', function () {
    (0, vitest_1.it)('asks first, and adds nothing on the link\'s word', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, arrive;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, arrive = _a.arrive;
                    return [4 /*yield*/, arrive({ kind: 'folder', pick: NEW })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByText(en_1.t.addRealm.notYet('demo'))).toBeTruthy();
                    (0, vitest_1.expect)(engine.addProject).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tags the realm once it\'s added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var listProjects, addProject, arrive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listProjects = vitest_1.vi.fn(TWO.listProjects);
                    addProject = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: 'demo-abc123' })];
                    }); }); });
                    return [4 /*yield*/, open('/home', { listProjects: listProjects, addProject: addProject })];
                case 1:
                    arrive = (_a.sent()).arrive;
                    return [4 /*yield*/, arrive({ kind: 'folder', pick: NEW })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.noAccounts)];
                case 3:
                    _a.sent();
                    listProjects.mockResolvedValue({ ok: true, data: [(0, test_support_1.projectRow)(KEY), (0, test_support_1.projectRow)('demo-abc123', { name: 'demo' })] });
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('button', { name: /^demo/ })).getByText(new RegExp(en_1.t.status.detected))).toBeTruthy(); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves everything alone on Cancel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, arrive;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, arrive = _a.arrive;
                    return [4 /*yield*/, arrive({ kind: 'folder', pick: NEW })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.cancel)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    (0, vitest_1.expect)(engine.addProject).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('what can go wrong', function () {
    (0, vitest_1.it)('says so for a bad link', function () { return __awaiter(void 0, void 0, void 0, function () {
        var arrive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    arrive = (_a.sent()).arrive;
                    return [4 /*yield*/, arrive({ kind: 'failed', message: "That link doesn't name a folder." })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText("That link doesn't name a folder.")).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('what arrived before the window was listening', function () {
    (0, vitest_1.it)('is picked up at the start', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { takeOpened: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [{ kind: 'folder', pick: KNOWN }] })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ lastProject: OTHER }); })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so if it can\'t be read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', { takeOpened: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't open that folder." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't open that folder.")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the Judgement notification', function () {
    (0, vitest_1.it)('opens that realm on Home, where the question is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var asked, arrive, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    asked = (0, test_support_1.projectView)(OTHER, { active: (0, test_support_1.activeQuest)({ title: 'The quest', review: { at: 'now', checked: null } }) });
                    return [4 /*yield*/, open('/quests', { readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: key === OTHER ? asked : (0, test_support_1.projectView)(key) })];
                            }); }); } })];
                case 1:
                    arrive = (_b.sent()).arrive;
                    return [4 /*yield*/, arrive({ kind: 'judgement', key: OTHER })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/home'); })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.judgement.ask('The quest') })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('installing the command', function () {
    var installed = function (command) { return ({ readSettingsPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.SETTINGS_PAGE), { command: command }) })];
        }); }); } }); };
    (0, vitest_1.it)('offers it in Settings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText('a-000001.json')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.settings.install)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.installCommand).toHaveBeenCalled(); })];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.settings.installed('/usr/local/bin/queue-tea'))];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says where it is once it\'s there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings', installed({ path: '/usr/local/bin/queue-tea', needsPath: false }))];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('/usr/local/bin/queue-tea')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.settings.install })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when its folder needs adding to the PATH', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = { ok: true, data: { path: '/h/.local/bin/queue-tea', needsPath: true } };
                    return [4 /*yield*/, open('/settings', { installCommand: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, path];
                            }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('a-000001.json')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.settings.install)];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.settings.installedPath('/h/.local/bin/queue-tea'))];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says why not when it can\'t', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings', { installCommand: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "There's already a queue-tea here." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('a-000001.json')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.settings.install)];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("There's already a queue-tea here.")];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('runs from the menu too', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, menu;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, menu = _a.menu;
                    return [4 /*yield*/, menu({ kind: 'installCommand' })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.installCommand).toHaveBeenCalled(); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('explains the link the tea cup uses', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.settings.linkLine)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
