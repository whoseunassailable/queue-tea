"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var sky_time_1 = require("./sky_time");
(0, vitest_1.describe)('the sky', function () {
    vitest_1.it.each([
        [4, 'night'],
        [5, 'morning'],
        [9, 'morning'],
        [10, 'day'],
        [16, 'day'],
        [17, 'evening'],
        [19, 'evening'],
        [20, 'night'],
        [0, 'night'],
    ])('at %i is %s', function (hour, sky) {
        (0, vitest_1.expect)((0, sky_time_1.skyAt)(hour)).toBe(sky);
    });
    (0, vitest_1.it)('follows the clock on auto and keeps a fixed choice otherwise', function () {
        (0, vitest_1.expect)((0, sky_time_1.skyOf)('auto', 12)).toBe('day');
        (0, vitest_1.expect)((0, sky_time_1.skyOf)('night', 12)).toBe('night');
    });
});
