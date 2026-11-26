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
exports.beat = beat;
exports.endBeat = endBeat;
var logger_1 = require("../../core/logger/logger");
var live_1 = require("../../core/session/live");
var tea_cup_controller_1 = require("../../features/tea_cup/presentation/state_management/tea_cup_controller");
var queue_rules_1 = require("../../shared/records/domain/services/queue_rules");
var session_rules_1 = require("../../shared/sessions/domain/services/session_rules");
var sessions_providers_1 = require("../../shared/sessions/sessions_providers");
// What sessions that crashed left behind, gone at the next session's start.
var clearCrashed = function (p, ctx, now) { return __awaiter(void 0, void 0, void 0, function () {
    var sessions, _i, _a, session;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                sessions = (0, sessions_providers_1.sessionsRepositoryOf)(p, ctx);
                _i = 0;
                return [4 /*yield*/, sessions.list()];
            case 1:
                _a = _b.sent();
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                session = _a[_i];
                if (!!(0, session_rules_1.isFresh)(session, now)) return [3 /*break*/, 4];
                return [4 /*yield*/, sessions.remove(session.id)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
var writeBeat = function (p, ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var sessions, id, now, record, cup, _a, _b;
    var _c;
    var _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                sessions = (0, sessions_providers_1.sessionsRepositoryOf)(p, ctx);
                return [4 /*yield*/, p.session.id()];
            case 1:
                id = _g.sent();
                return [4 /*yield*/, p.now()];
            case 2:
                now = _g.sent();
                if (!(live_1.live.sessionId === null)) return [3 /*break*/, 4];
                return [4 /*yield*/, clearCrashed(p, ctx, now)
                    // A /clear goes on under a new id, so the old file goes.
                ];
            case 3:
                _g.sent();
                _g.label = 4;
            case 4:
                if (!(live_1.live.sessionId !== null && live_1.live.sessionId !== id)) return [3 /*break*/, 6];
                return [4 /*yield*/, sessions.remove(live_1.live.sessionId)];
            case 5:
                _g.sent();
                _g.label = 6;
            case 6:
                live_1.live.sessionId = id;
                (_d = live_1.live.startedAt) !== null && _d !== void 0 ? _d : (live_1.live.startedAt = now);
                return [4 /*yield*/, p.get('record')];
            case 7:
                record = _g.sent();
                return [4 /*yield*/, (0, tea_cup_controller_1.readCup)(p, live_1.live.isTurnRunning)];
            case 8:
                cup = _g.sent();
                _b = (_a = sessions).write;
                _c = {
                    id: id,
                    projectPath: ctx.projectPath,
                    workingPath: ctx.cwd,
                    recordFile: ctx.file,
                    currentTaskId: record === null ? null : ((_f = (_e = (0, queue_rules_1.currentTask)(record.tasks, ctx)) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : null),
                    isTurnRunning: live_1.live.isTurnRunning,
                    cup: { mood: cup.mood, line: cup.line }
                };
                return [4 /*yield*/, p.get('allowance')];
            case 9:
                _c.allowance = _g.sent();
                return [4 /*yield*/, p.get('warning')];
            case 10: return [4 /*yield*/, _b.apply(_a, [(_c.warning = _g.sent(),
                        _c.options = ctx.options,
                        _c.heartbeat = now,
                        _c.startedAt = live_1.live.startedAt,
                        _c)])];
            case 11:
                _g.sent();
                return [2 /*return*/];
        }
    });
}); };
// Tells the app where this session is. The app does without it for a beat, so
// a failure is logged and work carries on.
function beat(p) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (live_1.live.ctx === null)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, writeBeat(p, live_1.live.ctx)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    (0, logger_1.debug)(p, 'writing the session file failed', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function endBeat(p) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (live_1.live.ctx === null || live_1.live.sessionId === null)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, sessions_providers_1.sessionsRepositoryOf)(p, live_1.live.ctx).remove(live_1.live.sessionId)];
                case 2:
                    _a.sent();
                    live_1.live.sessionId = null;
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    (0, logger_1.debug)(p, 'removing the session file failed', err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
