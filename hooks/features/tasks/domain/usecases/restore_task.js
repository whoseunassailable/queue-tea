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
exports.restoreTaskUseCase = void 0;
// Undoes a removal. Only a plain task has an Undo: removing a feature asks
// first, because the tasks under it are set free.
var restoreTaskUseCase = function (d, taskId) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === taskId && t.state === 'removed' ? __assign(__assign({}, t), { state: 'queued' }) : t); }) })); });
};
exports.restoreTaskUseCase = restoreTaskUseCase;
