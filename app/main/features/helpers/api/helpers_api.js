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
exports.helpersApi = void 0;
var helpers_1 = require("../../../../../hooks/shared/records/domain/services/helpers");
var queue_rules_1 = require("../../../../../hooks/shared/records/domain/services/queue_rules");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var operation_store_1 = require("../../branches/data/operation_store");
var merge_workspace_1 = require("../../branches/data/merge_workspace");
var constants_1 = require("../../branches/domain/constants");
var scope_1 = require("../../tasks/api/scope");
var helper_stream_1 = require("../domain/helper_stream");
// The Guild Hall's helpers, each one a headless Claude Code session run as that
// helper. It lives in the realm's folder, or the worktree of the quest under way,
// and the window hears every change to what it is doing.
// shortcut: jobs live in memory, so a restart forgets the last answers; save them if Rohan wants a history.
var helpersApi = function (d) {
    var jobs = new Map();
    var stops = new Map();
    var list = function () { return helpers_1.HELPER_IDS.flatMap(function (id) { var _a; return (_a = jobs.get(id)) !== null && _a !== void 0 ? _a : []; }); };
    var update = function (helper, change) {
        var job = jobs.get(helper);
        if (job === undefined)
            return;
        jobs.set(helper, __assign(__assign({}, job), change));
        d.tell(list());
    };
    var run = function (job, stop) { return __awaiter(void 0, void 0, void 0, function () {
        var agent, isMissing, last, read, ran, finished, ended, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    agent = "queue-tea:".concat(job.helper);
                    isMissing = false;
                    last = null;
                    read = (0, helper_stream_1.lineReader)(function (line) {
                        var _a, _b;
                        var seen = (0, helper_stream_1.seenIn)(line, agent);
                        if (seen === null)
                            return;
                        if (seen.kind === 'doing') {
                            var steps = ((_b = (_a = jobs.get(job.helper)) === null || _a === void 0 ? void 0 : _a.steps) !== null && _b !== void 0 ? _b : 0) + (seen.doing.kind === 'thinking' ? 0 : 1);
                            update(job.helper, { doing: seen.doing, steps: steps });
                        }
                        else if (seen.kind === 'missing') {
                            isMissing = true;
                            stop.abort();
                        }
                        else
                            last = seen;
                    });
                    d.log.debug("helper ".concat(job.helper, " starts in ").concat(job.folder));
                    return [4 /*yield*/, d.stream(d.log, { argv: ['claude', '-p', '--agent', agent, '--output-format', 'stream-json', '--verbose', '--', job.order], cwd: job.folder, signal: stop.signal, timeoutMs: helper_stream_1.HELPER_LIMITS.runMinutes * 60000, env: { PATH: (0, constants_1.checkPath)(d.home, process.env.PATH) } }, read)];
                case 1:
                    ran = _a.sent();
                    stops.delete(job.helper);
                    finished = d.now();
                    ended = last;
                    d.log.debug("helper ".concat(job.helper, " ended with exit ").concat(ran.exitCode));
                    if (isMissing)
                        return [2 /*return*/, update(job.helper, { status: 'failed', error: messages_1.MESSAGES.helperMissing, doing: null, finished: finished })];
                    if (stop.signal.aborted)
                        return [2 /*return*/, update(job.helper, { status: 'stopped', doing: null, finished: finished })];
                    if ((ended === null || ended === void 0 ? void 0 : ended.kind) === 'done')
                        return [2 /*return*/, update(job.helper, { status: 'done', reply: ended.reply, doing: null, finished: finished })];
                    d.log.warn("helper ".concat(job.helper, " failed: ").concat((ended === null || ended === void 0 ? void 0 : ended.kind) === 'failed' ? ended.detail : ran.stderr.slice(-2000)));
                    error = /ENOENT/.test(ran.stderr) ? messages_1.MESSAGES.helperNoClaude : ran.exitCode === 130 ? messages_1.MESSAGES.helperTimedOut(helper_stream_1.HELPER_LIMITS.runMinutes) : messages_1.MESSAGES.helperFailed;
                    return [2 /*return*/, update(job.helper, { status: 'failed', error: error, doing: null, finished: finished })];
            }
        });
    }); };
    var readHelpers = function () { return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readHelpers, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, list()];
    }); }); }); };
    var sendHelper = function (key, helper, input) {
        return (0, reply_1.reply)(d.log, messages_1.MESSAGES.sendHelper, function () { return __awaiter(void 0, void 0, void 0, function () {
            var order, scope, folder;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(0, helpers_1.isHelperId)(helper))
                            throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
                        order = (0, helper_stream_1.orderOf)(input);
                        if (!order.ok)
                            throw new reply_1.Refusal(order.why === 'empty' ? messages_1.MESSAGES.helperOrderEmpty : messages_1.MESSAGES.helperOrderLong(helper_stream_1.HELPER_LIMITS.orderChars));
                        return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                    case 1:
                        scope = _c.sent();
                        folder = (_b = (_a = (0, queue_rules_1.currentTask)(scope.record.tasks)) === null || _a === void 0 ? void 0 : _a.worktreePath) !== null && _b !== void 0 ? _b : scope.ctx.cwd;
                        return [2 /*return*/, start(helper, scope.key, folder, order.order, null)];
                }
            });
        }); });
    };
    // A helper dropped on a prepared merge: it runs Tea-concile in that merge's own
    // folder, which only the merge uses, and stages what it resolves for Rohan to approve.
    var concileMerge = function (key, helper, operationId) {
        return (0, reply_1.reply)(d.log, messages_1.MESSAGES.concileMerge, function () { return __awaiter(void 0, void 0, void 0, function () {
            var scope, op;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, helpers_1.isHelperId)(helper))
                            throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
                        return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                    case 1:
                        scope = _a.sent();
                        return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, operationId)];
                    case 2:
                        op = _a.sent();
                        if (op.stage !== 'conflicts')
                            throw new reply_1.Refusal(messages_1.MESSAGES.helperNoConflicts);
                        return [2 /*return*/, start(helper, scope.key, (0, merge_workspace_1.workspacePath)(d, op), messages_1.MESSAGES.concileOrder(op.source, op.target), op.id)];
                }
            });
        }); });
    };
    var start = function (helper, realm, folder, order, merge) { return __awaiter(void 0, void 0, void 0, function () {
        var job, stop;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, d.host.exists(folder)];
                case 1:
                    if (!(_b.sent()))
                        throw new reply_1.Refusal(messages_1.MESSAGES.folderGone(folder));
                    // After the last await, so two quick sends can't both pass.
                    if (((_a = jobs.get(helper)) === null || _a === void 0 ? void 0 : _a.status) === 'working')
                        throw new reply_1.Refusal(messages_1.MESSAGES.helperBusy);
                    job = { helper: helper, realm: realm, folder: folder, order: order, merge: merge, status: 'working', doing: null, steps: 0, reply: null, error: null, started: d.now(), finished: null };
                    stop = new AbortController();
                    jobs.set(helper, job);
                    stops.set(helper, stop);
                    d.tell(list());
                    run(job, stop).catch(function (err) {
                        d.log.error("helper ".concat(helper, " broke off"), err);
                        stops.delete(helper);
                        update(helper, { status: 'failed', error: messages_1.MESSAGES.helperFailed, doing: null, finished: d.now() });
                    });
                    return [2 /*return*/, job];
            }
        });
    }); };
    var stopHelper = function (helper) {
        return (0, reply_1.reply)(d.log, messages_1.MESSAGES.stopHelper, function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                if (!(0, helpers_1.isHelperId)(helper))
                    throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
                (_a = stops.get(helper)) === null || _a === void 0 ? void 0 : _a.abort();
                return [2 /*return*/, null];
            });
        }); });
    };
    var isBusy = function () { return __spreadArray([], jobs.values(), true).some(function (job) { return job.status === 'working'; }); };
    return { readHelpers: readHelpers, sendHelper: sendHelper, concileMerge: concileMerge, stopHelper: stopHelper, isBusy: isBusy };
};
exports.helpersApi = helpersApi;
