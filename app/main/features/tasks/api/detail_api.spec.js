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
var checkpoints_1 = require("../../../../../hooks/shared/checkpoints/domain/services/checkpoints");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var detail_api_1 = require("./detail_api");
var fixtures_1 = require("./fixtures");
var KEY = 'facts-abc123';
var NOW = Date.parse('2026-10-27T17:50:00Z');
var TODAY = '2026-10-27';
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var file;
var deps;
var git = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, run('git', args, { cwd: repo })];
            case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
        }
    }); });
};
var seed = function (over) { return (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('facts', repo)), over))); };
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-facts-'))];
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
                return [4 /*yield*/, git('init', '-b', 'main')];
            case 5:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.email', 'test@example.com')];
            case 6:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.name', 'Test')];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\n')];
            case 8:
                _b.sent();
                return [4 /*yield*/, git('add', '.')];
            case 9:
                _b.sent();
                return [4 /*yield*/, git('commit', '-m', 'first')];
            case 10:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                deps = { host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }), home: home, now: function () { return NOW; }, log: log, offsetMinutes: function () { return 60; }, newId: function () { return 'q-1'; }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); }, copy: function () { } };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('a quest on the board', function () {
    (0, vitest_1.it)('says what it was filed with', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', messages: ['Fix the diagrams please'] })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).messages]).toEqual(['Fix the diagrams please']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names the branch it will get', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix cut-off text' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).branchToBe]).toBe('task/fix-cut-off-text');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names a free one when that branch is taken', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, git('branch', 'task/fix-cut-off-text')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix cut-off text' })] })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).branchToBe]).toBe('task/fix-cut-off-text-2');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has none to name once it has its own', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, git('branch', 'task/mine')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', branch: 'task/mine' })] })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).branchToBe]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names one again when its own has gone, as Start would', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix it', branch: 'task/gone' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).branchToBe]).toBe('task/fix');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has none to name outside a repository', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plain, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    plain = (0, node_path_1.join)(home, 'plain');
                    return [4 /*yield*/, (0, promises_1.mkdir)(plain)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('facts', plain)), { tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })))];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).branchToBe]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has nothing about being active', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).active]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the note it carries on from', function () {
    (0, vitest_1.it)('lists a checkpoint\'s sections', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', checkpoint: __assign(__assign({}, (0, checkpoints_1.emptyCheckpoint)()), { written: '2026-10-26T16:35:00+01:00', goal: 'Fix the docs', remaining: ['The diagrams'] }) })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).note]).toEqual({
                        title: 'Checkpoint',
                        written: '2026-10-26T16:35:00+01:00',
                        text: '',
                        sections: [
                            { heading: 'Goal', lines: ['Fix the docs'] },
                            { heading: 'Remaining', lines: ['- The diagrams'] },
                        ],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a plain handoff note as text', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', handoff: { text: 'Carry on with the diagrams.', written: '2026-10-26T16:35:00+01:00' } })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).note]).toMatchObject({ title: 'Handoff note', text: 'Carry on with the diagrams.', sections: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has none for a quest never worked on', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).note]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the active quest', function () {
    var active = function (over) {
        var _a;
        if (over === void 0) { over = {}; }
        return (0, fixtures_1.makeTask)(__assign({ id: 'one', state: 'current', branch: 'main', started: '2026-10-20T22:17:00+02:00', minutesByDay: (_a = { '2026-10-20': 24 }, _a[TODAY] = 19, _a), effort: { understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39, linesAdded: 0, linesRemoved: 0, filesTouched: 0 } }, over));
    };
    (0, vitest_1.it)('gives its time, in all and today', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).active]).toMatchObject({ minutes: 43, today: 19, started: '2026-10-20T22:17:00+02:00' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives its effort', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).active]).toMatchObject({ understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('measures the lines now, uncommitted work included', function () { return __awaiter(void 0, void 0, void 0, function () {
        var startCommit, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, git('rev-parse', 'HEAD')];
                case 1:
                    startCommit = _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\nb\nc\n')];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, seed({ tasks: [active({ startCommit: startCommit })] })];
                case 3:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 4:
                    _a.apply(void 0, [(_c = _b.apply(void 0, [_d.sent()]).active) === null || _c === void 0 ? void 0 : _c.lines]).toEqual({ added: 2, removed: 0, since: startCommit.slice(0, 7) });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the lines out with no start commit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [(_c = _b.apply(void 0, [_d.sent()]).active) === null || _c === void 0 ? void 0 : _c.lines]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the lines out when git has lost the commit, and keeps the rest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ startCommit: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).active]).toMatchObject({ lines: null, minutes: 43 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives the last commit and what isn\'t committed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var facts, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'changed\n')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'b.txt'), 'new\n')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, seed({ tasks: [active()] })];
                case 3:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 4:
                    facts = (_b = _a.apply(void 0, [_c.sent()]).active) === null || _b === void 0 ? void 0 : _b.git;
                    (0, vitest_1.expect)(facts === null || facts === void 0 ? void 0 : facts.branch).toBe('main');
                    (0, vitest_1.expect)(facts === null || facts === void 0 ? void 0 : facts.head).toMatch(/^[0-9a-f]{7} first$/);
                    (0, vitest_1.expect)(facts === null || facts === void 0 ? void 0 : facts.uncommitted.sort()).toEqual(['a.txt', 'b.txt']);
                    (0, vitest_1.expect)(facts === null || facts === void 0 ? void 0 : facts.uncommittedCount).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts every file, though it lists at most 20', function () { return __awaiter(void 0, void 0, void 0, function () {
        var i, facts, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < 25)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, "f".concat(i, ".txt")), 'x\n')];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 5:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 6:
                    facts = (_b = _a.apply(void 0, [_c.sent()]).active) === null || _b === void 0 ? void 0 : _b.git;
                    (0, vitest_1.expect)(facts === null || facts === void 0 ? void 0 : facts.uncommitted).toHaveLength(20);
                    (0, vitest_1.expect)(facts === null || facts === void 0 ? void 0 : facts.uncommittedCount).toBe(25);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has no git facts outside a repository, and the rest stands', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plain, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    plain = (0, node_path_1.join)(home, 'plain');
                    return [4 /*yield*/, (0, promises_1.mkdir)(plain)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('facts', plain)), { tasks: [active()] })))];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).active]).toMatchObject({ git: null, minutes: 43 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stands without git when the folder has moved', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('facts', (0, node_path_1.join)(home, 'moved-away'))), { tasks: [active()] })))];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).active]).toMatchObject({ git: null, minutes: 43 });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('refusals', function () {
    (0, vitest_1.it)('refuses a quest it doesn\'t know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, KEY, 'nope')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: "That quest isn't one Queue-tea knows. Pick it again." } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a key that isn\'t one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, detail_api_1.readQuestFacts)(deps, '../x', 'one')];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
