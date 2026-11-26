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
exports.moveTask = exports.featureCommand = exports.setFeature = exports.togglePlayNext = exports.unblockTask = exports.blockTask = exports.removeQueued = void 0;
exports.pressBlock = pressBlock;
exports.pressCancelBlock = pressCancelBlock;
exports.pressBlockWith = pressBlockWith;
exports.pressUnblock = pressUnblock;
exports.pressPlayNext = pressPlayNext;
exports.pressBudget = pressBudget;
exports.pressRow = pressRow;
exports.pressPriority = pressPriority;
exports.pressRemove = pressRemove;
exports.pressFold = pressFold;
exports.pressPartOf = pressPartOf;
exports.pressCancelPartOf = pressCancelPartOf;
exports.pressPartOfWith = pressPartOfWith;
exports.pressFeature = pressFeature;
exports.pressClearFeature = pressClearFeature;
exports.runFeature = runFeature;
var logger_1 = require("../../../../core/logger/logger");
var live_1 = require("../../../../core/session/live");
var ranking_1 = require("../../../../shared/backlog/domain/services/ranking");
var effort_controller_1 = require("../../../../shared/effort/presentation/state_management/effort_controller");
var records_controller_1 = require("../../../../shared/records/presentation/state_management/records_controller");
var tasks_controller_1 = require("./tasks_controller");
var block_task_1 = require("../../domain/usecases/block_task");
var find_feature_1 = require("../../domain/usecases/find_feature");
var move_task_1 = require("../../domain/usecases/move_task");
var remove_task_1 = require("../../domain/usecases/remove_task");
var set_feature_1 = require("../../domain/usecases/set_feature");
var set_priority_1 = require("../../domain/usecases/set_priority");
var toggle_play_next_1 = require("../../domain/usecases/toggle_play_next");
var unblock_task_1 = require("../../domain/usecases/unblock_task");
var tasks_providers_1 = require("../../tasks_providers");
var hold_1 = require("./hold");
// Removes a queued task, and the git check's hold on it.
var removeQueued = function (p, ctx, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var saved, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = records_controller_1.applySaved;
                _b = [p, ctx];
                return [4 /*yield*/, (0, remove_task_1.removeTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), taskId)];
            case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            case 2:
                saved = _c.sent();
                if (saved === null)
                    return [2 /*return*/];
                return [4 /*yield*/, (0, hold_1.clearHold)(p, taskId)];
            case 3:
                _c.sent();
                return [4 /*yield*/, p.set('openRow', null)];
            case 4:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.removeQueued = removeQueued;
// Blocks a task; on the current task it puts the task back, blocked.
var blockTask = function (p, ctx, taskId, block) { return __awaiter(void 0, void 0, void 0, function () {
    var record, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _a.sent();
                return [4 /*yield*/, p.set('blocking', null)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, block_task_1.blockTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), record, taskId, block)];
            case 3:
                result = _a.sent();
                if (result.kind === 'none')
                    return [2 /*return*/];
                if (!(result.kind === 'refused')) return [3 /*break*/, 5];
                return [4 /*yield*/, p.set('notice', result.notice)];
            case 4:
                _a.sent();
                return [2 /*return*/];
            case 5:
                if (!(result.kind === 'is_current')) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(p, ctx, block)];
            case 6:
                _a.sent();
                return [2 /*return*/];
            case 7: return [4 /*yield*/, (0, records_controller_1.applySaved)(p, ctx, result.saved)];
            case 8:
                _a.sent();
                return [4 /*yield*/, p.set('openRow', null)];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.blockTask = blockTask;
var unblockTask = function (p, ctx, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = records_controller_1.applySaved;
                _b = [p, ctx];
                return [4 /*yield*/, (0, unblock_task_1.unblockTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), taskId)];
            case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            case 2:
                _c.sent();
                return [4 /*yield*/, p.set('openRow', null)];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.unblockTask = unblockTask;
var togglePlayNext = function (p, ctx, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = records_controller_1.applySaved;
                _b = [p, ctx];
                return [4 /*yield*/, (0, toggle_play_next_1.togglePlayNextUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), taskId)];
            case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
            case 2:
                _c.sent();
                return [4 /*yield*/, p.set('openRow', null)];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.togglePlayNext = togglePlayNext;
