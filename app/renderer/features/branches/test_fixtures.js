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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeWorkspace = exports.mergeOperation = exports.branchReview = exports.branchGraph = exports.MERGE = exports.FORK = exports.TARGET = exports.SOURCE = void 0;
exports.SOURCE = 'a'.repeat(40);
exports.TARGET = 'b'.repeat(40);
exports.FORK = 'c'.repeat(40);
exports.MERGE = 'd'.repeat(40);
var branchGraph = function () { return ({ at: Date.parse('2026-11-04T12:00:00Z'), integration: 'main', heads: [{ branch: 'main', head: exports.TARGET }, { branch: 'task/first', head: exports.SOURCE }],
    commits: [{ id: exports.SOURCE, parents: [exports.FORK], message: 'Task work' }, { id: exports.TARGET, parents: [exports.FORK], message: 'Main work' }, { id: exports.FORK, parents: [], message: 'Start' }],
    tasks: [{ id: 'one', title: 'Auto update', branch: 'task/first', base: 'main', head: exports.SOURCE, fork: exports.FORK, merged: false, state: 'review', latest: null, seenAt: null, changed: 0, commits: 1 }], limited: false }); };
exports.branchGraph = branchGraph;
var branchReview = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ taskId: 'one', source: 'task/first', target: 'main', targets: ['main'], sourceHead: exports.SOURCE, targetHead: exports.TARGET, fingerprint: 'e'.repeat(64), files: [], diff: '+Task work', truncated: false, commits: [{ id: exports.SOURCE, parents: [exports.FORK], message: 'Task work' }], step: null, checks: [], state: 'review', blocked: null, merged: false, operation: null, remotes: ['origin'] }, over));
};
exports.branchReview = branchReview;
var mergeOperation = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ version: 1, id: '12345678-1234-1234-1234-123456789abc', key: 'a-000001', taskId: 'one', source: 'task/first', target: 'main', sourceHead: exports.SOURCE, targetHead: exports.TARGET, created: Date.parse('2026-11-04T12:00:00Z'), stage: 'ready', tree: 'f'.repeat(40), commit: null, message: null, events: [], published: null }, over));
};
exports.mergeOperation = mergeOperation;
var mergeWorkspace = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ availableChecks: [], checks: [], checksCurrent: true, operation: (0, exports.mergeOperation)(), conflicts: [], diff: '+Task work', truncated: false, approval: 'approval' }, over));
};
exports.mergeWorkspace = mergeWorkspace;
