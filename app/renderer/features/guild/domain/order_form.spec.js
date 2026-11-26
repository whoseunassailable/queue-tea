"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var engine_api_1 = require("../../../../shared/engine_api");
var en_1 = require("../../../l10n/en");
var order_form_1 = require("./order_form");
(0, vitest_1.describe)('the order box', function () {
    (0, vitest_1.it)('needs an order', function () {
        (0, vitest_1.expect)((0, order_form_1.orderError)('')).toBe('Order is required.');
        (0, vitest_1.expect)((0, order_form_1.orderError)('  \n ')).toBe(en_1.t.guild.orderRequired);
    });
    (0, vitest_1.it)('takes an order of exactly the longest length, spaces around it aside', function () {
        (0, vitest_1.expect)((0, order_form_1.orderError)("  ".concat('x'.repeat(engine_api_1.HELPER_ORDER_CHARS), "\n"))).toBeUndefined();
    });
    (0, vitest_1.it)('refuses one character past the longest', function () {
        (0, vitest_1.expect)((0, order_form_1.orderError)('x'.repeat(engine_api_1.HELPER_ORDER_CHARS + 1))).toBe(en_1.t.guild.orderLong(engine_api_1.HELPER_ORDER_CHARS));
    });
});
(0, vitest_1.describe)('where the helper works', function () {
    (0, vitest_1.it)('names the last folder of the path, even with a slash at the end', function () {
        (0, vitest_1.expect)((0, order_form_1.folderName)('/Users/rohan/demo')).toBe('demo');
        (0, vitest_1.expect)((0, order_form_1.folderName)('/Users/rohan/demo-wt/')).toBe('demo-wt');
        (0, vitest_1.expect)((0, order_form_1.folderName)('/')).toBe('/');
    });
});