// Returns what happened, in plain words.
var setFeature = function (p, ctx, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, said, saved;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, set_feature_1.setFeatureUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), taskId)];
            case 1:
                _a = _b.sent(), said = _a.said, saved = _a.saved;
                return [4 /*yield*/, (0, records_controller_1.applySaved)(p, ctx, saved)];
            case 2: return [2 /*return*/, (_b.sent()) === null ? "Couldn't read the task record." : said];
        }
    });
}); };
exports.setFeature = setFeature;
var featureCommand = function (p, ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
    var found;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, find_feature_1.findFeatureUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), args)];
            case 1:
                found = _a.sent();
                return [2 /*return*/, found.kind === 'say' ? found.text : (0, exports.setFeature)(p, ctx, found.taskId)];
        }
    });
}); };
exports.featureCommand = featureCommand;
var moveTask = function (p, ctx, taskId, parentId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, task, parent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.set('parenting', null)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, move_task_1.moveTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), taskId, parentId)];
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
                if (!(result.kind === 'refused')) return [3 /*break*/, 7];
                return [4 /*yield*/, p.set('notice', result.notice)];
            case 6:
                _a.sent();
                return [2 /*return*/];
            case 7:
                task = result.task, parent = result.parent;
                if (task !== undefined)
                    p.toast(parent === null ? "On its own: ".concat(task.title) : "Part of ".concat(parent.title, ": ").concat(task.title));
                return [2 /*return*/];
        }
    });
}); };
exports.moveTask = moveTask;
// Opens the blocking view for a task: what it waits for, or a reason.
function pressBlock(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('parenting', null)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, p.set('blocking', taskId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressCancelBlock(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('blocking', null)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressBlockWith(p, taskId, block) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (live_1.live.ctx === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, effort_controller_1.flush)(p)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.blockTask)(p, live_1.live.ctx, taskId, block)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressUnblock(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(live_1.live.ctx !== null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, exports.unblockTask)(p, live_1.live.ctx, taskId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function pressPlayNext(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(live_1.live.ctx !== null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, exports.togglePlayNext)(p, live_1.live.ctx, taskId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Steps "Time I have" through any, 30m, 1h and 2h.
function pressBudget(p) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = (_a = p).set;
                    _c = ['budget'];
                    _d = ranking_1.nextBudget;
                    return [4 /*yield*/, p.get('budget')];
                case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.apply(void 0, [_e.sent()])]))];
                case 2:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressRow(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        var open;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('openRow')];
                case 1:
                    open = _a.sent();
                    return [4 /*yield*/, p.set('openRow', open === taskId ? null : taskId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressPriority(p, taskId, priority) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ctx = live_1.live.ctx;
                    if (ctx === null)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    _a = records_controller_1.applySaved;
                    _b = [p, ctx];
                    return [4 /*yield*/, (0, set_priority_1.setPriorityUseCase)((0, tasks_providers_1.tasksDepsOf)(p, ctx), taskId, priority)];
                case 2: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    (0, logger_1.debug)(p, 'writing the record failed', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function pressRemove(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(live_1.live.ctx !== null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, exports.removeQueued)(p, live_1.live.ctx, taskId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Shows a feature's tasks under it in the backlog, or folds them away.
function pressFold(p, parentId) {
    return __awaiter(this, void 0, void 0, function () {
        var open;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('openParents')];
                case 1:
                    open = _a.sent();
                    return [4 /*yield*/, p.set('openParents', open.includes(parentId) ? open.filter(function (id) { return id !== parentId; }) : __spreadArray(__spreadArray([], open, true), [parentId], false))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Opens the Part of… view for a task: the features it can go under.
function pressPartOf(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('blocking', null)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, p.set('parenting', taskId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressCancelPartOf(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('parenting', null)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function pressPartOfWith(p, taskId, parentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(live_1.live.ctx !== null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, exports.moveTask)(p, live_1.live.ctx, taskId, parentId)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Makes a task the active feature, or, pressed on the active one, none.
function pressFeature(p, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        var record, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (live_1.live.ctx === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _d.sent();
                    _b = (_a = p).toast;
                    _c = "Queue-tea: ".concat;
                    return [4 /*yield*/, (0, exports.setFeature)(p, live_1.live.ctx, (record === null || record === void 0 ? void 0 : record.feature) === taskId ? null : taskId)];
                case 2:
                    _b.apply(_a, [_c.apply("Queue-tea: ", [_d.sent()])]);
                    return [2 /*return*/];
            }
        });
    });
}
function pressClearFeature(p) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(live_1.live.ctx !== null)) return [3 /*break*/, 2];
                    _b = (_a = p).toast;
                    _c = "Queue-tea: ".concat;
                    return [4 /*yield*/, (0, exports.setFeature)(p, live_1.live.ctx, null)];
                case 1:
                    _b.apply(_a, [_c.apply("Queue-tea: ", [_d.sent()])]);
                    _d.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// /feature, answered in the command's reply.
function runFeature(p, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, live_1.live.ctx === null ? 'Queue-tea has no project here.' : (0, exports.featureCommand)(p, live_1.live.ctx, args)];
        });
    });
}
