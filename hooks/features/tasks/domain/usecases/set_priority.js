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
exports.setPriorityUseCase = void 0;
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var setPriorityUseCase = function (d, taskId, priority) {
    return d.records.update(function (r) { return (__assign(__assign({}, r), { tasks: (0, queue_rules_1.setPriority)(r.tasks, taskId, priority) })); });
};
exports.setPriorityUseCase = setPriorityUseCase;
