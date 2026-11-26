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
exports.markRemindedUseCase = exports.noteHelperUseCase = void 0;
// Adds the helper to the current task's `ran`, once.
var noteHelperUseCase = function (d, taskId, helper) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) {
            return t.id === taskId && t.state === 'current' && !t.helpers.ran.includes(helper)
                ? __assign(__assign({}, t), { helpers: __assign(__assign({}, t.helpers), { ran: __spreadArray(__spreadArray([], t.helpers.ran, true), [helper], false) }) }) : t;
        }) })); });
};
exports.noteHelperUseCase = noteHelperUseCase;
// Claude has been reminded once for this task.
var markRemindedUseCase = function (d, taskId) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === taskId ? __assign(__assign({}, t), { helpers: __assign(__assign({}, t.helpers), { reminded: true }) }) : t); }) })); });
};
exports.markRemindedUseCase = markRemindedUseCase;
