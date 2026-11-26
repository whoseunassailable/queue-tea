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
exports.readChoices = exports.setActiveSaga = exports.editQuest = exports.restoreQuest = exports.removeQuest = exports.unsealQuest = exports.sealQuest = exports.moveQuest = exports.fileQuest = exports.togglePlayNext = exports.setPriority = void 0;
var block_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/block_task");
var edit_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/edit_task");
var file_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/file_task");
var move_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/move_task");
var remove_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/remove_task");
var restore_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/restore_task");
var set_feature_1 = require("../../../../../hooks/features/tasks/domain/usecases/set_feature");
var set_priority_1 = require("../../../../../hooks/features/tasks/domain/usecases/set_priority");
var toggle_play_next_1 = require("../../../../../hooks/features/tasks/domain/usecases/toggle_play_next");
var unblock_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/unblock_task");
var families_1 = require("../../../../../hooks/shared/backlog/domain/services/families");
var ranking_1 = require("../../../../../hooks/shared/backlog/domain/services/ranking");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var task_input_1 = require("../domain/task_input");
var scope_1 = require("./scope");
var setPriority = function (d, key, taskId, priority) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.setPriority, function (_a) {
        var deps = _a.deps;
        return (0, set_priority_1.setPriorityUseCase)(deps, (0, task_input_1.questIdOf)(taskId), (0, task_input_1.priorityOf)(priority));
    });
};
exports.setPriority = setPriority;
var togglePlayNext = function (d, key, taskId) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.togglePlayNext, function (_a) {
        var deps = _a.deps;
        return (0, toggle_play_next_1.togglePlayNextUseCase)(deps, (0, task_input_1.questIdOf)(taskId));
    });
};
exports.togglePlayNext = togglePlayNext;
// Filing never starts a quest.
var fileQuest = function (d, key, input) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.fileQuest, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var quest, filed;
        var deps = _b.deps, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    quest = (0, task_input_1.newQuestOf)(input);
                    return [4 /*yield*/, (0, file_task_1.fileTaskUseCase)(deps, ctx, __assign(__assign({}, quest), { text: quest.title, intent: 'improving' }))];
                case 1:
                    filed = _c.sent();
                    if (filed.kind === 'refused')
                        throw new reply_1.Refusal((0, messages_1.inGameWords)(filed.notice));
                    return [2 /*return*/, filed.kind === 'unreadable' ? 'unreadable' : filed.record];
            }
        });
    }); });
};
exports.fileQuest = fileQuest;
var moveQuest = function (d, key, taskId, parentId) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.moveQuest, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var moved;
        var deps = _b.deps;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, move_task_1.moveTaskUseCase)(deps, (0, task_input_1.questIdOf)(taskId), parentId === null ? null : (0, task_input_1.questIdOf)(parentId))];
                case 1:
                    moved = _c.sent();
                    if (moved.kind === 'refused')
                        throw new reply_1.Refusal((0, messages_1.inGameWords)(moved.notice));
                    return [2 /*return*/, moved.kind === 'unreadable' ? 'unreadable' : moved.record];
            }
        });
    }); });
};
exports.moveQuest = moveQuest;
var sealQuest = function (d, key, taskId, seal) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.sealQuest, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var sealed;
        var deps = _b.deps, record = _b.record;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, block_task_1.blockTaskUseCase)(deps, record, (0, task_input_1.questIdOf)(taskId), (0, task_input_1.sealOf)(seal))];
                case 1:
                    sealed = _c.sent();
                    if (sealed.kind === 'refused')
                        throw new reply_1.Refusal((0, messages_1.inGameWords)(sealed.notice));
                    if (sealed.kind === 'is_current')
                        throw new reply_1.Refusal(messages_1.MESSAGES.sealActive);
                    if (sealed.kind === 'none')
                        throw new reply_1.Refusal(messages_1.MESSAGES.badQuest);
                    return [2 /*return*/, sealed.saved];
            }
        });
    }); });
};
exports.sealQuest = sealQuest;
var unsealQuest = function (d, key, taskId) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.unsealQuest, function (_a) {
        var deps = _a.deps;
        return (0, unblock_task_1.unblockTaskUseCase)(deps, (0, task_input_1.questIdOf)(taskId));
    });
};
exports.unsealQuest = unsealQuest;
var removeQuest = function (d, key, taskId) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.removeQuest, function (_a) {
        var deps = _a.deps;
        return (0, remove_task_1.removeTaskUseCase)(deps, (0, task_input_1.questIdOf)(taskId));
    });
};
exports.removeQuest = removeQuest;
var restoreQuest = function (d, key, taskId) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.restoreQuest, function (_a) {
        var deps = _a.deps;
        return (0, restore_task_1.restoreTaskUseCase)(deps, (0, task_input_1.questIdOf)(taskId));
    });
};
exports.restoreQuest = restoreQuest;
var editQuest = function (d, key, taskId, change) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.editQuest, function (_a) {
        var deps = _a.deps;
        return (0, edit_task_1.editTaskUseCase)(deps, (0, task_input_1.questIdOf)(taskId), (0, task_input_1.questEditOf)(change));
    });
};
exports.editQuest = editQuest;
var setActiveSaga = function (d, key, taskId) {
    return (0, scope_1.edit)(d, key, messages_1.MESSAGES.setActiveSaga, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var id, _c, said, saved;
        var deps = _b.deps;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    id = taskId === null ? null : (0, task_input_1.questIdOf)(taskId);
                    return [4 /*yield*/, (0, set_feature_1.setFeatureUseCase)(deps, id)];
                case 1:
                    _c = _d.sent(), said = _c.said, saved = _c.saved;
                    if (saved !== 'unreadable' && id !== null && saved.feature !== id)
                        throw new reply_1.Refusal(said);
                    return [2 /*return*/, saved];
            }
        });
    }); });
};
exports.setActiveSaga = setActiveSaga;
var readChoices = function (d, key, taskId) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readChoices, function () { return __awaiter(void 0, void 0, void 0, function () {
        var record, tasks, choice, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    record = (_a.sent()).record;
                    tasks = record.tasks;
                    choice = function (task) { return ({
                        id: task.id,
                        title: task.title,
                        detail: (0, families_1.childrenOf)(task, tasks).length > 0 ? (0, families_1.progressText)((0, families_1.progressOf)(task, tasks)) : null,
                    }); };
                    id = taskId === null ? null : (0, task_input_1.questIdOf)(taskId);
                    return [2 /*return*/, {
                            features: (0, families_1.filingCandidates)(record).map(choice),
                            lone: (0, families_1.loneTasks)(record).map(choice),
                            parents: id === null ? [] : (0, families_1.parentChoices)(tasks, id).map(choice),
                            waitFor: id === null ? [] : (0, ranking_1.canWaitFor)(tasks, id).map(choice),
                        }];
            }
        });
    }); });
};
exports.readChoices = readChoices;
