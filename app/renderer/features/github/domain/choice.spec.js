"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var choice_1 = require("./choice");
var account = function (login) { return ({ login: login, isActive: false, isWorking: true }); };
var ready = function () {
    var logins = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        logins[_i] = arguments[_i];
    }
    return ({ status: 'ready', data: { kind: 'ready', accounts: logins.map(account) } });
};
var LOADING = { status: 'loading' };
var FAILED = { status: 'failed', message: 'no' };
var MISSING = { status: 'ready', data: { kind: 'missing' } };
(0, vitest_1.describe)('what is picked', function () {
    (0, vitest_1.it)('is the answer given', function () {
        (0, vitest_1.expect)((0, choice_1.pickedOf)(ready('a', 'b'), 'b')).toBe('b');
        (0, vitest_1.expect)((0, choice_1.pickedOf)(ready('a', 'b'), choice_1.NO_ACCOUNT)).toBe(choice_1.NO_ACCOUNT);
    });
    (0, vitest_1.it)('is the only account, unasked', function () {
        (0, vitest_1.expect)((0, choice_1.pickedOf)(ready('a'), null)).toBe('a');
    });
    (0, vitest_1.it)('is nothing with several to choose from', function () {
        (0, vitest_1.expect)((0, choice_1.pickedOf)(ready('a', 'b'), null)).toBeNull();
    });
    (0, vitest_1.it)('isn\'t an account gh no longer knows', function () {
        (0, vitest_1.expect)((0, choice_1.pickedOf)(ready('a', 'b'), 'gone')).toBeNull();
    });
    (0, vitest_1.it)('keeps No GitHub account over the only account', function () {
        (0, vitest_1.expect)((0, choice_1.pickedOf)(ready('a'), choice_1.NO_ACCOUNT)).toBe(choice_1.NO_ACCOUNT);
    });
});
(0, vitest_1.describe)('whether it needs an answer', function () {
    (0, vitest_1.it)('does with accounts to pick from', function () {
        (0, vitest_1.expect)((0, choice_1.needsAnswer)(ready('a', 'b'), null)).toBe(true);
    });
    (0, vitest_1.it)('does while they\'re still being read', function () {
        (0, vitest_1.expect)((0, choice_1.needsAnswer)(LOADING, null)).toBe(true);
    });
    (0, vitest_1.it)('doesn\'t once answered', function () {
        (0, vitest_1.expect)((0, choice_1.needsAnswer)(ready('a', 'b'), 'a')).toBe(false);
        (0, vitest_1.expect)((0, choice_1.needsAnswer)(ready('a', 'b'), choice_1.NO_ACCOUNT)).toBe(false);
    });
    (0, vitest_1.it)('doesn\'t with no answers to give', function () {
        (0, vitest_1.expect)((0, choice_1.needsAnswer)(ready(), null)).toBe(false);
        (0, vitest_1.expect)((0, choice_1.needsAnswer)(MISSING, null)).toBe(false);
        (0, vitest_1.expect)((0, choice_1.needsAnswer)(FAILED, null)).toBe(false);
    });
});
(0, vitest_1.describe)('an account gone from gh', function () {
    (0, vitest_1.it)('is gone only when gh has answered without it', function () {
        (0, vitest_1.expect)((0, choice_1.isGone)(ready('a'), 'gone')).toBe(true);
        (0, vitest_1.expect)((0, choice_1.isGone)(ready('a'), 'a')).toBe(false);
        (0, vitest_1.expect)((0, choice_1.isGone)(ready('a'), null)).toBe(false);
        (0, vitest_1.expect)((0, choice_1.isGone)(LOADING, 'gone')).toBe(false);
        (0, vitest_1.expect)((0, choice_1.isGone)(FAILED, 'gone')).toBe(false);
        (0, vitest_1.expect)((0, choice_1.isGone)(MISSING, 'gone')).toBe(false);
    });
});
(0, vitest_1.it)('knows when there are accounts', function () {
    (0, vitest_1.expect)((0, choice_1.hasAccounts)(ready('a'))).toBe(true);
    (0, vitest_1.expect)((0, choice_1.hasAccounts)(ready())).toBe(false);
    (0, vitest_1.expect)((0, choice_1.hasAccounts)(MISSING)).toBe(false);
});
