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
exports.bringForwardArgv = exports.openLineArgv = exports.codexPasteLine = exports.codexLine = exports.claudeLine = exports.appleScriptText = exports.shellQuote = exports.windowChrome = void 0;
// Everything that differs between the Mac and Windows lives under platform/.
// Windows gets a file beside this one, with the same exports.
exports.windowChrome = {
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 18 },
};
// One word to the shell, whatever the folder is called.
var shellQuote = function (text) { return "'".concat(text.replace(/'/g, "'\\''"), "'"); };
exports.shellQuote = shellQuote;
var appleScriptText = function (text) { return "\"".concat(text.replace(/\\/g, '\\\\').replace(/"/g, '\\"'), "\""); };
exports.appleScriptText = appleScriptText;
var claudeLine = function (path) { return "cd ".concat((0, exports.shellQuote)(path), " && claude"); };
exports.claudeLine = claudeLine;
// Codex's own sandbox keeps .git read-only, and on-request makes it ask Rohan
// before anything runs outside it: the guard Codex has in place of the mod's.
var CODEX_GUARD = '--sandbox workspace-write --ask-for-approval on-request';
// The brief comes from a file: typed through AppleScript its quotes and lines would break.
var codexOptions = function (args) { return args.length === 0 ? '' : "".concat(args.map(exports.shellQuote).join(' '), " "); };
var codexLine = function (path, briefFile, args) {
    if (args === void 0) { args = []; }
    return "cd ".concat((0, exports.shellQuote)(path), " && codex ").concat(CODEX_GUARD, " ").concat(codexOptions(args), "\"$(cat ").concat((0, exports.shellQuote)(briefFile), ")\"");
};
exports.codexLine = codexLine;
// For copying when the brief file couldn't be written: pasted, it needs no file.
var codexPasteLine = function (path, brief, args) {
    if (args === void 0) { args = []; }
    return "cd ".concat((0, exports.shellQuote)(path), " && codex ").concat(CODEX_GUARD, " ").concat(codexOptions(args)).concat((0, exports.shellQuote)(brief));
};
exports.codexPasteLine = codexPasteLine;
var script = function () {
    var lines = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lines[_i] = arguments[_i];
    }
    return __spreadArray(['osascript'], lines.flatMap(function (line) { return ['-e', line]; }), true);
};
// VS Code by name and not with `code`: an app opened from the Finder doesn't
// get the shell's PATH.
var openVsCode = function (path) { return ['open', '-a', 'Visual Studio Code', path]; };
// A new window running the line in the project.
var openLineArgv = function (terminal, path, shellLine) {
    var line = (0, exports.appleScriptText)(shellLine);
    if (terminal === 'terminal')
        return script('tell application "Terminal"', "set queueTeaTab to do script ".concat(line), "set custom title of queueTeaTab to ".concat((0, exports.appleScriptText)(path)), 'activate', 'end tell');
    if (terminal === 'iterm') {
        return script('tell application "iTerm"', 'activate', 'set queueTeaWindow to (create window with default profile)', "set name of current session of queueTeaWindow to ".concat((0, exports.appleScriptText)(path)), "tell current session of queueTeaWindow to write text ".concat(line), 'end tell');
    }
    return openVsCode(path);
};
exports.openLineArgv = openLineArgv;
// A session is open already, so its terminal only comes forward.
var bringForwardArgv = function (terminal, path) {
    if (terminal === 'terminal')
        return script('tell application "Terminal"', 'activate', 'repeat with queueTeaWindow in windows', 'repeat with queueTeaTab in tabs of queueTeaWindow', "if custom title of queueTeaTab is ".concat((0, exports.appleScriptText)(path), " then"), 'set selected of queueTeaTab to true', 'set frontmost of queueTeaWindow to true', 'return', 'end if', 'end repeat', 'end repeat', 'end tell');
    if (terminal === 'iterm')
        return script('tell application "iTerm"', 'activate', 'repeat with queueTeaWindow in windows', 'repeat with queueTeaTab in tabs of queueTeaWindow', 'repeat with queueTeaSession in sessions of queueTeaTab', "if name of queueTeaSession is ".concat((0, exports.appleScriptText)(path), " then"), 'select queueTeaSession', 'select queueTeaTab', 'select queueTeaWindow', 'return', 'end if', 'end repeat', 'end repeat', 'end repeat', 'end tell');
    return openVsCode(path);
};
exports.bringForwardArgv = bringForwardArgv;
