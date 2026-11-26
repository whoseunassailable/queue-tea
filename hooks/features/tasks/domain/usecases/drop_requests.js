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
exports.dropRequestsUseCase = void 0;
// Takes back what a session was asked to do for this task, before it acts.
var dropRequestsUseCase = function (d, taskId) {
    return d.records.update(function (r) { return (r.requests.some(function (q) { return q.taskId === taskId; }) ? __assign(__assign({}, r), { requests: r.requests.filter(function (q) { return q.taskId !== taskId; }) }) : r); });
};
exports.dropRequestsUseCase = dropRequestsUseCase;
