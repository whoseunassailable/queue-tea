"use strict";
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
exports.nodeUserGit = exports.argvOf = void 0;
var stream_process_1 = require("../../../core/stream_process");
var argvOf = function (action) {
    switch (action.kind) {
        case 'prepare': return ['merge', '--no-ff', '--no-commit', '--', action.source];
        case 'commit': return ['commit', '-m', action.message];
        case 'commitFiles': return __spreadArray(['--literal-pathspecs', 'commit', '--only', '-m', action.message, '--'], action.files, true);
        case 'apply': return ['merge', '--ff-only', '--', action.commit];
        case 'abort': return ['merge', '--abort'];
        case 'push': return ['push', '--porcelain', '--', action.remote, "".concat(action.head, ":refs/heads/").concat(action.branch)];
    }
};
exports.argvOf = argvOf;
var nodeUserGit = function (log) { return function (cwd, action, output) {
    var args = (0, exports.argvOf)(action);
    log.debug("user branch action: git ".concat(args.join(' ')));
    return (0, stream_process_1.streamProcess)(log, { argv: __spreadArray(['git'], args, true), cwd: cwd, env: { GIT_TERMINAL_PROMPT: '0' } }, output);
}; };
exports.nodeUserGit = nodeUserGit;
