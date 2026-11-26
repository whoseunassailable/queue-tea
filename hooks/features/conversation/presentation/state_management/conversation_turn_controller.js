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
exports.afterTurn = exports.conversationState = void 0;
var conversation_controller_1 = require("../../../../shared/assistant/presentation/state_management/conversation_controller");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var allowance_1 = require("../../domain/services/allowance");
var turn_end_1 = require("../../domain/services/turn_end");
// The reset window a handoff note was last written for. A reload starts it over.
exports.conversationState = { handedOffFor: null };
// After each turn: does what the end of the turn calls for. Returns the reset
// time a note was last written for.
var afterTurn = function (p, ctx, reading, handedOffFor) { return __awaiter(void 0, void 0, void 0, function () {
    var record, current, action, task, task;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _a.sent();
                current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, ctx);
                if (current === null || (0, conversation_controller_1.isStartingFresh)())
                    return [2 /*return*/, handedOffFor];
                action = (0, turn_end_1.turnEnd)(reading, ctx, handedOffFor);
                if (!(action === 'fresh')) return [3 /*break*/, 3];
                (0, conversation_controller_1.markFreshPending)(true);
                return [4 /*yield*/, (0, conversation_controller_1.writeHandoff)(p, ctx, current.id)];
            case 2:
                task = _a.sent();
                if (task === null)
                    (0, conversation_controller_1.markFreshPending)(false);
                else
                    (0, conversation_controller_1.scheduleFresh)(p, ctx, task);
                return [2 /*return*/, handedOffFor];
            case 3:
                if (!(action === 'note' && reading.allowance !== null)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, conversation_controller_1.writeHandoff)(p, ctx, current.id)];
            case 4:
                task = _a.sent();
                return [2 /*return*/, task === null ? handedOffFor : (0, allowance_1.windowKey)(reading.allowance.resetsAt)];
            case 5: return [2 /*return*/, handedOffFor];
        }
    });
}); };
exports.afterTurn = afterTurn;
