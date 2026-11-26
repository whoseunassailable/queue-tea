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
exports.effortState = void 0;
exports.flush = flush;
var logger_1 = require("../../../../core/logger/logger");
var live_1 = require("../../../../core/session/live");
var git_providers_1 = require("../../../git/git_providers");
var queue_rules_1 = require("../../../records/domain/services/queue_rules");
var records_controller_1 = require("../../../records/presentation/state_management/records_controller");
var time_1 = require("../../../time/domain/services/time");
var effort_tracker_1 = require("../../domain/services/effort_tracker");
// What the session has gathered since the last flush. A reload starts it over.
exports.effortState = { tracker: null };
// Writes what the tracker gathered since the last flush into the record,
// and, with a task current, what git says now into its checkpoint.
function flush(p) {
    return __awaiter(this, void 0, void 0, function () {
        var tracker, ctx, taken, record, seen, _a, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tracker = exports.effortState.tracker;
                    ctx = live_1.live.ctx;
                    if (tracker === null || ctx === null)
                        return [2 /*return*/];
                    taken = tracker.take();
                    return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _c.sent();
                    if (!(record !== null && (0, queue_rules_1.currentTask)(record.tasks, ctx) !== null)) return [3 /*break*/, 6];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 5, , 6]);
                    _b = {};
                    _a = time_1.isoLocal;
                    return [4 /*yield*/, p.now()];
                case 3:
                    _b.at = _a.apply(void 0, [_c.sent(), ctx.offsetMinutes]);
                    return [4 /*yield*/, (0, git_providers_1.gitRepositoryOf)(p, ctx).facts()];
                case 4:
                    seen = (_b.git = _c.sent(), _b);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _c.sent();
                    (0, logger_1.debug)(p, 'reading git for the checkpoint failed', err_1);
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, (0, records_controller_1.changeRecord)(p, function (r) { return (0, effort_tracker_1.applyPending)(r, taken, seen, ctx); })];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
