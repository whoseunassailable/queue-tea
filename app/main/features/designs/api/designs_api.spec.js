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
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var messages_1 = require("../../../core/messages");
var node_host_1 = require("../../../core/node_host");
var designs_api_1 = require("./designs_api");
var KEY = 'gait-abc123';
var NOW = Date.parse('2026-11-05T12:00:00Z');
var AT = new Date(NOW).toISOString();
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var realm;
var designs;
var touched;
var writes;
var reveal;
var api;
var gitEnv = { GIT_CONFIG_GLOBAL: process.env.GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM: process.env.GIT_CONFIG_NOSYSTEM };
var git = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, run('git', args, { cwd: realm })];
            case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
        }
    }); });
};
var json = function (value) { return "".concat(JSON.stringify(value, null, 2), "\n"); };
var at = function (folder, file) { return (0, node_path_1.join)(designs, folder, file); };
var put = function (folder, file, content) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(designs, folder), { recursive: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(at(folder, file), typeof content === 'string' ? content : json(content))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var text = function (folder, file) { return (0, promises_1.readFile)(at(folder, file), 'utf8'); };
var onDisk = function (folder, file) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, text(folder, file)];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var backup = function (folder, file) { return (0, node_path_1.join)(home, '.queue-tea/designs', KEY, folder, file); };
var realmFiles = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, promises_1.readdir)(realm, { recursive: true })];
        case 1: return [2 /*return*/, (_a.sent()).filter(function (f) { return !f.startsWith('.git'); }).sort()];
    }
}); }); };
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var refused = function (answer) {
    if (answer.ok)
        throw new Error("should be refused, got ".concat(JSON.stringify(answer.data)));
    return answer.error.message;
};
// Every path the API hands the host, so a test can say none was built.
var recording = function (host) {
    return new Proxy(host, {
        get: function (target, prop) {
            var real = target[prop];
            if (typeof real !== 'function')
                return real;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (typeof args[0] === 'string')
                    touched.push((0, node_path_1.resolve)(args[0]));
                if (prop === 'run' && Array.isArray(args[0]) && args[0].includes('--'))
                    touched.push((0, node_path_1.resolve)(String(args[1]), String(args[0].at(-1))));
                if (prop === 'write' || prop === 'move' || prop === 'remove')
                    writes.push(String(args.at(prop === 'move' ? 1 : 0)));
                return real.apply(target, args);
            };
        },
    });
};
// From the sample realm the Design Tab was built against: a design with a
// layer type the editor doesn't know, and fields it doesn't know either.
var textLayer = function (id, name, x, y, words) { return ({ id: id, type: 'text', name: name, x: x, y: y, width: 342, text: words, font: 'Nunito Sans', size: 15, weight: 400, color: '#2A2218' }); };
var WELCOME = {
    format: 1,
    name: 'Welcome',
    width: 390,
    height: 844,
    fill: '#F6F1E7',
    grid: { size: 8 },
    edited: { by: 'claude', at: '2026-11-04T22:20:00.000Z' },
    nodes: [
        { id: 'hero', type: 'frame', name: 'Hero', x: 0, y: 0, width: 390, height: 420, fill: '#BFE3D5', radius: 0, children: [{ id: 'sun', type: 'frame', name: 'Sun', x: 250, y: 60, width: 90, height: 90, fill: '#FFE9A8', radius: 45, children: [] }] },
        __assign(__assign({}, textLayer('headline', 'Headline', 24, 293, 'Walk better every step')), { locked: true }),
        { id: 'tip', type: 'frame', name: 'Tip card', x: 24, y: 467, width: 342, height: 104, fill: '#DDF2E8', radius: 12, children: [textLayer('tip-title', 'Tip title', 16, 16, 'Pair both insoles first')] },
        { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] },
    ],
};
var PAIR = { format: 1, name: 'Pair your insoles', width: 390, height: 844, fill: '#FFFAEE', nodes: [textLayer('h', 'Headline', 24, 120, 'Pair your insoles')] };
var LIVE_WALK = '{\n  "format": 1,\n  "name": "Live walk",\n  "width": 390\n  "height": 844\n}\n';
var BROKEN_VERSION = '{ "format": 1, "label": "5.4.2",\n  "made": "2026-10-28T16:02:00-06:00"\n  "designs": [] }\n';
var comment = function (over) { return (__assign({ design: 'welcome', on: null, text: 'Shorter', by: 'Rohan', at: '2026-11-05T10:00:00.000Z', resolved: null, sentTo: null }, over)); };
var COMMENTS = [
    comment({ id: 'c1', on: 'headline', text: 'Make the headline shorter, it wraps to three lines on a small phone.' }),
    comment({ id: 'c2', text: 'The hero is too tall: the button drops below the fold.' }),
    comment({ id: 'c3', on: 'tip', text: 'Use the jade tip card, not grey.', resolved: '2026-11-04T15:00:00.000Z' }),
];
var VERSION = { format: 1, label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles', 'live-walk'], theme: 'day' };
var sample = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, put('5.4.3', 'version.json', VERSION)];
            case 1:
                _a.sent();
                return [4 /*yield*/, put('5.4.3', 'welcome.design.json', WELCOME)];
            case 2:
                _a.sent();
                return [4 /*yield*/, put('5.4.3', 'pair-your-insoles.design.json', PAIR)];
            case 3:
                _a.sent();
                return [4 /*yield*/, put('5.4.3', 'live-walk.design.json', LIVE_WALK)];
            case 4:
                _a.sent();
                return [4 /*yield*/, put('5.4.3', 'comments.json', { format: 1, comments: COMMENTS, pinned: [] })];
            case 5:
                _a.sent();
                return [4 /*yield*/, put('onboarding-pass-2', 'version.json', { format: 1, label: 'Onboarding pass 2', made: '2026-11-01T10:00:00-06:00', by: 'you', from: 'v5', designs: ['welcome'] })];
            case 6:
                _a.sent();
                return [4 /*yield*/, put('onboarding-pass-2', 'welcome.design.json', WELCOME)];
            case 7:
                _a.sent();
                return [4 /*yield*/, put('5.4.2', 'version.json', BROKEN_VERSION)];
            case 8:
                _a.sent();
                return [4 /*yield*/, put('5.4.2', 'welcome.design.json', WELCOME)];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var readFirst = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (id) {
        var read, _a;
        if (id === void 0) { id = 'welcome'; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.readDesign(KEY, '5.4.3', id)];
                case 1:
                    read = _a.apply(void 0, [_b.sent()]);
                    if (read.kind !== 'ready')
                        throw new Error('should read');
                    return [2 /*return*/, read];
            }
        });
    });
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                // The realm's own git config only, whatever this machine's says.
                process.env.GIT_CONFIG_GLOBAL = '/dev/null';
                process.env.GIT_CONFIG_NOSYSTEM = '1';
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-designs-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                realm = (0, node_path_1.join)(home, 'gait');
                designs = (0, node_path_1.join)(realm, 'docs/designs');
                touched = [];
                writes = [];
                return [4 /*yield*/, (0, promises_1.mkdir)(realm)];
            case 3:
                _b.sent();
                return [4 /*yield*/, git('init', '-q', '-b', 'main')];
            case 4:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.email', 'test@example.com')];
            case 5:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.name', 'Rohan Bhande')];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify((0, record_source_1.emptyRecord)('Gait-feedback', realm)))];
            case 8:
                _b.sent();
                return [4 /*yield*/, sample()];
            case 9:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                reveal = vitest_1.vi.fn();
                api = (0, designs_api_1.designsApi)({
                    host: recording((0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); })),
                    home: home,
                    now: function () { return NOW; },
                    log: log,
                    offsetMinutes: function () { return 60; },
                    newId: function () { return 'q-1'; },
                    terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); },
                    copy: function () { },
                    reveal: reveal,
                    listFolders: function (dir) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, (0, promises_1.readdir)(dir, { withFileTypes: true })];
                                case 1: return [2 /*return*/, (_b.sent()).filter(function (e) { return e.isDirectory(); }).map(function (e) { return e.name; })];
                                case 2:
                                    _a = _b.sent();
                                    // No docs/designs yet holds no versions.
                                    return [2 /*return*/, []];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); },
                });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, _b, name_1, was;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                for (_i = 0, _a = Object.entries(gitEnv); _i < _a.length; _i++) {
                    _b = _a[_i], name_1 = _b[0], was = _b[1];
                    if (was === undefined)
                        delete process.env[name_1];
                    else
                        process.env[name_1] = was;
                }
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)('the history rail', function () {
    var folders = function (view) { return view.versions.map(function (v) { return v.folder; }); };
    (0, vitest_1.it)('lists versions newest made first, and one that does not read by its file time', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.utimes)(at('5.4.2', 'version.json'), new Date('2026-11-02T00:00:00Z'), new Date('2026-11-02T00:00:00Z'))];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, put('v5', 'version.json', { format: 1, label: 'v5' })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.utimes)(at('v5', 'version.json'), new Date('2026-10-01T00:00:00Z'), new Date('2026-10-01T00:00:00Z'))];
                case 3:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = folders;
                    _c = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_c.apply(void 0, [_d.sent()])])]).toEqual(['5.4.3', '5.4.2', 'onboarding-pass-2', 'v5']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('orders by when versions were made, never by their labels', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, put('9.0', 'version.json', { format: 1, label: '9.0', made: '2026-01-01T00:00:00Z' })];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = folders;
                    _c = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.apply(void 0, [_d.sent()])]).at(-1)]).toBe('9.0');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a version that does not read by its folder, with the file and line', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 1:
                    row = _a.apply(void 0, [_b.sent()]).versions.find(function (v) { return v.folder === '5.4.2'; });
                    (0, vitest_1.expect)(row).toMatchObject({ label: '5.4.2', designCount: 1, problem: { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: null } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when a folder has no version file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, put('stray', 'welcome.design.json', WELCOME)];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 2:
                    _a.apply(void 0, [(_d = (_c = _b.apply(void 0, [_e.sent()]).versions.find(function (v) { return v.folder === 'stray'; })) === null || _c === void 0 ? void 0 : _c.problem) === null || _d === void 0 ? void 0 : _d.detail]).toMatch(/no version file/);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts each version\'s designs and comments', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 1:
                    row = _a.apply(void 0, [_b.sent()]).versions.find(function (v) { return v.folder === '5.4.3'; });
                    (0, vitest_1.expect)(row).toMatchObject({ folder: '5.4.3', label: '5.4.3', by: 'claude', from: '5.4.2', designCount: 3, open: 2, resolved: 1, sent: 0, sentTo: null, problem: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves out folders whose names the window could not send back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var listed, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, put('UPPER', 'version.json', { format: 1, label: 'UPPER' })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, put('.hidden', 'version.json', { format: 1, label: 'hidden' })];
                case 2:
                    _c.sent();
                    _a = folders;
                    _b = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 3:
                    listed = _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]);
                    (0, vitest_1.expect)(listed).not.toContain('UPPER');
                    (0, vitest_1.expect)(listed).not.toContain('.hidden');
                    (0, vitest_1.expect)(listed).toHaveLength(3);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has nothing to list in a realm with no docs/designs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.rm)(designs, { recursive: true })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ versions: [], coming: [] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows a version filed but not drafted yet as coming', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'version.json', __assign(__assign({}, VERSION), { next: { label: '5.4.4', quest: 'Designs 5.4.4' } }))];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).coming]).toEqual([{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.3' }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stops showing it as coming once its folder is there, whatever its spelling', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'version.json', __assign(__assign({}, VERSION), { next: { label: 'Onboarding Pass 3', quest: 'Designs' } }))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, put('onboarding-pass-3', 'version.json', { format: 1, label: 'Onboarding pass 3', made: '2026-11-05T00:00:00Z' })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).coming]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a realm it does not know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readDesigns('nope-000000')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, api.readDesigns('../../etc')];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.unknownProject);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a version', function () {
    var view = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (folder) {
            var _a;
            if (folder === void 0) { folder = '5.4.3'; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = data;
                        return [4 /*yield*/, api.readDesignVersion(KEY, folder)];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    (0, vitest_1.it)('lists its designs in the version\'s order, then the rest by name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'version.json', __assign(__assign({}, VERSION), { designs: ['pair-your-insoles', 'gone', 'welcome'] }))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, put('5.4.3', 'zeta.design.json', PAIR)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, put('5.4.3', 'alpha.design.json', PAIR)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, put('5.4.3', 'Bad.Name.design.json', PAIR)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, put('5.4.3', 'notes.txt', 'not a design')];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, view()];
                case 6:
                    _a.apply(void 0, [(_b.sent()).designs]).toEqual(['pair-your-insoles', 'welcome', 'alpha', 'live-walk', 'zeta']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives its comments and label', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, view()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ folder: '5.4.3', label: '5.4.3', comments: COMMENTS, commentsProblem: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when its comments do not read, and lists none', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'comments.json', '{ "format": 1,\n "comments": [\n }')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, view()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ comments: [], commentsProblem: { file: 'docs/designs/5.4.3/comments.json', detail: 'It has a mistake near line 3.' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts the files in its folder git has not been given', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, view()];
                case 1:
                    _a.apply(void 0, [(_d.sent()).uncommitted]).toBe(5);
                    return [4 /*yield*/, git('add', '.')];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, git('commit', '-q', '-m', 'designs')];
                case 3:
                    _d.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, view()];
                case 4:
                    _b.apply(void 0, [(_d.sent()).uncommitted]).toBe(0);
                    return [4 /*yield*/, put('5.4.3', 'welcome.design.json', __assign(__assign({}, WELCOME), { name: 'Hello' }))];
                case 5:
                    _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, view()];
                case 6:
                    _c.apply(void 0, [(_d.sent()).uncommitted]).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts nothing uncommitted outside git', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(realm, '.git'), { recursive: true })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, view()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).uncommitted]).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses one that does not read, naming its file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readDesignVersion(KEY, '5.4.2')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(messages_1.MESSAGES.brokenVersion('docs/designs/5.4.2/version.json'));
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('reading a design', function () {
    (0, vitest_1.it)('reads a good one with a stamp that stays while the file does', function () { return __awaiter(void 0, void 0, void 0, function () {
        var first, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    first = _b.sent();
                    (0, vitest_1.expect)(first.scene.name).toBe('Welcome');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, readFirst()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).stamp]).toBe(first.stamp);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the last good copy outside the realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, realmFiles()];
                case 1:
                    before = _e.sent();
                    return [4 /*yield*/, readFirst()];
                case 2:
                    _e.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(backup('5.4.3', 'welcome.design.json'), 'utf8')];
                case 3:
                    _c = (_a = _b.apply(void 0, [_e.sent()])).toBe;
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 4:
                    _c.apply(_a, [_e.sent()]);
                    (0, vitest_1.expect)(backup('5.4.3', 'welcome.design.json').startsWith(realm)).toBe(false);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, realmFiles()];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toEqual(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says which file does not read and near which line, with no copy yet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var read, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.readDesign(KEY, '5.4.3', 'live-walk')];
                case 1:
                    read = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(read).toEqual({ kind: 'broken', problem: { file: 'docs/designs/5.4.3/live-walk.design.json', detail: 'It has a mistake near line 5.', backupAt: null } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when there is a last good copy to go back to', function () { return __awaiter(void 0, void 0, void 0, function () {
        var read, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, put('5.4.3', 'welcome.design.json', '{')];
                case 2:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, api.readDesign(KEY, '5.4.3', 'welcome')];
                case 3:
                    read = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(read.problem.backupAt).toEqual(vitest_1.expect.any(Number));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves a file that does not read exactly as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, api.readDesign(KEY, '5.4.3', 'live-walk')];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'live-walk.design.json')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(LIVE_WALK);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses to open a file over 2 MB', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'welcome.design.json', __assign(__assign({}, WELCOME), { nodes: [textLayer('big', 'Big', 0, 0, 'x'.repeat(2200000))] }))];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.readDesign(KEY, '5.4.3', 'welcome')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toMatchObject({ kind: 'broken', problem: { detail: 'It’s larger than 2 MB.' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when the design is not on disk any more', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.readDesign(KEY, '5.4.3', 'nope')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(messages_1.MESSAGES.designGone);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('saving a design', function () {
    var moved = function (scene) { return (__assign(__assign({}, scene), { nodes: scene.nodes.map(function (l) { return (l.id === 'headline' ? __assign(__assign({}, l), { x: 40 }) : l); }) })); };
    (0, vitest_1.it)('saves over the file it read, and says who edited it when', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, saved, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _d.sent(), scene = _a.scene, stamp = _a.stamp;
                    _b = data;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp)];
                case 2:
                    saved = _b.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(saved).toEqual({ kind: 'saved', stamp: vitest_1.expect.any(String), at: NOW });
                    (0, vitest_1.expect)(saved.stamp).not.toBe(stamp);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'welcome.design.json')];
                case 3:
                    _c.apply(void 0, [(_d.sent()).edited]).toEqual({ by: 'you', at: AT });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('writes back every field and layer it does not know, exactly as read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _d.sent(), scene = _a.scene, stamp = _a.stamp;
                    _b = data;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp)];
                case 2:
                    _b.apply(void 0, [_d.sent()]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'welcome.design.json')];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toEqual(__assign(__assign({}, moved(WELCOME)), { edited: { by: 'you', at: AT } }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('writes nothing over a file that changed since it was read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, theirs, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _e.sent(), scene = _a.scene, stamp = _a.stamp;
                    return [4 /*yield*/, put('5.4.3', 'welcome.design.json', __assign(__assign({}, WELCOME), { name: 'Changed by Claude' }))];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 3:
                    theirs = _e.sent();
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp)];
                case 4:
                    _b.apply(void 0, [_c.apply(void 0, [_e.sent()])]).toEqual({ kind: 'changed' });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toBe(theirs);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says changed when the file is gone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _d.sent(), scene = _a.scene, stamp = _a.stamp;
                    return [4 /*yield*/, (0, promises_1.rm)(at('5.4.3', 'welcome.design.json'))];
                case 2:
                    _d.sent();
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', scene, stamp)];
                case 3:
                    _b.apply(void 0, [_c.apply(void 0, [_d.sent()])]).toEqual({ kind: 'changed' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves again with the stamp the last save gave', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, first, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _e.sent(), scene = _a.scene, stamp = _a.stamp;
                    _b = data;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp)];
                case 2:
                    first = _b.apply(void 0, [_e.sent()]);
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', scene, first.stamp)];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()]).kind]).toBe('saved');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('runs two saves at once one after the other, so the second sees the first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, answers, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _c.sent(), scene = _a.scene, stamp = _a.stamp;
                    return [4 /*yield*/, Promise.all([api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp), api.saveDesign(KEY, '5.4.3', 'welcome', scene, stamp)])];
                case 2:
                    answers = _c.sent();
                    (0, vitest_1.expect)(answers.map(function (a) { return data(a).kind; })).toEqual(['saved', 'changed']);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'welcome.design.json')];
                case 3:
                    _b.apply(void 0, [(_c.sent()).nodes[1].x]).toBe(40);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a design the app could not read back, and leaves the file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, before, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _e.sent(), scene = _a.scene, stamp = _a.stamp;
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 2:
                    before = _e.sent();
                    _b = vitest_1.expect;
                    _c = refused;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', __assign(__assign({}, scene), { fill: 'jade' }), stamp)];
                case 3:
                    _b.apply(void 0, [_c.apply(void 0, [_e.sent()])]).toBe(messages_1.MESSAGES.badScene);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toBe(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the file as it was as the last good copy, and leaves no temp file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, scene, stamp, before, files, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _a = _e.sent(), scene = _a.scene, stamp = _a.stamp;
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 2:
                    before = _e.sent();
                    return [4 /*yield*/, realmFiles()];
                case 3:
                    files = _e.sent();
                    _b = data;
                    return [4 /*yield*/, api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp)];
                case 4:
                    _b.apply(void 0, [_e.sent()]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(backup('5.4.3', 'welcome.design.json'), 'utf8')];
                case 5:
                    _c.apply(void 0, [_e.sent()]).toBe(before);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, realmFiles()];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toEqual(files);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('saving yours beside a file that changed', function () {
    (0, vitest_1.it)('saves it as "<name> (yours)", listed right after the design', function () { return __awaiter(void 0, void 0, void 0, function () {
        var scene, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    scene = (_e.sent()).scene;
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.saveDesignCopy(KEY, '5.4.3', 'welcome', scene)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe('welcome-yours');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'welcome-yours.design.json')];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toMatchObject({ name: 'Welcome (yours)', edited: { by: 'you', at: AT }, grid: { size: 8 } });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toMatchObject(__assign(__assign({}, VERSION), { designs: ['welcome', 'welcome-yours', 'pair-your-insoles', 'live-walk'] }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives a second copy a free name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var scene, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    scene = (_d.sent()).scene;
                    _a = data;
                    return [4 /*yield*/, api.saveDesignCopy(KEY, '5.4.3', 'welcome', scene)];
                case 2:
                    _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.saveDesignCopy(KEY, '5.4.3', 'welcome', scene)];
                case 3:
                    _b.apply(void 0, [_c.apply(void 0, [_d.sent()])]).toBe('welcome-yours-2');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the last good copy', function () {
    (0, vitest_1.it)('puts a design back as it last read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var good, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, readFirst()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 2:
                    good = _c.sent();
                    return [4 /*yield*/, put('5.4.3', 'welcome.design.json', '{ broken')];
                case 3:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.restoreDesignFile(KEY, '5.4.3', 'welcome')];
                case 4:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'welcome.design.json')];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toBe(good);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('puts a version file back, so the version reads again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, put('5.4.2', 'version.json', { format: 1, label: '5.4.2', made: '2026-10-28T16:02:00-06:00' })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, put('5.4.2', 'version.json', BROKEN_VERSION)];
                case 3:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, api.restoreDesignFile(KEY, '5.4.2', 'version')];
                case 4:
                    _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 5:
                    _b.apply(void 0, [(_d = _c.apply(void 0, [_e.sent()]).versions.find(function (v) { return v.folder === '5.4.2'; })) === null || _d === void 0 ? void 0 : _d.problem]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('puts the comments file back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, api.readDesignVersion(KEY, '5.4.3')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, put('5.4.3', 'comments.json', '{')];
                case 2:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.restoreDesignFile(KEY, '5.4.3', 'comments')];
                case 3:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'comments.json')];
                case 4:
                    _b.apply(void 0, [(_c.sent()).comments]).toEqual(COMMENTS);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so when there is no copy to go back to', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.restoreDesignFile(KEY, '5.4.3', 'live-walk')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(messages_1.MESSAGES.noBackup);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('comments', function () {
    var add = function (over) {
        if (over === void 0) { over = {}; }
        return api.addDesignComment(KEY, '5.4.3', __assign({ design: 'welcome', on: 'headline', text: 'Bigger button' }, over));
    };
    (0, vitest_1.it)('adds one by the first word of git\'s user name, open, about the layer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var comments, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, add()];
                case 1:
                    comments = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(comments.at(-1)).toEqual({ id: vitest_1.expect.stringMatching(/^c-[0-9a-f]{8}$/), design: 'welcome', on: 'headline', text: 'Bigger button', by: 'Rohan', at: AT, resolved: null, sentTo: null });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'comments.json')];
                case 2:
                    _b.apply(void 0, [(_c.sent()).comments]).toEqual(comments);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the earlier comments and the fields it does not know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, file;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, add()];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, onDisk('5.4.3', 'comments.json')];
                case 2:
                    file = _b.sent();
                    (0, vitest_1.expect)(file.comments.slice(0, 3)).toEqual(COMMENTS);
                    (0, vitest_1.expect)(file.pinned).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('signs as You when git has no user name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, git('config', '--unset', 'user.name')];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, add()];
                case 2:
                    _a.apply(void 0, [(_c = _b.apply(void 0, [_d.sent()]).at(-1)) === null || _c === void 0 ? void 0 : _c.by]).toBe('You');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts the comments file with the first comment', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.addDesignComment(KEY, 'onboarding-pass-2', { design: 'welcome', on: null, text: '  First thoughts  ' })];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('onboarding-pass-2', 'comments.json')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toMatchObject({ format: 1, comments: [{ text: 'First thoughts', on: null }] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes an empty layer as the whole design', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, add({ on: '' })];
                case 1:
                    _a.apply(void 0, [(_c = _b.apply(void 0, [_d.sent()]).at(-1)) === null || _c === void 0 ? void 0 : _c.on]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['an empty comment', { text: '   ' }, 'Comment is required.'],
        ['a comment over 2,000 characters', { text: 'x'.repeat(2001) }, messages_1.MESSAGES.commentLong],
        ['a design that is not on disk', { design: 'nope' }, messages_1.MESSAGES.designGone],
        ['a design id that climbs out', { design: '../x' }, messages_1.MESSAGES.unknownDesign],
    ])('refuses %s and writes nothing', function (_, over, message) { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 1:
                    before = _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, add(over)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(message);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toBe(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses to add to a comments file that does not read, and leaves it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'comments.json', '{ nope')];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, add()];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.brokenComments('docs/designs/5.4.3/comments.json'));
                    _c = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toBe('{ nope');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses to comment on a version that does not read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.addDesignComment(KEY, '5.4.2', { design: 'welcome', on: null, text: 'Hi' })];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(messages_1.MESSAGES.brokenVersion('docs/designs/5.4.2/version.json'));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('resolves a comment, and reopens it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var resolved, _a, reopened, _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.setDesignComment(KEY, '5.4.3', 'c1', true)];
                case 1:
                    resolved = _a.apply(void 0, [_f.sent()]);
                    (0, vitest_1.expect)((_d = resolved.find(function (c) { return c.id === 'c1'; })) === null || _d === void 0 ? void 0 : _d.resolved).toBe(AT);
                    (0, vitest_1.expect)(resolved.find(function (c) { return c.id === 'c2'; })).toEqual(COMMENTS[1]);
                    _b = data;
                    return [4 /*yield*/, api.setDesignComment(KEY, '5.4.3', 'c1', false)];
                case 2:
                    reopened = _b.apply(void 0, [_f.sent()]);
                    (0, vitest_1.expect)((_e = reopened.find(function (c) { return c.id === 'c1'; })) === null || _e === void 0 ? void 0 : _e.resolved).toBeNull();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'comments.json')];
                case 3:
                    _c.apply(void 0, [(_f.sent()).comments]).toEqual(reopened);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when a comment is not there any more', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.setDesignComment(KEY, '5.4.3', 'gone', true)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(messages_1.MESSAGES.commentGone);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('sending the comments to the next version', function () {
    var send = function (next) { return api.sendDesignComments(KEY, '5.4.3', next); };
    (0, vitest_1.it)('marks only the open comments as sent to the new label', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, sent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'comments.json', { format: 1, comments: __spreadArray(__spreadArray([], COMMENTS, true), [comment({ id: 'c4', sentTo: '5.4.3' })], false) })];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, send({ label: '5.4.4', quest: 'Designs 5.4.4' })];
                case 2:
                    _a.apply(void 0, [_b.sent()]);
                    return [4 /*yield*/, onDisk('5.4.3', 'comments.json')];
                case 3:
                    sent = (_b.sent()).comments;
                    (0, vitest_1.expect)(sent.map(function (c) { return [c.id, c.resolved === null ? null : 'resolved', c.sentTo]; })).toEqual([
                        ['c1', null, '5.4.4'],
                        ['c2', null, '5.4.4'],
                        ['c3', 'resolved', null],
                        ['c4', null, '5.4.3'],
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names the coming version in the version file, keeping the rest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, send({ label: ' 5.4.4 ', quest: ' Designs 5.4.4 ' })];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toEqual(__assign(__assign({}, VERSION), { next: { label: '5.4.4', quest: 'Designs 5.4.4' }, approved: null }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the coming version and the sent count in the rail after', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, view, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, send({ label: '5.4.4', quest: 'Designs 5.4.4' })];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 2:
                    view = _b.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(view.coming).toEqual([{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.3' }]);
                    (0, vitest_1.expect)(view.versions.find(function (v) { return v.folder === '5.4.3'; })).toMatchObject({ open: 0, sent: 2, sentTo: '5.4.4' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a label another version already filed as coming, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var comments, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, put('onboarding-pass-2', 'version.json', { format: 1, label: 'Onboarding pass 2', made: '2026-11-01T10:00:00-06:00', next: { label: '5.4.4', quest: 'Designs 5.4.4' } })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 2:
                    comments = _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, send({ label: '5.4.4', quest: 'Another' })];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.labelTaken('5.4.4'));
                    _c = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toBe(comments);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves the comments file alone with no open comments', function () { return __awaiter(void 0, void 0, void 0, function () {
        var quiet, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    quiet = { format: 1, comments: [COMMENTS[2]] };
                    return [4 /*yield*/, put('5.4.3', 'comments.json', quiet)];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, send({ label: '5.4.4', quest: 'Designs 5.4.4' })];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(json(quiet));
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['a label taken by a folder', { label: '5.4.2', quest: 'Q' }, messages_1.MESSAGES.labelTaken('5.4.2')],
        ['a label whose folder is taken', { label: 'Onboarding Pass 2', quest: 'Q' }, messages_1.MESSAGES.labelTaken('Onboarding Pass 2')],
        ['no label', { label: '  ', quest: 'Q' }, messages_1.MESSAGES.badLabel],
        ['a label with no letter or number', { label: '!!!', quest: 'Q' }, messages_1.MESSAGES.badLabel],
        ['a label over 40 characters', { label: 'x'.repeat(41), quest: 'Q' }, messages_1.MESSAGES.badLabel],
        ['no quest title', { label: '5.4.4', quest: '' }, messages_1.MESSAGES.badQuestTitle],
        ['a quest title over 200 characters', { label: '5.4.4', quest: 'x'.repeat(201) }, messages_1.MESSAGES.badQuestTitle],
        ['nothing at all', null, messages_1.MESSAGES.badLabel],
    ])('refuses %s and writes nothing', function (_, next, message) { return __awaiter(void 0, void 0, void 0, function () {
        var version, comments, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, text('5.4.3', 'version.json')];
                case 1:
                    version = _e.sent();
                    return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 2:
                    comments = _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, send(next)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(message);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'version.json')];
                case 4:
                    _c.apply(void 0, [_e.sent()]).toBe(version);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'comments.json')];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toBe(comments);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('approving a version', function () {
    var APPROVAL = { by: 'Rohan', at: '2026-11-04T18:00:00.000Z' };
    (0, vitest_1.it)('approves by the first word of git\'s user name, now, keeping every other field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.setDesignApproval(KEY, '5.4.3', true)];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toEqual(__assign(__assign({}, VERSION), { next: null, approved: { by: 'Rohan', at: AT } }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('withdraws an approval as null, keeping every other field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, put('5.4.3', 'version.json', __assign(__assign({}, VERSION), { next: { label: '5.4.4', quest: 'Designs 5.4.4' }, approved: APPROVAL }))];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.setDesignApproval(KEY, '5.4.3', false)];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toEqual(__assign(__assign({}, VERSION), { next: { label: '5.4.4', quest: 'Designs 5.4.4' }, approved: null }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('signs as You when git has no user name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, git('config', '--unset', 'user.name')];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, api.setDesignApproval(KEY, '5.4.3', true)];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
                case 3:
                    _b.apply(void 0, [(_c.sent()).approved]).toEqual({ by: 'You', at: AT });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the approval on the version\'s row in the rail, and none on the others', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rows, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.setDesignApproval(KEY, '5.4.3', true)];
                case 1:
                    _a.apply(void 0, [_e.sent()]);
                    _b = data;
                    return [4 /*yield*/, api.readDesigns(KEY)];
                case 2:
                    rows = _b.apply(void 0, [_e.sent()]).versions;
                    (0, vitest_1.expect)((_c = rows.find(function (v) { return v.folder === '5.4.3'; })) === null || _c === void 0 ? void 0 : _c.approved).toEqual({ by: 'Rohan', at: AT });
                    (0, vitest_1.expect)((_d = rows.find(function (v) { return v.folder === 'onboarding-pass-2'; })) === null || _d === void 0 ? void 0 : _d.approved).toBeNull();
                    (0, vitest_1.expect)(rows.find(function (v) { return v.folder === '5.4.2'; })).toMatchObject({ approved: null, problem: { detail: 'It has a mistake near line 3.' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a version that does not read, and leaves its file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.setDesignApproval(KEY, '5.4.2', true)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.brokenVersion('docs/designs/5.4.2/version.json'));
                    _c = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.2', 'version.json')];
                case 2:
                    _c.apply(void 0, [_d.sent()]).toBe(BROKEN_VERSION);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder with no version file, and writes none', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, put('stray', 'welcome.design.json', WELCOME)];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.setDesignApproval(KEY, 'stray', true)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.brokenVersion('docs/designs/stray/version.json'));
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(designs, 'stray'))];
                case 3:
                    _c.apply(void 0, [(_d.sent()).sort()]).toEqual(['welcome.design.json']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says the approval could not be saved when the write fails, and leaves the file', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: 
                // A folder where the new file is written first, so writing it fails.
                return [4 /*yield*/, (0, promises_1.mkdir)(at('5.4.3', 'version.json.tmp'))];
                case 1:
                    // A folder where the new file is written first, so writing it fails.
                    _d.sent();
                    return [4 /*yield*/, text('5.4.3', 'version.json')];
                case 2:
                    before = _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, api.setDesignApproval(KEY, '5.4.3', true)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(messages_1.MESSAGES.setApproval);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, text('5.4.3', 'version.json')];
                case 4:
                    _c.apply(void 0, [_d.sent()]).toBe(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('runs an approval and a send to the next version at once one after the other, so neither loses the other', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, approved, sent, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([api.setDesignApproval(KEY, '5.4.3', true), api.sendDesignComments(KEY, '5.4.3', { label: '5.4.4', quest: 'Designs 5.4.4' })])];
                case 1:
                    _a = _c.sent(), approved = _a[0], sent = _a[1];
                    data(approved);
                    data(sent);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toMatchObject({ approved: { by: 'Rohan', at: AT }, next: { label: '5.4.4', quest: 'Designs 5.4.4' }, theme: 'day' });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Show in Finder', function () {
    (0, vitest_1.it)('shows docs/designs, or the realm when there is none yet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, api.showDesigns(KEY)];
                case 1:
                    _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(reveal).toHaveBeenLastCalledWith(designs);
                    return [4 /*yield*/, (0, promises_1.rm)(designs, { recursive: true })];
                case 2:
                    _c.sent();
                    _b = data;
                    return [4 /*yield*/, api.showDesigns(KEY)];
                case 3:
                    _b.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(reveal).toHaveBeenLastCalledWith(realm);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('names from the window', function () {
    var insideRealm = function () { return touched.filter(function (p) { return p.startsWith(realm) || p.startsWith((0, node_path_1.join)(home, '.queue-tea/designs')); }); };
    vitest_1.it.each(['../x', 'a/b', '.hidden', 'UPPER', '..', '', 'a\\b', '/etc', '5.4.3/../../..', 5, null])('refuses the folder %j before building any path', function (folder) { return __awaiter(void 0, void 0, void 0, function () {
        var answers, _i, answers_1, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        api.readDesignVersion(KEY, folder),
                        api.readDesign(KEY, folder, 'welcome'),
                        api.saveDesign(KEY, folder, 'welcome', WELCOME, 'stamp'),
                        api.saveDesignCopy(KEY, folder, 'welcome', WELCOME),
                        api.restoreDesignFile(KEY, folder, 'version'),
                        api.addDesignComment(KEY, folder, { design: 'welcome', on: null, text: 'Hi' }),
                        api.setDesignComment(KEY, folder, 'c1', true),
                        api.sendDesignComments(KEY, folder, { label: '9.9', quest: 'Q' }),
                        api.setDesignApproval(KEY, folder, true),
                    ])];
                case 1:
                    answers = _a.sent();
                    for (_i = 0, answers_1 = answers; _i < answers_1.length; _i++) {
                        answer = answers_1[_i];
                        (0, vitest_1.expect)(refused(answer)).toBe(messages_1.MESSAGES.unknownDesign);
                    }
                    (0, vitest_1.expect)(insideRealm()).toEqual([]);
                    (0, vitest_1.expect)(writes).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each(['../x', '../../version', 'a.b', 'Welcome', 'a/b', '.x', '', 5])('refuses the design %j before building its path', function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var answers, _i, answers_2, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        api.readDesign(KEY, '5.4.3', id),
                        api.saveDesign(KEY, '5.4.3', id, WELCOME, 'stamp'),
                        api.saveDesignCopy(KEY, '5.4.3', id, WELCOME),
                        api.restoreDesignFile(KEY, '5.4.3', id),
                        api.addDesignComment(KEY, '5.4.3', { design: id, on: null, text: 'Hi' }),
                    ])];
                case 1:
                    answers = _a.sent();
                    for (_i = 0, answers_2 = answers; _i < answers_2.length; _i++) {
                        answer = answers_2[_i];
                        (0, vitest_1.expect)(refused(answer)).toBe(messages_1.MESSAGES.unknownDesign);
                    }
                    // Only the version and comments files are read, to check the version first.
                    (0, vitest_1.expect)(insideRealm().filter(function (p) { return ![at('5.4.3', 'version.json'), at('5.4.3', 'comments.json'), backup('5.4.3', 'version.json'), backup('5.4.3', 'comments.json')].includes(p); })).toEqual([]);
                    (0, vitest_1.expect)(writes.filter(function (p) { return !p.startsWith((0, node_path_1.join)(home, '.queue-tea/designs')); })).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
