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
var branch_rules_1 = require("../../../../hooks/shared/git/domain/services/branch_rules");
var git_source_1 = require("../../../../hooks/shared/git/data/datasources/git_source");
var helpers_1 = require("../../../helpers");
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var status = function () {
    var lines = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lines[_i] = arguments[_i];
    }
    return lines.join('\n') + '\n';
};
var repo = function (statusText) {
    return (0, helpers_1.memoryHost)({
        git: {
            'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
            'git status --porcelain=v2 --branch': { stdout: statusText },
        },
    });
};
(0, testing_1.test)('parseStatus: clean, pushed branch', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, git;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                host = repo(status(OID, '# branch.head task/a', '# branch.upstream origin/task/a', '# branch.ab +0 -0')).host;
                return [4 /*yield*/, (0, git_source_1.readGit)(host, '/r')];
            case 1:
                git = _a.sent();
                (0, testing_1.expect)(git).toEqual({
                    isRepo: true,
                    branch: 'task/a',
                    isDetached: false,
                    head: '1a2b3c4',
                    uncommitted: 0,
                    unpushed: 0,
                    hasUpstream: true,
                });
                (0, testing_1.expect)((0, branch_rules_1.holdReason)(git)).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('parseStatus: 3 changed, 2 ahead', function () {
    var g = (0, branch_rules_1.parseStatus)(status(OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +2 -0', '1 .M N... 100644 100644 100644 aaa bbb lib/a.dart', '1 M. N... 100644 100644 100644 aaa bbb lib/b.dart', '? notes.txt'));
    (0, testing_1.expect)((0, branch_rules_1.holdReason)(__assign({ isRepo: true }, g))).toBe('3 files not committed · 2 commits not pushed');
});
(0, testing_1.test)('one file, one commit is singular', function () {
    var g = (0, branch_rules_1.parseStatus)(status(OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +1 -0', '? a.txt'));
    (0, testing_1.expect)((0, branch_rules_1.holdReason)(__assign({ isRepo: true }, g))).toBe('1 file not committed · 1 commit not pushed');
});
(0, testing_1.test)('only uncommitted files', function () {
    var g = (0, branch_rules_1.parseStatus)(status(OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -3', '? a.txt'));
    (0, testing_1.expect)((0, branch_rules_1.holdReason)(__assign({ isRepo: true }, g))).toBe('1 file not committed');
});
// Without an upstream, the commits no remote has; with no remote at all, that
// is every commit.
var noUpstream = function (localOnly) {
    return (0, helpers_1.memoryHost)({
        git: {
            'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
            'git status --porcelain=v2 --branch': { stdout: status(OID, '# branch.head task/new') },
            'git rev-list --count HEAD --not --remotes': { stdout: localOnly },
        },
    });
};
(0, testing_1.test)('no upstream, with commits no remote has', function () { return __awaiter(void 0, void 0, void 0, function () {
    var git;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, git_source_1.readGit)(noUpstream('2\n').host, '/r')];
            case 1:
                git = _a.sent();
                (0, testing_1.expect)(git.hasUpstream).toBe(false);
                (0, testing_1.expect)(git.unpushed).toBe(2);
                (0, testing_1.expect)((0, branch_rules_1.holdReason)(git)).toBe('This branch has never been pushed');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('no upstream, but every commit is already on a remote', function () { return __awaiter(void 0, void 0, void 0, function () {
    var git;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, git_source_1.readGit)(noUpstream('0\n').host, '/r')];
            case 1:
                git = _a.sent();
                (0, testing_1.expect)(git.hasUpstream).toBe(false);
                (0, testing_1.expect)(git.unpushed).toBe(0);
                (0, testing_1.expect)((0, branch_rules_1.holdReason)(git)).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('no upstream and files not committed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                host = (0, helpers_1.memoryHost)({
                    git: {
                        'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
                        'git status --porcelain=v2 --branch': { stdout: status(OID, '# branch.head task/new', '? a.txt') },
                        'git rev-list --count HEAD --not --remotes': { stdout: '3\n' },
                    },
                }).host;
                _a = testing_1.expect;
                _b = branch_rules_1.holdReason;
                return [4 /*yield*/, (0, git_source_1.readGit)(host, '/r')];
            case 1:
                _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe('1 file not committed');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('detached', function () {
    var g = (0, branch_rules_1.parseStatus)(status(OID, '# branch.head (detached)'));
    (0, testing_1.expect)(g.isDetached).toBe(true);
    (0, testing_1.expect)(g.branch).toBeNull();
    (0, testing_1.expect)((0, branch_rules_1.holdReason)(__assign({ isRepo: true }, g))).toBe('Detached HEAD: check out a branch first');
});
(0, testing_1.test)('not a repo', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, git;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                host = (0, helpers_1.memoryHost)({ git: { 'git rev-parse --is-inside-work-tree': { exitCode: 128 } } }).host;
                return [4 /*yield*/, (0, git_source_1.readGit)(host, '/x')];
            case 1:
                git = _a.sent();
                (0, testing_1.expect)(git.isRepo).toBe(false);
                (0, testing_1.expect)((0, branch_rules_1.holdReason)(git)).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('slugBranch: plain title, filler words left out', function () {
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('Retry button on the scan page', [])).toBe('task/retry-button-scan-page');
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('Add dark mode', [])).toBe('task/add-dark-mode');
});
(0, testing_1.test)('branchSlug: at most four words and 30 characters, in the title’s order', function () {
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Feature parity audit of the menu against the engine')).toBe('feature-parity-audit-menu');
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Short branch names and parent-child tasks')).toBe('short-branch-names-parent');
    // A word that would run past 30 characters is passed over for a later one.
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Refactor authentication middleware for sessions')).toBe('refactor-authentication');
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Internationalization localization support')).toBe('internationalization-support');
    for (var _i = 0, _a = ['Feature parity audit of the menu against the engine', 'x'.repeat(200), 'a b c d e f g h']; _i < _a.length; _i++) {
        var title = _a[_i];
        (0, testing_1.expect)((0, branch_rules_1.branchSlug)(title).length).toBeLessThanOrEqual(30);
    }
});
(0, testing_1.test)('branchSlug: punctuation, slashes, pipes, backticks and emoji', function () {
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Fix: the `parseStatus()` crash (again!) — urgent?')).toBe('fix-parsestatus-crash-urgent');
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)("Don't reset the user’s draft")).toBe('dont-reset-users-draft');
    var name = (0, branch_rules_1.slugBranch)("Fix a/b | `c` \uD83D\uDE80 ".concat('x'.repeat(200)), []);
    (0, testing_1.expect)(name).toMatch(/^task\/[a-z0-9]+(?:-[a-z0-9]+)*$/);
    (0, testing_1.expect)(name).toBe('task/fix');
});
(0, testing_1.test)('branchSlug: links, hosts and port numbers are left out', function () {
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Get the dev server running on localhost:3000 and tell me its URL')).toBe('dev-server-running-url');
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Proxy https://api.example.com/v2/users?id=7 calls through 127.0.0.1:8080')).toBe('proxy-calls');
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Move the app off port 5173 to www.example.org')).toBe('move-app-off');
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Fix issue 42 in the parser')).toBe('fix-issue-42-parser');
});
(0, testing_1.test)('branchSlug: one word too long is cut; nothing usable becomes task; filler alone is kept', function () {
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('x'.repeat(200))).toBe('x'.repeat(30));
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('🚀🚀')).toBe('task');
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('🚀🚀', [])).toBe('task/task');
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)('Do it now')).toBe('do-it-now');
});
(0, testing_1.test)('branchSlug: the same title always gives the same name', function () {
    var title = 'Feature parity audit of the menu against the engine';
    (0, testing_1.expect)((0, branch_rules_1.branchSlug)(title)).toBe((0, branch_rules_1.branchSlug)(title));
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)(title, ['main'])).toBe((0, branch_rules_1.slugBranch)(title, ['main']));
});
(0, testing_1.test)('slugBranch: taken names get -2 then -3, whatever order the branches are listed in', function () {
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('Retry', ['task/retry'])).toBe('task/retry-2');
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('Retry', ['task/retry', 'task/retry-2'])).toBe('task/retry-3');
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('Retry', ['task/retry-2', 'main', 'task/retry'])).toBe('task/retry-3');
    // Two titles that shorten to the same name.
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('Retry the button', ['task/retry-button'])).toBe('task/retry-button-2');
    (0, testing_1.expect)((0, branch_rules_1.slugBranch)('Retry button, please', ['task/retry-button', 'task/retry-button-2'])).toBe('task/retry-button-3');
});
(0, testing_1.test)('parseShortstat', function () {
    (0, testing_1.expect)((0, branch_rules_1.parseShortstat)(' 4 files changed, 160 insertions(+), 38 deletions(-)\n')).toEqual({
        linesAdded: 160,
        linesRemoved: 38,
        filesTouched: 4,
    });
    (0, testing_1.expect)((0, branch_rules_1.parseShortstat)(' 1 file changed, 2 insertions(+)\n')).toEqual({
        linesAdded: 2,
        linesRemoved: 0,
        filesTouched: 1,
    });
    (0, testing_1.expect)((0, branch_rules_1.parseShortstat)(' 1 file changed, 5 deletions(-)\n')).toEqual({
        linesAdded: 0,
        linesRemoved: 5,
        filesTouched: 1,
    });
    (0, testing_1.expect)((0, branch_rules_1.parseShortstat)('')).toEqual({ linesAdded: 0, linesRemoved: 0, filesTouched: 0 });
});
(0, testing_1.test)('branches: list, make, and diff go through git', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({
                    git: {
                        'git branch --format=%(refname:short)': { stdout: 'main\ntask/a\n' },
                        'git switch -c task/b': {},
                        'git diff --shortstat abc1234': { stdout: ' 2 files changed, 9 insertions(+), 1 deletion(-)\n' },
                    },
                });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, git_source_1.listBranches)(mem.host, '/r')];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual(['main', 'task/a']);
                return [4 /*yield*/, (0, git_source_1.makeBranch)(mem.host, '/r', 'task/b')];
            case 2:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, (0, git_source_1.diffSince)(mem.host, '/r', 'abc1234')];
            case 3:
                _b.apply(void 0, [_c.sent()]).toEqual({ linesAdded: 9, linesRemoved: 1, filesTouched: 2 });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('makeBranch rejects when git fails', function () { return __awaiter(void 0, void 0, void 0, function () {
    var host;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                host = (0, helpers_1.memoryHost)().host;
                return [4 /*yield*/, (0, testing_1.expect)((0, git_source_1.makeBranch)(host, '/r', 'task/b')).rejects.toThrow()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
