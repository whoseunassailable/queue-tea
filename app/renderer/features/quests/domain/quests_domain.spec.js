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
var vitest_1 = require("vitest");
var test_support_1 = require("../../../test_support");
var quest_keys_1 = require("../presentation/state_management/quest_keys");
var board_1 = require("./board");
var quest_form_1 = require("./quest_form");
var press = function (key, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ key: key, metaKey: false, ctrlKey: false, altKey: false }, over));
};
(0, vitest_1.describe)('the New quest form', function () {
    (0, vitest_1.it)('wants a title, in the field’s own words', function () {
        (0, vitest_1.expect)((0, quest_form_1.titleError)('   ')).toBe('Title is required.');
        (0, vitest_1.expect)((0, quest_form_1.titleError)('x'.repeat(201))).toBe('Title must be 200 characters or fewer.');
        (0, vitest_1.expect)((0, quest_form_1.titleError)('Fine')).toBe(undefined);
    });
    (0, vitest_1.it)('wants Part of answered when the answer was left open', function () {
        (0, vitest_1.expect)((0, quest_form_1.validateQuest)(__assign(__assign({}, (0, quest_form_1.emptyQuestForm)('unset')), { title: 'A' }))).toEqual({ part: 'Pick what it is part of first, or On its own.' });
        (0, vitest_1.expect)((0, quest_form_1.validateQuest)(__assign(__assign({}, (0, quest_form_1.emptyQuestForm)('none')), { title: 'A' }))).toEqual({});
    });
    (0, vitest_1.it)('wants a saga title only once New saga is picked', function () {
        (0, vitest_1.expect)((0, quest_form_1.validateQuest)(__assign(__assign({}, (0, quest_form_1.emptyQuestForm)('new')), { title: 'A' }))).toEqual({ sagaTitle: 'Saga title is required.' });
        (0, vitest_1.expect)((0, quest_form_1.validateQuest)(__assign(__assign({}, (0, quest_form_1.emptyQuestForm)('new')), { title: 'A', sagaTitle: 'S' }))).toEqual({});
    });
    (0, vitest_1.it)('turns the form into a quest', function () {
        var form = __assign(__assign({}, (0, quest_form_1.emptyQuestForm)('t-1')), { title: ' A ', description: ' Why ', criteria: 'One\n\n  Two  \n' });
        (0, vitest_1.expect)((0, quest_form_1.questOf)(form)).toEqual({ title: 'A', priority: 'mid', difficulty: 'medium', parent: { kind: 'task', id: 't-1' }, description: 'Why', criteria: ['One', 'Two'], helpers: ['tea-dd'] });
        (0, vitest_1.expect)((0, quest_form_1.questOf)(__assign(__assign({}, (0, quest_form_1.emptyQuestForm)('none')), { title: 'A' })).parent).toEqual({ kind: 'none' });
        (0, vitest_1.expect)((0, quest_form_1.questOf)(__assign(__assign({}, (0, quest_form_1.emptyQuestForm)('new')), { title: 'A', sagaTitle: ' S ' })).parent).toEqual({ kind: 'new', title: 'S' });
    });
});
(0, vitest_1.describe)('the Seal form', function () {
    (0, vitest_1.it)('wants a quest or a reason', function () {
        (0, vitest_1.expect)((0, quest_form_1.sealError)({ waitFor: null, reason: '  ' })).toBe('Pick a quest to wait for, or write a reason.');
        (0, vitest_1.expect)((0, quest_form_1.sealError)({ waitFor: 'x', reason: '' })).toBe(undefined);
        (0, vitest_1.expect)((0, quest_form_1.sealError)({ waitFor: null, reason: 'Later' })).toBe(undefined);
    });
    (0, vitest_1.it)('says which', function () {
        (0, vitest_1.expect)((0, quest_form_1.sealOf)({ waitFor: 'x', reason: '' })).toEqual({ waitFor: 'x' });
        (0, vitest_1.expect)((0, quest_form_1.sealOf)({ waitFor: null, reason: ' Later ' })).toEqual({ reason: 'Later' });
    });
});
(0, vitest_1.describe)('the board as rows', function () {
    var saga = {
        kind: 'saga',
        quest: (0, test_support_1.quest)({ id: 'saga' }),
        chapters: [(0, test_support_1.quest)({ id: 'star', title: 'Star', isStar: true, why: 'urgent' }), (0, test_support_1.quest)({ id: 'two' })],
        progress: { done: 0, total: 2, current: 0, blocked: 0 },
        hasStar: true,
    };
    (0, vitest_1.it)('puts chapters directly under their saga', function () {
        (0, vitest_1.expect)((0, board_1.rowsOf)([saga]).map(function (r) { return [r.quest.id, r.isChapter]; })).toEqual([
            ['saga', false],
            ['star', true],
            ['two', true],
        ]);
    });
    (0, vitest_1.it)('a folded saga hides its chapters and keeps the ★ on show', function () {
        var _a, _b;
        var rows = (0, board_1.rowsOf)([saga], ['saga']);
        (0, vitest_1.expect)(rows.map(function (r) { return r.quest.id; })).toEqual(['saga']);
        (0, vitest_1.expect)((_b = (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.foldedStar) === null || _b === void 0 ? void 0 : _b.title).toBe('Star');
    });
    (0, vitest_1.it)('opens the picked quest, else the ★, else the first', function () {
        var _a, _b, _c;
        var rows = (0, board_1.rowsOf)([saga]);
        (0, vitest_1.expect)((_a = (0, board_1.openRow)(rows, 'two')) === null || _a === void 0 ? void 0 : _a.quest.id).toBe('two');
        (0, vitest_1.expect)((_b = (0, board_1.openRow)(rows, undefined)) === null || _b === void 0 ? void 0 : _b.quest.id).toBe('star');
        (0, vitest_1.expect)((_c = (0, board_1.openRow)(rows, 'gone')) === null || _c === void 0 ? void 0 : _c.quest.id).toBe('star');
        (0, vitest_1.expect)((0, board_1.openRow)([], undefined)).toBe(null);
    });
    (0, vitest_1.it)('steps through the rows and stops at the ends', function () {
        var _a, _b, _c;
        var rows = (0, board_1.rowsOf)([saga]);
        (0, vitest_1.expect)((_a = (0, board_1.stepFrom)(rows, 'star', 1)) === null || _a === void 0 ? void 0 : _a.quest.id).toBe('two');
        (0, vitest_1.expect)((_b = (0, board_1.stepFrom)(rows, 'two', 1)) === null || _b === void 0 ? void 0 : _b.quest.id).toBe('two');
        (0, vitest_1.expect)((_c = (0, board_1.stepFrom)(rows, 'saga', -1)) === null || _c === void 0 ? void 0 : _c.quest.id).toBe('saga');
        (0, vitest_1.expect)((0, board_1.stepFrom)([], undefined, 1)).toBe(null);
    });
});
(0, vitest_1.describe)('the keys', function () {
    (0, vitest_1.it)('are the terminal’s letters', function () {
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('f'))).toEqual({ kind: 'playNext' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('k'))).toEqual({ kind: 'seal' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('u'))).toEqual({ kind: 'unseal' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('p'))).toEqual({ kind: 'partOf' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('a'))).toEqual({ kind: 'activeSaga' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('x'))).toEqual({ kind: 'remove' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('Backspace'))).toEqual({ kind: 'remove' });
    });
    (0, vitest_1.it)('1 to 5 set the priority, urgent to low', function () {
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('1'))).toEqual({ kind: 'priority', priority: 'urgent' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('5'))).toEqual({ kind: 'priority', priority: 'low' });
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('6'))).toBe(null);
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('0'))).toBe(null);
    });
    (0, vitest_1.it)('leave anything with ⌘ alone', function () {
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('k', { metaKey: true }))).toBe(null);
        (0, vitest_1.expect)((0, quest_keys_1.questKeyOf)(press('1', { ctrlKey: true }))).toBe(null);
    });
    (0, vitest_1.it)('know a text field when they are in one', function () {
        (0, vitest_1.expect)((0, quest_keys_1.isTyping)({ tagName: 'INPUT' })).toBe(true);
        (0, vitest_1.expect)((0, quest_keys_1.isTyping)({ tagName: 'TEXTAREA' })).toBe(true);
        (0, vitest_1.expect)((0, quest_keys_1.isTyping)({ tagName: 'BUTTON' })).toBe(false);
        (0, vitest_1.expect)((0, quest_keys_1.isTyping)(null)).toBe(false);
    });
});
