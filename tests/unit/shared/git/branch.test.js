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
var tasks_controller_1 = require("../../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var record_source_1 = require("../../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../../helpers");
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var LONG_TITLE = 'Feature parity audit of the menu against the engine, see http://localhost:5173/menu';
// A name the old slugging made: the whole title, cut at 50 characters.
var OLD_BRANCH = 'task/feature-parity-audit-of-the-menu-against-the-engin';
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var repo = function (tasks, branches, more) {
    var _a;
    if (more === void 0) { more = {}; }
    return (0, helpers_1.memoryHost)({
        files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks })), _a),
        git: __assign({ 'git rev-parse --is-inside-work-tree': { stdout: 'true\n' }, 'git status --porcelain=v2 --branch': { stdout: CLEAN }, 'git branch --format=%(refname:short)': { stdout: "".concat(branches.join('\n'), "\n") }, 'git rev-parse HEAD': { stdout: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n' } }, more),
    });
};
(0, testing_1.test)('a new task gets a short branch, and its whole title stays in the record', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, ports, _a, saved;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: LONG_TITLE });
                mem = repo([task], ['main'], { 'git switch -c task/feature-parity-audit-menu': {} });
                ports = (0, helpers_1.fakePorts)(mem).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toBe('started');
                saved = stored(mem).tasks[0];
                (0, testing_1.expect)(saved.branch).toBe('task/feature-parity-audit-menu');
                (0, testing_1.expect)(saved.title).toBe(LONG_TITLE);
                (0, testing_1.expect)(mem.runs).toContainEqual(['git', 'switch', '-c', 'task/feature-parity-audit-menu']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a short name another branch has gets the next free number', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, ports, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: LONG_TITLE });
                mem = repo([task], ['main', 'task/feature-parity-audit-menu', 'task/feature-parity-audit-menu-2'], {
                    'git switch -c task/feature-parity-audit-menu-3': {},
                });
                ports = (0, helpers_1.fakePorts)(mem).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toBe('started');
                (0, testing_1.expect)(stored(mem).tasks[0].branch).toBe('task/feature-parity-audit-menu-3');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task put back on a branch with an old long name goes back to that branch, never renamed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, ports, _a, saved;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: LONG_TITLE, branch: OLD_BRANCH, startCommit: '0f0f0f0', baseBranch: 'main' });
                mem = repo([task], ['main', OLD_BRANCH], (_b = {}, _b["git switch ".concat(OLD_BRANCH)] = {}, _b));
                ports = (0, helpers_1.fakePorts)(mem).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe('started');
                saved = stored(mem).tasks[0];
                (0, testing_1.expect)([saved.branch, saved.startCommit, saved.baseBranch, saved.title]).toEqual([OLD_BRANCH, '0f0f0f0', 'main', LONG_TITLE]);
                (0, testing_1.expect)(mem.runs).toContainEqual(['git', 'switch', OLD_BRANCH]);
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.includes('-c') || argv.includes('-m') || argv.includes('-M'); })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task whose old branch is gone starts again on a short one and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, _a, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: LONG_TITLE, branch: OLD_BRANCH, startCommit: '0f0f0f0' });
                mem = repo([task], ['main'], { 'git switch -c task/feature-parity-audit-menu': {} });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('started');
                (0, testing_1.expect)(stored(mem).tasks[0].branch).toBe('task/feature-parity-audit-menu');
                (0, testing_1.expect)(view.notice).toBe("".concat(OLD_BRANCH, " was gone, so this task starts again on task/feature-parity-audit-menu, made from main."));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a record with old long branch names reads and writes back unchanged', function () {
    var done = (0, helpers_1.makeTask)({ title: LONG_TITLE, state: 'done', branch: OLD_BRANCH });
    var text = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [done] }));
    var read = (0, record_source_1.parseRecord)(text);
    (0, testing_1.expect)(read === 'unreadable' ? null : read.tasks[0].branch).toBe(OLD_BRANCH);
});
