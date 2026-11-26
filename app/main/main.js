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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var electron_1 = require("electron");
var engine_api_1 = require("../shared/engine_api");
var note_attachments_1 = require("../shared/note_attachments");
var app_menu_1 = require("./core/app_menu");
var constants_1 = require("./core/constants");
var flavor_1 = require("./core/flavor");
var logger_1 = require("./core/logger");
var messages_1 = require("./core/messages");
var node_host_1 = require("./core/node_host");
var setup_1 = require("./features/codex/data/setup");
var stream_process_1 = require("./core/stream_process");
var mac_1 = require("./core/platform/mac");
var reply_1 = require("./core/reply");
var watcher_1 = require("./core/watcher");
var chronicle_api_1 = require("./features/chronicle/api/chronicle_api");
var game_api_1 = require("./features/game/api/game_api");
var mana_api_1 = require("./features/mana/api/mana_api");
var github_api_1 = require("./features/github/api/github_api");
var calendar_api_1 = require("./features/calendar/api/calendar_api");
var library_api_1 = require("./features/library/api/library_api");
var notes_api_1 = require("./features/notes/api/notes_api");
var note_protocol_1 = require("./features/notes/api/note_protocol");
var designs_api_1 = require("./features/designs/api/designs_api");
var helpers_api_1 = require("./features/helpers/api/helpers_api");
var judgements_1 = require("./features/notify/domain/judgements");
var opening_api_1 = require("./features/opening/api/opening_api");
var projects_source_1 = require("./features/projects/data/projects_source");
var projects_api_1 = require("./features/projects/api/projects_api");
var realms = require("./features/realms/api/realms_api");
var settings_api_1 = require("./features/settings/api/settings_api");
var back = require("./features/tasks/api/back_api");
var detail_api_1 = require("./features/tasks/api/detail_api");
var finish = require("./features/tasks/api/finish_api");
var live = require("./features/tasks/api/live_api");
var branches = require("./features/branches/api/branch_api");
var space = require("./features/branches/api/space_api");
var checks_api_1 = require("./features/branches/api/checks_api");
var commit_api_1 = require("./features/branches/api/commit_api");
var push_api_1 = require("./features/branches/api/push_api");
var user_git_1 = require("./features/branches/data/user_git");
var setOut = require("./features/tasks/api/start_api");
var tasks = require("./features/tasks/api/tasks_api");
var bundle_1 = require("./features/update/data/bundle");
var update_watch_1 = require("./features/update/domain/update_watch");
var update_service_1 = require("./features/update/data/update_service");
var session_rules_1 = require("../../hooks/shared/sessions/domain/services/session_rules");
// How often the window hears from main with no file event, so a session that
// stopped sending heartbeats goes stale on screen.
var SWEEP_MS = 5000;
var STALE_CHECK_MS = 30000;
var flavor = (0, flavor_1.flavorOf)((_a = process.env.QUEUE_TEA_FLAVOR) !== null && _a !== void 0 ? _a : (QUEUE_TEA_BUILT_FLAVOR || undefined), electron_1.app.isPackaged);
electron_1.protocol.registerSchemesAsPrivileged([{ scheme: note_attachments_1.NOTE_FILE_SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true } }]);
electron_1.app.on('before-quit', stream_process_1.stopProcesses);
electron_1.app.setAppUserModelId((0, flavor_1.appIdOf)(flavor));
electron_1.app.setName(flavor === 'prod' ? 'Queue-tea' : "Queue-tea ".concat(flavor));
var userData = (_b = process.env.QUEUE_TEA_USER_DATA) !== null && _b !== void 0 ? _b : (0, node_path_1.join)(electron_1.app.getPath('appData'), electron_1.app.getName());
electron_1.app.setPath('userData', userData);
var logFile = (0, node_path_1.join)(electron_1.app.getPath('logs'), constants_1.LOG_FILE);
var log = (0, logger_1.createLogger)(flavor, (0, logger_1.fileSink)(logFile, flavor));
// Whatever slips through is logged, so nothing fails silently.
process.on('uncaughtException', function (err) { return log.error('uncaught exception in main', err); });
process.on('unhandledRejection', function (err) { return log.error('unhandled rejection in main', err); });
var home = ((_c = process.env.HOME) !== null && _c !== void 0 ? _c : electron_1.app.getPath('home')).replace(/\/+$/, '');
var host = (0, node_host_1.nodeHost)(log, function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, electron_1.shell.openExternal(url)];
            case 1:
                _a.sent();
                return [2 /*return*/, { exitCode: 0, stdout: '', stderr: '' }];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, { exitCode: 1, stdout: '', stderr: err_1 instanceof Error ? err_1.message : String(err_1) }];
            case 3: return [2 /*return*/];
        }
    });
}); });
var projects = { host: host, home: home, now: function () { return Date.now(); }, log: log };
var game = __assign(__assign({}, projects), { offsetMinutes: function () { return -new Date().getTimezoneOffset(); } });
var settings = { host: host, file: (0, node_path_1.join)(electron_1.app.getPath('userData'), constants_1.SETTINGS_FILE), log: log };
var quests = __assign(__assign({}, game), { newId: function () { return "t-".concat((0, node_crypto_1.randomBytes)(4).toString('hex')); }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () {
        var chosen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, settings_api_1.readSettings)(settings)];
                case 1:
                    chosen = _a.sent();
                    return [2 /*return*/, chosen.ok ? chosen.data.terminal : settings_api_1.DEFAULT_SETTINGS.terminal];
            }
        });
    }); }, copy: function (text) { return electron_1.clipboard.writeText(text); }, prepareCodex: function (path) { return __awaiter(void 0, void 0, void 0, function () {
        var server, companions, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    server = electron_1.app.isPackaged ? (0, node_path_1.join)(process.resourcesPath, 'codex/server.cjs') : (0, node_path_1.join)(__dirname, '../codex/server.cjs');
                    return [4 /*yield*/, host.exists(server)];
                case 1:
                    if (!(_a.sent()))
                        throw new Error('Build the Queue-tea Codex server before opening a session.');
                    return [4 /*yield*/, (0, setup_1.installCodexSkills)((0, node_path_1.join)(home, '.agents/skills'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, setup_1.linkCompanionSkills)((0, node_path_1.join)(home, '.agents/skills'), home)];
                case 3:
                    companions = _a.sent();
                    if (companions.missing.length > 0)
                        log.warn("Codex companion skills unavailable: ".concat(companions.missing.join(', ')));
                    return [2 /*return*/, (0, setup_1.codexConfigArgs)({ command: process.execPath, server: server, electron: true }, path)];
                case 4:
                    err_2 = _a.sent();
                    log.error('preparing Queue-tea for Codex failed', err_2);
                    throw err_2;
                case 5: return [2 /*return*/];
            }
        });
    }); } });
