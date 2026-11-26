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
exports.restoreRealm = exports.addProject = exports.openFolder = exports.placeOf = exports.showRecord = exports.setGitMode = exports.setTaskLog = exports.readSettingsPage = void 0;
var options_1 = require("../../../../../hooks/core/session/options");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var records_repository_impl_1 = require("../../../../../hooks/shared/records/data/repositories/records_repository_impl");
var sessions_repository_impl_1 = require("../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl");
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var git_mode_1 = require("../../../../../hooks/shared/records/domain/services/git_mode");
var time_1 = require("../../../../../hooks/shared/time/domain/services/time");
var constants_1 = require("../../../core/constants");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var projects_api_1 = require("../../projects/api/projects_api");
var projects_source_1 = require("../../projects/data/projects_source");
var command_file_1 = require("../../opening/data/command_file");
var task_input_1 = require("../../tasks/domain/task_input");
var nameOf = function (path) { return path.split('/').pop() || path; };
var fileOf = function (d, key) { return "".concat((0, constants_1.projectsFolder)(d.home), "/").concat(key, ".json"); };
var realmFile = function (d, key) { return __awaiter(void 0, void 0, void 0, function () {
    var file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, projects_api_1.isProjectKey)(key))
                    throw new reply_1.Refusal(messages_1.MESSAGES.unknownProject);
                file = fileOf(d, key);
                return [4 /*yield*/, d.host.exists(file)];
            case 1:
                if (!(_a.sent()))
                    throw new reply_1.Refusal(messages_1.MESSAGES.unknownProject);
                return [2 /*return*/, { key: key, file: file }];
        }
    });
}); };
// The app's own settings, and the one realm you're in: another realm's record
// or log never reaches this page.
var readSettingsPage = function (d, key) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readSettingsPage, function () { return __awaiter(void 0, void 0, void 0, function () {
        var scanned, _a, now, live, _b;
        var _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!(key === null)) return [3 /*break*/, 1];
                    _a = undefined;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, projects_source_1.scanRecords)(d.host, d.home, d.log)];
                case 2:
                    _a = (_g.sent()).find(function (s) { return s.key === key; });
                    _g.label = 3;
                case 3:
                    scanned = _a;
                    if (key !== null && scanned === undefined)
                        throw new reply_1.Refusal(messages_1.MESSAGES.unknownProject);
                    now = d.now();
                    return [4 /*yield*/, (0, sessions_repository_impl_1.sessionsRepositoryImpl)(d.host, d.home).list()];
                case 4:
                    live = (_g.sent()).filter(function (s) { return (0, session_rules_1.isFresh)(s, now); }).sort(function (a, b) { return b.heartbeat - a.heartbeat; })[0];
                    _c = {
                        options: (_e = live === null || live === void 0 ? void 0 : live.options) !== null && _e !== void 0 ? _e : (0, options_1.readOptions)({}),
                        isDefault: live === undefined
                    };
                    if (!(scanned === undefined)) return [3 /*break*/, 5];
                    _b = null;
                    return [3 /*break*/, 7];
                case 5:
                    _d = {
                        key: scanned.key,
                        name: scanned.kind === 'readable' ? scanned.record.project.name : scanned.name,
                        path: scanned.kind === 'readable' ? scanned.record.project.path : '',
                        file: scanned.file.split('/').pop()
                    };
                    return [4 /*yield*/, d.host.exists((0, record_source_1.backupPath)(scanned.file))];
                case 6:
                    _b = (_d.hasCopy = _g.sent(),
                        _d.logPath = scanned.kind === 'readable' ? scanned.record.docsLogPath : null,
                        _d.gitMode = scanned.kind === 'readable' ? (0, git_mode_1.gitModeOf)(scanned.record) : 'assisted',
                        _d.isReadable = scanned.kind === 'readable',
                        _d);
                    _g.label = 7;
                case 7:
                    _c.realm = _b;
                    return [4 /*yield*/, (0, command_file_1.findCommand)(d.host, (_f = d.commandDirs) !== null && _f !== void 0 ? _f : [])];
                case 8: return [2 /*return*/, (_c.command = _g.sent(),
                        _c)];
            }
        });
    }); });
};
exports.readSettingsPage = readSettingsPage;
// A readable realm's record, to change under its lock.
var realmRecords = function (d, key) { return __awaiter(void 0, void 0, void 0, function () {
    var realm, scanned, _a, projectPath, name, records;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, realmFile(d, key)];
            case 1:
                realm = _b.sent();
                return [4 /*yield*/, (0, projects_source_1.scanRecords)(d.host, d.home, d.log)];
            case 2:
                scanned = (_b.sent()).find(function (s) { return s.key === realm.key; });
                if ((scanned === null || scanned === void 0 ? void 0 : scanned.kind) !== 'readable')
                    throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                _a = scanned.record.project, projectPath = _a.path, name = _a.name;
                records = (0, records_repository_impl_1.recordsRepositoryImpl)(d.host, { cwd: projectPath, home: d.home, projectPath: projectPath, projectName: name, file: realm.file, offsetMinutes: d.offsetMinutes(), options: (0, options_1.readOptions)({}) });
                return [2 /*return*/, { projectPath: projectPath, records: records }];
        }
    });
}); };
var setTaskLog = function (d, key, path) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.setTaskLog, function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, projectPath, records, checked, saved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, realmRecords(d, key)];
                case 1:
                    _a = _b.sent(), projectPath = _a.projectPath, records = _a.records;
                    checked = (0, task_input_1.logPathIn)(path, projectPath);
                    if (checked === null)
                        throw new reply_1.Refusal(messages_1.MESSAGES.logPathRequired);
                    return [4 /*yield*/, records.update(function (r) { return (__assign(__assign({}, r), { docsLogPath: checked })); })];
                case 2:
                    saved = _b.sent();
                    if (saved === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    return [2 /*return*/, null];
            }
        });
    }); });
};
exports.setTaskLog = setTaskLog;
var setGitMode = function (d, key, mode) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.setGitMode, function () { return __awaiter(void 0, void 0, void 0, function () {
        var records, saved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, git_mode_1.isGitMode)(mode))
                        throw new reply_1.Refusal(messages_1.MESSAGES.gitModeInvalid);
                    return [4 /*yield*/, realmRecords(d, key)];
                case 1:
                    records = (_a.sent()).records;
                    return [4 /*yield*/, records.update(function (r) { return (__assign(__assign({}, r), { gitMode: mode })); })];
                case 2:
                    saved = _a.sent();
                    if (saved === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.unreadableRealm);
                    d.log.debug("git mode of ".concat(String(key), " set to ").concat(mode));
                    return [2 /*return*/, null];
            }
        });
    }); });
};
exports.setGitMode = setGitMode;
// By key and never by path: the window can't ask for anything but a record.
var showRecord = function (d, key) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.showRecord, function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = d).reveal;
                    return [4 /*yield*/, realmFile(d, key)];
                case 1:
                    _b.apply(_a, [(_c.sent()).file]);
                    return [2 /*return*/, null];
            }
        });
    }); });
};
exports.showRecord = showRecord;
// The repository's top folder, as a session in it would use; a folder outside
// one stands for itself. Worked out the same for a dialog and for a link.
var placeOf = function (d, path) { return __awaiter(void 0, void 0, void 0, function () {
    var top, root, place, key;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, d.host.run(['git', 'rev-parse', '--show-toplevel'], path)];
            case 1:
                top = _b.sent();
                root = top.exitCode === 0 ? top.stdout.trim() : '';
                place = root === '' ? path : root;
                key = (0, record_source_1.projectKey)(place);
                _a = { path: place, name: nameOf(place), key: key };
                return [4 /*yield*/, d.host.exists(fileOf(d, key))];
            case 2: return [2 /*return*/, (_a.isKnown = _b.sent(), _a.isRepo = root !== '', _a)];
        }
    });
}); };
exports.placeOf = placeOf;
var openFolder = function (d) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.openFolder, function () { return __awaiter(void 0, void 0, void 0, function () {
        var picked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, d.pickFolder()];
                case 1:
                    picked = _a.sent();
                    return [2 /*return*/, picked === null ? null : (0, exports.placeOf)(d, picked)];
            }
        });
    }); });
};
exports.openFolder = openFolder;
// The record goes in ~/.queue-tea and nothing is written in the folder. One
// already there is left as it is.
var addProject = function (d, path) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.addProject, function () { return __awaiter(void 0, void 0, void 0, function () {
        var place, made;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof path !== 'string' || !path.startsWith('/'))
                        throw new reply_1.Refusal(messages_1.MESSAGES.badFolder);
                    return [4 /*yield*/, d.host.exists(path)];
                case 1:
                    if (!(_a.sent()))
                        throw new reply_1.Refusal(messages_1.MESSAGES.badFolder);
                    return [4 /*yield*/, (0, exports.placeOf)(d, path)];
                case 2:
                    place = _a.sent();
                    if (place.isKnown)
                        return [2 /*return*/, place.key];
                    return [4 /*yield*/, d.host.makeDirs((0, constants_1.projectsFolder)(d.home))];
                case 3:
                    made = _a.sent();
                    if (made.exitCode !== 0)
                        throw new Error(made.stderr);
                    return [4 /*yield*/, d.host.write(fileOf(d, place.key), JSON.stringify((0, record_source_1.emptyRecord)(place.name, place.path), null, 2))];
                case 4:
                    _a.sent();
                    return [2 /*return*/, place.key];
            }
        });
    }); });
};
exports.addProject = addProject;
// Gives the name the broken record is kept under. restoreRecord itself refuses
// a newer record, whose copy would lose the newer work.
var restoreRealm = function (d, key) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.restoreRealm, function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, stamp, restored;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, realmFile(d, key)];
                case 1:
                    file = (_a.sent()).file;
                    stamp = (0, time_1.isoLocal)(d.now(), d.offsetMinutes()).slice(0, 19).replace(/:/g, '-');
                    return [4 /*yield*/, (0, record_source_1.restoreRecord)(d.host, file, stamp)];
                case 2:
                    restored = _a.sent();
                    if (restored === 'no-copy')
                        throw new reply_1.Refusal(messages_1.MESSAGES.noGoodCopy);
                    return [2 /*return*/, restored === 'readable' ? '' : restored.keptAt.split('/').pop()];
            }
        });
    }); });
};
exports.restoreRealm = restoreRealm;
