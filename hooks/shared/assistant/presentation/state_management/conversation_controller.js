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
exports.writeHandoff = exports.freshConversation = exports.isStartingFresh = exports.scheduleFresh = exports.markFreshPending = void 0;
var checkpoints_1 = require("../../../checkpoints/domain/services/checkpoints");
var check_now_1 = require("../../../checkpoints/domain/usecases/check_now");
var git_providers_1 = require("../../../git/git_providers");
var description_files_1 = require("../../../records/domain/services/description_files");
var records_providers_1 = require("../../../records/records_providers");
var records_controller_1 = require("../../../records/presentation/state_management/records_controller");
var assistant_providers_1 = require("../../assistant_providers");
var write_handoff_1 = require("../../domain/usecases/write_handoff");
// A fresh conversation is on its way: no other is started until it is.
var isFreshPending = false;
var markFreshPending = function (isPending) {
    isFreshPending = isPending;
};
exports.markFreshPending = markFreshPending;
var scheduleFresh = function (p, ctx, task) {
    isFreshPending = true;
    p.later(function () { return (0, exports.freshConversation)(p, ctx, task); });
};
exports.scheduleFresh = scheduleFresh;
// True while Queue-tea is starting a conversation of its own, so the clear it
// makes is not taken for one to recover from.
var isStartingFresh = function () { return isFreshPending; };
exports.isStartingFresh = isStartingFresh;
// When the clear or the first message fails, the task stays current and
// Continue is offered, so it can be tried again.
var freshConversation = function (p, ctx, task) { return __awaiter(void 0, void 0, void 0, function () {
    var checked, assistant, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, 7, 8]);
                return [4 /*yield*/, (0, check_now_1.checkNowUseCase)((0, git_providers_1.gitRepositoryOf)(p, ctx), p.log, task)];
            case 1:
                checked = _a.sent();
                assistant = (0, assistant_providers_1.assistantRepositoryOf)(p);
                return [4 /*yield*/, assistant.clear()];
            case 2:
                _a.sent();
                return [4 /*yield*/, assistant.submit((0, checkpoints_1.firstMessage)(task, checked, (0, description_files_1.notesFolderOf)(ctx)))];
            case 3:
                _a.sent();
                return [3 /*break*/, 8];
            case 4:
                err_1 = _a.sent();
                p.log("starting the conversation for ".concat(task.id, " failed: ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                return [4 /*yield*/, p.set('notice', "Couldn't open the conversation for ".concat(task.title, ". Press Continue to try again."))];
            case 5:
                _a.sent();
                return [4 /*yield*/, p.set('canContinue', true)];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                isFreshPending = false;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.freshConversation = freshConversation;
var HANDOFF_FAILED = "Queue-tea: couldn't write the checkpoint; trying again after the next reply";
var writeHandoff = function (p, ctx, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var record, task, result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _b.sent();
                task = record === null || record === void 0 ? void 0 : record.tasks.find(function (t) { return t.id === taskId; });
                if (task === undefined)
                    return [2 /*return*/, null];
                return [4 /*yield*/, (0, write_handoff_1.writeHandoffUseCase)({ records: (0, records_providers_1.recordsRepositoryOf)(p, ctx), git: (0, git_providers_1.gitRepositoryOf)(p, ctx), assistant: (0, assistant_providers_1.assistantRepositoryOf)(p), env: p }, ctx, task)];
            case 2:
                result = _b.sent();
                if (result.kind === 'not_written') {
                    p.log("checkpoint not written: ".concat(result.reason));
                    p.status(HANDOFF_FAILED);
                    return [2 /*return*/, null];
                }
                if (!(result.kind === 'unreadable')) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, records_controller_1.markUnreadable)(p, ctx)];
            case 3:
                _b.sent();
                return [2 /*return*/, null];
            case 4: return [4 /*yield*/, p.set('record', result.record)];
            case 5:
                _b.sent();
                return [2 /*return*/, (_a = result.record.tasks.find(function (t) { return t.id === taskId; })) !== null && _a !== void 0 ? _a : null];
        }
    });
}); };
exports.writeHandoff = writeHandoff;
