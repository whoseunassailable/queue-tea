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
var vitest_1 = require("vitest");
var edits_1 = require("../../quests/domain/edits");
var quest_edits_1 = require("../../quests/presentation/state_management/quest_edits");
var test_support_1 = require("../../../test_support");
var workspace_store_1 = require("./workspace_store");
var KEY = 'a-000001';
var ROW = (0, test_support_1.quest)({ id: 'x', title: 'The quest', priority: 'mid' });
var BOARD = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: ROW }], canStart: 1 });
var fail = { ok: false, error: { message: 'Could not save.' } };
var priorityOn = function (state) {
    var _a;
    var project = state.project;
    if (project.status !== 'ready' || project.data.kind !== 'readable')
        throw new Error('should show the realm');
    return (_a = project.data.ready[0]) === null || _a === void 0 ? void 0 : _a.quest.priority;
};
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var fake, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fake = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: BOARD })];
                        }); }); } }, over));
                    workspace = (0, workspace_store_1.createWorkspace)(fake.engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({}, fake), { workspace: workspace, edits: (0, quest_edits_1.questEdits)(fake.engine, workspace) })];
            }
        });
    });
};
// A call that answers when the test says.
var held = function () {
    var answer = function () { };
    var reply = new Promise(function (done) { return (answer = done); });
    return { reply: reply, answer: answer };
};
(0, vitest_1.describe)('an edit', function () {
    (0, vitest_1.it)('shows before main answers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var write, _a, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    write = held();
                    return [4 /*yield*/, open({ setPriority: function () { return write.reply; } })];
                case 1:
                    _a = _b.sent(), workspace = _a.workspace, edits = _a.edits;
                    void edits.setPriority(KEY, ROW, 'urgent');
                    (0, vitest_1.expect)(priorityOn(workspace.getState())).toBe('urgent');
                    write.answer({ ok: true, data: BOARD });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("then takes main's answer as the truth", function () { return __awaiter(void 0, void 0, void 0, function () {
        var after, _a, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    after = (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: __assign(__assign({}, ROW), { priority: 'high' }) }] });
                    return [4 /*yield*/, open({ setPriority: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: after })];
                            }); }); } })];
                case 1:
                    _a = _b.sent(), workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.setPriority(KEY, ROW, 'urgent')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(priorityOn(workspace.getState())).toBe('high');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reverts when the write fails, and says so with a way to try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setPriority, _a, workspace, edits, toast;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setPriority = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, fail];
                    }); }); });
                    return [4 /*yield*/, open({ setPriority: setPriority })];
                case 1:
                    _a = _c.sent(), workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.setPriority(KEY, ROW, 'urgent')];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(priorityOn(workspace.getState())).toBe('mid');
                    toast = workspace.getState().toasts[0];
                    (0, vitest_1.expect)(toast).toMatchObject({ tone: 'error', text: 'Could not save.' });
                    (_b = toast === null || toast === void 0 ? void 0 : toast.action) === null || _b === void 0 ? void 0 : _b.run();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(setPriority).toHaveBeenCalledTimes(2); })];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a refresh arriving between the click and the reply cannot paint the old value back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var write, _a, workspace, edits, fire;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    write = held();
                    return [4 /*yield*/, open({ setPriority: function () { return write.reply; } })];
                case 1:
                    _a = _b.sent(), workspace = _a.workspace, edits = _a.edits, fire = _a.fire;
                    void edits.setPriority(KEY, ROW, 'urgent');
                    fire();
                    return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 10); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(priorityOn(workspace.getState())).toBe('urgent');
                    write.answer({ ok: true, data: (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: __assign(__assign({}, ROW), { priority: 'urgent' }) }] }) });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a slow read from before the write cannot land after it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var read, isSlow, _a, workspace, edits, fire;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    read = held();
                    isSlow = false;
                    return [4 /*yield*/, open({
                            readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, (isSlow ? read.reply : { ok: true, data: BOARD })];
                            }); }); },
                            setPriority: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(KEY, { ready: [{ kind: 'quest', quest: __assign(__assign({}, ROW), { priority: 'urgent' }) }] }) })];
                            }); }); },
                        })];
                case 1:
                    _a = _b.sent(), workspace = _a.workspace, edits = _a.edits, fire = _a.fire;
                    isSlow = true;
                    fire();
                    return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 5); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, edits.setPriority(KEY, ROW, 'urgent')];
                case 3:
                    _b.sent();
                    read.answer({ ok: true, data: BOARD });
                    return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 5); })];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(priorityOn(workspace.getState())).toBe('urgent');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks the chip as saved, then lets go', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.useFakeTimers();
                    return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.setPriority(KEY, ROW, 'urgent')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().savedQuest).toBe('x');
                    vitest_1.vi.advanceTimersByTime(1200);
                    (0, vitest_1.expect)(workspace.getState().savedQuest).toBe(null);
                    vitest_1.vi.useRealTimers();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a form that shows its own error gets no toast', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, workspace, edits, answer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ fileQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, fail];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.file(KEY, { title: 'x', priority: 'mid', difficulty: 'medium', parent: { kind: 'none' }, description: null, criteria: [], helpers: ['tea-dd'] }, null)];
                case 2:
                    answer = _b.sent();
                    (0, vitest_1.expect)(answer).toEqual({ ok: false, message: 'Could not save.' });
                    (0, vitest_1.expect)(workspace.getState().toasts).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps three toasts at most', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workspace, _i, _a, text;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    workspace = (_b.sent()).workspace;
                    for (_i = 0, _a = ['a', 'b', 'c', 'd']; _i < _a.length; _i++) {
                        text = _a[_i];
                        workspace.say({ tone: 'info', text: text });
                    }
                    (0, vitest_1.expect)(workspace.getState().toasts.map(function (toast) { return toast.text; })).toEqual(['b', 'c', 'd']);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Undo', function () {
    (0, vitest_1.it)('puts the old priority back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.setPriority(KEY, ROW, 'urgent')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, workspace.undo()];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(engine.setPriority).toHaveBeenLastCalledWith(KEY, 'x', 'mid');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('brings a removed quest back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.remove(KEY, ROW)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, workspace.undo()];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(engine.restoreQuest).toHaveBeenCalledWith(KEY, 'x');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves a quest back where it was', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.move(KEY, __assign(__assign({}, ROW), { parentId: 'old' }), 'new', 'New saga')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, workspace.undo()];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(engine.moveQuest).toHaveBeenLastCalledWith(KEY, 'x', 'old');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes back one edit at a time, newest first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.setPriority(KEY, ROW, 'urgent')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, edits.togglePlayNext(KEY, ROW)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, workspace.undo()];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(engine.togglePlayNext).toHaveBeenCalledTimes(2);
                    (0, vitest_1.expect)(engine.setPriority).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has nothing to do with nothing done', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace;
                    return [4 /*yield*/, workspace.undo()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.setPriority).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays in its own realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace, edits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({
                        listProjects: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: [(0, test_support_1.projectRow)(KEY), (0, test_support_1.projectRow)('b-000002')] })];
                        }); }); },
                        readSettings: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: KEY, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {} } })];
                        }); }); },
                    })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, workspace = _a.workspace, edits = _a.edits;
                    return [4 /*yield*/, edits.setPriority(KEY, ROW, 'urgent')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, workspace.pick('b-000002')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, workspace.undo()];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(engine.setPriority).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('folds', function () {
    (0, vitest_1.it)('are kept per realm in the settings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, workspace;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _c.sent(), engine = _a.engine, workspace = _a.workspace;
                    return [4 /*yield*/, workspace.toggleFold(KEY, 'saga')];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(engine.saveSettings).toHaveBeenLastCalledWith({ folds: (_b = {}, _b[KEY] = ['saga'], _b) });
                    return [4 /*yield*/, workspace.toggleFold(KEY, 'saga')];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(workspace.getState().settings.folds[KEY]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('what an edit looks like before the reply', function () {
    var view = function () {
        var board = (0, test_support_1.projectView)(KEY, {
            ready: [
                { kind: 'saga', quest: (0, test_support_1.quest)({ id: 'saga' }), chapters: [(0, test_support_1.quest)({ id: 'chapter' })], progress: { done: 0, total: 1, current: 0, blocked: 0 }, hasStar: false },
                { kind: 'quest', quest: ROW },
            ],
        });
        if (board.kind !== 'readable')
            throw new Error('readable');
        return board;
    };
    (0, vitest_1.it)('reaches a chapter inside its saga', function () {
        var _a;
        var entry = (0, edits_1.withPriority)('chapter', 'high')(view()).ready[0];
        (0, vitest_1.expect)((entry === null || entry === void 0 ? void 0 : entry.kind) === 'saga' && ((_a = entry.chapters[0]) === null || _a === void 0 ? void 0 : _a.priority)).toBe('high');
    });
    (0, vitest_1.it)('takes out a quest and a chapter', function () {
        (0, vitest_1.expect)((0, edits_1.withoutQuest)('x')(view()).ready).toHaveLength(1);
        var entry = (0, edits_1.withoutQuest)('chapter')(view()).ready[0];
        (0, vitest_1.expect)((entry === null || entry === void 0 ? void 0 : entry.kind) === 'saga' && entry.chapters).toEqual([]);
    });
});
