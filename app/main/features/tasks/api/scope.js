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
exports.edit = exports.isSessionOpen = exports.realmView = exports.scopeOf = void 0;
var options_1 = require("../../../../../hooks/core/session/options");
var task_log_repository_impl_1 = require("../../../../../hooks/features/tasks/data/repositories/task_log_repository_impl");
var codex_repository_impl_1 = require("../../../../../hooks/shared/codex/data/repositories/codex_repository_impl");
var git_repository_impl_1 = require("../../../../../hooks/shared/git/data/repositories/git_repository_impl");
var records_repository_impl_1 = require("../../../../../hooks/shared/records/data/repositories/records_repository_impl");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var constants_1 = require("../../../core/constants");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var projects_api_1 = require("../../projects/api/projects_api");
var budgets_1 = require("../../projects/data/budgets");
var projects_source_1 = require("../../projects/data/projects_source");
var project_views_1 = require("../../projects/domain/project_views");
// The mod's own repositories over the app's host, for one realm's record.
var scopeOf = function (d, key, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, name, scanned, _a, path, projectName, workingPath, ctx, deps;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(0, projects_api_1.isProjectKey)(key))
                    throw new reply_1.Refusal(messages_1.MESSAGES.unknownProject);
                folder = (0, constants_1.projectsFolder)(d.home);
                name = "".concat(key, ".json");
                return [4 /*yield*/, d.host.exists("".concat(folder, "/").concat(name))];
            case 1:
                if (!(_d.sent()))
                    throw new reply_1.Refusal(messages_1.MESSAGES.unknownProject);
                return [4 /*yield*/, (0, projects_source_1.scanRecord)(d.host, folder, name, d.log)];
            case 2:
                scanned = _d.sent();
                if (scanned.kind === 'unreadable')
                    throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                _a = scanned.record.project, path = _a.path, projectName = _a.name;
                workingPath = (_c = (_b = scanned.record.tasks.find(function (t) { return t.id === taskId; })) === null || _b === void 0 ? void 0 : _b.worktreePath) !== null && _c !== void 0 ? _c : path;
                ctx = { cwd: workingPath, home: d.home, projectPath: path, projectName: projectName, file: scanned.file, offsetMinutes: d.offsetMinutes(), options: (0, options_1.readOptions)({}) };
                deps = {
                    records: (0, records_repository_impl_1.recordsRepositoryImpl)(d.host, ctx),
                    git: (0, git_repository_impl_1.gitRepositoryImpl)(d.host, workingPath),
                    taskLog: (0, task_log_repository_impl_1.taskLogRepositoryImpl)(d.host, workingPath),
                    codex: (0, codex_repository_impl_1.codexRepositoryImpl)(d.host, d.home),
                    env: { now: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, d.now()];
                        }); }); }, newId: d.newId, log: function (text) { return d.log.debug(text); } },
                };
                return [2 /*return*/, { key: key, deps: deps, ctx: ctx, record: scanned.record }];
        }
    });
}); };
exports.scopeOf = scopeOf;
var realmView = function (d, key, record) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _a = project_views_1.viewOf;
            _b = [key, record];
            return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
        case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent(), d.now(), (0, budgets_1.budgetOf)(key)]))];
    }
}); }); };
exports.realmView = realmView;
var isSessionOpen = function (d, path) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = project_views_1.sessionsIn;
            return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), path, d.now()]).some(function (s) { var _a; return ((_a = s.workingPath) !== null && _a !== void 0 ? _a : s.projectPath) === path; })
            // One edit: the record changes under its lock, and the window gets the realm
            // as it is now.
        ];
    }
}); }); };
exports.isSessionOpen = isSessionOpen;
// One edit: the record changes under its lock, and the window gets the realm
// as it is now.
var edit = function (d, key, failure, work) {
    return (0, reply_1.reply)(d.log, failure, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scope, saved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.scopeOf)(d, key)];
                case 1:
                    scope = _a.sent();
                    return [4 /*yield*/, work(scope)];
                case 2:
                    saved = _a.sent();
                    if (saved === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    return [2 /*return*/, (0, exports.realmView)(d, scope.key, saved)];
            }
        });
    }); });
};
exports.edit = edit;
