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
exports.refreshLines = exports.refreshDrift = exports.putBack = exports.switchToTask = exports.continueTask = exports.finishDocs = exports.finishTask = exports.noteHelperRun = exports.setTestProfile = exports.taskLooksDone = exports.startTask = exports.taskSection = void 0;
exports.checkResume = checkResume;
exports.askDone = askDone;
exports.pressStart = pressStart;
exports.pressStartFromBacklog = pressStartFromBacklog;
exports.pressStartNext = pressStartNext;
exports.pressBackToQueue = pressBackToQueue;
exports.pressCheckAgain = pressCheckAgain;
exports.pressContinue = pressContinue;
exports.pressSwitch = pressSwitch;
exports.pressDoneYes = pressDoneYes;
exports.pressDoneNotYet = pressDoneNotYet;
exports.saveDifficulty = saveDifficulty;
exports.saveDocsPath = saveDocsPath;
var logger_1 = require("../../../../core/logger/logger");
var live_1 = require("../../../../core/session/live");
var once_1 = require("../../../../core/session/once");
var band_queue_1 = require("../../../../core/store/band_queue");
var conversation_controller_1 = require("../../../../shared/assistant/presentation/state_management/conversation_controller");
var ranking_1 = require("../../../../shared/backlog/domain/services/ranking");
var effort_controller_1 = require("../../../../shared/effort/presentation/state_management/effort_controller");
var git_providers_1 = require("../../../../shared/git/git_providers");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var time_1 = require("../../../../shared/time/domain/services/time");
var records_controller_1 = require("../../../../shared/records/presentation/state_management/records_controller");
var helpers_1 = require("../../../../shared/records/domain/services/helpers");
var task_rules_1 = require("../../domain/services/task_rules");
var helpers_run_1 = require("../../domain/usecases/helpers_run");
var finish_task_1 = require("../../domain/usecases/finish_task");
var leave_codex_1 = require("../../domain/usecases/leave_codex");
var put_back_1 = require("../../domain/usecases/put_back");
var save_docs_path_1 = require("../../domain/usecases/save_docs_path");
var set_review_1 = require("../../domain/usecases/set_review");
var set_test_profile_1 = require("../../domain/usecases/set_test_profile");
var test_profile_1 = require("../../../../shared/records/domain/services/test_profile");
var start_task_1 = require("../../domain/usecases/start_task");
var switch_to_task_1 = require("../../domain/usecases/switch_to_task");
var take_request_1 = require("../../domain/usecases/take_request");
var tasks_providers_1 = require("../../tasks_providers");
var tasks_text_1 = require("../constants/tasks_text");
var hold_1 = require("./hold");
var git_mode_1 = require("../../../../shared/records/domain/services/git_mode");
var DOCS_LOG = 'docs/task_log.md';
var taskSection = function (record) {
    var current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
    if (record === null || current === null)
        return null;
    return {
        id: 'queue-tea:task',
        scope: 'session',
        text: __spreadArray(__spreadArray([
            (0, tasks_text_1.TASK_LINE)(current.title, (0, git_mode_1.gitModeOf)(record))
        ], tasks_text_1.HELPER_LINES.filter(function (_a) {
            var id = _a[0];
            return current.helpers.on.includes(id);
        }).map(function (_a) {
            var line = _a[1];
            return line;
        }), true), (current.testProfile === undefined ? [] : [(0, tasks_text_1.PROFILE_LINE)(current.testProfile)]), true).join('\n'),
    };
};
exports.taskSection = taskSection;
// The git check, the branch, then a fresh conversation for the task.
var startTask = function (p, ctx, taskId) {
    return (0, once_1.once)("start:".concat(taskId), function () { return startOnce(p, ctx, taskId); }, 'failed');
};
exports.startTask = startTask;
var startOnce = function (p, ctx, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, start_task_1.startTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), ctx, taskId)];
            case 1:
                result = _a.sent();
                if (!(result.kind === 'unreadable')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, records_controller_1.markUnreadable)(p, ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/, 'failed'];
            case 3:
                if (!(result.kind === 'gone')) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, hold_1.clearHold)(p, taskId)];
            case 4:
                _a.sent();
                return [2 /*return*/, 'failed'];
            case 5:
                if (!(result.kind === 'blocked')) return [3 /*break*/, 7];
                return [4 /*yield*/, p.set('notice', result.notice)];
            case 6:
                _a.sent();
                return [2 /*return*/, 'failed'];
            case 7:
                if (!(result.kind === 'held')) return [3 /*break*/, 9];
                return [4 /*yield*/, p.set('hold', { taskId: taskId, text: result.text })];
            case 8:
                _a.sent();
                return [2 /*return*/, 'held'];
            case 9:
                if (!(result.kind === 'refused')) return [3 /*break*/, 13];
                return [4 /*yield*/, p.set('record', result.record)];
            case 10:
                _a.sent();
                return [4 /*yield*/, (0, hold_1.clearHold)(p, taskId)];
            case 11:
                _a.sent();
                return [4 /*yield*/, p.set('notice', result.notice)];
            case 12:
                _a.sent();
                return [2 /*return*/, 'failed'];
            case 13:
                if (!(result.notice !== null)) return [3 /*break*/, 15];
                return [4 /*yield*/, p.set('notice', result.notice)];
            case 14:
                _a.sent();
                _a.label = 15;
            case 15:
                if (!(result.kind === 'branch_failed')) return [3 /*break*/, 18];
                return [4 /*yield*/, (0, records_controller_1.applySaved)(p, ctx, result.record)];
            case 16:
                _a.sent();
                return [4 /*yield*/, p.set('hold', { taskId: taskId, text: result.text })];
            case 17:
                _a.sent();
                return [2 /*return*/, 'held'];
            case 18: return [4 /*yield*/, p.set('record', result.record)];
            case 19:
                _a.sent();
                return [4 /*yield*/, p.set('hold', null)];
            case 20:
                _a.sent();
                return [4 /*yield*/, p.set('isChoosingNext', false)];
            case 21:
                _a.sent();
                return [4 /*yield*/, p.set('openRow', null)];
            case 22:
                _a.sent();
                return [4 /*yield*/, p.set('drift', [])];
            case 23:
                _a.sent();
                (0, conversation_controller_1.scheduleFresh)(p, ctx, result.task);
                return [2 /*return*/, 'started'];
        }
    });
}); };
// The done question, with what Claude says it checked when it says. A helper
// that is on and has not run is reminded once; after that Rohan is asked.
var taskLooksDone = function (p, checked) { return __awaiter(void 0, void 0, void 0, function () {
    var record, current, helper, line, name_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _b.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                helper = current === null ? null : (0, task_rules_1.helperToRemind)(current);
                line = typeof checked === 'string' ? checked.trim().slice(0, 300) : '';
                if (!(current !== null && helper !== null)) return [3 /*break*/, 4];
                name_1 = tasks_text_1.HELPER_NAMES[helper];
                _a = !current.helpers.reminded;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, markReminded(p, current.id)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                if (_a)
                    return [2 /*return*/, (0, tasks_text_1.REMIND)(name_1)];
                line = "".concat(line, " ").concat((0, tasks_text_1.DIDNT_RUN)(name_1)).trim();
                _b.label = 4;
            case 4: return [4 /*yield*/, p.set('checked', line === '' ? null : line)];
            case 5:
                _b.sent();
                return [4 /*yield*/, p.set('isAskingDone', true)];
            case 6:
                _b.sent();
                return [4 /*yield*/, saveReview(p, { at: 'now', checked: line === '' ? null : line })];
            case 7:
                _b.sent();
                return [2 /*return*/, tasks_text_1.ASKED];
        }
    });
}); };
exports.taskLooksDone = taskLooksDone;
// The set_test_profile tool: saves Tea-DD's pick on the current task for the
// brief and the quest pane. Returns what Claude reads; it never throws.
var setTestProfile = function (p, input) { return __awaiter(void 0, void 0, void 0, function () {
    var ctx, record, current, pick, set, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx = live_1.live.ctx;
                return [4 /*yield*/, p.get('record')];
            case 1:
                record = _a.sent();
                current = record === null || ctx === null ? null : (0, queue_rules_1.currentTask)(record.tasks, ctx);
                if (ctx === null || current === null)
                    return [2 /*return*/, tasks_text_1.PROFILE_TEXT.noTask];
                pick = (0, test_profile_1.checkTestPick)(input);
                if (typeof pick === 'string')
                    return [2 /*return*/, tasks_text_1.PROFILE_TEXT.problems[pick]];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 6]);
                return [4 /*yield*/, (0, set_test_profile_1.setTestProfileUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), ctx, current.id, pick)];
            case 3:
                set = _a.sent();
                if (set.kind === 'rohans')
                    return [2 /*return*/, tasks_text_1.PROFILE_TEXT.rohans(set.id)];
                if (set.kind !== 'saved')
                    return [2 /*return*/, tasks_text_1.PROFILE_TEXT[set.kind]];
                return [4 /*yield*/, (0, records_controller_1.applySaved)(p, ctx, set.record)];
            case 4:
                _a.sent();
                return [2 /*return*/, tasks_text_1.PROFILE_TEXT.saved(pick.id)];
            case 5:
                err_1 = _a.sent();
                (0, logger_1.debug)(p, 'saving the test profile failed', err_1);
                return [2 /*return*/, tasks_text_1.PROFILE_TEXT.failed];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.setTestProfile = setTestProfile;
