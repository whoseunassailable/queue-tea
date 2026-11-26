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
var commit_guard_1 = require("../../../hooks/features/commit_guard/domain/services/commit_guard");
var TEXT = 'Queue-tea: commits and pushes are yours to make.';
var refused = [
    'git commit -m "x"',
    'git commit --amend',
    'git push',
    'git push --force',
    'git push --tags',
    'git merge main',
    'git rebase main',
    'git cherry-pick abc',
    'git revert abc',
    'git pull',
    'git am x.patch',
    'cd x && git commit -m y',
    'git -C /tmp/r commit -m y',
    'git -c user.name=a commit',
    'GIT_AUTHOR_NAME=a git commit',
    'bash -c "git push"',
    "sh -c 'git commit -m x'",
    'echo $(git commit -m x)',
    'echo "$(git push)"',
    'echo `git push`',
    'gh repo create a/b --push --source .',
    'gh pr merge 12',
    'git status; git push origin main',
    'git add . && git commit -m wip | cat',
    '/usr/bin/git push',
    'sudo git push',
    'eval "git push"',
];
var allowed = [
    'git status',
    'git log --oneline',
    'git diff',
    'git branch',
    'git switch -c task/x',
    'grep -r "git push" docs/',
    'echo "git commit"',
    "echo 'git push && git commit'",
    'gh pr view 12',
    'gh repo create a/b',
    'ls -la',
    'git -C /r status --porcelain=v2 --branch',
];
(0, testing_1.test)('refuses every commit and push', function () {
    for (var _i = 0, refused_1 = refused; _i < refused_1.length; _i++) {
        var command = refused_1[_i];
        (0, testing_1.expect)([command, (0, commit_guard_1.isCommitOrPush)(command)]).toEqual([command, true]);
    }
});
(0, testing_1.test)('allows the rest', function () {
    for (var _i = 0, allowed_1 = allowed; _i < allowed_1.length; _i++) {
        var command = allowed_1[_i];
        (0, testing_1.expect)([command, (0, commit_guard_1.isCommitOrPush)(command)]).toEqual([command, false]);
    }
});
(0, testing_1.test)('the hook denies with the spec text', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ran = false;
                on('tool.call', function () {
                    ran = true;
                    return { result: {} };
                });
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'git push' })];
            case 1:
                answer = _a.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain(TEXT);
                (0, testing_1.expect)(ran).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a helper’s commits and pushes are refused too, its reads let through', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, inHelper, push, merge;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ran = [];
                on('tool.call', function ($, e) {
                    var _a;
                    ran.push("".concat((_a = e.agentId) !== null && _a !== void 0 ? _a : 'main', ": ").concat(e.tool === 'Bash' ? e.command : e.tool));
                    return { result: {} };
                });
                inHelper = { agentId: 'commit-chai-n-1' };
                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', command: 'git push -u origin task/x' }, inHelper))];
            case 1:
                push = _a.sent();
                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', command: 'gh pr merge 12 --squash' }, inHelper))];
            case 2:
                merge = _a.sent();
                return [4 /*yield*/, $.tool.call(__assign({ tool: 'Bash', command: 'git status' }, inHelper))];
            case 3:
                _a.sent();
                (0, testing_1.expect)(JSON.stringify(push)).toContain(TEXT);
                (0, testing_1.expect)(JSON.stringify(merge)).toContain(TEXT);
                (0, testing_1.expect)(ran).toEqual(['commit-chai-n-1: git status']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the hook passes git status through', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ran = false;
                on('tool.call', function () {
                    ran = true;
                    return { result: {} };
                });
                return [4 /*yield*/, $.tool.call({ tool: 'Bash', command: 'git status' })];
            case 1:
                _a.sent();
                (0, testing_1.expect)(ran).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
var refusedShell = [
    'if true; then git push; fi',
    'for f in a; do git commit -m x; done',
    'if x; then echo; else git commit -m y; fi',
    'while true; do git push; done',
    'true || { git commit -m x; }',
    '! git push',
    'timeout 30 git push',
    'sudo -u bob git push',
    'env -u X git push',
    'nice -n 5 git push',
    'xargs git commit -m x',
    'find . -name x -exec git commit -m y \;',
    'bash -c -- "git push"',
    'dash -c "git push"',
    'ksh -c "git commit -m x"',
];
var allowedShell = [
    'timeout 30 git status',
    'xargs grep x',
    'find . -name "*.ts" -exec ls {} \;',
    'if [ -f x ]; then echo yes; fi',
    'sudo -u bob ls',
];
(0, testing_1.test)('refuses commits and pushes inside shell grammar and wrappers', function () {
    for (var _i = 0, refusedShell_1 = refusedShell; _i < refusedShell_1.length; _i++) {
        var command = refusedShell_1[_i];
        (0, testing_1.expect)([command, (0, commit_guard_1.isCommitOrPush)(command)]).toEqual([command, true]);
    }
});
(0, testing_1.test)('allows harmless commands inside shell grammar and wrappers', function () {
    for (var _i = 0, allowedShell_1 = allowedShell; _i < allowedShell_1.length; _i++) {
        var command = allowedShell_1[_i];
        (0, testing_1.expect)([command, (0, commit_guard_1.isCommitOrPush)(command)]).toEqual([command, false]);
    }
});
(0, testing_1.test)('the Monitor tool is guarded too', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ran = false;
                on('tool.call', function () {
                    ran = true;
                    return { result: {} };
                });
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', description: 'x', timeout_ms: 1000, command: 'git push' })];
            case 1:
                answer = _a.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain(TEXT);
                (0, testing_1.expect)(ran).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('wrapper options are read per wrapper', function () {
    for (var _i = 0, _a = ['env -i git push', 'sudo -E git push', 'xargs -0 git commit -m x', 'stdbuf -o L git push', 'xargs -I {} git commit -m {}']; _i < _a.length; _i++) {
        var command = _a[_i];
        (0, testing_1.expect)([command, (0, commit_guard_1.isCommitOrPush)(command)]).toEqual([command, true]);
    }
});
(0, testing_1.test)('when the matching rule itself fails, a Bash command is refused', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ran = false;
                on('tool.call', function () {
                    ran = true;
                    return { result: {} };
                });
                return [4 /*yield*/, $.tool.call({ tool: 'Bash' })];
            case 1:
                answer = _a.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain(TEXT);
                (0, testing_1.expect)(ran).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('when the matching rule itself fails, a Monitor command is refused', function ($, on) { return __awaiter(void 0, void 0, void 0, function () {
    var ran, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ran = false;
                on('tool.call', function () {
                    ran = true;
                    return { result: {} };
                });
                return [4 /*yield*/, $.tool.call({ tool: 'Monitor', description: 'x', timeout_ms: 1000, command: null })];
            case 1:
                answer = _a.sent();
                (0, testing_1.expect)(JSON.stringify(answer)).toContain(TEXT);
                (0, testing_1.expect)(ran).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
