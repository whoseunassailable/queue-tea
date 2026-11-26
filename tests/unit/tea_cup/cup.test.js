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
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var cup_mood_1 = require("../../../hooks/features/tea_cup/domain/services/cup_mood");
var helpers_1 = require("../../helpers");
var NOW = Date.parse('2026-10-21T07:12:00Z');
var MOODS = ['idle', 'working', 'attention', 'done'];
var facts = function (tasks, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ load: 'ready', record: __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks }), band: { kind: 'none' }, isAskingDone: false, hold: null, mismatch: null, canContinue: false, warning: null, isChecking: false, busy: null, isTurnRunning: false, budget: null, now: NOW }, over));
};
(0, testing_1.test)('idle: nothing queued, or the ★ task waiting', function () {
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([]))).toEqual({ mood: 'idle', line: 'Nothing queued', view: 'menu' });
    var tasks = [(0, helpers_1.makeTask)({ title: 'Later', priority: 'low' }), (0, helpers_1.makeTask)({ title: 'Soon', priority: 'urgent' })];
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts(tasks))).toEqual({ mood: 'idle', line: '2 waiting · ★ Soon', view: 'backlog' });
});
(0, testing_1.test)('idle: the ★ is the backlog’s suggestion, with Play next and the time Rohan has', function () {
    var later = (0, helpers_1.makeTask)({ title: 'Later', priority: 'low', difficulty: { expected: 'light', actual: null } });
    var soon = (0, helpers_1.makeTask)({ title: 'Soon', priority: 'urgent', difficulty: { expected: 'hard', actual: null } });
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [later, soon] });
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { record: __assign(__assign({}, record), { playNext: later.id }) })).line).toBe('2 waiting · ★ Later');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { record: record, budget: 30 })).line).toBe('2 waiting · ★ Later');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([(0, helpers_1.makeTask)({ title: 'Wait', blockedReason: 'later' })]))).toEqual({
        mood: 'idle',
        line: '1 waiting · all blocked',
        view: 'backlog',
    });
});
(0, testing_1.test)('working: a current task, the message check, work under way, or a turn outside the queue', function () {
    var now = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current', minutesByDay: { '2026-10-21': 42 } });
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([now]))).toEqual({ mood: 'working', line: 'Fix login · 42m', view: 'current' });
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { isChecking: true })).line).toBe('Checking your message…');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([now], { busy: 'Saving a handoff note…' })).line).toBe('Saving a handoff note…');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { isTurnRunning: true }))).toEqual({ mood: 'working', line: 'Brewing outside the queue', view: 'menu' });
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { load: 'loading' })).mood).toBe('working');
});
(0, testing_1.test)('attention: whatever waits on Rohan comes before the work', function () {
    var now = (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current' });
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([now], { isAskingDone: true }))).toEqual({
        mood: 'attention',
        line: 'Is this done for now? Fix login',
        view: 'current',
    });
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([now], { canContinue: true })).line).toBe('Ready to continue: Fix login');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([now], { hold: { text: '3 files not committed' } })).line).toBe('3 files not committed');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([now], { mismatch: "You're on main; this task is on task/fix" })).view).toBe('current');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { warning: 'During the last turn a commit appeared: abc' })).mood).toBe('attention');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { band: { kind: 'unsure', text: 'hmm', intent: 'improving', didCheckRun: true } })).mood).toBe('attention');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([], { load: 'failed' })).line).toBe("Couldn't read your task record");
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([now], { isChecking: true, isAskingDone: true })).mood).toBe('attention');
});
(0, testing_1.test)('done: a task finished in the last 15 minutes, and none started since', function () {
    var finished = function (msAgo) {
        return (0, helpers_1.makeTask)({ title: 'Dark mode', state: 'done', finished: new Date(NOW - msAgo).toISOString() });
    };
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([finished(5 * 60000)]))).toEqual({ mood: 'done', line: 'Finished: Dark mode', view: 'history' });
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([finished(cup_mood_1.DONE_FOR_MS + 1)])).mood).toBe('idle');
    (0, testing_1.expect)((0, cup_mood_1.cupOf)(facts([finished(60000), (0, helpers_1.makeTask)({ state: 'current' })])).mood).toBe('working');
});
(0, testing_1.test)('every frame of every mood is the cup’s size, one column per glyph', function () {
    for (var _i = 0, MOODS_1 = MOODS; _i < MOODS_1.length; _i++) {
        var mood = MOODS_1[_i];
        var art = (0, cup_mood_1.cupArt)(mood);
        for (var _a = 0, _b = __spreadArray(__spreadArray([], art.frames, true), [art.wink], false); _a < _b.length; _a++) {
            var frame = _b[_a];
            var rows = (0, cup_mood_1.frameText)(frame);
            (0, testing_1.expect)(rows.length).toBe(cup_mood_1.CUP_ROWS);
            for (var _c = 0, rows_1 = rows; _c < rows_1.length; _c++) {
                var row = rows_1[_c];
                (0, testing_1.expect)(__spreadArray([], row, true).length).toBe(cup_mood_1.CUP_COLUMNS);
            }
        }
    }
});
(0, testing_1.test)('each mood has its own face, the steam moves, and the wink is the pointer’s', function () {
    var faces = MOODS.map(function (mood) { return (0, cup_mood_1.frameText)((0, cup_mood_1.cupArt)(mood).frames[0])[2]; });
    (0, testing_1.expect)(new Set(faces).size).toBe(4);
    (0, testing_1.expect)(faces[1]).toContain('•ω•');
    var working = (0, cup_mood_1.cupArt)('working');
    (0, testing_1.expect)(new Set(working.frames.map(function (f) { return (0, cup_mood_1.frameText)(f)[0]; })).size).toBeGreaterThan(1);
    (0, testing_1.expect)((0, cup_mood_1.frameText)(working.wink)[2]).toContain('•ω-');
    (0, testing_1.expect)((0, cup_mood_1.frameText)((0, cup_mood_1.cupArt)('attention').frames[0])[0]).toContain('!');
});
