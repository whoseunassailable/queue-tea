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
exports.startSession = startSession;
exports.afterEachTurn = afterEachTurn;
exports.checkTyped = checkTyped;
exports.runErrand = runErrand;
exports.pressRestore = pressRestore;
exports.afterClear = afterClear;
exports.saveBeforeClear = saveBeforeClear;
exports.tick = tick;
var logger_1 = require("../../core/logger/logger");
var claude_ports_1 = require("../../core/ports/claude_ports");
var live_1 = require("../../core/session/live");
var commands_1 = require("../../core/session/commands");
var commit_guard_controller_1 = require("../../features/commit_guard/presentation/state_management/commit_guard_controller");
var allowance_1 = require("../../features/conversation/domain/services/allowance");
var conversation_turn_controller_1 = require("../../features/conversation/presentation/state_management/conversation_turn_controller");
var errands_1 = require("../../features/errands/domain/services/errands");
var errands_controller_1 = require("../../features/errands/presentation/state_management/errands_controller");
var message_check_controller_1 = require("../../features/message_check/presentation/state_management/message_check_controller");
var requests_controller_1 = require("../../features/tasks/presentation/state_management/requests_controller");
var tasks_controller_1 = require("../../features/tasks/presentation/state_management/tasks_controller");
var tea_cup_controller_1 = require("../../features/tea_cup/presentation/state_management/tea_cup_controller");
var conversation_controller_1 = require("../../shared/assistant/presentation/state_management/conversation_controller");
var effort_tracker_1 = require("../../shared/effort/domain/services/effort_tracker");
var effort_controller_1 = require("../../shared/effort/presentation/state_management/effort_controller");
var queue_rules_1 = require("../../shared/records/domain/services/queue_rules");
var records_controller_1 = require("../../shared/records/presentation/state_management/records_controller");
var records_providers_1 = require("../../shared/records/records_providers");
var session_rules_1 = require("../../shared/sessions/domain/services/session_rules");
var time_1 = require("../../shared/time/domain/services/time");
var commit_guard_text_1 = require("../../features/commit_guard/presentation/constants/commit_guard_text");
var tasks_text_1 = require("../../features/tasks/presentation/constants/tasks_text");
var test_profile_1 = require("../../shared/records/domain/services/test_profile");
var load_context_1 = require("./load_context");
var session_beat_1 = require("./session_beat");
// A typed /clear saves a checkpoint first only past this size: a smaller
// conversation holds little the turns haven't saved already.
var CLEAR_CHECKPOINT_TOKENS = 20000;
// How often a session looks for what the app changed.
var FOLLOW_MS = 2000;
// Registers a command, or its `queue-tea-` name when the short one is taken;
// says so in the menu.
function registerCommand($, name, description, argumentHint) {
    return __awaiter(this, void 0, void 0, function () {
        var spec, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spec = argumentHint === undefined ? { description: description } : { description: description, argumentHint: argumentHint };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 6]);
                    return [4 /*yield*/, $.command.register(__assign({ name: name }, spec))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    err_1 = _a.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), "registering /".concat(name, " failed"), err_1);
                    return [4 /*yield*/, $.command.register(__assign({ name: "queue-tea-".concat(name) }, spec))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, claude_ports_1.portsOf)($).set('notice', "/".concat(name, " was taken, so it is /queue-tea-").concat(name, " here."))];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function startSession($) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, err_2, _i, QUEUE_TEA_COMMANDS_1, command, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = live_1.live;
                    return [4 /*yield*/, (0, load_context_1.loadContext)($, live_1.live.opts)];
                case 1:
                    _a.ctx = _b.sent();
                    effort_controller_1.effortState.tracker = (0, effort_tracker_1.createTracker)(live_1.live.opts.idleGapMinutes, live_1.live.ctx.offsetMinutes);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'loading the project failed', err_2);
                    return [3 /*break*/, 3];
                case 3:
                    $.clock.every(150, function () {
                        // A frame the spinner misses is not worth a log.
                        tick((0, claude_ports_1.portsOf)($)).catch(function () { });
                    });
                    return [4 /*yield*/, (0, records_controller_1.loadRecord)((0, claude_ports_1.portsOf)($))];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: 'task_looks_done',
                            description: 'Call when your reply has finished what the current Queue-tea task asked. Rohan is then asked in the Queue-tea menu whether it is done for now.',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    checked: {
                                        type: 'string',
                                        description: 'Optional. One line on what you checked before calling, such as the tests you ran and what they showed. Shown to Rohan beside the question.',
                                    },
                                },
                            },
                            isDeferred: false,
                        })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: commit_guard_text_1.PROPOSE_TOOL.name,
                            description: commit_guard_text_1.PROPOSE_TOOL.description,
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    message: { type: 'string', description: commit_guard_text_1.PROPOSE_TOOL.message },
                                    files: { type: 'array', items: { type: 'string' }, description: commit_guard_text_1.PROPOSE_TOOL.files },
                                },
                                required: ['message', 'files'],
                            },
                            isDeferred: false,
                        })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, $.tool.register({
                            name: tasks_text_1.PROFILE_TOOL.name,
                            description: tasks_text_1.PROFILE_TOOL.description,
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    profile: { type: 'string', enum: __spreadArray([], test_profile_1.TEST_PROFILE_IDS, true), description: tasks_text_1.PROFILE_TOOL.profile },
                                    reason: { type: 'string', description: tasks_text_1.PROFILE_TOOL.reason },
                                },
                                required: ['profile', 'reason'],
                            },
                            isDeferred: false,
                        })];
                case 7:
                    _b.sent();
                    _i = 0, QUEUE_TEA_COMMANDS_1 = commands_1.QUEUE_TEA_COMMANDS;
                    _b.label = 8;
                case 8:
                    if (!(_i < QUEUE_TEA_COMMANDS_1.length)) return [3 /*break*/, 11];
                    command = QUEUE_TEA_COMMANDS_1[_i];
                    return [4 /*yield*/, registerCommand($, command.name, command.description, 'argumentHint' in command ? command.argumentHint : undefined)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11:
                    _b.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, (0, tasks_controller_1.checkResume)((0, claude_ports_1.portsOf)($))];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 13:
                    err_3 = _b.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'checking the branch at the start failed', err_3);
                    return [3 /*break*/, 14];
                case 14: return [4 /*yield*/, (0, tea_cup_controller_1.refreshStatus)((0, claude_ports_1.portsOf)($))];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, (0, session_beat_1.beat)((0, claude_ports_1.portsOf)($))];
                case 16:
                    _b.sent();
                    $.clock.every(session_rules_1.HEARTBEAT_MS, function () {
                        // beat logs its own failures.
                        void (0, session_beat_1.beat)((0, claude_ports_1.portsOf)($));
                    });
                    $.clock.every(FOLLOW_MS, function () {
                        var ctx = live_1.live.ctx;
                        if (ctx === null)
                            return;
                        (0, requests_controller_1.followRecord)((0, claude_ports_1.portsOf)($), ctx).catch(function (err) { return (0, logger_1.debug)((0, claude_ports_1.portsOf)($), "following the app's changes failed", err); });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function afterEachTurn($) {
    return __awaiter(this, void 0, void 0, function () {
        var wasErrand, _a, _b, _c, err_4, err_5, err_6, usage, allowance, _d, err_7;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    wasErrand = ((_e = errands_controller_1.errandState.errand) === null || _e === void 0 ? void 0 : _e.isRunning) === true;
                    if (wasErrand)
                        errands_controller_1.errandState.errand = null;
                    live_1.live.isTurnRunning = false;
                    if (!((_f = effort_controller_1.effortState.tracker) === null || _f === void 0)) return [3 /*break*/, 1];
                    _a = void 0;
                    return [3 /*break*/, 3];
                case 1:
                    _c = (_b = _f).activity;
                    return [4 /*yield*/, $.clock.now()];
                case 2:
                    _a = _c.apply(_b, [_g.sent()]);
                    _g.label = 3;
                case 3:
                    _a;
                    return [4 /*yield*/, (0, effort_controller_1.flush)((0, claude_ports_1.portsOf)($))];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, (0, session_beat_1.beat)((0, claude_ports_1.portsOf)($))];
                case 5:
                    _g.sent();
                    if (live_1.live.ctx === null)
                        return [2 /*return*/];
                    _g.label = 6;
                case 6:
                    _g.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, commit_guard_controller_1.commitWarning)((0, claude_ports_1.portsOf)($), live_1.live.ctx, commit_guard_controller_1.commitGuardState.turnHead)];
                case 7:
                    _g.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_4 = _g.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'looking for new commits failed', err_4);
                    return [3 /*break*/, 9];
                case 9:
                    commit_guard_controller_1.commitGuardState.turnHead = null;
                    _g.label = 10;
                case 10:
                    _g.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, (0, tasks_controller_1.refreshDrift)((0, claude_ports_1.portsOf)($), live_1.live.ctx)];
                case 11:
                    _g.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_5 = _g.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'reading the drift failed', err_5);
                    return [3 /*break*/, 13];
                case 13:
                    _g.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, (0, tasks_controller_1.refreshLines)((0, claude_ports_1.portsOf)($), live_1.live.ctx)];
                case 14:
                    _g.sent();
                    return [3 /*break*/, 16];
                case 15:
                    err_6 = _g.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'measuring the change failed', err_6);
                    return [3 /*break*/, 16];
                case 16:
                    _g.trys.push([16, 19, , 20]);
                    return [4 /*yield*/, $.session.usage()];
                case 17:
                    usage = _g.sent();
                    allowance = (0, allowance_1.readAllowance)(usage.rateLimits);
                    // An errand's answer stays on screen: a fresh conversation past the size
                    // waits for the next turn. The note at the allowance mark does not.
                    _d = conversation_turn_controller_1.conversationState;
                    return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)((0, claude_ports_1.portsOf)($), live_1.live.ctx, { tokens: wasErrand ? undefined : usage.context.tokens, allowance: allowance }, conversation_turn_controller_1.conversationState.handedOffFor)];
                case 18:
                    // An errand's answer stays on screen: a fresh conversation past the size
                    // waits for the next turn. The note at the allowance mark does not.
                    _d.handedOffFor = _g.sent();
                    return [3 /*break*/, 20];
                case 19:
                    err_7 = _g.sent();
                    (0, logger_1.debug)((0, claude_ports_1.portsOf)($), 'the usage check failed', err_7);
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/];
            }
        });
    });
}
function checkTyped($, text) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, p, _a, verdict, intent, kind;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    ctx = live_1.live.ctx;
                    if (ctx === null)
                        return [2 /*return*/, 'pass'];
                    p = (0, claude_ports_1.portsOf)($);
                    return [4 /*yield*/, p.set('canContinue', false)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, message_check_controller_1.onMessage)(p, ctx, text)
                        // A held message counts once it is sent on from the band.
                    ];
                case 2:
                    _a = _d.sent(), verdict = _a.verdict, intent = _a.intent, kind = _a.kind;
                    // A held message counts once it is sent on from the band.
                    if (verdict === 'pass') {
                        (_b = effort_controller_1.effortState.tracker) === null || _b === void 0 ? void 0 : _b.route(kind === 'quick' ? 'project' : 'task');
                        if (intent !== null && kind !== 'quick')
                            (_c = effort_controller_1.effortState.tracker) === null || _c === void 0 ? void 0 : _c.intent(intent);
                    }
                    return [2 /*return*/, verdict];
            }
        });
    });
}
// /brew, /instant and /tea: the errand's note goes in the command's context,
// and the words go to Claude as Rohan's own once the command is done. Words
// that start with / are not sent; they go back in the prompt box once the
// command is done with it.
function runErrand($, kind, command, args) {
    return __awaiter(this, void 0, void 0, function () {
        var text, note;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    text = args.trim();
                    if (text === '')
                        return [2 /*return*/, { text: (0, errands_1.errandUsage)(command, kind) }];
                    if ((0, errands_1.startsAsCommand)(text)) {
                        (0, claude_ports_1.portsOf)($).later(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, errands_controller_1.giveBack)((0, claude_ports_1.portsOf)($), command, text)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, { text: errands_1.ERRAND_NOT_SENT }];
                    }
                    return [4 /*yield*/, (0, errands_controller_1.errandFor)((0, claude_ports_1.portsOf)($), kind, text)];
                case 1:
                    note = _a.sent();
                    (0, errands_controller_1.sendErrand)((0, claude_ports_1.portsOf)($), text, command);
                    return [2 /*return*/, { text: (0, errands_1.errandReply)(kind), context: [note] }];
            }
        });
    });
}
// Puts the record's last good copy in place of the one that can't be read,
// keeping the broken file beside it, then reads it as at a session's start.
function pressRestore(p) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, stamp, _a, restored, err_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ctx = live_1.live.ctx;
                    if (ctx === null)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    _a = time_1.isoLocal;
                    return [4 /*yield*/, p.now()];
                case 2:
                    stamp = _a.apply(void 0, [_b.sent(), ctx.offsetMinutes]).slice(0, 19).replace(/:/g, '-');
                    return [4 /*yield*/, (0, records_providers_1.recordsRepositoryOf)(p, ctx).restore(stamp)];
                case 3:
                    restored = _b.sent();
                    if (typeof restored === 'object') {
                        p.toast("Queue-tea: back to the last good copy. The broken record is kept as ".concat(restored.keptAt.split('/').pop()));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_8 = _b.sent();
                    (0, logger_1.debug)(p, 'restoring the record failed', err_8);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, (0, records_controller_1.loadRecord)(p)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, p.get('load')];
                case 7:
                    if (!((_b.sent()) === 'ready')) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, tasks_controller_1.checkResume)(p)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
