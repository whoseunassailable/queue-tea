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
var engine_api_1 = require("../../shared/engine_api");
var format_1 = require("../core/domain/format");
var helpers_1 = require("../features/guild/domain/helpers");
var workspace_store_1 = require("../features/workspace/state_management/workspace_store");
var en_1 = require("../l10n/en");
var test_support_1 = require("../test_support");
var app_1 = require("./app");
var open = function (route_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([route_1], args_1, true), void 0, function (route, over) {
        var _a, engine, fire, tellHelpers, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.location.hash = "#".concat(route);
                    _a = (0, test_support_1.fakeEngine)(over), engine = _a.engine, fire = _a.fire, tellHelpers = _a.tellHelpers;
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
                    return [2 /*return*/, { engine: engine, workspace: workspace, fire: fire, tellHelpers: tellHelpers }];
            }
        });
    });
};
var press = function (name) { return (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: name })); }); };
var chronicle = function (over) { return ({ ok: true, data: __assign(__assign({}, test_support_1.CHRONICLE), over) }); };
var mana = function (over) { return ({ ok: true, data: __assign(__assign({}, test_support_1.MANA), over) }); };
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('finding the pages', function () {
    (0, vitest_1.it)('has a tab each for Chronicle and Mana & time', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.chronicle }).getAttribute('href')).toBe('#/chronicle');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.mana }).getAttribute('href')).toBe('#/mana');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps Guild Hall and Hoard in the sidebar', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.guild }).getAttribute('href')).toBe('#/guild');
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.hoard }).getAttribute('href')).toBe('#/hoard');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘3 opens Designs, and Branches, Chronicle and Mana move to ⌘4, ⌘5 and ⌘6', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, { key: '3', metaKey: true }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/designs'); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, { key: '4', metaKey: true }); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/branches'); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, { key: '5', metaKey: true }); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/chronicle'); })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.keyDown(document.body, { key: '6', metaKey: true }); })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/mana'); })];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('puts the Designs tab right after Quests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tabs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    tabs = preact_1.screen.getAllByRole('link').map(function (link) { return link.getAttribute('href'); });
                    (0, vitest_1.expect)(tabs.indexOf('#/designs')).toBe(tabs.indexOf('#/quests') + 1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens the app-wide pages with no realm picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/hoard', { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.hoard.title })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Chronicle', function () {
    (0, vitest_1.it)('sums up the week', function () { return __awaiter(void 0, void 0, void 0, function () {
        var summary;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _a.sent();
                    summary = document.querySelector('.summary');
                    (0, vitest_1.expect)(summary.textContent).toContain(en_1.t.chronicle.summary(1, '2h 11m'));
                    (0, vitest_1.expect)(summary.textContent).toContain(en_1.t.chronicle.split('54m', '1h 17m'));
                    (0, vitest_1.expect)(summary.textContent).toContain(en_1.t.chronicle.moved(0, 0, 1));
                    (0, vitest_1.expect)(summary.textContent).toContain('+25 XP');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads this realm by default, and remembers All realms', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.readChronicle).toHaveBeenCalledWith('a-000001', null); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.chronicle.allRealms)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.readChronicle).toHaveBeenLastCalledWith(null, null); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ chronicleScope: 'all' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes back a week, and can\'t go past this one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.chronicle.later }).disabled).toBe(true);
                    return [4 /*yield*/, press(en_1.t.chronicle.earlier)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.readChronicle).toHaveBeenLastCalledWith('a-000001', '2026-10-12'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a day when it is picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(/Thu/)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.chronicle.dayLine('Thu 22 Oct', '2h 11m', '54m', '1h 17m'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says a day had no time, rather than dividing by it', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(/Mon/)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.chronicle.dayEmpty('Mon 19 Oct'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks which way a difficulty moved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Medium')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).className]).toBe('easier');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens a row with what it took, and a follow-up', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.chronicle.open('Short branch names'))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.chronicle.lines(958, 799, 27))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('c1fc035')).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.chronicle.followUp)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByLabelText("".concat(en_1.t.form.title, " *")).value).toBe(en_1.t.chronicle.followUpTitle('Short branch names'));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers no follow-up for another realm\'s win', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle', { readChronicle: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, chronicle({ victories: [(0, test_support_1.victoryLine)({ realmPath: '/p/elsewhere' })] })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.chronicle.open('Short branch names'))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.chronicle.followUp })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so with no history at all', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/chronicle', { readChronicle: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, chronicle({ victories: [], hasAny: false, xp: 0, minutes: 0, days: test_support_1.CHRONICLE.days.map(function (d) { return (__assign(__assign({}, d), { onQuests: 0, elsewhere: 0 })); }) })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.chronicle.none)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('points to last week when this one is empty', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/chronicle', { readChronicle: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, chronicle({ victories: [] })];
                        }); }); }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.chronicle.noneThisWeek)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.chronicle.lastWeek(2, (0, format_1.formatMinutes)(300)))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.readChronicle).toHaveBeenLastCalledWith('a-000001', '2026-10-12'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when a broken realm is left out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/chronicle', { readChronicle: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, chronicle({ unreadable: 1 })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.chronicle.leftOut(1))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the failure with a way to try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readChronicle, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    readChronicle = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't read the chronicle." } })];
                    }); }); });
                    return [4 /*yield*/, open('/chronicle', { readChronicle: readChronicle })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 2:
                    _a.apply(void 0, [(_c.sent()).textContent]).toContain("Couldn't read the chronicle.");
                    readChronicle.mockResolvedValueOnce(chronicle({}));
                    return [4 /*yield*/, press(en_1.t.failed.tryAgain)];
                case 3:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps what it showed when a refresh fails, and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readChronicle, fire, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readChronicle = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, chronicle({})];
                    }); }); });
                    return [4 /*yield*/, open('/chronicle', { readChronicle: readChronicle })];
                case 1:
                    fire = (_b.sent()).fire;
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _b.sent();
                    readChronicle.mockResolvedValueOnce({ ok: false, error: { message: 'That read failed.' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fire()];
                        }); }); })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('That read failed.')];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('Short branch names')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads again when a record changes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, fire, before;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/chronicle')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, fire = _a.fire;
                    return [4 /*yield*/, preact_1.screen.findByText('Short branch names')];
                case 2:
                    _b.sent();
                    before = vitest_1.vi.mocked(engine.readChronicle).mock.calls.length;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fire()];
                        }); }); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(vitest_1.vi.mocked(engine.readChronicle).mock.calls.length).toBeGreaterThan(before); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Mana & time', function () {
    (0, vitest_1.it)('shows what is left in the orb', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/mana')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('img', { name: en_1.t.mana.orbLabel(38) })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.mana.used(62, null))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says the allowance is unknown with nothing reported', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/mana', { readMana: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, mana({ allowance: null })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.mana.unknown)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('img', { name: /allowance left/ })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks a figure as the last one seen', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/mana', { readMana: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, mana({ allowance: { percent: 62, resetsAt: null, seenAt: new Date(2026, 9, 27, 15, 10).getTime(), isStale: true } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.mana.lastSeen(62, '15:10'))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the rules with the session\'s own values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/mana', { readMana: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, mana({ options: __assign(__assign({}, test_support_1.MANA.options), { freshAtTokens: 50000, handoffAtPercent: 80 }) })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.mana.rules('50,000', 80), { exact: false })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('calls an urgent quest the boss, and gives its lines', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/mana')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.mana.boss })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.mana.linesLine(812, 95, '1649ade'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the block out with no active quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/mana', { readMana: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, mana({ active: null, lines: null })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.mana.week)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.mana.messages)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the lines out when they could not be measured', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/mana', { readMana: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, mana({ lines: null })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.mana.messages)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.mana.lines)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so with no time this week', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/mana', { readMana: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, mana({ byQuest: [], elsewhere: 0 })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.mana.nothing)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Hoard', function () {
    (0, vitest_1.it)('counts the gold by realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/hoard')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.hoard.realm('queue-tea', 4))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.hoard.goldCount(95))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a realm with no victories at 0 gold', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/hoard', { readHoard: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.HOARD), { realms: [{ key: 'c-000003', name: 'New realm', victories: 0, gold: 0 }] }) })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.hoard.goldCount(0))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks where the dragon is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/hoard')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.hoard.title)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.stage-i.done')) === null || _a === void 0 ? void 0 : _a.textContent).toContain(en_1.t.hoard.stages.egg);
                    (0, vitest_1.expect)((_b = document.querySelector('.stage-i.now')) === null || _b === void 0 ? void 0 : _b.textContent).toContain(en_1.t.hoard.here);
                    (0, vitest_1.expect)(document.querySelectorAll('.stage-i.locked')).toHaveLength(3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives the XP each stage is reached at', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/hoard')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("".concat(en_1.t.hoard.levels.young, " \u00B7 1,000 XP"))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText("".concat(en_1.t.hoard.levels.elder, " \u00B7 19,000 XP"))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows earned badges with a date and locked ones with progress', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/hoard', { readHoard: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.HOARD), { game: __assign(__assign({}, test_support_1.HOARD.game), { badges: [{ id: 'firstFlame', need: 1, have: 1, earnedOn: '2026-10-20' }, { id: 'tenTales', need: 10, have: 5, earnedOn: null }] }) }) })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("".concat(en_1.t.hoard.badgeLine.firstFlame(), " \u00B7 20 Oct"))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.hoard.badgeLine.tenTales(5, 10))).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('img', { name: en_1.t.hoard.wayAlong(50) })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.hoard.earned(1, 2))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('before the first victory, says how the hoard starts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/hoard', { readHoard: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.HOARD), { game: __assign(__assign({}, test_support_1.GAME), { victories: 0, gold: 0, xp: 0, level: 1, stage: 'egg', badges: [] }), realms: [] }) })];
                        }); }); } })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.hoard.noneYet)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((_b = document.querySelector('.stage-i.now')) === null || _b === void 0 ? void 0 : _b.textContent).toContain(en_1.t.hoard.stages.egg);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when a broken realm is left out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/hoard', { readHoard: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, test_support_1.HOARD), { unreadable: 2 }) })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.chronicle.leftOut(2))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Guild Hall', function () {
    (0, vitest_1.it)('reads all four helpers from the agents folder', function () {
        (0, vitest_1.expect)(helpers_1.HELPERS.map(function (h) { return h.id; })).toEqual(['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd']);
        (0, vitest_1.expect)(helpers_1.HELPERS[0]).toMatchObject({ name: 'Commit Chai-n', role: 'Git', mention: '@queue-tea:commit-chai-n', kind: 'git', skills: ['git-workflow-and-versioning', 'tea-concile'] });
        (0, vitest_1.expect)(helpers_1.HELPERS[1].skills.length).toBeGreaterThan(1);
    });
    (0, vitest_1.it)('drops the sentence that only names the helper', function () {
        (0, vitest_1.expect)(helpers_1.HELPERS[3].summary.startsWith('Use for every feature')).toBe(true);
    });
    (0, vitest_1.it)('has a logo for each', function () {
        for (var _i = 0, HELPERS_1 = helpers_1.HELPERS; _i < HELPERS_1.length; _i++) {
            var helper = HELPERS_1[_i];
            (0, vitest_1.expect)(helper.logo).not.toBe('');
        }
    });
    (0, vitest_1.it)('shows each helper and copies its @-mention', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: 'Tea-DD' })).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.guild.copy('Tea-DD'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.copyText).toHaveBeenCalledWith('@queue-tea:tea-dd'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the Guild Hall says where helpers are turned on', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.guild.where)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('each helper waits for an order with a line of its own', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.guild.idle['tea-dd'])];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getAllByRole('textbox')).toHaveLength(4);
                    (0, vitest_1.expect)(document.querySelectorAll('.portrait.idle')).toHaveLength(4);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says where orders go once a realm is picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.guild.worksIn('a'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks for a realm before it takes orders', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild', { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.guild.pickRealm)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryAllByRole('textbox')).toHaveLength(0);
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.guild.send })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says it is checking on the helpers until the first read lands', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild', { readHelpers: function () { return new Promise(function () { }); } })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' })).getByRole('status').textContent).toBe(en_1.t.guild.checking);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says an empty order is required and sends nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    engine = (_a.sent()).engine;
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.send })); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(card.getByText(en_1.t.guild.orderRequired)).toBeTruthy();
                    (0, vitest_1.expect)(engine.sendHelper).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks the order when the field loses focus', function () { return __awaiter(void 0, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Chai-pter' }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.blur(card.getByLabelText(/Order for Chai-pter/)); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(card.getByText(en_1.t.guild.orderRequired)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('sends the order to the helper in the picked realm and clears the field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, card, field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    engine = (_a.sent()).engine;
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    field = card.getByLabelText(/Order for Tea-DD/);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(field, { target: { value: '  Write tests for the timer  ' } }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.send })); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.sendHelper).toHaveBeenCalledWith('a-000001', 'tea-dd', 'Write tests for the timer'); })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(field.value).toBe(''); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a refusal from the engine under the order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild', { sendHelper: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'This helper is still on its last order.' } })];
                        }); }); }) })];
                case 1:
                    _a.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(card.getByLabelText(/Order for Tea-DD/), { target: { value: 'Again' } }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.send })); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(card.getByRole('alert').textContent).toBe('This helper is still on its last order.'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows what a working helper is doing, and stops it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, tellHelpers, card;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, tellHelpers = _a.tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ doing: { kind: 'reading', target: 'timer.ts' }, steps: 3 })]); })];
                case 2:
                    _b.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    (0, vitest_1.expect)(card.getByText(en_1.t.guild.doing('reading', 'timer.ts'))).toBeTruthy();
                    (0, vitest_1.expect)(card.getByText(en_1.t.guild.working(3, 'a-000001'))).toBeTruthy();
                    (0, vitest_1.expect)(document.querySelector('.member.tests .portrait.working')).not.toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.stop })); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.stopHelper).toHaveBeenCalledWith('tea-dd'); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows Claude's own words for a command, with nothing in front", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tellHelpers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    tellHelpers = (_a.sent()).tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ doing: { kind: 'step', target: 'Run the tests' }, steps: 1 })]); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' })).getByText('Run the tests…')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows the helper's answer when it is done", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tellHelpers, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    tellHelpers = (_a.sent()).tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ helper: 'chai-pter', status: 'done', reply: 'The README now covers Branches.', steps: 4, finished: 1 })]); })];
                case 2:
                    _a.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Chai-pter' }));
                    (0, vitest_1.expect)(card.getByText('The README now covers Branches.')).toBeTruthy();
                    (0, vitest_1.expect)(card.getByText(en_1.t.guild.states.done)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says why a helper got stuck and sends the same order again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, tellHelpers, card;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, tellHelpers = _a.tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ realm: 'b-000002', status: 'failed', error: 'The helper could not finish this order.', finished: 1 })]); })];
                case 2:
                    _b.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    (0, vitest_1.expect)(card.getByRole('alert').textContent).toBe('The helper could not finish this order.');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.tryAgain })); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.sendHelper).toHaveBeenCalledWith('b-000002', 'tea-dd', 'Write tests for the timer'); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("says so when it can't see what the helpers are doing", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/guild', { readHelpers: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't see what the helpers are doing. Try again." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't see what the helpers are doing. Try again.")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.failed.tryAgain })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says it is getting started before the first step', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tellHelpers, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    tellHelpers = (_a.sent()).tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)()]); })];
                case 2:
                    _a.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    (0, vitest_1.expect)(card.getByText(en_1.t.guild.starting)).toBeTruthy();
                    (0, vitest_1.expect)(card.getByText(en_1.t.guild.working(0, 'a-000001'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a helper at work can be stopped while no realm is picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, tellHelpers;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/guild', { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, tellHelpers = _a.tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)()]); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.guild.stop)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.stopHelper).toHaveBeenCalledWith('tea-dd'); })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows why a stop did not go through', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tellHelpers, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild', { stopHelper: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't stop the helper. Try again." } })];
                        }); }); }) })];
                case 1:
                    tellHelpers = (_a.sent()).tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)()]); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.guild.stop)];
                case 3:
                    _a.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(card.getByRole('alert').textContent).toBe("Couldn't stop the helper. Try again."); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says Sending… while the order is on its way, and a second press sends nothing more', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, card, sending;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild', { sendHelper: vitest_1.vi.fn(function () { return new Promise(function () { }); }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(card.getByLabelText(/Order for Tea-DD/), { target: { value: 'Write tests' } }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.send })); })];
                case 3:
                    _a.sent();
                    sending = card.getByRole('button', { name: en_1.t.guild.sending });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(sending); })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(sending.disabled).toBe(false);
                    (0, vitest_1.expect)(engine.sendHelper).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows an answer that came while you were on another page', function () { return __awaiter(void 0, void 0, void 0, function () {
        var jobs, tellHelpers, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    jobs = [(0, test_support_1.helperJob)()];
                    return [4 /*yield*/, open('/guild', { readHelpers: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: jobs })];
                            }); }); } })];
                case 1:
                    tellHelpers = (_c.sent()).tellHelpers;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.guild.starting)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    window.location.hash = '#/hoard';
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('heading', { name: en_1.t.guild.title })).toBeNull(); })];
                case 3:
                    _c.sent();
                    jobs = [(0, test_support_1.helperJob)({ status: 'done', reply: 'Added three tests.', steps: 2, finished: 1 })];
                    (0, preact_1.act)(function () { return tellHelpers(jobs); });
                    window.location.hash = '#/guild';
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Added three tests.')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks the order required and keeps Send enabled while the order has an error', function () { return __awaiter(void 0, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.send })); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(card.getByLabelText("".concat(en_1.t.guild.orderLabel('Tea-DD'), " *"))).toBeTruthy();
                    (0, vitest_1.expect)(card.getByRole('button', { name: en_1.t.guild.send }).disabled).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says an order one past the limit is too long once the field loses focus, under the field, and sends nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, card, field, tooLong;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    engine = (_b.sent()).engine;
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    field = card.getByLabelText(/Order for Tea-DD/);
                    tooLong = en_1.t.guild.orderLong(engine_api_1.HELPER_ORDER_CHARS);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(field, { target: { value: 'x'.repeat(engine_api_1.HELPER_ORDER_CHARS + 1) } }); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(card.queryByText(tooLong)).toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.blur(field); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.getElementById(field.getAttribute('aria-describedby'))) === null || _a === void 0 ? void 0 : _a.textContent).toBe(tooLong);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.send })); })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(engine.sendHelper).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('sends an order of exactly the longest length', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, card, longest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    engine = (_a.sent()).engine;
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    longest = 'x'.repeat(engine_api_1.HELPER_ORDER_CHARS);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(card.getByLabelText(/Order for Tea-DD/), { target: { value: longest } }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(card.getByRole('button', { name: en_1.t.guild.send })); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.sendHelper).toHaveBeenCalledWith('a-000001', 'tea-dd', longest); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes the error away once the order is fixed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var card, field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a.sent();
                    card = (0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }));
                    field = card.getByLabelText(/Order for Tea-DD/);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.blur(field); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(field, { target: { value: 'Write tests' } }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(card.queryByText(en_1.t.guild.orderRequired)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows on the portrait when a helper is stuck or stopped', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tellHelpers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    tellHelpers = (_a.sent()).tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ helper: 'chai-pter', status: 'failed', error: 'Stuck.', finished: 1 }), (0, test_support_1.helperJob)({ status: 'stopped', finished: 1 })]); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('article', { name: 'Chai-pter' }).querySelector('.portrait.failed')).not.toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('article', { name: 'Tea-DD' }).querySelector('.portrait.stopped')).not.toBeNull();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' })).getByText(en_1.t.guild.stopped)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('draws each helper as a bot in its mood, and sends a stopped merge order back to its merge', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, tellHelpers, card;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    _a = _b.sent(), engine = _a.engine, tellHelpers = _a.tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ status: 'stopped', merge: 'op-1', order: 'Resolve the conflicts', finished: 1 })]); })];
                case 2:
                    _b.sent();
                    card = preact_1.screen.getByRole('article', { name: 'Tea-DD' });
                    (0, vitest_1.expect)(card.querySelector('.portrait svg.bot.stopped')).not.toBeNull();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)(card).getByRole('button', { name: en_1.t.guild.tryAgain })); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(engine.concileMerge).toHaveBeenCalledWith('a-000001', 'tea-dd', 'op-1');
                    (0, vitest_1.expect)(engine.sendHelper).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so when a helper is done with nothing to say', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tellHelpers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/guild')];
                case 1:
                    tellHelpers = (_a.sent()).tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ status: 'done', reply: '  ', steps: 1, finished: 1 })]); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('article', { name: 'Tea-DD' })).getByText(en_1.t.guild.noReply)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
