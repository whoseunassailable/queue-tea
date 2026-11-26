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
exports.fileTask = void 0;
exports.pickBand = pickBand;
exports.saveFile = saveFile;
exports.nameNewFeature = nameNewFeature;
exports.fileFromCommand = fileFromCommand;
var live_1 = require("../../../../core/session/live");
var band_queue_1 = require("../../../../core/store/band_queue");
var families_1 = require("../../../../shared/backlog/domain/services/families");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var records_controller_1 = require("../../../../shared/records/presentation/state_management/records_controller");
var tasks_controller_1 = require("./tasks_controller");
var file_task_1 = require("../../domain/usecases/file_task");
var tasks_providers_1 = require("../../tasks_providers");
var filing = new Set();
// Saves a held message as a task. Two presses of Save file it once. Filing
// never touches the current task, its branch or the conversation; with
// nothing current, the task itself starts, never a new feature.
var fileTask = function (p, ctx, input) { return __awaiter(void 0, void 0, void 0, function () {
    var pick, result, err_1, task, parent_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pick = (_a = input.parent) !== null && _a !== void 0 ? _a : { kind: 'none' };
                if (!(input.parent === null || (pick.kind === 'new' && pick.title.trim() === ''))) return [3 /*break*/, 2];
                return [4 /*yield*/, p.set('notice', pick.kind === 'new' ? 'Name the new feature first.' : 'Pick what it is part of first, or On its own.')];
            case 1:
                _b.sent();
                return [2 /*return*/];
            case 2:
                if (filing.has(input.text))
                    return [2 /*return*/];
                filing.add(input.text);
                _b.label = 3;
            case 3:
                _b.trys.push([3, , 17, 18]);
                result = void 0;
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 8]);
                return [4 /*yield*/, (0, file_task_1.fileTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), ctx, input)];
            case 5:
                result = _b.sent();
                return [3 /*break*/, 8];
            case 6:
                err_1 = _b.sent();
                p.log("saving the task failed: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                return [4 /*yield*/, p.set('notice', "Couldn't save the task. Try Save again.")];
            case 7:
                _b.sent();
                return [2 /*return*/];
            case 8:
                if (!(result.kind === 'unreadable')) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, records_controller_1.markUnreadable)(p, ctx)];
            case 9:
                _b.sent();
                return [2 /*return*/];
            case 10: return [4 /*yield*/, p.set('record', result.record)];
            case 11:
                _b.sent();
                if (!(result.kind === 'refused')) return [3 /*break*/, 13];
                return [4 /*yield*/, p.set('notice', result.notice)];
            case 12:
                _b.sent();
                return [2 /*return*/];
            case 13: return [4 /*yield*/, (0, band_queue_1.closeBand)(p)];
            case 14:
                _b.sent();
                task = result.task, parent_1 = result.parent;
                p.toast("Queued: ".concat(task.title, " (").concat(task.priority, ")").concat(parent_1 === null ? '' : " \u00B7 part of ".concat(parent_1.title)));
                if (!((0, queue_rules_1.currentTask)(result.record.tasks, ctx) === null)) return [3 /*break*/, 16];
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(p, ctx, task.id)];
            case 15:
                _b.sent();
                _b.label = 16;
            case 16: return [3 /*break*/, 18];
            case 17:
                filing.delete(input.text);
                return [7 /*endfinally*/];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.fileTask = fileTask;
function pickBand(p, patch) {
    return __awaiter(this, void 0, void 0, function () {
        var band;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('band')];
                case 1:
                    band = _a.sent();
                    if (!(band.kind === 'file')) return [3 /*break*/, 3];
                    return [4 /*yield*/, p.set('band', __assign(__assign({}, band), patch))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(band.kind === 'difficulty' && patch.difficulty !== undefined)) return [3 /*break*/, 5];
                    return [4 /*yield*/, p.set('band', __assign(__assign({}, band), { picked: patch.difficulty }))];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function saveFile(p) {
    return __awaiter(this, void 0, void 0, function () {
        var band;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('band')];
                case 1:
                    band = _a.sent();
                    if (band.kind !== 'file' || live_1.live.ctx === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, exports.fileTask)(p, live_1.live.ctx, band)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// The name of the new feature a held message goes under.
function nameNewFeature(p, title) {
    return __awaiter(this, void 0, void 0, function () {
        var band;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('band')];
                case 1:
                    band = _a.sent();
                    if (!(band.kind === 'file')) return [3 /*break*/, 3];
                    return [4 /*yield*/, p.set('band', __assign(__assign({}, band), { parent: { kind: 'new', title: title.trim() } }))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// What a message filed with no check is offered under: a feature it names,
// or, with a feature active, the question.
function parentFor(p, text) {
    return __awaiter(this, void 0, void 0, function () {
        var record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _a.sent();
                    return [2 /*return*/, record === null ? null : (0, families_1.guessParent)(record, text, null)];
            }
        });
    });
}
function fileFromCommand(p, text) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = band_queue_1.showBand;
                    _b = [p];
                    _c = [{ kind: 'file', text: text, title: text.slice(0, 60), priority: 'mid', difficulty: 'medium', intent: 'improving' }];
                    return [4 /*yield*/, parentFor(p, text)];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([__assign.apply(void 0, _c.concat([(_d.sent())]))]))];
                case 2:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
