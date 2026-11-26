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
exports.setTestProfileUseCase = void 0;
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
// Saves Tea-DD's pick on the task, which may replace its own earlier one.
// Rohan's choice is read again from the record being written: he may have
// just picked one in the app, and his always stands. The task must still be
// this folder's current one, so a stale id never touches another worktree's.
var setTestProfileUseCase = function (d, place, taskId, pick) { return __awaiter(void 0, void 0, void 0, function () {
    var why, saved;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                why = { refused: null };
                return [4 /*yield*/, d.records.update(function (r) {
                        var _a;
                        var task = (0, queue_rules_1.currentTask)(r.tasks, place);
                        why.refused = task === null || task.id !== taskId ? { kind: 'notCurrent' } : ((_a = task.testProfile) === null || _a === void 0 ? void 0 : _a.by) === 'rohan' ? { kind: 'rohans', id: task.testProfile.id } : null;
                        if (why.refused !== null)
                            return r;
                        return __assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === taskId ? __assign(__assign({}, t), { testProfile: { id: pick.id, by: 'tea-dd', reason: pick.reason } }) : t); }) });
                    })];
            case 1:
                saved = _b.sent();
                if (saved === 'unreadable')
                    return [2 /*return*/, { kind: 'unreadable' }];
                return [2 /*return*/, (_a = why.refused) !== null && _a !== void 0 ? _a : { kind: 'saved', record: saved }];
        }
    });
}); };
exports.setTestProfileUseCase = setTestProfileUseCase;
