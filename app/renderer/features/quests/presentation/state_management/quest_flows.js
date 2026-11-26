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
exports.questFlows = void 0;
var ranking_1 = require("../../../../../../hooks/shared/backlog/domain/services/ranking");
var engine_client_1 = require("../../../../core/api/engine_client");
var format_1 = require("../../../../core/domain/format");
var en_1 = require("../../../../l10n/en");
var edits_1 = require("../../domain/edits");
var flow_lines_1 = require("../../domain/flow_lines");
// What takes a quest out and brings it back. Each step shows its own working
// line, and that realm's quest is locked while one runs.
var questFlows = function (engine, workspace) {
    var flowOf = function (key) { return workspace.getState().flows[key]; };
    var isBusy = function (key) {
        var flow = flowOf(key);
        return (flow === null || flow === void 0 ? void 0 : flow.kind) === 'working' || ((flow === null || flow === void 0 ? void 0 : flow.kind) === 'held' && flow.isChecking);
    };
    var work = function (key, quest, line) { return workspace.setFlow(key, { kind: 'working', questId: quest.id, title: quest.title, line: line }); };
    var hold = function (key, quest, gitHold, platform) {
        return workspace.setFlow(key, { kind: 'held', questId: quest.id, title: quest.title, hold: gitHold, isChecking: false, platform: platform });
    };
    var refuse = function (key, quest, message, platform) { return workspace.setFlow(key, { kind: 'refused', questId: quest.id, title: quest.title, message: message, platform: platform }); };
    var sayHandover = function (handover, platform) {
        if (handover.kind === 'opened' && handover.terminal === 'vscode')
            workspace.say({ tone: 'info', text: platform === 'codex' ? en_1.t.flow.pasteCodex : en_1.t.flow.pasteVsCode });
    };
    var sayStarted = function (quest, outcome, platform) {
        workspace.say({ tone: 'success', text: platform === 'codex' ? en_1.t.flow.setOutCodex(quest.title, outcome.branch) : en_1.t.flow.setOut(quest.title, outcome.branch) });
        if (outcome.notice !== null)
            workspace.say({ tone: 'info', text: outcome.notice });
        sayHandover(outcome.handover, platform);
    };
    var sayTimeLost = function (isLost) {
        if (isLost)
            workspace.say({ tone: 'error', text: en_1.t.flow.codexTimeLost, isLong: true });
    };
    var start = function (key_1, quest_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([key_1, quest_1], args_1, true), void 0, function (key, quest, platform) {
            var was, check, started, _a, view, handover;
            if (platform === void 0) { platform = 'claude'; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (isBusy(key))
                            return [2 /*return*/];
                        workspace.showWon(null);
                        was = flowOf(key);
                        if ((was === null || was === void 0 ? void 0 : was.kind) === 'held' && was.questId === quest.id)
                            workspace.setFlow(key, __assign(__assign({}, was), { isChecking: true }));
                        else
                            work(key, quest, en_1.t.flow.checking);
                        return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.checkStart(key, quest.id); })];
                    case 1:
                        check = _b.sent();
                        if (!check.ok)
                            return [2 /*return*/, refuse(key, quest, check.message, platform)];
                        if (check.data.kind === 'held')
                            return [2 /*return*/, hold(key, quest, check.data.hold, platform)];
                        work(key, quest, (0, flow_lines_1.stepLine)(check.data.step));
                        return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.startQuest(key, quest.id, platform); })];
                    case 2:
                        started = _b.sent();
                        if (!started.ok)
                            return [2 /*return*/, refuse(key, quest, started.message, platform)];
                        if (started.data.kind === 'held')
                            return [2 /*return*/, hold(key, quest, started.data.hold, platform)];
                        _a = started.data, view = _a.view, handover = _a.handover;
                        workspace.adopt(key, view);
                        workspace.noteFor(quest.id, null);
                        workspace.setFlow(key, handover.kind === 'failed' ? { kind: 'openFailed', questId: quest.id, title: quest.title, platform: platform, terminal: handover.terminal, command: handover.command } : null);
                        sayStarted(quest, started.data, platform);
                        return [2 /*return*/];
                }
            });
        });
    };
    var checkAgain = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var flow, quest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flow = flowOf(key);
                    if (!((flow === null || flow === void 0 ? void 0 : flow.kind) === 'held' || (flow === null || flow === void 0 ? void 0 : flow.kind) === 'refused')) return [3 /*break*/, 2];
                    return [4 /*yield*/, start(key, { id: flow.questId, title: flow.title }, flow.platform)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    if (!((flow === null || flow === void 0 ? void 0 : flow.kind) === 'openFailed')) return [3 /*break*/, 6];
                    quest = { id: flow.questId, title: flow.title };
                    if (!(flow.platform === null)) return [3 /*break*/, 4];
                    return [4 /*yield*/, openClaude(key, quest)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, continueIn(key, quest, flow.platform)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var cancel = function (key) {
        if (!isBusy(key))
            workspace.setFlow(key, null);
    };
    var needsClaudeCommand = function (id) {
        var _a;
        var project = workspace.getState().project;
        if (project.status !== 'ready' || project.data.kind !== 'readable')
            return false;
        var quest = project.data.activeQuests.find(function (q) { return q.id === id; });
        return quest !== undefined && ((_a = quest.session) !== null && _a !== void 0 ? _a : project.data.session).state === 'none' && quest.codexSince === null;
    };
    var openClaude = function (key, quest) { return __awaiter(void 0, void 0, void 0, function () {
        var answer, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isBusy(key))
                        return [2 /*return*/];
                    work(key, quest, en_1.t.flow.opening);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.openClaude(key, quest.id); })];
                case 1:
                    answer = _a.sent();
                    workspace.setFlow(key, null);
                    if (!answer.ok) {
                        workspace.say({ tone: 'error', text: answer.message, action: { label: en_1.t.failed.tryAgain, run: function () { return void openClaude(key, quest); } } });
                        return [2 /*return*/];
                    }
                    data = answer.data;
                    if (data.kind === 'failed')
                        workspace.setFlow(key, { kind: 'openFailed', questId: quest.id, title: quest.title, platform: null, terminal: data.terminal, command: data.command });
                    else if (data.kind === 'opened' && data.terminal === 'vscode' && needsClaudeCommand(quest.id))
                        workspace.say({ tone: 'info', text: en_1.t.flow.pasteVsCode });
                    return [2 /*return*/];
            }
        });
    }); };
    // Claude Code and Codex never work on the quest at once: a refusal changes
    // nothing and says why.
    var continueIn = function (key, quest, platform) { return __awaiter(void 0, void 0, void 0, function () {
        var answer, _a, view, handover, isCodexTimeLost;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isBusy(key))
                        return [2 /*return*/];
                    work(key, quest, platform === 'codex' ? en_1.t.flow.toCodex : en_1.t.flow.toClaude);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.continueIn(key, quest.id, platform); })];
                case 1:
                    answer = _b.sent();
                    workspace.setFlow(key, null);
                    if (!answer.ok) {
                        workspace.say({ tone: 'error', text: answer.message, isLong: true, action: { label: en_1.t.failed.tryAgain, run: function () { return void continueIn(key, quest, platform); } } });
                        return [2 /*return*/];
                    }
                    _a = answer.data, view = _a.view, handover = _a.handover, isCodexTimeLost = _a.isCodexTimeLost;
                    workspace.adopt(key, view);
                    if (handover.kind === 'failed')
                        workspace.setFlow(key, { kind: 'openFailed', questId: quest.id, title: quest.title, platform: platform, terminal: handover.terminal, command: handover.command });
                    workspace.say({ tone: 'success', text: platform === 'codex' ? en_1.t.flow.nowCodex(quest.title) : en_1.t.flow.nowClaude(quest.title) });
                    sayHandover(handover, platform);
                    sayTimeLost(isCodexTimeLost);
                    return [2 /*return*/];
            }
        });
    }); };
    var sayLogFailed = function (key, questId, path) {
        return workspace.say({ tone: 'error', text: en_1.t.flow.logFailed(path), action: { label: en_1.t.failed.tryAgain, run: function () { return void retryLog(key, questId, path); } } });
    };
    var retryLog = function (key, questId, path) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.retryTaskLog(key, questId, path); })];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok || answer.data.logFailedAt !== null) {
                        sayLogFailed(key, questId, path);
                        return [2 /*return*/];
                    }
                    workspace.adopt(key, answer.data.view);
                    workspace.say({ tone: 'success', text: en_1.t.flow.logged(answer.data.logPath) });
                    return [2 /*return*/];
            }
        });
    }); };
    var finish = function (key, quest, actual, logPath) { return __awaiter(void 0, void 0, void 0, function () {
        var answer, _a, view, victory, logFailedAt, minutes, _i, _b, badge;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.finishQuest(key, quest.id, actual, logPath); })];
                case 1:
                    answer = _c.sent();
                    if (!answer.ok)
                        return [2 /*return*/, answer];
                    _a = answer.data, view = _a.view, victory = _a.victory, logFailedAt = _a.logFailedAt, minutes = _a.minutes;
                    workspace.adopt(key, view);
                    workspace.closeQuest(key);
                    if (victory === null)
                        workspace.say({ tone: 'success', text: en_1.t.flow.won(quest.title, (0, format_1.formatMinutes)(minutes), answer.data.logPath) });
                    else {
                        workspace.showWon({ victory: victory, logPath: answer.data.logPath });
                        for (_i = 0, _b = victory.newBadges; _i < _b.length; _i++) {
                            badge = _b[_i];
                            workspace.say({ tone: 'success', text: en_1.t.win.badgeToast(en_1.t.badges[badge]), isLong: true });
                        }
                    }
                    if (logFailedAt !== null)
                        sayLogFailed(key, quest.id, logFailedAt);
                    sayTimeLost(answer.data.isCodexTimeLost);
                    // The HUD fills up now rather than when the watcher hears of it.
                    void workspace.refresh();
                    return [2 /*return*/, answer];
            }
        });
    }); };
    var notYet = function (key, quest) { return workspace.run({ key: key, preview: function (view) { return (0, edits_1.withoutReview)(view, quest.id); }, call: function () { return engine.notYet(key, quest.id); } }); };
    var settled = function (key, quest, outcome, said) {
        workspace.adopt(key, outcome.view);
        if (outcome.went === 'back')
            workspace.say({ tone: 'success', text: said });
        sayTimeLost(outcome.isCodexTimeLost);
        var missed = outcome.missedCheckpoint;
        if (missed !== null)
            workspace.noteFor(quest.id, missed.lastAt === null ? en_1.t.flow.noCheckpointYet : en_1.t.flow.noCheckpoint((0, format_1.dayAndTime)(missed.lastAt)));
    };
    var goBack = function (key, quest, said, call) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    work(key, quest, en_1.t.flow.putting);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, call)];
                case 1:
                    answer = _a.sent();
                    workspace.setFlow(key, null);
                    if (answer.ok)
                        settled(key, quest, answer.data, said);
                    return [2 /*return*/, answer];
            }
        });
    }); };
    var back = function (key, quest) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isBusy(key))
                        return [2 /*return*/];
                    return [4 /*yield*/, goBack(key, quest, en_1.t.flow.backOnBoard(quest.title), function () { return engine.putBackQuest(key, quest.id, null); })];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok)
                        workspace.say({ tone: 'error', text: answer.message, action: { label: en_1.t.failed.tryAgain, run: function () { return void back(key, quest); } } });
                    return [2 /*return*/];
            }
        });
    }); };
    var backNow = function (key, quest) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isBusy(key))
                        return [2 /*return*/];
                    return [4 /*yield*/, goBack(key, quest, en_1.t.flow.backOnBoard(quest.title), function () { return engine.putBackNow(key, quest.id); })];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok)
                        workspace.say({ tone: 'error', text: answer.message, action: { label: en_1.t.failed.tryAgain, run: function () { return void backNow(key, quest); } } });
                    return [2 /*return*/];
            }
        });
    }); };
    // Its form shows a failure beside its fields, so this stays quiet about one.
    var sealActive = function (key, quest, seal) { return goBack(key, quest, en_1.t.edit.sealed(quest.title), function () { return engine.putBackQuest(key, quest.id, seal); }); };
    // Where Time I have is heading, by realm. The board only changes when main
    // answers, so steps pressed faster than that have to build on each other.
    var heading = new Map();
    var stepBudget = function (key, shown) { return __awaiter(void 0, void 0, void 0, function () {
        var budget, answer, isLatest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    budget = (0, ranking_1.nextBudget)(heading.has(key) ? heading.get(key) : shown);
                    heading.set(key, budget);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.setTimeBudget(key, budget); })];
                case 1:
                    answer = _a.sent();
                    isLatest = heading.get(key) === budget;
                    if (isLatest || !answer.ok)
                        heading.delete(key);
                    if (answer.ok)
                        workspace.adopt(key, answer.data);
                    else
                        workspace.say({ tone: 'error', text: answer.message });
                    return [2 /*return*/];
            }
        });
    }); };
    var switchBranch = function (key, branch) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.switchBranch(key); })];
                case 1:
                    answer = _a.sent();
                    workspace.say(answer.ok ? { tone: 'success', text: en_1.t.live.switched(branch) } : { tone: 'error', text: answer.message });
                    return [2 /*return*/, answer.ok];
            }
        });
    }); };
    var copy = function (text) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.copyText(text); })];
                case 1:
                    answer = _a.sent();
                    workspace.say(answer.ok ? { tone: 'info', text: en_1.t.flow.copied } : { tone: 'error', text: answer.message });
                    return [2 /*return*/];
            }
        });
    }); };
    return { start: start, checkAgain: checkAgain, cancel: cancel, openClaude: openClaude, continueIn: continueIn, finish: finish, notYet: notYet, back: back, backNow: backNow, sealActive: sealActive, copy: copy, stepBudget: stepBudget, switchBranch: switchBranch };
};
exports.questFlows = questFlows;
