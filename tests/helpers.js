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
exports.CTX = exports.fakePorts = exports.answerHost = exports.ENGINE_FILE_CAP = exports.memoryHost = exports.makeTask = void 0;
var host_1 = require("../hooks/core/host/host");
var next = 0;
// A task with every field filled; `over` sets what a test cares about.
var makeTask = function (over) {
    if (over === void 0) { over = {}; }
    next += 1;
    return __assign({ id: "t-".concat(String(next).padStart(8, '0')), title: "Task ".concat(next), state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: "2026-10-21T09:".concat(String(next % 60).padStart(2, '0'), ":00+02:00"), started: null, finished: null, minutesByDay: {}, effort: {
            understandingMessages: 0,
            improvingMessages: 0,
            filesRead: 0,
            filesChanged: 0,
            linesAdded: 0,
            linesRemoved: 0,
            filesTouched: 0,
        }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null, helpers: { on: [], ran: [], reminded: false }, codexSince: null, worktreePath: null }, over);
};
exports.makeTask = makeTask;
// A host held in memory: files in a map, `mv` as a rename and `rm` as a delete
// in that map, plain `mkdir` and `rmdir` as folders in a set, every other argv
// answered from `git` by `argv.join(' ')`; an argv it lacks exits 1. Sleeps end
// at once. Each write and move counts as one tick of `modifiedAt`.
var memoryHost = function (options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var files = new Map(Object.entries((_a = options.files) !== null && _a !== void 0 ? _a : {}));
    var dirs = new Set();
    var runs = [];
    var writes = [];
    var git = __assign({}, ((_b = options.git) !== null && _b !== void 0 ? _b : {}));
    var changed = new Map();
    var tick = 0;
    var stamp = function (path) { return changed.set(path, (tick += 1)); };
    var result = function (exitCode, stdout) {
        if (stdout === void 0) { stdout = ''; }
        return ({ exitCode: exitCode, stdout: stdout, stderr: '' });
    };
    var host = __assign(__assign({ exists: function (path) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, files.has(path) || dirs.has(path)];
        }); }); }, read: function (path) { return __awaiter(void 0, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                text = files.get(path);
                if (text === undefined)
                    throw new Error("ENOENT: ".concat(path));
                return [2 /*return*/, text];
            });
        }); }, write: function (path, text) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                files.set(path, text);
                stamp(path);
                writes.push(path);
                return [2 /*return*/];
            });
        }); }, run: function (argv) { return __awaiter(void 0, void 0, void 0, function () {
            var from, to, text, dir, isThere, run;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                runs.push(__spreadArray([], argv, true));
                if (argv[0] === 'mv') {
                    from = argv[2];
                    to = argv[3];
                    text = from === undefined ? undefined : files.get(from);
                    if (from === undefined || to === undefined || text === undefined)
                        return [2 /*return*/, result(1)];
                    files.delete(from);
                    files.set(to, text);
                    stamp(to);
                    return [2 /*return*/, result(0)];
                }
                if (argv[0] === 'rm') {
                    files.delete((_a = argv[2]) !== null && _a !== void 0 ? _a : '');
                    return [2 /*return*/, result(0)];
                }
                if (argv.length === 2 && (argv[0] === 'mkdir' || argv[0] === 'rmdir')) {
                    dir = argv[1];
                    isThere = dirs.has(dir) || files.has(dir);
                    if (argv[0] === 'mkdir' ? isThere : !dirs.has(dir))
                        return [2 /*return*/, result(1)];
                    if (argv[0] === 'mkdir')
                        dirs.add(dir);
                    else
                        dirs.delete(dir);
                    return [2 /*return*/, result(0)];
                }
                run = git[argv.join(' ')];
                return [2 /*return*/, run === undefined ? result(1) : result((_b = run.exitCode) !== null && _b !== void 0 ? _b : 0, (_c = run.stdout) !== null && _c !== void 0 ? _c : '')];
            });
        }); }, list: function (dir) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, __spreadArray([], files.keys(), true).filter(function (path) { return path.startsWith("".concat(dir, "/")); })
                        .map(function (path) { return path.slice(dir.length + 1); })
                        .filter(function (name) { return !name.includes('/'); })];
            });
        }); }, sleep: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); } }, (0, host_1.unixFiles)(function (argv, cwd) { return host.run(argv, cwd); })), { modifiedAt: function (path) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            return [2 /*return*/, (files.has(path) ? ((_a = changed.get(path)) !== null && _a !== void 0 ? _a : 0) : null)];
        }); }); }, open: function (url) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, host.run(['open', url])];
        }); }); } });
    return { files: files, dirs: dirs, runs: runs, writes: writes, git: git, host: host };
};
exports.memoryHost = memoryHost;
// What Claude Code's $.fs.read and $.fs.write take at once, in bytes. A read
// past it is refused unless it asks for a range; a write past it is refused.
exports.ENGINE_FILE_CAP = 4194304;
var toBase64 = function (bytes) {
    var text = '';
    for (var i = 0; i < bytes.length; i += 0x8000)
        text += String.fromCharCode.apply(String, bytes.subarray(i, i + 0x8000));
    return btoa(text);
};
// Answers the plugin's $.fs and $.process.run from a memory host, for tests
// that raise events, the way Claude Code answers them, its file cap included.
// `refused` lists files the engine won't open, as when the disk refuses them.
var answerHost = function (on, mem, options) {
    if (options === void 0) { options = {}; }
    var refuse = function (event, path, why) { return new Error("queue-tea: $.fs.".concat(event, ": ").concat(path, " refused: ").concat(why)); };
    // A folder exists while it holds a file.
    on('fs.exists', function (_, e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, mem.host.exists(e.path)];
                case 1: return [2 /*return*/, (_a.value = (_b.sent()) || __spreadArray([], mem.files.keys(), true).some(function (path) { return path.startsWith("".concat(e.path, "/")); }),
                        _a)];
            }
        });
    }); });
    on('fs.list', function (_, e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, mem.host.list(e.path)];
                case 1: return [2 /*return*/, (_a.value = (_b.sent()).map(function (name) { return ({ name: name, kind: 'file', size: 0, mtimeMs: 0, isLink: false }); }),
                        _a)];
            }
        });
    }); });
    on('fs.read', function (_, e) { return __awaiter(void 0, void 0, void 0, function () {
        var read, bytes, _a, _b, offset, part;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if ((_c = options.refused) === null || _c === void 0 ? void 0 : _c.includes(e.path))
                        throw refuse('read', e.path, 'permission denied');
                    read = e;
                    _b = (_a = new TextEncoder()).encode;
                    return [4 /*yield*/, mem.host.read(e.path)];
                case 1:
                    bytes = _b.apply(_a, [_f.sent()]);
                    if (read.offset === undefined && read.length === undefined) {
                        if (bytes.length > exports.ENGINE_FILE_CAP)
                            throw refuse('read', e.path, "the file is over the ".concat(exports.ENGINE_FILE_CAP, "-byte limit"));
                        return [2 /*return*/, { value: read.as === 'bytes' ? { base64: toBase64(bytes) } : new TextDecoder().decode(bytes) }];
                    }
                    offset = (_d = read.offset) !== null && _d !== void 0 ? _d : 0;
                    if (read.length === undefined && bytes.length - offset > exports.ENGINE_FILE_CAP) {
                        throw refuse('read', e.path, "what follows offset ".concat(offset, " is over the ").concat(exports.ENGINE_FILE_CAP, "-byte limit; pass length"));
                    }
                    part = bytes.subarray(offset, offset + Math.min((_e = read.length) !== null && _e !== void 0 ? _e : Infinity, exports.ENGINE_FILE_CAP));
                    return [2 /*return*/, { value: read.as === 'bytes' ? { base64: toBase64(part) } : new TextDecoder().decode(part) }];
            }
        });
    }); });
    on('session.id', function () { return ({ value: 's-test' }); });
    on('fs.write', function (_, e) { return __awaiter(void 0, void 0, void 0, function () {
        var bytes;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    bytes = new TextEncoder().encode(e.text).length;
                    if (bytes > exports.ENGINE_FILE_CAP)
                        throw refuse('write', e.path, "".concat(bytes, " bytes is over the ").concat(exports.ENGINE_FILE_CAP, "-byte limit"));
                    _a = {};
                    return [4 /*yield*/, mem.host.write(e.path, e.text)];
                case 1: return [2 /*return*/, (_a.value = _b.sent(), _a)];
            }
        });
    }); });
    on('fs.stat', function (_, e) { return __awaiter(void 0, void 0, void 0, function () {
        var mtimeMs, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mem.host.modifiedAt(e.path)];
                case 1:
                    mtimeMs = _a.sent();
                    if (mtimeMs === null)
                        throw new Error("ENOENT: ".concat(e.path));
                    text = mem.files.get(e.path);
                    return [2 /*return*/, { value: { kind: 'file', size: text === undefined ? 0 : new TextEncoder().encode(text).length, mtimeMs: mtimeMs, isLink: false } }];
            }
        });
    }); });
    on('process.run', function (_, e) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = {};
                    _a = [{}];
                    return [4 /*yield*/, mem.host.run(__spreadArray([], e.argv, true))];
                case 1: return [2 /*return*/, (_b.value = __assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_c.sent())])), { isStdoutTruncated: false, isStderrTruncated: false }]),
                        _b)];
            }
        });
    }); });
};
exports.answerHost = answerHost;
// Ports held in memory for the flow: the view as a plain object, and what the
// flow cleared, submitted and toasted. `settle` runs the work it left for later.
var fakePorts = function (mem, options) {
    if (options === void 0) { options = {}; }
    var view = __assign({ record: null, load: 'ready', loadError: null, hold: null, band: { kind: 'none' }, bandQueue: [], isAskingDone: false, isChoosingNext: false, openRow: null, isChecking: false, allowance: null, notice: null, spin: 0, canContinue: false, mismatch: null, checked: null, busy: null, warning: null, blocking: null, budget: null, drift: [], lines: null, others: [], menuView: 'menu', isMenuOpen: false, isCupStill: false, parenting: null, openParents: [] }, options.view);
    var done = { promptText: '', clears: 0, asUser: [], submits: [], toasts: [], logs: [], statuses: [] };
    var later = [];
    var id = 0;
    var usage = { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
    var answer = function (text) {
        return (text === undefined
            ? { isAnswered: false, reason: 'api-error', status: 500, error: 'api_error', usage: usage }
            : { isAnswered: true, text: text, usage: usage });
    };
    var ports = {
        host: mem.host,
        ask: {
            fork: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, answer(options.reply)];
            }); }); },
            complete: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, answer(options.reply)];
            }); }); },
            sleep: function () { return new Promise(function () { }); },
            log: function (text) { return done.logs.push(text); },
        },
        clear: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                done.clears += 1;
                return [2 /*return*/];
            });
        }); },
        submit: function (text, asUser) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                done.submits.push(text);
                done.asUser.push(asUser === true);
                return [2 /*return*/];
            });
        }); },
        toast: function (text) { return done.toasts.push(text); },
        status: function (text) { return done.statuses.push(text); },
        now: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, Date.parse('2026-10-21T07:12:00Z')];
        }); }); },
        later: function (work) { return later.push(work); },
        newId: function () { return "t-".concat(String((id += 1)).padStart(8, '0')); },
        get: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, view[key]];
        }); }); },
        set: function (key, value) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                view[key] = value;
                return [2 /*return*/];
            });
        }); },
        log: function (text) { return done.logs.push(text); },
        ui: { open: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ isPlaced: true })];
            }); }); }, close: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); } },
        prompt: { read: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ text: done.promptText })];
            }); }); }, fill: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ isFilled: true })];
            }); }); }, send: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({})];
            }); }); } },
        session: { id: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, 's-1'];
            }); }); }, usage: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ context: { tokens: 0 }, rateLimits: [] })];
            }); }); }, append: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); } },
    };
    var settle = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(later.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, later.shift()()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return { ports: ports, view: view, done: done, settle: settle };
};
exports.fakePorts = fakePorts;
exports.CTX = {
    cwd: '/p',
    home: '/h',
    projectPath: '/p',
    projectName: 'p',
    file: '/h/.queue-tea/projects/p-000000.json',
    offsetMinutes: 120,
    options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
};
