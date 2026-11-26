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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTaskUseCase = void 0;
var helpers_1 = require("../../../../shared/records/domain/services/helpers");
var edited = function (t, edit) { return (__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, t), (edit.title === undefined ? {} : { title: edit.title })), (edit.description === undefined ? {} : { description: edit.description })), (edit.criteria === undefined ? {} : { criteria: edit.criteria })), (edit.difficulty === undefined ? {} : { difficulty: __assign(__assign({}, t.difficulty), { expected: edit.difficulty }) })), (edit.helpers === undefined ? {} : { helpers: __assign(__assign({}, t.helpers), { on: (0, helpers_1.onlyHelpers)(edit.helpers) }) })), (edit.testProfile === undefined || edit.testProfile === null ? {} : { testProfile: { id: edit.testProfile, by: 'rohan' } })), (edit.due === undefined || edit.due === null ? {} : { due: edit.due }))); };
var withoutProfile = function (_a) {
    var _cleared = _a.testProfile, t = __rest(_a, ["testProfile"]);
    return t;
};
var withoutDue = function (_a) {
    var _cleared = _a.due, t = __rest(_a, ["due"]);
    return t;
};
// A null clears the field, so the task reads as one saved before it existed.
var cleared = function (t, edit) {
    var kept = edit.testProfile === null ? withoutProfile(t) : t;
    return edit.due === null ? withoutDue(kept) : kept;
};
// Changes what a task says about itself. A finished task keeps what it said.
var editTaskUseCase = function (d, taskId, edit) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === taskId && (t.state === 'queued' || t.state === 'current') ? edited(cleared(t, edit), edit) : t); }) })); });
};
exports.editTaskUseCase = editTaskUseCase;
