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
exports.readMana = void 0;
var options_1 = require("../../../../../hooks/core/session/options");
var queue_rules_1 = require("../../../../../hooks/shared/records/domain/services/queue_rules");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var time_1 = require("../../../../../hooks/shared/time/domain/services/time");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var project_views_1 = require("../../projects/domain/project_views");
var detail_api_1 = require("../../tasks/api/detail_api");
var scope_1 = require("../../tasks/api/scope");
var mana_1 = require("../domain/mana");
var readMana = function (d, key) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readMana, function () { return __awaiter(void 0, void 0, void 0, function () {
        var initial, scope, now, sessions, here, _a;
        var _b;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
                case 1:
                    initial = _g.sent();
                    return [4 /*yield*/, (0, scope_1.scopeOf)(d, key, (_c = (0, queue_rules_1.currentTask)(initial.record.tasks)) === null || _c === void 0 ? void 0 : _c.id)];
                case 2:
                    scope = _g.sent();
                    now = d.now();
                    return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
                case 3:
                    sessions = _g.sent();
                    here = (0, project_views_1.sessionsIn)(sessions, scope.ctx.projectPath, now)[0];
                    _a = [__assign({}, (0, mana_1.manaOf)(scope.record, (0, time_1.dayKey)(now, d.offsetMinutes())))];
                    _b = { realm: scope.ctx.projectName, allowance: (0, mana_1.allowanceOf)(sessions, now), options: (_d = here === null || here === void 0 ? void 0 : here.options) !== null && _d !== void 0 ? _d : (0, options_1.readOptions)({}) };
                    return [4 /*yield*/, (0, detail_api_1.linesSince)(d, scope, (_f = (_e = (0, queue_rules_1.currentTask)(scope.record.tasks)) === null || _e === void 0 ? void 0 : _e.startCommit) !== null && _f !== void 0 ? _f : null)];
                case 4: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.lines = _g.sent(), _b)]))];
            }
        });
    }); });
};
exports.readMana = readMana;
