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
exports.viewOf = exports.rowOf = exports.statusOf = exports.sessionInfoOf = exports.sessionsIn = void 0;
var families_1 = require("../../../../../hooks/shared/backlog/domain/services/families");
var ranking_1 = require("../../../../../hooks/shared/backlog/domain/services/ranking");
var queue_rules_1 = require("../../../../../hooks/shared/records/domain/services/queue_rules");
var session_rules_1 = require("../../../../../hooks/shared/sessions/domain/services/session_rules");
var week_stats_1 = require("../../../../../hooks/shared/time/domain/services/week_stats");
var game_1 = require("../../game/domain/services/game");
var RECENT_VICTORIES = 3;
var BRANCH_ORDER = { current: 0, queued: 1, done: 2, removed: 3 };
var minutesOf = function (task) { return Object.values(task.minutesByDay).reduce(function (sum, m) { return sum + m; }, 0); };
var difficultyOf = function (task) { var _a; return (_a = task.difficulty.actual) !== null && _a !== void 0 ? _a : task.difficulty.expected; };
// The sessions in this project that are still alive, newest first.
var sessionsIn = function (sessions, projectPath, nowMs) {
    return sessions.filter(function (s) { return (s.projectPath === projectPath || s.workingPath === projectPath) && (0, session_rules_1.isFresh)(s, nowMs); }).sort(function (a, b) { return b.heartbeat - a.heartbeat; });
};
exports.sessionsIn = sessionsIn;
var sessionInfoOf = function (sessions, projectPath, nowMs) {
    var alive = (0, exports.sessionsIn)(sessions, projectPath, nowMs);
    var newest = alive[0];
    if (newest === undefined)
        return { state: 'none', allowance: null };
    var state = alive.length > 1 ? 'several' : newest.cup.mood === 'attention' ? 'needsYou' : newest.isTurnRunning ? 'working' : 'open';
    return { state: state, allowance: newest.allowance };
};
exports.sessionInfoOf = sessionInfoOf;
// First match wins: needs you, working, the current task, what waits, nothing.
var statusOf = function (record, session) {
    var _a, _b;
    var current = (0, queue_rules_1.currentTask)(record.tasks);
    if (record.tasks.some(function (t) { return t.state === 'current' && t.review !== null; }))
        return { kind: 'judgement' };
    if (session === 'needsYou')
        return { kind: 'needsYou' };
    if (session === 'working')
        return { kind: 'working' };
    if (current !== null)
        return { kind: 'current', title: current.title };
    var waiting = record.tasks.filter(function (t) { return t.state === 'queued'; }).length;
    return waiting === 0 ? { kind: 'nothing' } : { kind: 'waiting', count: waiting, title: (_b = (_a = (0, ranking_1.suggest)(record, null)) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : null };
};
exports.statusOf = statusOf;
var rowOf = function (key, record, sessions, nowMs) {
    var state = (0, exports.sessionInfoOf)(sessions, record.project.path, nowMs).state;
    return {
        kind: 'readable',
        key: key,
        name: record.project.name,
        path: record.project.path,
        waiting: record.tasks.filter(function (t) { return t.state === 'queued'; }).length,
        status: (0, exports.statusOf)(record, state),
        session: state,
    };
};
exports.rowOf = rowOf;
var questOf = function (task, tasks, nowMs, row, starId, playNext) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return ({
        id: task.id,
        title: task.title,
        priority: task.priority,
        difficulty: task.difficulty.expected,
        xp: (0, game_1.xpOf)(task.difficulty.expected),
        estimateMinutes: (_a = row === null || row === void 0 ? void 0 : row.estimate) !== null && _a !== void 0 ? _a : (0, ranking_1.estimateMinutes)(task, tasks),
        waitedMs: Math.max(0, nowMs - Date.parse(task.created)),
        why: task.id === starId ? ((_b = row === null || row === void 0 ? void 0 : row.why) !== null && _b !== void 0 ? _b : null) : null,
        isStar: task.id === starId,
        isPlayNext: task.id === playNext,
        parentId: task.parentId,
        sealedBecause: (0, ranking_1.isBlocked)(task, tasks) ? (0, ranking_1.blockedText)(task, tasks) : null,
        branch: task.branch,
        created: task.created,
        description: task.description,
        criteria: task.criteria,
        fits: (_c = row === null || row === void 0 ? void 0 : row.fits) !== null && _c !== void 0 ? _c : null,
        goal: ((_d = task.checkpoint) === null || _d === void 0 ? void 0 : _d.goal) || null,
        acceptance: (_f = (_e = task.checkpoint) === null || _e === void 0 ? void 0 : _e.acceptance) !== null && _f !== void 0 ? _f : [],
        helpers: task.helpers.on,
        testProfile: (_g = task.testProfile) !== null && _g !== void 0 ? _g : null,
        due: (_h = task.due) !== null && _h !== void 0 ? _h : null,
    });
};
var entryOf = function (entry, tasks, nowMs, ranked, playNext) {
    var _a, _b, _c;
    var starId = (_b = (_a = ranked[0]) === null || _a === void 0 ? void 0 : _a.task.id) !== null && _b !== void 0 ? _b : null;
    var quest = function (task, row) { return questOf(task, tasks, nowMs, row, starId, playNext); };
    if (entry.kind === 'task')
        return { kind: 'quest', quest: quest(entry.row.task, entry.row) };
    if (entry.kind === 'blocked')
        return { kind: 'quest', quest: quest(entry.task, null) };
    var group = entry.group;
    var own = (_c = group.rows.find(function (r) { return r.task.id === group.parent.id; })) !== null && _c !== void 0 ? _c : null;
    var chapters = group.rows.filter(function (r) { return r.task.id !== group.parent.id; }).map(function (r) { return quest(r.task, r); });
    var sealedChapters = group.blocked.filter(function (t) { return t.id !== group.parent.id; }).map(function (t) { return quest(t, null); });
    return {
        kind: 'saga',
        quest: quest(group.parent, own),
        chapters: __spreadArray(__spreadArray([], chapters, true), sealedChapters, true),
        progress: (0, families_1.progressOf)(group.parent, tasks),
        hasStar: group.hasStar,
    };
};
var activeOf = function (task, requests) {
    var _a, _b, _c, _d, _e, _f;
    return ({
        id: task.id,
        title: task.title,
        priority: task.priority,
        difficulty: task.difficulty.expected,
        xp: (0, game_1.xpOf)(task.difficulty.expected),
        branch: task.branch,
        minutes: minutesOf(task),
        started: task.started,
        isBoss: task.priority === 'urgent',
        improvingMessages: task.effort.improvingMessages,
        filesChanged: task.effort.filesChanged,
        review: task.review,
        criteria: task.criteria,
        helpers: task.helpers.on,
        testProfile: (_a = task.testProfile) !== null && _a !== void 0 ? _a : null,
        due: (_b = task.due) !== null && _b !== void 0 ? _b : null,
        testingMinutes: ((_c = task.testPeriods) !== null && _c !== void 0 ? _c : []).reduce(function (sum, p) { return sum + p.end - p.start; }, 0) / 60000,
        minutesInChecks: (_d = task.minutesInChecks) !== null && _d !== void 0 ? _d : 0,
        asking: (_f = (_e = requests.find(function (q) { return q.taskId === task.id; })) === null || _e === void 0 ? void 0 : _e.kind) !== null && _f !== void 0 ? _f : null,
        codexSince: task.codexSince,
        worktreePath: task.worktreePath,
        baseBranch: task.baseBranch,
        parentId: task.parentId,
    });
};
var victoryOf = function (task) { return ({
    id: task.id,
    title: task.title,
    finished: task.finished,
    minutes: minutesOf(task),
    xp: (0, game_1.xpOf)(difficultyOf(task)),
}); };
var viewOf = function (key, record, sessions, nowMs, budget) {
    var _a, _b, _c, _d;
    if (budget === void 0) { budget = null; }
    var tasks = record.tasks, playNext = record.playNext;
    var ranked = (0, ranking_1.rankBacklog)(record, budget);
    var blocked = (0, ranking_1.blockedTasks)(tasks);
    var _e = (0, families_1.groupBacklog)(ranked, blocked, tasks), ready = _e.ready, stuck = _e.blocked;
    var current = (0, queue_rules_1.currentTask)(tasks);
    var wins = (0, week_stats_1.finishedTasks)(tasks);
    var entry = function (e) { return entryOf(e, tasks, nowMs, ranked, playNext); };
    return {
        kind: 'readable',
        key: key,
        name: record.project.name,
        path: record.project.path,
        session: (0, exports.sessionInfoOf)(sessions, record.project.path, nowMs),
        active: current === null ? null : activeOf(current, record.requests),
        activeQuests: tasks.filter(function (t) { return t.state === 'current'; }).map(function (t) { return (__assign(__assign({}, activeOf(t, record.requests)), { session: (0, exports.sessionInfoOf)(sessions.filter(function (s) { var _a, _b; return ((_a = s.workingPath) !== null && _a !== void 0 ? _a : s.projectPath) === ((_b = t.worktreePath) !== null && _b !== void 0 ? _b : record.project.path); }), record.project.path, nowMs) })); }),
        branches: __spreadArray([], tasks, true).sort(function (a, b) { return BRANCH_ORDER[a.state] - BRANCH_ORDER[b.state]; }).flatMap(function (task) {
            var _a;
            return task.branch === null || task.state === 'removed' ? [] : [{
                    id: task.id, title: task.title, branch: task.branch, baseBranch: task.baseBranch,
                    path: (_a = task.worktreePath) !== null && _a !== void 0 ? _a : record.project.path, state: task.state,
                    platform: task.state === 'current' ? (task.codexSince === null ? 'claude' : 'codex') : null,
                    parent: task.parentId === null ? null : (function () { var parent = tasks.find(function (t) { return t.id === task.parentId; }); return parent ? { id: parent.id, title: parent.title } : null; })(),
                }];
        }),
        ready: ready.map(entry),
        sealed: stuck.map(entry),
        canStart: ranked.length,
        sealedCount: blocked.length,
        activeSaga: (_b = (_a = (0, families_1.activeFeature)(record)) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : null,
        activeSagaId: (_d = (_c = (0, families_1.activeFeature)(record)) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null,
        victories: wins.slice(0, RECENT_VICTORIES).map(victoryOf),
        victoryCount: wins.length,
        docsLogPath: record.docsLogPath,
        budget: budget,
    };
};
exports.viewOf = viewOf;
