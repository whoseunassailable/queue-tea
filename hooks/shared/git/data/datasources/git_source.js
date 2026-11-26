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
exports.readDrift = exports.readFacts = exports.lastCommit = exports.commitsBetween = exports.readHead = exports.diffSince = exports.switchBranch = exports.makeBranch = exports.listBranches = exports.readGit = void 0;
var branch_rules_1 = require("../../domain/services/branch_rules");
var git = function (host, cwd, args) { return __awaiter(void 0, void 0, void 0, function () {
    var ran;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, host.run(__spreadArray(['git'], args, true), cwd)];
            case 1:
                ran = _a.sent();
                if (ran.exitCode !== 0)
                    throw new Error("git ".concat(args.join(' '), " failed (").concat(ran.exitCode, "): ").concat(ran.stderr));
                return [2 /*return*/, ran.stdout];
        }
    });
}); };
var readGit = function (host, cwd) { return __awaiter(void 0, void 0, void 0, function () {
    var inside, status, _a, localOnly, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, host.run(['git', 'rev-parse', '--is-inside-work-tree'], cwd)];
            case 1:
                inside = _c.sent();
                if (inside.exitCode !== 0) {
                    return [2 /*return*/, { isRepo: false, branch: null, isDetached: false, head: null, uncommitted: 0, unpushed: 0, hasUpstream: false }];
                }
                _a = branch_rules_1.parseStatus;
                return [4 /*yield*/, git(host, cwd, ['status', '--porcelain=v2', '--branch'])];
            case 2:
                status = _a.apply(void 0, [_c.sent()]);
                if (status.hasUpstream || status.branch === null || status.head === null)
                    return [2 /*return*/, __assign({ isRepo: true }, status)];
                _b = Number;
                return [4 /*yield*/, git(host, cwd, ['rev-list', '--count', 'HEAD', '--not', '--remotes'])];
            case 3:
                localOnly = _b.apply(void 0, [(_c.sent()).trim()]);
                return [2 /*return*/, __assign(__assign({ isRepo: true }, status), { unpushed: localOnly })];
        }
    });
}); };
exports.readGit = readGit;
var listBranches = function (host, cwd) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, git(host, cwd, ['branch', '--format=%(refname:short)'])];
        case 1: return [2 /*return*/, (_a.sent()).split('\n').filter(Boolean)];
    }
}); }); };
exports.listBranches = listBranches;
var makeBranch = function (host, cwd, name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, git(host, cwd, ['switch', '-c', name])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.makeBranch = makeBranch;
var switchBranch = function (host, cwd, name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, git(host, cwd, ['switch', name])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.switchBranch = switchBranch;
var diffSince = function (host, cwd, commit) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = branch_rules_1.parseShortstat;
            return [4 /*yield*/, git(host, cwd, ['diff', '--shortstat', commit])];
        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])
            // The commit checked out and its branch; null outside a repository or before
            // the first commit.
        ];
    }
}); }); };
exports.diffSince = diffSince;
// The commit checked out and its branch; null outside a repository or before
// the first commit.
var readHead = function (host, cwd) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, named;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, host.run(['git', 'rev-parse', 'HEAD'], cwd)];
            case 1:
                ran = _a.sent();
                if (ran.exitCode !== 0)
                    return [2 /*return*/, null];
                return [4 /*yield*/, host.run(['git', 'symbolic-ref', '--short', '-q', 'HEAD'], cwd)];
            case 2:
                named = _a.sent();
                return [2 /*return*/, { commit: ran.stdout.trim(), branch: named.exitCode === 0 ? named.stdout.trim() : null }];
        }
    });
}); };
exports.readHead = readHead;
// The commits after `from` up to `to`, newest first, as "1a2b3c4 subject".
var commitsBetween = function (host, cwd, from, to) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, git(host, cwd, ['log', '--format=%h %s', "".concat(from, "..").concat(to)])];
        case 1: return [2 /*return*/, (_a.sent()).split('\n').filter(Boolean)
            // The last commit as "1a2b3c4 subject", or null.
        ];
    }
}); }); };
exports.commitsBetween = commitsBetween;
// The last commit as "1a2b3c4 subject", or null.
var lastCommit = function (host, cwd) { return __awaiter(void 0, void 0, void 0, function () {
    var ran;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, host.run(['git', 'log', '-1', '--format=%h %s'], cwd)];
            case 1:
                ran = _a.sent();
                return [2 /*return*/, ran.exitCode === 0 && ran.stdout.trim() !== '' ? ran.stdout.trim() : null];
        }
    });
}); };
exports.lastCommit = lastCommit;
// The branch, the last commit and the files not committed, as a checkpoint
// keeps them; null outside a repository.
var readFacts = function (host, cwd) { return __awaiter(void 0, void 0, void 0, function () {
    var inside, status;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, host.run(['git', 'rev-parse', '--is-inside-work-tree'], cwd)];
            case 1:
                inside = _b.sent();
                if (inside.exitCode !== 0)
                    return [2 /*return*/, null];
                return [4 /*yield*/, git(host, cwd, ['status', '--porcelain=v2', '--branch'])];
            case 2:
                status = _b.sent();
                _a = {
                    branch: (0, branch_rules_1.parseStatus)(status).branch
                };
                return [4 /*yield*/, (0, exports.lastCommit)(host, cwd)];
            case 3: return [2 /*return*/, (_a.head = _b.sent(),
                    _a.uncommitted = (0, branch_rules_1.parseStatusPaths)(status).slice(0, 20),
                    _a)];
        }
    });
}); };
exports.readFacts = readFacts;
var plural = function (n, one, many) { return "".concat(n, " ").concat(n === 1 ? one : many); };
// What has moved under a task since it started, in plain words, from local
// git only: its branch gone, its start commit no longer on it, its base
// branch ahead of where the task started.
var readDrift = function (host, cwd, task) { return __awaiter(void 0, void 0, void 0, function () {
    var branches, lines, held, ahead, n;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (task.branch === null)
                    return [2 /*return*/, []];
                return [4 /*yield*/, (0, exports.listBranches)(host, cwd)];
            case 1:
                branches = _a.sent();
                if (!branches.includes(task.branch))
                    return [2 /*return*/, ["The branch ".concat(task.branch, " is gone.")]];
                lines = [];
                if (!(task.startCommit !== null)) return [3 /*break*/, 3];
                return [4 /*yield*/, host.run(['git', 'merge-base', '--is-ancestor', task.startCommit, task.branch], cwd)];
            case 2:
                held = _a.sent();
                if (held.exitCode === 1) {
                    lines.push("".concat(task.branch, " no longer holds the commit it started from (").concat(task.startCommit.slice(0, 7), "): a rebase or a reset?"));
                }
                _a.label = 3;
            case 3:
                if (!(task.startCommit !== null && task.baseBranch !== null && task.baseBranch !== task.branch && branches.includes(task.baseBranch))) return [3 /*break*/, 5];
                return [4 /*yield*/, host.run(['git', 'rev-list', '--count', "".concat(task.startCommit, "..").concat(task.baseBranch)], cwd)];
            case 4:
                ahead = _a.sent();
                n = Number(ahead.stdout.trim());
                if (ahead.exitCode === 0 && n > 0) {
                    lines.push("".concat(task.baseBranch, " has ").concat(plural(n, 'commit', 'commits'), " that ").concat(task.branch, " doesn't."));
                }
                _a.label = 5;
            case 5: return [2 /*return*/, lines];
        }
    });
}); };
exports.readDrift = readDrift;
