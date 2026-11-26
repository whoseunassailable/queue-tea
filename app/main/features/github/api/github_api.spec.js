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
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var accounts_1 = require("../domain/accounts");
var github_api_1 = require("./github_api");
var home;
var gh;
var calls;
var state;
var deps;
var opened;
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var statusJson = function (accounts) {
    return JSON.stringify({ hosts: { 'github.com': accounts.map(function (a) { var _a, _b; return ({ state: (_a = a.state) !== null && _a !== void 0 ? _a : 'success', active: a.active, host: 'github.com', login: a.login, tokenSource: 'keyring', scopes: 'repo', gitProtocol: (_b = a.gitProtocol) !== null && _b !== void 0 ? _b : 'ssh' }); }) } });
};
// A stand-in gh, run as a real process. It answers status from a file, and on
// login prints what the real one prints, then waits to be told how it went.
var fakeGh = function (statusFile, loginScript) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.writeFile)(gh, "#!/bin/sh\necho \"$*\" >> '".concat(calls, "'\ncase \"$2\" in\n  status) cat '").concat(statusFile, "' ;;\n  switch) ;;\n  login) ").concat(loginScript, " ;;\nesac\n"))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.chmod)(gh, 493)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var WAITS = "printf '\\n! First copy your one-time code: 100F-29B8\\nOpen this URL to continue in your web browser: https://github.com/login/device\\n' >&2; while [ ! -f '".concat((0, node_path_1.join)('$HOME_DIR', 'go'), "' ] && [ -d '$HOME_DIR' ]; do sleep 0.05; done");
var login = function (over) {
    if (over === void 0) { over = {}; }
    return (0, github_api_1.githubApi)(__assign(__assign({}, deps), over));
};
var callLog = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, promises_1.readFile)(calls, 'utf8')];
            case 1: return [2 /*return*/, (_b.sent()).trim().split('\n')];
            case 2:
                _a = _b.sent();
                // No file means gh was never run.
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log, host;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-github-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'bin'))];
            case 3:
                _b.sent();
                gh = (0, node_path_1.join)(home, 'bin/gh');
                calls = (0, node_path_1.join)(home, 'calls.txt');
                state = (0, node_path_1.join)(home, 'status.json');
                opened = [];
                return [4 /*yield*/, (0, promises_1.writeFile)(state, statusJson([{ login: 'first', active: true }]))];
            case 4:
                _b.sent();
                return [4 /*yield*/, fakeGh(state, WAITS.replaceAll('$HOME_DIR', home))];
            case 5:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                host = (0, node_host_1.nodeHost)(log, function (url) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        opened.push(url);
                        return [2 /*return*/, { exitCode: 0, stdout: '', stderr: '' }];
                    });
                }); });
                deps = { host: host, home: home, log: log, ghPaths: [(0, node_path_1.join)(home, 'bin/missing'), gh], codeWaitMs: 2000, loginWaitMs: 5000 };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('reading what gh says', function () {
    (0, vitest_1.it)('lists the accounts on github.com', function () {
        (0, vitest_1.expect)((0, accounts_1.accountsOf)(statusJson([{ login: 'first', active: true }, { login: 'second', active: false }]))).toEqual([
            { login: 'first', isActive: true, isWorking: true },
            { login: 'second', isActive: false, isWorking: true },
        ]);
    });
    (0, vitest_1.it)('marks an account whose sign-in has lapsed', function () {
        var _a;
        (0, vitest_1.expect)((_a = (0, accounts_1.accountsOf)(statusJson([{ login: 'first', active: true, state: 'error' }]))[0]) === null || _a === void 0 ? void 0 : _a.isWorking).toBe(false);
    });
    (0, vitest_1.it)('doesn\'t blame the account for GitHub being out of reach', function () {
        var _a;
        (0, vitest_1.expect)((_a = (0, accounts_1.accountsOf)(statusJson([{ login: 'first', active: true, state: 'timeout' }]))[0]) === null || _a === void 0 ? void 0 : _a.isWorking).toBe(true);
    });
    (0, vitest_1.it)('has none for no hosts, or for anything else', function () {
        (0, vitest_1.expect)((0, accounts_1.accountsOf)('{"hosts":{}}')).toEqual([]);
        (0, vitest_1.expect)((0, accounts_1.accountsOf)('not json')).toEqual([]);
        (0, vitest_1.expect)((0, accounts_1.accountsOf)('{"hosts":{"github.com":[{"state":"success"}]}}')).toEqual([]);
    });
    (0, vitest_1.it)('finds the code and the address in the sign-in output', function () {
        (0, vitest_1.expect)((0, accounts_1.codeOf)('\n! First copy your one-time code: 100F-29B8\nOpen this URL to continue in your web browser: https://github.com/login/device\n')).toEqual({ code: '100F-29B8', url: 'https://github.com/login/device' });
    });
    (0, vitest_1.it)('waits for both', function () {
        (0, vitest_1.expect)((0, accounts_1.codeOf)('! First copy your one-time code: 100F-29B8\n')).toBeNull();
        (0, vitest_1.expect)((0, accounts_1.codeOf)('')).toBeNull();
    });
    (0, vitest_1.it)('takes only an address on GitHub', function () {
        (0, vitest_1.expect)((0, accounts_1.codeOf)('one-time code: 100F-29B8\nOpen this URL: https://evil.example/login/device')).toBeNull();
    });
    (0, vitest_1.it)('knows a login when it sees one', function () {
        (0, vitest_1.expect)((0, accounts_1.isGithubLogin)('whoseunassailable')).toBe(true);
        (0, vitest_1.expect)((0, accounts_1.isGithubLogin)('with-dash1')).toBe(true);
        (0, vitest_1.expect)((0, accounts_1.isGithubLogin)('no spaces')).toBe(false);
        (0, vitest_1.expect)((0, accounts_1.isGithubLogin)('')).toBe(false);
        (0, vitest_1.expect)((0, accounts_1.isGithubLogin)(42)).toBe(false);
    });
});
(0, vitest_1.describe)('the accounts', function () {
    (0, vitest_1.it)('lists what gh knows, finding gh where Homebrew puts it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, login().readGithub()];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'ready', accounts: [{ login: 'first', isActive: true, isWorking: true }] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when gh isn\'t installed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, login({ ghPaths: [(0, node_path_1.join)(home, 'nope')] }).readGithub()];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'missing' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has an empty list when gh is signed out, which it reports as a failure', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(state, '{"hosts":{}}')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, fakeGh(state, ':')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(gh, "#!/bin/sh\ncat '".concat(state, "'\nexit 1\n"))];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, login().readGithub()];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'ready', accounts: [] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never reads a token', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, login().readGithub()];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, callLog()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).join(' ')]).not.toContain('token');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('adding an account', function () {
    var go = function () { return (0, promises_1.writeFile)((0, node_path_1.join)(home, 'go'), ''); };
    (0, vitest_1.it)('hands over the code, running gh\'s own web sign-in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    api = login();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, api.startGithubLogin()];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toEqual({ code: '100F-29B8', url: 'https://github.com/login/device' });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, callLog()];
                case 2:
                    _c.apply(void 0, [(_d.sent()).at(-1)]).toBe('auth login --web --hostname github.com --git-protocol ssh --skip-ssh-key');
                    return [4 /*yield*/, api.cancelGithubLogin()];
                case 3:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the git protocol already in use', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(state, statusJson([{ login: 'first', active: true, gitProtocol: 'https' }]))];
                case 1:
                    _b.sent();
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, callLog()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).at(-1)]).toContain('--git-protocol https');
                    return [4 /*yield*/, api.cancelGithubLogin()];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names the account that came in, and puts the terminal\'s account back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, waiting, outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(state, statusJson([{ login: 'first', active: false }, { login: 'second', active: true }]))];
                case 2:
                    _c.sent();
                    waiting = api.awaitGithubLogin();
                    return [4 /*yield*/, go()];
                case 3:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, waiting];
                case 4:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome.added).toBe('second');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, callLog()];
                case 5:
                    _b.apply(void 0, [(_c.sent()).at(-2)]).toBe('auth switch --hostname github.com --user first');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves things alone when the same account signs in again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, waiting, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 1:
                    _d.sent();
                    waiting = api.awaitGithubLogin();
                    return [4 /*yield*/, go()];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, waiting];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()]).added]).toBeNull();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, callLog()];
                case 4:
                    _c.apply(void 0, [(_d.sent()).join(' ')]).not.toContain('auth switch');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('puts the terminal\'s account back when a known one signs in again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, waiting, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(state, statusJson([{ login: 'first', active: true }, { login: 'second', active: false }]))];
                case 1:
                    _d.sent();
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(state, statusJson([{ login: 'first', active: false }, { login: 'second', active: true }]))];
                case 3:
                    _d.sent();
                    waiting = api.awaitGithubLogin();
                    return [4 /*yield*/, go()];
                case 4:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, waiting];
                case 5:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()]).added]).toBeNull();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, callLog()];
                case 6:
                    _c.apply(void 0, [(_d.sent()).at(-2)]).toBe('auth switch --hostname github.com --user first');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('switches nothing when it was the first account', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, waiting, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)(state, '{"hosts":{}}')];
                case 1:
                    _d.sent();
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(state, statusJson([{ login: 'first', active: true }]))];
                case 3:
                    _d.sent();
                    waiting = api.awaitGithubLogin();
                    return [4 /*yield*/, go()];
                case 4:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, waiting];
                case 5:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()]).added]).toBe('first');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, callLog()];
                case 6:
                    _c.apply(void 0, [(_d.sent()).join(' ')]).not.toContain('auth switch');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens only the address gh gave', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, api.openGithubLogin()];
                case 2:
                    _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(opened).toEqual(['https://github.com/login/device']);
                    return [4 /*yield*/, api.cancelGithubLogin()];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has nothing to open with no sign-in running', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, login().openGithubLogin()];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    (0, vitest_1.expect)(opened).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('runs one at a time', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.startGithubLogin()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: 'A GitHub sign-in is already running. Finish it or cancel it first.' } });
                    return [4 /*yield*/, api.cancelGithubLogin()];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stops gh when it\'s cancelled, and can start again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, waiting, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 1:
                    _d.sent();
                    waiting = api.awaitGithubLogin();
                    _a = data;
                    return [4 /*yield*/, api.cancelGithubLogin()];
                case 2:
                    _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, waiting];
                case 3:
                    _b.apply(void 0, [(_d.sent()).ok]).toBe(false);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, api.startGithubLogin()];
                case 4:
                    _c.apply(void 0, [(_d.sent()).ok]).toBe(true);
                    return [4 /*yield*/, api.cancelGithubLogin()];
                case 5:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('is fine with nothing to cancel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, login().cancelGithubLogin()];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stops gh if the code never comes', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fakeGh(state, 'sleep 30')];
                case 1:
                    _c.sent();
                    api = login({ codeWaitMs: 100 });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.startGithubLogin()];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: "GitHub's sign-in didn't start. Check your connection and try again." } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, api.startGithubLogin()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stops gh if nobody signs in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    api = login({ loginWaitMs: 100 });
                    return [4 /*yield*/, api.startGithubLogin()];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.awaitGithubLogin()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: 'The sign-in timed out. Try again.' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so when gh fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var api, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fakeGh(state, "printf 'one-time code: 100F-29B8\\nOpen: https://github.com/login/device\\n' >&2; sleep 0.1; exit 1")];
                case 1:
                    _b.sent();
                    api = login();
                    return [4 /*yield*/, api.startGithubLogin()];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, api.awaitGithubLogin()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: "GitHub's sign-in didn't finish. Try again." } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when gh isn\'t there to run', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, login({ ghPaths: [] }).startGithubLogin()];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
