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
var messages_1 = require("../../main/core/messages");
var workspace_store_1 = require("../features/workspace/state_management/workspace_store");
var en_1 = require("../l10n/en");
var test_support_1 = require("../test_support");
var app_1 = require("./app");
var KEY = 'a-000001';
var settings = function (over) { return ({ ok: true, data: __assign({ sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} }, over) }); };
var page = function (over) { return ({ ok: true, data: __assign(__assign({}, test_support_1.SETTINGS_PAGE), over) }); };
var FAILED = { kind: 'unreadable', key: KEY, name: 'a', reason: "it isn't valid JSON (Unexpected token)", file: '/h/.queue-tea/projects/a-000001.json', isNewer: false, canRestore: true };
var NEW_FOLDER = { path: '/p/demo', name: 'demo', key: 'demo-abc123', isKnown: false, isRepo: true };
var open = function (route_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([route_1], args_1, true), void 0, function (route, over) {
        var _a, engine, fire, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window.location.hash = "#".concat(route);
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
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('finding Settings', function () {
    (0, vitest_1.it)('is in the sidebar', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.settings }).getAttribute('href')).toBe('#/settings');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘, opens it', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, key(',', { metaKey: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(window.location.hash).toBe('#/settings'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens with no realm picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings', { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [] })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.settings.sky })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Settings', function () {
    (0, vitest_1.it)('sets Calm mode, and the window calms down at once', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('switch', { name: en_1.t.settings.calm })); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((_a = document.querySelector('.rm')) === null || _a === void 0 ? void 0 : _a.className).toContain('calm');
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ isCalm: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the sky and the sky dial as one value', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click((0, preact_1.within)((0, preact_1.within)(preact_1.screen.getByRole('main')).getByRole('group', { name: en_1.t.settings.skyLabel })).getByRole('button', { name: en_1.t.settings.skyNames.night })); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ sky: 'night' });
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.sky.choices.night }).getAttribute('aria-pressed')).toBe('true'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('picks the terminal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.terminal.iterm)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ terminal: 'iterm' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the /config values, marked default with no session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("".concat(en_1.t.settings.minutes(15), " \u00B7 ").concat(en_1.t.settings.default))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows them plain from a session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/settings', { readSettingsPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, page({ isDefault: false })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.settings.minutes(15))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('copies /config', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.settings.copyConfig })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.settings.copyConfig)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.copyText).toHaveBeenCalledWith('/config'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows this realm\'s record, and shows it in Finder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, preact_1.screen.findByText('a-000001.json')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.settings.showInFinder)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.showRecord).toHaveBeenCalledWith('a-000001'); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the task log path in Settings', function () {
    var NOT_SET = { readSettingsPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, page({ realm: __assign(__assign({}, test_support_1.SETTINGS_PAGE.realm), { logPath: null }) })];
        }); }); } };
    var change = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var opened;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, open('/settings', __assign(__assign({}, NOT_SET), over))];
                    case 1:
                        opened = _a.sent();
                        return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.settings.setNow })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, press(en_1.t.settings.setNow)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, __assign(__assign({}, opened), { field: preact_1.screen.getByLabelText("".concat(en_1.t.finish.path, " *")) })];
                }
            });
        });
    };
    (0, vitest_1.it)('says when one isn\'t set, and offers docs/task_log.md', function () { return __awaiter(void 0, void 0, void 0, function () {
        var field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, change()];
                case 1:
                    field = (_a.sent()).field;
                    (0, vitest_1.expect)(field.value).toBe('docs/task_log.md');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts from the path it has', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.settings.change })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.settings.change)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByLabelText("".concat(en_1.t.finish.path, " *")).value).toBe('notes/log.md');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the error under the field as it loses focus', function () { return __awaiter(void 0, void 0, void 0, function () {
        var field;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, change()];
                case 1:
                    field = (_a.sent()).field;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(field, { target: { value: 'docs/' } })];
                        }); }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(field)];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.finish.pathBad)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('blocks saving a bad path, with the button still enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, field;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, change()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, field = _a.field;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.input(field, { target: { value: '  ' } })];
                        }); }); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.actions.save }).disabled).toBe(false);
                    return [4 /*yield*/, press(en_1.t.actions.save)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.finish.pathRequired)).toBeTruthy();
                    (0, vitest_1.expect)(engine.setTaskLog).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves and closes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, change()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.actions.save)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.setTaskLog).toHaveBeenCalledWith('a-000001', 'docs/task_log.md'); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays open with the reason when it can\'t save', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, change({ setTaskLog: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't save the task log path." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.actions.save)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe("Couldn't save the task log path.");
                    (0, vitest_1.expect)(preact_1.screen.getByRole('dialog')).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the Git mode in Settings', function () {
    var withMode = function (gitMode, key) {
        if (key === void 0) { key = KEY; }
        return page({ realm: __assign(__assign({}, test_support_1.SETTINGS_PAGE.realm), { key: key, name: key.split('-')[0], gitMode: gitMode }) });
    };
    var modeButton = function (mode) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = preact_1.within;
                return [4 /*yield*/, preact_1.screen.findByRole('group', { name: en_1.t.settings.gitMode })];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()]).getByRole('button', { name: en_1.t.settings.gitModes[mode] })];
        }
    }); }); };
    var pressedOf = function (mode) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, modeButton(mode)];
            case 1: return [2 /*return*/, (_a.sent()).getAttribute('aria-pressed')
                // Preact runs a new row's effects after the next frame (35 ms at most in
                // jsdom). A click before that frame is one no one can make, so wait it out.
            ];
        }
    }); }); };
    // Preact runs a new row's effects after the next frame (35 ms at most in
    // jsdom). A click before that frame is one no one can make, so wait it out.
    var painted = function () { return (0, preact_1.act)(function () { return new Promise(function (resolve) { return setTimeout(resolve, 50); }); }); };
    var choose = function (mode) { return __awaiter(void 0, void 0, void 0, function () {
        var button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, modeButton(mode)];
                case 1:
                    button = _a.sent();
                    return [4 /*yield*/, painted()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(button); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, vitest_1.it)('shows Manual and Assisted, with the saved Assisted pressed and what it means', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, pressedOf('assisted')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('true');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, pressedOf('manual')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('false');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.settings.gitModeLines.assisted)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows Manual pressed in a Manual realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open('/settings', { readSettingsPage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, withMode('manual')];
                        }); }); } })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, pressedOf('manual')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('true');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, pressedOf('assisted')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('false');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.settings.gitModeLines.manual)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('pressing the other mode saves it, says so while it saves, then reads the page again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer, setGitMode, readSettingsPage, _a, _b, reads, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setGitMode = vitest_1.vi.fn(function () { return new Promise(function (resolve) { answer = resolve; }); });
                    readSettingsPage = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, withMode('assisted')];
                    }); }); });
                    return [4 /*yield*/, open('/settings', { setGitMode: setGitMode, readSettingsPage: readSettingsPage })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, choose('manual')];
                case 2:
                    _e.sent();
                    (0, vitest_1.expect)(setGitMode).toHaveBeenCalledWith(KEY, 'manual');
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.settings.savingGitMode).closest('[role="status"]')).toBeTruthy();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, pressedOf('manual')];
                case 3:
                    _a.apply(void 0, [_e.sent()]).toBe('true');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, modeButton('assisted')];
                case 4:
                    _b.apply(void 0, [(_e.sent()).disabled]).toBe(true);
                    reads = readSettingsPage.mock.calls.length;
                    readSettingsPage.mockResolvedValue(withMode('manual'));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, answer({ ok: true, data: null })];
                        }); }); })];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readSettingsPage.mock.calls.length).toBeGreaterThan(reads); })];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.settings.gitModeLines.manual)).toBeTruthy(); })];
                case 7:
                    _e.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, pressedOf('manual')];
                case 8:
                    _c.apply(void 0, [_e.sent()]).toBe('true');
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.settings.savingGitMode)).toBeNull();
                    _d = vitest_1.expect;
                    return [4 /*yield*/, modeButton('assisted')];
                case 9:
                    _d.apply(void 0, [(_e.sent()).disabled]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('pressing the mode already saved saves nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, choose('assisted')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.setGitMode).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failed save says why beside the row, goes back to the saved mode, and pressing again tries again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setGitMode, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setGitMode = vitest_1.vi.fn()
                        .mockResolvedValueOnce({ ok: false, error: { message: messages_1.MESSAGES.setGitMode } })
                        .mockResolvedValue({ ok: true, data: null });
                    return [4 /*yield*/, open('/settings', { setGitMode: setGitMode })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, choose('manual')];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    _a.apply(void 0, [(_d.sent()).textContent]).toBe(messages_1.MESSAGES.setGitMode);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, pressedOf('assisted')];
                case 4:
                    _b.apply(void 0, [_d.sent()]).toBe('true');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, modeButton('manual')];
                case 5:
                    _c.apply(void 0, [(_d.sent()).disabled]).toBe(false);
                    return [4 /*yield*/, choose('manual')];
                case 6:
                    _d.sent();
                    (0, vitest_1.expect)(setGitMode).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(setGitMode).toHaveBeenLastCalledWith(KEY, 'manual');
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('alert')).toBeNull(); })];
                case 7:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a failure in one realm is not shown on the next realm picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readSettingsPage, workspace, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readSettingsPage = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, withMode('assisted', key !== null && key !== void 0 ? key : KEY)];
                    }); }); });
                    return [4 /*yield*/, open('/settings', { readSettingsPage: readSettingsPage, setGitMode: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: false, error: { message: messages_1.MESSAGES.setGitMode } })];
                            }); }); } })];
                case 1:
                    workspace = (_b.sent()).workspace;
                    return [4 /*yield*/, choose('manual')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, workspace.pick('b-000002')];
                        }); }); })];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('heading', { name: en_1.t.settings.thisRealm('b') })];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('alert')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the single-letter keys', function () {
    var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 'first', title: 'First', isStar: true }) }], canStart: 1, active: null });
    (0, vitest_1.it)('stop on Home when switched off', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, settings({ letterKeys: false, realmAccounts: {} })];
                        }); }); }, readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: BOARD })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('s')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.checkStart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stop on the board when switched off', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/quests', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, settings({ letterKeys: false, realmAccounts: {} })];
                        }); }); }, readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: BOARD })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, key('s')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.setPriority).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(engine.checkStart).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leave the ⌘ shortcuts alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    view = (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)() });
                    return [4 /*yield*/, open('/home', { readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, settings({ letterKeys: false, realmAccounts: {} })];
                            }); }); }, readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: view })];
                            }); }); } })];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, key('Enter', { metaKey: true })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openClaude).toHaveBeenCalled(); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, key('n', { metaKey: true })];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('can be switched off from Settings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/settings')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(preact_1.screen.getByRole('switch', { name: en_1.t.settings.letters })); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ letterKeys: false });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('first run', function () {
    var none = { listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ({ ok: true, data: [] })];
        }); }); } };
    (0, vitest_1.it)('welcomes you, and says what happens next', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', none)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.firstRun.title })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.firstRun.hint)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers the terminal way too', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', none)];
                case 1:
                    engine = (_a.sent()).engine;
                    (0, vitest_1.expect)(preact_1.screen.getByText('queue-tea open')).toBeTruthy();
                    return [4 /*yield*/, press(en_1.t.flow.copy)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.copyText).toHaveBeenCalledWith('queue-tea open'); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so in the sidebar', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', none)];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.firstRun.noRealms)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays put when the dialog is cancelled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', none)];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.firstRun.open)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openFolder).toHaveBeenCalled(); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks before adding a folder, and says where the record goes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', __assign(__assign({}, none), { openFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: NEW_FOLDER })];
                        }); }); } }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, press(en_1.t.firstRun.open)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('dialog')];
                case 3:
                    dialog = _a.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(en_1.t.addRealm.notYet('demo'))).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(en_1.t.addRealm.note)).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).queryByText(en_1.t.addRealm.noRepo)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when the folder is no repository', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', __assign(__assign({}, none), { openFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, NEW_FOLDER), { isRepo: false }) })];
                        }); }); } }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.firstRun.open)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.addRealm.noRepo)];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('adds it and goes to it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var listProjects, engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listProjects = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: [] })];
                    }); }); });
                    return [4 /*yield*/, open('/home', { listProjects: listProjects, openFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: NEW_FOLDER })];
                            }); }); }, addProject: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: 'demo-abc123' })];
                            }); }); }) })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.firstRun.open)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.noAccounts)];
                case 3:
                    _a.sent();
                    listProjects.mockResolvedValue({ ok: true, data: [(0, test_support_1.projectRow)('demo-abc123')] });
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.addProject).toHaveBeenCalledWith('/p/demo'); })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull(); })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ lastProject: 'demo-abc123' }); })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays open with the reason when it can\'t add', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', __assign(__assign({}, none), { openFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: NEW_FOLDER })];
                        }); }); }, addProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't add that realm." } })];
                        }); }); } }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.firstRun.open)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.github.noAccounts)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.addRealm.add)];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 5:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe("Couldn't add that realm.");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes straight to a realm it already knows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', { openFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: __assign(__assign({}, NEW_FOLDER), { key: KEY, isKnown: true }) })];
                        }); }); } })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.firstRun.openFolder)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveSettings).toHaveBeenCalledWith({ lastProject: KEY }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('⌘O opens the dialog', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home')];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, key('o', { metaKey: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.openFolder).toHaveBeenCalled(); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when the dialog failed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', { openFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't open that folder." } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.firstRun.openFolder)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText("Couldn't open that folder.")];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the failed record', function () {
    var failing = function (view) {
        if (view === void 0) { view = FAILED; }
        return ({ readProject: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ ok: true, data: view })];
            }); }); }) });
    };
    (0, vitest_1.it)('says why, with the file, and that nothing can change', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', failing())];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.failedRecord.title })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText("It isn't valid JSON (Unexpected token).")).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(FAILED.kind === 'unreadable' ? FAILED.file : '')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.failedRecord.noChange('a'), { exact: false })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers the last good copy only when there is one', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', failing(__assign(__assign({}, FAILED), { canRestore: false })))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.failedRecord.restore })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.failed.tryAgain })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers no copy of a newer record, and says why', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', failing(__assign(__assign({}, FAILED), { isNewer: true, canRestore: false })))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.failedRecord.newerNote)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('puts the copy back, and says where the broken one went', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', __assign(__assign({}, failing()), { restoreRealm: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: 'a.json.broken-2026' })];
                        }); }); }) }))];
                case 1:
                    engine = (_b.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.failedRecord.restore)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.restoreRealm).toHaveBeenCalledWith(KEY); })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.failedRecord.restored('a.json.broken-2026'))];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('l and r are the same two buttons', function () { return __awaiter(void 0, void 0, void 0, function () {
        var readProject, engine, before;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    readProject = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: FAILED })];
                    }); }); });
                    return [4 /*yield*/, open('/home', { readProject: readProject })];
                case 1:
                    engine = (_a.sent()).engine;
                    before = readProject.mock.calls.length;
                    return [4 /*yield*/, key('l')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.restoreRealm).toHaveBeenCalled(); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, key('r')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readProject.mock.calls.length).toBeGreaterThan(before); })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the record in Finder, by its key', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/home', failing())];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, press(en_1.t.settings.showInFinder)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.showRecord).toHaveBeenCalledWith(KEY); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stands in for every tab, with the tabs off', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/mana', failing())];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: en_1.t.failedRecord.title })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('link', { name: en_1.t.nav.quests })).toBeNull();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.nav.quests).getAttribute('aria-disabled')).toBe('true');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the rest of the app to get to', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, open('/hoard', failing())];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: en_1.t.nav.quests })).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when the copy couldn\'t go back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open('/home', __assign(__assign({}, failing()), { restoreRealm: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'There is no good copy.' } })];
                        }); }); } }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, press(en_1.t.failedRecord.restore)];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('There is no good copy.')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
