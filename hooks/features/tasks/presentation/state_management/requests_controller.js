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
exports.followRecord = exports.handleRequests = void 0;
var live_1 = require("../../../../core/session/live");
var once_1 = require("../../../../core/session/once");
var conversation_controller_1 = require("../../../../shared/assistant/presentation/state_management/conversation_controller");
var effort_controller_1 = require("../../../../shared/effort/presentation/state_management/effort_controller");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var records_controller_1 = require("../../../../shared/records/presentation/state_management/records_controller");
var take_request_1 = require("../../domain/usecases/take_request");
var tasks_providers_1 = require("../../tasks_providers");
var tasks_controller_1 = require("./tasks_controller");
// No turn running, nothing half typed, no conversation of ours on its way.
var isSafePoint = function (p) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = !live_1.live.isTurnRunning && !(0, conversation_controller_1.isStartingFresh)();
            if (!_a) return [3 /*break*/, 2];
            return [4 /*yield*/, p.prompt.read()];
        case 1:
            _a = (_b.sent()).text.trim() === '';
            _b.label = 2;
        case 2: return [2 /*return*/, _a];
    }
}); }); };
// Acts on the oldest request. Run from a timer and never inside a hook, so a
// first message is never submitted from within a turn the hook is holding.
var handleRequests = function (p, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var record, request, task, isStale, _a, _b, taken;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _c.sent();
                request = record === null || record === void 0 ? void 0 : record.requests.find(function (q) {
                    var task = record.tasks.find(function (t) { return t.id === q.taskId; });
                    return task === undefined ? ctx.cwd === ctx.projectPath : (0, queue_rules_1.taskFolder)(task, ctx.projectPath) === ctx.cwd;
                });
                if (record === null || request === undefined)
                    return [2 /*return*/, 'none'];
                task = record.tasks.find(function (t) { return t.id === request.taskId; });
                isStale = (task === null || task === void 0 ? void 0 : task.state) !== 'current';
                _a = !isStale;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, isSafePoint(p)];
            case 2:
                _a = !(_c.sent());
                _c.label = 3;
            case 3:
                if (!_a) return [3 /*break*/, 8];
                _b = request.kind === 'begin';
                if (!_b) return [3 /*break*/, 5];
                return [4 /*yield*/, p.get('canContinue')];
            case 4:
                _b = !(_c.sent());
                _c.label = 5;
            case 5:
                if (!_b) return [3 /*break*/, 7];
                return [4 /*yield*/, p.set('canContinue', true)];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7: return [2 /*return*/, 'waiting'];
            case 8: return [4 /*yield*/, (0, take_request_1.takeRequestUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), request.id, ctx)];
            case 9:
                taken = _c.sent();
                if (!(taken.kind === 'unreadable')) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, records_controller_1.markUnreadable)(p, ctx)];
            case 10:
                _c.sent();
                return [2 /*return*/, 'none'];
            case 11:
                if (taken.kind === 'gone')
                    return [2 /*return*/, 'none'];
                return [4 /*yield*/, p.set('record', taken.record)];
            case 12:
                _c.sent();
                if (task === undefined || isStale) {
                    p.log("dropped the app's ".concat(request.kind, " request: ").concat(request.taskId, " is not the current task"));
                    return [2 /*return*/, 'dropped'];
                }
                if (!(request.kind === 'begin')) return [3 /*break*/, 14];
                return [4 /*yield*/, p.set('canContinue', false)];
            case 13:
                _c.sent();
                (0, conversation_controller_1.scheduleFresh)(p, ctx, task);
                return [3 /*break*/, 17];
            case 14: return [4 /*yield*/, (0, effort_controller_1.flush)(p)];
            case 15:
                _c.sent();
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(p, ctx, taken.request.block)];
            case 16:
                _c.sent();
                _c.label = 17;
            case 17: return [2 /*return*/, 'handled'];
        }
    });
}); };
exports.handleRequests = handleRequests;
// The app answered the done question, so the terminal stops asking it.
var closeAnswered = function (p, ctx, before, after) { return __awaiter(void 0, void 0, void 0, function () {
    var was, now;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                was = before === null ? null : (0, queue_rules_1.currentTask)(before.tasks, ctx);
                if ((was === null || was === void 0 ? void 0 : was.review) == null)
                    return [2 /*return*/];
                now = after.tasks.find(function (t) { return t.id === was.id; });
                if (!((now === null || now === void 0 ? void 0 : now.review) == null)) return [3 /*break*/, 3];
                return [4 /*yield*/, p.set('isAskingDone', false)];
            case 1:
                _a.sent();
                return [4 /*yield*/, p.set('checked', null)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// The timer's work: the record again when it changed, then any request.
var followRecord = function (p, ctx) {
    return (0, once_1.once)('follow-record', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, fresh;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('record')];
                case 1:
                    before = _a.sent();
                    return [4 /*yield*/, (0, records_controller_1.reloadIfChanged)(p, ctx)];
                case 2:
                    fresh = _a.sent();
                    if (!(fresh !== null)) return [3 /*break*/, 4];
                    return [4 /*yield*/, closeAnswered(p, ctx, before, fresh)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, (0, exports.handleRequests)(p, ctx)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, undefined);
};
exports.followRecord = followRecord;
