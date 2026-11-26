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
exports.unblockTaskUseCase = void 0;
// Clears what blocks a task: its waits and its reason.
var unblockTaskUseCase = function (d, taskId) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === taskId ? __assign(__assign({}, t), { blockedBy: [], blockedReason: null }) : t); }) })); });
};
exports.unblockTaskUseCase = unblockTaskUseCase;
