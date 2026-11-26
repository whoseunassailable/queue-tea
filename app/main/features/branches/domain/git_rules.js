"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalFor = exports.parseStatus = exports.parseLog = exports.isFile = exports.isBranch = exports.isOid = void 0;
var commit_proposal_1 = require("../../../../../hooks/features/commit_guard/domain/services/commit_proposal");
var isOid = function (value) { return typeof value === 'string' && /^[a-f0-9]{40,64}$/.test(value); };
exports.isOid = isOid;
var isBranch = function (value) { return typeof value === 'string' && value.length > 0 && value.length < 240 && !value.startsWith('-') && !value.startsWith('/') && !value.endsWith('/') && !/[\s~^:?*\[\\\x00-\x1f]/.test(value) && !value.includes('..') && !value.includes('@{') && !value.includes('//') && value.split('/').every(function (p) { return !p.startsWith('.') && !p.endsWith('.') && !p.endsWith('.lock'); }); };
exports.isBranch = isBranch;
var isFile = function (value) { return typeof value === 'string' && value.length > 0 && !value.startsWith('/') && !value.includes('\0') && !value.split('/').some(function (p) { return p === '..' || p.toLowerCase() === '.git'; }); };
exports.isFile = isFile;
var parseLog = function (text) { return text.trimEnd().split('\n').filter(Boolean).map(function (line) {
    var _a = line.split('\0'), _b = _a[0], id = _b === void 0 ? '' : _b, _c = _a[1], parents = _c === void 0 ? '' : _c, _d = _a[2], message = _d === void 0 ? '' : _d;
    return { id: id, parents: parents.split(' ').filter(Boolean), message: message };
}).filter(function (c) { return (0, exports.isOid)(c.id); }); };
exports.parseLog = parseLog;
var parseStatus = function (text) {
    var _a;
    var parts = text.split('\0');
    var files = [];
    for (var i = 0; i < parts.length; i++) {
        var line = parts[i];
        if (line.length < 4)
            continue;
        var status_1 = line.slice(0, 2);
        files.push({ status: status_1, path: line.slice(3), previous: /[RC]/.test(status_1) ? (_a = parts[++i]) !== null && _a !== void 0 ? _a : null : null });
    }
    return files;
};
exports.parseStatus = parseStatus;
// Claude's proposal as Branches shows it: only when it was made on the commit
// the branch is on now, and only its files that are still changed. The record
// is read from disk, so its shape is checked here.
var proposalFor = function (proposal, head, changed) {
    var p = proposal;
    if (!p || typeof p.message !== 'string' || !p.message.trim() || (0, commit_proposal_1.creditsClaude)(p.message) || p.head !== head || typeof p.at !== 'string' || !Array.isArray(p.files))
        return null;
    var files = p.files.filter(function (f) { return (0, exports.isFile)(f) && changed.some(function (c) { return c.path === f; }); });
    return files.length ? { message: p.message, files: files, head: p.head, at: p.at } : null;
};
exports.proposalFor = proposalFor;
