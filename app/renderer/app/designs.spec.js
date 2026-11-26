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
var constants_1 = require("../core/constants/constants");
var comments_panel_1 = require("../features/designs/presentation/widgets/comments_panel");
var workspace_store_1 = require("../features/workspace/state_management/workspace_store");
var en_1 = require("../l10n/en");
var test_support_1 = require("../test_support");
var app_1 = require("./app");
var KEY = 'a-000001';
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var _a, engine, fire, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.location.hash = '#/designs';
                    _a = (0, test_support_1.fakeEngine)(over), engine = _a.engine, fire = _a.fire;
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
                    return [2 /*return*/, { engine: engine, fire: fire }];
            }
        });
    });
};
var press = function (name, within_) {
    if (within_ === void 0) { within_ = document.body; }
    return (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(within_).getByRole('button', { name: name })); });
};
var type = function (label, value) {
    var field = (0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByLabelText(label);
    preact_1.fireEvent.input(field, { target: { value: value } });
    preact_1.fireEvent.blur(field);
    return field;
};
var errorOf = function (field) { var _a, _b, _c; return (_c = (_b = document.getElementById((_a = field.getAttribute('aria-describedby')) !== null && _a !== void 0 ? _a : '')) === null || _b === void 0 ? void 0 : _b.textContent) !== null && _c !== void 0 ? _c : null; };
var never = function () { return new Promise(function () { }); };
var ok = function (data) { return ({ ok: true, data: data }); };
var row = function (folder, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ folder: folder, label: folder, made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designCount: 2, open: 0, resolved: 0, sent: 0, sentTo: null, next: null, approved: null, problem: null }, over));
};
var designsOf = function (versions, coming) {
    if (coming === void 0) { coming = []; }
    return function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ok({ versions: versions, coming: coming })];
    }); }); };
};
var versionOf = function (over) {
    if (over === void 0) { over = {}; }
    return function (_key, folder) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ok(__assign({ folder: folder, label: folder, designs: ['welcome', 'pair'], comments: [], commentsProblem: null, uncommitted: 0 }, over))];
    }); }); };
};
var scene = function (name) { return ({ format: 1, name: name, width: 390, height: 844, fill: '#F6F1E7', nodes: [{ id: 'headline', type: 'text', name: 'Headline', x: 24, y: 293, width: 342, text: 'Walk better', font: 'Nunito Sans', size: 28, weight: 400, color: '#2A2218' }] }); };
var ready = function (name) { return ok({ kind: 'ready', scene: scene(name), stamp: "stamp-".concat(name) }); };
var readEach = function (_key, _folder, id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ready(id === 'welcome' ? 'Welcome' : 'Pair your insoles')];
}); }); };
var comment = function (over) { return (__assign({ design: 'welcome', on: null, text: 'Make the headline shorter.', by: 'Rohan', at: '2026-11-05T10:00:00Z', resolved: null, sentTo: null }, over)); };
// Every card has read and told the page its names, so the criteria can quote them.
var allRead = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, preact_1.screen.findByText('Pair your insoles')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.designs.stillReading)).toBeNull(); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var OPEN = [comment({ id: 'c1', on: 'headline' }), comment({ id: 'c2', text: 'The hero is too tall.' })];
(0, vitest_1.afterEach)(function () {
    (0, preact_1.cleanup)();
    window.innerWidth = 1280;
});
(0, vitest_1.describe)('the Designs page', function () {
    (0, vitest_1.it)('says what it is reading while the realm\'s designs load', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ readDesigns: never })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('main')).getByRole('status').textContent).toContain(en_1.t.designs.loading);
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.designs.loadingWhere('a'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a failed read in plain words, with Try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readDesigns, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    readDesigns = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't read this realm's designs." } })];
                    }); }); });
                    return [4 /*yield*/, open({ readDesigns: readDesigns })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 2:
                    _a.apply(void 0, [(_c.sent()).textContent]).toContain("Couldn't read this realm's designs.");
                    readDesigns.mockImplementationOnce(designsOf([row('5.4.3')]));
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 3:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers a first design quest in a realm with no designs, needing no comments', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a, sheet, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = (_c.sent()).engine;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.designs.emptyTitle('a') })];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.designs.fileDesignQuest)];
                case 3:
                    _c.sent();
                    sheet = preact_1.screen.getByRole('dialog', { name: en_1.t.designs.firstSheet });
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.designs.versionLabel, " *")).value).toBe('1');
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ title: en_1.t.designs.firstTitle('a') })); })];
                case 5:
                    _c.sent();
                    (0, vitest_1.expect)(engine.sendDesignComments).not.toHaveBeenCalled();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.firstFiledTitle)];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens the newest version that reads, and another from the rail', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3'), row('onboarding-pass-2', { label: 'Onboarding pass 2' })]), readDesignVersion: vitest_1.vi.fn(versionOf()), readDesign: readEach })];
                case 1:
                    engine = (_c.sent()).engine;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [4 /*yield*/, press(/Onboarding pass 2/)];
                case 3:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Onboarding pass 2' })];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(engine.readDesignVersion).toHaveBeenLastCalledWith(KEY, 'onboarding-pass-2');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the version filed but not drafted yet as coming', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3')], [{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.3' }]), readDesignVersion: versionOf(), readDesign: readEach })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('complementary', { name: en_1.t.designs.history })];
                case 2:
                    rail = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(rail).getByText('5.4.4')).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(rail).getByText(en_1.t.designs.comingLine)).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(rail).getByText(en_1.t.designs.comingFrom('5.4.3'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a version that does not read by its file and line, and can put its last good copy back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var problem, readDesigns, engine, alert, reads;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    problem = { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: Date.parse('2026-11-04T12:00:00Z') };
                    readDesigns = vitest_1.vi.fn(designsOf([row('5.4.2', { problem: problem })]));
                    return [4 /*yield*/, open({ readDesigns: readDesigns })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 2:
                    alert = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(alert).getByRole('heading', { name: en_1.t.designs.versionBrokenTitle('5.4.2') })).toBeTruthy();
                    (0, vitest_1.expect)(alert.textContent).toContain('It has a mistake near line 3.');
                    (0, vitest_1.expect)(alert.textContent).toContain('docs/designs/5.4.2/version.json');
                    reads = readDesigns.mock.calls.length;
                    return [4 /*yield*/, press(en_1.t.designs.useLastGood, alert)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.restoreDesignFile).toHaveBeenCalledWith(KEY, '5.4.2', 'version'); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readDesigns.mock.calls.length).toBeGreaterThan(reads); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers no last good copy when none was kept', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.2', { problem: { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: null } })]) })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.designs.useLastGood })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.failed.tryAgain })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the designs that have read, a spinner on the rest, and says so beside Next version', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf(), readDesign: function (_k, _f, id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, (id === 'welcome' ? ready('Welcome') : never())];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Welcome')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.designs.readingDesign('pair'))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.designs.stillReading)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says which design does not read and near which line, never the parser\'s words', function () { return __awaiter(void 0, void 0, void 0, function () {
        var problem, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    problem = { file: 'docs/designs/5.4.3/pair.design.json', detail: 'It has a mistake near line 5.', backupAt: null };
                    return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf(), readDesign: function (_k, _f, id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (id === 'welcome' ? ready('Welcome') : ok({ kind: 'broken', problem: problem }))];
                            }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.brokenLine(problem.file, problem.detail))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.designs.brokenTitle('pair') })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says a version with no designs has none yet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf({ designs: [] }) })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.noDesigns)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('in a narrow window', function () {
        (0, vitest_1.it)('turns the rail into a menu that lists the coming version and shows the folder', function () { return __awaiter(void 0, void 0, void 0, function () {
            var engine, list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.innerWidth = 700;
                        return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3'), row('5.4.2')], [{ label: '5.4.4', quest: 'Q', from: '5.4.3' }]), readDesignVersion: versionOf(), readDesign: readEach })];
                    case 1:
                        engine = (_a.sent()).engine;
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = (_a = preact_1.fireEvent).click;
                                        return [4 /*yield*/, preact_1.screen.findByRole('button', { name: "".concat(en_1.t.designs.versionMenu(1, 2), " \u25BE") })];
                                    case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                                }
                            }); }); })];
                    case 2:
                        _a.sent();
                        list = preact_1.screen.getByRole('listbox', { name: en_1.t.designs.historyMenu });
                        (0, vitest_1.expect)((0, preact_1.within)(list).getByRole('option', { name: /5\.4\.4/ }).getAttribute('aria-disabled')).toBe('true');
                        return [4 /*yield*/, press(en_1.t.designs.showInFinder)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.showDesigns).toHaveBeenCalledWith(KEY); })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('says why the folder could not be shown', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        window.innerWidth = 700;
                        return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf(), readDesign: readEach, showDesigns: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, ({ ok: false, error: { message: "Couldn't show the folder." } })];
                                }); }); } })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _b = (_a = preact_1.fireEvent).click;
                                        return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.designs.showInFinder })];
                                    case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                                }
                            }); }); })];
                    case 2:
                        _b.sent();
                        _a = vitest_1.expect;
                        return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                    case 3:
                        _a.apply(void 0, [(_b.sent()).textContent]).toBe("Couldn't show the folder.");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
