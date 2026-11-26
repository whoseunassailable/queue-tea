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
exports.retryTaskLog = exports.finishQuest = exports.notYet = void 0;
var finish_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/finish_task");
var save_docs_path_1 = require("../../../../../hooks/features/tasks/domain/usecases/save_docs_path");
var set_review_1 = require("../../../../../hooks/features/tasks/domain/usecases/set_review");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var victory_1 = require("../../game/domain/services/victory");
var projects_source_1 = require("../../projects/data/projects_source");
var task_input_1 = require("../domain/task_input");
var scope_1 = require("./scope");
var minutesOf = function (record, id) { var _a, _b; return Object.values((_b = (_a = record.tasks.find(function (t) { return t.id === id; })) === null || _a === void 0 ? void 0 : _a.minutesByDay) !== null && _b !== void 0 ? _b : {}).reduce(function (sum, m) { return sum + m; }, 0); };
var notYet = function (d, key, taskId) { return (0, scope_1.edit)(d, key, messages_1.MESSAGES.notYet, function (_a) {
    var deps = _a.deps;
    return (0, set_review_1.setReviewUseCase)(deps, (0, task_input_1.questIdOf)(taskId), null);
}); };
exports.notYet = notYet;
// The win is saved by now, so a log that can't be kept is said beside it and
// never takes the win away.
var keepLog = function (d, scope, id, path, record) { return __awaiter(void 0, void 0, void 0, function () {
    var saved, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, save_docs_path_1.saveDocsPathUseCase)(scope.deps, scope.ctx, id, path)];
            case 1:
                saved = _a.sent();
                if (saved.kind === 'saved')
                    return [2 /*return*/, { record: saved.record, logPath: path, logFailedAt: saved.logFailedAt }];
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                d.log.error('keeping the task log failed', err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, { record: record, logPath: path, logFailedAt: path }];
        }
    });
}); };
// Worked out after the win is saved, and only ever read. The game can fail and
// the quest is still won: the window says so with a toast in place of the panel.
var victoryFor = function (d, scope, id) { return __awaiter(void 0, void 0, void 0, function () {
    var records, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, projects_source_1.scanRecords)(d.host, d.home, d.log)];
            case 1:
                records = (_a.sent()).flatMap(function (s) { return (s.kind === 'readable' ? [s.record] : []); });
                return [2 /*return*/, (0, victory_1.victoryOf)(records, scope.ctx.projectPath, id, scope.ctx.offsetMinutes, d.now())];
            case 2:
                err_2 = _a.sent();
                d.log.error('working out the victory failed', err_2);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var finishQuest = function (d, key, taskId, actual, logPath) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.finishQuest, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, chosen, path, finished, logged, _a;
        var _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, taskId)];
                case 1:
                    scope = _d.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    chosen = (0, task_input_1.difficultyOf)(actual);
                    path = (0, task_input_1.logPathIn)(logPath, scope.ctx.projectPath);
                    // The use case would finish a quest in any state, and this one may have
                    // gone back to the board while the sheet was open.
                    if (((_c = scope.record.tasks.find(function (t) { return t.id === id; })) === null || _c === void 0 ? void 0 : _c.state) !== 'current')
                        throw new reply_1.Refusal(messages_1.MESSAGES.notActiveFinish);
                    if (scope.record.docsLogPath === null && path === null)
                        throw new reply_1.Refusal(messages_1.MESSAGES.logPathRequired);
                    return [4 /*yield*/, (0, finish_task_1.finishTaskUseCase)(scope.deps, scope.ctx, id, chosen)];
                case 2:
                    finished = _d.sent();
                    if (finished.kind === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    if (finished.kind === 'skipped')
                        throw new reply_1.Refusal(messages_1.MESSAGES.notActiveFinish);
                    if (!finished.askPath) return [3 /*break*/, 4];
                    return [4 /*yield*/, keepLog(d, scope, id, path, finished.record)];
                case 3:
                    _a = _d.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = { record: finished.record, logPath: finished.record.docsLogPath, logFailedAt: finished.logFailedAt };
                    _d.label = 5;
                case 5:
                    logged = _a;
                    _b = {};
                    return [4 /*yield*/, (0, scope_1.realmView)(d, scope.key, logged.record)];
                case 6:
                    _b.view = _d.sent(),
                        _b.logPath = logged.logPath,
                        _b.logFailedAt = logged.logFailedAt,
                        _b.minutes = minutesOf(logged.record, id);
                    return [4 /*yield*/, victoryFor(d, scope, id)];
                case 7: return [2 /*return*/, (_b.victory = _d.sent(),
                        _b.isCodexTimeLost = finished.isCodexTimeLost,
                        _b)];
            }
        });
    }); });
};
exports.finishQuest = finishQuest;
var retryTaskLog = function (d, key, taskId, path) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.retryTaskLog, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, checked, logged;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, taskId)];
                case 1:
                    scope = _c.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    checked = (0, task_input_1.logPathIn)(path, scope.ctx.projectPath);
                    if (checked === null)
                        throw new reply_1.Refusal(messages_1.MESSAGES.logPathRequired);
                    if (((_b = scope.record.tasks.find(function (t) { return t.id === id; })) === null || _b === void 0 ? void 0 : _b.state) !== 'done')
                        throw new reply_1.Refusal(messages_1.MESSAGES.badQuest);
                    return [4 /*yield*/, keepLog(d, scope, id, checked, scope.record)];
                case 2:
                    logged = _c.sent();
                    _a = {};
                    return [4 /*yield*/, (0, scope_1.realmView)(d, scope.key, logged.record)];
                case 3: return [2 /*return*/, (_a.view = _c.sent(), _a.logPath = logged.logPath, _a.logFailedAt = logged.logFailedAt, _a)];
            }
        });
    }); });
};
exports.retryTaskLog = retryTaskLog;
