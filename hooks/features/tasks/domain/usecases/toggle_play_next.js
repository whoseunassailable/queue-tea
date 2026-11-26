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
exports.togglePlayNextUseCase = void 0;
// Marks a queued task to be suggested before every other, or takes the mark
// off it.
var togglePlayNextUseCase = function (d, taskId) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { playNext: r.playNext === taskId ? null : taskId })); });
};
exports.togglePlayNextUseCase = togglePlayNextUseCase;
