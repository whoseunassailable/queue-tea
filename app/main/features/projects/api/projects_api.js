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
exports.readProject = exports.listProjects = exports.isProjectKey = void 0;
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var constants_1 = require("../../../core/constants");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var budgets_1 = require("../data/budgets");
var projects_source_1 = require("../data/projects_source");
var project_views_1 = require("../domain/project_views");
var KEY = /^[^./\\][^/\\]*-[0-9a-f]{6}$/;
var isProjectKey = function (key) { return typeof key === 'string' && KEY.test(key); };
exports.isProjectKey = isProjectKey;
var listProjects = function (d) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.listProjects, function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessions, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
                case 1:
                    sessions = _a.sent();
                    now = d.now();
                    return [4 /*yield*/, (0, projects_source_1.scanRecords)(d.host, d.home, d.log)];
                case 2: return [2 /*return*/, (_a.sent()).map(function (s) {
                        return s.kind === 'readable' ? (0, project_views_1.rowOf)(s.key, s.record, sessions, now) : { kind: 'unreadable', key: s.key, name: s.name };
                    })];
            }
        });
    }); });
};
exports.listProjects = listProjects;
var readProject = function (d, key) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!(0, exports.isProjectKey)(key)) {
            d.log.warn('readProject was given a key that is not one');
            return [2 /*return*/, { ok: false, error: { message: messages_1.MESSAGES.unknownProject } }];
        }
        return [2 /*return*/, (0, reply_1.reply)(d.log, messages_1.MESSAGES.readProject, function () { return __awaiter(void 0, void 0, void 0, function () {
                var folder, name, scanned, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            folder = (0, constants_1.projectsFolder)(d.home);
                            name = "".concat(key, ".json");
                            return [4 /*yield*/, d.host.exists("".concat(folder, "/").concat(name))];
                        case 1:
                            if (!(_c.sent()))
                                throw new Error("no record for ".concat(key));
                            return [4 /*yield*/, (0, projects_source_1.scanRecord)(d.host, folder, name, d.log)];
                        case 2:
                            scanned = _c.sent();
                            if (scanned.kind === 'unreadable') {
                                return [2 /*return*/, { kind: 'unreadable', key: key, name: scanned.name, reason: scanned.reason, file: scanned.file, isNewer: scanned.isNewer, canRestore: scanned.canRestore }];
                            }
                            _a = project_views_1.viewOf;
                            _b = [key, scanned.record];
                            return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
                        case 3: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), d.now(), (0, budgets_1.budgetOf)(key)]))];
                    }
                });
            }); })];
    });
}); };
exports.readProject = readProject;