// After a /clear: the record again, and Continue when the clear wasn't one
// Queue-tea made to start a conversation of its own.
function afterClear(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, records_controller_1.loadRecord)(p)];
                case 1:
                    _a.sent();
                    if (!!(0, conversation_controller_1.isStartingFresh)()) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, tasks_controller_1.checkResume)(p)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, (0, session_beat_1.beat)(p)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Before a /clear Rohan types during a task: a checkpoint, so the clear loses
// nothing. The clear goes ahead whatever happens.
function saveBeforeClear(p) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, record, current, tokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx = live_1.live.ctx;
                    return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _a.sent();
                    current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, ctx);
                    if (ctx === null || current === null || (0, conversation_controller_1.isStartingFresh)())
                        return [2 /*return*/];
                    return [4 /*yield*/, p.session.usage()];
                case 2:
                    tokens = (_a.sent()).context.tokens;
                    if (tokens === undefined || tokens < CLEAR_CHECKPOINT_TOKENS)
                        return [2 /*return*/];
                    return [4 /*yield*/, p.set('busy', 'Saving a checkpoint before the clear…')];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, , 7, 9]);
                    return [4 /*yield*/, (0, effort_controller_1.flush)(p)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, conversation_controller_1.writeHandoff)(p, ctx, current.id)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, p.set('busy', null)];
                case 8:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function tick(p) {
    return __awaiter(this, void 0, void 0, function () {
        var isWaiting, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, p.get('load')];
                case 1:
                    _b = (_f.sent()) === 'loading';
                    if (_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, p.get('isChecking')];
                case 2:
                    _b = (_f.sent());
                    _f.label = 3;
                case 3:
                    _a = _b;
                    if (_a) return [3 /*break*/, 5];
                    return [4 /*yield*/, p.get('busy')];
                case 4:
                    _a = (_f.sent()) !== null;
                    _f.label = 5;
                case 5:
                    isWaiting = _a;
                    if (!isWaiting) return [3 /*break*/, 8];
                    _d = (_c = p).set;
                    _e = ['spin'];
                    return [4 /*yield*/, p.get('spin')];
                case 6: return [4 /*yield*/, _d.apply(_c, _e.concat([(_f.sent()) + 1]))];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
