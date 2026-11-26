"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readQuestFacts = exports.linesSince = void 0;
var card_note_1 = require("../../../../../hooks/shared/checkpoints/domain/services/card_note");
var branch_rules_1 = require("../../../../../hooks/shared/git/domain/services/branch_rules");
var time_1 = require("../../../../../hooks/shared/time/domain/services/time");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var task_input_1 = require("../domain/task_input");
var scope_1 = require("./scope");
var activity_source_1 = require("../data/activity_source");
var observation_1 = require("../../branches/data/observation");
var activity_1 = require("../../../../../hooks/shared/activity/domain/services/activity");
var SHORT_COMMIT = 7;
// Each of these is a line on a pane. Git failing here says nothing about the
// quest, so the line is left out and the rest stands.
var quietly = function (d, what, read, fallback) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, read()];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                err_1 = _a.sent();
                d.log.warn("".concat(what, " failed: ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                return [2 /*return*/, fallback];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Measured now, uncommitted work included.
var linesSince = function (d, _a, since) {
    var deps = _a.deps;
    return since === null
        ? Promise.resolve(null)
        : quietly(d, 'measuring the lines', function () { return __awaiter(void 0, void 0, void 0, function () {
            var diff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, deps.git.diffSince(since)];
                    case 1:
                        diff = _a.sent();
                        return [2 /*return*/, { added: diff.linesAdded, removed: diff.linesRemoved, since: since.slice(0, SHORT_COMMIT) }];
                }
            });
        }); }, null);
};
exports.linesSince = linesSince;
var gitOf = function (d, _a) {
    var deps = _a.deps;
    return quietly(d, 'reading git', function () { return __awaiter(void 0, void 0, void 0, function () {
        var facts;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, deps.git.facts()];
                case 1:
                    facts = _b.sent();
                    if (facts === null)
                        return [2 /*return*/, null];
                    _a = { branch: facts.branch, head: facts.head, uncommitted: facts.uncommitted };
                    return [4 /*yield*/, deps.git.state()];
                case 2: return [2 /*return*/, (_a.uncommittedCount = (_b.sent()).uncommitted, _a)];
            }
        });
    }); }, null);
};
var activeOf = function (d, scope, task) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = {
                    minutes: Object.values(task.minutesByDay).reduce(function (sum, m) { return sum + m; }, 0),
                    today: (_b = task.minutesByDay[(0, time_1.dayKey)(d.now(), d.offsetMinutes())]) !== null && _b !== void 0 ? _b : 0,
                    started: task.started,
                    understandingMessages: task.effort.understandingMessages,
                    improvingMessages: task.effort.improvingMessages,
                    filesRead: task.effort.filesRead,
                    filesChanged: task.effort.filesChanged
                };
                return [4 /*yield*/, (0, exports.linesSince)(d, scope, task.startCommit)];
            case 1:
                _a.lines = _c.sent();
                return [4 /*yield*/, gitOf(d, scope)];
            case 2: return [2 /*return*/, (_a.git = _c.sent(),
                    _a)
                // The name Start would give it. A branch that has gone counts as none, as it
                // does for Start.
            ];
        }
    });
}); };
// The name Start would give it. A branch that has gone counts as none, as it
// does for Start.
var branchToBe = function (d, _a, task) {
    var deps = _a.deps;
    return task.state !== 'queued'
        ? Promise.resolve(null)
        : quietly(d, 'naming the branch', function () { return __awaiter(void 0, void 0, void 0, function () {
            var branches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, deps.git.state()];
                    case 1:
                        if (!(_a.sent()).isRepo)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, deps.git.branches()];
                    case 2:
                        branches = _a.sent();
                        return [2 /*return*/, task.branch !== null && branches.includes(task.branch) ? null : (0, branch_rules_1.slugBranch)(task.title, branches)];
                }
            });
        }); }, null);
};
var readQuestFacts = function (d, key, taskId) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readQuestFacts, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, task, activity, observed, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, taskId)];
                case 1:
                    scope = _c.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    task = scope.record.tasks.find(function (t) { return t.id === id; });
                    if (task === undefined)
                        throw new reply_1.Refusal(messages_1.MESSAGES.badQuest);
                    return [4 /*yield*/, (0, activity_source_1.readActivity)(d.host, d.log, scope.ctx.projectPath, task)];
                case 2:
                    activity = _c.sent();
                    return [4 /*yield*/, (0, observation_1.observeTask)(d, scope.ctx.projectPath, task)];
                case 3:
                    observed = _c.sent();
                    activity.step = (0, activity_1.latestStep)(activity.step, observed.step);
                    _b = {
                        note: (0, card_note_1.cardNote)(task),
                        messages: task.messages
                    };
                    return [4 /*yield*/, branchToBe(d, scope, task)];
                case 4:
                    _b.branchToBe = _c.sent();
                    if (!(task.state === 'current')) return [3 /*break*/, 6];
                    return [4 /*yield*/, activeOf(d, scope, task)];
                case 5:
                    _a = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = null;
                    _c.label = 7;
                case 7: return [2 /*return*/, (_b.active = _a,
                        _b.activity = activity,
                        _b)];
            }
        });
    }); });
};
exports.readQuestFacts = readQuestFacts;
