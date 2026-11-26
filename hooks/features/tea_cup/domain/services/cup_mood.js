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
exports.frameText = exports.cupArt = exports.cupOf = exports.CUP_ROWS = exports.CUP_COLUMNS = exports.DONE_FOR_MS = void 0;
var ranking_1 = require("../../../../shared/backlog/domain/services/ranking");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var time_1 = require("../../../../shared/time/domain/services/time");
// How long a finished task keeps the cup pleased.
exports.DONE_FOR_MS = 15 * 60000;
exports.CUP_COLUMNS = 11;
exports.CUP_ROWS = 3;
var minutesOf = function (task) { return Object.values(task.minutesByDay).reduce(function (a, b) { return a + b; }, 0); };
var lastFinished = function (tasks) {
    return tasks
        .filter(function (t) { return t.state === 'done' && t.finished !== null; })
        .reduce(function (last, t) { return (last === null || Date.parse(t.finished) > Date.parse(last.finished) ? t : last); }, null);
};
// Something waiting on Rohan first, then work going on, then a task just
// finished; idle otherwise.
var cupOf = function (f) {
    var _a, _b;
    var tasks = (_b = (_a = f.record) === null || _a === void 0 ? void 0 : _a.tasks) !== null && _b !== void 0 ? _b : [];
    var current = (0, queue_rules_1.currentTask)(tasks, f.place);
    if (f.load === 'failed')
        return { mood: 'attention', line: "Couldn't read your task record", view: 'menu' };
    if (f.band.kind !== 'none')
        return { mood: 'attention', line: 'Waiting for your answer', view: 'menu' };
    if (f.isAskingDone && current !== null) {
        return { mood: 'attention', line: "Is this done for now? ".concat(current.title), view: 'current' };
    }
    if (f.hold !== null)
        return { mood: 'attention', line: f.hold.text, view: 'current' };
    if (f.mismatch !== null)
        return { mood: 'attention', line: f.mismatch, view: 'current' };
    if (f.warning !== null)
        return { mood: 'attention', line: f.warning, view: 'current' };
    if (f.canContinue && current !== null) {
        return { mood: 'attention', line: "Ready to continue: ".concat(current.title), view: 'current' };
    }
    if (f.isChecking)
        return { mood: 'working', line: 'Checking your message…', view: 'menu' };
    if (f.busy !== null)
        return { mood: 'working', line: f.busy, view: 'current' };
    if (f.load === 'loading')
        return { mood: 'working', line: 'Reading your queue…', view: 'menu' };
    if (current !== null) {
        return { mood: 'working', line: "".concat(current.title, " \u00B7 ").concat((0, time_1.formatMinutes)(minutesOf(current))), view: 'current' };
    }
    if (f.isTurnRunning)
        return { mood: 'working', line: 'Brewing outside the queue', view: 'menu' };
    var last = lastFinished(tasks);
    if (last !== null && f.now - Date.parse(last.finished) < exports.DONE_FOR_MS) {
        return { mood: 'done', line: "Finished: ".concat(last.title), view: 'history' };
    }
    var waiting = tasks.filter(function (t) { return t.state === 'queued'; }).length;
    var next = f.record === null ? null : (0, ranking_1.suggest)(f.record, f.budget);
    return waiting === 0
        ? { mood: 'idle', line: 'Nothing queued', view: 'menu' }
        : { mood: 'idle', line: "".concat(waiting, " waiting \u00B7 ").concat(next === null ? 'all blocked' : "\u2605 ".concat(next.title)), view: 'backlog' };
};
exports.cupOf = cupOf;
// The cup in the reference picture: cream, amber tea, a sage tea-bag tag, a
// face with pink cheeks. Every glyph is one column wide, so any terminal
// lays it out the same.
var CREAM = '#F1DCB2';
var CLAY = '#CFAE7B';
var TEA = '#C8782F';
var INK = '#3A2A20';
var PINK = '#EE9A9A';
var SAGE = '#8DB596';
var STEAM = '#B9A88C';
var ALERT = '#E8A13A';
var STAR = '#E9C46A';
var FACE = { idle: '-ω-', working: '•ω•', attention: '•o•', done: '^ω^' };
var BLINK = '-ω-';
var WINK = '•ω-';
// The rim: tea in a cream cup, its corners rounded by half blocks.
var RIM = [
    { text: ' ' },
    { text: '▄', color: CREAM },
    { text: '▀'.repeat(7), color: TEA, backgroundColor: CREAM },
    { text: '▄', color: CREAM },
    { text: ' ' },
];
// The body: the tag on the left, the face between pink cheeks, its bottom
// corners rounded by half blocks, and the handle in a deeper tone, so it
// shows on a light terminal too.
var body = function (face) { return [
    { text: '▐', color: SAGE },
    { text: '▀', color: CREAM },
    { text: ' ', backgroundColor: CREAM },
    { text: '▄', color: PINK, backgroundColor: CREAM },
    { text: face, color: INK, backgroundColor: CREAM, bold: true },
    { text: '▄', color: PINK, backgroundColor: CREAM },
    { text: ' ', backgroundColor: CREAM },
    { text: '▀', color: CREAM },
    { text: ')', color: CLAY, bold: true },
]; };
// What rises from the cup: steam while it brews, z's while it waits, a
// blinking ! when it needs Rohan, twinkles when a task is done.
var AIR = {
    working: { rows: ['   ) ( )   ', '   ( ) (   ', '   ) ) (   ', '   ( ( )   '], color: STEAM, ms: 500 },
    idle: { rows: ['      z    ', '       z   ', '        Z  ', '           '], color: STEAM, ms: 1000 },
    attention: { rows: ['     !     ', '           '], color: ALERT, bold: true, ms: 500 },
    done: { rows: ['  ✧   ·    ', '  ·   ✧    ', '      ·  ✧ ', '  ✧      · '], color: STAR, ms: 750 },
};
var frame = function (mood, air, face) {
    var _a = AIR[mood], color = _a.color, bold = _a.bold;
    return [[bold === true ? { text: air, color: color, bold: bold } : { text: air, color: color }], RIM, body(face)];
};
var cupArt = function (mood) {
    var _a = AIR[mood], rows = _a.rows, ms = _a.ms;
    var frames = rows.map(function (air) { return frame(mood, air, FACE[mood]); });
    // While it brews, a blink every second round of the steam.
    var blinks = mood === 'working' ? rows.map(function (air, i) { return frame(mood, air, i === 2 ? BLINK : FACE[mood]); }) : [];
    return { frames: __spreadArray(__spreadArray([], frames, true), blinks, true), wink: frame(mood, rows[0], WINK), ms: ms };
};
exports.cupArt = cupArt;
// The text a frame shows, row by row, for a still cup and for tests.
var frameText = function (f) { return f.map(function (row) { return row.map(function (seg) { return seg.text; }).join(''); }); };
exports.frameText = frameText;
