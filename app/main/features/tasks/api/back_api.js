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
exports.putBackNow = exports.putBackQuest = void 0;
var add_request_1 = require("../../../../../hooks/features/tasks/domain/usecases/add_request");
var drop_requests_1 = require("../../../../../hooks/features/tasks/domain/usecases/drop_requests");
var put_back_1 = require("../../../../../hooks/features/tasks/domain/usecases/put_back");
var ranking_1 = require("../../../../../hooks/shared/backlog/domain/services/ranking");
var checkpoints_1 = require("../../../../../hooks/shared/checkpoints/domain/services/checkpoints");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var task_input_1 = require("../domain/task_input");
var scope_1 = require("./scope");
var LOOP = 'That would make the two tasks wait for each other.';
var activeTask = function (scope, id) {
    var task = scope.record.tasks.find(function (t) { return t.id === id; });
    if ((task === null || task === void 0 ? void 0 : task.state) !== 'current')
        throw new reply_1.Refusal(messages_1.MESSAGES.notActiveBack);
    return task;
};
var lastNoteAt = function (task) {
    var note = (0, checkpoints_1.latestNote)(task);
    if (note === 'checkpoint')
        return task.checkpoint.written;
    return note === 'handoff' ? task.handoff.written : null;
};
// Goes back now, with whatever the session was asked to do taken back first so
// it can't act on a quest that has gone.
var goBack = function (d, scope, task, block, missedCheckpoint) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, saved, isCodexTimeLost;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, drop_requests_1.dropRequestsUseCase)(scope.deps, task.id)];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, put_back_1.putBackUseCase)(scope.deps, scope.ctx, task.id, block)];
            case 2:
                _a = _c.sent(), saved = _a.saved, isCodexTimeLost = _a.isCodexTimeLost;
                if (saved === 'unreadable')
                    throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                _b = {};
                return [4 /*yield*/, (0, scope_1.realmView)(d, scope.key, saved)];
            case 3: return [2 /*return*/, (_b.view = _c.sent(), _b.went = 'back', _b.missedCheckpoint = missedCheckpoint ? { lastAt: lastNoteAt(task) } : null, _b.isCodexTimeLost = isCodexTimeLost, _b)];
        }
    });
}); };
// With a session open it writes Claude's checkpoint, then the quest goes back.
// A begin still waiting means Claude hasn't started, and a quest with Codex
// isn't Claude's, so there is nothing to save.
var putBackQuest = function (d, key, taskId, seal) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.putBackQuest, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, block, task, hasBegun, _a, saved;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, taskId)];
                case 1:
                    scope = _c.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    block = seal === null || seal === undefined ? undefined : (0, task_input_1.sealOf)(seal);
                    task = activeTask(scope, id);
                    if (block !== undefined && 'waitFor' in block && (0, ranking_1.wouldLoop)(scope.record.tasks, id, block.waitFor))
                        throw new reply_1.Refusal((0, messages_1.inGameWords)(LOOP));
                    hasBegun = !scope.record.requests.some(function (q) { return q.kind === 'begin' && q.taskId === id; });
                    if (task.codexSince !== null)
                        return [2 /*return*/, goBack(d, scope, task, block, false)];
                    _a = !hasBegun;
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, scope_1.isSessionOpen)(d, scope.ctx.cwd)];
                case 2:
                    _a = !(_c.sent());
                    _c.label = 3;
                case 3:
                    if (_a)
                        return [2 /*return*/, goBack(d, scope, task, block, hasBegun)];
                    return [4 /*yield*/, (0, add_request_1.addRequestUseCase)(scope.deps, scope.ctx, 'putBack', id, block)];
                case 4:
                    saved = _c.sent();
                    if (saved === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    _b = {};
                    return [4 /*yield*/, (0, scope_1.realmView)(d, scope.key, saved)];
                case 5: return [2 /*return*/, (_b.view = _c.sent(), _b.went = 'asked', _b.missedCheckpoint = null, _b.isCodexTimeLost = false, _b)];
            }
        });
    }); });
};
exports.putBackQuest = putBackQuest;
// Without waiting for the session. A seal it was going to apply still applies.
var putBackNow = function (d, key, taskId) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.putBackQuest, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, id, task, asked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, taskId)];
                case 1:
                    scope = _a.sent();
                    id = (0, task_input_1.questIdOf)(taskId);
                    task = activeTask(scope, id);
                    asked = scope.record.requests.find(function (q) { return q.kind === 'putBack' && q.taskId === id; });
                    return [2 /*return*/, goBack(d, scope, task, asked === null || asked === void 0 ? void 0 : asked.block, true)];
            }
        });
    }); });
};
exports.putBackNow = putBackNow;
