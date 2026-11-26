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
exports.useWorkspace = exports.createWorkspace = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../core/api/engine_client");
var constants_1 = require("../../../core/constants/constants");
var en_1 = require("../../../l10n/en");
var INITIAL = {
    projects: { status: 'loading' },
    project: { status: 'none' },
    game: { status: 'loading' },
    settings: { sky: 'auto', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} },
    selected: null,
    openQuests: {},
    note: null,
    toasts: [],
    savedQuest: null,
    flows: {},
    won: null,
    questNotes: {},
    boards: {},
    detected: null,
};
// Old data stays while a refresh runs. It gives way to the failed state only
// when there is nothing to show.
var nextLoad = function (was, answer) {
    if (answer.ok)
        return { load: { status: 'ready', data: answer.data }, failedOver: null };
    if (was.status === 'ready')
        return { load: was, failedOver: answer.message };
    return { load: { status: 'failed', message: answer.message }, failedOver: null };
};
// The quest a session has just put back, as it was asked to.
var wentBack = function (was, now) {
    var _a;
    if (was.status !== 'ready' || now.status !== 'ready' || was.data.kind !== 'readable' || now.data.kind !== 'readable' || was.data.key !== now.data.key)
        return null;
    var activeNow = now.data.activeQuests;
    return (_a = was.data.activeQuests.find(function (q) { return q.asking === 'putBack' && !activeNow.some(function (active) { return active.id === q.id; }); })) !== null && _a !== void 0 ? _a : null;
};
var createWorkspace = function (engine) {
    var state = INITIAL;
    var listeners = new Set();
    // The newest read of a realm wins, so a slow one can't paint over a switch.
    var readNumber = 0;
    // While an edit is on its way, a read can only show the old value.
    var editsOnTheWay = 0;
    var toastNumber = 0;
    var undos = [];
    var set = function (patch) {
        state = __assign(__assign({}, state), patch);
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            listener();
        }
    };
    var loadProject = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var number, answer, was, _a, load, failedOver, back;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readNumber += 1;
                    number = readNumber;
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readProject(key); })];
                case 1:
                    answer = _b.sent();
                    if (number !== readNumber || editsOnTheWay > 0)
                        return [2 /*return*/];
                    was = state.project;
                    _a = nextLoad(was, answer), load = _a.load, failedOver = _a.failedOver;
                    set(__assign({ project: load }, (failedOver === null ? {} : { note: failedOver })));
                    back = wentBack(was, load);
                    if (back !== null)
                        say({ tone: 'success', text: en_1.t.flow.backOnBoard(back.title) });
                    return [2 /*return*/];
            }
        });
    }); };
    var loadGame = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, load, failedOver, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = nextLoad;
                    _c = [state.game];
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readGame(); })];
                case 1:
                    _a = _b.apply(void 0, _c.concat([_d.sent()])), load = _a.load, failedOver = _a.failedOver;
                    set(__assign({ game: load }, (failedOver === null ? {} : { note: failedOver })));
                    return [2 /*return*/];
            }
        });
    }); };
    var select = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (key !== state.selected)
                        set({ selected: key, project: { status: 'loading' } });
                    return [4 /*yield*/, loadProject(key)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var remember = function (patch) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.saveSettings(patch); })];
                case 1:
                    answer = _a.sent();
                    if (answer.ok)
                        set({ settings: answer.data });
                    else
                        set({ note: answer.message });
                    return [2 /*return*/];
            }
        });
    }); };
    // The last realm used, or the only one; with several and no memory, the
    // list asks.
    var firstChoice = function (rows) {
        var known = rows.find(function (r) { return r.key === state.settings.lastProject; });
        if (known !== undefined)
            return known.key;
        return rows.length === 1 ? rows[0].key : null;
    };
    var loadProjects = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer, _a, load, failedOver, selected, choice;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.listProjects(); })];
                case 1:
                    answer = _b.sent();
                    _a = nextLoad(state.projects, answer), load = _a.load, failedOver = _a.failedOver;
                    set(__assign({ projects: load }, (failedOver === null ? { note: null } : { note: failedOver })));
                    if (load.status !== 'ready')
                        return [2 /*return*/];
                    selected = state.selected;
                    if (!(selected !== null && load.data.some(function (r) { return r.key === selected; }))) return [3 /*break*/, 3];
                    return [4 /*yield*/, loadProject(selected)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 3:
                    choice = firstChoice(load.data);
                    if (!(choice !== null)) return [3 /*break*/, 5];
                    return [4 /*yield*/, select(choice)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    set({ selected: null, project: { status: 'none' } });
                    _b.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var refresh = function () { return Promise.all([loadProjects(), loadGame()]).then(function () { return undefined; }); };
    var dismiss = function (id) { return set({ toasts: state.toasts.filter(function (toast) { return toast.id !== id; }) }); };
    var say = function (toast) {
        toastNumber += 1;
        set({ toasts: __spreadArray(__spreadArray([], state.toasts, true), [__assign(__assign({}, toast), { id: toastNumber })], false).slice(-constants_1.TOASTS_SHOWN) });
    };
    var isShowing = function (key) { return state.selected === key; };
    // A view main handed back. Whatever read began before it is out of date.
    var adopt = function (key, view) {
        if (!isShowing(key))
            return;
        readNumber += 1;
        set({ project: { status: 'ready', data: view } });
    };
    var withoutKey = function (from, key) { return Object.fromEntries(Object.entries(from).filter(function (_a) {
        var k = _a[0];
        return k !== key;
    })); };
    var showSaved = function (questId) {
        set({ savedQuest: questId });
        setTimeout(function () {
            if (state.savedQuest === questId)
                set({ savedQuest: null });
        }, constants_1.SAVED_MS);
    };
    var run = function (edit) { return __awaiter(void 0, void 0, void 0, function () {
        var before, answer, undo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    before = state.project;
                    if (edit.preview !== undefined && isShowing(edit.key) && before.status === 'ready' && before.data.kind === 'readable') {
                        set({ project: { status: 'ready', data: edit.preview(before.data) } });
                    }
                    editsOnTheWay += 1;
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, edit.call)];
                case 1:
                    answer = _a.sent();
                    editsOnTheWay -= 1;
                    if (!answer.ok) {
                        if (isShowing(edit.key) && edit.preview !== undefined)
                            set({ project: before });
                        if (edit.isQuiet !== true)
                            say({ tone: 'error', text: answer.message, action: { label: en_1.t.failed.tryAgain, run: function () { return void run(edit); } } });
                        return [2 /*return*/, answer];
                    }
                    if (isShowing(edit.key)) {
                        // A read that began before this write is out of date when it lands.
                        readNumber += 1;
                        set({ project: { status: 'ready', data: answer.data } });
                    }
                    if (edit.questId !== undefined)
                        showSaved(edit.questId);
                    undo = edit.undo;
                    if (undo !== undefined) {
                        undos.push(__assign({ key: edit.key }, undo));
                        if (undos.length > constants_1.UNDO_DEPTH)
                            undos.shift();
                    }
                    if (edit.said !== undefined) {
                        say(__assign({ tone: 'success', text: edit.said }, (undo === undefined ? {} : { action: { label: en_1.t.edit.undo, run: function () { return void undoLast(edit.key); } } })));
                    }
                    return [2 /*return*/, answer];
            }
        });
    }); };
    // The newest undo for this realm.
    var undoLast = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var at, entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    at = undos.findLastIndex(function (entry) { return entry.key === key; });
                    if (at === -1)
                        return [2 /*return*/];
                    entry = undos.splice(at, 1)[0];
                    return [4 /*yield*/, run({ key: key, call: entry.call, said: entry.said })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        getState: function () { return state; },
        subscribe: function (listener) {
            listeners.add(listener);
            return function () { return listeners.delete(listener); };
        },
        start: function () { return __awaiter(void 0, void 0, void 0, function () {
            var settings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readSettings(); })];
                    case 1:
                        settings = _a.sent();
                        if (settings.ok)
                            set({ settings: settings.data });
                        else
                            set({ note: settings.message });
                        return [4 /*yield*/, refresh()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, engine.onChange(function () { return void refresh(); })];
                }
            });
        }); },
        refresh: refresh,
        pick: function (key) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, select(key)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, remember({ lastProject: key })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        setSky: function (sky) { return remember({ sky: sky }); },
        // A setting shows at once; a failed save says so in the note.
        changeSettings: function (patch) {
            set({ settings: __assign(__assign({}, state.settings), patch) });
            return remember(patch);
        },
        // One realm's account, leaving every other realm's as it is.
        setRealmAccount: function (key, login) {
            var _a;
            var others = withoutKey(state.settings.realmAccounts, key);
            var realmAccounts = login === null ? others : __assign(__assign({}, others), (_a = {}, _a[key] = login, _a));
            set({ settings: __assign(__assign({}, state.settings), { realmAccounts: realmAccounts }) });
            return remember({ realmAccounts: realmAccounts });
        },
        openQuest: function (key, questId) {
            var _a;
            return set({ openQuests: __assign(__assign({}, state.openQuests), (_a = {}, _a[key] = questId, _a)) });
        },
        closeQuest: function (key) { return set({ openQuests: withoutKey(state.openQuests, key) }); },
        setFlow: function (key, flow) {
            var _a;
            return set({ flows: flow === null ? withoutKey(state.flows, key) : __assign(__assign({}, state.flows), (_a = {}, _a[key] = flow, _a)) });
        },
        showWon: function (won) { return set({ won: won }); },
        noteFor: function (questId, text) {
            var _a;
            return set({ questNotes: text === null ? withoutKey(state.questNotes, questId) : __assign(__assign({}, state.questNotes), (_a = {}, _a[questId] = text, _a)) });
        },
        setDetected: function (key) { return set({ detected: key }); },
        setBoard: function (key, board) {
            var _a;
            return set({ boards: __assign(__assign({}, state.boards), (_a = {}, _a[key] = board, _a)) });
        },
        adopt: adopt,
        run: run,
        undo: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(state.selected !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, undoLast(state.selected)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); },
        dismiss: dismiss,
        dismissBadges: function () { return set({ toasts: state.toasts.filter(function (toast) { return toast.isLong !== true; }) }); },
        say: say,
        toggleFold: function (key, questId) { return __awaiter(void 0, void 0, void 0, function () {
            var folded, next, folds;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        folded = (_b = state.settings.folds[key]) !== null && _b !== void 0 ? _b : [];
                        next = folded.includes(questId) ? folded.filter(function (id) { return id !== questId; }) : __spreadArray(__spreadArray([], folded, true), [questId], false);
                        folds = __assign(__assign({}, state.settings.folds), (_a = {}, _a[key] = next, _a));
                        set({ settings: __assign(__assign({}, state.settings), { folds: folds }) });
                        return [4 /*yield*/, remember({ folds: folds })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    };
};
exports.createWorkspace = createWorkspace;
var useWorkspace = function (workspace) {
    var _a = (0, hooks_1.useState)(workspace.getState()), state = _a[0], setState = _a[1];
    (0, hooks_1.useEffect)(function () {
        setState(workspace.getState());
        return workspace.subscribe(function () { return setState(workspace.getState()); });
    }, [workspace]);
    return state;
};
exports.useWorkspace = useWorkspace;
