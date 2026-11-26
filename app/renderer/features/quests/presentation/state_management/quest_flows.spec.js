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
var en_1 = require("../../../../l10n/en");
var test_support_1 = require("../../../../test_support");
var workspace_store_1 = require("../../../workspace/state_management/workspace_store");
var quest_flows_1 = require("./quest_flows");
var KEY = 'a-000001';
var QUEST = { id: 'first', title: 'First quest' };
var ACTIVE = (0, test_support_1.activeQuest)();
var HOLD = { kind: 'uncommitted', reason: '2 files not committed', branch: 'main', head: 'abc1234', files: ['a.txt', 'b.txt'], fileCount: 2, command: 'git status' };
// A reply the test lets go of, to look at the screen between two steps.
var held = function () {
    var release;
    var reply = new Promise(function (done) {
        release = done;
    });
    return { reply: reply, release: release };
};
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over, view) {
        var engine, workspace;
        if (over === void 0) { over = {}; }
        if (view === void 0) { view = (0, test_support_1.projectView)(KEY); }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view })];
                        }); }); } }, over)).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { engine: engine, workspace: workspace, flows: (0, quest_flows_1.questFlows)(engine, workspace), flow: function () { return workspace.getState().flows[KEY]; }, toasts: function () { return workspace.getState().toasts.map(function (toast) { return toast.text; }); } }];
            }
        });
    });
};
var started = function (over) {
    if (over === void 0) { over = {}; }
    return ({
        ok: true,
        data: __assign({ kind: 'started', view: (0, test_support_1.projectView)(KEY, { active: ACTIVE }), branch: 'task/first', notice: null, handover: { kind: 'session' } }, over),
    });
};
(0, vitest_1.describe)('opening VS Code for the active quest', function () {
    vitest_1.it.each([null, '2026-11-03T16:00:00-06:00'])('only asks to paste Claude when Claude owns the quest (Codex since: %s)', function (codexSince) { return __awaiter(void 0, void 0, void 0, function () {
        var active, _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    active = __assign(__assign({}, ACTIVE), { codexSince: codexSince });
                    return [4 /*yield*/, open({ openClaude: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: { kind: 'opened', terminal: 'vscode' } })];
                            }); }); } }, (0, test_support_1.projectView)(KEY, { active: active }))];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.openClaude(KEY, active)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toEqual(codexSince === null ? [en_1.t.flow.pasteVsCode] : []);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Start', function () {
    (0, vitest_1.it)('shows one working line for each step, then the quest in hand', function () { return __awaiter(void 0, void 0, void 0, function () {
        var check, start, _a, flows, flow, workspace, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    check = held();
                    start = held();
                    return [4 /*yield*/, open({ checkStart: function () { return check.reply; }, startQuest: function () { return start.reply; } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow, workspace = _a.workspace;
                    running = flows.start(KEY, QUEST);
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'working', line: en_1.t.flow.checking });
                    check.release({ ok: true, data: { kind: 'clear', step: { kind: 'make', branch: 'task/first', from: 'main' } } });
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'working', line: en_1.t.flow.making('task/first', 'main') }); })];
                case 2:
                    _b.sent();
                    start.release(started());
                    return [4 /*yield*/, running];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    (0, vitest_1.expect)(workspace.getState().project).toMatchObject({ status: 'ready', data: { active: { id: 'active' } } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names the branch a put-back quest returns to', function () { return __awaiter(void 0, void 0, void 0, function () {
        var start, _a, flows, flow, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = held();
                    return [4 /*yield*/, open({
                            checkStart: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: { kind: 'clear', step: { kind: 'switch', branch: 'task/mine' } } })];
                            }); }); },
                            startQuest: function () { return start.reply; },
                        })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    running = flows.start(KEY, QUEST);
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(flow()).toMatchObject({ line: en_1.t.flow.switching('task/mine') }); })];
                case 2:
                    _b.sent();
                    start.release(started());
                    return [4 /*yield*/, running];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says it set out, with the branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started()];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.flow.setOut('First quest', 'task/first')]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('passes on what the engine noticed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started({ notice: 'task/old was gone.' })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toContain('task/old was gone.');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tells you to paste into VS Code', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started({ handover: { kind: 'opened', terminal: 'vscode' } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toContain(en_1.t.flow.pasteVsCode);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays out of the way when a terminal opened', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started({ handover: { kind: 'opened', terminal: 'terminal' } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the line to copy when the terminal would not open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started({ handover: { kind: 'failed', terminal: 'iterm', command: "cd '/p' && claude" } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toEqual({ kind: 'openFailed', questId: QUEST.id, title: QUEST.title, platform: 'claude', terminal: 'iterm', command: "cd '/p' && claude" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a hold and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ checkStart: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: HOLD } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'held', hold: HOLD, isChecking: false });
                    (0, vitest_1.expect)(engine.startQuest).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Check again keeps the hold on screen, then starts when it has cleared', function () { return __awaiter(void 0, void 0, void 0, function () {
        var check, checkStart, _a, engine, flows, flow, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    check = held();
                    checkStart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: HOLD } })];
                    }); }); });
                    return [4 /*yield*/, open({ checkStart: checkStart, startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, started()];
                            }); }); } })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    checkStart.mockImplementation(function () { return check.reply; });
                    running = flows.checkAgain(KEY);
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'held', isChecking: true });
                    check.release({ ok: true, data: { kind: 'clear', step: { kind: 'noRepo' } } });
                    return [4 /*yield*/, running];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    (0, vitest_1.expect)(engine.checkStart).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('holds when git changed between the check and the start', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: HOLD } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'held', hold: HOLD });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the refusal where the work was, in the engine\'s words', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ checkStart: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'The other one was started first.' } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'refused', message: 'The other one was started first.' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a second press while it runs starts nothing more', function () { return __awaiter(void 0, void 0, void 0, function () {
        var check, checkStart, startQuest, flows, first;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    check = held();
                    checkStart = vitest_1.vi.fn(function () { return check.reply; });
                    startQuest = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, started()];
                    }); }); });
                    return [4 /*yield*/, open({ checkStart: checkStart, startQuest: startQuest })];
                case 1:
                    flows = (_a.sent()).flows;
                    first = flows.start(KEY, QUEST);
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _a.sent();
                    check.release({ ok: true, data: { kind: 'clear', step: { kind: 'noRepo' } } });
                    return [4 /*yield*/, first];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(checkStart).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(startQuest).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('each realm keeps its own hold', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ checkStart: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: HOLD } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow, workspace = _a.workspace;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, workspace.pick('b-000002')];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().flows['b-000002']).toBeUndefined();
                    return [4 /*yield*/, workspace.pick(KEY)];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'held' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Cancel clears the hold', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ checkStart: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: HOLD } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    flows.cancel(KEY);
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Cancel leaves a step that is running alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var check, _a, flows, flow, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    check = held();
                    return [4 /*yield*/, open({ checkStart: function () { return check.reply; } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    running = flows.start(KEY, QUEST);
                    flows.cancel(KEY);
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'working' });
                    check.release({ ok: true, data: { kind: 'held', hold: HOLD } });
                    return [4 /*yield*/, running];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('closes the victory still showing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().won).not.toBeNull();
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().won).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Open in Claude Code', function () {
    (0, vitest_1.it)('shows its line while the terminal opens', function () { return __awaiter(void 0, void 0, void 0, function () {
        var opening, _a, flows, flow, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    opening = held();
                    return [4 /*yield*/, open({ openClaude: function () { return opening.reply; } }, (0, test_support_1.projectView)(KEY, { active: ACTIVE }))];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    running = flows.openClaude(KEY, ACTIVE);
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'working', line: en_1.t.flow.opening });
                    opening.release({ ok: true, data: { kind: 'opened', terminal: 'terminal' } });
                    return [4 /*yield*/, running];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers the line to copy when it fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ openClaude: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { kind: 'failed', terminal: 'terminal', command: 'cd x && claude' } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.openClaude(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'openFailed', command: 'cd x && claude' });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Finish quest', function () {
    (0, vitest_1.it)('shows the victory and takes the board as it now is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({}, (0, test_support_1.projectView)(KEY, { active: ACTIVE }))];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().won).toEqual({ victory: test_support_1.VICTORY, logPath: 'docs/task_log.md' });
                    (0, vitest_1.expect)(workspace.getState().project).toMatchObject({ data: { active: null } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the quest with the ★ open next', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({}, (0, test_support_1.projectView)(KEY, { active: ACTIVE }))];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    workspace.openQuest(KEY, 'something-else');
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().openQuests[KEY]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says each badge earned, for a while longer than other toasts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finishQuest, _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    finishQuest = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), logPath: 'log.md', logFailedAt: null, minutes: 1, victory: __assign(__assign({}, test_support_1.VICTORY), { newBadges: ['nightOwl'] }), isCodexTimeLost: false } })];
                    }); }); });
                    return [4 /*yield*/, open({ finishQuest: finishQuest })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().toasts).toMatchObject([{ text: en_1.t.win.badgeToast(en_1.t.badges.nightOwl), isLong: true }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says it won with a toast when the game had no answer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finishQuest, _a, flows, workspace, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    finishQuest = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), logPath: 'log.md', logFailedAt: null, minutes: 14, victory: null, isCodexTimeLost: false } })];
                    }); }); });
                    return [4 /*yield*/, open({ finishQuest: finishQuest })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace, toasts = _a.toasts;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().won).toBeNull();
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.flow.won('Active one', '14m', 'log.md')]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the failure for the sheet to show, and the record to try again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open({ finishQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'That quest moved.' } })];
                        }); }); } })];
                case 1:
                    _a = _c.sent(), flows = _a.flows, workspace = _a.workspace;
                    _b = vitest_1.expect;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toEqual({ ok: false, message: 'That quest moved.' });
                    (0, vitest_1.expect)(workspace.getState().won).toBeNull();
                    (0, vitest_1.expect)(workspace.getState().toasts).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers Try again when the log could not be written, and it works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finishQuest, _a, engine, flows, workspace, toast;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    finishQuest = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), logPath: 'log.md', logFailedAt: 'log.md', minutes: 1, victory: test_support_1.VICTORY, isCodexTimeLost: false } })];
                    }); }); });
                    return [4 /*yield*/, open({ finishQuest: finishQuest })];
                case 1:
                    _a = _c.sent(), engine = _a.engine, flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _c.sent();
                    toast = workspace.getState().toasts.find(function (item) { return item.tone === 'error'; });
                    (0, vitest_1.expect)(toast === null || toast === void 0 ? void 0 : toast.text).toBe(en_1.t.flow.logFailed('log.md'));
                    (_b = toast === null || toast === void 0 ? void 0 : toast.action) === null || _b === void 0 ? void 0 : _b.run();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(workspace.getState().toasts.some(function (item) { return item.text === en_1.t.flow.logged('docs/task_log.md'); })).toBe(true); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(engine.retryTaskLog).toHaveBeenCalledWith(KEY, 'active', 'log.md');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers Try again again when the retry fails too', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finishQuest, retryTaskLog, _a, flows, workspace;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    finishQuest = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), logPath: 'log.md', logFailedAt: 'log.md', minutes: 1, victory: test_support_1.VICTORY, isCodexTimeLost: false } })];
                    }); }); });
                    retryTaskLog = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), logPath: 'log.md', logFailedAt: 'log.md' } })];
                    }); }); });
                    return [4 /*yield*/, open({ finishQuest: finishQuest, retryTaskLog: retryTaskLog })];
                case 1:
                    _a = _d.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _d.sent();
                    (_c = (_b = workspace.getState().toasts.find(function (item) { return item.tone === 'error'; })) === null || _b === void 0 ? void 0 : _b.action) === null || _c === void 0 ? void 0 : _c.run();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(retryTaskLog).toHaveBeenCalledTimes(1); })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(workspace.getState().toasts.filter(function (item) { return item.tone === 'error'; })).toHaveLength(2); })];
                case 4:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Judgement', function () {
    (0, vitest_1.it)('Not yet clears the card in the same frame', function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer, reviewed, _a, flows, workspace, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    answer = held();
                    reviewed = (0, test_support_1.activeQuest)({ review: { at: 'now', checked: 'tests pass' } });
                    return [4 /*yield*/, open({ notYet: function () { return answer.reply; } }, (0, test_support_1.projectView)(KEY, { active: reviewed }))];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    running = flows.notYet(KEY, reviewed);
                    (0, vitest_1.expect)(workspace.getState().project).toMatchObject({ data: { active: { review: null } } });
                    answer.release({ ok: true, data: (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)() }) });
                    return [4 /*yield*/, running];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('brings the card back when the answer could not be saved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reviewed, _a, flows, workspace, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reviewed = (0, test_support_1.activeQuest)({ review: { at: 'now', checked: null } });
                    return [4 /*yield*/, open({ notYet: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: false, error: { message: "Couldn't save your answer." } })];
                            }); }); } }, (0, test_support_1.projectView)(KEY, { active: reviewed }))];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace, toasts = _a.toasts;
                    return [4 /*yield*/, flows.notYet(KEY, reviewed)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().project).toMatchObject({ data: { active: { review: { at: 'now' } } } });
                    (0, vitest_1.expect)(toasts()).toEqual(["Couldn't save your answer."]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Back to the board', function () {
    (0, vitest_1.it)('says so when it has gone back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({}, (0, test_support_1.projectView)(KEY, { active: ACTIVE }))];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.flow.backOnBoard('Active one')]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays quiet while a session is asked, and the view shows it waiting', function () { return __awaiter(void 0, void 0, void 0, function () {
        var asked, _a, flows, toasts, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    asked = (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)({ asking: 'putBack' }) });
                    return [4 /*yield*/, open({ putBackQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: { view: asked, went: 'asked', missedCheckpoint: null, isCodexTimeLost: false } })];
                            }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts, workspace = _a.workspace;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toEqual([]);
                    (0, vitest_1.expect)(workspace.getState().project).toMatchObject({ data: { active: { asking: 'putBack' } } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tells of the checkpoint it missed, beside the quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ putBackQuest: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), went: 'back', missedCheckpoint: { lastAt: '2026-10-26T16:35:00+01:00' }, isCodexTimeLost: false } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().questNotes.active).toBe(en_1.t.flow.noCheckpoint('26 Oct 16:35'));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('tells of it with no checkpoint to fall back on', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ putBackQuest: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), went: 'back', missedCheckpoint: { lastAt: null }, isCodexTimeLost: false } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().questNotes.active).toBe(en_1.t.flow.noCheckpointYet);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a quest started again forgets the note', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ putBackQuest: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), went: 'back', missedCheckpoint: { lastAt: null }, isCodexTimeLost: false } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, flows.start(KEY, { id: 'active', title: 'Active one' })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().questNotes.active).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers Try again when it fails, and the card comes back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ putBackQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't put the quest back." } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow, workspace = _a.workspace;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    (0, vitest_1.expect)(workspace.getState().toasts).toMatchObject([{ tone: 'error', text: "Couldn't put the quest back.", action: { label: en_1.t.failed.tryAgain } }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('sealing the active quest says Sealed, and keeps a failure for its form', function () { return __awaiter(void 0, void 0, void 0, function () {
        var putBackQuest, _a, flows, toasts, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    putBackQuest = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), went: 'back', missedCheckpoint: null, isCodexTimeLost: false } })];
                    }); }); });
                    return [4 /*yield*/, open({ putBackQuest: putBackQuest })];
                case 1:
                    _a = _c.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.sealActive(KEY, ACTIVE, { reason: 'waiting' })];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.edit.sealed('Active one')]);
                    (0, vitest_1.expect)(putBackQuest).toHaveBeenCalledWith(KEY, 'active', { reason: 'waiting' });
                    putBackQuest.mockResolvedValueOnce({ ok: false, error: { message: 'Those two wait for each other.' } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, flows.sealActive(KEY, ACTIVE, { reason: 'waiting' })];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toEqual({ ok: false, message: 'Those two wait for each other.' });
                    (0, vitest_1.expect)(toasts()).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Put it back now goes without the session, and says no checkpoint was written', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.backNow(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.putBackNow).toHaveBeenCalledWith(KEY, 'active');
                    (0, vitest_1.expect)(workspace.getState().questNotes.active).toBe(en_1.t.flow.noCheckpointYet);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a session putting the quest back itself', function () {
    (0, vitest_1.it)('says it has gone back when the session has acted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var asked, view, engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    asked = (0, test_support_1.projectView)(KEY, { active: (0, test_support_1.activeQuest)({ asking: 'putBack' }) });
                    view = asked;
                    engine = (0, test_support_1.fakeEngine)({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view })];
                        }); }); } }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, workspace.start()];
                case 1:
                    _a.sent();
                    view = (0, test_support_1.projectView)(KEY);
                    return [4 /*yield*/, workspace.refresh()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(workspace.getState().toasts.map(function (toast) { return toast.text; })).toEqual([en_1.t.flow.backOnBoard('Active one')]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Time I have', function () {
    var answers = function () {
        var replies = [];
        var setTimeBudget = vitest_1.vi.fn(function () { return new Promise(function (done) { return void replies.push(done); }); });
        return { replies: replies, setTimeBudget: setTimeBudget };
    };
    (0, vitest_1.it)('steps on from the last step, not the board on screen, when pressed fast', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, replies, setTimeBudget, flows, steps;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = answers(), replies = _a.replies, setTimeBudget = _a.setTimeBudget;
                    return [4 /*yield*/, open({ setTimeBudget: setTimeBudget })];
                case 1:
                    flows = (_b.sent()).flows;
                    steps = [flows.stepBudget(KEY, null), flows.stepBudget(KEY, null), flows.stepBudget(KEY, null)];
                    (0, vitest_1.expect)(setTimeBudget.mock.calls.map(function (call) { return call[1]; })).toEqual([30, 60, 120]);
                    replies.forEach(function (release) { return release({ ok: true, data: (0, test_support_1.projectView)(KEY) }); });
                    return [4 /*yield*/, Promise.all(steps)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes round to any', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setTimeBudget, flows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTimeBudget = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(key) })];
                    }); }); });
                    return [4 /*yield*/, open({ setTimeBudget: setTimeBudget })];
                case 1:
                    flows = (_a.sent()).flows;
                    return [4 /*yield*/, flows.stepBudget(KEY, 120)];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(setTimeBudget).toHaveBeenCalledWith(KEY, null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts from the board again once the steps have landed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setTimeBudget, flows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTimeBudget = vitest_1.vi.fn(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_support_1.projectView)(key) })];
                    }); }); });
                    return [4 /*yield*/, open({ setTimeBudget: setTimeBudget })];
                case 1:
                    flows = (_a.sent()).flows;
                    return [4 /*yield*/, flows.stepBudget(KEY, null)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, flows.stepBudget(KEY, 60)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(setTimeBudget).toHaveBeenLastCalledWith(KEY, 120);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('forgets a step that failed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setTimeBudget, flows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTimeBudget = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: 'No.' } })];
                    }); }); });
                    return [4 /*yield*/, open({ setTimeBudget: setTimeBudget })];
                case 1:
                    flows = (_a.sent()).flows;
                    return [4 /*yield*/, flows.stepBudget(KEY, null)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, flows.stepBudget(KEY, null)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(setTimeBudget.mock.calls.map(function (call) { return call[1]; })).toEqual([30, 30]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps each realm\'s steps apart', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, replies, setTimeBudget, flows, steps;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = answers(), replies = _a.replies, setTimeBudget = _a.setTimeBudget;
                    return [4 /*yield*/, open({ setTimeBudget: setTimeBudget })];
                case 1:
                    flows = (_b.sent()).flows;
                    steps = [flows.stepBudget(KEY, null), flows.stepBudget('b-000002', null)];
                    (0, vitest_1.expect)(setTimeBudget.mock.calls.map(function (call) { return call[1]; })).toEqual([30, 30]);
                    replies.forEach(function (release) { return release({ ok: true, data: (0, test_support_1.projectView)(KEY) }); });
                    return [4 /*yield*/, Promise.all(steps)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('copying', function () {
    (0, vitest_1.it)('says it copied', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.copy('git status')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.copyText).toHaveBeenCalledWith('git status');
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.flow.copied]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when it could not', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ copyText: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: "Couldn't copy that." } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.copy('git status')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().toasts).toMatchObject([{ tone: 'error', text: "Couldn't copy that." }]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Start in Codex', function () {
    (0, vitest_1.it)('asks the engine for Claude Code when no platform is given', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, flows;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started()];
                        }); }); }) })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, flows = _a.flows;
                    return [4 /*yield*/, flows.start(KEY, QUEST)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'claude');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks the engine to start it in Codex, and says it set out with Codex', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started()];
                        }); }); }) })];
                case 1:
                    _a = _b.sent(), engine = _a.engine, flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.start(KEY, QUEST, 'codex')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'codex');
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.flow.setOutCodex('First quest', 'task/first')]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps Codex through a hold, so Check again starts it in Codex', function () { return __awaiter(void 0, void 0, void 0, function () {
        var checkStart, startQuest, _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    checkStart = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: HOLD } })];
                    }); }); });
                    startQuest = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, started()];
                    }); }); });
                    return [4 /*yield*/, open({ checkStart: checkStart, startQuest: startQuest })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST, 'codex')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'held', platform: 'codex' });
                    checkStart.mockResolvedValue({ ok: true, data: { kind: 'clear', step: { kind: 'noRepo' } } });
                    return [4 /*yield*/, flows.checkAgain(KEY)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(startQuest).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(startQuest).toHaveBeenCalledWith(KEY, 'first', 'codex');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps Codex through a hold at the start itself, and through a refusal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var startQuest, _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startQuest = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { kind: 'held', hold: HOLD } })];
                    }); }); });
                    return [4 /*yield*/, open({ startQuest: startQuest })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.start(KEY, QUEST, 'codex')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'held', platform: 'codex' });
                    startQuest.mockResolvedValueOnce({ ok: false, error: { message: 'The other one was started first.' } });
                    return [4 /*yield*/, flows.checkAgain(KEY)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'refused', platform: 'codex' });
                    startQuest.mockResolvedValueOnce(started());
                    return [4 /*yield*/, flows.checkAgain(KEY)];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(startQuest.mock.calls.map(function (call) { return call[2]; })).toEqual(['codex', 'codex', 'codex']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says the Codex line is copied when VS Code has to have it pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ startQuest: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, started({ handover: { kind: 'opened', terminal: 'vscode' } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.start(KEY, QUEST, 'codex')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toContain(en_1.t.flow.pasteCodex);
                    (0, vitest_1.expect)(toasts()).not.toContain(en_1.t.flow.pasteVsCode);
                    return [2 /*return*/];
            }
        });
    }); });
});
var moved = function (over) {
    if (over === void 0) { over = {}; }
    return ({
        ok: true,
        data: __assign({ view: (0, test_support_1.projectView)(KEY, { active: __assign(__assign({}, ACTIVE), { codexSince: '2026-10-27T18:50:00+01:00' }) }), handover: { kind: 'opened', terminal: 'terminal' }, isCodexTimeLost: false }, over),
    });
};
(0, vitest_1.describe)('Continue in', function () {
    (0, vitest_1.it)('shows its line while the quest moves to Codex, then says Codex has it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var move, continueIn, _a, flows, flow, toasts, workspace, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    move = held();
                    continueIn = vitest_1.vi.fn(function () { return move.reply; });
                    return [4 /*yield*/, open({ continueIn: continueIn })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow, toasts = _a.toasts, workspace = _a.workspace;
                    running = flows.continueIn(KEY, ACTIVE, 'codex');
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'working', line: en_1.t.flow.toCodex });
                    move.release(moved());
                    return [4 /*yield*/, running];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(continueIn).toHaveBeenCalledWith(KEY, 'active', 'codex');
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.flow.nowCodex('Active one')]);
                    (0, vitest_1.expect)(workspace.getState().project).toMatchObject({ data: { active: { codexSince: '2026-10-27T18:50:00+01:00' } } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('bringing it back says Claude Code has it again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow, toasts, running;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ continueIn: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, moved()];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow, toasts = _a.toasts;
                    running = flows.continueIn(KEY, ACTIVE, 'claude');
                    (0, vitest_1.expect)(flow()).toMatchObject({ kind: 'working', line: en_1.t.flow.toClaude });
                    return [4 /*yield*/, running];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toEqual([en_1.t.flow.nowClaude('Active one')]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a refusal leaves the quest where it was, says why, and Try again asks again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var refusal, continueIn, _a, flows, flow, workspace, toast;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    refusal = 'Claude Code is still working on Active one. Nothing has changed.';
                    continueIn = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: refusal } })];
                    }); }); });
                    return [4 /*yield*/, open({ continueIn: continueIn })];
                case 1:
                    _a = _c.sent(), flows = _a.flows, flow = _a.flow, workspace = _a.workspace;
                    return [4 /*yield*/, flows.continueIn(KEY, ACTIVE, 'codex')];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(flow()).toBeUndefined();
                    toast = workspace.getState().toasts[0];
                    (0, vitest_1.expect)(toast).toMatchObject({ tone: 'error', text: refusal, action: { label: en_1.t.failed.tryAgain } });
                    (_b = toast === null || toast === void 0 ? void 0 : toast.action) === null || _b === void 0 ? void 0 : _b.run();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(continueIn).toHaveBeenCalledTimes(2); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(continueIn).toHaveBeenLastCalledWith(KEY, 'active', 'codex');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the line to copy when Codex would not open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, flow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ continueIn: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, moved({ handover: { kind: 'failed', terminal: 'iterm', command: "cd '/p' && codex 'brief'" } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, flow = _a.flow;
                    return [4 /*yield*/, flows.continueIn(KEY, ACTIVE, 'codex')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(flow()).toEqual({ kind: 'openFailed', questId: ACTIVE.id, title: ACTIVE.title, platform: 'codex', terminal: 'iterm', command: "cd '/p' && codex 'brief'" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a second press while it moves asks nothing more', function () { return __awaiter(void 0, void 0, void 0, function () {
        var move, continueIn, flows, running;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    move = held();
                    continueIn = vitest_1.vi.fn(function () { return move.reply; });
                    return [4 /*yield*/, open({ continueIn: continueIn })];
                case 1:
                    flows = (_a.sent()).flows;
                    running = flows.continueIn(KEY, ACTIVE, 'codex');
                    return [4 /*yield*/, flows.continueIn(KEY, ACTIVE, 'codex')];
                case 2:
                    _a.sent();
                    move.release(moved());
                    return [4 /*yield*/, running];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(continueIn).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("Codex's time not added", function () {
    (0, vitest_1.it)('says so, for a while, when a quest comes back to Claude Code', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, workspace;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ continueIn: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, moved({ isCodexTimeLost: true })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, workspace = _a.workspace;
                    return [4 /*yield*/, flows.continueIn(KEY, ACTIVE, 'claude')];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(workspace.getState().toasts).toContainEqual(vitest_1.expect.objectContaining({ tone: 'error', text: en_1.t.flow.codexTimeLost, isLong: true }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so when a quest is finished', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({
                        finishQuest: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), logPath: 'log.md', logFailedAt: null, minutes: 14, victory: test_support_1.VICTORY, isCodexTimeLost: true } })];
                        }); }); },
                    })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.finish(KEY, ACTIVE, 'hard', null)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toContain(en_1.t.flow.codexTimeLost);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so when a quest goes back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ putBackQuest: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), went: 'back', missedCheckpoint: null, isCodexTimeLost: true } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).toContain(en_1.t.flow.codexTimeLost);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says nothing of it when the time was added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, flows, toasts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ putBackQuest: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { view: (0, test_support_1.projectView)(key), went: 'back', missedCheckpoint: null, isCodexTimeLost: false } })];
                        }); }); } })];
                case 1:
                    _a = _b.sent(), flows = _a.flows, toasts = _a.toasts;
                    return [4 /*yield*/, flows.back(KEY, ACTIVE)];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(toasts()).not.toContain(en_1.t.flow.codexTimeLost);
                    return [2 /*return*/];
            }
        });
    }); });
});
