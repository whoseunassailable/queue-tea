"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markFor = exports.grouped = exports.sum = exports.total = exports.capital = exports.PRIORITY_COLOR = void 0;
exports.PRIORITY_COLOR = {
    urgent: 'error',
    high: 'warning',
    mid: 'suggestion',
    okay: 'success',
    low: 'inactive',
};
var capital = function (word) { return word.charAt(0).toUpperCase() + word.slice(1); };
exports.capital = capital;
var total = function (byDay) { return Object.values(byDay).reduce(function (a, b) { return a + b; }, 0); };
exports.total = total;
var sum = function (minutes) { return minutes.reduce(function (a, b) { return a + b; }, 0); };
exports.sum = sum;
var grouped = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
exports.grouped = grouped;
// A handoff line's mark, from its section: a step still to do, one done, or
// a plain point.
var markFor = function (heading) {
    return /next|left|to do|todo|remaining/i.test(heading) ? '☐' : /changed|changes|done/i.test(heading) ? '✓' : '•';
};
exports.markFor = markFor;
