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
exports.redo = exports.undo = exports.commit = exports.historyOf = void 0;
var STEPS = 200;
var historyOf = function (scene) { return ({ past: [], present: scene, future: [] }); };
exports.historyOf = historyOf;
var commit = function (h, next) { return (next === h.present ? h : { past: __spreadArray(__spreadArray([], h.past, true), [h.present], false).slice(-STEPS), present: next, future: [] }); };
exports.commit = commit;
var undo = function (h) { return (h.past.length === 0 ? h : { past: h.past.slice(0, -1), present: h.past.at(-1), future: __spreadArray([h.present], h.future, true) }); };
exports.undo = undo;
var redo = function (h) { return (h.future.length === 0 ? h : { past: __spreadArray(__spreadArray([], h.past, true), [h.present], false), present: h.future[0], future: h.future.slice(1) }); };
exports.redo = redo;
