"use strict";
// Reads a shell command the way a shell splits it, closely enough to find
// every git or gh call that commits or pushes. Quoted text is one word, so
// `grep "git push"` is a grep; command substitutions and `sh -c` scripts are
// read as commands of their own.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCommitOrPush = void 0;
var REFUSED_GIT = new Set(['commit', 'push', 'merge', 'rebase', 'cherry-pick', 'revert', 'pull', 'am']);
var WRAPPERS = new Set(['sudo', 'env', 'command', 'exec', 'time', 'nohup', 'nice', 'timeout', 'ionice', 'stdbuf', 'xargs']);
// Each wrapper's options that take the next word as their value.
var WRAPPER_VALUES = {
    sudo: ['-u', '-g', '-C', '-h', '-p', '-r', '-t', '-U', '--user', '--group'],
    env: ['-u', '-C', '-S', '--unset', '--chdir'],
    nice: ['-n', '--adjustment'],
    timeout: ['-s', '-k', '--signal', '--kill-after'],
    ionice: ['-c', '-n', '-p'],
    stdbuf: ['-i', '-o', '-e'],
    xargs: ['-I', '-L', '-n', '-P', '-d', '-s', '-a', '-E'],
    exec: ['-a'],
};
// Shell words that come before a command without being one.
var RESERVED = new Set(['if', 'then', 'else', 'elif', 'do', 'while', 'until', '!', '{', '}', 'fi', 'done']);
var SHELLS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh']);
var GIT_OPTIONS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace']);
// Reads `$(...)` from s[at] (just past the `$(`), nesting included; returns
// the inside and the index after the closing parenthesis.
var readParens = function (s, at) {
    var depth = 1;
    var i = at;
    while (i < s.length && depth > 0) {
        if (s[i] === '(')
            depth += 1;
        if (s[i] === ')')
            depth -= 1;
        i += 1;
    }
    return [s.slice(at, depth === 0 ? i - 1 : i), i];
};
var lex = function (s) {
    var _a, _b;
    var commands = [[]];
    var subs = [];
    var word = null;
    var add = function (text) {
        word = (word !== null && word !== void 0 ? word : '') + text;
    };
    var end = function () {
        if (word !== null)
            commands[commands.length - 1].push(word);
        word = null;
    };
    var split = function () {
        end();
        if (commands[commands.length - 1].length > 0)
            commands.push([]);
    };
    var i = 0;
    while (i < s.length) {
        var c = s[i];
        var two = s.slice(i, i + 2);
        if (c === '\\') {
            add((_a = s[i + 1]) !== null && _a !== void 0 ? _a : '');
            i += 2;
        }
        else if (c === "'") {
            var close_1 = s.indexOf("'", i + 1);
            var stop_1 = close_1 < 0 ? s.length : close_1;
            add(s.slice(i + 1, stop_1));
            i = stop_1 + 1;
        }
        else if (c === '"') {
            i += 1;
            add('');
            while (i < s.length && s[i] !== '"') {
                if (s[i] === '\\') {
                    add((_b = s[i + 1]) !== null && _b !== void 0 ? _b : '');
                    i += 2;
                }
                else if (s.slice(i, i + 2) === '$(') {
                    var _c = readParens(s, i + 2), inside = _c[0], after = _c[1];
                    subs.push(inside);
                    i = after;
                }
                else if (s[i] === '`') {
                    var close_2 = s.indexOf('`', i + 1);
                    var stop_2 = close_2 < 0 ? s.length : close_2;
                    subs.push(s.slice(i + 1, stop_2));
                    i = stop_2 + 1;
                }
                else {
                    add(s[i]);
                    i += 1;
                }
            }
            i += 1;
        }
        else if (two === '$(') {
            var _d = readParens(s, i + 2), inside = _d[0], after = _d[1];
            subs.push(inside);
            add('$()');
            i = after;
        }
        else if (c === '`') {
            var close_3 = s.indexOf('`', i + 1);
            var stop_3 = close_3 < 0 ? s.length : close_3;
            subs.push(s.slice(i + 1, stop_3));
            add('``');
            i = stop_3 + 1;
        }
        else if (two === '&&' || two === '||') {
            split();
            i += 2;
        }
        else if (c === ';' || c === '|' || c === '&' || c === '\n' || c === '(' || c === ')') {
            split();
            i += 1;
        }
        else if (c === ' ' || c === '\t') {
            end();
            i += 1;
        }
        else {
            add(c);
            i += 1;
        }
    }
    end();
    return { commands: commands.filter(function (words) { return words.length > 0; }), subs: subs };
};
var isRefused = function (words) {
    var _a, _b, _c, _d;
    var i = 0;
    var wrapper = null;
    while (i < words.length) {
        var w = words[i];
        if (RESERVED.has(w) || /^[A-Za-z_][A-Za-z0-9_]*=/.test(w)) {
            i += 1;
        }
        else if (WRAPPERS.has(w)) {
            wrapper = w;
            i += 1;
        }
        else if (wrapper !== null && w.startsWith('-')) {
            i += ((_a = WRAPPER_VALUES[wrapper]) !== null && _a !== void 0 ? _a : []).includes(w) ? 2 : 1;
        }
        else if (wrapper === 'timeout' && /^\d/.test(w)) {
            i += 1;
            wrapper = null;
        }
        else {
            break;
        }
    }
    var name = (_c = ((_b = words[i]) !== null && _b !== void 0 ? _b : '').split('/').pop()) !== null && _c !== void 0 ? _c : '';
    var rest = words.slice(i + 1);
    if (SHELLS.has(name)) {
        var flag = rest.findIndex(function (w) { return /^-[a-z]*c[a-z]*$/.test(w); });
        var after = flag < 0 ? [] : rest.slice(flag + 1);
        var script = after[0] === '--' ? after[1] : after[0];
        return script !== undefined && (0, exports.isCommitOrPush)(script);
    }
    if (name === 'find') {
        var exec_1 = rest.findIndex(function (w) { return w === '-exec' || w === '-execdir' || w === '-ok'; });
        if (exec_1 >= 0) {
            var end = rest.findIndex(function (w, j) { return j > exec_1 && (w === ';' || w === '+'); });
            if (isRefused(rest.slice(exec_1 + 1, end < 0 ? undefined : end)))
                return true;
        }
        return false;
    }
    if (name === 'eval')
        return (0, exports.isCommitOrPush)(rest.join(' '));
    if (name === 'git') {
        var j = 0;
        while (j < rest.length && rest[j].startsWith('-')) {
            j += GIT_OPTIONS_WITH_VALUE.has(rest[j]) ? 2 : 1;
        }
        return REFUSED_GIT.has((_d = rest[j]) !== null && _d !== void 0 ? _d : '');
    }
    if (name === 'gh') {
        var isRepoCreatePush = rest[0] === 'repo' && rest[1] === 'create' && rest.includes('--push');
        var isPrMerge = rest[0] === 'pr' && rest[1] === 'merge';
        return isRepoCreatePush || isPrMerge;
    }
    return false;
};
var isCommitOrPush = function (command) {
    var _a = lex(command), commands = _a.commands, subs = _a.subs;
    return commands.some(isRefused) || subs.some(exports.isCommitOrPush);
};
exports.isCommitOrPush = isCommitOrPush;
