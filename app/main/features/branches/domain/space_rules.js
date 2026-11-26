"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdOf = exports.buildFoldersIn = exports.BUILD_FOLDERS = void 0;
var git_rules_1 = require("./git_rules");
// Build output a tool makes again: these go, nothing else does.
exports.BUILD_FOLDERS = ['node_modules', 'build', '.dart_tool', 'dist', '.gradle', 'Pods', '.next', 'target'];
// The build folders in a `git ls-files -z --others --ignored --directory`
// listing, outermost first. Git ends a folder with `/` only when it is a real
// folder holding nothing tracked, so symlinks and folders with tracked files
// never appear. A folder inside one already kept is dropped.
var buildFoldersIn = function (listing) {
    var kept = [];
    var _loop_1 = function (folder) {
        if (!(0, git_rules_1.isFile)(folder) || !exports.BUILD_FOLDERS.includes(folder.slice(folder.lastIndexOf('/') + 1)))
            return "continue";
        if (!kept.some(function (k) { return folder.startsWith("".concat(k, "/")); }))
            kept.push(folder);
    };
    for (var _i = 0, _a = listing.split('\0').filter(function (e) { return e.endsWith('/'); }).map(function (e) { return e.slice(0, -1); }).sort(); _i < _a.length; _i++) {
        var folder = _a[_i];
        _loop_1(folder);
    }
    return kept;
};
exports.buildFoldersIn = buildFoldersIn;
// Who is working in a quest's folder: its quest or another current one, then
// a live session. A held folder is never cleared or removed.
var holdOf = function (tasks, task, path, projectPath, isSessionOpen) {
    return task.state === 'current' || tasks.some(function (t) { var _a; return t.state === 'current' && ((_a = t.worktreePath) !== null && _a !== void 0 ? _a : projectPath) === path; }) ? 'current' : isSessionOpen ? 'session' : null;
};
exports.holdOf = holdOf;
