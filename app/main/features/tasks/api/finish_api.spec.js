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
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var fixtures_1 = require("./fixtures");
var finish_api_1 = require("./finish_api");
var KEY = 'demo-abc123';
var NOW = Date.parse('2026-10-27T17:50:00Z');
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var file;
var deps;
var logged = [];
var seed = function (over) { return (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', repo)), over))); };
var onDisk = function () { return __awaiter(void 0, void 0, void 0, function () {
    var read, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = record_source_1.parseRecord;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 1:
                read = _a.apply(void 0, [_b.sent()]);
                if (read === 'unreadable')
                    throw new Error('should read');
                return [2 /*return*/, read];
        }
    });
}); };
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var refused = function (answer) {
    if (answer.ok)
        throw new Error('should be refused');
    return answer.error.message;
};
var active = function (over) { return (0, fixtures_1.makeTask)(__assign({ state: 'current', started: '2026-10-27T16:00:00+01:00' }, over)); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-finish-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                repo = (0, node_path_1.join)(home, 'repo');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 4:
                _b.sent();
                logged.length = 0;
                log = (0, logger_1.createLogger)('dev', function (line) { return logged.push(line); });
                deps = {
                    host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }),
                    home: home,
                    now: function () { return NOW; },
                    log: log,
                    offsetMinutes: function () { return 60; },
                    newId: function () { return 'q-1'; },
                    terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); },
                    copy: function () { },
                };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('Not yet', function () {
    (0, vitest_1.it)('clears the review and leaves the quest active', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ id: 'one', review: { at: 'now', checked: 'tests pass' } })] })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.notYet)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0]]).toMatchObject({ state: 'current', review: null });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Finish quest', function () {
    (0, vitest_1.it)('saves the win with the difficulty chosen, and adds the log row', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: 'docs/task_log.md', tasks: [active({ id: 'one', title: 'Fix it', priority: 'high', minutesByDay: { '2026-10-27': 14 }, review: { at: 'now', checked: null } })] })];
                case 1:
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'hard', null)];
                case 2:
                    outcome = _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_d.sent()).tasks[0]]).toMatchObject({ state: 'done', finished: '2026-10-27T18:50:00+01:00', review: null, difficulty: { expected: 'medium', actual: 'hard' } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'docs/task_log.md'), 'utf8')];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toContain('| Fix it | High | Medium → Hard | 14m |');
                    (0, vitest_1.expect)(outcome).toMatchObject({ logPath: 'docs/task_log.md', logFailedAt: null, minutes: 14, victory: { xp: 50, title: 'Fix it' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('measures the lines from git', function () { return __awaiter(void 0, void 0, void 0, function () {
        var startCommit, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, run('git', ['init', '-b', 'main'], { cwd: repo })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['config', 'user.email', 'test@example.com'], { cwd: repo })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['config', 'user.name', 'Test'], { cwd: repo })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\n')];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['add', '.'], { cwd: repo })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['commit', '-m', 'first'], { cwd: repo })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['rev-parse', 'HEAD'], { cwd: repo })];
                case 7:
                    startCommit = (_c.sent()).stdout.trim();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\nb\nc\n')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, seed({ docsLogPath: 'docs/task_log.md', tasks: [active({ id: 'one', startCommit: startCommit })] })];
                case 9:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 10:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 11:
                    _b.apply(void 0, [(_c.sent()).tasks[0].effort]).toMatchObject({ linesAdded: 2, linesRemoved: 0, filesTouched: 1 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the path given on the first finish, and logs there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ id: 'one', title: 'Fix it' })] })];
                case 1:
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', 'notes/log.md')];
                case 2:
                    outcome = _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_d.sent()).docsLogPath]).toBe('notes/log.md');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'notes/log.md'), 'utf8')];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toContain('| Fix it |');
                    (0, vitest_1.expect)(outcome.logPath).toBe('notes/log.md');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks for the path before changing anything when there is none', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ id: 'one' })] })];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe('Task log path is required.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_d.sent()).tasks[0].state]).toBe('current');
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a blank path', '   ', 'Task log path is required.'],
        ['a folder', 'docs/', 'Enter a file path, such as docs/task_log.md.'],
        ['two lines', 'docs/a\nb.md', 'Enter a file path, such as docs/task_log.md.'],
    ])('refuses %s, and changes nothing', function (_, path, message) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ id: 'one' })] })];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', path)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(message);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_e.sent()).tasks[0].state]).toBe('current');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _d.apply(void 0, [(_e.sent()).docsLogPath]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a first log path into another project, and writes nothing there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var other, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ id: 'one' })] })];
                case 1:
                    _d.sent();
                    other = (0, node_path_1.join)(home, 'other-project');
                    return [4 /*yield*/, (0, promises_1.mkdir)(other)];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', '../other-project/task_log.md')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe("The task log has to stay inside this realm's folder.");
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _c.apply(void 0, [(_d.sent()).tasks[0].state]).toBe('current');
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readFile)((0, node_path_1.join)(other, 'task_log.md'), 'utf8')).rejects.toThrow()];
                case 5:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays won, and writes nothing, when a record already holds a path outside', function () { return __awaiter(void 0, void 0, void 0, function () {
        var other, outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: '../other-project/task_log.md', tasks: [active({ id: 'one' })] })];
                case 1:
                    _c.sent();
                    other = (0, node_path_1.join)(home, 'other-project');
                    return [4 /*yield*/, (0, promises_1.mkdir)(other)];
                case 2:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 3:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome.logFailedAt).toBe('../other-project/task_log.md');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _b.apply(void 0, [(_c.sent()).tasks[0].state]).toBe('done');
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readFile)((0, node_path_1.join)(other, 'task_log.md'), 'utf8')).rejects.toThrow()];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a difficulty that is not one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'impossible', null)];
                case 2:
                    _a.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0].state]).toBe('current');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a quest that was put back while the sheet was open, and leaves it alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: 'log.md', tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix it' })] })];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe('That quest is no longer the active one, so nothing was finished.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_d.sent()).tasks[0].state]).toBe('queued');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a quest already won, and adds no second row', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one', title: 'Fix it' })] })];
                case 1:
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 2:
                    _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 3:
                    _b.apply(void 0, [(_d.sent()).ok]).toBe(false);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'log.md'), 'utf8')];
                case 4:
                    _c.apply(void 0, [(_d.sent()).match(/\| Fix it \|/g)]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays won when the log can\'t be written, and says where', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(repo, 'taken'))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed({ docsLogPath: 'taken', tasks: [active({ id: 'one' })] })];
                case 2:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 3:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome.logFailedAt).toBe('taken');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _b.apply(void 0, [(_c.sent()).tasks[0].state]).toBe('done');
                    (0, vitest_1.expect)(outcome.victory).not.toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Try again adds the row once the log can be written', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(repo, 'taken'))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed({ docsLogPath: 'taken', tasks: [active({ id: 'one', title: 'Fix it' })] })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(repo, 'taken'), { recursive: true })];
                case 4:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.retryTaskLog)(deps, KEY, 'one', 'taken')];
                case 5:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ logPath: 'taken', logFailedAt: null });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'taken'), 'utf8')];
                case 6:
                    _b.apply(void 0, [(_c.sent()).match(/\| Fix it \|/g)]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Try again only logs a quest that has been won', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one' })] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, finish_api_1.retryTaskLog)(deps, KEY, 'one', 'log.md')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('still finishes when the game can\'t be worked out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var list, outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one' })] })];
                case 1:
                    _c.sent();
                    list = deps.host.list;
                    deps = __assign(__assign({}, deps), { host: __assign(__assign({}, deps.host), { list: function (dir) { return (dir.endsWith('/projects') ? Promise.reject(new Error('folder went away')) : list(dir)); } }) });
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 2:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome.victory).toBeNull();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0].state]).toBe('done');
                    (0, vitest_1.expect)(logged.join('\n')).toContain('folder went away');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Finish quest with Codex', function () {
    (0, vitest_1.it)('adds its time on Codex first, so the win and the log row count it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, outcome, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ docsLogPath: 'docs/task_log.md', tasks: [active({ id: 'one', title: 'Fix it', priority: 'high', codexSince: '2026-10-27T18:00:00+01:00', minutesByDay: { '2026-10-27': 14 } })] })];
                case 1:
                    _d.sent();
                    dir = (0, node_path_1.join)(home, '.codex/sessions/2026/10/27');
                    return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })
                        // 10 minutes with Codex.
                    ];
                case 2:
                    _d.sent();
                    // 10 minutes with Codex.
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'rollout-a.jsonl'), "".concat(JSON.stringify({ timestamp: '2026-10-27T17:00:00Z', type: 'session_meta', payload: { cwd: repo } }), "\n").concat(JSON.stringify({ timestamp: '2026-10-27T17:10:00Z', type: 'event_msg' }), "\n"))];
                case 3:
                    // 10 minutes with Codex.
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, finish_api_1.finishQuest)(deps, KEY, 'one', 'medium', null)];
                case 4:
                    outcome = _a.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ minutes: 24, isCodexTimeLost: false });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _b.apply(void 0, [(_d.sent()).tasks[0]]).toMatchObject({ state: 'done', codexSince: null, minutesByDay: { '2026-10-27': 24 } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'docs/task_log.md'), 'utf8')];
                case 6:
                    _c.apply(void 0, [_d.sent()]).toContain('| Fix it | High | Medium | 24m |');
                    return [2 /*return*/];
            }
        });
    }); });
});
