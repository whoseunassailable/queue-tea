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
exports.removeTaskUseCase = void 0;
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
// Removes a queued task. The tasks under it are then on their own, and it is
// no longer the active feature.
var removeTaskUseCase = function (d, taskId) {
    return d.records.update(function (r) {
        var tasks = (0, queue_rules_1.removeTask)(r.tasks, taskId);
        return tasks === r.tasks ? r : __assign(__assign({}, r), { feature: r.feature === taskId ? null : r.feature, tasks: tasks });
    });
};
exports.removeTaskUseCase = removeTaskUseCase;
