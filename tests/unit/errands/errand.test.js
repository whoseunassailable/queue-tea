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
var testing_1 = require("claude-code/testing");
var errands_1 = require("../../../hooks/features/errands/domain/services/errands");
var helpers_1 = require("../../helpers");
var BREW = { kind: 'brew', text: 'start the dev server', isRunning: false };
(0, testing_1.test)('the /brew note keeps the current task and asks for the work, checked', function () {
    var note = (0, errands_1.errandNote)('brew', (0, helpers_1.makeTask)({ title: 'Fix login', state: 'current' }));
    (0, testing_1.expect)(note).toContain('Rohan ran /brew; the request is the next message.');
    (0, testing_1.expect)(note).toContain('the current task "Fix login", its branch and the queue stay as they are');
    (0, testing_1.expect)(note).toContain("don't call task_looks_done");
    (0, testing_1.expect)(note).toContain('check it worked');
});
(0, testing_1.test)('with nothing current the note says nothing in the queue changes', function () {
    (0, testing_1.expect)((0, errands_1.errandNote)('brew', null)).toContain('no task is made and nothing in the queue changes');
});
(0, testing_1.test)('the /tea note asks for an answer that changes no files', function () {
    var note = (0, errands_1.errandNote)('tea', null);
    (0, testing_1.expect)(note).toContain('Rohan ran /tea; the question is the next message. Answer or explain it.');
    (0, testing_1.expect)(note).toContain('change no files');
});
(0, testing_1.test)('the usage line names what the command takes', function () {
    (0, testing_1.expect)((0, errands_1.errandUsage)('brew', 'brew')).toBe('Write what you want after the command: /brew <request>');
    (0, testing_1.expect)((0, errands_1.errandUsage)('queue-tea-tea', 'tea')).toBe('Write what you want after the command: /queue-tea-tea <question>');
});
(0, testing_1.test)('only words that start with / would run as a command', function () {
    (0, testing_1.expect)((0, errands_1.startsAsCommand)('/plan the menu')).toBe(true);
    (0, testing_1.expect)((0, errands_1.startsAsCommand)('/')).toBe(true);
    (0, testing_1.expect)((0, errands_1.startsAsCommand)('run /plan on the menu')).toBe(false);
    (0, testing_1.expect)((0, errands_1.startsAsCommand)('start the dev server')).toBe(false);
});
(0, testing_1.test)('only the main loop’s turn with the errand’s words is the errand', function () {
    (0, testing_1.expect)((0, errands_1.isErrandTurn)({ text: BREW.text }, BREW)).toBe(true);
    (0, testing_1.expect)((0, errands_1.isErrandTurn)({ text: BREW.text, agentId: 'a1' }, BREW)).toBe(false);
    (0, testing_1.expect)((0, errands_1.isErrandTurn)({ text: 'something else' }, BREW)).toBe(false);
    (0, testing_1.expect)((0, errands_1.isErrandTurn)({ text: BREW.text }, __assign(__assign({}, BREW), { isRunning: true }))).toBe(false);
    (0, testing_1.expect)((0, errands_1.isErrandTurn)({ text: BREW.text }, null)).toBe(false);
});
