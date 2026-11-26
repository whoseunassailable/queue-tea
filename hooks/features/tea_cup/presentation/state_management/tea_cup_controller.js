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
exports.refreshStatus = refreshStatus;
exports.readCup = readCup;
var live_1 = require("../../../../core/session/live");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var cup_mood_1 = require("../../domain/services/cup_mood");
var status_line_1 = require("../widgets/status_line");
// The status line, from the current task, the check and the allowance.
function refreshStatus(p) {
    return __awaiter(this, void 0, void 0, function () {
        var record, current, minutes, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _e.sent();
                    current = record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx);
                    minutes = current === null ? 0 : Object.values(current.minutesByDay).reduce(function (a, b) { return a + b; }, 0);
                    _b = (_a = p).status;
                    _c = status_line_1.statusText;
                    _d = [current, minutes];
                    return [4 /*yield*/, p.get('allowance')];
                case 2:
                    _d = _d.concat([_e.sent()]);
                    return [4 /*yield*/, p.get('isChecking')];
                case 3:
                    _b.apply(_a, [_c.apply(void 0, _d.concat([_e.sent()]))]);
                    return [2 /*return*/];
            }
        });
    });
}
// The tea cup's mood, from the same values the menu shows. Read while
// drawing, it redraws the cup when one of them changes.
function readCup(p, isTurnRunning) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = cup_mood_1.cupOf;
                    _b = {
                        place: live_1.live.ctx
                    };
                    return [4 /*yield*/, p.get('load')];
                case 1:
                    _b.load = _c.sent();
                    return [4 /*yield*/, p.get('record')];
                case 2:
                    _b.record = _c.sent();
                    return [4 /*yield*/, p.get('band')];
                case 3:
                    _b.band = _c.sent();
                    return [4 /*yield*/, p.get('isAskingDone')];
                case 4:
                    _b.isAskingDone = _c.sent();
                    return [4 /*yield*/, p.get('hold')];
                case 5:
                    _b.hold = _c.sent();
                    return [4 /*yield*/, p.get('mismatch')];
                case 6:
                    _b.mismatch = _c.sent();
                    return [4 /*yield*/, p.get('canContinue')];
                case 7:
                    _b.canContinue = _c.sent();
                    return [4 /*yield*/, p.get('warning')];
                case 8:
                    _b.warning = _c.sent();
                    return [4 /*yield*/, p.get('isChecking')];
                case 9:
                    _b.isChecking = _c.sent();
                    return [4 /*yield*/, p.get('busy')];
                case 10:
                    _b.busy = _c.sent(),
                        _b.isTurnRunning = isTurnRunning;
                    return [4 /*yield*/, p.get('budget')];
                case 11:
                    _b.budget = _c.sent();
                    return [4 /*yield*/, p.now()];
                case 12: return [2 /*return*/, _a.apply(void 0, [(_b.now = _c.sent(),
                            _b)])];
            }
        });
    });
}
