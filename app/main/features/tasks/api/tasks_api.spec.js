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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var api = require("./tasks_api");
var KEY = 'demo-abc123';
var NOW = Date.parse('2026-10-27T17:50:00Z');
var home;
var file;
var deps;
var logged = [];
var ids = 0;
var task = function (over) {
    return (__assign({ title: over.id, state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null, helpers: { on: ['tea-dd'], ran: [], reminded: false }, codexSince: null, worktreePath: null }, over));
};
var seed = function (tasks, over) {
    if (over === void 0) { over = {}; }
    return (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', '/p/demo')), { tasks: tasks }), over)));
};
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
var stored = function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, onDisk()];
        case 1: return [2 /*return*/, (_a.sent()).tasks.find(function (t) { return t.id === id; })];
    }
}); }); };
var viewOf = function (reply) {
    var _a;
    if (!reply.ok || ((_a = reply.data) === null || _a === void 0 ? void 0 : _a.kind) !== 'readable')
        throw new Error("should succeed: ".concat(JSON.stringify(reply)));
    return reply.data;
};
var quest = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ title: 'New one', priority: 'mid', difficulty: 'medium', parent: { kind: 'none' }, description: null, criteria: [], helpers: ['tea-dd'] }, over));
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var log;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-tasks-'))];
            case 1:
                home = _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 2:
                _a.sent();
                file = "".concat(home, "/.queue-tea/projects/").concat(KEY, ".json");
                logged.length = 0;
                log = (0, logger_1.createLogger)('dev', function (line) { return logged.push(line); });
                deps = { host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }), home: home, now: function () { return NOW; }, log: log, offsetMinutes: function () { return 60; }, newId: function () { return "t-new".concat((ids += 1)); }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); }, copy: function () { } };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('priority', function () {
    (0, vitest_1.it)('writes the record and hands back the realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' }), task({ id: 'b', priority: 'low' })])];
                case 1:
                    _d.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.setPriority(deps, KEY, 'b', 'urgent')];
                case 2:
                    view = _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('b')];
                case 3:
                    _b.apply(void 0, [(_d.sent()).priority]).toBe('urgent');
                    (0, vitest_1.expect)((_c = view.ready[0]) === null || _c === void 0 ? void 0 : _c.quest.id).toBe('b');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a priority that is not one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.setPriority(deps, KEY, 'a', 'whenever')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ ok: false });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _b.apply(void 0, [(_c.sent()).priority]).toBe('mid');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a quest gone from the board changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 2:
                    before = _e.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.setPriority(deps, KEY, 'gone', 'urgent')];
                case 3:
                    _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 4:
                    _b.apply(void 0, [_d.apply(_c, [_e.sent()]).tasks]).toEqual(JSON.parse(before).tasks);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a record that stops reading', function () {
    (0, vitest_1.it)('refuses, says so and leaves the file alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reply, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(file, '{half a reco')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, api.setPriority(deps, KEY, 'a', 'urgent')];
                case 2:
                    reply = _b.sent();
                    (0, vitest_1.expect)(reply).toEqual({ ok: false, error: { message: "This realm's record can't be read, so nothing was changed." } });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBe('{half a reco');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a newer record is left alone too', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    newer = JSON.stringify({ version: 3, tasks: [] });
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, newer)];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.removeQuest(deps, KEY, 'a')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ ok: false });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(newer);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a key that could leave the folder is refused', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.togglePlayNext(deps, '../../etc/passwd', 'a')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ ok: false, error: { message: "That realm isn't one Queue-tea knows. Pick one from the list." } });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('filing', function () {
    (0, vitest_1.it)('files a quest and never starts it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([])];
                case 1:
                    _c.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.fileQuest(deps, KEY, quest({ title: '  Spaced  ', description: ' Why ', criteria: [' Passes ', ' '] }))];
                case 2:
                    view = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(view.active).toBe(null);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toMatchObject({ tasks: [{ title: 'Spaced', state: 'queued', description: 'Why', criteria: ['Passes'], messages: ['Spaced'] }] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('files with the helpers chosen, once each, in list order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, api.fileQuest(deps, KEY, quest({ helpers: ['tea-dd', 'commit-chai-n', 'tea-dd'] }))];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _a.apply(void 0, [(_b = (_c.sent()).tasks[0]) === null || _b === void 0 ? void 0 : _b.helpers.on]).toEqual(['commit-chai-n', 'tea-dd']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('files a chapter under a saga', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'saga' })])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, api.fileQuest(deps, KEY, quest({ parent: { kind: 'task', id: 'saga' } }))];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _a.apply(void 0, [(_b = (_c.sent()).tasks[1]) === null || _b === void 0 ? void 0 : _b.parentId]).toBe('saga');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('files a new saga with its first chapter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var tasks;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, api.fileQuest(deps, KEY, quest({ title: 'Chapter', parent: { kind: 'new', title: 'Saga' } }))];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, onDisk()];
                case 3:
                    tasks = (_c.sent()).tasks;
                    (0, vitest_1.expect)(tasks.map(function (t) { return t.title; })).toEqual(['Saga', 'Chapter']);
                    (0, vitest_1.expect)((_a = tasks[1]) === null || _a === void 0 ? void 0 : _a.parentId).toBe((_b = tasks[0]) === null || _b === void 0 ? void 0 : _b.id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a saga that went since the sheet opened is refused, in the engine’s words', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'saga', state: 'done' })])];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.fileQuest(deps, KEY, quest({ parent: { kind: 'task', id: 'saga' } }))];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: 'That saga is no longer open. Pick again.' } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        [{ title: '   ' }, 'Title is required.'],
        [{ title: 'x'.repeat(201) }, 'Title must be 200 characters or fewer.'],
        [{ parent: { kind: 'new', title: ' ' } }, 'Title is required.'],
        [{ helpers: ['general-purpose'] }, "That value isn't one Queue-tea can use. Pick another."],
        [{ helpers: 'tea-dd' }, "That value isn't one Queue-tea can use. Pick another."],
    ])('refuses %j', function (over, message) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([])];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.fileQuest(deps, KEY, quest(over))];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: message } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('moving', function () {
    (0, vitest_1.it)('moves a quest under a saga and back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'saga' }), task({ id: 'a' })])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, api.moveQuest(deps, KEY, 'a', 'saga')];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _a.apply(void 0, [(_c.sent()).parentId]).toBe('saga');
                    return [4 /*yield*/, api.moveQuest(deps, KEY, 'a', null)];
                case 4:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 5:
                    _b.apply(void 0, [(_c.sent()).parentId]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a move the engine refuses shows its sentence and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reply, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'saga' }), task({ id: 'chapter', parentId: 'saga' }), task({ id: 'other' })])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, api.moveQuest(deps, KEY, 'saga', 'other')];
                case 2:
                    reply = _b.sent();
                    (0, vitest_1.expect)(reply).toEqual({ ok: false, error: { message: "saga has chapters of its own, so it can't be part of another saga." } });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, stored('saga')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).parentId]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('sealing', function () {
    (0, vitest_1.it)('seals with a reason and clears Play next', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })], { playNext: 'a' })];
                case 1:
                    _d.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.sealQuest(deps, KEY, 'a', { reason: ' waiting for the clinic ' })];
                case 2:
                    view = _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _b.apply(void 0, [(_d.sent()).blockedReason]).toBe('waiting for the clinic');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _c.apply(void 0, [(_d.sent()).playNext]).toBe(null);
                    (0, vitest_1.expect)(view.sealedCount).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('seals to wait for another, and unseals', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' }), task({ id: 'b' })])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, api.sealQuest(deps, KEY, 'a', { waitFor: 'b' })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _a.apply(void 0, [(_c.sent()).blockedBy]).toEqual(['b']);
                    return [4 /*yield*/, api.unsealQuest(deps, KEY, 'a')];
                case 4:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 5:
                    _b.apply(void 0, [(_c.sent()).blockedBy]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a wait that would loop', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', blockedBy: ['b'] }), task({ id: 'b' })])];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.sealQuest(deps, KEY, 'b', { waitFor: 'a' })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: 'That would make the two quests wait for each other.' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('wants a quest or a reason', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.sealQuest(deps, KEY, 'a', { reason: '  ' })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: 'Pick a quest to wait for, or write a reason.' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks for the active quest to go back first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', state: 'current' })])];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.sealQuest(deps, KEY, 'a', { reason: 'x' })];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ ok: false, error: { message: 'Put the active quest back on the board first, then seal it.' } });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('removing', function () {
    (0, vitest_1.it)('removes a quest, and restore brings it back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _f.sent();
                    _a = vitest_1.expect;
                    _b = viewOf;
                    return [4 /*yield*/, api.removeQuest(deps, KEY, 'a')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()]).ready]).toEqual([]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _c.apply(void 0, [(_f.sent()).state]).toBe('removed');
                    _d = vitest_1.expect;
                    _e = viewOf;
                    return [4 /*yield*/, api.restoreQuest(deps, KEY, 'a')];
                case 4:
                    _d.apply(void 0, [_e.apply(void 0, [_f.sent()]).ready]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('removing a saga sets its chapters free', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'saga' }), task({ id: 'chapter', parentId: 'saga' })])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, api.removeQuest(deps, KEY, 'saga')];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, stored('chapter')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).parentId]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the active quest alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', state: 'current' })])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, api.removeQuest(deps, KEY, 'a')];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).state]).toBe('current');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the rest', function () {
    (0, vitest_1.it)('Play next turns on and off', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _g.sent();
                    _a = vitest_1.expect;
                    _b = viewOf;
                    return [4 /*yield*/, api.togglePlayNext(deps, KEY, 'a')];
                case 2:
                    _a.apply(void 0, [(_e = _b.apply(void 0, [_g.sent()]).ready[0]) === null || _e === void 0 ? void 0 : _e.quest.isPlayNext]).toBe(true);
                    _c = vitest_1.expect;
                    _d = viewOf;
                    return [4 /*yield*/, api.togglePlayNext(deps, KEY, 'a')];
                case 3:
                    _c.apply(void 0, [(_f = _d.apply(void 0, [_g.sent()]).ready[0]) === null || _f === void 0 ? void 0 : _f.quest.isPlayNext]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('edits only what it was given', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', description: 'Kept' })])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { title: ' New ', difficulty: 'hard' })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ title: 'New', description: 'Kept', difficulty: { expected: 'hard' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('edits the helpers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _d.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { helpers: ['chai-pter'] })];
                case 2:
                    view = _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _b.apply(void 0, [(_d.sent()).helpers.on]).toEqual(['chai-pter']);
                    (0, vitest_1.expect)((_c = view.ready[0]) === null || _c === void 0 ? void 0 : _c.quest.helpers).toEqual(['chai-pter']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an edit with an unknown helper is refused and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { helpers: ['general-purpose'] })];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: "That value isn't one Queue-tea can use. Pick another." } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _b.apply(void 0, [(_c.sent()).helpers.on]).toEqual(['tea-dd']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("a profile Rohan picks is saved as his, over Tea-DD's, and the board shows it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', testProfile: { id: 'standard', by: 'tea-dd', reason: 'one feature' } })])];
                case 1:
                    _d.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { testProfile: 'critical' })];
                case 2:
                    view = _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _b.apply(void 0, [(_d.sent()).testProfile]).toEqual({ id: 'critical', by: 'rohan' });
                    (0, vitest_1.expect)((_c = view.ready[0]) === null || _c === void 0 ? void 0 : _c.quest.testProfile).toEqual({ id: 'critical', by: 'rohan' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a null profile hands the pick back to Tea-DD', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', testProfile: { id: 'quick', by: 'rohan' } })])];
                case 1:
                    _d.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { testProfile: null })];
                case 2:
                    view = _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _b.apply(void 0, [(_d.sent()).testProfile]).toBeUndefined();
                    (0, vitest_1.expect)((_c = view.ready[0]) === null || _c === void 0 ? void 0 : _c.quest.testProfile).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an unknown profile is refused and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, testProfile, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', testProfile: { id: 'quick', by: 'rohan' } })])];
                case 1:
                    _d.sent();
                    _i = 0, _a = ['huge', 'Deep', 3, {}, ''];
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    testProfile = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { testProfile: testProfile })];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toEqual({ ok: false, error: { message: "That value isn't one Queue-tea can use. Pick another." } });
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _c = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 6:
                    _c.apply(void 0, [(_d.sent()).testProfile]).toEqual({ id: 'quick', by: 'rohan' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a due date is saved on the quest, the board shows it, and null clears it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a, _b, cleared, _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _g.sent();
                    _a = viewOf;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { due: '2026-12-01' })];
                case 2:
                    view = _a.apply(void 0, [_g.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _b.apply(void 0, [(_g.sent()).due]).toBe('2026-12-01');
                    (0, vitest_1.expect)((_e = view.ready[0]) === null || _e === void 0 ? void 0 : _e.quest.due).toBe('2026-12-01');
                    _c = viewOf;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { due: null })];
                case 4:
                    cleared = _c.apply(void 0, [_g.sent()]);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 5:
                    _d.apply(void 0, [(_g.sent()).due]).toBeUndefined();
                    (0, vitest_1.expect)((_f = cleared.ready[0]) === null || _f === void 0 ? void 0 : _f.quest.due).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a due date that is not a day is refused and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, due, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', due: '2026-12-01' })])];
                case 1:
                    _d.sent();
                    _i = 0, _a = ['2026-02-30', 'tomorrow', '2026-12-01T09:00', '', 20261201, {}];
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    due = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { due: due })];
                case 3:
                    _b.apply(void 0, [_d.sent()]).toEqual({ ok: false, error: { message: 'Pick a due date from the calendar, or clear it.' } });
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _c = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 6:
                    _c.apply(void 0, [(_d.sent()).due]).toBe('2026-12-01');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an empty description clears it, and a blank title is refused', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a', description: 'Gone' })])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { description: '   ' })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, stored('a')];
                case 3:
                    _a.apply(void 0, [(_c.sent()).description]).toBe(null);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { title: ' ' })];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: 'Title is required.' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('makes a saga active and turns it off', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = viewOf;
                    return [4 /*yield*/, api.setActiveSaga(deps, KEY, 'a')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()]).activeSagaId]).toBe('a');
                    _c = vitest_1.expect;
                    _d = viewOf;
                    return [4 /*yield*/, api.setActiveSaga(deps, KEY, null)];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()]).activeSagaId]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a chapter cannot be the active saga', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'saga' }), task({ id: 'chapter', parentId: 'saga' })])];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.setActiveSaga(deps, KEY, 'chapter')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ ok: false });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).feature]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('what the forms offer', function () {
    (0, vitest_1.it)('offers open sagas, lone quests, and for a quest only what it can take', function () { return __awaiter(void 0, void 0, void 0, function () {
        var choices;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([
                        task({ id: 'saga', title: 'Saga' }),
                        task({ id: 'chapter', parentId: 'saga' }),
                        task({ id: 'lone' }),
                        task({ id: 'won', state: 'done' }),
                        task({ id: 'waits', blockedBy: ['lone'] }),
                    ])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, api.readChoices(deps, KEY, 'lone')];
                case 2:
                    choices = _b.sent();
                    if (!choices.ok)
                        throw new Error('should read');
                    (0, vitest_1.expect)(choices.data.features.map(function (c) { return c.id; })).toEqual(['saga']);
                    (0, vitest_1.expect)((_a = choices.data.features[0]) === null || _a === void 0 ? void 0 : _a.detail).toContain('0/1');
                    (0, vitest_1.expect)(choices.data.lone.map(function (c) { return c.id; })).toContain('lone');
                    (0, vitest_1.expect)(choices.data.parents.map(function (c) { return c.id; })).not.toContain('lone');
                    (0, vitest_1.expect)(choices.data.parents.map(function (c) { return c.id; })).not.toContain('chapter');
                    // Waiting for what already waits for it would close a loop.
                    (0, vitest_1.expect)(choices.data.waitFor.map(function (c) { return c.id; })).not.toContain('waits');
                    (0, vitest_1.expect)(choices.data.waitFor.map(function (c) { return c.id; })).not.toContain('won');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the engine in the game\'s words', function () {
    (0, vitest_1.it)('leaves a title that holds the same words alone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'x', title: 'Fix the task log' }), task({ id: 'chapter', parentId: 'x' }), task({ id: 'other' })])];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.moveQuest(deps, KEY, 'x', 'other')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: "Fix the task log has chapters of its own, so it can't be part of another saga." } });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('both sides of the record', function () {
    (0, vitest_1.it)('everything the app writes keeps fields it does not know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var raw, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', '/p/demo')), { fromTheMod: 1, tasks: [__assign(__assign({}, task({ id: 'a' })), { fromTheMod: 2 })] })))];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, api.setPriority(deps, KEY, 'a', 'high')];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, api.fileQuest(deps, KEY, quest())];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, api.editQuest(deps, KEY, 'a', { title: 'Still here' })];
                case 4:
                    _e.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 5:
                    raw = _b.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)(raw.fromTheMod).toBe(1);
                    (0, vitest_1.expect)(raw.tasks[0].fromTheMod).toBe(2);
                    _c = vitest_1.expect;
                    _d = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 6:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).not.toBe('unreadable');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves no lock or temp file behind', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([task({ id: 'a' })])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, api.setPriority(deps, KEY, 'a', 'high')];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, deps.host.list("".concat(home, "/.queue-tea/projects"))];
                case 3:
                    _a.apply(void 0, [(_c.sent()).sort()]).toEqual(["".concat(KEY, ".json"), "".concat(KEY, ".json.bak")]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, deps.host.exists("".concat(file, ".lock"))];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
