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
var testing_1 = require("claude-code/testing");
var check_prompt_1 = require("../../../../hooks/features/message_check/domain/services/check_prompt");
var families_1 = require("../../../../hooks/shared/backlog/domain/services/families");
var ranking_1 = require("../../../../hooks/shared/backlog/domain/services/ranking");
var queue_rules_1 = require("../../../../hooks/shared/records/domain/services/queue_rules");
var record_source_1 = require("../../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../../helpers");
var at = function (minute) { return "2026-10-21T10:".concat(String(minute).padStart(2, '0'), ":00+02:00"); };
var recordOf = function (tasks, feature) {
    if (feature === void 0) { feature = null; }
    return (__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks, feature: feature }));
};
// A feature with three tasks under it: one done, one queued, one blocked.
var family = function () {
    var menu = (0, helpers_1.makeTask)({ title: 'Menu parity', priority: 'high', created: at(1) });
    var keys = (0, helpers_1.makeTask)({ title: 'Keys hint', parentId: menu.id, created: at(2) });
    var close = (0, helpers_1.makeTask)({ title: 'Close button', parentId: menu.id, state: 'done', created: at(3) });
    var docs = (0, helpers_1.makeTask)({ title: 'Menu docs', parentId: menu.id, blockedReason: 'waiting for copy', created: at(4) });
    return { menu: menu, keys: keys, close: close, docs: docs, tasks: [menu, keys, close, docs] };
};
(0, testing_1.test)('a task without a parent is on its own; children leave out removed ones', function () {
    var _a;
    var _b = family(), menu = _b.menu, keys = _b.keys, close = _b.close, docs = _b.docs, tasks = _b.tasks;
    var gone = (0, helpers_1.makeTask)({ title: 'Gone', parentId: menu.id, state: 'removed' });
    (0, testing_1.expect)((0, families_1.parentOf)(menu, tasks)).toBeNull();
    (0, testing_1.expect)((_a = (0, families_1.parentOf)(keys, tasks)) === null || _a === void 0 ? void 0 : _a.id).toBe(menu.id);
    (0, testing_1.expect)((0, families_1.childrenOf)(menu, __spreadArray(__spreadArray([], tasks, true), [gone], false)).map(function (t) { return t.id; })).toEqual([keys.id, close.id, docs.id]);
});
(0, testing_1.test)('progress counts done, in progress and blocked tasks under a feature', function () {
    var _a = family(), menu = _a.menu, tasks = _a.tasks;
    var now = (0, helpers_1.makeTask)({ title: 'Wire it', parentId: menu.id, state: 'current' });
    var p = (0, families_1.progressOf)(menu, __spreadArray(__spreadArray([], tasks, true), [now], false));
    (0, testing_1.expect)(p).toEqual({ done: 1, total: 4, current: 1, blocked: 1 });
    (0, testing_1.expect)((0, families_1.progressText)(p)).toBe('1/4 done ▰▱▱▱▱ · 1 in progress · 1 blocked');
    (0, testing_1.expect)((0, families_1.progressText)({ done: 0, total: 0, current: 0, blocked: 0 })).toBe('0/0 done ▱▱▱▱▱');
    (0, testing_1.expect)((0, families_1.progressText)({ done: 3, total: 3, current: 0, blocked: 0 })).toBe('3/3 done ▰▰▰▰▰');
});
(0, testing_1.test)('one level deep: no task under itself, under a child, or a feature under another', function () {
    var _a = family(), menu = _a.menu, keys = _a.keys, tasks = _a.tasks;
    var other = (0, helpers_1.makeTask)({ title: 'Other' });
    var done = (0, helpers_1.makeTask)({ title: 'Old', state: 'done' });
    var all = __spreadArray(__spreadArray([], tasks, true), [other, done], false);
    (0, testing_1.expect)((0, families_1.parentRefusal)(all, other.id, menu.id)).toBeNull();
    (0, testing_1.expect)((0, families_1.parentRefusal)(all, other.id, other.id)).toBe("A task can't be part of itself.");
    (0, testing_1.expect)((0, families_1.parentRefusal)(all, other.id, keys.id)).toBe('Keys hint is part of Menu parity, so its tasks go under that.');
    (0, testing_1.expect)((0, families_1.parentRefusal)(all, menu.id, other.id)).toBe("Menu parity has tasks of its own, so it can't be part of another.");
    (0, testing_1.expect)((0, families_1.parentRefusal)(all, other.id, done.id)).toBe('That feature is no longer open.');
    (0, testing_1.expect)((0, families_1.parentRefusal)(all, other.id, 't-missing')).toBe('That feature is no longer open.');
    // A task not saved yet can go under a feature.
    (0, testing_1.expect)((0, families_1.parentRefusal)(all, 't-new', menu.id)).toBeNull();
});
(0, testing_1.test)('the features a task can move under leave out the one it is under now', function () {
    var _a = family(), menu = _a.menu, keys = _a.keys, docs = _a.docs, tasks = _a.tasks;
    var other = (0, helpers_1.makeTask)({ title: 'Other' });
    var all = __spreadArray(__spreadArray([], tasks, true), [other], false);
    (0, testing_1.expect)((0, families_1.parentChoices)(all, keys.id).map(function (t) { return t.title; })).toEqual(['Other']);
    (0, testing_1.expect)((0, families_1.parentChoices)(all, other.id).map(function (t) { return t.title; })).toEqual(['Menu parity']);
    (0, testing_1.expect)((0, families_1.parentChoices)(all, menu.id)).toEqual([]);
    (0, testing_1.expect)((0, families_1.parentChoices)(all, docs.id).map(function (t) { return t.title; })).toEqual(['Other']);
});
(0, testing_1.test)('the active feature counts only while it is open and on its own', function () {
    var _a;
    var _b = family(), menu = _b.menu, keys = _b.keys, tasks = _b.tasks;
    (0, testing_1.expect)((_a = (0, families_1.activeFeature)(recordOf(tasks, menu.id))) === null || _a === void 0 ? void 0 : _a.id).toBe(menu.id);
    (0, testing_1.expect)((0, families_1.activeFeature)(recordOf(tasks, keys.id))).toBeNull();
    (0, testing_1.expect)((0, families_1.activeFeature)(recordOf(tasks.map(function (t) { return (t.id === menu.id ? __assign(__assign({}, t), { state: 'done' }) : t); }), menu.id))).toBeNull();
    (0, testing_1.expect)((0, families_1.activeFeature)(recordOf(tasks, 't-missing'))).toBeNull();
    (0, testing_1.expect)((0, families_1.activeFeature)(recordOf(tasks))).toBeNull();
});
(0, testing_1.test)('filing offers the active feature, then the current task or its feature, then open features', function () {
    var _a = family(), menu = _a.menu, keys = _a.keys, tasks = _a.tasks;
    var shell = (0, helpers_1.makeTask)({ title: 'Shell', created: at(10) });
    var child = (0, helpers_1.makeTask)({ title: 'Shell child', parentId: shell.id });
    var login = (0, helpers_1.makeTask)({ title: 'Login', state: 'current' });
    var lone = (0, helpers_1.makeTask)({ title: 'Lone' });
    (0, testing_1.expect)((0, families_1.filingCandidates)(recordOf(__spreadArray(__spreadArray([], tasks, true), [shell, child, login, lone], false), shell.id)).map(function (t) { return t.title; })).toEqual([
        'Shell',
        'Login',
        'Menu parity',
    ]);
    // A current task under a feature offers the feature.
    var nowKeys = tasks.map(function (t) { return (t.id === keys.id ? __assign(__assign({}, t), { state: 'current' }) : t); });
    (0, testing_1.expect)((0, families_1.filingCandidates)(recordOf(nowKeys)).map(function (t) { return t.title; })).toEqual(['Menu parity']);
    (0, testing_1.expect)((0, families_1.filingCandidates)(recordOf([lone]))).toEqual([]);
});
(0, testing_1.test)('a message names a task by its id or its whole title of two words or more', function () {
    var _a = family(), menu = _a.menu, keys = _a.keys, tasks = _a.tasks;
    var ui = (0, helpers_1.makeTask)({ title: 'UI' });
    var all = __spreadArray(__spreadArray([], tasks, true), [ui], false);
    (0, testing_1.expect)((0, families_1.namedTasks)('add arrows for the menu parity work', all).map(function (t) { return t.id; })).toEqual([menu.id]);
    (0, testing_1.expect)((0, families_1.namedTasks)("part of ".concat(menu.id, ": arrows"), all).map(function (t) { return t.id; })).toEqual([menu.id]);
    // One-word titles and tasks under a feature are not named.
    (0, testing_1.expect)((0, families_1.namedTasks)('polish the UI keys hint', all)).toEqual([]);
    (0, testing_1.expect)((0, families_1.namedTasks)('menu parity-ish', all).map(function (t) { return t.id; })).toEqual([menu.id]);
    (0, testing_1.expect)((0, families_1.namedTasks)('menus parity', all)).toEqual([]);
    (0, testing_1.expect)(keys.parentId).toBe(menu.id);
});
(0, testing_1.test)('guessParent: nothing to offer files it on its own, with no question', function () {
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf([(0, helpers_1.makeTask)()]), 'add dark mode', 'none')).toBeNull();
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf([]), 'add dark mode', null)).toBeNull();
});
(0, testing_1.test)('guessParent: a feature the message names is picked; two named, and Rohan is asked between them', function () {
    var _a = family(), menu = _a.menu, tasks = _a.tasks;
    var shell = (0, helpers_1.makeTask)({ title: 'Shell rewrite' });
    var all = __spreadArray(__spreadArray([], tasks, true), [shell], false);
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all), 'arrows for menu parity', 'none')).toEqual({
        parent: { kind: 'task', id: menu.id },
        choices: [menu.id],
    });
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all), 'menu parity needs the shell rewrite first', undefined)).toEqual({
        parent: null,
        choices: [menu.id, shell.id],
    });
});
(0, testing_1.test)('guessParent: the check’s pick is suggested; none files it on its own, even with a feature active', function () {
    var _a, _b;
    var _c = family(), menu = _c.menu, tasks = _c.tasks;
    var login = (0, helpers_1.makeTask)({ title: 'Login', state: 'current' });
    var all = __spreadArray(__spreadArray([], tasks, true), [login], false);
    (0, testing_1.expect)((_a = (0, families_1.guessParent)(recordOf(all, menu.id), 'arrow keys', menu.id)) === null || _a === void 0 ? void 0 : _a.parent).toEqual({ kind: 'task', id: menu.id });
    (0, testing_1.expect)((_b = (0, families_1.guessParent)(recordOf(all), 'arrow keys', login.id)) === null || _b === void 0 ? void 0 : _b.parent).toEqual({ kind: 'task', id: login.id });
    // Unrelated work: on its own, the active feature still offered.
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all, menu.id), 'fix the CI cache', 'none')).toEqual({
        parent: { kind: 'none' },
        choices: [menu.id, login.id],
    });
});
(0, testing_1.test)('guessParent: unsure, or no sign with a feature active, asks; never the feature by default', function () {
    var _a, _b, _c, _d, _e, _f;
    var _g = family(), menu = _g.menu, tasks = _g.tasks;
    var login = (0, helpers_1.makeTask)({ title: 'Login', state: 'current' });
    var all = __spreadArray(__spreadArray([], tasks, true), [login], false);
    (0, testing_1.expect)((_a = (0, families_1.guessParent)(recordOf(all), 'tidy up', 'unsure')) === null || _a === void 0 ? void 0 : _a.parent).toBeNull();
    // A feature active: no answer, no check, or a feature the check made up all ask.
    (0, testing_1.expect)((_b = (0, families_1.guessParent)(recordOf(all, menu.id), 'tidy up', undefined)) === null || _b === void 0 ? void 0 : _b.parent).toBeNull();
    (0, testing_1.expect)((_c = (0, families_1.guessParent)(recordOf(all, menu.id), 'tidy up', null)) === null || _c === void 0 ? void 0 : _c.parent).toBeNull();
    (0, testing_1.expect)((_d = (0, families_1.guessParent)(recordOf(all, menu.id), 'tidy up', 't-made-up')) === null || _d === void 0 ? void 0 : _d.parent).toBeNull();
    // No feature active: no sign files it on its own.
    (0, testing_1.expect)((_e = (0, families_1.guessParent)(recordOf(all), 'tidy up', undefined)) === null || _e === void 0 ? void 0 : _e.parent).toEqual({ kind: 'none' });
    (0, testing_1.expect)((_f = (0, families_1.guessParent)(recordOf(all), 'tidy up', null)) === null || _f === void 0 ? void 0 : _f.parent).toEqual({ kind: 'none' });
});
(0, testing_1.test)('guessParent: a task on its own can take the first piece of it, when the check ties the work to it', function () {
    var insole = (0, helpers_1.makeTask)({ title: 'Finish Insole Bridge', created: at(1) });
    var docs = (0, helpers_1.makeTask)({ title: 'Fix the documentation', created: at(5) });
    var old = (0, helpers_1.makeTask)({ title: 'Old docs pass', state: 'done', created: at(6) });
    var all = [insole, docs, old];
    var homepage = 'the parts on the home page should not be on the home page';
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all), homepage, docs.id)).toEqual({ parent: { kind: 'task', id: docs.id }, choices: [docs.id] });
    // Unrelated work, or no answer: on its own, with no question, as before.
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all), 'add a battery alert', 'none')).toBeNull();
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all), 'add a battery alert', undefined)).toBeNull();
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all), 'add a battery alert', 't-made-up')).toBeNull();
    // The check can't tell: Rohan is asked, offered the tasks it was shown.
    (0, testing_1.expect)((0, families_1.guessParent)(recordOf(all), homepage, 'unsure')).toEqual({ parent: null, choices: [docs.id, insole.id] });
});
(0, testing_1.test)('loneTasks: the newest five open tasks on their own, without features, the current task or tasks under one', function () {
    var tasks = family().tasks;
    var login = (0, helpers_1.makeTask)({ title: 'Login', state: 'current', created: at(9) });
    var many = [10, 11, 12, 13, 14, 15].map(function (m) { return (0, helpers_1.makeTask)({ title: "Task ".concat(m), created: at(m) }); });
    (0, testing_1.expect)((0, families_1.loneTasks)(recordOf(__spreadArray(__spreadArray(__spreadArray([], tasks, true), [login], false), many, true))).map(function (t) { return t.title; })).toEqual([
        'Task 15',
        'Task 14',
        'Task 13',
        'Task 12',
        'Task 11',
    ]);
    (0, testing_1.expect)((0, families_1.loneTasks)(recordOf(tasks))).toEqual([]);
});
(0, testing_1.test)('the check is shown the tasks on their own too, apart from the features', function () {
    var menu = family().menu;
    var docs = (0, helpers_1.makeTask)({ title: 'Fix the documentation' });
    var alone = (0, check_prompt_1.checkPrompt)(null, [docs], 'x', [], null, [docs]);
    (0, testing_1.expect)(alone).toContain('"parent":"<feature id>|none|unsure"');
    (0, testing_1.expect)(alone).toContain("Tasks on their own: ".concat(docs.id, " \"Fix the documentation\"."));
    (0, testing_1.expect)(alone).not.toContain('Features:');
    var both = (0, check_prompt_1.checkPrompt)(null, [docs], 'x', [menu], null, [docs]);
    (0, testing_1.expect)(both).toContain("Features: ".concat(menu.id, " \"Menu parity\"."));
    (0, testing_1.expect)(both).toContain("Tasks on their own: ".concat(docs.id, " \"Fix the documentation\"."));
});
(0, testing_1.test)('the check is told the features only when there are some, and reads its parent answer', function () {
    var menu = family().menu;
    (0, testing_1.expect)((0, check_prompt_1.checkPrompt)(null, [], 'x')).not.toContain('parent');
    var prompt = (0, check_prompt_1.checkPrompt)(null, [], 'x', [menu], menu.id);
    (0, testing_1.expect)(prompt).toContain('"parent":"<feature id>|none|unsure"');
    (0, testing_1.expect)(prompt).toContain("Features: ".concat(menu.id, " \"Menu parity\" (active)."));
    (0, testing_1.expect)(prompt).toContain('never just because it is active or current');
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)("{\"kind\":\"new\",\"intent\":\"improving\",\"title\":\"Arrows\",\"parent\":\"".concat(menu.id, "\"}"))).toEqual({
        kind: 'new',
        intent: 'improving',
        title: 'Arrows',
        difficulty: 'medium',
        parent: menu.id,
    });
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{"kind":"new","intent":"improving","title":"Arrows","parent":""}')).toEqual({
        kind: 'new',
        intent: 'improving',
        title: 'Arrows',
        difficulty: 'medium',
    });
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{"kind":"same","intent":"improving","parent":"none"}')).toEqual({ kind: 'same', intent: 'improving' });
});
(0, testing_1.test)('the backlog groups a feature’s tasks where its first task stands, keeping the order', function () {
    var lone = (0, helpers_1.makeTask)({ title: 'Lone', priority: 'urgent', created: at(1) });
    var menu = (0, helpers_1.makeTask)({ title: 'Menu parity', priority: 'mid', created: at(2) });
    var keys = (0, helpers_1.makeTask)({ title: 'Keys hint', priority: 'high', parentId: menu.id, created: at(3) });
    var docs = (0, helpers_1.makeTask)({ title: 'Docs', priority: 'low', parentId: menu.id, created: at(4) });
    var typo = (0, helpers_1.makeTask)({ title: 'Typo', priority: 'okay', created: at(5) });
    var tasks = [lone, menu, keys, docs, typo];
    var ranked = (0, ranking_1.rankBacklog)({ tasks: tasks, playNext: null }, null);
    (0, testing_1.expect)(ranked.map(function (r) { return r.task.title; })).toEqual(['Lone', 'Keys hint', 'Menu parity', 'Typo', 'Docs']);
    var _a = (0, families_1.groupBacklog)(ranked, (0, ranking_1.blockedTasks)(tasks), tasks), ready = _a.ready, blocked = _a.blocked;
    (0, testing_1.expect)(ready.map(function (e) { return (e.kind === 'group' ? "\u25C6 ".concat(e.group.parent.title) : e.kind === 'task' ? e.row.task.title : ''); })).toEqual([
        'Lone',
        '◆ Menu parity',
        'Typo',
    ]);
    var group = ready[1];
    (0, testing_1.expect)((group === null || group === void 0 ? void 0 : group.kind) === 'group' ? group.group.rows.map(function (r) { return r.task.title; }) : []).toEqual(['Keys hint', 'Menu parity', 'Docs']);
    (0, testing_1.expect)((group === null || group === void 0 ? void 0 : group.kind) === 'group' ? group.group.hasStar : true).toBe(false);
    (0, testing_1.expect)(blocked).toEqual([]);
});
(0, testing_1.test)('the ★ inside a feature marks the feature; a feature with nothing that can start stands among the blocked', function () {
    var _a, _b, _c;
    var _d = family(), menu = _d.menu, keys = _d.keys, docs = _d.docs, tasks = _d.tasks;
    var stuck = (0, helpers_1.makeTask)({ title: 'Stuck', blockedReason: 'no key', created: at(5) });
    var lone = (0, helpers_1.makeTask)({ title: 'Lone', priority: 'low', created: at(6) });
    var all = __spreadArray(__spreadArray([], tasks.map(function (t) { return (t.id === keys.id ? __assign(__assign({}, t), { priority: 'urgent' }) : t); }), true), [stuck, lone], false);
    var ranked = (0, ranking_1.rankBacklog)({ tasks: all, playNext: null }, null);
    var _e = (0, families_1.groupBacklog)(ranked, (0, ranking_1.blockedTasks)(all), all), ready = _e.ready, blocked = _e.blocked;
    (0, testing_1.expect)((_a = ranked[0]) === null || _a === void 0 ? void 0 : _a.task.id).toBe(keys.id);
    (0, testing_1.expect)(((_b = ready[0]) === null || _b === void 0 ? void 0 : _b.kind) === 'group' && ready[0].group.hasStar).toBe(true);
    // The blocked task under the feature goes with its feature, not to Blocked.
    (0, testing_1.expect)(((_c = ready[0]) === null || _c === void 0 ? void 0 : _c.kind) === 'group' ? ready[0].group.blocked.map(function (t) { return t.id; }) : []).toEqual([docs.id]);
    (0, testing_1.expect)(blocked.map(function (e) { return (e.kind === 'blocked' ? e.task.title : ''); })).toEqual(['Stuck']);
    // Everything under another feature blocked: the feature stands among the blocked.
    var shell = (0, helpers_1.makeTask)({ title: 'Shell', state: 'current', created: at(7) });
    var waits = (0, helpers_1.makeTask)({ title: 'Shell waits', parentId: shell.id, blockedReason: 'later', created: at(8) });
    var both = __spreadArray(__spreadArray([], all, true), [shell, waits], false);
    var regrouped = (0, families_1.groupBacklog)((0, ranking_1.rankBacklog)({ tasks: both, playNext: null }, null), (0, ranking_1.blockedTasks)(both), both);
    (0, testing_1.expect)(regrouped.blocked.map(function (e) { return (e.kind === 'group' ? "\u25C6 ".concat(e.group.parent.title) : e.kind === 'blocked' ? e.task.title : ''); })).toEqual([
        'Stuck',
        '◆ Shell',
    ]);
    (0, testing_1.expect)(ready.some(function (e) { return e.kind === 'group' && e.group.parent.id === menu.id; })).toBe(true);
});
(0, testing_1.test)('a feature comes after its own tasks of the same priority, but priority still comes first', function () {
    var menu = (0, helpers_1.makeTask)({ title: 'Menu parity', priority: 'mid', created: at(1) });
    var keys = (0, helpers_1.makeTask)({ title: 'Keys hint', priority: 'mid', parentId: menu.id, created: at(2) });
    var urgentFeature = (0, helpers_1.makeTask)({ title: 'Outage', priority: 'urgent', created: at(3) });
    var fix = (0, helpers_1.makeTask)({ title: 'Fix', priority: 'mid', parentId: urgentFeature.id, created: at(4) });
    (0, testing_1.expect)((0, ranking_1.rankBacklog)({ tasks: [menu, keys], playNext: null }, null).map(function (r) { return r.task.title; })).toEqual(['Keys hint', 'Menu parity']);
    (0, testing_1.expect)((0, ranking_1.rankBacklog)({ tasks: [menu, keys, urgentFeature, fix], playNext: null }, null).map(function (r) { return r.task.title; })).toEqual([
        'Outage',
        'Keys hint',
        'Fix',
        'Menu parity',
    ]);
    // Without features, the order is as it was: oldest first.
    var a = (0, helpers_1.makeTask)({ title: 'A', created: at(1) });
    var b = (0, helpers_1.makeTask)({ title: 'B', created: at(2) });
    (0, testing_1.expect)((0, ranking_1.rankBacklog)({ tasks: [b, a], playNext: null }, null).map(function (r) { return r.task.title; })).toEqual(['A', 'B']);
});
(0, testing_1.test)('removing a feature leaves its tasks on their own', function () {
    var _a, _b;
    var _c = family(), menu = _c.menu, keys = _c.keys, tasks = _c.tasks;
    var after = (0, queue_rules_1.removeTask)(tasks, menu.id);
    (0, testing_1.expect)((_a = after.find(function (t) { return t.id === menu.id; })) === null || _a === void 0 ? void 0 : _a.state).toBe('removed');
    (0, testing_1.expect)((_b = after.find(function (t) { return t.id === keys.id; })) === null || _b === void 0 ? void 0 : _b.parentId).toBeNull();
    // A task that can't be removed changes nothing.
    var current = (0, helpers_1.makeTask)({ state: 'current' });
    (0, testing_1.expect)((0, queue_rules_1.removeTask)([current, keys], current.id)).toEqual([current, keys]);
});
(0, testing_1.test)('a new task is on its own unless given a parent', function () {
    var base = { title: 'X', priority: 'mid', difficulty: 'light', messages: [], now: at(0), id: 't-1' };
    (0, testing_1.expect)((0, queue_rules_1.newTask)(base).parentId).toBeNull();
    (0, testing_1.expect)((0, queue_rules_1.newTask)(__assign(__assign({}, base), { parentId: 't-0' })).parentId).toBe('t-0');
});
(0, testing_1.test)('a record from before features loads: no parent, no feature, every field kept', function () {
    var old = (0, helpers_1.makeTask)({ title: 'Old', branch: 'task/old', blockedBy: ['t-x'] });
    delete old.parentId;
    var text = JSON.stringify({ version: 1, project: { name: 'p', path: '/p' }, docsLogPath: null, playNext: null, tasks: [old], unassignedMinutesByDay: {} });
    var read = (0, record_source_1.parseRecord)(text);
    (0, testing_1.expect)(read === 'unreadable').toBe(false);
    if (read === 'unreadable')
        return;
    (0, testing_1.expect)(read.feature).toBeNull();
    (0, testing_1.expect)(read.tasks[0]).toEqual(__assign(__assign({}, old), { parentId: null }));
});
(0, testing_1.test)('a task saved without an id gets one from its creation and title, the same at every read', function () {
    var bare = (0, helpers_1.makeTask)({ title: 'No id', created: at(7) });
    delete bare.id;
    var text = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [bare, (0, helpers_1.makeTask)({ title: 'Has id' })] }));
    var first = (0, record_source_1.parseRecord)(text);
    var second = (0, record_source_1.parseRecord)(text);
    var idOf = function (r) { return (r === 'unreadable' ? null : r.tasks[0].id); };
    (0, testing_1.expect)(idOf(first)).toMatch(/^t-[0-9a-f]{8}$/);
    (0, testing_1.expect)(idOf(first)).toBe(idOf(second));
});
(0, testing_1.test)('parent and feature survive a write and a read', function () {
    var _a = family(), menu = _a.menu, tasks = _a.tasks;
    var read = (0, record_source_1.parseRecord)(JSON.stringify(recordOf(tasks, menu.id)));
    (0, testing_1.expect)(read === 'unreadable' ? null : [read.feature, read.tasks.map(function (t) { return t.parentId; })]).toEqual([
        menu.id,
        [null, menu.id, menu.id, menu.id],
    ]);
});
