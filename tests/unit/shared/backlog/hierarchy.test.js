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
var queue_controller_1 = require("../../../../hooks/features/tasks/presentation/state_management/queue_controller");
var filing_controller_1 = require("../../../../hooks/features/tasks/presentation/state_management/filing_controller");
var tasks_controller_1 = require("../../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var message_check_controller_1 = require("../../../../hooks/features/message_check/presentation/state_management/message_check_controller");
var record_source_1 = require("../../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../../helpers");
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var DIRTY = [OID, '# branch.head task/menu', '# branch.upstream origin/task/menu', '# branch.ab +0 -0', '? a.ts', ''].join('\n');
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var recordOf = function (tasks, feature) {
    if (feature === void 0) { feature = null; }
    return (__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks, feature: feature }));
};
var repo = function (r, git) {
    var _a;
    if (git === void 0) { git = {}; }
    return (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(r), _a), git: git });
};
var gitWith = function (status, more) {
    if (more === void 0) { more = {}; }
    return (__assign({ 'git rev-parse --is-inside-work-tree': { stdout: 'true\n' }, 'git status --porcelain=v2 --branch': { stdout: status }, 'git branch --format=%(refname:short)': { stdout: 'main\n' }, 'git rev-parse HEAD': { stdout: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n' } }, more));
};
var ARROWS = { text: 'add arrow keys to the menu', title: 'Arrow keys', priority: 'high', difficulty: 'light', intent: 'improving' };
var isGitWrite = function (argv) { var _a; return argv[0] === 'git' && ['switch', 'checkout', 'branch', 'commit', 'push'].includes((_a = argv[1]) !== null && _a !== void 0 ? _a : ''); };
(0, testing_1.test)('with a feature active, a message the check ties to it is offered under it, Save waiting on nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, r, _a, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                r = recordOf([menu], menu.id);
                _a = (0, helpers_1.fakePorts)(repo(r), {
                    reply: "{\"kind\":\"new\",\"intent\":\"improving\",\"title\":\"Arrow keys\",\"difficulty\":\"light\",\"parent\":\"".concat(menu.id, "\"}"),
                    view: { record: r },
                }), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'add arrow keys')];
            case 1:
                _b.apply(void 0, [(_c.sent()).kind]).toBe('new');
                (0, testing_1.expect)(view.band).toEqual(__assign(__assign({ kind: 'file' }, ARROWS), { text: 'add arrow keys', priority: 'mid', parent: { kind: 'task', id: menu.id }, choices: [menu.id] }));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with a feature active, unrelated work stays on its own; the check is told which one is active', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, r, prompts, _a, ports, view, fork;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                r = recordOf([menu], menu.id);
                prompts = [];
                _a = (0, helpers_1.fakePorts)(repo(r), {
                    reply: '{"kind":"new","intent":"improving","title":"CI cache","difficulty":"light","parent":"none"}',
                    view: { record: r },
                }), ports = _a.ports, view = _a.view;
                fork = ports.ask.fork;
                ports.ask.fork = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        prompts.push(prompt);
                        return [2 /*return*/, fork(prompt)];
                    });
                }); };
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'fix the CI cache')];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.band.kind === 'file' ? view.band.parent : undefined).toEqual({ kind: 'none' });
                (0, testing_1.expect)(prompts[0]).toContain("".concat(menu.id, " \"Menu parity\" (active)"));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('when the check can’t tell, Rohan is asked, and Save files nothing until he picks', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, r, mem, _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                r = recordOf([menu], menu.id);
                mem = repo(r);
                _a = (0, helpers_1.fakePorts)(mem, {
                    reply: '{"kind":"new","intent":"improving","title":"Tidy","difficulty":"light","parent":"unsure"}',
                    view: { record: r },
                }), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'tidy things up')];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.band.kind === 'file' ? view.band.parent : undefined).toBeNull();
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, __assign(__assign({}, ARROWS), { parent: null }))];
            case 2:
                _b.sent();
                (0, testing_1.expect)(view.notice).toBe('Pick what it is part of first, or On its own.');
                (0, testing_1.expect)(mem.writes).toEqual([]);
                (0, testing_1.expect)(view.band.kind).toBe('file');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a message the check ties to a task on its own is offered under it; saved, that task becomes its feature', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, docs, r, mem, prompts, _a, ports, view, done, settle, fork, saved;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Insole bridge', state: 'current', branch: 'task/insole-bridge', startCommit: 'abc1234' });
                docs = (0, helpers_1.makeTask)({ title: 'Fix the documentation' });
                r = recordOf([now, docs]);
                mem = repo(r, gitWith(CLEAN));
                prompts = [];
                _a = (0, helpers_1.fakePorts)(mem, {
                    reply: "{\"kind\":\"new\",\"intent\":\"improving\",\"title\":\"Homepage parts\",\"difficulty\":\"light\",\"parent\":\"".concat(docs.id, "\"}"),
                    view: { record: r },
                }), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                fork = ports.ask.fork;
                ports.ask.fork = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        prompts.push(prompt);
                        return [2 /*return*/, fork(prompt)];
                    });
                }); };
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'the parts on the home page should go elsewhere')];
            case 1:
                _b.sent();
                (0, testing_1.expect)(prompts[0]).toContain("Tasks on their own: ".concat(docs.id, " \"Fix the documentation\"."));
                (0, testing_1.expect)(view.band).toMatchObject({ kind: 'file', parent: { kind: 'task', id: docs.id }, choices: [docs.id, now.id] });
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, __assign(__assign({}, ARROWS), { title: 'Homepage parts', parent: { kind: 'task', id: docs.id } }))];
            case 2:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 3:
                _b.sent();
                saved = stored(mem);
                (0, testing_1.expect)(saved.tasks.map(function (t) { return [t.title, t.state, t.parentId]; })).toEqual([
                    ['Insole bridge', 'current', null],
                    ['Fix the documentation', 'queued', null],
                    ['Homepage parts', 'queued', docs.id],
                ]);
                (0, testing_1.expect)(saved.feature).toBeNull();
                (0, testing_1.expect)(mem.runs.filter(isGitWrite)).toEqual([]);
                (0, testing_1.expect)(done.toasts).toEqual(['Queued: Homepage parts (high) · part of Fix the documentation']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('filing a task under the current one keeps the current task, its branch and the conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, r, mem, _a, ports, done, settle, tasks;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity', state: 'current', branch: 'task/menu-parity', startCommit: 'abc1234' });
                r = recordOf([menu]);
                mem = repo(r, gitWith(CLEAN));
                _a = (0, helpers_1.fakePorts)(mem, { view: { record: r } }), ports = _a.ports, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, __assign(__assign({}, ARROWS), { parent: { kind: 'task', id: menu.id } }))];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                tasks = stored(mem).tasks;
                (0, testing_1.expect)(tasks.map(function (t) { return [t.title, t.state, t.branch, t.parentId]; })).toEqual([
                    ['Menu parity', 'current', 'task/menu-parity', null],
                    ['Arrow keys', 'queued', null, menu.id],
                ]);
                (0, testing_1.expect)(tasks[1].title).toBe('Arrow keys');
                (0, testing_1.expect)(mem.runs.filter(isGitWrite)).toEqual([]);
                (0, testing_1.expect)([done.clears, done.submits]).toEqual([0, []]);
                (0, testing_1.expect)(done.toasts).toEqual(['Queued: Arrow keys (high) · part of Menu parity']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a new feature is filed with its first task; with nothing current, the task starts, not the feature', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, settle, _b, feature, arrows;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = repo(recordOf([]), gitWith(CLEAN, { 'git switch -c task/arrow-keys': {} }));
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, settle = _a.settle;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, __assign(__assign({}, ARROWS), { parent: { kind: 'new', title: '  Menu parity ' } }))];
            case 1:
                _c.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                _b = stored(mem).tasks, feature = _b[0], arrows = _b[1];
                (0, testing_1.expect)([feature === null || feature === void 0 ? void 0 : feature.title, feature === null || feature === void 0 ? void 0 : feature.state, feature === null || feature === void 0 ? void 0 : feature.parentId, feature === null || feature === void 0 ? void 0 : feature.priority]).toEqual(['Menu parity', 'queued', null, 'high']);
                (0, testing_1.expect)([arrows === null || arrows === void 0 ? void 0 : arrows.title, arrows === null || arrows === void 0 ? void 0 : arrows.state, arrows === null || arrows === void 0 ? void 0 : arrows.branch, arrows === null || arrows === void 0 ? void 0 : arrows.parentId]).toEqual(['Arrow keys', 'current', 'task/arrow-keys', feature === null || feature === void 0 ? void 0 : feature.id]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a new feature with no name files nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = repo(recordOf([]));
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, __assign(__assign({}, ARROWS), { parent: { kind: 'new', title: ' ' } }))];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.notice).toBe('Name the new feature first.');
                (0, testing_1.expect)(mem.writes).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a feature removed in another session since the band went up: refused, nothing filed, the band kept', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, mem, _a, ports, view, done;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                mem = repo(recordOf([__assign(__assign({}, menu), { state: 'removed' })]));
                _a = (0, helpers_1.fakePorts)(mem, { view: { band: __assign(__assign({ kind: 'file' }, ARROWS), { parent: { kind: 'task', id: menu.id }, choices: [menu.id] }) } }), ports = _a.ports, view = _a.view, done = _a.done;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, __assign(__assign({}, ARROWS), { parent: { kind: 'task', id: menu.id } }))];
            case 1:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return t.title; })).toEqual(['Menu parity']);
                (0, testing_1.expect)(view.notice).toBe('That feature is no longer open. Pick again.');
                (0, testing_1.expect)(view.band.kind).toBe('file');
                (0, testing_1.expect)(done.toasts).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('two sessions filing at once: each task is kept, with its feature', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, mem, ports, other, read, isFirst;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity', state: 'current' });
                mem = repo(recordOf([menu]));
                ports = (0, helpers_1.fakePorts)(mem).ports;
                other = (0, helpers_1.makeTask)({ title: 'From the other session', parentId: menu.id });
                read = mem.host.read;
                isFirst = true;
                mem.host.read = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    var text;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, read(path)];
                            case 1:
                                text = _a.sent();
                                if (isFirst && path === helpers_1.CTX.file) {
                                    isFirst = false;
                                    mem.files.set(helpers_1.CTX.file, JSON.stringify(recordOf([menu, other])));
                                    return [2 /*return*/, mem.files.get(helpers_1.CTX.file)];
                                }
                                return [2 /*return*/, text];
                        }
                    });
                }); };
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, __assign(__assign({}, ARROWS), { parent: { kind: 'task', id: menu.id } }))];
            case 1:
                _a.sent();
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return [t.title, t.parentId]; })).toEqual([
                    ['Menu parity', null],
                    ['From the other session', menu.id],
                    ['Arrow keys', menu.id],
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a write from another session after this one keeps the parent and the feature', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, mem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys', parentId: menu.id });
                mem = repo(recordOf([menu, keys], menu.id));
                // A change that knows nothing of features, as an older Queue-tea's, spreads
                // the record and the tasks it read.
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, helpers_1.CTX.file, function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (__assign(__assign({}, t), { priority: 'low' })); }) })); }, 'p', '/p')];
            case 1:
                // A change that knows nothing of features, as an older Queue-tea's, spreads
                // the record and the tasks it read.
                _a.sent();
                (0, testing_1.expect)(stored(mem).feature).toBe(menu.id);
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return [t.priority, t.parentId]; })).toEqual([
                    ['low', null],
                    ['low', menu.id],
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Part of…: a task moves under a feature and back; deeper nesting is refused with why', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, docs, mem, _a, ports, view, done;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys', parentId: menu.id });
                docs = (0, helpers_1.makeTask)({ title: 'Docs' });
                mem = repo(recordOf([menu, keys, docs]));
                _a = (0, helpers_1.fakePorts)(mem, { view: { parenting: docs.id } }), ports = _a.ports, view = _a.view, done = _a.done;
                return [4 /*yield*/, (0, queue_controller_1.moveTask)(ports, helpers_1.CTX, docs.id, menu.id)];
            case 1:
                _f.sent();
                (0, testing_1.expect)((_b = stored(mem).tasks.find(function (t) { return t.id === docs.id; })) === null || _b === void 0 ? void 0 : _b.parentId).toBe(menu.id);
                (0, testing_1.expect)(view.parenting).toBeNull();
                (0, testing_1.expect)(done.toasts).toEqual(['Part of Menu parity: Docs']);
                return [4 /*yield*/, (0, queue_controller_1.moveTask)(ports, helpers_1.CTX, docs.id, null)];
            case 2:
                _f.sent();
                (0, testing_1.expect)((_c = stored(mem).tasks.find(function (t) { return t.id === docs.id; })) === null || _c === void 0 ? void 0 : _c.parentId).toBeNull();
                (0, testing_1.expect)(done.toasts.at(-1)).toBe('On its own: Docs');
                return [4 /*yield*/, (0, queue_controller_1.moveTask)(ports, helpers_1.CTX, docs.id, keys.id)];
            case 3:
                _f.sent();
                (0, testing_1.expect)((_d = stored(mem).tasks.find(function (t) { return t.id === docs.id; })) === null || _d === void 0 ? void 0 : _d.parentId).toBeNull();
                (0, testing_1.expect)(view.notice).toBe('Keys is part of Menu parity, so its tasks go under that.');
                return [4 /*yield*/, (0, queue_controller_1.moveTask)(ports, helpers_1.CTX, menu.id, docs.id)];
            case 4:
                _f.sent();
                (0, testing_1.expect)((_e = stored(mem).tasks.find(function (t) { return t.id === menu.id; })) === null || _e === void 0 ? void 0 : _e.parentId).toBeNull();
                (0, testing_1.expect)(view.notice).toBe("Menu parity has tasks of its own, so it can't be part of another.");
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('moving the current task under a feature changes nothing else about it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, menu, mem, ports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now', startCommit: 'abc1234' });
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                mem = repo(recordOf([now, menu]));
                ports = (0, helpers_1.fakePorts)(mem).ports;
                return [4 /*yield*/, (0, queue_controller_1.moveTask)(ports, helpers_1.CTX, now.id, menu.id)];
            case 1:
                _a.sent();
                (0, testing_1.expect)(stored(mem).tasks[0]).toEqual(__assign(__assign({}, now), { parentId: menu.id }));
                (0, testing_1.expect)(mem.runs.filter(isGitWrite)).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('/feature: shows, sets by title or id, says when several or none match, and clears', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, menuDocs, keys, mem, ports, _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                menuDocs = (0, helpers_1.makeTask)({ title: 'Menu docs' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys hint', parentId: menu.id });
                mem = repo(recordOf([menu, menuDocs, keys]));
                ports = (0, helpers_1.fakePorts)(mem).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, '')];
            case 1:
                _a.apply(void 0, [_k.sent()]).toBe('No active feature. /feature <title of a task> sets one; /feature off clears it.');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, 'menu')];
            case 2:
                _b.apply(void 0, [_k.sent()]).toBe('Several tasks match: Menu parity; Menu docs. Use more of the title.');
                _c = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, 'dark mode')];
            case 3:
                _c.apply(void 0, [_k.sent()]).toBe('No open task matches "dark mode". File it first with /steep, then /feature <its title>.');
                // A task under a feature is never one itself.
                _d = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, 'keys hint')];
            case 4:
                // A task under a feature is never one itself.
                _d.apply(void 0, [_k.sent()]).toBe('No open task matches "keys hint". File it first with /steep, then /feature <its title>.');
                (0, testing_1.expect)(stored(mem).feature).toBeNull();
                _e = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, 'menu PARITY')];
            case 5:
                _e.apply(void 0, [_k.sent()]).toBe('Active feature: Menu parity. New tasks that belong to it are offered under it.');
                (0, testing_1.expect)(stored(mem).feature).toBe(menu.id);
                _f = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, '')];
            case 6:
                _f.apply(void 0, [_k.sent()]).toBe('Active feature: Menu parity. /feature off clears it.');
                _g = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, menuDocs.id)];
            case 7:
                _g.apply(void 0, [_k.sent()]).toContain('Active feature: Menu docs.');
                _h = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, 'off')];
            case 8:
                _h.apply(void 0, [_k.sent()]).toBe('No active feature now.');
                (0, testing_1.expect)(stored(mem).feature).toBeNull();
                _j = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.featureCommand)(ports, helpers_1.CTX, 'clear')];
            case 9:
                _j.apply(void 0, [_k.sent()]).toBe('No feature was active.');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('setFeature refuses a task under a feature, and one no longer open', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, old, mem, ports, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys', parentId: menu.id });
                old = (0, helpers_1.makeTask)({ title: 'Old', state: 'done' });
                mem = repo(recordOf([menu, keys, old]));
                ports = (0, helpers_1.fakePorts)(mem).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.setFeature)(ports, helpers_1.CTX, keys.id)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBe('Keys is part of Menu parity; make that the feature instead.');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, queue_controller_1.setFeature)(ports, helpers_1.CTX, old.id)];
            case 2:
                _b.apply(void 0, [_c.sent()]).toBe('That task is no longer open.');
                (0, testing_1.expect)(stored(mem).feature).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('removing a feature leaves its tasks on their own and it is no longer active', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, mem, ports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys', parentId: menu.id });
                mem = repo(recordOf([menu, keys], menu.id));
                ports = (0, helpers_1.fakePorts)(mem).ports;
                return [4 /*yield*/, (0, queue_controller_1.removeQueued)(ports, helpers_1.CTX, menu.id)];
            case 1:
                _a.sent();
                (0, testing_1.expect)(stored(mem).feature).toBeNull();
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return [t.state, t.parentId]; })).toEqual([
                    ['removed', null],
                    ['queued', null],
                ]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task under the current feature can’t start while the feature is current: one task at a time', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, mem, ports, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity', state: 'current', branch: 'task/menu-parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys', parentId: menu.id });
                mem = repo(recordOf([menu, keys]), gitWith(CLEAN, { 'git switch -c task/keys': {} }));
                ports = (0, helpers_1.fakePorts)(mem).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, keys.id)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toBe('failed');
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return t.state; })).toEqual(['current', 'queued']);
                (0, testing_1.expect)(mem.runs.filter(isGitWrite)).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task under a feature still waits for the git check', function () { return __awaiter(void 0, void 0, void 0, function () {
    var menu, keys, mem, _a, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                menu = (0, helpers_1.makeTask)({ title: 'Menu parity', state: 'done', branch: 'task/menu-parity' });
                keys = (0, helpers_1.makeTask)({ title: 'Keys', parentId: menu.id });
                mem = repo(recordOf([menu, keys]), gitWith(DIRTY));
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, keys.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('held');
                (0, testing_1.expect)(view.hold).toEqual({ taskId: keys.id, text: '1 file not committed' });
                (0, testing_1.expect)(mem.runs.filter(isGitWrite)).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
