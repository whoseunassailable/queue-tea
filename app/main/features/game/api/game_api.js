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
exports.readHoard = exports.readGame = void 0;
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var projects_source_1 = require("../../projects/data/projects_source");
var game_1 = require("../domain/services/game");
// The game over every record that reads, and the mana from the newest session
// that knows it. A broken record costs its own victories until it reads again.
var readGame = function (d) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readGame, function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, records, sessions, withMana;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    now = d.now();
                    return [4 /*yield*/, (0, projects_source_1.scanRecords)(d.host, d.home, d.log)];
                case 1:
                    records = (_c.sent()).flatMap(function (s) { return (s.kind === 'readable' ? [s.record] : []); });
                    return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
                case 2:
                    sessions = _c.sent();
                    withMana = sessions.filter(function (s) { return (0, session_rules_1.isFresh)(s, now) && s.allowance !== null; }).sort(function (a, b) { return b.heartbeat - a.heartbeat; });
                    return [2 /*return*/, __assign(__assign({}, (0, game_1.gameOf)(records, d.offsetMinutes(), now)), { allowance: (_b = (_a = withMana[0]) === null || _a === void 0 ? void 0 : _a.allowance) !== null && _b !== void 0 ? _b : null })];
            }
        });
    }); });
};
exports.readGame = readGame;
// Gold by realm lists every record that reads, so one with no victories shows 0.
var readHoard = function (d) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readHoard, function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, offset, scanned, readable, realms;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = d.now();
                    offset = d.offsetMinutes();
                    return [4 /*yield*/, (0, projects_source_1.scanRecords)(d.host, d.home, d.log)];
                case 1:
                    scanned = _a.sent();
                    readable = scanned.flatMap(function (s) { return (s.kind === 'readable' ? [s] : []); });
                    realms = readable.map(function (_a) {
                        var key = _a.key, record = _a.record;
                        var _b = (0, game_1.gameOf)([record], offset, now), victories = _b.victories, gold = _b.gold;
                        return { key: key, name: record.project.name, victories: victories, gold: gold };
                    });
                    return [2 /*return*/, { game: (0, game_1.gameOf)(readable.map(function (s) { return s.record; }), offset, now), realms: realms.sort(function (a, b) { return b.gold - a.gold; }), unreadable: scanned.length - readable.length }];
            }
        });
    }); });
};
exports.readHoard = readHoard;