(0, vitest_1.describe)('Next version', function () {
    var withComments = function (comments, over) {
        if (over === void 0) { over = {}; }
        return open(__assign({ readDesigns: designsOf([row('5.4.3'), row('5.4.2')]), readDesignVersion: versionOf({ comments: comments }), readDesign: readEach }, over));
    };
    var openSheet = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, press(en_1.t.designs.nextVersion)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, preact_1.screen.getByRole('dialog', { name: en_1.t.designs.nextSheet('5.4.3') })];
            }
        });
    }); };
    (0, vitest_1.it)('asks for a comment first, and files nothing, with no open comments', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withComments([comment({ id: 'c3', resolved: '2026-11-05T11:00:00Z' }), comment({ id: 'c4', sentTo: '5.4.3' })])];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.designs.nextVersion)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toBe('Add a comment first: the next version is built from your feedback.');
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says how many open comments it would send', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, withComments(OPEN)];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.nextLine(2, 1, '5.4.4'))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts with the next free label and one criterion per open comment', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sheet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withComments(OPEN)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, allRead()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.designs.versionLabel, " *")).value).toBe('5.4.4');
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.designs.questTitle, " *")).value).toBe(en_1.t.designs.nextTitle('5.4.4', '5.4.3'));
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText(en_1.t.designs.criteria).value.split('\n')).toEqual([
                        'Welcome · Headline: Make the headline shorter.',
                        'Welcome: The hero is too tall.',
                        en_1.t.designs.nextVersionLine('docs/designs/5.4.4/version.json', '5.4.3'),
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says uncommitted changes should be committed first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sheet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf({ comments: OPEN, uncommitted: 2 }), readDesign: readEach })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByText(en_1.t.designs.uncommitted('5.4.3', 2))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the required errors under the label and title once they lose focus', function () { return __awaiter(void 0, void 0, void 0, function () {
        var label, title;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, withComments(OPEN)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    _b.sent();
                    label = type("".concat(en_1.t.designs.versionLabel, " *"), '  ');
                    title = type("".concat(en_1.t.designs.questTitle, " *"), '');
                    (0, vitest_1.expect)(errorOf(label)).toBe('Version label is required.');
                    (0, vitest_1.expect)(errorOf(title)).toBe('Quest title is required.');
                    (0, vitest_1.expect)((_a = label.closest('.form-field')) === null || _a === void 0 ? void 0 : _a.contains(document.getElementById(label.getAttribute('aria-describedby')))).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names a label that is already taken', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withComments(OPEN)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(errorOf(type("".concat(en_1.t.designs.versionLabel, " *"), '5.4.2'))).toBe('A version called 5.4.2 already exists. Pick another label.');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows every error and files nothing when pressed with a field wrong', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, sheet, title;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withComments(OPEN)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _a.sent();
                    title = (0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.designs.questTitle, " *"));
                    preact_1.fireEvent.input(title, { target: { value: '' } });
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(errorOf(title)).toBe(en_1.t.designs.questTitleRequired);
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.designs.fileQuest })).toHaveProperty('disabled', false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('files the quest, then marks the comments as sent to the new label', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, sheet, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, withComments(OPEN)];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, allRead()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _b.sent();
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.sendDesignComments).toHaveBeenCalledWith(KEY, '5.4.3', { label: '5.4.4', quest: en_1.t.designs.nextTitle('5.4.4', '5.4.3') }); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ title: en_1.t.designs.nextTitle('5.4.4', '5.4.3'), criteria: vitest_1.expect.arrayContaining(['Welcome: The hero is too tall.']) }));
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.filedTitle)];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a version merged under that label', { versions: [row('5.4.3'), row('5.4.2'), row('5.4.4')], coming: [] }],
        ['another version filed it as coming', { versions: [row('5.4.3'), row('5.4.2')], coming: [{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.2' }] }],
    ])('reads the realm again before filing, and files nothing once %s', function (_, later) { return __awaiter(void 0, void 0, void 0, function () {
        var readDesigns, engine, sheet, label, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readDesigns = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(later)];
                    }); }); });
                    readDesigns.mockImplementationOnce(designsOf([row('5.4.3'), row('5.4.2')]));
                    return [4 /*yield*/, withComments(OPEN, { readDesigns: readDesigns })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _b.sent();
                    label = (0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.designs.versionLabel, " *"));
                    (0, vitest_1.expect)(label.value).toBe('5.4.4');
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(sheet).findByRole('alert')];
                case 5:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe(en_1.t.designs.labelTaken('5.4.4'));
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(engine.sendDesignComments).not.toHaveBeenCalled();
                    // Not the after-filing lock: the label can still be changed and filed.
                    (0, vitest_1.expect)(label.matches(':disabled')).toBe(false);
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByRole('button', { name: en_1.t.designs.fileQuest })).toBeTruthy();
                    preact_1.fireEvent.input(label, { target: { value: '5.4.5' } });
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.sendDesignComments).toHaveBeenCalledWith(KEY, '5.4.3', vitest_1.expect.objectContaining({ label: '5.4.5' })); })];
                case 7:
                    _b.sent();
                    (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a failed re-read before filing, and files nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readDesigns, engine, sheet, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readDesigns = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't read this realm's designs. Check that docs/designs can be read, then try again." } })];
                    }); }); });
                    readDesigns.mockImplementationOnce(designsOf([row('5.4.3'), row('5.4.2')]));
                    return [4 /*yield*/, withComments(OPEN, { readDesigns: readDesigns })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _b.sent();
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(sheet).findByRole('alert')];
                case 5:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe("Couldn't read this realm's designs. Check that docs/designs can be read, then try again.");
                    (0, vitest_1.expect)(engine.fileQuest).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(engine.sendDesignComments).not.toHaveBeenCalled();
                    (0, vitest_1.expect)((0, preact_1.within)(sheet).getByLabelText("".concat(en_1.t.designs.versionLabel, " *")).matches(':disabled')).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the dialog open with the reason when filing fails, and marks nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, sheet, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, withComments(OPEN, { fileQuest: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't file the quest." } })];
                        }); }); }) })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _b.sent();
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(sheet).findByRole('alert')];
                case 5:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe("Couldn't file the quest.");
                    (0, vitest_1.expect)(engine.sendDesignComments).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers Try again that only marks, when marking fails after filing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sendDesignComments, engine, sheet, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sendDesignComments = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: null })];
                    }); }); });
                    sendDesignComments.mockResolvedValueOnce({ ok: false, error: { message: 'Try again.' } });
                    return [4 /*yield*/, withComments(OPEN, { sendDesignComments: sendDesignComments })];
                case 1:
                    engine = (_c.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, openSheet()];
                case 3:
                    sheet = _c.sent();
                    return [4 /*yield*/, press(en_1.t.designs.fileQuest, sheet)];
                case 4:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(sheet).findByRole('alert')];
                case 5:
                    _a.apply(void 0, [(_c.sent()).textContent]).toBe(en_1.t.designs.filedButNotMarked('Try again.'));
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain, sheet)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(sendDesignComments).toHaveBeenCalledTimes(2); })];
                case 7:
                    _c.sent();
                    (0, vitest_1.expect)(engine.fileQuest).toHaveBeenCalledTimes(1);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.filedTitle)];
                case 8:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('approving a version', function () {
    var APPROVAL = { by: 'Rohan', at: '2026-11-05T12:00:00Z' };
    var page = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open(__assign({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf(), readDesign: readEach }, over))];
                    case 1:
                        opened = _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3' })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    (0, vitest_1.it)('says a version is not approved yet, and approving it reads the list again to show who approved it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readDesigns, engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readDesigns = vitest_1.vi.fn(designsOf([row('5.4.3')]));
                    return [4 /*yield*/, page({ readDesigns: readDesigns })];
                case 1:
                    engine = (_b.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.designs.notApprovedLine)).toBeTruthy();
                    readDesigns.mockImplementation(designsOf([row('5.4.3', { approved: APPROVAL })]));
                    return [4 /*yield*/, press(en_1.t.designs.approve)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.setDesignApproval).toHaveBeenCalledWith(KEY, '5.4.3', true);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.approvedLine('Rohan', APPROVAL.at))];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.designs.withdrawApproval })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.designs.notApprovedLine)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows who approved the version and when, and Withdraw approval takes it back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readDesigns, engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readDesigns = vitest_1.vi.fn(designsOf([row('5.4.3', { approved: APPROVAL })]));
                    return [4 /*yield*/, page({ readDesigns: readDesigns })];
                case 1:
                    engine = (_b.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.designs.approvedLine('Rohan', APPROVAL.at))).toBeTruthy();
                    readDesigns.mockImplementation(designsOf([row('5.4.3')]));
                    return [4 /*yield*/, press(en_1.t.designs.withdrawApproval)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.setDesignApproval).toHaveBeenCalledWith(KEY, '5.4.3', false);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.notApprovedLine)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.designs.approve })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads Saving approval… and cannot be pressed again while it saves', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, saving;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page({ setDesignApproval: vitest_1.vi.fn(function () { return never(); }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.designs.approve)
                        // Not clicked again: jsdom, unlike a browser, still fires clicks on a disabled button.
                    ];
                case 2:
                    _a.sent();
                    saving = preact_1.screen.getByRole('button', { name: en_1.t.designs.approving });
                    (0, vitest_1.expect)(saving).toHaveProperty('disabled', true);
                    (0, vitest_1.expect)(engine.setDesignApproval).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows why the approval did not save under its button, reads nothing again, and pressing again tries again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setDesignApproval, readDesigns, reads, alert;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setDesignApproval = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok(null)];
                    }); }); });
                    setDesignApproval.mockResolvedValueOnce({ ok: false, error: { message: "Couldn't save the approval. Try again." } });
                    readDesigns = vitest_1.vi.fn(designsOf([row('5.4.3')]));
                    return [4 /*yield*/, page({ readDesigns: readDesigns, setDesignApproval: setDesignApproval })];
                case 1:
                    _b.sent();
                    reads = readDesigns.mock.calls.length;
                    return [4 /*yield*/, press(en_1.t.designs.approve)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    alert = _b.sent();
                    (0, vitest_1.expect)(alert.textContent).toBe("Couldn't save the approval. Try again.");
                    (0, vitest_1.expect)((_a = alert.closest('.dz-approval')) === null || _a === void 0 ? void 0 : _a.contains(preact_1.screen.getByRole('button', { name: en_1.t.designs.approve }))).toBe(true);
                    (0, vitest_1.expect)(readDesigns.mock.calls.length).toBe(reads);
                    return [4 /*yield*/, press(en_1.t.designs.approve)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('alert')).toBeNull(); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(setDesignApproval).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(setDesignApproval).toHaveBeenLastCalledWith(KEY, '5.4.3', true);
                    (0, vitest_1.expect)(readDesigns.mock.calls.length).toBeGreaterThan(reads);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('badges an approved version as Approved in the rail, ahead of its open comments, and a broken one still as Couldn\'t read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var problem, rail, badgeOf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    problem = { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: null };
                    return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3', { approved: APPROVAL, open: 2 }), row('5.4.2', { approved: APPROVAL, problem: problem }), row('v5', { open: 1 })]), readDesignVersion: versionOf(), readDesign: readEach })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('complementary', { name: en_1.t.designs.history })];
                case 2:
                    rail = _a.sent();
                    badgeOf = function (label) { var _a; return (_a = (0, preact_1.within)(rail).getByRole('button', { name: label }).querySelector('.dz-badge')) === null || _a === void 0 ? void 0 : _a.textContent; };
                    (0, vitest_1.expect)(badgeOf(/^5\.4\.3/)).toBe(en_1.t.designs.approvedTag);
                    (0, vitest_1.expect)(badgeOf(/^5\.4\.2/)).toBe(en_1.t.designs.couldntRead);
                    (0, vitest_1.expect)(badgeOf(/^v5/)).toBe(en_1.t.designs.open(1));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('in a narrow window', function () {
        var openMenu = function (n) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = preact_1.fireEvent).click;
                            return [4 /*yield*/, preact_1.screen.findByRole('button', { name: "".concat(en_1.t.designs.versionMenu(1, n), " \u25BE") })];
                        case 1: return [2 /*return*/, void _b.apply(_a, [_c.sent()])];
                    }
                }); }); })];
        }); }); };
        var menuBadgeOf = function (label) { var _a, _b; return (_b = (_a = (0, preact_1.within)(preact_1.screen.getByRole('listbox', { name: en_1.t.designs.historyMenu })).getByRole('option', { name: label }).querySelector('.dz-badge')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : null; };
        (0, vitest_1.it)('badges an approved version as Approved in the history menu, ahead of its open comments', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.innerWidth = 700;
                        return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3', { approved: APPROVAL, open: 2 })]), readDesignVersion: versionOf(), readDesign: readEach })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, openMenu(1)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(menuBadgeOf(/^5\.4\.3/)).toBe(en_1.t.designs.approvedTag);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('badges no Approved on a version that is not approved, Couldn\'t read on a broken one, and nothing on a plain one in the history menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var problem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.innerWidth = 700;
                        problem = { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: null };
                        return [4 /*yield*/, open({ readDesigns: designsOf([row('5.4.3', { open: 2 }), row('5.4.2', { approved: APPROVAL, problem: problem }), row('5.4.1')]), readDesignVersion: versionOf(), readDesign: readEach })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, openMenu(3)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(menuBadgeOf(/^5\.4\.3/)).toBe(en_1.t.designs.open(2));
                        (0, vitest_1.expect)(menuBadgeOf(/^5\.4\.2/)).toBe(en_1.t.designs.couldntRead);
                        (0, vitest_1.expect)(menuBadgeOf(/^5\.4\.1/)).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('drops the Approved badge from the history menu once approval is withdrawn and the list is read again', function () { return __awaiter(void 0, void 0, void 0, function () {
            var readDesigns;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.innerWidth = 700;
                        readDesigns = vitest_1.vi.fn(designsOf([row('5.4.3', { approved: APPROVAL })]));
                        return [4 /*yield*/, page({ readDesigns: readDesigns })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, openMenu(1)];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(menuBadgeOf(/^5\.4\.3/)).toBe(en_1.t.designs.approvedTag);
                        return [4 /*yield*/, openMenu(1)];
                    case 3:
                        _a.sent();
                        readDesigns.mockImplementation(designsOf([row('5.4.3')]));
                        return [4 /*yield*/, press(en_1.t.designs.withdrawApproval)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByText(en_1.t.designs.notApprovedLine)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, openMenu(1)];
                    case 6:
                        _a.sent();
                        (0, vitest_1.expect)(menuBadgeOf(/^5\.4\.3/)).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
(0, vitest_1.describe)('moving between designs in the editor', function () {
    var NAMES = { welcome: 'Welcome', pair: 'Pair your insoles', walk: 'Live walk' };
    var readNamed = vitest_1.vi.fn(function (_key, _folder, id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ready(NAMES[id])];
    }); }); });
    var editorOf = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over, designs) {
            var opened, card;
            if (over === void 0) { over = {}; }
            if (designs === void 0) { designs = ['welcome', 'pair', 'walk']; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        readNamed.mockClear();
                        return [4 /*yield*/, open(__assign({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: vitest_1.vi.fn(versionOf({ designs: designs })), readDesign: readNamed }, over))
                            // Found outside act: Preact holds renders until act ends, so the card would never show inside it.
                        ];
                    case 1:
                        opened = _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByRole('button', { name: /^Welcome/ })];
                    case 2:
                        card = _a.sent();
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, void preact_1.fireEvent.click(card)];
                            }); }); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Welcome', level: 1 })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, opened];
                }
            });
        });
    };
    var previous = function () { return preact_1.screen.getByRole('button', { name: en_1.t.designs.previousDesign }); };
    var next = function () { return preact_1.screen.getByRole('button', { name: en_1.t.designs.nextDesign }); };
    var nudgeHeadline = function () {
        var canvas = preact_1.screen.getByRole('application');
        preact_1.fireEvent.keyDown(canvas, { key: 'Tab' });
        preact_1.fireEvent.keyDown(canvas, { key: 'ArrowRight' });
    };
    (0, vitest_1.it)('moves through the designs in card order, with Previous off on the first and Next off on the last', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, editorOf({}, ['welcome', 'pair', 'walk'])];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(previous().disabled).toBe(true);
                    (0, vitest_1.expect)(next().disabled).toBe(false);
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 3:
                    _a.apply(void 0, [_d.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(previous().disabled).toBe(false);
                    (0, vitest_1.expect)(next().disabled).toBe(false);
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 4:
                    _d.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Live walk', level: 1 })];
                case 5:
                    _b.apply(void 0, [_d.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(previous().disabled).toBe(false);
                    (0, vitest_1.expect)(next().disabled).toBe(true);
                    return [4 /*yield*/, press(en_1.t.designs.previousDesign)];
                case 6:
                    _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(readNamed.mock.calls.map(function (call) { return call[2]; }).slice(-3)).toEqual(['pair', 'walk', 'pair']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has both off for a version with one design', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, editorOf({}, ['welcome'])];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(previous().disabled).toBe(true);
                    (0, vitest_1.expect)(next().disabled).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves an edit to the design it was made on when Next is pressed before the autosave, and never to the next design', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, editorOf()];
                case 1:
                    engine = (_b.sent()).engine;
                    nudgeHeadline();
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(engine.saveDesign).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(engine.saveDesign).toHaveBeenCalledWith(KEY, '5.4.3', 'welcome', vitest_1.expect.objectContaining({ name: 'Welcome', nodes: [vitest_1.expect.objectContaining({ id: 'headline', x: 24 + constants_1.NUDGE_PX.small })] }), 'stamp-Welcome');
                    // Long enough for an autosave the old editor left behind to fire.
                    return [4 /*yield*/, (0, preact_1.act)(function () { return new Promise(function (done) { return setTimeout(done, constants_1.AUTOSAVE_MS + 150); }); })];
                case 4:
                    // Long enough for an autosave the old editor left behind to fire.
                    _b.sent();
                    (0, vitest_1.expect)(vitest_1.vi.mocked(engine.saveDesign).mock.calls.map(function (call) { return call[2]; })).toEqual(['welcome']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves an edit to the design it was made on when Previous is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, editorOf()];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 3:
                    _b.sent();
                    nudgeHeadline();
                    return [4 /*yield*/, press(en_1.t.designs.previousDesign)];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Welcome', level: 1 })];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(vitest_1.vi.mocked(engine.saveDesign).mock.calls.map(function (call) { return [call[2], call[4]]; })).toEqual([['pair', 'stamp-Pair your insoles']]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves nothing on moving when nothing was changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, editorOf()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.saveDesign).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers Previous and Next beside a design that does not read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var problem, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    problem = { file: 'docs/designs/5.4.3/walk.design.json', detail: 'It has a mistake near line 5.', backupAt: null };
                    return [4 /*yield*/, editorOf({ readDesign: function (_k, _f, id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (id === 'walk' ? ok({ kind: 'broken', problem: problem }) : ready(NAMES[id]))];
                            }); }); } })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 4:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.designs.brokenTitle('walk') })];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(next().disabled).toBe(true);
                    return [4 /*yield*/, press(en_1.t.designs.previousDesign)];
                case 6:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 7:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes back to the version page from a design it moved to, and reads the version again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, reads, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, editorOf()];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.designs.nextDesign)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: 'Pair your insoles', level: 1 })];
                case 3:
                    _b.sent();
                    reads = vitest_1.vi.mocked(engine.readDesignVersion).mock.calls.length;
                    return [4 /*yield*/, press('‹ 5.4.3')];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: '5.4.3', level: 1 })];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.designs.nextVersion })).toBeTruthy();
                    (0, vitest_1.expect)(vitest_1.vi.mocked(engine.readDesignVersion).mock.calls.length).toBeGreaterThan(reads);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the comments box', function () {
    var SCENE = scene('Welcome');
    var HEADLINE = SCENE.nodes[0];
    var panel = function (over) {
        if (over === void 0) { over = {}; }
        var onAdd = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); });
        var onSet = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); });
        (0, preact_1.render)(<comments_panel_1.CommentsPanel scene={SCENE} designId="welcome" comments={[]} problem={null} about={null} onAdd={onAdd} onSet={onSet} {...over}/>);
        return { onAdd: onAdd, onSet: onSet, box: preact_1.screen.getByLabelText("".concat(en_1.t.designs.yourComment, " *")) };
    };
    (0, vitest_1.it)('says a comment is required when sent empty, under the box, and sends nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, onAdd, box;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = panel(), onAdd = _a.onAdd, box = _a.box;
                    return [4 /*yield*/, press(en_1.t.designs.addComment)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(errorOf(box)).toBe('Comment is required.');
                    (0, vitest_1.expect)(onAdd).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks the box when it loses focus after typing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    box = panel().box;
                    preact_1.fireEvent.input(box, { target: { value: '   ' } });
                    preact_1.fireEvent.blur(box);
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(errorOf(box)).toBe(en_1.t.designs.commentRequired); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says nothing when it loses focus before anything is typed', function () {
        var box = panel().box;
        preact_1.fireEvent.blur(box);
        (0, vitest_1.expect)(errorOf(box)).toBeNull();
    });
    (0, vitest_1.it)('refuses a comment over 2,000 characters', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, onAdd, box;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = panel(), onAdd = _a.onAdd, box = _a.box;
                    preact_1.fireEvent.input(box, { target: { value: 'x'.repeat(2001) } });
                    return [4 /*yield*/, press(en_1.t.designs.addComment)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(errorOf(box)).toBe(en_1.t.designs.commentLong);
                    (0, vitest_1.expect)(onAdd).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('sends a comment about the selected layer, trimmed, and empties the box', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, onAdd, box;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = panel({ about: HEADLINE }), onAdd = _a.onAdd, box = _a.box;
                    preact_1.fireEvent.input(box, { target: { value: '  Shorter please  ' } });
                    return [4 /*yield*/, press(en_1.t.designs.addComment)];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(onAdd).toHaveBeenCalledWith({ design: 'welcome', on: 'headline', text: 'Shorter please' });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(box.value).toBe(''); })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('sends it about the whole design once the layer is cleared', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, onAdd, box;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = panel({ about: HEADLINE }), onAdd = _a.onAdd, box = _a.box;
                    return [4 /*yield*/, press(en_1.t.designs.clearAbout)];
                case 1:
                    _b.sent();
                    preact_1.fireEvent.input(box, { target: { value: 'Warmer colours' } });
                    return [4 /*yield*/, press(en_1.t.designs.addComment)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(onAdd).toHaveBeenCalledWith({ design: 'welcome', on: null, text: 'Warmer colours' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps what was typed and says why when the comment could not be saved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var box, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    box = panel({ onAdd: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, message: "Couldn't save your comment. Try again." })];
                        }); }); }) }).box;
                    preact_1.fireEvent.input(box, { target: { value: 'Shorter' } });
                    return [4 /*yield*/, press(en_1.t.designs.addComment)];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe("Couldn't save your comment. Try again.");
                    (0, vitest_1.expect)(box.value).toBe('Shorter');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('lists open comments newest first and folds the rest, each with Resolve or Reopen', function () { return __awaiter(void 0, void 0, void 0, function () {
        var comments, onSet, open;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    comments = [comment({ id: 'old', text: 'Older', at: '2026-11-04T10:00:00Z' }), comment({ id: 'new', text: 'Newer', at: '2026-11-05T10:00:00Z', on: 'headline' }), comment({ id: 'done', text: 'Done', resolved: '2026-11-05T11:00:00Z' })];
                    onSet = panel({ comments: comments }).onSet;
                    open = preact_1.screen.getAllByRole('list')[0];
                    (0, vitest_1.expect)((0, preact_1.within)(open).getAllByRole('listitem').map(function (item) { var _a; return (_a = item.querySelector('.dz-c-text')) === null || _a === void 0 ? void 0 : _a.textContent; })).toEqual(['Newer', 'Older']);
                    (0, vitest_1.expect)((0, preact_1.within)(open).getByText(en_1.t.designs.onLayer('Headline'))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.designs.resolvedFold(1))).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.designs.reopen)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onSet).toHaveBeenCalledWith('done', false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows why comments cannot be added when their file does not read', function () {
        (0, preact_1.render)(<comments_panel_1.CommentsPanel scene={SCENE} designId="welcome" comments={[]} problem={{ file: 'docs/designs/5.4.3/comments.json', detail: 'It has a mistake near line 3.', backupAt: null }} about={null} onAdd={vitest_1.vi.fn()} onSet={vitest_1.vi.fn()}/>);
        (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toContain('docs/designs/5.4.3/comments.json: It has a mistake near line 3.');
        (0, vitest_1.expect)(preact_1.screen.queryByLabelText("".concat(en_1.t.designs.yourComment, " *"))).toBeNull();
    });
});