var branchActions = __assign(__assign({}, quests), { userGit: (0, user_git_1.nodeUserGit)(log), reveal: function (path) { return electron_1.shell.showItemInFolder(path); }, published: function (repo, remote, branch, commit) { return updates.published(repo, remote, branch, commit); } });
var places = __assign(__assign({}, game), { commandDirs: ['/usr/local/bin', '/opt/homebrew/bin', "".concat(home, "/.local/bin")], reveal: function (path) { return electron_1.shell.showItemInFolder(path); }, pickFolder: function (buttonLabel) { return __awaiter(void 0, void 0, void 0, function () {
        var window, options, picked, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    window = electron_1.BrowserWindow.getFocusedWindow();
                    options = { buttonLabel: buttonLabel, properties: ['openDirectory', 'createDirectory'] };
                    if (!(window === null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, electron_1.dialog.showOpenDialog(options)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, electron_1.dialog.showOpenDialog(window, options)];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    picked = _a;
                    return [2 /*return*/, picked.canceled ? null : ((_b = picked.filePaths[0]) !== null && _b !== void 0 ? _b : null)];
            }
        });
    }); } });
var github = (0, github_api_1.githubApi)({ host: host, home: home, log: log, ghPaths: __spreadArray(["".concat(home, "/.local/bin/gh")], constants_1.GH_PATHS, true), codeWaitMs: constants_1.GH_CODE_WAIT_MS, loginWaitMs: constants_1.GH_LOGIN_WAIT_MS });
var library = (0, library_api_1.libraryApi)(__assign(__assign({}, game), { newId: function () { return "b-".concat((0, node_crypto_1.randomBytes)(4).toString('hex')); } }));
var calendar = (0, calendar_api_1.calendarApi)(__assign(__assign({}, projects), { newId: function () { return "e-".concat((0, node_crypto_1.randomBytes)(4).toString('hex')); } }));
var notes = (0, notes_api_1.notesApi)(__assign(__assign({}, quests), { newNoteId: function () { return "n-".concat((0, node_crypto_1.randomBytes)(4).toString('hex')); }, reveal: function (path) { return electron_1.shell.showItemInFolder(path); }, pickFolder: places.pickFolder, saveNoteFile: function (name, bytes) { return __awaiter(void 0, void 0, void 0, function () {
        var window, options, picked, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    window = electron_1.BrowserWindow.getFocusedWindow();
                    options = { defaultPath: name };
                    if (!(window === null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, electron_1.dialog.showSaveDialog(options)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, electron_1.dialog.showSaveDialog(window, options)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    picked = _a;
                    if (picked.canceled || picked.filePath === undefined)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, (0, promises_1.writeFile)(picked.filePath, bytes)];
                case 5:
                    _b.sent();
                    return [2 /*return*/, true];
            }
        });
    }); } }));
