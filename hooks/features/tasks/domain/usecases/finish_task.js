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
exports.finishTaskUseCase = void 0;
var time_1 = require("../../../../shared/time/domain/services/time");
var leave_codex_1 = require("./leave_codex");
var log_row_1 = require("./log_row");
// Adds its time on Codex, marks the task done with its change size, then logs it. With no log path
// yet, nothing is logged and the path is asked for.
var finishTaskUseCase = function (d, ctx, taskId, actual) { return __awaiter(void 0, void 0, void 0, function () {
    var record, before, isCodexTimeLost, diff, err_1, finished, _a, saved;
    var _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, d.records.read()];
            case 1:
                record = _d.sent();
                if (record === 'unreadable')
                    return [2 /*return*/, { kind: 'unreadable' }];
                before = (_c = record.tasks.find(function (t) { return t.id === taskId; })) !== null && _c !== void 0 ? _c : null;
                if (before === null || before.state === 'done')
                    return [2 /*return*/, { kind: 'skipped' }];
                return [4 /*yield*/, (0, leave_codex_1.leaveCodexUseCase)(d, ctx, taskId)];
            case 2:
                isCodexTimeLost = _d.sent();
                diff = { linesAdded: 0, linesRemoved: 0, filesTouched: 0 };
                if (!before.startCommit) return [3 /*break*/, 6];
                _d.label = 3;
            case 3:
                _d.trys.push([3, 5, , 6]);
                return [4 /*yield*/, d.git.diffSince(before.startCommit)];
            case 4:
                diff = _d.sent();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _d.sent();
                d.env.log("measuring the change failed: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                return [3 /*break*/, 6];
            case 6:
                _a = time_1.isoLocal;
                return [4 /*yield*/, d.env.now()];
            case 7:
                finished = _a.apply(void 0, [_d.sent(), ctx.offsetMinutes]);
                return [4 /*yield*/, d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) {
                            return t.id === taskId
                                ? __assign(__assign({}, t), { state: 'done', finished: finished, review: null, difficulty: __assign(__assign({}, t.difficulty), { actual: actual }), effort: __assign(__assign({}, t.effort), diff) }) : t;
                        }) })); })];
            case 8:
                saved = _d.sent();
                if (saved === 'unreadable')
                    return [2 /*return*/, { kind: 'unreadable' }];
                if (saved.docsLogPath === null)
                    return [2 /*return*/, { kind: 'saved', record: saved, askPath: true, logFailedAt: null, isCodexTimeLost: isCodexTimeLost }];
                _b = { kind: 'saved', record: saved, askPath: false };
                return [4 /*yield*/, (0, log_row_1.logRow)(d, ctx, saved, taskId, saved.docsLogPath)];
            case 9: return [2 /*return*/, (_b.logFailedAt = _d.sent(), _b.isCodexTimeLost = isCodexTimeLost, _b)];
        }
    });
}); };
exports.finishTaskUseCase = finishTaskUseCase;
