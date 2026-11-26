"use strict";
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
exports.githubApi = void 0;
var node_child_process_1 = require("node:child_process");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var accounts_1 = require("../domain/accounts");
var HOST = 'github.com';
// The GitHub half of the engine API. It holds the one sign-in that can be
// running. Accounts and tokens stay in gh: the app only asks.
var githubApi = function (d) {
    var running = null;
    var isStarting = false;
    var findGh = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, path;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = d.ghPaths;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    path = _a[_i];
                    return [4 /*yield*/, d.host.exists(path)];
                case 2:
                    if (_b.sent())
                        return [2 /*return*/, path];
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, null];
            }
        });
    }); };
    // gh exits 1 when signed out, but still prints its JSON, so stdout decides.
    var statusOf = function (gh) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d.host.run([gh, 'auth', 'status', '--json', 'hosts'], d.home)];
            case 1: return [2 /*return*/, (_a.sent()).stdout];
        }
    }); }); };
    var stop = function (child) {
        child.kill('SIGTERM');
    };
    var startLogin = function (gh, protocol) {
        var child = (0, node_child_process_1.spawn)(gh, ['auth', 'login', '--web', '--hostname', HOST, '--git-protocol', protocol, '--skip-ssh-key'], { cwd: d.home, stdio: ['ignore', 'pipe', 'pipe'] });
        var output = '';
        var finished = new Promise(function (done) {
            child.once('error', function (err) {
                d.log.error('running gh failed', err);
                done(null);
            });
            // Exit, not close: close waits for every pipe, so a stuck child of gh's
            // could hold the dialog open after gh itself has gone.
            child.once('exit', function (code) { return done(code); });
        });
        var firstCode = new Promise(function (done) {
            var _a, _b;
            var timer = setTimeout(function () { return done(null); }, d.codeWaitMs);
            var heard = function (chunk) {
                output += chunk.toString();
                var found = (0, accounts_1.codeOf)(output);
                if (found !== null) {
                    clearTimeout(timer);
                    done(found);
                }
            };
            (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', heard);
            (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', heard);
            void finished.then(function () {
                clearTimeout(timer);
                done(null);
            });
        });
        return { child: child, finished: finished, firstCode: firstCode };
    };
    // Signing in makes that account gh's active one, which would quietly change
    // who the terminal is. So the account that was active goes back.
    var restoreActive = function (gh, before, after) { return __awaiter(void 0, void 0, void 0, function () {
        var was, ran;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    was = before.find(function (account) { return account.isActive; });
                    if (was === undefined || ((_a = after.find(function (account) { return account.isActive; })) === null || _a === void 0 ? void 0 : _a.login) === was.login)
                        return [2 /*return*/];
                    return [4 /*yield*/, d.host.run([gh, 'auth', 'switch', '--hostname', HOST, '--user', was.login], d.home)];
                case 1:
                    ran = _b.sent();
                    if (ran.exitCode !== 0)
                        d.log.warn("putting gh back on ".concat(was.login, " failed: ").concat(ran.stderr));
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        readGithub: function () {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readGithub, function () { return __awaiter(void 0, void 0, void 0, function () {
                var gh, _a, _b;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, findGh()];
                        case 1:
                            gh = _d.sent();
                            if (!(gh === null)) return [3 /*break*/, 2];
                            _a = { kind: 'missing' };
                            return [3 /*break*/, 4];
                        case 2:
                            _c = { kind: 'ready' };
                            _b = accounts_1.accountsOf;
                            return [4 /*yield*/, statusOf(gh)];
                        case 3:
                            _a = (_c.accounts = _b.apply(void 0, [_d.sent()]), _c);
                            _d.label = 4;
                        case 4: return [2 /*return*/, _a];
                    }
                });
            }); });
        },
        startGithubLogin: function () {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.startGithubLogin, function () { return __awaiter(void 0, void 0, void 0, function () {
                var gh, status_1, _a, child, finished, firstCode, found;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (running !== null || isStarting)
                                throw new reply_1.Refusal(messages_1.MESSAGES.loginRunning);
                            return [4 /*yield*/, findGh()];
                        case 1:
                            gh = _b.sent();
                            if (gh === null)
                                throw new reply_1.Refusal(messages_1.MESSAGES.ghMissing);
                            isStarting = true;
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, , 7, 8]);
                            return [4 /*yield*/, statusOf(gh)];
                        case 3:
                            status_1 = _b.sent();
                            _a = startLogin(gh, (0, accounts_1.gitProtocolOf)(status_1)), child = _a.child, finished = _a.finished, firstCode = _a.firstCode;
                            return [4 /*yield*/, firstCode];
                        case 4:
                            found = _b.sent();
                            if (!(found === null)) return [3 /*break*/, 6];
                            stop(child);
                            return [4 /*yield*/, finished];
                        case 5:
                            _b.sent();
                            throw new reply_1.Refusal(messages_1.MESSAGES.startGithubLogin);
                        case 6:
                            running = { child: child, finished: finished, url: found.url, before: (0, accounts_1.accountsOf)(status_1) };
                            return [2 /*return*/, found];
                        case 7:
                            isStarting = false;
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            }); });
        },
        openGithubLogin: function () {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.openGithub, function () { return __awaiter(void 0, void 0, void 0, function () {
                var opened;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (running === null)
                                throw new reply_1.Refusal(messages_1.MESSAGES.noLogin);
                            return [4 /*yield*/, d.host.open(running.url)];
                        case 1:
                            opened = _a.sent();
                            if (opened.exitCode !== 0)
                                throw new Error(opened.stderr);
                            return [2 /*return*/, null];
                    }
                });
            }); });
        },
        awaitGithubLogin: function () {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.awaitGithubLogin, function () { return __awaiter(void 0, void 0, void 0, function () {
                var login, isLate, timer, exit, wasCancelled, gh, accounts, _a, added, _b;
                var _c, _d;
                var _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            login = running;
                            if (login === null)
                                throw new reply_1.Refusal(messages_1.MESSAGES.noLogin);
                            isLate = false;
                            timer = setTimeout(function () {
                                isLate = true;
                                stop(login.child);
                            }, d.loginWaitMs);
                            return [4 /*yield*/, login.finished];
                        case 1:
                            exit = _g.sent();
                            clearTimeout(timer);
                            wasCancelled = running !== login;
                            running = null;
                            if (isLate)
                                throw new reply_1.Refusal(messages_1.MESSAGES.loginTimedOut);
                            if (wasCancelled)
                                throw new reply_1.Refusal(messages_1.MESSAGES.loginCancelled);
                            if (exit !== 0)
                                throw new reply_1.Refusal(messages_1.MESSAGES.awaitGithubLogin);
                            return [4 /*yield*/, findGh()];
                        case 2:
                            gh = _g.sent();
                            if (gh === null)
                                throw new reply_1.Refusal(messages_1.MESSAGES.ghMissing);
                            _a = accounts_1.accountsOf;
                            return [4 /*yield*/, statusOf(gh)];
                        case 3:
                            accounts = _a.apply(void 0, [_g.sent()]);
                            added = (_f = (_e = accounts.find(function (account) { return !login.before.some(function (known) { return known.login === account.login; }); })) === null || _e === void 0 ? void 0 : _e.login) !== null && _f !== void 0 ? _f : null;
                            return [4 /*yield*/, restoreActive(gh, login.before, accounts)];
                        case 4:
                            _g.sent();
                            _c = {};
                            _d = { kind: 'ready' };
                            _b = accounts_1.accountsOf;
                            return [4 /*yield*/, statusOf(gh)];
                        case 5: return [2 /*return*/, (_c.view = (_d.accounts = _b.apply(void 0, [_g.sent()]), _d), _c.added = added, _c)];
                    }
                });
            }); });
        },
        cancelGithubLogin: function () {
            return (0, reply_1.reply)(d.log, messages_1.MESSAGES.awaitGithubLogin, function () { return __awaiter(void 0, void 0, void 0, function () {
                var login;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            login = running;
                            if (login === null)
                                return [2 /*return*/, null];
                            running = null;
                            stop(login.child);
                            return [4 /*yield*/, login.finished];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, null];
                    }
                });
            }); });
        },
        // For the app quitting: no sign-in outlives it.
        stopGithubLogin: function () {
            if (running !== null)
                stop(running.child);
            running = null;
        },
    };
};
exports.githubApi = githubApi;
