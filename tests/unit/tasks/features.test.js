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
var testing_1 = require("claude-code/testing");
var commit_guard_controller_1 = require("../../../hooks/features/commit_guard/presentation/state_management/commit_guard_controller");
var tasks_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var card_note_1 = require("../../../hooks/shared/checkpoints/domain/services/card_note");
var text_1 = require("../../../hooks/core/widgets/text");
var week_stats_1 = require("../../../hooks/shared/time/domain/services/week_stats");
var helpers_1 = require("../../helpers");
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var withTasks = function (tasks) { return (__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks })); };
(0, testing_1.test)('putting back without a handoff note still queues the task and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, r, mem, _a, ports, view, done, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now' });
                r = withTasks([task]);
                mem = (0, helpers_1.memoryHost)({ files: (_c = {}, _c[helpers_1.CTX.file] = JSON.stringify(r), _c) });
                _a = (0, helpers_1.fakePorts)(mem, { view: { record: r, isAskingDone: true, canContinue: true } }), ports = _a.ports, view = _a.view, done = _a.done;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe('queued');
                (0, testing_1.expect)(stored(mem).tasks[0].state).toBe('queued');
                (0, testing_1.expect)(stored(mem).tasks[0].handoff).toBeNull();
                (0, testing_1.expect)([view.isAskingDone, view.canContinue, view.isChoosingNext, view.busy]).toEqual([false, false, true, null]);
                (0, testing_1.expect)(view.notice).toBe("Couldn't save a checkpoint, so Start will begin from what was saved before.");
                (0, testing_1.expect)(done.toasts).toEqual(['Back in the backlog: Now']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Back to queue pressed twice writes one checkpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, r, mem, _a, ports, done, results;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now' });
                r = withTasks([task]);
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = JSON.stringify(r), _b) });
                _a = (0, helpers_1.fakePorts)(mem, { view: { record: r } }), ports = _a.ports, done = _a.done;
                return [4 /*yield*/, Promise.all([(0, tasks_controller_1.putBack)(ports, helpers_1.CTX), (0, tasks_controller_1.putBack)(ports, helpers_1.CTX)])];
            case 1:
                results = _c.sent();
                (0, testing_1.expect)(results.sort()).toEqual(['none', 'queued']);
                (0, testing_1.expect)(done.toasts).toEqual(['Back in the backlog: Now']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('busy shows while the checkpoint is written, and clears when it fails', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, r, mem, _a, ports, view, during, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now' });
                r = withTasks([task]);
                mem = (0, helpers_1.memoryHost)({ files: (_c = {}, _c[helpers_1.CTX.file] = JSON.stringify(r), _c) });
                _a = (0, helpers_1.fakePorts)(mem, { view: { record: r } }), ports = _a.ports, view = _a.view;
                during = null;
                ports.ask = __assign(__assign({}, ports.ask), { fork: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            during = view.busy;
                            throw new Error('no reply');
                        });
                    }); } });
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe('queued');
                (0, testing_1.expect)(during).toBe('Saving a checkpoint…');
                (0, testing_1.expect)(view.busy).toBeNull();
                (0, testing_1.expect)(stored(mem).tasks[0].state).toBe('queued');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no current task, putting back does nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var r, mem, ports, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                r = withTasks([(0, helpers_1.makeTask)()]);
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = JSON.stringify(r), _b) });
                ports = (0, helpers_1.fakePorts)(mem, { view: { record: r } }).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(ports, helpers_1.CTX)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe('none');
                (0, testing_1.expect)(mem.writes).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('starting a put-back task goes back to its branch and keeps its start', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, r, mem, ports, _a, saved;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', branch: 'task/now', startCommit: '0f0f0f0', started: '2026-10-20T10:00:00+02:00' });
                r = withTasks([task]);
                mem = (0, helpers_1.memoryHost)({
                    files: (_b = {}, _b[helpers_1.CTX.file] = JSON.stringify(r), _b),
                    git: {
                        'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
                        'git status --porcelain=v2 --branch': { stdout: CLEAN },
                        'git branch --format=%(refname:short)': { stdout: 'main\ntask/now\n' },
                        'git switch task/now': {},
                    },
                });
                ports = (0, helpers_1.fakePorts)(mem, { view: { record: r } }).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe('started');
                saved = stored(mem).tasks[0];
                (0, testing_1.expect)([saved.state, saved.branch, saved.startCommit, saved.started]).toEqual([
                    'current',
                    'task/now',
                    '0f0f0f0',
                    '2026-10-20T10:00:00+02:00',
                ]);
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.join(' ') === 'git switch task/now'; })).toBe(true);
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.includes('-c'); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a branch change during a turn is no commit warning', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({
                    git: { 'git rev-parse HEAD': { stdout: 'bbbbbbb\n' }, 'git symbolic-ref --short -q HEAD': { stdout: 'other\n' } },
                });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.commitWarning)(ports, helpers_1.CTX, { commit: 'aaaaaaa', branch: 'task/now' })];
            case 1:
                _b.apply(void 0, [_e.sent()]).toBeNull();
                _c = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.commitWarning)(ports, helpers_1.CTX, { commit: 'bbbbbbb', branch: 'other' })];
            case 2:
                _c.apply(void 0, [_e.sent()]).toBeNull();
                _d = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.commitWarning)(ports, helpers_1.CTX, null)];
            case 3:
                _d.apply(void 0, [_e.sent()]).toBeNull();
                (0, testing_1.expect)(view.warning).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('two new commits are counted, the newest named', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({
                    git: {
                        'git rev-parse HEAD': { stdout: 'ccccccc\n' },
                        'git symbolic-ref --short -q HEAD': { stdout: 'main\n' },
                        'git log --format=%h %s aaaaaaa..ccccccc': { stdout: 'ccccccc Second\nbbbbbbb First\n' },
                    },
                });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, commit_guard_controller_1.commitWarning)(ports, helpers_1.CTX, { commit: 'aaaaaaa', branch: 'main' })];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.warning).toBe("During the last turn 2 commits appeared, newest ccccccc Second. Queue-tea stops Claude's commits, so check it was yours.");
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a note in the older shape is split at its own headings', function () {
    var _a;
    var note = ['Task: the review', '', 'Done:', '- Read the chat', 'Files changed:', '- docs/x.md', 'Left:', '- File the ideas'].join('\n');
    (0, testing_1.expect)((0, card_note_1.handoffSections)(note)).toEqual([
        { heading: 'Note', lines: ['Task: the review'] },
        { heading: 'Done', lines: ['- Read the chat'] },
        { heading: 'Files changed', lines: ['- docs/x.md'] },
        { heading: 'Left', lines: ['- File the ideas'] },
    ]);
    (0, testing_1.expect)((0, card_note_1.handoffSections)('Just one line of text.\nAnd another.')).toBeNull();
    (0, testing_1.expect)((_a = (0, card_note_1.handoffSections)('## Overview\n- a\n**Next steps:**\n- b')) === null || _a === void 0 ? void 0 : _a.map(function (s) { return s.heading; })).toEqual(['Overview', 'Next steps']);
});
(0, testing_1.test)('the week chart is blank with no time, and cut ends with an ellipsis', function () {
    (0, testing_1.expect)((0, week_stats_1.weekChart)([0, 0, 0, 0, 0, 0, 0])).toBe('M    T    W    T    F    S    S  ');
    (0, testing_1.expect)((0, week_stats_1.weekChart)([10, 80, 0, 0, 0, 0, 40])).toBe('M ▁  T █  W    T    F    S    S ▄');
    (0, testing_1.expect)((0, text_1.cut)('Finish the scan page', 10)).toBe('Finish th…');
    (0, testing_1.expect)((0, text_1.cut)('Short', 10)).toBe('Short');
});