// True when the mark is saved; a failed write is logged and Rohan is asked instead.
var markReminded = function (p, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var ctx, _a, _b, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                ctx = live_1.live.ctx;
                if (ctx === null)
                    return [2 /*return*/, false];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                _a = records_controller_1.applySaved;
                _b = [p, ctx];
                return [4 /*yield*/, (0, helpers_run_1.markRemindedUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), taskId)];
            case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            case 3: 
            // An unreadable record comes back as null: nothing was saved.
            return [2 /*return*/, (_c.sent()) !== null];
            case 4:
                err_2 = _c.sent();
                (0, logger_1.debug)(p, 'saving the helper reminder mark failed', err_2);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Notes a helper the Agent tool ran, for the current task.
var noteHelperRun = function (p, agent) { return __awaiter(void 0, void 0, void 0, function () {
    var id, ctx, record, current, _a, _b, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = typeof agent === 'string' && agent.startsWith('queue-tea:') ? agent.slice('queue-tea:'.length) : null;
                ctx = live_1.live.ctx;
                if (!(0, helpers_1.isHelperId)(id) || ctx === null)
                    return [2 /*return*/];
                return [4 /*yield*/, p.get('record')];
            case 1:
                record = _c.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                if (current === null)
                    return [2 /*return*/];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 5, , 6]);
                _a = records_controller_1.applySaved;
                _b = [p, ctx];
                return [4 /*yield*/, (0, helpers_run_1.noteHelperUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), current.id, id)];
            case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            case 4:
                _c.sent();
                return [3 /*break*/, 6];
            case 5:
                err_3 = _c.sent();
                (0, logger_1.debug)(p, 'noting the helper run failed', err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.noteHelperRun = noteHelperRun;
// What the app reads to show Review. The terminal's question stands either
// way, so a failed write is logged and nothing else changes.
var saveReview = function (p, review) { return __awaiter(void 0, void 0, void 0, function () {
    var ctx, record, current, stamped, _a, _b, _c, _d, err_4;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                ctx = live_1.live.ctx;
                return [4 /*yield*/, p.get('record')];
            case 1:
                record = _f.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                if (ctx === null || current === null)
                    return [2 /*return*/];
                _f.label = 2;
            case 2:
                _f.trys.push([2, 8, , 9]);
                if (!(review === null)) return [3 /*break*/, 3];
                _a = null;
                return [3 /*break*/, 5];
            case 3:
                _e = {};
                _b = time_1.isoLocal;
                return [4 /*yield*/, p.now()];
            case 4:
                _a = (_e.at = _b.apply(void 0, [_f.sent(), ctx.offsetMinutes]), _e.checked = review.checked, _e);
                _f.label = 5;
            case 5:
                stamped = _a;
                _c = records_controller_1.applySaved;
                _d = [p, ctx];
                return [4 /*yield*/, (0, set_review_1.setReviewUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), current.id, stamped)];
            case 6: return [4 /*yield*/, _c.apply(void 0, _d.concat([_f.sent()]))];
            case 7:
                _f.sent();
                return [3 /*break*/, 9];
            case 8:
                err_4 = _f.sent();
                (0, logger_1.debug)(p, 'saving the review mark failed', err_4);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
var sayLogFailed = function (p, path) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(path !== null)) return [3 /*break*/, 2];
                return [4 /*yield*/, p.set('notice', "Couldn't write the task log at ".concat(path))];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
// Finishes the task, asking for the docs log's path the first time.
var finishTask = function (p, ctx, taskId, actual) {
    return (0, once_1.once)("finish:".concat(taskId), function () { return finishOnce(p, ctx, taskId, actual); }, undefined);
};
exports.finishTask = finishTask;
var finishOnce = function (p, ctx, taskId, actual) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, finish_task_1.finishTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), ctx, taskId, actual)];
            case 1:
                result = _a.sent();
                if (!(result.kind === 'unreadable')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, records_controller_1.markUnreadable)(p, ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                if (result.kind === 'skipped')
                    return [2 /*return*/];
                return [4 /*yield*/, p.set('record', result.record)];
            case 4:
                _a.sent();
                return [4 /*yield*/, p.set('isAskingDone', false)];
            case 5:
                _a.sent();
                return [4 /*yield*/, p.set('checked', null)];
            case 6:
                _a.sent();
                if (!result.isCodexTimeLost) return [3 /*break*/, 8];
                return [4 /*yield*/, p.set('notice', tasks_text_1.CODEX_TIME_LOST)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!result.askPath) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, band_queue_1.showBand)(p, { kind: 'docsPath', taskId: taskId, suggested: DOCS_LOG })];
            case 9:
                _a.sent();
                return [2 /*return*/];
            case 10: return [4 /*yield*/, sayLogFailed(p, result.logFailedAt)];
            case 11:
                _a.sent();
                return [4 /*yield*/, p.set('isChoosingNext', true)];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var finishDocs = function (p, ctx, taskId, path) {
    return (0, once_1.once)("docs:".concat(taskId), function () { return docsOnce(p, ctx, taskId, path); }, undefined);
};
exports.finishDocs = finishDocs;
var docsOnce = function (p, ctx, taskId, path) { return __awaiter(void 0, void 0, void 0, function () {
    var band, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('band')];
            case 1:
                band = _a.sent();
                if (band.kind !== 'docsPath' || band.taskId !== taskId)
                    return [2 /*return*/];
                return [4 /*yield*/, (0, save_docs_path_1.saveDocsPathUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), ctx, taskId, path)];
            case 2:
                result = _a.sent();
                if (!(result.kind === 'unreadable')) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, records_controller_1.markUnreadable)(p, ctx)];
            case 3:
                _a.sent();
                return [2 /*return*/];
            case 4: return [4 /*yield*/, p.set('record', result.record)];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, band_queue_1.closeBand)(p)];
            case 6:
                _a.sent();
                return [4 /*yield*/, sayLogFailed(p, result.logFailedAt)];
            case 7:
                _a.sent();
                return [4 /*yield*/, p.set('isChoosingNext', true)];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var continueTask = function (p, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var record, current, deps, _a, _b, pending;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _c.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                if (current === null || (0, conversation_controller_1.isStartingFresh)())
                    return [2 /*return*/];
                if (!(current.codexSince !== null)) return [3 /*break*/, 7];
                deps = (0, tasks_providers_1.tasksDepsOf)(p, ctx);
                return [4 /*yield*/, (0, leave_codex_1.leaveCodexUseCase)(deps, ctx, current.id)];
            case 2:
                if (!_c.sent()) return [3 /*break*/, 4];
                return [4 /*yield*/, p.set('notice', tasks_text_1.CODEX_TIME_LOST)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _a = records_controller_1.applySaved;
                _b = [p, ctx];
                return [4 /*yield*/, deps.records.read()];
            case 5: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            case 6:
                if ((_c.sent()) === null)
                    return [2 /*return*/];
                _c.label = 7;
            case 7:
                pending = record === null || record === void 0 ? void 0 : record.requests.find(function (q) { return q.kind === 'begin' && q.taskId === current.id; });
                if (!(pending !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, take_request_1.takeRequestUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), pending.id)];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9:
                (0, conversation_controller_1.scheduleFresh)(p, ctx, current);
                return [2 /*return*/];
        }
    });
}); };
exports.continueTask = continueTask;
// Switches to the current task's branch, unless something is uncommitted.
var switchToTask = function (p, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var record, current, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _a.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                if ((current === null || current === void 0 ? void 0 : current.branch) == null)
                    return [2 /*return*/, 'switched'];
                return [4 /*yield*/, (0, switch_to_task_1.switchToTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), current.branch)];
            case 2:
                result = _a.sent();
                if (result.kind === 'uncommitted')
                    return [2 /*return*/, result.text];
                return [4 /*yield*/, p.set('notice', null)];
            case 3:
                _a.sent();
                return [2 /*return*/, 'switched'];
        }
    });
}); };
exports.switchToTask = switchToTask;
// Puts the current task back in the backlog with a checkpoint. With `block`,
// it goes back blocked.
var putBack = function (p, ctx, block) {
    return (0, once_1.once)('put-back', function () { return putBackOnce(p, ctx, block); }, 'none');
};
exports.putBack = putBack;
var putBackOnce = function (p, ctx, block) { return __awaiter(void 0, void 0, void 0, function () {
    var record, current, isNoted, _a, err_5, back, saved;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _b.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                if (current === null || (0, conversation_controller_1.isStartingFresh)())
                    return [2 /*return*/, 'none'];
                return [4 /*yield*/, p.set('busy', tasks_text_1.SAVING_CHECKPOINT)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 6, 7, 9]);
                _a = current.codexSince !== null;
                if (_a) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, conversation_controller_1.writeHandoff)(p, ctx, current.id)];
            case 4:
                _a = (_b.sent()) !== null;
                _b.label = 5;
            case 5:
                // Claude Code has nothing to note for a task Codex was working on.
                isNoted = _a;
                return [3 /*break*/, 9];
            case 6:
                err_5 = _b.sent();
                p.log("the handoff note failed: ".concat(err_5 instanceof Error ? err_5.message : String(err_5)));
                isNoted = false;
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, p.set('busy', null)];
            case 8:
                _b.sent();
                return [7 /*endfinally*/];
            case 9: return [4 /*yield*/, (0, put_back_1.putBackUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), ctx, current.id, block)];
            case 10:
                back = _b.sent();
                return [4 /*yield*/, (0, records_controller_1.applySaved)(p, ctx, back.saved)];
            case 11:
                saved = _b.sent();
                if (saved === null)
                    return [2 /*return*/, 'none'];
                return [4 /*yield*/, p.set('isAskingDone', false)];
            case 12:
                _b.sent();
                return [4 /*yield*/, p.set('checked', null)];
            case 13:
                _b.sent();
                return [4 /*yield*/, p.set('canContinue', false)];
            case 14:
                _b.sent();
                return [4 /*yield*/, p.set('mismatch', null)];
            case 15:
                _b.sent();
                return [4 /*yield*/, p.set('isChoosingNext', true)];
            case 16:
                _b.sent();
                return [4 /*yield*/, p.set('drift', [])];
            case 17:
                _b.sent();
                if (!!isNoted) return [3 /*break*/, 19];
                return [4 /*yield*/, p.set('notice', tasks_text_1.CHECKPOINT_FAILED)];
            case 18:
                _b.sent();
                _b.label = 19;
            case 19:
                if (!back.isCodexTimeLost) return [3 /*break*/, 21];
                return [4 /*yield*/, p.set('notice', tasks_text_1.CODEX_TIME_LOST)];
            case 20:
                _b.sent();
                _b.label = 21;
            case 21:
                p.toast(block === undefined ? (0, tasks_text_1.BACK_IN_BACKLOG)(current.title) : (0, tasks_text_1.BLOCKED)(current.title));
                return [2 /*return*/, 'queued'];
        }
    });
}); };
// What has moved under the current task, for the panel.
var refreshDrift = function (p, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var record, current, _a, _b, _c, err_6;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _d.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                if (!(current === null)) return [3 /*break*/, 3];
                return [4 /*yield*/, p.set('drift', [])];
            case 2:
                _d.sent();
                return [2 /*return*/];
            case 3:
                _d.trys.push([3, 6, , 7]);
                _b = (_a = p).set;
                _c = ['drift'];
                return [4 /*yield*/, (0, git_providers_1.gitRepositoryOf)(p, ctx).drift(current)];
            case 4: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 5:
                _d.sent();
                return [3 /*break*/, 7];
            case 6:
                err_6 = _d.sent();
                p.log("reading the drift failed: ".concat(err_6 instanceof Error ? err_6.message : String(err_6)));
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.refreshDrift = refreshDrift;
// The current task's lines so far, for the panel: what finishing it would
// measure now. Marked with the task, so another task's count never shows.
var refreshLines = function (p, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var record, current, diff, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _a.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                if (!(current === null || current.startCommit === null)) return [3 /*break*/, 3];
                return [4 /*yield*/, p.set('lines', null)];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, (0, git_providers_1.gitRepositoryOf)(p, ctx).diffSince(current.startCommit)];
            case 4:
                diff = _a.sent();
                return [4 /*yield*/, p.set('lines', { taskId: current.id, added: diff.linesAdded, removed: diff.linesRemoved })];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_7 = _a.sent();
                p.log("measuring the change failed: ".concat(err_7 instanceof Error ? err_7.message : String(err_7)));
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.refreshLines = refreshLines;
// At a session's start with a current task: offer Continue, and Switch when
// another branch is checked out.
function checkResume(p) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, record, current, git;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ctx = live_1.live.ctx;
                    return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _a.sent();
                    current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                    if (ctx === null || current === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, p.set('canContinue', true)];
                case 2:
                    _a.sent();
                    if (current.branch === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, git_providers_1.gitRepositoryOf)(p, ctx).state()];
                case 3:
                    git = _a.sent();
                    if (!(git.isRepo && git.branch !== current.branch)) return [3 /*break*/, 5];
                    return [4 /*yield*/, p.set('mismatch', (0, tasks_text_1.WRONG_BRANCH)(git.branch, current.branch))];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, (0, exports.refreshDrift)(p, ctx)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.refreshLines)(p, ctx)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function askDone(p) {
    return __awaiter(this, void 0, void 0, function () {
        var record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _a.sent();
                    if (record === null || (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx) === null)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, p.set('isAskingDone', true)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
function pressStart(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(live_1.live.ctx !== null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, exports.startTask)(p, live_1.live.ctx, taskId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Start from the backlog, then show the task where its hold or branch shows.
function pressStartFromBacklog(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pressStart(p, taskId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, p.set('menuView', 'current')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Starts the task marked ★.
function pressStartNext(p) {
    return __awaiter(this, void 0, void 0, function () {
        var record, next, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _d.sent();
                    if (!(record === null)) return [3 /*break*/, 2];
                    _a = null;
                    return [3 /*break*/, 4];
                case 2:
                    _b = ranking_1.suggest;
                    _c = [record];
                    return [4 /*yield*/, p.get('budget')];
                case 3:
                    _a = _b.apply(void 0, _c.concat([_d.sent()]));
                    _d.label = 4;
                case 4:
                    next = _a;
                    if (!(next !== null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, pressStart(p, next.id)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Puts the current task back in Up next, its time so far written first.
function pressBackToQueue(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (live_1.live.ctx === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, effort_controller_1.flush)(p)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.putBack)(p, live_1.live.ctx)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressCheckAgain(p) {
    return __awaiter(this, void 0, void 0, function () {
        var hold;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('hold')];
                case 1:
                    hold = _a.sent();
                    if (!(hold !== null && live_1.live.ctx !== null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, exports.startTask)(p, live_1.live.ctx, hold.taskId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function pressContinue(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('canContinue', false)];
                case 1:
                    _a.sent();
                    if (!(live_1.live.ctx !== null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, exports.continueTask)(p, live_1.live.ctx)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function pressSwitch(p) {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (live_1.live.ctx === null)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 9]);
                    return [4 /*yield*/, (0, exports.switchToTask)(p, live_1.live.ctx)];
                case 2:
                    result = _a.sent();
                    if (!(result === 'switched')) return [3 /*break*/, 4];
                    return [4 /*yield*/, p.set('mismatch', null)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, p.set('notice', "".concat(result, ": commit or stash first, then Switch."))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7:
                    err_8 = _a.sent();
                    (0, logger_1.debug)(p, 'switching branches failed', err_8);
                    return [4 /*yield*/, p.set('notice', "Couldn't switch branches. Try again.")];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function pressDoneYes(p) {
    return __awaiter(this, void 0, void 0, function () {
        var record, current;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _a.sent();
                    current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                    return [4 /*yield*/, p.set('isAskingDone', false)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, p.set('checked', null)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, saveReview(p, null)];
                case 4:
                    _a.sent();
                    if (!(current !== null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, band_queue_1.showBand)(p, { kind: 'difficulty', taskId: current.id, picked: current.difficulty.expected })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function pressDoneNotYet(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('isAskingDone', false)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, p.set('checked', null)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, saveReview(p, null)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function saveDifficulty(p) {
    return __awaiter(this, void 0, void 0, function () {
        var band;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('band')];
                case 1:
                    band = _a.sent();
                    if (band.kind !== 'difficulty' || live_1.live.ctx === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, band_queue_1.closeBand)(p)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.finishTask)(p, live_1.live.ctx, band.taskId, band.picked)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function saveDocsPath(p, value) {
    return __awaiter(this, void 0, void 0, function () {
        var band;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('band')];
                case 1:
                    band = _a.sent();
                    if (band.kind !== 'docsPath' || live_1.live.ctx === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, exports.finishDocs)(p, live_1.live.ctx, band.taskId, value.trim() === '' ? band.suggested : value.trim())];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
