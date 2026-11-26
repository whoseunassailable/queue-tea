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
var FIRST = (0, test_support_1.quest)({ id: 'first', title: 'Fix the docs', isStar: true, why: 'mid' });
var SECOND = (0, test_support_1.quest)({ id: 'second', title: 'Other quest' });
var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: FIRST }, { kind: 'quest', quest: SECOND }], canStart: 2 });
var open = function (route_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([route_1], args_1, true), void 0, function (route, view, over) {
        var menu, _a, engine, fire, workspace;
        if (view === void 0) { view = BOARD; }
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.location.hash = "#".concat(route);
                    menu = null;
                    _a = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view })];
                        }); }); }, onMenu: function (listener) {
                            menu = listener;
                            return function () { };
                        } }, over)), engine = _a.engine, fire = _a.fire;
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
                    return [2 /*return*/, { engine: engine, workspace: workspace, fire: fire, menu: function (item) { return (0, preact_1.act)(function () { return menu === null || menu === void 0 ? void 0 : menu(item); }); } }];
            }
        });
    });
};
var key = function (name, over) {
    if (over === void 0) { over = {}; }
    return (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, __assign({ key: name }, over)); });
};
var palette = function () { return key('k', { metaKey: true }); };
var type = function (text) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.input(preact_1.screen.getByRole('combobox', { name: en_1.t.palette.placeholder }), { target: { value: text } }); }); };
var options = function () { return preact_1.screen.getAllByRole('option').map(function (option) { return option.textContent; }); };
var resize = function (width) {
    return (0, preact_1.act)(function () {
        window.innerWidth = width;
        window.dispatchEvent(new Event('resize'));
    });
};
(0, vitest_1.beforeEach)(function () {
    window.innerWidth = 1280;
});
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('the command palette', function () {
    (0, vitest_1.it)('⌘K opens it, on the input', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(document.activeElement).toBe(preact_1.screen.getByRole('combobox'));
                    (0, vitest_1.expect)(options()[0]).toContain(en_1.t.actions.startNamed('Fix the docs'));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘K works from a page with no realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild', (0, test_support_1.projectView)(KEY), { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog', { name: en_1.t.palette.label })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Esc closes it and hands the keys back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, key('Escape')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [4 /*yield*/, key('s')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalled(); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes the board\'s letters as typing while it\'s open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(preact_1.screen.getByRole('combobox'), { key: 's' }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('s')];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(engine.checkStart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Return runs what\'s highlighted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, key('Enter')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledWith(KEY, 'first'); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog', { name: en_1.t.palette.label })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('↓ moves the highlight, and Return follows it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, key('ArrowDown')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.form.newTitle('a') })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('finds a quest as you type, and opens it on the board', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('other')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(window.location.hash).toBe('#/quests');
                    (0, vitest_1.expect)(workspace.getState().openQuests[KEY]).toBe('second');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘↩ starts the quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('other')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('Enter', { metaKey: true })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows what can\'t run dim with its reason, and Return does nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, option;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('back to')];
                case 3:
                    _a.sent();
                    option = preact_1.screen.getByRole('option', { name: new RegExp(en_1.t.actions.back) });
                    (0, vitest_1.expect)(option.getAttribute('aria-disabled')).toBe('true');
                    (0, vitest_1.expect)(option.textContent).toContain(en_1.t.palette.noActive);
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(engine.putBackQuest).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog', { name: en_1.t.palette.label })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers to file what it can\'t find', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, type('zebra crossing')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = preact_1.within;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 5:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).getByLabelText("".concat(en_1.t.form.title, " *")).value]).toBe('zebra crossing');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes to a page', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('hoard')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/hoard'); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes to another realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)(KEY), (0, test_support_1.projectRow)('b-000002', { name: 'beta' })] })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('beta')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ lastProject: 'b-000002' }); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a click runs an option', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('option', { name: /Hoard/ })); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/hoard'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('notes from any screen through the palette', function () {
    var one = (0, test_support_1.note)({ id: 'sensor', title: 'Sensor diary', body: 'Pressure readings at noon.' });
    var view = __assign(__assign({}, test_support_1.NOTES), { notes: [(0, test_support_1.note)({ id: 'first-note', title: 'First note', updated: '2026-11-08' }), one] });
    var readNotes = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ ok: true, data: view })];
    }); }); };
    (0, vitest_1.it)('reads notes only while open, finds text, and Return opens the chosen note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, found, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { readNotes: vitest_1.vi.fn(readNotes) })];
                case 1:
                    engine = (_b.sent()).engine;
                    (0, vitest_1.expect)(engine.readNotes).not.toHaveBeenCalled();
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('pressure')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: /Sensor diary/ })];
                case 4:
                    found = _b.sent();
                    (0, vitest_1.expect)(found.textContent).toContain('Pressure readings at noon.');
                    (0, vitest_1.expect)(engine.readNotes).toHaveBeenCalledWith(KEY);
                    return [4 /*yield*/, key('Enter')];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Sensor diary')];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(window.location.hash).toBe('#/notes');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘↩ also opens a matched note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings', BOARD, { readNotes: readNotes })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('sensor')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: /Sensor diary/ })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, key('Enter', { metaKey: true })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Sensor diary')];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens the selected note when Notes is already showing another one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var found, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/notes', BOARD, { readNotes: readNotes })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('First note')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, type('sensor')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: /Sensor diary/ })];
                case 5:
                    found = _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(found); })];
                case 6:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Sensor diary')];
                case 7:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('New note in the palette opens an Untitled note in Inbox from Settings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var made, engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    made = (0, test_support_1.note)({ title: 'Untitled', folder: 'Inbox' });
                    return [4 /*yield*/, open('/settings', BOARD, { createNote: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: { view: __assign(__assign({}, test_support_1.NOTES), { notes: [made] }), id: made.id } })];
                            }); }); }) })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('new note')];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('option', { name: /New note⇧⌘N/ })).toBeTruthy();
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.createNote).toHaveBeenCalledWith(KEY, { title: 'Untitled', folder: 'Inbox', body: '' }); })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Untitled')];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Jot saves to Inbox and stays on the current screen, with Open in its toast', function () { return __awaiter(void 0, void 0, void 0, function () {
        var made, saved, engine, openButton, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    made = (0, test_support_1.note)({ title: 'Buy oat milk', folder: 'Inbox' });
                    saved = false;
                    return [4 /*yield*/, open('/home', BOARD, {
                            readNotes: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.NOTES), { notes: saved ? [made] : [] }) })];
                            }); }); },
                            createNote: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                saved = true;
                                return [2 /*return*/, { ok: true, data: { view: __assign(__assign({}, test_support_1.NOTES), { notes: [made] }), id: made.id } }];
                            }); }); }),
                        })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('Buy oat milk')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('option', { name: /Jot "Buy oat milk"/ })); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.createNote).toHaveBeenCalledWith(KEY, { title: 'Buy oat milk', folder: 'Inbox', body: '' }); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(window.location.hash).toBe('#/home');
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Open' })];
                case 6:
                    openButton = _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(openButton); })];
                case 7:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Buy oat milk')];
                case 8:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘↩ on Jot creates and opens the note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var made, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    made = (0, test_support_1.note)({ title: 'Buy oat milk', folder: 'Inbox' });
                    return [4 /*yield*/, open('/home', BOARD, { createNote: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: { view: __assign(__assign({}, test_support_1.NOTES), { notes: [made] }), id: made.id } })];
                            }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('Buy oat milk')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.mouseEnter(preact_1.screen.getByRole('option', { name: /Jot "Buy oat milk"/ })); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, key('Enter', { metaKey: true })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Buy oat milk')];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed Jot keeps the words for Try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var createNote, retry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createNote = vitest_1.vi.fn()
                        .mockResolvedValueOnce({ ok: false, error: { message: 'Could not save. Try again.' } })
                        .mockResolvedValueOnce({ ok: true, data: { view: test_support_1.NOTES, id: 'made' } });
                    return [4 /*yield*/, open('/home', BOARD, { createNote: createNote })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('Buy oat milk')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('option', { name: /Jot "Buy oat milk"/ })); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Try again' })];
                case 5:
                    retry = _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(retry); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(createNote).toHaveBeenCalledTimes(2); })];
                case 7:
                    _a.sent();
                    (0, vitest_1.expect)(createNote.mock.calls[1]).toEqual([KEY, { title: 'Buy oat milk', folder: 'Inbox', body: '' }]);
                    (0, vitest_1.expect)(window.location.hash).toBe('#/home');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a pending notes read never takes Return away from creating a quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { readNotes: function () { return new Promise(function () { }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('Buy oat milk')];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.palette.readingNotes)).toBeTruthy();
                    return [4 /*yield*/, key('Enter')];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.form.newTitle('a') })];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('arrow keys pass the reading row in both directions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var box, rows, reading, previous;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { readNotes: function () { return new Promise(function () { }); } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('docs')];
                case 3:
                    _a.sent();
                    box = preact_1.screen.getByRole('combobox', { name: en_1.t.palette.placeholder });
                    rows = preact_1.screen.getAllByRole('option');
                    reading = rows.findIndex(function (row) { return row.textContent === en_1.t.palette.readingNotes; });
                    previous = rows[reading - 1];
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.mouseEnter(previous); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, key('ArrowDown')];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(box.getAttribute('aria-activedescendant')).toBe('palette-create');
                    return [4 /*yield*/, key('ArrowUp')];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(box.getAttribute('aria-activedescendant')).toBe(previous.id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed read opens Notes with a way to retry', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, failed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { readNotes: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'Could not read. Try again.' } })];
                        }); }); }) })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('sensor')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: en_1.t.palette.notesFailed })];
                case 4:
                    failed = _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(failed); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(window.location.hash).toBe('#/notes');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.failed.tryAgain })];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(engine.readNotes).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with no realm, no notes are read and no note can be created', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild', BOARD, { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, type('new note')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.readNotes).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('option', { name: /New note⇧⌘N/ })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('option', { name: /Jot/ })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a query without a note match says how to make one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { readNotes: readNotes })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('missing words')];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('No notes match. Try other words, or jot this idea into Inbox.')];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('option', { name: /Jot "missing words"/ })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps readable notes available when some files cannot be read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { readNotes: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, view), { unreadable: ['broken.md'] }) })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('sensor')];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: /Sensor diary/ })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('option', { name: "Some note files couldn't be read. Open Notes to see which." })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed refresh says the shown notes are from the last read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var read, fire, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    read = vitest_1.vi.fn().mockResolvedValueOnce({ ok: true, data: view }).mockResolvedValue({ ok: false, error: { message: 'Could not refresh.' } });
                    return [4 /*yield*/, open('/home', BOARD, { readNotes: read })];
                case 1:
                    fire = (_b.sent()).fire;
                    return [4 /*yield*/, palette()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, type('sensor')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: /Sensor diary/ })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fire()];
                        }); }); })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: "Couldn't refresh your notes. Showing the last read. Open Notes to try again." })];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('option', { name: /Sensor diary/ })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('changing realms clears the previous notes while the next realm loads', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, {
                        listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)(KEY), (0, test_support_1.projectRow)('b-000002')] })];
                        }); }); },
                        readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(key) })];
                        }); }); },
                        readNotes: function (key) { return key === KEY ? readNotes() : new Promise(function () { }); },
                    })];
                case 1:
                    workspace = (_a.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick(KEY)];
                        }); }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, type('sensor')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('option', { name: /Sensor diary/ })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick('b-000002')];
                        }); }); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, type('sensor')];
                case 7:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('option', { name: /Sensor diary/ })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.palette.readingNotes)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a jotted note’s Open action returns to the realm where it was saved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var made, saved, workspace, openButton, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    made = (0, test_support_1.note)({ title: 'Buy oat milk', folder: 'Inbox' });
                    saved = false;
                    return [4 /*yield*/, open('/home', BOARD, {
                            listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)(KEY), (0, test_support_1.projectRow)('b-000002')] })];
                            }); }); },
                            readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(key) })];
                            }); }); },
                            readNotes: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.NOTES), { notes: key === KEY ? (saved ? [(0, test_support_1.note)({ id: 'newer', title: 'Newer note', updated: '2026-11-08' }), made] : []) : [(0, test_support_1.note)({ title: 'Other realm note' })] }) })];
                            }); }); },
                            createNote: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                saved = true;
                                return [2 /*return*/, { ok: true, data: { view: __assign(__assign({}, test_support_1.NOTES), { notes: [made] }), id: made.id } }];
                            }); }); },
                        })];
                case 1:
                    workspace = (_b.sent()).workspace;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick(KEY)];
                        }); }); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, palette()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, type('Buy oat milk')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('option', { name: /Jot "Buy oat milk"/ })); })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Open' })];
                case 6:
                    openButton = _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick('b-000002')];
                        }); }); })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void (window.location.hash = '#/notes'); })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Other realm note')];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(openButton); })];
                case 10:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Buy oat milk')];
                case 11:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(workspace.getState().selected).toBe(KEY);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the menu bar', function () {
    (0, vitest_1.it)('runs a letter as the key would', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, menu;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, menu = _a.menu;
                    return [4 /*yield*/, menu({ kind: 'key', key: 's', isMeta: false })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalled(); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('still runs a letter with the letter keys off, as it isn\'t a key press', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, menu;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: false, realmAccounts: {} } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, menu = _a.menu;
                    return [4 /*yield*/, menu({ kind: 'key', key: 's', isMeta: false })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalled(); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('runs a ⌘ command', function () { return __awaiter(void 0, void 0, void 0, function () {
        var menu;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    menu = (_a.sent()).menu;
                    return [4 /*yield*/, menu({ kind: 'key', key: 'k', isMeta: true })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog', { name: en_1.t.palette.label })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the realm\'s record in Finder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, menu;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, menu = _a.menu;
                    return [4 /*yield*/, menu({ kind: 'showRecord' })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.showRecord).toHaveBeenCalledWith(KEY); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does nothing for the record with no realm picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, menu;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', BOARD, { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, menu = _a.menu;
                    return [4 /*yield*/, menu({ kind: 'showRecord' })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.showRecord).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a narrower window', function () {
    (0, vitest_1.it)('keeps the detail pane beside the list at full width', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.detail')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.narrow.closeDetail })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('below 1180 px, opens the detail over the list when a row is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, resize(1000)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.detail')).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: /^Other quest/ })); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.quests.floating .detail')).toBeTruthy();
                    (0, vitest_1.expect)(document.querySelector('.qlist')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('✕ closes it, and so does Esc', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, resize(1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: /^Other quest/ })); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.narrow.closeDetail })); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.detail')).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: /^Other quest/ })); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, key('Escape')];
                case 6:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.detail')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Return opens the detail of the row selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, resize(1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, key('Enter')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.detail')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves Return on a focused button to press that button', function () { return __awaiter(void 0, void 0, void 0, function () {
        var start;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    start = preact_1.screen.getByRole('button', { name: en_1.t.actions.startMain });
                    (0, vitest_1.expect)(preact_1.fireEvent.keyDown(start, { key: 'Enter' })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('below 900 px, the detail is a page of its own with a way back', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, resize(800)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: /^Other quest/ })); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.detail')).toBeTruthy();
                    (0, vitest_1.expect)(document.querySelector('.qlist')).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.narrow.back })); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(document.querySelector('.qlist')).toBeTruthy();
                    (0, vitest_1.expect)(document.querySelector('.detail')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('below 900 px, the tabs become a menu', function () { return __awaiter(void 0, void 0, void 0, function () {
        var menu;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, resize(800)];
                case 2:
                    _a.sent();
                    menu = preact_1.screen.getByRole('combobox', { name: en_1.t.narrow.section });
                    (0, vitest_1.expect)(menu.value).toBe('/home');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.change(menu, { target: { value: '/quests' } }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/quests'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('below 900 px, the realms come back on request', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, resize(800)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.rm')) === null || _a === void 0 ? void 0 : _a.className).not.toContain('side-open');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.narrow.showRealms })); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)((_b = document.querySelector('.rm')) === null || _b === void 0 ? void 0 : _b.className).toContain('side-open');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌃⌘S brings them back too, and picking a realm puts them away', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    workspace = (_c.sent()).workspace;
                    return [4 /*yield*/, resize(800)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, key('s', { metaKey: true, ctrlKey: true })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.rm')) === null || _a === void 0 ? void 0 : _a.className).toContain('side-open');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick(KEY)];
                        }); }); })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: /^a/ })); })];
                case 5:
                    _c.sent();
                    (0, vitest_1.expect)((_b = document.querySelector('.rm')) === null || _b === void 0 ? void 0 : _b.className).not.toContain('side-open');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the active quest behind the palette', function () {
    (0, vitest_1.it)('offers its own actions first', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)({ title: 'The boss' }) }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, palette()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(options()[0]).toContain(en_1.t.actions.openClaude);
                    return [2 /*return*/];
            }
        });
    }); });
});
