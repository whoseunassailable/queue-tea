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
exports.leaveCodexUseCase = void 0;
var time_1 = require("../../../../shared/time/domain/services/time");
var realm_time_1 = require("../../../../shared/time/domain/services/realm_time");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
// A task coming back from Codex gets the minutes Codex's log shows since it
// went, under the idle gap, and Claude Code has it again. When the log can't
// be read the task still comes back, without that time; true says so.
var leaveCodexUseCase = function (d, ctx, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var record, task, since, byDay, periods, isTimeLost, stamps, _a, _b, _c, err_1;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, d.records.read()];
            case 1:
                record = _f.sent();
                task = record === 'unreadable' ? null : record.tasks.find(function (t) { return t.id === taskId; });
                since = (_d = task === null || task === void 0 ? void 0 : task.codexSince) !== null && _d !== void 0 ? _d : null;
                if (since === null)
                    return [2 /*return*/, false];
                byDay = {};
                periods = [];
                isTimeLost = false;
                _f.label = 2;
            case 2:
                _f.trys.push([2, 5, , 6]);
                _b = (_a = d.codex).activitySince;
                _c = [(0, queue_rules_1.taskFolder)(task, ctx.projectPath), Date.parse(since)];
                return [4 /*yield*/, d.env.now()];
            case 3: return [4 /*yield*/, _b.apply(_a, _c.concat([_f.sent()]))];
            case 4:
                stamps = _f.sent();
                byDay = (0, time_1.minutesOfStamps)(stamps, ctx.options.idleGapMinutes, ctx.offsetMinutes);
                periods = (0, time_1.periodsOfStamps)(stamps, ctx.options.idleGapMinutes);
                return [3 /*break*/, 6];
            case 5:
                err_1 = _f.sent();
                d.env.log("reading Codex's log failed: ".concat(err_1 instanceof Error ? ((_e = err_1.stack) !== null && _e !== void 0 ? _e : err_1.message) : String(err_1)));
                isTimeLost = true;
                return [3 /*break*/, 6];
            case 6: return [4 /*yield*/, d.records.update(function (r) {
                    if (!r.tasks.some(function (t) { return t.id === taskId && t.codexSince === since; }))
                        return r;
                    var tracked = (0, realm_time_1.recordRealmTime)(r, { onQuests: periods, elsewhere: [], minutesOnQuests: byDay, minutesElsewhere: {}, offsetMinutes: ctx.offsetMinutes });
                    return __assign(__assign({}, tracked), { tasks: r.tasks.map(function (t) { return (t.id === taskId ? __assign(__assign({}, t), { codexSince: null, minutesByDay: (0, time_1.mergeMinutes)(t.minutesByDay, byDay) }) : t); }) });
                })];
            case 7:
                _f.sent();
                return [2 /*return*/, isTimeLost];
        }
    });
}); };
exports.leaveCodexUseCase = leaveCodexUseCase;
