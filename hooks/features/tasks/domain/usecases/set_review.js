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
exports.setReviewUseCase = void 0;
// Marks the current task as waiting for Rohan's answer, or clears the mark.
var setReviewUseCase = function (d, taskId, review) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === taskId ? __assign(__assign({}, t), { review: review }) : t); }) })); });
};
exports.setReviewUseCase = setReviewUseCase;
