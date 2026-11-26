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
exports.helperToRemind = exports.logFileIn = exports.withBlock = exports.DIFFICULTIES = void 0;
exports.DIFFICULTIES = ['light', 'medium', 'hard'];
var withBlock = function (t, block) {
    return block === undefined
        ? t
        : 'waitFor' in block
            ? __assign(__assign({}, t), { blockedBy: t.blockedBy.includes(block.waitFor) ? t.blockedBy : __spreadArray(__spreadArray([], t.blockedBy, true), [block.waitFor], false) }) : __assign(__assign({}, t), { blockedReason: block.reason });
};
exports.withBlock = withBlock;
// The file a task log path names, or null when it would leave the project. One
// project's log never lands in another, however the path is written.
var logFileIn = function (projectPath, logPath) {
    var root = projectPath.replace(/\/+$/, '');
    var parts = [];
    for (var _i = 0, _a = (logPath.startsWith('/') ? logPath : "".concat(root, "/").concat(logPath)).split('/'); _i < _a.length; _i++) {
        var part = _a[_i];
        if (part === '..')
            parts.pop();
        else if (part !== '' && part !== '.')
            parts.push(part);
    }
    var file = "/".concat(parts.join('/'));
    return file.startsWith("".concat(root, "/")) ? file : null;
};
exports.logFileIn = logFileIn;
// The helper Claude must run before asking Rohan: Tea-DD first, then Commit Chai-n.
var helperToRemind = function (t) { var _a; return (_a = ['tea-dd', 'commit-chai-n'].find(function (id) { return t.helpers.on.includes(id) && !t.helpers.ran.includes(id); })) !== null && _a !== void 0 ? _a : null; };
exports.helperToRemind = helperToRemind;
