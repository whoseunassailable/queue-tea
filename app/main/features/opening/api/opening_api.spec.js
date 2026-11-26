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
var node_host_1 = require("../../../core/node_host");
var realms_api_1 = require("../../realms/api/realms_api");
var command_script_1 = require("../data/command_script");
var open_url_1 = require("../domain/open_url");
var opening_api_1 = require("./opening_api");
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var folder;
var bins;
var deps;
var logged = [];
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var link = function (path) { return "queue-tea://open?path=".concat(encodeURIComponent(path)); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-opening-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 3:
                _b.sent();
                bins = { usr: (0, node_path_1.join)(home, 'usr-bin'), brew: (0, node_path_1.join)(home, 'brew-bin'), local: (0, node_path_1.join)(home, '.local/bin') };
                logged.length = 0;
                log = (0, logger_1.createLogger)('dev', function (line) { return logged.push(line); });
                deps = {
                    host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }),
                    home: home,
                    now: function () { return 0; },
                    log: log,
                    offsetMinutes: function () { return 60; },
                    reveal: function () { },
                    pickFolder: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, null];
                    }); }); },
                    commandDirs: [bins.usr, bins.brew, bins.local],
                };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('reading a link', function () {
    vitest_1.it.each([
        ['a plain path', 'queue-tea://open?path=%2Fp%2Fdemo', '/p/demo'],
        ['a space', 'queue-tea://open?path=%2Fp%2Fmy%20realm', '/p/my realm'],
        ['accents', "queue-tea://open?path=".concat(encodeURIComponent('/p/café ☕')), '/p/café ☕'],
        ['a trailing slash', 'queue-tea://open?path=%2Fp%2Fdemo%2F', '/p/demo'],
    ])('takes %s', function (_, url, path) {
        (0, vitest_1.expect)((0, open_url_1.pathFromUrl)(url)).toBe(path);
    });
    vitest_1.it.each([
        ['no path', 'queue-tea://open'],
        ['an empty path', 'queue-tea://open?path='],
        ['a relative path', 'queue-tea://open?path=demo'],
        ['another action', 'queue-tea://delete?path=%2Fp'],
        ['another scheme', 'https://open?path=%2Fp'],
        ['no host', 'queue-tea:open?path=%2Fp'],
        ['a null byte', 'queue-tea://open?path=%2Fp%00x'],
        ['rubbish', 'not a link'],
    ])('refuses %s', function (_, url) {
        (0, vitest_1.expect)((0, open_url_1.pathFromUrl)(url)).toBeNull();
    });
});
(0, vitest_1.describe)('a link arriving', function () {
    (0, vitest_1.it)('offers to add a folder Queue-tea doesn\'t know, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(path)];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, opening_api_1.openedFromUrl)(deps, link(path))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ kind: 'folder', pick: { path: path, name: 'demo', key: (0, record_source_1.projectKey)(path), isKnown: false, isRepo: false } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('knows a realm already there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(path)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, "".concat((0, record_source_1.projectKey)(path), ".json")), JSON.stringify((0, record_source_1.emptyRecord)('demo', path)))];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, opening_api_1.openedFromUrl)(deps, link(path))];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ kind: 'folder', pick: { isKnown: true } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes the repository\'s top folder, from inside it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var top, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    top = (0, node_path_1.join)(home, 'repo');
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(top, 'src'), { recursive: true })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, run('git', ['init', '-b', 'main'], { cwd: top })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, opening_api_1.openedFromUrl)(deps, link((0, node_path_1.join)(top, 'src')))];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ kind: 'folder', pick: { path: top, isRepo: true } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so for a bad link', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, opening_api_1.openedFromUrl)(deps, 'queue-tea://open')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({ kind: 'failed', message: "That link doesn't name a folder Queue-tea can open." });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so for a folder that isn\'t there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var path, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = (0, node_path_1.join)(home, 'moved-away');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, opening_api_1.openedFromUrl)(deps, link(path))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({ kind: 'failed', message: "There's no folder at ".concat(path, ".") });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so rather than throwing when it can\'t look', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    deps = __assign(__assign({}, deps), { host: __assign(__assign({}, deps.host), { exists: function () { return Promise.reject(new Error('disk went away')); } }) });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, opening_api_1.openedFromUrl)(deps, link('/p/demo'))];
                case 1:
                    _a.apply(void 0, [(_b.sent()).kind]).toBe('failed');
                    (0, vitest_1.expect)(logged.join('\n')).toContain('disk went away');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('installing the command', function () {
    var made = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)(bins.usr, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)(bins.brew, { recursive: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, vitest_1.it)('goes in the first folder it can write to, ready to run', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, made()];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, opening_api_1.installCommand)(deps)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toEqual({ path: (0, node_path_1.join)(bins.usr, 'queue-tea'), needsPath: false });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.stat)((0, node_path_1.join)(bins.usr, 'queue-tea'))];
                case 3:
                    _c.apply(void 0, [(_e.sent()).mode & 73]).toBe(73);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(bins.usr, 'queue-tea'), 'utf8')];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toBe(command_script_1.COMMAND_SCRIPT);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves on from a folder it can\'t write to', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, made()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.chmod)(bins.usr, 365)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, , 5, 7]);
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, opening_api_1.installCommand)(deps)];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).path]).toBe((0, node_path_1.join)(bins.brew, 'queue-tea'));
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, (0, promises_1.chmod)(bins.usr, 493)];
                case 6:
                    _c.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves on from a folder that isn\'t there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)(bins.brew)];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, opening_api_1.installCommand)(deps)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).path]).toBe((0, node_path_1.join)(bins.brew, 'queue-tea'));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('falls back on ~/.local/bin, making it, and says it needs adding to the PATH', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, opening_api_1.installCommand)(deps)];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ path: (0, node_path_1.join)(bins.local, 'queue-tea'), needsPath: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('replaces its own earlier copy', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, made()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(bins.usr, 'queue-tea'), "".concat(command_script_1.COMMAND_SCRIPT, "\n# an older version\n"))];
                case 2:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, opening_api_1.installCommand)(deps)];
                case 3:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(bins.usr, 'queue-tea'), 'utf8')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(command_script_1.COMMAND_SCRIPT);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves a file that isn\'t its own, and says where', function () { return __awaiter(void 0, void 0, void 0, function () {
        var theirs, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, made()];
                case 1:
                    _c.sent();
                    theirs = (0, node_path_1.join)(bins.usr, 'queue-tea');
                    return [4 /*yield*/, (0, promises_1.writeFile)(theirs, '#!/bin/sh\necho mine\n')];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, opening_api_1.installCommand)(deps)];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: "There's already a queue-tea at ".concat(theirs, " that isn't ours, so nothing was changed.") } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(theirs, 'utf8')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('#!/bin/sh\necho mine\n');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows on the Settings page once it\'s there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, made()];
                case 1:
                    _f.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()]).command]).toBeNull();
                    _c = data;
                    return [4 /*yield*/, (0, opening_api_1.installCommand)(deps)];
                case 3:
                    _c.apply(void 0, [_f.sent()]);
                    _d = vitest_1.expect;
                    _e = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, null)];
                case 4:
                    _d.apply(void 0, [_e.apply(void 0, [_f.sent()]).command]).toEqual({ path: (0, node_path_1.join)(bins.usr, 'queue-tea'), needsPath: false });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('doesn\'t take someone else\'s queue-tea for its own', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, made()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(bins.usr, 'queue-tea'), 'theirs')];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, realms_api_1.readSettingsPage)(deps, null)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).command]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the command itself', function () {
    var script;
    var opened;
    // A real shell runs the real script; only `open` stands in.
    var runIt = function (args, cwd) {
        if (cwd === void 0) { cwd = home; }
        return run('/bin/sh', __spreadArray([script], args, true), { cwd: cwd, env: __assign(__assign({}, process.env), { PATH: "".concat((0, node_path_1.join)(home, 'fake-bin'), ":/usr/bin:/bin") }) });
    };
    var openedLink = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readFile)(opened, 'utf8')];
            case 1: return [2 /*return*/, (_a.sent()).trim()];
        }
    }); }); };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    script = (0, node_path_1.join)(home, 'queue-tea');
                    opened = (0, node_path_1.join)(home, 'opened.txt');
                    return [4 /*yield*/, (0, promises_1.writeFile)(script, command_script_1.COMMAND_SCRIPT)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'fake-bin'))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'fake-bin/open'), "#!/bin/sh\nprintf '%s' \"$1\" > '".concat(opened, "'\n"))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(home, 'fake-bin/open'), 493)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.runIf(process.platform === 'darwin')('opens this folder with no path given', function () { return __awaiter(void 0, void 0, void 0, function () {
        var here, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    here = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(here)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, runIt(['open'], here)];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = open_url_1.pathFromUrl;
                    return [4 /*yield*/, openedLink()];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(here);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.runIf(process.platform === 'darwin')('opens the folder named, from anywhere', function () { return __awaiter(void 0, void 0, void 0, function () {
        var there, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    there = (0, node_path_1.join)(home, 'demo');
                    return [4 /*yield*/, (0, promises_1.mkdir)(there)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, runIt(['open', 'demo'])];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = open_url_1.pathFromUrl;
                    return [4 /*yield*/, openedLink()];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(there);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.runIf(process.platform === 'darwin').each(['my realm', 'café ☕', "o'brien", 'a&b=c?d#e', 'per%20cent'])('carries %s through the link whole', function (name) { return __awaiter(void 0, void 0, void 0, function () {
        var there, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    there = (0, node_path_1.join)(home, name);
                    return [4 /*yield*/, (0, promises_1.mkdir)(there)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, runIt(['open', there])];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = open_url_1.pathFromUrl;
                    return [4 /*yield*/, openedLink()];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(there);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so for a folder that isn\'t there, and opens nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)(runIt(['open', (0, node_path_1.join)(home, 'nope')])).rejects.toMatchObject({ code: 1, stderr: vitest_1.expect.stringContaining('no such folder') })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readFile)(opened, 'utf8')).rejects.toThrow()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['nothing', []],
        ['another command', ['delete']],
        ['too much', ['open', 'a', 'b']],
    ])('shows how to use it for %s', function (_, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)(runIt(args)).rejects.toMatchObject({ code: 2, stderr: vitest_1.expect.stringContaining('usage: queue-tea open [path]') })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.runIf(process.platform === 'darwin')('says so when the app isn\'t there to open', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'fake-bin/open'), '#!/bin/sh\nexit 1\n')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(runIt(['open'])).rejects.toMatchObject({ code: 1, stderr: vitest_1.expect.stringContaining('/Applications') })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
