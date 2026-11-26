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
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishNotifiedActivity = exports.beginActivity = void 0;
var logger_1 = require("../../../../core/logger/logger");
var live_1 = require("../../../../core/session/live");
var records_controller_1 = require("../../../records/presentation/state_management/records_controller");
var queue_rules_1 = require("../../../records/domain/services/queue_rules");
var time_1 = require("../../../time/domain/services/time");
var activity_1 = require("../../domain/services/activity");
// Capture the task and context before awaiting the tool. Its result must never
// land on a different task if the user switches while the command is running.
var beginActivity = function (p, tool, input) { return __awaiter(void 0, void 0, void 0, function () {
    var ctx_1, record, background_1, task_1, step_1, _a, _b, _c, _d, save_1, err_1;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 7, , 8]);
                ctx_1 = live_1.live.ctx;
                if (ctx_1 === null)
                    return [2 /*return*/, null];
                return [4 /*yield*/, p.get('record')];
            case 1:
                record = _f.sent();
                background_1 = tool === 'GetTask' && typeof input.taskId === 'string';
                task_1 = record === null ? null : background_1
                    ? (_e = record.tasks.find(function (t) { return (0, activity_1.waitingFor)(t, String(input.taskId)) !== undefined; })) !== null && _e !== void 0 ? _e : null
                    : (0, queue_rules_1.currentTask)(record.tasks, ctx_1);
                if (task_1 === null)
                    return [2 /*return*/, null];
                if (!background_1) return [3 /*break*/, 2];
                _a = (0, activity_1.waitingFor)(task_1, String(input.taskId));
                return [3 /*break*/, 4];
            case 2:
                _b = activity_1.toolStep;
                _c = [tool, input, p.newId()];
                _d = time_1.isoLocal;
                return [4 /*yield*/, p.now()];
            case 3:
                _a = _b.apply(void 0, _c.concat([_d.apply(void 0, [_f.sent(), ctx_1.offsetMinutes])]));
                _f.label = 4;
            case 4:
                step_1 = _a;
                if (step_1 === null)
                    return [2 /*return*/, null];
                save_1 = function (s) { return (0, records_controller_1.change)(p, ctx_1, function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return t.id === task_1.id ? (0, activity_1.keepStep)(t, s) : t; }) })); }); };
                if (!!background_1) return [3 /*break*/, 6];
                return [4 /*yield*/, save_1(step_1)];
            case 5:
                _f.sent();
                _f.label = 6;
            case 6: return [2 /*return*/, function (result) { return __awaiter(void 0, void 0, void 0, function () {
                    var at, _a, ended, err_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 4, , 5]);
                                _a = time_1.isoLocal;
                                return [4 /*yield*/, p.now()];
                            case 1:
                                at = _a.apply(void 0, [_b.sent(), ctx_1.offsetMinutes]);
                                ended = background_1 ? (0, activity_1.finishBackgroundStep)(step_1, result.result, at) : (0, activity_1.finishStep)(step_1, result, at);
                                if (!(ended !== step_1)) return [3 /*break*/, 3];
                                return [4 /*yield*/, save_1(ended)];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3: return [3 /*break*/, 5];
                            case 4:
                                err_2 = _b.sent();
                                (0, logger_1.debug)(p, 'saving a finished step failed', err_2);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }];
            case 7:
                err_1 = _f.sent();
                (0, logger_1.debug)(p, 'saving a started step failed', err_1);
                return [2 /*return*/, null];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.beginActivity = beginActivity;
// A background shell ends when its notification arrives, not when Claude next
// reads it, so a background check counts as testing before this turn's minutes
// are flushed. Writes only when a waiting step matches.
var finishNotifiedActivity = function (p, text) { return __awaiter(void 0, void 0, void 0, function () {
    var ctx, ends_1, record, _a, at_1, _b, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                ctx = live_1.live.ctx;
                ends_1 = (0, activity_1.notifiedEnds)(text);
                if (!(ctx === null || ends_1.length === 0)) return [3 /*break*/, 1];
                _a = null;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, p.get('record')];
            case 2:
                _a = _c.sent();
                _c.label = 3;
            case 3:
                record = _a;
                if (ctx === null || record === null)
                    return [2 /*return*/];
                _b = time_1.isoLocal;
                return [4 /*yield*/, p.now()];
            case 4:
                at_1 = _b.apply(void 0, [_c.sent(), ctx.offsetMinutes]);
                if (record.tasks.every(function (t) { return (0, activity_1.finishNotified)(t, ends_1, at_1) === t; }))
                    return [2 /*return*/];
                return [4 /*yield*/, (0, records_controller_1.change)(p, ctx, function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (0, activity_1.finishNotified)(t, ends_1, at_1); }) })); })];
            case 5:
                _c.sent();
                return [3 /*break*/, 7];
            case 6:
                err_3 = _c.sent();
                (0, logger_1.debug)(p, 'finishing a background step failed', err_3);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.finishNotifiedActivity = finishNotifiedActivity;
