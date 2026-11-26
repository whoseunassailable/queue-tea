"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusText = void 0;
var time_1 = require("../../../../shared/time/domain/services/time");
var statusText = function (task, minutes, allowance, isChecking) {
    if (isChecking)
        return 'Queue-tea: checking your message…';
    if (task === null)
        return undefined;
    var used = allowance === null ? '' : " \u00B7 5h ".concat(Math.round(allowance.percent), "%");
    return "Queue-tea: ".concat(task.title, " \u00B7 ").concat((0, time_1.formatMinutes)(minutes)).concat(used);
};
exports.statusText = statusText;
