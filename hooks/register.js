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
exports.register = void 0;
var session_beat_1 = require("./app/session/session_beat");
var activity_controller_1 = require("./shared/activity/presentation/state_management/activity_controller");
var session_rhythm_1 = require("./app/session/session_rhythm");
var errands_controller_1 = require("./features/errands/presentation/state_management/errands_controller");
var commit_guard_controller_1 = require("./features/commit_guard/presentation/state_management/commit_guard_controller");
var commit_guard_text_1 = require("./features/commit_guard/presentation/constants/commit_guard_text");
var git_providers_1 = require("./shared/git/git_providers");
var effort_controller_1 = require("./shared/effort/presentation/state_management/effort_controller");
var claude_ports_1 = require("./core/ports/claude_ports");
var tasks_text_1 = require("./features/tasks/presentation/constants/tasks_text");
var menu_controller_1 = require("./app/menu/menu_controller");
var tasks_controller_1 = require("./features/tasks/presentation/state_management/tasks_controller");
var filing_controller_1 = require("./features/tasks/presentation/state_management/filing_controller");
var queue_controller_1 = require("./features/tasks/presentation/state_management/queue_controller");
var menu_1 = require("./core/store/menu");
var checkpoints_1 = require("./shared/checkpoints/domain/services/checkpoints");
var errands_1 = require("./features/errands/domain/services/errands");
var check_prompt_1 = require("./features/message_check/domain/services/check_prompt");
var commit_guard_1 = require("./features/commit_guard/domain/services/commit_guard");
var live_1 = require("./core/session/live");
var logger_1 = require("./core/logger/logger");
var view_store_1 = require("./core/store/view_store");
var tea_cup_controller_1 = require("./features/tea_cup/presentation/state_management/tea_cup_controller");
var options_1 = require("./core/session/options");
var band_host_1 = require("./app/band/band_host");
var menu_frame_1 = require("./app/menu/menu_frame");
var time_1 = require("./shared/time/domain/services/time");
var allowance_1 = require("./features/conversation/domain/services/allowance");
var HELD_TEXT = 'Queue-tea: held for the band above the prompt';
var register = function (on, options) {
    live_1.live.opts = (0, options_1.readOptions)(options);
    (0, claude_ports_1.onViewChange)(tea_cup_controller_1.refreshStatus);
    on('session.start', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, session_rhythm_1.startSession)($)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('prompt.submit', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!((_d = effort_controller_1.effortState.tracker) === null || _d === void 0)) return [3 /*break*/, 1];
                    _a = void 0;
                    return [3 /*break*/, 3];
                case 1:
                    _c = (_b = _d).activity;
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    _a = _c.apply(_b, [_e.sent()]);
                    _e.label = 3;
                case 3:
                    _a;
                    if (!(e.origin.kind === 'task-notification')) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, activity_controller_1.finishNotifiedActivity)((0, claude_ports_1.portsOf)($), e.text)];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5:
                    if (!(0, check_prompt_1.shouldCheck)(e))
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, (0, session_rhythm_1.checkTyped)($, e.text)];
                case 6: return [2 /*return*/, (_e.sent()) === 'pass' ? next(e) : { drop: HELD_TEXT }];
            }
        });
    }); });
    on('prompt.compose', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var composed, section, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    composed = _b.sent();
                    _a = tasks_controller_1.taskSection;
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'record')];
                case 2:
                    section = _a.apply(void 0, [_b.sent()]);
                    return [2 /*return*/, section === null ? composed : { sections: __spreadArray(__spreadArray([], composed.sections, true), [section], false) }];
            }
        });
    }); });
    on('tool.call', { tool: 'mcp__queue-tea__task_looks_done' }, function ($, e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (((_b = errands_controller_1.errandState.errand) === null || _b === void 0 ? void 0 : _b.isRunning) === true) {
                        return [2 /*return*/, { result: tasks_text_1.ERRAND_RUNNING }];
                    }
                    _a = {};
                    return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)((0, claude_ports_1.portsOf)($), e.checked)];
                case 1: 
                // A registered tool's result is what the model reads: a string, not a record.
                return [2 /*return*/, (_a.result = _c.sent(), _a)];
            }
        });
    }); });
    on('tool.call', { tool: "mcp__queue-tea__".concat(commit_guard_text_1.PROPOSE_TOOL.name) }, function ($, e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)((0, claude_ports_1.portsOf)($), e)];
                case 1: return [2 /*return*/, (_a.result = _b.sent(), _a)];
            }
        });
    }); });
    on('tool.call', { tool: "mcp__queue-tea__".concat(tasks_text_1.PROFILE_TOOL.name) }, function ($, e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = {};
                    if (!(((_c = errands_controller_1.errandState.errand) === null || _c === void 0 ? void 0 : _c.isRunning) === true)) return [3 /*break*/, 1];
                    _a = tasks_text_1.PROFILE_TEXT.errand;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)((0, claude_ports_1.portsOf)($), e)];
                case 2:
                    _a = _d.sent();
                    _d.label = 3;
                case 3: return [2 /*return*/, (_b.result = _a, _b)];
            }
        });
    }); });
    // Each helper Claude runs, noted on the task; a /brew or /tea errand is outside it.
    on('tool.call', { tool: 'Agent' }, function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(((_a = errands_controller_1.errandState.errand) === null || _a === void 0 ? void 0 : _a.isRunning) !== true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, tasks_controller_1.noteHelperRun)((0, claude_ports_1.portsOf)($), e.subagent_type)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('tool.call', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, finish, _d, result, err_1;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!((_e = effort_controller_1.effortState.tracker) === null || _e === void 0)) return [3 /*break*/, 1];
                    _a = void 0;
                    return [3 /*break*/, 3];
                case 1:
                    _c = (_b = _e).activity;
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    _a = _c.apply(_b, [_h.sent()]);
                    _h.label = 3;
                case 3:
                    _a;
                    (_f = effort_controller_1.effortState.tracker) === null || _f === void 0 ? void 0 : _f.toolCall(String(e.tool), e);
                    if (!(((_g = errands_controller_1.errandState.errand) === null || _g === void 0 ? void 0 : _g.isRunning) === true && e.tool !== 'GetTask')) return [3 /*break*/, 4];
                    _d = null;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, (0, activity_controller_1.beginActivity)((0, claude_ports_1.portsOf)($), String(e.tool), e)];
                case 5:
                    _d = _h.sent();
                    _h.label = 6;
                case 6:
                    finish = _d;
                    _h.label = 7;
                case 7:
                    _h.trys.push([7, 10, , 12]);
                    return [4 /*yield*/, next(e)];
                case 8:
                    result = _h.sent();
                    return [4 /*yield*/, (finish === null || finish === void 0 ? void 0 : finish(result))];
                case 9:
                    _h.sent();
                    return [2 /*return*/, result];
                case 10:
                    err_1 = _h.sent();
                    return [4 /*yield*/, (finish === null || finish === void 0 ? void 0 : finish({ isError: true }))];
                case 11:
                    _h.sent();
                    throw err_1;
                case 12: return [2 /*return*/];
            }
        });
    }); });
    // Each shell command Claude ran, and whether it passed, for the checkpoint.
    on('tool.call', { tool: 'Bash' }, function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var result, out, text, isOk, _a, _b, _c, _d, _e;
        var _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, next(e)];
                case 1:
                    result = _k.sent();
                    if (!(result.deny === undefined && effort_controller_1.effortState.tracker !== null && live_1.live.ctx !== null)) return [3 /*break*/, 3];
                    out = result.result;
                    text = typeof out === 'string' ? out : "".concat((_f = out === null || out === void 0 ? void 0 : out.stdout) !== null && _f !== void 0 ? _f : '', "\n").concat((_g = out === null || out === void 0 ? void 0 : out.stderr) !== null && _g !== void 0 ? _g : '');
                    isOk = result.isError !== true && !(typeof out === 'object' && ((out === null || out === void 0 ? void 0 : out.interrupted) === true || ((_j = (_h = out === null || out === void 0 ? void 0 : out.exitCode) !== null && _h !== void 0 ? _h : out === null || out === void 0 ? void 0 : out.exit_code) !== null && _j !== void 0 ? _j : 0) !== 0));
                    if (!!(typeof out === 'object' && (out === null || out === void 0 ? void 0 : out.backgroundTaskId) !== undefined)) return [3 /*break*/, 3];
                    _b = (_a = effort_controller_1.effortState.tracker).command;
                    _c = checkpoints_1.commandRun;
                    _d = [e.command, isOk, text];
                    _e = time_1.isoLocal;
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    _b.apply(_a, [_c.apply(void 0, _d.concat([_e.apply(void 0, [_k.sent(), live_1.live.ctx.offsetMinutes])]))]);
                    _k.label = 3;
                case 3: return [2 /*return*/, result];
            }
        });
    }); });
    on('session.measure', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var allowance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowance = (0, allowance_1.readAllowance)(e.rateLimits);
                    if (!(allowance !== null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, claude_ports_1.portsOf)($).set('allowance', allowance)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // The commit a turn starts on, to name any commit that appears during it,
    // and whether the turn is an errand's.
    on('turn.start', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ((0, errands_1.isErrandTurn)(e, errands_controller_1.errandState.errand))
                        errands_controller_1.errandState.errand = __assign(__assign({}, errands_controller_1.errandState.errand), { isRunning: true });
                    if (!(e.agentId === undefined)) return [3 /*break*/, 2];
                    live_1.live.isTurnRunning = true;
                    // At once, so the app's dragon steams for a short turn too.
                    return [4 /*yield*/, (0, session_beat_1.beat)((0, claude_ports_1.portsOf)($))];
                case 1:
                    // At once, so the app's dragon steams for a short turn too.
                    _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(e.agentId === undefined && live_1.live.ctx !== null)) return [3 /*break*/, 6];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    _a = commit_guard_controller_1.commitGuardState;
                    return [4 /*yield*/, (0, git_providers_1.gitRepositoryOf)((0, claude_ports_1.portsOf)($), live_1.live.ctx).head()];
                case 4:
                    _a.turnHead = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'reading the commit at the turn start failed', err_2);
                    commit_guard_controller_1.commitGuardState.turnHead = null;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('turn.complete', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // A subagent's end is not the main conversation's turn.
                    if (e.agentId !== undefined)
                        return [2 /*return*/, next(e)];
                    return [4 /*yield*/, (0, session_rhythm_1.afterEachTurn)($)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('session.end', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, effort_controller_1.flush)((0, claude_ports_1.portsOf)($))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, session_beat_1.endBeat)((0, claude_ports_1.portsOf)($))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, next(e)];
            }
        });
    }); });
    // A /clear goes on under a new session id with the view's values started
    // over and no session.start, so the record is read again here.
    on('classic.SessionStart', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(e.source === 'clear')) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, session_rhythm_1.afterClear)((0, claude_ports_1.portsOf)($))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // A /clear Rohan types during a task saves a checkpoint first.
    on('command.run', { command: 'clear' }, function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(e.origin.kind === 'composer')) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, session_rhythm_1.saveBeforeClear)((0, claude_ports_1.portsOf)($))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'the checkpoint before the clear failed', err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, next(e)];
            }
        });
    }); });
    on('command.run', { command: 'queue-tea' }, function ($) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, menu_1.openMenu)((0, claude_ports_1.portsOf)($))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { text: tasks_text_1.MENU_OPENED }];
            }
        });
    }); });
    on('command.run', { command: 'done' }, function ($) { return __awaiter(void 0, void 0, void 0, function () {
        var isAsked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, tasks_controller_1.askDone)((0, claude_ports_1.portsOf)($))];
                case 1:
                    isAsked = _a.sent();
                    return [4 /*yield*/, (0, menu_1.openMenu)((0, claude_ports_1.portsOf)($), 'current')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { text: isAsked ? tasks_text_1.DONE_ASKED : tasks_text_1.DONE_NONE }];
            }
        });
    }); });
    on('command.run', { command: 'queue-tea-done' }, function ($) { return __awaiter(void 0, void 0, void 0, function () {
        var isAsked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, tasks_controller_1.askDone)((0, claude_ports_1.portsOf)($))];
                case 1:
                    isAsked = _a.sent();
                    return [4 /*yield*/, (0, menu_1.openMenu)((0, claude_ports_1.portsOf)($), 'current')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { text: isAsked ? tasks_text_1.DONE_ASKED : tasks_text_1.DONE_NONE }];
            }
        });
    }); });
    on('command.run', { command: 'steep' }, function ($, e) { return __awaiter(void 0, void 0, void 0, function () {
        var text;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    text = ((_a = e.args) !== null && _a !== void 0 ? _a : '').trim();
                    if (text === '')
                        return [2 /*return*/, { text: (0, tasks_text_1.STEEP_USAGE)('steep') }];
                    return [4 /*yield*/, (0, filing_controller_1.fileFromCommand)((0, claude_ports_1.portsOf)($), text)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, { text: tasks_text_1.STEEP_PICK }];
            }
        });
    }); });
    on('command.run', { command: 'queue-tea-steep' }, function ($, e) { return __awaiter(void 0, void 0, void 0, function () {
        var text;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    text = ((_a = e.args) !== null && _a !== void 0 ? _a : '').trim();
                    if (text === '')
                        return [2 /*return*/, { text: (0, tasks_text_1.STEEP_USAGE)('queue-tea-steep') }];
                    return [4 /*yield*/, (0, filing_controller_1.fileFromCommand)((0, claude_ports_1.portsOf)($), text)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, { text: tasks_text_1.STEEP_PICK }];
            }
        });
    }); });
    for (var _i = 0, _a = ['feature', 'queue-tea-feature']; _i < _a.length; _i++) {
        var command = _a[_i];
        on('command.run', { command: command }, function ($, e) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = {};
                        return [4 /*yield*/, (0, queue_controller_1.runFeature)((0, claude_ports_1.portsOf)($), (_b = e.args) !== null && _b !== void 0 ? _b : '')];
                    case 1: return [2 /*return*/, (_a.text = _c.sent(), _a)];
                }
            });
        }); });
    }
    var _loop_1 = function (name_1, kind) {
        var _loop_2 = function (command) {
            on('command.run', { command: command }, function ($, e) { var _a; return (0, session_rhythm_1.runErrand)($, kind, command, (_a = e.args) !== null && _a !== void 0 ? _a : ''); });
        };
        for (var _e = 0, _f = [name_1, "queue-tea-".concat(name_1)]; _e < _f.length; _e++) {
            var command = _f[_e];
            _loop_2(command);
        }
    };
    for (var _b = 0, _c = Object.entries(errands_1.ERRANDS); _b < _c.length; _b++) {
        var _d = _c[_b], name_1 = _d[0], kind = _d[1];
        _loop_1(name_1, kind);
    }
    on('ui.render', { component: 'Pane', requestId: menu_1.MENU }, function ($, e) { return (0, menu_frame_1.renderMenu)($, e); });
    on('ui.render', { component: 'AbovePrompt' }, function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, band_host_1.renderBand)($, e)];
            case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : next(e)];
        }
    }); }); });
    // The menu closed, by Esc, its close mark or the cup: nothing else changes.
    on('ui.close', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(e.id === menu_1.MENU)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, menu_1.menuClosed)((0, claude_ports_1.portsOf)($))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // A click on the tea cup opens or closes the menu.
    on('ui.message', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = e.data;
                    if (!(e.element === 'cup' && typeof data === 'object' && (data === null || data === void 0 ? void 0 : data.kind) === 'press')) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, menu_controller_1.toggleMenu)((0, claude_ports_1.portsOf)($))];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // The cup's surface module failed: from now on it is drawn still.
    on('ui.fault', function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(e.element === 'cup')) return [3 /*break*/, 2];
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), "the tea cup failed (".concat(e.phase, ")"), e.reason);
                    return [4 /*yield*/, (0, claude_ports_1.portsOf)($).set('isCupStill', true)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, next(e)];
            }
        });
    }); });
    // A guard: when it fails it refuses rather than lets the command through.
    // The record only picks the refusal's wording; every mode refuses.
    on('tool.call', { tool: 'Bash' }, function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(0, commit_guard_1.isCommitOrPush)(e.command)) return [3 /*break*/, 2];
                    _c = {};
                    _b = commit_guard_controller_1.guardText;
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'record')];
                case 1:
                    _a = (_c.deny = _b.apply(void 0, [_d.sent()]), _c);
                    return [3 /*break*/, 3];
                case 2:
                    _a = next(e);
                    _d.label = 3;
                case 3: return [2 /*return*/, _a];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : { deny: commit_guard_text_1.GUARD_TEXT.manual }); });
    on('tool.call', { tool: 'Monitor' }, function ($, e, next) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(e.command !== undefined && (0, commit_guard_1.isCommitOrPush)(e.command))) return [3 /*break*/, 2];
                    _c = {};
                    _b = commit_guard_controller_1.guardText;
                    return [4 /*yield*/, (0, view_store_1.getView)($, 'record')];
                case 1:
                    _a = (_c.deny = _b.apply(void 0, [_d.sent()]), _c);
                    return [3 /*break*/, 3];
                case 2:
                    _a = next(e);
                    _d.label = 3;
                case 3: return [2 /*return*/, _a];
            }
        });
    }); }).catch(function ($, e, next) { return (next.called ? next(e) : { deny: commit_guard_text_1.GUARD_TEXT.manual }); });
};
exports.register = register;
