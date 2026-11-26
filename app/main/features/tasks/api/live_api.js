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
exports.setTimeBudget = exports.switchBranch = exports.readLive = void 0;
var switch_to_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/switch_to_task");
var ranking_1 = require("../../../../../hooks/shared/backlog/domain/services/ranking");
var branch_rules_1 = require("../../../../../hooks/shared/git/domain/services/branch_rules");
var queue_rules_1 = require("../../../../../hooks/shared/records/domain/services/queue_rules");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var budgets_1 = require("../../projects/data/budgets");
var project_views_1 = require("../../projects/domain/project_views");
var scope_1 = require("./scope");
var mismatchOf = function (_a, branch_1) { return __awaiter(void 0, [_a, branch_1], void 0, function (_b, branch) {
    var git, _c;
    var deps = _b.deps;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, deps.git.state()];
            case 1:
                git = _d.sent();
                _c = !git.isRepo || git.branch === branch;
                if (_c) return [3 /*break*/, 3];
                return [4 /*yield*/, deps.git.branches()];
            case 2:
                _c = !(_d.sent()).includes(branch);
                _d.label = 3;
            case 3:
                if (_c)
                    return [2 /*return*/, null];
                return [2 /*return*/, { on: git.branch, branch: branch, uncommitted: git.uncommitted > 0 ? (0, branch_rules_1.holdReason)(__assign(__assign({}, git), { unpushed: 0, hasUpstream: true })) : null }];
        }
    });
}); };
// What has moved under the quest in hand, from local git, and the session's
// commit warning.
var readLive = function (d, key) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readLive, function () { return __awaiter(void 0, void 0, void 0, function () {
        var initial, scope, sessions, _a, warning, current, _b;
        var _c;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    initial = _g.sent();
                    return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, (_d = (0, queue_rules_1.currentTask)(initial.record.tasks)) === null || _d === void 0 ? void 0 : _d.id)];
                case 2:
                    scope = _g.sent();
                    _a = project_views_1.sessionsIn;
                    return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
                case 3:
                    sessions = _a.apply(void 0, [_g.sent(), scope.ctx.cwd, d.now()]);
                    warning = (_f = (_e = sessions.find(function (s) { return s.warning != null; })) === null || _e === void 0 ? void 0 : _e.warning) !== null && _f !== void 0 ? _f : null;
                    current = (0, queue_rules_1.currentTask)(scope.record.tasks);
                    if (current === null)
                        return [2 /*return*/, { drift: [], mismatch: null, warning: warning }];
                    _c = {};
                    return [4 /*yield*/, scope.deps.git.drift(current)];
                case 4:
                    _c.drift = _g.sent();
                    if (!(current.branch === null)) return [3 /*break*/, 5];
                    _b = null;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, mismatchOf(scope, current.branch)];
                case 6:
                    _b = _g.sent();
                    _g.label = 7;
                case 7: return [2 /*return*/, (_c.mismatch = _b, _c.warning = warning, _c)];
            }
        });
    }); });
};
exports.readLive = readLive;
var switchBranch = function (d, key) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.switchBranch, function () { return __awaiter(void 0, void 0, void 0, function () {
        var initial, scope, branch, result;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    initial = _d.sent();
                    return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, (_a = (0, queue_rules_1.currentTask)(initial.record.tasks)) === null || _a === void 0 ? void 0 : _a.id)];
                case 2:
                    scope = _d.sent();
                    branch = (_c = (_b = (0, queue_rules_1.currentTask)(scope.record.tasks)) === null || _b === void 0 ? void 0 : _b.branch) !== null && _c !== void 0 ? _c : null;
                    if (branch === null)
                        throw new reply_1.Refusal(messages_1.MESSAGES.noBranch);
                    return [4 /*yield*/, (0, switch_to_task_1.switchToTaskUseCase)(scope.deps, branch)];
                case 3:
                    result = _d.sent();
                    if (result.kind === 'uncommitted')
                        throw new reply_1.Refusal(messages_1.MESSAGES.switchHeld(result.text));
                    return [2 /*return*/, null];
            }
        });
    }); });
};
exports.switchBranch = switchBranch;
var setTimeBudget = function (d, key, budget) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.setTimeBudget, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    scope = _a.sent();
                    if (!ranking_1.BUDGETS.includes(budget))
                        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
                    (0, budgets_1.setBudget)(scope.key, budget);
                    return [2 /*return*/, (0, scope_1.realmView)(d, scope.key, scope.record)];
            }
        });
    }); });
};
exports.setTimeBudget = setTimeBudget;
