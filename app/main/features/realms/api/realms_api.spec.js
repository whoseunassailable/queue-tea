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
var fixtures_1 = require("../../tasks/api/fixtures");
var projects_api_1 = require("../../projects/api/projects_api");
var messages_1 = require("../../../core/messages");
var realms_api_1 = require("./realms_api");
var NOW = Date.parse('2026-10-26T16:50:00Z');
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var folder;
var revealed;
var picked;
var deps;
var fileOf = function (key) { return (0, node_path_1.join)(folder, "".concat(key, ".json")); };
var seed = function (key, over) {
    if (over === void 0) { over = {}; }
    return (0, promises_1.writeFile)(fileOf(key), JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)(key.split('-')[0], "/p/".concat(key))), over)));
};
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
var session = function (over) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify(__assign({ id: 's-1', projectPath: '/p/a-000001', recordFile: 'x', currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW }, over)))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-realms-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 3:
                _b.sent();
                revealed = [];
                picked = null;
                log = (0, logger_1.createLogger)('dev', function () { });
                deps = {
                    host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }),
                    home: home,
                    now: function () { return NOW; },
                    log: log,
                    offsetMinutes: function () { return 60; },
                    reveal: function (path) { return void revealed.push(path); },
                    pickFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, picked];
                    }); }); },
                };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('the Settings page', function () {
    (0, vitest_1.it)('shows only the realm you\'re in, with its log and whether it has a last good copy', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed('a-000001', { docsLogPath: 'docs/task_log.md' })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed('b-000002')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)("".concat(fileOf('a-000001'), ".bak"), '{}')];
                case 3:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, 'a-000001')];
                case 4:
                    page = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(page.realm).toEqual({ key: 'a-000001', name: 'a', path: '/p/a-000001', file: 'a-000001.json', hasCopy: true, logPath: 'docs/task_log.md', gitMode: 'assisted', isReadable: true });
                    (0, vitest_1.expect)(JSON.stringify(page)).not.toContain('b-000002');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows no realm with none picked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).realm]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm it doesn\'t know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, 'nope-000000')];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a record that doesn\'t read, without its log', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('broken-000003'), '{ not json')];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, 'broken-000003')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).realm]).toEqual({ key: 'broken-000003', name: 'broken', path: '', file: 'broken-000003.json', hasCopy: false, logPath: null, gitMode: 'assisted', isReadable: false });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the defaults, marked, with no session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, null)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toMatchObject({ isDefault: true, options: { freshAtTokens: vitest_1.expect.any(Number) } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a live session\'s own values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session({ options: { idleGapMinutes: 7, freshAtTokens: 1, handoffAtPercent: 2, checkTimeoutSeconds: 3 } })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toMatchObject({ isDefault: false, options: { idleGapMinutes: 7 } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('doesn\'t trust a session gone stale', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session({ heartbeat: NOW - 91000, options: { idleGapMinutes: 7 } })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).isDefault]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the task log path', function () {
    (0, vitest_1.it)('saves the path', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.setTaskLog)(deps, 'a-000001', ' notes/log.md ')];
                case 2:
                    _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('a-000001'), 'utf8')];
                case 3:
                    _b.apply(void 0, [_d.apply(_c, [_e.sent()]).docsLogPath]).toBe('notes/log.md');
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['nothing', '   ', 'Task log path is required.'],
        ['a folder', 'docs/', 'Enter a file path, such as docs/task_log.md.'],
    ])('refuses %s, as the Finish sheet does', function (_, path, message) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _f.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, realms_api_1.setTaskLog)(deps, 'a-000001', path)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]).toBe(message);
                    _c = vitest_1.expect;
                    _e = (_d = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('a-000001'), 'utf8')];
                case 3:
                    _c.apply(void 0, [_e.apply(_d, [_f.sent()]).docsLogPath]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a path into another project', '../other-project/docs/task_log.md'],
        ['an absolute path elsewhere', '/p/other-project/docs/task_log.md'],
        ['a path that leaves and looks back', 'docs/../../other-project/log.md'],
    ])('refuses %s, so one realm\'s log can\'t land in another', function (_, path) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _f.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, realms_api_1.setTaskLog)(deps, 'a-000001', path)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]).toBe("The task log has to stay inside this realm's folder.");
                    _c = vitest_1.expect;
                    _e = (_d = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('a-000001'), 'utf8')];
                case 3:
                    _c.apply(void 0, [_e.apply(_d, [_f.sent()]).docsLogPath]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses no path at all', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, realms_api_1.setTaskLog)(deps, 'a-000001', null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe('Task log path is required.');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm that doesn\'t read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('broken-000003'), '{ not json')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.setTaskLog)(deps, 'broken-000003', 'log.md')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the Git mode', function () {
    var stored = function (key) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(fileOf(key), 'utf8')];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
        }
    }); }); };
    (0, vitest_1.it)('reads a record made before Git modes as Assisted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, 'a-000001')];
                case 2:
                    _a.apply(void 0, [(_c = _b.apply(void 0, [_d.sent()]).realm) === null || _c === void 0 ? void 0 : _c.gitMode]).toBe('assisted');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves Manual to the realm\'s record, and the Settings page reads it back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _f.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, 'a-000001', 'manual')];
                case 2:
                    _a.apply(void 0, [_f.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a-000001')];
                case 3:
                    _b.apply(void 0, [(_f.sent()).gitMode]).toBe('manual');
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, 'a-000001')];
                case 4:
                    _c.apply(void 0, [(_e = _d.apply(void 0, [_f.sent()]).realm) === null || _e === void 0 ? void 0 : _e.gitMode]).toBe('manual');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('switches a Manual realm back to Assisted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed('a-000001', { gitMode: 'manual' })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, 'a-000001', 'assisted')];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a-000001')];
                case 3:
                    _b.apply(void 0, [(_c.sent()).gitMode]).toBe('assisted');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('changes nothing else in the record', function () { return __awaiter(void 0, void 0, void 0, function () {
        var task, before, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    task = (0, fixtures_1.makeTask)({ id: 'keep-me' });
                    return [4 /*yield*/, seed('a-000001', { docsLogPath: 'notes/log.md', tasks: [task] })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, stored('a-000001')];
                case 2:
                    before = _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, 'a-000001', 'manual')];
                case 3:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a-000001')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toEqual(__assign(__assign({}, before), { gitMode: 'manual' }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('changes only the realm it is given', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed('b-000002')];
                case 2:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, 'a-000001', 'manual')];
                case 3:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('b-000002')];
                case 4:
                    _b.apply(void 0, [(_c.sent()).gitMode]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a capitalised name', 'Manual'],
        ['another word', 'auto'],
        ['nothing', ''],
        ['no value', null],
        ['a number', 1],
    ])('refuses %s, and leaves the record alone', function (_, mode) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, 'a-000001', mode)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.gitModeInvalid);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, stored('a-000001')];
                case 3:
                    _c.apply(void 0, [(_d.sent()).gitMode]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm that doesn\'t read, and leaves its file as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('broken-000003'), '{ not json')];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, 'broken-000003', 'manual')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.unreadableRealm);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('broken-000003'), 'utf8')];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toBe('{ not json');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm it doesn\'t know, and a made-up path', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, 'nope-000000', 'manual')];
                case 1:
                    _a.apply(void 0, [(_d.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.setGitMode)(deps, '../../etc/passwd', 'manual')];
                case 2:
                    _b.apply(void 0, [(_d.sent()).ok]).toBe(false);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(folder)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('showing a record in Finder', function () {
    (0, vitest_1.it)('shows a realm\'s file, by key', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed('a-000001')];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.showRecord)(deps, 'a-000001')];
                case 2:
                    _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(revealed).toEqual([fileOf('a-000001')]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never reveals a path made up by the window', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.showRecord)(deps, '../../etc/passwd')];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    (0, vitest_1.expect)(revealed).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Open folder', function () {
    (0, vitest_1.it)('does nothing when the dialog is cancelled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.openFolder)(deps)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers to add a folder with no record, and writes nothing yet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    picked = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(picked)];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.openFolder)(deps)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toEqual({ path: picked, name: 'demo', key: (0, record_source_1.projectKey)(picked), isKnown: false, isRepo: false });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(folder)];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('knows a realm already there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    picked = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(picked)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, "".concat((0, record_source_1.projectKey)(picked), ".json")), JSON.stringify((0, record_source_1.emptyRecord)('demo', picked)))];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.openFolder)(deps)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toMatchObject({ isKnown: true, key: (0, record_source_1.projectKey)(picked) });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes the repository\'s top folder when given one inside it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var top, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    top = (0, node_path_1.join)(home, 'repo');
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(top, 'src/deep'), { recursive: true })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['init', '-b', 'main'], { cwd: top })];
                case 2:
                    _c.sent();
                    picked = (0, node_path_1.join)(top, 'src/deep');
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.openFolder)(deps)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ path: top, name: 'repo', key: (0, record_source_1.projectKey)(top), isKnown: false, isRepo: true });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('adding a realm', function () {
    (0, vitest_1.it)('writes an empty record in the projects folder, and nothing in the project', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, key, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    path = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(path)];
                case 1:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.addProject)(deps, path)];
                case 2:
                    key = _a.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(key).toBe((0, record_source_1.projectKey)(path));
                    _b = vitest_1.expect;
                    _c = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf(key), 'utf8')];
                case 3:
                    _b.apply(void 0, [_c.apply(void 0, [_e.sent()])]).toMatchObject({ project: { name: 'demo', path: path }, tasks: [] });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(path)];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a record already there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, key, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    path = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(path)];
                case 1:
                    _e.sent();
                    key = (0, record_source_1.projectKey)(path);
                    return [4 /*yield*/, (0, promises_1.writeFile)(fileOf(key), JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', path)), { tasks: [(0, fixtures_1.makeTask)({ id: 'keep-me' })] })))];
                case 2:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.addProject)(deps, path)];
                case 3:
                    _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf(key), 'utf8')];
                case 4:
                    _b.apply(void 0, [_d.apply(_c, [_e.sent()]).tasks]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('uses the repository\'s top folder, as a session in it would', function () { return __awaiter(void 0, void 0, void 0, function () {
        var top, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    top = (0, node_path_1.join)(home, 'repo');
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(top, 'src'), { recursive: true })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['init', '-b', 'main'], { cwd: top })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.addProject)(deps, (0, node_path_1.join)(top, 'src'))];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe((0, record_source_1.projectKey)(top));
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a relative path', 'demo'],
        ['nothing', ''],
        ['not text', 42],
    ])('refuses %s', function (_, path) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.addProject)(deps, path)];
                case 1:
                    _a.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(folder)];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder that isn\'t there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.addProject)(deps, (0, node_path_1.join)(home, 'no-such-folder'))];
                case 1:
                    _a.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)(folder)];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the failed record', function () {
    var GOOD = JSON.stringify((0, record_source_1.emptyRecord)('a', '/p/a'));
    (0, vitest_1.it)('says why it can\'t be read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('a-000001'), '{ "version": 3 }')];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, 'a-000001')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toMatchObject({ kind: 'unreadable', isNewer: true, reason: 'it was written by a newer Queue-tea (record version 3); update Queue-tea to read it', file: fileOf('a-000001') });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('puts the last good copy back, and keeps the broken one beside it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var keptAs, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('a-000001'), '{ not json')];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)("".concat(fileOf('a-000001'), ".bak"), GOOD)];
                case 2:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.restoreRealm)(deps, 'a-000001')];
                case 3:
                    keptAs = _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    _c = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('a-000001'), 'utf8')];
                case 4:
                    _b.apply(void 0, [_c.apply(void 0, [_e.sent()])]).toMatchObject({ project: { name: 'a' } });
                    (0, vitest_1.expect)(keptAs).toBe('a-000001.json.broken-2026-10-26T17-50-00');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(folder, keptAs), 'utf8')];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toBe('{ not json');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a record written by a newer Queue-tea, even with a copy there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newer, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    newer = JSON.stringify({ version: 3, future: 'work' });
                    return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('a-000001'), newer)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)("".concat(fileOf('a-000001'), ".bak"), GOOD)];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, realms_api_1.restoreRealm)(deps, 'a-000001')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe('There is no good copy of this record to go back to.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('a-000001'), 'utf8')];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toBe(newer);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses with no copy', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('a-000001'), '{ not json')];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, realms_api_1.restoreRealm)(deps, 'a-000001')];
                case 2:
                    _a.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('a-000001'), 'utf8')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('{ not json');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves a record that reads alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(fileOf('a-000001'), GOOD)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)("".concat(fileOf('a-000001'), ".bak"), JSON.stringify((0, record_source_1.emptyRecord)('old', '/p/old')))];
                case 2:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, realms_api_1.restoreRealm)(deps, 'a-000001')];
                case 3:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(fileOf('a-000001'), 'utf8')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(GOOD);
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
                    return [4 /*yield*/, (0, realms_api_1.restoreRealm)(deps, '../secret')];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