// Each change to a helper's work goes to every window as it happens.
var helpers = (0, helpers_api_1.helpersApi)(__assign(__assign({}, quests), { stream: stream_process_1.streamProcess, tell: function (jobs) {
        for (var _i = 0, _a = electron_1.BrowserWindow.getAllWindows(); _i < _a.length; _i++) {
            var window_1 = _a[_i];
            window_1.webContents.send(engine_api_1.CHANNELS.helpers, jobs);
        }
    } }));
var designs = (0, designs_api_1.designsApi)(__assign(__assign({}, quests), { reveal: function (path) { return electron_1.shell.showItemInFolder(path); }, listFolders: function (dir) { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.readdir)(dir, { withFileTypes: true })];
                case 1: return [2 /*return*/, (_a.sent()).filter(function (e) { return e.isDirectory(); }).map(function (e) { return e.name; })];
                case 2:
                    err_3 = _a.sent();
                    // A realm with no docs/designs yet has no designs; anything else is a fault.
                    if (err_3.code === 'ENOENT')
                        return [2 /*return*/, []];
                    throw err_3;
                case 3: return [2 /*return*/];
            }
        });
    }); } }));
// Engine calls still changing something. A restart in the middle of one could
// lose a save; one that only reads is read again by the new copy, and the
// window reads every 30 s, so counting reads would hold an update off for good.
var callsRunning = 0;
var READS = /^engine:(list|read|check)-/;
var handle = function (channel, work) {
    return electron_1.ipcMain.handle(channel, function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var allowed;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        allowed = (_a = process.env.ELECTRON_RENDERER_URL) !== null && _a !== void 0 ? _a : (0, node_url_1.pathToFileURL)((0, node_path_1.join)(__dirname, '../renderer/index.html')).href;
                        if (event.senderFrame !== event.sender.mainFrame || ((_b = event.senderFrame) === null || _b === void 0 ? void 0 : _b.url.split('#')[0]) !== new URL(allowed).href.split('#')[0]) {
                            log.warn("Refused engine request from an unexpected frame: ".concat(channel));
                            return [2 /*return*/, { ok: false, error: { message: messages_1.MESSAGES.badValue } }];
                        }
                        if (READS.test(channel) || channel === engine_api_1.CHANNELS.applyAppUpdate)
                            return [2 /*return*/, work.apply(void 0, __spreadArray([event], args, false))];
                        callsRunning += 1;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, work.apply(void 0, __spreadArray([event], args, false))];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3:
                        callsRunning -= 1;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
};
var serveEngine = function () {
    handle(engine_api_1.CHANNELS.readAppUpdate, function () { return (0, reply_1.reply)(log, messages_1.UPDATE_TEXT.failed, updates.read); });
    handle(engine_api_1.CHANNELS.applyAppUpdate, function () { return (0, reply_1.reply)(log, messages_1.UPDATE_TEXT.failed, updates.apply); });
    handle(engine_api_1.CHANNELS.listProjects, function () { return (0, projects_api_1.listProjects)(projects); });
    handle(engine_api_1.CHANNELS.readProject, function (_, key) { return (0, projects_api_1.readProject)(projects, key); });
    handle(engine_api_1.CHANNELS.readGame, function () { return (0, game_api_1.readGame)(game); });
    handle(engine_api_1.CHANNELS.readHoard, function () { return (0, game_api_1.readHoard)(game); });
    handle(engine_api_1.CHANNELS.readChronicle, function (_, scope, day) { return (0, chronicle_api_1.readChronicle)(game, scope, day); });
    handle(engine_api_1.CHANNELS.readMana, function (_, key) { return (0, mana_api_1.readMana)(quests, key); });
    handle(engine_api_1.CHANNELS.readDesigns, function (_, key) { return designs.readDesigns(key); });
    handle(engine_api_1.CHANNELS.readDesignVersion, function (_, key, folder) { return designs.readDesignVersion(key, folder); });
    handle(engine_api_1.CHANNELS.readDesign, function (_, key, folder, id) { return designs.readDesign(key, folder, id); });
    handle(engine_api_1.CHANNELS.saveDesign, function (_, key, folder, id, scene, stamp) { return designs.saveDesign(key, folder, id, scene, stamp); });
    handle(engine_api_1.CHANNELS.saveDesignCopy, function (_, key, folder, id, scene) { return designs.saveDesignCopy(key, folder, id, scene); });
    handle(engine_api_1.CHANNELS.restoreDesignFile, function (_, key, folder, file) { return designs.restoreDesignFile(key, folder, file); });
    handle(engine_api_1.CHANNELS.addDesignComment, function (_, key, folder, comment) { return designs.addDesignComment(key, folder, comment); });
    handle(engine_api_1.CHANNELS.setDesignComment, function (_, key, folder, id, isResolved) { return designs.setDesignComment(key, folder, id, isResolved); });
    handle(engine_api_1.CHANNELS.sendDesignComments, function (_, key, folder, next) { return designs.sendDesignComments(key, folder, next); });
    handle(engine_api_1.CHANNELS.setDesignApproval, function (_, key, folder, isApproved) { return designs.setDesignApproval(key, folder, isApproved); });
    handle(engine_api_1.CHANNELS.showDesigns, function (_, key) { return designs.showDesigns(key); });
    handle(engine_api_1.CHANNELS.readSettings, function () { return (0, settings_api_1.readSettings)(settings); });
    handle(engine_api_1.CHANNELS.saveSettings, function (_, patch) { return (0, settings_api_1.saveSettings)(settings, patch); });
    handle(engine_api_1.CHANNELS.readSettingsPage, function (_, key) { return realms.readSettingsPage(places, key); });
    handle(engine_api_1.CHANNELS.setTaskLog, function (_, key, path) { return realms.setTaskLog(places, key, path); });
    handle(engine_api_1.CHANNELS.setGitMode, function (_, key, mode) { return realms.setGitMode(places, key, mode); });
    handle(engine_api_1.CHANNELS.showRecord, function (_, key) { return realms.showRecord(places, key); });
    handle(engine_api_1.CHANNELS.openFolder, function () { return realms.openFolder(places); });
    handle(engine_api_1.CHANNELS.addProject, function (_, path) { return realms.addProject(places, path); });
    handle(engine_api_1.CHANNELS.restoreRealm, function (_, key) { return realms.restoreRealm(places, key); });
    handle(engine_api_1.CHANNELS.installCommand, function () { return (0, opening_api_1.installCommand)(places); });
    handle(engine_api_1.CHANNELS.readGithub, function () { return github.readGithub(); });
    handle(engine_api_1.CHANNELS.startGithubLogin, function () { return github.startGithubLogin(); });
    handle(engine_api_1.CHANNELS.openGithubLogin, function () { return github.openGithubLogin(); });
    handle(engine_api_1.CHANNELS.awaitGithubLogin, function () { return github.awaitGithubLogin(); });
    handle(engine_api_1.CHANNELS.cancelGithubLogin, function () { return github.cancelGithubLogin(); });
    handle(engine_api_1.CHANNELS.readLibrary, function () { return library.readLibrary(); });
    handle(engine_api_1.CHANNELS.addBook, function (_, book) { return library.addBook(book); });
    handle(engine_api_1.CHANNELS.setBookPage, function (_, id, page) { return library.setBookPage(id, page); });
    handle(engine_api_1.CHANNELS.finishBook, function (_, id) { return library.finishBook(id); });
    handle(engine_api_1.CHANNELS.removeBook, function (_, id) { return library.removeBook(id); });
    handle(engine_api_1.CHANNELS.readNotes, function (_, key) { return notes.readNotes(key); });
    handle(engine_api_1.CHANNELS.readNoteHistory, function (_, key, id) { return notes.readNoteHistory(key, id); });
    handle(engine_api_1.CHANNELS.readNoteVersion, function (_, key, id, version) { return notes.readNoteVersion(key, id, version); });
    handle(engine_api_1.CHANNELS.restoreNoteVersion, function (_, key, id, version, stamp) { return notes.restoreNoteVersion(key, id, version, stamp); });
    handle(engine_api_1.CHANNELS.attachNoteFile, function (_, key, id, file) { return notes.attachNoteFile(key, id, file); });
    handle(engine_api_1.CHANNELS.readNoteFile, function (_, key, path) { return notes.readNoteFile(key, path); });
    handle(engine_api_1.CHANNELS.downloadNoteFile, function (_, key, path) { return notes.downloadNoteFile(key, path); });
    handle(engine_api_1.CHANNELS.showNotes, function (_, key) { return notes.showNotes(key); });
    handle(engine_api_1.CHANNELS.exportNotes, function (_, key) { return notes.exportNotes(key); });
    handle(engine_api_1.CHANNELS.restoreNotes, function (_, key) { return notes.restoreNotes(key); });
    handle(engine_api_1.CHANNELS.openLink, function (_, url) { return notes.openLink(url); });
    handle(engine_api_1.CHANNELS.readBookmark, function (_, url) { return notes.readBookmark(url); });
    handle(engine_api_1.CHANNELS.readCanvas, function (_, key) { return notes.readCanvas(key); });
    handle(engine_api_1.CHANNELS.saveCanvas, function (_, key, canvas, stamp) { return notes.saveCanvas(key, canvas, stamp); });
    handle(engine_api_1.CHANNELS.readCalendar, function (_, key) { return calendar.readCalendar(key); });
    handle(engine_api_1.CHANNELS.saveCalendarEvent, function (_, key, id, event) { return calendar.saveCalendarEvent(key, id, event); });
    handle(engine_api_1.CHANNELS.removeCalendarEvent, function (_, key, id) { return calendar.removeCalendarEvent(key, id); });
    handle(engine_api_1.CHANNELS.createNote, function (_, key, note) { return notes.createNote(key, note); });
    handle(engine_api_1.CHANNELS.saveNote, function (_, key, id, change, stamp) { return notes.saveNote(key, id, change, stamp); });
    handle(engine_api_1.CHANNELS.archiveNote, function (_, key, id, isArchived) { return notes.archiveNote(key, id, isArchived); });
    handle(engine_api_1.CHANNELS.renameFolder, function (_, key, from, to) { return notes.renameFolder(key, from, to); });
    handle(engine_api_1.CHANNELS.deleteNote, function (_, key, id) { return notes.deleteNote(key, id); });
    handle(engine_api_1.CHANNELS.fileNoteQuests, function (_, key, id, proposal) { return notes.fileNoteQuests(key, id, proposal); });
    handle(engine_api_1.CHANNELS.takeOpened, function () { return (0, reply_1.reply)(log, messages_1.MESSAGES.openFolder, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, takeOpened()];
    }); }); }); });
    handle(engine_api_1.CHANNELS.readChoices, function (_, key, taskId) { return tasks.readChoices(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.setPriority, function (_, key, taskId, priority) { return tasks.setPriority(quests, key, taskId, priority); });
    handle(engine_api_1.CHANNELS.togglePlayNext, function (_, key, taskId) { return tasks.togglePlayNext(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.fileQuest, function (_, key, quest) { return tasks.fileQuest(quests, key, quest); });
    handle(engine_api_1.CHANNELS.moveQuest, function (_, key, taskId, parentId) { return tasks.moveQuest(quests, key, taskId, parentId); });
    handle(engine_api_1.CHANNELS.sealQuest, function (_, key, taskId, seal) { return tasks.sealQuest(quests, key, taskId, seal); });
    handle(engine_api_1.CHANNELS.unsealQuest, function (_, key, taskId) { return tasks.unsealQuest(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.removeQuest, function (_, key, taskId) { return tasks.removeQuest(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.restoreQuest, function (_, key, taskId) { return tasks.restoreQuest(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.editQuest, function (_, key, taskId, edit) { return tasks.editQuest(quests, key, taskId, edit); });
    handle(engine_api_1.CHANNELS.setActiveSaga, function (_, key, taskId) { return tasks.setActiveSaga(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.setTimeBudget, function (_, key, budget) { return live.setTimeBudget(quests, key, budget); });
    handle(engine_api_1.CHANNELS.readLive, function (_, key) { return live.readLive(quests, key); });
    handle(engine_api_1.CHANNELS.readQuestFacts, function (_, key, taskId) { return (0, detail_api_1.readQuestFacts)(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.switchBranch, function (_, key) { return live.switchBranch(quests, key); });
    handle(engine_api_1.CHANNELS.readBranches, function (_, key) { return branches.readBranches(quests, key); });
    handle(engine_api_1.CHANNELS.readBranch, function (_, key, id, target) { return branches.readBranch(quests, key, id, target); });
    handle(engine_api_1.CHANNELS.readMergeWorkspace, function (_, key, id) { return branches.readMergeWorkspace(quests, key, id); });
    handle(engine_api_1.CHANNELS.prepareMerge, function (_, key, request) { return branches.prepareMerge(branchActions, key, request); });
    handle(engine_api_1.CHANNELS.resolveMergeFile, function (_, key, request) { return branches.resolveMergeFile(branchActions, key, request); });
    handle(engine_api_1.CHANNELS.completeMerge, function (_, key, request) { return branches.completeMerge(branchActions, key, request); });
    handle(engine_api_1.CHANNELS.abandonMerge, function (_, key, id) { return branches.abandonMerge(branchActions, key, id); });
    handle(engine_api_1.CHANNELS.runMergeChecks, function (_, key, request) { return (0, checks_api_1.runMergeChecks)(branchActions, key, request); });
    handle(engine_api_1.CHANNELS.cancelMergeChecks, function (_, key, id) { return (0, checks_api_1.cancelMergeChecks)(branchActions, key, id); });
    handle(engine_api_1.CHANNELS.openMergeFolder, function (_, key, id) { return branches.openMergeFolder(branchActions, key, id); });
    handle(engine_api_1.CHANNELS.commitBranchFiles, function (_, key, request) { return (0, commit_api_1.commitBranchFiles)(branchActions, key, request); });
    handle(engine_api_1.CHANNELS.readPush, function (_, key, id, remote) { return (0, push_api_1.readPush)(quests, key, id, remote); });
    handle(engine_api_1.CHANNELS.pushMerge, function (_, key, request) { return (0, push_api_1.pushMerge)(branchActions, key, request); });
    handle(engine_api_1.CHANNELS.readFolderSpace, function (_, key) { return space.readFolderSpace(quests, key); });
    handle(engine_api_1.CHANNELS.freeFolderSpace, function (_, key, paths) { return space.freeFolderSpace(quests, key, paths); });
    handle(engine_api_1.CHANNELS.removeTaskFolder, function (_, key, id) { return space.removeTaskFolder(quests, key, id); });
    handle(engine_api_1.CHANNELS.checkStart, function (_, key, taskId) { return setOut.checkStart(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.startQuest, function (_, key, taskId, platform) { return setOut.startQuest(quests, key, taskId, platform); });
    handle(engine_api_1.CHANNELS.openClaude, function (_, key, taskId) { return setOut.openClaude(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.continueIn, function (_, key, taskId, platform) { return setOut.continueIn(quests, key, taskId, platform); });
    handle(engine_api_1.CHANNELS.notYet, function (_, key, taskId) { return finish.notYet(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.finishQuest, function (_, key, taskId, actual, logPath) { return finish.finishQuest(quests, key, taskId, actual, logPath); });
    handle(engine_api_1.CHANNELS.retryTaskLog, function (_, key, taskId, path) { return finish.retryTaskLog(quests, key, taskId, path); });
    handle(engine_api_1.CHANNELS.putBackQuest, function (_, key, taskId, seal) { return back.putBackQuest(quests, key, taskId, seal); });
    handle(engine_api_1.CHANNELS.putBackNow, function (_, key, taskId) { return back.putBackNow(quests, key, taskId); });
    handle(engine_api_1.CHANNELS.copyText, function (_, text) { return setOut.copyText(quests, text); });
    handle(engine_api_1.CHANNELS.readHelpers, function () { return helpers.readHelpers(); });
    handle(engine_api_1.CHANNELS.sendHelper, function (_, key, helper, order) { return helpers.sendHelper(key, helper, order); });
    handle(engine_api_1.CHANNELS.concileMerge, function (_, key, helper, operationId) { return helpers.concileMerge(key, helper, operationId); });
    handle(engine_api_1.CHANNELS.stopHelper, function (_, helper) { return helpers.stopHelper(helper); });
    electron_1.ipcMain.on(engine_api_1.CHANNELS.log, function (_, level, text) {
        var line = "window: ".concat(String(text));
        if (level === 'warn')
            log.warn(line);
        else
            log.error(line);
    });
};
// Given after an update restart, so the window comes back where it was, and
// stays behind what you're using when you weren't using it.
var openWindow = function (restored) { return __awaiter(void 0, void 0, void 0, function () {
    var window, devServer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                window = new electron_1.BrowserWindow(__assign(__assign(__assign(__assign({}, constants_1.WINDOW), restored === null || restored === void 0 ? void 0 : restored.bounds), mac_1.windowChrome), { show: false, title: 'Queue-tea', webPreferences: { preload: (0, node_path_1.join)(__dirname, '../preload/preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false, plugins: true } }));
                window.once('ready-to-show', function () { return ((restored === null || restored === void 0 ? void 0 : restored.isInFront) === false ? window.showInactive() : window.show()); });
                window.once('closed', function () {
                    isWindowListening = false;
                });
                // Nothing inside the app navigates away from it.
                window.webContents.setWindowOpenHandler(function () { return ({ action: 'deny' }); });
                window.webContents.on('will-navigate', function (event) { return event.preventDefault(); });
                window.webContents.on('render-process-gone', function (_, details) { return log.error("the window's process ended: ".concat(details.reason)); });
                devServer = process.env.ELECTRON_RENDERER_URL;
                if (!(devServer !== undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, window.loadURL(devServer)];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, window.loadFile((0, node_path_1.join)(__dirname, '../renderer/index.html'), { hash: restored === null || restored === void 0 ? void 0 : restored.hash })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/, window];
        }
    });
}); };
// What a link or a notification brought, until the window is there to hear it.
// A link that launches the app arrives before there is a window at all.
var inbox = [];
var isWindowListening = false;
var takeOpened = function () {
    isWindowListening = true;
    var taken = inbox;
    inbox = [];
    return taken;
};
var bringForward = function () { return __awaiter(void 0, void 0, void 0, function () {
    var window;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!electron_1.app.isReady())
                    return [2 /*return*/];
                window = electron_1.BrowserWindow.getAllWindows()[0];
                if (!(window === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, openWindow()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                window.show();
                _a.label = 3;
            case 3:
                electron_1.app.focus({ steal: true });
                return [2 /*return*/];
        }
    });
}); };
var deliver = function (opened) {
    var window = electron_1.BrowserWindow.getAllWindows()[0];
    if (isWindowListening && window !== undefined)
        window.webContents.send(engine_api_1.CHANNELS.opened, opened);
    else
        inbox.push(opened);
    bringForward().catch(function (err) { return log.error('bringing the window forward failed', err); });
};
// Before it's ready, so a link that launches the app isn't lost.
electron_1.app.on('open-url', function (event, url) {
    event.preventDefault();
    (0, opening_api_1.openedFromUrl)(places, url)
        .then(deliver)
        .catch(function (err) { return log.error('opening a link failed', err); });
});
// Held on to, or the click never comes back.
var shown = new Set();
var notifyJudgement = function (asked) {
    if (!electron_1.Notification.isSupported())
        return;
    var notification = new electron_1.Notification({ title: electron_1.app.getName(), body: messages_1.MESSAGES.judgement(asked.title) });
    shown.add(notification);
    notification.on('click', function () {
        shown.delete(notification);
        deliver({ kind: 'judgement', key: asked.key });
    });
    notification.on('close', function () { return shown.delete(notification); });
    notification.show();
};
var checkJudgements = (0, judgements_1.judgementWatch)({ scan: function () { return (0, projects_source_1.scanRecords)(host, home, log); }, isAway: function () { return electron_1.BrowserWindow.getFocusedWindow() === null; }, notify: notifyJudgement, log: log });
var tellWindows = function () {
    for (var _i = 0, _a = electron_1.BrowserWindow.getAllWindows(); _i < _a.length; _i++) {
        var window_2 = _a[_i];
        window_2.webContents.send(engine_api_1.CHANNELS.changed);
    }
    void checkJudgements();
};
var sendMenu = function (item) { var _a, _b; return (_b = ((_a = electron_1.BrowserWindow.getFocusedWindow()) !== null && _a !== void 0 ? _a : electron_1.BrowserWindow.getAllWindows()[0])) === null || _b === void 0 ? void 0 : _b.webContents.send(engine_api_1.CHANNELS.menu, item); };
// The bundle this app runs from: an install swaps a new one in under it.
var bundle = (0, node_path_1.resolve)(electron_1.app.getPath('exe'), '../../..');
var restartFile = (0, node_path_1.join)(electron_1.app.getPath('userData'), constants_1.RESTART_FILE);
var restart = function (isInFront) { return __awaiter(void 0, void 0, void 0, function () {
    var window, restored, relaunched;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                window = electron_1.BrowserWindow.getAllWindows()[0];
                restored = window === undefined ? null : { hash: new URL(window.webContents.getURL()).hash, bounds: window.getBounds(), isInFront: isInFront };
                return [4 /*yield*/, host.write(restartFile, JSON.stringify(restored))];
            case 1:
                _a.sent();
                return [4 /*yield*/, host.run((0, bundle_1.relaunchArgv)(process.pid, bundle, isInFront))];
            case 2:
                relaunched = _a.sent();
                if (relaunched.exitCode !== 0)
                    throw new Error(relaunched.stderr);
                electron_1.app.exit(0);
                return [2 /*return*/];
        }
    });
}); };
var askRestart = function (version) { return __awaiter(void 0, void 0, void 0, function () {
    var options, window, response, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                options = { type: 'info', message: messages_1.UPDATE_TEXT.ready(version), detail: messages_1.UPDATE_TEXT.detail, buttons: [messages_1.UPDATE_TEXT.restartNow, messages_1.UPDATE_TEXT.later], defaultId: 0, cancelId: 1 };
                window = electron_1.BrowserWindow.getAllWindows()[0];
                if (!(window === undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, electron_1.dialog.showMessageBox(options)];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, electron_1.dialog.showMessageBox(window, options)];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                response = (_a).response;
                return [2 /*return*/, response === 0];
        }
    });
}); };
var isUpdateBusy = function () { return __awaiter(void 0, void 0, void 0, function () {
    var window, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // A restart would end a helper's order half done.
                if (callsRunning > 0 || helpers.isBusy())
                    return [2 /*return*/, true];
                window = electron_1.BrowserWindow.getAllWindows()[0];
                _a = window !== undefined;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, window.webContents.executeJavaScript(constants_1.BUSY_PROBE)];
            case 1:
                _a = (_b.sent()) === true;
                _b.label = 2;
            case 2: return [2 /*return*/, _a];
        }
    });
}); };
var runningBuild = { version: electron_1.app.getVersion(), commit: QUEUE_TEA_SOURCE.commit };
var installedBuild = function () { return __awaiter(void 0, void 0, void 0, function () {
    var version, _a, file, commit, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = bundle_1.versionOfPlist;
                return [4 /*yield*/, host.read((0, node_path_1.join)(bundle, 'Contents/Info.plist'))];
            case 1:
                version = _a.apply(void 0, [_d.sent()]);
                if (version === null)
                    return [2 /*return*/, null];
                file = (0, node_path_1.join)(bundle, 'Contents/Resources/provenance.json');
                return [4 /*yield*/, host.exists(file)];
            case 2:
                if (!(_d.sent())) return [3 /*break*/, 4];
                _c = bundle_1.commitOfProvenance;
                return [4 /*yield*/, host.read(file)];
            case 3:
                _b = _c.apply(void 0, [_d.sent()]);
                return [3 /*break*/, 5];
            case 4:
                _b = null;
                _d.label = 5;
            case 5:
                commit = _b;
                return [2 /*return*/, { version: version, commit: commit }];
        }
    });
}); };
var updates = (0, update_service_1.updateService)({ running: runningBuild, repository: QUEUE_TEA_SOURCE.repository, enabled: electron_1.app.isPackaged && flavor === 'prod',
    tools: electron_1.app.isPackaged ? (0, node_path_1.join)(process.resourcesPath, 'update-tools') : (0, node_path_1.resolve)(__dirname, '../../tools'),
    isBusy: isUpdateBusy, installed: installedBuild, restart: function () { return restart(true); }, log: log });
var checkUpdate = (0, update_watch_1.updateWatch)({
    running: runningBuild,
    installed: function () { return __awaiter(void 0, void 0, void 0, function () { var state; return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, updates.read()];
            case 1:
                state = _a.sent();
                return [2 /*return*/, state.canRestart ? state.installed : null];
        }
    }); }); },
    isAway: function () { return electron_1.BrowserWindow.getFocusedWindow() === null; },
    isBusy: isUpdateBusy,
    ask: askRestart,
    restart: restart,
    log: log,
});
// Read once, after an update restart; any other launch has no file.
var takeRestored = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, host.exists(restartFile)];
            case 1:
                if (!(_b.sent()))
                    return [2 /*return*/, undefined];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, 5, 7]);
                _a = bundle_1.restoredOf;
                return [4 /*yield*/, host.read(restartFile)];
            case 3: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
            case 4:
                err_4 = _b.sent();
                log.error('reading where the window was before the update failed', err_4);
                return [2 /*return*/, undefined];
            case 5: return [4 /*yield*/, host.remove(restartFile)];
            case 6:
                _b.sent();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var restored, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                electron_1.protocol.handle(note_attachments_1.NOTE_FILE_SCHEME, function (request) { return (0, note_protocol_1.noteFileResponse)(request.url, notes); });
                serveEngine();
                electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate((0, app_menu_1.appMenu)(electron_1.app.getName(), flavor === 'dev', sendMenu)));
                return [4 /*yield*/, takeRestored()
                    // Closed before the restart: it stays closed until the Dock icon opens it.
                ];
            case 1:
                restored = _a.sent();
                if (!(restored !== null)) return [3 /*break*/, 3];
                return [4 /*yield*/, openWindow(restored)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, checkJudgements()];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, (0, watcher_1.watchFolders)([(0, constants_1.projectsFolder)(home), (0, session_rules_1.sessionsFolder)(home)], tellWindows, { settleMs: constants_1.WATCH_SETTLE_MS, sweepMs: SWEEP_MS, log: log })];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                err_5 = _a.sent();
                log.error("watching ~/.queue-tea failed, so changes show when the app is reopened", err_5);
                return [3 /*break*/, 8];
            case 8:
                setInterval(tellWindows, STALE_CHECK_MS);
                // Only a packaged app has a bundle that an install replaces.
                if (electron_1.app.isPackaged && flavor === 'prod')
                    setInterval(function () { return void checkUpdate(); }, constants_1.UPDATE_CHECK_MS);
                return [2 /*return*/];
        }
    });
}); };
electron_1.app
    .whenReady()
    .then(start)
    .catch(function (err) {
    // The logger may be the thing that failed, so this one goes straight down.
    (0, node_fs_1.appendFileSync)(logFile, "".concat(String(err), "\n"));
    electron_1.app.quit();
});
// A sign-in doesn't outlive the app.
electron_1.app.on('before-quit', function () { return github.stopGithubLogin(); });
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        openWindow().catch(function (err) { return log.error('opening a window failed', err); });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
