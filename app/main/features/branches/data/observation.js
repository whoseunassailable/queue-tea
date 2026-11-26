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
exports.observeTask = exports.codexEvents = void 0;
var activity_1 = require("../../../../../hooks/shared/activity/domain/services/activity");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var codex_source_1 = require("./codex_source");
var codex_events_1 = require("./codex_events");
Object.defineProperty(exports, "codexEvents", { enumerable: true, get: function () { return codex_events_1.codexEvents; } });
var observeTask = function (d, root, task) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, codex, err_1, until, step, sessions, seenAt, state;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                folder = (_a = task.worktreePath) !== null && _a !== void 0 ? _a : root;
                codex = { state: 'unobserved', seenAt: null, step: null };
                if (!(task.started || task.codexSince)) return [3 /*break*/, 4];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, codex_source_1.readCodexSession)(d, folder, Date.parse((_b = task.codexSince) !== null && _b !== void 0 ? _b : task.started))];
            case 2:
                codex = _c.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _c.sent();
                d.log.error('Reading Codex activity failed', err_1);
                return [3 /*break*/, 4];
            case 4:
                until = task.finished ? Date.parse(task.finished) : Infinity;
                step = (0, activity_1.latestStep)(task.step, codex.step !== null && Date.parse(codex.step.at) <= until ? codex.step : null);
                if (task.state !== 'current')
                    return [2 /*return*/, { state: task.state === 'done' ? 'review' : 'queued', step: step, seenAt: codex.seenAt }];
                if (task.codexSince)
                    return [2 /*return*/, __assign(__assign({}, codex), { step: step })];
                return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
            case 5:
                sessions = (_c.sent()).filter(function (s) { var _a; return ((_a = s.workingPath) !== null && _a !== void 0 ? _a : s.projectPath) === folder && (0, session_rules_1.isFresh)(s, d.now()); });
                seenAt = sessions.length ? Math.max.apply(Math, sessions.map(function (s) { return s.heartbeat; })) : null;
                state = sessions.some(function (s) { return s.isTurnRunning; }) ? 'working' : sessions.some(function (s) { return s.cup.mood === 'attention'; }) ? 'needsYou' : task.review ? 'review' : 'paused';
                return [2 /*return*/, { state: state, seenAt: seenAt, step: step }];
        }
    });
}); };
exports.observeTask = observeTask;
